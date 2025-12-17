import debuggers from '../debug';
import {
  Plugin,
  PluginContext,
  InitOptions,
  InitState,
  InitConfig,
  PluginSettingsBase,
  EnvironmentHandlers,
} from './models';
import { InitErrorMessages } from './errors';
import { createGroupContext } from './create-group';

const initDebug = debuggers.common;

/**
 * Internal state for the SDK initialization.
 * Shared across packages via getInitState().
 */
let state: InitState = createInitialState();

/**
 * Creates a fresh initial state object.
 * @internal
 */
function createInitialState(): InitState {
  return {
    initialized: false,
    initializing: false,
    config: null,
    environment: {},
    plugins: new Map(),
    deferredInitPromises: new Map(),
    readyPromise: null,
    groups: new Map(),
    initializedGroups: new Set(),
    deferredGroupInitPromises: new Map(),
  };
}

/**
 * Validates the core configuration.
 * Runs once during initialization.
 * @internal
 */
function validateCoreConfig(config: InitConfig): void {
  // Validate that context ID is provided
  if (!config.sitecoreContextId) {
    throw new Error(InitErrorMessages.INIT_010);
  }

  // Validate Edge URL format if provided
  if (config.sitecoreEdgeUrl) {
    try {
      new URL(config.sitecoreEdgeUrl);
    } catch {
      throw new Error(InitErrorMessages.INIT_009);
    }
  }
}

/**
 * Creates the plugin context passed to plugins.
 * @internal
 */
function createPluginContext(config: InitConfig): PluginContext {
  return {
    config,
    environment: state.environment,
    getPlugin: <T = unknown>(name: string) => getPlugin<T>(name),
    isReady: () => state.initialized,
    ready: async () => {
      if (state.readyPromise) {
        await state.readyPromise;
      }
    },
  };
}

/**
 * Validates plugin dependencies.
 * Ensures all required plugins are registered before init runs.
 * @internal
 */
function validatePluginDependencies(plugin: Plugin): void {
  if (!plugin.dependencies?.length) return;

  for (const dep of plugin.dependencies) {
    const depPlugin = state.plugins.get(dep.name);
    if (!depPlugin) {
      throw new Error(InitErrorMessages.INIT_004(plugin.name, dep.name));
    }
  }
}

/**
 * Runs validation for all plugins.
 * @internal
 */
function validatePlugins(context: PluginContext): void {
  for (const [name, plugin] of state.plugins) {
    // Validate dependencies first
    validatePluginDependencies(plugin, context);

    // Run plugin-specific validation
    if (plugin.validate) {
      try {
        plugin.validate(context);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(InitErrorMessages.INIT_005(name, message));
      }
    }
  }
}

/**
 * Registers groups from plugins.
 * Groups use their defaultSettings as defined in defineGroup().
 * @internal
 */
function registerGroups(): void {
  // Collect unique groups from all plugins
  for (const [, plugin] of state.plugins) {
    if (plugin.groups) {
      for (const group of plugin.groups) {
        if (!state.groups.has(group.name)) {
          state.groups.set(group.name, {
            definition: group,
            settings: { ...group.defaultSettings },
          });
          initDebug('Registered group: %s with settings: %O', group.name, group.defaultSettings);
        }
      }
    }
  }
}

/**
 * Validates all registered groups.
 * @internal
 */
function validateGroups(config: InitConfig): void {
  for (const [name, { definition, settings }] of state.groups) {
    if (definition.validate) {
      const groupContext = createGroupContext(
        config,
        state.environment,
        settings,
        () => state.initialized,
        async () => {
          if (state.readyPromise) await state.readyPromise;
        }
      );

      try {
        definition.validate(groupContext);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(InitErrorMessages.INIT_013(name, message));
      }
    }
  }
}

/**
 * Runs init functions for all registered groups.
 * @internal
 */
async function initializeGroups(config: InitConfig): Promise<void> {
  const initPromises: Promise<void>[] = [];

  for (const [name, { definition, settings }] of state.groups) {
    if (definition.init && !state.initializedGroups.has(name)) {
      const groupContext = createGroupContext(
        config,
        state.environment,
        settings,
        () => state.initialized,
        async () => {
          if (state.readyPromise) await state.readyPromise;
        }
      );

      initDebug('Initializing group: %s', name);

      try {
        const result = definition.init(groupContext);
        if (result instanceof Promise) {
          initPromises.push(
            result.then(() => {
              state.initializedGroups.add(name);
            })
          );
        } else {
          state.initializedGroups.add(name);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(InitErrorMessages.INIT_014(name, message));
      }
    }
  }

  await Promise.all(initPromises);
}

/**
 * Triggers deferred initialization for a specific group.
 * @internal
 */
async function triggerGroupDeferredInit(groupName: string): Promise<void> {
  // Check if already triggered
  const existingPromise = state.deferredGroupInitPromises.get(groupName);
  if (existingPromise) {
    return existingPromise;
  }

  const groupEntry = state.groups.get(groupName);
  if (!groupEntry || !groupEntry.definition.deferredInit) {
    return;
  }

  const { definition, settings } = groupEntry;
  const groupContext = createGroupContext(
    state.config!,
    state.environment,
    settings,
    () => state.initialized,
    async () => {
      if (state.readyPromise) await state.readyPromise;
    }
  );

  initDebug('Running deferred init for group: %s', groupName);

  const promise = (async () => {
    try {
      await Promise.resolve(definition.deferredInit!(groupContext));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(InitErrorMessages.INIT_015(groupName, message));
    }
  })();

  state.deferredGroupInitPromises.set(groupName, promise);
  return promise;
}

/**
 * Runs init functions for all plugins.
 * @internal
 */
async function initializePlugins(context: PluginContext): Promise<void> {
  const initPromises: Promise<void>[] = [];

  for (const [name, plugin] of state.plugins) {
    if (plugin.init) {
      initDebug('Initializing plugin: %s', name);
      const result = plugin.init(context);
      if (result instanceof Promise) {
        initPromises.push(result);
      }
    }
  }

  await Promise.all(initPromises);
}

/**
 * Runs onRequest hooks for all plugins.
 * Called on every init call after the first initialization.
 * @internal
 */
async function runOnRequestHooks(context: PluginContext): Promise<void> {
  const hookPromises: Promise<void>[] = [];

  for (const [name, plugin] of state.plugins) {
    if (plugin.onRequest) {
      initDebug('Running onRequest hook for: %s', name);
      const result = plugin.onRequest(context);
      if (result instanceof Promise) {
        hookPromises.push(result);
      }
    }
  }

  await Promise.all(hookPromises);
}

/**
 * Initializes the Sitecore SDK with the provided configuration and plugins.
 *
 * This function:
 * 1. Validates the core configuration (runs once on first call)
 * 2. Registers and validates all plugins (runs once on first call)
 * 3. Checks plugin dependencies (runs once on first call)
 * 4. Runs plugin initialization (runs once on first call)
 * 5. Stores validated state for sharing across packages
 * 6. On subsequent calls: updates environment and runs onRequest hooks
 *
 * For server-side usage (middleware, etc.), this function is optimized to skip
 * re-validation on subsequent calls, only updating the environment handlers
 * and running plugin onRequest hooks for per-request logic.
 *
 * @example
 * ```typescript
 * import { initSitecore } from '@sitecore-content-sdk/core/init';
 * import { defineConfig } from '@sitecore-content-sdk/core/config';
 * import { eventsPlugin } from '@sitecore-content-sdk/events';
 *
 * const config = defineConfig({
 *   api: {
 *     edge: { contextId: 'your-context-id' }
 *   },
 *   defaultSite: 'my-site'
 * });
 *
 * await initSitecore({
 *   config,
 *   plugins: [eventsPlugin()]
 * });
 * ```
 *
 * @param options - Named initialization options
 * @returns Promise that resolves when initialization is complete
 * @throws Error if configuration is invalid or plugin validation fails
 * @public
 */
export async function initSitecore(options: InitOptions): Promise<void> {
  const { config, plugins = [], environment = {} } = options;

  // Validate input
  if (!config) {
    throw new Error(InitErrorMessages.INIT_001);
  }

  // If already initialized, update environment and run onRequest hooks only
  if (state.initialized) {
    initDebug('SDK already initialized, updating environment and running onRequest hooks');

    // Merge environment handlers for this request (preserve pre-existing handlers)
    state.environment = { ...state.environment, ...environment };

    // Create fresh context with new environment
    const context = createPluginContext(state.config!);

    // Run onRequest hooks for per-request logic
    await runOnRequestHooks(context);

    return;
  }

  // Check if initialization is in progress (concurrent calls)
  if (state.initializing) {
    initDebug('SDK initialization in progress, waiting...');
    if (state.readyPromise) {
      await state.readyPromise;
      // After waiting, run onRequest hooks with merged environment
      state.environment = { ...state.environment, ...environment };
      const context = createPluginContext(state.config!);
      await runOnRequestHooks(context);
    }
    return;
  }

  state.initializing = true;
  // Merge environment (preserve any pre-existing handlers set via updateEnvironment)
  state.environment = { ...state.environment, ...environment };

  initDebug('Initializing SDK');

  try {
    // Step 1: Validate core configuration (runs once)
    validateCoreConfig(config);
    state.config = config;

    // Step 2: Register plugins
    for (const plugin of plugins) {
      if (state.plugins.has(plugin.name)) {
        throw new Error(InitErrorMessages.INIT_006(plugin.name));
      }
      state.plugins.set(plugin.name, plugin);
      initDebug('Registered plugin: %s', plugin.name);
    }

    // Step 3: Register and validate groups (collects from plugins)
    registerGroups();
    validateGroups(config);

    // Step 4: Create context and validate plugins
    const context = createPluginContext(config);
    validatePlugins(context);

    // Step 5: Initialize groups first, then plugins
    await initializeGroups(config);
    state.readyPromise = initializePlugins(context);
    await state.readyPromise;

    // Mark as initialized
    state.initialized = true;
    state.initializing = false;

    initDebug('SDK initialization complete');

    if (!plugins.length) {
      initDebug('SDK initialized with no plugins');
    }
  } catch (error) {
    state.initializing = false;
    state.readyPromise = null;
    throw error;
  }
}

/**
 * Gets the current initialization state.
 * Used by other packages to access shared configuration and plugins.
 *
 * @returns The current initialization state
 * @throws Error if not initialized
 * @public
 */
export function getInitState(): Readonly<InitState> {
  if (!state.initialized && !state.initializing) {
    throw new Error(InitErrorMessages.INIT_003);
  }
  return state;
}

/**
 * Checks if the SDK has been initialized.
 *
 * @returns true if initialized, false otherwise
 * @public
 */
export function isInitialized(): boolean {
  return state.initialized;
}

/**
 * Gets a group's resolved settings by name.
 *
 * @param groupName - The group name to retrieve settings for
 * @returns The resolved settings or undefined if group not found
 * @public
 */
export function getGroupSettings<TSettings = unknown>(groupName: string): TSettings | undefined {
  const groupEntry = state.groups.get(groupName);
  return groupEntry?.settings as TSettings | undefined;
}

/**
 * Updates the settings for a specific group after initialization.
 * This merges the provided settings with existing settings.
 *
 * @example
 * ```typescript
 * // Update tracking group settings
 * updateGroupSettings('tracking', {
 *   browserIdCookieName: 'my_custom_bid',
 * });
 * ```
 *
 * @param groupName - The name of the group to update
 * @param settings - Partial settings to merge with existing settings
 * @throws Error if the SDK is not initialized or the group is not registered
 * @public
 */
export function updateGroupSettings<TSettings = unknown>(
  groupName: string,
  settings: Partial<TSettings>
): void {
  if (!state.initialized) {
    throw new Error(InitErrorMessages.INIT_003);
  }

  const groupEntry = state.groups.get(groupName);
  if (!groupEntry) {
    throw new Error(InitErrorMessages.INIT_016(groupName));
  }

  // Merge new settings with existing settings
  groupEntry.settings = {
    ...(groupEntry.settings as TSettings),
    ...settings,
  };

  initDebug('Updated settings for group: %s, new settings: %O', groupName, groupEntry.settings);
}

/**
 * Gets an enabled plugin by name.
 *
 * @param name - The plugin name to retrieve
 * @returns The plugin if found, undefined otherwise
 * @public
 */
export function getPlugin<T = unknown>(name: string): Plugin<T> | undefined {
  return state.plugins.get(name) as Plugin<T> | undefined;
}

/**
 * Triggers deferred initialization for one or more plugins.
 * Called automatically when plugin functionality is first accessed,
 * but can also be called manually to pre-initialize plugins.
 *
 * Ensures deferred init only runs once per plugin (idempotent).
 *
 * @param plugins - Plugin name(s) to initialize:
 *   - `string`: Single plugin name
 *   - `string[]`: Array of plugin names
 *   - `"*"`: All registered plugins with deferredInit
 * @returns Promise that resolves when all specified deferred inits are complete
 *
 * @example
 * ```typescript
 * // Single plugin
 * await triggerDeferredInit('@sitecore-content-sdk/events');
 *
 * // Multiple plugins
 * await triggerDeferredInit(['@sitecore-content-sdk/events', '@sitecore-content-sdk/personalize']);
 *
 * // All plugins with deferredInit
 * await triggerDeferredInit('*');
 * ```
 *
 * @public
 */
export async function triggerDeferredInit(plugins: string | string[] | '*'): Promise<void> {
  // Resolve plugin names based on input type
  let pluginNames: string[];

  if (plugins === '*') {
    // Wildcard - get all ENABLED plugins with deferredInit
    pluginNames = [];
    for (const [name, plugin] of state.plugins) {
      if (plugin.deferredInit && isPluginEnabled(name)) {
        pluginNames.push(name);
      }
    }
  } else if (Array.isArray(plugins)) {
    pluginNames = plugins;
  } else {
    pluginNames = [plugins];
  }

  // Process each plugin
  const promises = pluginNames.map(async (pluginName) => {
    // Check if already triggered
    const existingPromise = state.deferredInitPromises.get(pluginName);
    if (existingPromise) {
      return existingPromise;
    }

    const plugin = state.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(InitErrorMessages.INIT_011(pluginName));
    }

    if (!plugin.deferredInit) {
      throw new Error(InitErrorMessages.INIT_012(pluginName));
    }

    // Skip disabled plugins (for explicit plugin name calls, just skip silently)
    if (!isPluginEnabled(pluginName)) {
      initDebug('Skipping deferred init for disabled plugin: %s', pluginName);
      return;
    }

    // Trigger group deferred inits first (if any)
    if (plugin.groups) {
      for (const group of plugin.groups) {
        await triggerGroupDeferredInit(group.name);
      }
    }

    const context = createPluginContext(state.config!);

    initDebug('Running deferred init for: %s', pluginName);

    const promise = Promise.resolve(plugin.deferredInit(context));
    state.deferredInitPromises.set(pluginName, promise);

    return promise;
  });

  await Promise.all(promises);
}

/**
 * Updates the settings for a specific plugin after initialization.
 * This is useful for dynamically enabling/disabling plugins based on user actions,
 * such as cookie consent.
 *
 * When a plugin is enabled (either by setting `enabled: true` or by not having
 * `enabled: false`), this function will automatically trigger the plugin's
 * deferred init if it hasn't run yet. This ensures that enabling a plugin
 * after cookie consent properly initializes the plugin.
 *
 * @example
 * ```typescript
 * // After user accepts cookies - triggers deferred init automatically
 * await updatePluginSettings('@sitecore-content-sdk/events', {
 *   enabled: true,
 * });
 *
 * // To disable a plugin
 * await updatePluginSettings('@sitecore-content-sdk/events', {
 *   enabled: false,
 * });
 *
 * // Update multiple settings at once
 * await updatePluginSettings('@sitecore-content-sdk/events', {
 *   enabled: true,
 *   debug: true,
 * });
 * ```
 *
 * @param pluginName - The name of the plugin to update
 * @param settings - Partial settings to merge with existing settings
 * @returns Promise that resolves when settings are updated and deferred init is complete (if triggered)
 * @throws Error if the SDK is not initialized or the plugin is not registered
 * @public
 */
export async function updatePluginSettings<
  TSettings extends PluginSettingsBase = PluginSettingsBase
>(pluginName: string, settings: Partial<TSettings>): Promise<void> {
  if (!state.initialized) {
    throw new Error(InitErrorMessages.INIT_003);
  }

  const plugin = state.plugins.get(pluginName);
  if (!plugin) {
    throw new Error(InitErrorMessages.INIT_011(pluginName));
  }

  // Check if plugin was disabled before the update
  const wasDisabled = (plugin.settings as PluginSettingsBase | undefined)?.enabled === false;

  // Merge new settings with existing settings
  plugin.settings = {
    ...(plugin.settings as TSettings),
    ...settings,
  };

  initDebug('Updated settings for plugin: %s, new settings: %O', pluginName, plugin.settings);

  // Check if plugin is now enabled
  const isNowEnabled = (plugin.settings as PluginSettingsBase | undefined)?.enabled !== false;

  // If plugin was disabled and is now enabled, and has deferredInit that hasn't run yet,
  // trigger it now
  if (wasDisabled && isNowEnabled && plugin.deferredInit) {
    const hasRun = state.deferredInitPromises.has(pluginName);
    if (!hasRun) {
      initDebug('Plugin %s was enabled, triggering deferred init', pluginName);
      await triggerDeferredInit(pluginName);
    }
  }
}

/**
 * Checks if a plugin is enabled.
 * A plugin is considered enabled if:
 * - It exists and has no `enabled` setting (defaults to true)
 * - It exists and has `enabled: true`
 *
 * @param pluginName - The name of the plugin to check
 * @returns true if the plugin is enabled, false otherwise
 * @public
 */
export function isPluginEnabled(pluginName: string): boolean {
  const plugin = state.plugins.get(pluginName);
  if (!plugin) {
    return false;
  }

  // Default to enabled if not explicitly set
  const settings = plugin.settings as PluginSettingsBase | undefined;
  return settings?.enabled !== false;
}

/**
 * Updates the environment handlers for the SDK.
 *
 * This function allows you to set or update environment handlers after initialization.
 * This is useful in scenarios where environment handlers are not available at init time,
 * such as in Next.js middleware where you initialize outside the middleware function
 * but need to add environment handlers inside it.
 *
 * By default, this function will also trigger all deferred inits after updating the environment,
 * since deferred inits typically depend on environment handlers being available.
 *
 * @example
 * ```typescript
 * // Initialize SDK outside middleware (without environment)
 * initSitecore({
 *   config: { sitecoreContextId: 'your-context-id' },
 *   plugins: [eventsPlugin(), personalizePlugin()],
 * });
 *
 * // middleware.ts
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next();
 *
 *   // Update environment inside middleware where request/response are available
 *   // This will automatically trigger deferred inits
 *   await updateEnvironment(createNextJsMiddlewareEnvironment(request, response));
 *
 *   return response;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Update environment without triggering deferred inits
 * await updateEnvironment({
 *   getCookie: (name) => request.cookies.get(name)?.value,
 * }, { triggerDeferredInit: false });
 * ```
 *
 * @param environment - Environment handlers to set or merge with existing handlers
 * @param options - Optional configuration
 * @param options.merge - If true, merges with existing handlers (default: true). If false, replaces all handlers.
 * @param options.triggerDeferredInit - If true, triggers all deferred inits after updating environment (default: true).
 * @returns Promise that resolves when environment is updated and deferred inits are complete (if triggered)
 * @public
 */
export async function updateEnvironment(
  environment: EnvironmentHandlers,
  options: { merge?: boolean; triggerDeferredInit?: boolean } = {}
): Promise<void> {
  const { merge = true, triggerDeferredInit: shouldTriggerDeferredInit = true } = options;

  if (merge) {
    // Merge new handlers with existing ones (new handlers take precedence)
    state.environment = {
      ...state.environment,
      ...environment,
    };
  } else {
    // Replace all handlers
    state.environment = environment;
  }

  initDebug('Updated environment handlers: %O', Object.keys(state.environment));

  // Trigger all deferred inits if enabled and SDK is initialized
  if (shouldTriggerDeferredInit && state.initialized) {
    initDebug('Triggering deferred inits after environment update');
    await triggerDeferredInit('*');
  }
}

/**
 * Resets the initialization state.
 * Primarily used for testing purposes.
 *
 * @internal
 */
export function resetInitState(): void {
  state = createInitialState();
  initDebug('SDK state reset');
}


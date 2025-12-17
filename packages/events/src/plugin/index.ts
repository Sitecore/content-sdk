/**
 * Events plugin for Sitecore Content SDK
 *
 * Use the environment-specific plugins:
 * - `eventsPluginBrowser` - For browser/client-side usage
 * - `eventsPluginServer` - For server-side/middleware usage
 *
 * @packageDocumentation
 */

// Browser plugin
export { eventsPluginBrowser } from './events-plugin-browser';

// Server plugin
export { eventsPluginServer } from './events-plugin-server';

// Shared types and utilities
export type { EventsPluginSettings } from './events-plugin-base';
export { getBrowserId, updateEventsSettings, isEventsEnabled } from './events-plugin-base';


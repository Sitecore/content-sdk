import fs from 'fs';
import path from 'path';
import { ComponentMapEntry, ComponentSource, ComponentGroup } from './components';

/**
 * Settings for @var getItems function
 */
export type GetItemsSettings<Item> = {
  /**
   * items path
   */
  path: string;
  /**
   * Resolve item in required data format
   */
  resolveItem: (path: string, name: string) => Item;
  /**
   * Will be called when new file is found
   */
  cb?: (name: string) => void;

  exclude?: string[];
  /**
   * Matches specific files format
   */
  fileFormat?: RegExp;
  /**
   * Wether to search recursively
   */
  recursive?: boolean;
};

/**
 * Compares two paths to determine if they match.
 * @param {string} itemPath base path to compare against, can be absolute or relative
 * @param {string} compare comparer, can be relate, absolute or regex string
 * @returns true if paths match, false otherwise
 */
export const matchPath = (itemPath: string, compare: string): boolean => {
  if (
    compare === itemPath ||
    path.join(process.cwd(), itemPath) === compare ||
    itemPath === path.join(process.cwd(), compare) ||
    new RegExp(compare).test(itemPath)
  ) {
    return true;
  }
  return false;
};

/**
 * Using @var path find all files and generate output using @var resolveItem function for each file
 * Can be used to generate list of components, templates, etc.
 * @param {GetItemsSettings} settings
 * @returns {Item[]} list of items
 */
export function getItems<Item>(settings: GetItemsSettings<Item>): Item[] {
  const {
    recursive = true,
    path,
    resolveItem,
    cb,
    fileFormat = new RegExp(/(.+)(?<!\.d)\.[jt]sx?$/),
    exclude,
  } = settings;
  const items: Item[] = [];
  const folders: fs.Dirent[] = [];

  if (!fs.existsSync(path)) return [];
  if (exclude) {
    for (const exclusion of exclude) {
      if (matchPath(path, exclusion)) return [];
    }
  }

  fs.readdirSync(path, { withFileTypes: true }).forEach((item) => {
    if (item.isDirectory()) {
      folders.push(item);
    }

    if (fileFormat.test(item.name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const name = item.name.match(fileFormat)![1];
      items.push(resolveItem(path, name));
      cb && cb(name);
    }
  });

  for (const folder of folders) {
    recursive
      ? items.push(
          ...getItems<Item>({
            path: `${path}/${folder.name}`,
            resolveItem,
            cb,
            fileFormat,
          })
        )
      : items.push(resolveItem(`${path}/${folder.name}`, folder.name));
  }

  return items;
}

// ---- Low-level grouping (returns raw groups, NOT entries)

/**
 * Converts a given path to POSIX format by replacing backslashes with forward slashes.
 * @param p
 */
function toPosix(p: string) {
  return p.replace(/\\/g, '/');
}

/**
 * Groups components by directory and base component name (prefix).
 * For example, "Teaser" and "Teaser.Variant1" in the same folder are grouped together.
 * @param {ComponentSource[]} files list of components
 * @returns {ComponentGroup[]} list of groups
 */
export function groupComponentsByDirAndPrefix<T extends ComponentSource>(
  files: T[]
): ComponentGroup<T>[] {
  const groupsByKey = new Map<string, ComponentGroup<T>>();

  const getBaseComponentName = (componentName: string) => {
    const dotIndex = componentName.indexOf('.');
    return dotIndex === -1 ? componentName : componentName.slice(0, dotIndex);
  };

  for (const file of files) {
    const posixPath = toPosix(file.filePath);
    const directory = path.posix.dirname(posixPath);
    const prefix = getBaseComponentName(file.componentName);
    const compositeKey = `${directory}::${prefix}`;

    let group = groupsByKey.get(compositeKey);
    if (!group) {
      group = { dir: directory, prefix, neighbors: [] };
      groupsByKey.set(compositeKey, group);
    }

    if (file.componentName === prefix) {
      group.base = file;
    } else {
      group.neighbors.push(file);
    }
  }

  const componentGroups = Array.from(groupsByKey.values());

  return componentGroups;
}

/**
 * Produces entries where each base component key aggregates its variants via object spread.
 * @param {ComponentSource[]} components list of components
 * @returns {ComponentMapEntry[]} list of map entries
 */
export function groupComponentsWithVariants(components: ComponentSource[]): ComponentMapEntry[] {
  const groups = groupComponentsByDirAndPrefix(components);
  const entries: ComponentMapEntry[] = [];

  for (const group of groups) {
    const imports: string[] = [];
    const spreads: string[] = [];

    for (const neighbor of group.neighbors) {
      imports.push(`import * as ${neighbor.moduleName} from '${neighbor.importPath}';`);
      spreads.push(`...${neighbor.moduleName}`);
    }

    if (group.base) {
      imports.push(`import * as ${group.base.moduleName} from '${group.base.importPath}';`);
      spreads.push(`...${group.base.moduleName}`);
    }

    const annotateClient =
      !!group.base && 'componentType' in group.base && group.base.componentType === 'client';

    entries.push({
      key: group.prefix,
      imports,
      annotateClient,
      valueExpr: `{ ${spreads.join(', ')} }`,
    });
  }

  return entries;
}

/**
 * Produces one entry per component (no grouping/variant folding).
 * @param {ComponentSource[]} components list of components
 * @returns {ComponentMapEntry[]} list of map entries
 */
export function groupComponentsWithoutVariants(components: ComponentSource[]): ComponentMapEntry[] {
  return components.map((component) => ({
    key: component.moduleName,
    imports: [`import * as ${component.moduleName} from '${component.importPath}';`],
    annotateClient: 'componentType' in component && component.componentType === 'client',
    valueExpr: component.moduleName,
  }));
}

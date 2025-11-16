import fs from 'fs';
import path from 'path';

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
 * @public
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

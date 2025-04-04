import path from 'path';
import { openJsonFile, writeJsonFile } from '../../common';

export const removeDevDependencies = (projectPath: string) => {
  // remove `next-transpile-modules` dependency
  const packagePath = path.join(projectPath, 'package.json');
  const pkg = openJsonFile(packagePath);
  if (pkg?.devDependencies['next-transpile-modules']) {
    delete pkg.devDependencies['next-transpile-modules'];
    writeJsonFile(pkg, packagePath);
  }
};

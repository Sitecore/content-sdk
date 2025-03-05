import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import { ScaffoldTemplate } from '../config';

/**
 * Force to use `crlf` line endings, we are using `crlf` across the project.
 * Replace: `lf` (\n), `cr` (\r)
 * @param {string} content
 */
export function editLineEndings(content: string) {
  return content.replace(/\r|\n/gm, '\r\n');
}

/**
 * Creates a file relative to the specified path if the file doesn't exist.
 * Creates directories as needed.
 * Does not overwrite existing files.
 * @param {string} filePath - the file path
 * @param {string} fileContent - the file content
 * @returns {string} the file path if the file was created, otherwise null
 */
export function scaffoldFile(filePath: string, fileContent: string): string | null {
  const outputDir = path.dirname(filePath);

  if (fs.existsSync(filePath)) {
    console.log(chalk.red(`Skipping creating ${filePath}; already exists.`));
    return null;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(filePath, editLineEndings(fileContent), 'utf8');
  console.log(chalk.green(`File ${filePath} has been scaffolded.`));

  return filePath;
}

/**
 * Scaffolds a new component based on the provided template.
 * @param {string} outputFilePath - The file path where the component will be created.
 * @param {string} componentName - The name of the component to be created.
 * @param {string} templateNameArg - The name of the template to use for scaffolding. If not provided, defaults to 'byoc' if `byoc` is true, otherwise 'default'.
 * @param {ScaffoldTemplate[]} templates - An array of template objects, each containing a name, a template function, and a getNextSteps function.
 * @param {boolean} byoc - A boolean flag indicating whether to use the 'byoc' template.
 * @throws Will throw an error if the specified template is not found.
 */
export function scaffoldComponent(
  outputFilePath: string,
  componentName: string,
  templateNameArg: string | undefined,
  templates: ScaffoldTemplate[],
  byoc: boolean
): void {
  const templateName = templateNameArg ?? (byoc ? 'byoc' : 'default');
  const template = templates.filter((t) => t.name === templateName)[0];

  if (!template) {
    throw `Template ${templateName} not found.`;
  }

  const componentOutputPath = scaffoldFile(
    outputFilePath,
    template.generateTemplate(componentName)
  );

  if (componentOutputPath) {
    const nextSteps: string[] = [];
    nextSteps.push(
      chalk.green(`
    Scaffolding of ${componentName} complete.
    Next steps:`),
      ...(template.getNextSteps ? template.getNextSteps(componentOutputPath) : [])
    );

    console.log(nextSteps.join('\n'));
  }
}

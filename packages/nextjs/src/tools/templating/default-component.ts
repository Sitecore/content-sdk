import chalk from 'chalk';
import { ScaffoldTemplate, ComponentTemplateType } from '@sitecore-content-sdk/core/config';
import { COMPONENT_FILE_EXTENSION } from './constants';

/**
 * Next.js component boilerplate
 * @param {string} componentName - the component name
 * @returns component generated template
 */
const generateTemplate = (componentName: string): string => {
  return `import React from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface ${componentName}Props {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: ${componentName}Props): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={\`component \${props.params.styles}\`} id={id ? id : undefined}>
      <div className="component-content">
        <p>${componentName} Component</p>
      </div>
    </div>
  );
};
`;
};

/**
 * Generates a list of next steps when scaffolding a component.
 * @param {string} componentOutputPath - The file path where the component file is generated.
 * @returns {string[]} An array of strings, each representing a next step.
 */
const getNextSteps = (componentOutputPath: string): string[] => {
  const nextSteps = [];

  if (componentOutputPath) {
    nextSteps.push(`* Implement the React component in ${chalk.green(componentOutputPath)}`);
  }

  return nextSteps;
};

export const defaultTemplate: ScaffoldTemplate = {
  name: ComponentTemplateType.DEFAULT,
  fileExtension: COMPONENT_FILE_EXTENSION,
  generateTemplate,
  getNextSteps,
};

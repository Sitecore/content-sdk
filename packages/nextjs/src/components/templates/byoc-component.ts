/**
 * Generates React boilerplate for a component under `src/components`
 * @param {string} componentName - the component name
 * @returns component src boilerplate as a string
 */
export const generateTemplate = (componentName: string): string => {
  return `import React from 'react';
import * as FEAAS from '@sitecore-feaas/clientside/react';

interface ${componentName}Props {
  title: string;
  columnsCount: number;
}

export const ${componentName} = (props: ${componentName}Props): JSX.Element => {
  const columns: string[] = [];
  for (let i = 0; i < props.columnsCount; i++) {
    columns.push(\`Component Column \${i + 1}\`);
  }
  return (
    <div className="container">
      <h2>{props.title || 'BYOC Demo'}</h2>
      <p>${componentName} Component</p>
      <div className="row">
        {columns.map((text, index) => (
          <div key={index} className={\`col-sm-\${props.columnsCount}\`}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

FEAAS.External.registerComponent(${componentName}, {
  name: '${componentName}',
  properties: {
    title: {
      type: 'string',
    },
    columnsCount: {
      type: 'number',
    },
  },
});
`;
};

/**
 * Generates a list of next steps when scaffolding a component.
 * @param {string} componentOutputPath - The file path where the component file is generated.
 * @returns {string[]} An array of strings, each representing a next step.
 */
export const getNextSteps = (componentOutputPath: string): string[] => {
  const nextSteps = [];

  nextSteps.push(
    '* Modify component registration through FEAAS.External.registerComponent if needed'
  );
  if (!(componentOutputPath as string).includes('src\\components')) {
    nextSteps.push(
      '* Ensure component availability by importing it in your app through src\\byoc or registering it properly'
    );
  }

  return nextSteps;
};

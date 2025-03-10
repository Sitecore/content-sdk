import { expect } from 'chai';
import { generateTemplate, getNextSteps } from './byoc-component';
import chalk from 'chalk';

describe('byoc-component', () => {
  describe('generateTemplate', () => {
    it('should generate a template with the given component name', () => {
      const componentName = 'TestComponent';
      const template = generateTemplate(componentName);
      expect(template).to.include(`interface ${componentName}Props`);
      expect(template).to.include(`<p>${componentName} Component</p>`);
      expect(template).to.include(`FEAAS.External.registerComponent(${componentName}`);
    });
  });

  describe('getNextSteps', () => {
    it('should return an array with a step to modify component registration', () => {
      const nextSteps = getNextSteps('');
      expect(nextSteps)
        .to.be.an('array')
        .that.includes(
          '* Modify component registration through FEAAS.External.registerComponent if needed'
        );
    });

    it('should return an array with next steps if componentOutputPath is provided', () => {
      const componentOutputPath = 'src/components/TestComponent.tsx';
      const nextSteps = getNextSteps(componentOutputPath);
      expect(nextSteps)
        .to.be.an('array')
        .that.includes(
          '* Modify component registration through FEAAS.External.registerComponent if needed'
        );
      expect(nextSteps)
        .to.be.an('array')
        .that.includes(`* Implement the component in ${chalk.green(componentOutputPath)}`);
    });
  });
});

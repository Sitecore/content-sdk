import { expect } from 'chai';
import { defaultTemplate } from './default-component';
import chalk from 'chalk';

describe('default-component', () => {
  describe('generateTemplate', () => {
    it('should generate a template with the given component name', () => {
      const componentName = 'TestComponent';
      const template = defaultTemplate.generateTemplate(componentName);
      expect(template).to.include(`interface ${componentName}Props`);
      expect(template).to.include(`<p>${componentName} Component</p>`);
    });
  });

  describe('getNextSteps', () => {
    it('should return an empty array if no componentOutputPath is provided', () => {
      const nextSteps = defaultTemplate.getNextSteps && defaultTemplate.getNextSteps('');
      expect(nextSteps).to.be.an('array').that.is.empty;
    });

    it('should return an array with next steps if componentOutputPath is provided', () => {
      const componentOutputPath = 'src/components/TestComponent.tsx';
      const nextSteps =
        defaultTemplate.getNextSteps && defaultTemplate.getNextSteps(componentOutputPath);
      expect(nextSteps)
        .to.be.an('array')
        .that.includes(`* Implement the React component in ${chalk.green(componentOutputPath)}`);
    });
  });
});

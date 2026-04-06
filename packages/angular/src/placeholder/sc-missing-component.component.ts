import { Component, input } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';

/**
 * Default component rendered when a Sitecore rendering has no matching entry in the component map.
 * @public
 */
@Component({
  selector: 'sc-missing-component',
  standalone: true,
  template: `
    <div style="background: darkorange; outline: 5px solid orange; padding: 10px; color: white; max-width: 500px;">
      <h2>{{ componentName() }}</h2>
      <p>Content SDK component is missing an Angular implementation. See the developer console for more information.</p>
    </div>
  `,
})
export class ScMissingComponentComponent {
  readonly rendering = input<ComponentRendering>();
  readonly fields = input<{ [key: string]: unknown }>();
  readonly params = input<{ [key: string]: string }>();

  readonly componentName = () => {
    const r = this.rendering();
    return r?.componentName || 'Unnamed Component';
  };
}

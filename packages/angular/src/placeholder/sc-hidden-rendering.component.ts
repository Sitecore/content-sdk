import { Component, input } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';

/**
 * Default component rendered for hidden Sitecore renderings.
 * @public
 */
@Component({
  selector: 'sc-hidden-rendering',
  standalone: true,
  template: `<div [style]="styles">The component is hidden</div>`,
})
export class ScHiddenRenderingComponent {
  readonly rendering = input<ComponentRendering>();
  readonly fields = input<{ [key: string]: unknown }>();
  readonly params = input<{ [key: string]: string }>();

  readonly styles = {
    background: 'repeating-linear-gradient(135deg, #fff, #fff 10px, #f0f0f0 10px, #f0f0f0 20px)',
    minHeight: '30px',
    border: '1px dashed #ccc',
    padding: '10px',
    opacity: 0.7,
  };
}

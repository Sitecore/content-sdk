import { Component, input, OnInit } from '@angular/core';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';

/**
 * Rendered in place of any Sitecore component that has no Angular implementation registered
 * in the `ComponentMap`. Logs the component name and props to the console in development.
 * @public
 */
@Component({
  selector: 'sc-missing-component',
  standalone: true,
  template: `
    <div
      style="background: darkorange; outline: 5px solid orange; padding: 10px; color: white; max-width: 500px;"
    >
      <h2>{{ componentName }}</h2>
      <p>{{ errorMessage }}</p>
    </div>
  `,
})
export class MissingComponent implements OnInit {
  /**
   * The rendering data from Sitecore — used to extract the component name.
   */
  readonly rendering = input<Partial<ComponentRendering>>({});

  get componentName(): string {
    return this.rendering()?.componentName ?? 'Unnamed Component';
  }

  get errorMessage(): string {
    return 'Content SDK component is missing Angular implementation. See the developer console for more information.';
  }

  ngOnInit(): void {
    console.log(
      `Component props for unimplemented '${this.componentName}' component`,
      this.rendering()
    );
  }
}

import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';

/**
 * The MissingComponent is displayed when a component is not found in the component map.
 * This helps developers identify missing component implementations.
 *
 * @public
 */
@Component({
  selector: 'sc-missing-component',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngStyle]="containerStyles">
      <h2>{{ componentName }}</h2>
      <p>{{ errorMessage }}</p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MissingComponentComponent implements OnInit {
  /**
   * The rendering data for the missing component.
   */
  @Input() rendering?: ComponentRendering;

  /**
   * Optional error message to override the default.
   */
  @Input() errorOverride?: string;

  /**
   * Container styles for the error display
   */
  protected readonly containerStyles = {
    background: 'darkorange',
    outline: '5px solid orange',
    padding: '10px',
    color: 'white',
    maxWidth: '500px',
  };

  /**
   * Get the component name from the rendering
   */
  protected get componentName(): string {
    return this.rendering?.componentName || 'Unnamed Component';
  }

  /**
   * Get the error message to display
   */
  protected get errorMessage(): string {
    return (
      this.errorOverride ||
      'Content SDK component is missing Angular implementation. See the developer console for more information.'
    );
  }

  ngOnInit(): void {
    // Log component props for unimplemented components (not for error overrides)
    if (!this.errorOverride) {
      console.log(
        `Component props for unimplemented '${this.componentName}' component`,
        this.rendering
      );
    }
  }
}

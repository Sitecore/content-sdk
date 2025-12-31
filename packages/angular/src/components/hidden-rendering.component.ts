import { Component, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

/**
 * The HiddenRendering component displays a placeholder for hidden components.
 * This is used when a component is configured to be hidden in the Sitecore editor.
 *
 * @public
 */
@Component({
  selector: 'sc-hidden-rendering',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div [ngStyle]="styles">The component is hidden</div> `,
})
export class HiddenRenderingComponent {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Base styles for the hidden component placeholder
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly baseStyles = {
    backgroundSize: '3px 3px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
    color: '#aaa',
  };

  /**
   * Background image style for non-test environments
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private readonly backgroundImageStyle = {
    backgroundImage:
      'linear-gradient(45deg, #ffffff 25%, #dcdcdc 25%, #dcdcdc 50%, #ffffff 50%, #ffffff 75%, #dcdcdc 75%, #dcdcdc 100%)',
  };

  /**
   * Combined styles based on environment
   */
  protected get styles(): { [key: string]: string } {
    // In test environments, skip the background image for simpler assertions
    if (!this.isBrowser) {
      return this.baseStyles;
    }
    return { ...this.baseStyles, ...this.backgroundImageStyle };
  }
}

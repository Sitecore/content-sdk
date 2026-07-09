import { Component, computed, signal } from '@angular/core';
import { SxaComponent } from './content-sdk/sxa.component';
import { NavigationItemComponent, type NavItemFields } from './navigation-item.component';

function isNavItem(candidate: unknown): candidate is NavItemFields {
  return candidate != null && typeof candidate === 'object' && !Array.isArray(candidate);
}

@Component({
  selector: 'app-navigation',
  imports: [NavigationItemComponent],
  host: {
    '[attr.class]': "('component navigation ' + styles().trim())",
    '[attr.id]': 'renderingId()',
  },
  template: `
    @if (navItems().length === 0) {
    <div class="component-content">[Navigation]</div>
    } @else {
    <label class="menu-mobile-navigate-wrapper">
      <input
        type="checkbox"
        class="menu-mobile-navigate"
        [checked]="menuOpen()"
        (change)="onMenuChange($event)"
        [attr.aria-label]="menuAriaLabel()"
      />
      <div class="menu-humburger" aria-hidden="true"></div>
      <div class="component-content">
        <nav>
          <ul class="clearfix">
            @for (item of navItems(); track trackRoot(item, index); let index = $index) {
            <app-navigation-item
              [navItemFields]="item"
              [relativeLevel]="1"
              (linkClick)="closeMenu()"
            />
            }
          </ul>
        </nav>
      </div>
    </label>
    }
  `,
})
export class NavigationComponent extends SxaComponent {
  readonly menuOpen = signal(false);

  readonly menuAriaLabel = computed(() =>
    this.menuOpen() ? 'Close navigation menu' : 'Open navigation menu'
  );

  readonly navItems = computed(() => {
    const fieldsRecord = this.fields();
    if (!fieldsRecord || Object.keys(fieldsRecord).length === 0) return [] as NavItemFields[];
    return Object.values(fieldsRecord).filter(isNavItem);
  });

  onMenuChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement | null;
    if (checkbox) this.menuOpen.set(checkbox.checked);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  trackRoot(item: NavItemFields, index: number): string {
    const itemId = item.Id ?? '';
    return itemId ? `${index}-${itemId}` : String(index);
  }
}

export default NavigationComponent;

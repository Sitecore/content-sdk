import { Component, computed, input, output, signal } from '@angular/core';
import { Field, ScLinkDirective, ScTextDirective } from '@sitecore-content-sdk/angular';

/** Navigation datasource item (layout JSON field names). */
export interface NavItemFields {
  Id?: string;
  DisplayName?: string;
  Title?: Field<string>;
  NavigationTitle?: Field<string>;
  Href?: string;
  Querystring?: string;
  Children?: NavItemFields[];
  Styles?: string[];
}

@Component({
  selector: 'app-navigation-item',
  imports: [ScLinkDirective, ScTextDirective, NavigationItemComponent],
  template: `
    <li [class]="itemClass()" [attr.tabindex]="0">
      <div class="navigation-title" [class.child]="hasChildren()" (click)="toggleSubmenu()">
        <a [scLink]="linkField()" (click)="linkClick.emit($event)">
          @if (navItemFields().NavigationTitle) {
            <span [scText]="navItemFields().NavigationTitle!"></span>
          } @else if (navItemFields().Title) {
            <span [scText]="navItemFields().Title!"></span>
          } @else {
            {{ displayFallback() }}
          }
        </a>
      </div>
      @if (hasChildren()) {
        <ul class="clearfix">
          @for (child of children(); track trackChild(child, index); let index = $index) {
            <app-navigation-item
              [navItemFields]="child"
              [relativeLevel]="relativeLevel() + 1"
              (linkClick)="linkClick.emit($event)"
            />
          }
        </ul>
      }
    </li>
  `,
})
export class NavigationItemComponent {
  readonly navItemFields = input.required<NavItemFields>();
  readonly relativeLevel = input(1);
  readonly linkClick = output<Event>();

  readonly submenuOpen = signal(false);

  readonly children = computed(() => {
    const childrenFromLayout = this.navItemFields().Children;
    return Array.isArray(childrenFromLayout) ? childrenFromLayout : [];
  });
  readonly hasChildren = computed(() => this.children().length > 0);
  readonly linkField = computed(() => {
    const navItem = this.navItemFields();
    const href = (navItem.Href ?? '').trim();
    const linkText =
      navItem.NavigationTitle?.value != null && String(navItem.NavigationTitle.value) !== ''
        ? String(navItem.NavigationTitle.value)
        : navItem.Title?.value != null && String(navItem.Title.value) !== ''
          ? String(navItem.Title.value)
          : (navItem.DisplayName ?? '');
    return {
      value: {
        href,
        text: linkText,
        title: linkText || undefined,
        querystring: navItem.Querystring ?? '',
      },
    };
  });

  readonly displayFallback = computed(() => this.navItemFields().DisplayName ?? '');

  readonly itemClass = computed(() => {
    const navItem = this.navItemFields();
    const active = this.hasChildren() && this.submenuOpen() ? 'active' : '';
    const styles = Array.isArray(navItem.Styles) ? navItem.Styles.filter(Boolean) : [];
    return [...styles, `rel-level${this.relativeLevel()}`, active].filter(Boolean).join(' ');
  });

  toggleSubmenu(): void {
    if (!this.hasChildren()) return;
    this.submenuOpen.update((wasOpen) => !wasOpen);
  }

  trackChild(child: NavItemFields, index: number): string {
    const itemId = child.Id ?? '';
    return itemId ? `${index}-${itemId}` : String(index);
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Component, input, computed, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentRendering, Field, ScLinkDirective, LinkField } from '@sitecore-content-sdk/angular';
import { scRenderingId } from '../sitecore/sitecore-component-classes';

/** Navigation item from Sitecore (Pascal or camel case). */
interface NavFields {
  Id?: string;
  id?: string;
  DisplayName?: string;
  displayName?: string;
  Title?: Field<string>;
  NavigationTitle?: Field<string>;
  Href?: string;
  href?: string;
  Querystring?: string;
  querystring?: string;
  Children?: NavFields[];
  children?: NavFields[];
  Styles?: string[];
  styles?: string[];
}

function idOf(f: NavFields): string {
  return f.Id ?? f.id ?? '';
}

function hrefOf(f: NavFields): string {
  return (f.Href ?? f.href ?? '').trim();
}

function childrenOf(f: NavFields): NavFields[] {
  const c = f.Children ?? f.children;
  return Array.isArray(c) ? c : [];
}

function stylesOf(f: NavFields): string[] {
  const s = f.Styles ?? f.styles;
  return Array.isArray(s) ? s : [];
}

function querystringOf(f: NavFields): string {
  return f.Querystring ?? f.querystring ?? '';
}

function labelOf(f: NavFields): string {
  if (f.NavigationTitle?.value != null && f.NavigationTitle.value !== '') {
    return String(f.NavigationTitle.value);
  }
  if (f.Title?.value != null && f.Title.value !== '') {
    return String(f.Title.value);
  }
  return f.DisplayName ?? f.displayName ?? '';
}

function linkFieldFor(f: NavFields): LinkField {
  return {
    value: {
      href: hrefOf(f),
      title: labelOf(f),
      querystring: querystringOf(f),
    },
  };
}

function isNavFieldValue(v: unknown): v is NavFields {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function parseQueryString(qs: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!qs) return out;
  for (const part of qs.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const k = eq >= 0 ? decodeURIComponent(part.slice(0, eq)) : decodeURIComponent(part);
    const v = eq >= 0 ? decodeURIComponent(part.slice(eq + 1)) : '';
    if (k) out[k] = v;
  }
  return out;
}

/** Split path and ?query from a single href string. */
function splitHrefQuery(href: string): { pathPart: string; queryFromHref: string } {
  const i = href.indexOf('?');
  if (i === -1) return { pathPart: href, queryFromHref: '' };
  return { pathPart: href.slice(0, i), queryFromHref: href.slice(i + 1) };
}

function pathnameForRouter(pathPart: string): string {
  let p = pathPart.trim();
  if (!p) return '/';
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname || '/';
    } catch {
      /* keep p */
    }
  }
  return p.startsWith('/') ? p : `/${p}`;
}

function isSpaHref(href: string, platformId: object): boolean {
  const h = href.trim();
  if (!h) return false;
  const low = h.toLowerCase();
  if (low.startsWith('mailto:') || low.startsWith('tel:') || low.startsWith('javascript:')) {
    return false;
  }
  if (h.startsWith('#')) return false;
  if (h.startsWith('/') && !h.startsWith('//')) return true;
  if (!isPlatformBrowser(platformId)) return false;
  try {
    return new URL(h).origin === window.location.origin;
  } catch {
    return false;
  }
}

@Component({
  selector: 'app-navigation-node',
  standalone: true,
  imports: [ScLinkDirective, RouterLink, NavigationNodeComponent],
  template: `
    <li [class]="itemClass()" [attr.tabindex]="0">
      <div class="navigation-title" [class.child]="kids().length > 0">
        @if (useRouter()) {
          <a [routerLink]="routerPath()" [queryParams]="routerQueryParams()">
            {{ label() }}
          </a>
        } @else {
          <a [scLink]="linkField()">{{ label() }}</a>
        }
      </div>
      @if (kids().length > 0) {
        <ul class="clearfix">
          @for (child of kids(); track trackKey(child, i); let i = $index) {
            <app-navigation-node [node]="child" [relativeLevel]="relativeLevel() + 1" />
          }
        </ul>
      }
    </li>
  `,
})
export class NavigationNodeComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly node = input.required<NavFields>();
  readonly relativeLevel = input<number>(1);

  readonly label = computed(() => labelOf(this.node()));
  readonly kids = computed(() => childrenOf(this.node()));
  readonly linkField = computed(() => linkFieldFor(this.node()));

  readonly useRouter = computed(() => isSpaHref(hrefOf(this.node()), this.platformId));

  readonly routerPath = computed(() => {
    const href = hrefOf(this.node());
    const { pathPart } = splitHrefQuery(href);
    return pathnameForRouter(pathPart);
  });

  readonly routerQueryParams = computed(() => {
    const href = hrefOf(this.node());
    const { queryFromHref } = splitHrefQuery(href);
    const fieldQs = querystringOf(this.node());
    const merged = queryFromHref || fieldQs;
    return parseQueryString(merged);
  });

  readonly itemClass = computed(() => {
    const level = this.relativeLevel();
    const styleClasses = stylesOf(this.node()).filter(Boolean);
    const levelClass = level <= 1 ? 'level0' : 'level1';
    const submenu = this.kids().length > 0 ? 'submenu' : '';
    return [...styleClasses, levelClass, `rel-level${level}`, submenu].filter(Boolean).join(' ');
  });

  trackKey(child: NavFields, index: number): string {
    const id = idOf(child);
    return id ? `${index}-${id}` : String(index);
  }
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NavigationNodeComponent],
  template: `
    <div [attr.class]="navRootClass()" [id]="renderingId()">
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
            <nav (click)="onNavDelegatedClick($event)">
              <ul class="clearfix">
                @for (item of navItems(); track trackRoot(item, i); let i = $index) {
                  <app-navigation-node [node]="item" [relativeLevel]="1" />
                }
              </ul>
            </nav>
          </div>
        </label>
      }
    </div>
  `,
})
export class NavigationComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly menuOpen = signal(false);

  readonly navRootClass = computed(() => {
    const s = this.params()?.['styles']?.trim() ?? '';
    const parts = ['component', 'navigation', 'navigation-horizontal'];
    if (s) parts.push(s);
    return parts.join(' ');
  });

  readonly renderingId = computed(() => scRenderingId(this.params()));

  readonly menuAriaLabel = computed(() =>
    this.menuOpen() ? 'Close navigation menu' : 'Open navigation menu'
  );

  readonly navItems = computed(() => {
    const f = this.fields();
    if (!f || Object.keys(f).length === 0) return [] as NavFields[];
    return Object.values(f).filter(isNavFieldValue);
  });

  onMenuChange(ev: Event): void {
    const el = ev.target as HTMLInputElement | null;
    if (el) this.menuOpen.set(el.checked);
  }

  /** Close mobile menu when a link is activated (bubbles from nested ul). */
  onNavDelegatedClick(ev: Event): void {
    if ((ev.target as HTMLElement | null)?.closest('a')) {
      this.menuOpen.set(false);
    }
  }

  trackRoot(item: NavFields, index: number): string {
    const id = idOf(item);
    return id ? `${index}-${id}` : String(index);
  }
}

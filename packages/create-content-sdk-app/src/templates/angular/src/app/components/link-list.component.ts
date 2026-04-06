import { Component, input, computed } from '@angular/core';
import { ComponentRendering, Field } from '@sitecore-content-sdk/angular';
import { ScTextDirective, ScLinkDirective, LinkField } from '@sitecore-content-sdk/angular';
import { scComponentRoot, scRenderingId } from '../sitecore/sitecore-component-classes';

interface LinkListItem {
  id: string;
  fields: {
    Title?: Field<string>;
    Link?: LinkField;
  };
}

@Component({
  selector: 'app-link-list',
  standalone: true,
  imports: [ScTextDirective, ScLinkDirective],
  template: `
    <div [attr.class]="rootClass()" [id]="renderingId()">
      <div class="component-content">
        <h3 [scText]="titleField()"></h3>
        <ul>
          @for (item of linkItems(); track item.id) {
            <li>
              @if (item.fields?.Link) {
                <a [scLink]="item.fields.Link"></a>
              }
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class LinkListComponent {
  readonly fields = input<{ [key: string]: unknown }>({});
  readonly params = input<{ [key: string]: string }>({});
  readonly rendering = input<ComponentRendering>();

  readonly titleField = computed(() => this.fields()?.['Title'] as Field<string> | undefined);
  readonly linkItems = computed(() => (this.fields()?.['items'] as LinkListItem[]) ?? []);

  readonly rootClass = computed(() => scComponentRoot('link-list', this.params()));
  readonly renderingId = computed(() => scRenderingId(this.params()));
}

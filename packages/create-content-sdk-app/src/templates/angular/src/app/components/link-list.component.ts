import { Component, computed } from '@angular/core';
import { isFieldValueEmpty } from '@sitecore-content-sdk/content/layout';
import { Field, ScTextDirective, ScLinkDirective, LinkField } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

interface LinkListDatasource {
  children?: {
    results?: Array<{
      field?: {
        link?: LinkField;
      };
    }>;
  };
  field?: {
    title?: Field<string>;
  };
}

interface LinkListFields {
  data?: { datasource?: LinkListDatasource };
}

@Component({
  selector: 'app-link-list',
  imports: [ScTextDirective, ScLinkDirective],
  template: `
    <div [attr.class]="('component link-list ' + styles()).trim()" [attr.id]="renderingId()">
      <div class="component-content">
        @if (!datasource()) {
        <h3>Link List</h3>
        } @else {
        <h3 [scText]="titleField()"></h3>
        <ul>
          @for (row of linkRows(); track $index) {
          <li [class]="itemClass($index, linkRows().length)">
            <div class="field-link">
              <a [scLink]="row.link"></a>
            </div>
          </li>
          }
        </ul>
        }
      </div>
    </div>
  `,
})
export class LinkListComponent extends SxaComponent {
  readonly data = computed(() => (this.fields() as LinkListFields)?.data);

  readonly datasource = computed(() => this.data()?.datasource);

  readonly titleField = computed(() => this.datasource()?.field?.title);

  readonly linkRows = computed(() => {
    const results = this.datasource()?.children?.results;
    if (!Array.isArray(results)) return [] as Array<{ link: LinkField }>;
    return results
      .filter((result) => {
        const link = result?.field?.link;
        return !!link && !isFieldValueEmpty(link);
      })
      .map((result) => ({ link: result.field!.link! }));
  });

  /** SXA-style list row classes: `item{n}`, alternating odd/even (0-based), optional first/last. */
  itemClass(index: number, total: number): string {
    const classes = [`item${index}`, index % 2 === 0 ? 'odd' : 'even'];
    if (index === 0) classes.push('first');
    if (index === total - 1) classes.push('last');
    return classes.join(' ');
  }
}

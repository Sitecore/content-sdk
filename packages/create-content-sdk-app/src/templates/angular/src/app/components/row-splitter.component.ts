import { Component, computed } from '@angular/core';
import { ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';

type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

@Component({
  selector: 'app-row-splitter',
  imports: [ScPlaceholderComponent],
  template: `
    <section [attr.class]="('component row-splitter ' + styles()).trim()" [attr.id]="renderingId()">
      @for (placeholderSegment of enabledPlaceholders(); track placeholderSegment) {
        <section [attr.class]="rowSectionClass(placeholderSegment)">
          <div>
            <div class="row">
              <sc-placeholder
                [name]="placeholderKey(placeholderSegment)"
                [rendering]="rendering()!"
              ></sc-placeholder>
            </div>
          </div>
        </section>
      }
    </section>
  `,
})
export class RowSplitterComponent extends SxaComponent {
  readonly enabledPlaceholders = computed(() => {
    const raw = this.params()?.EnabledPlaceholders;
    return raw?.split(',').map((segment: string) => segment.trim()).filter(Boolean) ?? [];
  });

  placeholderKey(placeholderSegment: string): string {
    const rowIndex = Number(placeholderSegment) as RowNumber;
    return `row-${rowIndex}-{*}`;
  }

  rowSectionClass(placeholderSegment: string): string {
    const rowIndex = Number(placeholderSegment) as RowNumber;
    const rowStyles = `${this.params()?.[`Styles${rowIndex}`] ?? ''}`.trimEnd();
    return `container-fluid ${rowStyles}`.trimEnd();
  }
}

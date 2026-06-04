import { Component, computed } from '@angular/core';
import { ScPlaceholderComponent } from '@sitecore-content-sdk/angular';
import { SxaComponent } from './content-sdk/sxa.component';
type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

@Component({
  selector: 'app-column-splitter',
  imports: [ScPlaceholderComponent],
  template: `
    <div
      [attr.class]="('row component column-splitter ' + styles()).trim()"
      [attr.id]="renderingId()"
    >
      @for (columnNum of enabledColumns(); track columnNum) {
      <div [attr.class]="columnClassNames(columnNum)">
        <div class="row">
          <sc-placeholder
            [name]="placeholderKey(columnNum)"
            [rendering]="rendering()!"
          ></sc-placeholder>
        </div>
      </div>
      }
    </div>
  `,
})
export class ColumnSplitterComponent extends SxaComponent {
  /** Enabled placeholder columns from params. */
  readonly enabledColumns = computed(() => {
    const raw = this.params()?.EnabledPlaceholders;
    return (
      raw
        ?.split(',')
        .map((segment: string) => segment.trim())
        .filter(Boolean) ?? []
    );
  });

  /** Extra root-level classes from rendering params (SXA: GridParameters + Styles). */
  override readonly styles = computed(() => {
    const renderingParams = this.params();
    const gridParams = renderingParams?.GridParameters?.trim() ?? '';
    const fromStyles = renderingParams?.Styles?.trim() ?? '';
    return `${gridParams} ${fromStyles}`.trim();
  });

  placeholderKey(columnNum: string): string {
    return `column-${columnNum}-{*}`;
  }

  columnClassNames(columnNum: string): string {
    const columnIndex = Number(columnNum) as ColumnNumber;
    const columnWidth = this.params()?.[`ColumnWidth${columnIndex}`] ?? '';
    const columnStyle = this.params()?.[`Styles${columnIndex}`] ?? '';
    return `${columnWidth} ${columnStyle}`.trim();
  }
}

export default ColumnSplitterComponent;

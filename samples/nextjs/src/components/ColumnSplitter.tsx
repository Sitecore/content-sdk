import React, { JSX } from 'react';
import {
  ComponentMap,
  ServerPlaceholder,
  SitecoreProviderPageContext,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * The number of columns that can be inserted into the column splitter component.
 * The maximum number of columns is 8.
 */
type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * The width specified for each rendered column.
 * The key is the column number, and the value is the width.
 */
type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

/**
 * The styles specified for each rendered column.
 * The key is the column number, and the value is the styles.
 */
type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

interface ColumnSplitterProps extends ComponentProps {
  params: ComponentProps['params'] & ColumnWidths & ColumnStyles;
  componentMap: ComponentMap;
  pageContext: SitecoreProviderPageContext;
}

export const Default = ({
  params,
  rendering,
  componentMap,
  pageContext,
}: ColumnSplitterProps): JSX.Element => {
  const { EnabledPlaceholders, RenderingIdentifier: id, styles } = params;

  const enabledColumns = EnabledPlaceholders?.split(',') ?? [];

  return (
    <div className={`row component column-splitter ${styles}`} id={id}>
      {enabledColumns.map((columnNum, index) => {
        const num = Number(columnNum) as ColumnNumber;
        const columnWidth = params[`ColumnWidth${num}`] ?? '';
        const columnStyle = params[`Styles${num}`] ?? '';
        const columnClassNames = `${columnWidth} ${columnStyle}`.trim();

        return (
          <div key={index} className={columnClassNames}>
            <div className="row">
              <ServerPlaceholder
                name={`column-${columnNum}-{*}`}
                rendering={rendering}
                componentMap={componentMap}
                pageContext={pageContext}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const isRsc = true;

import React, { JSX } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * The number of rows that can be inserted into the row splitter component.
 * The maximum number of rows is 8.
 */
type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * The styles specified for each rendered row.
 * The key is the row number, and the value is the styles.
 */
type RowStyles = {
  [K in `Styles${RowNumber}`]?: string;
};

interface RowSplitterProps extends ComponentProps {
  rendering: ComponentRendering;
  params: ComponentProps['params'] & RowStyles;
  placeholders: Record<string, React.ReactNode>;
}

export const Default = async ({ params, placeholders }: RowSplitterProps): Promise<JSX.Element> => {
  const enabledPlaceholders = params.EnabledPlaceholders?.split(',') ?? [];
  const id = params.RenderingIdentifier;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div className={`component row-splitter ${params.styles}`} id={id}>
      <p>Async RowSplitter</p>
      {enabledPlaceholders.map((ph, index) => {
        const num = Number(ph) as RowNumber;
        const placeholderKey = `row-${num}-{*}`;
        const rowStyles = `${params[`Styles${num}`] ?? ''}`.trimEnd();

        return (
          <div key={index} className={`container-fluid ${rowStyles}`.trimEnd()}>
            <div>
              <div className="row">{placeholders[placeholderKey]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const isRsc = true;

'use client';

import { z } from 'zod';
import type { BaseComponentProps } from '@json-render/react';

export const HeadingSchema = z.object({
  text: z.string(),
  level: z.enum(['h1', 'h2', 'h3', 'h4']).nullable(),
  className: z.string().nullable().describe('Additional CSS classes'),
});

export type HeadingProps = z.output<typeof HeadingSchema>;

export const Heading = ({ props }: BaseComponentProps<HeadingProps>) => {
  const level = props.level ?? 'h2';
  const baseClass =
    level === 'h1'
      ? 'text-2xl font-bold'
      : level === 'h3'
      ? 'text-base font-semibold'
      : level === 'h4'
      ? 'text-sm font-semibold'
      : 'text-lg font-semibold';
  const cls = `${baseClass} text-left${props.className ? ` ${props.className}` : ''}`;

  if (level === 'h1') return <h1 className={cls}>{props.text}</h1>;
  if (level === 'h3') return <h3 className={cls}>{props.text}</h3>;
  if (level === 'h4') return <h4 className={cls}>{props.text}</h4>;
  return <h2 className={cls}>{props.text}</h2>;
};


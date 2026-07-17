/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { shadcnComponentDefinitions } from '@json-render/shadcn';
import { useBoundProp } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';

// ── Local type definitions ────────────────────────────────────────────────────

interface EventHandle {
  emit: () => void;
  shouldPreventDefault: boolean;
  bound: boolean;
}

interface BaseComponentProps<P = Record<string, unknown>> {
  props: P;
  children?: ReactNode;
  emit: (event: string) => void;
  on: (event: string) => EventHandle;
  bindings?: Record<string, string>;
  loading?: boolean;
}

// Simple no-op validation hook — schema checks are not wired in the preview context
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useFieldValidation(_path: string, _config?: unknown) {
  const [errors] = useState<string[]>([]);
  const validate = () => ({ valid: true, errors: [] as string[] });
  return { errors, validate };
}

import { Button as ShadcnButton } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Switch as ShadcnSwitch } from '@/components/ui/switchcom';
import { Progress as ShadcnProgress } from '@/components/ui/progress';
import { Separator as ShadcnSeparator } from '@/components/ui/separator';
import { Alert as ShadcnAlert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar as AvatarPrimitive, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Carousel as CarouselPrimitive,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table as TablePrimitive,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Drawer as DrawerPrimitive,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Popover as PopoverPrimitive,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton as ShadcnSkeleton } from '@/components/ui/skeleton';
import { Slider as ShadcnSlider } from '@/components/ui/slider';
import { Tabs as TabsPrimitive, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toggle as ShadcnToggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// suppress unused import warning — Card/CardHeader/etc used in Card component
void Card;
void CardHeader;
void CardTitle;
void CardDescription;
void CardContent;
// suppress unused TabsContent — used externally via children
void TabsContent;

// =============================================================================
// Helpers
// =============================================================================

const withClass = { className: z.string().nullable() } as const;

function getPaginationRange(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | 'ellipsis'> = [];
  pages.push(1);
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

// =============================================================================
// Layout
// =============================================================================

// ── Text ──────────────────────────────────────────────────────────────────────

export const TextSchema = shadcnComponentDefinitions.Text.props.extend(withClass);
export type TextProps = z.output<typeof TextSchema>;

export const Text = ({ props }: BaseComponentProps<TextProps>) => {
  const variantClass =
    props.variant === 'caption'
      ? 'text-xs'
      : props.variant === 'muted'
      ? 'text-sm text-muted-foreground'
      : props.variant === 'lead'
      ? 'text-xl text-muted-foreground'
      : props.variant === 'code'
      ? 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded'
      : 'text-sm';
  const c = cn(variantClass, 'text-left', props.className);
  if (props.variant === 'code') return <code className={c}>{props.text}</code>;
  return <p className={c}>{props.text}</p>;
};

// ── Separator ─────────────────────────────────────────────────────────────────

export const SeparatorSchema = shadcnComponentDefinitions.Separator.props.extend(withClass);
export type SeparatorProps = z.output<typeof SeparatorSchema>;

export const Separator = ({ props }: BaseComponentProps<SeparatorProps>) => (
  <ShadcnSeparator
    orientation={props.orientation ?? 'horizontal'}
    className={cn(
      props.orientation === 'vertical' ? 'h-full mx-2' : 'my-3',
      props.className ?? undefined
    )}
  />
);

// ── Tabs ──────────────────────────────────────────────────────────────────────

export const TabsSchema = shadcnComponentDefinitions.Tabs.props.extend(withClass);
export type TabsProps = z.output<typeof TabsSchema>;

export const Tabs = ({ props, children, bindings, emit }: BaseComponentProps<TabsProps>) => {
  const tabs = props.tabs ?? [];
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState(props.defaultValue ?? tabs[0]?.value ?? '');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? tabs[0]?.value ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;

  return (
    <TabsPrimitive
      className={props.className ?? undefined}
      value={value}
      onValueChange={(v) => {
        setValue(v);
        emit('change');
      }}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </TabsPrimitive>
  );
};

// ── Accordion ─────────────────────────────────────────────────────────────────

export const AccordionSchema = shadcnComponentDefinitions.Accordion.props.extend(withClass);
export type AccordionProps = z.output<typeof AccordionSchema>;

export const Accordion = ({ props }: BaseComponentProps<AccordionProps>) => {
  const items = props.items ?? [];
  const isMultiple = props.type === 'multiple';
  const itemElements = items.map((item, i) => (
    <AccordionItem key={i} value={`item-${i}`}>
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ));
  if (isMultiple) {
    return (
      <AccordionPrimitive type="multiple" className={cn('w-full', props.className ?? undefined)}>
        {itemElements}
      </AccordionPrimitive>
    );
  }
  return (
    <AccordionPrimitive
      type="single"
      collapsible
      className={cn('w-full', props.className ?? undefined)}
    >
      {itemElements}
    </AccordionPrimitive>
  );
};

// ── Collapsible ───────────────────────────────────────────────────────────────

export const CollapsibleSchema = shadcnComponentDefinitions.Collapsible.props.extend(withClass);
export type CollapsibleProps = z.output<typeof CollapsibleSchema>;

export const CollapsibleComp = ({ props, children }: BaseComponentProps<CollapsibleProps>) => {
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn('w-full', props.className ?? undefined)}
    >
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center justify-between rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          {props.title}
          <svg
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

// =============================================================================
// Data Display
// =============================================================================

// ── Table ─────────────────────────────────────────────────────────────────────

export const TableSchema = shadcnComponentDefinitions.Table.props.extend(withClass);
export type TableProps = z.output<typeof TableSchema>;

export const Table = ({ props }: BaseComponentProps<TableProps>) => {
  const columns = props.columns ?? [];
  const rows = (props.rows ?? []).map((row) => row.map(String));
  return (
    <div
      className={cn(
        'rounded-md border border-border overflow-hidden',
        props.className ?? undefined
      )}
    >
      <TablePrimitive>
        {props.caption && <TableCaption>{props.caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TablePrimitive>
    </div>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────────

export const AvatarSchema = shadcnComponentDefinitions.Avatar.props.extend(withClass);
export type AvatarProps = z.output<typeof AvatarSchema>;

export const Avatar = ({ props }: BaseComponentProps<AvatarProps>) => {
  const name = props.name || '?';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sizeClass =
    props.size === 'lg' ? 'h-12 w-12' : props.size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <AvatarPrimitive className={cn(sizeClass, props.className ?? undefined)}>
      {props.src && <AvatarImage src={props.src} alt={name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </AvatarPrimitive>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────

export const BadgeSchema = shadcnComponentDefinitions.Badge.props.extend(withClass);
export type BadgeProps = z.output<typeof BadgeSchema>;

export const Badge = ({ props }: BaseComponentProps<BadgeProps>) => (
  <ShadcnBadge
    variant={
      props.variant === 'destructive'
        ? 'destructive'
        : props.variant === 'outline'
        ? 'outline'
        : props.variant === 'secondary'
        ? 'secondary'
        : 'default'
    }
    className={props.className ?? undefined}
  >
    {props.text}
  </ShadcnBadge>
);

// ── Alert ─────────────────────────────────────────────────────────────────────

export const AlertSchema = shadcnComponentDefinitions.Alert.props.extend(withClass);
export type AlertProps = z.output<typeof AlertSchema>;

export const Alert = ({ props }: BaseComponentProps<AlertProps>) => {
  const variant = props.type === 'error' ? 'destructive' : 'default';
  const customClass =
    props.type === 'success'
      ? 'border-green-200 bg-green-50 text-green-900'
      : props.type === 'warning'
      ? 'border-yellow-200 bg-yellow-50 text-yellow-900'
      : props.type === 'info'
      ? 'border-blue-200 bg-blue-50 text-blue-900'
      : '';
  return (
    <ShadcnAlert variant={variant} className={cn(customClass, props.className ?? undefined)}>
      <AlertTitle>{props.title}</AlertTitle>
      {props.message && <AlertDescription>{props.message}</AlertDescription>}
    </ShadcnAlert>
  );
};

// ── Progress ──────────────────────────────────────────────────────────────────

export const ProgressSchema = shadcnComponentDefinitions.Progress.props.extend(withClass);
export type ProgressProps = z.output<typeof ProgressSchema>;

export const Progress = ({ props }: BaseComponentProps<ProgressProps>) => {
  const value = Math.min(100, Math.max(0, props.value || 0));
  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      {props.label && <Label className="text-sm text-muted-foreground">{props.label}</Label>}
      <ShadcnProgress value={value} />
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

export const SkeletonSchema = shadcnComponentDefinitions.Skeleton.props.extend(withClass);
export type SkeletonProps = z.output<typeof SkeletonSchema>;

export const Skeleton = ({ props }: BaseComponentProps<SkeletonProps>) => (
  <ShadcnSkeleton
    className={cn(props.rounded ? 'rounded-full' : 'rounded-md', props.className ?? undefined)}
    style={{ width: props.width ?? '100%', height: props.height ?? '1.25rem' }}
  />
);

// ── Image ─────────────────────────────────────────────────────────────────────

export const ImageSchema = shadcnComponentDefinitions.Image.props.extend(withClass);
export type ImageProps = z.output<typeof ImageSchema>;

export const Image = ({ props }: BaseComponentProps<ImageProps>) => {
  if (props.src) {
    return (
      <img
        src={props.src}
        alt={props.alt ?? ''}
        width={props.width ?? undefined}
        height={props.height ?? undefined}
        className={cn('rounded max-w-full', props.className ?? undefined)}
      />
    );
  }
  return (
    <div
      className={cn(
        'bg-muted border border-border rounded flex items-center justify-center text-xs text-muted-foreground',
        props.className ?? undefined
      )}
      style={{ width: props.width ?? 80, height: props.height ?? 60 }}
    >
      {props.alt || 'img'}
    </div>
  );
};

// ── Carousel ──────────────────────────────────────────────────────────────────

export const CarouselSchema = shadcnComponentDefinitions.Carousel.props.extend(withClass);
export type CarouselProps = z.output<typeof CarouselSchema>;

export const Carousel = ({ props }: BaseComponentProps<CarouselProps>) => {
  const items = props.items ?? [];
  return (
    <CarouselPrimitive className={cn('w-full', props.className ?? undefined)}>
      <CarouselContent>
        {items.map((item, i) => (
          <CarouselItem key={i} className="basis-3/4 md:basis-1/2 lg:basis-1/3">
            <div className="border border-border rounded-lg p-4 bg-card h-full">
              {item.title && <h4 className="font-semibold text-sm mb-1">{item.title}</h4>}
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </CarouselPrimitive>
  );
};

// =============================================================================
// Overlay / Floating
// =============================================================================

// ── Dialog ────────────────────────────────────────────────────────────────────

export const DialogSchema = shadcnComponentDefinitions.Dialog.props.extend(withClass);
export type DialogProps = z.output<typeof DialogSchema>;

export const Dialog = ({ props, children }: BaseComponentProps<DialogProps>) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DialogPrimitive open={open ?? false} onOpenChange={(v) => setOpen(v)}>
      <DialogContent className={props.className ?? undefined}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          {props.description && <DialogDescription>{props.description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogPrimitive>
  );
};

// ── Drawer ────────────────────────────────────────────────────────────────────

export const DrawerSchema = shadcnComponentDefinitions.Drawer.props.extend(withClass);
export type DrawerProps = z.output<typeof DrawerSchema>;

export const Drawer = ({ props, children }: BaseComponentProps<DrawerProps>) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DrawerPrimitive open={open ?? false} onOpenChange={(v) => setOpen(v)}>
      <DrawerContent className={props.className ?? undefined}>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
          {props.description && <DrawerDescription>{props.description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    </DrawerPrimitive>
  );
};

// ── Popover ───────────────────────────────────────────────────────────────────

export const PopoverSchema = shadcnComponentDefinitions.Popover.props.extend(withClass);
export type PopoverProps = z.output<typeof PopoverSchema>;

export const Popover = ({ props }: BaseComponentProps<PopoverProps>) => (
  <PopoverPrimitive>
    <PopoverTrigger asChild>
      <ShadcnButton variant="outline" className="text-sm">
        {props.trigger}
      </ShadcnButton>
    </PopoverTrigger>
    <PopoverContent className={cn('w-64', props.className ?? undefined)}>
      <p className="text-sm">{props.content}</p>
    </PopoverContent>
  </PopoverPrimitive>
);

// ── Tooltip ───────────────────────────────────────────────────────────────────

export const TooltipSchema = shadcnComponentDefinitions.Tooltip.props.extend(withClass);
export type TooltipProps = z.output<typeof TooltipSchema>;

export const Tooltip = ({ props }: BaseComponentProps<TooltipProps>) => (
  <TooltipProvider>
    <TooltipPrimitive>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'text-sm underline decoration-dotted cursor-help',
            props.className ?? undefined
          )}
        >
          {props.text}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{props.content}</p>
      </TooltipContent>
    </TooltipPrimitive>
  </TooltipProvider>
);

// ── DropdownMenu ──────────────────────────────────────────────────────────────

export const DropdownMenuSchema = shadcnComponentDefinitions.DropdownMenu.props.extend(withClass);
export type DropdownMenuProps = z.output<typeof DropdownMenuSchema>;

export const DropdownMenu = ({ props, bindings, emit }: BaseComponentProps<DropdownMenuProps>) => {
  const items = props.items ?? [];
  const [, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  return (
    <DropdownMenuPrimitive>
      <DropdownMenuTrigger asChild>
        <ShadcnButton variant="outline" className={props.className ?? undefined}>
          {props.label}
        </ShadcnButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => {
              setBoundValue(item.value);
              emit('select');
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuPrimitive>
  );
};

// =============================================================================
// Form Inputs
// =============================================================================

// ── Input ─────────────────────────────────────────────────────────────────────

export const InputSchema = shadcnComponentDefinitions.Input.props.extend(withClass);
export type InputProps = z.output<typeof InputSchema>;

export const Input = ({ props, bindings, emit }: BaseComponentProps<InputProps>) => {
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState('');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;
  const validateOn = props.validateOn ?? 'blur';
  const hasValidation = !!(bindings?.value && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      {props.label && <Label htmlFor={props.name ?? undefined}>{props.label}</Label>}
      <ShadcnInput
        id={props.name ?? undefined}
        name={props.name ?? undefined}
        type={props.type ?? 'text'}
        placeholder={props.placeholder ?? ''}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (hasValidation && validateOn === 'change') validate();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') emit('submit');
        }}
        onFocus={() => emit('focus')}
        onBlur={() => {
          if (hasValidation && validateOn === 'blur') validate();
          emit('blur');
        }}
      />
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Textarea ──────────────────────────────────────────────────────────────────

export const TextareaSchema = shadcnComponentDefinitions.Textarea.props.extend(withClass);
export type TextareaProps = z.output<typeof TextareaSchema>;

export const Textarea = ({ props, bindings }: BaseComponentProps<TextareaProps>) => {
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState('');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;
  const validateOn = props.validateOn ?? 'blur';
  const hasValidation = !!(bindings?.value && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      {props.label && <Label htmlFor={props.name ?? undefined}>{props.label}</Label>}
      <ShadcnTextarea
        id={props.name ?? undefined}
        name={props.name ?? undefined}
        placeholder={props.placeholder ?? ''}
        rows={props.rows ?? 3}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (hasValidation && validateOn === 'change') validate();
        }}
        onBlur={() => {
          if (hasValidation && validateOn === 'blur') validate();
        }}
      />
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Select ────────────────────────────────────────────────────────────────────

export const SelectSchema = shadcnComponentDefinitions.Select.props.extend(withClass);
export type SelectProps = z.output<typeof SelectSchema>;

export const Select = ({ props, bindings, emit }: BaseComponentProps<SelectProps>) => {
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState<string>('');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;
  const rawOptions = props.options ?? [];
  const options = rawOptions.map((opt) => (typeof opt === 'string' ? opt : String(opt ?? '')));
  const validateOn = props.validateOn ?? 'change';
  const hasValidation = !!(bindings?.value && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      <Label>{props.label}</Label>
      <SelectPrimitive
        value={value}
        onValueChange={(v) => {
          setValue(v);
          if (hasValidation && validateOn === 'change') validate();
          emit('change');
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={props.placeholder ?? 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt, idx) => (
            <SelectItem key={`${idx}-${opt}`} value={opt || `option-${idx}`}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Checkbox ──────────────────────────────────────────────────────────────────

export const CheckboxSchema = shadcnComponentDefinitions.Checkbox.props.extend(withClass);
export type CheckboxProps = z.output<typeof CheckboxSchema>;

export const Checkbox = ({ props, bindings, emit }: BaseComponentProps<CheckboxProps>) => {
  const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
    props.checked as boolean | undefined,
    bindings?.checked
  );
  const [localChecked, setLocalChecked] = useState(!!props.checked);
  const isBound = !!bindings?.checked;
  const checked = isBound ? boundChecked ?? false : localChecked;
  const setChecked = isBound ? setBoundChecked : setLocalChecked;
  const validateOn = props.validateOn ?? 'change';
  const hasValidation = !!(bindings?.checked && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.checked ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-1', props.className ?? undefined)}>
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          id={props.name ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c === true);
            if (hasValidation && validateOn === 'change') validate();
            emit('change');
          }}
        />
        <Label htmlFor={props.name ?? undefined} className="cursor-pointer">
          {props.label}
        </Label>
      </div>
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Radio ─────────────────────────────────────────────────────────────────────

export const RadioSchema = shadcnComponentDefinitions.Radio.props.extend(withClass);
export type RadioProps = z.output<typeof RadioSchema>;

export const Radio = ({ props, bindings, emit }: BaseComponentProps<RadioProps>) => {
  const rawOptions = props.options ?? [];
  const options = rawOptions.map((opt) => (typeof opt === 'string' ? opt : String(opt ?? '')));
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState(options[0] ?? '');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;
  const validateOn = props.validateOn ?? 'change';
  const hasValidation = !!(bindings?.value && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.value ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      {props.label && <Label>{props.label}</Label>}
      <RadioGroup
        value={value}
        onValueChange={(v) => {
          setValue(v);
          if (hasValidation && validateOn === 'change') validate();
          emit('change');
        }}
      >
        {options.map((opt, idx) => (
          <div key={`${idx}-${opt}`} className="flex items-center space-x-2">
            <RadioGroupItem value={opt || `option-${idx}`} id={`${props.name}-${idx}-${opt}`} />
            <Label htmlFor={`${props.name}-${idx}-${opt}`} className="cursor-pointer">
              {opt}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Switch ────────────────────────────────────────────────────────────────────

export const SwitchSchema = shadcnComponentDefinitions.Switch.props.extend(withClass);
export type SwitchProps = z.output<typeof SwitchSchema>;

export const Switch = ({ props, bindings, emit }: BaseComponentProps<SwitchProps>) => {
  const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
    props.checked as boolean | undefined,
    bindings?.checked
  );
  const [localChecked, setLocalChecked] = useState(!!props.checked);
  const isBound = !!bindings?.checked;
  const checked = isBound ? boundChecked ?? false : localChecked;
  const setChecked = isBound ? setBoundChecked : setLocalChecked;
  const validateOn = props.validateOn ?? 'change';
  const hasValidation = !!(bindings?.checked && props.checks?.length);
  const { errors, validate } = useFieldValidation(
    bindings?.checked ?? '',
    hasValidation ? { checks: props.checks ?? [], validateOn } : undefined
  );

  return (
    <div className={cn('space-y-1', props.className ?? undefined)}>
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor={props.name ?? undefined} className="cursor-pointer">
          {props.label}
        </Label>
        <ShadcnSwitch
          id={props.name ?? undefined}
          checked={checked}
          onCheckedChange={(c) => {
            setChecked(c);
            if (hasValidation && validateOn === 'change') validate();
            emit('change');
          }}
        />
      </div>
      {errors.length > 0 && <p className="text-sm text-destructive">{errors[0]}</p>}
    </div>
  );
};

// ── Slider ────────────────────────────────────────────────────────────────────

export const SliderSchema = shadcnComponentDefinitions.Slider.props.extend(withClass);
export type SliderProps = z.output<typeof SliderSchema>;

export const Slider = ({ props, bindings, emit }: BaseComponentProps<SliderProps>) => {
  const [boundValue, setBoundValue] = useBoundProp<number>(
    props.value as number | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState(props.min ?? 0);
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? props.min ?? 0 : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;

  return (
    <div className={cn('space-y-2', props.className ?? undefined)}>
      {props.label && (
        <div className="flex justify-between">
          <Label className="text-sm">{props.label}</Label>
          <span className="text-sm text-muted-foreground">{value}</span>
        </div>
      )}
      <ShadcnSlider
        value={[value]}
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
        onValueChange={(v) => {
          setValue(v[0] ?? 0);
          emit('change');
        }}
      />
    </div>
  );
};

// =============================================================================
// Actions
// =============================================================================

// ── Button ────────────────────────────────────────────────────────────────────

export const ButtonSchema = shadcnComponentDefinitions.Button.props.extend(withClass);
export type ButtonProps = z.output<typeof ButtonSchema>;

export const Button = ({ props, emit }: BaseComponentProps<ButtonProps>) => {
  const variant =
    props.variant === 'danger'
      ? 'destructive'
      : props.variant === 'secondary'
      ? 'secondary'
      : 'default';
  return (
    <ShadcnButton
      variant={variant}
      disabled={props.disabled ?? false}
      className={props.className ?? undefined}
      onClick={() => emit('press')}
    >
      {props.label}
    </ShadcnButton>
  );
};

// ── Link ──────────────────────────────────────────────────────────────────────

export const LinkSchema = shadcnComponentDefinitions.Link.props.extend(withClass);
export type LinkProps = z.output<typeof LinkSchema>;

export const Link = ({ props, on }: BaseComponentProps<LinkProps>) => (
  <a
    href={props.href ?? '#'}
    className={cn(
      'text-primary underline-offset-4 hover:underline text-sm font-medium',
      props.className ?? undefined
    )}
    onClick={(e) => {
      const press = on('press');
      if (press.shouldPreventDefault) e.preventDefault();
      press.emit();
    }}
  >
    {props.label}
  </a>
);

// ── Toggle ────────────────────────────────────────────────────────────────────

export const ToggleSchema = shadcnComponentDefinitions.Toggle.props.extend(withClass);
export type ToggleProps = z.output<typeof ToggleSchema>;

export const Toggle = ({ props, bindings, emit }: BaseComponentProps<ToggleProps>) => {
  const [boundPressed, setBoundPressed] = useBoundProp<boolean>(
    props.pressed as boolean | undefined,
    bindings?.pressed
  );
  const [localPressed, setLocalPressed] = useState(props.pressed ?? false);
  const isBound = !!bindings?.pressed;
  const pressed = isBound ? boundPressed ?? false : localPressed;
  const setPressed = isBound ? setBoundPressed : setLocalPressed;

  return (
    <ShadcnToggle
      variant={props.variant ?? 'default'}
      pressed={pressed}
      className={props.className ?? undefined}
      onPressedChange={(v) => {
        setPressed(v);
        emit('change');
      }}
    >
      {props.label}
    </ShadcnToggle>
  );
};

// ── ToggleGroup ───────────────────────────────────────────────────────────────

export const ToggleGroupSchema = shadcnComponentDefinitions.ToggleGroup.props.extend(withClass);
export type ToggleGroupProps = z.output<typeof ToggleGroupSchema>;

export const ToggleGroupComp = ({
  props,
  bindings,
  emit,
}: BaseComponentProps<ToggleGroupProps>) => {
  const type = props.type ?? 'single';
  const items = props.items ?? [];
  const [boundValue, setBoundValue] = useBoundProp<string>(
    props.value as string | undefined,
    bindings?.value
  );
  const [localValue, setLocalValue] = useState(items[0]?.value ?? '');
  const isBound = !!bindings?.value;
  const value = isBound ? boundValue ?? '' : localValue;
  const setValue = isBound ? setBoundValue : setLocalValue;

  if (type === 'multiple') {
    const selected = value ? value.split(',').filter(Boolean) : [];
    return (
      <ToggleGroup
        type="multiple"
        value={selected}
        className={props.className ?? undefined}
        onValueChange={(v) => {
          setValue(v.join(','));
          emit('change');
        }}
      >
        {items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup
      type="single"
      value={value}
      className={props.className ?? undefined}
      onValueChange={(v) => {
        if (v) {
          setValue(v);
          emit('change');
        }
      }}
    >
      {items.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value}>
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

// ── ButtonGroup ───────────────────────────────────────────────────────────────

export const ButtonGroupSchema = shadcnComponentDefinitions.ButtonGroup.props.extend(withClass);
export type ButtonGroupProps = z.output<typeof ButtonGroupSchema>;

export const ButtonGroup = ({ props, bindings, emit }: BaseComponentProps<ButtonGroupProps>) => {
  const buttons = props.buttons ?? [];
  const [boundSelected, setBoundSelected] = useBoundProp<string>(
    props.selected as string | undefined,
    bindings?.selected
  );
  const [localValue, setLocalValue] = useState(buttons[0]?.value ?? '');
  const isBound = !!bindings?.selected;
  const value = isBound ? boundSelected ?? '' : localValue;
  const setValue = isBound ? setBoundSelected : setLocalValue;

  return (
    <div
      className={cn('inline-flex rounded-md border border-border', props.className ?? undefined)}
    >
      {buttons.map((btn, i) => (
        <button
          key={btn.value}
          className={cn(
            'px-3 py-1.5 text-sm transition-colors',
            value === btn.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-background hover:bg-muted',
            i > 0 && 'border-l border-border',
            i === 0 && 'rounded-l-md',
            i === buttons.length - 1 && 'rounded-r-md'
          )}
          onClick={() => {
            setValue(btn.value);
            emit('change');
          }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────

export const PaginationSchema = shadcnComponentDefinitions.Pagination.props.extend(withClass);
export type PaginationProps = z.output<typeof PaginationSchema>;

export const Pagination = ({ props, bindings, emit }: BaseComponentProps<PaginationProps>) => {
  const [boundPage, setBoundPage] = useBoundProp<number>(
    props.page as number | undefined,
    bindings?.page
  );
  const currentPage = boundPage ?? 1;
  const totalPages = props.totalPages ?? 1;
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <PaginationPrimitive className={props.className ?? undefined}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                setBoundPage(currentPage - 1);
                emit('change');
              }
            }}
          />
        </PaginationItem>
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  setBoundPage(page);
                  emit('change');
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                setBoundPage(currentPage + 1);
                emit('change');
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationPrimitive>
  );
};


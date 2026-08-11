import * as React from 'react';

const CONTROL_ROW_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
const CONTROL_ROW_DURATION = 180;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function mergeIds(...ids: Array<string | undefined | null>) {
  const value = ids.filter(Boolean).join(' ');
  return value.length > 0 ? value : undefined;
}

type ControlRowContextValue = {
  controlId: string;
  labelId: string;
  descriptionId: string;
  messageId: string;
  describedBy?: string;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
};

const ControlRowContext = React.createContext<ControlRowContextValue | null>(null);

function useControlRowContext(componentName: string) {
  const context = React.useContext(ControlRowContext);

  if (!context) {
    throw new Error(`${componentName} must be used within <ControlRow.Root> or <ControlRow>.`);
  }

  return context;
}

function enhanceControlChild(
child: React.ReactNode,
context: ControlRowContextValue)
{
  if (!React.isValidElement(child) || child.type === React.Fragment) {
    return child;
  }

  const childProps = child.props as Record<string, unknown>;

  return React.cloneElement(child, {
    id: childProps.id ?? context.controlId,
    'aria-labelledby': mergeIds(
      childProps['aria-labelledby'] as string | undefined,
      context.labelId
    ),
    'aria-describedby': mergeIds(
      childProps['aria-describedby'] as string | undefined,
      context.describedBy
    ),
    'aria-invalid':
    childProps['aria-invalid'] ?? (context.invalid ? true : undefined),
    disabled: childProps.disabled ?? (context.disabled ? true : undefined),
    required: childProps.required ?? (context.required ? true : undefined)
  });
}

export interface ControlRowRootProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  controlId?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
}

const ControlRowRoot = React.forwardRef<HTMLDivElement, ControlRowRootProps>(
  function ControlRowRoot(
  {
    children,
    className,
    controlId,
    description,
    error,
    disabled = false,
    invalid = false,
    required = false,
    style,
    ...props
  },
  ref)
  {
    const reactId = React.useId();
    const safeId = reactId.replace(/:/g, '');
    const resolvedControlId = controlId ?? `control-${safeId}`;
    const labelId = `${resolvedControlId}-label`;
    const descriptionId = `${resolvedControlId}-description`;
    const messageId = `${resolvedControlId}-message`;

    const describedBy = mergeIds(
      description ? descriptionId : undefined,
      error ? messageId : undefined
    );

    const contextValue = React.useMemo<ControlRowContextValue>(
      () => ({
        controlId: resolvedControlId,
        labelId,
        descriptionId,
        messageId,
        describedBy,
        disabled,
        invalid,
        required
      }),
      [
      resolvedControlId,
      labelId,
      descriptionId,
      messageId,
      describedBy,
      disabled,
      invalid,
      required]

    );

    return (
      <ControlRowContext.Provider value={contextValue}>
        <div className={cn('w-full', className)}>
          <div
            ref={ref}
            role="group"
            aria-disabled={disabled || undefined}
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            data-disabled={disabled ? '' : undefined}
            data-invalid={invalid ? '' : undefined}
            style={{
              transitionTimingFunction: CONTROL_ROW_EASING,
              transitionDuration: `${CONTROL_ROW_DURATION}ms`,
              ...style
            }}
            className={cn(
              'group/control flex h-10 w-full items-center gap-2 rounded-[var(--r-md)] border px-2',
              'bg-[var(--bg-glass)] border-[var(--border-subtle)] shadow-[var(--sh-ctrl)]',
              'transition-[border-color,box-shadow,background-color,opacity]',
              !disabled &&
              'hover:shadow-[var(--sh-ctrl-hover)] focus-within:shadow-[var(--sh-ctrl-hover)] focus-within:border-[var(--border-mid)]',
              disabled && 'cursor-not-allowed opacity-55'
            )}
            {...props}>
            
            {children}
          </div>

          {(description || error) &&
          <div className="pl-8 pt-1">
              {description &&
            <p
              id={descriptionId}
              className="text-[11px] leading-4 text-[var(--text-lo)]">
              
                  {description}
                </p>
            }

              {error &&
            <p
              id={messageId}
              role="alert"
              className="text-[11px] leading-4 text-[var(--color-error,var(--text-lo))]">
              
                  {error}
                </p>
            }
            </div>
          }
        </div>
      </ControlRowContext.Provider>);

  }
);

export interface ControlRowIconProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ControlRowIcon = React.forwardRef<HTMLDivElement, ControlRowIconProps>(
  function ControlRowIcon({ children, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[var(--r-sm)]',
          'bg-[var(--bg-icon)] text-[var(--text-mid)]',
          'transition-[color,background-color,transform] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-hover/control:text-[var(--text-hi)] group-focus-within/control:text-[var(--text-hi)]',
          '[&>svg]:h-[14px] [&>svg]:w-[14px] [&>svg]:shrink-0',
          className
        )}
        {...props}>
        
        {children}
      </div>);

  }
);

export interface ControlRowLabelProps extends
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  primary: string;
  secondary?: string;
  widthClassName?: string;
}

const ControlRowLabel = React.forwardRef<HTMLLabelElement, ControlRowLabelProps>(
  function ControlRowLabel(
  { primary, secondary, widthClassName, className, ...props },
  ref)
  {
    const { controlId, labelId, disabled, required } =
    useControlRowContext('ControlRow.Label');

    const hasSecondary = Boolean(secondary);
    const accessibleLabel = required ? `${primary} *` : primary;

    return (
      <label
        ref={ref}
        id={labelId}
        htmlFor={controlId}
        title={secondary ?? primary}
        className={cn(
          'relative flex h-full shrink-0 select-none items-center overflow-hidden',
          'basis-[72px] min-w-[56px] max-w-[112px]',
          'text-[11px] font-medium leading-none',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          widthClassName,
          className
        )}
        {...props}>
        
        <span className="sr-only">{accessibleLabel}</span>

        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 flex items-center whitespace-nowrap',
            'text-[var(--text-mid)]',
            'transition-[opacity,transform,color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            hasSecondary &&
            'group-hover/control:-translate-y-1 group-hover/control:opacity-0 group-focus-within/control:-translate-y-1 group-focus-within/control:opacity-0 motion-reduce:transform-none'
          )}>
          
          {primary}
        </span>

        {hasSecondary &&
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-0 left-0 flex items-center whitespace-nowrap',
            'translate-y-1 opacity-0 text-[var(--text-lo)]',
            'transition-[opacity,transform,color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            'group-hover/control:translate-y-0 group-hover/control:opacity-100',
            'group-focus-within/control:translate-y-0 group-focus-within/control:opacity-100',
            'motion-reduce:transform-none'
          )}>
          
            {secondary}
          </span>
        }
      </label>);

  }
);

export interface ControlRowSeparatorProps extends
  React.HTMLAttributes<HTMLDivElement> {}

const ControlRowSeparator = React.forwardRef<
  HTMLDivElement,
  ControlRowSeparatorProps>(
  function ControlRowSeparator({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'mx-1 h-4 w-px shrink-0',
          'bg-gradient-to-b from-transparent via-[var(--border-mid)] to-transparent',
          className
        )}
        {...props} />);


  });

export interface ControlRowContentProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ControlRowContent = React.forwardRef<HTMLDivElement, ControlRowContentProps>(
  function ControlRowContent({ children, className, ...props }, ref) {
    const context = useControlRowContext('ControlRow.Content');
    const childArray = React.Children.toArray(children);

    const content =
    childArray.length === 1 ?
    enhanceControlChild(childArray[0], context) :
    children;

    return (
      <div
        ref={ref}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2',
          '[&_input]:min-w-0 [&_select]:min-w-0 [&_textarea]:min-w-0',
          className
        )}
        {...props}>
        
        {content}
      </div>);

  }
);

export interface ControlRowProps extends
  Omit<ControlRowRootProps, 'children'> {
  icon?: React.ReactNode;
  labelPrimary: string;
  labelSecondary?: string;
  labelWidthClassName?: string;
  children: React.ReactNode;
}

const ControlRowPrimitive = React.forwardRef<HTMLDivElement, ControlRowProps>(
  function ControlRow(
  {
    icon,
    labelPrimary,
    labelSecondary,
    labelWidthClassName,
    children,
    ...props
  },
  ref)
  {
    return (
      <ControlRowRoot ref={ref} {...props}>
        {icon ? <ControlRowIcon>{icon}</ControlRowIcon> : null}
        <ControlRowLabel
          primary={labelPrimary}
          secondary={labelSecondary}
          widthClassName={labelWidthClassName} />
        
        <ControlRowSeparator />
        <ControlRowContent>{children}</ControlRowContent>
      </ControlRowRoot>);

  }
);

type ControlRowComponent = typeof ControlRowPrimitive & {
  Root: typeof ControlRowRoot;
  Icon: typeof ControlRowIcon;
  Label: typeof ControlRowLabel;
  Separator: typeof ControlRowSeparator;
  Content: typeof ControlRowContent;
};

export const ControlRow = Object.assign(ControlRowPrimitive, {
  Root: ControlRowRoot,
  Icon: ControlRowIcon,
  Label: ControlRowLabel,
  Separator: ControlRowSeparator,
  Content: ControlRowContent
}) as ControlRowComponent;
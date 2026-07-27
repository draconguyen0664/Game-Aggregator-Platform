"use client";

import {
  forwardRef,
  useEffect,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
} from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import * as RadixSelect from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "ga-control inline-flex h-9 items-center justify-center gap-2 px-3 text-sm font-medium disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--ga-primary)] text-[var(--ga-primary-foreground)] hover:bg-[var(--ga-primary-hover)]",
        secondary:
          "bg-[var(--ga-secondary)] text-[var(--ga-secondary-foreground)] hover:brightness-95",
        outline: "hover:bg-[var(--ga-surface-muted)]",
        ghost: "border-transparent bg-transparent hover:bg-[var(--ga-surface-muted)]",
        danger:
          "border-transparent bg-[var(--ga-danger)] text-white hover:brightness-90",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-9 px-3",
        lg: "h-10 px-4",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & FieldProps
>(({ className, label, hint, error, id, ...props }, ref) => {
  const inputId = id ?? props.name;
  const descriptionId = inputId ? `${inputId}-description` : undefined;
  return (
    <label className="grid gap-1.5 text-sm" htmlFor={inputId}>
      {label && <span className="font-medium">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? descriptionId : undefined}
        className={cn("ga-control w-full px-3", className)}
        {...props}
      />
      {(error || hint) && (
        <span
          id={descriptionId}
          className={cn(
            "text-xs text-[var(--ga-muted-foreground)]",
            error && "text-[var(--ga-danger)]",
          )}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  );
});
Input.displayName = "Input";

export interface SelectOption { label: string; value: string; disabled?: boolean; description?: string; }
export interface SelectProps extends FieldProps {
  options: SelectOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  name?: string; id?: string; placeholder?: string; disabled?: boolean; required?: boolean;
  ariaLabel?: string; className?: string; triggerClassName?: string; size?: "sm" | "md";
}
export const Select = forwardRef<HTMLButtonElement, SelectProps>(({ className, triggerClassName, label, hint, error, options, id, name, placeholder="Select an option", size="md", ariaLabel, ...props }, ref) => {
  const selectId=id??name; const descriptionId=selectId?`${selectId}-description`:undefined;
  return <div className={cn("grid gap-1.5 text-sm",className)}>
    {label&&<label className="font-medium" htmlFor={selectId}>{label}</label>}
    <RadixSelect.Root {...props} name={name}>
      <RadixSelect.Trigger ref={ref} id={selectId} aria-label={ariaLabel??label} aria-invalid={Boolean(error)} aria-describedby={error||hint?descriptionId:undefined} className={cn("ga-control group inline-flex w-full items-center justify-between gap-2 px-3 text-left shadow-sm data-[placeholder]:text-[var(--ga-muted-foreground)] data-[state=open]:border-[var(--ga-ring)] data-[state=open]:ring-3 data-[state=open]:ring-[color-mix(in_oklch,var(--ga-ring)_18%,transparent)]",size==="sm"?"h-8 text-xs":"h-9 text-sm",triggerClassName)}>
        <RadixSelect.Value placeholder={placeholder}/><RadixSelect.Icon><ChevronDown className="size-4 text-[var(--ga-muted-foreground)] transition-transform group-data-[state=open]:rotate-180"/></RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal><RadixSelect.Content position="popper" sideOffset={6} collisionPadding={12} className="z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-[var(--ga-border)] bg-[var(--ga-surface)] text-[var(--ga-foreground)] shadow-[var(--ga-shadow-md)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <RadixSelect.ScrollUpButton className="flex h-7 items-center justify-center"><ChevronUp className="size-4"/></RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="max-h-[min(20rem,var(--radix-select-content-available-height))] p-1.5">{options.map(option=><RadixSelect.Item key={option.value} value={option.value} disabled={option.disabled} className="relative flex min-h-9 cursor-default select-none items-center rounded-lg py-2 pl-9 pr-3 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[highlighted]:bg-[var(--ga-surface-muted)] data-[highlighted]:text-[var(--ga-foreground)]"><span className="absolute left-2.5 grid size-4 place-items-center"><RadixSelect.ItemIndicator><Check className="size-4 text-[var(--ga-primary)]"/></RadixSelect.ItemIndicator></span><span><RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>{option.description&&<span className="mt-0.5 block text-xs text-[var(--ga-muted-foreground)]">{option.description}</span>}</span></RadixSelect.Item>)}</RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="flex h-7 items-center justify-center"><ChevronDown className="size-4"/></RadixSelect.ScrollDownButton>
      </RadixSelect.Content></RadixSelect.Portal>
    </RadixSelect.Root>
    {(error||hint)&&<span id={descriptionId} className={cn("text-xs text-[var(--ga-muted-foreground)]",error&&"text-[var(--ga-danger)]")}>{error??hint}</span>}
  </div>;
});
Select.displayName = "Select";

export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[var(--ga-radius-md)] border border-[var(--ga-border)]">
      <table
        className={cn(
          "w-full border-collapse text-left text-sm [&_td]:border-t [&_td]:border-[var(--ga-border)] [&_td]:p-3 [&_th]:bg-[var(--ga-surface-muted)] [&_th]:p-3 [&_th]:font-medium",
          className,
        )}
        {...props}
      />
    </div>
  );
}

interface OverlayProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

function useEscape(onClose: () => void) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [onClose]);
}

export function Modal({ open, title, onClose, children }: OverlayProps) {
  useEscape(onClose);
  if (!open) return null;
  return (
    <div className="ga-overlay place-items-center p-4" onMouseDown={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="ga-dialog w-full max-w-lg rounded-[var(--ga-radius-lg)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <OverlayHeader title={title} onClose={onClose} />
        <div className="p-4">{children}</div>
      </section>
    </div>
  );
}

export function Drawer({ open, title, onClose, children }: OverlayProps) {
  useEscape(onClose);
  if (!open) return null;
  return (
    <div className="ga-overlay justify-items-end" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="ga-dialog h-full w-full max-w-md"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <OverlayHeader title={title} onClose={onClose} />
        <div className="p-4">{children}</div>
      </aside>
    </div>
  );
}

function OverlayHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--ga-border)] px-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
        <X aria-hidden="true" />
      </Button>
    </header>
  );
}

export interface Tab {
  id: string;
  label: string;
}

export function Tabs({
  tabs,
  value,
  onValueChange,
}: {
  tabs: Tab[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      className="flex gap-1 border-b border-[var(--ga-border)]"
    >
      {tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          key={tab.id}
          aria-selected={tab.id === value}
          onClick={() => onValueChange(tab.id)}
          className={cn(
            "border-b-2 border-transparent px-3 py-2 text-sm text-[var(--ga-muted-foreground)]",
            tab.id === value &&
              "border-[var(--ga-primary)] font-medium text-[var(--ga-foreground)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral:
          "bg-[var(--ga-secondary)] text-[var(--ga-secondary-foreground)]",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-48 place-items-center p-6 text-center">
      <div className="grid max-w-sm justify-items-center gap-2">
        {icon && <div className="text-[var(--ga-muted-foreground)]">{icon}</div>}
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--ga-muted-foreground)]">
            {description}
          </p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-4 rounded-[var(--ga-radius-sm)] bg-[var(--ga-surface-muted)] [animation:ga-pulse_1.5s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    />
  );
}

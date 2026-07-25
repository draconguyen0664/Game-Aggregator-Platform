"use client";

import {
  forwardRef,
  useEffect,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TableHTMLAttributes,
} from "react";
import { X } from "lucide-react";
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

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> &
    FieldProps & { options: Array<{ label: string; value: string }> }
>(({ className, label, hint, error, options, id, ...props }, ref) => {
  const selectId = id ?? props.name;
  return (
    <label className="grid gap-1.5 text-sm" htmlFor={selectId}>
      {label && <span className="font-medium">{label}</span>}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={cn("ga-control w-full px-3", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || hint) && (
        <span
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

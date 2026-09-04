import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

/* ============================================================================
   Admin form controls — lightweight, accessible inputs for the content system.
   Styled to match the public design system (accent focus rings, primary text).
   ========================================================================== */

const labelCls = 'text-sm font-medium text-primary-900'
const baseControl =
  'w-full rounded-none border bg-surface px-4 text-base text-primary-950 ' +
  'placeholder:text-concrete transition-colors duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-accent-400 ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

function errorControl(error?: string) {
  return error
    ? 'border-red-500 focus:border-red-500'
    : 'border-primary-200 hover:border-primary-300 focus:border-accent-400'
}

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelCls}>
        {label}
        {required && (
          <span className="ml-1 text-accent-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {(hint || error) && (
        <p
          className={cn(
            'text-xs',
            error ? 'font-medium text-red-600' : 'text-concrete',
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

/* ---- Input ---- */
interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'id'> {
  id: string
  label: string
  error?: string
  hint?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export function TextInput({
  id,
  label,
  error,
  hint,
  required,
  value,
  onChange,
  className,
  ...rest
}: TextInputProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(baseControl, errorControl(error), 'h-12', className)}
        {...rest}
      />
    </FieldShell>
  )
}

/* ---- Textarea ---- */
interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'id'> {
  id: string
  label: string
  error?: string
  hint?: string
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}

export function TextArea({
  id,
  label,
  error,
  hint,
  required,
  value,
  onChange,
  rows = 4,
  className,
  ...rest
}: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(baseControl, errorControl(error), 'py-3 resize-y', className)}
        {...rest}
      />
    </FieldShell>
  )
}

/* ---- Select ---- */
interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'id'> {
  id: string
  label: string
  error?: string
  hint?: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({
  id,
  label,
  error,
  hint,
  required,
  value,
  onChange,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(
          baseControl,
          errorControl(error),
          'h-12 cursor-pointer appearance-none pr-10',
          !value && 'text-concrete',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-primary-950">
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

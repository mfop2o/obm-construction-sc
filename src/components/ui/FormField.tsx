import type { ChangeEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/* ============================================================================
   FormField — accessible design-system form control.
   Wraps a labelled input/select/textarea with supporting hint and inline
   validation (error) states, wired to aria-describedby + aria-invalid.
   ========================================================================== */

type FieldType = 'text' | 'email' | 'tel'

interface FormFieldProps {
  id: string
  label: string
  type?: FieldType
  as?: 'input' | 'textarea' | 'select'
  value: string
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  onBlur?: () => void
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  autoComplete?: string
  rows?: number
  select?: boolean
  selectOptions?: string[]
  className?: string
  /** Side-by-side field (used in the two-column grid). */
  labelHidden?: boolean
  icon?: ReactNode
}

const baseControl =
  'w-full rounded-none border bg-white px-4 text-base text-primary-950 ' +
  'placeholder:text-concrete transition-colors duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-accent-400 ' +
  'disabled:cursor-not-allowed disabled:opacity-60'

const stateControl = (error?: string) =>
  error
    ? 'border-red-500 focus:border-red-500'
    : 'border-primary-200 hover:border-primary-300 focus:border-accent-400'

export function FormField({
  id,
  label,
  type = 'text',
  as = 'input',
  value,
  onChange,
  onBlur,
  placeholder,
  hint,
  error,
  required,
  autoComplete,
  rows = 6,
  select = false,
  selectOptions = [],
  className,
  labelHidden = false,
}: FormFieldProps) {
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const commonProps = {
    id,
    name: id,
    value,
    onChange,
    onBlur,
    placeholder,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-medium text-primary-900',
          labelHidden && 'sr-only',
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-accent-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...commonProps}
          rows={rows}
          className={cn(baseControl, stateControl(error), 'py-3.5 resize-none')}
        />
      ) : select ? (
        <div className="relative">
          <select
            {...commonProps}
            value={value}
            className={cn(
              baseControl,
              stateControl(error),
              'h-14 appearance-none py-0 pr-10 cursor-pointer',
              !value && 'text-concrete',
            )}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {selectOptions.map((option) => (
              <option key={option} value={option} className="text-primary-950">
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-concrete"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      ) : (
        <input
          {...commonProps}
          type={type}
          autoComplete={autoComplete}
          className={cn(baseControl, stateControl(error), 'h-14')}
        />
      )}

      {(hint || error) && (
        <p
          id={error ? `${id}-error` : `${id}-hint`}
          className={cn(
            'text-sm',
            error ? 'font-medium text-red-600' : 'text-concrete',
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

export default FormField

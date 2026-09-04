import { useState, type ReactNode } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { cn } from '../../lib/cn'

/* ============================================================================
   Row actions for admin tables — icon-only buttons.
   EditButton triggers an edit; DeleteButton runs a two-step inline confirm
   (trash icon → check + x) so single misplaced clicks never delete data.
   ========================================================================== */

const iconButtonBase =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ' +
  'transition-colors duration-200 select-none cursor-pointer ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ' +
  'focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40'

const tones = {
  default: 'text-primary-800 hover:bg-primary-100 hover:text-primary-950',
  danger: 'text-concrete hover:bg-red-50 hover:text-red-600',
  solid: 'bg-red-600 text-white hover:bg-red-700',
} as const

interface IconButtonProps {
  label: string
  onClick: () => void
  tone?: keyof typeof tones
  disabled?: boolean
  children: ReactNode
}

function IconButton({
  label,
  onClick,
  tone = 'default',
  disabled,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(iconButtonBase, tones[tone])}
    >
      {children}
    </button>
  )
}

export function EditButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <IconButton label={label} onClick={onClick} disabled={disabled}>
      <Pencil className="h-4 w-4" aria-hidden="true" />
    </IconButton>
  )
}

export function DeleteButton({
  label,
  onDelete,
}: {
  label: string
  onDelete: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <IconButton
        label={label}
        tone="danger"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    )
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <IconButton
        label="Confirm delete"
        tone="solid"
        onClick={() => {
          setConfirming(false)
          onDelete()
        }}
      >
        <Check className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton label="Cancel" onClick={() => setConfirming(false)}>
        <X className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </span>
  )
}

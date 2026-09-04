export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const parts: string[] = []

  const walk = (value: ClassValue): void => {
    if (!value && value !== 0) return
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    parts.push(String(value).trim())
  }

  inputs.forEach(walk)
  return parts.filter(Boolean).join(' ')
}

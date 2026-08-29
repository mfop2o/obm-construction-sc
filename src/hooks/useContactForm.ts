import { useState, type FormEvent } from 'react'

/* ============================================================================
   useContactForm — lightweight form state + validation for the contact page.
   Carries values, per-field errors, touched-state and submit handling with
   an async simulation of an API call (placeholder).
   ========================================================================== */

export interface ContactFormValues {
  name: string
  email: string
  phone: string
  projectType: string
  message: string
}

export type ContactFormErrors = Partial<
  Record<keyof ContactFormValues, string>
>

type FieldKey = keyof ContactFormValues

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({})
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  function validate(
    formValues: ContactFormValues,
  ): ContactFormErrors {
    const next: ContactFormErrors = {}

    if (!formValues.name.trim()) {
      next.name = 'Please enter your name'
    } else if (formValues.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters'
    }

    if (!formValues.email.trim()) {
      next.email = 'Please enter your email address'
    } else if (!emailPattern.test(formValues.email.trim())) {
      next.email = 'Please enter a valid email address'
    }

    if (formValues.phone && !/^[+\d][\d\s\-()]{6,}$/.test(formValues.phone.trim())) {
      next.phone = 'Please enter a valid phone number'
    }

    if (!formValues.projectType) {
      next.projectType = 'Please select a project type'
    }

    if (!formValues.message.trim()) {
      next.message = 'Please tell us about your project'
    } else if (formValues.message.trim().length < 20) {
      next.message = 'Please provide a little more detail (20+ characters)'
    }

    return next
  }

  function handleChange(field: FieldKey, value: string) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    // Re-validate fields that have already been touched (or the current one)
    if (touched[field]) {
      setErrors(validate(nextValues))
    }
  }

  function handleBlur(field: FieldKey) {
    const nextTouched = { ...touched, [field]: true }
    setTouched(nextTouched)
    setErrors(validate(values))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      phone: true,
      projectType: true,
      message: true,
    })

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('submitting')

    // Placeholder — replace with a real API/email submission endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Simulated success path.
    setStatus('success')
    // Uncomment to simulate a server failure path:
    // setStatus('error')
  }

  function reset() {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  return {
    values,
    errors,
    touched,
    status,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  }
}

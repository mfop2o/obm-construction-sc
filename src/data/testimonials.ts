/* ============================================================================
   PLACEHOLDER DATA — Client testimonials.
   These are fictional examples for layout purposes. Replace with real,
   attributed client feedback (with permission) before launch.
   ========================================================================== */

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'OBM delivered our project on time and to a standard that exceeded our expectations. Their engineering discipline was evident at every stage.',
    name: 'Client Name',
    role: 'Project Director',
    company: 'Organization',
  },
  {
    id: 't2',
    quote:
      'From planning to handover, their team demonstrated professionalism, transparency and a genuine commitment to quality.',
    name: 'Client Name',
    role: 'Managing Director',
    company: 'Organization',
  },
  {
    id: 't3',
    quote:
      'Safety, quality and integrity — OBM brings real engineering expertise to the Ethiopian built environment.',
    name: 'Client Name',
    role: 'Chief Architect',
    company: 'Organization',
  },
]

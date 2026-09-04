/* ============================================================================
   PLACEHOLDER DATA — OBM Construction S.C. Careers page.

   IMPORTANT: Role titles, departments, locations and benefit/values copy
   below are PLACEHOLDERS created for layout review. Replace with real OBM
   open roles and verified benefits/culture content before launch. Role links
   should point to the real application process (form/email) when available.
   ========================================================================== */

export interface Opening {
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Contract'
  blurb: string
}

export const openings: Opening[] = [
  {
    title: 'Site Engineer',
    department: 'Construction',
    location: 'Addis Ababa',
    type: 'Full-time',
    blurb:
      'Join our site teams to manage quality, safety and schedule on live construction projects.',
  },
  {
    title: 'Project Engineer',
    department: 'Engineering',
    location: 'Addis Ababa',
    type: 'Full-time',
    blurb:
      'Support design coordination, planning and technical delivery across multiple projects.',
  },
  {
    title: 'Quantity Surveyor',
    department: 'Commercial',
    location: 'Addis Ababa',
    type: 'Full-time',
    blurb:
      'Own cost estimation, measurement and commercial control across the project portfolio.',
  },
  {
    title: 'Health, Safety & Environment Officer',
    department: 'HSE',
    location: 'Field based',
    type: 'Full-time',
    blurb:
      'Champion safety on site and embed a strong HSE culture across our operations.',
  },
]

export const careersValues = [
  {
    title: 'Do work that lasts',
    text: 'Every project is a permanent contribution to Ethiopia’s built environment.',
  },
  {
    title: 'Answerable to each other',
    text: 'A flat, accountable culture where every voice is heard on site and in the office.',
  },
  {
    title: 'Grow with the build',
    text: 'Clear paths to progress from engineer to project leadership.',
  },
]

export const careersBenefits = [
  'Competitive project-based compensation',
  'Health insurance cover',
  'Structured safety training and PPE',
  'Career development and mentoring',
  'Field and office opportunities across Ethiopia',
]

/* ============================================================================
   PLACEHOLDER DATA — OBM Construction S.C. Contact page.

   IMPORTANT: Email, phone numbers, addresses and office details below are
   PLACEHOLDERS. Replace with verified OBM Construction contact information
   before launch.
   ========================================================================== */

export interface Office {
  name: string
  address: string[]
  city: string
  phone: string
  email: string
}

export const contactInfo = {
  phone: '+251 11 000 0000',
  email: 'info@obmconstruction.com',
  addressLine1: 'Bole Road, Addis Ababa',
  addressLine2: 'Ethiopia',
}

export const projectTypes: string[] = [
  'Commercial Building',
  'Residential Building',
  'Roads & Infrastructure',
  'Renovation & Maintenance',
  'Engineering & Project Management',
  'Other',
]

export const offices: Office[] = [
  {
    name: 'Head Office',
    address: ['Bole Road', 'Addis Ababa'],
    city: 'Addis Ababa, Ethiopia',
    phone: '+251 11 000 0000',
    email: 'info@obmconstruction.com',
  },
  {
    name: 'Addis Regional Office',
    address: ['Addis Ababa, Ethiopia'],
    city: 'Addis Ababa',
    phone: '+251 11 000 0000',
    email: 'addis@obmconstruction.com',
  },
]

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

/* ============================================================================
   VERIFIED — OBM Construction head-office location.
   Address confirmed from obmconstructionsc.com ("Biftu Tower 5th and 6th
   Floor, Mexico, in front of Addis Ababa Commerce University").
   Coordinates come from OpenStreetMap way 59097616 ("Biftu Building",
   Lideta sub-city): Lat 9.013986 / Lon 38.749107 (cross-checked on
   addismap.com and mapcarta.com).
   ========================================================================== */

export interface HeadOfficeLocation {
  company: string
  building: string
  floors: string
  district: string
  city: string
  lat: number
  lng: number
  embedUrl: string
  directionsUrl: string
}

function googleMapsEmbedUrl(lat: number, lng: number, zoom = 17): string {
  return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=${zoom}&output=embed`
}

function googleMapsDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
}

export const headOffice: HeadOfficeLocation = {
  company: 'OBM Construction S.C.',
  building: 'Biftu Tower',
  floors: '5th & 6th Floor',
  district: 'Mexico',
  city: 'Addis Ababa, Ethiopia',
  lat: 9.013986,
  lng: 38.749107,
  embedUrl: googleMapsEmbedUrl(9.013986, 38.749107),
  directionsUrl: googleMapsDirectionsUrl(9.013986, 38.749107),
}

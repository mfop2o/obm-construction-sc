/* ============================================================================
   PLACEHOLDER DATA — Company statistics.

   IMPORTANT: These values are placeholders so the design can be reviewed.
   Replace them with REAL verified figures from OBM Construction S.C.
   before launch. Do not publish placeholder numbers as fact.
   ========================================================================== */

export interface StatItem {
  id: string
  value: number
  suffix?: string
  label: string
}

export const companyStats: StatItem[] = [
  { id: 'years', value: 15, suffix: '+', label: 'Years of experience' },
  { id: 'projects', value: 120, suffix: '+', label: 'Projects delivered' },
  { id: 'sqm', value: 500, suffix: 'K+', label: 'Square meters built' },
  { id: 'staff', value: 300, suffix: '+', label: 'Engineers & staff' },
]

/* ============================================================================
   PLACEHOLDER DATA — OBM Construction services.

   NOTE: Service titles are defined by the brief. Descriptions, overviews and
   capability lists below are PLACEHOLDER copy written for layout review —
   replace with real, verified OBM service profiles before launch.
   ========================================================================== */

import type { VisualKey } from '../components/projects/ProjectVisual'

export interface Service {
  /** Stable id — used for icons and anchors. */
  id: string
  title: string
  /** Short summary used on cards and the homepage preview. */
  description: string
  /** Longer editorial copy for the services page. */
  overview: string
  /** Which SVG visual represents this service. */
  image: VisualKey
  /** Which photograph (key into serviceImages registry) represents this service. */
  imageKey: string
  /** Core capabilities offered under this service. */
  capabilities: string[]
}

export const services: Service[] = [
  {
    id: 'building',
    title: 'Building Construction',
    description:
      'Commercial and residential buildings delivered to structural and safety standards.',
    overview:
      'We construct commercial and residential buildings end to end — from foundations and structure to finishes. Our teams combine rigorous engineering with disciplined site management to deliver quality buildings on time and on budget.',
    image: 'facade',
    imageKey: 'building',
    capabilities: [
      'Commercial building construction',
      'Residential and apartment blocks',
      'Reinforced concrete structures',
      'Shell & core delivery',
      'Internal fit-out and finishes',
    ],
  },
  {
    id: 'civil',
    title: 'Civil & Infrastructure',
    description:
      'Foundations, earthworks and structural works executed with engineering precision.',
    overview:
      'Our civil engineering capability covers foundations, earthworks, drainage and heavy structural works. We bring the machinery, methodology and oversight to handle complex ground conditions and large-scale civil delivery.',
    image: 'framework',
    imageKey: 'civil',
    capabilities: [
      'Deep foundations and piling',
      'Earthworks and grading',
      'Drainage and storm-water systems',
      'Retaining structures',
      'Public infrastructure works',
    ],
  },
  {
    id: 'roads',
    title: 'Road Construction',
    description:
      'Road corridors, asphalt and associated works delivered on schedule.',
    overview:
      'We build road corridors that move people and goods safely and reliably. From earthworks and sub-base to asphalt surfacing, signage and drainage, we deliver roads built to last.',
    image: 'road',
    imageKey: 'roads',
    capabilities: [
      'Urban and regional road construction',
      'Earthworks and sub-base',
      'Asphalt and concrete surfacing',
      'Drainage and culverts',
      'Road safety and signage',
    ],
  },
  {
    id: 'engineering',
    title: 'Engineering & Project Management',
    description:
      'Design, planning and end-to-end delivery management with full control.',
    overview:
      'Beyond building, we engineer and manage. Our teams provide design coordination, planning, cost control and site supervision that keep complex projects disciplined, safe and on schedule from brief to handover.',
    image: 'crane',
    imageKey: 'engineering',
    capabilities: [
      'Construction planning & scheduling',
      'Cost estimation & control',
      'Design coordination',
      'Site supervision & QA/QC',
      'Health, safety & quality management',
    ],
  },
  {
    id: 'renovation',
    title: 'Renovation & Maintenance',
    description:
      'Modernization and structural strengthening of existing buildings.',
    overview:
      'We renew existing buildings through renovation, modernization and structural strengthening. Working within live environments, we upgrade performance and appearance while protecting occupants and operations.',
    image: 'facade',
    imageKey: 'renovation',
    capabilities: [
      'Building renovation & modernization',
      'Structural strengthening',
      'Facade restoration',
      'Interior refurbishment',
      'Preventive maintenance',
    ],
  },
  {
    id: 'design',
    title: 'Design & Construction Solutions',
    description:
      'Integrated design-and-build solutions from concept to completion.',
    overview:
      'A single accountable partner from the first concept to the final key. Our integrated design-and-build approach aligns architecture, engineering and construction for faster, higher-quality and lower-risk delivery.',
    image: 'framework',
    imageKey: 'design',
    capabilities: [
      'Design & build delivery',
      'Value engineering',
      'Concept to completion',
      'Alternative contracting models',
      'Turnkey project solutions',
    ],
  },
]

/** Returns a service by id. */
export const getServiceById = (id: string) => services.find((s) => s.id === id)

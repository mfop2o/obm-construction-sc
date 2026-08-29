/* ============================================================================
   Centralized image registry — the SINGLE source of truth for all photography.

   Files live under src/assets/images/ organised by purpose:
     hero/ · about/ · services/ · projects/ · backgrounds/

   All imagery is temporary Unsplash photography (architectural & construction)
   used during development so the design can be reviewed at a premium level.

   TO REPLACE WITH REAL OBM PHOTOGRAPHY:
     1. Drop your photos into the matching src/assets/images/<folder>/.
     2. Update the import path below for the relevant entry.
   Nothing else in the app needs to change — every component reads from here.
   ========================================================================== */

import heroConstruction from '../assets/images/hero/hero-construction.jpg'
import aboutBuild from '../assets/images/about/about-build.jpg'
import ctaBackground from '../assets/images/backgrounds/cta.jpg'

import serviceBuilding from '../assets/images/services/service-building.jpg'
import serviceCivil from '../assets/images/services/service-civil.jpg'
import serviceRoads from '../assets/images/services/service-roads.jpg'
import serviceEngineering from '../assets/images/services/service-engineering.jpg'
import serviceRenovation from '../assets/images/services/service-renovation.jpg'
import serviceDesign from '../assets/images/services/service-design.jpg'

import projectBatiMarket from '../assets/images/projects/project-bati-market.jpg'
import projectKeranyoRoads from '../assets/images/projects/project-keranyo-roads.jpg'
import projectDebrezeit from '../assets/images/projects/project-debrezeit.jpg'
import projectYeka from '../assets/images/projects/project-yeka.jpg'
import projectBole from '../assets/images/projects/project-bole.jpg'
import projectSabeta from '../assets/images/projects/project-sabeta.jpg'
import projectMetu from '../assets/images/projects/project-metu.jpg'
import projectAwash from '../assets/images/projects/project-awash.jpg'

export const heroImages = {
  construction: heroConstruction,
}

export const aboutImages = {
  build: aboutBuild,
}

export const backgroundImages = {
  cta: ctaBackground,
}

export const serviceImages: Record<string, string> = {
  building: serviceBuilding,
  civil: serviceCivil,
  roads: serviceRoads,
  engineering: serviceEngineering,
  renovation: serviceRenovation,
  design: serviceDesign,
}

/** Keyed by project slug so the gallery stays data-driven. */
export const projectImages: Record<string, string> = {
  'bati-regional-market': projectBatiMarket,
  'keranyo-urban-roads': projectKeranyoRoads,
  'debre-zeit-commercial-complex': projectDebrezeit,
  'yeka-residential-blocks': projectYeka,
  'bole-district-renewal': projectBole,
  'sabeta-road-upgrade': projectSabeta,
  'metu-commercial-offices': projectMetu,
  'awash-housing-neighbourhood': projectAwash,
}

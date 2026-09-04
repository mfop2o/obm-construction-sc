/* ============================================================================
   PLACEHOLDER DATA — OBM Construction S.C. About page.

   IMPORTANT: All company history, mission, vision, value descriptions, team
   member names/roles and milestone facts below are PLACEHOLDERS for layout
   review. Replace with REAL, verified information about OBM Construction
   (with team-member permission for names/photos) before launch.
   ========================================================================== */

import teamCeo from '../assets/images/team/team-ceo.jpg'
import teamMd from '../assets/images/team/team-md.jpg'
import teamEng from '../assets/images/team/team-eng.jpg'
import teamOps from '../assets/images/team/team-ops.jpg'
import teamConst from '../assets/images/team/team-const.jpg'
import teamProj from '../assets/images/team/team-proj.jpg'

export interface ValueItem {
  title: string
  description: string
}

export const companyStory = [
  'OBM Construction S.C. was established to bring disciplined engineering and dependable delivery to Ethiopia\u2019s built environment. Every project is an opportunity to demonstrate quality, safety and integrity.',
  'From the first foundation to the completed structure, our teams combine technical rigour with a deep commitment to the communities we build for. We measure success not just in buildings, but in trust earned.',
]

export const mission =
  'To deliver safe, quality construction projects on time and on budget, creating lasting value for our clients, our people and the communities we serve across Ethiopia.'

export const vision =
  'To be the most trusted and respected construction company in Ethiopia, recognised for engineering excellence, integrity and enduring results.'

export const coreValues: ValueItem[] = [
  {
    title: 'Safety',
    description:
      'Every decision protects the wellbeing of our people and the public. Safety is non-negotiable.',
  },
  {
    title: 'Quality',
    description:
      'We hold every material, detail and process to the highest construction standard.',
  },
  {
    title: 'Integrity',
    description:
      'We do what we say, communicate honestly and build relationships on trust.',
  },
  {
    title: 'Reliability',
    description:
      'We plan carefully and deliver on time — our clients can depend on us.',
  },
  {
    title: 'Engineering Excellence',
    description:
      'Rigorous analysis and precise execution underpin everything we build.',
  },
]

export interface TeamMember {
  name: string
  role: string
  /**
   * Portrait photograph (imported asset path). Leave empty to fall back to an
   * initial-based avatar. To add a photo:
   *   1. Drop the portrait into src/assets/images/team/.
   *   2. `import photo from '../assets/images/team/<filename>'`
   *   3. Set `photo` here (e.g. `photo: ceoPortrait`).
   */
  photo?: string
}

export const leadership: TeamMember[] = [
  {
    name: 'Name Placeholder',
    role: 'Chief Executive Officer',
    photo: teamCeo,
  },
  { name: 'Name Placeholder', role: 'Managing Director', photo: teamMd },
  { name: 'Name Placeholder', role: 'Head of Engineering', photo: teamEng },
  { name: 'Name Placeholder', role: 'Director of Operations', photo: teamOps },
  { name: 'Name Placeholder', role: 'Head of Construction', photo: teamConst },
  { name: 'Name Placeholder', role: 'Head of Projects', photo: teamProj },
]

export interface Milestone {
  year: string
  title: string
  description: string
}

export const milestones: Milestone[] = [
  {
    year: '2010',
    title: 'OBM Construction founded',
    description: 'Company incorporated in Ethiopia to deliver quality construction.',
  },
  {
    year: '2014',
    title: 'First large-scale build',
    description: 'Delivered a landmark commercial project, establishing our reputation.',
  },
  {
    year: '2018',
    title: 'Expanded engineering team',
    description: 'Grew our in-house engineering and project-management capability.',
  },
  {
    year: '2021',
    title: 'Infrastructure division',
    description: 'Formalised a dedicated roads and infrastructure practice.',
  },
  {
    year: '2024',
    title: 'Continued growth',
    description: 'Building across commercial, residential and infrastructure sectors.',
  },
]

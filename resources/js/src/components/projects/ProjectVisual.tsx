import type { CSSProperties } from 'react'
import {
  BuildingFacade,
  CraneScene,
  Framework,
  RoadWorks,
} from '../visuals/ArchVisuals'

/* ============================================================================
   ProjectVisual — resolves a visual key to the matching brand-toned SVG
   illustration. Used for both projects and services. Swap the SVG mapping
   for real photography later by replacing this component with an <img>.
   ========================================================================== */

export type VisualKey = 'facade' | 'road' | 'framework' | 'crane'

interface ProjectVisualProps {
  visual: VisualKey
  variant?: number
  className?: string
  style?: CSSProperties
}

export function ProjectVisual({
  visual,
  variant = 0,
  className,
  style,
}: ProjectVisualProps) {
  if (visual === 'road') {
    return <RoadWorks className={className} style={style} />
  }
  if (visual === 'framework') {
    return <Framework className={className} style={style} />
  }
  if (visual === 'crane') {
    return <CraneScene className={className} style={style} />
  }
  return <BuildingFacade variant={variant} className={className} style={style} />
}

export default ProjectVisual

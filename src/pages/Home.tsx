import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import AboutPreview from '../components/home/AboutPreview'
import ServicesPreview from '../components/home/ServicesPreview'
import ProjectsPreview from '../components/home/ProjectsPreview'
import WhyOBM from '../components/home/WhyOBM'
import Process from '../components/home/Process'
import Testimonials from '../components/home/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

/* ============================================================================
   Home — OBM Construction S.C. homepage composition.
   ========================================================================== */

export default function Home() {
  useDocumentMeta({
    title: 'OBM Construction S.C. | Engineering Excellence in Ethiopia',
    description:
      'OBM is an Ethiopian construction company delivering commercial, residential and infrastructure projects with engineering excellence, safety and integrity.',
  })

  return (
    <>
      <Hero />
      <Stats />
      <AboutPreview />
      <ServicesPreview />
      <ProjectsPreview />
      <WhyOBM />
      <Process />
      <Testimonials />
    </>
  )
}

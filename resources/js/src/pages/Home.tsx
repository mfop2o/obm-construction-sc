import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import AboutPreview from '../components/home/AboutPreview'
import ServicesPreview from '../components/home/ServicesPreview'
import ProjectsPreview from '../components/home/ProjectsPreview'
import WhyOBM from '../components/home/WhyOBM'
import Process from '../components/home/Process'
import Testimonials from '../components/home/Testimonials'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

/* ============================================================================
   Home — OBM Construction S.C. homepage composition.
   ========================================================================== */

export default function Home() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('home.title'),
    description: t('home.description'),
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

import Hero from '../components/home/Hero'
import AboutPreview from '../components/home/AboutPreview'
import ServicesPreview from '../components/home/ServicesPreview'
import ProjectsPreview from '../components/home/ProjectsPreview'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useTranslation } from '../i18n'

export default function Home() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('home.title'),
    description: t('home.description'),
  })

  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesPreview />
      <ProjectsPreview />
    </>
  )
}

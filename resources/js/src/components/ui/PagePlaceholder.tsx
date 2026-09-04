import { Container } from '../ui/Container'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

interface PagePlaceholderProps {
  eyebrow?: string
  title: string
  description: string
}

export function PagePlaceholder({
  eyebrow = 'Coming soon',
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <Container
      as="section"
      className="flex flex-col items-center py-28 text-center md:py-40"
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="center"
      />
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button as="link" to="/contact" variant="primary">
          Contact Us
        </Button>
        <Button as="link" to="/" variant="outline">
          Back Home
        </Button>
      </div>
    </Container>
  )
}

export default PagePlaceholder

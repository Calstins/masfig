import { BlackFridayLandingPage, blackFridayMetadata } from '@/components/black-friday/black-friday-landing-page'

export function generateMetadata() {
  return blackFridayMetadata('single-shelves')
}

export default function Page() {
  return <BlackFridayLandingPage productKey="single-shelves" />
}

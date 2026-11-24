import { BlackFridayLandingPage, blackFridayMetadata } from '@/components/black-friday/black-friday-landing-page'

export function generateMetadata() {
  return blackFridayMetadata('double-shelves')
}

export default function Page() {
  return <BlackFridayLandingPage productKey="double-shelves" />
}

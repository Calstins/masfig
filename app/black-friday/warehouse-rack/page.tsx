import { BlackFridayLandingPage, blackFridayMetadata } from '@/components/black-friday/black-friday-landing-page'

export function generateMetadata() {
  return blackFridayMetadata('warehouse-rack')
}

export default function Page() {
  return <BlackFridayLandingPage productKey="warehouse-rack" />
}

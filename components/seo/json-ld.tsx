export function JsonLd({ data }: { data: object | object[] }) {
  const graph = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : { '@context': 'https://schema.org', ...data }
  // "<" is escaped so content can never close the script tag.
  const json = JSON.stringify(graph).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

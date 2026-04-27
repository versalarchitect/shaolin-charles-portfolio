import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://charlesjackson.dev'
const SITE_NAME = 'Charles Jackson'
const TWITTER_HANDLE = '@shaolincharles'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

interface SEOProps {
  title: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'profile' | 'blog'
  keywords?: string
  noindex?: boolean
  article?: {
    publishedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function SEO({
  title,
  description,
  path = '',
  image,
  imageAlt,
  type = 'website',
  keywords,
  noindex = false,
  article,
  jsonLd,
}: SEOProps) {
  const url = `${SITE_URL}${path ? `/${path.replace(/^\//, '')}` : ''}`
  const fullTitle = path === '' ? title : `${title} | ${SITE_NAME}`

  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : DEFAULT_IMAGE

  const imageAltText = imageAlt || `${title} - ${SITE_NAME}`

  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Hreflang alternate links */}
      <link rel="alternate" hreflang="en" href={url} />
      <link rel="alternate" hreflang="fr" href={`${url}${url.includes('?') ? '&' : '?'}lng=fr`} />
      <link rel="alternate" hreflang="x-default" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAltText} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="fr_CA" />

      {/* Profile type extras */}
      {type === 'profile' && (
        <>
          <meta property="profile:first_name" content="Charles" />
          <meta property="profile:last_name" content="Jackson" />
        </>
      )}

      {/* Article type extras */}
      {type === 'article' && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:domain" content="charlesjackson.dev" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAltText} />

      {/* Schema.org microdata */}
      <meta itemProp="name" content={fullTitle} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={imageUrl} />

      {/* Per-page JSON-LD structured data */}
      {jsonLdItems.map((item, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...item })}
        </script>
      ))}
    </Helmet>
  )
}

export default SEO

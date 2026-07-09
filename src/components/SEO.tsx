import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
}

export const SEO = ({ title, description, canonical, jsonLd }: Props) => (
  <Helmet>
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <meta property="og:title" content={title} />
    {description && <meta property="og:description" content={description} />}
    {canonical && <link rel="canonical" href={canonical} />}
    {canonical && <meta property="og:url" content={canonical} />}
    {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
  </Helmet>
);

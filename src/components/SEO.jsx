import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image }) => {
  const siteName = "TulipCrop - Premium Agriculture Solutions";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const canonicalUrl = url ? `https://tulipcrop.in${url}` : "https://tulipcrop.in";
  const defaultDesc = "TulipCrop provides top-tier crop protection, biocides, herbicides, and PGR products combining Israeli precision with field-tested performance.";
  const metaDesc = description || defaultDesc;
  const metaImage = image || "https://tulipcrop.in/logo.png"; // Replace with an actual social banner URL

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook, LinkedIn, iMessage) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

export default SEO;
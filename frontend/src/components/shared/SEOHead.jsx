import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  logo 
}) {
  const siteName = "Dream Events"; // Or use settings if passed
  const defaultImage = "https://placehold.co/1200x630/1E3A5F/ffffff?text=Dream+Events";
  const finalImage = image || defaultImage;
  
  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{title ? `${title} | ${siteName}` : siteName}</title>
      <meta name="description" content={description || "Premium event styling and decor packages."} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url || window.location.href} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:title" content={title ? `${title} | ${siteName}` : siteName} />
      <meta property="og:description" content={description || "Premium event styling and decor packages."} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url || window.location.href} />
      <meta property="twitter:title" content={title ? `${title} | ${siteName}` : siteName} />
      <meta property="twitter:description" content={description || "Premium event styling and decor packages."} />
      <meta property="twitter:image" content={finalImage} />
    </Helmet>
  );
}
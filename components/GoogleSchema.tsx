import React from "react";

const GoogleSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "3PPLEM",
    "description": "A luxury boutique hotel and rooftop sanctuary in the heart of Osapa London, Lekki.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "23/24 Muritala Eletu way, Osapa London",
      "addressLocality": "Lekki",
      "addressRegion": "Lagos",
      "addressCountry": "NG"
    },
    "telephone": "+2348170777774",
    "url": "https://www.3pplemcontinentalhotel.ng", // Replace with your actual domain
    "priceRange": "₦₦₦",
    "image": "https://www.3pplemcontinentalhotel.ng/3ppleM_exterior.webp",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Rooftop Bar", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "24/7 Security", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Boutique Suites", "value": true }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default GoogleSchema;
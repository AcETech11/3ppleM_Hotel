import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Prevent crawlers from indexing your admin/backend area
      disallow: [
        '/private/', 
        '/studio/', 
        '/admin/',
        '/management',
        '/api/' // Protects your server-side routes
      ],
    },
    sitemap: 'https://3pplemcontinentalhotel.ng/sitemap.xml',
  }
}
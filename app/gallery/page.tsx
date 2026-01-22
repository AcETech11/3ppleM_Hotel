import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "The Gallery | A Visual Journey of Luxury",
  description: "Explore the visual essence of 3PPLEM. From our sophisticated suites to our vibrant rooftop sanctuary in Osapa London, Lekki. View the pulse of timeless luxury.",
  keywords: [
    "Lekki hotel gallery", 
    "Rooftop bar photos Lagos", 
    "Luxury interior design Lekki", 
    "3PPLEM luxury photography"
  ],
  openGraph: {
    title: "3PPLEM Gallery | Timeless Luxury in Lekki",
    description: "A window into the sanctuary of 3PPLE M.",
    images: [{
      url: '/gallery-og-image.webp', 
      width: 1200,
      height: 630,
      alt: 'Luxury Rooftop Bar and Suites at 3PPLE M'
    }],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
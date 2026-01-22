import Dining from "@/components/Dining";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Journal from "@/components/Journal";
import Navbar from "@/components/Navbar";
import Rooms from "@/components/Rooms";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main >
      <Navbar />
      {/* Hero Section goes here */}
      <Hero/>
      <Experience/>
      <Rooms/>
      <Dining/>
      <Testimonials/>
      <Gallery/>
      <Journal/>
    </main>
  );
}
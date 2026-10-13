import HeroCarousel from "../../components/ui/HeroCarousel";
import { AboutSnippet } from "./About";
import Services from "./Services";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* 1. Aapka Hero Carousel */}
      <HeroCarousel />

      {/* 2. About Us ka half part */}
      <AboutSnippet showButton={true} />


      {/* 3. Services Snippet (Top 3 Cards with Button) */}
      <Services showAll={false} showTitle={true} />
    </div>
  );
}
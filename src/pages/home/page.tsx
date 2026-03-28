import LandingNav from './components/LandingNav';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import AdvantagesSection from './components/AdvantagesSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AdvantagesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}

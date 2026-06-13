import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InstructorSection from '@/components/InstructorSection';
import VibCoderSection from '@/components/VibCoderSection';
import WhatYouGetSection from '@/components/WhatYouGetSection';
import CurriculumSection from '@/components/CurriculumSection';
import ScheduleSection from '@/components/ScheduleSection';
import PricingSection from '@/components/PricingSection';
import FooterSection from '@/components/FooterSection';
import StickyCtaBar from '@/components/StickyCtaBar';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background pb-20 overflow-x-hidden">
        {/* Global aurora background */}
        <div className="aurora-bg" aria-hidden="true" />

        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <InstructorSection />
          <VibCoderSection />
          <WhatYouGetSection />
          <CurriculumSection />
          <ScheduleSection />
          <PricingSection />
          <FooterSection />
          <StickyCtaBar />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DiferenciaisSection from "@/components/DiferenciaisSection";
import CTASection from "@/components/CTASection";
import { usePageView } from "@/hooks/useAnalytics";

const Index = () => {
  usePageView();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DiferenciaisSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

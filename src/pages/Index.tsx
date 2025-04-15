
import React, { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { showDiagnosticsResults } from '@/utils/diagnostics';
import { Company } from '@/types/company';
import { fetchFeaturedCompanies } from '@/services/company/companyListService';
import FeaturedKitas from '@/components/kitas/FeaturedKitas';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [featuredKitas, setFeaturedKitas] = useState<Company[]>([]);
  const [isLoadingKitas, setIsLoadingKitas] = useState(true);

  useEffect(() => {
    // Run diagnostics silently on home page load
    showDiagnosticsResults();

    // Load featured kitas
    const loadFeaturedKitas = async () => {
      try {
        setIsLoadingKitas(true);
        const kitas = await fetchFeaturedCompanies(4);
        setFeaturedKitas(kitas);
      } catch (error) {
        console.error("Error loading featured kitas:", error);
      } finally {
        setIsLoadingKitas(false);
      }
    };

    loadFeaturedKitas();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Kitas - Now with only one heading */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Empfohlene Kindertagesstätten</h2>
            <FeaturedKitas 
              isLoading={isLoadingKitas}
              featuredCompanies={featuredKitas}
              showHeading={false} /* Disable the component's internal heading */
            />
          </div>
        </section>
        
        {/* Featured Jobs */}
        <FeaturedJobs />
        
        <Separator className="h-px bg-gray-200" />
        
        {/* Rest of the content */}
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

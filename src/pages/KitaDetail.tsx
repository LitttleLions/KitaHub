
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'; // Import useQueryClient // UNCOMMENTED
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
// Correct the import for fetchCompanyById
import { fetchCompanyById } from '@/services/company/companyDetailService'; // UNCOMMENTED
import { fetchJobsByCompanyId } from '@/services/jobService'; // UNCOMMENTED
import { toast } from '@/hooks/use-toast'; // UNCOMMENTED
import { getPlaceholderImage } from '@/utils/dataFormatUtils';
import { Company } from '@/types/company'; // Import Company type
import { Job } from '@/types/job'; // Import Job type

// Import refactored components
import KitaDetailHeader from '@/components/kitas/detail/KitaDetailHeader';
import KitaAboutTab from '@/components/kitas/detail/KitaAboutTab';
import KitaJobsTab from '@/components/kitas/detail/KitaJobsTab';
import KitaGalleryTab from '@/components/kitas/detail/KitaGalleryTab';
import KitaContactSidebar from '@/components/kitas/detail/KitaContactSidebar';
import KitaPremiumSection from '@/components/kitas/detail/KitaPremiumSection';
import KitaReviews from '@/components/kitas/detail/KitaReviews'; // Keep for structure
// Removed import HmrTestComponent

// Default benefits if none are provided
const DEFAULT_BENEFITS = [ // UNCOMMENTED
//   "Pädagogisches Konzept",
//   "Spielplatz",
//   "Essensversorgung",
//   "Nachmittagsbetreuung",
  "Musikalische Früherziehung",
  "Sprachförderung"
];

// Removed Dummy Data

const getRandomPlaceholderGallery = (count = 6) => {
  // Get a list of placeholder images
  const images = Array.from({ length: count }, (_, i) => getPlaceholderImage(i));
  return images;
};

const KitaDetail = () => {
  const { id } = useParams<{ id: string }>(); // UNCOMMENTED
  const queryClient = useQueryClient(); // Get query client instance // UNCOMMENTED
  const [randomGallery, setRandomGallery] = useState<string[]>([]);

  // Remove invalidateQueries on mount, rely on setQueryData from form and default stale behavior
  // useEffect(() => {
  //   if (id) {
  //     queryClient.invalidateQueries({ queryKey: ['kita', id] });
  //   }
  // }, [id, queryClient]);

  // Explicitly type the useQuery hook for the single Kita
  const { data: kita, isLoading: isLoadingKita, error: kitaError }: UseQueryResult<Company | null, Error> = useQuery({
    queryKey: ['kita', id],
    queryFn: () => fetchCompanyById(id || ''),
    enabled: !!id,
    refetchOnWindowFocus: true, // Add this to force refetch on focus
  });

  // Explicitly type the useQuery hook for jobs // UNCOMMENTED
  const { data: jobs, isLoading: isLoadingJobs }: UseQueryResult<Job[], Error> = useQuery({
    queryKey: ['kitaJobs', id],
    queryFn: () => fetchJobsByCompanyId(id || ''),
    enabled: !!id
  });

  useEffect(() => {
    setRandomGallery(getRandomPlaceholderGallery());
  }, []);

  useEffect(() => { // UNCOMMENTED
    if (kitaError) {
      toast({
        title: "Fehler beim Laden",
        description: "Die Informationen zur Kita konnten nicht geladen werden.",
        variant: "destructive",
      });
    }
  }, [kitaError]);

  // Log the fetched kita data for debugging - Keep this one too, just in case // UNCOMMENTED
  useEffect(() => {
    if (kita) {
      console.log('Kita Data (useEffect):', kita);
    }
  }, [kita]);

  // Removed dummy data assignment

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Restore loading and error states // UNCOMMENTED
  if (isLoadingKita) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!kita) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Kita nicht gefunden</h1>
          <p className="mb-6">Die gesuchte Kindertagesstätte konnte nicht gefunden werden.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Use provided gallery or random placeholder images
  const galleryImages = kita.gallery && kita.gallery.length > 0 
    ? kita.gallery
    : randomGallery;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pb-12">
        {/* Cover Image and Kita Header */}
        {/* Render header with dummy data */}
        {/* Cover Image and Kita Header */}
        {/* Render header with actual data */}
        <KitaDetailHeader kita={kita} />

        {/* Removed HmrTestComponent */}

        <div className="container mx-auto px-4 md:px-6 mt-8">
          {/* Premium Section - Show only for premium kitas */}
          {/* Render premium section with actual data */}
          {kita.is_premium && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <KitaPremiumSection kita={kita} />
            </motion.div>
          )}

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8" 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="lg:col-span-2"
              variants={itemVariants}
            >
              <Tabs defaultValue="uberuns">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="uberuns">Über uns</TabsTrigger>
                  <TabsTrigger value="jobs">Stellenangebote</TabsTrigger>
                  <TabsTrigger value="gallery">Galerie</TabsTrigger>
                  <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
                </TabsList>
                {/* Render tabs with actual data */}
                <TabsContent value="uberuns" className="space-y-6">
                  <KitaAboutTab kita={kita} defaultBenefits={DEFAULT_BENEFITS} />
                </TabsContent>

                <TabsContent value="jobs">
                  <KitaJobsTab jobs={jobs} isLoading={isLoadingJobs} />
                </TabsContent>

                <TabsContent value="gallery">
                  <KitaGalleryTab galleryImages={galleryImages} kitaName={kita.name} />
                </TabsContent>

                <TabsContent value="reviews">
                  <KitaReviews kita={kita} />
                </TabsContent>
              </Tabs>
            </motion.div>
            {/* Render sidebar with actual data */}
            <motion.div variants={itemVariants}>
              <KitaContactSidebar kita={kita} jobs={jobs} />
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KitaDetail;

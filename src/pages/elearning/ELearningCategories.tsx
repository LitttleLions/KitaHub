
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/elearningService';
import { Category } from '@/types/elearning';
import CategoryCard from '@/components/elearning/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ELearningCategories: React.FC = () => {
  // Fetch all categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryKey: ['all-e-learning-categories'],
    queryFn: getCategories
  });
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/elearning" className="flex items-center text-gray-500 hover:text-kita-green mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Zurück zur Kursübersicht</span>
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Alle Kategorien</h1>
            <p className="text-gray-600 max-w-3xl">
              Entdecken Sie unsere vielfältigen Kurskategorien für pädagogische Fachkräfte, Kita-Leitungen und Eltern. Wählen Sie die für Sie passende Kategorie.
            </p>
          </div>
          
          {isCategoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.map((category: Category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  className="h-full"
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ELearningCategories;

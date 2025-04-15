
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, GraduationCap, Medal, Sparkles, Search } from 'lucide-react';
import { 
  getCourses, 
  getCategories,
} from '@/services/elearningService';
import { Course, Category } from '@/types/elearning';
import ELearningHero from '@/components/elearning/ELearningHero';
import CourseCard from '@/components/elearning/CourseCard';
import CategoryCard from '@/components/elearning/CategoryCard';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Import layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ELearning: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Fetch categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading 
  } = useQuery({
    queryKey: ['e-learning-categories'],
    queryFn: getCategories
  });
  
  // Fetch courses with filters
  const { 
    data: courses, 
    isLoading: isCoursesLoading,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ['e-learning-courses', searchQuery, categoryFilter, currentTab],
    queryFn: () => getCourses({
      search: searchQuery || undefined,
      categoryId: categoryFilter || undefined,
      isFree: currentTab === 'free' ? true : undefined
    })
  });
  
  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ search: query });
  };
  
  // Update query parameters when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter) params.category = categoryFilter;
    setSearchParams(params);
    
    refetchCourses();
  }, [searchQuery, categoryFilter, currentTab, setSearchParams, refetchCourses]);
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-16">
        <ELearningHero onSearch={handleSearch} />
        
        {/* Featured Categories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Kategorien</h2>
              <Link to="/elearning/categories">
                <Button variant="outline" className="border-kita-green text-kita-green hover:bg-kita-green/10">
                  Alle Kategorien
                </Button>
              </Link>
            </div>
            
            {isCategoriesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
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
                {categories?.slice(0, 4).map((category: Category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category}
                    className="h-full"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        <Separator />
        
        {/* Courses section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Unsere Kurse</h2>
              
              <Tabs
                defaultValue="all"
                value={currentTab}
                onValueChange={setCurrentTab}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all" className="flex-1 md:flex-none">Alle Kurse</TabsTrigger>
                  <TabsTrigger value="free" className="flex-1 md:flex-none">Kostenlose Kurse</TabsTrigger>
                  <TabsTrigger value="new" className="flex-1 md:flex-none">Neu</TabsTrigger>
                </TabsList>
              
                {/* Move TabsContent inside the Tabs component */}
                <TabsContent value="all" className="mt-0">
                  {isCoursesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-40 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-5 w-16" />
                              <Skeleton className="h-9 w-20" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : courses?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Keine Kurse gefunden</h3>
                      <p className="text-gray-500 mb-6">
                        Leider konnten keine Kurse mit den angegebenen Filtern gefunden werden.
                      </p>
                      <Button 
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('');
                          setSearchParams({});
                        }}
                      >
                        Filter zurücksetzen
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {courses?.map((course: Course) => (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="free" className="mt-0">
                  {isCoursesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {/* Same loading skeleton as above */}
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-40 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-5 w-16" />
                              <Skeleton className="h-9 w-20" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : courses?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Keine kostenlosen Kurse gefunden</h3>
                      <p className="text-gray-500 mb-6">
                        Leider konnten keine kostenlosen Kurse mit den angegebenen Filtern gefunden werden.
                      </p>
                      <Button 
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('');
                          setSearchParams({});
                        }}
                      >
                        Filter zurücksetzen
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {courses?.map((course: Course) => (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="new" className="mt-0">
                  {isCoursesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {/* Same loading skeleton as above */}
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <Skeleton className="h-40 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-5 w-16" />
                              <Skeleton className="h-9 w-20" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : courses?.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-100 rounded-full p-4">
                          <Search className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Keine neuen Kurse gefunden</h3>
                      <p className="text-gray-500 mb-6">
                        Leider konnten keine neuen Kurse mit den angegebenen Filtern gefunden werden.
                      </p>
                      <Button 
                        onClick={() => {
                          setSearchQuery('');
                          setCategoryFilter('');
                          setSearchParams({});
                        }}
                      >
                        Filter zurücksetzen
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {courses?.map((course: Course) => (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          className="h-full"
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Active filters */}
            {(searchQuery || categoryFilter) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Filter:</span>
                
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Suche: {searchQuery}
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams((prev) => {
                          const params = new URLSearchParams(prev);
                          params.delete('search');
                          return params;
                        });
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {categoryFilter && categories && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Kategorie: {categories.find(c => c.id === categoryFilter)?.name || categoryFilter}
                    <button 
                      onClick={() => {
                        setCategoryFilter('');
                        setSearchParams((prev) => {
                          const params = new URLSearchParams(prev);
                          params.delete('category');
                          return params;
                        });
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('');
                    setSearchParams({});
                  }}
                  className="text-sm text-gray-500 hover:text-destructive"
                >
                  Filter zurücksetzen
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Warum E-Learning bei kita.de?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-kita-green/10 text-kita-green rounded-full p-4 inline-block mb-4">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Praxisnahes Wissen</h3>
                <p className="text-gray-600">
                  Von Experten für die tägliche Anwendung in der Kita konzipiert
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-kita-orange/10 text-kita-orange rounded-full p-4 inline-block mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexibles Lernen</h3>
                <p className="text-gray-600">
                  Lernen Sie in Ihrem eigenen Tempo, wann und wo es Ihnen passt
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-kita-blue/10 text-kita-blue rounded-full p-4 inline-block mb-4">
                  <Medal className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Zertifikate</h3>
                <p className="text-gray-600">
                  Erhalten Sie anerkannte Zertifikate für Ihre berufliche Entwicklung
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 text-purple-600 rounded-full p-4 inline-block mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualitätsgeprüft</h3>
                <p className="text-gray-600">
                  Alle Kurse werden von Fachexperten auf Qualität und Aktualität geprüft
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ELearning;

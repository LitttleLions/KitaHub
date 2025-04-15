
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  CheckCircle,
  Clock,
  Trophy 
} from 'lucide-react';
import { getUserCourses, getCourse } from '@/services/elearningService';
import CourseProgress from '@/components/elearning/CourseProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ELearningMyCourses: React.FC = () => {
  const userId = "user123"; // Normally would come from auth context
  
  // Fetch user courses
  const { 
    data: userCourses, 
    isLoading: isUserCoursesLoading 
  } = useQuery({
    queryKey: ['user-courses', userId],
    queryFn: () => getUserCourses(userId)
  });
  
  // Fetch course details for each user course
  const { 
    data: courseDetails, 
    isLoading: isCourseDetailsLoading 
  } = useQuery({
    queryKey: ['user-course-details', userCourses],
    queryFn: async () => {
      if (!userCourses || userCourses.length === 0) return [];
      
      const details = await Promise.all(
        userCourses.map(async (userCourse) => {
          const course = await getCourse(userCourse.courseId);
          return { userCourse, course };
        })
      );
      
      return details.filter(item => item.course !== undefined);
    },
    enabled: !!userCourses && userCourses.length > 0
  });
  
  const inProgressCourses = courseDetails?.filter(item => !item.userCourse.isCompleted) || [];
  const completedCourses = courseDetails?.filter(item => item.userCourse.isCompleted) || [];
  
  const isLoading = isUserCoursesLoading || isCourseDetailsLoading;
  
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
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Meine Kurse</h1>
            <p className="text-gray-600 max-w-3xl">
              Verfolgen Sie Ihren Lernfortschritt und setzen Sie Ihre Kurse fort.
            </p>
          </div>
          
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="in-progress" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>In Bearbeitung</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Abgeschlossen</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="in-progress">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : inProgressCourses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 rounded-full p-4">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Keine Kurse in Bearbeitung</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Sie haben derzeit keine Kurse, an denen Sie arbeiten. Entdecken Sie unsere Kurse, um Ihre Lernreise zu beginnen.
                  </p>
                  <Button asChild>
                    <Link to="/elearning">Kurse entdecken</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map(({ userCourse, course }) => (
                    <div key={userCourse.id} className="flex flex-col h-full">
                      <CourseProgress 
                        userCourse={userCourse} 
                        courseName={course?.title || ''} 
                        className="mb-4"
                      />
                      <Button asChild variant="outline" className="mt-auto">
                        <Link to={`/elearning/course/${course?.id}`}>
                          Kurs fortsetzen
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="h-2 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : completedCourses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 rounded-full p-4">
                      <Trophy className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Keine abgeschlossenen Kurse</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Sie haben noch keine Kurse abgeschlossen. Machen Sie weiter mit Ihren laufenden Kursen oder entdecken Sie neue.
                  </p>
                  <Button asChild>
                    <Link to="/elearning">Kurse entdecken</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map(({ userCourse, course }) => (
                    <div key={userCourse.id} className="flex flex-col h-full">
                      <CourseProgress 
                        userCourse={userCourse} 
                        courseName={course?.title || ''} 
                        className="mb-4"
                      />
                      <div className="flex gap-2 mt-auto">
                        {userCourse.certificateUrl && (
                          <Button asChild variant="outline" className="flex-1">
                            <a 
                              href={userCourse.certificateUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                            >
                              <GraduationCap className="h-4 w-4" />
                              <span>Zertifikat</span>
                            </a>
                          </Button>
                        )}
                        <Button asChild variant="outline" className="flex-1">
                          <Link to={`/elearning/course/${course?.id}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ELearningMyCourses;

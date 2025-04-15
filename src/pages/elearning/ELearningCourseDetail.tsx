import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  BookOpen,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  Play,
  User,
  Star,
  LockKeyhole,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  getCourse, 
  getCourseSections, 
  getUserCourse,
  enrollInCourse
} from '@/services/elearningService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

// Import layout components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ELearningCourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = "user123"; // Normally would come from auth context
  
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  // Fetch course details
  const { 
    data: course, 
    isLoading: isCourseLoading,
    error: courseError
  } = useQuery({
    queryKey: ['course-detail', id],
    queryFn: () => getCourse(id || ''),
    enabled: !!id
  });
  
  // Fetch course sections
  const { 
    data: sections, 
    isLoading: isSectionsLoading 
  } = useQuery({
    queryKey: ['course-sections', id],
    queryFn: () => getCourseSections(id || ''),
    enabled: !!id
  });
  
  // Fetch user's enrollment status
  const { 
    data: userCourse,
    isLoading: isUserCourseLoading,
    refetch: refetchUserCourse
  } = useQuery({
    queryKey: ['user-course', userId, id],
    queryFn: () => getUserCourse(userId, id || ''),
    enabled: !!id && !!userId
  });
  
  const isLoading = isCourseLoading || isSectionsLoading || isUserCourseLoading;
  
  // Calculate total course duration
  const totalDuration = sections?.reduce((total, section) => {
    return total + section.lectures.reduce((secTotal, lecture) => secTotal + lecture.duration, 0);
  }, 0) || course?.duration || 0;
  
  const totalLectures = sections?.reduce((total, section) => {
    return total + section.lectures.length;
  }, 0) || course?.lectureCount || 0;
  
  const isEnrolled = !!userCourse;
  
  // Handle course enrollment
  const handleEnrollment = async () => {
    if (!id || !userId) return;
    
    setIsEnrolling(true);
    try {
      await enrollInCourse(userId, id);
      await refetchUserCourse();
      toast({
        title: "Erfolgreich eingeschrieben!",
        description: "Sie können jetzt mit dem Kurs beginnen.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Fehler bei der Einschreibung",
        description: "Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };
  
  if (courseError) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Fehler beim Laden des Kurses</h1>
            <p className="mb-6">Dieser Kurs existiert nicht oder es gab ein Problem beim Laden der Daten.</p>
            <Button asChild>
              <Link to="/elearning">Zurück zur Kursübersicht</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-8"></div>
              
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                  <div className="h-64 bg-gray-200 rounded mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
                </div>
                
                <div className="lg:w-1/3">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Kurs nicht gefunden</h1>
            <p className="mb-6">Der gesuchte Kurs existiert nicht oder wurde entfernt.</p>
            <Button asChild>
              <Link to="/elearning">Zurück zur Kursübersicht</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link to="/elearning" className="flex items-center text-gray-500 hover:text-kita-green">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Zurück zur Kursübersicht</span>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-lg text-gray-700 mb-6">{course.shortDescription}</p>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{course.rating.toFixed(1)} ({course.reviewCount} Bewertungen)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.instructor.studentCount}+ Teilnehmer</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Aktualisiert {format(new Date(course.updatedAt), 'MMMM yyyy', { locale: de })}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLectures} Lektionen</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(totalDuration / 60)} Std. {totalDuration % 60} Min.</span>
                </div>
              </div>
              
              <div className="mb-6">
                {course.categories.map((category, index) => (
                  <Badge key={index} className="mr-2 bg-kita-green/10 text-kita-green hover:bg-kita-green/20 border-0">
                    {category}
                  </Badge>
                ))}
                <Badge variant="outline" className="mr-2">
                  {course.level}
                </Badge>
              </div>
              
              <div className="lg:hidden mb-8">
                <Card className="overflow-hidden border-t-4 border-t-kita-green">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="w-full aspect-video object-cover"
                  />
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-2xl">
                        {course.isFreemium ? (
                          <span className="text-kita-green">Kostenlos</span>
                        ) : (
                          <span>{course.price?.toFixed(2)} €</span>
                        )}
                      </div>
                    </div>
                    
                    {isEnrolled ? (
                      <div className="space-y-4">
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Ihr Fortschritt</span>
                            <span>{userCourse.progress}%</span>
                          </div>
                          <Progress value={userCourse.progress} className="h-2" />
                        </div>
                        
                        <Button className="w-full bg-kita-green hover:bg-kita-green/90">
                          Kurs fortsetzen
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleEnrollment}
                        disabled={isEnrolling}
                        className="w-full bg-kita-green hover:bg-kita-green/90"
                      >
                        {isEnrolling ? "Wird bearbeitet..." : "Jetzt einschreiben"}
                      </Button>
                    )}
                    
                    <ul className="mt-6 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Lebenslanger Zugang</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Auf allen Geräten nutzbar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Teilnahmezertifikat nach Abschluss</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-6 w-full justify-start">
                  <TabsTrigger value="about">Über den Kurs</TabsTrigger>
                  <TabsTrigger value="content">Kursinhalt</TabsTrigger>
                  <TabsTrigger value="instructor">Dozent/in</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Kursbeschreibung</h3>
                    <p className="mb-6">{course.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-4">Was Sie lernen werden</h3>
                    <ul className="space-y-2 mb-6">
                      {course.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {course.requirements.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">Voraussetzungen</h3>
                        <ul className="space-y-2 mb-6">
                          {course.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-4">Für wen ist dieser Kurs?</h3>
                    <ul className="space-y-2 mb-6">
                      {course.targetAudience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                          <span>{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="content">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">Kursinhalt</h3>
                      <div className="text-sm text-gray-500">
                        {sections?.length || 0} Abschnitte • {totalLectures} Lektionen • {Math.floor(totalDuration / 60)} Std. {totalDuration % 60} Min. Gesamtlänge
                      </div>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {sections?.map((section, sectionIndex) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="text-left">
                              <span className="font-medium">
                                {sectionIndex + 1}. {section.title}
                              </span>
                              <div className="text-xs text-gray-500">
                                {section.lectures.length} Lektionen • 
                                {Math.floor(section.lectures.reduce((total, lecture) => total + lecture.duration, 0) / 60)} Std. 
                                {section.lectures.reduce((total, lecture) => total + lecture.duration, 0) % 60} Min.
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pl-6">
                            {section.lectures.map((lecture, lectureIndex) => {
                              const isCompleted = userCourse?.completedLectureIds.includes(lecture.id);
                              
                              return (
                                <li 
                                  key={lecture.id} 
                                  className={`flex items-center justify-between p-2 rounded-md ${
                                    isCompleted ? 'bg-kita-green/5' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {lecture.isPreview ? (
                                      <Play className="h-4 w-4 text-kita-green" />
                                    ) : isEnrolled ? (
                                      isCompleted ? (
                                        <CheckCircle className="h-4 w-4 text-kita-green" />
                                      ) : (
                                        <Play className="h-4 w-4 text-gray-400" />
                                      )
                                    ) : (
                                      <LockKeyhole className="h-4 w-4 text-gray-400" />
                                    )}
                                    
                                    <span>
                                      {sectionIndex + 1}.{lectureIndex + 1} {lecture.title}
                                      {lecture.isPreview && (
                                        <Badge className="ml-2 text-xs py-0 px-1.5 bg-kita-green/10 text-kita-green hover:bg-kita-green/20 border-0">
                                          Vorschau
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs text-gray-500">
                                    {Math.floor(lecture.duration / 60) > 0 ? `${Math.floor(lecture.duration / 60)}:` : ''}
                                    {String(lecture.duration % 60).padStart(2, '0')} Min
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Über den/die Dozent/in</h3>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.instructor.avatarUrl} alt={course.instructor.name} />
                        <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h4 className="text-lg font-medium">{course.instructor.name}</h4>
                        <p className="text-gray-500">{course.instructor.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>{course.rating.toFixed(1)} Durchschnittsbewertung</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{course.instructor.studentCount} Teilnehmer/innen</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{course.instructor.courseCount} Kurse</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{course.instructor.bio}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-24">
                <Card className="overflow-hidden border-t-4 border-t-kita-green">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="w-full aspect-video object-cover"
                  />
                  
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-2xl">
                        {course.isFreemium ? (
                          <span className="text-kita-green">Kostenlos</span>
                        ) : (
                          <span>{course.price?.toFixed(2)} €</span>
                        )}
                      </div>
                    </div>
                    
                    {isEnrolled ? (
                      <div className="space-y-4">
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Ihr Fortschritt</span>
                            <span>{userCourse.progress}%</span>
                          </div>
                          <Progress value={userCourse.progress} className="h-2" />
                        </div>
                        
                        <Button className="w-full bg-kita-green hover:bg-kita-green/90">
                          Kurs fortsetzen
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleEnrollment}
                        disabled={isEnrolling}
                        className="w-full bg-kita-green hover:bg-kita-green/90"
                      >
                        {isEnrolling ? "Wird bearbeitet..." : "Jetzt einschreiben"}
                      </Button>
                    )}
                    
                    <ul className="mt-6 space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Lebenslanger Zugang</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Auf allen Geräten nutzbar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-kita-green flex-shrink-0 mt-0.5" />
                        <span>Teilnahmezertifikat nach Abschluss</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ELearningCourseDetail;

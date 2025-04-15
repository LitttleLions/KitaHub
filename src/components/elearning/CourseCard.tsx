
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, Star } from 'lucide-react';
import { Course } from '@/types/elearning';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getRandomStaticImage } from '@/lib/utils'; // Import the utility

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg';

// Helper function for image error handling
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
  }
};

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  // Check if thumbnail is from lovable-uploads, otherwise use it or fallback to random static
  const imageUrl = course.thumbnailUrl?.startsWith('/lovable-uploads/') 
    ? getRandomStaticImage() 
    : course.thumbnailUrl || getRandomStaticImage();

  return (
    <Card className={`overflow-hidden hover-card transition-all duration-300 h-full flex flex-col ${className}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={course.title} 
          className="w-full h-40 object-cover"
          onError={handleImageError} // Add error handling
        />
        {course.isFreemium && (
          <div className="absolute top-2 right-2 badge badge-primary">
            Kostenlos
          </div>
        )}
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <span className="mx-1">•</span>
          <span>{course.reviewCount} Bewertungen</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.shortDescription}</p>
        
        <div className="flex flex-wrap text-xs text-gray-500 gap-3 mt-auto">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{Math.floor(course.duration / 60)} Std. {course.duration % 60} Min.</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.lectureCount} Lektionen</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{course.instructor.studentCount}+ Teilnehmer</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 flex justify-between items-center">
        <div className="font-semibold">
          {course.isFreemium ? (
            <span className="text-kita-green">Kostenlos</span>
          ) : (
            <span>{course.price?.toFixed(2)} €</span>
          )}
        </div>
        <Button asChild size="sm" variant="outline" className="border-kita-green text-kita-green hover:bg-kita-green/10">
          <Link to={`/elearning/course/${course.id}`}>
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;

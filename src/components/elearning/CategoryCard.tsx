
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, Building, Users, Laptop, Heart, 
  Merge, BookOpen, MessageSquare, Brain, PenTool, 
  BarChart, BookMarked
} from 'lucide-react';
import { Category } from '@/types/elearning';
import { Card, CardContent } from '@/components/ui/card';
import { getRandomStaticImage } from '@/lib/utils'; // Import the utility

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg';

// Helper function for image error handling
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
  }
};

interface CategoryCardProps {
  category: Category;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, className }) => {
  // Map from category iconName to Lucide icon component
  const iconMap: Record<string, React.ReactNode> = {
    'GraduationCap': <GraduationCap className="h-6 w-6" />,
    'Building': <Building className="h-6 w-6" />,
    'Users': <Users className="h-6 w-6" />,
    'Laptop': <Laptop className="h-6 w-6" />,
    'Heart': <Heart className="h-6 w-6" />,
    'Merge': <Merge className="h-6 w-6" />,
    'BookOpen': <BookOpen className="h-6 w-6" />,
    'MessageSquare': <MessageSquare className="h-6 w-6" />,
    'Brain': <Brain className="h-6 w-6" />,
    'PenTool': <PenTool className="h-6 w-6" />,
    'BarChart': <BarChart className="h-6 w-6" />,
    'BookMarked': <BookMarked className="h-6 w-6" />
  };

  const icon = iconMap[category.iconName] || <BookOpen className="h-6 w-6" />;

  // Check if thumbnail is from lovable-uploads, otherwise use it or fallback to random static
  const imageUrl = category.thumbnailUrl?.startsWith('/lovable-uploads/') 
    ? getRandomStaticImage() 
    : category.thumbnailUrl || getRandomStaticImage();

  return (
    <Link to={`/elearning?category=${category.id}`} className="block h-full">
      <Card className={`overflow-hidden hover-card transition-all duration-300 h-full ${className}`}>
        <div className="h-32 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError} // Add error handling
          />
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-kita-green/10 text-kita-green">
              {icon}
            </div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
          
          <div className="text-xs text-gray-500">
            {category.courseCount} Kurse
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;

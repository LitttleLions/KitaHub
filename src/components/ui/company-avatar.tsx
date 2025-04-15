
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlaceholderImage } from "@/utils/dataFormatUtils";

interface CompanyAvatarProps {
  src?: string | null;
  name?: string;
  fallbackIndex?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  badge?: React.ReactNode;
}

const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  src,
  name = '',
  fallbackIndex = 0,
  className = '',
  size = 'md',
  badge,
}) => {
  const [imgError, setImgError] = React.useState(false);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20',
  };
  
  // Generate initials from name, take first letter of each word, max 2 characters
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : '?';

  // Generate a consistent color based on the name
  const getConsistentColorClass = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-amber-100 text-amber-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-cyan-100 text-cyan-600',
    ];
    
    // Simple hash function to get consistent color for same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Ensure we have a valid placeholder image
  const placeholderImage = getPlaceholderImage(fallbackIndex);
  
  const handleImageError = () => {
    console.log("Avatar image failed to load:", src);
    setImgError(true);
  };

  // Get the appropriate color class based on the name
  const colorClass = getConsistentColorClass(name || 'default');
  
  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-white ${className}`}>
        {src && !imgError ? (
          <AvatarImage 
            src={src} 
            alt={name || 'Company avatar'} 
            onError={handleImageError}
            className="object-cover"
          />
        ) : (
          <AvatarImage 
            src={placeholderImage} 
            alt={name || 'Company avatar'} 
            onError={() => setImgError(true)}
            className="object-cover"
          />
        )}
        <AvatarFallback className={`${colorClass} font-medium`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {/* Optional badge element that can be passed in */}
      {badge && (
        <div className="absolute -bottom-1 -right-1">
          {badge}
        </div>
      )}
    </div>
  );
};

export default CompanyAvatar;


import React from 'react';
import { Clock } from 'lucide-react';
import { UserCourse } from '@/types/elearning';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface CourseProgressProps {
  userCourse: UserCourse;
  courseName: string;
  className?: string;
}

const CourseProgress: React.FC<CourseProgressProps> = ({ 
  userCourse, 
  courseName,
  className 
}) => {
  const lastAccessed = new Date(userCourse.lastAccessedAt);
  const formattedLastAccessed = formatDistanceToNow(lastAccessed, { 
    addSuffix: true,
    locale: de
  });

  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <h3 className="font-semibold mb-2">{courseName}</h3>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Fortschritt</span>
          <span>{userCourse.progress}%</span>
        </div>
        <Progress value={userCourse.progress} className="h-2" />
      </div>
      
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3.5 w-3.5" />
        <span>Zuletzt bearbeitet {formattedLastAccessed}</span>
      </div>
      
      {userCourse.isCompleted && (
        <div className="mt-2 text-sm text-kita-green font-medium">
          ✓ Abgeschlossen
          {userCourse.certificateUrl && (
            <a 
              href={userCourse.certificateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-kita-orange hover:underline"
            >
              Zertifikat ansehen
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseProgress;

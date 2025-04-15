
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: Instructor;
  price: number | null;
  isFreemium: boolean;
  categories: string[];
  targetAudience: string[];
  duration: number; // in minutes
  lectureCount: number;
  level: 'Anfänger' | 'Fortgeschritten' | 'Experte';
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  objectives: string[];
  requirements: string[];
}

export interface Instructor {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  title: string;
  courseCount: number;
  studentCount: number;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'download';
  duration: number; // in minutes
  position: number;
  contentUrl: string;
  isPreview: boolean;
  sectionId: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  position: number;
  lectures: Lecture[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  courseCount: number;
  iconName: string;
  thumbnailUrl: string;
}

export interface UserCourse {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0-100
  lastAccessedAt: string;
  completedLectureIds: string[];
  certificateUrl?: string;
  enrolledAt: string;
  isCompleted: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

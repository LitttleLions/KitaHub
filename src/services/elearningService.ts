
import { Category, Course, Instructor, Section, UserCourse } from "@/types/elearning";

// Mock categories
const categories: Category[] = [
  {
    id: "1",
    name: "Pädagogik",
    slug: "paedagogik",
    description: "Kurse zu verschiedenen pädagogischen Ansätzen und Methoden",
    courseCount: 12,
    iconName: "GraduationCap",
    thumbnailUrl: "/lovable-uploads/DSC02648.jpg"
  },
  {
    id: "2",
    name: "Kita-Leitung",
    slug: "kita-leitung",
    description: "Alles für Leitungskräfte: Organisation, Planung und Management",
    courseCount: 8,
    iconName: "Building",
    thumbnailUrl: "/lovable-uploads/DSC06302-Bearbeitet.jpg"
  },
  {
    id: "3",
    name: "Elternwissen",
    slug: "elternwissen",
    description: "Informative Kurse für Eltern zur Unterstützung der kindlichen Entwicklung",
    courseCount: 6,
    iconName: "Users",
    thumbnailUrl: "/lovable-uploads/DSC06567.jpg"
  },
  {
    id: "4",
    name: "Digitalisierung",
    slug: "digitalisierung",
    description: "Digitale Medien und Tools für den Kita-Alltag",
    courseCount: 5,
    iconName: "Laptop",
    thumbnailUrl: "/lovable-uploads/DSC06589.jpg"
  },
  {
    id: "5",
    name: "Gesundheit",
    slug: "gesundheit",
    description: "Gesundheitsförderung und Prävention in der Kita",
    courseCount: 7,
    iconName: "Heart",
    thumbnailUrl: "/lovable-uploads/DSC03540-Bearbeitet.jpg"
  },
  {
    id: "6",
    name: "Inklusion",
    slug: "inklusion",
    description: "Inklusive Pädagogik und Diversität in der Kita",
    courseCount: 4,
    iconName: "Merge",
    thumbnailUrl: "/lovable-uploads/DSC07099-Bearbeitet-Bearbeitet.jpg"
  }
];

// Mock instructors
const instructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Lisa Schmidt",
    bio: "Erziehungswissenschaftlerin mit 15 Jahren Erfahrung in der Kita-Beratung",
    avatarUrl: "/lovable-uploads/DSC07674-Bearbeitet-Bearbeitet.jpg",
    title: "Pädagogische Beraterin",
    courseCount: 5,
    studentCount: 1240
  },
  {
    id: "2",
    name: "Martin Weber",
    bio: "Ehemaliger Kita-Leiter und Fachautor für frühkindliche Bildung",
    avatarUrl: "/lovable-uploads/DSC04166-Bearbeitet.jpg",
    title: "Kita-Management-Experte",
    courseCount: 3,
    studentCount: 875
  },
  {
    id: "3",
    name: "Sarah Müller",
    bio: "Heilpädagogin und Expertin für inklusive Bildung",
    avatarUrl: "/lovable-uploads/DSC06503-Bearbeitet-2.jpg",
    title: "Inklusions-Expertin",
    courseCount: 4,
    studentCount: 620
  },
  {
    id: "4",
    name: "Prof. Dr. Jens Hoffmann",
    bio: "Professor für Pädagogik mit Schwerpunkt digitale Medien",
    avatarUrl: "/lovable-uploads/DSC02958.jpg",
    title: "Digitalisierungsexperte",
    courseCount: 2,
    studentCount: 450
  }
];

// Mock courses
const courses: Course[] = [
  {
    id: "1",
    title: "Bildungsbereiche kindgerecht gestalten",
    shortDescription: "Innovative Ansätze zur Gestaltung von Bildungsbereichen",
    description: "In diesem Kurs lernen Sie, wie Sie die verschiedenen Bildungsbereiche in Ihrer Kita kindgerecht und ansprechend gestalten können. Wir betrachten moderne pädagogische Konzepte und deren praktische Umsetzung im Alltag. Von der Raumgestaltung bis hin zu Materialauswahl – dieser Kurs bietet Ihnen einen umfassenden Überblick und konkrete Handlungsempfehlungen.",
    instructor: instructors[0],
    price: 59.99,
    isFreemium: false,
    categories: ["Pädagogik"],
    targetAudience: ["Erzieher:innen", "Pädagogische Fachkräfte"],
    duration: 300, // 5 hours in minutes
    lectureCount: 12,
    level: "Fortgeschritten",
    thumbnailUrl: "/lovable-uploads/DSC06105.jpg",
    rating: 4.7,
    reviewCount: 58,
    createdAt: "2023-05-15T10:00:00Z",
    updatedAt: "2023-08-20T14:30:00Z",
    objectives: [
      "Bildungsbereiche nach aktuellen Standards gestalten",
      "Materialien sinnvoll auswählen und einsetzen",
      "Lernumgebungen schaffen, die zum Entdecken einladen",
      "Bildungsprozesse dokumentieren und reflektieren"
    ],
    requirements: [
      "Grundkenntnisse in Pädagogik",
      "Praktische Erfahrung in einer Bildungseinrichtung"
    ]
  },
  {
    id: "2",
    title: "Kita-Leitung: Personalführung und Teamentwicklung",
    shortDescription: "Führungskompetenzen für Kita-Leitungen",
    description: "Als Kita-Leitung stehen Sie vor der Herausforderung, ein Team zu führen und zu entwickeln. Dieser Kurs vermittelt Ihnen die notwendigen Kompetenzen, um Ihre Mitarbeiter:innen zu fördern, Konflikte konstruktiv zu lösen und eine positive Teamkultur zu etablieren. Praxisnahe Beispiele und Übungen helfen Ihnen, das Gelernte direkt in Ihren Alltag zu integrieren.",
    instructor: instructors[1],
    price: 89.99,
    isFreemium: false,
    categories: ["Kita-Leitung"],
    targetAudience: ["Kita-Leitungen", "stellvertretende Leitungen", "angehende Führungskräfte"],
    duration: 480, // 8 hours in minutes
    lectureCount: 15,
    level: "Fortgeschritten",
    thumbnailUrl: "/lovable-uploads/DSC06302-Bearbeitet.jpg",
    rating: 4.9,
    reviewCount: 42,
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-07-05T11:20:00Z",
    objectives: [
      "Moderne Führungskonzepte kennenlernen und anwenden",
      "Mitarbeitergespräche professionell führen",
      "Konflikte im Team konstruktiv lösen",
      "Eine nachhaltige Teamkultur entwickeln"
    ],
    requirements: [
      "Leitungsfunktion oder angestrebte Leitungsposition",
      "Grundkenntnisse in Personalmanagement"
    ]
  },
  {
    id: "3",
    title: "Eingewöhnung in der Kita - Ein Leitfaden für Eltern",
    shortDescription: "Die Eingewöhnungsphase erfolgreich gestalten",
    description: "Die Eingewöhnung ist eine wichtige Phase für Ihr Kind und Sie als Eltern. Dieser Kurs bietet Ihnen wertvolle Informationen und praktische Tipps, wie Sie diese Zeit gemeinsam mit Ihrem Kind und der Kita positiv gestalten können. Erfahren Sie mehr über verschiedene Eingewöhnungsmodelle und wie Sie Ihr Kind optimal unterstützen können.",
    instructor: instructors[0],
    price: null,
    isFreemium: true,
    categories: ["Elternwissen"],
    targetAudience: ["Eltern", "Erziehungsberechtigte"],
    duration: 120, // 2 hours in minutes
    lectureCount: 8,
    level: "Anfänger",
    thumbnailUrl: "/lovable-uploads/DSC07494-Bearbeitet-Bearbeitet.jpg",
    rating: 4.8,
    reviewCount: 125,
    createdAt: "2023-01-20T14:00:00Z",
    updatedAt: "2023-06-12T08:45:00Z",
    objectives: [
      "Eingewöhnungsmodelle verstehen",
      "Die eigene Rolle im Eingewöhnungsprozess kennen",
      "Trennungsängste bei Kindern erkennen und abbauen",
      "Eine vertrauensvolle Beziehung zur Kita aufbauen"
    ],
    requirements: []
  },
  {
    id: "4",
    title: "Digitale Dokumentation in der Kita",
    shortDescription: "Moderne Tools für die pädagogische Dokumentation",
    description: "Die digitale Dokumentation bietet viele Vorteile gegenüber traditionellen Methoden. In diesem Kurs lernen Sie verschiedene digitale Tools kennen, die Ihnen die Dokumentation im Kita-Alltag erleichtern. Von der Beobachtung bis zur Portfolioarbeit – entdecken Sie effiziente Wege, Bildungsprozesse zu dokumentieren und mit Eltern zu teilen.",
    instructor: instructors[3],
    price: 49.99,
    isFreemium: false,
    categories: ["Digitalisierung", "Pädagogik"],
    targetAudience: ["Erzieher:innen", "Kita-Leitungen"],
    duration: 240, // 4 hours in minutes
    lectureCount: 10,
    level: "Anfänger",
    thumbnailUrl: "/lovable-uploads/DSC06589.jpg",
    rating: 4.5,
    reviewCount: 37,
    createdAt: "2023-03-05T16:30:00Z",
    updatedAt: "2023-09-01T10:15:00Z",
    objectives: [
      "Digitale Dokumentationstools kennenlernen und anwenden",
      "Zeit- und ressourcensparend dokumentieren",
      "Datenschutzkonform arbeiten",
      "Eltern digital in Bildungsprozesse einbeziehen"
    ],
    requirements: [
      "Grundlegende PC-Kenntnisse",
      "Zugang zu einem Computer oder Tablet"
    ]
  },
  {
    id: "5",
    title: "Inklusive Pädagogik im Kita-Alltag",
    shortDescription: "Vielfalt als Bereicherung erleben",
    description: "Inklusion ist mehr als ein Schlagwort – es ist eine Haltung und pädagogische Praxis. Dieser Kurs vermittelt Ihnen das notwendige Wissen und praktische Methoden, um Inklusion in Ihrer Kita zu leben. Lernen Sie, wie Sie barrierefreie Lernumgebungen schaffen und alle Kinder individuell fördern können.",
    instructor: instructors[2],
    price: 69.99,
    isFreemium: false,
    categories: ["Inklusion", "Pädagogik"],
    targetAudience: ["Erzieher:innen", "Heilpädagog:innen", "Integrationshelfer:innen"],
    duration: 360, // 6 hours in minutes
    lectureCount: 14,
    level: "Fortgeschritten",
    thumbnailUrl: "/lovable-uploads/DSC07099-Bearbeitet-Bearbeitet.jpg",
    rating: 4.8,
    reviewCount: 63,
    createdAt: "2023-04-18T13:20:00Z",
    updatedAt: "2023-08-30T15:45:00Z",
    objectives: [
      "Inklusive Pädagogik verstehen und im Alltag umsetzen",
      "Barrierefreie Lernumgebungen gestalten",
      "Individuelle Förderpläne erstellen",
      "Mit Eltern und externen Fachkräften kooperieren"
    ],
    requirements: [
      "Grundkenntnisse in Pädagogik",
      "Interesse an inklusiver Bildung"
    ]
  },
  {
    id: "6",
    title: "Gesunde Ernährung in der Kita",
    shortDescription: "Ernährungskonzepte für Kindertagesstätten",
    description: "Eine gesunde Ernährung ist die Basis für die Entwicklung von Kindern. In diesem Kurs erfahren Sie, wie Sie ein ausgewogenes Ernährungskonzept in Ihrer Kita implementieren können. Von der Speisenplanung bis hin zur Einbeziehung der Kinder in die Zubereitung – lernen Sie, wie Sie Ernährungsbildung alltagsintegriert gestalten können.",
    instructor: instructors[0],
    price: 39.99,
    isFreemium: false,
    categories: ["Gesundheit"],
    targetAudience: ["Erzieher:innen", "Kita-Leitungen", "Küchenpersonal"],
    duration: 180, // 3 hours in minutes
    lectureCount: 9,
    level: "Anfänger",
    thumbnailUrl: "/lovable-uploads/DSC03540-Bearbeitet.jpg",
    rating: 4.6,
    reviewCount: 48,
    createdAt: "2023-06-22T11:00:00Z",
    updatedAt: "2023-09-15T09:30:00Z",
    objectives: [
      "Grundlagen der Kinderernährung verstehen",
      "Ausgewogene Speisepläne erstellen",
      "Ernährungsbildung in den Kita-Alltag integrieren",
      "Kinder bei der Essenszubereitung einbeziehen"
    ],
    requirements: [
      "Interesse an gesunder Ernährung",
      "Zuständigkeit für Verpflegung in der Kita"
    ]
  }
];

// Mock user courses
const userCourses: UserCourse[] = [
  {
    id: "1",
    userId: "user123",
    courseId: "1",
    progress: 65,
    lastAccessedAt: "2023-09-20T15:30:00Z",
    completedLectureIds: ["lec1", "lec2", "lec3", "lec4", "lec5"],
    enrolledAt: "2023-08-15T10:00:00Z",
    isCompleted: false
  },
  {
    id: "2",
    userId: "user123",
    courseId: "3",
    progress: 100,
    lastAccessedAt: "2023-09-18T09:45:00Z",
    completedLectureIds: ["lec1", "lec2", "lec3", "lec4", "lec5", "lec6", "lec7", "lec8"],
    certificateUrl: "https://example.com/certificates/user123-course3.pdf",
    enrolledAt: "2023-07-10T14:20:00Z",
    isCompleted: true
  }
];

// Mock sections
const courseSections: Record<string, Section[]> = {
  "1": [
    {
      id: "sec1",
      courseId: "1",
      title: "Einführung",
      position: 1,
      lectures: [
        {
          id: "lec1",
          courseId: "1",
          title: "Einführung in die Bildungsbereiche",
          description: "Überblick über die verschiedenen Bildungsbereiche in der frühkindlichen Bildung",
          type: "video",
          duration: 15,
          position: 1,
          contentUrl: "https://example.com/videos/intro.mp4",
          isPreview: true,
          sectionId: "sec1"
        },
        {
          id: "lec2",
          courseId: "1",
          title: "Moderne pädagogische Konzepte",
          description: "Einblick in aktuelle pädagogische Konzepte und deren Anwendung",
          type: "video",
          duration: 20,
          position: 2,
          contentUrl: "https://example.com/videos/concepts.mp4",
          isPreview: false,
          sectionId: "sec1"
        }
      ]
    },
    {
      id: "sec2",
      courseId: "1",
      title: "Raumgestaltung",
      position: 2,
      lectures: [
        {
          id: "lec3",
          courseId: "1",
          title: "Prinzipien der Raumgestaltung",
          description: "Grundlegende Prinzipien für die Gestaltung von Bildungsräumen",
          type: "video",
          duration: 25,
          position: 1,
          contentUrl: "https://example.com/videos/room-design.mp4",
          isPreview: false,
          sectionId: "sec2"
        },
        {
          id: "lec4",
          courseId: "1",
          title: "Materialauswahl",
          description: "Kriterien für die Auswahl geeigneter Materialien",
          type: "video",
          duration: 18,
          position: 2,
          contentUrl: "https://example.com/videos/materials.mp4",
          isPreview: false,
          sectionId: "sec2"
        },
        {
          id: "lec5",
          courseId: "1",
          title: "Praxisbeispiele",
          description: "Erfolgreiche Beispiele aus verschiedenen Kitas",
          type: "video",
          duration: 22,
          position: 3,
          contentUrl: "https://example.com/videos/examples.mp4",
          isPreview: false,
          sectionId: "sec2"
        }
      ]
    }
  ]
};

// Service functions
export const getCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

export const getCategory = async (id: string): Promise<Category | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories.find(cat => cat.id === id));
    }, 300);
  });
};

export const getCourses = async (filters?: {
  categoryId?: string;
  search?: string;
  isFree?: boolean;
}): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredCourses = [...courses];
      
      if (filters?.categoryId) {
        const category = categories.find(c => c.id === filters.categoryId);
        if (category) {
          filteredCourses = filteredCourses.filter(course => 
            course.categories.includes(category.name)
          );
        }
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.isFree !== undefined) {
        filteredCourses = filteredCourses.filter(course => 
          course.isFreemium === filters.isFree
        );
      }
      
      resolve(filteredCourses);
    }, 700);
  });
};

export const getCourse = async (id: string): Promise<Course | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(courses.find(course => course.id === id));
    }, 500);
  });
};

export const getCourseSections = async (courseId: string): Promise<Section[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(courseSections[courseId] || []);
    }, 500);
  });
};

export const getUserCourses = async (userId: string): Promise<UserCourse[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userCourses.filter(uc => uc.userId === userId));
    }, 500);
  });
};

export const getUserCourse = async (userId: string, courseId: string): Promise<UserCourse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userCourses.find(uc => uc.userId === userId && uc.courseId === courseId));
    }, 300);
  });
};

export const enrollInCourse = async (userId: string, courseId: string): Promise<UserCourse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUserCourse: UserCourse = {
        id: `${userId}-${courseId}`,
        userId,
        courseId,
        progress: 0,
        lastAccessedAt: new Date().toISOString(),
        completedLectureIds: [],
        enrolledAt: new Date().toISOString(),
        isCompleted: false
      };
      
      userCourses.push(newUserCourse);
      resolve(newUserCourse);
    }, 800);
  });
};

export const updateCourseProgress = async (
  userId: string, 
  courseId: string, 
  lectureId: string
): Promise<UserCourse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userCourse = userCourses.find(uc => uc.userId === userId && uc.courseId === courseId);
      
      if (userCourse) {
        if (!userCourse.completedLectureIds.includes(lectureId)) {
          userCourse.completedLectureIds.push(lectureId);
        }
        
        // Find all lectures in this course
        const sections = courseSections[courseId] || [];
        let totalLectures = 0;
        sections.forEach(section => {
          totalLectures += section.lectures.length;
        });
        
        // Calculate progress
        const progress = Math.round((userCourse.completedLectureIds.length / totalLectures) * 100);
        userCourse.progress = progress;
        userCourse.lastAccessedAt = new Date().toISOString();
        
        if (progress === 100) {
          userCourse.isCompleted = true;
          userCourse.certificateUrl = `https://example.com/certificates/${userId}-${courseId}.pdf`;
        }
        
        resolve({...userCourse});
      } else {
        resolve(undefined);
      }
    }, 500);
  });
};

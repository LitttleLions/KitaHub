
import React from 'react';
import { User, Star, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Company } from '@/types/company';

interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
}

interface KitaReviewsProps {
  kita: Company;
}

// Sample reviews data - in a real app, this would come from the database
const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Maria K.',
    date: '15.03.2024',
    rating: 5,
    content: 'Wir sind sehr zufrieden mit der Betreuung unseres Sohnes. Das Team ist engagiert und einfühlsam. Die Räumlichkeiten sind modern und kindgerecht gestaltet.',
    helpful: 8
  },
  {
    id: '2',
    author: 'Thomas B.',
    date: '22.02.2024',
    rating: 4,
    content: 'Gute Kommunikation zwischen Erziehern und Eltern. Die Eingewöhnung verlief problemlos. Einziger Kritikpunkt: die Öffnungszeiten könnten flexibler sein.',
    helpful: 5
  },
  {
    id: '3',
    author: 'Sarah L.',
    date: '10.01.2024',
    rating: 5,
    content: 'Unser Kind geht jeden Tag gerne in diese Kita. Die pädagogischen Konzepte werden gut umgesetzt und die Kinder werden individuell gefördert. Sehr empfehlenswert!',
    helpful: 12
  },
];

const KitaReviews: React.FC<KitaReviewsProps> = ({ kita }) => {
  const reviews = sampleReviews;
  const averageRating = kita.rating || reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Bewertungen von Eltern</h3>
        <div className="flex items-center">
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({reviews.length || kita.review_count || 0} Bewertungen)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt={review.author} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{review.author}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{review.date}</span>
                    <span className="mx-2">•</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{review.content}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <button className="flex items-center hover:text-blue-600 transition-colors">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>Hilfreich ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {kita.is_premium && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Als Premium-Kita können wir Ihnen authentische Bewertungen unserer Eltern präsentieren.
          </p>
        </div>
      )}
    </div>
  );
};

export default KitaReviews;

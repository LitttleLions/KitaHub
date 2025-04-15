
import React from 'react';
import { Award, CheckCircle2, Medal } from 'lucide-react';
import { Company } from '@/types/company';

interface KitaPremiumSectionProps {
  kita: Company;
}

const KitaPremiumSection: React.FC<KitaPremiumSectionProps> = ({ kita }) => {
  if (!kita.is_premium) return null;
  
  return (
    <div className="mb-8 bg-amber-50 rounded-xl p-6 border border-amber-200">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-6 w-6 text-amber-500" />
        <h2 className="text-xl font-semibold">Premium-Informationen</h2>
      </div>

      {/* Grid layout for video and text info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* Video Column */}
        {kita.video_url && (
          <div> {/* Removed mb-6 from here */}
            <h3 className="text-lg font-medium mb-3">Video-Vorstellung</h3>
            {/* Removed max-w-2xl and mx-auto, grid handles width */}
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-md">
              <iframe
                // Ensure YouTube URLs are embeddable
              src={kita.video_url.replace("watch?v=", "embed/")}
              title={`Video-Vorstellung ${kita.name}`}
              className="w-full h-full"
              allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Text Info Column (Pedagogy, Certs, Awards) */}
        {/* Add a condition to only render this div if there's content */}
        {(kita.special_pedagogy || (kita.certifications && kita.certifications.length > 0) || (kita.awards && kita.awards.length > 0)) && (
          <div className="space-y-4"> {/* Group text elements */}
            {kita.special_pedagogy && (
              <div> {/* Use div instead of mb-4 */}
                <h3 className="text-lg font-medium mb-2">Besondere Pädagogik</h3>
                <p className="text-gray-700">{kita.special_pedagogy}</p>
              </div>
            )}

            {kita.certifications && kita.certifications.length > 0 && (
              <div> {/* Use div instead of mb-4 */}
                <h3 className="text-lg font-medium mb-2">Zertifizierungen</h3>
                {/* Adjust grid for potentially smaller space */}
                <ul className="grid grid-cols-1 gap-2">
                  {kita.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{cert}</span>
              </li>
                    ))}
                  </ul>
                </div>
              )}

              {kita.awards && kita.awards.length > 0 && (
                <div> {/* Use div instead of mb-4 */}
                  <h3 className="text-lg font-medium mb-2">Auszeichnungen</h3>
                  {/* Adjust grid for potentially smaller space */}
                  <ul className="grid grid-cols-1 gap-2">
                    {kita.awards.map((award, index) => (
                      <li key={index} className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span>{award}</span>
              </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div> {/* End Grid */}
        </div>
  );
};

export default KitaPremiumSection;


import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, BarChart2, BookOpen, GraduationCap, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

interface AIMatchCardProps {
  matchScore: number;
  matchReasons: string[];
  missingSkills?: string[];
  jobTitle: string;
}

const AIMatchCard = ({ 
  matchScore, 
  matchReasons, 
  missingSkills = [], 
  jobTitle 
}: AIMatchCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentValue, setCurrentValue] = useState(0);
  
  // Animation for progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(matchScore);
    }, 300);
    return () => clearTimeout(timer);
  }, [matchScore]);
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 85) return "Sehr gute Übereinstimmung";
    if (score >= 60) return "Gute Übereinstimmung";
    return "Moderate Übereinstimmung";
  };

  const handleRequestPersonalizedAnalysis = () => {
    toast({
      title: "Persönliche Analyse angefordert",
      description: "Wir werden Ihnen in Kürze eine detaillierte Analyse zu dieser Stelle zusenden.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-subtle overflow-hidden animate-fade-in">
      <div className="bg-kita-orange/10 p-5 border-b border-kita-orange/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">KI-Matching</h3>
            <p className="text-sm text-gray-600 mt-1">
              Basierend auf Ihrem Profil
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <span className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
                {matchScore}%
              </span>
              <p className="text-xs text-gray-500 whitespace-nowrap">
                {getMatchScoreText(matchScore)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-kita-orange/10 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-kita-orange" />
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={currentValue} className="h-2" 
            indicatorClassName={
              matchScore >= 85 ? "bg-green-500" : 
              matchScore >= 60 ? "bg-amber-500" : 
              "bg-red-500"
            }
          />
        </div>
      </div>
      
      <div className="p-5">
        <p className="text-sm text-gray-600 mb-4">
          {showDetails 
            ? "Detaillierte Analyse Ihrer Qualifikationen im Vergleich zu dieser Stelle:"
            : "KI-Analyse zeigt, dass Sie wichtige Qualifikationen für diese Stelle mitbringen:"}
        </p>
        
        {!showDetails ? (
          <>
            <ul className="space-y-2 mb-4">
              {matchReasons.slice(0, 3).map((reason, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
              {matchReasons.length > 3 && (
                <li className="text-sm text-kita-orange font-medium cursor-pointer pl-6" onClick={() => setShowDetails(true)}>
                  + {matchReasons.length - 3} weitere anzeigen
                </li>
              )}
            </ul>
            
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-center text-kita-orange border-kita-orange/20 hover:bg-kita-orange/5"
              onClick={() => setShowDetails(true)}
            >
              Vollständige Analyse anzeigen
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Ihre passenden Qualifikationen
                </h4>
                <ul className="space-y-2 pl-6">
                  {matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-gray-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                    Mögliche Entwicklungsbereiche
                  </h4>
                  <ul className="space-y-2 pl-6">
                    {missingSkills.map((skill, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="text-gray-700">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-3 pt-2">
                <Button 
                  size="sm"
                  className="w-full justify-center bg-kita-orange hover:bg-kita-orange/90"
                  onClick={handleRequestPersonalizedAnalysis}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Persönliche Beratung anfordern
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setShowDetails(false)}
                >
                  Weniger anzeigen
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Analyse vom {new Date().toLocaleDateString('de-DE')}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <BookOpen className="h-3.5 w-3.5 mr-1" />
          <span className="hover:text-kita-orange cursor-pointer">Wie funktioniert die Analyse?</span>
        </div>
      </div>
    </div>
  );
};

export default AIMatchCard;

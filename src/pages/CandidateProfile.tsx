import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Edit, School, Briefcase, Award, PlusCircle, Save, 
  Trash2, Clock, BookOpen, BarChart2, MapPin, Check, Bookmark
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CandidateProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");
  
  // Dummy user data
  const userData = {
    name: "Maria Schmidt",
    title: "Staatlich anerkannte Erzieherin",
    location: "Berlin",
    aboutMe: "Seit 2015 bin ich als Erzieherin im Bereich der frühkindlichen Bildung tätig. Meine Schwerpunkte liegen in der sprachlichen Förderung und kreativen Gestaltung. Ich suche eine neue Herausforderung in einer Kita mit offenem Konzept.",
    experience: [
      {
        id: 1,
        role: "Erzieherin",
        company: "Kita Regenbogen",
        period: "04/2018 - heute",
        description: "Betreuung und Förderung von Kindern im Alter von 3-6 Jahren, Planung und Durchführung pädagogischer Angebote, Elternarbeit"
      },
      {
        id: 2,
        role: "Praktische Ausbildung",
        company: "Kinderhaus Sonnenschein",
        period: "09/2015 - 03/2018",
        description: "Praktische Ausbildung zur staatlich anerkannten Erzieherin"
      }
    ],
    education: [
      {
        id: 1,
        degree: "Staatlich anerkannte Erzieherin",
        institution: "Fachschule für Sozialpädagogik Berlin",
        period: "2015 - 2018"
      },
      {
        id: 2,
        degree: "Fachabitur",
        institution: "Berufliches Gymnasium Berlin",
        period: "2012 - 2015"
      }
    ],
    skills: [
      "Frühkindliche Bildung",
      "Sprachförderung",
      "Elternarbeit",
      "Kreative Gestaltung",
      "Teamarbeit",
      "Dokumentation",
      "Offenes Konzept"
    ],
    certificates: [
      {
        id: 1,
        name: "Zusatzqualifikation Sprachförderung",
        institution: "Weiterbildungsinstitut Berlin",
        year: "2019"
      },
      {
        id: 2,
        name: "Erste Hilfe am Kind",
        institution: "DRK",
        year: "2021"
      }
    ],
    preferences: {
      jobTypes: ["Vollzeit", "Teilzeit"],
      locations: ["Berlin", "Potsdam"],
      salaryExpectation: "3.000 - 3.500 €",
      workingHours: "Reguläre Arbeitszeit, keine Nachtdienste",
      conceptPreferences: ["Offenes Konzept", "Situationsansatz"],
      benefits: ["Weiterbildungsmöglichkeiten", "Teamevents", "Unbefristeter Vertrag"]
    },
    matchedJobs: [
      {
        id: "1",
        title: "Erzieher (m/w/d) in Vollzeit",
        company: "Kita Sonnenschein",
        location: "Berlin-Mitte",
        matchScore: 92,
        posted: "vor 2 Tagen"
      },
      {
        id: "3",
        title: "Erzieher/in für U3-Bereich",
        company: "Städtische Kita Marienkäfer",
        location: "Berlin-Kreuzberg",
        matchScore: 87,
        posted: "vor 3 Tagen"
      },
      {
        id: "7",
        title: "Erzieher/in mit Musik-Schwerpunkt",
        company: "Musikgarten Klangwelt",
        location: "Berlin-Charlottenburg",
        matchScore: 78,
        posted: "vor 4 Tagen"
      }
    ]
  };
  
  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      toast({
        title: "Fähigkeit hinzugefügt",
        description: `"${currentSkill}" wurde zu Ihren Fähigkeiten hinzugefügt.`,
      });
      setCurrentSkill("");
    }
  };
  
  const handleUpdateProfile = () => {
    setIsEditMode(false);
    toast({
      title: "Profil aktualisiert",
      description: "Ihre Profiländerungen wurden gespeichert.",
    });
  };
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="bg-kita-orange/10 p-5 text-center relative">
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsEditMode(!isEditMode)}
                      className="text-gray-600 hover:text-kita-orange transition-colors"
                    >
                      {isEditMode ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Edit className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-white shadow-sm">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  {isEditMode ? (
                    <div className="space-y-3">
                      <Input
                        defaultValue={userData.name}
                        className="text-center font-semibold"
                        placeholder="Name"
                      />
                      <Input
                        defaultValue={userData.title}
                        className="text-center text-sm"
                        placeholder="Berufsbezeichnung"
                      />
                      <div className="flex items-center mt-2 justify-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <Input
                          defaultValue={userData.location}
                          className="text-center text-sm w-32"
                          placeholder="Standort"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                      <p className="text-gray-600 text-sm">{userData.title}</p>
                      <div className="flex items-center mt-2 justify-center">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-gray-600 text-sm">{userData.location}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="font-medium text-gray-900 mb-3">Über mich</h3>
                  {isEditMode ? (
                    <Textarea
                      defaultValue={userData.aboutMe}
                      placeholder="Erzählen Sie etwas über Ihre Erfahrungen und Ziele..."
                      className="mb-4"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm mb-4">{userData.aboutMe}</p>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-kita-orange" />
                        Berufserfahrung
                      </h4>
                      <div className="text-sm text-gray-600">
                        {userData.experience[0].role} bei {userData.experience[0].company}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <School className="h-4 w-4 mr-2 text-kita-orange" />
                        Ausbildung
                      </h4>
                      <div className="text-sm text-gray-600">
                        {userData.education[0].degree}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-kita-orange" />
                        Fähigkeiten
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {userData.skills.length > 5 && (
                          <span className="text-xs text-kita-orange">+{userData.skills.length - 5} weitere</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full bg-kita-orange hover:bg-kita-orange/90 text-white"
                      onClick={handleUpdateProfile}
                    >
                      {isEditMode ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Profil speichern
                        </>
                      ) : (
                        "Vollständiges Profil anzeigen"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* KI Match Assistant */}
              <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="bg-gradient-to-r from-kita-orange/20 to-amber-100 p-5 border-b border-amber-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-kita-orange" />
                    KI-Match-Optimierung
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Verbessern Sie Ihre Stellenübereinstimmung
                  </p>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Ergänzen Sie Ihre Fähigkeiten
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      KI-Analyse zeigt: Folgende Fähigkeiten könnten Ihre Jobchancen verbessern
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <Input
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          placeholder="Neue Fähigkeit hinzufügen"
                          className="text-sm"
                        />
                        <Button 
                          onClick={handleAddSkill}
                          size="sm"
                          className="ml-2 px-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full flex items-center">
                          <span>Musikpädagogik</span>
                          <PlusCircle className="h-3 w-3 ml-1 cursor-pointer" />
                        </div>
                        <div className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full flex items-center">
                          <span>U3-Betreuung</span>
                          <PlusCircle className="h-3 w-3 ml-1 cursor-pointer" />
                        </div>
                        <div className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full flex items-center">
                          <span>Montessori</span>
                          <PlusCircle className="h-3 w-3 ml-1 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 italic flex items-center mb-4">
                      <Clock className="h-3 w-3 mr-1" />
                      Letzte Analyse: Heute, 14:30 Uhr
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 flex items-center hover:text-kita-orange cursor-pointer">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Wie funktioniert die Analyse?
                      </span>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Vollständige Analyse
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="matches">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="matches" className="text-sm">
                    KI-Matches
                  </TabsTrigger>
                  <TabsTrigger value="applications" className="text-sm">
                    Bewerbungen
                  </TabsTrigger>
                  <TabsTrigger value="saved" className="text-sm">
                    Gespeicherte Jobs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="matches" className="space-y-4">
                  <div className="bg-white rounded-xl shadow-subtle p-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      KI-Matches für Sie
                    </h2>
                    <p className="text-gray-600 text-sm mb-6">
                      Basierend auf Ihrem Profil und Ihren Präferenzen hat die KI folgende Stellen für Sie gefunden.
                    </p>
                    
                    <div className="space-y-4">
                      {userData.matchedJobs.map((job) => (
                        <div key={job.id} className="border border-gray-100 rounded-lg p-4 transition-all hover:border-kita-orange/30 hover:shadow-subtle">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{job.title}</h3>
                              <p className="text-gray-600 text-sm">{job.company}</p>
                              <div className="flex items-center text-gray-500 text-xs mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job.location}
                                <span className="mx-2">•</span>
                                <Clock className="h-3 w-3 mr-1" />
                                {job.posted}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center mb-1">
                                <div className={`w-8 h-8 rounded-full ${getMatchScoreColor(job.matchScore)} text-white flex items-center justify-center text-xs font-medium`}>
                                  {job.matchScore}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">%</span>
                              </div>
                              <span className="text-xs text-gray-500">Match</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <Button variant="outline" size="sm" className="text-xs">
                              Details anzeigen
                            </Button>
                            <Button size="sm" className="text-xs bg-kita-orange hover:bg-kita-orange/90">
                              Jetzt bewerben
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <Button variant="outline">
                        Alle passenden Jobs anzeigen
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="applications">
                  <div className="bg-white rounded-xl shadow-subtle p-6 text-center">
                    <div className="text-gray-400 my-8">
                      <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-medium text-gray-600">Keine Bewerbungen vorhanden</h3>
                      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                        Sie haben noch keine Bewerbungen verschickt. Nutzen Sie unsere KI-Matches, um passende Stellen zu finden und sich zu bewerben.
                      </p>
                      
                      <Button className="mt-6 bg-kita-orange hover:bg-kita-orange/90">
                        Zu den Stellenangeboten
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="saved">
                  <div className="bg-white rounded-xl shadow-subtle p-6 text-center">
                    <div className="text-gray-400 my-8">
                      <Bookmark className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="text-lg font-medium text-gray-600">Keine gespeicherten Jobs</h3>
                      <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                        Sie haben noch keine Stellenangebote gespeichert. Speichern Sie interessante Stellen, um sie später wiederzufinden.
                      </p>
                      
                      <Button className="mt-6 bg-kita-orange hover:bg-kita-orange/90">
                        Jobs durchsuchen
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CandidateProfile;

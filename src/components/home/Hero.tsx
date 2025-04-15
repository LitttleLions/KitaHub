
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getRandomStaticImage } from "@/lib/utils"; // Import the utility

const Hero = () => {
  const heroImage = getRandomStaticImage(); // Get a random image
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1/2">
        <div className="absolute right-0 -top-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute left-0 top-10 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Finde die passende{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-kita-orange to-orange-500">
                Kita
              </span>{" "}
              für deine Familie
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Die größte Datenbank für Kindertagesstätten in Deutschland -
              Informiere dich über Kitas in deiner Nähe und finde den perfekten
              Platz für dein Kind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/kitas">
                <Button
                  size="lg"
                  className="bg-kita-orange hover:bg-kita-orange/90 font-medium text-white"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Kita suchen
                </Button>
              </Link>
              <Link to="/jobboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-kita-orange text-kita-orange hover:bg-kita-orange/10 font-medium"
                >
                  Kita-Jobs finden
                </Button>
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Über{" "}
                <span className="font-semibold text-gray-700">50.000</span>{" "}
                Kitas in ganz Deutschland
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-full h-auto rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage} // Use the random image path
                  alt="Kinder in einer Kita"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">M</div>
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-600 font-bold">L</div>
                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 font-bold">K</div>
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium">Eltern vertrauen uns</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

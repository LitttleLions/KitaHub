
import { Users, Building, CheckCircle, Award } from 'lucide-react';

const JobStats = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full text-blue-500 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">50.000+</h3>
            <p className="text-gray-600">Kitas deutschlandweit</p>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-full text-green-500 mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">5.000+</h3>
            <p className="text-gray-600">Aktive Stellenangebote</p>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-full text-amber-500 mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">85%</h3>
            <p className="text-gray-600">Erfolgreiche Vermittlungen</p>
          </div>
          
          {/* Stat 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full text-red-500 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">#1</h3>
            <p className="text-gray-600">Jobbörse für Kita-Fachkräfte</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobStats;

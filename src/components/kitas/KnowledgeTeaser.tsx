
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPlaceholderImage } from "@/services/companyService";

interface KnowledgeItem {
  title: string;
  description: string;
  link: string;
  imageSrc?: string;
}

const knowledgeItems: KnowledgeItem[] = [
  {
    title: 'Für Eltern',
    description: 'Guides und Tipps zur Kita-Suche, Eingewöhnung und Förderung Ihres Kindes.',
    link: '/guides/eltern',
    imageSrc: getPlaceholderImage(0)
  },
  {
    title: 'Für Erzieher/innen',
    description: 'Pädagogische Konzepte, Weiterbildungsmöglichkeiten und Karrieretipps.',
    link: '/guides/erzieher',
    imageSrc: getPlaceholderImage(1)
  },
  {
    title: 'Gesundheit & Ernährung',
    description: 'Informationen zu gesunder Ernährung, Bewegung und Wohlbefinden in der Kita.',
    link: '/guides/gesundheit',
    imageSrc: getPlaceholderImage(2)
  },
  {
    title: 'Rechtliches & Organisation',
    description: 'Hilfreiche Informationen zu rechtlichen Aspekten und organisatorischen Fragen.',
    link: '/guides/rechtliches',
    imageSrc: getPlaceholderImage(0)
  },
];

const KnowledgeTeaser = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wissenswertes rund um die Kita</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie unsere umfangreichen Informationen und Guides für Eltern, Erzieher/innen und Kita-Leitungen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {knowledgeItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.imageSrc} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link 
                  to={item.link} 
                  className="group inline-flex items-center text-kita-green font-medium hover:text-kita-green/80 transition-colors"
                >
                  Mehr erfahren
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowledgeTeaser;

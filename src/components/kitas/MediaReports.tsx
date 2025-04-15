
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MediaItem {
  name: string;
  logo: string;
  url: string;
}

const mediaItems: MediaItem[] = [
  {
    name: 'Süddeutsche Zeitung',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/S%C3%BCddeutsche_Zeitung_Logo.svg/512px-S%C3%BCddeutsche_Zeitung_Logo.svg.png',
    url: 'https://www.sueddeutsche.de/',
  },
  {
    name: 'Spiegel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Der_Spiegel_logo.svg/512px-Der_Spiegel_logo.svg.png',
    url: 'https://www.spiegel.de/',
  },
  {
    name: 'Focus',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Focus_Logo.svg/512px-Focus_Logo.svg.png',
    url: 'https://www.focus.de/',
  },
  {
    name: 'Welt',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Die_Welt_Logo.svg/512px-Die_Welt_Logo.svg.png',
    url: 'https://www.welt.de/',
  },
  {
    name: 'Zeit',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Die_Zeit_logo.svg/512px-Die_Zeit_logo.svg.png',
    url: 'https://www.zeit.de/',
  },
];

const MediaReports = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">In den Medien</h2>
          <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
            kita.de wird regelmäßig von renommierten Medien als verlässliche Quelle für den Bereich Kindertagesstätten zitiert.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {mediaItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <img 
                src={item.logo} 
                alt={`${item.name} Logo`} 
                className="h-12 md:h-16 object-contain"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaReports;

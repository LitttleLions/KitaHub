import React from 'react';
import { Link } from 'react-router-dom';

interface KnowledgeCardProps {
  knowledge: {
    id: string;
    title: string;
    teaser?: string;
    image_url?: string;
  };
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ knowledge }) => {
  return (
    <Link to={`/knowledge/${knowledge.id}`} className="block rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {knowledge.image_url && (
        <img src={knowledge.image_url} alt={knowledge.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{knowledge.title}</h3>
        {knowledge.teaser && (
          <p className="text-gray-600 text-sm">{knowledge.teaser}</p>
        )}
      </div>
    </Link>
  );
};

export default KnowledgeCard;

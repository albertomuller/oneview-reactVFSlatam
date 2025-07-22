import React from 'react';

export default function PortfolioCard({ initiative }) {
  return (
    <div className="one-pager-card p-6 mb-6">
      <h3 className="text-lg font-bold text-primary mb-2">{initiative.title}</h3>
      <p className="text-gray-700">{initiative.description}</p>
      {/* Adicione outros campos conforme necessário */}
    </div>
  );
}
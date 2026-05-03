import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSettingsStore } from '../../store';
import PackageCard from './PackageCard';

export default function FeaturedPackages({ packages, onEnquiry }) {
  const settings = useSettingsStore(s => s.settings);
  const primaryColor = settings.primaryColor || '#1E3A5F';
  const displayPackages = packages && packages.length > 0 ? packages : [];
  
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Bestselling Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPackages.slice(0, 3).map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} onEnquiry={onEnquiry} />
          ))}
        </div>
        {displayPackages.length === 0 && <p className="text-center text-gray-500 py-8">No packages available yet.</p>}
        <div className="text-center mt-10">
          <Link to="/category" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition border-2 hover:text-white"
             style={{ borderColor: primaryColor, color: primaryColor }}
             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primaryColor; e.currentTarget.style.color = 'white'; }}
             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = primaryColor; }}
          >
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
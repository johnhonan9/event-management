import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home as HomeLucide } from 'lucide-react';

export default function Breadcrumb({ items }) {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <button onClick={() => navigate('/')} className="hover:text-blue-600 flex items-center gap-1 transition">
        <HomeLucide className="w-4 h-4" /> Home
      </button>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          {item.link ? (
            <Link to={item.link} className="hover:text-blue-600 transition">{item.label}</Link>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
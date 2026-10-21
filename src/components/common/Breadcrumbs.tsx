import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  params?: Record<string, string>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useShop();

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-brand-muted">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1 hover:text-brand-primary transition-colors focus:outline-none"
            title="CarePlus Home"
          >
            <Home size={13} className="shrink-0" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight size={12} className="text-brand-subtle/60 shrink-0" />
              {isLast || !item.path ? (
                <span className="font-medium text-brand-charcoal truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => navigate(item.path!, item.params)}
                  className="hover:text-brand-primary transition-colors focus:outline-none truncate max-w-[160px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

import React from 'react';
import { SortOption } from '../../types';
import { ArrowUpDown } from 'lucide-react';

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-brand-muted hidden sm:block" />
      <span className="text-xs text-brand-muted hidden sm:inline">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="bg-white border border-brand-border text-brand-charcoal text-xs font-medium py-2 px-3 rounded-brand focus:outline-none focus:border-brand-primary cursor-pointer shadow-subtle"
      >
        <option value="featured">Featured Favourites</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Highest Customer Rating</option>
        <option value="name-asc">Alphabetical: A to Z</option>
      </select>
    </div>
  );
};

import React from 'react';
import { useShop } from '../../context/ShopContext';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  className = '',
}) => {
  const { navigate } = useShop();

  const isLight = variant === 'light';

  // Responsive height classes based on size prop (increased for better brand visibility & readability)
  const heightClass =
    size === 'sm'
      ? 'h-9 sm:h-10'
      : size === 'lg'
      ? 'h-13 sm:h-14 md:h-16'
      : size === 'xl'
      ? 'h-16 sm:h-20'
      : 'h-11 sm:h-12 md:h-14';

  return (
    <button
      onClick={() => navigate('home')}
      className={`inline-flex items-center text-left group transition-all duration-200 hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-lg py-1 ${className}`}
      aria-label="CarePlus Health Shop - Go to homepage"
    >
      {isLight ? (
        <div className="bg-white/95 hover:bg-white transition-colors duration-200 px-3.5 py-2 rounded-xl shadow-subtle flex items-center">
          <img
            src="/logo.png"
            alt="CarePlus Health"
            className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
          />
        </div>
      ) : (
        <img
          src="/logo.png"
          alt="CarePlus Health"
          className={`${heightClass} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
        />
      )}
    </button>
  );
};

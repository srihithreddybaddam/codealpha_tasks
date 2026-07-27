import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BasketlyLogo - Premium, Scalable SVG Brand Logo Component
 * Represents the Basketly E-Commerce brand featuring a modern shopping basket
 * subtly filled with fresh produce (leafy greens & fresh fruits).
 */
const BasketlyLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showText = true,
  showTagline = true,
  clickable = true,
  className = '',
  textClass = '',
  taglineClass = '',
  iconOnly = false,
}) => {
  // Sizing definitions for container, icon, text & tagline
  const iconContainerSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl sm:rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
    '2xl': 'w-16 h-16 rounded-3xl',
  };

  const svgIconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5 sm:w-6 sm:h-6',
    lg: 'w-6 h-6 sm:w-7 sm:h-7',
    xl: 'w-7 h-7 sm:w-8 sm:h-8',
    '2xl': 'w-9 h-9',
  };

  const titleSizes = {
    sm: 'text-base font-black',
    md: 'text-xl font-black',
    lg: 'text-2xl sm:text-3xl font-black',
    xl: 'text-3xl sm:text-4xl font-black',
    '2xl': 'text-4xl sm:text-5xl font-black',
  };

  const taglineSizes = {
    sm: 'text-[8px] font-extrabold',
    md: 'text-[9px] font-extrabold',
    lg: 'text-[10px] font-extrabold',
    xl: 'text-[11px] font-extrabold',
    '2xl': 'text-[12px] font-extrabold',
  };

  const innerContent = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Shopping Basket Vector Icon Box */}
      <div
        className={`${
          iconContainerSizes[size] || iconContainerSizes.md
        } bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all duration-300 relative overflow-hidden flex-shrink-0 border border-emerald-300/30`}
      >
        <svg
          className={`${svgIconSizes[size] || svgIconSizes.md} text-white drop-shadow-sm`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fresh Produce Peeking from Top of Basket */}
          {/* Leaf 1 */}
          <path
            d="M10.2 3.2C10.2 3.2 11.6 2.0 13.5 2.8C13.5 2.8 12.8 4.6 11.0 4.6C10.2 4.6 10.2 3.2 10.2 3.2Z"
            fill="#86EFAC"
          />
          {/* Leaf 2 */}
          <path
            d="M7.8 4.5C7.8 4.5 6.5 3.5 5.5 4.8C5.5 4.8 6.8 6.0 8.2 5.5C8.4 5.0 8.2 4.5 7.8 4.5Z"
            fill="#4ADE80"
          />
          {/* Fruit / Apple Top Curve */}
          <path
            d="M13.5 5.2C14.2 4.6 15.2 4.2 16.2 4.2C17.8 4.2 19 5.4 19 7C19 7.4 18.9 7.8 18.7 8.2H12.5C12.8 7 13.5 5.2 13.5 5.2Z"
            fill="#FDE047"
            fillOpacity="0.85"
          />

          {/* Basket Handle */}
          <path
            d="M8.2 8.5C8.2 5.8 9.9 4 12 4C14.1 4 15.8 5.8 15.8 8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Main Shopping Basket Body */}
          <path
            d="M3.5 8.5H20.5C21.1 8.5 21.5 9.0 21.4 9.6L19.6 19.1C19.4 20.2 18.5 21.0 17.3 21.0H6.7C5.5 21.0 4.6 20.2 4.4 19.1L2.6 9.6C2.5 9.0 2.9 8.5 3.5 8.5Z"
            fill="currentColor"
            fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Basket Grid Weave Details */}
          <path
            d="M4.2 12.5H19.8M5.2 16.5H18.8M8.5 8.5V21.0M12.0 8.5V21.0M15.5 8.5V21.0"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Basket Top Rim Highlight */}
          <path
            d="M3.2 8.5H20.8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline Text */}
      {showText && !iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`${
              titleSizes[size] || titleSizes.md
            } tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent ${textClass}`}
          >
            BASKETLY
          </span>
          {showTagline && (
            <span
              className={`${
                taglineSizes[size] || taglineSizes.md
              } tracking-wider text-emerald-400/90 uppercase mt-0.5 ${taglineClass}`}
            >
              Freshness Delivered Daily
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-block focus:outline-none" aria-label="Basketly Home">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
};

export default BasketlyLogo;

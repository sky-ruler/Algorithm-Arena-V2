import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, hoverEffect = false }) => {
  return (
    <div
      className={clsx(
        'macos-glass p-6 rounded-2xl transition-all duration-300',
        hoverEffect && 'hover:border-accent hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
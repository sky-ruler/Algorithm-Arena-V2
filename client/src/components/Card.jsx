import React from 'react';

const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`macos-glass ${className}`} style={{ 
      borderRadius: '18px', 
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          {title && <h3 style={{ fontSize: '17px', fontWeight: '600', margin: 0 }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
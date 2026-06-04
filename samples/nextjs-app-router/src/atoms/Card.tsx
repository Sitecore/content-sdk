'use client';
import React from 'react';

interface CardProps {
  description?: string | null;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ description, children }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
      {children}
      {description && <p>{description}</p>}
    </div>
  );
};

export default Card;


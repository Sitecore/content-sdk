'use client';
import React from 'react';

interface CardTitleProps {
  title: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default CardTitle;


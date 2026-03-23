'use client';
import React, { useEffect } from 'react';
import { AtomMetadata } from '../../atoms';

export const AtomRenderer = ({ atoms }: { atoms?: AtomMetadata[] }) => {
  useEffect(() => {
    console.log('AtomRenderer, available atoms:', atoms);
  }, [atoms]);

  return <div>Atoms Renderer</div>;
};

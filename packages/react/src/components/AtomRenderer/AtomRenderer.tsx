'use client';
import React, { useEffect } from 'react';
import { AtomMetadata, CallbackMetadata } from '../../atoms';

export const AtomRenderer = ({
  atoms,
  callbacks,
}: {
  atoms?: AtomMetadata[];
  callbacks?: CallbackMetadata[];
}) => {
  useEffect(() => {
    console.log(`AtomRenderer, available atoms: ${atoms}, available callbacks: ${callbacks}`);
  }, [atoms, callbacks]);

  return <div>Atoms Renderer</div>;
};

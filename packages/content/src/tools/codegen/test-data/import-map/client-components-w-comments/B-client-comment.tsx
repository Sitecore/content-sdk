// client component with comments before 'use client' directive
'use client';
import React, { useContext } from '../fake-react';

export const BC = () => {
  console.log(React, useContext);
  return 'B';
};

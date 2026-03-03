import React, { useMemo } from '../fake-react';
// do not format on save - the position of 'use client' directive is important for this test
// eslint-disable-next-line no-unused-expressions
('use client');

export const DC = () => {
  console.log(React, useMemo);
  return 'D';
};

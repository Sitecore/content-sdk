/**
 *  client component with block comments before 'use client' directive
 */
'use client';
import React, { useState } from '../fake-react';

export const BC = () => {
  console.log(React, useState);
  return 'B';
};

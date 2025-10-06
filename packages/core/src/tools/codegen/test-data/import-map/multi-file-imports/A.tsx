import React, { useEffect } from '../fake-react';

/**
 *
 */
export default function A() {
  // reference imports so the parser sees them as “used”
  console.log(React, useEffect);
  return 'A';
}

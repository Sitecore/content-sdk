import React from 'react';

const baseStyles = {
  backgroundSize: '3px 3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px',
  color: '#aaa',
};

const backgroundImageStyle = {
  backgroundImage:
    'linear-gradient(45deg, #ffffff 25%, #dcdcdc 25%, #dcdcdc 50%, #ffffff 50%, #ffffff 75%, #dcdcdc 75%, #dcdcdc 100%)',
};

export const HiddenRendering = () => {
  const styles =
    process.env.NODE_ENV === 'test' ? baseStyles : { ...baseStyles, ...backgroundImageStyle };

  return <div style={styles}>The component is hidden</div>;
};

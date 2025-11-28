import React from 'react';
import '../css/separator.css';

function Separator({
  className = '',
  orientation = 'horizontal',
  decorative = true,
  ...props
}) {
  return (
    <div
      className={`separator-root separator-${orientation} ${className}`}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      {...props}
    />
  );
}

export default Separator;
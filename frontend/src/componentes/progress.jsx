import React from 'react';
import '../css/progress.css';

function Progress({ className = '', value = 0, max = 100, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`progress-root ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      {...props}
    >
      <div
        className="progress-indicator"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}

export default Progress;

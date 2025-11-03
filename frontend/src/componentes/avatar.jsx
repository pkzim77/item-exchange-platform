import * as React from "react";
import '../css/avatar.css'

function Avatar({ children, className, ...props }) {
  return (
    <div className={`avatar ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function AvatarFallback({ children, ...props }) {
  return (
    <div className="avatar-fallback" {...props}>
      {children}
    </div>
  );
}

export { Avatar, AvatarFallback };
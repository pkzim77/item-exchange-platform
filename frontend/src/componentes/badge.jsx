import * as React from "react";
import "../css/badge.css";

function Badge({ className = "", variant = "default", asChild = false, children, ...props }) {
  const badgeClass = `badge badge-${variant} ${className}`.trim();
  
  if (asChild && React.isValidElement(children)) {
    // Clona o elemento filho e adiciona as classes do badge
    return React.cloneElement(children, {
      ...props,
      className: `${badgeClass} ${children.props.className || ""}`.trim(),
      "data-slot": "badge"
    });
  }
  
  return (
    <span
      data-slot="badge"
      className={badgeClass}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
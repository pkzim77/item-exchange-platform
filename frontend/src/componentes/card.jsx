import * as React from "react";
import '../css/card.css'

function Card({ className = "", children, ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className = "", children, ...props }) {
  return (
    <h2 className={`card-title ${className}`} {...props}>
      {children}
    </h2>
  );
}

function CardDescription({ className = "", children, ...props }) {
  return (
    <p className={`card-description ${className}`} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className = "", children, ...props }) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

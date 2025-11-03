import * as React from "react";
import '../css/input.css'

function Input({ className = "", type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`input ${className}`}
      {...props}
    />
  );
}

export { Input };
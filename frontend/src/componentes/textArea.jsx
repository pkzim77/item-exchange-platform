import React from "react";
import "../css/textArea.css";

function TextArea({ className = "", ...props }) {
  return <textarea className={`textarea ${className}`} {...props} />;
}

export { TextArea };

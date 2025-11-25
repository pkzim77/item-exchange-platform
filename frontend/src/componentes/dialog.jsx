import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import "../css/dialog.css";

export function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogPortal(props) {
  return <DialogPrimitive.Portal {...props} />;
}

export function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

export function DialogOverlay({ className = "", ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={`dialog-overlay ${className}`}
      {...props}
    />
  );
}

export function DialogContent({ className = "", children, ...props }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={`dialog-content ${className}`}
        {...props}
      >
        {children}

        <DialogPrimitive.Close className="dialog-close">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className = "", ...props }) {
  return <div className={`dialog-header ${className}`} {...props} />;
}

export function DialogFooter({ className = "", ...props }) {
  return <div className={`dialog-footer ${className}`} {...props} />;
}

export function DialogTitle({ className = "", ...props }) {
  return (
    <DialogPrimitive.Title
      className={`dialog-title ${className}`}
      {...props}
    />
  );
}

export function DialogDescription({ className = "", ...props }) {
  return (
    <DialogPrimitive.Description
      className={`dialog-description ${className}`}
      {...props}
    />
  );
}

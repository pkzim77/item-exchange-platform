import React, { useState, createContext, useContext } from 'react';
import '../css/tabs.css'

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Context para compartilhar o estado entre os componentes
const TabsContext = createContext();

function Tabs({ defaultValue, value: controlledValue, onValueChange, className, children, ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div data-slot="tabs" className={cn("tabs-root", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn("tabs-list", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, className, children, disabled, ...props }) {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  const handleClick = () => {
    if (!disabled) {
      context.onValueChange(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      data-slot="tabs-trigger"
      className={cn("tabs-trigger", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      data-slot="tabs-content"
      className={cn("tabs-content", className)}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
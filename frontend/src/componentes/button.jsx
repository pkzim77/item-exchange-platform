import '../css/button.css';

function Button({ 
  children,
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  disabled,
  ...props 
}) {
  // Combina as classes base + variante + tamanho + customizadas
  const buttonClass = `button button-${variant} button-${size} ${className}`.trim();
  
  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      data-slot="button"
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
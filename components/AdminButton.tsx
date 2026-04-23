import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'text' | 'destructive';
  size?: 'large' | 'default' | 'small' | 'compact';
  pathway?: 'indigo' | 'emerald' | 'red';
  children: React.ReactNode;
  asLink?: boolean;
  href?: string;
}

const variantClasses = {
  primary: 'ds-btn-primary',
  secondary: 'ds-btn-secondary',
  icon: 'ds-btn-icon',
  text: 'ds-btn-text',
  destructive: 'ds-btn-destructive',
};

const sizeClasses = {
  large: 'ds-btn-large',
  default: 'ds-btn',
  small: 'ds-btn-small',
  compact: 'ds-btn-compact',
};

export const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      pathway = 'indigo',
      children,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const classes = [
      variantClasses[variant],
      sizeClasses[size],
      `ds-btn-pathway-${pathway}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const baseStyle: React.CSSProperties = {
      fontFamily: 'inherit',
      ...style,
    };

    return (
      <button
        ref={ref}
        className={classes}
        style={baseStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AdminButton.displayName = 'AdminButton';

export default AdminButton;

import { Loader2 } from 'lucide-react';

interface FormButtonProps {
  type?: 'submit' | 'button' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  isDarkMode?: boolean;
  icon?: React.ReactNode;
}

export function FormButton({
  type = 'button',
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  loading,
  fullWidth,
  isDarkMode = false,
  icon,
}: FormButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-xl
    transition-all duration-200 outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600 text-white
      hover:from-blue-600 hover:to-blue-700
      focus:ring-blue-500/30
      shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30
    `,
    secondary: isDarkMode
      ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500/30'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300/50',
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      hover:from-red-600 hover:to-red-700
      focus:ring-red-500/30
      shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30
    `,
    ghost: isDarkMode
      ? 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500/30'
      : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300/50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

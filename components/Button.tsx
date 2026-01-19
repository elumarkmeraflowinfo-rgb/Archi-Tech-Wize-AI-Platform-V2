import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'sunrise';
  to?: string;
  onClick?: () => void;
  className?: string;
  icon?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  to,
  onClick,
  className = '',
  icon = false,
  disabled = false
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-brand-primary hover:shadow-lg hover:shadow-sky-200 focus:ring-slate-900",
    secondary: "bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary hover:text-white focus:ring-amber-500",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 focus:ring-slate-900 bg-white/50 backdrop-blur-sm",
    white: "bg-white text-slate-900 hover:bg-slate-50 shadow-md hover:shadow-xl focus:ring-white",
    sunrise: "bg-gradient-to-r from-brand-secondary to-amber-600 text-white hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-1",
  };

  const content = (
    <>
      {children}
      {icon && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className} group`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className} group`}>
      {content}
    </button>
  );
};

export default Button;
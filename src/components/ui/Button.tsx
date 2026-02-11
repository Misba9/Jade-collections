import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center font-serif tracking-wider uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-jade-900 disabled:pointer-events-none disabled:opacity-50',
            {
              'bg-jade-900 text-white hover:bg-jade-950 shadow-md hover:shadow-lg': variant === 'primary',
              'bg-gold-500 text-white hover:bg-gold-600 shadow-md': variant === 'secondary',
              'bg-gradient-to-r from-gold-400 to-gold-600 text-white hover:from-gold-500 hover:to-gold-700 shadow-md': variant === 'gold',
              'border border-jade-900 text-jade-900 hover:bg-jade-900 hover:text-white': variant === 'outline',
              'text-jade-900 hover:bg-jade-50 hover:text-jade-950': variant === 'ghost',
              'h-10 px-6 text-xs': size === 'sm',
              'h-12 px-8 text-sm': size === 'md',
              'h-14 px-10 text-base': size === 'lg',
            },
            className
          )}
          disabled={isLoading}
          {...props}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </button>
      </motion.span>
    );
  }
);
Button.displayName = 'Button';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(({ error, label, id, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-semibold text-[#111111] dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          ref={ref}
          className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
          } rounded-xl text-sm text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors`}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4.5 w-4.5" />
          ) : (
            <Eye className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium">
          {error.message}
        </span>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

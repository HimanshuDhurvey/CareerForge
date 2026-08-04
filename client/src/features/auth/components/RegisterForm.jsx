import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordInput from './PasswordInput';
import ConfirmPasswordInput from './ConfirmPasswordInput';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../../../assets/google.jpg';

export default function RegisterForm() {
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully. Please log in.");
      navigate('/login');
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          const fieldName = err.field === 'fullName' ? 'name' : err.field;
          setError(fieldName, {
            type: 'server',
            message: err.message,
          });
        });
        toast.error("Please correct the validation errors.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.success("Google signup is simulated. Please use the form.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label 
          htmlFor="name" 
          className="text-sm font-semibold text-[#111111] dark:text-gray-200"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          disabled={isLoading}
          className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
            errors.name 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
          } rounded-xl text-sm text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          {...register('name', { 
            required: 'Full name is required',
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters'
            }
          })}
        />
        {errors.name && (
          <span className="text-xs text-red-500 font-medium">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-1.5 text-left">
        <label 
          htmlFor="email" 
          className="text-sm font-semibold text-[#111111] dark:text-gray-200"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
            errors.email 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
          } rounded-xl text-sm text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
          {...register('email', { 
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && (
          <span className="text-xs text-red-500 font-medium">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password field */}
      <PasswordInput
        id="password"
        label="Password"
        placeholder="••••••••"
        disabled={isLoading}
        error={errors.password}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]).+$/,
            message: 'Password must contain uppercase, lowercase, a number and special character'
          }
        })}
      />

      {/* Confirm Password field */}
      <ConfirmPasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        disabled={isLoading}
        error={errors.confirmPassword}
        {...register('confirmPassword', {
          required: 'Confirm password is required',
          validate: (value) => value === passwordValue || 'Passwords do not match'
        })}
      />

      {/* Terms and Conditions Checkbox */}
      <div className="flex flex-col gap-1 text-left select-none pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            disabled={isLoading}
            className="mt-0.5 rounded border-[#E5E7EB] dark:border-gray-800 text-blue-500 focus:ring-blue-400 h-4 w-4 bg-white dark:bg-[#111827]"
            {...register('terms', { 
              required: 'You must accept the terms and conditions' 
            })}
          />
          <span>
            I agree to the{' '}
            <a 
              href="#terms" 
              onClick={(e) => {
                e.preventDefault();
                toast("Terms & Conditions are not implemented yet.", { icon: "ℹ️" });
              }} 
              className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a 
              href="#privacy" 
              onClick={(e) => {
                e.preventDefault();
                toast("Privacy Policy is not implemented yet.", { icon: "ℹ️" });
              }} 
              className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.terms && (
          <span className="text-xs text-red-500 font-medium">
            {errors.terms.message}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <img src={googleLogo} alt="Google logo" className="h-5 w-5 object-contain" />
          Continue with Google
        </button>
      </div>
    </form>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PasswordInput from './PasswordInput';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import googleLogo from '../../../assets/google.jpg';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.success("Google Login is simulated. Please use the form.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          }
        })}
      />

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between text-sm select-none">
        <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            disabled={isLoading}
            className="rounded border-[#E5E7EB] dark:border-gray-800 text-blue-500 focus:ring-blue-400 h-4 w-4 bg-white dark:bg-[#111827]"
            {...register('rememberMe')}
          />
          <span>Remember me</span>
        </label>
        <a 
          href="#forgot-password" 
          onClick={(e) => {
            e.preventDefault();
            toast("Password recovery is not implemented yet.", { icon: "ℹ️" });
          }}
          className="font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
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
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
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

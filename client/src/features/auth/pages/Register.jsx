import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import logo from '../../../assets/logo.jpg';

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors theme-transition">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Left Side: Logo & Welcoming */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          {/* Logo and Name */}
          <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-[#111111] dark:text-white">
            <img src={logo} alt="CareerForge Logo" className="h-10 w-10 rounded-md object-cover" />
            <span>
              Career<span className="text-blue-600 dark:text-blue-500">Forge</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white leading-tight">
            Start your preparation journey <span className="text-blue-500">today</span>.
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg">
            Create role-specific mock interviews, analyze your resume, and solve coding challenges with instant, actionable feedback.
          </p>
        </div>

        {/* Right Side: Register Card & Login Link */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto space-y-6 flex flex-col justify-center">
          {/* Mobile-only header (shows logo when left side is hidden) */}
          <div className="flex flex-col items-center text-center space-y-3 lg:hidden">
            <div className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-[#111111] dark:text-white">
              <img src={logo} alt="CareerForge Logo" className="h-10 w-10 rounded-md object-cover" />
              <span>
                Career<span className="text-blue-600 dark:text-blue-500">Forge</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
              Create an account
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign up to unlock all features
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-md transition-colors theme-transition">
            {/* Desktop Welcoming */}
            <div className="hidden lg:block space-y-1.5 mb-6 text-left">
              <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
                Create Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provide your details to register a new account
              </p>
            </div>

            <RegisterForm />
          </div>

          {/* Bottom Link: Login */}
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
            </span>
            <Link 
              to="/login" 
              className="font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, PlayCircle, ArrowRight,
  Video, FileText, Code2, BarChart3, User, Star
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 bg-white dark:bg-[#0b0f19] transition-colors theme-transition overflow-hidden">
      {/* Decorative dotted pattern behind hero mockup */}
      <div className="absolute right-4 top-[25%] translate-y-[-50%] grid grid-cols-5 gap-2.5 opacity-30 select-none hidden lg:grid">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500"></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8">
          {/* Left Column: Heading and Text */}
          <div className="lg:col-span-6 space-y-7 text-left relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Career Accelerator
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] dark:text-white leading-tight">
              Ace your next <br />
              job interview <br />
              <span className="relative text-blue-600 dark:text-blue-500 inline-block mt-1">
                with AI.
                {/* SVG Hand-drawn underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-blue-600 dark:text-blue-500" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                  <path d="M2 7 C 35 1.5, 65 1.5, 98 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Short description */}
            <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-400 max-w-xl font-normal leading-relaxed">
              Practice role-specific mock interviews, analyze your resume, and solve coding challenges with instant, actionable feedback.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-6 py-3.5 text-sm font-semibold transition-all rounded-full flex items-center gap-2 shadow-sm hover:shadow"
              >
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="border border-[#E5E7EB] dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-black text-[#111111] dark:text-white px-6 py-3.5 text-sm font-semibold transition-all rounded-full flex items-center gap-2"
              >
                See How It Works
                <PlayCircle className="h-4.5 w-4.5 text-[#6B7280] dark:text-gray-400" />
              </a>
            </div>

            {/* Ratings / Social Proof */}
            <div className="flex items-center gap-4 pt-4 border-t border-[#F3F4F6] dark:border-gray-900/50 max-w-md">
              <div className="flex items-center">
                {/* Avatars */}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0b0f19] bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-30">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0b0f19] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm -ml-2 z-20">AS</div>
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0b0f19] bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm -ml-2 z-10">MK</div>
              </div>
              <div className="text-left space-y-0.5">
                <div className="flex text-[#FACC15]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
                <p className="text-xs text-[#6B7280] dark:text-gray-400 font-semibold">
                  Loved by 10,000+ job seekers
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Dashboard Mockup */}
          <div className="lg:col-span-6 relative w-full lg:pl-4">
            {/* Visual halo gradient behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-3xl blur-2xl select-none pointer-events-none"></div>

            <div className="relative border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] shadow-xl dark:shadow-2xl rounded-2xl flex items-stretch min-h-[350px] overflow-hidden theme-transition">
              
              {/* Left Mockup Sidebar Navigation */}
              <div className="w-14 shrink-0 bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-gray-800 flex flex-col items-center py-6 gap-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="text-[#6B7280] dark:text-gray-500 p-1.5"><BarChart3 className="h-4.5 w-4.5" /></div>
                <div className="text-[#6B7280] dark:text-gray-500 p-1.5"><FileText className="h-4.5 w-4.5" /></div>
                <div className="text-[#6B7280] dark:text-gray-500 p-1.5"><Code2 className="h-4.5 w-4.5" /></div>
                <div className="text-[#6B7280] dark:text-gray-500 p-1.5"><User className="h-4.5 w-4.5" /></div>
              </div>

              {/* Main Panel Content */}
              <div className="flex-grow p-6 space-y-6 text-left">
                {/* Header */}
                <div className="flex justify-between items-end pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">Dashboard</h3>
                  </div>
                  <div className="text-[11px] font-semibold text-[#6B7280] dark:text-gray-400">
                    Good morning, Alex 👋
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Mock Interviews */}
                  <div className="border border-[#E5E7EB] dark:border-gray-800 bg-[#F8F9FA] dark:bg-[#1f2937]/20 p-4 rounded-xl space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-[#6B7280] dark:text-gray-400 font-bold block uppercase tracking-wide">Mock Interviews</span>
                        <span className="text-2xl font-extrabold text-[#111111] dark:text-white block leading-none">14</span>
                        <span className="text-[9px] text-[#6B7280] dark:text-gray-400 font-semibold block">Completed</span>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                        <Video className="h-4 w-4" />
                      </div>
                    </div>
                    {/* Wavy line chart */}
                    <div className="pt-2">
                      <svg className="w-full h-8 text-blue-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M0 25 Q15 22, 30 18 T60 22 T85 10 T100 5" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Resume Score */}
                  <div className="border border-[#E5E7EB] dark:border-gray-800 bg-[#F8F9FA] dark:bg-[#1f2937]/20 p-4 rounded-xl flex justify-between items-center relative">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] text-[#6B7280] dark:text-gray-400 font-bold block uppercase tracking-wide">Resume Score</span>
                      <span className="text-2xl font-extrabold text-[#111111] dark:text-white block leading-none">94%</span>
                      <span className="text-[9px] text-emerald-500 font-bold block">Great Match</span>
                    </div>
                    {/* Emerald circular progress ring */}
                    <div className="relative w-12 h-12 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200 dark:text-gray-800"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500"
                          strokeWidth="3.5"
                          strokeDasharray="94, 100"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Card 3: Recent Feedback */}
                  <div className="border border-[#E5E7EB] dark:border-gray-800 bg-[#F8F9FA] dark:bg-[#1f2937]/20 p-4 rounded-xl space-y-2.5 sm:col-span-1">
                    <span className="text-[10px] text-[#6B7280] dark:text-gray-400 font-bold block uppercase tracking-wide">Recent Feedback</span>
                    <ul className="space-y-1.5 text-[10px] text-[#6B7280] dark:text-gray-400 font-medium">
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                        Improve explanation clarity
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                        Work on time complexity
                      </li>
                    </ul>
                    <div className="text-right">
                      <span className="text-[9px] text-[#6B7280] dark:text-gray-500 font-bold hover:text-blue-500 cursor-pointer transition-colors">View all →</span>
                    </div>
                  </div>

                  {/* Card 4: Coding Accuracy */}
                  <div className="border border-[#E5E7EB] dark:border-gray-800 bg-[#F8F9FA] dark:bg-[#1f2937]/20 p-4 rounded-xl space-y-2 relative">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#6B7280] dark:text-gray-400 font-bold block uppercase tracking-wide">Coding Accuracy</span>
                      <span className="text-2xl font-extrabold text-[#111111] dark:text-white block leading-none">78%</span>
                    </div>
                    {/* Amber progress sparkline */}
                    <div className="pt-1.5">
                      <svg className="w-full h-8 text-amber-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M0 25 L20 22 L40 28 L60 16 L80 8 L100 18" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Features Row floating container card */}
        <div id="features" className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] shadow-xl dark:shadow-2xl rounded-2xl p-6 md:p-8 mt-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-stretch gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-150 dark:divide-gray-800/80 transition-all theme-transition">
          
          {/* Card 1: AI Mock Interviews */}
          <div className="flex-1 flex gap-4 items-center text-left py-4 md:py-0 md:px-4 first:pl-0">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">AI Mock Interviews</h4>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-0.5">Realistic, role-specific interview practice</p>
            </div>
          </div>

          {/* Card 2: Resume Analysis */}
          <div className="flex-1 flex gap-4 items-center text-left pt-6 pb-4 md:py-0 md:px-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Resume Analysis</h4>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-0.5">Get AI-powered feedback to improve your resume</p>
            </div>
          </div>

          {/* Card 3: Coding Practice */}
          <div className="flex-1 flex gap-4 items-center text-left pt-6 pb-4 md:py-0 md:px-6">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
              <Code2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Coding Practice</h4>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-0.5">Solve coding problems with AI assistance</p>
            </div>
          </div>

          {/* Card 4: Progress Tracking */}
          <div className="flex-1 flex gap-4 items-center text-left pt-6 md:py-0 md:px-6 last:pr-0">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] dark:text-white">Progress Tracking</h4>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-0.5">Track your progress and improve every day</p>
            </div>
          </div>
        </div>

        {/* Company Logos Bar */}
        <div className="mt-16 pt-8 pb-4 text-center space-y-6">
          <p className="text-xs font-semibold text-[#6B7280] dark:text-gray-400 tracking-wider uppercase">
            Trusted by job seekers from top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-45 dark:opacity-65 select-none transition-all">
            
            {/* Google */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex items-center gap-1.5 font-sans">
              Google
            </span>

            {/* Microsoft */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex items-center gap-1.5">
              {/* Microsoft window square */}
              <svg className="h-4 w-4 text-[#6B7280] dark:text-gray-300 fill-current" viewBox="0 0 23 23">
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
              Microsoft
            </span>

            {/* Amazon */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex flex-col items-center">
              amazon
            </span>

            {/* Meta */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex items-center gap-1.5">
              {/* Meta infinity curve */}
              <svg className="h-4.5 w-4.5 text-[#6B7280] dark:text-gray-300 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M2.5 12c0-3.3 2.7-6 6-6 2.1 0 3.9 1.1 5 2.8 1.1-1.7 2.9-2.8 5-2.8 3.3 0 6 2.7 6 6s-2.7 6-6 6c-2.1 0-3.9-1.1-5-2.8-1.1 1.7-2.9 2.8-5 2.8-3.3 0-6-2.7-6-6z" />
              </svg>
              Meta
            </span>

            {/* Apple */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex items-center gap-1.5">
              {/* Apple icon */}
              <svg className="h-4.5 w-4.5 text-[#6B7280] dark:text-gray-300 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.39.13-9.13-1.92-14.22-6.13-3.23-2.69-7.14-7.39-11.75-14.1-11.21-16.14-19.14-36.81-23.77-62.01-3.69-20.2-2.12-36.9 4.69-50.11 6.81-13.2 16.59-19.98 29.34-20.3 6.02-.12 12.63 2.17 19.82 6.87 7.19 4.7 11.83 7.05 13.92 7.05 1.7 0 6.02-2.18 12.98-6.53 6.96-4.35 13.41-6.42 19.34-6.22 15.64.63 27.24 6.78 34.81 18.43-15.64 9.47-23.27 22.36-22.9 38.65.37 12.98 5.48 23.95 15.3 32.9 9.83 8.95 21.09 13.69 33.79 14.21-.99 5.22-2.69 11.26-5.13 18.11zm-21.2-113.88c0 10.33-3.9 19.9-11.71 28.7-8.54 9.6-18.72 14.74-30.54 15.42.13-1.15.19-2.43.19-3.84 0-10.11 3.97-19.84 11.91-29.17 4.19-4.8 9.25-8.59 15.18-11.36 5.92-2.77 10.93-4.01 15.02-3.72.06 1.41.09 2.51.09 3.97z" />
              </svg>
              Apple
            </span>

            {/* Spotify */}
            <span className="text-sm font-bold tracking-tight text-[#6B7280] dark:text-gray-300 text-lg flex items-center gap-1.5">
              {/* Spotify icon */}
              <svg className="h-4.5 w-4.5 text-[#6B7280] dark:text-gray-300 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.982-.336.076-.67-.135-.747-.472-.076-.336.135-.67.472-.747 3.856-.88 7.15-.506 9.822 1.13.295.18.387.563.207.86zm1.224-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.676-1.116 8.243-.574 11.348 1.335.367.226.487.707.26 1.074zm.107-2.834C14.492 8.76 8.783 8.57 5.467 9.577c-.512.155-1.047-.134-1.202-.646-.155-.513.134-1.047.646-1.202 3.82-1.16 10.134-.94 13.9 1.3 1.157.688 1.158 1.158.688 1.158-.295 0-.585-.145-.78-.264z"/>
              </svg>
              Spotify
            </span>

          </div>
        </div>
      </div>
    </section>
  );
}

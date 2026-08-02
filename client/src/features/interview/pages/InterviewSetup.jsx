import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Video, Clock, CheckCircle, 
  Building2, Briefcase, Sparkles, Code2, Users, Cpu, 
  Mic, FileText, Gauge, GraduationCap
} from 'lucide-react';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';

export default function InterviewSetup() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // React Hook Form initialization
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    trigger,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      company: '',
      role: '',
      experienceLevel: 'mid',
      difficulty: 'medium',
      interviewType: 'technical',
      numQuestions: 10,
      answerMode: 'text'
    },
    mode: 'onChange'
  });

  // Watch fields for estimated duration and summary card
  const watchAllFields = watch();
  const { 
    company, 
    role, 
    experienceLevel, 
    difficulty, 
    interviewType, 
    numQuestions, 
    answerMode 
  } = watchAllFields;

  // Dynamic estimated duration calculation
  const getEstimatedDuration = () => {
    let minsPerQuestion = 3;
    if (difficulty === 'easy') minsPerQuestion = 2;
    else if (difficulty === 'hard') minsPerQuestion = 4.5;

    if (interviewType === 'system-design') {
      minsPerQuestion += 1.5;
    }

    return numQuestions * minsPerQuestion;
  };

  const estimatedDuration = getEstimatedDuration();

  // Validate and advance step
  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['company', 'role']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data) => {
    toast.success('Session configured! Review the instructions before starting.');

    const difficultyLabel = data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1);
    const durationMins = (() => {
      let mpp = data.difficulty === 'easy' ? 2 : data.difficulty === 'hard' ? 4.5 : 3;
      if (data.interviewType === 'system-design') mpp += 1.5;
      return data.numQuestions * mpp;
    })();

    navigate('/ai-interviews/instructions', {
      state: {
        session: {
          company: data.company,
          role: data.role,
          difficulty: difficultyLabel,
          numQuestions: data.numQuestions,
          interviewType: data.interviewType,
          estimatedTime: `~${durationMins} mins`,
        },
      },
    });
  };

  // Popular companies quick select list
  const popularCompanies = [
    { name: 'Google', icon: Building2 },
    { name: 'Meta', icon: Building2 },
    { name: 'Amazon', icon: Building2 },
    { name: 'Netflix', icon: Building2 }
  ];

  // Popular roles quick select list
  const popularRoles = [
    'Frontend Engineer',
    'Backend Engineer',
    'Fullstack Engineer',
    'Product Manager',
    'Data Scientist'
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Content Container */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/ai-interviews')}
              className="p-2 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                Setup Mock Interview
              </h1>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                Customize your preparation profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Form Setup Wizard (8 cols) */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-8 space-y-6">
              
              {/* Step indicator */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 shadow-xs">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-500' : ''}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                  <span>Role & Company</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 mx-4" />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-500' : ''}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                  <span>Tier & Challenge</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 mx-4" />
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-500' : ''}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                  <span>Format & Mode</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
                
                {/* Step 1: Role & Company */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider mb-1">
                        Role & Company Target
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Specify where you are applying and what role you wish to simulate.
                      </p>
                    </div>

                    {/* Company Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        Target Company
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Google, Stripe, Microsoft"
                        {...register('company', { required: 'Company name is required' })}
                        className="w-full px-4 h-11 border border-[#E5E7EB] dark:border-gray-800 bg-gray-50 dark:bg-[#111827] text-sm text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      {errors.company && (
                        <p className="text-[10px] font-bold text-red-500">{errors.company.message}</p>
                      )}

                      {/* Quick Select Company Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        {popularCompanies.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setValue('company', c.name, { shouldValidate: true })}
                            className={`p-2 border rounded-xl text-center text-xs font-semibold transition-colors cursor-pointer ${
                              company === c.name 
                                ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-blue-500' 
                                : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Role Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        Target Role
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Frontend Engineer, Product Designer"
                        {...register('role', { required: 'Target role is required' })}
                        className="w-full px-4 h-11 border border-[#E5E7EB] dark:border-gray-800 bg-gray-50 dark:bg-[#111827] text-sm text-[#111111] dark:text-white rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      {errors.role && (
                        <p className="text-[10px] font-bold text-red-500">{errors.role.message}</p>
                      )}

                      {/* Quick Select Role Cards */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {popularRoles.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setValue('role', r, { shouldValidate: true })}
                            className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              role === r 
                                ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-blue-500' 
                                : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Experience & Difficulty */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider mb-1">
                        Tier & Challenge Settings
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Tailor the interview expectations to your experience level and goals.
                      </p>
                    </div>

                    {/* Experience Level Cards */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        Experience Level
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'entry', title: 'Entry Level', desc: '0-2 years, internship or graduate' },
                          { id: 'mid', title: 'Mid Level', desc: '2-5 years, independent scope' },
                          { id: 'senior', title: 'Senior Tier', desc: '5-8 years, architect & leader' },
                          { id: 'lead', title: 'Lead / Staff', desc: '8+ years, strategy & design' }
                        ].map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() => setValue('experienceLevel', exp.id)}
                            className={`p-4 border rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between h-20 ${
                              experienceLevel === exp.id 
                                ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-[#111111] dark:text-white' 
                                : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            <span className="text-xs font-extrabold">{exp.title}</span>
                            <span className="text-[10px] opacity-80 mt-1 font-semibold">{exp.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Cards */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        Challenge Difficulty
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'easy', title: 'Easy', desc: 'Warmup queries' },
                          { id: 'medium', title: 'Medium', desc: 'Standard loops' },
                          { id: 'hard', title: 'Hard', desc: 'Complex problems' }
                        ].map((diff) => (
                          <button
                            key={diff.id}
                            type="button"
                            onClick={() => setValue('difficulty', diff.id)}
                            className={`p-3 border rounded-xl text-left transition-colors cursor-pointer flex flex-col justify-between h-20 ${
                              difficulty === diff.id 
                                ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-[#111111] dark:text-white' 
                                : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            <span className="text-xs font-extrabold">{diff.title}</span>
                            <span className="text-[10px] opacity-80 mt-1 font-semibold">{diff.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Format & Mode */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider mb-1">
                        Format & Interaction Mode
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Define the focus topics, the number of questions, and whether you prefer to speak or type.
                      </p>
                    </div>

                    {/* Interview Type Cards */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-gray-400" />
                        Interview Focus
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: 'technical', title: 'Technical', icon: Code2 },
                          { id: 'behavioral', title: 'Behavioral', icon: Users },
                          { id: 'hr', title: 'HR General', icon: Building2 },
                          { id: 'system-design', title: 'System Design', icon: Cpu },
                          { id: 'mixed', title: 'Mixed Mode', icon: Sparkles }
                        ].map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setValue('interviewType', type.id)}
                              className={`p-3 border rounded-xl text-left transition-colors cursor-pointer flex items-center gap-3 ${
                                interviewType === type.id 
                                  ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-[#111111] dark:text-white' 
                                  : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                              }`}
                            >
                              <Icon className="h-4.5 w-4.5 text-[#60A5FA]" />
                              <span className="text-xs font-extrabold">{type.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Number of Questions Cards */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        Length (Questions)
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[5, 10, 15].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setValue('numQuestions', num)}
                            className={`p-3 border rounded-xl text-center transition-colors cursor-pointer ${
                              numQuestions === num 
                                ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-[#111111] dark:text-white' 
                                : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            <span className="text-xs font-extrabold">{num} Questions</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Answer Mode Cards */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Mic className="h-4 w-4 text-gray-400" />
                        Speech & Answer Method
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'text', title: 'Text Mode', desc: 'Type your responses', icon: FileText },
                          { id: 'voice', title: 'Voice Mode', desc: 'Speak into microphone', icon: Mic }
                        ].map((mode) => {
                          const Icon = mode.icon;
                          return (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => setValue('answerMode', mode.id)}
                              className={`p-4 border rounded-xl text-left transition-colors cursor-pointer flex gap-3 items-start ${
                                answerMode === mode.id 
                                  ? 'border-[#60A5FA] bg-blue-50/50 dark:bg-blue-950/20 text-[#111111] dark:text-white' 
                                  : 'border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                              }`}
                            >
                              <Icon className="h-5 w-5 text-[#60A5FA] shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs font-extrabold block">{mode.title}</span>
                                <span className="text-[10px] opacity-80 mt-0.5 block font-semibold">{mode.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Back / Next Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800/80">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      key="btn-next"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      key="btn-submit"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 h-11 px-6 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                    >
                      Start Interview
                    </button>
                  )}
                </div>

              </div>
            </form>

            {/* Live Configuration Summary Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-colors space-y-5">
                <div className="flex items-center gap-2 text-blue-400">
                  <Video className="h-4.5 w-4.5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider">Setup Preview</h3>
                </div>

                {/* dynamic list preview */}
                <div className="space-y-3.5 pt-1 border-t border-gray-100 dark:border-gray-800/80">
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Company:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white">
                      {company || <span className="text-gray-400 italic">Not set</span>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Role:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white">
                      {role || <span className="text-gray-400 italic">Not set</span>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Level:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white uppercase">
                      {experienceLevel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Difficulty:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white uppercase">
                      {difficulty}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Type:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white capitalize">
                      {interviewType}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">Method:</span>
                    <span className="font-extrabold text-[#111111] dark:text-white capitalize">
                      {answerMode} Mode
                    </span>
                  </div>

                </div>

                {/* estimated duration banner */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Clock className="h-4.5 w-4.5 text-[#60A5FA]" />
                    <span className="text-xs font-bold">Estimated Duration:</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#111111] dark:text-white">
                    ~{estimatedDuration} mins
                  </span>
                </div>
              </div>

              {/* Step completion checklist card */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
                <h4 className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Checklist
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className={`h-4 w-4 ${company && role ? 'text-emerald-500' : 'text-gray-200 dark:text-gray-800'}`} />
                    <span className={`text-xs font-semibold ${company && role ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-[#111111] dark:text-white'}`}>
                      Fill in Company & Role
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className={`h-4 w-4 ${step > 2 ? 'text-emerald-500' : 'text-gray-200 dark:text-gray-800'}`} />
                    <span className={`text-xs font-semibold ${step > 2 ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-[#111111] dark:text-white'}`}>
                      Configure Level & Difficulty
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className={`h-4 w-4 ${step === 3 ? 'text-blue-500' : 'text-gray-200 dark:text-gray-800'}`} />
                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                      Choose Length & Speech Type
                    </span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

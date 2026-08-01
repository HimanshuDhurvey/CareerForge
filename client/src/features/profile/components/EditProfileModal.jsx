import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfileModal({ personal, careerGoals, onClose, onSave }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: personal.name,
      phone: personal.phone,
      college: personal.college,
      degree: personal.degree,
      branch: personal.branch,
      gradYear: personal.gradYear,
      dreamCompany: careerGoals.dreamCompany,
      targetRole: careerGoals.targetRole,
    }
  });

  const onSubmit = (data) => {
    onSave(data);
    toast.success("Profile updated successfully.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 select-none">
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
            Edit Profile Details
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
            aria-label="Close Edit Profile Modal"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Modal Form Scroll Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-grow overflow-y-auto p-5 space-y-4 text-left">
          
          {/* Name Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-name" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="modal-name"
              type="text"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
              } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
              {...register('name', { required: 'Full name is required' })}
            />
            {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-phone" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Phone Number
            </label>
            <input
              id="modal-phone"
              type="text"
              placeholder="+91 9876543210"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                errors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
              } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]*[0-9\s-]{10,15}$/,
                  message: 'Enter a valid phone number (10+ digits)'
                }
              })}
            />
            {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone.message}</span>}
          </div>

          {/* College Field */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-college" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              College / University
            </label>
            <input
              id="modal-college"
              type="text"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                errors.college 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
              } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
              {...register('college', { required: 'College is required' })}
            />
            {errors.college && <span className="text-[10px] text-red-500 font-semibold">{errors.college.message}</span>}
          </div>

          {/* Grid layout for Degree, Branch, GradYear */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Degree */}
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-degree" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Degree
              </label>
              <input
                id="modal-degree"
                type="text"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                  errors.degree 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
                } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
                {...register('degree', { required: 'Degree is required' })}
              />
              {errors.degree && <span className="text-[10px] text-red-500 font-semibold">{errors.degree.message}</span>}
            </div>

            {/* Branch */}
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-branch" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Branch
              </label>
              <input
                id="modal-branch"
                type="text"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                  errors.branch 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
                } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
                {...register('branch', { required: 'Branch is required' })}
              />
              {errors.branch && <span className="text-[10px] text-red-500 font-semibold">{errors.branch.message}</span>}
            </div>

            {/* Graduation Year */}
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-gradYear" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Graduation Year
              </label>
              <input
                id="modal-gradYear"
                type="text"
                placeholder="2026"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                  errors.gradYear 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
                } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
                {...register('gradYear', { 
                  required: 'Graduation Year is required',
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: 'Enter 4 digits'
                  }
                })}
              />
              {errors.gradYear && <span className="text-[10px] text-red-500 font-semibold">{errors.gradYear.message}</span>}
            </div>
          </div>

          {/* Grid layout for target goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dream Company */}
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-company" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Target Company
              </label>
              <input
                id="modal-company"
                type="text"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                  errors.dreamCompany 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
                } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
                {...register('dreamCompany', { required: 'Target Company is required' })}
              />
              {errors.dreamCompany && <span className="text-[10px] text-red-500 font-semibold">{errors.dreamCompany.message}</span>}
            </div>

            {/* Target Role */}
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-role" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Target Role
              </label>
              <input
                id="modal-role"
                type="text"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
                  errors.targetRole 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
                } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`}
                {...register('targetRole', { required: 'Target Role is required' })}
              />
              {errors.targetRole && <span className="text-[10px] text-red-500 font-semibold">{errors.targetRole.message}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

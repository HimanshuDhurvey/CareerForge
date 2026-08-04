import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileService } from '../../../services/profileService';

/**
 * EditProfileModal
 * ──────────────────────────────────────────────────────────────────────────────
 * Opens as an overlay and allows the user to edit all editable profile fields.
 * Submits to PUT /api/profile and surfaces both client-side and server-side
 * validation errors inline without altering the existing UI styles.
 *
 * Props:
 *   profile  — flat API profile object from GET /api/profile
 *   onClose  — callback to close the modal
 *   onSave   — callback(updatedProfile) called after a successful save
 */
export default function EditProfileModal({ profile, onClose, onSave }) {
  const [isSaving, setIsSaving]       = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      fullName:       profile.fullName      || '',
      phoneNumber:    profile.phoneNumber   || '',
      dateOfBirth:    profile.dateOfBirth   || '',
      college:        profile.college       || '',
      degree:         profile.degree        || '',
      branch:         profile.branch        || '',
      graduationYear: profile.graduationYear ? String(profile.graduationYear) : '',
      targetCompany:  profile.targetCompany || '',
      targetRole:     profile.targetRole    || '',
      bio:            profile.bio           || '',
      skills:         profile.skills?.join(', ') || '',
      githubUrl:      profile.githubUrl     || '',
      linkedinUrl:    profile.linkedinUrl   || '',
      portfolioUrl:   profile.portfolioUrl  || '',
      location:       profile.location      || '',
      avatarUrl:      profile.avatarUrl     || '',
    },
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    setServerErrors({});

    // Parse skills from comma-separated string to array
    const skillsArray = data.skills
      ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      fullName:       data.fullName,
      phoneNumber:    data.phoneNumber,
      dateOfBirth:    data.dateOfBirth || null,
      college:        data.college,
      degree:         data.degree,
      branch:         data.branch,
      graduationYear: data.graduationYear ? parseInt(data.graduationYear, 10) : null,
      targetCompany:  data.targetCompany,
      targetRole:     data.targetRole,
      bio:            data.bio,
      skills:         skillsArray,
      githubUrl:      data.githubUrl,
      linkedinUrl:    data.linkedinUrl,
      portfolioUrl:   data.portfolioUrl,
      location:       data.location,
      avatarUrl:      data.avatarUrl,
    };

    try {
      const updatedProfile = await profileService.updateProfile(payload);
      toast.success('Profile updated successfully.');
      onSave(updatedProfile);
      onClose();
    } catch (err) {
      // Surface field-level validation errors from the backend inline
      if (err.errors?.length > 0) {
        const fieldMap = {};
        err.errors.forEach(({ field, message }) => {
          // Map backend field names to react-hook-form field names if needed
          const uiField = field === 'phoneNumber' ? 'phoneNumber' : field;
          setError(uiField, { type: 'server', message });
          fieldMap[uiField] = message;
        });
        setServerErrors(fieldMap);
        toast.error('Please fix the highlighted errors.');
      } else {
        toast.error(err.message || 'Failed to save profile.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ── Reusable field wrapper ───────────────────────────────────────────────────
  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 bg-white dark:bg-[#111827] border ${
      hasError
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-[#E5E7EB] dark:border-gray-800 focus:border-blue-400 focus:ring-blue-400'
    } rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors`;

  const ErrorMsg = ({ name }) =>
    errors[name] ? (
      <span className="text-[10px] text-red-500 font-semibold">{errors[name].message}</span>
    ) : null;

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-grow overflow-y-auto p-5 space-y-4 text-left"
        >

          {/* ── Full Name ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-name" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="modal-name"
              type="text"
              className={inputClass(!!errors.fullName)}
              {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
            />
            <ErrorMsg name="fullName" />
          </div>

          {/* ── Email (read-only) ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-email" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Email Address <span className="text-gray-400 font-normal normal-case">(read-only)</span>
            </label>
            <input
              id="modal-email"
              type="email"
              value={profile.email || ''}
              readOnly
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-xs text-gray-400 dark:text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* ── Phone ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-phone" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Phone Number
            </label>
            <input
              id="modal-phone"
              type="text"
              placeholder="+91 9876543210"
              className={inputClass(!!errors.phoneNumber)}
              {...register('phoneNumber', {
                pattern: {
                  value: /^\+?[1-9]\d{1,14}$|^[0-9\-+() ]{7,20}$/,
                  message: 'Enter a valid phone number',
                },
              })}
            />
            <ErrorMsg name="phoneNumber" />
          </div>

          {/* ── Date of Birth ─────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-dob" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Date of Birth
            </label>
            <input
              id="modal-dob"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className={inputClass(!!errors.dateOfBirth)}
              {...register('dateOfBirth', {
                validate: (value) => {
                  if (!value) return true;
                  const dob = new Date(value);
                  if (isNaN(dob.getTime())) return 'Please enter a valid date';
                  if (dob >= new Date()) return 'Date of birth cannot be in the future';
                  return true;
                },
              })}
            />
            <ErrorMsg name="dateOfBirth" />
          </div>

          {/* ── Location ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-location" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Location
            </label>
            <input
              id="modal-location"
              type="text"
              placeholder="Mumbai, India"
              className={inputClass(!!errors.location)}
              {...register('location')}
            />
            <ErrorMsg name="location" />
          </div>

          {/* ── College ──────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-college" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              College / University
            </label>
            <input
              id="modal-college"
              type="text"
              className={inputClass(!!errors.college)}
              {...register('college')}
            />
            <ErrorMsg name="college" />
          </div>

          {/* ── Degree / Branch / Grad Year ───────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-degree" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Degree
              </label>
              <input
                id="modal-degree"
                type="text"
                className={inputClass(!!errors.degree)}
                {...register('degree')}
              />
              <ErrorMsg name="degree" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="modal-branch" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Branch
              </label>
              <input
                id="modal-branch"
                type="text"
                className={inputClass(!!errors.branch)}
                {...register('branch')}
              />
              <ErrorMsg name="branch" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="modal-gradYear" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Grad Year
              </label>
              <input
                id="modal-gradYear"
                type="text"
                placeholder="2026"
                className={inputClass(!!errors.graduationYear)}
                {...register('graduationYear', {
                  pattern: { value: /^[0-9]{4}$/, message: 'Enter 4 digits' },
                })}
              />
              <ErrorMsg name="graduationYear" />
            </div>
          </div>

          {/* ── Target Company / Target Role ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="modal-company" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Target Company
              </label>
              <input
                id="modal-company"
                type="text"
                className={inputClass(!!errors.targetCompany)}
                {...register('targetCompany')}
              />
              <ErrorMsg name="targetCompany" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="modal-role" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Target Role
              </label>
              <input
                id="modal-role"
                type="text"
                className={inputClass(!!errors.targetRole)}
                {...register('targetRole')}
              />
              <ErrorMsg name="targetRole" />
            </div>
          </div>

          {/* ── Skills ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-skills" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Skills <span className="text-gray-400 font-normal normal-case">(comma-separated)</span>
            </label>
            <input
              id="modal-skills"
              type="text"
              placeholder="React, Node.js, MongoDB"
              className={inputClass(!!errors.skills)}
              {...register('skills')}
            />
            <ErrorMsg name="skills" />
          </div>

          {/* ── Bio ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-bio" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Bio
            </label>
            <textarea
              id="modal-bio"
              rows={3}
              placeholder="Tell us a bit about yourself..."
              className={`${inputClass(!!errors.bio)} resize-none`}
              {...register('bio')}
            />
            <ErrorMsg name="bio" />
          </div>

          {/* ── Social Links ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-github" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              GitHub URL
            </label>
            <input
              id="modal-github"
              type="url"
              placeholder="https://github.com/username"
              className={inputClass(!!errors.githubUrl)}
              {...register('githubUrl', {
                pattern: { value: /^https?:\/\/(www\.)?github\.com\/.+/, message: 'Enter a valid github.com URL' },
              })}
            />
            <ErrorMsg name="githubUrl" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="modal-linkedin" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              LinkedIn URL
            </label>
            <input
              id="modal-linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              className={inputClass(!!errors.linkedinUrl)}
              {...register('linkedinUrl', {
                pattern: { value: /^https?:\/\/(www\.)?linkedin\.com\/.+/, message: 'Enter a valid linkedin.com URL' },
              })}
            />
            <ErrorMsg name="linkedinUrl" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="modal-portfolio" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Portfolio URL
            </label>
            <input
              id="modal-portfolio"
              type="url"
              placeholder="https://yourportfolio.dev"
              className={inputClass(!!errors.portfolioUrl)}
              {...register('portfolioUrl', {
                pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL starting with https://' },
              })}
            />
            <ErrorMsg name="portfolioUrl" />
          </div>

          {/* ── Avatar URL ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <label htmlFor="modal-avatar" className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
              Avatar URL
            </label>
            <input
              id="modal-avatar"
              type="url"
              placeholder="https://example.com/avatar.png"
              className={inputClass(!!errors.avatarUrl)}
              {...register('avatarUrl', {
                pattern: { value: /^https?:\/\/.+/, message: 'Enter a valid URL' },
              })}
            />
            <ErrorMsg name="avatarUrl" />
          </div>

          {/* ── Form Actions ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

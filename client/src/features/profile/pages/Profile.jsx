import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import ProfileHeader from '../components/ProfileHeader';
import PersonalInfoCard from '../components/PersonalInfoCard';
import CareerGoalsCard from '../components/CareerGoalsCard';
import SkillsCard from '../components/SkillsCard';
import ResumeCard from '../components/ResumeCard';
import ActivityCard from '../components/ActivityCard';
import SocialLinksCard from '../components/SocialLinksCard';
import AccountSettingsCard from '../components/AccountSettingsCard';
import EditProfileModal from '../components/EditProfileModal';
import { profileService } from '../../../services/profileService';

// Static mock data for activity / resume sections (not yet in API)
import { profileData as mockData } from '../data/profileData';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [isEditOpen, setIsEditOpen]     = useState(false);
  const [profile, setProfile]           = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [fetchError, setFetchError]     = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // ── Fetch profile on mount ───────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setFetchError(err.message || 'Failed to load profile.');
      toast.error(err.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ── Handle save from modal ───────────────────────────────────────────────────
  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar onMenuToggle={toggleSidebar} />
          <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
            {/* Skeleton placeholder – preserves layout rhythm */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm animate-pulse h-36" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse h-48" />
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse h-36" />
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse h-24" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse h-64" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── Fetch error state ────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavbar onMenuToggle={toggleSidebar} />
          <main className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-sm font-bold text-red-500">{fetchError}</p>
            <button
              onClick={loadProfile}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              Retry
            </button>
          </main>
        </div>
      </div>
    );
  }

  // ── Map API response to the shape expected by child components ───────────────
  const personal = {
    name:            profile.fullName  || '',
    email:           profile.email     || '',
    phone:           profile.phoneNumber || '',
    dob:             profile.dateOfBirth
                       ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                       : mockData.personal.dob,
    college:         profile.college   || '',
    degree:          profile.degree    || '',
    branch:          profile.branch    || '',
    gradYear:        profile.graduationYear ? String(profile.graduationYear) : '',
    location:        profile.location  || '',
    bio:             profile.bio       || '',
    avatarUrl:       profile.avatarUrl || '',
    // Static mock fields not yet in API
    currentSemester: mockData.personal.currentSemester,
    badge:           mockData.personal.badge,
  };

  const careerGoals = {
    dreamCompany:    profile.targetCompany || '',
    targetRole:      profile.targetRole    || '',
    // Static mock fields not in API
    preferredDomain: mockData.careerGoals.preferredDomain,
    experienceLevel: mockData.careerGoals.experienceLevel,
  };

  const skills = profile.skills?.length > 0 ? profile.skills : mockData.skills;

  const socials = {
    github:    profile.githubUrl    || '',
    linkedin:  profile.linkedinUrl  || '',
    portfolio: profile.portfolioUrl || '',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Content Container */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <ProfileHeader
            personal={personal}
            onEditClick={() => setIsEditOpen(true)}
          />

          {/* Dual Column grid layout for profile sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Primary Details: Personal details, career milestones, resume & skills (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PersonalInfoCard personal={personal} />
              <CareerGoalsCard careerGoals={careerGoals} />
              <SkillsCard skills={skills} />
              <ResumeCard />
            </div>

            {/* Side info: Timeline progress indicators, socials & account config toggles (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ActivityCard progress={mockData.progress} activities={mockData.activities} />
              <SocialLinksCard socials={socials} />
              <AccountSettingsCard />
            </div>

          </div>
        </main>
      </div>

      {/* Edit Profile Overlay Modal */}
      {isEditOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

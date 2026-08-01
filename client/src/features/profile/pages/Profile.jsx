import React, { useState } from 'react';
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
import { profileData } from '../data/profileData';

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile, setProfile] = useState(profileData);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSaveProfile = (updatedData) => {
    setProfile(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        name: updatedData.name,
        phone: updatedData.phone,
        college: updatedData.college,
        degree: updatedData.degree,
        branch: updatedData.branch,
        gradYear: updatedData.gradYear,
      },
      careerGoals: {
        ...prev.careerGoals,
        dreamCompany: updatedData.dreamCompany,
        targetRole: updatedData.targetRole,
      }
    }));
  };

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
          {/* Header Banner */}
          <ProfileHeader 
            personal={profile.personal} 
            onEditClick={() => setIsEditOpen(true)} 
          />

          {/* Dual Column grid layout for profile sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Primary Details: Personal details, career milestones, resume & skills (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PersonalInfoCard personal={profile.personal} />
              <CareerGoalsCard careerGoals={profile.careerGoals} />
              <SkillsCard skills={profile.skills} />
              <ResumeCard resume={profile.resume} />
            </div>

            {/* Side info: Timeline progress indicators, socials & account config toggles (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ActivityCard progress={profile.progress} activities={profile.activities} />
              <SocialLinksCard socials={profile.socials} />
              <AccountSettingsCard />
            </div>

          </div>
        </main>
      </div>

      {/* Edit Profile Overlay Modal */}
      {isEditOpen && (
        <EditProfileModal 
          personal={profile.personal} 
          careerGoals={profile.careerGoals} 
          onClose={() => setIsEditOpen(false)} 
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

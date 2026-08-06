'use strict';

/**
 * dashboardService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates user metrics across Profile, Resume, ResumeAnalysis, Interview,
 * and Evaluation collections into a single high-performance dashboard summary response.
 */

const User           = require('../models/userModel');
const Profile        = require('../models/profileModel');
const Resume         = require('../models/resumeModel');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Interview      = require('../models/Interview');
const Evaluation     = require('../models/Evaluation');

/**
 * Get aggregated dashboard analytics data for a specific user.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Aggregated dashboard payload
 */
const getDashboardData = async (userId) => {
  // Execute parallel non-blocking queries
  const [
    userDoc,
    profileDoc,
    resumeDoc,
    latestResumeAnalysis,
    resumeAnalysesCount,
    interviews,
    evaluations,
  ] = await Promise.all([
    User.findById(userId).select('fullName email avatar role createdAt').lean(),
    Profile.findOne({ user: userId }).lean(),
    Resume.findOne({ user: userId }).lean(),
    ResumeAnalysis.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    ResumeAnalysis.countDocuments({ user: userId }),
    Interview.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    Evaluation.find({ user: userId }).sort({ createdAt: -1 }).lean(),
  ]);

  // 1. Profile Summary
  const fullName = userDoc?.fullName || 'Candidate';
  const email = userDoc?.email || '';
  const currentRole = profileDoc?.targetRole || userDoc?.role || 'Software Engineer';
  const avatar = userDoc?.avatar || profileDoc?.avatar || '';

  // Calculate Profile Completion Percentage
  let completionCount = 0;
  const totalFields = 5;
  if (fullName) completionCount++;
  if (email) completionCount++;
  if (currentRole) completionCount++;
  if (resumeDoc) completionCount++;
  if (interviews && interviews.length > 0) completionCount++;
  const profileCompletionPercent = Math.round((completionCount / totalFields) * 100);

  const profileSummary = {
    userName: fullName,
    email: email,
    currentRole: currentRole,
    profilePicture: avatar,
    profileCompletion: profileCompletionPercent,
  };

  // 2. Resume Card & Statistics
  const latestResumeScore = latestResumeAnalysis ? latestResumeAnalysis.overallScore : null;
  const latestAtsScore = latestResumeAnalysis ? latestResumeAnalysis.atsScore : null;
  const resumeCard = {
    hasResume: !!resumeDoc,
    latestResumeScore,
    latestAtsScore,
    lastUpdated: resumeDoc?.updatedAt || latestResumeAnalysis?.createdAt || null,
    resumeStatus: resumeDoc ? (latestResumeAnalysis ? 'analysed' : 'uploaded') : 'none',
    originalName: resumeDoc?.originalName || 'Resume.pdf',
    totalAnalyses: resumeAnalysesCount,
  };

  // 3. Interview Card & Statistics
  const totalInterviews = interviews.length;
  const completedInterviewsList = interviews.filter((i) => i.status === 'completed');
  const completedInterviews = completedInterviewsList.length;

  let averageInterviewScore = null;
  let bestInterviewScore = null;

  if (evaluations.length > 0) {
    const scores = evaluations.map((e) => e.overallScore || 0);
    bestInterviewScore = Math.max(...scores);
    averageInterviewScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  const latestInterview = interviews[0] || null;
  const latestEvaluation = evaluations[0] || null;

  const interviewCard = {
    hasInterviews: totalInterviews > 0,
    totalInterviews,
    completedInterviews,
    averageScore: averageInterviewScore,
    bestScore: bestInterviewScore,
    lastInterviewDate: latestInterview ? latestInterview.createdAt : null,
  };

  // 4. Career Readiness Score
  // Formula: 0.4 * ResumeScore + 0.4 * InterviewScore + 0.2 * ATSScore
  let careerReadinessScore = null;
  if (latestResumeScore !== null && averageInterviewScore !== null) {
    const ats = latestAtsScore !== null ? latestAtsScore : latestResumeScore;
    careerReadinessScore = Math.round(0.4 * latestResumeScore + 0.4 * averageInterviewScore + 0.2 * ats);
  }

  // 5. AI Insights & Skill Analysis
  const topStrengths = [];
  const topWeaknesses = [];
  const recommendedSkillsSet = new Set();
  const recommendedProjectsSet = new Set();

  if (latestResumeAnalysis) {
    (latestResumeAnalysis.strengths || []).forEach((s) => topStrengths.push(s));
    (latestResumeAnalysis.weaknesses || []).forEach((w) => topWeaknesses.push(w));
    (latestResumeAnalysis.missingKeywords || []).forEach((k) => recommendedSkillsSet.add(k));
    (latestResumeAnalysis.recommendedSkills || []).forEach((k) => recommendedSkillsSet.add(k));
    (latestResumeAnalysis.recommendedProjects || []).forEach((p) => recommendedProjectsSet.add(p));
  }

  evaluations.forEach((ev) => {
    (ev.keyStrengths || []).forEach((s) => topStrengths.push(s));
    (ev.priorityImprovements || []).forEach((w) => topWeaknesses.push(w));
  });

  const uniqueStrengths = Array.from(new Set(topStrengths)).slice(0, 5);
  const uniqueWeaknesses = Array.from(new Set(topWeaknesses)).slice(0, 5);
  const recommendedSkills = Array.from(recommendedSkillsSet).slice(0, 6);
  const recommendedProjects = Array.from(recommendedProjectsSet).slice(0, 4);

  // Skill Overview Breakdown (Strong vs Weak Skills with progress %)
  const strongSkills = [
    { name: 'JavaScript / Node.js', score: latestResumeAnalysis?.skillsScore || 85 },
    { name: 'React.js Frontend', score: 82 },
    { name: 'REST API & Express', score: 80 },
  ];

  const weakSkills = [
    { name: 'System Design & Scalability', score: 55 },
    { name: 'Quantified Project Metrics', score: 48 },
    { name: 'Cloud & Docker Deployment', score: 50 },
  ];

  // 6. Top 5 Actionable Recommendations
  const defaultRecommendations = [
    'Add quantified impact metrics (%, $, user scale, latency reduction) to your work experience.',
    'Include direct GitHub repository and LinkedIn profile links in header.',
    'Practice high-frequency React Hooks and State Management interview questions.',
    'Build a microservices task queue project featuring Redis and WebSockets.',
    'Strengthen system design concepts for API rate limiting and indexing.',
  ];

  let aiRecommendationsList = [];
  if (latestResumeAnalysis?.improvementSuggestions?.length) {
    aiRecommendationsList = latestResumeAnalysis.improvementSuggestions.slice(0, 5);
  } else if (latestEvaluation?.priorityImprovements?.length) {
    aiRecommendationsList = latestEvaluation.priorityImprovements.slice(0, 5);
  }
  if (aiRecommendationsList.length < 5) {
    defaultRecommendations.forEach((rec) => {
      if (aiRecommendationsList.length < 5 && !aiRecommendationsList.includes(rec)) {
        aiRecommendationsList.push(rec);
      }
    });
  }

  // 7. Recent Activity Timeline (Chronological merge)
  const activities = [];

  if (resumeDoc) {
    activities.push({
      id: 'act-resume-upload',
      type: 'resume_uploaded',
      title: 'Resume Uploaded',
      description: `Uploaded file: ${resumeDoc.originalName}`,
      timestamp: resumeDoc.createdAt,
      icon: 'Upload',
    });
  }

  if (latestResumeAnalysis) {
    activities.push({
      id: 'act-resume-analyzed',
      type: 'resume_analyzed',
      title: 'Resume AI Analyzed',
      description: `Overall Score: ${latestResumeAnalysis.overallScore}% (ATS: ${latestResumeAnalysis.atsScore}%)`,
      timestamp: latestResumeAnalysis.createdAt,
      icon: 'Sparkles',
    });
  }

  interviews.forEach((inv) => {
    activities.push({
      id: `act-interview-${inv._id}`,
      type: inv.status === 'completed' ? 'interview_completed' : 'interview_started',
      title: inv.status === 'completed' ? 'Interview Completed' : 'Interview Started',
      description: `${inv.role || 'Software Engineer'} (${inv.interviewType || 'technical'}) - ${inv.difficulty || 'medium'}`,
      timestamp: inv.updatedAt || inv.createdAt,
      icon: inv.status === 'completed' ? 'CheckCircle' : 'Video',
    });
  });

  evaluations.forEach((ev) => {
    activities.push({
      id: `act-eval-${ev._id}`,
      type: 'evaluation_generated',
      title: 'AI Evaluation Generated',
      description: `Evaluation Score: ${ev.overallScore}% - ${ev.performanceVerdict || 'Good'}`,
      timestamp: ev.createdAt,
      icon: 'Award',
    });
  });

  // Sort activities newest first
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentActivities = activities.slice(0, 6);

  return {
    profileSummary,
    resumeCard,
    interviewCard,
    careerReadinessScore,
    aiInsights: {
      topStrengths: uniqueStrengths,
      topWeaknesses: uniqueWeaknesses,
      recommendedSkills,
      recommendedProjects,
      latestRecommendation: aiRecommendationsList[0] || 'Keep practicing interview questions.',
    },
    skillAnalysis: {
      strongSkills,
      weakSkills,
    },
    recommendations: aiRecommendationsList,
    recentActivities,
    recentReports: {
      latestResumeAnalysis: latestResumeAnalysis || null,
      latestInterviewEvaluation: latestEvaluation || null,
    },
  };
};

module.exports = {
  getDashboardData,
};

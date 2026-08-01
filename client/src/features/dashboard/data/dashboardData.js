export const dashboardData = {
  user: {
    name: "Himanshu",
    email: "himanshu@gmail.com",
    role: "Student",
    avatar: null // Will fallback to initials
  },
  stats: [
    {
      id: "mock-interviews",
      title: "Mock Interviews",
      value: "18",
      unit: "Completed",
      trend: "↑ 20% this week",
      trendType: "positive",
      type: "interviews"
    },
    {
      id: "coding-problems",
      title: "Coding Problems",
      value: "126",
      unit: "Solved",
      trend: "↑ 18% this week",
      trendType: "positive",
      type: "coding"
    },
    {
      id: "resume-score",
      title: "Resume Score",
      value: "89%",
      unit: "Excellent",
      trend: "↑ 12% this week",
      trendType: "positive",
      type: "resume"
    },
    {
      id: "current-streak",
      title: "Current Streak",
      value: "14",
      unit: "Days",
      trend: "Keep it up! 🔥",
      trendType: "streak",
      type: "streak"
    }
  ],
  dailyGoals: {
    date: "1 May, 2025",
    estimatedTime: "1h 40m",
    tasks: [
      { id: "task-1", text: "Resume Review", completed: true },
      { id: "task-2", text: "React Interview Practice", completed: true },
      { id: "task-3", text: "Solve 2 DSA Problems", completed: true },
      { id: "task-4", text: "Revise DBMS Concepts", completed: false }
    ]
  },
  continueLearning: {
    title: "Google Frontend Interview",
    status: "In Progress",
    questionCurrent: 6,
    questionTotal: 10,
    progressPercent: 60
  },
  recentInterviews: [
    {
      id: "int-1",
      company: "Google",
      role: "Frontend Interview",
      score: 84,
      date: "Yesterday"
    },
    {
      id: "int-2",
      company: "Amazon",
      role: "SDE Interview",
      score: 79,
      date: "2 days ago"
    },
    {
      id: "int-3",
      company: "Microsoft",
      role: "Software Engineer",
      score: 91,
      date: "4 days ago"
    }
  ],
  aiRecommendations: [
    {
      id: "rec-1",
      title: "Improve React Hooks",
      difficulty: "Medium",
      time: "15 min"
    },
    {
      id: "rec-2",
      title: "DBMS Revision",
      difficulty: "Easy",
      time: "20 min"
    },
    {
      id: "rec-3",
      title: "System Design Basics",
      difficulty: "Medium",
      time: "25 min"
    }
  ],
  skills: [
    { name: "React", percentage: 90 },
    { name: "Node.js", percentage: 75 },
    { name: "MongoDB", percentage: 80 },
    { name: "DSA", percentage: 65 },
    { name: "System Design", percentage: 60 }
  ],
  roadmap: {
    overallProgress: 72,
    steps: [
      { name: "Foundations", status: "completed" },
      { name: "Frontend", status: "completed" },
      { name: "Backend", status: "current" },
      { name: "System Design", status: "upcoming" },
      { name: "Advanced", status: "upcoming" },
      { name: "Placement", status: "upcoming" }
    ]
  }
};

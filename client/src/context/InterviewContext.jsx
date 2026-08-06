import React, { createContext, useContext, useState, useEffect } from 'react';

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [currentInterviewId, setCurrentInterviewIdState] = useState(() => {
    return sessionStorage.getItem('currentInterviewId') || null;
  });

  const [activeSession, setActiveSessionState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('activeSessionData');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setCurrentInterviewId = (id) => {
    setCurrentInterviewIdState(id);
    if (id) {
      sessionStorage.setItem('currentInterviewId', id);
    } else {
      sessionStorage.removeItem('currentInterviewId');
    }
  };

  const setActiveSession = (sessionData) => {
    setActiveSessionState(sessionData);
    if (sessionData) {
      sessionStorage.setItem('activeSessionData', JSON.stringify(sessionData));
    } else {
      sessionStorage.removeItem('activeSessionData');
    }
  };

  const clearInterviewSession = () => {
    setCurrentInterviewIdState(null);
    setActiveSessionState(null);
    sessionStorage.removeItem('currentInterviewId');
    sessionStorage.removeItem('activeSessionData');
  };

  return (
    <InterviewContext.Provider
      value={{
        currentInterviewId,
        setCurrentInterviewId,
        activeSession,
        setActiveSession,
        clearInterviewSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

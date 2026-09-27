import React, { useState, useEffect, useRef } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { GrowthProvider, useGrowth } from './context/GrowthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { StudentDashboard } from './pages/StudentDashboard';
import { MyClasses } from './pages/MyClasses';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { Gamification } from './pages/Gamification';
import { CareerGuide } from './pages/CareerGuide';
import { Login } from './pages/Login';

// New pages (coming next, one file at a time)
import { Discover } from './pages/Discover';
import { Mentors } from './pages/Mentors';
import { Opportunities } from './pages/Opportunities';

const SPLASH_DURATION = 2200;

const MainContent = () => {
  const { user } = useAuth();
  const { getProfile } = useGrowth();
  const [activeTab, setActiveTab] = useState('classes');
  const lastUid = useRef(null);

  const isTeacher = user?.role === 'teacher';

  // When a student signs in (or opens the app) without choosing interests yet,
  // take them to Discover first. This is the "tell us your interests" onboarding.
  useEffect(() => {
    const uid = user?.uid || null;
    if (uid === lastUid.current) return;
    lastUid.current = uid;

    if (!user) return;
    if (user.role === 'teacher') {
      setActiveTab('teacher-dash');
      return;
    }
    if (!getProfile(uid)) setActiveTab('discover');
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep students and mentors on pages that exist for their role
  useEffect(() => {
    if (isTeacher && (activeTab === 'my-classes' || activeTab === 'discover')) {
      setActiveTab('teacher-dash');
    }
    if (!isTeacher && activeTab === 'teacher-dash') {
      setActiveTab('classes');
    }
  }, [isTeacher, activeTab]);

  // Start every page at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'classes':
        return <StudentDashboard />;
      case 'discover':
        return <Discover onNavigate={setActiveTab} />;
      case 'mentors':
        return <Mentors onNavigate={setActiveTab} />;
      case 'opportunities':
        return <Opportunities onNavigate={setActiveTab} />;
      case 'my-classes':
        return <MyClasses onBrowseMore={() => setActiveTab('classes')} />;
      case 'teacher-dash':
        return <TeacherDashboard />;
      case 'gamification':
        return <Gamification />;
      case 'careers':
        return <CareerGuide onNavigateToClasses={() => setActiveTab('classes')} />;
      case 'auth':
        return <Login onComplete={() => setActiveTab('classes')} />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#063b30]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderTab()}
      </main>

      <Toast />
      <Footer />
    </div>
  );
};

const AppWithSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <AuthProvider>
      <DataProvider>
        <GrowthProvider>
          <MainContent />
        </GrowthProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default function App() {
  return <AppWithSplash />;
}
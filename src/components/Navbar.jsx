import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Award,
  Compass,
  Flame,
  LogOut,
  PlusCircle,
  Sparkles,
  Menu,
  X,
  Mountain,
  ChevronDown,
  Repeat,
  MessageCircle,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const NAV_ITEMS = [
  { id: 'classes', label: 'Classes', icon: BookOpen },
  { id: 'discover', label: 'Discover', icon: Compass, hideForTeacher: true },
  { id: 'mentors', label: 'Mentors', icon: MessageCircle, hideForTeacher: true },
  { id: 'my-classes', label: 'My Classes', icon: GraduationCap, hideForTeacher: true },
  { id: 'teacher-dash', label: 'Mentor Hub', icon: PlusCircle, teacherOnly: true },
  { id: 'gamification', label: 'Leaderboard', icon: Award },
  { id: 'careers', label: 'Careers', icon: Compass },
];

const getInitials = (user) => {
  const source = user?.displayName || user?.email || 'U';
  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const Avatar = ({ initials, large = false }) => (
  <div
    className={`${
      large ? 'w-11 h-11 text-sm' : 'w-8 h-8 text-xs'
    } shrink-0 rounded-xl bg-[#02c39a] text-white font-bold flex items-center justify-center`}
  >
    {initials}
  </div>
);

const ProfileSummary = ({ user, isTeacher }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#02c39a]/5">
    <Avatar initials={getInitials(user)} large />
    <div className="min-w-0">
      <p className="text-sm font-bold text-[#063b30] truncate">
        {user.displayName || user.email}
      </p>
      <p className="text-[11px] font-medium text-[#063b30]/55">
        {isTeacher ? 'University Mentor' : 'Student'}
      </p>
      <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold text-[#02c39a]">
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {user.streak ?? 0} day streak
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {user.xp ?? 0} XP
        </span>
      </div>
    </div>
  </div>
);

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, toggleRole, logoutUser, loginDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isTeacher = user?.role === 'teacher';

  const visibleItems = NAV_ITEMS.filter(
    (item) => !(item.teacherOnly && !isTeacher) && !(item.hideForTeacher && isTeacher)
  );

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const go = (id) => {
    setActiveTab(id);
    closeMenus();
  };

  const handleSwitchRole = () => {
    toggleRole();
    closeMenus();
  };

  const handleLogout = () => {
    logoutUser();
    closeMenus();
  };

  // Close profile dropdown on outside click, close menus on Escape,
  // and close the mobile drawer when the screen grows to desktop size.
  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e) => e.key === 'Escape' && closeMenus();
    const onResize = () => window.innerWidth >= 1024 && setMobileMenuOpen(false);

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#02c39a]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">

          {/* Brand */}
          <button
            type="button"
            onClick={() => go('classes')}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#02c39a] flex items-center justify-center text-white shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] group-hover:-translate-y-0.5 transition-transform">
              <Mountain className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </div>
            <div className="text-left">
              <span className="block font-extrabold text-xl sm:text-2xl tracking-tight text-[#063b30] leading-none">
                Nagar<span className="text-[#02c39a]">Learn</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-[#063b30]/50 mt-1">
                Distance education for mountain youth
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/15">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#02c39a] text-white shadow-sm'
                      : 'text-[#063b30]/65 hover:text-[#02c39a] hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-2.5 p-1 pr-3 rounded-2xl border transition-colors ${
                    profileOpen ? 'border-[#02c39a]' : 'border-[#02c39a]/20 hover:border-[#02c39a]'
                  }`}
                >
                  <Avatar initials={getInitials(user)} />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-[#063b30] leading-tight truncate max-w-[110px]">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[10px] font-semibold text-[#02c39a]">{user.xp ?? 0} XP</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#063b30]/50 transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#02c39a]/15 shadow-[0_20px_40px_-15px_rgba(6,59,48,0.25)] p-2"
                  >
                    <ProfileSummary user={user} isTeacher={isTeacher} />
                    <div className="mt-2 space-y-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSwitchRole}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#063b30]/80 hover:bg-[#02c39a]/5 hover:text-[#02c39a] transition-colors"
                      >
                        <Repeat className="w-4 h-4" />
                        Switch to {isTeacher ? 'student' : 'mentor'} view
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#063b30]/80 hover:bg-[#02c39a]/5 hover:text-[#02c39a] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => loginDemoUser('student')}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
                >
                  Try Demo
                </button>
                <button
                  type="button"
                  onClick={() => go('auth')}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#02c39a] text-white hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2.5 rounded-xl border border-[#02c39a]/20 text-[#063b30] hover:border-[#02c39a] hover:text-[#02c39a] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#02c39a]/10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">

            {user && <ProfileSummary user={user} isTeacher={isTeacher} />}

            <nav className="grid gap-1 sm:grid-cols-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-[#02c39a] text-white'
                        : 'text-[#063b30]/75 hover:bg-[#02c39a]/5 hover:text-[#02c39a]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#02c39a]/10 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={handleSwitchRole}
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold text-[#02c39a] border border-[#02c39a]/25 hover:bg-[#02c39a]/5 transition-colors"
                  >
                    <Repeat className="w-4 h-4" />
                    {isTeacher ? 'Student view' : 'Mentor view'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-semibold text-white bg-[#02c39a] hover:bg-[#02c39a]/90 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      loginDemoUser('student');
                      closeMenus();
                    }}
                    className="px-3 py-3 rounded-xl text-sm font-semibold text-[#02c39a] border border-[#02c39a]/25 hover:bg-[#02c39a]/5 transition-colors"
                  >
                    Try Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => go('auth')}
                    className="px-3 py-3 rounded-xl text-sm font-semibold text-white bg-[#02c39a] hover:bg-[#02c39a]/90 transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
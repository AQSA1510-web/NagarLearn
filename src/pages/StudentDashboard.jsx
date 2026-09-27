import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClassCard } from '../components/ClassCard';
import { ClassDetailModal } from '../components/ClassDetailModal';
import {
  Search,
  Sparkles,
  Flame,
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, used only for readability)
*/

export const StudentDashboard = () => {
  const { user, claimDailyStreak } = useAuth();
  const { classes } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedClassModal, setSelectedClassModal] = useState(null);

  const subjects = ['All', 'Computer Science', 'Science', 'English', 'Mathematics', 'Career & Tech'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredClasses = classes.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.teacherName.toLowerCase().includes(q);

    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All' || item.level === selectedLevel;

    return matchesSearch && matchesSubject && matchesLevel;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedLevel('All');
  };

  return (
    <div className="space-y-10 pb-16 bg-white">

      {/* Hero Header */}
      <section className="relative rounded-3xl bg-[#02c39a] p-8 sm:p-12 text-white overflow-hidden shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
        {/* Soft decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mountain range silhouette (Rakaposhi) */}
        <svg
          className="absolute bottom-0 left-0 w-full h-32 sm:h-40 pointer-events-none"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 200 L0 150 L160 95 L280 140 L460 45 L560 100 L700 15 L830 110 L960 60 L1080 125 L1200 85 L1200 200 Z"
            fill="#ffffff"
            fillOpacity="0.10"
          />
          <path
            d="M0 200 L0 175 L220 130 L380 165 L600 105 L760 160 L940 120 L1200 170 L1200 200 Z"
            fill="#ffffff"
            fillOpacity="0.12"
          />
        </svg>

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nagar Distance Learning Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Learn live from{' '}
            <span className="relative inline-block">
              university mentors
              <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full bg-white/60" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
            Free live classes, Zoom sessions, peer study groups and career guidance from
            university students across Pakistan, built for the students of Nagar Valley.
          </p>

          {/* Quick Stats */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold">
              <BookOpen className="w-4 h-4" />
              <span>{classes.length} Active Courses</span>
            </div>

            <button
              type="button"
              onClick={claimDailyStreak}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#02c39a] text-xs font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Flame className="w-4 h-4 fill-[#02c39a]/20" />
              <span>{user?.streak ?? 5} Day Learning Streak</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>{user?.xp ?? 650} XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#02c39a]" />
            <input
              type="text"
              placeholder="Search by topic, teacher or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#02c39a]/25 text-sm font-medium text-[#063b30] placeholder:text-[#063b30]/40 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 transition-all"
            />
          </div>

          {/* Level */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#02c39a]" />
            <span className="text-xs font-semibold text-[#063b30]/70">Level</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#02c39a]/25 text-xs font-semibold text-[#063b30] focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 cursor-pointer transition-all"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {subjects.map((subject) => {
            const active = selectedSubject === subject;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                  active
                    ? 'bg-[#02c39a] border-[#02c39a] text-white shadow-[0_8px_20px_-8px_rgba(2,195,154,0.7)]'
                    : 'bg-white border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a] hover:text-[#02c39a]'
                }`}
              >
                {subject === 'All' ? 'All Subjects' : subject}
              </button>
            );
          })}
        </div>
      </section>

      {/* Classes Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#063b30] flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#02c39a]" />
            <span>Available Live Classes</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#02c39a]/10 text-[#02c39a]">
              {filteredClasses.length}
            </span>
          </h2>
        </div>

        {filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                onSelectClass={setSelectedClassModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-8 bg-white rounded-3xl border border-dashed border-[#02c39a]/40">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
              <Search className="w-7 h-7 text-[#02c39a]" />
            </div>
            <h3 className="text-lg font-bold text-[#063b30] mb-2">No classes found</h3>
            <p className="text-sm text-[#063b30]/60 max-w-sm mx-auto mb-6">
              Try a different search term or adjust the subject and level filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-xs font-semibold hover:bg-[#02c39a]/90 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Class Details Modal */}
      {selectedClassModal && (
        <ClassDetailModal
          classItem={selectedClassModal}
          onClose={() => setSelectedClassModal(null)}
        />
      )}
    </div>
  );
};
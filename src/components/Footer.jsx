import React from 'react';
import { Heart, Globe, BookOpen, Users, Mountain } from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const STATS = [
  { value: '500+', label: 'Nagar Students Enrolled' },
  { value: '45+', label: 'University Mentors' },
  { value: '120+', label: 'Live Video Classes' },
  { value: '98%', label: 'Student Satisfaction' },
];

const SUBJECTS = [
  'Computer Science & Coding Basics',
  'Physics & Practical Engineering',
  'English Conversation & Spoken Skills',
  'Mathematics & Geometry',
  'Digital Marketing & Remote Freelancing',
];

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#02c39a]/15 mt-20 pt-12 sm:pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Community Stats */}
        <div className="relative overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 p-6 sm:p-8 rounded-3xl bg-[#02c39a] text-white mb-12 shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative text-center ${
                i > 0 ? 'md:border-l md:border-white/25' : ''
              }`}
            >
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">{stat.value}</p>
              <p className="text-[11px] sm:text-xs font-medium text-white/85 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 border-b border-[#02c39a]/15">

          {/* Brand & Mission */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#02c39a] flex items-center justify-center text-white">
                <Mountain className="w-5 h-5" strokeWidth={2.25} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#063b30]">
                Nagar<span className="text-[#02c39a]">Learn</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#063b30]/60 max-w-sm">
              Connecting university mentors from KIU, NUST, UET and LUMS with students in Nagar
              Valley for live distance learning, mentorship and career guidance.
            </p>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="font-semibold text-xs text-[#063b30] uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#02c39a]" />
              Subjects & Topics
            </h4>
            <ul className="space-y-2.5">
              {SUBJECTS.map((subject) => (
                <li
                  key={subject}
                  className="flex items-center gap-2.5 text-sm text-[#063b30]/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#02c39a] shrink-0" />
                  {subject}
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-xs text-[#063b30] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#02c39a]" />
              Community Initiative
            </h4>
            <p className="text-sm text-[#063b30]/60 leading-relaxed mb-4">
              Built to break the geographic barriers to education in mountain regions, powered by
              volunteer university students who want to give back.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#02c39a]/10 text-xs font-semibold text-[#02c39a]">
              <Users className="w-4 h-4" />
              Open to all Nagar Valley schools
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#063b30]/50 text-center sm:text-left">
          <p>© {year} NagarLearn. Distance education for mountain youth.</p>
          <p className="flex items-center gap-1.5 font-medium text-[#063b30]/70">
            Made with
            <Heart className="w-4 h-4 text-[#02c39a] fill-[#02c39a]" />
            for Nagar youth
          </p>
        </div>
      </div>
    </footer>
  );
};
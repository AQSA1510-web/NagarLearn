import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CreateClassModal } from '../components/CreateClassModal';
import {
  PlusCircle,
  Users,
  Video,
  Trash2,
  BookOpen,
  Clock,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Gauge,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'S';

export const TeacherDashboard = () => {
  const { user, triggerToast } = useAuth();
  const { classes, deleteClass } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openRosterId, setOpenRosterId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Only this mentor's classes, so a mentor can never delete someone else's class
  const myClasses = classes.filter(
    (c) =>
      (user?.uid && c.teacherId === user.uid) ||
      (user?.displayName && (c.teacherName || '').includes(user.displayName))
  );

  const totalStudents = myClasses.reduce((sum, c) => sum + (c.enrolledStudents || []).length, 0);
  const totalSeats = myClasses.reduce((sum, c) => sum + (Number(c.capacity) || 30), 0);
  const fillRate = totalSeats ? Math.round((totalStudents / totalSeats) * 100) : 0;

  const stats = [
    { icon: BookOpen, value: myClasses.length, label: 'Active classes' },
    { icon: Users, value: totalStudents, label: 'Students enrolled' },
    { icon: Gauge, value: `${fillRate}%`, label: 'Seats filled' },
  ];

  const handleDelete = async (item) => {
    await deleteClass(item.id);
    setConfirmDeleteId(null);
    if (openRosterId === item.id) setOpenRosterId(null);
    triggerToast(`"${item.title}" has been deleted.`, 'info');
  };

  return (
    <div className="space-y-8 pb-16 bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#02c39a] text-white p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <svg
          className="absolute bottom-0 left-0 w-full h-24 sm:h-32 pointer-events-none"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 200 L0 150 L160 95 L280 140 L460 45 L560 100 L700 15 L830 110 L960 60 L1080 125 L1200 85 L1200 200 Z"
            fill="#ffffff"
            fillOpacity="0.10"
          />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mentor Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {user?.displayName?.split(' ')[0] || 'Mentor'}
            </h1>
            <p className="text-sm text-white/90">
              Create live classes, share your session links and guide the students of Nagar Valley.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#02c39a] font-semibold text-sm shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Class
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 sm:gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="p-4 sm:p-6 rounded-3xl bg-white border border-[#02c39a]/15 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-[#02c39a]/10 text-[#02c39a] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-[#063b30]">{value}</p>
              <p className="text-[11px] sm:text-xs font-medium text-[#063b30]/55">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Class List */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#063b30] flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#02c39a]" />
            My Classes
          </h2>
          {myClasses.length > 0 && (
            <span className="text-xs font-semibold text-[#063b30]/55">
              {myClasses.length} published
            </span>
          )}
        </div>

        {myClasses.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[#02c39a]" />
            </div>
            <h3 className="text-lg font-bold text-[#063b30] mb-2">Create your first class</h3>
            <p className="text-sm text-[#063b30]/60 max-w-md mx-auto mb-6">
              Share what you know. Even one hour a week can change what a student in Nagar believes is possible.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Create a Class
            </button>
          </div>
        ) : (
          myClasses.map((item) => {
            const students = item.enrolledStudents || [];
            const capacity = Number(item.capacity) || 30;
            const fill = Math.min(100, (students.length / capacity) * 100);
            const rosterOpen = openRosterId === item.id;
            const confirming = confirmDeleteId === item.id;

            return (
              <article
                key={item.id}
                className="bg-white rounded-3xl border border-[#02c39a]/15 hover:border-[#02c39a]/40 hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.25)] transition-all"
              >
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  {/* Info */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
                        {item.subject}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#063b30]/60 border border-[#02c39a]/20">
                        {item.level}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#063b30]">{item.title}</h3>
                    <p className="text-xs text-[#063b30]/60 line-clamp-1">{item.description}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs font-medium text-[#063b30]/60">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#02c39a]" />
                        {item.schedule}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#02c39a]" />
                        <span className="font-semibold text-[#063b30]">
                          {students.length} / {capacity}
                        </span>
                        <span className="w-20 h-1.5 rounded-full bg-[#02c39a]/10 overflow-hidden">
                          <span className="block h-full rounded-full bg-[#02c39a]" style={{ width: `${fill}%` }} />
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  {confirming ? (
                    <div className="flex items-center gap-2 w-full lg:w-auto p-2 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/20">
                      <span className="flex-1 lg:flex-none px-2 text-xs font-semibold text-[#063b30]">
                        Delete this class?
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#063b30]/70 bg-white border border-[#02c39a]/20 hover:border-[#02c39a] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#063b30] hover:bg-[#063b30]/90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:flex items-center gap-2 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={() => setOpenRosterId(rosterOpen ? null : item.id)}
                        aria-expanded={rosterOpen}
                        className={`col-span-4 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-colors ${
                          rosterOpen
                            ? 'bg-[#02c39a]/5 border-[#02c39a] text-[#02c39a]'
                            : 'bg-white border-[#02c39a]/25 text-[#063b30]/75 hover:border-[#02c39a] hover:text-[#02c39a]'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        Students
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${rosterOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {item.zoomLink && (
                        <a
                          href={item.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#02c39a] text-white font-semibold text-xs hover:bg-[#02c39a]/90 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Start Session
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      )}

                      {item.whatsappLink && (
                        <a
                          href={item.whatsappLink}
                          target="_blank"
                          rel="noreferrer"
                          title="Open WhatsApp group"
                          aria-label="Open WhatsApp group"
                          className="flex items-center justify-center p-2.5 rounded-2xl text-[#02c39a] border border-[#02c39a]/25 hover:border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        title="Delete class"
                        aria-label="Delete class"
                        className="flex items-center justify-center p-2.5 rounded-2xl text-[#063b30]/45 border border-[#02c39a]/15 hover:text-[#063b30] hover:border-[#063b30]/30 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Roster */}
                {rosterOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <div className="pt-4 border-t border-[#02c39a]/10">
                      <p className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-3">
                        Enrolled students ({students.length})
                      </p>
                      {students.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {students.map((studentName, i) => (
                            <span
                              key={`${studentName}-${i}`}
                              className="pl-1 pr-3 py-1 rounded-full bg-white border border-[#02c39a]/20 text-xs font-medium text-[#063b30]/80 flex items-center gap-2"
                            >
                              <span className="w-6 h-6 rounded-full bg-[#02c39a]/10 text-[#02c39a] text-[10px] font-bold flex items-center justify-center">
                                {getInitials(studentName)}
                              </span>
                              {studentName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#063b30]/50">No students have enrolled yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {showCreateModal && <CreateClassModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
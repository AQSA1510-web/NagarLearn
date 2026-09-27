import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  X,
  Video,
  MessageCircle,
  Users,
  Clock,
  BookOpen,
  CheckCircle,
  ExternalLink,
  UserRound,
  Lock,
  Plus,
  Info,
  Timer,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const MAX_VISIBLE_CLASSMATES = 12;

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'S';

export const ClassDetailModal = ({ classItem, onClose }) => {
  const { user, enrollClassInUser, unenrollClassInUser, completeClassInUser } = useAuth();
  const { updateClassEnrollment } = useData();

  const [notice, setNotice] = useState('');
  const [confirmUnenroll, setConfirmUnenroll] = useState(false);

  // Close on Escape + lock background scroll while open
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Auto-hide inline notices
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  if (!classItem) return null;

  const isEnrolled = user?.enrolledClasses?.includes(classItem.id);
  const isCompleted = user?.completedClasses?.includes(classItem.id);
  const enrolledStudents = classItem.enrolledStudents || [];
  const capacity = classItem.capacity || 30;
  const isFull = enrolledStudents.length >= capacity;
  const fillPercent = Math.min(100, (enrolledStudents.length / capacity) * 100);
  const visibleClassmates = enrolledStudents.slice(0, MAX_VISIBLE_CLASSMATES);
  const hiddenCount = enrolledStudents.length - visibleClassmates.length;

  const handleEnroll = () => {
    if (!user) {
      setNotice('Please sign in or try the demo to enroll.');
      return;
    }
    if (isFull) {
      setNotice('This class is full. Check back later for open seats.');
      return;
    }
    enrollClassInUser(classItem.id);
    updateClassEnrollment(classItem.id, user.displayName, 'enroll');
  };

  const handleUnenroll = () => {
    unenrollClassInUser(classItem.id);
    updateClassEnrollment(classItem.id, user.displayName, 'unenroll');
    setConfirmUnenroll(false);
  };

  const handleCompleteClass = () => {
    completeClassInUser(classItem.id, classItem.subject);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#063b30]/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="class-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-pop relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(6,59,48,0.45)] max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/60 z-20" />

        {/* Header */}
        <header className="relative overflow-hidden bg-[#02c39a] text-white px-5 sm:px-8 pt-7 sm:pt-8 pb-6">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex flex-wrap items-center gap-2 mb-3 pr-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white text-[#02c39a]">
              {classItem.subject}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 border border-white/30">
              {classItem.level}
            </span>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/15 border border-white/30 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>

          <h2
            id="class-modal-title"
            className="relative text-xl sm:text-2xl font-extrabold tracking-tight leading-snug pr-8"
          >
            {classItem.title}
          </h2>

          <p className="relative mt-2 flex items-center gap-2 text-sm text-white/90">
            <UserRound className="w-4 h-4" />
            <span>
              Mentor: <span className="font-semibold text-white">{classItem.teacherName}</span>
            </span>
          </p>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">

          {/* Session Links */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Live class */}
            <div className="p-4 rounded-2xl border border-[#02c39a]/20 bg-white">
              <p className="text-xs font-semibold text-[#063b30]/60 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#02c39a]/10 flex items-center justify-center">
                  <Video className="w-4 h-4 text-[#02c39a]" />
                </span>
                Live Zoom / Meet Session
              </p>
              {isEnrolled && classItem.zoomLink ? (
                <a
                  href={classItem.zoomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#02c39a] hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
                >
                  Join Live Classroom
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <p className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#02c39a]/5 text-xs text-[#063b30]/55">
                  <Lock className="w-3.5 h-3.5 text-[#02c39a]" />
                  {isEnrolled ? 'Link will be shared soon' : 'Enroll to unlock the class link'}
                </p>
              )}
            </div>

            {/* Study group */}
            <div className="p-4 rounded-2xl border border-[#02c39a]/20 bg-white">
              <p className="text-xs font-semibold text-[#063b30]/60 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#02c39a]/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-[#02c39a]" />
                </span>
                WhatsApp Study Group
              </p>
              {isEnrolled && classItem.whatsappLink ? (
                <a
                  href={classItem.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#02c39a] bg-white border border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
                >
                  Join Study Group
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              ) : (
                <p className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#02c39a]/5 text-xs text-[#063b30]/55">
                  <Lock className="w-3.5 h-3.5 text-[#02c39a]" />
                  {isEnrolled ? 'Group link coming soon' : 'Enroll to unlock the study group'}
                </p>
              )}
            </div>
          </section>

          {/* About */}
          <section>
            <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-2">
              About this class
            </h4>
            <p className="text-sm text-[#063b30]/80 leading-relaxed">{classItem.description}</p>
          </section>

          {/* Details */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#02c39a]/5">
              <p className="text-[11px] font-semibold text-[#063b30]/50 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#02c39a]" /> Schedule
              </p>
              <p className="text-sm font-semibold text-[#063b30]">{classItem.schedule}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#02c39a]/5">
              <p className="text-[11px] font-semibold text-[#063b30]/50 mb-1 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-[#02c39a]" /> Duration
              </p>
              <p className="text-sm font-semibold text-[#063b30]">{classItem.duration || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#02c39a]/5">
              <p className="text-[11px] font-semibold text-[#063b30]/50 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#02c39a]" /> Prerequisites
              </p>
              <p className="text-sm font-semibold text-[#063b30]">{classItem.prerequisite || 'None'}</p>
            </div>
          </section>

          {/* Classmates */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#02c39a]" />
                Classmates
              </h4>
              <span className="text-xs font-semibold text-[#063b30]/60">
                {enrolledStudents.length} / {capacity}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#02c39a]/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#02c39a] rounded-full transition-all duration-500"
                style={{ width: `${fillPercent}%` }}
              />
            </div>

            {enrolledStudents.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {visibleClassmates.map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    className="pl-1 pr-3 py-1 rounded-full bg-white border border-[#02c39a]/20 text-xs font-medium text-[#063b30]/80 flex items-center gap-2"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#02c39a]/10 text-[#02c39a] text-[10px] font-bold flex items-center justify-center">
                      {getInitials(name)}
                    </span>
                    {name}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-[#02c39a]/10 text-xs font-semibold text-[#02c39a] flex items-center">
                    +{hiddenCount} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#063b30]/50">Be the first student to join this class.</p>
            )}
          </section>
        </div>

        {/* Footer Actions (always visible) */}
        <footer className="border-t border-[#02c39a]/15 bg-white px-5 sm:px-8 py-4 space-y-3">
          {notice && (
            <div
              role="status"
              className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#02c39a]/10 text-xs font-medium text-[#063b30]"
            >
              <Info className="w-4 h-4 text-[#02c39a] shrink-0" />
              <span className="flex-1">{notice}</span>
            </div>
          )}

          {confirmUnenroll ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1 text-sm font-medium text-[#063b30]">
                Leave this class? You will lose access to the session links.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmUnenroll(false)}
                  className="px-5 py-3 rounded-2xl text-sm font-semibold text-[#063b30]/70 border border-[#02c39a]/25 hover:border-[#02c39a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUnenroll}
                  className="px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-[#063b30] hover:bg-[#063b30]/90 transition-colors"
                >
                  Unenroll
                </button>
              </div>
            </div>
          ) : isEnrolled ? (
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2">
              <button
                type="button"
                onClick={() => setConfirmUnenroll(true)}
                className="px-4 py-3 rounded-2xl text-sm font-semibold text-[#063b30]/50 hover:text-[#063b30] hover:bg-[#02c39a]/5 transition-colors"
              >
                Unenroll
              </button>
              <button
                type="button"
                onClick={handleCompleteClass}
                disabled={isCompleted}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  isCompleted
                    ? 'bg-[#02c39a]/10 text-[#02c39a] cursor-default'
                    : 'bg-[#02c39a] text-white hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)]'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCompleted ? 'Class Completed' : 'Mark as Completed  +100 XP'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEnroll}
              disabled={isFull && !!user}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-colors ${
                isFull && user
                  ? 'bg-[#02c39a]/10 text-[#063b30]/40 cursor-not-allowed'
                  : 'bg-[#02c39a] text-white hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)]'
              }`}
            >
              {isFull && user ? (
                'Class Full'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Enroll Now, It's Free
                </>
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
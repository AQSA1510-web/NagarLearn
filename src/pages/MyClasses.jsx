import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClassDetailModal } from '../components/ClassDetailModal';
import {
  GraduationCap,
  Video,
  MessageCircle,
  CheckCircle,
  Clock,
  BookOpen,
  ExternalLink,
  UserRound,
  ArrowRight,
  X,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

export const MyClasses = ({ onBrowseMore }) => {
  const { user, completeClassInUser, unenrollClassInUser } = useAuth();
  const { classes, updateClassEnrollment } = useData();
  const [selectedClassModal, setSelectedClassModal] = useState(null);
  const [confirmUnenrollId, setConfirmUnenrollId] = useState(null);

  const enrolledIds = user?.enrolledClasses || [];
  const completedIds = user?.completedClasses || [];

  const enrolledClasses = classes.filter((c) => enrolledIds.includes(c.id));
  const completedCount = enrolledClasses.filter((c) => completedIds.includes(c.id)).length;
  const progress = enrolledClasses.length
    ? Math.round((completedCount / enrolledClasses.length) * 100)
    : 0;

  const handleUnenroll = (item) => {
    unenrollClassInUser(item.id);
    updateClassEnrollment(item.id, user.displayName, 'unenroll');
    setConfirmUnenrollId(null);
  };

  return (
    <div className="space-y-8 pb-16 bg-white">

      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#02c39a] text-white p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>My Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">My Enrolled Classes</h1>
            <p className="text-sm text-white/90 max-w-lg">
              Join your live Zoom sessions, connect with your study group and track your progress.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="px-3 sm:px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-center">
              <p className="text-xl sm:text-2xl font-extrabold">{enrolledClasses.length}</p>
              <p className="text-[10px] uppercase font-semibold tracking-wide text-white/80">Enrolled</p>
            </div>
            <div className="px-3 sm:px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-center">
              <p className="text-xl sm:text-2xl font-extrabold">{completedCount}</p>
              <p className="text-[10px] uppercase font-semibold tracking-wide text-white/80">Completed</p>
            </div>
            <div className="px-3 sm:px-5 py-3 rounded-2xl bg-white text-[#02c39a] text-center">
              <p className="text-xl sm:text-2xl font-extrabold">{progress}%</p>
              <p className="text-[10px] uppercase font-semibold tracking-wide text-[#02c39a]/80">Progress</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {enrolledClasses.length > 0 && (
          <div className="relative z-10 mt-6 h-2 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </section>

      {/* Enrolled Classes */}
      {enrolledClasses.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#063b30] flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#02c39a]" />
            <span>Your Classes</span>
          </h2>

          {enrolledClasses.map((item) => {
            const isCompleted = completedIds.includes(item.id);
            const confirming = confirmUnenrollId === item.id;

            return (
              <article
                key={item.id}
                className={`relative bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isCompleted
                    ? 'border-[#02c39a]/40'
                    : 'border-[#02c39a]/15 hover:border-[#02c39a]/40 hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.25)]'
                }`}
              >
                {/* Left: Info */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
                      {item.subject}
                    </span>
                    {isCompleted && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#02c39a] text-white flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedClassModal(item)}
                    className="block text-left text-base sm:text-lg font-bold text-[#063b30] hover:text-[#02c39a] transition-colors"
                  >
                    {item.title}
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5 text-xs font-medium text-[#063b30]/60">
                    <span className="flex items-center gap-1.5">
                      <UserRound className="w-4 h-4 text-[#02c39a]" />
                      {item.teacherName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#02c39a]" />
                      {item.schedule} ({item.duration})
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                {confirming ? (
                  <div className="flex items-center gap-2 w-full md:w-auto p-2 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/20">
                    <span className="flex-1 md:flex-none px-2 text-xs font-semibold text-[#063b30]">
                      Leave this class?
                    </span>
                    <button
                      type="button"
                      onClick={() => setConfirmUnenrollId(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#063b30]/70 bg-white border border-[#02c39a]/20 hover:border-[#02c39a] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnenroll(item)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#063b30] hover:bg-[#063b30]/90 transition-colors"
                    >
                      Unenroll
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
                    {item.zoomLink && (
                      <a
                        href={item.zoomLink}
                        target="_blank"
                        rel="noreferrer"
                        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#02c39a] text-white font-semibold text-xs hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Session</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    )}

                    {item.whatsappLink && (
                      <a
                        href={item.whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        title="Join WhatsApp study group"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-[#02c39a] border border-[#02c39a]/30 hover:bg-[#02c39a]/5 transition-colors text-xs font-semibold"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="md:hidden">Study Group</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => completeClassInUser(item.id, item.subject)}
                      disabled={isCompleted}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-[#02c39a]/10 text-[#02c39a] cursor-default'
                          : 'bg-white text-[#02c39a] border border-[#02c39a] hover:bg-[#02c39a] hover:text-white'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {isCompleted ? 'Done' : 'Mark Done  +100 XP'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmUnenrollId(item.id)}
                      title="Unenroll from this class"
                      className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl text-xs font-semibold text-[#063b30]/45 hover:text-[#063b30] hover:bg-[#02c39a]/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Unenroll</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      ) : (
        <section className="text-center py-16 px-6 sm:px-8 bg-white rounded-3xl border border-dashed border-[#02c39a]/40">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-[#02c39a]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#063b30] mb-2">No classes yet</h3>
          <p className="text-sm text-[#063b30]/60 max-w-md mx-auto mb-6">
            You haven't enrolled in any classes. Explore live classes taught by university mentors from across Pakistan.
          </p>
          <button
            type="button"
            onClick={onBrowseMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
          >
            Browse Live Classes
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {selectedClassModal && (
        <ClassDetailModal
          classItem={selectedClassModal}
          onClose={() => setSelectedClassModal(null)}
        />
      )}
    </div>
  );
};
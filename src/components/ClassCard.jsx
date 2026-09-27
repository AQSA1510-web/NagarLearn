import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Video,
  Users,
  Clock,
  CheckCircle,
  Plus,
  ExternalLink,
  UserRound,
  Info,
  X,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

export const ClassCard = ({ classItem, onSelectClass }) => {
  const { user, enrollClassInUser, unenrollClassInUser } = useAuth();
  const { updateClassEnrollment } = useData();

  const [notice, setNotice] = useState('');
  const [hoverEnrolled, setHoverEnrolled] = useState(false);

  const isEnrolled = user?.enrolledClasses?.includes(classItem.id);
  const enrolledCount = (classItem.enrolledStudents || []).length;
  const capacity = classItem.capacity || 30;
  const seatsLeft = Math.max(0, capacity - enrolledCount);
  const isFull = enrolledCount >= capacity;
  const fillPercent = Math.min(100, (enrolledCount / capacity) * 100);

  // Auto-hide inline notices
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const handleEnrollToggle = (e) => {
    e.stopPropagation();

    if (!user) {
      setNotice('Please sign in or try the demo to enroll.');
      return;
    }

    if (isEnrolled) {
      unenrollClassInUser(classItem.id);
      updateClassEnrollment(classItem.id, user.displayName, 'unenroll');
      setHoverEnrolled(false);
      return;
    }

    if (isFull) {
      setNotice('This class is full. Check back later for open seats.');
      return;
    }

    enrollClassInUser(classItem.id);
    updateClassEnrollment(classItem.id, user.displayName, 'enroll');
  };

  const openDetails = () => onSelectClass(classItem);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetails();
        }
      }}
      className={`group relative bg-white rounded-3xl p-5 sm:p-6 border flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(6,59,48,0.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#02c39a]/20 ${
        isEnrolled ? 'border-[#02c39a]/50' : 'border-[#02c39a]/15 hover:border-[#02c39a]/40'
      }`}
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
            {classItem.subject}
          </span>

          {classItem.isLiveNow ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-[#02c39a] text-white">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-white" />
              </span>
              LIVE NOW
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#063b30]/60 border border-[#02c39a]/20">
              {classItem.level}
            </span>
          )}
        </div>

        <h3 className="font-bold text-base sm:text-lg text-[#063b30] group-hover:text-[#02c39a] transition-colors leading-snug mb-2">
          {classItem.title}
        </h3>

        <p className="text-xs font-medium text-[#063b30]/60 flex items-center gap-1.5 mb-3">
          <UserRound className="w-4 h-4 text-[#02c39a]" />
          {classItem.teacherName}
        </p>

        <p className="text-xs text-[#063b30]/60 line-clamp-2 leading-relaxed mb-4">
          {classItem.description}
        </p>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-[#02c39a]/5 mb-4 text-xs font-medium text-[#063b30]/80">
          <Clock className="w-4 h-4 text-[#02c39a] shrink-0" />
          <span className="truncate">
            {classItem.schedule} ({classItem.duration})
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-4 border-t border-[#02c39a]/10 space-y-3">

        {/* Capacity */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#063b30]/55 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#02c39a]" />
              {enrolledCount} enrolled
            </span>
            <span className={isFull ? 'text-[#063b30]' : ''}>
              {isFull ? 'No seats left' : `${seatsLeft} seats left`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#02c39a]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#02c39a] rounded-full transition-all duration-500"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Inline notice (replaces browser alerts) */}
        {notice && (
          <div
            role="status"
            onClick={(e) => e.stopPropagation()}
            className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-[#02c39a]/10 text-[11px] font-medium text-[#063b30]"
          >
            <Info className="w-4 h-4 text-[#02c39a] shrink-0" />
            <span className="flex-1">{notice}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation();
                setNotice('');
              }}
              className="text-[#063b30]/50 hover:text-[#063b30]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isEnrolled && classItem.zoomLink && (
            <a
              href={classItem.zoomLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#02c39a] text-white font-semibold text-xs hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Join Class</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          )}

          <button
            type="button"
            onClick={handleEnrollToggle}
            onMouseEnter={() => isEnrolled && setHoverEnrolled(true)}
            onMouseLeave={() => setHoverEnrolled(false)}
            disabled={!isEnrolled && isFull && !!user}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
              isEnrolled
                ? 'bg-white text-[#02c39a] border border-[#02c39a] hover:bg-[#02c39a]/5'
                : isFull
                ? 'bg-[#02c39a]/10 text-[#063b30]/40 cursor-not-allowed'
                : 'bg-[#02c39a] text-white hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)]'
            }`}
          >
            {isEnrolled ? (
              hoverEnrolled ? (
                <>
                  <X className="w-4 h-4" /> Unenroll
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Enrolled
                </>
              )
            ) : isFull ? (
              'Class Full'
            ) : (
              <>
                <Plus className="w-4 h-4" /> Enroll Now
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
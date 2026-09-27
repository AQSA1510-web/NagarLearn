import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { X, PlusCircle, Video, MessageCircle, Info, Loader2 } from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const SUBJECTS = ['Computer Science', 'Science', 'English', 'Mathematics', 'Career & Tech'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DESCRIPTION_MAX = 400;

const inputClass =
  'w-full px-4 py-3 rounded-2xl bg-white border text-sm font-medium text-[#063b30] placeholder:text-[#063b30]/35 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 transition-all';

const Field = ({ label, htmlFor, hint, error, className = '', children }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#063b30]/80 mb-1.5">
      {label}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-[11px] font-medium text-[#063b30] flex items-center gap-1">
        <Info className="w-3.5 h-3.5 text-[#02c39a]" />
        {error}
      </p>
    ) : (
      hint && <p className="mt-1.5 text-[11px] text-[#063b30]/45">{hint}</p>
    )}
  </div>
);

export const CreateClassModal = ({ onClose }) => {
  const { user, triggerToast } = useAuth();
  const { addClass } = useData();

  const [formData, setFormData] = useState({
    title: '',
    subject: 'Computer Science',
    level: 'Beginner',
    capacity: 30,
    schedule: 'Mon & Wed, 4:00 PM PKT',
    duration: '1 Hour',
    zoomLink: 'https://zoom.us/j/84920491823',
    whatsappLink: 'https://chat.whatsapp.com/nagar-learning-group',
    description: '',
    prerequisite: 'No prior experience required.',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Escape to close + lock background scroll
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !submitting && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, submitting]);

  const update = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!formData.title.trim()) next.title = 'Give your class a title.';
    if (!formData.schedule.trim()) next.schedule = 'Add a day and time.';
    if (!formData.zoomLink.trim()) next.zoomLink = 'Add a Zoom or Google Meet link.';
    if (!formData.description.trim()) next.description = 'Describe what students will learn.';
    const cap = Number(formData.capacity);
    if (!cap || cap < 5 || cap > 100) next.capacity = 'Between 5 and 100.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await addClass({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        teacherName: user?.displayName || 'University Mentor',
        teacherId: user?.uid || 'teacher-sara',
        capacity: Number(formData.capacity),
      });
      triggerToast('Your class has been published.');
      onClose();
    } catch (err) {
      setSubmitError('Could not publish the class. Please try again.');
      setSubmitting(false);
    }
  };

  const borderFor = (field) => (errors[field] ? 'border-[#063b30]/40' : 'border-[#02c39a]/25');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#063b30]/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-class-title"
        className="animate-pop relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(6,59,48,0.45)] max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="relative overflow-hidden bg-[#02c39a] text-white px-5 sm:px-8 py-6">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/60" />

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-3 pr-10">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#02c39a] flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-class-title" className="text-lg sm:text-xl font-extrabold tracking-tight">
                Create a New Class
              </h2>
              <p className="text-xs sm:text-sm text-white/85">
                Share your knowledge with students in Nagar Valley
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">

            {/* Basics */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#02c39a]">
                Class Basics
              </h3>

              <Field label="Class title" htmlFor="cc-title" error={errors.title}>
                <input
                  id="cc-title"
                  type="text"
                  placeholder="e.g. Physics Made Simple: Electric Circuits"
                  value={formData.title}
                  onChange={update('title')}
                  className={`${inputClass} ${borderFor('title')}`}
                />
              </Field>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Field label="Subject" htmlFor="cc-subject" className="col-span-2">
                  <select
                    id="cc-subject"
                    value={formData.subject}
                    onChange={update('subject')}
                    className={`${inputClass} ${borderFor('subject')} cursor-pointer`}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Level" htmlFor="cc-level">
                  <select
                    id="cc-level"
                    value={formData.level}
                    onChange={update('level')}
                    className={`${inputClass} ${borderFor('level')} cursor-pointer`}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Seats" htmlFor="cc-capacity" error={errors.capacity}>
                  <input
                    id="cc-capacity"
                    type="number"
                    min="5"
                    max="100"
                    value={formData.capacity}
                    onChange={update('capacity')}
                    className={`${inputClass} ${borderFor('capacity')}`}
                  />
                </Field>
              </div>
            </section>

            {/* Timing */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#02c39a]">
                Timing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field
                  label="Schedule"
                  htmlFor="cc-schedule"
                  error={errors.schedule}
                  hint="Days and time in Pakistan time"
                  className="sm:col-span-2"
                >
                  <input
                    id="cc-schedule"
                    type="text"
                    placeholder="e.g. Mon & Wed, 4:00 PM PKT"
                    value={formData.schedule}
                    onChange={update('schedule')}
                    className={`${inputClass} ${borderFor('schedule')}`}
                  />
                </Field>

                <Field label="Duration" htmlFor="cc-duration">
                  <input
                    id="cc-duration"
                    type="text"
                    placeholder="e.g. 1 Hour"
                    value={formData.duration}
                    onChange={update('duration')}
                    className={`${inputClass} ${borderFor('duration')}`}
                  />
                </Field>
              </div>
            </section>

            {/* Links */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#02c39a]">
                Session Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Zoom / Google Meet link" htmlFor="cc-zoom" error={errors.zoomLink}>
                  <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#02c39a]" />
                    <input
                      id="cc-zoom"
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      value={formData.zoomLink}
                      onChange={update('zoomLink')}
                      className={`${inputClass} ${borderFor('zoomLink')} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="WhatsApp group link" htmlFor="cc-whatsapp" hint="Optional">
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#02c39a]" />
                    <input
                      id="cc-whatsapp"
                      type="url"
                      placeholder="https://chat.whatsapp.com/..."
                      value={formData.whatsappLink}
                      onChange={update('whatsappLink')}
                      className={`${inputClass} ${borderFor('whatsappLink')} pl-11`}
                    />
                  </div>
                </Field>
              </div>
            </section>

            {/* Details */}
            <section className="space-y-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#02c39a]">
                Details
              </h3>

              <Field label="What will students learn?" htmlFor="cc-description" error={errors.description}>
                <textarea
                  id="cc-description"
                  rows={4}
                  maxLength={DESCRIPTION_MAX}
                  placeholder="Describe the topics, goals and what students will be able to do after this class."
                  value={formData.description}
                  onChange={update('description')}
                  className={`${inputClass} ${borderFor('description')} resize-none leading-relaxed`}
                />
                <p className="mt-1 text-right text-[11px] text-[#063b30]/40">
                  {formData.description.length} / {DESCRIPTION_MAX}
                </p>
              </Field>

              <Field label="Prerequisites" htmlFor="cc-prereq" hint="What students should know beforehand">
                <input
                  id="cc-prereq"
                  type="text"
                  value={formData.prerequisite}
                  onChange={update('prerequisite')}
                  className={`${inputClass} ${borderFor('prerequisite')}`}
                />
              </Field>
            </section>
          </div>

          {/* Footer (always visible) */}
          <footer className="border-t border-[#02c39a]/15 bg-white px-5 sm:px-8 py-4 space-y-3">
            {submitError && (
              <div
                role="alert"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#02c39a]/10 text-xs font-medium text-[#063b30]"
              >
                <Info className="w-4 h-4 text-[#02c39a] shrink-0" />
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-2 sm:flex sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-3 rounded-2xl text-sm font-semibold text-[#063b30]/70 border border-[#02c39a]/25 hover:border-[#02c39a] hover:text-[#063b30] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Publish Class
                  </>
                )}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};
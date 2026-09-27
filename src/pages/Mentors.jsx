import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useGrowth,
  MENTORS,
  INTERESTS,
  LEVELS,
  GUIDANCE_TOPICS,
  resolveMentorId,
} from '../context/GrowthContext';
import {
  Users,
  Search,
  MapPin,
  Languages,
  CheckCircle2,
  MessageCircle,
  Send,
  X,
  Sparkles,
  Clock,
  Inbox,
  Loader2,
  Quote,
  CornerDownRight,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const MESSAGE_MIN = 15;
const MESSAGE_MAX = 500;

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'M';

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? 'yesterday' : `${days} days ago`;
};

const Hero = ({ badge, title, text, stats }) => (
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
    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs font-semibold tracking-wide uppercase">
          <Users className="w-3.5 h-3.5" />
          {badge}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-sm sm:text-base text-white/90">{text}</p>
      </div>
      <div className={`grid gap-2 sm:gap-3 w-full lg:w-auto`} style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-3 sm:px-5 py-3 rounded-2xl text-center ${
              i === stats.length - 1 ? 'bg-white text-[#02c39a]' : 'bg-white/15 border border-white/25'
            }`}
          >
            <p className="text-xl sm:text-2xl font-extrabold">{s.value}</p>
            <p
              className={`text-[10px] uppercase font-semibold tracking-wide ${
                i === stats.length - 1 ? 'text-[#02c39a]/80' : 'text-white/80'
              }`}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================================
   Ask for guidance modal
   ============================================================================ */
const AskModal = ({ mentor, onClose, onSend }) => {
  const [topic, setTopic] = useState(GUIDANCE_TOPICS[0]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const tooShort = message.trim().length < MESSAGE_MIN;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !sending && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, sending]);

  const submit = (e) => {
    e.preventDefault();
    if (tooShort) return;
    setSending(true);
    // Small delay so the send feels real in the demo
    setTimeout(() => onSend({ topic, message }), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#063b30]/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-title"
        className="animate-pop w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(6,59,48,0.45)] max-h-[92vh] flex flex-col overflow-hidden"
      >
        <header className="relative bg-[#02c39a] text-white px-5 sm:px-6 py-5">
          <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/60" />
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#02c39a] font-bold flex items-center justify-center shrink-0">
              {getInitials(mentor.name)}
            </div>
            <div>
              <h2 id="ask-title" className="text-lg font-bold">Ask {mentor.name.split(' ')[0]} for guidance</h2>
              <p className="text-xs text-white/85">
                {mentor.shortUni} · {mentor.program}
              </p>
            </div>
          </div>
        </header>

        <form onSubmit={submit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#063b30]/80 mb-2">What do you need help with?</p>
              <div className="flex flex-wrap gap-2">
                {GUIDANCE_TOPICS.map((t) => {
                  const active = topic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-[#02c39a] border-[#02c39a] text-white'
                          : 'bg-white border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="ask-message" className="block text-xs font-semibold text-[#063b30]/80 mb-2">
                Your question
              </label>
              <textarea
                id="ask-message"
                rows={5}
                maxLength={MESSAGE_MAX}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell your mentor about yourself and what you want to know. For example: I am in Class 10 in Minapin and want to become an engineer. How should I prepare for ECAT?"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#02c39a]/25 text-sm text-[#063b30] placeholder:text-[#063b30]/35 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 resize-none leading-relaxed transition-all"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[#063b30]/45">
                <span>{tooShort ? `At least ${MESSAGE_MIN} characters` : 'Looks good'}</span>
                <span>
                  {message.length} / {MESSAGE_MAX}
                </span>
              </div>
            </div>

            <p className="flex items-start gap-2 p-3 rounded-xl bg-[#02c39a]/5 text-xs text-[#063b30]/70">
              <Sparkles className="w-4 h-4 text-[#02c39a] shrink-0" />
              You can write in English or Urdu. {mentor.name.split(' ')[0]} also speaks {mentor.languages.filter((l) => l !== 'English' && l !== 'Urdu').join(' and ') || 'Urdu'}.
            </p>
          </div>

          <footer className="border-t border-[#02c39a]/15 px-5 sm:px-6 py-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-5 py-3 rounded-2xl text-sm font-semibold text-[#063b30]/70 border border-[#02c39a]/25 hover:border-[#02c39a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tooShort || sending}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending' : 'Send'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
   Mentor card
   ============================================================================ */
const MentorCard = ({ mentor, recommended, onAsk }) => (
  <article
    className={`relative p-5 sm:p-6 rounded-3xl border bg-white flex flex-col gap-4 transition-all hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.3)] ${
      recommended ? 'border-[#02c39a]' : 'border-[#02c39a]/15 hover:border-[#02c39a]/45'
    }`}
  >
    {recommended && (
      <span className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-[#02c39a] text-white text-[10px] font-bold tracking-wide flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> RECOMMENDED FOR YOU
      </span>
    )}

    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#02c39a] text-white text-lg font-bold flex items-center justify-center shrink-0">
        {getInitials(mentor.name)}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-base text-[#063b30]">{mentor.name}</h3>
        <p className="text-xs font-medium text-[#063b30]/60 truncate">{mentor.university}</p>
        <p className="text-xs text-[#063b30]/50 truncate">{mentor.program}</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-[#063b30]/65">
      <span className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-[#02c39a]" /> {mentor.hometown}
      </span>
      <span className="flex items-center gap-1.5">
        <Languages className="w-3.5 h-3.5 text-[#02c39a]" /> {mentor.languages.join(', ')}
      </span>
    </div>

    <p className="relative pl-6 text-sm italic text-[#063b30]/70 leading-relaxed">
      <Quote className="absolute left-0 top-0.5 w-4 h-4 text-[#02c39a]/50" />
      {mentor.bio}
    </p>

    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#063b30]/45 mb-2">Can help with</p>
      <ul className="space-y-1.5">
        {mentor.helpsWith.map((h) => (
          <li key={h} className="flex items-start gap-2 text-xs text-[#063b30]/75">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#02c39a] shrink-0 mt-0.5" />
            {h}
          </li>
        ))}
      </ul>
    </div>

    <button
      type="button"
      onClick={() => onAsk(mentor)}
      className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold bg-[#02c39a] text-white hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
    >
      <MessageCircle className="w-4 h-4" />
      Ask for guidance
    </button>
  </article>
);

/* ============================================================================
   Conversation (student side)
   ============================================================================ */
const Conversation = ({ request }) => {
  const mentor = MENTORS.find((m) => m.id === request.mentorId);
  const answered = request.status === 'answered';
  const isNew = answered && !request.seenByStudent;

  return (
    <article className={`p-5 sm:p-6 rounded-3xl border bg-white ${isNew ? 'border-[#02c39a]' : 'border-[#02c39a]/15'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#02c39a]/10 text-[#02c39a] text-xs font-bold flex items-center justify-center shrink-0">
            {getInitials(mentor?.name)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#063b30] truncate">{mentor?.name || 'Mentor'}</p>
            <p className="text-xs text-[#063b30]/50">
              {request.topic} · {timeAgo(request.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
            answered ? 'bg-[#02c39a] text-white' : 'border border-[#02c39a]/25 text-[#063b30]/60'
          }`}
        >
          {answered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {isNew ? 'New reply' : answered ? 'Answered' : 'Waiting for reply'}
        </span>
      </div>

      {/* Student message */}
      <div className="ml-auto max-w-[90%] sm:max-w-[80%] p-4 rounded-2xl rounded-tr-md bg-[#02c39a]/10 text-sm text-[#063b30] leading-relaxed">
        {request.message}
      </div>

      {/* Mentor reply */}
      {answered && (
        <div className="mt-3 max-w-[90%] sm:max-w-[80%]">
          <div className="p-4 rounded-2xl rounded-tl-md bg-white border border-[#02c39a]/25 text-sm text-[#063b30] leading-relaxed">
            {request.reply}
          </div>
          <p className="mt-1 ml-1 text-[11px] text-[#063b30]/45">
            {mentor?.name?.split(' ')[0]} replied {timeAgo(request.repliedAt)}
          </p>
        </div>
      )}
    </article>
  );
};

/* ============================================================================
   Inbox item (mentor side)
   ============================================================================ */
const InboxItem = ({ request, onReply }) => {
  const [reply, setReply] = useState('');
  const answered = request.status === 'answered';
  const levelLabel = LEVELS.find((l) => l.id === request.studentLevel)?.label;

  const send = (e) => {
    e.preventDefault();
    if (reply.trim().length < 5) return;
    onReply(request.id, reply);
    setReply('');
  };

  return (
    <article className={`p-5 sm:p-6 rounded-3xl border bg-white ${answered ? 'border-[#02c39a]/15' : 'border-[#02c39a]'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#02c39a] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {getInitials(request.studentName)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[#063b30] truncate">{request.studentName}</p>
            <p className="text-xs text-[#063b30]/50">
              {levelLabel ? `${levelLabel} · ` : ''}
              {timeAgo(request.createdAt)}
            </p>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
          {request.topic}
        </span>
      </div>

      <p className="text-sm text-[#063b30]/85 leading-relaxed">{request.message}</p>

      {answered ? (
        <div className="mt-4 pt-4 border-t border-[#02c39a]/10 flex gap-2">
          <CornerDownRight className="w-4 h-4 text-[#02c39a] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#063b30]/75 leading-relaxed">{request.reply}</p>
            <p className="mt-1 text-[11px] text-[#063b30]/45">You replied {timeAgo(request.repliedAt)}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={send} className="mt-4 pt-4 border-t border-[#02c39a]/10 space-y-2">
          <textarea
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={`Write your reply to ${request.studentName.split(' ')[0]}...`}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#02c39a]/25 text-sm text-[#063b30] placeholder:text-[#063b30]/35 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 resize-none transition-all"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={reply.trim().length < 5}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send reply
            </button>
          </div>
        </form>
      )}
    </article>
  );
};

/* ============================================================================
   Page
   ============================================================================ */
export const Mentors = ({ onNavigate = () => {} }) => {
  const { user, triggerToast } = useAuth();
  const {
    getProfile,
    sendRequest,
    replyToRequest,
    requestsForStudent,
    requestsForMentor,
    unreadReplies,
    markRepliesSeen,
  } = useGrowth();

  const isTeacher = user?.role === 'teacher';

  /* ------------------------------- Mentor view ------------------------------ */
  const mentorId = resolveMentorId(user);
  const [inboxFilter, setInboxFilter] = useState('pending');

  if (isTeacher) {
    const all = requestsForMentor(mentorId);
    const pending = all.filter((r) => r.status === 'pending');
    const answered = all.filter((r) => r.status === 'answered');
    const shown = inboxFilter === 'pending' ? pending : inboxFilter === 'answered' ? answered : all;

    const handleReply = (id, text) => {
      replyToRequest(id, text);
      triggerToast('Reply sent. The student will see it right away.');
    };

    return (
      <div className="space-y-8 pb-16 bg-white">
        <Hero
          badge="Mentoring Inbox"
          title="Students are waiting for your guidance"
          text="Answer questions from students in Nagar Valley. A few honest lines from you can change a student’s whole direction."
          stats={[
            { value: all.length, label: 'Total' },
            { value: answered.length, label: 'Answered' },
            { value: pending.length, label: 'Waiting' },
          ]}
        />

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            ['pending', `Waiting (${pending.length})`],
            ['answered', `Answered (${answered.length})`],
            ['all', 'All'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setInboxFilter(id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                inboxFilter === id
                  ? 'bg-[#02c39a] border-[#02c39a] text-white'
                  : 'bg-white border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
              <Inbox className="w-7 h-7 text-[#02c39a]" />
            </div>
            <h3 className="text-lg font-bold text-[#063b30] mb-2">
              {inboxFilter === 'pending' ? 'All caught up' : 'No messages yet'}
            </h3>
            <p className="text-sm text-[#063b30]/60">New questions from students will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((r) => (
              <InboxItem key={r.id} request={r} onReply={handleReply} />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------ Student view ------------------------------ */
  return (
    <StudentMentors
      user={user}
      profile={getProfile(user?.uid)}
      sendRequest={sendRequest}
      requestsForStudent={requestsForStudent}
      unreadReplies={unreadReplies}
      markRepliesSeen={markRepliesSeen}
      triggerToast={triggerToast}
      onNavigate={onNavigate}
    />
  );
};

const StudentMentors = ({
  user,
  profile,
  sendRequest,
  requestsForStudent,
  unreadReplies,
  markRepliesSeen,
  triggerToast,
  onNavigate,
}) => {
  const [tab, setTab] = useState('find');
  const [search, setSearch] = useState('');
  const [interest, setInterest] = useState('all');
  const [askMentor, setAskMentor] = useState(null);

  const myInterests = profile?.interests || [];
  const myRequests = requestsForStudent(user?.uid);
  const unread = unreadReplies(user?.uid);
  const fromNagar = MENTORS.filter((m) => m.hometown.includes('Nagar')).length;

  // Mark replies as seen when the student opens their conversations
  useEffect(() => {
    if (tab === 'mine' && user && unread > 0) markRepliesSeen(user.uid);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const mentors = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MENTORS.map((m) => ({
      ...m,
      score: m.interests.filter((i) => myInterests.includes(i)).length,
    }))
      .filter((m) => interest === 'all' || m.interests.includes(interest))
      .filter(
        (m) =>
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.university.toLowerCase().includes(q) ||
          m.hometown.toLowerCase().includes(q) ||
          m.helpsWith.some((h) => h.toLowerCase().includes(q))
      )
      .sort((a, b) => b.score - a.score);
  }, [search, interest, myInterests]);

  const handleAsk = (mentor) => {
    if (!user) {
      triggerToast('Sign in to ask a mentor for guidance.', 'info');
      onNavigate('auth');
      return;
    }
    setAskMentor(mentor);
  };

  const handleSend = ({ topic, message }) => {
    sendRequest({ student: user, level: profile?.level, mentorId: askMentor.id, topic, message });
    triggerToast(`Question sent to ${askMentor.name.split(' ')[0]}. You’ll see the reply here.`);
    setAskMentor(null);
    setTab('mine');
  };

  return (
    <div className="space-y-8 pb-16 bg-white">
      <Hero
        badge="Mentors"
        title="Talk to someone who has been there"
        text="University students from Nagar and across Pakistan who want to help you choose your stream, prepare for tests and apply for scholarships."
        stats={[
          { value: MENTORS.length, label: 'Mentors' },
          { value: fromNagar, label: 'From Nagar' },
          { value: 'Free', label: 'Always' },
        ]}
      />

      {/* Tabs */}
      <div role="tablist" className="grid grid-cols-2 sm:inline-grid p-1 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/15">
        {[
          ['find', 'Find a mentor', null],
          ['mine', 'My questions', unread],
        ].map(([id, label, badge]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === id ? 'bg-[#02c39a] text-white shadow-sm' : 'text-[#063b30]/60 hover:text-[#02c39a]'
            }`}
          >
            {label}
            {badge > 0 && (
              <span
                className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  tab === id ? 'bg-white text-[#02c39a]' : 'bg-[#02c39a] text-white'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'find' ? (
        <>
          {/* Filters */}
          <section className="space-y-4">
            <div className="relative md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#02c39a]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, university, village or topic"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#02c39a]/25 text-sm font-medium text-[#063b30] placeholder:text-[#063b30]/40 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[{ id: 'all', label: 'All mentors' }, ...INTERESTS].map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setInterest(i.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                    interest === i.id
                      ? 'bg-[#02c39a] border-[#02c39a] text-white'
                      : 'bg-white border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a] hover:text-[#02c39a]'
                  }`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </section>

          {mentors.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
              <Search className="w-8 h-8 text-[#02c39a] mx-auto mb-3" />
              <p className="text-sm text-[#063b30]/60 mb-4">No mentors match your search.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setInterest('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold"
              >
                Show all mentors
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {mentors.map((m, i) => (
                <MentorCard
                  key={m.id}
                  mentor={m}
                  recommended={i === 0 && m.score > 0 && interest === 'all' && !search}
                  onAsk={handleAsk}
                />
              ))}
            </section>
          )}
        </>
      ) : (
        <section className="space-y-4">
          {!user ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
              <MessageCircle className="w-8 h-8 text-[#02c39a] mx-auto mb-3" />
              <p className="text-sm text-[#063b30]/60 mb-4">Sign in to see your questions and replies.</p>
              <button
                type="button"
                onClick={() => onNavigate('auth')}
                className="px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold"
              >
                Sign In
              </button>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-[#02c39a]" />
              </div>
              <h3 className="text-lg font-bold text-[#063b30] mb-2">No questions yet</h3>
              <p className="text-sm text-[#063b30]/60 max-w-sm mx-auto mb-6">
                Ask a mentor about your stream, entry tests or scholarships. There are no silly questions.
              </p>
              <button
                type="button"
                onClick={() => setTab('find')}
                className="px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold"
              >
                Find a mentor
              </button>
            </div>
          ) : (
            myRequests.map((r) => <Conversation key={r.id} request={r} />)
          )}
        </section>
      )}

      {askMentor && <AskModal mentor={askMentor} onClose={() => setAskMentor(null)} onSend={handleSend} />}
    </div>
  );
};
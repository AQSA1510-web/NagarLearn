import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useGrowth,
  OPPORTUNITIES,
  OPPORTUNITY_TYPES,
  INTERESTS,
  getDeadlineInfo,
  levelGroup,
} from '../context/GrowthContext';
import {
  Award,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Wallet,
  Clock,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Timer,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const LAST_CHECKED = '27 September 2026';

const LEVEL_FILTERS = [
  { id: 'all', label: 'All levels' },
  { id: 'school', label: 'School (Class 8 to 12)' },
  { id: 'undergrad', label: 'University students' },
  { id: 'graduate', label: 'Graduates' },
];

const TONE_STYLES = {
  urgent: 'bg-[#02c39a] text-white',
  open: 'bg-[#02c39a]/10 text-[#02c39a]',
  rolling: 'bg-[#02c39a]/10 text-[#02c39a]',
  upcoming: 'border border-[#02c39a]/25 text-[#063b30]/60',
  closed: 'bg-[#063b30]/5 text-[#063b30]/50',
};

// Re-renders every minute so countdowns stay live
const useNow = (interval = 60000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
};

const countdownParts = (deadline, now) => {
  const end = new Date(`${deadline}T23:59:59`);
  const ms = Math.max(0, end - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return { days, hours, minutes };
};

export const Opportunities = ({ onNavigate = () => {} }) => {
  const { user, triggerToast } = useAuth();
  const { getProfile, isSaved, toggleSaved, savedFor } = useGrowth();
  const now = useNow();

  const profile = getProfile(user?.uid);
  const myGroup = levelGroup(profile?.level);
  const myInterests = profile?.interests || [];

  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [level, setLevel] = useState(myGroup || 'all');
  const [showClosed, setShowClosed] = useState(true);

  const enriched = useMemo(
    () =>
      OPPORTUNITIES.map((o) => ({
        ...o,
        deadlineInfo: getDeadlineInfo(o, now),
        matchesMe:
          myInterests.length > 0 &&
          (o.interests.includes('all') || o.interests.some((i) => myInterests.includes(i))) &&
          (!myGroup || o.levels.includes(myGroup)),
      })),
    [now, myInterests, myGroup]
  );

  const savedIds = savedFor(user?.uid);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched
      .filter((o) => (type === 'Saved' ? savedIds.includes(o.id) : type === 'All' || o.type === type))
      .filter((o) => level === 'all' || o.levels.includes(level))
      .filter((o) => showClosed || o.deadlineInfo.tone !== 'closed')
      .filter(
        (o) =>
          !q ||
          o.title.toLowerCase().includes(q) ||
          o.org.toLowerCase().includes(q) ||
          o.summary.toLowerCase().includes(q) ||
          o.location.toLowerCase().includes(q)
      )
      .sort((a, b) => a.deadlineInfo.sort - b.deadlineInfo.sort);
  }, [enriched, search, type, level, showClosed, savedIds]);

  const openCount = enriched.filter((o) => ['open', 'urgent', 'rolling'].includes(o.deadlineInfo.tone)).length;
  const closingSoon = enriched
    .filter((o) => o.deadlineInfo.tone === 'urgent')
    .sort((a, b) => a.deadlineInfo.sort - b.deadlineInfo.sort);
  const spotlight = closingSoon[0];
  const spotlightTime = spotlight ? countdownParts(spotlight.deadline, now) : null;

  const handleSave = (opp) => {
    if (!user) {
      triggerToast('Sign in to save opportunities.', 'info');
      return;
    }
    const wasSaved = isSaved(user.uid, opp.id);
    toggleSaved(user.uid, opp.id);
    triggerToast(wasSaved ? 'Removed from saved.' : 'Saved. Find it under the Saved filter.', wasSaved ? 'info' : 'success');
  };

  const resetFilters = () => {
    setSearch('');
    setType('All');
    setLevel('all');
    setShowClosed(true);
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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs font-semibold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              Opportunities
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Never miss a deadline again
            </h1>
            <p className="text-sm sm:text-base text-white/90">
              Scholarships, exchanges, fellowships and internships for students from Nagar, with
              live deadlines and mentors who can help you apply.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto">
            {[
              { value: openCount, label: 'Open now' },
              { value: closingSoon.length, label: 'This week' },
              { value: savedIds.length, label: 'Saved', light: true },
            ].map((s) => (
              <div
                key={s.label}
                className={`px-3 sm:px-5 py-3 rounded-2xl text-center ${
                  s.light ? 'bg-white text-[#02c39a]' : 'bg-white/15 border border-white/25'
                }`}
              >
                <p className="text-xl sm:text-2xl font-extrabold">{s.value}</p>
                <p className={`text-[10px] uppercase font-semibold tracking-wide ${s.light ? 'text-[#02c39a]/80' : 'text-white/80'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing soon spotlight */}
      {spotlight && (
        <section className="relative overflow-hidden p-5 sm:p-6 rounded-3xl border-2 border-[#02c39a] bg-[#02c39a]/5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#02c39a] text-white flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#02c39a]">Closing soon</p>
              <h2 className="text-lg sm:text-xl font-bold text-[#063b30]">{spotlight.title}</h2>
              <p className="text-sm text-[#063b30]/60">
                {spotlight.org} · Deadline {spotlight.deadlineInfo.detail}
                {spotlight.deadlineNote ? `, ${spotlight.deadlineNote}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-2" aria-label="Time remaining">
              {[
                [spotlightTime.days, 'Days'],
                [spotlightTime.hours, 'Hours'],
                [spotlightTime.minutes, 'Mins'],
              ].map(([value, label]) => (
                <div key={label} className="w-16 py-2 rounded-xl bg-white border border-[#02c39a]/25 text-center">
                  <p className="text-xl font-extrabold text-[#063b30] tabular-nums">{String(value).padStart(2, '0')}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#063b30]/45">{label}</p>
                </div>
              ))}
            </div>
            {spotlight.url && (
              <a
                href={spotlight.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
              >
                Apply now
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#02c39a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organisation or country"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#02c39a]/25 text-sm font-medium text-[#063b30] placeholder:text-[#063b30]/40 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#02c39a] shrink-0" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-white border border-[#02c39a]/25 text-sm font-semibold text-[#063b30] focus:outline-none focus:border-[#02c39a] cursor-pointer"
            >
              {LEVEL_FILTERS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                  {l.id === myGroup ? ' (my level)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', ...OPPORTUNITY_TYPES, 'Saved'].map((t) => {
              const active = type === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-[#02c39a] border-[#02c39a] text-white'
                      : 'bg-white border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a] hover:text-[#02c39a]'
                  }`}
                >
                  {t === 'Saved' && <Bookmark className="w-3.5 h-3.5" />}
                  {t === 'All' ? 'All types' : t}
                  {t === 'Saved' && savedIds.length > 0 && ` (${savedIds.length})`}
                </button>
              );
            })}
          </div>

          <label className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#063b30]/60 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(e) => setShowClosed(e.target.checked)}
              className="w-4 h-4 accent-[#02c39a]"
            />
            Show closed
          </label>
        </div>
      </section>

      {/* List */}
      {filtered.length === 0 ? (
        <section className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
            {type === 'Saved' ? <Bookmark className="w-7 h-7 text-[#02c39a]" /> : <Search className="w-7 h-7 text-[#02c39a]" />}
          </div>
          <h3 className="text-lg font-bold text-[#063b30] mb-2">
            {type === 'Saved' ? 'Nothing saved yet' : 'No opportunities found'}
          </h3>
          <p className="text-sm text-[#063b30]/60 max-w-sm mx-auto mb-6">
            {type === 'Saved'
              ? 'Tap the bookmark on any opportunity to keep it here.'
              : 'Try a different search or change the filters.'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90"
          >
            Show all opportunities
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {filtered.map((o) => {
            const info = o.deadlineInfo;
            const closed = info.tone === 'closed';
            const saved = isSaved(user?.uid, o.id);
            const tags = o.interests.includes('all')
              ? []
              : o.interests.map((id) => INTERESTS.find((i) => i.id === id)?.label).filter(Boolean);

            return (
              <article
                key={o.id}
                className={`relative p-5 sm:p-6 rounded-3xl border bg-white flex flex-col gap-4 transition-all ${
                  closed
                    ? 'border-[#02c39a]/10'
                    : 'border-[#02c39a]/15 hover:border-[#02c39a]/45 hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.3)]'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#02c39a]/10 text-[#02c39a]">
                      {o.type}
                    </span>
                    {o.matchesMe && !closed && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold border border-[#02c39a] text-[#02c39a] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Matches you
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave(o)}
                    aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
                    aria-pressed={saved}
                    className={`shrink-0 p-2 rounded-xl transition-colors ${
                      saved ? 'bg-[#02c39a] text-white' : 'text-[#063b30]/40 hover:text-[#02c39a] hover:bg-[#02c39a]/5'
                    }`}
                  >
                    {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                </div>

                {/* Title */}
                <div className={closed ? 'opacity-60' : ''}>
                  <h3 className="text-lg font-bold text-[#063b30] leading-snug">{o.title}</h3>
                  <p className="text-sm text-[#063b30]/55">{o.org}</p>
                  <p className="text-sm text-[#063b30]/75 mt-3 leading-relaxed">{o.summary}</p>
                </div>

                {/* Facts */}
                <div className={`flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#063b30]/65 ${closed ? 'opacity-60' : ''}`}>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-[#02c39a]" /> {o.funding}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#02c39a]" /> {o.location}
                  </span>
                </div>

                {/* Eligibility */}
                {o.eligibility?.length > 0 && (
                  <ul className={`space-y-1.5 ${closed ? 'opacity-60' : ''}`}>
                    {o.eligibility.map((e) => (
                      <li key={e} className="flex items-start gap-2 text-xs text-[#063b30]/70">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#02c39a] shrink-0 mt-0.5" />
                        {e}
                      </li>
                    ))}
                  </ul>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#02c39a]/5 text-[#063b30]/55">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deadline + actions */}
                <div className="mt-auto pt-4 border-t border-[#02c39a]/10 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${TONE_STYLES[info.tone]}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {info.label}
                    </span>
                    {info.detail && (
                      <span className="text-xs text-[#063b30]/55 pt-1.5 leading-snug">
                        {info.detail}
                        {o.deadlineNote && !closed ? `, ${o.deadlineNote}` : ''}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {o.url ? (
                      <a
                        href={o.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                          closed
                            ? 'border border-[#02c39a]/25 text-[#063b30]/70 hover:border-[#02c39a]'
                            : 'bg-[#02c39a] text-white hover:bg-[#02c39a]/90'
                        }`}
                      >
                        {closed ? 'Official site' : info.tone === 'upcoming' ? 'Get notified' : 'Apply now'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[#063b30]/45 bg-[#02c39a]/5">
                        <Info className="w-3.5 h-3.5" /> Link coming soon
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigate('mentors')}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#02c39a] border border-[#02c39a]/40 hover:border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Ask a mentor
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Trust note */}
      <p className="flex items-start sm:items-center justify-center gap-2 text-center text-xs text-[#063b30]/50">
        <Info className="w-4 h-4 text-[#02c39a] shrink-0" />
        Details checked on {LAST_CHECKED}. Always confirm deadlines on the official website before applying.
      </p>
    </div>
  );
};
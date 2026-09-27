import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useGrowth,
  LEVELS,
  INTERESTS,
  matchCareers,
  matchMentors,
  matchOpportunities,
} from '../context/GrowthContext';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  MapPin,
  Laptop,
  GraduationCap,
  BookOpen,
  Target,
  MessageCircle,
  Award,
  Pencil,
  Sparkles,
  Clock,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const MAX_INTERESTS = 4;

const TONE_STYLES = {
  urgent: 'bg-[#02c39a] text-white',
  open: 'bg-[#02c39a]/10 text-[#02c39a]',
  rolling: 'bg-[#02c39a]/10 text-[#02c39a]',
  upcoming: 'border border-[#02c39a]/25 text-[#063b30]/60',
  closed: 'bg-[#063b30]/5 text-[#063b30]/50',
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'M';

const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
    <h2 className="text-lg sm:text-xl font-bold text-[#063b30] flex items-center gap-3">
      <span className="w-9 h-9 rounded-xl bg-[#02c39a]/10 text-[#02c39a] flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>
      {title}
    </h2>
    {action}
  </div>
);

export const Discover = ({ onNavigate = () => {} }) => {
  const { user, triggerToast } = useAuth();
  const { getProfile, saveProfile } = useGrowth();

  const saved = getProfile(user?.uid);
  const [step, setStep] = useState(saved ? 2 : 0);
  const [level, setLevel] = useState(saved?.level || null);
  const [interests, setInterests] = useState(saved?.interests || []);

  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const careers = useMemo(() => matchCareers(interests).slice(0, 6), [interests]);
  const mentors = useMemo(
    () => matchMentors(interests).filter((m) => m.score > 0).slice(0, 3),
    [interests]
  );
  const opportunities = useMemo(
    () => matchOpportunities(interests, level).filter((o) => o.deadlineInfo.tone !== 'closed').slice(0, 3),
    [interests, level]
  );

  const toggleInterest = (id) => {
    setInterests((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, id];
    });
  };

  const finish = () => {
    if (user) {
      saveProfile(user.uid, { level, interests, completedAt: new Date().toISOString() });
      triggerToast('Your path is ready.');
    }
    setStep(2);
  };

  const levelLabel = LEVELS.find((l) => l.id === level)?.label;
  const progress = step === 0 ? 33 : step === 1 ? 66 : 100;

  /* ---------------------------------------------------------------------- */
  /* Steps 1 and 2: choose level and interests                              */
  /* ---------------------------------------------------------------------- */
  if (step < 2) {
    return (
      <div className="pb-16 bg-white">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#02c39a] text-white flex items-center justify-center shadow-[0_12px_30px_-12px_rgba(2,195,154,0.9)]">
              <Compass className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-[#02c39a]">Assalam o Alaikum, {firstName}</p>
            <h1 className="mt-1 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#063b30]">
              Let’s discover your path
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#063b30]/60">
              Answer two quick questions. We’ll show you careers, mentors and opportunities made for you.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#063b30]/50 mb-2">
              <span>Step {step + 1} of 2</span>
              <span>{step === 0 ? 'Your class' : 'Your interests'}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#02c39a]/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#02c39a] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 && (
            <section key="level" className="animate-pop">
              <h2 className="text-lg font-bold text-[#063b30] mb-4">Where are you in your studies?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LEVELS.map((l) => {
                  const active = level === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLevel(l.id)}
                      aria-pressed={active}
                      className={`relative text-left p-5 rounded-2xl border transition-all ${
                        active
                          ? 'border-[#02c39a] bg-[#02c39a]/5 ring-4 ring-[#02c39a]/10'
                          : 'border-[#02c39a]/20 hover:border-[#02c39a]/60'
                      }`}
                    >
                      <span className="block text-base font-bold text-[#063b30]">{l.label}</span>
                      <span className="block text-sm text-[#063b30]/55 mt-0.5">{l.hint}</span>
                      {active && (
                        <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#02c39a] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={!level}
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          {step === 1 && (
            <section key="interests" className="animate-pop">
              <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                <h2 className="text-lg font-bold text-[#063b30]">What are you interested in?</h2>
                <span className="text-xs font-semibold text-[#063b30]/50">
                  {interests.length} of {MAX_INTERESTS} selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERESTS.map(({ id, label, icon: Icon }) => {
                  const active = interests.includes(id);
                  const disabled = !active && interests.length >= MAX_INTERESTS;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleInterest(id)}
                      disabled={disabled}
                      aria-pressed={active}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                        active
                          ? 'border-[#02c39a] bg-[#02c39a]/5 ring-4 ring-[#02c39a]/10'
                          : disabled
                          ? 'border-[#02c39a]/10 opacity-40 cursor-not-allowed'
                          : 'border-[#02c39a]/20 hover:border-[#02c39a]/60'
                      }`}
                    >
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          active ? 'bg-[#02c39a] text-white' : 'bg-[#02c39a]/10 text-[#02c39a]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-semibold text-[#063b30] leading-snug">{label}</span>
                      {active && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#02c39a] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid grid-cols-2 sm:flex sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-[#063b30]/70 border border-[#02c39a]/25 hover:border-[#02c39a] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={interests.length === 0}
                  onClick={finish}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-all disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Show my path
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Step 3: results                                                         */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="space-y-10 pb-16 bg-white animate-pop">

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
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs font-semibold tracking-wide uppercase">
              <Target className="w-3.5 h-3.5" />
              Your Path
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {firstName}, here’s where you can go
            </h1>
            <div className="flex flex-wrap gap-2 pt-1">
              {levelLabel && (
                <span className="px-3 py-1 rounded-full bg-white text-[#02c39a] text-xs font-semibold">
                  {levelLabel}
                </span>
              )}
              {interests.map((id) => (
                <span key={id} className="px-3 py-1 rounded-full bg-white/15 border border-white/30 text-xs font-semibold">
                  {INTERESTS.find((i) => i.id === id)?.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(0)}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/15 border border-white/30 text-sm font-semibold hover:bg-white/25 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit my interests
          </button>
        </div>
      </section>

      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/20">
          <p className="text-sm text-[#063b30]">Sign in to save your path and ask mentors for guidance.</p>
          <button
            type="button"
            onClick={() => onNavigate('auth')}
            className="px-5 py-2.5 rounded-xl bg-[#02c39a] text-white text-sm font-semibold hover:bg-[#02c39a]/90"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Careers */}
      <section>
        <SectionTitle
          icon={GraduationCap}
          title="Careers you can pursue"
          action={
            <button
              type="button"
              onClick={() => onNavigate('careers')}
              className="text-sm font-semibold text-[#02c39a] hover:underline flex items-center gap-1"
            >
              Full career guide <ArrowRight className="w-4 h-4" />
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((career, i) => {
            const Icon = career.icon;
            return (
              <article
                key={career.id}
                className={`p-5 rounded-3xl border bg-white flex flex-col gap-4 transition-all hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.3)] ${
                  i === 0 ? 'border-[#02c39a]' : 'border-[#02c39a]/15 hover:border-[#02c39a]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#02c39a] text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {i === 0 && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#02c39a] text-white">
                        BEST MATCH
                      </span>
                    )}
                    {career.remote && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#02c39a]/10 text-[#02c39a] flex items-center gap-1">
                        <Laptop className="w-3 h-3" /> Work from Nagar
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#063b30]">{career.title}</h3>
                  <p className="text-sm text-[#063b30]/65 mt-1 leading-relaxed">{career.summary}</p>
                </div>

                <dl className="space-y-2 text-xs mt-auto pt-4 border-t border-[#02c39a]/10">
                  {[
                    ['Stream', career.stream],
                    ['Degree', career.degree],
                    ['Test', career.entryTest],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="w-14 shrink-0 font-semibold text-[#063b30]/45">{label}</dt>
                      <dd className="font-medium text-[#063b30]/80">{value}</dd>
                    </div>
                  ))}
                  {career.universities.length > 0 && (
                    <div className="flex gap-3">
                      <dt className="w-14 shrink-0 font-semibold text-[#063b30]/45">Where</dt>
                      <dd className="font-medium text-[#063b30]/80">{career.universities.join(', ')}</dd>
                    </div>
                  )}
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      {/* Mentors */}
      {mentors.length > 0 && (
        <section>
          <SectionTitle
            icon={MessageCircle}
            title="Mentors who can guide you"
            action={
              <button
                type="button"
                onClick={() => onNavigate('mentors')}
                className="text-sm font-semibold text-[#02c39a] hover:underline flex items-center gap-1"
              >
                All mentors <ArrowRight className="w-4 h-4" />
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mentors.map((m) => (
              <article key={m.id} className="p-5 rounded-3xl border border-[#02c39a]/15 bg-white flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#02c39a]/10 text-[#02c39a] font-bold flex items-center justify-center shrink-0">
                    {getInitials(m.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-[#063b30] truncate">{m.name}</h3>
                    <p className="text-xs text-[#063b30]/55 truncate">
                      {m.shortUni} · {m.program}
                    </p>
                    <p className="text-[11px] text-[#02c39a] font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {m.hometown}
                    </p>
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {m.helpsWith.slice(0, 2).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-[#063b30]/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#02c39a] shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onNavigate('mentors')}
                  className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#02c39a] border border-[#02c39a] hover:bg-[#02c39a] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask for guidance
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section>
          <SectionTitle
            icon={Award}
            title="Opportunities for you"
            action={
              <button
                type="button"
                onClick={() => onNavigate('opportunities')}
                className="text-sm font-semibold text-[#02c39a] hover:underline flex items-center gap-1"
              >
                See all <ArrowRight className="w-4 h-4" />
              </button>
            }
          />

          <div className="space-y-3">
            {opportunities.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onNavigate('opportunities')}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border border-[#02c39a]/15 hover:border-[#02c39a]/50 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#02c39a]">{o.type}</span>
                    <span className="text-[10px] text-[#063b30]/40">·</span>
                    <span className="text-[11px] font-medium text-[#063b30]/55">{o.funding}</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#063b30]">{o.title}</h3>
                  <p className="text-xs text-[#063b30]/55">{o.org}</p>
                </div>
                <span
                  className={`self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${TONE_STYLES[o.deadlineInfo.tone]}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {o.deadlineInfo.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Next step */}
      <section className="p-6 sm:p-8 rounded-3xl border border-dashed border-[#02c39a]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-[#063b30]">Start building your skills today</h3>
          <p className="text-sm text-[#063b30]/60 mt-1">
            Join a free live class with university mentors and earn XP as you learn.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('classes')}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Browse classes
        </button>
      </section>
    </div>
  );
};
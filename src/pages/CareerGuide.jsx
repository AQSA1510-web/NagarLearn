import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Compass,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  ArrowRight,
  Wallet,
  Code2,
  Palette,
  Megaphone,
  Stethoscope,
  GraduationCap,
  Mountain,
  Landmark,
  Wrench,
  Calculator,
  Leaf,
  Laptop,
  Briefcase,
  Camera,
  PenTool,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

// Picks a clean icon for each career from its title/category,
// so emoji icons in initialData are never shown.
const ICON_RULES = [
  [/web|software|develop|program|cod|data|ai|cyber|it\b|computer/i, Code2],
  [/freelanc|remote|virtual/i, Laptop],
  [/design|graphic|ui|ux|art/i, Palette],
  [/market|social media|seo|content|brand/i, Megaphone],
  [/writ|journal|blog|copy/i, PenTool],
  [/photo|video|film|media/i, Camera],
  [/doctor|medic|nurs|health|pharma/i, Stethoscope],
  [/teach|educat|tutor|lectur/i, GraduationCap],
  [/touris|travel|guide|hotel|hospitality|trek/i, Mountain],
  [/civil service|css|government|public|law|polic|army|forces/i, Landmark],
  [/engineer|mechan|electric|technician/i, Wrench],
  [/account|financ|bank|business|commerce/i, Calculator],
  [/agri|farm|environment|forest|climate/i, Leaf],
];

const getCareerIcon = (career) => {
  const text = `${career?.title || ''} ${career?.category || ''}`;
  const match = ICON_RULES.find(([pattern]) => pattern.test(text));
  return match ? match[1] : Briefcase;
};

export const CareerGuide = ({ onNavigateToClasses }) => {
  const { careerPaths = [] } = useData();
  const [selectedId, setSelectedId] = useState(careerPaths[0]?.id);

  const selectedCareer = careerPaths.find((c) => c.id === selectedId) || careerPaths[0];
  const SelectedIcon = getCareerIcon(selectedCareer);

  const skills = selectedCareer?.skills || [];
  const recommended = selectedCareer?.recommendedClasses || [];
  const steps = selectedCareer?.steps || [];
  const resources = selectedCareer?.resources || [];

  return (
    <div className="space-y-8 sm:space-y-10 pb-16 bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#02c39a] text-white p-6 sm:p-12 shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <svg
          className="absolute bottom-0 left-0 w-full h-28 sm:h-36 pointer-events-none"
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

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Nagar Career Pathways</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover your{' '}
            <span className="relative inline-block">
              future career
              <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full bg-white/60" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
            Explore careers you can build from Nagar Valley. See the skills you need, what you
            can earn, and which NagarLearn classes help you get there.
          </p>
        </div>
      </section>

      {careerPaths.length === 0 ? (
        <section className="text-center py-16 px-6 rounded-3xl border border-dashed border-[#02c39a]/40">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#02c39a]/10 flex items-center justify-center">
            <Compass className="w-7 h-7 text-[#02c39a]" />
          </div>
          <h3 className="text-lg font-bold text-[#063b30]">Career paths coming soon</h3>
          <p className="text-sm text-[#063b30]/60 mt-2">Our mentors are preparing career guides.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Selector */}
          <aside className="lg:space-y-3">
            <h2 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-3">
              Choose a career path ({careerPaths.length})
            </h2>

            {/* Mobile: horizontal scroller / Desktop: vertical list */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0 snap-x scrollbar-none">
              {careerPaths.map((item) => {
                const isSelected = selectedCareer?.id === item.id;
                const Icon = getCareerIcon(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={isSelected}
                    className={`snap-start shrink-0 w-64 lg:w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#02c39a]/5 border-[#02c39a] shadow-[0_12px_30px_-18px_rgba(2,195,154,0.9)]'
                        : 'bg-white border-[#02c39a]/15 hover:border-[#02c39a]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#02c39a] text-white' : 'bg-[#02c39a]/10 text-[#02c39a]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#063b30] truncate">{item.title}</h3>
                        <span className="text-[11px] font-medium text-[#063b30]/50">{item.category}</span>
                      </div>
                    </div>
                    <ArrowRight
                      className={`hidden lg:block w-4 h-4 shrink-0 transition-all ${
                        isSelected ? 'text-[#02c39a] translate-x-0.5' : 'text-[#063b30]/20'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Detail */}
          {selectedCareer && (
            <article
              key={selectedCareer.id}
              className="animate-pop lg:col-span-2 bg-white rounded-3xl p-5 sm:p-8 border border-[#02c39a]/15 space-y-7"
            >
              {/* Header */}
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#02c39a]/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#02c39a] text-white flex items-center justify-center shadow-[0_12px_30px_-12px_rgba(2,195,154,0.9)]">
                    <SelectedIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
                      {selectedCareer.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#063b30] mt-1.5 leading-tight">
                      {selectedCareer.title}
                    </h2>
                  </div>
                </div>

                {selectedCareer.salary && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/20">
                    <Wallet className="w-5 h-5 text-[#02c39a] shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold tracking-wider text-[#063b30]/50">
                        Estimated earnings
                      </p>
                      <p className="text-sm font-bold text-[#063b30]">{selectedCareer.salary}</p>
                    </div>
                  </div>
                )}
              </header>

              {/* Summary */}
              <section>
                <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-2">
                  Role summary
                </h4>
                <p className="text-sm text-[#063b30]/80 leading-relaxed">{selectedCareer.description}</p>
              </section>

              {/* Skills */}
              {skills.length > 0 && (
                <section>
                  <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-3">
                    Key skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#02c39a]/25 text-xs font-medium text-[#063b30]/80 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#02c39a]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommended Classes */}
              {recommended.length > 0 && (
                <section className="p-4 sm:p-5 rounded-2xl bg-[#02c39a]/5">
                  <h4 className="text-[11px] font-semibold text-[#02c39a] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Recommended NagarLearn classes
                  </h4>
                  <div className="space-y-2">
                    {recommended.map((className, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#02c39a]/15"
                      >
                        <span className="text-sm font-medium text-[#063b30]">{className}</span>
                        <button
                          type="button"
                          onClick={onNavigateToClasses}
                          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#02c39a] text-white text-[11px] font-semibold hover:bg-[#02c39a]/90 transition-colors"
                        >
                          Find class
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Roadmap */}
              {steps.length > 0 && (
                <section>
                  <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-4">
                    Your roadmap
                  </h4>
                  <ol className="relative">
                    {steps.map((step, i) => {
                      const isLast = i === steps.length - 1;
                      return (
                        <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                          {!isLast && (
                            <span className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-[#02c39a]/20" />
                          )}
                          <span className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-[#02c39a] text-white text-xs font-bold flex items-center justify-center ring-4 ring-white">
                            {i + 1}
                          </span>
                          <p className="text-sm text-[#063b30]/80 leading-relaxed pt-1.5">{step}</p>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              )}

              {/* Resources */}
              {resources.length > 0 && (
                <section className="pt-6 border-t border-[#02c39a]/10">
                  <h4 className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider mb-3">
                    Free learning resources
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-[#02c39a]/20 hover:border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
                      >
                        <span className="text-sm font-medium text-[#063b30] truncate">{res.name}</span>
                        <ExternalLink className="w-4 h-4 shrink-0 text-[#02c39a] opacity-60 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )}
        </div>
      )}
    </div>
  );
};
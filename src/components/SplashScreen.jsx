import React from 'react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

export const SplashScreen = () => {
  return (
    <div
      role="status"
      aria-label="Loading NagarLearn"
      className="min-h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden px-6"
    >
      {/* Soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="nl-glow absolute -top-24 -left-24 w-72 h-72 bg-[#02c39a]/10 rounded-full blur-3xl" />
        <div
          className="nl-glow absolute -bottom-32 -right-24 w-96 h-96 bg-[#02c39a]/10 rounded-full blur-3xl"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Mountain range silhouette (Rakaposhi) */}
      <svg
        className="nl-rise absolute bottom-0 left-0 w-full h-40 sm:h-56 pointer-events-none"
        style={{ animationDelay: '0.3s' }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 L0 150 L160 95 L280 140 L460 45 L560 100 L700 15 L830 110 L960 60 L1080 125 L1200 85 L1200 200 Z"
          fill="#02c39a"
          fillOpacity="0.06"
        />
        <path
          d="M0 200 L0 175 L220 130 L380 165 L600 105 L760 160 L940 120 L1200 170 L1200 200 Z"
          fill="#02c39a"
          fillOpacity="0.09"
        />
      </svg>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Logo tile with self-drawing mountain */}
        <div className="nl-pop w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#02c39a] flex items-center justify-center shadow-[0_20px_50px_-15px_rgba(2,195,154,0.7)]">
          <svg
            className="w-11 h-11 sm:w-14 sm:h-14"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="nl-draw"
              d="M 10 80 L 35 38 L 48 58 L 68 22 L 90 80 Z"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="nl-draw"
              style={{ animationDelay: '0.6s' }}
              d="M 60 36 L 68 22 L 76 36"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          className="nl-rise mt-8 text-5xl sm:text-7xl font-black tracking-tight text-[#063b30]"
          style={{ animationDelay: '0.25s' }}
        >
          Nagar<span className="text-[#02c39a]">Learn</span>
        </h1>

        {/* Divider */}
        <div
          className="nl-grow mt-6 h-1 w-20 bg-[#02c39a] rounded-full"
          style={{ animationDelay: '0.45s' }}
        />

        {/* Mission */}
        <div className="nl-rise mt-6 max-w-md" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg sm:text-xl font-semibold text-[#063b30]">
            An initiative to give back to society
          </p>
          <p className="mt-2 text-sm sm:text-base text-[#063b30]/55">
            Empowering mountain youth through accessible education
          </p>
        </div>

        {/* Loading bar */}
        <div
          className="nl-rise mt-10 w-40 h-1 rounded-full bg-[#02c39a]/15 overflow-hidden"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="nl-load h-full w-1/3 rounded-full bg-[#02c39a]" />
        </div>
      </div>

      {/* Location tag */}
      <p
        className="nl-rise absolute bottom-6 sm:bottom-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#063b30]/45"
        style={{ animationDelay: '1s' }}
      >
        Nagar Valley, Gilgit-Baltistan
      </p>

      {/* Animations (prefixed to avoid clashing with Tailwind's built-ins) */}
      <style>{`
        @keyframes nl-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nl-pop {
          0%   { opacity: 0; transform: scale(0.85); }
          60%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes nl-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes nl-grow {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes nl-load {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes nl-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.08); }
        }

        .nl-rise { opacity: 0; animation: nl-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .nl-pop  { opacity: 0; animation: nl-pop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .nl-grow { opacity: 0; transform-origin: center; animation: nl-grow 0.6s ease-out forwards; }
        .nl-draw { stroke-dasharray: 300; stroke-dashoffset: 300; animation: nl-draw 1.2s ease-out 0.2s forwards; }
        .nl-load { animation: nl-load 1.3s ease-in-out infinite; }
        .nl-glow { animation: nl-glow 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .nl-rise, .nl-pop, .nl-grow { animation: none; opacity: 1; transform: none; }
          .nl-draw { animation: none; stroke-dashoffset: 0; }
          .nl-load, .nl-glow { animation: none; }
        }
      `}</style>
    </div>
  );
};
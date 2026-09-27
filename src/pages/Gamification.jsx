import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Flame,
  Award,
  Trophy,
  Sparkles,
  CheckCircle,
  Lock,
  Star,
  Flag,
  FlaskConical,
  Code2,
  Users,
  Calculator,
  BookOpen,
  Crown,
  TrendingUp,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const XP_PER_LEVEL = 500;

// Clean icons for badges (emoji icons in initialData are never shown)
const BADGE_ICON_RULES = [
  [/first|step|welcome/i, Flag],
  [/streak/i, Flame],
  [/science/i, FlaskConical],
  [/tech|code|computer|wizard/i, Code2],
  [/star/i, Star],
  [/community|mentor|helper/i, Users],
  [/math/i, Calculator],
  [/english|read|writ/i, BookOpen],
];

const getBadgeIcon = (badge) => {
  const text = `${badge?.id || ''} ${badge?.name || ''}`;
  const match = BADGE_ICON_RULES.find(([pattern]) => pattern.test(text));
  return match ? match[1] : Award;
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'S';

const rankStyle = (index) => {
  if (index === 0) return 'bg-[#02c39a] text-white';
  if (index === 1) return 'bg-[#02c39a]/25 text-[#063b30]';
  if (index === 2) return 'bg-[#02c39a]/15 text-[#063b30]';
  return 'bg-white text-[#063b30]/40 border border-[#02c39a]/15';
};

export const Gamification = () => {
  const { user, claimDailyStreak } = useAuth();
  const { badges = [], leaderboard = [] } = useData();

  const userBadges = user?.badges || [];
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const levelPercent = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
  const claimedToday = user?.lastStreakClaim === new Date().toLocaleDateString('en-CA');

  // Live leaderboard: merges the signed-in student's current XP and re-sorts,
  // so enrolling or completing a class moves them up the ranking instantly.
  const board = useMemo(() => {
    const list = leaderboard.map((entry) => ({ ...entry }));

    if (user && user.role !== 'teacher') {
      const me = {
        id: user.uid,
        name: user.displayName,
        school: user.school || 'Nagar Valley',
        xp,
        streak,
        completedCount: (user.completedClasses || []).length,
        isMe: true,
      };
      const idx = list.findIndex((e) => e.name === user.displayName);
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          ...me,
          school: list[idx].school || me.school,
          completedCount: Math.max(list[idx].completedCount || 0, me.completedCount),
        };
      } else {
        list.push(me);
      }
    }

    return list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }, [leaderboard, user, xp, streak]);

  return (
    <div className="space-y-10 pb-16 bg-white">

      {/* Streak + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

        {/* Streak Card */}
        <section className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-[#02c39a] text-white p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-[0_20px_50px_-20px_rgba(2,195,154,0.6)]">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Flame className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Daily Learning Streak</h2>
                <p className="text-xs sm:text-sm text-white/85">Check in every day to keep your streak going.</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-4xl sm:text-5xl font-black leading-none">{streak}</p>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-white/80 mt-1">
                {streak === 1 ? 'Day' : 'Days'}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-white/20">
            <p className="text-xs sm:text-sm text-white/90">
              Each daily check-in earns <span className="font-bold text-white">+50 XP</span> and unlocks
              streak badges.
            </p>

            <button
              type="button"
              onClick={claimDailyStreak}
              disabled={claimedToday}
              className={`w-full sm:w-auto shrink-0 px-6 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                claimedToday
                  ? 'bg-white/20 text-white cursor-default'
                  : 'bg-white text-[#02c39a] shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {claimedToday ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Claimed today
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  Claim today's streak
                </>
              )}
            </button>
          </div>
        </section>

        {/* Progress Card */}
        <section className="rounded-3xl bg-white p-6 border border-[#02c39a]/15 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#063b30]/50 uppercase tracking-wider">
              Your progress
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#02c39a]/10 text-[#02c39a]">
              Level {level}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#02c39a] text-white text-lg font-bold flex items-center justify-center">
              {user ? getInitials(user.displayName) : '?'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-[#063b30] truncate">
                {user?.displayName || 'Guest'}
              </h3>
              <p className="text-sm font-semibold text-[#02c39a] flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {xp} XP
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-[#063b30]/55 mb-1.5">
              <span>Level {level + 1} in {XP_PER_LEVEL - xpIntoLevel} XP</span>
              <span>{levelPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#02c39a]/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#02c39a] transition-all duration-700"
                style={{ width: `${levelPercent}%` }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#02c39a]/10 flex items-center justify-center gap-2 text-sm font-medium text-[#063b30]/70">
            <Award className="w-4 h-4 text-[#02c39a]" />
            {userBadges.length} {userBadges.length === 1 ? 'badge' : 'badges'} unlocked
          </div>
        </section>
      </div>

      {/* Badges */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#063b30] flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#02c39a]" />
            Badges & Achievements
          </h2>
          <span className="text-xs font-semibold text-[#063b30]/55">
            {userBadges.length} of {badges.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = userBadges.includes(badge.id);
            const Icon = getBadgeIcon(badge);

            return (
              <article
                key={badge.id}
                className={`rounded-3xl p-5 border flex items-start gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-white border-[#02c39a]/40 hover:shadow-[0_16px_40px_-20px_rgba(6,59,48,0.3)]'
                    : 'bg-white border-dashed border-[#02c39a]/20'
                }`}
              >
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${
                    isUnlocked ? 'bg-[#02c39a] text-white' : 'bg-[#02c39a]/5 text-[#063b30]/25'
                  }`}
                >
                  {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`font-bold text-sm ${isUnlocked ? 'text-[#063b30]' : 'text-[#063b30]/50'}`}>
                      {badge.name}
                    </h4>
                    {isUnlocked && <CheckCircle className="w-4 h-4 text-[#02c39a]" />}
                  </div>
                  <p className={`text-xs leading-relaxed ${isUnlocked ? 'text-[#063b30]/65' : 'text-[#063b30]/40'}`}>
                    {badge.description}
                  </p>
                  {badge.requirement && (
                    <p className="text-[10px] font-semibold uppercase tracking-wider pt-1 text-[#02c39a]/80">
                      {isUnlocked ? 'Earned' : `To unlock: ${badge.requirement}`}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#063b30] flex items-center gap-3">
            <span className="w-1.5 h-6 rounded-full bg-[#02c39a]" />
            Nagar Valley Leaderboard
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#02c39a]">
            <TrendingUp className="w-4 h-4" />
            Live ranking
          </span>
        </div>

        {board.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-[#02c39a]/40">
            <Trophy className="w-8 h-8 text-[#02c39a] mx-auto mb-3" />
            <p className="text-sm text-[#063b30]/60">No rankings yet. Complete a class to get on the board.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#02c39a]/15 overflow-hidden">
            <ol className="divide-y divide-[#02c39a]/10">
              {board.map((item, index) => (
                <li
                  key={item.id || item.name}
                  className={`relative px-4 py-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                    item.isMe ? 'bg-[#02c39a]/5' : 'hover:bg-[#02c39a]/[0.03]'
                  }`}
                >
                  {item.isMe && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#02c39a]" />}

                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank */}
                    <div
                      className={`relative w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${rankStyle(index)}`}
                    >
                      {index === 0 && (
                        <Crown className="absolute -top-3 w-3.5 h-3.5 text-[#02c39a] fill-[#02c39a]" />
                      )}
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-[#02c39a]/10 text-[#02c39a] text-xs font-bold flex items-center justify-center">
                      {getInitials(item.name)}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#063b30] flex items-center gap-2">
                        <span className="truncate">{item.name}</span>
                        {item.isMe && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#02c39a] text-white">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#063b30]/50 truncate">{item.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8 shrink-0 text-right">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#063b30]/60">
                      <Flame className="w-4 h-4 text-[#02c39a]" />
                      {item.streak ?? 0} day streak
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#02c39a] flex items-center justify-end gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {item.xp ?? 0} XP
                      </p>
                      <p className="text-[10px] font-medium text-[#063b30]/45">
                        {item.completedCount ?? 0} completed
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
};
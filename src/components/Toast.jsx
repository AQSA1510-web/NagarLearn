import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

// Removes any emoji that might still be inside a toast message
// (e.g. from AuthContext or DataContext), so toasts always stay clean.
const stripEmoji = (text = '') =>
  String(text)
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

const VARIANTS = {
  success: {
    Icon: CheckCircle,
    tile: 'bg-[#02c39a] text-white',
    accent: 'bg-[#02c39a]',
    label: 'Success',
  },
  error: {
    Icon: AlertCircle,
    tile: 'bg-[#063b30] text-white',
    accent: 'bg-[#063b30]',
    label: 'Something went wrong',
  },
  info: {
    Icon: Info,
    tile: 'bg-[#02c39a]/10 text-[#02c39a]',
    accent: 'bg-[#02c39a]/50',
    label: 'Notice',
  },
};

export const Toast = () => {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const { msg, type } = toastMessage;
  const variant = VARIANTS[type] || VARIANTS.success;
  const { Icon } = variant;
  const isError = type === 'error';

  return (
    <div
      key={msg}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className="fixed z-[60] bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm animate-pop"
    >
      <div className="relative overflow-hidden flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#02c39a]/20 shadow-[0_20px_45px_-15px_rgba(6,59,48,0.35)]">
        {/* Left accent line */}
        <span className={`absolute left-0 top-0 bottom-0 w-1 ${variant.accent}`} />

        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${variant.tile}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#063b30]/45">
            {variant.label}
          </p>
          <p className="text-sm font-semibold text-[#063b30] leading-snug">
            {stripEmoji(msg)}
          </p>
        </div>
      </div>
    </div>
  );
};
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth, isFirebaseConfigured } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import confetti from 'canvas-confetti';

const AuthContext = createContext();

/* ---------- Helpers ---------- */

const STORAGE_KEY = 'nagar_user';

// Local date as YYYY-MM-DD (Pakistan time, not UTC)
const localDate = (d = new Date()) => d.toLocaleDateString('en-CA');
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDate(d);
};

// Confetti in brand colors only
const BRAND_CONFETTI = ['#02c39a', '#35d0ae', '#81e1cc', '#ffffff'];
const celebrate = (options) =>
  confetti({ colors: BRAND_CONFETTI, disableForReducedMotion: true, ...options });

// Friendly messages instead of raw Firebase errors
const AUTH_ERRORS = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'No internet connection. Please check your network and try again.',
};
const friendlyAuthError = (err, fallback) => AUTH_ERRORS[err?.code] || fallback;

/* ---------- Demo accounts ---------- */

const DEMO_STUDENT = {
  uid: 'user-demo-student',
  displayName: 'Ali Khan',
  email: 'ali.nagar@gmail.com',
  role: 'student',
  school: 'High School Minapin Nagar',
  streak: 5,
  lastStreakClaim: yesterday(), // lets the demo streak continue today
  xp: 650,
  level: 2,
  enrolledClasses: ['class-1', 'class-3'],
  completedClasses: [],
  badges: ['badge-first-step', 'badge-streak-3'],
};

const DEMO_TEACHER = {
  uid: 'teacher-sara',
  displayName: 'Sara Ahmed',
  email: 'sara.kiu@gmail.com',
  role: 'teacher',
  university: 'Karakoram International University',
  bio: 'CS senior passionate about teaching Python and web development to Nagar youth.',
  streak: 14,
  lastStreakClaim: yesterday(),
  xp: 1200,
  level: 4,
  enrolledClasses: [],
  completedClasses: [],
  badges: ['badge-community-star'],
};

const DEMO_UIDS = [DEMO_STUDENT.uid, DEMO_TEACHER.uid];

const newUserProfile = ({ uid, displayName, email, role }) => ({
  uid,
  displayName,
  email,
  role,
  streak: 1,
  lastStreakClaim: localDate(),
  xp: 100,
  enrolledClasses: [],
  completedClasses: [],
  badges: ['badge-first-step'],
});

/* ---------- Provider ---------- */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // First visit: start as the demo student.
      // After logout we store "null", so a refresh keeps the user logged out.
      return saved !== null ? JSON.parse(saved) : DEMO_STUDENT;
    } catch {
      return DEMO_STUDENT;
    }
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimer = useRef(null);

  // Persist user
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user ?? null));
  }, [user]);

  // Firebase auth observer
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) return;
      // Functional update so we never overwrite a fresher profile
      setUser((prev) => {
        if (prev && prev.uid === fbUser.uid) return prev;
        return {
          ...newUserProfile({
            uid: fbUser.uid,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email,
            role: 'student',
          }),
        };
      });
    });

    return () => unsubscribe();
  }, []);

  // Clean up toast timer on unmount
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const triggerToast = (msg, type = 'success') => {
    clearTimeout(toastTimer.current); // a new toast should get its full time on screen
    setToastMessage({ msg, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  };

  const loginDemoUser = (role = 'student') => {
    const selectedUser = role === 'teacher' ? DEMO_TEACHER : DEMO_STUDENT;
    setUser({ ...selectedUser, lastStreakClaim: yesterday() });
    triggerToast(`Signed in as demo ${role === 'teacher' ? 'mentor' : 'student'}.`);
  };

  const toggleRole = () => {
    const newRole = user?.role === 'teacher' ? 'student' : 'teacher';

    if (!user) {
      loginDemoUser(newRole);
      return;
    }

    const isDemo = DEMO_UIDS.includes(user.uid);
    setUser({
      ...user,
      role: newRole,
      // Only swap the name for demo accounts, never rename real users
      ...(isDemo && {
        displayName: newRole === 'teacher' ? DEMO_TEACHER.displayName : DEMO_STUDENT.displayName,
      }),
    });
    triggerToast(`Switched to ${newRole === 'teacher' ? 'mentor' : 'student'} view.`, 'info');
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Offline / mock login
        const isTeacher = email.includes('teacher') || email.includes('kiu');
        setUser({
          ...newUserProfile({
            uid: 'usr-' + Date.now(),
            displayName: email.split('@')[0],
            email,
            role: isTeacher ? 'teacher' : 'student',
          }),
          streak: 3,
          xp: 250,
          enrolledClasses: ['class-1'],
        });
      }
      triggerToast('Welcome back to NagarLearn.');
    } catch (err) {
      triggerToast(friendlyAuthError(err, 'Sign in failed. Please try again.'), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password, role) => {
    setLoading(true);
    try {
      let uid = 'usr-' + Date.now();

      if (isFirebaseConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        uid = res.user.uid;
        // Save the name on the Firebase account too
        await updateProfile(res.user, { displayName: name }).catch(() => {});
      }

      setUser(newUserProfile({ uid, displayName: name, email, role }));
      triggerToast(
        `Welcome to NagarLearn. Your ${role === 'teacher' ? 'mentor' : 'student'} account is ready.`
      );
    } catch (err) {
      triggerToast(friendlyAuthError(err, 'Registration failed. Please try again.'), 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      if (isFirebaseConfigured && auth) await signOut(auth);
    } finally {
      setUser(null);
      triggerToast('You have been signed out.', 'info');
    }
  };

  const claimDailyStreak = () => {
    if (!user) {
      triggerToast('Sign in to start your learning streak.', 'info');
      return;
    }

    const today = localDate();
    if (user.lastStreakClaim === today) {
      triggerToast("You've already claimed today's streak. Come back tomorrow.", 'info');
      return;
    }

    // Continue the streak only if it was claimed yesterday, otherwise restart
    const continued = user.lastStreakClaim === yesterday();
    const newStreak = continued ? (user.streak || 0) + 1 : 1;
    const newXP = (user.xp || 0) + 50;
    const updatedBadges = [...(user.badges || [])];

    if (newStreak >= 3 && !updatedBadges.includes('badge-streak-3')) updatedBadges.push('badge-streak-3');
    if (newStreak >= 7 && !updatedBadges.includes('badge-streak-7')) updatedBadges.push('badge-streak-7');

    setUser({
      ...user,
      streak: newStreak,
      xp: newXP,
      lastStreakClaim: today,
      badges: updatedBadges,
    });

    celebrate({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    triggerToast(
      continued
        ? `Streak claimed. You're on a ${newStreak} day streak (+50 XP).`
        : 'New streak started. Day 1 (+50 XP).'
    );
  };

  const enrollClassInUser = (classId) => {
    if (!user) return;
    const currentEnrolled = user.enrolledClasses || [];
    if (currentEnrolled.includes(classId)) return;

    const newBadges = [...(user.badges || [])];
    if (!newBadges.includes('badge-first-step')) newBadges.push('badge-first-step');

    setUser({
      ...user,
      enrolledClasses: [...currentEnrolled, classId],
      xp: (user.xp || 0) + 30,
      badges: newBadges,
    });

    celebrate({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    triggerToast('Enrolled successfully (+30 XP).');
  };

  const unenrollClassInUser = (classId) => {
    if (!user) return;
    setUser({
      ...user,
      enrolledClasses: (user.enrolledClasses || []).filter((id) => id !== classId),
    });
    triggerToast('You have left the class.', 'info');
  };

  const completeClassInUser = (classId, subject) => {
    if (!user) return;
    const completed = user.completedClasses || [];
    if (completed.includes(classId)) return;

    const newCompleted = [...completed, classId];
    const newBadges = [...(user.badges || [])];

    if (subject === 'Science' && !newBadges.includes('badge-science-hero')) newBadges.push('badge-science-hero');
    if (subject === 'Computer Science' && !newBadges.includes('badge-tech-wizard')) newBadges.push('badge-tech-wizard');
    if (newCompleted.length >= 5 && !newBadges.includes('badge-community-star')) newBadges.push('badge-community-star');

    setUser({
      ...user,
      completedClasses: newCompleted,
      xp: (user.xp || 0) + 100,
      badges: newBadges,
    });

    celebrate({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    triggerToast('Class completed. Well done (+100 XP).');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toastMessage,
        loginDemoUser,
        toggleRole,
        loginUser,
        registerUser,
        logoutUser,
        claimDailyStreak,
        enrollClassInUser,
        unenrollClassInUser,
        completeClassInUser,
        triggerToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
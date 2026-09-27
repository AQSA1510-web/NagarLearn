import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  INITIAL_CLASSES,
  INITIAL_BADGES,
  INITIAL_LEADERBOARD,
  CAREER_PATHS,
} from '../data/initialData';
import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const DataContext = createContext();

/* ---------- Helpers ---------- */

const useFirestore = () => Boolean(isFirebaseConfigured && db);

// Safe localStorage read (corrupted data won't crash the app)
const loadSaved = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// Local date as YYYY-MM-DD (Pakistan time, not UTC)
const localDate = () => new Date().toLocaleDateString('en-CA');

/* ---------- Provider ---------- */

export const DataProvider = ({ children }) => {
  const [classes, setClasses] = useState(() => loadSaved('nagar_classes', INITIAL_CLASSES));
  const [leaderboard, setLeaderboard] = useState(() =>
    loadSaved('nagar_leaderboard', INITIAL_LEADERBOARD)
  );

  const [badges] = useState(INITIAL_BADGES);
  const [careerPaths] = useState(CAREER_PATHS);

  // Tracks whether Firestore has ever sent real data,
  // so the demo classes stay visible until it does.
  const hasRemoteData = useRef(false);

  // Persist to localStorage (works offline, useful with weak internet in Nagar)
  useEffect(() => {
    localStorage.setItem('nagar_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('nagar_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Firestore real-time listener
  useEffect(() => {
    if (!useFirestore()) return;

    const unsubscribe = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        if (snapshot.empty && !hasRemoteData.current) return; // keep demo classes

        hasRemoteData.current = true;
        const firestoreClasses = snapshot.docs
          // Firestore's document id always wins over any id stored inside the data
          .map((d) => ({ ...d.data(), id: d.id }))
          .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

        setClasses(firestoreClasses);
      },
      (err) => console.warn('Firestore snapshot error:', err)
    );

    return () => unsubscribe();
  }, []);

  const addClass = async (newClassData) => {
    const classData = {
      ...newClassData,
      enrolledStudents: [],
      isLiveNow: false,
      createdAt: localDate(),
    };

    if (useFirestore()) {
      // Throws on failure so CreateClassModal can show its error message
      const docRef = await addDoc(collection(db, 'classes'), classData);
      const created = { ...classData, id: docRef.id };
      // The live listener will also add it, so avoid duplicates
      setClasses((prev) => (prev.some((c) => c.id === created.id) ? prev : [created, ...prev]));
      return created;
    }

    const created = { ...classData, id: 'class-' + Date.now() };
    setClasses((prev) => [created, ...prev]);
    return created;
  };

  const deleteClass = async (classId) => {
    if (useFirestore()) {
      try {
        await deleteDoc(doc(db, 'classes', classId));
      } catch (e) {
        console.error('Firestore delete error:', e);
      }
    }
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  const updateClassEnrollment = async (classId, studentName, action = 'enroll') => {
    if (!studentName) return;
    const isEnroll = action === 'enroll';

    // 1. Update the UI immediately
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const enrolled = c.enrolledStudents || [];
        const updatedStudents = isEnroll
          ? enrolled.includes(studentName)
            ? enrolled
            : [...enrolled, studentName]
          : enrolled.filter((name) => name !== studentName);
        return { ...c, enrolledStudents: updatedStudents };
      })
    );

    // 2. Sync to Firestore. arrayUnion / arrayRemove are atomic, so two
    //    students enrolling at the same moment won't overwrite each other.
    if (useFirestore()) {
      try {
        await updateDoc(doc(db, 'classes', classId), {
          enrolledStudents: isEnroll ? arrayUnion(studentName) : arrayRemove(studentName),
        });
      } catch (err) {
        console.error('Firestore update error:', err);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        classes,
        leaderboard,
        setLeaderboard,
        badges,
        careerPaths,
        addClass,
        deleteClass,
        updateClassEnrollment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
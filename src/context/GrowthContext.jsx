import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Code2,
  Stethoscope,
  Wrench,
  Briefcase,
  Palette,
  GraduationCap,
  Mountain,
  Landmark,
  PenTool,
  Laptop,
} from 'lucide-react';

/* ==========================================================================
   STATIC DATA
   ========================================================================== */

// ---------- Student levels ----------
export const LEVELS = [
  { id: 'middle', label: 'Class 8 to 10', hint: 'Matric or O Levels', group: 'school' },
  { id: 'fsc', label: 'Class 11 to 12', hint: 'FSc, ICS or A Levels', group: 'school' },
  { id: 'uni', label: 'University', hint: 'Bachelor’s student', group: 'undergrad' },
  { id: 'grad', label: 'Graduate', hint: 'Finished my degree', group: 'graduate' },
];

// ---------- Interests ----------
export const INTERESTS = [
  { id: 'coding', label: 'Computers & Coding', icon: Code2 },
  { id: 'health', label: 'Medicine & Health', icon: Stethoscope },
  { id: 'engineering', label: 'Engineering & Building', icon: Wrench },
  { id: 'business', label: 'Business & Money', icon: Briefcase },
  { id: 'creative', label: 'Design & Creativity', icon: Palette },
  { id: 'teaching', label: 'Teaching & Helping Others', icon: GraduationCap },
  { id: 'nature', label: 'Nature, Tourism & Environment', icon: Mountain },
  { id: 'public', label: 'Law & Public Service', icon: Landmark },
  { id: 'writing', label: 'Writing & Media', icon: PenTool },
  { id: 'freelance', label: 'Earning Online', icon: Laptop },
];

// ---------- Careers ("what can I become") ----------
export const CAREERS = [
  {
    id: 'software-dev',
    title: 'Software Developer',
    interests: ['coding', 'freelance'],
    icon: Code2,
    summary: 'Build apps and websites. One of the best careers you can do remotely from Nagar.',
    stream: 'FSc Pre-Engineering or ICS',
    degree: 'BS Computer Science or Software Engineering',
    universities: ['KIU', 'NUST', 'FAST', 'COMSATS'],
    entryTest: 'NUST NET or university entry tests',
    remote: true,
  },
  {
    id: 'data-ai',
    title: 'Data & AI Specialist',
    interests: ['coding'],
    icon: Code2,
    summary: 'Use data and AI to solve problems for companies, hospitals and governments.',
    stream: 'FSc Pre-Engineering or ICS',
    degree: 'BS Data Science, AI or Computer Science',
    universities: ['NUST', 'FAST', 'COMSATS'],
    entryTest: 'NUST NET or university entry tests',
    remote: true,
  },
  {
    id: 'doctor',
    title: 'Doctor',
    interests: ['health'],
    icon: Stethoscope,
    summary: 'GB needs more doctors. Serve your own community after MBBS.',
    stream: 'FSc Pre-Medical',
    degree: 'MBBS',
    universities: ['Public medical colleges', 'Aga Khan University'],
    entryTest: 'MDCAT',
    remote: false,
  },
  {
    id: 'nurse',
    title: 'Nurse or Allied Health Professional',
    interests: ['health', 'teaching'],
    icon: Stethoscope,
    summary: 'High demand in Pakistan and abroad, with a shorter path than MBBS.',
    stream: 'FSc Pre-Medical',
    degree: 'BS Nursing or allied health sciences',
    universities: ['Aga Khan University', 'Public nursing colleges'],
    entryTest: 'University entry tests',
    remote: false,
  },
  {
    id: 'engineer',
    title: 'Civil or Hydropower Engineer',
    interests: ['engineering', 'nature'],
    icon: Wrench,
    summary: 'Design roads, bridges and hydropower projects that GB depends on.',
    stream: 'FSc Pre-Engineering',
    degree: 'BE Civil or Electrical Engineering',
    universities: ['NUST', 'UET', 'GIKI'],
    entryTest: 'ECAT or NUST NET',
    remote: false,
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur or Business Manager',
    interests: ['business', 'nature'],
    icon: Briefcase,
    summary: 'Start a business, from dried fruit exports to local tourism brands.',
    stream: 'Any FSc or ICom',
    degree: 'BBA or BS Economics',
    universities: ['LUMS', 'IBA', 'KIU'],
    entryTest: 'University admission tests',
    remote: true,
  },
  {
    id: 'designer',
    title: 'Graphic or UI Designer',
    interests: ['creative', 'freelance', 'coding'],
    icon: Palette,
    summary: 'Design logos, apps and brands for clients around the world.',
    stream: 'Any stream',
    degree: 'BS Design, or self-taught with a strong portfolio',
    universities: [],
    entryTest: 'Portfolio matters more than tests',
    remote: true,
  },
  {
    id: 'teacher',
    title: 'Teacher or Educator',
    interests: ['teaching'],
    icon: GraduationCap,
    summary: 'Shape the next generation of Nagar, in a classroom or online.',
    stream: 'Any stream',
    degree: 'BS in your subject, then B.Ed',
    universities: ['KIU', 'AKU-IED'],
    entryTest: 'University admission tests',
    remote: true,
  },
  {
    id: 'tourism',
    title: 'Tourism & Hospitality Manager',
    interests: ['nature', 'business'],
    icon: Mountain,
    summary: 'Rakaposhi and Hopar attract visitors from around the world. Build that industry at home.',
    stream: 'Any stream',
    degree: 'BS Tourism & Hospitality Management',
    universities: [],
    entryTest: 'University admission tests',
    remote: false,
  },
  {
    id: 'environment',
    title: 'Environmental & Glacier Scientist',
    interests: ['nature', 'engineering'],
    icon: Mountain,
    summary: 'Study glaciers, water and climate change, which directly affect life in GB.',
    stream: 'FSc Pre-Medical or Pre-Engineering',
    degree: 'BS Environmental Science or Geology',
    universities: ['KIU', 'Quaid-i-Azam University'],
    entryTest: 'University admission tests',
    remote: false,
  },
  {
    id: 'civil-servant',
    title: 'Civil Servant (CSS)',
    interests: ['public', 'writing'],
    icon: Landmark,
    summary: 'Serve Pakistan as an officer in administration, police or foreign service.',
    stream: 'Any stream',
    degree: 'Any bachelor’s degree',
    universities: [],
    entryTest: 'CSS exam by FPSC',
    remote: false,
  },
  {
    id: 'lawyer',
    title: 'Lawyer',
    interests: ['public', 'writing'],
    icon: Landmark,
    summary: 'Defend people’s rights and work on land, business or public law.',
    stream: 'Any stream',
    degree: 'LLB',
    universities: ['LUMS', 'University law departments'],
    entryTest: 'LAT (Law Admission Test)',
    remote: false,
  },
  {
    id: 'journalist',
    title: 'Journalist or Content Creator',
    interests: ['writing', 'creative'],
    icon: PenTool,
    summary: 'Tell the stories of the mountains to the world through writing and video.',
    stream: 'Any stream',
    degree: 'BS Mass Communication, or self-taught',
    universities: [],
    entryTest: 'Portfolio matters more than tests',
    remote: true,
  },
  {
    id: 'freelancer',
    title: 'Freelancer & Digital Marketer',
    interests: ['freelance', 'business', 'creative'],
    icon: Laptop,
    summary: 'Earn in dollars from home with skills like marketing, writing or design.',
    stream: 'Any stream',
    degree: 'No degree required to start',
    universities: [],
    entryTest: 'Skills and portfolio',
    remote: true,
  },
];

// ---------- Mentors (demo profiles) ----------
// "teacher-sara" matches the demo mentor account in AuthContext.
export const MENTORS = [
  {
    id: 'teacher-sara',
    name: 'Sara Ahmed',
    university: 'Karakoram International University',
    shortUni: 'KIU',
    program: 'BS Computer Science, Final Year',
    hometown: 'Gilgit',
    interests: ['coding', 'freelance', 'teaching'],
    helpsWith: ['Choosing ICS or Pre-Engineering', 'Learning to code', 'KIU admissions'],
    languages: ['English', 'Urdu', 'Shina'],
    bio: 'I started coding on a shared phone. Now I help Nagar students take their first steps in tech.',
  },
  {
    id: 'mentor-rashid',
    name: 'Rashid Ali',
    university: 'UET Lahore',
    shortUni: 'UET',
    program: 'BSc Electrical Engineering',
    hometown: 'Minapin, Nagar',
    interests: ['engineering', 'nature'],
    helpsWith: ['ECAT preparation', 'Engineering careers', 'Living in Lahore as a GB student'],
    languages: ['English', 'Urdu', 'Burushaski'],
    bio: 'From Minapin to UET. I know how hard entry tests feel without a proper academy.',
  },
  {
    id: 'mentor-bilal',
    name: 'Bilal Baig',
    university: 'NUST Islamabad',
    shortUni: 'NUST',
    program: 'BS Mathematics',
    hometown: 'Ghulmet, Nagar',
    interests: ['engineering', 'coding', 'teaching'],
    helpsWith: ['NUST NET preparation', 'Maths for entry tests', 'Study routines'],
    languages: ['English', 'Urdu', 'Burushaski'],
    bio: 'I cleared NET with self-study. Happy to share the exact plan I followed.',
  },
  {
    id: 'mentor-zainab',
    name: 'Zainab Hussain',
    university: 'Aga Khan University',
    shortUni: 'AKU',
    program: 'MBBS, Year 3',
    hometown: 'Hopar, Nagar',
    interests: ['health', 'teaching'],
    helpsWith: ['MDCAT preparation', 'Pre-Medical subject choices', 'Medical scholarships'],
    languages: ['English', 'Urdu', 'Burushaski'],
    bio: 'I want more girls from Nagar to become doctors. Ask me anything about MDCAT.',
  },
  {
    id: 'mentor-amina',
    name: 'Amina Karim',
    university: 'LUMS',
    shortUni: 'LUMS',
    program: 'BSc Economics',
    hometown: 'Sumayar, Nagar',
    interests: ['business', 'writing', 'public'],
    helpsWith: ['LUMS admissions & financial aid', 'Scholarship essays', 'Spoken English'],
    languages: ['English', 'Urdu', 'Burushaski'],
    bio: 'I went to LUMS on financial aid. I review scholarship essays for free.',
  },
  {
    id: 'mentor-khadija',
    name: 'Khadija Hussain',
    university: 'Freelance Digital Marketer',
    shortUni: 'Freelancer',
    program: '4 years of remote client work',
    hometown: 'Nagar Khas',
    interests: ['freelance', 'creative', 'business'],
    helpsWith: ['Starting on freelance platforms', 'Building a portfolio', 'Receiving payments in Pakistan'],
    languages: ['English', 'Urdu', 'Shina'],
    bio: 'I earn from home in Nagar. I can show you how to get your first client.',
  },
  {
    id: 'mentor-hassan',
    name: 'Hassan Abbas',
    university: 'Quaid-i-Azam University',
    shortUni: 'QAU',
    program: 'MPhil Environmental Science',
    hometown: 'Chalt, Nagar',
    interests: ['nature', 'public', 'writing'],
    helpsWith: ['International scholarships', 'Research careers', 'CSS guidance'],
    languages: ['English', 'Urdu', 'Shina'],
    bio: 'I research glaciers in the Karakoram and help students apply abroad.',
  },
];

export const GUIDANCE_TOPICS = [
  'Choosing my stream',
  'Entry test preparation',
  'University admissions',
  'Scholarships',
  'Career advice',
  'Learning a skill',
  'Something else',
];

// ---------- Opportunities ----------
// Facts checked on 27 September 2026. Re-check each official site before your demo.
// status: 'open' (has deadline) | 'rolling' | 'upcoming' | 'closed'
export const OPPORTUNITY_TYPES = ['Scholarship', 'Exchange', 'Fellowship', 'Internship'];

export const OPPORTUNITIES = [
  {
    id: 'uwc-2027',
    title: 'UWC Pakistan 2027 Intake',
    org: 'United World Colleges',
    type: 'Scholarship',
    levels: ['school'],
    interests: ['all'],
    status: 'open',
    deadline: '2026-09-30',
    deadlineNote: '11:59 PM PKT',
    funding: 'Places at UWC schools worldwide',
    location: 'Abroad',
    summary: 'Study the last two years of school at a UWC school or college in another country.',
    eligibility: [
      'Age 16 or 17 when the 2027 academic year begins',
      'At least 10 years of formal education completed',
      'Online application',
    ],
    url: 'https://pk.uwc.org',
  },
  {
    id: 'chevening-2027',
    title: 'Chevening Scholarship 2027/28',
    org: 'UK Government',
    type: 'Scholarship',
    levels: ['graduate'],
    interests: ['all'],
    status: 'open',
    deadline: '2026-10-06',
    deadlineNote: '4:00 PM PKT (11:00 UTC)',
    funding: 'Fully funded',
    location: 'United Kingdom',
    summary: 'A fully funded one-year master’s degree at a UK university for future leaders.',
    eligibility: [
      'Bachelor’s degree completed',
      'Work experience required (see official site)',
      'Return home for at least two years after the award',
    ],
    url: 'https://www.chevening.org',
  },
  {
    id: 'hec-need-based',
    title: 'HEC Need-Based Scholarship',
    org: 'Higher Education Commission',
    type: 'Scholarship',
    levels: ['undergrad'],
    interests: ['all'],
    status: 'rolling',
    window: 'Apply through your university’s financial aid office after admission',
    funding: 'Tuition plus monthly stipend',
    location: 'Pakistan',
    summary: 'Covers tuition and a monthly stipend for students who cannot afford university fees.',
    eligibility: [
      'Enrolled in a bachelor’s program at a participating public university',
      'Selected based on family financial need',
      'Application deadlines are set by each university',
    ],
    url: 'https://www.hec.gov.pk/english/scholarshipsgrants/nbs/pages/downloads.aspx',
  },
  {
    id: 'global-ugrad',
    title: 'Global UGRAD Pakistan',
    org: 'USEFP',
    type: 'Exchange',
    levels: ['undergrad'],
    interests: ['all'],
    status: 'upcoming',
    window: 'Usually announced in September or October',
    funding: 'Fully funded',
    location: 'United States',
    summary:
      'One fully funded semester at a US university. USEFP especially encourages students from remote areas.',
    eligibility: [
      'Age 18 to 24',
      'In the 2nd year of a bachelor’s degree (14th year of education)',
      'Pakistani citizen',
    ],
    url: 'https://www.usefp.org/scholarships/global-ugrad.cfm',
  },
  {
    id: 'yes-2027',
    title: 'Kennedy-Lugar YES Program',
    org: 'U.S. Embassy Pakistan',
    type: 'Exchange',
    levels: ['school'],
    interests: ['all'],
    status: 'open',
    deadline: '2026-09-15',
    nextRound: 'Spring 2027 round has closed. Prepare your documents for the next call.',
    funding: 'Fully funded',
    location: 'United States',
    summary: 'Live with an American host family and attend a US high school for a semester.',
    eligibility: [
      'Age 15 to 17',
      'In Class 8, 9, 10 or O Levels',
      'At least 60% marks in each of the last three years',
    ],
    url: 'https://yesprogram.pk',
  },
  {
    id: 'tfp-fellowship',
    title: 'Teach For Pakistan Fellowship',
    org: 'Teach For Pakistan',
    type: 'Fellowship',
    levels: ['graduate'],
    interests: ['teaching', 'public'],
    status: 'upcoming',
    window: 'Last round closed in January 2026. Next round not yet announced',
    funding: 'Paid, two-year fellowship',
    location: 'Islamabad and Karachi',
    summary: 'Teach in under-resourced schools for two years while building leadership skills.',
    eligibility: [
      'Bachelor’s degree completed',
      'Fluent in English and Urdu',
      'Two-year full-time commitment',
    ],
    url: 'https://www.iteachforpakistan.org',
  },
  {
    id: 'puan-internship',
    title: 'PUAN National Internship Program',
    org: 'Pakistan U.S. Alumni Network',
    type: 'Internship',
    levels: ['undergrad', 'graduate'],
    interests: ['business', 'coding', 'engineering'],
    status: 'upcoming',
    window: 'Summer program. The 2026 round has ended',
    funding: 'Monthly stipend',
    location: 'Pakistan',
    summary: 'A mentored summer internship for alumni of U.S. exchange programs like YES and UGRAD.',
    eligibility: ['Registered PUAN member', 'Full-time for three months'],
    url: 'https://puan.pk',
  },
  {
    id: 'meezanship',
    title: 'Meezanship Paid Trainee Program',
    org: 'Meezan Bank',
    type: 'Internship',
    levels: ['undergrad', 'graduate'],
    interests: ['business'],
    status: 'upcoming',
    window: 'Runs in batches. Batch 07 opened in June 2026',
    funding: 'Monthly stipend',
    location: 'Across Pakistan',
    summary: 'A 3 to 6 month paid banking traineeship for fresh graduates and final-semester students.',
    eligibility: ['Fresh graduate or final semester student'],
    url: null,
  },
  {
    id: 'akrsp-yip',
    title: 'AKRSP Youth Internship Program',
    org: 'Aga Khan Rural Support Programme',
    type: 'Internship',
    levels: ['graduate'],
    interests: ['all'],
    status: 'upcoming',
    window: 'Offered in past rounds for GB graduates. Watch for the next call',
    funding: 'Paid internship',
    location: 'Gilgit-Baltistan',
    summary: 'Professional experience for fresh graduates from Gilgit-Baltistan.',
    eligibility: ['GB domicile', '16 years of education', 'No prior work experience'],
    url: null,
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

const DAY = 24 * 60 * 60 * 1000;

export const levelGroup = (levelId) => LEVELS.find((l) => l.id === levelId)?.group || null;

export const getDeadlineInfo = (opp, now = new Date()) => {
  if (opp.status === 'rolling') return { tone: 'rolling', label: 'Rolling', detail: opp.window, sort: 2000 };
  if (opp.status === 'upcoming') return { tone: 'upcoming', label: 'Opening soon', detail: opp.window, sort: 3000 };
  if (!opp.deadline) return { tone: 'upcoming', label: 'Check site', detail: opp.window, sort: 3500 };

  const end = new Date(`${opp.deadline}T23:59:59`);
  const daysLeft = Math.ceil((end - now) / DAY);
  const dateText = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (daysLeft < 0) {
    return { tone: 'closed', label: 'Closed', detail: opp.nextRound || `Closed on ${dateText}`, sort: 9000 };
  }
  if (daysLeft <= 1) {
    return { tone: 'urgent', label: daysLeft === 0 ? 'Closes today' : 'Closes tomorrow', detail: dateText, daysLeft, sort: daysLeft };
  }
  return {
    tone: daysLeft <= 7 ? 'urgent' : 'open',
    label: `${daysLeft} days left`,
    detail: dateText,
    daysLeft,
    sort: daysLeft,
  };
};

const overlap = (a = [], b = []) => a.filter((x) => b.includes(x)).length;

export const matchCareers = (interests = []) =>
  CAREERS.map((c) => ({ ...c, score: overlap(c.interests, interests) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

export const matchMentors = (interests = []) =>
  MENTORS.map((m) => ({ ...m, score: overlap(m.interests, interests) })).sort((a, b) => b.score - a.score);

export const matchOpportunities = (interests = [], levelId = null) => {
  const group = levelGroup(levelId);
  return OPPORTUNITIES.filter((o) => !group || o.levels.includes(group))
    .map((o) => ({
      ...o,
      match: o.interests.includes('all') || overlap(o.interests, interests) > 0,
      deadlineInfo: getDeadlineInfo(o),
    }))
    .filter((o) => o.match)
    .sort((a, b) => a.deadlineInfo.sort - b.deadlineInfo.sort);
};

// Works for the demo mentor account and for the role switcher
// (which keeps the student uid but changes the name to "Sara Ahmed").
export const resolveMentorId = (user) => {
  if (!user) return null;
  if (MENTORS.some((m) => m.id === user.uid)) return user.uid;
  const byName = MENTORS.find((m) => m.name === user.displayName);
  return byName ? byName.id : user.uid;
};

/* ==========================================================================
   PROVIDER (profiles, saved opportunities, mentor requests)
   ========================================================================== */

const STORAGE_KEY = 'nagar_growth';

const seedRequests = () => {
  const now = Date.now();
  return [
    {
      id: 'req-seed-1',
      studentId: 'user-demo-student',
      studentName: 'Ali Khan',
      studentLevel: 'middle',
      mentorId: 'teacher-sara',
      topic: 'Choosing my stream',
      message:
        'I am in Class 10 and I want to become a software developer. Should I choose ICS or Pre-Engineering?',
      status: 'answered',
      reply:
        'Great question, Ali. Both work. Pre-Engineering keeps more doors open, including NUST and engineering. ICS lets you start programming earlier. If you are sure about software, ICS is a good choice. Start learning Python now either way. I can send you free resources.',
      createdAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
      repliedAt: new Date(now - 1 * 24 * 3600 * 1000).toISOString(),
      seenByStudent: true,
    },
    {
      id: 'req-seed-2',
      studentId: 'student-fatima',
      studentName: 'Fatima Ali',
      studentLevel: 'fsc',
      mentorId: 'teacher-sara',
      topic: 'Scholarships',
      message:
        'Assalam o Alaikum. I saw the UWC deadline is very close. Is it worth applying from Nagar, and what should I write in my application?',
      status: 'pending',
      reply: null,
      createdAt: new Date(now - 5 * 3600 * 1000).toISOString(),
      repliedAt: null,
      seenByStudent: false,
    },
  ];
};

const initialState = () => ({ profiles: {}, saved: {}, requests: seedRequests() });

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState(), ...JSON.parse(saved) } : initialState();
  } catch {
    return initialState();
  }
};

const GrowthContext = createContext();

export const GrowthProvider = ({ children }) => {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /* ---- Student profile (level + interests) ---- */
  const getProfile = (uid) => (uid ? state.profiles[uid] || null : null);

  const saveProfile = (uid, data) => {
    if (!uid) return;
    setState((s) => ({
      ...s,
      profiles: {
        ...s.profiles,
        [uid]: { ...(s.profiles[uid] || {}), ...data, updatedAt: new Date().toISOString() },
      },
    }));
  };

  /* ---- Saved opportunities ---- */
  const isSaved = (uid, oppId) => (state.saved[uid] || []).includes(oppId);

  const toggleSaved = (uid, oppId) => {
    if (!uid) return;
    setState((s) => {
      const list = s.saved[uid] || [];
      const next = list.includes(oppId) ? list.filter((id) => id !== oppId) : [...list, oppId];
      return { ...s, saved: { ...s.saved, [uid]: next } };
    });
  };

  const savedFor = (uid) => state.saved[uid] || [];

  /* ---- Mentor requests ---- */
  const sendRequest = ({ student, level, mentorId, topic, message }) => {
    const request = {
      id: 'req-' + Date.now(),
      studentId: student.uid,
      studentName: student.displayName,
      studentLevel: level || null,
      mentorId,
      topic,
      message: message.trim(),
      status: 'pending',
      reply: null,
      createdAt: new Date().toISOString(),
      repliedAt: null,
      seenByStudent: false,
    };
    setState((s) => ({ ...s, requests: [request, ...s.requests] }));
    return request;
  };

  const replyToRequest = (requestId, reply) => {
    setState((s) => ({
      ...s,
      requests: s.requests.map((r) =>
        r.id === requestId
          ? { ...r, reply: reply.trim(), status: 'answered', repliedAt: new Date().toISOString(), seenByStudent: false }
          : r
      ),
    }));
  };

  const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  const requestsForStudent = (uid) => state.requests.filter((r) => r.studentId === uid).sort(newestFirst);

  const requestsForMentor = (mentorId) =>
    state.requests
      .filter((r) => r.mentorId === mentorId)
      .sort((a, b) => (a.status === b.status ? newestFirst(a, b) : a.status === 'pending' ? -1 : 1));

  const unreadReplies = (uid) =>
    state.requests.filter((r) => r.studentId === uid && r.status === 'answered' && !r.seenByStudent).length;

  const pendingForMentor = (mentorId) =>
    state.requests.filter((r) => r.mentorId === mentorId && r.status === 'pending').length;

  const markRepliesSeen = (uid) => {
    setState((s) => ({
      ...s,
      requests: s.requests.map((r) =>
        r.studentId === uid && r.status === 'answered' && !r.seenByStudent ? { ...r, seenByStudent: true } : r
      ),
    }));
  };

  // Handy for demos: restores the seeded requests and clears profiles
  const resetGrowthData = () => setState(initialState());

  return (
    <GrowthContext.Provider
      value={{
        getProfile,
        saveProfile,
        isSaved,
        toggleSaved,
        savedFor,
        sendRequest,
        replyToRequest,
        requestsForStudent,
        requestsForMentor,
        unreadReplies,
        pendingForMentor,
        markRepliesSeen,
        resetGrowthData,
      }}
    >
      {children}
    </GrowthContext.Provider>
  );
};

export const useGrowth = () => useContext(GrowthContext);
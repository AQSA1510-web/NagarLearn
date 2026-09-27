export const INITIAL_CLASSES = [
  {
    id: "class-1",
    title: "Introduction to Python & Logic 🐍",
    subject: "Computer Science",
    level: "Beginner",
    teacherName: "Sara Ahmed (KIU)",
    teacherId: "teacher-sara",
    schedule: "Mon & Wed • 4:00 PM PST",
    duration: "1 Hour",
    zoomLink: "https://zoom.us/j/84920491823",
    whatsappLink: "https://chat.whatsapp.com/nagar-python-group",
    description: "Learn coding basics, logic building, and how computer programs work! Perfect for Grade 6-10 students in Nagar wanting to step into tech.",
    capacity: 25,
    enrolledStudents: ["Ali Khan", "Fatima Zehra", "Zulqarnain", "Rehana Bibi"],
    prerequisite: "No prior experience required.",
    isLiveNow: true,
    createdAt: "2026-09-20"
  },
  {
    id: "class-2",
    title: "Fun with Science: Physics in Daily Life ⚡",
    subject: "Science",
    level: "Intermediate",
    teacherName: "Engr. Rashid Ali (UET)",
    teacherId: "teacher-rashid",
    schedule: "Tue & Thu • 5:00 PM PST",
    duration: "45 Mins",
    zoomLink: "https://zoom.us/j/93810481029",
    whatsappLink: "https://chat.whatsapp.com/nagar-science-group",
    description: "Explore gravity, electricity, solar energy, and how motors function with simple hands-on home experiments!",
    capacity: 30,
    enrolledStudents: ["Fatima Zehra", "Tahir Shah"],
    prerequisite: "Basic general science understanding.",
    isLiveNow: false,
    createdAt: "2026-09-21"
  },
  {
    id: "class-3",
    title: "English Spoken & Presentation Skills 🗣️",
    subject: "English",
    level: "Beginner",
    teacherName: "Amina Karim (LUMS)",
    teacherId: "teacher-amina",
    schedule: "Saturdays • 3:00 PM PST",
    duration: "1.5 Hours",
    zoomLink: "https://meet.google.com/abc-defg-hij",
    whatsappLink: "https://chat.whatsapp.com/nagar-english-speakers",
    description: "Build confidence in conversational English speaking, vocabulary, interview tips, and effective public presentation skills.",
    capacity: 20,
    enrolledStudents: ["Ali Khan", "Zulqarnain", "Sajjad Hussain"],
    prerequisite: "Enthusiasm to speak and practice!",
    isLiveNow: false,
    createdAt: "2026-09-22"
  },
  {
    id: "class-4",
    title: "Mathematics Magic: Algebra & Geometry 📐",
    subject: "Mathematics",
    level: "Intermediate",
    teacherName: "Bilal Baig (NUST)",
    teacherId: "teacher-bilal",
    schedule: "Fri & Sun • 4:30 PM PST",
    duration: "1 Hour",
    zoomLink: "https://zoom.us/j/71029481920",
    whatsappLink: "https://chat.whatsapp.com/nagar-math-club",
    description: "Master algebraic equations, geometric formulas, and quick mental math tricks to excel in school and board exams.",
    capacity: 40,
    enrolledStudents: ["Saima Batool", "Asif Ali", "Zehra Nisa"],
    prerequisite: "Grade 7+ Math concepts.",
    isLiveNow: false,
    createdAt: "2026-09-23"
  },
  {
    id: "class-5",
    title: "Digital Marketing & Freelancing Basics 🌐",
    subject: "Career & Tech",
    level: "Advanced",
    teacherName: "Khadija Hussain (Gilgit Tech)",
    teacherId: "teacher-khadija",
    schedule: "Sundays • 6:00 PM PST",
    duration: "1 Hour",
    zoomLink: "https://zoom.us/j/51029384719",
    whatsappLink: "https://chat.whatsapp.com/nagar-freelancers",
    description: "Discover online remote freelancing opportunities, social media management, and graphic design basics with Canva.",
    capacity: 35,
    enrolledStudents: ["Ali Khan", "Tahir Shah", "Farhan Karim"],
    prerequisite: "Basic smartphone or computer usage.",
    isLiveNow: false,
    createdAt: "2026-09-24"
  },
  {
    id: "class-6",
    title: "Environmental Science & Climate Action 🌿",
    subject: "Science",
    level: "Beginner",
    teacherName: "Hassan Abbas (Eco Scholar)",
    teacherId: "teacher-hassan",
    schedule: "Thursdays • 4:00 PM PST",
    duration: "1 Hour",
    zoomLink: "https://meet.google.com/xyz-uvwx-rst",
    whatsappLink: "https://chat.whatsapp.com/nagar-eco-club",
    description: "Learn about protecting Nagar's glaciers, sustainable farming practices, clean water initiatives, and local ecology.",
    capacity: 30,
    enrolledStudents: ["Asif Ali", "Saima Batool"],
    prerequisite: "Open to all curious students.",
    isLiveNow: false,
    createdAt: "2026-09-25"
  }
];

export const INITIAL_BADGES = [
  {
    id: "badge-first-step",
    name: "First Class Explorer 🚀",
    description: "Enrolled in your first NagarLearn class!",
    icon: "🚀",
    color: "from-pink-500 to-rose-500",
    requirement: "Enroll in 1 class"
  },
  {
    id: "badge-streak-3",
    name: "Streak Pioneer 🔥",
    description: "Maintained a 3-day active learning streak!",
    icon: "🔥",
    color: "from-amber-400 to-orange-500",
    requirement: "3-day streak"
  },
  {
    id: "badge-streak-7",
    name: "Unstoppable Learner ⚡",
    description: "Kept a 7-day learning streak alive!",
    icon: "⚡",
    color: "from-yellow-400 to-amber-500",
    requirement: "7-day streak"
  },
  {
    id: "badge-science-hero",
    name: "Science Scholar 🧪",
    description: "Completed a Science or Physics class!",
    icon: "🧪",
    color: "from-emerald-400 to-teal-500",
    requirement: "Complete 1 Science class"
  },
  {
    id: "badge-tech-wizard",
    name: "Code Ninja 💻",
    description: "Attended a Computer Science or Coding session!",
    icon: "💻",
    color: "from-indigo-500 to-purple-600",
    requirement: "Complete 1 Coding class"
  },
  {
    id: "badge-community-star",
    name: "Nagar Champion 🏆",
    description: "Completed 5+ classes and helped peers!",
    icon: "🏆",
    color: "from-purple-500 to-pink-500",
    requirement: "Complete 5 classes"
  }
];

export const INITIAL_LEADERBOARD = [
  {
    id: "user-1",
    name: "Fatima Zehra",
    school: "Govt Girls High School Nagarkhas",
    xp: 820,
    streak: 12,
    completedCount: 7,
    avatar: "👧",
    badge: "🥇 1st Place"
  },
  {
    id: "user-demo",
    name: "Ali Khan (You)",
    school: "High School Minapin Nagar",
    xp: 650,
    streak: 5,
    completedCount: 4,
    avatar: "🧑‍🎓",
    badge: "🥈 2nd Place"
  },
  {
    id: "user-3",
    name: "Zulqarnain Shah",
    school: "Kiut Valley Public School",
    xp: 580,
    streak: 8,
    completedCount: 5,
    avatar: "👦",
    badge: "🥉 3rd Place"
  },
  {
    id: "user-4",
    name: "Tahir Shah",
    school: "Nagar Valley Model School",
    xp: 490,
    streak: 4,
    completedCount: 3,
    avatar: "🧑",
    badge: "Top 5"
  },
  {
    id: "user-5",
    name: "Saima Batool",
    school: "Chalt Community Academy",
    xp: 420,
    streak: 6,
    completedCount: 3,
    avatar: "👧",
    badge: "Top 5"
  },
  {
    id: "user-6",
    name: "Rehana Bibi",
    school: "Hopper Valley High School",
    xp: 310,
    streak: 2,
    completedCount: 2,
    avatar: "👩‍🎓",
    badge: "Rising Star"
  }
];

export const CAREER_PATHS = [
  {
    id: "career-software-eng",
    title: "Software Engineer & Web Developer 💻",
    category: "Technology",
    icon: "💻",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    description: "Design websites, build mobile applications, and write code to solve real-world problems for global companies from anywhere in Nagar.",
    salary: "$500 - $3,000+ / month (Remote Freelancing)",
    skills: ["Python / JavaScript", "Problem Solving", "HTML/CSS", "Git & GitHub"],
    recommendedClasses: ["Introduction to Python & Logic 🐍", "Digital Marketing & Freelancing Basics 🌐"],
    steps: [
      "Learn basic logic & Python programming",
      "Build simple web pages with HTML & CSS",
      "Practice coding problems online",
      "Create 2 portfolio projects and join remote freelancing platforms"
    ],
    resources: [
      { name: "FreeCodeCamp Interactive", url: "https://www.freecodecamp.org" },
      { name: "Python for Beginners (YouTube)", url: "https://youtube.com" }
    ]
  },
  {
    id: "career-renewable-eng",
    title: "Solar & Hydro Power Engineer ⚡",
    category: "Engineering",
    icon: "⚡",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    description: "Harness mountain rivers and solar energy to bring reliable electricity, clean water, and green energy to mountain communities.",
    salary: "PKR 90,000 - 250,000 / month",
    skills: ["Physics & Circuit Theory", "Mathematics", "CAD Design", "Environmental Impact"],
    recommendedClasses: ["Fun with Science: Physics in Daily Life ⚡", "Mathematics Magic: Algebra & Geometry 📐"],
    steps: [
      "Master high school physics & trigonometry",
      "Pursue Electrical or Energy Engineering degree",
      "Work on solar mini-grid installations in Gilgit-Baltistan",
      "Lead renewable energy initiatives"
    ],
    resources: [
      { name: "Khan Academy Physics", url: "https://www.khanacademy.org" },
      { name: "Renewable Energy Basics Guide", url: "https://wikipedia.org" }
    ]
  },
  {
    id: "career-medical-doctor",
    title: "Medical Specialist & Telemedicine Hero 🩺",
    category: "Healthcare",
    icon: "🩺",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description: "Provide healthcare, emergency medical assistance, and telemedicine services to rural populations in remote valleys.",
    salary: "PKR 120,000 - 350,000 / month",
    skills: ["Biology & Chemistry", "Empathy & Patient Care", "Diagnostic Reasoning", "English Fluency"],
    recommendedClasses: ["Fun with Science: Physics in Daily Life ⚡", "English Spoken & Presentation Skills 🗣️"],
    steps: [
      "Excel in Pre-Medical FSc subjects",
      "Prepare for MDCAT medical entrance test",
      "Complete MBBS degree & hospital residency",
      "Serve community hospitals & initiate remote telemedicine"
    ],
    resources: [
      { name: "Biology Online Notes", url: "https://khanacademy.org" }
    ]
  },
  {
    id: "career-environmental-sci",
    title: "Glaciologist & Climate Scientist 🌿",
    category: "Environment",
    icon: "🌿",
    badgeColor: "bg-teal-100 text-teal-700 border-teal-200",
    description: "Study glacier movements, combat GLOF (glacial lake outburst floods), and protect Karakoram's rich biodiversity.",
    salary: "PKR 100,000 - 300,000 / month",
    skills: ["Ecology", "GIS Mapping", "Data Collection", "Community Leadership"],
    recommendedClasses: ["Environmental Science & Climate Action 🌿", "Introduction to Python & Logic 🐍"],
    steps: [
      "Learn environmental biology & geography basics",
      "Degree in Environmental Sciences or Geology at KIU / NUST",
      "Participate in glacier monitoring expeditions in Nagar",
      "Publish climate protection research"
    ],
    resources: [
      { name: "Karakoram Glaciers Research Portal", url: "https://wikipedia.org" }
    ]
  },
  {
    id: "career-digital-marketer",
    title: "E-Commerce & Digital Marketer 🚀",
    category: "Business",
    icon: "🚀",
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
    description: "Promote Nagar's organic dry fruits, handicrafts, and tourism to international markets using social media and e-commerce.",
    salary: "$400 - $2,500+ / month",
    skills: ["Graphic Design", "Social Media Ads", "Copywriting", "Customer Relations"],
    recommendedClasses: ["Digital Marketing & Freelancing Basics 🌐", "English Spoken & Presentation Skills 🗣️"],
    steps: [
      "Learn graphic design with Canva & Photoshop",
      "Understand Facebook, Instagram & Shopify store setup",
      "Create marketing campaigns for local products",
      "Build international client network"
    ],
    resources: [
      { name: "Google Digital Garage Certification", url: "https://skillshop.exceedlms.com" }
    ]
  }
];

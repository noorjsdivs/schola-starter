export const PROGRAMS = [
  {
    slug: "middle-school-programs",
    level: "Middle school",
    title: "Middle school programs",
    grades: "For grades 6–8",
    body: "Subjects widen and sections stay small. Attendance, remarks, and grades share one class list.",
    paragraphs: [
      "Grades 6–8 are where the day gets longer. A student still belongs to one section, and that section is the list the teacher marks.",
      "Literature, science, and class projects sit on the same roster. A parent follows the week the school recorded, not a second copy in another tool.",
    ],
    points: [
      "A section stays with one class list for the year.",
      "Attendance, remarks, and grades share that list.",
      "Parents follow the same week the teacher records.",
    ],
    week: [
      {
        title: "A wider day",
        body: "Subjects open up. The section stays small enough that a teacher still knows the class list.",
      },
      {
        title: "One record",
        body: "Attendance, a teacher remark, and the grade stay with the student who earned them.",
      },
      {
        title: "The family view",
        body: "Parents open the same week. They do not chase a separate attendance file.",
      },
    ],
    subjects: ["Literature", "Science", "Class projects"],
    image: "/marketing/middle.jpg",
    alt: "Illustration of a teacher and a student beside a classroom board",
    tint: "bg-primary/10",
  },
  {
    slug: "elementary-programs",
    level: "Elementary",
    title: "Elementary programs",
    grades: "For grades K–5",
    body: "Reading, numbers, and art in short live classes. Parents follow the same week the teacher marks.",
    paragraphs: [
      "The early grades run in short live hours. A section stays together for reading, numbers, and art, with the teacher in the room.",
      "That class list is the record. Attendance is marked on it, and a family sees the day without a second login.",
    ],
    points: [
      "Short live classes for reading, numbers, and art.",
      "The early-grades team keeps one roster.",
      "Families see attendance without a second login.",
    ],
    week: [
      {
        title: "The live hour",
        body: "Reading, numbers, or art, kept short enough for kindergarten through grade 5.",
      },
      {
        title: "The class list",
        body: "One roster for the year. The early-grades team marks attendance on that list.",
      },
      {
        title: "After the hour",
        body: "Work can wait until the live class is over. The remark still stays with the student.",
      },
    ],
    subjects: ["Reading", "Numbers", "Art"],
    image: "/marketing/elementary.jpg",
    alt: "Illustration of a teacher and two students in an elementary classroom",
    tint: "bg-accent/25",
  },
  {
    slug: "high-school-programs",
    level: "High school",
    title: "High school programs",
    grades: "For grades 9–12",
    body: "Longer courses and exams, on a record the student can carry into the next year.",
    paragraphs: [
      "High school classes run across a term. Exams, percentage, and letter grades stay on the same student record as attendance.",
      "Nothing here is a course you buy from Schola. A school publishes its own catalog, names the teacher, and sets the fee.",
    ],
    points: [
      "Courses run across a term, with exams on the same record.",
      "Percentage and letter grades stay with the student.",
      "The record carries into the next academic year.",
    ],
    week: [
      {
        title: "A longer course",
        body: "Lessons run across the term. The section meets for the live hour, then finishes work after it.",
      },
      {
        title: "Exams on the record",
        body: "Percentage and letter grades sit beside attendance. They do not move to a separate gradebook.",
      },
      {
        title: "Into next year",
        body: "The record carries forward when the academic year rolls. The student does not start from a blank file.",
      },
    ],
    subjects: ["Courses", "Exams", "Student record"],
    image: "/marketing/high.jpg",
    alt: "Illustration of three students in front of a school building",
    tint: "bg-indigo/10",
  },
] as const;

export const TICKER = [
  { label: "Enrol today", href: "/signup" },
  { label: "Upcoming sessions", href: "/events" },
  { label: "Academics", href: "/academics" },
] as const;

export const EVENTS = [
  {
    slug: "english-literature-circle",
    title: "English literature circle",
    blurb: "A live reading group for middle and high school.",
    when: "Book a date",
    kind: "Online class",
    meta: "10 sessions",
    points: [
      "A live reading group, not a recorded course for sale.",
      "Built for middle and high school sections.",
      "The date is set with the school. Nothing is on a fixed public calendar.",
    ],
    image: "/marketing/classroom.jpg",
    photo: true,
  },
  {
    slug: "mathematics-for-grades-k-5",
    title: "Mathematics for grades K–5",
    blurb: "A step-by-step math block teachers can run each week.",
    when: "Book a date",
    kind: "Online class",
    meta: "6 months",
    points: [
      "A weekly math block for the early grades.",
      "Teachers run it with their own section.",
      "Book the start date with the school.",
    ],
    image: "/marketing/elementary.jpg",
    photo: false,
  },
  {
    slug: "setting-up-a-virtual-classroom",
    title: "Setting up a virtual classroom",
    blurb: "How a school opens attendance, classes, and parent access.",
    when: "On request",
    kind: "Online webinar",
    meta: "1 session",
    points: [
      "One session for the people opening a school.",
      "Covers attendance, classes, and parent access.",
      "Scheduled when your team can attend.",
    ],
    image: "/marketing/middle.jpg",
    photo: false,
  },
  {
    slug: "creative-media-studio",
    title: "Creative media studio",
    blurb: "A short workshop on stories, images, and class projects.",
    when: "On request",
    kind: "Online webinar",
    meta: "7 hours",
    points: [
      "Stories, images, and class projects in one workshop.",
      "Seven hours, split the way the school prefers.",
      "Held on request, not as a ticketed course.",
    ],
    image: "/marketing/high.jpg",
    photo: false,
  },
] as const;

export const WAYS = [
  {
    title: "Real-time classes",
    body: "Live rooms with the teacher and the section together.",
  },
  {
    title: "Group sections",
    body: "Students study with their class, not in a pile of separate tools.",
  },
  {
    title: "Your own pace",
    body: "Work that can wait until after the live hour.",
  },
] as const;

export const STATS = [
  { value: "K–12", label: "Programs in one school" },
  { value: "9", label: "Modules for the school day" },
  { value: "1", label: "Record per student" },
  { value: "8", label: "Roles, one login" },
] as const;

export const COURSES = [
  {
    slug: "media-and-storytelling",
    level: "High school",
    title: "Media & storytelling",
    body: "How stories are made, shared, and read across class projects.",
    points: [
      "How a story is made and how a class reads it.",
      "Projects stay on the student record.",
      "An example a school can publish. It is not a course for sale.",
    ],
    meta: "12 lessons · 1 year",
    faculty: "Literature faculty",
    image: "/marketing/high.jpg",
  },
  {
    slug: "foundational-english",
    level: "Elementary",
    title: "Foundational English",
    body: "Reading, writing, and speaking for the early grades.",
    points: [
      "Reading, writing, and speaking in short sessions.",
      "Meant for the early grades.",
      "A sample program. Your school sets the real syllabus.",
    ],
    meta: "24 lessons · 1 year",
    faculty: "Early grades team",
    image: "/marketing/elementary.jpg",
  },
  {
    slug: "plants-and-our-planet",
    level: "Middle school",
    title: "Plants & our planet",
    body: "Living things, weather, and the ground under a schoolyard.",
    points: [
      "Living things, weather, and the schoolyard.",
      "A science block a section can run together.",
      "Shown here as a sample, not a checkout item.",
    ],
    meta: "24 lessons · 1 year",
    faculty: "Science faculty",
    image: "/marketing/middle.jpg",
  },
  {
    slug: "computing-basics",
    level: "High school",
    title: "Computing basics",
    body: "Problems, patterns, and the systems behind a class laptop.",
    points: [
      "Problems, patterns, and the systems on a class laptop.",
      "A longer sample, across eighteen months.",
      "Your school names the teacher and the fee.",
    ],
    meta: "36 lessons · 18 months",
    faculty: "Computing faculty",
    image: "/marketing/classroom.jpg",
  },
  {
    slug: "art-studio",
    level: "Elementary",
    title: "Art studio",
    body: "Drawing, color, and making, in short weekly sessions.",
    points: [
      "Drawing, color, and making.",
      "Short weekly sessions for elementary.",
      "A sample of what a school can list under academics.",
    ],
    meta: "12 lessons · 6 months",
    faculty: "Arts faculty",
    image: "/marketing/elementary.jpg",
  },
  {
    slug: "motion-and-energy",
    level: "Middle school",
    title: "Motion & energy",
    body: "Forces, motion, and the experiments a section can run together.",
    points: [
      "Forces, motion, and experiments a section can run.",
      "Kept with the same class list as the rest of the week.",
      "An example program, not a product you buy here.",
    ],
    meta: "36 lessons · 1 year",
    faculty: "Science faculty",
    image: "/marketing/middle.jpg",
  },
] as const;

export const NOTES = [
  {
    slug: "a-school-week-in-one-login",
    title: "A school week in one login",
    body: "Attendance, grades, and fees stop living in three different tools.",
    paragraphs: [
      "A school week spreads fast when attendance sits in one file, grades in another, and fees in a third inbox.",
      "Schola keeps those three on the student who earned them. The teacher marks the day. The office sends the invoice. The family opens the same record.",
      "The academics page lists the programs. The school desk is where the week is actually marked.",
    ],
    href: "/news/a-school-week-in-one-login",
    related: "/features",
    relatedLabel: "See the school desk",
    date: "Guide",
    image: "/marketing/classroom.jpg",
    featured: true,
  },
  {
    slug: "what-to-open-in-the-first-week",
    title: "What to open in the first week",
    body: "Academic year, classes, then the people who teach and learn in them.",
    paragraphs: [
      "The first week is a sequence, not a tour of every module.",
      "Open the academic year. Add classes and sections. Then add the teachers, students, and parents who belong in them.",
      "Admissions walks through the account, the email confirmation, and the school review before that week starts.",
    ],
    href: "/news/what-to-open-in-the-first-week",
    related: "/admissions",
    relatedLabel: "Read admissions",
    date: "Guide",
    image: "/marketing/middle.jpg",
    featured: false,
  },
  {
    slug: "pricing-that-follows-enrollment",
    title: "Pricing that follows enrollment",
    body: "You pay for active students. Staff, parents, and graduates are not a seat fee.",
    paragraphs: [
      "A seat fee that counts every parent and every graduate gets expensive before the first lesson.",
      "Schola bills active students. Staff, parents, and graduates are not a seat. Early access is free.",
      "The pricing page lists the Starter and Growth tiers in full.",
    ],
    href: "/news/pricing-that-follows-enrollment",
    related: "/pricing",
    relatedLabel: "See pricing",
    date: "Pricing",
    image: "/marketing/high.jpg",
    featured: false,
  },
  {
    slug: "how-a-family-follows-the-week",
    title: "How a family follows the week",
    body: "Parents see the same attendance, remarks, and fee record the school keeps.",
    paragraphs: [
      "A family should not need a second system to know whether a child was in class.",
      "Parents use the same login. They see attendance, teacher remarks, and the fee record the school already keeps.",
      "If your school is not on Schola yet, start with admissions or write to the team.",
    ],
    href: "/news/how-a-family-follows-the-week",
    related: "/contact",
    relatedLabel: "Contact the school",
    date: "Admissions",
    image: "/marketing/elementary.jpg",
    featured: false,
  },
] as const;

export const FAQ_GROUPS = [
  {
    id: "opening",
    title: "Opening a school",
    lede: "The account, the email check, and the first week on the desk.",
    items: [
      {
        question: "How does a new school open?",
        answer:
          "Create an account, confirm the email, and register the school. Schola reviews the application. After approval you open the school desk and invite teachers and families.",
      },
      {
        question: "What has to happen before the desk opens?",
        answer:
          "A password account must confirm the email with the link or the 6-digit code. The school application then waits for review. A pending school cannot mark attendance until that review is done.",
      },
      {
        question: "What should I open in the first week?",
        answer:
          "The academic year first, then classes and sections, then the teachers, students, and parents who belong in them. The rest of the modules sit on that roster.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    lede: "Who is billed, what early access covers, and how a school leaves.",
    items: [
      {
        question: "What does it cost?",
        answer:
          "Early access is free. After that, Starter stays within 250 students, Growth is $1.50 per active student each month, and Enterprise is a quote. Staff, parents, and graduates are not a seat fee.",
      },
      {
        question: "What counts as an active student?",
        answer:
          "A student with an enrollment in the current academic year. Graduated, transferred, and withdrawn students are not billed.",
      },
      {
        question: "Is there a setup fee?",
        answer:
          "No. Schola is self-serve. Growth and Enterprise can ask for help with an import. There is no charge to open the account.",
      },
      {
        question: "Do parents and staff count toward the bill?",
        answer:
          "No. Only active students are counted. Parent access and staff seats are included on every plan.",
      },
      {
        question: "When does free early access end?",
        answer:
          "Every early-access school gets at least 30 days’ notice before a tier introduces a charge.",
      },
      {
        question: "Can I cancel, and do I keep the records?",
        answer:
          "Yes. A monthly plan ends at the close of the billing period. Export attendance, grades, fees, and payroll to CSV or PDF. The records are not locked in.",
      },
    ],
  },
  {
    id: "school-day",
    title: "The school day",
    lede: "Attendance, grades, and fees, and what the sample courses are.",
    items: [
      {
        question: "Is Schola a course shop?",
        answer:
          "No. A school publishes its own programs, teachers, and fees. The courses on this site are samples of that catalog, not items you can buy.",
      },
      {
        question: "Where do attendance, grades, and fees live?",
        answer:
          "On the same student record. A teacher marks the day, the office sends the invoice, and the family opens that record. They are not three separate tools.",
      },
      {
        question: "How are grades recorded?",
        answer:
          "The gradebook keeps a percentage and a letter grade, plus a teacher remark that stays with the student.",
      },
    ],
  },
  {
    id: "families",
    title: "Families",
    lede: "How a parent joins, and what they are allowed to see.",
    items: [
      {
        question: "How does a family enrol?",
        answer:
          "The school places the student in a class and sends an invite. You confirm the email and use the same login as the rest of the school. There is no public application form on this site.",
      },
      {
        question: "Can parents see attendance and fees?",
        answer:
          "Yes. Parents see the attendance, remarks, and fee record the school keeps. They do not get a separate copy in another tool.",
      },
    ],
  },
  {
    id: "records",
    title: "Records and privacy",
    lede: "What stays inside one school, and what you can take with you.",
    items: [
      {
        question: "Is one school’s data separate from another?",
        answer:
          "Yes. Every class, grade, and fee belongs to one school. A list from one campus is not readable from another. Phone, date of birth, and address are encrypted.",
      },
      {
        question: "Does the site work in dark mode?",
        answer:
          "Yes. The public site and the school desk share the same colors in light and dark. The sun and moon control in the header switches them.",
      },
    ],
  },
  {
    id: "sessions",
    title: "Live sessions",
    lede: "What the events list is, and how a date gets booked.",
    items: [
      {
        question: "Are live sessions on a fixed calendar?",
        answer:
          "No. Events list the formats a school can book. Dates are set with you. Open the session, then write to the team.",
      },
      {
        question: "Is a session a ticket I can buy?",
        answer:
          "No. A session is booked with the school. It is not a checkout item, and it does not have a public price on this site.",
      },
    ],
  },
];

export const FAQ = FAQ_GROUPS.flatMap((group) => group.items);

export function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug);
}

export function academicBySlug(
  slug: string,
):
  | { kind: "program"; item: (typeof PROGRAMS)[number] }
  | { kind: "course"; item: (typeof COURSES)[number] }
  | undefined {
  const program = findBySlug(PROGRAMS, slug);
  if (program) return { kind: "program", item: program };
  const course = findBySlug(COURSES, slug);
  if (course) return { kind: "course", item: course };
  return undefined;
}

export const ACADEMIC_SLUGS = [...PROGRAMS, ...COURSES].map((item) => item.slug);

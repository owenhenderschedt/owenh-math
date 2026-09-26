export type TeachingCourse = {
  title: string
  role: string
  sections?: number
}

export type TeachingSemester = {
  term: 'Fall' | 'Spring' | 'Summer'
  year: number
  courses: TeachingCourse[]
}

export type TeachingInstitution = {
  institution: string
  period: string
  semesters: TeachingSemester[]
}

export type TeachingResource = {
  title: string
  category: string
  type: string
  url: string
}

export const teachingInstitutions: TeachingInstitution[] = [
  {
    institution: 'Iowa State University',
    period: '2026–present',
    semesters: [
      {
        term: 'Fall',
        year: 2026,
        courses: [
          {
            title: 'Calculus III',
            role: 'Recitation Leader',
            sections: 6,
          },
        ],
      },
    ],
  },
  {
    institution: 'Auburn University',
    period: '2021–2026',
    semesters: [
      {
        term: 'Spring',
        year: 2026,
        courses: [
          {
            title: 'Undergraduate Directed Reading: Introduction to Graph Coloring',
            role: 'Instructor of Record',
          },
          {
            title: 'Actuarial Seminar in the Mathematics of Finance',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
      {
        term: 'Fall',
        year: 2025,
        courses: [
          {
            title: 'Mathematics of Interest Theory',
            role: 'Instructor of Record',
            sections: 1,
          },
          {
            title: 'Calculus I',
            role: 'Recitation Leader',
            sections: 1,
          },
        ],
      },
      {
        term: 'Fall',
        year: 2024,
        courses: [
          {
            title: 'College Algebra',
            role: 'Instructor of Record',
            sections: 4,
          },
        ],
      },
      {
        term: 'Summer',
        year: 2024,
        courses: [
          {
            title: 'Calculus III',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
      {
        term: 'Spring',
        year: 2024,
        courses: [
          {
            title: 'Business Calculus II',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
      {
        term: 'Fall',
        year: 2023,
        courses: [
          {
            title: 'Calculus I',
            role: 'Recitation Leader',
            sections: 2,
          },
        ],
      },
      {
        term: 'Summer',
        year: 2023,
        courses: [
          {
            title: 'Calculus III',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
      {
        term: 'Spring',
        year: 2023,
        courses: [
          {
            title: 'College Algebra',
            role: 'Instructor of Record',
            sections: 3,
          },
        ],
      },
      {
        term: 'Fall',
        year: 2022,
        courses: [
          {
            title: 'Calculus I',
            role: 'Recitation Leader',
            sections: 2,
          },
        ],
      },
      {
        term: 'Summer',
        year: 2022,
        courses: [
          {
            title: 'Calculus II',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
      {
        term: 'Fall',
        year: 2021,
        courses: [
          {
            title: 'Pre-Calculus Trigonometry',
            role: 'Instructor of Record',
            sections: 1,
          },
        ],
      },
    ],
  },
]

export const teachingResources: TeachingResource[] = [
  {
    title: 'Graphing Lines Activity',
    category: 'College Algebra & Precalculus',
    type: 'Classroom activity',
    url: 'https://docs.google.com/document/d/1s1uoE7KOp2g-WuDdVTfZ34sTysMrFgaP/edit?usp=sharing',
  },
  {
    title: 'Introduction to Polynomials Activity',
    category: 'College Algebra & Precalculus',
    type: 'Classroom activity',
    url: 'https://docs.google.com/document/d/16al0Xf6_Sgr5BAdZRKlWHmBQK7m2dwWe/edit?usp=sharing',
  },
  {
    title: 'Precalculus with Trigonometry — One-Page Study Guide',
    category: 'College Algebra & Precalculus',
    type: 'Study guide',
    url: 'https://drive.google.com/file/d/1GpaReLEYf87QPSBK_jIbYcEYhaoKpzXV/view?usp=sharing',
  },
  {
    title: 'Calculus III — Lecture Notes, Practice Tests & Review Problems',
    category: 'Calculus III',
    type: 'Course materials',
    url: 'https://drive.google.com/file/d/13na5xxEg1tXI6H-SHGNp8JyHelMBpSk8/view?usp=sharing',
  },
  {
    title: 'Book of Proofs',
    category: 'Proof & Exposition',
    type: 'Book',
    url: 'https://drive.google.com/file/d/10RWu5NuI3IgPxXI7Arr015Rkv_E5RacU/view?usp=sharing',
  },
  {
    title: "Conway's Peg Board",
    category: 'Proof & Exposition',
    type: 'Presentation',
    url: 'https://drive.google.com/file/d/1WDlISHthAgVafAZl9VZqrFgjYVbcST6w/view?usp=sharing',
  },
]

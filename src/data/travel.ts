export type TravelPhoto = {
  src: string
  alt: string
  caption?: string
}

export type TravelEvent = {
  title: string
  date: string
  detail?: string
  photos?: TravelPhoto[]
}

export type TravelPlace = {
  id: string
  name: string
  region: string
  coordinates: [number, number]
  events: TravelEvent[]
}

export const travelPlaces: TravelPlace[] = [
  {
    id: 'smithfield',
    name: 'Smithfield',
    region: 'Rhode Island, USA',
    coordinates: [-71.536, 41.922],
    events: [
      {
        title: 'Bryant University',
        date: '2016–2020',
        detail: 'Bachelor of Science in Actuarial Mathematics.',
      },
    ],
  },

  {
    id: 'boston',
    name: 'Boston',
    region: 'Massachusetts, USA',
    coordinates: [-71.0589, 42.3601],
    events: [
      {
        title: 'Recent Trends in Graph Theory · AMS Meeting #1215',
        date: 'March 2026',
        detail: 'Invited talk: Extending total colorings in planar graphs.',
      },
    ],
  },

  {
    id: 'atlanta',
    name: 'Atlanta',
    region: 'Georgia, USA',
    coordinates: [-84.388, 33.749],
    events: [
      {
        title: 'Combinatorics Seminar · Georgia State University',
        date: 'March 2026',
        detail: 'Invited talk: Extending total colorings in planar graphs.',
      },
      {
        title: 'Graph Theory Seminar · Georgia Institute of Technology',
        date: 'September 2024',
        detail: 'Invited talk: On orientations with forbidden out-degrees.',
      },
    ],
  },

  {
    id: 'washington-dc',
    name: 'Washington, D.C.',
    region: 'USA',
    coordinates: [-77.0369, 38.9072],
    events: [
      {
        title: 'Joint Mathematics Meetings · Nonconventional Methods in Combinatorics',
        date: 'January 2026',
        detail: 'Invited talk: Extending total colorings in planar graphs.',
      },
    ],
  },

  {
    id: 'new-orleans',
    name: 'New Orleans',
    region: 'Louisiana, USA',
    coordinates: [-90.0715, 29.9511],
    events: [
      {
        title: 'Recent Advances in Graph Theory · AMS Meeting #1210',
        date: 'October 2025',
        detail: 'Invited talk: Extending total colorings in planar graphs.',
      },
    ],
  },

  {
    id: 'seattle',
    name: 'Seattle',
    region: 'Washington, USA',
    coordinates: [-122.3321, 47.6062],
    events: [
      {
        title: 'Joint Mathematics Meetings',
        date: 'January 2025',
        detail:
          'Two special-session talks: one on orientations with forbidden out-degrees and one on odd and proper conflict-free colorings.',
      },
    ],
  },

  {
    id: 'budapest',
    name: 'Budapest',
    region: 'Hungary',
    coordinates: [19.0402, 47.4979],
    events: [
      {
        title: 'Discrete Geometry Days',
        date: 'July 2024',
        detail:
          'Invited talk: On the number of points a given circle can cover from a finite point-set.',
      },
      {
        title: 'Discrete Geometry Summer School · Rényi Institute',
        date: 'August 2023',
      },
    ],
  },

  {
    id: 'mobile',
    name: 'Mobile',
    region: 'Alabama, USA',
    coordinates: [-88.0399, 30.6954],
    events: [
      {
        title: 'Special Session on Discrete Geometry · AMS Meeting #1190',
        date: 'October 2023',
        detail: 'Invited talk: Evading squares without a map — a new approach.',
      },
    ],
  },

  {
    id: 'ames',
    name: 'Ames',
    region: 'Iowa, USA',
    coordinates: [-93.6319, 42.0308],
    events: [
      {
        title: 'Graduate Research Workshop in Combinatorics',
        date: 'July 2026',
      },
      {
        title: 'Topological Methods in Combinatorics Summer School',
        date: 'May 2025',
      },
      {
        title: 'Iowa State University · Discrete Math Seminar',
        date: 'October 2026',
        detail:
          'A finite victory over de Bruijn–Erdős in interval discrepancy.',
      },
      {
        title: 'Postdoctoral Research · Iowa State University',
        date: '2026–2028',
      },
    ],
  },

  {
    id: 'auburn',
    name: 'Auburn',
    region: 'Alabama, USA',
    coordinates: [-85.4808, 32.6099],
    events: [
      {
        title: 'Ph.D. in Mathematics · Auburn University',
        date: '2020–2026',
        detail:
          'Graduate study, research, teaching, seminars, REU talks, and mathematical community.',
      },
      {
        title: 'Preparing Future Faculty',
        date: 'Fall 2025',
      },
    ],
  },

  {
    id: 'banff',
    name: 'Banff',
    region: 'Alberta, Canada',
    coordinates: [-115.5708, 51.1784],
    events: [
      {
        title: 'Cross Community Collaborations in Combinatorics Workshop · BIRS',
        date: 'June 2026',
      },
    ],
  },

  {
    id: 'csu-mountain',
    name: 'CSU Mountain Campus',
    region: 'Colorado, USA',
    coordinates: [-105.5936, 40.5672],
    events: [
      {
        title: 'Flag Algebra Workshop',
        date: 'June 2026',
      },
    ],
  },

  {
    id: 'milwaukee',
    name: 'Milwaukee',
    region: 'Wisconsin, USA',
    coordinates: [-87.9065, 43.0389],
    events: [
      {
        title: 'Graduate Research Workshop in Combinatorics',
        date: 'May 2024',
      },
    ],
  },

  {
    id: 'anza-borrego',
    name: 'Anza-Borrego',
    region: 'California, USA',
    coordinates: [-116.399, 33.259],
    events: [
      {
        title: 'Workshop in Extremal Combinatorics',
        date: 'January 2024',
      },
    ],
  },

  {
    id: 'laramie',
    name: 'Laramie',
    region: 'Wyoming, USA',
    coordinates: [-105.5911, 41.3114],
    events: [
      {
        title: 'Graduate Research Workshop in Combinatorics',
        date: 'July 2023',
      },
    ],
  },
]

export type ResearchGame = {
  id: string
  title: string
  description: string
  status: 'playable' | 'coming-soon'
  relatedPaper?: {
    title: string
    venue?: string
    journal?: string
    arxiv?: string
  }
}

export type ResearchArea = {
  id: string
  title: string
  description: string
  games: ResearchGame[]
}

export const researchAreas: ResearchArea[] = [
  {
    id: 'graph-coloring',
    title: 'Graph Coloring',
    description:
      'Coloring, recoloring, and local coloring conditions on graphs.',
    games: [
      {
        id: 'total-coloring',
        title: 'Total Coloring',
        description:
          'Color every vertex and edge of a graph while avoiding conflicts. How few colors can you use?',
        status: 'coming-soon',
      },
      {
        id: 'recoloring',
        title: 'Recoloring',
        description:
          'Move between proper colorings one legal vertex recoloring at a time.',
        status: 'coming-soon',
        relatedPaper: {
          title: '(2K₂, K₄)-free graphs are recolorable',
          arxiv: 'https://arxiv.org/abs/2609.28893',
        },
      },
      {
        id: 'proper-conflict-free-coloring',
        title: 'Proper Conflict-Free Coloring',
        description:
          'Build proper colorings in which neighborhoods contain uniquely occurring colors.',
        status: 'coming-soon',
        relatedPaper: {
          title:
            'The forb-flex method for odd coloring and proper conflict-free coloring of planar graphs',
          venue: 'Discrete Mathematics, 348, Article 114648',
          journal: 'https://doi.org/10.1016/j.disc.2025.114648',
          arxiv: 'https://arxiv.org/abs/2401.14590',
        },
      },
    ],
  },
  {
    id: 'ramsey-theory',
    title: 'Ramsey Theory',
    description:
      'Edge colorings of complete graphs and the colored structures they force.',
    games: [
      {
        id: 'odd-ramsey',
        title: 'Odd Ramsey',
        description:
          'Color complete graphs and explore Ramsey conditions involving odd color patterns.',
        status: 'coming-soon',
      },
      {
        id: 'purple-ramsey',
        title: 'Purple Ramsey',
        description:
          'Search for colorings that avoid the configurations arising in purple Ramsey problems.',
        status: 'coming-soon',
      },
    ],
  },
  {
    id: 'orientations',
    title: 'Graph Orientations',
    description:
      'Direct graph edges while controlling local outdegree behavior.',
    games: [
      {
        id: 'forbidden-outdegrees',
        title: 'Forbidden Outdegrees',
        description:
          'Orient every edge while avoiding prescribed outdegrees at the vertices.',
        status: 'coming-soon',
        relatedPaper: {
          title: 'On orientations with forbidden out-degrees',
          venue: 'Discrete Applied Mathematics, 387, 116–123',
          journal: 'https://doi.org/10.1016/j.dam.2026.02.048',
          arxiv: 'https://arxiv.org/abs/2406.05095',
        },
      },
    ],
  },
  {
    id: 'discrete-geometry',
    title: 'Discrete Geometry',
    description:
      'Finite point sets, coverings, diameter constraints, and geometric extremal problems.',
    games: [
      {
        id: 'diameter-one-sets',
        title: 'Diameter-One Sets',
        description:
          'Arrange finite point sets subject to a diameter constraint.',
        status: 'coming-soon',
      },
      {
        id: 'circle-coverings',
        title: 'Circle Coverings',
        description:
          'Move points and covering circles to investigate extremal covering questions.',
        status: 'coming-soon',
      },
      {
        id: 'fractional-jung',
        title: 'Fractional Jung',
        description:
          'Explore how much of a finite point set can be captured below the classical Jung radius.',
        status: 'coming-soon',
      },
    ],
  },
]

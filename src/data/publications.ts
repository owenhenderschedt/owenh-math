export type Publication = {
  title?: string
  titlePrefix?: string
  titleMath?: string
  titleSuffix?: string
  authors: string[]
  year: number
  status: string
  venue?: string
  arxiv?: string
  journal?: string
}

export const publications: Publication[] = [
  {
    titlePrefix: 'Yes, ',
    titleMath: '(2K_2,K_4)',
    titleSuffix: '-free graphs are recolorable',
    authors: ['Henry Echeverría', 'Owen Henderschedt'],
    year: 2026,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2609.28893',
  },
  {
    title: 'A finite victory over de Bruijn–Erdős in interval discrepancy',
    authors: ['Jared DeLeo', 'Owen Henderschedt', 'Chris Wells'],
    year: 2026,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2605.29166',
  },
  {
    title: 'Extending total colorings in planar graphs',
    authors: ['Owen Henderschedt', 'Jessica McDonald'],
    year: 2025,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2509.18940',
  },
  {
    title: 'Odd Ramsey numbers of multipartite graphs and hypergraphs',
    authors: [
      'Nicholas Crawford',
      'Emily Heath',
      'Owen Henderschedt',
      'Coy Schwieder',
      'Shira Zerbib',
    ],
    year: 2025,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2507.19456',
  },
  {
    title: 'Total coloring graphs with large minimum degree',
    authors: ['Owen Henderschedt', 'Jessica McDonald', 'Songling Shan'],
    year: 2025,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2507.05548',
  },
  {
    title: 'Graphs generated from minimal sets of finite point-set topologies',
    authors: ['Ketai Chen', 'Jared DeLeo', 'Owen Henderschedt'],
    year: 2025,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2503.22490',
  },
  {
    title: 'On orientations with forbidden out-degrees',
    authors: ['Owen Henderschedt', 'Jessica McDonald'],
    year: 2026,
    status: 'Published',
    venue: 'Discrete Applied Mathematics, 387, 116–123',
    journal: 'https://doi.org/10.1016/j.dam.2026.02.048',
    arxiv: 'https://arxiv.org/abs/2406.05095',
  },
  {
    title: 'Short path and short chain problems in the plane',
    authors: ['András Bezdek', 'Owen Henderschedt'],
    year: 2026,
    status: 'Published',
    venue: 'New Probes into Discrete and Convex Geometry, Bolyai Society Mathematical Studies 33, Springer',
    journal: 'https://link.springer.com/book/9783032259288',
  },
  {
    title: 'Shrinking the Jung radius: Maximizing partial coverage of finite point sets',
    authors: ['András Bezdek', 'Owen Henderschedt'],
    year: 2024,
    status: 'Preprint',
    arxiv: 'https://arxiv.org/abs/2407.03553',
  },
  {
    title: 'The forb-flex method for odd coloring and proper conflict-free coloring of planar graphs',
    authors: [
      'James Anderson',
      'Herman Chau',
      'Eun-Kyung Cho',
      'Nicholas Crawford',
      'Stephen G. Hartke',
      'Emily Heath',
      'Owen Henderschedt',
      'Hyemin Kwon',
      'Zhiyuan Zhang',
    ],
    year: 2025,
    status: 'Published',
    venue: 'Discrete Mathematics, 348, Article 114648',
    journal: 'https://doi.org/10.1016/j.disc.2025.114648',
    arxiv: 'https://arxiv.org/abs/2401.14590',
  },
  {
    title: "On Conway's Brussels Sprouts",
    authors: ['András Bezdek', 'Haile Gilroy', 'Owen Henderschedt', 'Alason Lakhani'],
    year: 2023,
    status: 'Published',
    venue: 'Studia Scientiarum Mathematicarum Hungarica, 60(1), 76–90',
    journal: 'https://doi.org/10.1556/012.2023.01535',
  },
]

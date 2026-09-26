import type { ResourceFolder } from '../types'

export const resourceTree: ResourceFolder = {
  id: 'resources',
  type: 'folder',
  title: 'Teaching Resources',
  description: 'Browse notes, practice material, activities, and course resources.',
  children: [
    {
      id: 'calculus',
      type: 'folder',
      title: 'Calculus',
      description: 'Calculus I, II, and III',
      children: [
        {
          id: 'calculus-1',
          type: 'folder',
          title: 'Calculus I',
          children: [],
        },
        {
          id: 'calculus-2',
          type: 'folder',
          title: 'Calculus II',
          children: [],
        },
        {
          id: 'calculus-3',
          type: 'folder',
          title: 'Calculus III',
          description: 'Multivariable calculus, vector calculus, and three-dimensional geometry',
          children: [
            {
              id: 'calc3-notes-lessons',
              type: 'folder',
              title: 'Notes & Lessons',
              description: 'Chapter-by-chapter instructional notes and examples',
              children: [
                {
                  id: 'calc3-chapter-12',
                  type: 'folder',
                  title: 'Chapter 12 — Vectors & 3D Geometry',
                  description: 'Vectors, geometry, lines, planes, and surfaces in three dimensions',
                  children: [
                    {
                      id: 'calc3-12-1',
                      type: 'file',
                      title: '12.1 Three-Dimensional Coordinate Systems',
                      description: '3D coordinates · projections · distance & midpoint · spheres',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-1-three-dimensional-coordinate-systems.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-1-three-dimensional-coordinate-systems.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-12-2',
                      type: 'file',
                      title: '12.2 Vectors',
                      description: 'Vector arithmetic · component form · magnitude · unit vectors · basis vectors',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-2-vectors.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-2-vectors.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-12-3',
                      type: 'file',
                      title: '12.3 Dot Product',
                      description: 'Dot product · angles & orthogonality · projections · work',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-3-dot-product.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-3-dot-product.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-12-4',
                      type: 'file',
                      title: '12.4 Cross Product',
                      description: 'Cross product · normal vectors · area · scalar triple product · torque',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-4-cross-product.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-4-cross-product.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-12-5',
                      type: 'file',
                      title: '12.5 Equations of Lines and Planes',
                      description: 'Parametric & symmetric equations · planes · intersections & angles · distances',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-5-lines-and-planes.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-5-lines-and-planes.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-12-6',
                      type: 'file',
                      title: '12.6 Cylinders and Quadric Surfaces',
                      description: 'Traces · cylinders · ellipsoids & hyperboloids · cones · paraboloids',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-6-cylinders-and-quadric-surfaces.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-12/12-6-cylinders-and-quadric-surfaces.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-chapter-13',
                  type: 'folder',
                  title: 'Chapter 13 — Vector Functions & Motion',
                  description: 'Vector-valued functions, space curves, motion, arc length, and curvature',
                  children: [
                    {
                      id: 'calc3-13-1',
                      type: 'file',
                      title: '13.1 Vector Functions and Space Curves',
                      description: 'Vector-valued functions · domains · limits & continuity · space curves · line segments',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-1-vector-functions-and-space-curves.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-1-vector-functions-and-space-curves.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-13-2',
                      type: 'file',
                      title: '13.2 Derivatives and Integrals of Vector Functions',
                      description: 'Vector derivatives · tangent & unit tangent vectors · derivative rules · tangent lines · vector integrals',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-2-derivatives-and-integrals-of-vector-functions.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-2-derivatives-and-integrals-of-vector-functions.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-13-3',
                      type: 'file',
                      title: '13.3 Arc Length and Curvature',
                      description: 'Arc length · arc-length parameterization · curvature · TNB frames',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-3-arc-length-and-curvature.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-13/13-3-arc-length-and-curvature.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-chapter-14',
                  type: 'folder',
                  title: 'Chapter 14 — Partial Derivatives',
                  description: 'Limits, partial derivatives, gradients, optimization, and constrained extrema',
                  children: [
                    {
                      id: 'calc3-14-2',
                      type: 'file',
                      title: '14.2 Limits and Continuity',
                      description: 'Multivariable limits · path dependence · squeeze theorem · continuity · polar coordinates',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-2-limits-and-continuity.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-2-limits-and-continuity.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-3',
                      type: 'file',
                      title: '14.3 Partial Derivatives',
                      description: 'Partial derivatives · geometric meaning · higher-order partials · Clairaut’s theorem',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-3-partial-derivatives.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-3-partial-derivatives.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-4',
                      type: 'file',
                      title: '14.4 Tangent Planes and Normal Lines',
                      description: 'Gradients as normals · tangent planes · normal lines · level curves & surfaces',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-4-tangent-planes-and-normal-lines.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-4-tangent-planes-and-normal-lines.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-5',
                      type: 'file',
                      title: '14.5 The Chain Rule',
                      description: 'Multivariable chain rule · dependency trees · intermediate variables · implicit differentiation',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-5-the-chain-rule.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-5-the-chain-rule.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-6',
                      type: 'file',
                      title: '14.6 Directional Derivatives & Gradient Vectors',
                      description: 'Directional derivatives · gradients · unit directions · steepest ascent',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-6-directional-derivatives-and-gradient-vectors.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-6-directional-derivatives-and-gradient-vectors.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-7',
                      type: 'file',
                      title: '14.7 Maximum and Minimum Values',
                      description: 'Critical points · second derivative test · saddle points · absolute extrema',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-7-maximum-and-minimum-values.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-7-maximum-and-minimum-values.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-14-8',
                      type: 'file',
                      title: '14.8 Lagrange Multipliers',
                      description: 'Constrained optimization · level curves · gradients · absolute extrema',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-8-lagrange-multipliers.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-14/14-8-lagrange-multipliers.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-chapter-15',
                  type: 'folder',
                  title: 'Chapter 15 — Multiple Integrals',
                  description: 'Double and triple integrals, coordinate systems, and change of variables',
                  children: [
                    {
                      id: 'calc3-15-1',
                      type: 'file',
                      title: '15.1 Double Integrals over Rectangles',
                      description: 'Riemann sums · double integrals · iterated integrals · Fubini’s theorem · volume',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-1-double-integrals-over-rectangles.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-1-double-integrals-over-rectangles.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-15-2',
                      type: 'file',
                      title: '15.2 Double Integrals over General Regions',
                      description: 'Type I & II regions · setting bounds · order of integration · changing integration order',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-2-double-integrals-over-general-regions.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-2-double-integrals-over-general-regions.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-15-3',
                      type: 'file',
                      title: '15.3 Double Integrals with Polar Coordinates',
                      description: 'Polar conversion · polar regions · area element r dr dθ · area by double integrals',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-3-double-integrals-with-polar-coordinates.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-3-double-integrals-with-polar-coordinates.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-15-6',
                      type: 'file',
                      title: '15.6 Triple Integrals',
                      description: 'Triple integrals · spatial regions · order of integration · x-, y-, and z-simple regions',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-6-triple-integrals.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-6-triple-integrals.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-15-8',
                      type: 'file',
                      title: '15.8 Triple Integrals with Spherical Coordinates',
                      description: 'Spherical coordinates · coordinate conversion · spherical regions · volume element',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-8-triple-integrals-with-spherical-coordinates.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-8-triple-integrals-with-spherical-coordinates.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-15-9',
                      type: 'file',
                      title: '15.9 Change of Variables in Multiple Integrals',
                      description: 'Coordinate transformations · Jacobians · transformed regions · change-of-variables formula',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-9-change-of-variables-in-multiple-integrals.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-15/15-9-change-of-variables-in-multiple-integrals.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-chapter-16',
                  type: 'folder',
                  title: 'Chapter 16 — Vector Calculus',
                  description: 'Vector fields, line integrals, conservative fields, Green’s theorem, curl, and divergence',
                  children: [
                    {
                      id: 'calc3-16-1',
                      type: 'file',
                      title: '16.1 Vector Fields',
                      description: 'Vector fields · gradient fields · conservative fields · visualization',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-1-vector-fields.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-1-vector-fields.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-16-2',
                      type: 'file',
                      title: '16.2 Line Integrals',
                      description: 'Scalar line integrals · arc length · mass along curves · work in vector fields',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-2-line-integrals.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-2-line-integrals.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-16-3',
                      type: 'file',
                      title: '16.3 The Fundamental Theorem for Line Integrals',
                      description: 'Conservative fields · potential functions · path independence · closed curves',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-3-fundamental-theorem-for-line-integrals.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-3-fundamental-theorem-for-line-integrals.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-16-4',
                      type: 'file',
                      title: '16.4 Green’s Theorem',
                      description: 'Simple closed curves · circulation · Green’s theorem · line and double integrals',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-4-greens-theorem.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-4-greens-theorem.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-16-5',
                      type: 'file',
                      title: '16.5 Curl and Divergence',
                      description: 'Divergence · curl · the del operator · conservative vector fields',
                      category: 'Lesson Notes',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-5-curl-and-divergence.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/notes-lessons/chapter-16/16-5-curl-and-divergence.tex',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'calc3-practice-worksheets',
              type: 'folder',
              title: 'Practice & Worksheets',
              description: 'Checkpoints, recitation practice, and extra problems',
              children: [
                {
                  id: 'calc3-checkpoints',
                  type: 'folder',
                  title: 'Lesson Checkpoints',
                  description: 'Short concept checks with problems and answers',
                  children: [
                    {
                      id: 'calc3-checkpoint-12-2',
                      type: 'file',
                      title: '12.2 Vectors — Checkpoint',
                      description: 'Vector components · dimension · magnitude · unit vectors · parallel vectors',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-2-vectors-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-2-vectors-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-12-3',
                      type: 'file',
                      title: '12.3 Dot Product — Checkpoint',
                      description: 'Dot products · angles between vectors · orthogonality · vector projections',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-3-dot-product-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-3-dot-product-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-12-4',
                      type: 'file',
                      title: '12.4 Cross Product — Checkpoint',
                      description: 'Cross products · orientation · geometric area · magnitude · orthogonality',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-4-cross-product-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-4-cross-product-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-12-5-lines',
                      type: 'file',
                      title: '12.5 Lines — Checkpoint',
                      description: 'Lines in 3D · parametric & symmetric forms · parallel lines · intersecting & skew lines',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-5-lines-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-5-lines-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-12-5-planes',
                      type: 'file',
                      title: '12.5 Planes — Checkpoint',
                      description: 'Planes in 3D · normal vectors · plane equations · planes from lines · perpendicular planes',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-5-planes-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/12-5-planes-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-13-1',
                      type: 'file',
                      title: '13.1 Vector Functions — Checkpoint',
                      description: 'Vector functions · limits · derivatives · unit tangent vectors · vector integrals',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/13-1-vector-functions-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/13-1-vector-functions-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-14-2',
                      type: 'file',
                      title: '14.2 Limits and Continuity — Checkpoint',
                      description: 'Functions of two variables · multivariable limits · paths · continuity · nonexistence of limits',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-2-limits-and-continuity-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-2-limits-and-continuity-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-14-3',
                      type: 'file',
                      title: '14.3 Partial Derivatives — Checkpoint',
                      description: 'Partial derivatives · directional dependence · higher-order derivatives · differentiation practice',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-3-partial-derivatives-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-3-partial-derivatives-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-14-4',
                      type: 'file',
                      title: '14.4 Tangent Planes and Normal Lines — Checkpoint',
                      description: 'Level curves · gradients · tangent planes · normal lines · normals to surfaces',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-4-tangent-planes-and-normal-lines-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-4-tangent-planes-and-normal-lines-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-14-5',
                      type: 'file',
                      title: '14.5 The Chain Rule — Checkpoint',
                      description: 'Function composition · multivariable chain rule · dependency trees · implicit differentiation',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-5-chain-rule-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-5-chain-rule-checkpoint.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-checkpoint-14-6',
                      type: 'file',
                      title: '14.6 Directional Derivatives — Checkpoint',
                      description: 'Unit directions · directional derivatives · gradients · steepest ascent',
                      category: 'Checkpoint',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-6-directional-derivatives-checkpoint.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/checkpoints/14-6-directional-derivatives-checkpoint.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-recitation-practice',
                  type: 'folder',
                  title: 'Recitation Concept Practice',
                  description: 'Focused practice sheets with answer keys for core Calculus III skills',
                  children: [
                    {
                      id: 'calc3-recitation-quiz-01',
                      type: 'file',
                      title: 'Quiz 01 Concept Practice',
                      description: 'Coordinate systems & surfaces · vectors & lines · sphere/cone geometry · volume',
                      category: 'Recitation Practice',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-01-concept-practice.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-01-concept-practice.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-recitation-quiz-02',
                      type: 'file',
                      title: 'Quiz 02 Concept Practice',
                      description: 'Planes · cross products · projections · parallel lines · dot products & angles',
                      category: 'Recitation Practice',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-02-concept-practice.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-02-concept-practice.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-recitation-quiz-03',
                      type: 'file',
                      title: 'Quiz 03 Concept Practice',
                      description: 'Vector motion · tangent lines · quadric surfaces · spherical/Cartesian conversions',
                      category: 'Recitation Practice',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-03-concept-practice.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-03-concept-practice.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-recitation-quiz-04',
                      type: 'file',
                      title: 'Quiz 04 Concept Practice',
                      description: 'Position, velocity & acceleration · osculating planes · arc length · curvature',
                      category: 'Recitation Practice',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-04-concept-practice.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/recitation-practice/quiz-04-concept-practice.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-extra-practice',
                  type: 'folder',
                  title: 'Worksheets & Extra Practice',
                  description: 'Longer practice sets for important Calculus III techniques',
                  children: [
                    {
                      id: 'calc3-partial-derivatives-worksheet',
                      type: 'file',
                      title: '14.2 Partial Derivatives Worksheet',
                      description: 'First-order partial derivatives · second-order partial derivatives · Clairaut’s theorem · differentiation practice',
                      category: 'Worksheet',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/extra-practice/14-2-partial-derivatives-worksheet.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-chain-rule-worksheet',
                      type: 'file',
                      title: '14.5 Chain Rule Worksheet',
                      description: 'Multivariable chain rule · derivative trees · nested dependencies · derivatives with respect to parameters',
                      category: 'Worksheet',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/extra-practice/14-5-chain-rule-worksheet.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-multiple-integrals-practice',
                      type: 'file',
                      title: '15.2–15.6 Multiple Integrals Practice',
                      description: 'Double & triple integrals · interpreting integrals · polar coordinates · spatial regions · mass density',
                      category: 'Extra Practice',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/practice-worksheets/extra-practice/15-2-to-15-6-multiple-integrals-practice.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/practice-worksheets/extra-practice/15-2-to-15-6-multiple-integrals-practice.tex',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'calc3-exams-reviews',
              type: 'folder',
              title: 'Exams & Reviews',
              description: 'Exams, practice material, and test reviews',
              children: [
                {
                  id: 'calc3-exams',
                  type: 'folder',
                  title: 'Exams',
                  description: 'Past Calculus III exams for practice and review',
                  children: [
                    {
                      id: 'calc3-exam-1-summer-2024',
                      type: 'file',
                      title: 'Exam 1 — Summer 2024',
                      description: 'Vectors · dot & cross products · lines & planes · vector functions · tangent lines',
                      category: 'Exam',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-1-summer-2024.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-1-summer-2024.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-exam-2-summer-2023',
                      type: 'file',
                      title: 'Exam 2 — Summer 2023',
                      description: 'Partial derivatives · chain rule · extrema · directional derivatives · tangent planes · curvature',
                      category: 'Exam',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-2-summer-2023.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-2-summer-2023.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-exam-2-summer-2024',
                      type: 'file',
                      title: 'Exam 2 — Summer 2024',
                      description: 'Partial derivatives · chain rule · extrema · directional derivatives · tangent planes · absolute extrema',
                      category: 'Exam',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-2-summer-2024.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-2-summer-2024.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-exam-3-summer-2024',
                      type: 'file',
                      title: 'Exam 3 — Summer 2024',
                      description: 'Double & triple integrals · polar & spherical coordinates · change of variables · mass',
                      category: 'Exam',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-3-summer-2024.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/exam-3-summer-2024.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-final-exam-summer-2024',
                      type: 'file',
                      title: 'Final Exam — Summer 2024',
                      description: 'Multivariable derivatives · extrema · multiple integrals · transformations · line integrals · curl & divergence',
                      category: 'Exam',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/final-exam-summer-2024.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/exams/final-exam-summer-2024.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-test-reviews',
                  type: 'folder',
                  title: 'Test Reviews',
                  description: 'Comprehensive review sets organized around the major Calculus III exams',
                  children: [
                    {
                      id: 'calc3-test-1-review',
                      type: 'file',
                      title: 'Test 1 Review',
                      description: 'Vector algebra · dot & cross products · lines & planes · vector functions · vector differentiation & integration',
                      category: 'Test Review',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-1-review.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-1-review.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-test-2-review',
                      type: 'file',
                      title: 'Test 2 Review',
                      description: 'Multivariable limits · partial derivatives · chain rule · directional derivatives · tangent planes · extrema & Lagrange multipliers',
                      category: 'Test Review',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-2-review.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-2-review.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-test-3-review',
                      type: 'file',
                      title: 'Test 3 Review',
                      description: 'Polar & spherical coordinates · Riemann sums · double & triple integrals · changing order · Jacobians',
                      category: 'Test Review',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-3-review.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-3-review.tex',
                        },
                      ],
                    },
                    {
                      id: 'calc3-test-4-review',
                      type: 'file',
                      title: 'Test 4 Review',
                      description: 'Line integrals · vector fields · conservative fields & potentials · work · curl & divergence · Green’s theorem',
                      category: 'Test Review',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-4-review.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/exams-reviews/test-reviews/test-4-review.tex',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: 'calc3-course-reference',
              type: 'folder',
              title: 'Course & Reference',
              description: 'Guides, handouts, notation, and reference material',
              children: [
                {
                  id: 'calc3-handouts-reference',
                  type: 'folder',
                  title: 'Handouts & Reference',
                  description: 'Visual guides, notation references, and quick-reference material',
                  children: [
                    {
                      id: 'calc3-tnb-frames',
                      type: 'file',
                      title: 'TNB Frames',
                      description: 'Unit tangent, normal & binormal vectors · geometric interpretation · Frenet frame',
                      category: 'Reference',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/handouts-reference/tnb-frames.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-line-integrals-visual',
                      type: 'file',
                      title: 'Line Integrals — Visual Reference',
                      description: 'Curves in space · scalar line integrals · geometric interpretation',
                      category: 'Visual Reference',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/handouts-reference/line-integrals-visual-reference.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-quadric-surfaces-reference',
                      type: 'file',
                      title: 'Quadric Surfaces Reference',
                      description: 'Ellipsoids · cones · paraboloids · hyperboloids · standard forms & traces',
                      category: 'Reference',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/handouts-reference/quadric-surfaces-reference.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-understanding-notation',
                      type: 'file',
                      title: 'Understanding Calculus III Notation',
                      description: 'Double & triple integrals · gradients · directional derivatives · line integrals · Green’s theorem · curl & divergence',
                      category: 'Reference',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/handouts-reference/understanding-calculus-iii-notation.pdf',
                        },
                        {
                          type: 'tex',
                          path: '/resources/calculus/calculus-3/course-reference/handouts-reference/understanding-calculus-iii-notation.tex',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'calc3-course-guides',
                  type: 'folder',
                  title: 'Course Guides',
                  description: 'Course overviews, review guides, and archived course information',
                  children: [
                    {
                      id: 'calc3-semester-outline-review',
                      type: 'file',
                      title: 'Calculus III Semester Outline & Review Topics',
                      description: 'Vectors & 3D geometry · vector functions · partial derivatives · multiple integrals · vector fields',
                      category: 'Course Guide',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/course-guides/semester-outline-review-topics.pdf',
                        },
                      ],
                    },
                    {
                      id: 'calc3-syllabus-summer-2023',
                      type: 'file',
                      title: 'Course Syllabus — Summer 2023',
                      description: 'Course expectations · grading · homework & exams · attendance · course policies',
                      category: 'Syllabus',
                      assets: [
                        {
                          type: 'pdf',
                          path: '/resources/calculus/calculus-3/course-reference/course-guides/syllabus-summer-2023.pdf',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'actuarial-financial-math',
      type: 'folder',
      title: 'Actuarial & Financial Mathematics',
      description: 'Interest theory and actuarial mathematics',
      children: [
        {
          id: 'interest-theory',
          type: 'folder',
          title: 'Mathematics of Interest Theory',
          children: [
                    {
                      id: 'interest-theory-notes-lessons',
                      type: 'folder',
                      title: 'Notes & Lessons',
                      description: 'Course notes covering the central ideas of interest theory',
                      children: [
                        {
                          id: 'interest-growth-of-money',
                          type: 'file',
                          title: 'Growth of Money',
                          description: 'Accumulation functions · simple & compound interest · effective & nominal rates · discount rates · force of interest',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/growth-of-money.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-equations-value-yield',
                          type: 'file',
                          title: 'Equations of Value & Yield Rates',
                          description: 'Cash-flow timelines · single & multiple deposits · equations of value · unknown yield rates',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/equations-of-value-and-yield-rates.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-annuities',
                          type: 'file',
                          title: 'Annuities',
                          description: 'Annuity-immediate & annuity-due · present & accumulated values · perpetuities · varying annuities',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/annuities.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-annuities-payment-conversion',
                          type: 'file',
                          title: 'Annuities with Different Payment & Conversion Periods',
                          description: 'Payment-frequency conversions · nominal rates · m-thly annuities · continuously paying annuities',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/annuities-different-payment-conversion-periods.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-loan-repayment',
                          type: 'file',
                          title: 'Loan Repayment',
                          description: 'Amortized loans · principal & interest portions · amortization schedules · outstanding balances',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/loan-repayment.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-bonds',
                          type: 'file',
                          title: 'Bonds',
                          description: 'Bond cash flows · coupon & redemption values · price & yield · premium/discount behavior · callable bonds',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/bonds.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-term-structure-sensitivity',
                          type: 'file',
                          title: 'Term Structure & Interest Rate Sensitivity',
                          description: 'Term structure · duration · Macaulay & modified duration · convexity · immunization',
                          category: 'Lesson Notes',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/notes-lessons/term-structure-and-interest-rate-sensitivity.pdf',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'interest-theory-in-class-practice',
                      type: 'folder',
                      title: 'In-Class Practice',
                      description: 'Chapter-based exercises and worked solutions used alongside the course notes',
                      children: [
                        {
                          id: 'interest-growth-money-practice',
                          type: 'file',
                          title: 'Growth of Money — Practice',
                          description: 'Simple & compound interest · discounting · nominal rates · force of interest',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/growth-of-money-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-growth-money-solutions',
                          type: 'file',
                          title: 'Growth of Money — Solutions',
                          description: 'Worked solutions for the Growth of Money in-class exercises',
                          category: 'Solutions',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/growth-of-money-solutions.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-equations-value-practice',
                          type: 'file',
                          title: 'Equations of Value & Yield Rates — Practice',
                          description: 'Cash-flow equations · accumulated values · present values · solving for yield rates',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/equations-of-value-and-yield-rates-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-annuities-part-1-practice',
                          type: 'file',
                          title: 'Annuities — Practice, Part I',
                          description: 'Annuity-immediate · annuity-due · present value · accumulated value',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/annuities-part-1-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-annuities-part-2-practice',
                          type: 'file',
                          title: 'Annuities — Practice, Part II',
                          description: 'Perpetuities · varying annuities · deferred payments · advanced annuity calculations',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/annuities-part-2-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-annuities-part-2-solutions',
                          type: 'file',
                          title: 'Annuities — Part II Solutions',
                          description: 'Worked solutions for the second annuities practice set',
                          category: 'Solutions',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/annuities-part-2-solutions.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-payment-conversion-practice',
                          type: 'file',
                          title: 'Different Payment & Conversion Periods — Practice',
                          description: 'Payment frequencies · conversion frequencies · nominal rates · m-thly annuities',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/different-payment-conversion-periods-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-payment-conversion-solutions',
                          type: 'file',
                          title: 'Different Payment & Conversion Periods — Solutions',
                          description: 'Worked solutions for payment-frequency and conversion-period exercises',
                          category: 'Solutions',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/different-payment-conversion-periods-solutions.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-loan-repayment-worked',
                          type: 'file',
                          title: 'Loan Repayment — Worked Exercises',
                          description: 'Amortization · outstanding balances · principal & interest portions · loan schedules',
                          category: 'Worked Exercises',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/loan-repayment-worked-exercises.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-bonds-practice',
                          type: 'file',
                          title: 'Bonds — Practice',
                          description: 'Bond pricing · coupons · redemption values · yield rates · premium & discount bonds',
                          category: 'In-Class Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/bonds-practice.pdf',
                            },
                          ],
                        },
                        {
                          id: 'interest-bonds-solutions',
                          type: 'file',
                          title: 'Bonds — Solutions',
                          description: 'Worked solutions for the bond-pricing and yield exercises',
                          category: 'Solutions',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/in-class-practice/bonds-solutions.pdf',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'interest-theory-homework',
                      type: 'folder',
                      title: 'Homework',
                      description: 'A semester sequence of problem sets developing the main techniques of interest theory',
                      children: [
                        {
                          id: 'interest-homework-1',
                          type: 'file',
                          title: 'Homework 1',
                          description: 'Simple & compound interest · discount rates · accumulation · equivalent interest rates',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-1.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-1.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-2',
                          type: 'file',
                          title: 'Homework 2',
                          description: 'Present value · changing interest rates · accumulation across multiple time periods',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-2.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-2.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-3',
                          type: 'file',
                          title: 'Homework 3',
                          description: 'Nominal & effective rates · interest-rate conversion · discount-rate conversion · accumulated value',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-3.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-3.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-4',
                          type: 'file',
                          title: 'Homework 4',
                          description: 'Force of interest · equations of value · cash-flow comparison · solving for unknown rates',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-4.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-4.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-5',
                          type: 'file',
                          title: 'Homework 5',
                          description: 'Yield rates · investment cash flows · reinvestment · rate-of-return calculations',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-5.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-5.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-6',
                          type: 'file',
                          title: 'Homework 6',
                          description: 'Annuity-immediate & annuity-due · present & accumulated values · equivalent payment streams',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-6.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-6.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-7',
                          type: 'file',
                          title: 'Homework 7',
                          description: 'Annuity calculations · payment timing · present values · outstanding balances',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-7.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-7.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-8',
                          type: 'file',
                          title: 'Homework 8',
                          description: 'Increasing & decreasing annuities · perpetuities · varying payments · geometric payment patterns',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-8.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-8.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-9',
                          type: 'file',
                          title: 'Homework 9',
                          description: 'Payment & conversion periods · spaced payments · annuity values · interest-rate calculations',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-9.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-9.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-10',
                          type: 'file',
                          title: 'Homework 10',
                          description: 'Loan amortization · level payments · principal & interest portions · outstanding loan balances',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-10.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-10.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-11',
                          type: 'file',
                          title: 'Homework 11',
                          description: 'Bond pricing · coupon payments · redemption values · yield rates · varying coupons',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-11.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-11.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-12',
                          type: 'file',
                          title: 'Homework 12',
                          description: 'Bond valuation · yield calculations · redemption values · advanced bond problems',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-12.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-12.tex' },
                          ],
                        },
                        {
                          id: 'interest-homework-13',
                          type: 'file',
                          title: 'Homework 13',
                          description: 'Term structure · par-value bonds · Macaulay duration · timing of future cash flows',
                          category: 'Homework',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-13.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/interest-theory/homework/homework-13.tex' },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'interest-theory-exams-reviews',
                      type: 'folder',
                      title: 'Exams & Reviews',
                      description: 'Past exams and targeted review material from Mathematics of Interest Theory',
                      children: [
                        {
                          id: 'interest-theory-exams',
                          type: 'folder',
                          title: 'Exams',
                          children: [
                            {
                              id: 'interest-test-1-fall-2025',
                              type: 'file',
                              title: 'Test 1 — Fall 2025',
                              description: 'Accumulation & discount · force of interest · equivalent rates · equations of value · yield rates · introductory annuities',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-1-fall-2025.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-1-fall-2025.tex',
                                },
                              ],
                            },
                            {
                              id: 'interest-test-2-fall-2025',
                              type: 'file',
                              title: 'Test 2 — Fall 2025',
                              description: 'Increasing & varying annuities · perpetuities · loan balances · payment schedules · actuarial notation',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-2-fall-2025.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-2-fall-2025.tex',
                                },
                              ],
                            },
                            {
                              id: 'interest-test-3-fall-2025',
                              type: 'file',
                              title: 'Test 3 — Fall 2025',
                              description: 'Loan amortization · outstanding balances · bond pricing · premium & discount amortization · callable bonds',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-3-fall-2025.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/test-3-fall-2025.tex',
                                },
                              ],
                            },
                            {
                              id: 'interest-final-fall-2025',
                              type: 'file',
                              title: 'Final Exam — Fall 2025',
                              description: 'Comprehensive interest theory · yield rates · annuities · loans · bonds · force of interest · accumulated values',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/final-exam-fall-2025.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/exams/final-exam-fall-2025.tex',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'interest-theory-reviews',
                          type: 'folder',
                          title: 'Reviews',
                          children: [
                            {
                              id: 'interest-test-2-review',
                              type: 'file',
                              title: 'Test 2 Review',
                              description: 'Continuously varying annuities · loan amortization · deferred annuities · increasing annuities · perpetuities',
                              category: 'Review',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/reviews/test-2-review.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/interest-theory/exams-reviews/reviews/test-2-review.tex',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'interest-theory-reference',
                      type: 'folder',
                      title: 'Reference & Handouts',
                      description: 'Formula sheets, checkpoints, and compact references for the major ideas of interest theory',
                      children: [
                        {
                          id: 'interest-growth-money-checkpoint',
                          type: 'file',
                          title: 'Growth of Money Checkpoint',
                          description: 'Interest, discount & present-value notation · rate conversions · force of interest · simple-interest relationships',
                          category: 'Checkpoint',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/growth-of-money-checkpoint.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/growth-of-money-checkpoint.tex',
                            },
                          ],
                        },
                        {
                          id: 'interest-time-value-formulas',
                          type: 'file',
                          title: 'Time Value of Money Formulas',
                          description: 'Accumulation & discount functions · effective & nominal rates · rate conversions · force of interest',
                          category: 'Formula Sheet',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/time-value-of-money-formulas.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/time-value-of-money-formulas.tex',
                            },
                          ],
                        },
                        {
                          id: 'interest-useful-formulas',
                          type: 'file',
                          title: 'Useful Interest Theory Formulas',
                          description: 'Interest-rate conversions · annuities · loans · bonds',
                          category: 'Formula Sheet',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/useful-formulas.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/interest-theory/reference-handouts/useful-formulas.tex',
                            },
                          ],
                        },
                      ],
                    },
                  ],
        },
        {
          id: 'actuarial-seminar',
          type: 'folder',
          title: 'Exam FM Prep Material',
          children: [
                    {
                      id: 'exam-fm-topic-practice',
                      type: 'folder',
                      title: 'Topic Practice',
                      description: 'Exam-style practice organized by the major financial mathematics topics',
                      children: [
                        {
                          id: 'exam-fm-time-value-money',
                          type: 'file',
                          title: 'Time Value of Money — Practice',
                          description: 'Accumulation functions · effective & nominal rates · force of interest · discounting · present & future values',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/time-value-of-money-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/time-value-of-money-practice.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-annuities-practice',
                          type: 'file',
                          title: 'Annuities — Practice',
                          description: 'Annuities · perpetuities · varying payments · payment timing · reinvestment',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/annuities-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/annuities-practice.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-annuities-solutions',
                          type: 'file',
                          title: 'Annuities & Perpetuities — Practice with Solutions',
                          description: 'Present & accumulated values · deferred annuities · perpetuities · varying interest · worked solutions',
                          category: 'Practice & Solutions',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/annuities-perpetuities-worksheet-solutions.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/annuities-perpetuities-worksheet-solutions.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-loans',
                          type: 'file',
                          title: 'Loans — Practice',
                          description: 'Loan payments · amortization · outstanding balances · principal & interest portions',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/loans-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/loans-practice.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-bonds',
                          type: 'file',
                          title: 'Bonds — Practice',
                          description: 'Bond pricing · coupons · redemption values · yield rates · premium & discount bonds · callable bonds',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/bonds-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/bonds-practice.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-spot-forward-rates',
                          type: 'file',
                          title: 'Spot & Forward Rates — Practice',
                          description: 'Term structure · spot rates · forward rates · zero-coupon bonds · yield to maturity',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/spot-forward-rates-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/spot-forward-rates-practice.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-exact-matching',
                          type: 'file',
                          title: 'Exact Matching — Practice',
                          description: 'Liability matching · bond cash flows · asset selection · purchase price',
                          category: 'Topic Practice',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/exact-matching-practice.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/topic-practice/exact-matching-practice.tex' },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'exam-fm-speedwork',
                      type: 'folder',
                      title: 'Speedwork',
                      description: 'Short, timed sets for building speed and fluency on Exam FM problems',
                      children: [
                        {
                          id: 'exam-fm-annuities-speedwork',
                          type: 'file',
                          title: 'Annuities Speedwork',
                          description: 'Geometric & increasing annuities · perpetuities · reinvestment yield · payment-frequency comparisons',
                          category: 'Timed Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/annuities-speedwork.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/annuities-speedwork.tex',
                            },
                          ],
                        },
                        {
                          id: 'exam-fm-loans-speedwork',
                          type: 'file',
                          title: 'Loans Speedwork',
                          description: 'Mortgage comparisons · amortization · principal & interest portions · outstanding balances · irregular payments',
                          category: 'Timed Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/loans-speedwork.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/loans-speedwork.tex',
                            },
                          ],
                        },
                        {
                          id: 'exam-fm-bonds-speedwork',
                          type: 'file',
                          title: 'Bonds Speedwork',
                          description: 'Premium & discount amortization · zero-coupon bonds · bond yields · coupon relationships',
                          category: 'Timed Practice',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/bonds-speedwork.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/speedwork/bonds-speedwork.tex',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'exam-fm-quizzes',
                      type: 'folder',
                      title: 'Quizzes',
                      description: 'Short Exam FM-style assessments covering the major topics of the course',
                      children: [
                        {
                          id: 'exam-fm-quiz-1',
                          type: 'file',
                          title: 'Quiz 1',
                          description: 'Duration · spot rates · valuing cash flows · exact matching',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-1.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-1.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-2',
                          type: 'file',
                          title: 'Quiz 2',
                          description: 'Nominal rates · force of interest · simple interest · accumulation functions · discount rates',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-2.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-2.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-2-solutions',
                          type: 'file',
                          title: 'Quiz 2 — Solution Outline',
                          description: 'Two-step setups and solution procedures for Quiz 2',
                          category: 'Solutions',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-2-solution-outline.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-2-solution-outline.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-3',
                          type: 'file',
                          title: 'Quiz 3',
                          description: 'Geometrically varying payments · increasing annuities · perpetuities · changing interest rates',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-3.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-3.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-3-solutions',
                          type: 'file',
                          title: 'Quiz 3 — Solution Outline',
                          description: 'Two-step setups and solution procedures for Quiz 3',
                          category: 'Solutions',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-3-solution-outline.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-3-solution-outline.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-4',
                          type: 'file',
                          title: 'Quiz 4',
                          description: 'Loan amortization · principal & interest portions · outstanding balances · changing interest rates',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-4.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-4.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-5',
                          type: 'file',
                          title: 'Quiz 5',
                          description: 'Bond book values · yield rates · premium & discount bonds · coupon reinvestment',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-5.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-5.tex' },
                          ],
                        },
                        {
                          id: 'exam-fm-quiz-6',
                          type: 'file',
                          title: 'Quiz 6',
                          description: 'Annuities · loan repayment · duration · liability matching',
                          category: 'Quiz',
                          assets: [
                            { type: 'pdf', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-6.pdf' },
                            { type: 'tex', path: '/resources/actuarial-financial-mathematics/exam-fm-prep/quizzes/quiz-6.tex' },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'exam-fm-exams-reviews',
                      type: 'folder',
                      title: 'Exams & Reviews',
                      description: 'Past assessments and comprehensive practice for Exam FM preparation',
                      children: [
                        {
                          id: 'exam-fm-exams',
                          type: 'folder',
                          title: 'Exams',
                          children: [
                            {
                              id: 'exam-fm-midterm-spring-2026',
                              type: 'file',
                              title: 'Midterm — Spring 2026',
                              description: 'Spot & forward rates · force of interest · annuities · duration · immunization · exact matching',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/exams/midterm-spring-2026.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/exams/midterm-spring-2026.tex',
                                },
                              ],
                            },
                            {
                              id: 'exam-fm-midterm-spring-2026-key',
                              type: 'file',
                              title: 'Midterm — Answer Key',
                              description: 'Answer key for the Spring 2026 Exam FM Prep midterm',
                              category: 'Solutions',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/exams/midterm-spring-2026-key.pdf',
                                },
                              ],
                            },
                            {
                              id: 'exam-fm-final-spring-2026',
                              type: 'file',
                              title: 'Final Exam — Spring 2026',
                              description: 'Interest theory · annuities · loans · bonds · term structure · duration · liability matching',
                              category: 'Exam',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/exams/final-exam-spring-2026.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/exams/final-exam-spring-2026.tex',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: 'exam-fm-reviews',
                          type: 'folder',
                          title: 'Reviews',
                          children: [
                            {
                              id: 'exam-fm-midterm-practice',
                              type: 'file',
                              title: 'Midterm Practice — With Answer Key',
                              description: 'Interest rates · yield curves · annuities · loans · bonds · duration · immunization',
                              category: 'Review',
                              assets: [
                                {
                                  type: 'pdf',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/reviews/midterm-practice-with-answer-key.pdf',
                                },
                                {
                                  type: 'tex',
                                  path: '/resources/actuarial-financial-mathematics/exam-fm-prep/exams-reviews/reviews/midterm-practice-with-answer-key.tex',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 'exam-fm-reference-tools',
                      type: 'folder',
                      title: 'Reference & Study Tools',
                      description: 'Compact references and study tools for preparing for Exam FM',
                      children: [
                        {
                          id: 'financial-mathematics-formula-sheet',
                          type: 'file',
                          title: 'Financial Mathematics Formula Sheet',
                          description: 'Interest measurement · annuities · loans · bonds · spot & forward rates · duration · convexity · immunization',
                          category: 'Formula Sheet',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/reference-study-tools/financial-mathematics-formula-sheet.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/reference-study-tools/financial-mathematics-formula-sheet.tex',
                            },
                          ],
                        },
                        {
                          id: 'exam-fm-mistake-log',
                          type: 'file',
                          title: 'Exam FM Mistake Log',
                          description: 'Printable tracker for recording where a problem came from, its topic, and why it was missed',
                          category: 'Study Tool',
                          assets: [
                            {
                              type: 'pdf',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/reference-study-tools/exam-fm-mistake-log.pdf',
                            },
                            {
                              type: 'tex',
                              path: '/resources/actuarial-financial-mathematics/exam-fm-prep/reference-study-tools/exam-fm-mistake-log.tex',
                            },
                          ],
                        },
                      ],
                    },
                  ],
        },
      ],
    },
    {
      id: 'precalculus-algebra',
      type: 'folder',
      title: 'Precalculus & Algebra',
      description: 'Algebra, functions, and trigonometry',
      children: [
        {
          id: 'college-algebra',
          type: 'folder',
          title: 'College Algebra',
          children: [],
        },
        {
          id: 'precalculus-trigonometry',
          type: 'folder',
          title: 'Precalculus with Trigonometry',
          children: [],
        },
      ],
    },
    {
      id: 'graph-theory',
      type: 'folder',
      title: 'Graph Theory',
      description: 'Graph coloring and discrete mathematics',
      children: [
        {
          id: 'graph-coloring',
          type: 'folder',
          title: 'Introduction to Graph Coloring',
          children: [],
        },
      ],
    },
    {
      id: 'mathematical-explorations',
      type: 'folder',
      title: 'Mathematical Explorations',
      description: 'Proof, exposition, talks, and recreational mathematics',
      children: [
        {
          id: 'proof-exposition',
          type: 'folder',
          title: 'Proof & Exposition',
          children: [],
        },
        {
          id: 'recreational-mathematics',
          type: 'folder',
          title: 'Recreational Mathematics',
          children: [],
        },
        {
          id: 'talks-activities',
          type: 'folder',
          title: 'Talks & Activities',
          children: [],
        },
      ],
    },
  ],
}

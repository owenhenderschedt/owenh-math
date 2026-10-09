// Build-time HTML entry points for the static GitHub Pages deployment.
// The React application, game code, routes and CSS remain unchanged.
// Keep these paths in sync with src/App.tsx and src/pages/Research.tsx
// when adding a new public page or interactive game.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')
const domain = 'https://owenh-math.com'

const pages = [
  {
    path: '/',
    title: 'Owen Henderschedt | Math',
    description: 'Owen Henderschedt is a mathematician working in graph theory and discrete geometry. Explore research papers, teaching, and interactive mathematics.',
  },
  {
    path: '/research',
    title: 'Interactive Research | Owen Henderschedt',
    description: 'Explore interactive mathematics in graph coloring, Ramsey theory, graph orientations, and discrete geometry.',
  },
  {
    path: '/papers',
    title: 'Papers | Owen Henderschedt',
    description: 'Research papers and preprints by mathematician Owen Henderschedt.',
  },
  {
    path: '/teaching',
    title: 'Teaching | Owen Henderschedt',
    description: 'Teaching, courses, and mathematical learning experiences by Owen Henderschedt.',
  },
  {
    path: '/travel',
    title: 'Travel | Owen Henderschedt',
    description: 'Explore the travel page of mathematician Owen Henderschedt.',
  },
  {
    path: '/cv',
    title: 'CV | Owen Henderschedt',
    description: 'Curriculum vitae of Owen Henderschedt, mathematician.',
  },
  {
    path: '/research/coloring',
    title: 'Graph Coloring | Owen Henderschedt',
    description: 'Interactive research topics in graph coloring, recoloring, and coloring conditions.',
  },
  {
    path: '/research/ramsey',
    title: 'Ramsey Theory | Owen Henderschedt',
    description: 'Explore edge colorings, Ramsey theory, and mathematical structures forced by colored graphs.',
  },
  {
    path: '/research/orientations',
    title: 'Graph Orientations | Owen Henderschedt',
    description: 'Research in graph orientations and forbidden vertex outdegrees.',
  },
  {
    path: '/research/geometry',
    title: 'Discrete Geometry | Owen Henderschedt',
    description: 'Explore interactive discrete geometry, paths, point sets, and covering problems.',
  },
  {
    path: '/research/coloring/total',
    title: 'Total Coloring | Interactive Math',
    description: 'Play Total Coloring: color the vertices and edges of a graph while avoiding conflicts.',
  },
  {
    path: '/research/ramsey/odd',
    title: 'Odd Ramsey | Interactive Math',
    description: 'Explore the Odd Ramsey problem by coloring edges and tracking overlapping subgraphs.',
  },
  {
    path: '/research/ramsey/purple',
    title: 'Purple Ramsey | Interactive Math',
    description: 'Play Purple Ramsey: color complete graphs around a fixed purple matching and try to avoid forbidden subgraphs.',
  },
  {
    path: '/research/geometry/short-paths',
    title: 'Short Path Algorithms | Interactive Math',
    description: 'Navigate between two points among square obstacles and compare your route to a short-path algorithm.',
  },
  {
    path: '/research/geometry/circle-covering',
    title: 'Circle Covering | Interactive Math',
    description: 'Explore covering diameter-one point sets using a disk and compare your placement with an optimal covering.',
  },
]

// For a static host, /path is redirected to /path/, where index.html is served.
// These canonical URLs intentionally use trailing slashes for consistency.
const canonicalUrl = (path) => domain + (path === '/' ? '/' : `${path}/`)
const escapeHtml = (text) => text
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const templatePath = join(dist, 'index.html')
if (!existsSync(templatePath)) {
  throw new Error('dist/index.html is missing: run vite build before this script.')
}
const template = readFileSync(templatePath, 'utf8')
if (!/<title>[^<]*<\/title>/i.test(template) ||
    !/<meta\s+name=["']description["'][^>]*>/i.test(template) ||
    !template.includes('</head>') ||
    !template.includes('id="root"')) {
  throw new Error('The built index.html has changed; review this script before generating pages.')
}

for (const page of pages) {
  const output = page.path === '/'
    ? templatePath
    : join(dist, ...page.path.slice(1).split('/'), 'index.html')
  const canonical = canonicalUrl(page.path)
  const html = template
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      '</head>',
      `  <link rel="canonical" href="${escapeHtml(canonical)}" />\n` +
      `  <meta property="og:title" content="${escapeHtml(page.title)}" />\n` +
      `  <meta property="og:description" content="${escapeHtml(page.description)}" />\n` +
      `  <meta property="og:url" content="${escapeHtml(canonical)}" />\n` +
      '  <meta property="og:type" content="website" />\n' +
      '</head>',
    )
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, html)
}

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map((page) => `  <url><loc>${canonicalUrl(page.path)}</loc></url>`).join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), xml)

// Preserve any existing robots.txt instead of overwriting user customizations.
const robotsPath = join(dist, 'robots.txt')
if (!existsSync(robotsPath)) {
  writeFileSync(robotsPath, `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`)
}

console.log(`Created ${pages.length} static page entry points and sitemap.xml.`)
console.log('No React components, research games, or page styles were changed.')

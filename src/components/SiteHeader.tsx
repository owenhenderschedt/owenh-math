import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'

function resetSection(
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
) {
  if (window.location.pathname === path) {
    event.preventDefault()

    // Treat the active navigation tab as the home button
    // for its own section.
    window.scrollTo(0, 0)
    window.location.assign(path)
  }
}

function SiteHeader() {
  return (
    <header className="site-header">
      <Link
        className="wordmark"
        to="/"
        aria-label="Owen Henderschedt home"
        onClick={(event) => resetSection(event, '/')}
      >
        <img
          src="/favicon-rb.svg"
          alt=""
          aria-hidden="true"
          className="wordmark-logo"
        />
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link
          to="/"
          onClick={(event) => resetSection(event, '/')}
        >
          Home
        </Link>

        <Link
          to="/papers"
          onClick={(event) => resetSection(event, '/papers')}
        >
          Papers
        </Link>

        <Link
          to="/research"
          onClick={(event) => resetSection(event, '/research')}
        >
          Research
        </Link>

        <Link
          to="/teaching"
          onClick={(event) => resetSection(event, '/teaching')}
        >
          Teaching
        </Link>

        <Link
          to="/travel"
          onClick={(event) => resetSection(event, '/travel')}
        >
          Travel
        </Link>

        <Link
          to="/cv"
          onClick={(event) => resetSection(event, '/cv')}
        >
          CV
        </Link>
      </nav>
    </header>
  )
}

export default SiteHeader

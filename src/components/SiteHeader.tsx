import { Link } from 'react-router-dom'

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Owen Henderschedt home">
        OH
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/papers">Papers</Link>
        <Link to="/research">Research</Link>
        <Link to="/teaching">Teaching</Link>
        <Link to="/travel">Travel</Link>
        <Link to="/cv">CV</Link>
      </nav>
    </header>
  )
}

export default SiteHeader

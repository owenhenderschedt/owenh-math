import SiteHeader from '../components/SiteHeader'

function CV() {
  return (
    <div className="site-shell cv-page">
      <SiteHeader />

      <main className="cv-main">
        <div className="cv-heading">
          <div>
            <p className="cv-eyebrow">CURRICULUM VITAE</p>
            <h1>CV</h1>
          </div>

          <a
            className="cv-open-button"
            href="/cv/Owen-Henderschedt-CV.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF ↗
          </a>
        </div>

        <div className="cv-frame-wrap">
          <iframe
            className="cv-frame"
            src="/cv/Owen-Henderschedt-CV.pdf"
            title="Owen Henderschedt curriculum vitae"
          />
        </div>
      </main>
    </div>
  )
}

export default CV

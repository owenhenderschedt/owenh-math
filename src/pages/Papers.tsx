import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import SiteHeader from '../components/SiteHeader'
import { publications } from '../data/publications'

function Papers() {
  return (
    <div className="site-shell papers-page">
      <SiteHeader />

      <main className="papers-main">
        <header className="papers-heading">
          <p className="papers-eyebrow">PUBLICATIONS &amp; PREPRINTS</p>
          <h1>Papers</h1>

          <p className="papers-intro">
            Research in graph theory, combinatorics, and discrete geometry.
          </p>
        </header>

        <section className="publication-list" aria-label="Publications">
          {publications.map((paper, index) => {
            const destination = paper.arxiv ?? paper.journal
            const plainTitle =
              paper.title ??
              `${paper.titlePrefix ?? ''}${paper.titleMath ?? ''}${paper.titleSuffix ?? ''}`

            const titleContent = (
              <>
                {paper.titlePrefix}
                {paper.titleMath && <InlineMath math={paper.titleMath} />}
                {paper.titleSuffix}
                {paper.title}
              </>
            )

            return (
              <article className="publication" key={plainTitle}>
                <div className="publication-number">
                  {String(publications.length - index).padStart(2, '0')}
                </div>

                <div className="publication-year">{paper.year}</div>

                <div className="publication-content">
                  <h2 className="publication-title">
                    {destination ? (
                      <a
                        href={destination}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {titleContent}
                      </a>
                    ) : (
                      titleContent
                    )}
                  </h2>

                  <p className="publication-authors">
                    {paper.authors.map((author, authorIndex) => (
                      <span key={author}>
                        {author}
                        {authorIndex < paper.authors.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>

                  <div className="publication-meta">
                    <span>{paper.status}</span>

                    {paper.venue && (
                      <>
                        <span className="meta-dot" aria-hidden="true">·</span>
                        <span>{paper.venue}</span>
                      </>
                    )}

                    {paper.arxiv && (
                      <>
                        <span className="meta-dot" aria-hidden="true">·</span>
                        <a
                          href={paper.arxiv}
                          target="_blank"
                          rel="noreferrer"
                        >
                          arXiv
                        </a>
                      </>
                    )}

                    {paper.journal && (
                      <>
                        <span className="meta-dot" aria-hidden="true">·</span>
                        <a
                          href={paper.journal}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Journal
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {destination && (
                  <a
                    className="publication-arrow"
                    href={destination}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${plainTitle}`}
                  >
                    ↗
                  </a>
                )}
              </article>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default Papers

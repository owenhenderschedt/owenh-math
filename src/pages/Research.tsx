import { useState } from 'react'
import SiteHeader from '../components/SiteHeader'
import ResearchGraphMotif from '../research/components/ResearchGraphMotif'
import TotalColoringGame from '../research/games/total-coloring/TotalColoringGame'
import ShortPathGame from '../research/games/short-path-algorithms/ShortPathGame'
import { researchAreas } from '../research/data/researchTree'

export default function Research() {
  const [activeArea, setActiveArea] = useState<string | null>(null)
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const selectedArea = researchAreas.find((area) => area.id === activeArea)

  const selectedGame = selectedArea?.games.find(
    (game) => game.id === activeGame,
  )

  return (
    <div className="site-shell research-page">
      <SiteHeader />

      <main className="research-main">
        {!selectedArea && (
          <header className="research-hero">
            <div className="research-hero-copy">
              <p className="research-kicker">Interactive Research Library</p>
              <h1>Research</h1>
              <p className="research-intro">
                Browse a research area, choose a topic, and interact directly
                with the mathematics behind my work.
              </p>
            </div>

            <ResearchGraphMotif />
          </header>
        )}

        {!selectedArea ? (
          <section className="research-shelf" aria-label="Research areas">
            <div className="research-shelf-heading">
              <span>Research areas</span>
              <span>{researchAreas.length} collections</span>
            </div>

            <div className="research-area-grid">
              {researchAreas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  className="research-area-card"
                  onClick={() => {
                    setActiveArea(area.id)
                    setActiveGame(null)
                  }}
                >
                  <div className="research-area-topline">
                    <span>{area.games.length} topics</span>
                    <span aria-hidden="true">→</span>
                  </div>

                  <h2>{area.title}</h2>
                  <p>{area.description}</p>
                </button>
              ))}
            </div>
          </section>
        ) : selectedGame ? (
          <section className="research-game-view">
            <button
              type="button"
              className="research-back"
              onClick={() => setActiveGame(null)}
            >
              ← {selectedArea.title}
            </button>

            {selectedGame.id === 'total-coloring' && <TotalColoringGame />}
            {selectedGame.id === 'short-path-algorithms' && <ShortPathGame />}
          </section>
        ) : (
          <section className="research-library">
            <button
              type="button"
              className="research-back"
              onClick={() => {
                setActiveArea(null)
                setActiveGame(null)
              }}
            >
              ← Research library
            </button>

            <div className="research-area-heading">
              <div>
                <p className="research-kicker">Research Area</p>
                <h2>{selectedArea.title}</h2>
              </div>

              <p>{selectedArea.description}</p>
            </div>

            <div className="research-shelf-heading">
              <span>Topics</span>
              <span>{selectedArea.games.length} available</span>
            </div>

            <div className="research-game-grid">
              {selectedArea.games.map((game) => (
                <article key={game.id} className="research-game-card">
                  <div className="research-game-copy">
                    <div className="research-game-topline">
                      <span>Interactive topic</span>
                      <span aria-hidden="true">↗</span>
                    </div>

                    <h3>{game.title}</h3>
                    <p>{game.description}</p>

                    <button
                      type="button"
                      className="research-game-button"
                      disabled={game.status !== 'playable'}
                      onClick={() => setActiveGame(game.id)}
                    >
                      {game.status === 'playable' ? 'Play' : 'Coming soon'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

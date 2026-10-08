import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import ResearchGraphMotif from '../research/components/ResearchGraphMotif'
import GameInstructions from '../research/components/GameInstructions'
import TotalColoringGame from '../research/games/total-coloring/TotalColoringGame'
import ShortPathGame from '../research/games/short-path-algorithms/ShortPathGame'
import OddRamseyGame from '../research/games/odd-ramsey/OddRamseyGame'
import CoveringPointsGame from '../research/games/fixed-diameter-coverings/CoveringPointsGame'
import PurpleRamseyGame from '../research/games/purple-ramsey/PurpleRamseyGame'
import { researchAreas } from '../research/data/researchTree'

// These public URLs are intentionally independent of the internal game IDs.
const areaSlugs: Record<string, string> = {
  'graph-coloring': 'coloring',
  'ramsey-theory': 'ramsey',
  'orientations': 'orientations',
  'discrete-geometry': 'geometry',
}

const gameSlugs: Record<string, string> = {
  'total-coloring': 'total',
  'odd-ramsey': 'odd',
  'purple-ramsey': 'purple',
  'short-path-algorithms': 'short-paths',
  'fixed-diameter-coverings': 'circle-covering',
}

const areaPath = (areaId: string) => `/research/${areaSlugs[areaId]}`
const gamePath = (areaId: string, gameId: string) =>
  `${areaPath(areaId)}/${gameSlugs[gameId]}`

export default function Research() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const parts = pathname.split('/').filter(Boolean)

  const selectedArea = researchAreas.find(
    (area) => areaSlugs[area.id] === parts[1],
  )
  const selectedGame = selectedArea?.games.find(
    (game) => gameSlugs[game.id] === parts[2] && game.status === 'playable',
  )

  const validPath =
    (parts.length === 1 && parts[0] === 'research') ||
    (parts.length === 2 && Boolean(selectedArea)) ||
    (parts.length === 3 && Boolean(selectedGame))

  if (!validPath) return <Navigate to="/research" replace />

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
                  onClick={() => navigate(areaPath(area.id))}
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
              onClick={() => navigate(areaPath(selectedArea.id))}
            >
              ← {selectedArea.title}
            </button>
            <GameInstructions key={selectedGame.id} gameId={selectedGame.id} />

            {selectedGame.id === 'total-coloring' && <TotalColoringGame />}
            {selectedGame.id === 'short-path-algorithms' && <ShortPathGame />}
            {selectedGame.id === 'odd-ramsey' && <OddRamseyGame />}
            {selectedGame.id === 'purple-ramsey' && <PurpleRamseyGame />}

            {selectedGame.id === 'fixed-diameter-coverings' && (
              <CoveringPointsGame />
            )}
          </section>
        ) : (
          <section className="research-library">
            <button
              type="button"
              className="research-back"
              onClick={() => navigate('/research')}
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
                      onClick={() => navigate(gamePath(selectedArea.id, game.id))}
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

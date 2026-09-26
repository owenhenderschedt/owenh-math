import SiteHeader from '../components/SiteHeader'

function Home() {
  return (
    <div className="site-shell" id="top">
      <SiteHeader />

      <main className="home">
        <section className="home-copy">
          <h1>Owen Henderschedt</h1>

          <p className="home-position">
            Postdoctoral researcher in mathematics at Iowa State University
          </p>

          <div className="home-bio">
            <p>
              I am a postdoctoral researcher at Iowa State University, where I am
              mentored by Shira Zerbib and Bernard Lidický. I earned my Ph.D. from
              Auburn University under the supervision of Jessica McDonald.
            </p>

            <p>
              My research lies in discrete mathematics, with a particular focus on
              graph coloring, Ramsey theory, and combinatorial geometry.
            </p>

            <p>
              Before graduate school, I earned my B.S. in Actuarial Sciences with
              a minor in Finance from Bryant University.
            </p>
          </div>

          <div className="home-contact">
            <span>Email</span>
            <a href="mailto:olh0011@auburn.edu">olh0011@auburn.edu</a>
            <a href="mailto:owenhen@iastate.edu">owenhen@iastate.edu</a>
          </div>

          <blockquote className="home-quote">
            <span>
              “One of the pleasures of looking at the world through mathematical
              eyes is that you can see certain patterns that would otherwise be hidden”
            </span>
            <cite>— Steven Strogatz</cite>
          </blockquote>
        </section>

        <section className="home-portrait">
          <div className="portrait-frame">
            <img
              src="/images/owen-portrait.jpeg"
              alt="Owen Henderschedt"
              className="portrait"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home

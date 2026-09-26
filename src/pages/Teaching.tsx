import SiteHeader from '../components/SiteHeader'
import TeachingStoneGenerator from '../components/TeachingStoneGenerator'
import { teachingInstitutions } from '../data/teaching'
import ResourceBrowser from '../resources/components/ResourceBrowser'

function Teaching() {
  return (
    <div className="site-shell teaching-page">
      <SiteHeader />

      <main className="teaching-main">
        <section className="teaching-intro">
          <div className="teaching-intro-copy">
            <p className="teaching-eyebrow">TEACHING</p>

            <h1>Teaching Mathematics</h1>

            <p className="teaching-philosophy-placeholder">
              My teaching focuses on helping students develop mathematical
              understanding through clear explanations, active problem solving,
              and opportunities to make connections for themselves. I aim to
              balance rigorous mathematics with an environment where students
              feel comfortable asking questions, testing ideas, and approaching
              unfamiliar problems.
            </p>

          </div>

          <figure className="teaching-photo teaching-photo-horizontal">
            <div className="teaching-photo-frame">
              <img
                src="/images/teaching-board.jpeg"
                alt="Owen Henderschedt giving a mathematics talk at a chalkboard"
              />
            </div>
            <blockquote className="teaching-quote teaching-photo-quote">
              <span>
                “Teachers that love teaching, teach children to love learning.”
              </span>
              <cite>— Robert John Meehan</cite>
            </blockquote>
          </figure>
        </section>

        <nav className="teaching-jump-nav" aria-label="Teaching page sections">
          <div className="jump-nav-heading">
            <span>EXPLORE THIS PAGE</span>
          </div>

          <a className="jump-nav-item" href="#courses">
            <span className="jump-number">01</span>
            <span className="jump-copy">
              <strong>Courses</strong>
              <small>Teaching history from 2021–2026</small>
            </span>
            <span className="jump-arrow" aria-hidden="true">↓</span>
          </a>

          <a className="jump-nav-item" href="#teaching-stones">
            <span className="jump-number">02</span>
            <span className="jump-copy">
              <strong>Teaching Stones</strong>
              <small>Spherical coordinates, convex hulls, and 3D printing</small>
            </span>
            <span className="jump-arrow" aria-hidden="true">↓</span>
          </a>

          <a className="jump-nav-item" href="#teaching-resources">
            <span className="jump-number">03</span>
            <span className="jump-copy">
              <strong>Teaching Resources</strong>
              <small>Notes, activities, study guides, and talks</small>
            </span>
            <span className="jump-arrow" aria-hidden="true">↓</span>
          </a>
        </nav>

        <section className="teaching-history-section" id="courses">
          <div className="section-heading-row">
            <div>
              <p className="teaching-section-label">COURSES</p>
              <h2>Teaching history</h2>
            </div>

            <p className="section-side-note">
              Iowa State University & Auburn University · 2021–present
            </p>
          </div>

          <div className="teaching-timeline">
            {teachingInstitutions.map((institution) => (
              <section
                className="timeline-institution"
                key={institution.institution}
              >
                <header className="timeline-institution-header">
                  <h3>{institution.institution}</h3>
                  <span>{institution.period}</span>
                </header>

                <div className="semester-timeline">
                  {institution.semesters.map((semester) => (
                    <article
                      className="semester-entry"
                      key={`${semester.term}-${semester.year}`}
                    >
                      <div className="semester-marker" aria-hidden="true">
                        <span />
                      </div>

                      <div className="semester-label">
                        <strong>{semester.term}</strong>
                        <span>{semester.year}</span>
                      </div>

                      <div className="semester-courses">
                        {semester.courses.map((course) => (
                          <div
                            className="semester-course"
                            key={`${course.title}-${course.role}`}
                          >
                            <h4>{course.title}</h4>

                            <p>
                              <span>{course.role}</span>
                              {course.sections && (
                                <>
                                  <span aria-hidden="true"> · </span>
                                  <span>
                                    {course.sections}{' '}
                                    {course.sections === 1 ? 'section' : 'sections'}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="stones-section" id="teaching-stones">
          <div className="stones-copy">
            <h2>Teaching Stones</h2>

            <p className="stones-subtitle">Each class takes shape.</p>

            <p>
              Let me tell you about a new project I started. After teaching many
              classes semester after semester, I wanted a way to commemorate and
              remember former sections, students, and years. This led me to create
              teaching stones.
            </p>

            <p>
              At some point during the semester (a test day maximizes attendance),
              I ask the students for a 3D-coordinate point. The goal is to take the
              convex hull of these points to create a polyhedron. To ensure the
              points are in convex position, I ask for two numbers: one between
              zero and π, and the other between zero and 2π. By interpreting these
              points as spherical coordinates on a sphere of radius 1, we guarantee
              that the points are in convex position.
            </p>

            <p>
              Since students choose their own points, each class will produce a
              unique polyhedron. Many students select meaningful coordinates,
              choosing numbers associated with area codes, birthdays, military
              unit numbers, and more. I then 3D-print the class's stone and allow
              students to sign it, initial it, or write something on it, depending
              on the size of the print and the size of the class.
            </p>

            <p>
              These stones are not only a teaching tool for spherical coordinates,
              projections, polyhedra, and convexity, but also a keepsake to remember
              the truly amazing students I have had the privilege to teach, mentor,
              and get to know over the years. I highly recommend trying this out
              with your own class! Shown here is the teaching stone from my
              Calculus III class during the summer of 2024.
            </p>
          </div>

          <div className="stone-stage" aria-label="Teaching Stone preview">
            <div className="stone-photo-gallery">
              <figure className="stone-photo-card stone-photo-first">
                <div className="stone-photo-frame">
                  <img
                    src="/images/teaching-stone-summer-2024.jpeg"
                    alt="First Teaching Stone from Calculus III, Summer 2024"
                  />
                </div>

                <figcaption>
                  <strong>First Teaching Stone</strong>
                  <span>Calculus III · Summer 2024</span>
                </figcaption>
              </figure>

              <figure className="stone-photo-card stone-photo-collection">
                <div className="stone-photo-frame">
                  <img
                    src="/images/teaching-stones-collection.jpeg"
                    alt="A collection of Teaching Stones"
                  />
                </div>

                <figcaption>
                  <strong>Teaching Stones</strong>
                  <span>Selections from the collection</span>
                </figcaption>
              </figure>
            </div>

            <TeachingStoneGenerator />


          </div>
        </section>

        <section className="resources-section" id="teaching-resources">
          <div className="section-heading-row">
            <div>
              <p className="teaching-section-label">TEACHING RESOURCES</p>
              <h2>Resource Library</h2>
            </div>

            <p className="section-side-note">
              Notes, practice material, activities, and course resources
            </p>
          </div>

          <ResourceBrowser />
        </section>
      </main>
    </div>
  )
}

export default Teaching

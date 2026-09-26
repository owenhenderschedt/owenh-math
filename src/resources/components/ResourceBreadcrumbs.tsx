import type { ResourceFolder } from '../types'

type ResourceBreadcrumbsProps = {
  path: ResourceFolder[]
  onHome: () => void
  onNavigate: (index: number) => void
  onBack: () => void
}

function ResourceBreadcrumbs({
  path,
  onHome,
  onNavigate,
  onBack,
}: ResourceBreadcrumbsProps) {
  const atRoot = path.length <= 1

  return (
    <div className="resource-breadcrumbs">
      <button
        className="resource-back-button"
        type="button"
        onClick={onBack}
        disabled={atRoot}
      >
        ← Back
      </button>

      <nav
        className="resource-breadcrumb-trail"
        aria-label="Resource navigation"
      >
        <button
          type="button"
          className="resource-breadcrumb-home"
          onClick={onHome}
        >
          ⌂ Resources
        </button>

        {path.slice(1).map((folder, index) => {
          const pathIndex = index + 1
          const isCurrent = pathIndex === path.length - 1

          return (
            <span
              className="resource-breadcrumb-segment"
              key={folder.id}
            >
              <span aria-hidden="true">/</span>

              {isCurrent ? (
                <span className="resource-breadcrumb-current">
                  {folder.title}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(pathIndex)}
                >
                  {folder.title}
                </button>
              )}
            </span>
          )
        })}
      </nav>
    </div>
  )
}

export default ResourceBreadcrumbs

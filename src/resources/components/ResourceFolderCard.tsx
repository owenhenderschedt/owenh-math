import type { ResourceFolder } from '../types'

type ResourceFolderCardProps = {
  folder: ResourceFolder
  onOpen: (folder: ResourceFolder) => void
}

function ResourceFolderCard({
  folder,
  onOpen,
}: ResourceFolderCardProps) {
  return (
    <button
      className="resource-folder-card"
      type="button"
      onClick={() => onOpen(folder)}
    >
      <span className="resource-folder-icon" aria-hidden="true">
        <span className="resource-folder-tab" />
        <span className="resource-folder-body" />
      </span>

      <span className="resource-folder-copy">
        <strong>{folder.title}</strong>

        {folder.description && (
          <span>{folder.description}</span>
        )}
      </span>

      <span className="resource-folder-arrow" aria-hidden="true">
        →
      </span>
    </button>
  )
}

export default ResourceFolderCard

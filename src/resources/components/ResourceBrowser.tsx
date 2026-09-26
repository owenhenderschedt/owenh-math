import { useState } from 'react'
import { resourceTree } from '../data/resourceTree'
import type {
  ResourceFile,
  ResourceFolder,
} from '../types'
import ResourceBreadcrumbs from './ResourceBreadcrumbs'
import ResourceFileCard from './ResourceFileCard'
import ResourceFolderCard from './ResourceFolderCard'

function ResourceBrowser() {
  const [path, setPath] = useState<ResourceFolder[]>([
    resourceTree,
  ])

  const currentFolder = path[path.length - 1]

  const openFolder = (folder: ResourceFolder) => {
    setPath((current) => [...current, folder])
  }

  const goHome = () => {
    setPath([resourceTree])
  }

  const goBack = () => {
    setPath((current) =>
      current.length > 1
        ? current.slice(0, -1)
        : current,
    )
  }

  const navigateTo = (index: number) => {
    setPath((current) =>
      current.slice(0, index + 1),
    )
  }

  const folders = currentFolder.children.filter(
    (node): node is ResourceFolder =>
      node.type === 'folder',
  )

  const files = currentFolder.children.filter(
    (node): node is ResourceFile =>
      node.type === 'file',
  )

  const isEmpty =
    folders.length === 0 &&
    files.length === 0

  return (
    <div className="resource-browser">
      <ResourceBreadcrumbs
        path={path}
        onHome={goHome}
        onBack={goBack}
        onNavigate={navigateTo}
      />

      <div
        className="resource-browser-view"
        key={currentFolder.id}
      >
        <div className="resource-browser-heading">
          <p className="resource-browser-eyebrow">
            Teaching Resources
          </p>

          <h3>
            {currentFolder.id === 'resources'
              ? 'What are you studying?'
              : currentFolder.title}
          </h3>

          {currentFolder.description && (
            <p>{currentFolder.description}</p>
          )}
        </div>

        {folders.length > 0 && (
          <div className="resource-folder-grid">
            {folders.map((folder) => (
              <ResourceFolderCard
                key={folder.id}
                folder={folder}
                onOpen={openFolder}
              />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="resource-file-grid">
            {files.map((file) => (
              <ResourceFileCard
                key={file.id}
                file={file}
              />
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="resource-empty-state">
            <span>Resources coming soon.</span>
            <p>
              Notes, practice material, and downloads
              will live here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResourceBrowser

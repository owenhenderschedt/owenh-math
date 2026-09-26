import type { ResourceFile } from '../types'

type ResourceFileCardProps = {
  file: ResourceFile
}

function formatAssetLabel(
  type: string,
  customLabel?: string,
) {
  if (customLabel) return customLabel

  if (type === 'pdf') return 'PDF'
  if (type === 'tex') return 'TeX'
  if (type === 'zip') return 'ZIP'
  if (type === 'link') return 'Link'

  return 'File'
}

function ResourceFileCard({
  file,
}: ResourceFileCardProps) {
  const primaryType =
    file.assets[0]?.type ?? 'other'

  return (
    <article className="resource-file-card">
      <div className="resource-file-type">
        {formatAssetLabel(primaryType)}
      </div>

      <div className="resource-file-copy">
        <h4>{file.title}</h4>

        {file.description && (
          <p>{file.description}</p>
        )}

        {file.category && (
          <span className="resource-file-category">
            {file.category}
          </span>
        )}
      </div>

      <div className="resource-file-actions">
        {file.assets.map((asset) => {
          const label = formatAssetLabel(
            asset.type,
            asset.label,
          )

          if (asset.type === 'pdf') {
            return (
              <span
                className="resource-pdf-actions"
                key={`${asset.type}-${asset.path}`}
              >
                <a
                  href={asset.path}
                  target="_blank"
                  rel="noreferrer"
                >
                  View {label}
                </a>

                {asset.downloadable !== false && (
                  <a
                    href={asset.path}
                    download
                  >
                    Download {label}
                  </a>
                )}
              </span>
            )
          }

          return (
            <a
              key={`${asset.type}-${asset.path}`}
              href={asset.path}
              download={
                asset.downloadable !== false &&
                asset.type !== 'link'
                  ? true
                  : undefined
              }
              target={
                asset.type === 'link'
                  ? '_blank'
                  : undefined
              }
              rel={
                asset.type === 'link'
                  ? 'noreferrer'
                  : undefined
              }
            >
              Download {label}
            </a>
          )
        })}
      </div>
    </article>
  )
}

export default ResourceFileCard

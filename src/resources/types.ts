export type ResourceAssetType =
  | 'pdf'
  | 'tex'
  | 'zip'
  | 'link'
  | 'other'

export type ResourceAsset = {
  type: ResourceAssetType
  path: string
  label?: string
  downloadable?: boolean
}

export type ResourceFolder = {
  id: string
  type: 'folder'
  title: string
  description?: string
  children: ResourceNode[]
}

export type ResourceFile = {
  id: string
  type: 'file'
  title: string
  description?: string
  category?: string
  assets: ResourceAsset[]
}

export type ResourceNode =
  | ResourceFolder
  | ResourceFile

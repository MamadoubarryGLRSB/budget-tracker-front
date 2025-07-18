export interface CategoryInterface {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CategoryCreateInterface {
  name: string
}

export interface CategoryUpdateInterface {
  id: string
  name: string
}

export interface CategoryFormInterface {
  id?: string
  name?: string
  status: 'create' | 'update'
}

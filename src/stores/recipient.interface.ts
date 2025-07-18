export interface RecipientInterface {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface RecipientCreateInterface {
  name: string
}

export interface RecipientUpdateInterface {
  id: string
  name?: string
}

export interface RecipientFormInterface {
  id?: string
  name?: string
  status: 'create' | 'update'
}

export interface SavingAccountInterface {
  id: string
  userId: string
  name: string
  type: string
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface SavingAccountCreateInterface {
  name: string
  type: string // pour l'utilisateur, le compte d'épargne peut etre : de l'investissement, de l'argent stocké a la banque, ou autre
  balance: number
  currency: string
}

export interface SavingAccountUpdateInterface {
  id: string
  name?: string
  type?: string
  balance?: number
  currency?: string
}

export interface SavingAccountFormInterface {
  id?: string
  name?: string
  type?: string
  balance?: number
  currency?: string
  status: 'create' | 'update'
}

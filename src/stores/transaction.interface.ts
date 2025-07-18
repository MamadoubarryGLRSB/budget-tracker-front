import type { RecipientInterface } from './recipient.interface'
import type { SavingAccountInterface } from './saving-account.interface'
import type { CategoryInterface } from './category.interface'

export interface TransactionInterface {
  id: string
  accountId: string
  account?: SavingAccountInterface
  categoryId: string
  category?: CategoryInterface
  recipientId?: string
  recipient?: CategoryInterface
  userId: string
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
  createdAt: string
  updatedAt: string
}

export interface TransactionCreateInterface {
  accountId: string
  categoryId: string
  recipientId?: string
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
}

export interface TransactionUpdateInterface {
  id: string
  accountId: string
  categoryId: string
  recipientId?: string
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
}

export interface TransactionFormInterface {
  id?: string
  accountId?: string
  accountCurrency?: string
  categoryId?: string
  recipientId?: string
  date?: string
  description?: string
  amount?: number
  type?: 'expense' | 'income' | undefined
  status: 'create' | 'update'
}

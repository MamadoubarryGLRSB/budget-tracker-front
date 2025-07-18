import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useCategoryStore } from '@/stores/category'
import { useRecipientStore } from '@/stores/recipient'
import { useSavingAccountStore } from '@/stores/saving-account'
import { useUserStore } from '@/stores/user'

import type { StatusInterface } from './status.interface'
import type {
  TransactionInterface,
  TransactionCreateInterface,
  TransactionUpdateInterface,
} from './transaction.interface'

const FULL_API_URL: string = API_URL + 'transactions'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [] as TransactionInterface[],
    status: {} as StatusInterface,
  }),

  getters: {
    getTransactionIndex: (state) => (transactionId: string) => {
      return state.transactions.findIndex((transaction) => transaction.id === transactionId)
    },

    getTransactionById: (state) => (transactionId: string) => {
      const index = state.transactions.findIndex((transaction) => transaction.id === transactionId)
      return index !== -1 ? state.transactions[index] : false
    },

    getTransactionBySavingAccount: (state) => (savingAccountId: string) => {
      return state.transactions.filter((transaction) => transaction.accountId === savingAccountId)
    },

    getTransactions: (state) => {
      const categoryStore = useCategoryStore()
      const recipientStore = useRecipientStore()
      const savingAccountStore = useSavingAccountStore()

      return state.transactions.map((transaction) => {
        const category = categoryStore.getCategoryById(transaction.categoryId)
        const recipient = transaction.recipientId
          ? recipientStore.getRecipientById(transaction.recipientId)
          : ''
        const account = savingAccountStore.getSavingAccountById(transaction.accountId)

        return {
          ...transaction,
          category,
          recipient,
          account,
        }
      })
    },

    getTransactionsYears: async (state) => {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL + '/years', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error('Transactions error')

        const transactionsYears = await response.json()
        state.status = { status: true, message: 'Transaction get' }
        return transactionsYears ?? []
      } catch (error: any) {
        state.status = { status: false, message: error?.message || 'Unknown error' }
      }
    },

    getStatus: (state) => state.status,
  },

  actions: {
    /**
     * Create a transaction in the database
     * @param transactionData
     * @returns request status
     */
    async create(transactionData: TransactionCreateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      if (transactionData.recipientId === '') {
        delete transactionData.recipientId
      }

      try {
        const response = await fetch(FULL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(transactionData),
        })

        if (!response.ok) throw new Error('Transaction creation error')
        const transactionAdded = await response.json()

        const transaction = await this.addLinkedDataToTransaction(transactionAdded)
        this.transactions.push(transaction)
        this.status = { status: true, message: 'Transaction created' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Update the transaction data
     * @param transactionData
     * @returns request status
     */
    async update(transactionData: TransactionUpdateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getTransactionById(transactionData.id)) {
          this.status = { status: false, message: "Transaction didn't exist" }
          throw new Error("Transaction didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + transactionData.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(transactionData),
        })

        if (!response.ok) throw new Error('Update transaction data error')

        const transactionUpdated = await response.json()
        const index = this.getTransactionIndex(transactionData.id)

        const transaction = await this.addLinkedDataToTransaction(transactionUpdated)
        this.transactions.splice(index, 1, transaction)

        this.status = { status: true, message: 'Transaction updated' }
        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Delete the transaction data
     * @param transactionId
     * @returns request status
     */
    async delete(transactionId: string) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getTransactionById(transactionId)) {
          throw new Error("Transaction didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + transactionId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const index = this.getTransactionIndex(transactionId)
        this.transactions.splice(index, 1)
        this.status = { status: true, message: 'Transaction deleted' }

        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Add transactions data to the localStorage
     */
    async persist() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions))
    },

    /**
     * Get transactions data from the API
     * @returns request status
     */
    async initTransactions() {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error('Transactions error')

        const transactions = await response.json()
        this.transactions = transactions
        this.status = { status: true, message: 'Transaction get' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    async addLinkedDataToTransaction(
      inputTransactionData: TransactionCreateInterface | TransactionUpdateInterface,
    ) {
      const categoryStore = useCategoryStore()
      const category = categoryStore.getCategoryById(inputTransactionData.categoryId)
      const recipientStore = useRecipientStore()
      const recipient = inputTransactionData.recipientId
        ? recipientStore.getRecipientById(inputTransactionData.recipientId)
        : ''
      const savingAccountStore = useSavingAccountStore()
      const savingAccount = savingAccountStore.getSavingAccountById(inputTransactionData.accountId)

      return {
        ...inputTransactionData,
        category: category,
        account: savingAccount,
        recipient: recipient,
      }
    },
  },
})

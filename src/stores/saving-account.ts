import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useUserStore } from '@/stores/user'

import type { StatusInterface } from './status.interface'
import type {
  SavingAccountInterface,
  SavingAccountCreateInterface,
  SavingAccountUpdateInterface,
} from './saving-account.interface'

const FULL_API_URL: string = API_URL + 'accounts'

export const useSavingAccountStore = defineStore('saving-account', {
  state: () => ({
    savingAccounts: [] as SavingAccountInterface[],
    status: {} as StatusInterface,
  }),

  getters: {
    getSavingAccountIndex: (state) => (savingAccountId: string) => {
      return state.savingAccounts.findIndex((savingAccount) => savingAccount.id === savingAccountId)
    },

    getSavingAccountById: (state) => (savingAccountId: string) => {
      const index = state.savingAccounts.findIndex(
        (savingAccount) => savingAccount.id === savingAccountId,
      )
      return index !== -1 ? state.savingAccounts[index] : false
    },

    getSavingAccountLastIndex: (state) => () => {
      return state.savingAccounts.length
    },

    getSavingAccountSelect: (state) => () => {
      const selectData = state.savingAccounts.map((savingAccount) => {
        return {
          value: savingAccount.id,
          label: savingAccount.name,
        }
      })

      return selectData
    },

    getSavingAccounts: (state) => state.savingAccounts,

    getStatus: (state) => state.status,
  },

  actions: {
    /**
     * Create a saving account in the database
     * @param savingAccountData
     * @returns request status
     */
    async create(savingAccountData: SavingAccountCreateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(savingAccountData),
        })

        if (!response.ok) throw new Error('Saving account creation error')
        const savingAccountAdded = await response.json()

        const lastIndex = this.getSavingAccountLastIndex()
        const freeIndex = lastIndex + 1
        this.savingAccounts.splice(freeIndex, 1, savingAccountAdded)
        this.status = { status: true, message: 'Saving account created' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Update the saving account data
     * @param savingAccountData
     * @returns request status
     */
    async update(savingAccountData: SavingAccountUpdateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getSavingAccountById(savingAccountData.id)) {
          this.status = { status: false, message: "Saving account didn't exist" }
          throw new Error("Saving account didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + savingAccountData.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(savingAccountData),
        })

        if (!response.ok) throw new Error('Update saving account data error')

        const savingAccountUpdated = await response.json()
        const index = this.getSavingAccountIndex(savingAccountData.id)
        this.savingAccounts.splice(index, 1, savingAccountUpdated)

        this.status = { status: true, message: 'Saving account updated' }
        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Delete the saving account data
     * @param savingAccountId
     * @returns request status
     */
    async delete(savingAccountId: string) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getSavingAccountById(savingAccountId)) {
          throw new Error("Saving account didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + savingAccountId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const index = this.getSavingAccountIndex(savingAccountId)
        this.savingAccounts.splice(index, 1)
        this.status = { status: true, message: 'Saving account deleted' }

        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Add saving accounts data to the localStorage
     */
    async persist() {
      localStorage.setItem('saving-account', JSON.stringify(this.savingAccounts))
    },

    /**
     * Get saving accounts data from the API
     * @returns request status
     */
    async initSavingAccounts() {
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

        if (!response.ok) throw new Error('Saving accounts error')

        const savingAccounts = await response.json()
        this.savingAccounts = savingAccounts
        this.status = { status: true, message: 'Saving account get' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    checkCurrency(currency: string) {
      const availableCurrency = ['USD', 'EUR', 'GBP', 'CNY']

      return availableCurrency.includes(currency)
    },
  },
})

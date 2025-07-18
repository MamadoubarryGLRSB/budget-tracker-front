import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useUserStore } from '@/stores/user'

import type { StatusInterface } from './status.interface'
import type {
  RecipientInterface,
  RecipientCreateInterface,
  RecipientUpdateInterface,
} from './recipient.interface'

const FULL_API_URL: string = API_URL + 'recipients'

export const useRecipientStore = defineStore('recipient', {
  state: () => ({
    recipients: [] as RecipientInterface[],
    status: {} as StatusInterface,
  }),

  getters: {
    getRecipientIndex: (state) => (recipientId: string) => {
      return state.recipients.findIndex((recipient) => recipient.id === recipientId)
    },

    getRecipientById: (state) => (recipientId: string) => {
      const index = state.recipients.findIndex((recipient) => recipient.id === recipientId)
      return index !== -1 ? state.recipients[index] : false
    },

    getRecipientLastIndex: (state) => () => {
      return state.recipients.length
    },

    getRecipientSelect: (state) => () => {
      const selectData = state.recipients.map((recipient) => {
        return {
          value: recipient.id,
          label: recipient.name,
        }
      })

      return selectData
    },

    getRecipients: (state) => state.recipients,

    getStatus: (state) => state.status,
  },

  actions: {
    /**
     * Create a recipient in the database
     * @param recipientData
     * @returns request status
     */
    async create(recipientData: RecipientCreateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(recipientData),
        })

        if (!response.ok) throw new Error('Recipient creation error')
        const recipientAdded = await response.json()

        const lastIndex = this.getRecipientLastIndex()
        const freeIndex = lastIndex + 1
        this.recipients.splice(freeIndex, 1, recipientAdded)
        this.status = { status: true, message: 'Recipient created' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Update the recipient data
     * @param recipientData
     * @returns request status
     */
    async update(recipientData: RecipientUpdateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getRecipientById(recipientData.id)) {
          this.status = { status: false, message: "Recipient didn't exist" }
          throw new Error("Recipient didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + recipientData.id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(recipientData),
        })

        if (!response.ok) throw new Error('Update recipient data error')

        const recipientUpdated = await response.json()
        const index = this.getRecipientIndex(recipientData.id)
        this.recipients.splice(index, 1, recipientUpdated)

        this.status = { status: true, message: 'Recipient updated' }
        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Delete the recipient data
     * @param recipientId
     * @returns request status
     */
    async delete(recipientId: string) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getRecipientById(recipientId)) {
          throw new Error("Recipient didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + recipientId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const index = this.getRecipientIndex(recipientId)
        this.recipients.splice(index, 1)
        this.status = { status: true, message: 'Recipient deleted' }

        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Add recipients data to the localStorage
     */
    async persist() {
      localStorage.setItem('recipient', JSON.stringify(this.recipients))
    },

    /**
     * Get recipient data from the API
     * @returns request status
     */
    async initRecipients() {
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

        if (!response.ok) throw new Error('Recipients error')

        const recipients = await response.json()
        this.recipients = recipients
        this.status = { status: true, message: 'Recipient get' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },
  },
})

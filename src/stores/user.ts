import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useCategoryStore } from './category'
import { useRecipientStore } from './recipient'
import { useSavingAccountStore } from './saving-account'
import { useTransactionStore } from './transaction'

import type { StatusInterface } from './status.interface'
import type {
  UserInterface,
  LoginUserInterface,
  LoginUserResponseInterface,
  SignInUserInterface,
  UpdateUserInterface,
} from './user.interface'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as UserInterface,
    token: '' as string,
    status: {} as StatusInterface,
  }),

  getters: {
    getUser: (state) => {
      return state.user
    },

    getStatus: (state) => {
      return state.status
    },

    getToken: (state) => {
      return state.token
    },

    isLogged: (state) => {
      return !!state.user.id
    },
  },

  actions: {
    /**
     * Create a user in the database
     * @param signInData
     * @returns request status
     */
    async signInUser(signInData: SignInUserInterface) {
      const url: string = API_URL + 'users'
      const method: string = 'POST'

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signInData),
        })

        if (!response.ok) {
          throw new Error('Account creation error')
        }

        this.status = { status: true, message: 'Account created' }
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.status = { status: false, message: error.message }
        } else {
          this.status = { status: false, message: 'Unknown error' }
        }
      } finally {
        return this.status
      }
    },

    /**
     * Get user data if exist in database
     * @param loginData
     * @returns request status
     */
    async loginUser(loginData: LoginUserInterface) {
      const url: string = API_URL + 'auth/login'
      const method: string = 'POST'

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        })

        if (!response.ok) {
          throw new Error(`Login error. Login or password incorrect`)
        }

        const loginResponse: LoginUserResponseInterface = await response.json()
        this.user = loginResponse.user
        this.token = loginResponse.access_token
        this.isLogin = true

        this.status = { status: true, message: 'Success login' }
        this.persist()
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.status = { status: false, message: error.message }
        } else {
          this.status = { status: false, message: 'Unknown error' }
        }
      } finally {
        return this.status
      }
    },

    /**
     * Remove all data in store and localstorage
     * @returns request status
     */
    logoutUser() {
      this.user = {} as UserInterface
      this.token = ''
      this.isLogin = false

      this.persist()

      this.status = { status: true, message: 'Logged out' }
      return this.status
    },

    /**
     * Update the current user data
     * @param updatedUserData
     * @returns request status
     */
    async updateUser(updatedUserData: UpdateUserInterface) {
      if (!this.user.id) {
        throw new Error('User ID undefined')
      }

      const url: string = API_URL + 'users/' + this.user.id
      const method: string = 'PUT'

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(updatedUserData),
        })

        if (!response.ok) {
          this.status = { status: false, message: 'Update user data error' }
          throw new Error(`Response status: ${response.status}`)
        }

        const userUpdated = await response.json()
        this.user = userUpdated
        this.status = { status: true, message: 'Account updated' }

        this.persist()
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.status = { status: false, message: error.message }
        } else {
          this.status = { status: false, message: 'Unknown error' }
        }
      } finally {
        return this.status
      }
    },

    /**
     * Delete the current user data in database
     * @returns request status
     */
    async deleteUser() {
      if (!this.user.id) {
        throw new Error('User ID undefined')
      }

      const url: string = API_URL + 'users/' + this.user.id
      const method: string = 'DELETE'

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        })
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }

        this.user = {} as UserInterface
        this.token = ''
        this.status = { status: true, message: 'Account deleted' }
        this.isLogin = false

        this.persist()
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.status = { status: false, message: error.message }
        } else {
          this.status = { status: false, message: 'Unknown error' }
        }
      } finally {
        return this.status
      }
    },

    /**
     * Check if the current session is valid to access the app
     * @returns boolean session state
     */
    async checkSession() {
      this.initUser()

      if (!this.user.id || !this.token) {
        return false
      }

      const url: string = API_URL + 'auth/profile'
      const method: string = 'GET'

      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        })

        /**
         * 401 Session expired
         * 200, 201, ... ok
         */
        return response.ok
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.status = { status: false, message: error.message }
        } else {
          this.status = { status: false, message: 'Unknown error' }
        }
      }
    },

    /**
     * Add user data to the localStorage
     */
    async persist() {
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', JSON.stringify(this.token))
    },

    /**
     * Get user data from the localStorage
     */
    async initUser() {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser)
        const parsedToken = JSON.parse(storedToken)
        this.user = parsedUser
        this.token = parsedToken
      } else {
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', JSON.stringify(this.token))
      }

      const categoryStore = useCategoryStore()
      categoryStore.initCategories()

      const recipientStore = useRecipientStore()
      recipientStore.initRecipients()

      const savingAccountStore = useSavingAccountStore()
      savingAccountStore.initSavingAccounts()

      const transactionStore = useTransactionStore()
      transactionStore.initTransactions()
    },
  },
})

import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useUserStore } from '@/stores/user'

import type { StatusInterface } from './status.interface'
import type {
  CategoryInterface,
  CategoryCreateInterface,
  CategoryUpdateInterface,
} from './category.interface'

const FULL_API_URL: string = API_URL + 'categories'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as CategoryInterface[],
    status: {} as StatusInterface,
  }),

  getters: {
    getCategoryIndex: (state) => (categoryId: string) => {
      return state.categories.findIndex((category) => category.id === categoryId)
    },

    getCategoryById: (state) => (categoryId: string) => {
      const index = state.categories.findIndex((category) => category.id === categoryId)
      return index !== -1 ? state.categories[index] : false
    },

    getCategoryLastIndex: (state) => () => {
      return state.categories.length
    },

    getCategorySelect: (state) => () => {
      const selectData = state.categories.map((category) => {
        return {
          value: category.id,
          label: category.name,
        }
      })

      return selectData
    },

    getCategories: (state) => state.categories,

    getStatus: (state) => state.status,
  },

  actions: {
    /**
     * Create a category in the database
     * @param categoryData
     * @returns request status
     */
    async create(categoryData: CategoryCreateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) throw new Error('Category creation error')
        const categoryAdded = await response.json()

        const lastIndex = this.getCategoryLastIndex()
        const freeIndex = lastIndex + 1
        this.categories.splice(freeIndex, 1, categoryAdded)
        this.status = { status: true, message: 'Category created' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Update the category data
     * @param categoryData
     * @returns request status
     */
    async update(categoryData: CategoryUpdateInterface) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getCategoryById(categoryData.id)) {
          this.status = { status: false, message: "Category didn't exist" }
          throw new Error("Category didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + categoryData.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) throw new Error('Update category data error')

        const categoryUpdated = await response.json()
        const index = this.getCategoryIndex(categoryData.id)
        this.categories.splice(index, 1, categoryUpdated)

        this.status = { status: true, message: 'Category updated' }
        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Delete the category data
     * @param categoryId
     * @returns request status
     */
    async delete(categoryId: string) {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        if (!this.getCategoryById(categoryId)) {
          throw new Error("Category didn't exist")
        }

        const response = await fetch(FULL_API_URL + '/' + categoryId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error(`Response status: ${response.status}`)

        const index = this.getCategoryIndex(categoryId)
        this.categories.splice(index, 1)
        this.status = { status: true, message: 'Category deleted' }

        this.persist()
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },

    /**
     * Add categories data to the localStorage
     */
    async persist() {
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },

    /**
     * Get categories data from the API
     * @returns request status
     */
    async initCategories() {
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

        if (!response.ok) throw new Error('Categories error')

        const categories = await response.json()
        this.categories = categories
        this.status = { status: true, message: 'Category get' }
      } catch (error: any) {
        this.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return this.status
      }
    },
  },
})

import { defineStore } from 'pinia'
const API_URL = import.meta.env.VITE_API_URL

import { useUserStore } from '@/stores/user'

import type { MonthlyBalanceInterface, DonutInputDataInterface } from './chart.interface'
import type { StatusInterface } from './status.interface'

const FULL_API_URL: string = API_URL + 'statistics'

export const useChartStore = defineStore('chart', {
  state: () => ({
    status: {} as StatusInterface,
  }),

  getters: {
    /**
     * Get monthly balance for a specified year
     * @param year
     * @returns array
     */
    getMonthlyBalance: (state) => async (year: number) => {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL + `/monthly-balance?year=${year}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error("Can't get monthly balance")

        const monthlyBalance: MonthlyBalanceInterface[] = await response.json()
        state.status = { status: true, message: 'Monthly balance get' }

        return monthlyBalance
      } catch (error: any) {
        state.status = { status: false, message: error?.message || 'Unknown error' }
      }
    },

    /**
     * Get monthly balance for a specified year
     * @param year
     * @returns array
     */
    getDonutData: (state) => async (data: DonutInputDataInterface) => {
      const { type, id, startDate, endDate } = data
      const idBuilded = id ? `/${id}` : ''

      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(
          FULL_API_URL + `/${type}${idBuilded}?startDate=${startDate}&endDate=${endDate}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
          },
        )

        if (!response.ok) throw new Error("Can't get donut data")

        const donutData: MonthlyBalanceInterface[] = await response.json()
        state.status = { status: true, message: 'Donut data get' }

        return donutData
      } catch (error: any) {
        state.status = { status: false, message: error?.message || 'Unknown error' }
      }
    },

    get: (state) => async (year: number) => {
      const userStore = useUserStore()
      const userToken = userStore.getToken

      try {
        const response = await fetch(FULL_API_URL + `/monthly-balance?year=${year}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) throw new Error("Can't get monthly balance")

        const monthlyBalance: MonthlyBalanceInterface[] = await response.json()
        state.status = { status: true, message: 'Monthly balance get' }

        return monthlyBalance
      } catch (error: any) {
        state.status = { status: false, message: error?.message || 'Unknown error' }
      } finally {
        return state.status
      }
    },

    getStatus: (state) => state.status,
  },
})

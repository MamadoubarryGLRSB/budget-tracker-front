export interface MonthlyBalanceInterface {
  balance: number
  expenses: number
  incomes: number
  month: number
}

export interface DonutInputDataInterface {
  type: 'account' | 'category' | 'recipient' | null
  id?: string
  startDate: string
  endDate: string
}

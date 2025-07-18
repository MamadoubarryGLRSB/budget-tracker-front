<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useChartStore } from '@/stores/chart'
import Chart from 'chart.js/auto'

import type { MonthlyBalanceInterface } from '@/stores/chart.interface'

const props = defineProps<{
  year: number
}>()

const chartStore = useChartStore()
const chartTitle = 'Monthly Balance'
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const loadChart = async (year: number) => {
  const monthlyBalanceData = await chartStore.getMonthlyBalance(year)
  const monthlyBalance: MonthlyBalanceInterface[] = monthlyBalanceData || []

  const labels = monthlyBalance.map((d) => `Month ${d.month}`)
  const incomes = monthlyBalance.map((d) => d.incomes)
  const expenses = monthlyBalance.map((d) => -d.expenses)
  const balances = monthlyBalance.map((d) => d.balance)

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        data: balances,
        type: 'line',
        borderColor: '#4338ca',
        backgroundColor: 'transparent',
        tension: 0.25,
        pointRadius: 2,
        borderWidth: 3,
        pointBackgroundColor: 'rgba(0, 0, 200, 1)',
      },
      {
        label: 'Incomes',
        data: incomes,
        backgroundColor: '#009c12',
        borderRadius: 5,
      },
      {
        label: 'Expenses',
        data: expenses,
        backgroundColor: '#d9363e',
        borderRadius: 5,
      },
    ],
  }

  const config = {
    type: 'bar' as const,
    data,
    options: {
      responsive: true,
      plugins: {
        layout: {
          padding: {
            top: 20,
            bottom: 20,
          },
        },
      },
    },
  }

  // Destroy the old graph
  if (chartInstance) {
    chartInstance.destroy()
  }

  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, config)
  }
}

onMounted(() => {
  loadChart(props.year)
})

watch(
  () => props.year,
  (newYear) => {
    loadChart(newYear)
  },
)
</script>

<template>
  <div class="chart-container">
    <a-typography-title :level="2">{{ chartTitle }} - {{ year }}</a-typography-title>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style lang="scss">
@import '@/assets/themes/_variables.scss';

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 99%;
}
</style>

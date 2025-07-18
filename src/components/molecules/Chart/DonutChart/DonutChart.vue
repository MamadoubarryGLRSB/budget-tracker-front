<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChartStore } from '@/stores/chart'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  dates?: string[]
}>()

const availableData = ref<boolean>(false)

const chartStore = useChartStore()

const incomeChartRef = ref<HTMLCanvasElement | null>(null)
const expenseChartRef = ref<HTMLCanvasElement | null>(null)

const incomeChartInstance = ref<Chart | null>(null)
const expenseChartInstance = ref<Chart | null>(null)

const chartData = ref<any>(null)

function getIncomeData() {
  return {
    labels: chartData.value.accountBreakdown.map((acc: any) => acc.accountName),
    datasets: [
      {
        label: 'Incomes',
        data: chartData.value.accountBreakdown.map((acc: any) => acc.totalIncomes),
        backgroundColor: ['#16a34a', '#22c55e', '#4ade80', '#86efac'],
      },
    ],
  }
}

function getExpenseData() {
  return {
    labels: chartData.value.accountBreakdown.map((acc: any) => acc.accountName),
    datasets: [
      {
        label: 'Expenses',
        data: chartData.value.accountBreakdown.map((acc: any) => acc.totalExpenses),
        backgroundColor: ['#dc2626', '#ef4444', '#f87171', '#fca5a5'],
      },
    ],
  }
}

async function renderCharts() {
  if (!props.dates || props.dates.length !== 2) return

  chartData.value = await chartStore.getDonutData({
    type: 'account',
    startDate: props.dates[0],
    endDate: props.dates[1],
  })

  if (!chartData.value) {
    availableData.value = false
    console.error('Donut data undefined')
    return
  }

  const incomeData = getIncomeData()
  const expenseData = getExpenseData()

  console.log(incomeData.datasets[0].data.length)
  console.log(expenseData.datasets[0].data.length)

  if (!incomeData.datasets[0].data.length || !expenseData.datasets[0].data.length) {
    availableData.value = false
    console.error('Donut data undefined')
    return
  }

  availableData.value = true

  if (incomeChartInstance.value) {
    incomeChartInstance.value.destroy()
  }

  if (expenseChartInstance.value) {
    expenseChartInstance.value.destroy()
  }

  incomeChartInstance.value = new Chart(incomeChartRef.value!, {
    type: 'doughnut',
    data: incomeData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  })

  expenseChartInstance.value = new Chart(expenseChartRef.value!, {
    type: 'doughnut',
    data: expenseData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  })
}

watch(
  () => props.dates,
  () => {
    renderCharts()
  },
  { immediate: true },
)
</script>

<template>
  <a-empty
    v-if="!availableData"
  />
  <div
    class="chart-container"
    :class="{ hidden: !availableData }"
  >
    <div>
      <a-typography-title :level="2">Incomes</a-typography-title>
      <canvas ref="incomeChartRef"></canvas>
    </div>
    <div>
      <a-typography-title :level="2">Expenses</a-typography-title>
      <canvas ref="expenseChartRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 2rem;
}

.hidden {
  visibility: hidden;
}

@media (width <= 780px) {
  .chart-container {
    flex-direction: column;
  }
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue'

import MonthlyBalanceForm from '@/components/molecules/Chart/MonthlyBalanceForm/MonthlyBalanceForm.vue'
import MonthlyBalanceChart from '@/components/molecules/Chart/MonthlyBalanceChart/MonthlyBalanceChart.vue'
import DonutChart from '@/components/molecules/Chart/DonutChart/DonutChart.vue'
import DonutChartForm from '@/components/molecules/Chart/DonutChartForm/DonutChartForm.vue'

const chartSelect = [
  {
    value: 'monthlyBalanceChart',
    label: 'Monthly balance',
  },
  {
    value: 'donutChart',
    label: 'Donut chart',
  },
]
const chartSelectValue = ref('monthlyBalanceChart')

const formState = reactive({
  year: new Date().getFullYear(),
  dates: [],
  savingAccount: '',
})

const resetValue = () => {
  formState.year = new Date().getFullYear()
  formState.savingAccount = ''
  formState.dates = []
}

const monthlyBalanceChange = (year: number, savingAccount: string) => {
  formState.year = year
  formState.savingAccount = savingAccount
}
const donutChange = (dates: string[]) => {
  formState.dates = dates
}
</script>

<template>
  <a-typography-title>Chart</a-typography-title>

  <div class="container">
    <div>
      <a-form-item
        label="Chart model"
        :rules="[{ required: true, message: 'Chart model is required' }]"
      >
        <a-select
          v-model:value="chartSelectValue"
          placeholder="Chart model"
          :options="chartSelect"
          class="chartSelector"
          @change="resetValue"
        />
      </a-form-item>

      <div v-if="chartSelectValue === 'monthlyBalanceChart'">
        <!-- Monthly balance form -->
        <MonthlyBalanceForm
          :monthlyBalanceYear="formState.year"
          :onChange="monthlyBalanceChange"
        />
      </div>

      <div v-if="chartSelectValue === 'donutChart'">
        <DonutChartForm :onChange="donutChange" />
      </div>
    </div>

    <MonthlyBalanceChart
      v-if="chartSelectValue === 'monthlyBalanceChart'"
      :year="formState.year"
    />
    <DonutChart
      v-if="chartSelectValue === 'donutChart'"
      :dates="formState.dates"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/themes/_variables.scss';

.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  height: 80%;
}

.chartSelector {
  width: 100%;
}

@media (width <= 900px) {
  .container {
    grid-template-columns: 1fr;
    height: unset;
  }
}
</style>

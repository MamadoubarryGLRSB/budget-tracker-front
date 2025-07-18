<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useTransactionStore } from '@/stores/transaction'

import type {
  MonthlyBalanceFormInterface,
  MonthlyBalanceYearSelect,
} from './MonthlyBalanceForm.interface'

const transactionStore = useTransactionStore()

const props = defineProps<{
  monthlyBalanceYear: number
  onChange: (year: number, savingAccount: string) => void
}>()

const formState = reactive<MonthlyBalanceFormInterface>({
  year: props.monthlyBalanceYear,
  savingAccount: '',
})

const monthlyBalanceSelect = ref<MonthlyBalanceYearSelect[]>([])

watch(
  () => props.monthlyBalanceYear,
  (newYear) => {
    formState.year = newYear
  },
)

onMounted(async () => {
  const transactionsYears = await transactionStore.getTransactionsYears

  monthlyBalanceSelect.value = transactionsYears.map((year) => ({
    value: year.year,
    label: `${year.year} (${year.totalTransactions})`,
  }))
})

const onYearChange = (value: number) => {
  formState.year = value
  props.onChange(formState.year, formState.savingAccount)
}
</script>

<template>
  <div class="form-container">
    <a-form-item
      label="Year"
      :rules="[{ required: true, message: 'Year is required' }]"
    >
      <a-select
        :value="formState.year"
        placeholder="Year"
        :options="monthlyBalanceSelect"
        class="yearSelector"
        @change="onYearChange"
      />
    </a-form-item>
  </div>
</template>

<style lang="scss">
@import '@/assets/themes/_variables.scss';

.form-container {
  margin-top: 2rem;
}
</style>

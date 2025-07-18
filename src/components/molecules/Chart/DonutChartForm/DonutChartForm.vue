<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  dates?: string[]
  onChange: (dates: string[]) => void
}>()

const inputState = ref<boolean>(false)

const onDatesChange = (value: any) => {
  const startDate = value?.[0]?.format('YYYY-MM-DD') || ''
  const endDate = value?.[1]?.format('YYYY-MM-DD') || ''

  if (!startDate || !endDate) {
    inputState.value = true
  } else {
    inputState.value = false
  }

  props.onChange([startDate, endDate])
}
</script>

<template>
  <div class="form-container">
    <a-form-item
      label="Dates"
      :rules="[{ required: true, message: 'Dates are required' }]"
      :validate-status="inputState ? 'error' : ''"
    >
      <a-range-picker
        :format="'DD/MM/YYYY'"
        @change="onDatesChange"
      />
    </a-form-item>
  </div>
</template>

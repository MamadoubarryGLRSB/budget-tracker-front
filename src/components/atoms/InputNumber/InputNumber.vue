<script setup lang="ts">
import { watch, ref } from 'vue'

import type { InputNumberInterface } from './InputNumber.interface'

const props = defineProps<InputNumberInterface>()

const value = ref<string>('')

watch(value, () => {
  if (props.onChange) {
    props.onChange(value.value)
  }
})
</script>

<template>
  <a-input-number
    :id="id"
    :placeholder="placeholder"
    :defaultValue="defaultValue || 0"
    :disabled="disabled"
    :max="max || null"
    :min="min || null"
    :status="status"
    type="number"
    v-model:value="value"
  />
</template>

<style scoped></style>

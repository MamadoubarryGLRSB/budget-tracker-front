<script setup lang="ts">
import { watch, ref } from 'vue'

import type { InputTextInterface } from './InputText.interface'

const props = defineProps<InputTextInterface>()

const value = ref<string>('')

watch(value, () => {
  if (props.onChange) {
    props.onChange(value.value)
  }
})
</script>

<template>
  <a-input
    :id="id"
    :placeholder="placeholder"
    :defaultValue="defaultValue || ''"
    :disabled="disabled"
    :maxLength="maxLength || null"
    :showCount="showCount"
    :status="status"
    type="text"
    v-model:value="value"
  />
</template>

<style scoped></style>

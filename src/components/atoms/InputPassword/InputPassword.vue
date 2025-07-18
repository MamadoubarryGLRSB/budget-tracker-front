<script setup lang="ts">
import { watch, ref } from 'vue'

import type { InputPasswordInterface } from './InputPassword.interface'

const props = defineProps<InputPasswordInterface>()

const value = ref<string>('')

watch(value, () => {
  if (props.onChange) {
    props.onChange(value.value)
  }
})
</script>

<template>
  <a-input-password
    :id="id"
    :placeholder="placeholder"
    :defaultValue="defaultValue || ''"
    :disabled="disabled"
    :maxLength="maxLength || null"
    :status="status"
    type="password"
    v-model:value="value"
  />
</template>

<style scoped></style>

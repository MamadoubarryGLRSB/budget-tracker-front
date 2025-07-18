<script setup lang="ts">
import { watch, ref } from 'vue'

import type { CheckboxInterface } from './Checkbox.interface'

const props = defineProps<CheckboxInterface>()

const checked = ref<boolean>(props.value)

watch(checked, () => {
  if (props.onChange) {
    props.onChange(checked.value)
  }
})
</script>

<template>
  <a-checkbox
    v-model:checked="checked"
    :disabled="disabled"
    :id="id"
    :value="value"
  >
    {{ placeholder }}
  </a-checkbox>
</template>

<style lang="scss" scoped></style>

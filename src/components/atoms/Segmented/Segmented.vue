<script setup lang="ts">
import { watch, ref } from 'vue'

import type { SegmentedInterface } from './Segmented.interface'

const props = defineProps<SegmentedInterface>()

const value = ref<string | number>(props.value)

watch(value, () => {
  if (props.onChange) {
    props.onChange(value.value)
  }
})
</script>

<template>
  <a-segmented
    v-model:value="value"
    :block="block"
    :disabled="disabled"
    :options="options"
  />
</template>

<style lang="scss">
@import '@/assets/themes/_variables.scss';

.ant-segmented-item-selected {
  background-color: map-get($colors, primary) !important;

  .ant-segmented-item-label {
    color: map-get($colors, white) !important;
  }
}

.ant-segmented-thumb {
  background-color: map-get($colors, primary) !important;
}
</style>

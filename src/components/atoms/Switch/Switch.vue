<script setup lang="ts">
import { watch, ref } from 'vue'

import type { SwitchInterface } from './Switch.interface'

const props = defineProps<SwitchInterface>()

const checked = ref<boolean>(props.checked)

watch(checked, () => {
  if (props.onChange) {
    props.onChange(checked.value)
  }
})
</script>

<template>
  <div class="ant-checkbox-wrapper">
    <a-switch
      v-model:checked="checked"
      :id="id"
      :checkedChildren="checkedChildren"
      :disabled="disabled"
      :loading="loading"
      :unCheckedChildren="unCheckedChildren"
    />
    <a-typography-text class="switch-placeholder">{{ placeholder }}</a-typography-text>
  </div>
</template>

<style lang="scss" scoped>
// Inspired by the checkbox style

.switch-placeholder {
  padding-inline-start: 8px;
  padding-inline-end: 8px;
}
</style>

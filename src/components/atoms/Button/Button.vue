<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { ButtonInterface } from './Button.interface'

const props = defineProps<ButtonInterface>()
</script>

<template>
  <div v-if="href">
    <!-- link element -->
    <RouterLink :to="href">
      <a-button
        :block="block"
        :danger="danger"
        :disabled="disabled"
        :ghost="ghost"
        htmlType="button"
        :loading="loading"
        :shape="shape || null"
        :size="size ? size : null"
        :target="target || null"
        :type="type || 'primary'"
        :click="click || null"
      >
        <slot></slot>
      </a-button>
    </RouterLink>
  </div>

  <div v-else>
    <!-- button element -->
    <a-button
      :block="block"
      :danger="danger"
      :disabled="disabled"
      :ghost="ghost"
      :htmlType="htmlType || null"
      :loading="loading"
      :shape="shape || null"
      :size="size ? size : null"
      :target="target || null"
      :type="type || 'primary'"
      :click="click || null"
    >
      <slot></slot>
    </a-button>
  </div>
</template>

<style scoped></style>

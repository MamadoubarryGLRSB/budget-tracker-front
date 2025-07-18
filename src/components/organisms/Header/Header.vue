<script setup lang="ts">
import { Icon } from '@iconify/vue'

import logo from '@/assets/img/logo-web.png'

import { useUserStore } from '@/stores/user'

import Button from '@/components/atoms/Button/Button.vue'

const userStore = useUserStore()
</script>

<template>
  <header class="header">
    <img
      class="header-app-icon"
      :src="logo"
      alt="application logo"
    />
    <Button
      v-if="userStore.isLogged"
      :href="{ name: 'account' }"
      shape="circle"
      size="large"
    >
      <Icon
        icon="material-symbols:person"
        width="26"
      />
    </Button>
  </header>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 0 map-get($padding, x);
  height: map-get($header, height);
  background-color: map-get($colors, primaryLight);

  &-app-icon {
    width: 300px;
  }
}

@media (width <= 900px) {
  .header {
    padding: 0 map-get($padding, mediumX);
  }
}

@media (width <= 650px) {
  .header {
    padding: 0 map-get($padding, littleX);
  }
}
</style>

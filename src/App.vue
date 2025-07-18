<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/organisms/Header/Header.vue'
import Sidebar from '@/components/organisms/Sidebar/Sidebar.vue'

import lightTheme from '@/assets/themes/AntDesignVueThemeLight.json'
</script>

<template>
  <a-config-provider :theme="lightTheme">
    <Header></Header>

    <div class="page-container">
      <Sidebar />
      <main class="main">
        <RouterView />
      </main>
    </div>
  </a-config-provider>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.page-container {
  display: flex;
  justify-content: space-between;
  height: calc(100vh - map-get($header, height));
}

.main {
  height: 100%;
  width: 100%;
  padding: map-get($padding, y) map-get($padding, x);
  overflow-y: scroll;
  overflow-x: hidden;
}

@media (width <= 900px) {
  .main {
    padding: map-get($padding, mediumY) map-get($padding, mediumX);
  }
}

@media (width <= 650px) {
  .main {
    padding: map-get($padding, littleY) map-get($padding, littleX);
  }
}
</style>

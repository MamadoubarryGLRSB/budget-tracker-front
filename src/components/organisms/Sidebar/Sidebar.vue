<script setup lang="ts">
import { reactive } from 'vue'
import { Icon } from '@iconify/vue'

import { useUserStore } from '@/stores/user'

import Button from '@/components/atoms/Button/Button.vue'

import type { SidebarInterface } from './Sidebar.interface'

const userStore = useUserStore()

const sidebar = reactive<SidebarInterface>({
  state: false,
  class: 'sidebar-nav-closed',
  buttonIcon: 'material-symbols:chevron-right-rounded',
})

const toggleSidebar = () => {
  sidebar.state = !sidebar.state
  sidebar.class = sidebar.state ? 'sidebar-nav-opened' : 'sidebar-nav-closed'
  sidebar.buttonIcon = sidebar.state
    ? 'material-symbols:chevron-left-rounded'
    : 'material-symbols:chevron-right-rounded'
}
</script>

<template>
  <aside
    v-if="userStore.isLogged"
    class="sidebar"
  >
    <nav :class="['sidebar-nav', sidebar.class]">
      <Button
        :block="true"
        :href="{ name: 'dashboard' }"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols:team-dashboard"
            width="24"
          />
          Dashboard
        </span>
      </Button>
      <Button
        :block="true"
        :href="{ name: 'dashboard.category' }"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols:category-rounded"
            width="24"
          />
          Category
        </span>
      </Button>
      <Button
        :block="true"
        :href="{ name: 'dashboard.saving-account' }"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols:lists-rounded"
            width="24"
          />
          Saving account
        </span>
      </Button>
      <Button
        :block="true"
        :href="{ name: 'dashboard.recipient' }"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols:person"
            width="24"
          />
          Recipient
        </span>
      </Button>
      <Button
        :block="true"
        :href="{ name: 'dashboard.chart' }"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols:table-chart-view-rounded"
            width="24"
          />
          Chart
        </span>
      </Button>
      <Button
        :block="true"
        :href="{ name: 'logout' }"
        :danger="true"
        size="large"
        type="default"
      >
        <span class="button-content">
          <Icon
            icon="material-symbols-light:logout-rounded"
            width="24"
          />
          Logout
        </span>
      </Button>
    </nav>

    <button
      class="sidebar-toggle-button"
      :onclick="toggleSidebar"
    >
      <Icon
        :icon="sidebar.buttonIcon"
        width="40"
      />
    </button>
  </aside>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.sidebar {
  position: relative;
  height: 100%;
  width: fit-content;
  background-color: map-get($colors, primaryDark);

  &-nav {
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 0.5rem;
    height: 100%;
    overflow: hidden;
    transition: 0.2s;

    &-opened {
      padding: 1rem 0.75rem;
      width: fit-content;
    }

    &-closed {
      padding: 1rem 0;
      width: 0;
    }
  }

  &-toggle-button {
    position: absolute;
    left: 100%;
    bottom: 5rem;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    padding: 0;
    background-color: map-get($colors, primaryDark);
    color: map-get($colors, white);
    border: none;
    border-radius: 0 99px 99px 0;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: map-get($colors, primary);
    }
  }
}

.button-content {
  display: flex;
  justify-content: start;
  align-content: center;
  align-items: center;
  gap: 0.25rem;
}
</style>

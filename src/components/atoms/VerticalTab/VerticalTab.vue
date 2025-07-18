<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useSavingAccountStore } from '@/stores/saving-account'

import type { VerticalTabInterface } from './VerticalTab.interface'

const route = useRoute()
const savingAccountStore = useSavingAccountStore()

const props = defineProps<VerticalTabInterface>()

// Anchor items generation
const anchorItems = savingAccountStore.getSavingAccounts.map((savingAccount) => {
  return {
    key: savingAccount.id,
    title: capitalizeFirstLetter(savingAccount.name),
    href: '#' + savingAccount.name,
  }
})

// First anchor is always "general"
anchorItems.unshift({
  key: '',
  title: 'All my saving accounts',
  href: '#',
})

function capitalizeFirstLetter(string: string) {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
function getKeyFromHash(hash: string) {
  const item = anchorItems.find((element) => element.href === hash)
  return item ? item.key : ''
}
const getCurrentAnchor = (hashUrl: string | undefined) => {
  if (hashUrl) {
    return hashUrl
  } else {
    if (route.hash) {
      return route.hash
    } else {
      return '#'
    }
  }
}
const onChange = (hashUrl: string) => {
  props.change(getKeyFromHash(getCurrentAnchor(hashUrl)))
}
</script>

<template>
  <div class="vertical-tab">
    <div class="vertical-tab-header">Saving accounts</div>
    <a-anchor
      :affix="false"
      :items="anchorItems"
      :get-current-anchor="getCurrentAnchor"
      @change="onChange"
    ></a-anchor>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/themes/_variables.scss';

.vertical-tab {
  padding: 0 16px 16px 16px;
  height: fit-content;
  background-color: #edf1ff;
  border-radius: 12px;

  &-header {
    padding: 16px 0;
    color: map-get($colors, primary);
    font-weight: 600;
  }
}
</style>

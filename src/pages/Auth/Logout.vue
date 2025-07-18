<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()

const status = userStore.logoutUser()

message.success(status.message)
router.push({ name: 'auth' })
</script>

<template>
  <div class="logout-container">
    <a-spin size="large" />
  </div>
</template>

<style scoped lang="scss">
.logout-container {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>

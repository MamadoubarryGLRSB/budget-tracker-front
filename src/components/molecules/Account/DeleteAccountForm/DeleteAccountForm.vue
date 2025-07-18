<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'

import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'

const router = useRouter()
const userStore = useUserStore()

function confirmDeletion() {
  Modal.confirm({
    title: 'Are you sure you want to delete this account ?',
    content: 'All your account data and history transaction will be deleted',
    okText: 'Yes',
    okType: 'danger',
    async onOk() {
      try {
        return await new Promise(async (resolve, reject) => {
          const status = await userStore.deleteUser()

          if (status.status) {
            setTimeout(resolve, 50)
            await message.success(status.message + '. Redirection...', 3)

            router.push({ name: 'auth' })
          } else {
            setTimeout(reject, 50)
            message.error(status.message)
          }
        })
      } catch {
        return console.log('Oops errors!')
      }
    },
    onCancel() {},
  })
}
</script>

<template>
  <Button
    :danger="true"
    :onClick="confirmDeletion"
  >
    Delete my account
  </Button>
</template>

<style scoped></style>

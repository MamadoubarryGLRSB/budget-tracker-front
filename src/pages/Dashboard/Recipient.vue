<script setup lang="ts">
import { ref, computed } from 'vue'

import { useRecipientStore } from '@/stores/recipient'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import RecipientForm from '@/components/molecules/Recipient/RecipientForm/RecipientForm.vue'

const recipientStore = useRecipientStore()
const dataSource = computed(() => recipientStore.getRecipients)

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: '5%',
  },
]

const onDelete = async (id: string) => {
  const status = await recipientStore.delete(id)

  message.success(status.message)
}
</script>

<template>
  <a-typography-title>Recipients</a-typography-title>

  <a-table
    :dataSource="dataSource"
    :columns="columns"
  >
    <template #title>
      <RecipientForm status="create" />
    </template>

    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'actions'">
        <div class="actions-container">
          <RecipientForm
            :key="record.id"
            :id="record.id"
            :name="record.name"
            status="update"
          />

          <a-popconfirm
            v-if="dataSource.length"
            title="Are you sure to delete ?"
            @confirm="onDelete(record.id)"
          >
            <Button
              :block="true"
              :danger="true"
            >
              Delete
            </Button>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.actions-container {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}
</style>

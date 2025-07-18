<script setup lang="ts">
import { ref, computed } from 'vue'

import { useSavingAccountStore } from '@/stores/saving-account'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import SavingAccountForm from '@/components/molecules/SavingAccount/SavingAccountForm/SavingAccountForm.vue'

const savingAccountStore = useSavingAccountStore()
const dataSource = computed(() => savingAccountStore.getSavingAccounts)

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: '5%',
  },
]

const onDelete = async (id: string) => {
  const status = await savingAccountStore.delete(id)

  message.success(status.message)
}
</script>

<template>
  <a-typography-title>Saving account</a-typography-title>

  <a-table
    :dataSource="dataSource"
    :columns="columns"
  >
    <template #title>
      <SavingAccountForm status="create" />
    </template>

    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'actions'">
        <div class="actions-container">
          <SavingAccountForm
            :key="record.id"
            :id="record.id"
            :name="record.name"
            :type="record.type"
            :balance="record.balance"
            :currency="record.currency"
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

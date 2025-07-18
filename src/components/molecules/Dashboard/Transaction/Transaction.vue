<script setup lang="ts">
import { ref, computed } from 'vue'

import { useSavingAccountStore } from '@/stores/saving-account'
import { useTransactionStore } from '@/stores/transaction'
import { message } from 'ant-design-vue'

import type { TransactionInterface } from '@/stores/transaction.interface'

import Button from '@/components/atoms/Button/Button.vue'
import VerticalTab from '@/components/atoms/VerticalTab/VerticalTab.vue'
import TransactionForm from '../TransactionForm/TransactionForm.vue'

const savingAccountStore = useSavingAccountStore()
const transactionStore = useTransactionStore()

const selectedSavingAccountId = ref<string>('')
const dataSource = computed(() => {
  return selectedSavingAccountId.value
    ? transactionStore.getTransactionBySavingAccount(selectedSavingAccountId.value)
    : transactionStore.getTransactions
})
const savingAccountBalance = computed(() => {
  return selectedSavingAccountId.value
    ? savingAccountStore.getSavingAccountById(selectedSavingAccountId.value)
    : null
})

const columns = [
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    width: '5%',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: '5%',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: '1%',
  },
]

const drawerIsOpen = ref(false)
const drawerData = ref<TransactionInterface>()

const convertDate = (isoDate: string) => {
  const date = new Date(isoDate)

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}`
}
const updateSavingAccountIdTable = (savingAccountId: string) => {
  selectedSavingAccountId.value = savingAccountId
}
const deleteTransaction = async (transactionId: string) => {
  const status = await transactionStore.delete(transactionId)

  drawerIsOpen.value = false
  message.success(status.message)
}
const openDrawer = (transaction: TransactionInterface) => {
  drawerData.value = transaction
  drawerIsOpen.value = true

  console.log(drawerData)
}
</script>

<template>
  <div class="container">
    <VerticalTab :change="updateSavingAccountIdTable" />

    <a-table
      :dataSource="dataSource"
      :columns="columns"
      style="border-radius: 12px; overflow: hidden"
    >
      <template #title>
        <div class="table-header">
          <TransactionForm status="create" />

          <div
            v-if="savingAccountBalance !== null && typeof savingAccountBalance === 'object' && savingAccountBalance !== false"
            class="table-header-balance"
          >
            Total balance
            <span :class="savingAccountBalance.balance < 0 ? 'expense' : 'income'">
              {{ savingAccountBalance.balance }} {{ savingAccountBalance.currency }}
            </span>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'amount'">
          <span :class="record.type === 'expense' ? 'expense' : 'income'">
            {{ text }} {{ record.account.currency }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'category'">
          {{ record.category.name }}
        </template>
        <template v-if="column.dataIndex === 'date'">
          {{ convertDate(text) }}
        </template>
        <template v-if="column.dataIndex === 'actions'">
          <Button
            :key="record.id"
            @click="openDrawer(record)"
          >
            More
          </Button>
        </template>
      </template>
    </a-table>

    <a-drawer
      v-model:open="drawerIsOpen"
      title="Transaction details"
      placement="right"
    >
      <div
        v-if="drawerData"
        class="drawer"
      >
        <div>
          <p v-if="drawerData.account">
            <span :class="drawerData.type === 'expense' ? 'expense' : 'income'">
              {{ drawerData.amount }} {{ drawerData.account.currency }}
            </span>
          </p>
          <p v-if="drawerData.account">
            <span class="underline">Account</span> : <span>{{ drawerData.account.name }}</span>
          </p>
          <p v-if="drawerData.category">
            <span class="underline">Category</span> : <span>{{ drawerData.category.name }}</span>
          </p>
          <p v-if="drawerData.recipient">
            <span class="underline">Recipient</span> : <span>{{ drawerData.recipient.name }}</span>
          </p>
          <p v-if="drawerData.description">
            <span class="underline">Description</span> : <br /><span>{{
              drawerData.description
            }}</span>
          </p>
          <p>
            <span class="underline">Date</span> : <span>{{ convertDate(drawerData.date) }}</span>
          </p>
        </div>
        <div
          v-if="drawerData.account"
          class="drawer-footer"
        >
          <TransactionForm
            :key="drawerData.id"
            :id="drawerData.id"
            :accountId="drawerData.accountId"
            :accountCurrency="drawerData.account.currency"
            :categoryId="drawerData.categoryId"
            :recipientId="drawerData.recipientId"
            :date="drawerData.date"
            :description="drawerData.description"
            :amount="drawerData.amount"
            :type="drawerData.type"
            status="update"
          />

          <a-popconfirm
            v-if="dataSource.length"
            title="Are you sure to delete ?"
            placement="topRight"
            @confirm="deleteTransaction(drawerData.id)"
          >
            <Button
              :block="true"
              :danger="true"
              >Delete</Button
            >
          </a-popconfirm>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/themes/_variables.scss';

.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
}

.table-header {
  display: flex;
  justify-content: space-between;

  &-balance {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .expense {
    &::before {
      content: '';
    }
  }
}

.expense {
  padding: 0.2rem 0.5rem;
  background-color: map-get($colors, errorBg);
  color: map-get($colors, error);
  border: 2px solid map-get($colors, error);
  border-radius: map-get($borderRadius, full);
  text-wrap: nowrap;

  &::before {
    content: '- ';
  }
}

.income {
  padding: 0.2rem 0.5rem;
  background-color: map-get($colors, successBg);
  color: map-get($colors, success);
  border: 2px solid map-get($colors, success);
  border-radius: map-get($borderRadius, full);
  text-wrap: nowrap;

  &::before {
    content: '+ ';
  }
}

.drawer {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  font-size: 1rem;

  .underline {
    text-decoration: underline;
  }

  &-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}

@media (width <= 900px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>

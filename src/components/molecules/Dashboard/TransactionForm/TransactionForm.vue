<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'

import { useCategoryStore } from '@/stores/category'
import { useRecipientStore } from '@/stores/recipient'
import { useSavingAccountStore } from '@/stores/saving-account'
import { useTransactionStore } from '@/stores/transaction'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'

import type { TransactionFormInterface } from '@/stores/transaction.interface'

const props = defineProps<TransactionFormInterface>()

const categoryStore = useCategoryStore()
const recipientStore = useRecipientStore()
const savingAccountStore = useSavingAccountStore()
const transactionStore = useTransactionStore()

const transactionFormRef = ref()
const formState = reactive({
  id: props.id,
  accountId: props.accountId,
  accountCurrency: props.accountCurrency,
  categoryId: props.categoryId,
  recipientId: props.recipientId,
  date: props.date ? dayjs(props.date) : undefined,
  description: props.description,
  amount: props.amount,
  type: props.type,
  status: props.status,
} as any)
const formName =
  formState.status === 'create' ? 'transactionFormCreate' : 'transactionForm' + formState.id
const formLoading = ref<boolean>(false)

const modalOpened = ref<boolean>(false)

// Update currency defined by the saving-account
watch(
  () => formState.accountId,
  (newAccountId) => {
    const selectedAccount = savingAccountStore.getSavingAccountById(newAccountId)
    formState.accountCurrency = (typeof selectedAccount === 'object' && selectedAccount) ? selectedAccount.currency : ''
  },
  { immediate: true },
)

const openModal = () => {
  modalOpened.value = true
}
const modalHandleOk = async () => {
  transactionFormRef.value
    .validate()
    .then(async () => {
      await onFinish()
    })
    .catch((errorInfo: any) => {
      onFinishFailed(errorInfo)
    })
}

const onFinish = async () => {
  formLoading.value = true
  let transactionData
  let status = {
    status: false,
    message: '',
  }

  // If value.id exist, get stored data
  if (formState.id) {
    transactionData = transactionStore.getTransactionById(formState.id)
  }

  if (formState.status === 'update' && transactionData !== undefined && typeof transactionData === 'object' && transactionData !== false) {
    // Update transaction
    if (
      formState.id &&
      formState.accountId &&
      formState.categoryId &&
      formState.date &&
      formState.amount &&
      formState.type
    ) {
      if (
        formState.accountId !== transactionData.accountId ||
        formState.id !== transactionData.id ||
        formState.categoryId !== transactionData.categoryId ||
        formState.recipientId !== transactionData.recipientId ||
        formState.date !== transactionData.date ||
        formState.description !== transactionData.description ||
        formState.amount !== transactionData.amount ||
        formState.type !== transactionData.type
      ) {
        status = await transactionStore.update({
          id: formState.id,
          accountId: formState.accountId,
          categoryId: formState.categoryId,
          recipientId: formState.recipientId ?? '',
          date: formState.date,
          description: formState.description ?? '',
          amount: formState.amount,
          type: formState.type,
        })
      } else {
        status.message = 'No data changed'
      }
    } else {
      status.message = 'Missing data'
    }
  } else {
    // Create transaction
    if (
      formState.accountId &&
      formState.categoryId &&
      formState.date &&
      formState.amount &&
      formState.type
    ) {
      status = await transactionStore.create({
        accountId: formState.accountId,
        categoryId: formState.categoryId,
        recipientId: formState.recipientId ?? '',
        date: formState.date,
        description: formState.description ?? '',
        amount: formState.amount,
        type: formState.type,
      })
    } else {
      status.message = 'Missing data'
    }
  }

  // Check request status
  if (status.status) {
    message.success(status.message)
    modalOpened.value = false

    // Reset form
    formState.id = props.id
    formState.accountId = props.accountId
    formState.categoryId = props.categoryId
    formState.recipientId = props.recipientId
    formState.date = props.date ? dayjs(props.date) : undefined as any
    formState.description = props.description
    formState.amount = props.amount
    formState.type = props.type
    formState.status = props.status
  } else {
    message.error(status.message)
  }

  formLoading.value = false
}
const onFinishFailed = (errorInfo: any) => {
  message.error(errorInfo.errorFields[0].name[0] + ' : ' + errorInfo.errorFields[0].errors[0])
}
</script>

<template>
  <span v-if="props.status === 'update'">
    <Button
      :block="true"
      @click="openModal"
    >
      Edit
    </Button>
  </span>
  <span v-else>
    <Button @click="openModal">Add transaction</Button>
  </span>
  <a-modal
    v-model:open="modalOpened"
    @ok="modalHandleOk"
  >
    <a-typography-title :level="3">
      {{ props.status === 'update' ? 'Update transaction' : 'Create transaction' }}
    </a-typography-title>

    <a-form
      ref="transactionFormRef"
      :model="formState"
      :name="formName"
      autocomplete="off"
      layout="vertical"
    >
      <a-form-item
        label="Account"
        name="accountId"
        :rules="[{ required: true, message: 'Account is required' }]"
      >
        <a-select
          v-model:value="formState.accountId"
          placeholder="Account"
          :options="savingAccountStore.getSavingAccountSelect()"
        />
      </a-form-item>

      <a-form-item
        label="Category"
        name="categoryId"
        :rules="[{ required: true, message: 'Category is required' }]"
      >
        <a-select
          v-model:value="formState.categoryId"
          placeholder="Select a category"
          :options="categoryStore.getCategorySelect()"
        />
      </a-form-item>

      <a-form-item
        label="Recipient"
        name="recipientId"
      >
        <a-select
          v-model:value="formState.recipientId"
          placeholder="Select a recipient"
          :options="recipientStore.getRecipientSelect()"
        />
      </a-form-item>

      <a-form-item
        label="Date"
        name="date"
        :rules="[{ required: true, message: 'Transaction date required' }]"
      >
        <a-date-picker
          v-model:value="formState.date"
          :format="'DD/MM/YYYY'"
        />
      </a-form-item>

      <a-form-item
        label="Amount"
        name="amount"
        :rules="[{ required: true, message: 'Transaction amount required' }]"
      >
        <a-input-number
          v-model:value="formState.amount"
          placeholder="Amount"
          style="width: 50%"
        >
          <template #addonBefore>
            <a-select
              v-model:value="formState.type"
              style="width: 60px"
            >
              <a-select-option value="expense">-</a-select-option>
              <a-select-option value="income">+</a-select-option>
            </a-select>
          </template>

          <template #addonAfter>{{ formState.accountCurrency }}</template>
        </a-input-number>
      </a-form-item>

      <a-form-item
        label="Description"
        name="description"
      >
        <a-textarea
          v-model:value="formState.description"
          placeholder="Description"
          show-count
          :maxlength="100"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>

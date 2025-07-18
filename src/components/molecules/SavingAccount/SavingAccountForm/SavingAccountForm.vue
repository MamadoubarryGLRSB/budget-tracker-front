<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useSavingAccountStore } from '@/stores/saving-account'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import InputText from '@/components/atoms/InputText/InputText.vue'

import type { SavingAccountFormInterface } from '@/stores/saving-account.interface'

const props = defineProps<SavingAccountFormInterface>()

const savingAccountStore = useSavingAccountStore()

const savingAccountFormRef = ref()
const formState = <SavingAccountFormInterface>reactive({
  id: props.id,
  name: props.name,
  type: props.type,
  balance: props.balance,
  currency: props.currency,
  status: props.status,
})
const formName =
  formState.status === 'create' ? 'savingAccountFormCreate' : 'savingAccountForm' + formState.id
const formLoading = ref<boolean>(false)

const modalOpened = ref<boolean>(false)

const openModal = () => {
  modalOpened.value = true
}
const modalHandleOk = async () => {
  savingAccountFormRef.value
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
  let savingAccountData
  let status = {
    status: false,
    message: '',
  }

  // If value.id exist, get stored data
  if (formState.id) {
    savingAccountData = savingAccountStore.getSavingAccountById(formState.id)
  }

  if (formState.status === 'update' && savingAccountData !== undefined) {
    // Update saving account
    if (
      formState.id &&
      formState.name &&
      formState.type &&
      formState.balance &&
      formState.currency
    ) {
      if (
        formState.name !== savingAccountData.name ||
        formState.type !== savingAccountData.type ||
        formState.balance !== savingAccountData.balance ||
        formState.currency !== savingAccountData.currency
      ) {
        status = await savingAccountStore.update({
          id: formState.id,
          name: formState.name,
          type: formState.type,
          balance: formState.balance,
          currency: formState.currency,
        })
      } else {
        status.message = 'No data changed'
      }
    } else {
      status.message = 'Missing data'
    }
  } else {
    // Create saving account
    if ((formState.name, formState.type, formState.balance, formState.currency)) {
      status = await savingAccountStore.create({
        name: formState.name,
        type: formState.type,
        balance: formState.balance,
        currency: formState.currency,
      })
    } else {
      status.message = 'Missing data'
    }
  }

  // Check request status
  if (status.status) {
    message.success(status.message)
    modalOpened.value = false
  } else {
    message.error(status.message)
  }

  // Reset form
  formState.id = props.id
  formState.name = props.name
  formState.type = props.type
  formState.balance = props.balance
  formState.currency = props.currency
  formState.status = props.status

  formLoading.value = false
}
const onFinishFailed = (errorInfo: any) => {
  message.error(errorInfo.errorFields[0].name[0] + ' : ' + errorInfo.errorFields[0].errors[0])
}
</script>

<template>
  <span v-if="props.status === 'update'">
    <Button @click="openModal">Edit</Button>
  </span>
  <span v-else>
    <Button @click="openModal">Add saving account</Button>
  </span>
  <a-modal
    v-model:open="modalOpened"
    @ok="modalHandleOk"
  >
    <a-typography-title :level="3">
      {{ props.status === 'update' ? 'Update saving account' : 'Create saving account' }}
    </a-typography-title>

    <a-form
      ref="savingAccountFormRef"
      :model="formState"
      :name="formName"
      autocomplete="off"
      layout="vertical"
    >
      <a-form-item
        label="Name"
        name="name"
        :rules="[{ required: true, message: 'Saving account name required' }]"
      >
        <InputText
          placeholder="Name"
          v-model:value="formState.name"
        />
      </a-form-item>

      <a-form-item
        label="Type"
        name="type"
        :rules="[{ required: true, message: 'Type name required' }]"
      >
        <InputText
          placeholder="Type"
          v-model:value="formState.type"
        />
      </a-form-item>

      <a-form-item
        label="Balance"
        name="balance"
        :rules="[{ required: true, message: 'Saving account balance required' }]"
      >
        <a-input-number v-model:value="formState.balance">
          <template #addonAfter>
            <a-select
              v-model:value="formState.currency"
              style="width: 50px"
            >
              <a-select-option value="USD">$</a-select-option>
              <a-select-option value="EUR">€</a-select-option>
              <a-select-option value="GBP">£</a-select-option>
              <a-select-option value="CNY">¥</a-select-option>
            </a-select>
          </template>
        </a-input-number>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>

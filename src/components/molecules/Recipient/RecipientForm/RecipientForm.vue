<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useRecipientStore } from '@/stores/recipient'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import InputText from '@/components/atoms/InputText/InputText.vue'

import type { RecipientFormInterface } from '@/stores/recipient.interface'

const props = defineProps<RecipientFormInterface>()

const recipientStore = useRecipientStore()

const recipientFormRef = ref()
const formState = <RecipientFormInterface>reactive({
  id: props.id,
  name: props.name,
  status: props.status,
})
const formName =
  formState.status === 'create' ? 'recipientFormCreate' : 'recipientForm' + formState.id
const formLoading = ref<boolean>(false)

const modalOpened = ref<boolean>(false)

const openModal = () => {
  modalOpened.value = true
}
const modalHandleOk = async () => {
  recipientFormRef.value
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
  let recipientData
  let status = {
    status: false,
    message: '',
  }

  // If value.id exist, get stored data
  if (formState.id) {
    recipientData = recipientStore.getRecipientById(formState.id)
  }

  if (formState.status === 'update' && recipientData !== undefined) {
    // Update recipient
    if (formState.id && formState.name) {
      if (formState.name !== recipientData.name) {
        status = await recipientStore.update({
          id: formState.id,
          name: formState.name,
        })
      } else {
        status.message = 'No data changed'
      }
    } else {
      status.message = 'Missing data'
    }
  } else {
    // Create recipient
    if (formState.name) {
      status = await recipientStore.create({
        name: formState.name,
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
    formState.name = props.name
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
    <Button @click="openModal">Edit</Button>
  </span>
  <span v-else>
    <Button @click="openModal">Add recipient</Button>
  </span>
  <a-modal
    v-model:open="modalOpened"
    @ok="modalHandleOk"
  >
    <a-typography-title :level="3">
      {{ props.status === 'update' ? 'Update recipient' : 'Create recipient' }}
    </a-typography-title>

    <a-form
      ref="recipientFormRef"
      :model="formState"
      :name="formName"
      autocomplete="off"
      layout="vertical"
    >
      <a-form-item
        label="Name"
        name="name"
        :rules="[{ required: true, message: 'Recipient name required' }]"
      >
        <InputText
          placeholder="Name"
          v-model:value="formState.name"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped></style>

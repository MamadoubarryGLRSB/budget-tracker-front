<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import InputEmail from '@/components/atoms/InputEmail/InputEmail.vue'
import InputText from '@/components/atoms/InputText/InputText.vue'

import type { UpdateUserInterface } from '@/stores/user.interface'

const userStore = useUserStore()
let userData = userStore.getUser

const formState = <UpdateUserInterface>reactive({
  email: userData.email,
  firstName: userData.firstName,
  lastName: userData.lastName,
})
const formLoading = ref<boolean>(false)

const onFinish = async (values: UpdateUserInterface) => {
  formLoading.value = true
  let status = {
    status: false,
    message: '',
  }

  if (formState.email && formState.firstName && formState.lastName) {
    if (
      formState.email !== userData.email ||
      formState.firstName !== userData.firstName ||
      formState.lastName !== userData.lastName
    ) {
      status = await userStore.updateUser(values)
    } else {
      status.message = 'No data changed'
    }
  } else {
    status.message = 'Missing data'
  }

  if (status.status) {
    message.success('Personal information : ' + status.message)
    userData = userStore.getUser
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
  <a-form
    :model="formState"
    name="accountPersonalForm"
    autocomplete="off"
    layout="vertical"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Email"
      name="email"
      :rules="[{ required: true, message: 'Email is required' }]"
    >
      <InputEmail
        placeholder="Email"
        v-model:value="formState.email"
      />
    </a-form-item>

    <a-form-item
      label="First name"
      name="firstName"
      :rules="[{ required: true, message: 'First name is required' }]"
    >
      <InputText
        placeholder="First name"
        v-model:value="formState.firstName"
      />
    </a-form-item>

    <a-form-item
      label="Last name"
      name="lastName"
      :rules="[{ required: true, message: 'Last name is required' }]"
    >
      <InputText
        placeholder="Last name"
        v-model:value="formState.lastName"
      />
    </a-form-item>

    <a-form-item>
      <Button
        :loading="formLoading"
        htmlType="submit"
      >
        Update
      </Button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>

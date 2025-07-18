<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import InputPassword from '@/components/atoms/InputPassword/InputPassword.vue'

import type { UpdateUserInterface } from '@/stores/user.interface'
import type { RuleObject } from 'ant-design-vue/es/form'

const userStore = useUserStore()

const formState = <UpdateUserInterface>reactive({
  password: '',
  confirmPassword: '',
})
const formLoading = ref<boolean>(false)

const onFinish = async (values: UpdateUserInterface) => {
  formLoading.value = true
  let status = {
    status: false,
    message: '',
  }

  if (formState.password && formState.confirmPassword) {
    status = await userStore.updateUser(values)
  } else {
    status.message = 'Missing data'
  }

  if (status.status) {
    message.success(status.message)
  } else {
    message.error(status.message)
  }

  formLoading.value = false
}

const checkPasswordRequirementRule = (_rule: RuleObject, value: string): Promise<void> => {
  const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$')

  if (regex.test(value)) {
    return Promise.resolve()
  }
  return Promise.reject(
    new Error('Passwords must contain : 1 minuscule, 1 majuscule, 1 number, 1 special character'),
  )
}

const confirmPasswordMatchRule = (_rule: RuleObject, value: string): Promise<void> => {
  if (!value || value === formState.password) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('Passwords do not match'))
}

const onFinishFailed = (errorInfo: any) => {
  message.error(errorInfo.errorFields[0].name[0] + ' : ' + errorInfo.errorFields[0].errors[0])
}
</script>

<template>
  <a-form
    :model="formState"
    name="accountPasswordForm"
    autocomplete="off"
    layout="vertical"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Password"
      name="password"
      :rules="[
        { required: true, message: 'Password is required' },
        { min: 8, message: '8 characters minimum' },
        { validator: checkPasswordRequirementRule },
      ]"
    >
      <InputPassword
        placeholder="Password"
        v-model:value="formState.password"
      />
    </a-form-item>

    <a-form-item
      label="Confirm password"
      name="confirmPassword"
      :rules="[
        { required: true, message: 'Confirm password is required' },
        { validator: confirmPasswordMatchRule },
      ]"
    >
      <InputPassword
        placeholder="Password"
        v-model:value="formState.confirmPassword"
      />
    </a-form-item>

    <a-form-item>
      <Button
        :loading="formLoading"
        htmlType="submit"
      >
        Update password
      </Button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>

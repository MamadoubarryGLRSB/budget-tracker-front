<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import Checkbox from '@/components/atoms/Checkbox/Checkbox.vue'
import InputEmail from '@/components/atoms/InputEmail/InputEmail.vue'
import InputPassword from '@/components/atoms/InputPassword/InputPassword.vue'

import type { LoginUserInterface } from '@/stores/user.interface'

const router = useRouter()
const userStore = useUserStore()
const formState = <LoginUserInterface>reactive({
  email: '',
  password: '',
  remember: false,
})
const formLoading = ref<boolean>(false)

const onFinish = async (values: LoginUserInterface) => {
  formLoading.value = true
  const status = await userStore.loginUser(values)

  if (status.status) {
    await router.push({ name: 'dashboard' })
  } else {
    message.error(status.message)
  }

  formLoading.value = false
}

const onFinishFailed = (errorInfo: any) => {
  message.error(errorInfo.errorFields[0].name[0] + ' : ' + errorInfo.errorFields[0].errors[0])
}

const rememberUserState = (value: boolean) => {
  formState.remember = value
}
</script>

<template>
  <a-form
    :model="formState"
    name="loginForm"
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
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Password is required' }]"
    >
      <InputPassword
        placeholder="Password"
        v-model:value="formState.password"
      />
    </a-form-item>

    <a-form-item name="remember">
      <Checkbox
        placeholder="Remember me"
        v-model:checked="formState.remember"
        :onChange="rememberUserState"
      />
    </a-form-item>

    <a-form-item>
      <Button
        :loading="formLoading"
        htmlType="submit"
      >
        Login
      </Button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>

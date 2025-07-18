<script setup lang="ts">
import { ref } from 'vue'

import LoginForm from '@/components/molecules/Account/LoginForm/LoginForm.vue'
import Segmented from '@/components/atoms/Segmented/Segmented.vue'
import SignInForm from '@/components/molecules/Account/SignInForm/SignInForm.vue'

const segmentedOptions: string[] = ['Login', 'Sign-in']
const formClass = ref<string>('auth-form-left')

const segmentedChange = (value: string | number) => {
  switch (value) {
    case 'Login':
      formClass.value = 'auth-form-left'
      break

    case 'Sign-in':
      formClass.value = 'auth-form-right'
      break

    default:
      formClass.value = 'auth-form-left'
      break
  }
}
</script>

<template>
  <div :class="['auth-form', formClass]">
    <Segmented
      :block="true"
      :options="segmentedOptions"
      value="Login"
      :onChange="segmentedChange"
    />
    <div class="auth-form-group">
      <div class="auth-form-group-item">
        <LoginForm />
      </div>
      <div class="auth-form-group-item">
        <SignInForm />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.auth-form {
  margin: auto;
  padding: 2rem;
  padding-bottom: 0.5rem;
  width: 40%;
  background-color: map-get($colors, primaryLight);
  border-radius: map-get($borderRadius, m);
  overflow: hidden;

  &-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    position: relative;
    margin-top: 2rem;
    width: calc(200% + 50px);
    transition: 0.2s;

    &-item {
      align-content: center;
      width: 100%;
    }
  }

  &-left .auth-form-group {
    left: 0;
  }

  &-right .auth-form-group {
    left: calc(-100% - 50px);
  }
}

@media (width <= 1300px) {
  .auth-form {
    width: 55%;
  }
}

@media (width <= 900px) {
  .auth-form {
    width: 65%;
  }
}

@media (width <= 650px) {
  .auth-form {
    width: 85%;
  }
}
</style>

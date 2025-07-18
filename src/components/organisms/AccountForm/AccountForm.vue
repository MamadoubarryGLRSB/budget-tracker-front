<script setup lang="ts">
import UpdatePersonalForm from '@/components/molecules/Account/UpdatePersonalForm/UpdatePersonalForm.vue'
import UpdatePasswordForm from '@/components/molecules/Account/UpdatePasswordForm/UpdatePasswordForm.vue'
import DeleteAccountForm from '@/components/molecules/Account/DeleteAccountForm/DeleteAccountForm.vue'
</script>

<template>
  <div class="container">
    <div class="item">
      <a-typography-title :level="2">Personal information</a-typography-title>
      <UpdatePersonalForm />
    </div>

    <div class="item">
      <a-typography-title :level="2">Password</a-typography-title>
      <UpdatePasswordForm />
    </div>
  </div>

  <a-divider />

  <a-typography-title :level="2">Delete account</a-typography-title>
  <DeleteAccountForm />
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.item {
  width: 100%;
}

@media (width <= 650px) {
  .container {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>

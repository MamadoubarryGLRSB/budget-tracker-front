<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useCategoryStore } from '@/stores/category'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import InputText from '@/components/atoms/InputText/InputText.vue'

import type { CategoryFormInterface } from '@/stores/category.interface'

const props = defineProps<CategoryFormInterface>()

const categoryStore = useCategoryStore()

const categoryFormRef = ref()
const formState = <CategoryFormInterface>reactive({
  id: props.id,
  name: props.name,
  status: props.status,
})
const formName =
  formState.status === 'create' ? 'categoryFormCreate' : 'categoryForm' + formState.id
const formLoading = ref<boolean>(false)

const modalOpened = ref<boolean>(false)

const openModal = () => {
  modalOpened.value = true
}
const modalHandleOk = async () => {
  categoryFormRef.value
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
  let categoryData
  let status = {
    status: false,
    message: '',
  }

  // If value.id exist, get stored data
  if (formState.id) {
    categoryData = categoryStore.getCategoryById(formState.id)
  }

  if (formState.status === 'update' && categoryData !== undefined) {
    // Update category
    if (formState.id && formState.name) {
      if (formState.name !== categoryData.name) {
        status = await categoryStore.update({
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
    // Create category
    if (formState.name) {
      status = await categoryStore.create({
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
  } else {
    message.error(status.message)
  }

  // Reset form
  formState.id = props.id
  formState.name = props.name
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
    <Button @click="openModal">Add category</Button>
  </span>
  <a-modal
    v-model:open="modalOpened"
    @ok="modalHandleOk"
  >
    <a-typography-title :level="3">
      {{ props.status === 'update' ? 'Update category' : 'Create category' }}
    </a-typography-title>

    <a-form
      ref="categoryFormRef"
      :model="formState"
      :name="formName"
      autocomplete="off"
      layout="vertical"
    >
      <a-form-item
        label="Name"
        name="name"
        :rules="[{ required: true, message: 'Category name required' }]"
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

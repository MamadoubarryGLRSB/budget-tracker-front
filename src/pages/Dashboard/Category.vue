<script setup lang="ts">
import { ref, computed } from 'vue'

import { useCategoryStore } from '@/stores/category'
import { message } from 'ant-design-vue'

import Button from '@/components/atoms/Button/Button.vue'
import CategoryForm from '@/components/molecules/Category/CategoryForm/CategoryForm.vue'

const categoryStore = useCategoryStore()
const dataSource = computed(() => categoryStore.getCategories)

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: '5%',
  },
]

const onDelete = async (id: string) => {
  const status = await categoryStore.delete(id)

  message.success(status.message)
}
</script>

<template>
  <a-typography-title>Categories</a-typography-title>

  <a-table
    :dataSource="dataSource"
    :columns="columns"
  >
    <template #title>
      <CategoryForm status="create" />
    </template>

    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'actions'">
        <div class="actions-container">
          <CategoryForm
            :key="record.id"
            :id="record.id"
            :name="record.name"
            status="update"
          />

          <a-popconfirm
            v-if="dataSource.length"
            title="Are you sure to delete ?"
            @confirm="onDelete(record.id)"
          >
            <Button
              :block="true"
              :danger="true"
            >
              Delete
            </Button>
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
@import '@/assets/themes/_variables.scss';

.actions-container {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}
</style>

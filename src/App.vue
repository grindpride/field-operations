<template lang="pug">
header.header
section.page__wrapper
  .page
    h1.page__title {{$t('page.title', {field: 112})}}
    OperationTable.operarions-table(
      v-if="tableData.length"
      :data='tableData'
      @open="openModal"
      )
OperationSidebar(
  v-if="isModalOpen"
  :operation="activeOperation"
  @close="closeModal"
  @add="addOperation"
)

</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import OperationTable from '@/components/OperationTable.vue';
import OperationSidebar from '@/components/OperationSidebar.vue';
import FieldService from '@/FieldService';
import Operation from '@/models/Operation';
import Button from '@/components/atoms/Button.vue';

const fieldService = new FieldService();

export default defineComponent({
  components: { OperationTable, OperationSidebar, Button },
  setup() {
    const tableData = ref<Operation[]>([]);
    const isModalOpen = ref(false);
    const activeOperation = ref<null | Operation >(null);

    const addOperation = async (data:Operation) => {
      isModalOpen.value = false;
      await fieldService.saveOperation(data);
      tableData.value = await fieldService.getOperations();
    };

    const closeModal = () => {
      activeOperation.value = null;
      isModalOpen.value = false;
    };
    const openModal = (operation: Operation | null) => {
      activeOperation.value = operation;
      isModalOpen.value = true;
    };

    onMounted(async () => {
      tableData.value = await fieldService.getOperations();
    });

    return {
      openModal,
      closeModal,
      activeOperation,
      isModalOpen,
      tableData,
      addOperation,
    };
  },
});

</script>

<style>
@import 'css/common.pcss';

.header{
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background-color: var(--dark);
  z-index: 1;
}

.page{
  margin: 0 auto;
  max-width: 870px;
  background-color: var(--white);
  padding: 30px;
  box-shadow: var(--shadow);

  &__wrapper{
    min-height: calc(100vh - 80px);
    display: flex;
    align-items: stretch;
  }

  &__title{
    font-weight: 500;
    font-size: 25px;
    line-height: 31px;
    letter-spacing: -0.8px;
    margin-bottom: 25px;
  }
}

</style>

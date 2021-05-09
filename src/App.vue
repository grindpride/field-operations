<template lang="pug">
header.header
section.page__wrapper
  .page
    h1.page__title Операции на поле 112
    .page__control
      .tabs
        button.tabs__item Запланированные операции
        button.tabs__item.active Выполненные операции
      .flexspace
      button.icon-btn(@click="isModalOpen = true")
        include ../src/assets/plus.svg
        | Добавить операцию
    OperationTable.operarions-table(
      v-if="tableData.length"
      :data='tableData'
      @sort="sortTable"
      )
Sidebar(:isOpen="isModalOpen" @close="isModalOpen = false" @add="addOperation")

</template>

<script lang="ts">
import {
  computed, defineComponent, ref, onMounted,
} from 'vue';
import OperationTable, { getJsDate } from '@/components/table/OperationTable.vue';
import Sidebar from '@/components/sidebar/Sidebar.vue';
import FieldService from '@/FieldService';
import Operation from '@/models/Operation';
import TDate from '@/models/TDate';

const fieldService = new FieldService();

export default defineComponent({
  components: { OperationTable, Sidebar },
  setup() {
    const tableData = ref<Operation[]>([]);
    const isModalOpen = ref(false);

    onMounted(async () => {
      tableData.value = await fieldService.getOperations();
    });

    const sortTable = (field: keyof Operation, direction:boolean) => {
      tableData
        .value
        .sort((one, two) => {
          const value1 = one[field] ?? -1;
          const value2 = two[field] ?? -1;
          const sortDirection = direction ? 1 : -1;

          if (field === 'date') {
            return (getJsDate(value1 as TDate) > getJsDate(value2 as TDate)
              ? -1
              : 1) * sortDirection;
          }
          return (value1 > value2 ? -1 : 1) * sortDirection;
        });
    };

    const addOperation = async (data:Operation) => {
      isModalOpen.value = false;
      await fieldService.saveOperation(data);
      tableData.value = await fieldService.getOperations();
    };

    return {
      sortTable,
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

  &__control{
    display: flex;
    margin-bottom: 16px;
  }
}

.tabs{
  &__item{
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    text-transform: uppercase;

    &:not(:last-of-type){
      margin-right: 18px;
    }

    &.active{
      color: var(--blue);
    }
  }
}

.icon-btn{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 15px;
  border-radius: 20px;
  transition: all 0.2s ease;

  svg{
    margin-right: 7px;
  }

  &:hover{
    background-color: var(--light-gray);
  }
}
</style>

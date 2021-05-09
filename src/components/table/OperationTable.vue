<template lang="pug">
table.table
  thead.table-head
    tr.table-row
      th.table-cell.table-header(
        v-for='column of columns'
        :class="{active: column === lastSortField, desc: column === lastSortField && isDescSort}"
        :key='column'
        @click="sortTable(column)"
      ) {{ $t(`titles.${column}`) }}

  tbody.table-body
    tr.table-row(v-for='row in data' :key='data.id')
      td.table-cell(
        v-for='column of columns'
        :key='`${column}_${data.id}`'
      )
        AssessmentBadge(
          v-if="column === 'assessment'"
          :level="row[column]"
        )
        .table-content(
          v-else-if="column === 'date'"
          :class="column"
        ) {{getPrettyDateString(row[column])}}
        .table-content(
          v-else-if="column === 'type'"
          :class="column"
        ) {{$t(`types.${getOperationType(row[column])}`)}}
        .table-content(
          v-else
          :class="column"
        ) {{ row[column] }}
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import Operation, { OperationType } from '@/models/Operation';
import TDate from '@/models/TDate';
import AssessmentBadge from '@/components/AssessmentBadge.vue';

const COLUMNS = ['date', 'type', 'area', 'assessment'] as (keyof Operation)[];
type ColumnFieldTitle = typeof COLUMNS[number];

export const getJsDate = ({
  year,
  month,
  day,
}:TDate):Date => new Date(year, month, day);

export default defineComponent({
  name: 'OperationTable',
  emits: ['sort'],
  props: {
    data: {
      type: Array as PropType<Operation[]>,
      default: () => [],
    },
  },
  components: { AssessmentBadge },
  setup(props, { emit }) {
    const columns = COLUMNS;
    const isDescSort = ref(true);
    const lastSortField = ref<null | ColumnFieldTitle>(null);

    const getPrettyDateString = (date: TDate) => {
      const jsDate = getJsDate(date);
      const month = jsDate
        .toLocaleString('ru', { month: 'short' })
        .split('.')[0]
        .toUpperCase();
      const day = jsDate.getDay();
      const year = jsDate.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const getOperationType = (field: OperationType): string => OperationType[field];

    const sortTable = (field: ColumnFieldTitle) => {
      if (lastSortField.value !== field) {
        isDescSort.value = true;
      }
      emit('sort', field, isDescSort.value);
      isDescSort.value = !isDescSort.value;
      lastSortField.value = field;
    };

    return {
      isDescSort,
      lastSortField,
      columns,
      sortTable,
      getPrettyDateString,
      getOperationType,
    };
  },
});

</script>

<style scoped>
.table {
  border: none;
  border-collapse: collapse;
  border-color: var(--gray);
  table-layout: fixed;
  width: 100%;
  color: var(--black);
}

.table-head {
  .table-row {
    height: 40px;
  }
}

.table-body {
  .table-row {
    height: 50px;
  }

  border-bottom: 1px solid var(--gray);
}

.table-cell {
  border-color: inherit;
  border-style: solid;
  border-width: 1px 0 0 0;
  text-align: left;
  vertical-align: middle;
  padding: 14px 16px;
}

.table-header {
  border: none;
  position: relative;
  color: var(--black);
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  background-color: var(--gray);
  cursor: pointer;
  padding: 14px 16px;

  &::after {
    content: '';
    display: inline-block;
    margin-left: 5px;
    position: absolute;
    bottom: 12px;
    border: 6px solid transparent;
    border-top: 6px solid var(--dark-gray);
    transform-origin: 6px 3px;
    transition: all 0.1s ease;
  }

  &.active::after {
    border-top: 6px solid var(--blue);
  }

  &.desc::after {
    transform: rotate(180deg);
  }
}

.table-content {
  color: var(--black);

  &.date {
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    opacity: 0.8;
  }

  &.type {
    font-weight: 500;
    font-size: 13px;
    line-height: 13px;
    letter-spacing: -0.47px;
  }
}

.table-body .table-row {
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--light-gray);
  }
}
</style>

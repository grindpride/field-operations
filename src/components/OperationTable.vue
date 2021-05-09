<template lang="pug">
.table-control
  Tabs(:items="tabs" v-model:value="isPlannedVisible")
  .flexspace
  Button.icon-btn(@click="open(null)")
    include ../../src/assets/plus.svg
    | {{$t('page.addOperation')}}
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
    tr.table-row(v-for='row in preparedData' :key='preparedData.id' @click="open(row)")
      td.table-cell(
        v-for='column of columns'
        :key='`${column}_${preparedData.id}`'
      )
        StatusBadge(
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
import {
  computed, defineComponent, PropType, ref,
} from 'vue';
import Operation, { OperationType } from '@/models/Operation';
import StatusBadge from '@/components/atoms/StatusBadge.vue';
import { getJsDate, getPrettyDateString } from '@/utils/dates.js';
import { useI18n } from 'vue-i18n';
import TDate from '@/models/TDate';
import Tabs from '@/components/atoms/Tabs.vue';
import Button from '@/components/atoms/Button.vue';

const COLUMNS = ['date', 'type', 'area', 'assessment'] as (keyof Operation)[];
type ColumnFieldTitle = typeof COLUMNS[number];

export default defineComponent({
  name: 'OperationTable',
  emits: ['open', 'edit'],
  props: {
    data: {
      type: Array as PropType<Operation[]>,
      default: () => [],
    },
  },
  components: {
    Tabs,
    Button,
    StatusBadge,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const columns = COLUMNS;
    const getOperationType = (field: OperationType): string => OperationType[field];

    const isDescSort = ref(true);
    const isPlannedVisible = ref(true);
    const lastSortField = ref<null | ColumnFieldTitle>(null);

    const preparedData = computed(() => {
      const sortedData = props
        .data;
      if (lastSortField.value) {
        sortedData.sort((one, two) => {
          const value1 = one[lastSortField.value as keyof Operation] ?? -1;
          const value2 = two[lastSortField.value as keyof Operation] ?? -1;
          const sortDirection = isDescSort.value ? -1 : 1;

          if (lastSortField.value === 'date') {
            return (getJsDate(value1 as TDate) > getJsDate(value2 as TDate)
              ? -1
              : 1) * sortDirection;
          }
          return (value1 > value2 ? -1 : 1) * sortDirection;
        });
      }

      return sortedData
        .filter(({ date }) => {
          const bool = getJsDate(date) > new Date();
          return isPlannedVisible.value ? bool : !bool;
        });
    });
    const tabs = computed(() => ([
      {
        label: t('tabs.planned'),
        value: true,
      },
      {
        label: t('tabs.completed'),
        value: false,
      },
    ]));

    const sortTable = (field: ColumnFieldTitle) => {
      if (lastSortField.value !== field) {
        isDescSort.value = false;
      } else {
        isDescSort.value = !isDescSort.value;
      }
      lastSortField.value = field;
    };

    const open = (operation: Operation | null) => {
      emit('open', operation);
    };

    return {
      getPrettyDateString,
      isPlannedVisible,
      tabs,
      isDescSort,
      lastSortField,
      columns,
      sortTable,
      preparedData,
      getOperationType,
      open,
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
    cursor: pointer;
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

.table-control {
  display: flex;
  margin-bottom: 16px;
}
</style>

<template lang="pug">
.button-group
  button.button-group__item(
    v-for='(item, i) of items'
    @click='onItemClick(item)'
    :class="{[item.activeColor]:true, active: item.value === activeItem}"
    :key='item.label'
  ) {{ item.label }}
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface GroupItem<T> {
  label: string;
  activeColor: 'green' | 'yellow' | 'red',
  value: T
}

export default defineComponent({
  name: 'ButtonGroup',
  emits: ['update:activeItem'],
  props: {
    activeItem: {
      default: null,
    },
    items: {
      type: Array as PropType<GroupItem<unknown>[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const onItemClick = (item: GroupItem<unknown>) => {
      emit('update:activeItem', props.activeItem === item.value ? null : item.value);
    };

    return {
      onItemClick,
    };
  },
});
</script>

<style scoped>
.button-group {
  overflow: hidden;
  border-radius: 20px;
  display: inline-flex;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &__item {
    height: 40px;
    width: 94px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--light-gray);
    transition: all 0.1s ease;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;

    &:not(:last-of-type){
      border-right: 1px solid var(--gray);
    }
    &:hover {
      background-color: var(--gray);
    }

    &:active, &.active {
      color: var(--white);

      &.green {
        background-color: var(--green);
      }

      &.yellow {
        background-color: var(--yellow);
      }

      &.red {
        background-color: var(--red);
      }
    }
  }
}

</style>

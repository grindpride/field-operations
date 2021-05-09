<template lang="pug">
.button-group
  Button.button-group__item(
    v-for='(item, i) of items'
    @click='handleClick(item)'
    :activeColor="item.activeColor"
    :active="item.value === activeItem"
    :key='item.label'
  ) {{ item.label }}
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Button from '@/components/atoms/Button.vue';

export interface GroupItem<T> {
  label: string;
  activeColor: 'green' | 'yellow' | 'red',
  value: T
}

export default defineComponent({
  name: 'ButtonGroup',
  components: { Button },
  emits: ['update:activeItem'],
  props: {
    activeItem: {
      type: Number,
      default: null,
    },
    items: {
      type: Array as PropType<GroupItem<unknown>[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const handleClick = (item: GroupItem<unknown>) => {
      emit('update:activeItem', props.activeItem === item.value ? null : item.value);
    };

    return {
      handleClick,
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

  &__item{
    min-width: 93px;
    box-shadow: none;
    border-radius: 0;
  }
}

</style>

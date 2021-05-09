<template lang="pug">
.tabs
  button.tabs__item(
    v-for="item in items"
    :class="{active: item.value === value}"
    @click="handleClick(item)"
    ) {{item.label}}
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Button from '@/components/atoms/Button.vue';

export interface TabItem<T> {
  label: string;
  value: T
}

export default defineComponent({
  name: 'Tabs',
  components: { Button },
  emits: ['update:value'],
  props: {
    value: {
      type: Number,
      default: null,
    },
    items: {
      type: Array as PropType<TabItem<unknown>[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const handleClick = (item: TabItem<unknown>) => {
      emit('update:value', item.value);
    };

    return {
      handleClick,
    };
  },
});
</script>

<style scoped>
.tabs {
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
</style>

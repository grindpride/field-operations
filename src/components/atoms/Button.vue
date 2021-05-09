<template lang="pug">
button.button(
  @click="emit('click')"
  :class="{[activeColor]: true, active}"
)
  slot
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export enum ButtonActiveColor {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green'
}

export default defineComponent({
  name: 'Button',
  emits: ['click'],
  props: {
    activeColor: {
      type: String as PropType<ButtonActiveColor>,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    return {
      emit,
    };
  },
});
</script>

<style scoped>
.button{
    height: 40px;
    display: inline-grid;
    grid-auto-flow: column;
    grid-gap: 7px;
    align-items: center;
    justify-content: center;
    background-color: var(--light-gray);
    transition: all 0.1s ease;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 0 15px;
    border-radius: 20px;

  svg {
    margin-right: 7px;
  }

  &:hover{
    background-color: var(--light-gray);
  }
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

</style>

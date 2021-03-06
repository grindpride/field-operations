<template lang="pug">
.select(:class='{opened}')
  .select__head(
    @keyup.tab='openDropdown'
    @keypress.enter.space='toggleDropdown'
    @click='toggleDropdown'
    :tabindex='0'
  )
    .select__label {{label}}
    .select__value(:class="{placeholder: !activeItem}") {{activeItem?.label || placeholder}}
    .select__shevrone(:class='{opened}')
      include ../../assets/shevrone.svg
  .select__body(
    v-show='opened'
  )
    .select__option(
      v-for='option of options'
      @click='handleChange(option.value)'
      :key='option.value'
    ) {{option.label}}
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUnmount, onMounted, PropType, ref, computed,
} from 'vue';

export interface SelectOption<T = unknown> {
  label: string;
  value: T;
}

export default defineComponent({
  name: 'Select',
  emits: ['update:value'],
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const opened = ref(false);
    const select = ref<HTMLDivElement | null>(null);

    const activeItem = computed(() => props
      .options
      .find((item) => item.value === props.value));

    const handleChange = (value: unknown) => {
      opened.value = false;
      emit('update:value', value);
    };

    const openDropdown = () => {
      if (!opened.value) opened.value = true;
    };

    const toggleDropdown = () => {
      opened.value = !opened.value;
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        select.value
        && opened.value
        && e.target instanceof Node
        && e.target !== select.value
        && !select.value.contains(e.target)
      ) {
        opened.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside, { capture: true });
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      opened,
      select,
      activeItem,
      openDropdown,
      toggleDropdown,
      handleChange,
    };
  },
});
</script>

<style scoped>
.select {
  display: inline-block;
  position: relative;
  width: 100%;
  text-align: left;

  &.s {
    min-height: 32px;
  }
}

.select__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid var(--gray);
  border-radius: 4px;
  padding: 5px 11px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.select__label {
  font-weight: 500;
  font-size: 8px;
  line-height: 11px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.select__value {
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;

  &.placeholder {
    opacity: 0.7;
  }
}

.select__shevrone {
  position: absolute;
  right: 20px;
  top: 12px;
  transform-origin: 6px 10px;

  &.opened {
    transform: rotate(180deg);
  }
}

.select__body {
  display: grid;
  grid-template-columns: 1fr;
  padding: 8px 0;
  list-style: none;
  position: absolute;
  width: 100%;
  border-radius: 4px;
  margin-top: 4px;
  margin-bottom: 0;
  box-shadow: var(--shadow);
  background-color: white;
  overflow: auto;
  max-height: 400px;
  z-index: 1;

}

.select__option {
  padding: 5px 11px;
  height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--light-gray);
  }
}

</style>

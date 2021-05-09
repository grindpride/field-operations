<template lang="pug">
.badge(:class="status") {{$t(`assessment.${status}`)}}
</template>

<script>
import { defineComponent, computed } from 'vue';
import { Assessment } from '@/models/Operation';

export default defineComponent({
  name: 'StatusBadge',
  props: {
    level: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const status = computed(() => Assessment[props.level] || 'NO_DATA');

    return {
      status,
    };
  },
});
</script>

<style scoped>
.badge{
  font-weight: normal;
  font-size: 11px;
  line-height: 19px;
  letter-spacing: -0.293333px;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--black);
    margin-right: 10px;
  }

  &.NO_DATA{
    opacity: 0.3;
  }

  &.EXCELLENT::before {
    background-color: var(--green);
  }

  &.SATISFACTORILY::before {
    background-color: var(--yellow);
  }

  &.BADLY::before {
    background-color: var(--red);
  }
}
</style>

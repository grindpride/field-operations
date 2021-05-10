<template lang="pug">
aside.sidebar
  button.sidebar__close(@click="close")
    include ../assets/close.svg
  .sidebar__body
    h2.sidebar__title {{operation ? $t('sidebar.editTitle') : $t('sidebar.addTitle')}}
    .field-info
      .field-info__data
        .field-info__square
          include ../assets/field.svg
        .field-info__title {{$t('sidebar.field')}}
        .field-info__number 112
      .field-info__culture
        .field-info__culture-type Озимая пшеница
        .field-info__culture-name ПОБЕДА 50
        .field-info__culture-icon
          include ../assets/wheat.svg
    .field-control
      .field-control__operation
        Select(
          :options="operations"
          v-model:value='type'
          :label="$t('sidebar.operations')"
        )
      .field-control__date
        .field-control__date-label {{$t('sidebar.date')}}
        .field-control__date-picker
          Datepicker(v-model="date")
        .field-control__date-icon
          include ../assets/calendar.svg
      .field-control__area
        .field-control__area-label {{$t('sidebar.area')}}
        input.field-control__area-input(
          type="number"
          :placeholder="$t('sidebar.areaPlaceholder')"
          v-model="area"
        )
    .field-comment
      textarea(
        :placeholder="$t('sidebar.commentPlaceholder')"
        v-model="comment"
        )
    .field-assessment
      .field-assessment__label {{$t('sidebar.assessment')}}
      ButtonGroup(:items="assesmentBtns" v-model:activeItem='assessment')
    .flexspace
    button.apply-btn(@click="add") {{operation ? $t('sidebar.edit') : $t('sidebar.apply')}}
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType, ref, onMounted,
} from 'vue';
import ButtonGroup from '@/components/atoms/ButtonGroup.vue';
import { useI18n } from 'vue-i18n';
import Operation, { Assessment, OperationType } from '@/models/Operation';
import Select from '@/components/atoms/Select.vue';
import Datepicker from 'vue3-datepicker';
import { ButtonActiveColor } from '@/components/atoms/Button.vue';
import getEnumKeys from '@/utils/object';
import { getJsDate } from '@/utils/dates.js';

type AssesmentType = keyof typeof Assessment;

export default defineComponent({
  name: 'OperationSidebar',
  emits: ['close', 'add'],
  props: {
    operation: {
      type: Object as PropType<Operation>,
      default: null,
    },
  },
  components: {
    Select,
    ButtonGroup,
    Datepicker,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const colorMap: Record<AssesmentType, ButtonActiveColor> = {
      EXCELLENT: ButtonActiveColor.GREEN,
      SATISFACTORILY: ButtonActiveColor.YELLOW,
      BADLY: ButtonActiveColor.RED,
    } as const;

    const date = ref(new Date());
    const assessment = ref<Assessment | null | undefined>(null);
    const area = ref<number | null>(null);
    const comment = ref<string | null | undefined>(null);
    const type = ref<OperationType>(0);

    const operations = computed(() => getEnumKeys(OperationType).map((a) => ({
      label: t(`types.${a}`),
      value: OperationType[a],
    })));

    const assesmentBtns = computed(() => getEnumKeys(Assessment).map((a) => ({
      label: t(`assessmentShort.${a}`),
      value: Assessment[a],
      activeColor: colorMap[a],
    })));

    const close = () => {
      emit('close');
    };

    const add = () => {
      const dateObj = {
        year: date.value.getFullYear(),
        month: date.value.getMonth(),
        day: date.value.getDate(),
      };

      emit('add', {
        date: dateObj,
        type: type.value,
        assessment: assessment.value,
        comment: comment.value,
        area: area.value,
        ...(props.operation && { id: props.operation.id }),
      });
    };

    onMounted(() => {
      if (props.operation) {
        console.log(props.operation);
        date.value = getJsDate(props.operation.date);
        comment.value = props.operation.comment;
        area.value = props.operation.area;
        assessment.value = props.operation.assessment;
        type.value = props.operation.type;
      }
    });

    return {
      type,
      date,
      area,
      comment,
      assessment,
      operations,
      assesmentBtns,
      close,
      add,
    };
  },
});
</script>

<style scoped>
.sidebar {
  z-index: 2;
  position: fixed;
  display: block;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--black);

  &__close {
    color: var(--white);
    position: absolute;
    right: 30px;
    top: 30px;

    path {
      transition: fill 0.1s ease;
    }

    &:hover {
      path {
        fill: var(--dark-gray);
      }
    }
  }

  &__body {
    background: var(--white);
    height: 100%;
    width: 320px;
    border-radius: 0px 1px 1px 0;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-weight: 500;
    font-size: 21px;
    line-height: 24px;
    letter-spacing: -0.933333px;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--gray);
  }
}

.field-info {
  height: 52px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray);

  &__data {
    display: grid;
    align-items: center;
    grid-gap: 0 10px;
    grid-template-areas: "square title"
                       "square number";
  }

  &__square {
    grid-area: square;
    width: 25px;
    height: 25px;
  }

  &__title {
    grid-area: title;
    font-weight: 500;
    font-size: 9px;
    line-height: 11px;
    opacity: 0.7;
    align-self: end;
    margin-top: 5px;
  }

  &__number {
    grid-area: number;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    align-self: start;

  }

  &__culture {
    display: grid;
    align-items: center;
    grid-gap: 2px 10px;
    grid-template-areas: "type icon"
                         "name icon";
  }

  &__culture-type {
    grid-area: type;
    font-weight: 500;
    font-size: 15px;
    line-height: 21px;
    text-align: right;
    align-self: end;
  }

  &__culture-name {
    grid-area: name;
    font-weight: 500;
    font-size: 9px;
    line-height: 11px;
    text-align: right;
    opacity: 0.7;
    align-self: start;
  }

  &__culture-icon {
    grid-area: icon;
    align-self: center;
  }
}

.field-control {
  border-bottom: 1px solid var(--gray);
  padding: 16px;
  display: grid;
  grid-gap: 0 20px;
  grid-template-areas: "o o o"
                       "d . a";

  &__operation {
    grid-area: o;
    margin-bottom: 12px;
  }

  &__date {
    grid-area: d;
    justify-self: start;

    display: grid;
    grid-template-areas: "label  icon"
                         "input  icon";
  }

  &__date-label, &__area-label {
    grid-area: label;
    font-weight: 500;
    font-size: 8px;
    line-height: 11px;
    opacity: 0.7;
  }

  &__date-picker {
    position: relative;
    font-size: 18px;
    line-height: 21px;
    color: var(--dark-gray);

    &::v-deep(input) {
      width: 110px;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 18px;
      line-height: 21px;
      padding: 0;
    }
  }

  &__date-icon {
    grid-area: icon;
    align-self: center;
  }

  &__area {
    grid-area: a;
  }

  &__area-input {
    width: 100%;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 21px;
    padding: 0;
  }
}

.field-comment {
  border-bottom: 1px solid var(--gray);

  textarea {
    box-sizing: border-box;
    padding: 20px;
    resize: none;
    width: 100%;
    height: 120px;
    border: none;
    outline: none;
    font-size: 13px;
    line-height: 19px;
  }
}

.field-assessment {
  position: relative;
  padding: 12px 20px;

  &__label {
    font-weight: 500;
    font-size: 11px;
    line-height: 13px;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
}

.apply-btn {
  width: 100%;
  background-color: var(--green);
  transition: all 0.1s ease;
  color: var(--white);
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
}
</style>

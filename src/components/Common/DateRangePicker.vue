<template>
  <div>
    <input ref="inputRef" type="text" v-model="selectedRange" @click="showPicker" readonly>
    <div v-if="showCalendar" ref="calendarRef"></div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker/daterangepicker.css';
import { ref, watch, onMounted, nextTick } from 'vue';
import 'daterangepicker';
import moment from 'moment';

export default {
  name: 'DateRangePicker',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const selectedRange = ref(props.value);
    const showCalendar = ref(false);

    const inputRef = ref(null);
    const calendarRef = ref(null);

    const showPicker = () => {
      showCalendar.value = true;
    };

    const hidePicker = () => {
      showCalendar.value = false;
    };

    const updateValue = () => {
      const picker = $(inputRef.value).data('daterangepicker');
      const start = picker.startDate.format('ddd MMM DD YYYY');
      const end = picker.endDate.format('ddd MMM DD YYYY');
      const range = `${start} - ${end}`;
      selectedRange.value = range;
      emit('update:value', range);
      hidePicker();
    };

    watch(selectedRange, () => {
      const [start, end] = selectedRange.value.split(' - ');
      const picker = $(inputRef.value).data('daterangepicker');
      picker.setStartDate(moment(start, 'ddd MMM DD YYYY'));
      picker.setEndDate(moment(end, 'ddd MMM DD YYYY'));
    });

    onMounted(() => {
      nextTick(() => {
        const [start, end] = selectedRange.value.split(' - ');
        const predefinedRanges = {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
          ]
        };
        $(inputRef.value).daterangepicker({
          startDate: moment(start, 'ddd MMM DD YYYY'),
          endDate: moment(end, 'ddd MMM DD YYYY'),
          opens: 'center',
          autoUpdateInput: false,
          ranges: predefinedRanges
        });
        $(inputRef.value).on('apply.daterangepicker', updateValue);
      });
    });

    return {
      selectedRange,
      showCalendar,
      showPicker,
      hidePicker,
      inputRef,
      calendarRef
    };
  }
};
</script>

<style scoped>
input {
  background: #fff;
  cursor: pointer;
  min-width: 240px;
  padding: 1px 4px;
  border: 1px solid #ccc;
  text-align: center;
  border-radius: 4px !important;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  font-size: 13px;
  font-weight: normal !important;
}
input:focus {
  outline: none !important;
}
</style>

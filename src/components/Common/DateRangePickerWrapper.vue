<template>
    <div>
        <date-range-picker
            v-if="showPicker"
            :value="dateRange"
            :min-date="minDate"
            :max-date="maxDate"
            :auto-close="true"
            @selected="onDateRangeSelected"
        />
    </div>
</template>
  
<script>
    import DateRangePicker from 'vue2-daterange-picker';
    import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
    import moment from 'moment';
    export default {
        components: {
            DateRangePicker,
        },
        data() {
            return {
                showPicker: true,
                startDate: null,
                endDate: null,
                minDate: moment().subtract(1, 'year').format('YYYY-MM-DD'),
                maxDate: moment().add(1, 'year').format('YYYY-MM-DD'),
            };
        },
        computed: {
            formattedValue() {
                if (this.startDate && this.endDate) {
                    return `${this.startDate} - ${this.endDate}`;
                }
                return '';
            },
            dateRange: {
              get() {
                return { start: this.startDate, end: this.endDate };
              },
              set(value) {
                this.startDate = value.start;
                this.endDate = value.end;
              },
            },
        },
        methods: {
            onDateRangeSelected(range) {
                this.startDate = range.start.format('YYYY-MM-DD');
                this.endDate = range.end.format('YYYY-MM-DD');
                this.showPicker = false;
            },
        },
    };
</script>
  
<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Team Member Payments Report</span>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Team Member Payments Report
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end">
                                <v-col cols="12" lg="6" md="6" sm="9" class="font-medium font-weight-normal v_select_design">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />

                        <v-row class="mt-4" v-if="cardMemberList.length > 0">
                            <v-col cols="6" sm="6" md="4" lg="3" v-for="(data,index) in cardMemberList" :key="index">
                                <v-card class="card_design" :class="data.totalAmount == '0' ? 'bg-blue-lighten-4' : 'bg-green-lighten-4'"> 
                                    <v-card-title>
                                        <p class="text-subtitle-2 font-weight-bold mb-0">From: {{ data.from_account }}</p>
                                        <p class="text-subtitle-2 font-weight-bold">TO: {{ data.to_account }}</p>
                                    </v-card-title>
                                    <v-card-text class="font-weight-medium text-h4 pa-0 mt-2">
                                        <div :class="data.totalAmount == '0' ? 'text-blue-darken-2' : 'text-green-darken-1'">
                                            {{ $filters.toCurrency(data.total_amount) }}
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row class="mt-4" v-else>
                            <v-col cols="12" sm="12" md="12" lg="12">
                                <v-card class="border-0">
                                    <v-card-title class="d-flex justify-content-center align-center">
                                         No data available
                                    </v-card-title>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker,
    },

    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            message: {},
            showLoader: false,
            cardMemberList: [],
            dateRange: {startDate, endDate},
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    mounted() {
        this.pull();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        pull() {
            this.showLoader = true;
            let data ={
                startDate: moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'),
                endDate: moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'),
            }
            axios.post(this.$api + '/accounting/teamMemberPayments/genrateTeamMembersPaymentsReport',data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.cardMemberList = response.data.data
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
        // update data using date range
        updateRange(range) {
            this.selectedRange = range;
            this.pull();
        },
    },
}
</script>
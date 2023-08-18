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
                            <span>Networks Campaign Metrics</span>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Networks Campaign Metrics List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                                <v-col class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.network_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.network_name ? item.selectable.network_name : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.affiliates_network_id`]="{ item }">
                                {{item.selectable.affiliates_network_id ? item.selectable.affiliates_network_id : '-'}}
                            </template>
                            <template v-slot:[`item.campaign_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.campaign_name ? item.selectable.campaign_name : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.conversion_rate`]="{ item }">
                                {{parseFloat(item.selectable.conversion_rate).toFixed(2)}}
                            </template>
                            <template v-slot:[`item.epc`]="{ item }">
                                {{parseFloat(item.selectable.epc).toFixed(2)}}
                            </template>
                            <template v-slot:[`item.network_type`]="{ item }">
                                {{item.selectable.network_type ? item.selectable.network_type : '-'}}
                            </template>
                            <template v-slot:[`item.monitor_date`]="{ item }">
                                {{item.selectable.monitor_date ? item.selectable.monitor_date : '-'}}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editMetricsModal(item.selectable)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <div class="modal fade" id="MetricsModal" tabindex="-1" role="dialog" aria-labelledby="MetricsModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Notes</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeMetricsModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="updateMonitoring" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <Field name="notes" v-model="item.notes">
                                        <textarea type="text" id="input-username" name="notes" :class="{'form-control': true, 'border-red-600': errors.notes}" v-model="item.notes" rows="4" placeholder="Notes"></textarea>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.notes">Notes is a required field</span>
                                </v-col>
                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>
                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="reset" class="text-none bg-blue-darken-4 btn_animated mr-3 ml--4" id="reset_button" append-icon="mdi-content-save" style="opacity: 0">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeMetricsModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, 
        Field,
        DateRangePicker
    },
    data() {
        return {
            message: {},
            showLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'id'},
                { title: 'Network Name', key: 'network_name' },
                { title: 'Login ID', key: 'affiliates_network_id' },
                { title: 'Camapign Name', key: 'campaign_name' },
                { title: 'Conversion Rate', key: 'conversion_rate' },
                { title: 'EPC', key: 'epc' },
                { title: 'Platform Type', key: 'network_type' },
                { title: 'Monitor Date', key: 'monitor_date' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action' },
            ],
            urlList: [],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            item: {
                id:'',
                notes: '',
            },
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            permissions: {},
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getData();
    },
    computed: {
        schema() {
            return yup.object({
                notes: yup.string().required(),
            });
        },
    },
    methods: {
        editMetricsModal(val) {
            this.item.id = val.id;
            this.item.notes = val.notes;
            window.$('#MetricsModal').modal('show');
        },
        closeMetricsModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#MetricsModal').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getData();
        },
        // get listings
        getData() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/monitoring/metrics';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    const getData = response.data;
                    this.urlList = getData.data;
                    this.permissions = getData.permission;
                    this.showLoader = false;
                } else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if (error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.errors) {
                    if (error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    } else if (error.response.data.errors.length == 0) {
                        this.backendErrorMessage = '';
                    } else {
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
        // update monitoring
        updateMonitoring() {
            this.showLoader = true;
            axios.post(this.$api + '/monitoring/metrics', {
                id: this.item.id,
                notes: this.item.notes,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.showLoader = false;
                    this.getData();
                    this.closeMetricsModal();
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                } else {
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
                    this.backendErrorMessage = error.response.data.message;
                }
                if(error.response.data.error) {
                    this.backendErrorMessage = error.response.data.error;
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.backendErrorMessage = error.response.data.errors[0];
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.multipleErrors = error.response.data.errors;
                    }
                }
                this.showLoader = false;
            });
        },
    }
}
</script>

<style scoped>
</style>
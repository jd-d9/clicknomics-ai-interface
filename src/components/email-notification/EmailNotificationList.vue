<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <router-link to="/dashboard" class="d-flex align-center">
                            <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                            <span>Dashboard</span>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Email Notification</span>

                        <v-spacer />
                        <v-btn @click.prevent="createActivity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Email Notification List
                            <v-spacer></v-spacer>
                            <div v-if="selected.length > 0">
                                <v-btn @click="deleteSelected" :disabled="permissions.delete_auth == '0'" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                    Remove Selected
                                </v-btn>
                            </div>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                            </v-col>
                        </v-card-title>

                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage"> <!--  @current-items="currentItems"  -->
                            <template v-slot:[`item.action`]="{ item }">  
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
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

        <!-- Create & Update RM AMEX Plum Activity-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{activityType}} Email Notification User</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>  

                    <Form @submit="saveEmailNotificationUser" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Email</label>
                                    <Field name="Email" type="text" id="input-username" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model="activity.email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Daily Report</label>
                                    <Field name="DailyReport" v-model="activity.daily_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.DailyReport}" :items="accountTypeList" v-model="activity.daily_report" placeholder="Select Daily Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.DailyReport">Daily Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Monthly Report</label>
                                    <Field name="MonthlyReport" v-model="activity.monthly_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.MonthlyReport}" :items="accountTypeList" v-model="activity.monthly_report" placeholder="Select Monthly Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.MonthlyReport">Monthly Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Weekly Report</label>
                                    <Field name="WeeklyReport" v-model="activity.weekly_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.WeeklyReport}" :items="accountTypeList" v-model="activity.weekly_report" placeholder="Select Weekly Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.WeeklyReport">Weekly Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">URL Uptime Report</label>
                                    <Field name="url_uptime_report" v-model="activity.url_uptime_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.url_uptime_report}" :items="accountTypeList" v-model="activity.url_uptime_report" placeholder="Select URL Uptime Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.url_uptime_report">URL Uptime Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Account Monitoring Report</label>
                                    <Field name="account_monitoring_report" v-model="activity.account_monitoring_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.account_monitoring_report}" :items="accountTypeList" v-model="activity.account_monitoring_report" placeholder="Select Account Monitoring Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.account_monitoring_report">Account Monitoring Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Network Monitoring Report</label>
                                    <Field name="networks_monitoring_report" v-model="activity.networks_monitoring_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.networks_monitoring_report}" :items="accountTypeList" v-model="activity.networks_monitoring_report" placeholder="Select Network Monitoring Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.networks_monitoring_report">Network Monitoring Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Ads Issue Report</label>
                                    <Field name="ads_issue_report" v-model="activity.ads_issue_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.ads_issue_report}" :items="accountTypeList" v-model="activity.ads_issue_report" placeholder="Select Ads Issue Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.ads_issue_report">Ads Issue Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain Expires Report</label>
                                    <Field name="domain_expires_report" v-model="activity.domain_expires_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.domain_expires_report}" :items="accountTypeList" v-model="activity.domain_expires_report" placeholder="Select Domain Expires Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.domain_expires_report">Domain Expires Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Payment Declined Report</label>
                                    <Field name="payment_declined_report" v-model="activity.payment_declined_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.payment_declined_report}" :items="accountTypeList" v-model="activity.payment_declined_report" placeholder="Select Payment Declined Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.payment_declined_report">Payment Declined Report is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Website Speed Test Report</label>
                                    <Field name="speed_test_report" v-model="activity.speed_test_report">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.speed_test_report}" :items="accountTypeList" v-model="activity.speed_test_report" placeholder="Select Website Speed Test Report"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.speed_test_report">Website Speed Test Report is a required field</span>
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
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
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
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    // props: [ 'list'],
    components: {
        Form, 
        Field,
        ErrorMessage
    },
    data() {
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Email', key: 'email'},
                { title: 'Daily Report', align: 'start', sortable: false, key: 'daily_report' },
                { title: 'Monthly Report ', key: 'monthly_report', sortable: false },
                { title: 'Weekly Report', key: 'weekly_report', sortable: false },
                { title: 'URL Uptime', key: 'url_uptime_report', sortable: false },
                { title: 'Account Monitoring', key: 'account_monitoring_report', sortable: false },
                { title: 'Network Monitoring', key: 'networks_monitoring_report', sortable: false },
                { title: 'Ads Issue Report', key: 'ads_issue_report', sortable: false },
                { title: 'Domain Expires', key: 'domain_expires_report', sortable: false },
                { title: 'Payment Declined', key: 'payment_declined_report', sortable: false },
                { title: 'Speed Test', key: 'speed_test_report', sortable: false },
                { title: 'Action', key: 'action' },
            ],
            file: '',
            selected: [],
            currentItemsTable: [],
            itemsPerPage: -1,
            accountTypeList: [
                {
                    title: 'Active'
                },
                {
                    title: 'Inactive'
                },
            ],
            activity: {
                id: '',
                email: '',
                daily_report : 'Active',
                monthly_report : 'Active',
                weekly_report : 'Active',
                url_uptime_report : 'Active',
                account_monitoring_report : 'Active',
                networks_monitoring_report : 'Active',
                ads_issue_report : 'Active',
                domain_expires_report : 'Active',
                payment_declined_report : 'Active',
                speed_test_report : 'Active',
            },
            activityType: 'Add',
            showImportIcon: true,
            permissions: {},
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    filters: {
        dateCell (value) {
            let dt = new Date(value)

            return dt.getDate()
        },
        date (val) {
            return val ? val.toDateString() : ''
        }
    },
    computed: {
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
                DailyReport: yup.string().required(),
                MonthlyReport: yup.string().required(),
                WeeklyReport: yup.string().required(),
                url_uptime_report: yup.string().required(),
                account_monitoring_report: yup.string().required(),
                networks_monitoring_report: yup.string().required(),
                ads_issue_report: yup.string().required(),
                domain_expires_report: yup.string().required(),
                payment_declined_report: yup.string().required(),
                speed_test_report: yup.string().required(),
            });
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getListings();
        // this.getDomainList();
        // this.dataMetrics = this.list
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // get listing data
        getListings() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/emailNotification', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
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
        // open model for edit and set field values
        edit(id) {
            this.openModal();
            const result = this.dataMetrics.find((val) => {
                return val.id == id
            });
            this.activityType = 'Update'
            this.activity.id = id;
            this.activity.email = result.email;
            this.activity.daily_report = result.daily_report;
            this.activity.monthly_report = result.monthly_report;
            this.activity.weekly_report = result.weekly_report
            this.activity.url_uptime_report = result.url_uptime_report;
            this.activity.account_monitoring_report = result.account_monitoring_report;
            this.activity.networks_monitoring_report = result.networks_monitoring_report;
            this.activity.ads_issue_report = result.ads_issue_report;
            this.activity.domain_expires_report = result.domain_expires_report;
            this.activity.payment_declined_report = result.payment_declined_report;
            this.activity.speed_test_report = result.speed_test_report;
        },
        // open model for create and set field values
        createActivity() {
            this.openModal();
            this.activityType = 'Add';
            this.activity.email = '';
            this.activity.daily_report = 'Active';
            this.activity.monthly_report = 'Active';
            this.activity.weekly_report = 'Active';
            this.activity.url_uptime_report = 'Active';
            this.activity.account_monitoring_report = 'Active';
            this.activity.networks_monitoring_report = 'Active';
            this.activity.ads_issue_report = 'Active';
            this.activity.domain_expires_report = 'Active';
            this.activity.payment_declined_report = 'Active';
            this.activity.speed_test_report = 'Active';
        },
        // delete single data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/settings/emailNotification/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.getListings();
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
            }
        },
        // delete selected data/multiple data
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('id', JSON.stringify(multipleRow));
                axios.post(this.$api + '/settings/emailNotification/deleteMutipleRows', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.selected = [];
                        this.getListings();
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
            }
        },
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
        // save and update email notification
        saveEmailNotificationUser() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('email', this.activity.email);
            formData.append('daily_report', this.activity.daily_report);
            formData.append('monthly_report', this.activity.monthly_report);
            formData.append('weekly_report', this.activity.weekly_report);
            formData.append('url_uptime_report', this.activity.url_uptime_report);
            formData.append('account_monitoring_report', this.activity.account_monitoring_report);
            formData.append('networks_monitoring_report', this.activity.networks_monitoring_report);
            formData.append('ads_issue_report', this.activity.ads_issue_report);
            formData.append('domain_expires_report', this.activity.domain_expires_report);
            formData.append('payment_declined_report', this.activity.payment_declined_report);
            formData.append('speed_test_report', this.activity.speed_test_report);
            this.activityType != 'Add' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Add' ? '/settings/emailNotification' : `/settings/emailNotification/${this.activity.id}`
            axios.post(`${this.$api}${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.closeModal();
                    this.getListings();
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
        }
    }
}
</script>

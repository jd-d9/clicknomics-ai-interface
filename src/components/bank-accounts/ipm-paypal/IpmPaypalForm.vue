<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs class="form_breadcume">
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>IPM PayPal Payment</span>
    
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>{{breadCrumbText}}</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/bank_accounts/ipm-paypal/list" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{breadCrumbText}} IPM PayPal Payment
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form @submit="savePaypalPayment" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="activity.date" :class="{'border-red-600': errors.date}">
                                        <datepicker placeholder="Select Date" name="Date" v-model:value="activity.date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600':errors.Date }"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Name</label>
                                    <Field type="text" id="input-username" name="Name" :class="{'form-control': true, 'border-red-600': errors.Name}" placeholder="Add Name" v-model="activity.name"/>
                                    <span class="text-red-600" v-if="errors.Name">Name is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" min="0" placeholder="Add Amount" v-model="activity.amount"/>
                                    <span class="text-red-600" v-if="errors.Amount">Amount is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Status</label>
                                    <Field name="Status" v-model="activity.status">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.Status}" name="Status" :items="statusList" v-model="activity.status"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Status">Status is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Transaction Type</label>
                                    <Field name="transactionType" v-model="activity.transaction_type">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.transactionType}" name="transactionType" :items="transactionList" v-model="activity.transaction_type"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.transactionType">Transaction type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Type</label>
                                    <Field type="text" id="input-username" name="type" :class="{'form-control': true , 'border-red-600':errors.type}" placeholder="Type" v-model="activity.type"/>
                                    <span class="text-red-600" v-if="errors.type">Type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">From Email Address</label>
                                    <Field type="email" id="input-username" name="fromEmail" :class="{'form-control': true, 'border-red-600': errors.fromEmail}" placeholder="From Email Address" v-model="activity.from_email_address"/>
                                    <span class="text-red-600" v-if="errors.fromEmail">From email address is a required field and must be a valid email</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">To Email Address</label>
                                    <Field type="email" id="input-username" name="toEmail" :class="{'form-control': true, 'border-red-600': errors.toEmail}" placeholder="To Email Address" v-model="activity.to_email_address"/>
                                    <span class="text-red-600" v-if="errors.toEmail">To email address is a required field and must be a valid email</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">{{toggleElement ? 'Save' : 'Update'}}</v-btn>    
                                </v-col>
                            </v-row>
                        </Form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from '@axios';
import * as yup from 'yup';
import { Field, Form } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
export default {
    // props: ['report'],
    components: {
        Datepicker,
        Field, 
        Form, 
    },
    data() {
        return {
            message: {},
            showLoader: false,
            breadCrumbText: 'Create',
            toggleElement: true,
            backendErrorMessage: '',
            multipleErrors: [],
            activity: {
                id: '',
                date : '',
                name: '',
                type: '',
                status: '',
                amount: '',
                from_email_address: '',
                to_email_address: '',
                transaction_type: '',
            },
            nameFilter: [],
            typeFilter: [],
            statusFilter: [],
            transactionTypeFilter: [],
            nameValue: '',
            typeValue: '',
            statusValue: '',
            transactionTypeValue: '',
            transactionList: [
                {
                    title: 'CREDIT'
                },
                {
                    title: 'DEBIT'
                },
            ],
            statusList: [
                {
                    title: 'Completed'
                },
                {
                    title: 'Pending'
                },
            ],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if(this.$route.params.id) {
            this.breadCrumbText = 'Update';
            this.toggleElement = false;
            this.getDataForEdit();
        }
        this.$nextTick(() => {
            window.$('.mx-datepicker input').addClass('datepicker-input');
        })
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
                Name: yup.string().required(),
                Amount: yup.string().required(),
                Status: yup.string().required(),
                transactionType: yup.string().required(),
                type: yup.string().required(),
                fromEmail: yup.string().required().email(),
                toEmail: yup.string().required().email(),
            });
        }
    },
    watch: {
        amount(newValue) {
            if(newValue) {
                this.grandtotal = parseFloat(newValue) - parseFloat(this.fees);
            }
        },
        fees(newValue) {
            if(newValue) {
                this.grandtotal = parseFloat(this.amount) - parseFloat(newValue);
            }
        }
    },
    methods: {
        // save or update ipm paypal data
        savePaypalPayment() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', this.activity.date);
            formData.append('name', this.activity.name);
            formData.append('amount', this.activity.amount);
            formData.append('type', this.activity.type);
            formData.append('status', this.activity.status);
            formData.append('transaction_type', this.activity.transaction_type);
            formData.append('from_email_address', this.activity.from_email_address);
            formData.append('to_email_address', this.activity.to_email_address);
            !this.toggleElement && formData.append('_method', 'PUT');
            const url = this.toggleElement ? this.$api + '/bank_account/payPalPayment' : this.$api + '/bank_account/payPalPayment/' + this.$route.params.id;
            axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
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
                    this.showLoader = false;
                    this.$router.push('/bank_accounts/ipm-paypal/list');
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
        },
        // get ipm chase payment data for update
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/bank_account/payPalPayment/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    this.activity = getData;
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
    }
}
</script>

<style scoped>

</style>

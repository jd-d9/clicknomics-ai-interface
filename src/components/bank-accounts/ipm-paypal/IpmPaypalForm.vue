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
                        <span>IPM PayPal Payment</span>

                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>{{breadCrumbText}}</span>

                        <v-spacer />
                        <v-btn to="/bank_accounts/ipm-paypal/list" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{breadCrumbText}} IPM PayPal Payment
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form @submit="saveOnessCorpPayment" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="activity.date" :class="{'border-red-600': errors.date}">
                                        <datepicker placeholder="Select Date" name="Date" v-model:value="activity.date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600':errors.Date }"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Name</label>
                                    <Field type="text" id="input-username" name="Recepient" :class="{'form-control': true , 'border-red-600':errors.Recepient}" placeholder="Name" v-model="activity.name"/>
                                    <!-- <span class="text-red-600" v-if="errors.Recepient">Name can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" min="0" placeholder="Add Amount" v-model="activity.amount"/>
                                    <!-- <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Status</label>
                                    <Field name="Status" v-model="activity.status">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.Status}" name="Transaction" :items="statusList" v-model="activity.status"></v-select>
                                    </Field>
                                    <!-- <span class="text-red-600" v-if="errors.Fees">Fees can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Transaction Type</label>
                                    <Field name="Status" v-model="activity.transaction_type">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.Status}" name="Transaction" :items="transactionList" v-model="activity.transaction_type"></v-select>
                                    </Field>
                                    <!-- <span class="text-red-600" v-if="errors.Fees">Fees can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Type</label>
                                    <Field type="text" id="input-username" name="Recepient" :class="{'form-control': true , 'border-red-600':errors.Recepient}" placeholder="Type" v-model="activity.type"/>
                                    <!-- <span class="text-red-600" v-if="errors.Recepient">Name can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">From Email Address</label>
                                    <Field type="text" id="input-username" name="Recepient" :class="{'form-control': true , 'border-red-600':errors.Recepient}" placeholder="From Email Address" v-model="activity.from_email_address"/>
                                    <!-- <span class="text-red-600" v-if="errors.Recepient">Name can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">To Email Address</label>
                                    <Field type="text" id="input-username" name="Recepient" :class="{'form-control': true , 'border-red-600':errors.Recepient}" placeholder="To Email Address" v-model="activity.to_email_address"/>
                                    <!-- <span class="text-red-600" v-if="errors.Recepient">Name can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" v-if="toggleElement">Save</v-btn>    
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-arrow-up-bold" v-else>Update</v-btn>    
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
                Description: yup.string().required(),
                Recepient: yup.string().required(),
                Amount: yup.string().required(),
                Fees: yup.string().required(),
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
        // save or update ipm ossc data
        saveOnessCorpPayment() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', this.date);
            formData.append('amount', this.amount);
            // formData.append('network', this.network);
            formData.append('description', this.description);
            formData.append('recepient', this.recepient);
            formData.append('fees', this.fees);
            formData.append('grand_total', this.grandtotal);
            !this.toggleElement && formData.append('_method', 'PUT');
            const url = this.toggleElement ? this.$api + '/bank_account/onesscorp' : this.$api + '/bank_account/onesscorp/' + this.$route.params.id;
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
                    this.$router.push('/bank_accounts/onesscorp/list');
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
            axios.get(this.$api + '/bank_account/onesscorp/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data.data;
                    this.date = Data.date;
                    this.amount = Data.amount;
                    this.description = Data.description;
                    this.recepient = Data.recepient;
                    this.fees = Data.fees;
                    this.grandtotal = Data.grand_total;
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

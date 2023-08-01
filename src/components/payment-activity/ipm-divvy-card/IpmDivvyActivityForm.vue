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
                        <router-link to="/payment_methods/ipm-divvy-card/activity" class="d-flex align-center">
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>IPM Divvy Activity</span>
                        </router-link>

                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>{{toggleElement ? 'Create' : 'Edit'}} Activity</span>
                        <v-spacer />
                        <v-btn to="/payment_methods/ipm-divvy-card/activity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{toggleElement ? 'Create' : 'Edit'}} IPM Divvy Activity
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form @submit="createActivity" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="date" v-model="date">
                                        <datepicker placeholder="Select Date" name="date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600': errors.date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.date">Date is a required field</span>
                                </v-col>
                                
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" maxlength='5' id="input-username" name="amount" :class="{'form-control': true, 'border-red-600': errors.amount}" placeholder="Add Amount" v-model="amount"/>
                                    <span class="text-red-600" v-if="errors.amount">Amount is a required field</span>
                                </v-col>
                                
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Name</label>
                                    <Field type="text" name="name" :class="{'form-control': true, 'border-red-600': errors.name }" placeholder="Add Name" v-model="name" />
                                    <span class="text-red-600" v-if="errors.name">Name is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Transaction Type</label>
                                    <Field name="transactionType" v-model="transactionType">
                                        <v-select name="transactionType" :class="{'form-control autocomplete': true, 'border-red-600': errors.transactionType}" :items="statusList" v-model="transactionType" placeholder="Select Transaction Type"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.transactionType">Transaction type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card</label>
                                    <Field type="number" name="cardType" :class="{'form-control autocomplete': true, 'border-red-600': errors.cardType}" v-model="cardType" placeholder="Type"/>
                                    <span class="text-red-600" v-if="errors.cardType">Card is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Merchants</label>
                                    <Field name="merchants" v-model="merchants">
                                        <textarea :class="{'form-control': true, 'border-red-600': errors.merchants}" name="notes" rows="5" v-model="merchants"></textarea>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.merchants">Merchants is a required field</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                            <v-row>
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
import { Form, Field } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
export default {
    components: {
        Datepicker,
        Form, 
        Field
    },
    data() {
        return{
            date: '',
            amount: '',
            name: '',
            transactionType: '',
            cardType: '',
            merchants: '',
            backendErrorMessage: '',
            multipleErrors: [],
            toggleElement: true,
            statusList: [
                {
                    title: 'CREDIT'
                },
                {
                    title: 'DEBIT'
                },
            ],
        }
    },
    computed: {
        schema() {
            return yup.object({
                date: yup.string().required(),
                amount: yup.string().required(),
                name: yup.string().required(),
                transactionType: yup.string().required(),
                cardType: yup.string().required(),
                merchants: yup.string().required(),
            });
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if(this.$route.params.id) {
            this.toggleElement = false;
            const editData = JSON.parse(localStorage.getItem('editData'));
            this.date = editData.date;
            this.amount = editData.amount;
            this.cardType = editData.card;
            this.transactionType = editData.transaction_type;
            this.name = editData.name;
            this.merchants = editData.merchant;
        }
    },
    methods: {
        // create activity
        createActivity() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', this.date);
            formData.append('amount', this.amount);
            formData.append('card', this.cardType);
            formData.append('transaction_type', this.transactionType);
            formData.append('name', this.name);
            formData.append('merchant', this.merchants);
            !this.toggleElement && formData.append('_method', 'PUT');
            const url = this.toggleElement ? this.$api + '/paymentMethod/paymentActivity/divvyActivity' : this.$api + '/paymentMethod/paymentActivity/divvyActivity/' + this.$route.params.id;
            axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/payment_methods/ipm-divvy-card/activity');
                    localStorage.removeItem('editData');
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
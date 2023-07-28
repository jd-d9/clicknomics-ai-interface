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
                        <router-link to="/accounting/variableMonthlyCost" class="d-flex align-center">
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Variable Monthly Cost</span>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>{{breadCrumbMessage}}</span>

                        <v-spacer />
                        <v-btn to="/accounting/variableMonthlyCost" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{breadCrumbMessage}} Variable Monthly Cost
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />   
                        
                        <Form @submit="manageVariableMonthlyCost" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="date" :class="{'border-red-600': errors.Date}">
                                        <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :range="toggleElement" :class="{'border-red-600': errors.Date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="8" lg="8" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Notes</label>
                                    <Field name="Notes" v-model="notes">
                                        <textarea :class="{'form-control': true, 'border-red-600': errors.Notes}" name="Notes" cols="30" rows="10" v-model="notes"></textarea>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Notes">Notes can not be empty</span>
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
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Datepicker,
        Form, 
        Field
    },
    data() {
        return {
            message: {},
            showLoader: false,
            date: '',
            amount: '',
            notes: '',
            breadCrumbMessage: 'Add',
            toggleElement: true,
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbMessage = 'Update';
            this.toggleElement = false;
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    computed: {
        schema() {
            return yup.object({
                Date: this.toggleElement ? yup.array().required() : yup.string().required(),
                Amount: yup.string().required(),
                Notes: yup.string().required(),
            });
        },
    },
    methods: {
        // create and update variable monthly cost
        manageVariableMonthlyCost() {
            // update variable monthly cost
            if(this.$route.params.id) {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                    _method: 'PUT',
                    date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    notes: this.notes,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/variableMonthlyCost');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
            // create variable monthly cost
            else {
                this.showLoader = true;
                const dateRange = this.date[0].concat(",", this.date[1]);
                axios.post(this.$api + '/accounting/variableCost', {
                    date: dateRange,
                    amount: this.amount,
                    notes: this.notes,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/variableMonthlyCost');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
        },
        // get data for edit
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data.data;
                    console.log(data)
                    this.date = data.date,
                    this.amount = data.amount,
                    this.notes = data.notes,
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
        }
    }
}
</script>

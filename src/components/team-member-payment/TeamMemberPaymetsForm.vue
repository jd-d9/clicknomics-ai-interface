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
                        <router-link to="/accounting/teamMembersPayments" class="d-flex align-center">
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Team Member Payments</span>
                        </router-link>

                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>{{ breadCrumbMessage }}</span>
                        <v-spacer />
                        <v-btn to="/accounting/teamMembersPayments" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{ breadCrumbMessage }} Team Member Payment
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />  
                        <Form @submit="manageTeamMemberPayment" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="date">
                                        <datepicker placeholder="Select Date" name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600': errors.Date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                    <span class="text-red-600" v-if="errors.Amount">Amount is a required field</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">From Account</label>
                                    <Field name="Fromaccount" v-model="fromAccount">
                                        <v-select name="Fromaccount" :class="{'form-control autocomplete': true, 'border-red-600': errors.Fromaccount}" :items="list" item-value="key" v-model="fromAccount" placeholder="Select From account"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Fromaccount">From account is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">To Account</label>
                                    <Field name="Toaccount" v-model="toAccount">
                                        <v-select name="Toaccount" :class="{'form-control autocomplete': true, 'border-red-600': errors.Toaccount}" :items="creditLines" item-value="key" v-model="toAccount" placeholder="Select To account"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Toaccount">To account is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Status</label>
                                    <Field name="Status" v-model="status">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.Status}" :items="statusList" v-model="status" placeholder="Select Status"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Status">Status is a required field</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                            
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
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
import moment from 'moment';
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
            fromAccount: '',
            toAccount: '',
            status: '',
            list: [],
            creditLines: [],
            statusList: [
                {
                    title: 'Initiated'
                },
                {
                    title: 'Completed'
                },
            ],
            accountList: [],
            fromAccountList: [],
            toggleComponent: true,
            breadCrumbMessage: 'Create',
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getFromToAccountDropdownData();
        if(this.$route.params.id) {
            this.toggleComponent = false;
            this.breadCrumbMessage = 'Edit';
            this.getDataForEdit();
        }
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
                Amount: yup.string().required(),
                Fromaccount: yup.string().required(),
                Toaccount: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    methods: {
        // get data for edit
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/accounting/teamMemberPayment/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    this.date = getData.payment_date;
                    this.amount = getData.amount;
                    this.fromAccount = getData.from_account;
                    this.toAccount = getData.to_account;
                    this.status = getData.status,
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
        // create and update team member payment
        manageTeamMemberPayment() {
            // update team member payment
            if(this.$route.params.id) {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/teamMemberPayment/' + this.$route.params.id, {
                    _method: 'PUT',
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/teamMembersPayments');
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
            // create team member payment
            else {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/teamMemberPayment', {
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/teamMembersPayments');
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
        // get fromaccount and toaccount dropdown data
        getFromToAccountDropdownData() {
            this.showLoader = true;
            axios.get(this.$api + '/accounting/teamMemberPayments/teammemberlist', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    // get to account data
                    getData.filter((val) => {
                        return val.team_member_type == 'toAccount';
                    }).forEach((val) => {
                        this.creditLines.push({
                            title: val.team_member_name,
                            key: val.id
                        })
                    });
                    // get from account data
                    getData.filter((val) => {
                        return val.team_member_type == 'fromAccount';
                    }).forEach((val) => {
                        this.list.push({
                            title: val.team_member_name,
                            key: val.id
                        })
                    });
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

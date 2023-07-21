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
                        <span>{{ breadCrumbMessage }} Credit Card Payment</span>

                        <v-spacer />
                        <v-btn to="/accounting/creditCardPayments" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{ breadCrumbMessage }} Credit Card Payment
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />  
                        <Form @submit="manageCreditCardPayment" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="date" :class="{'border-red-600': errors.date}">
                                        <datepicker placeholder="Select Date" name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600': errors.Date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">From Account</label>
                                    <Field name="Fromaccount" v-model="fromAccount">
                                        <v-autocomplete name="Fromaccount" :class="{'form-control autocomplete': true, 'border-red-600': errors.Fromaccount}" :items="list" v-model="fromAccount" placeholder="Select From account"></v-autocomplete>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Fromaccount">From Account can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">To Account</label>
                                    <Field name="Toaccount" v-model="toAccount">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.Toaccount}" :items="creditLines" v-model="toAccount" placeholder="Select To account"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Toaccount">To Account can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Status</label>
                                    <Field name="Status" v-model="status">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.Status}" :items="statusList" v-model="status" placeholder="Select Status"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Status">Status can not be empty</span>
                                </v-col>

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
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        Form, Field
    },
    data() {
        return {
            showLoader: false,
            date: '',
            amount: '',
            fromAccount: '',
            toAccount: '',
            status: '',
            statusList: [
                {
                    title: 'Initiated'
                },
                {
                    title: 'Received'
                },
                {
                    title: 'Completed'
                },
            ],
            list: [
                {
                    title: 'IPM Chase'
                },
                {
                    title: 'IPM OSSC'
                },
                {
                    title: 'IPM SXM & Others'
                },
                {
                    title: 'IPM Paypal'
                },
            ],
            creditLines: [
                {
                    title: 'RM AMEX Plum Card'
                },
                {
                    title: 'IPM AMEX Plum Card'
                },
                {
                    title: 'IPM Divvy Card'
                },
                {
                    title: 'IPM Chase Ink Card'
                },
            ],
            toggleComponent: true,
            breadCrumbMessage: 'Create',
            invalidDate: '',
            invalidAmount: '',
            invalidFromAccount: '',
            invalidToAccount: '',
            invalidStatus: '',
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if(this.$route.params.id) {
            this.toggleComponent = false;
            this.breadCrumbMessage = 'Edit';
            this.getSingleForEdit();
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
        // create and update credit card payment
        manageCreditCardPayment() {
            // update credit card payment
            if(this.$route.params.id) {
                this.showLoader = true;
                this.axios.post(this.$api + '/accounting/creditCardPayments/' + this.$route.params.id, {
                    _method: 'PUT',
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/creditCardPayments');
                        this.$toast.open({
                            message: 'Credit card payment updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                });
            }
            // create credit card payment
            else {
                this.showLoader = true;
                this.axios.post(this.$api + '/accounting/creditCardPayments', {
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/creditCardPayments');
                        this.$toast.open({
                            message: 'Credit card payment created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                });
            }
        },
        // get data for edit credit card payment
        getSingleForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/creditCardPayments/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.date = response.data.data.payment_date;
                    this.amount = response.data.data.amount;
                    this.fromAccount = response.data.data.from_account;
                    this.toAccount = response.data.data.to_account;
                    this.status = response.data.data.status;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
    }
}
</script>

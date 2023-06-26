<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Credit Card Payment {{ breadCrumbMessage }}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-5 text-right">
                            <router-link to="/accounting/creditCardPayments" class="btn btn-lg btn-neutral btn_animated">View Credit Card Payment Listing</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="manageCreditCardPayment" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <Field name="Date" v-model="date">
                                                    <datepicker name="Date" inputFormat="yyyy-MM-dd" v-model="date" :locale="locale" :clearable="true"/>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Date"/> -->
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                                <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Amount"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-two select-network-filter-height">
                                                <label class="form-control-label" for="input-username">From Account</label>
                                                <Field name="Fromaccount" v-model="fromAccount">
                                                    <v-autocomplete name="Fromaccount" :class="{'form-control': true, 'border-red-600': errors.Fromaccount}" variant="outlined" :items="list" v-model="fromAccount"></v-autocomplete>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Fromaccount">From account can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Fromaccount"/> -->
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">To Account</label>
                                                <Field name="Toaccount" v-model="toAccount">
                                                    <v-select :class="{'form-control': true, 'border-red-600': errors.Toaccount}" :items="creditLines" v-model="toAccount"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Toaccount">To account can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Toaccount"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">Status</label>
                                                <Field name="Status" v-model="status">
                                                    <v-select :class="{'form-control': true, 'border-red-600': errors.Status}" :items="statusList" v-model="status"></v-select>
                                                </Field>
                                                <!-- <span class="text-red-600" v-if="errors.Status">Status can not be empty</span> -->
                                                <ErrorMessage class="text-red-600" name="Status"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        Form, Field, ErrorMessage
    },
    data() {
        return {
            hideShowLoader: false,
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
                this.hideShowLoader = true;
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
                        this.hideShowLoader = false;
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
                    this.hideShowLoader = false;
                });
            }
            // create credit card payment
            else {
                this.hideShowLoader = true;
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
                        this.hideShowLoader = false;
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
                    this.hideShowLoader = false;
                });
            }
        },
        // get data for edit credit card payment
        getSingleForEdit() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/creditCardPayments/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.date = new Date(response.data.data.payment_date);
                    this.amount = response.data.data.amount;
                    this.fromAccount = response.data.data.from_account;
                    this.toAccount = response.data.data.to_account;
                    this.status = response.data.data.status;
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
    }
}
</script>

<style scoped>
    .date-is-invalid .invalid-feedback {
        display: block;
    }
</style>

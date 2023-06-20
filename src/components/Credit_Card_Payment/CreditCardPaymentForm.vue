<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Credit Card Payment {{ breadCrumbMessage }}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
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
                                <form>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <datepicker inputFormat="yyyy-MM-dd" v-model="date" :locale="locale" :clearable="true" @change="dateIsValid"/>
                                                <div :class="{'date-is-invalid': invalidDate}">
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ invalidDate }}</strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <input type="number" id="input-username"  :class="{'form-control': true, 'is-invalid': invalidAmount}" step=".01" placeholder="Add Amount" v-model="amount" @keyup="amountIsValid">
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ invalidAmount }}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-two select-network-filter-height">
                                                <label class="form-control-label" for="input-username">From Account</label>
                                                <v-autocomplete :class="{'form-control': true, 'is-invalid': invalidFromAccount}" variant="outlined" :items="list" v-model="fromAccount" @change="fromAccountIsValid"></v-autocomplete>
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ invalidFromAccount }}</strong>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">To Account</label>
                                                <v-select :class="{'form-control': true, 'is-invalid': invalidToAccount}" :items="creditLines" v-model="toAccount" @change="toAccountIsValid"></v-select>
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ invalidToAccount }}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">Status</label>
                                                <v-select :class="{'form-control': true, 'is-invalid': invalidStatus}" :items="statusList" v-model="status" @change="statusIsValid"></v-select>
                                                <span class="invalid-feedback" role="alert">
                                                    <strong>{{ invalidStatus }}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" v-if="toggleComponent">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="createCreditCardPayment">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" v-else>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="updateCreditCardPayment">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
export default {
    components: {
        Datepicker,
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
    methods: {
        // date validation
        dateIsValid() {
            if(!this.date) {
                this.invalidDate = 'Date Can not be empty';
            }
            else {
                this.invalidDate = '';
            }
        },
        // amount validation
        amountIsValid() {
            if(!this.amount) {
                this.invalidAmount = 'Amount can not be empty';
            }
            else {
                this.invalidAmount = '';
            }
        },
        // from account validation
        fromAccountIsValid() {
            if(!this.fromAccount) {
                this.invalidFromAccount = 'From Account can not be empty';
            }
            else {
                this.invalidFromAccount = '';
            }
        },
        // to account validation
        toAccountIsValid() {
            if(!this.toAccount) {
                this.invalidToAccount = 'To Account can not be empty';
            }
            else {
                this.invalidToAccount = '';
            }
        },
        // status validation
        statusIsValid() {
            if(!this.status) {
                this.invalidStatus = 'Status can not be empty';
            }
            else {
                this.invalidStatus = '';
            }
        },
        // save and create credit card payment
        createCreditCardPayment() {
            this.dateIsValid();
            this.amountIsValid();
            this.fromAccountIsValid();
            this.toAccountIsValid();
            this.statusIsValid();
            if(!this.date || this.invalidDate || !this.amount || this.invalidAmount || !this.fromAccount || this.invalidFromAccount || !this.toAccount || this.invalidToAccount || !this.status || this.invalidStatus) {
                return false;
            }
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
                    console.log(error);
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
        // update credit card payment
        updateCreditCardPayment() {
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

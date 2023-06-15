<template>
    <div>
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
                                    <li class="breadcrumb-item active" aria-current="page">Credit Card Payment Create</li>
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
                                                <datepicker inputFormat="yyyy-MM-dd" v-model="date" :locale="locale" :clearable="true"/>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <input type="number" id="input-username"  :class="{'form-control': true}" step=".01" placeholder="Add Amount" v-model="amount">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-two">
                                                <label class="form-control-label" for="input-username">From Account</label>
                                                <v-autocomplete :class="{'form-control': true}" variant="outlined" :items="list" v-model="fromAccount"></v-autocomplete>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">To Account</label>
                                                <v-select :class="{'form-control': true}" :items="creditLines" v-model="toAccount"></v-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">Status</label>
                                                <v-select :class="{'form-control': true}" :items="statusList" v-model="status"></v-select>
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
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.toggleComponent = false;
        }
    },
    methods: {
        // save and create credit card payment
        createCreditCardPayment() {
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
        },
        // update credit card payment
        updateCreditCardPayment() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/creditCardPayments/' + this.$route.params.id, {
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

</style>

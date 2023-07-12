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
                                    <li class="breadcrumb-item active" aria-current="page">{{breadCrumbText}} IPM Chase (Revenue) Payments</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/bank_accounts/ipmchase/list" class="btn btn-lg btn-neutral btn_animated">View IPM Chase (Revenue) Payments Listing</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="saveIpmChasePayment" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <Field name="Date" v-model="date">
                                                    <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600':errors.Date }"></datepicker>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <Field type="number" id="input-username" name="Amount" :class="{'form-control': true , 'border-red-600':errors.Amount }" step=".01" placeholder="Add Amount" v-model="amount"></Field>
                                                <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true}" placeholder="Add Network" v-model="network_selected">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Transaction Type</label>
                                                <Field name="Status" v-model="status">
                                                    <v-select :class="{'form-control': true , 'border-red-600':errors.Status}" name="Transaction" :items="statusList" v-model="status"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Status">Transaction Type can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Type</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true}" placeholder="Type" v-model="type">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Balance</label>
                                                <input type="number" id="input-username"  :class="{'form-control': true}" placeholder="Balance" step=".01" v-model="balance">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Description</label>
                                                <Field name="Description" v-model="description">
                                                    <textarea :class="{'form-control': true , 'border-red-600':errors.Description}" name="Description" cols="30" rows="10" v-model="description"></textarea>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Description">Description can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" v-if="toggleElement">Save</button>
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" v-else>Update</button>
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
import { Field, Form } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
export default {
    components: {
        Datepicker,
        Field, 
        Form, 
    },
    data() {
        return {
            showLoader: false,
            date: '',
            amount: '',
            network_selected: '',
            description: '',
            type: '',
            status: '',
            balance: '',
            statusList: [
                {
                    title: 'CREDIT'
                },
                {
                    title: 'DEBIT'
                },
            ],
            breadCrumbText: 'Add',
            toggleElement: true,
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbText = 'Update';
            this.toggleElement = false;
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
                Status: yup.string().required(),
                Amount: yup.string().required(),
            });
        }
    },
    methods: {
        // save or update ipm chase payment
        saveIpmChasePayment() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', this.date);
            formData.append('amount', this.amount);
            formData.append('network', this.network_selected);
            formData.append('description', this.description);
            formData.append('transaction_type', this.status);
            formData.append('balance', this.balance);
            formData.append('type', this.type);
            !this.toggleElement && formData.append('_method', 'PUT');
            const url = this.toggleElement ? this.$api + '/bank_account/ipmChasePayments' : this.$api + '/bank_account/ipmChasePayments/' + this.$route.params.id;
            this.axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: this.toggleElement ? 'Ipm chased added' : 'Ipm chase updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.$router.push('/bank_accounts/ipmchase/list');
                }
            })
            .catch(error => {
                console.log(error);
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // get ipm chase payment data for update
        getDataForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/bank_account/ipmChasePayments/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data.data;
                    this.date = Data.date;
                    this.amount = Data.amount;
                    this.network_selected = Data.network;
                    this.description = Data.description;
                    this.type = Data.type;
                    this.status = Data.transaction_type;
                    this.balance = Data.balance;
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

<style scoped>

</style>

<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">{{breadCrumbText}} Fixed Monthly Cost</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/fixedMonthlyCost" class="btn btn-lg btn-neutral btn_animated">View Fixed Monthly Cost Listing</router-link>
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
                                <Form @submit="manageFixedMonthlyCost" :validation-schema="schema" v-slot="{ errors }"> <!--  -->
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <Field name="Date" v-model="date" :class="{'border-red-600': errors.date}">
                                                    <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :range="toggleElement"></datepicker>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Date">Date is a required field</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <Field name="Amount" type="number" step=".01" placeholder="Add Amount" v-model="amount" :class="{'form-control': true, 'border-red-600': errors.amount}"/>
                                                <ErrorMessage class="text-red-600" name="Amount"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">{{toggleElement ? 'Save' : 'Update'}}</button>
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
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        Form, Field, ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            breadCrumbText: 'Add',
            date: '',
            amount: '',
            toggleElement: true,
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.toggleElement = false;
            this.breadCrumbText = 'Update';
            this.getDataForEdit();
        }
    },
    computed: {
        schema() {
            return yup.object({
                Amount: yup.string().required(),
                Date: this.toggleElement ? yup.array().required() : yup.string().required(),
            });
        },
    },
    methods: {
        checkDate() {
            console.log(this.date)
        },
        // create and update fixed monthly cost
        manageFixedMonthlyCost() {
            console.log('sss')
            // update fixed monthly cost
            if(this.$route.params.id) {
                this.showLoader = true;
                this.axios.post(this.$api + '/accounting/fixedMonthlyCost/' + this.$route.params.id, {
                    _method: 'PUT',
                    date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/fixedMonthlyCost');
                        this.$toast.open({
                            message: 'Fixed monthly cost updated',
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
            // create fixed monthly cost
            else {
                this.showLoader = true;
                const dateRange = this.date[0].concat(",", this.date[1]);
                this.axios.post(this.$api + '/accounting/fixedMonthlyCost', {
                    date: dateRange,
                    amount: this.amount
    
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/fixedMonthlyCost');
                        this.$toast.open({
                            message: 'Fixed monthly cost created',
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
        // get data for edit details
        getDataForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/fixedMonthlyCost/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    console.log(getData);
                    this.date = getData.date;
                    this.amount = getData.amount;
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

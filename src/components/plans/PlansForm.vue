<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--3">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <router-link to="/settings/plan-management">Plans</router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">{{breadCrumbText}} Plan</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/plan-management" class="btn btn-lg btn-neutral btn_animated">View Plans</a>
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
                            <v-app>
                                <div class="col-12">
                                    <Form @submit="managePlan" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group date-picker-3">
                                                    <label class="form-control-label" for="input-username">Name</label>
                                                    <Field type="text" name="Name" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" placeholder="Name" v-model="name"/>
                                                    <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
                                                    <span class="text-red-600" v-if="backendErrorMessage">{{backendErrorMessage}}</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Amount</label>
                                                    <Field type="number" name="Amount" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group select-network-filter select-network-filter-height">
                                                    <label class="form-control-label" for="input-username">Interval</label>
                                                    <Field name="Interval" v-model="intervalSelected">
                                                        <v-select :class="{'form-control': true , 'border-red-600':errors.Interval}" :items="interval" item-value="key" v-model="intervalSelected"></v-select>
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Interval">Interval can not be empty</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Interval Count</label>
                                                    <Field type="number" id="input-username" name="intervalCount" :class="{'form-control': true , 'border-red-600':errors.intervalCount}" step=".01" placeholder="Interval count" v-model="intervalCount"/>
                                                    <span class="text-red-600" v-if="errors.intervalCount">Interval count can not be empty</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="custom-control custom-control-alternative custom-checkbox d-flex flex-column">
                                                    <div class="add-padding">
                                                        <input class="custom-control-input" type="checkbox" name="remember" id="customCheckLogin" v-model="hasTrial">
                                                        <label class="custom-control-label" for="customCheckLogin">
                                                            <span class="text-muted">Trial Period</span>
                                                        </label>
                                                    </div>
                                                    <input v-if="hasTrial" class="mt-2" type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Trial Period" v-model="trialPeriod"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary btn-lg btn_animated" v-if="toggleButton">Save</button>
                                                    <button type="submit" class="btn btn-primary btn-lg btn_animated" v-else>Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </v-app>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, Field
    },
    data() {
        return {
            showLoader: false,
            name: '',
            amount: '',
            intervalSelected: 'day',
            intervalCount: null,
            trialPeriod: 0,
            trialPeriodDuplicate: 0,
            hasTrial: false,
            toggleButton: true,
            breadCrumbText: 'Create',
            backendErrorMessage: '',
            interval: [
                {title: 'Day', key: 'day'},
                {title: 'Week', key: 'week'},
                {title: 'Month', key: 'month'},
                {title: 'Year', key: 'year'}
            ],
            
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbText = 'Edit';
            this.toggleButton = false;
        }
    },
    computed: {
        schema() {
            return yup.object({
                Name: yup.string().required(),
                Interval: yup.string().required(),
                Amount: yup.string().required(),
                intervalCount: yup.string().required(),
            });
        },
    },
    watch: {
        hasTrial(val) {
            !val ? this.trialPeriod = 0 : this.trialPeriod = this.trialPeriodDuplicate;
        }
    },
    methods: {
        // get data for edit plan
        getDataForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/plan/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data, 'response.data---edit');
                    const Data = response.data.data;
                    this.name = Data.name;
                    this.amount = Data.amount;
                    this.intervalSelected = Data.interval;
                    this.intervalCount = Data.interval_count;
                    this.trialPeriod = Data.trial_period_days;
                    this.trialPeriodDuplicate = Data.trial_period_days;
                    this.hasTrial = Data.trial_period_days == 0 ? false : true;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // update plan and create new plan
        managePlan() {
            // update plan
            if(this.$route.params.id) {
                console.log('update');
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('amount', this.amount);
                formData.append('interval', this.intervalSelected);
                formData.append('interval_count', this.intervalCount);
                formData.append('trial_period_days', this.trialPeriod);
                formData.append('_method', 'PUT');
                this.axios.post(this.$api + '/settings/plan/' + this.$route.params.id, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/plan-management')
                        this.$toast.open({
                            message: 'Plan created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
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
                    this.backendErrorMessage = '';
                });
            }
            // create new plan
            else {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('amount', this.amount);
                formData.append('interval', this.intervalSelected);
                formData.append('interval_count', this.intervalCount);
                formData.append('trial_period_days', this.trialPeriod);
                this.axios.post(this.$api + '/settings/plan', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/plan-management')
                        this.$toast.open({
                            message: 'Plan created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.backendErrorMessage = '';
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.backendErrorMessage = error.response.data.errors[0];
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                });
            }
        }
    }
}
</script>

<style scoped>
    .custom-control {
        width: 100%;
        padding: unset;
        justify-content: start;
    }
    .add-padding {
        padding-left: 1.75rem;
    }
</style>

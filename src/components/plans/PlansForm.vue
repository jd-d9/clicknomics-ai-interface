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
                                    <!-- <Form @submit="managePlan" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="row">
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group date-picker-3">
                                                    <label class="form-control-label" for="input-username">Name</label>
                                                    <Field type="text" name="Name" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Name}" step=".01" placeholder="Name" v-model="name"/>
                                                    <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
                                                    <span class="text-red-600" v-if="backendErrorMessage">{{backendErrorMessage}}</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Add Account Limit</label>
                                                    <Field type="number" id="input-username" name="addAccountLimit" :class="{'form-control': true , 'border-red-600':errors.addAccountLimit}" step=".01" placeholder="Interval Count" v-model="addAccountLimit"/>
                                                    <span class="text-red-600" v-if="errors.addAccountLimit">Add account limit can not be empty</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Network Account Limit</label>
                                                    <Field type="number" id="input-username" name="networkAccountLimit" :class="{'form-control': true , 'border-red-600':errors.networkAccountLimit}" step=".01" placeholder="Network Account Limit" v-model="networkAccountLimit"/>
                                                    <span class="text-red-600" v-if="errors.networkAccountLimit">Network account limit can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Description</label>
                                                    <Field name="Description" v-model="description">
                                                        <textarea cols="30" rows="6" name="Description" placeholder="Description" :class="{'form-control': true , 'border-red-600':errors.Description}" v-model="description"></textarea>
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Description">Description can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="multiple-fields mb-4" v-for="(data, index) in addMultipleField" :key="index">
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group select-network-filter select-network-filter-height">
                                                        <label class="form-control-label" for="input-username">Interval</label>
                                                        <Field name="Interval" v-model="data.intervalSelected">
                                                            <v-select :class="{'form-control': true , 'border-red-600':errors.Interval}" :items="interval" item-value="key" v-model="data.intervalSelected"></v-select>
                                                        </Field>
                                                        <span class="text-red-600" v-if="errors.Interval">Interval can not be empty</span>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Original Price</label>
                                                        <Field type="number" name="originalPrice" id="input-username" :class="{'form-control': true , 'border-red-600':errors.originalPrice}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.originalPrice"/>
                                                        <span class="text-red-600" v-if="errors.originalPrice">Original price can not be empty</span>
                                                    </div>
                                                    <v-btn class="add-style-to-close-button" v-if="index != 0" icon small @click="addMultipleField.splice(index, 1)">
                                                        <v-icon size="20">{{ 'mdi-close' }}</v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <label class="form-control-label add-translate" for="input-username">Discount Type :</label>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discountType">
                                                        <label class="form-check-label form-control-label" :for="'inlineRadioFlat' + index">Flat</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discountType">
                                                        <label class="form-check-label form-control-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                                                    </div>
                                                    <Field type="number" id="input-username" name="discountValue" :class="{'form-control': true, 'border-red-600':errors.discountValue}" :placeholder="data.discountType == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discountValue"/>
                                                    <span class="text-red-600" v-if="errors.discountValue">Discount can not be empty</span>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Amount</label>
                                                        <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <v-btn color="primary" class="mb-4" variant="outlined" @click="addMoreField">Add More</v-btn>
                                        <div class="row">
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
                                    </Form> -->
                                    <form @submit.prevent="managePlan">
                                        <div class="row">
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group date-picker-3">
                                                    <label class="form-control-label" for="input-username">Name</label>
                                                    <input type="text" name="Name" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Name" v-model="name"/>
                                                    <span class="text-red-600" v-if="backendErrorMessage">{{backendErrorMessage}}</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Add Account Limit</label>
                                                    <input type="number" id="input-username" name="addAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Interval Count" v-model="addAccountLimit"/>
                                                </div>
                                            </div>
                                            <div class="col-lg-4 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Network Account Limit</label>
                                                    <input type="number" id="input-username" name="networkAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Network Account Limit" v-model="networkAccountLimit"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-12 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Description</label>
                                                    <textarea cols="30" rows="6" name="Description" placeholder="Description" :class="{'form-control': true}" v-model="description"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="multiple-fields mb-4" v-for="(data, index) in addMultipleField" :key="index">
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group select-network-filter select-network-filter-height">
                                                        <label class="form-control-label" for="input-username">Interval</label>
                                                        <v-select :class="{'form-control': true}" :items="interval" item-value="key" v-model="data.intervalSelected"></v-select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Original Price</label>
                                                        <input type="number" name="originalPrice" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.originalPrice"/>
                                                    </div>
                                                    <v-btn class="add-style-to-close-button" v-if="index != 0" icon small @click="addMultipleField.splice(index, 1)">
                                                        <v-icon size="20">{{ 'mdi-close' }}</v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <label class="form-control-label add-translate" for="input-username">Discount Type :</label>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discountType">
                                                        <label class="form-check-label" :for="'inlineRadioFlat' + index">Flat</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discountType">
                                                        <label class="form-check-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                                                    </div>
                                                    <input type="number" id="input-username" name="discountValue" :class="{'form-control': true}" :placeholder="data.discountType == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discountValue"/>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Amount</label>
                                                        <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <v-btn color="primary" class="mb-4" variant="outlined" @click="addMoreField">Add More</v-btn>
                                        <div class="row">
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
                                    </form>
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
// import * as yup from 'yup';
// import { Form, Field } from 'vee-validate';
export default {
    // components: {
    //     Form, Field
    // },
    data() {
        return {
            showLoader: false,
            name: '',
            addMultipleField: [
                {
                    intervalSelected: 'month',
                    originalPrice: '',
                    discountType: 'flat',
                    discountValue: '',
                    amount: '',
                }
            ],
            description: '',
            addAccountLimit: '',
            networkAccountLimit: '',
            trialPeriod: 0,
            trialPeriodDuplicate: 0,
            hasTrial: false,
            toggleButton: true,
            breadCrumbText: 'Create',
            backendErrorMessage: '',
            interval: [
                {title: 'Month', key: 'month'},
                {title: '3 Month', key: '3month'},
                {title: '6 Month', key: '6month'},
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
    // computed: {
    //     schema() {
    //         return yup.object({
    //             Name: yup.string().required(),
    //             Interval: yup.string().required(),
    //             originalPrice: yup.string().required(),
    //             Amount: yup.string().required(),
    //             discountValue: yup.string().required(),
    //             addAccountLimit: yup.string().required(),
    //             networkAccountLimit: yup.string().required(),
    //             Description: yup.string().required(),
    //         });
    //     },
    // },
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
                    this.originalPrice = Data.amount;
                    this.intervalSelected = Data.interval;
                    this.addAccountLimit = Data.interval_count;
                    this.addMultipleField = Data.planData;
                    this.trialPeriod = Data.trial_period_days;
                    this.trialPeriodDuplicate = Data.trial_period_days;
                    this.networkAccountLimit = Data.user_limit;
                    this.hasTrial = Data.trial_period_days == 0 ? false : true;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // calculate amount using price and discount
        calculateAmount(ind) {
            if(this.addMultipleField[ind].discountType == 'flat') {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].originalPrice - this.addMultipleField[ind].discountValue;
            }
            else {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].originalPrice - ((this.addMultipleField[ind].originalPrice * this.addMultipleField[ind].discountValue)/100);
            }
        },
        // add more fields
        addMoreField() {
            this.addMultipleField.push({
                intervalSelected: 'month',
                originalPrice: '',
                discountType: 'flat',
                discountValue: '',
                amount: '',
            });
        },
        // update plan and create new plan
        managePlan() {
            // update plan
            if(this.$route.params.id) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('addAccountLimit', this.addAccountLimit);
                formData.append('trialPeriodDays', this.trialPeriod);
                formData.append('networkAccountLimit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('planData', JSON.stringify(this.addMultipleField));
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
                            message: 'Plan updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.backendErrorMessage = '';
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.backendErrorMessage = error.response.data.message;
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                });
            }
            // create new plan
            else {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('addAccountLimit', this.addAccountLimit);
                formData.append('trialPeriodDays', this.trialPeriod);
                formData.append('networkAccountLimit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('planData', JSON.stringify(this.addMultipleField));
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
                    this.backendErrorMessage = error.response.data.message;
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
    .form-check-input:checked {
        background-color: #005eb3;
        border-color: #005eb3 !important;
        box-shadow: none;
    }
    .add-translate {
        transform: translateY(-4px);
        margin-right: 10px;
    }
    .form-check-inline .form-check-input {
        border-color: #b9bbbc;
    }
    .form-check-label, .form-check-inline .form-check-input {
        cursor: pointer;
        user-select: none;
    }
    .multiple-fields {
        border-radius: 12px;
        border: 1px solid #b9bbbc;
        padding: 20px;
    }
</style>

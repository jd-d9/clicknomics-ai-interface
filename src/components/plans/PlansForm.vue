<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs class="form_breadcume">
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <router-link to="/settings/plan-management" class="d-flex align-center">
                                <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                                <span>Plan Management</span>
                            </router-link>
                            
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>{{breadCrumbText}} Plan</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/settings/plan-management" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{breadCrumbText}} Plan
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" />  
                        <form @submit.prevent="managePlan">
                            <v-row class="mb-4">
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Name</label>
                                    <input type="text" name="Name" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Name" v-model="name"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Google Account Limit</label>
                                    <input type="number" id="input-username" name="googleAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Google Account Limit" v-model="googleAccountLimit"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Microsoft Account Limit</label>
                                    <input type="number" id="input-username" name="microsoftAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Microsoft Account Limit" v-model="microsoftAccountLimit"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Network Account Limit</label>
                                    <input type="number" id="input-username" name="networkAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Network Account Limit" v-model="networkAccountLimit"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Description</label>
                                    <jodit-editor :class="{'form-control': true}" v-model="description" v-if="toggleEditor"/>
                                    <!-- <textarea rows="3" name="Description" placeholder="Description" :class="{'form-control': true}" v-model="description"></textarea> -->
                                </v-col>
                            </v-row>

                            <div v-for="(data, index) in addMultipleField" :key="index" class="border bg-green-lighten-5 pa-5 mb-4">
                                <v-row>
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label">Interval</label>
                                        <v-select :class="{'form-control': true}" :items="intervalData" item-value="key" v-model="data.interval"></v-select>
                                    </v-col>
    
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label">Original Price(In Dollar)</label>
                                        <input type="number" name="original_price" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.original_price"/>
                                    </v-col>
    
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label mr-3">Discount Type</label>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" :name="'inlineRadioOptions' + index" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discount_type" @change="calculateAmount(index)">
                                            <label class="form-check-label" :for="'inlineRadioFlat' + index">Flat</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" :name="'inlineRadioOptions'  + index" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discount_type" @change="calculateAmount(index)">
                                            <label class="form-check-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                                        </div>
                                        <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                                            <input type="number" id="input-username" name="discount_value" :class="{'form-control': true}" :placeholder="data.discount_type == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discount_value" :max="data.discount_type != 'flat' && 100"/>
                                        </v-col>
                                    </v-col>
    
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label">Amount</label>
                                        <input type="text" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                                    </v-col>
    
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label">Trial Period</label>
                                        <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Trial Period" v-model="data.trial_period_days"/>
                                    </v-col>
    
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label class="form-control-label d-block hide-nbsp">&nbsp;</label>
                                        <v-btn class="mx-2 bg-blue-lighten-4" variant="text" icon @click="addMoreField">
                                            <v-icon color="blue-darken-2">
                                                mdi-plus
                                            </v-icon>
                                            <v-tooltip activator="parent" location="top">Add More</v-tooltip>
                                        </v-btn>
    
                                        <v-btn class="mx-2 bg-red-lighten-4" variant="text" icon v-if="index != 0" @click="addMultipleField.splice(index, 1)">
                                            <v-icon color="red-darken-4">
                                                mdi-delete-empty
                                            </v-icon>
                                            <v-tooltip activator="parent" location="top">Remove Item</v-tooltip>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                            </v-col>

                            <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" lg="12">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" v-if="toggleButton">Save</v-btn>    
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-arrow-up-bold" v-else>Update</v-btn>    
                            </v-col>
                        </form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- <Form @submit="managePlan" :validation-schema="schema" v-slot="{ errors }">
            <div class="row">
                <div class="col-lg-4 py-0">
                    <div class="form-group date-picker-3">
                        <label class="form-control-label">Name</label>
                        <Field type="text" name="Name" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Name}" step=".01" placeholder="Name" v-model="name"/>
                        <span class="text-red-600" v-if="errors.Name">Name is a required field</span>
                    </div>
                </div>
                <div class="col-lg-4 py-0">
                    <div class="form-group">
                        <label class="form-control-label">Google Account Limit</label>
                        <Field type="number" id="input-username" name="googleAccountLimit" :class="{'form-control': true , 'border-red-600':errors.googleAccountLimit}" step=".01" placeholder="Google Add Account" v-model="googleAccountLimit"/>
                        <span class="text-red-600" v-if="errors.googleAccountLimit">Google account limit is a required field</span>
                    </div>
                </div>
                <div class="col-lg-4 py-0">
                    <div class="form-group">
                        <label class="form-control-label">Microsoft Account Limit</label>
                        <Field type="number" id="input-username" name="microsoftAccountLimit" :class="{'form-control': true , 'border-red-600':errors.microsoftAccountLimit}" step=".01" placeholder="Microsoft Add Account" v-model="microsoftAccountLimit"/>
                        <span class="text-red-600" v-if="errors.microsoftAccountLimit">Microsoft account limit is a required field</span>
                    </div>
                </div>
                <div class="col-lg-4 py-0">
                    <div class="form-group">
                        <label class="form-control-label">Network Account Limit</label>
                        <Field type="number" id="input-username" name="networkAccountLimit" :class="{'form-control': true , 'border-red-600':errors.networkAccountLimit}" step=".01" placeholder="Network Account Limit" v-model="networkAccountLimit"/>
                        <span class="text-red-600" v-if="errors.networkAccountLimit">Network account limit is a required field</span>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 py-0">
                    <div class="form-group">
                        <label class="form-control-label">Description</label>
                        <Field name="Description" v-model="description">
                            <textarea cols="30" rows="6" name="Description" placeholder="Description" :class="{'form-control': true , 'border-red-600':errors.Description}" v-model="description"></textarea>
                        </Field>
                        <span class="text-red-600" v-if="errors.Description">Description is a required field</span>
                    </div>
                </div>
            </div>
            <div class="multiple-fields mb-4" v-for="(data, index) in addMultipleField" :key="index">
                <div class="row">
                    <div class="col-lg-6 py-0">
                        <div class="form-group select-network-filter select-network-filter-height">
                            <label class="form-control-label">Interval</label>
                            <Field name="Interval" v-model="data.intervalSelected">
                                <v-select :class="{'form-control': true , 'border-red-600':errors.Interval}" :items="intervalData" item-value="key" v-model="data.interval"></v-select>
                            </Field>
                            <span class="text-red-600" v-if="errors.Interval">Interval is a required field</span>
                        </div>
                    </div>
                    <div class="col-lg-6 py-0">
                        <div class="form-group">
                            <label class="form-control-label">Original Price</label>
                            <Field type="number" name="original_price" id="input-username" :class="{'form-control': true , 'border-red-600':errors.original_price}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.original_price"/>
                            <span class="text-red-600" v-if="errors.original_price">Original price is a required field</span>
                        </div>
                        <v-btn class="add-style-to-close-button" v-if="index != 0" icon small @click="addMultipleField.splice(index, 1)">
                            <v-icon size="20">{{ 'mdi-close' }}</v-icon>
                        </v-btn>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 py-0">
                        <label class="form-control-label add-translate">Discount Type :</label>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discount_type">
                            <label class="form-check-label form-control-label" :for="'inlineRadioFlat' + index">Flat</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discount_type">
                            <label class="form-check-label form-control-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                        </div>
                        <Field type="number" id="input-username" name="discount_value" :class="{'form-control': true, 'border-red-600':errors.discount_value}" :placeholder="data.discount_type == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discount_value"/>
                        <span class="text-red-600" v-if="errors.discount_value">Discount is a required field</span>
                    </div>
                    <div class="col-lg-6 py-0">
                        <div class="form-group">
                            <label class="form-control-label">Amount</label>
                            <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 py-0">
                        <label class="form-control-label">Trial Period</label>
                        <input class="mt-2" type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Trial Period" v-model="data.trial_period_days"/>
                    </div>
                </div>
            </div>
            <v-btn color="primary" class="mb-4" variant="outlined" @click="addMoreField">Add More</v-btn>
            <div class="row mt-4">
                <div class="col-lg-6 py-0">
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-lg btn_animated" v-if="toggleButton">Save</button>
                        <button type="submit" class="btn btn-primary btn-lg btn_animated" v-else>Update</button>
                    </div>
                </div>
            </div>
        </Form> -->    
    </div>
</template>

<script>
// import * as yup from 'yup';
// import { Form, Field } from 'vee-validate';
import axios from '@axios';
import { JoditEditor } from 'jodit-vue';
import 'jodit/build/jodit.min.css';
export default {
    components: {
        // Form, 
        // Field,
        JoditEditor,
    },
    watch: {
        description(val) {
            console.log(val, '-- val --')
        }
    },
    data() {
        return {
            message: {},
            showLoader: false,
            name: '',
            addMultipleField: [
                {
                    interval: 'month',
                    original_price: '',
                    discount_type: 'flat',
                    discount_value: '',
                    trial_period_days: 0,
                    amount: this.$filters.toCurrency(0),
                }
            ],
            description: '',
            googleAccountLimit: '',
            microsoftAccountLimit: '',
            networkAccountLimit: '',
            toggleButton: true,
            breadCrumbText: 'Create',
            intervalData: [
                {title: 'Monthly', key: 'month'},
                {title: '3 Month', key: '3month'},
                {title: '6 Month', key: '6month'},
                {title: 'Yearly', key: 'year'}
            ],
            backendErrorMessage: '',
            multipleErrors: [],
            toggleEditor: true,
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbText = 'Edit';
            this.toggleButton = false;
            this.toggleEditor = false;
        }
    },
    // computed: {
    //     schema() {
    //         return yup.object({
    //             Name: yup.string().required(),
    //             Interval: yup.string().required(),
    //             original_price: yup.string().required(),
    //             Amount: yup.string().required(),
    //             discount_value: yup.string().required(),
    //             googleAccountLimit: yup.string().required(),
    //             microsoftAccountLimit: yup.string().required(),
    //             networkAccountLimit: yup.string().required(),
    //             Description: yup.string().required(),
    //         });
    //     },
    // },
    methods: {
        // get data for edit plan
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/plan/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data, 'response.data---edit');
                    const Data = response.data.data;
                    this.addMultipleField = Data.plan_detail;
                    this.name = Data.name;
                    this.googleAccountLimit = Data.google_account_limit;
                    this.microsoftAccountLimit = Data.microsoft_account_limit;
                    this.networkAccountLimit = Data.network_account_limit;
                    setTimeout(() => {
                        this.toggleEditor = true;
                        this.description = Data.description;
                    }, 100)
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
        // calculate amount using price and discount
        calculateAmount(ind) {
            if(this.addMultipleField[ind].discount_type == 'flat') {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].original_price - this.addMultipleField[ind].discount_value;
                this.addMultipleField[ind].amount = this.$filters.toCurrency(this.addMultipleField[ind].amount);
            }
            else {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].original_price - ((this.addMultipleField[ind].original_price * this.addMultipleField[ind].discount_value)/100);
                this.addMultipleField[ind].amount = this.$filters.toCurrency(this.addMultipleField[ind].amount);
            }
        },
        // set original price
        setOriginalPrice(e) {
            return e.target.value = this.$filters.toCurrency(e.target.value);
        },
        // add more fields
        addMoreField() {
            this.addMultipleField.push({
                interval: 'month',
                original_price: '',
                discount_type: 'flat',
                discount_value: '',
                trial_period_days: 0,
                amount: this.$filters.toCurrency(0),
            });
        },
        // update plan and create new plan
        managePlan() {
            // update plan
            if(this.$route.params.id) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('google_account_limit', this.googleAccountLimit);
                formData.append('microsoft_account_limit', this.microsoftAccountLimit);
                formData.append('network_account_limit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('plan', JSON.stringify(this.addMultipleField));
                formData.append('_method', 'PUT');
                axios.post(this.$api + '/settings/plan/' + this.$route.params.id, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/plan-management')
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
            // create new plan
            else {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('google_account_limit', this.googleAccountLimit);
                formData.append('microsoft_account_limit', this.microsoftAccountLimit);
                formData.append('network_account_limit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('plan', JSON.stringify(this.addMultipleField));
                axios.post(this.$api + '/settings/plan', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/plan-management')
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
        }
    }
}
</script>

<style>
    .input-amount {
        position: relative;
    }
    .input-amount::before {
        content: "$";
        font-size: 18px;
        position: absolute;
        top: 200%;
        left: 5px;
    }
</style>

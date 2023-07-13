<template>
    <div class="bg-default main-content-height">
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
                            <router-link to="/settings/plan-management" class="btn btn-lg btn-neutral btn_animated">View Plans</router-link>
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
                                                            <v-select :class="{'form-control': true , 'border-red-600':errors.Interval}" :items="intervalData" item-value="key" v-model="data.interval"></v-select>
                                                        </Field>
                                                        <span class="text-red-600" v-if="errors.Interval">Interval can not be empty</span>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Original Price</label>
                                                        <Field type="number" name="original_price" id="input-username" :class="{'form-control': true , 'border-red-600':errors.original_price}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.original_price"/>
                                                        <span class="text-red-600" v-if="errors.original_price">Original price can not be empty</span>
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
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discount_type">
                                                        <label class="form-check-label form-control-label" :for="'inlineRadioFlat' + index">Flat</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discount_type">
                                                        <label class="form-check-label form-control-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                                                    </div>
                                                    <Field type="number" id="input-username" name="discount_value" :class="{'form-control': true, 'border-red-600':errors.discount_value}" :placeholder="data.discount_type == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discount_value"/>
                                                    <span class="text-red-600" v-if="errors.discount_value">Discount can not be empty</span>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Amount</label>
                                                        <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <label class="form-control-label" for="input-username">Trial Period</label>
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
                                                    <input type="number" id="input-username" name="addAccountLimit" :class="{'form-control': true}" step=".01" placeholder="Add Account Limit" v-model="addAccountLimit"/>
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
                                                        <v-select :class="{'form-control': true}" :items="intervalData" item-value="key" v-model="data.interval"></v-select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Original Price</label>
                                                        <input type="number" name="original_price" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Add Original Price" @keyup="calculateAmount(index)" v-model="data.original_price"/>
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
                                                        <input class="form-check-input" type="radio" :name="'inlineRadioOptions' + index" :id="'inlineRadioFlat' + index" value="flat" v-model="data.discount_type" @change="calculateAmount(index)">
                                                        <label class="form-check-label" :for="'inlineRadioFlat' + index">Flat</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" :name="'inlineRadioOptions'  + index" :id="'inlineRadioPercentage' + index" value="percentage" v-model="data.discount_type" @change="calculateAmount(index)">
                                                        <label class="form-check-label" :for="'inlineRadioPercentage' + index">Percentage</label>
                                                    </div>
                                                    <input type="number" id="input-username" name="discount_value" :class="{'form-control': true}" :placeholder="data.discount_type == 'flat' ? 'Flat Discount' : 'Percentage Discount'" @keyup="calculateAmount(index)" v-model="data.discount_value" :max="data.discount_type != 'flat' && 100"/>
                                                </div>
                                                <div class="col-lg-6 py-0">
                                                    <div class="form-group">
                                                        <label class="form-control-label" for="input-username">Amount</label>
                                                        <input type="number" id="input-username" :class="{'form-control': true}" step=".01" placeholder="Amount" v-model="data.amount" disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-lg-6 py-0">
                                                    <label class="form-control-label" for="input-username">Trial Period</label>
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
                    interval: 'month',
                    original_price: '',
                    discount_type: 'flat',
                    discount_value: '',
                    trial_period_days: 0,
                    amount: 0,
                }
            ],
            description: '',
            addAccountLimit: '',
            networkAccountLimit: '',
            toggleButton: true,
            breadCrumbText: 'Create',
            backendErrorMessage: '',
            intervalData: [
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
    //             original_price: yup.string().required(),
    //             Amount: yup.string().required(),
    //             discount_value: yup.string().required(),
    //             addAccountLimit: yup.string().required(),
    //             networkAccountLimit: yup.string().required(),
    //             Description: yup.string().required(),
    //         });
    //     },
    // },
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
                    this.addMultipleField = Data.plan_data;
                    this.name = Data.name;
                    this.addAccountLimit = Data.add_account_limit;
                    this.networkAccountLimit = Data.network_account_limit;
                    this.description = Data.description;
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
            if(this.addMultipleField[ind].discount_type == 'flat') {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].original_price - this.addMultipleField[ind].discount_value;
            }
            else {
                this.addMultipleField[ind].amount = this.addMultipleField[ind].original_price - ((this.addMultipleField[ind].original_price * this.addMultipleField[ind].discount_value)/100);
            }
        },
        // add more fields
        addMoreField() {
            this.addMultipleField.push({
                interval: 'month',
                original_price: '',
                discount_type: 'flat',
                discount_value: '',
                trial_period_days: 0,
                amount: 0,
            });
        },
        // update plan and create new plan
        managePlan() {
            // update plan
            if(this.$route.params.id) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('name', this.name);
                formData.append('add_account_limit', this.addAccountLimit);
                formData.append('network_account_limit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('plan', JSON.stringify(this.addMultipleField));
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
                formData.append('add_account_limit', this.addAccountLimit);
                formData.append('network_account_limit', this.networkAccountLimit);
                formData.append('description', this.description);
                formData.append('plan', JSON.stringify(this.addMultipleField));
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

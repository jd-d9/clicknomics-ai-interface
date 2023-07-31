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
                        <router-link to="" @click="backButtonDynamicPath" class="d-flex align-center">
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>{{ breadCrumbText }} Payments</span>
                        </router-link>

                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>{{toggleElement ? 'Create' : 'Edit'}}</span>
                        <v-spacer />
                        <v-btn to="" @click.prevent="backButtonDynamicPath" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{toggleElement ? 'Create' : 'Edit'}} {{ breadCrumbText }} Payments
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form @submit="createPayment" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Name</label>
                                    <Field type="text" name="name" :class="{'form-control': true, 'border-red-600': errors.name}" placeholder="Card Name" v-model="name"/>
                                    <span class="text-red-600" v-if="errors.name">Card name is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Type</label>
                                    <Field name="type" v-model="type">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600': errors.type}" name="type" :items="cardType" v-model="type" placeholder="Select To Card Type"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.type">Card type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Last Four Digit</label>
                                    <Field type="number" maxlength='5' id="input-username" name="lastFourDigit" :class="{'form-control': true, 'border-red-600': errors.lastFourDigit}" placeholder="Card Last Four Digit" v-model="lastFourDigit"/>
                                    <span class="text-red-600" v-if="errors.lastFourDigit">Card last four digit is a required field and must be 4 digits.</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Expiration</label>
                                    <Field  type="text" :class="{'form-control': true , 'border-red-600': errors.cardExpiration}" maxlength='5' placeholder="MM / YY" v-model="cardExpiration" @keydown="removeSlash" @keyup="addSlash" @blur="populateDate" name="cardExpiration"/>
                                    <span class="text-red-600" v-if="errors.cardExpiration">Card expiration is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card CVV</label>
                                    <input type="number" maxlength='5' id="input-username" :class="{'form-control': true}" placeholder="Card CVV" v-model="cardCvv"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Security</label>
                                    <input type="number" :class="{'form-control': true}" placeholder="Security" v-model="security"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Status</label>
                                    <v-select :class="{'form-control autocomplete': true}" :items="cardStatusList" v-model="cardStatus" placeholder="Select Card Status"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Billing Address</label>
                                    <input type="text" :class="{'form-control': true}" placeholder="Billing Address" v-model="address"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Notes</label>
                                    <textarea :class="{'form-control': true}" name="Notes" rows="5" v-model="notes"></textarea>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">{{toggleElement ? 'Save' : 'Update'}}</v-btn>
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
import axios from '@axios';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, 
        Field
    },
    data() {
        return{
            message: {},
            showLoader: false,
            breadCrumbText: '',
            name: '',
            type: '',
            lastFourDigit: '',
            cardExpiration: '',
            cardCvv: '',
            security: '',
            address: '',
            notes: '',
            backendErrorMessage: '',
            multipleErrors: [],
            cardType: [
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
                }
            ],
            cardStatus: 'Active',
            cardStatusList: [
                {
                    title: 'Active'
                },
                {
                    title: 'InActive'
                },
                {
                    title: 'Ready'
                },
                {
                    title: 'Frozen'
                },
                {
                    title: 'Destroyed'
                },
            ],
            monthAndSlashRegex: /^\d\d \/ $/, // regex to match "MM / "
            monthRegex: /^\d\d$/, // regex to match "MM",
            el_monthSelect: '#monthSelect',
            el_yearSelect: '#yearSelect',
            toggleElement: true,
        }
    },
    computed: {
        schema() {
            return yup.object({
                cardExpiration: yup.string().required(),
                lastFourDigit: yup.string().required().min(4).max(4),
                name: yup.string().required(),
                type: yup.string().required(),
            });
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.dynamicBreadCrumb();
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.toggleElement = false;
        }
    },
    methods: {
        // redirect to perticular portion based on card type
        redirectUrl() {
            if(this.type == 'RM AMEX Plum Card') {
                this.$router.push('/payment_methods/rm-amex-plum-card');
            }
            if(this.type == 'IPM AMEX Plum Card') {
                this.$router.push('/payment_methods/ipm-amex-plum-card');
            }
            if(this.type == 'IPM Divvy Card') {
                this.$router.push('/payment_methods/ipm-divvy-card');
            }
            if(this.type == 'IPM Chase Ink Card') {
                this.$router.push('/payment_methods/ipm-chase-ink-card');
            }
        },
        // create new payments
        createPayment() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('name', this.name);
            formData.append('card_type', this.type);
            formData.append('card_last_four_digit', this.lastFourDigit);
            formData.append('card_expiration', this.cardExpiration);
            formData.append('card_cvv', this.cardCvv ? this.cardCvv : '');
            formData.append('card_security', this.security ? this.security : '');
            formData.append('card_status', this.cardStatus);
            formData.append('billing_address', this.address ? this.address : '');
            formData.append('notes', this.notes ? this.notes : '');
            !this.toggleElement && formData.append('_method', 'PUT');
            const url = this.toggleElement ? this.$api + '/paymentMethod/paymentCardsOrganization' : this.$api + '/paymentMethod/paymentCardsOrganization/' + this.$route.params.id;
            axios.post(url, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.redirectUrl();
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        },
        // get Data for edit payment
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/paymentMethod/paymentCardsOrganization/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    if(getData) {
                        this.name = getData.name;
                        this.type = getData.card_type;
                        this.lastFourDigit = getData.card_last_four_digit;
                        this.cardExpiration = getData.card_expiration;
                        this.cardCvv = getData.card_cvv;
                        this.security = getData.card_security;
                        this.address = getData.billing_address;
                        this.notes = getData.notes;
                        this.cardStatus = getData.card_status;
                    }
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
        // remove slash
        removeSlash(e) {
            var isMonthAndSlashEntered = this.monthAndSlashRegex.exec(e.target.value);
            if (isMonthAndSlashEntered && e.key === 'Backspace') {
                e.target.value = e.target.value.slice(0, -3);
            }
        },
        // adding slash
        addSlash(event) {
            var code = event.keyCode;
            var allowedKeys = [8];
            if (allowedKeys.indexOf(code) !== -1) {
                return;
            }
            event.target.value = event.target.value.replace(
                /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
            ).replace(
                /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
            ).replace(
                /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
            ).replace(
                /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
            ).replace(
                /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
            ).replace(
                /[^\d\\/]|^[\\/]*$/g, '' // To allow only digits and `/`
            ).replace(
                /\/\//g, '/' // Prevent entering more than 1 `/`
            );
        },
        // populate date
        populateDate(e) {
            var month, year;

            if (e.target.value.length == 7) {
                month = parseInt(e.target.value.slice(0, -5));
                year = "20" + e.target.value.slice(5);

                if (this.checkMonth(month)) {
                    window.$(this.el_monthSelect).val(month);
                } else {
                    window.$(this.el_monthSelect).val(0);
                }

                if (this.checkYear(year)) {
                    window.$(this.el_yearSelect).val(year);
                } else {
                    window.$(this.el_yearSelect).val(0);
                }

            }
        },
        // check month
        checkMonth(month) {
            if (month <= 12) {
                var monthSelectOptions = this.getSelectOptions(window.$(this.el_monthSelect));
                month = month.toString();
                if (monthSelectOptions.includes(month)) {
                    return true;
                }
            }
        },
        // check year
        checkYear(year) {
            var yearSelectOptions = this.getSelectOptions(window.$(this.el_yearSelect));
            if (yearSelectOptions.includes(year)) {
                return true;
            }
        },
        // get selected option
        getSelectOptions(select) {
            var options = select.find('option');
            var optionValues = [];
            for (var i = 0; i < options.length; i++) {
                optionValues[i] = options[i].value;
            }
            return optionValues;
        },
        // set dyanamic breadcrumb messages
        dynamicBreadCrumb() {
            this.breadCrumbText = localStorage.getItem('breadCrumbMessage');
        },
        // back button dynamic path
        backButtonDynamicPath() {
            const breadCrumb = localStorage.getItem('breadCrumbMessage');
            if(breadCrumb == 'RM AMEX Plum Card') {
                this.$router.push('/payment_methods/rm-amex-plum-card');
            }
            if(breadCrumb == 'IPM AMEX Plum Card') {
                this.$router.push('/payment_methods/ipm-amex-plum-card');
            }
            if(breadCrumb == 'IPM Divvy Card') {
                this.$router.push('/payment_methods/ipm-divvy-card');
            }
            if(breadCrumb == 'IPM Chase Ink Card') {
                this.$router.push('/payment_methods/ipm-chase-ink-card');
            }
        }
    }
}
</script>
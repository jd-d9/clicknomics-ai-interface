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
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Manual Network</span>

                        <v-spacer />
                        <v-btn to="/networks/manualNetworks/list" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated">
                            View Manual Network Record
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            Add Manual Network
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form @submit="saveManualNetworkMetrics" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="date" :class="{'border-red-600': errors.Date}">
                                        <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600': errors.Date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Network</label>
                                    <Field name="Network" v-model="networkSelected">
                                        <v-select :class="{'form-control': true , 'border-red-600':errors.Network}" name="Network" :items="network" item-value="key" v-model="networkSelected"></v-select> <!-- item-value="key" -->
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Network">Network can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Amount</label>
                                    <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Conversions</label>
                                    <Field type="number" id="input-username" name="Conversions" :class="{'form-control': true , 'border-red-600':errors.Conversions}" step=".01" placeholder="Add Conversions" v-model="conversions"/>
                                    <span class="text-red-600" v-if="errors.Conversions">Conversions can not be empty</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" v-if="toggleElement">Save</v-btn>    
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-arrow-up-bold" v-else>Update</v-btn>    
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
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    // props: ['network'],
    components: {
        Datepicker,
        Form, Field
    },
    data() {
        return {
            message: {},
            showLoader: false,
            date: '',
            amount: '',
            networkSelected: '',
            conversions: '',
            network: [],
            toggleElement: true,
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getAllNetworks();
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.toggleElement = false;
        }
        // this.$nextTick(() => {
        //     window.$('.mx-datepicker input').addClass('datepicker-input');
        // })
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
                Network: yup.string().required(),
                Amount: yup.string().required(),
                Conversions: yup.string().required(),
            });
        },
    },
    methods: {
        // manage manual network metrics
        saveManualNetworkMetrics() {
            // update manual network metrics
            if(this.$route.params.id) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('date', moment(this.date).format('YYYY-MM-DD'));
                formData.append('amount', this.amount);
                formData.append('network_id', this.networkSelected);
                formData.append('conversions', this.conversions);
                formData.append('_method', 'PUT');
                axios.post(this.$api + '/network/manualNetworksMetrics/' + this.$route.params.id, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                        this.$router.push('/networks/manualNetworks/list');
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
            }
            // create manual network metrics
            else {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('date', moment(this.date).format('YYYY-MM-DD'));
                formData.append('amount', this.amount);
                formData.append('network_id', this.networkSelected);
                formData.append('conversions', this.conversions);
                axios.post(this.$api + '/network/manualNetworksMetrics', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                        this.$router.push('/networks/manualNetworks/list');
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
            }
        },
        // get data for edit
        getDataForEdit() {
            this.showLoader = true;
            axios.get(this.$api + '/network/manualNetworksMetrics', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data.data.find((val) => {
                        return val.id == this.$route.params.id;
                    })
                    this.date = getData.date;
                    this.amount = getData.amount;
                    this.networkSelected = getData.manual_network.id;
                    this.conversions = getData.conversions;
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
        // get all networks and set it in select network
        getAllNetworks() {
            this.showLoader = true;
            axios.get(this.$api + '/network/getAllNetwork', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    getData.forEach((val) => {
                        this.network.push(
                            {
                                key: val.id,
                                title: val.network
                            }
                        )
                    })
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
        }
    }
}
</script>

<style scoped>

</style>

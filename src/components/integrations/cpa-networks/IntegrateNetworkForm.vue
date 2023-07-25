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
                        <span>Integrate CPA Network</span>

                        <v-spacer />
                        <v-btn to="/settings/networks" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            Integrate CPA Network
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" /> 

                        <Form @submit="integrateCpaNetwork" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Name Your Network</label>
                                    <Field type="text" id="input-username" name="network" :class="{'form-control': true, 'border-red-600': errors.network}" placeholder="Name Your Network" v-model.trim="network_name"/>
                                    <span class="text-red-600" v-if="errors.network">Your network is a required field</span>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label" style="position:relative; width:100%">login URL for Your Network / Domain
                                        <div class="help-tip" style="right:10px; top:45px;">
                                            <div><p style="font-size:12px">Login URL for your network or domain when Affise is selected <br/> The Login URL needs to be https://api-networkdomain.affise.com/  </p></div>
                                        </div>
                                    </label>
                                    <Field type="text" id="input-username" name="url" :class="{'form-control': true, 'border-red-600': errors.url}" @blur="checkUrl" placeholder="login URL for Your Network / Domain" v-model="login_url"/>
                                    <span class="text-red-600" v-if="errors.url">URL is a required field</span>
                                </v-col>    

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Network Platform</label>
                                    <Field name="role" v-model="network_selected">
                                        <select :class="{'form-control': true, 'border-red-600': errors.role}" name="role" placeholder="Select Role" v-model="network_selected">
                                            <option value="">Select Network</option>
                                            <option value="cake">Cake</option>
                                            <option value="hasoffers">Tune (Hasoffers)</option>
                                            <option value="everflow">Everflow</option>
                                            <option value="hitpath">Hitpath</option>
                                            <option value="clickbooth">ClickBooth</option>
                                            <option value="clickdealer">ClickDealer</option>
                                            <option value="w4">W4</option>
                                            <option value="affise">Affise</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.role">Network platform is a required field</span>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model="email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">API KEY</label>
                                    <Field type="text" id="input-username" name="api" :class="{'form-control': true, 'border-red-600': errors.api}" placeholder="Api Key" v-model="api_key"/>
                                    <span class="text-red-600" v-if="errors.api">Api key is a required field</span>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Affiliate ID / Network ID / Domain & Script name</label>
                                    <Field type="text" id="input-username" name="affiliatedid" :class="{'form-control': true, 'border-red-600': errors.affiliatedid}" placeholder="Affiliate ID / Network ID / Domain & Script name" v-model="affiliate_id"/>
                                    <span class="text-red-600" v-if="errors.affiliatedid">Affiliate id is a required field</span>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Fetch Previous Records From</label>
                                    <Field name="date" v-model="date" :class="{'border-red-600': errors.date}">
                                        <datepicker name="date" v-model:value="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.date">Date is a required field</span>
                                </v-col> 

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
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
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        Form, 
        Field, 
        ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            network_name: '',
            login_url: '',
            network_selected: '',
            api_key: '',
            affiliate_id: '',
            email: '',
            linkMore: false,
            search: '',
            dataMetrics: [],
            headers: [
                { title: 'Account Name', align: 'start', sortable: false, key: 'first_name' },
                { title: 'Campaign', key: 'offer_name' },
                { title: 'Price', key: 'price'},
                { title: 'Clicks ', key: 'clicks' },
                { title: 'Conversion ', key: 'conversions' },
                { title: 'Conversion Percentage ', key: 'conversion_rate' },
                { title: 'Revenue', key: 'revenue' },
                { title: 'EPC', key: 'epc' },
                { title: 'Events', key: 'events' },
            ],
            dateRange: [
                {
                    text: 'Today'
                },
                {
                    text: 'Last Month'
                },
                {
                    text: 'One Year'
                },
            ],
            reportRange: 'One Year',
            date: '',
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    computed: {
        schema() {
            return yup.object({
                role: yup.string().required(),
                url: yup.string().required(),
                network: yup.string().required(),
                date: yup.string().required(),
                affiliatedid: yup.string().required(),
                api: yup.string().required(),
                Email: yup.string().required().email(),
            });
        },
    },
    methods: {
        // check url
        checkUrl() {
            this.showLoader = true;
            this.axios.post(this.$api + '/settings/networks/checkNetworkUrl', {
                url: this.login_url,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.backendErrorMessage = '';
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
                this.showLoader = false;
            });
        },
        // integrate cpa network
        integrateCpaNetwork() {
            this.showLoader = true;
            this.axios.post(this.$api + '/settings/networks', {
                name: this.network_name,
                email: this.email,
                network: this.network_selected,
                api_key: this.api_key,
                affiliate_id: this.affiliate_id,
                login_url: this.login_url,
                fetch_report_date: moment(this.date).format('YYYY-MM-DD')
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/networks');
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
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
    }
}
</script>

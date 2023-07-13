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
                                    <li class="breadcrumb-item active" aria-current="page">Integrate CPA Network</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/networks" class="btn btn-lg btn-neutral btn_animated">View CPA Networks</router-link>
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
                                <Form @submit="integrateCpaNetwork" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Name Your Network</label>
                                                <Field type="text" name="network" id="input-username" :class="{'form-control': true, 'border-red-600': errors.network}" placeholder="Name" v-model="network_name"/>
                                                <span class="text-red-600" v-if="errors.network">Name your network can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Add the login URL for your network or domain</label>
                                                <div class="help-tip">
                                                    <div><p>Login URL for your network or domain when Affise is selected <br/> The Login URL needs to be https://api-networkdomain.affise.com/  </p></div>
                                                </div>
                                                <Field type="text" name="url" id="input-username" :class="{'form-control': true, 'border-red-600': errors.url}" @blur="checkUrl" placeholder="Add the login URL for your network or domain" v-model="login_url"/>
                                                <span class="text-red-600" v-if="backendValidationMessage">{{backendValidationMessage}}</span>
                                                <span class="text-red-600" v-if="errors.url && !backendValidationMessage">URL can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network Platform</label>
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
                                                <span class="text-red-600" v-if="errors.role">Network platform can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Email</label>
                                                <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model="email"/>
                                                <ErrorMessage class="text-red-600" name="Email"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">API KEY</label>
                                                <Field type="text" id="input-username" name="api" :class="{'form-control': true, 'border-red-600': errors.api}" placeholder="Name" v-model="api_key"/>
                                                <span class="text-red-600" v-if="errors.api">Api key can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Affiliate ID / Network ID / Domain and Script name </label>
                                                <Field type="text" id="input-username" name="affiliatedid" :class="{'form-control': true, 'border-red-600': errors.affiliatedid}" placeholder="Name" v-model="affiliate_id"/>
                                                <span class="text-red-600" v-if="errors.affiliatedid">Affiliate id can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Fetch Previous Records From</label>
                                                <Field name="date" v-model="date" :class="{'border-red-600': errors.date}">
                                                    <datepicker name="date" v-model:value="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.date">Date can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Integrate</button>
                                                <!-- <button type="button" class="btn btn-primary btn-lg btn_animated" @click="linkMore = !linkMore" v-if="report.length > 0">Back</button> -->
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
            backendValidationMessage: '',
        }
    },
    mounted() {

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
                    this.backendValidationMessage = '';
                    this.showLoader = false;
                }
            })
            .catch(error => {
                this.backendValidationMessage = error.response.data.errors[0];
                console.log(error);
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
                        message: 'CPA netwok integrated',
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
        },
    }
}
</script>

<style scoped>

</style>

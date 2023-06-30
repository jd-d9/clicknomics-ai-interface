<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--3">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Manual Network</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/networks/manualNetworks/list" class="btn btn-lg btn-neutral btn_animated">View Manual Network Record</a>
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
                        <!-- <div class="card-header">
                            <h3 class="mb-0 float-left">Manual Network</h3>
                            <div class="float-right">
                                <a href="/networks/manualNetworks" class="btn btn-lg btn-neutral btn_animated">View Manual Network Listing</a>
                            </div>
                        </div> -->
                        <div class="card-body">
                            <v-app>
                                <div class="col-12">
                                    <Form @submit="saveManualNetworkMetrics" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group date-picker-3">
                                                    <label class="form-control-label" for="input-username">Date</label>
                                                    <Field name="Date" v-model="date">
                                                        <datepicker :class="{'border-red-600':errors.Date}" v-model="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                                    </Field>
                                                    <!-- <span class="text-red-600" v-if="errors.Date">Date can not be empty</span> -->
                                                    <ErrorMessage class="text-red-600" name="Date"/>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group select-network-filter select-network-filter-height">
                                                    <label class="form-control-label" for="input-username">Network</label>
                                                    <Field name="Network" v-model="networkSelected">
                                                        <v-select :class="{'form-control': true , 'border-red-600':errors.Network}" :items="network" item-value="key" v-model="networkSelected"></v-select> <!-- item-value="key" -->
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Network">Network can not be empty</span>
                                                    <!-- <ErrorMessage class="text-red-600" name="Date"/> -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Amount</label>
                                                    <Field type="number" name="Amount" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                                    <!-- <ErrorMessage class="text-red-600" name="Amount"/> -->
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Conversions</label>
                                                    <Field type="number" id="input-username" name="Conversions" :class="{'form-control': true , 'border-red-600':errors.Conversions}" step=".01" placeholder="Add Conversions" v-model="conversions"/>
                                                    <span class="text-red-600" v-if="errors.Conversions">Conversions can not be empty</span>
                                                    <!-- <ErrorMessage class="text-red-600" name="Conversions"/> -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
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
import { Form, Field,ErrorMessage } from 'vee-validate';
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
export default {
    // props: ['network'],
    components: {
        Datepicker,
        Form, Field, ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            date: '',
            amount: '',
            networkSelected: '',
            conversions: '',
            network: [
                {
                    key: 2,
                    title: 'ROIcollective'
                }
            ],
            
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.$('.mx-datepicker input').addClass('datepicker-input');
        })
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
        // create manual network metrics
        saveManualNetworkMetrics() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', moment(this.date).format('YYYY-MM-DD'));
            formData.append('amount', this.amount);
            formData.append('network_id', this.networkSelected);
            formData.append('conversions', this.conversions);
            this.axios.post(this.$api + '/network/manualNetworksMetrics', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Network metric added',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.date = '';
                    this.amount = '';
                    this.networkSelected = '';
                    this.conversions = '';
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

            
            // this.showLoader = true;
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': window.csrf_token
            // };
            // axios.post(`saveManualNetworkMetrics`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //         this.showLoader = false;
            //         this.message = {
            //             text: response.data.message,
            //             type: 'success',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //         if(response.data.success) {
            //             window.location.reload();
            //         }
            //     }else {
            //         this.showLoader = false;
            //         this.message = {
            //             text: 'Something Went Wrong!',
            //             type: 'error',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //     }
            // }).catch(error => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // })
        },
    }
}
</script>

<style scoped>

</style>

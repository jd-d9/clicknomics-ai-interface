<template>
    <div>
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
                                    <li class="breadcrumb-item active" aria-current="page">Manual Network</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/networks/manualNetworks/list" class="btn btn-lg btn-neutral btn_animated">View Manual Network Record</router-link>
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
                                    <Form @submit="saveManualNetworkMetrics" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Date</label>
                                                    <Field name="Date" v-model="date">
                                                        <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group select-network-filter select-network-filter-height">
                                                    <label class="form-control-label" for="input-username">Network</label>
                                                    <Field name="Network" v-model="networkSelected">
                                                        <v-select :class="{'form-control': true , 'border-red-600':errors.Network}" name="Network" :items="network" item-value="key" v-model="networkSelected"></v-select> <!-- item-value="key" -->
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Network">Network can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Amount</label>
                                                    <Field type="number" name="Amount" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                                    <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Conversions</label>
                                                    <Field type="number" id="input-username" name="Conversions" :class="{'form-control': true , 'border-red-600':errors.Conversions}" step=".01" placeholder="Add Conversions" v-model="conversions"/>
                                                    <span class="text-red-600" v-if="errors.Conversions">Conversions can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <button type="submit" v-if="toggleElement" class="btn btn-primary btn-lg btn_animated">Save</button>
                                                    <button type="submit" v-else class="btn btn-primary btn-lg btn_animated">Update</button>
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
            showLoader: false,
            date: '',
            amount: '',
            networkSelected: '',
            conversions: '',
            network: [],
            toggleElement: true,
        }
    },
    mounted() {
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
                this.axios.post(this.$api + '/network/manualNetworksMetrics/' + this.$route.params.id, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Network metric updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.$router.push('/networks/manualNetworks/list');
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
            // create manual network metrics
            else {
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
                        this.$router.push('/networks/manualNetworks/list');
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
        // get data for edit
        getDataForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/network/manualNetworksMetrics', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // get all networks and set it in select network
        getAllNetworks() {
            this.showLoader = true;
            this.axios.get(this.$api + '/network/getAllNetwork', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        }
    }
}
</script>

<style scoped>

</style>

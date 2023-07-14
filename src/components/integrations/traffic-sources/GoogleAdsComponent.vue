<template>
    <div class="bg-default main-content-height">
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
                                    <li class="breadcrumb-item active" aria-current="page">Google Ads Integration</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button type="button" class="btn btn-lg btn-neutral btn_animated" @click.prevent="getAccessToken">
                                <div>
                                    <!-- <span class="btn-inner--icon"><i class="ni ni-app"></i> </span> -->
                                    <img src="/assets/img/icons/google-ads.svg" class="add-width">
                                    <span class="btn-inner--text">Sync Google Accounts</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="customers" :single-expand="singleExpand" item-key="customer_id" class="table-hover-class elevation-1" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.selectable.name}}</td>
                                            <td>{{item.selectable.customer_id}}</td>
                                            <td>{{item.selectable.manager_account ? item.selectable.manager_account :  '-'}}</td>
                                            <td>
                                                <router-link to="" @click="showEditedModal(item.selectable.id, item.selectable.currency_conversion_check)">{{item.selectable.currency_conversion_check == '1' ? 'Enabled' : 'Disabled'}}</router-link>
                                            </td>
                                            <td>
                                                <button class="disable-button" @click.prevent="deleteCustomer(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                                    <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                    </v-app>
                </div>
                <div class="col" v-if="permissions.view != '1' && !showLoader">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="metricsModel">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title text-center">Customer Metrics</h4>
                    </div>
                    <div class="modal-body">
                         <div class="table-responsive">
                            <table class="table align-items-center" v-if="paginatedResults.length > 0">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Clicks</th>
                                        <th scope="col">Cost </th>
                                        <th scope="col">Click Through Rate</th>
                                        <th scope="col">Impressions</th>
                                        <th scope="col">Cost Per Click</th>
                                        <th scope="col">Conversions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row , index) in paginatedResults" :key="index">
                                        <th>
                                            {{row.campaign.name ? row.campaign.name : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.clicks ? row.metrics.clicks : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.costMicros ? parseFloat(row.metrics.costMicros / 1000000).toFixed(2)  : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.ctr ? (row.metrics.ctr * 100).toFixed(2) : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.impressions ? row.metrics.impressions : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.averageCpc ? parseFloat(row.metrics.averageCpc / 1000000).toFixed(2)  : '-'}}
                                        </th>
                                        <th>
                                            {{row.metrics.conversions ? row.metrics.conversions : '0'}}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table align-items-center" v-else>
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Clicks</th>
                                        <th scope="col">Cost </th>
                                        <th scope="col">Click Through Rate</th>
                                        <th scope="col">Impressions</th>
                                        <th scope="col">Cost Per Click</th>
                                        <th scope="col">Conversions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center"><td colspan="7">
                                    <strong>No data for this query.</strong></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-lg btn_animated" @click.prevent="closeModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
         <!-- edited modal  -->
        <div class="modal fade" id="updateEditedData" tabindex="-1" role="dialog" aria-labelledby="updateEditedDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Enable/Disable Currency Converstion (USD)</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeUpdateModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <Form @submit="updateCurrencyConverstionCheck" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Currency Converstion (USD)</label>
                                            <v-app>
                                                <Field name="Currency" v-model="editedModal.currency_conversion_check">
                                                    <v-radio-group class="monitor_main" v-model="editedModal.currency_conversion_check" row :class="{'form-control': true, 'border-red-600':errors.Currency}" >
                                                        <v-radio class="monitor" label="Enabled" value="1"></v-radio>
                                                        <v-radio class="monitor" label="Disabled" value="0"></v-radio>
                                                    </v-radio-group>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Currency">Currency converstion can not be empty</span>
                                            </v-app>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
</template>

<script>
import * as yup from 'yup';
import { Field, Form } from 'vee-validate';
export default {
    // props: ['customerAccounts'],
    components: {
        Field, 
        Form, 
    },
    data() {
        return {
            showLoader: false,
            customers: [],
            paginatedResults: [],
            singleExpand: true,
            googleHeaders: [
                { title: 'Account Name',  key: 'name' },
                { title: 'Account ID',  key: 'customer_id' },
                { title: 'Manager Name', align: 'start', sortable: false, key: 'manager_account' },
                { title: 'Currency Conversion (USD)', key: 'currency_conversion_check' },
                { title: 'Action',  key: '', sortable: false},
            ],
            itemsPerPage: -1,
            editedModal: {
                id: '',
                currency_conversion_check: '',
            },
            permissions: {},
        }
    },
    mounted() {
        this.getCustomerAccounts();
    },
    computed: {
        schema() {
            return yup.object({
                Currency: yup.string().required(),
            });
        },
    },
    methods: {
        // open and close modal
        openUpdateModal() {
            window.$('#updateEditedData').modal('show');
        },
        closeUpdateModal() {
            window.$('#updateEditedData').modal('hide');
        },
        openModal() {
            window.$('#metricsModel').modal('show');
        },
        closeModal() {
            window.$('#metricsModel').modal('hide');
        },
        // get access token
        getAccessToken() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/googleAd/getAccessToken', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log('response', response)
                    this.$toast.open({
                        message: 'Account accessed',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    window.location.href = response.data.redirectUrl;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // get all customer data
        getCustomerAccounts() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/googleAds', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.customers = Data.data;
                    this.permissions = Data.permission;
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
                console.log(error);
                this.showLoader = false;
            });
        },
        // delete selected customer
        deleteCustomer(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/settings/googleAds/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Account deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getCustomerAccounts();
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    console.log(error);
                    this.showLoader = false;
                });
            }
        },
        // get data for edit and set it in modal
        showEditedModal(id, currency_conversion_check) {
            console.log(id, currency_conversion_check);
            this.editedModal.id = id;
            this.editedModal.currency_conversion_check = currency_conversion_check;
            this.openUpdateModal();
        },
        // update currency conversion
        updateCurrencyConverstionCheck() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.editedModal.id);
            formData.append('currency_conversion_check', this.editedModal.currency_conversion_check);
            this.axios.post(this.$api + '/settings/googleAd/googleCurrencyConverstionCheck', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Currency conversion updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.closeUpdateModal();
                    this.getCustomerAccounts();
                    this.showLoader = false;
                }
            })
            .catch(error => {
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                console.log(error);
                this.showLoader = false;
            });
        },
        // get customer metrics
        getCustomerMetrics(id, manager_id , token_id , is_Manager) {
            if(is_Manager == '0') {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('reportType', 'customer');
                formData.append('impressions', 'metrics.impressions');
                formData.append('clicks', 'metrics.clicks');
                formData.append('ctr', 'metrics.ctr');
                formData.append('cost_micros', 'metrics.cost_micros');
                formData.append('average_cpc', 'metrics.average_cpc');
                formData.append('reportRange', 'LAST_7_DAYS');
                formData.append('customerId', id);
                formData.append('manager_id', manager_id);
                formData.append('token_id', token_id);
                this.axios.post(this.$api + '/settings/googleAds', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data saved',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        window.$('#metricsModel').modal({backdrop: 'static', keyboard: false});
                        this.openModal();
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showLoader = false;
                });
            } else {
                this.$toast.open({
                    message: 'Its A Manager Account',
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
            }
        },
    }
}
</script>

<style scoped>
.add-width {
    width: 15px
}
</style>

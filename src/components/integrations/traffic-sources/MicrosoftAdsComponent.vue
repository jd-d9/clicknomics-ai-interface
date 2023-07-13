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
                                    <li class="breadcrumb-item active" aria-current="page">Microsoft Ads Integration List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button type="button" class="btn  btn-lg btn-neutral btn_animated" @click.prevent="getAccessToken">
                                <div>
                                    <!-- <span class="btn-inner--icon"><i class="ni ni-app"></i> </span> -->
                                    <img src="/assets/img/icons/microsoft.svg" class="add-width">
                                    <span class="btn-inner--text">Sync Microsoft Accounts</span>
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
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="microsoftHeaders" :items="customers" :single-expand="singleExpand" item-key="manager_account" class="table-hover-class elevation-1" :itemsPerPage="itemsPerPage">    <!--  :expanded.sync="microsoftExpanded"  -->
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.selectable.account_name}}</td>
                                            <td>{{item.selectable.account_id}}</td>
                                            <td>{{item.selectable.account_number}}</td>
                                            <td>{{item.selectable.manager_account}}</td>
                                            <td :style="{color: item.selectable.status === 'Acccount Synced Successfully' ? 'green' : 'red'}">{{item.selectable.status}}</td>
                                            <td>
                                                <router-link to="" @click="showEditedModal(item.selectable.id, item.selectable.currency_conversion_check)">{{item.selectable.currency_conversion_check == '1' ? 'Enabled' : 'Disabled'}}</router-link>
                                            </td>
                                            <td>
                                                <button class="disable-button" @click.prevent="deleteCustomerAccount(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
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
                <div class="modal-content" v-if="campaignsMetrics.length === 0">
                    <div class="modal-header">
                        <h4 class="modal-title text-center">Campaigns</h4>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table align-items-center" v-if="campaigns.length > 0">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">DailyBudget </th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row , index) in campaigns" :key="index">
                                        <th>
                                            {{row.id ? row.id : '-'}}
                                        </th>
                                        <th>
                                            {{row.name ? row.name : '-'}}
                                        </th>
                                        <th>
                                            {{row.dailyBudget ? row.dailyBudget : '-'}}
                                        </th>
                                        <th>
                                            {{row.status ? row.status : '-'}}
                                        </th>
                                        <th>
                                            <button type="button" class="btn-icon-clipboard px-3 py-1" @click="viewMetrics(row.id, row.accountId, row.customerId, row.bing_o_auth_tokens_id)" data-clipboard-text="fat-add" title="" data-original-title="Copy to clipboard">
                                                <div>
                                                    <i class="ni ni-fat-add"></i>
                                                    <span>View Metrics</span>
                                                </div>
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table align-items-center" v-else>
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">DailyBudget </th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center"><td colspan="5">
                                    <strong>No data for this query.</strong></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-lg btn_animated" data-dismiss="modal">Close</button>
                    </div>
                </div>
                <div class="modal-content" v-else>
                     <div class="modal-header">
                        <h4 class="modal-title text-center">Report Metrics</h4>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table align-items-center">
                                <thead class="thead-light">
                                    <tr>
                                        <th scope="col">CampaignId</th>
                                        <th scope="col">CampaignName</th>
                                        <th scope="col">Clicks </th>
                                        <th scope="col">Ctr</th>
                                        <th scope="col">Impressions</th>
                                        <th scope="col">Spend</th>
                                        <th scope="col">AverageCpc</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row , index) in campaignsMetrics" :key="index">
                                        <th>
                                            {{row.CampaignId ? row.CampaignId : '-'}}
                                        </th>
                                        <th>
                                            {{row.CampaignName ? row.CampaignName : '-'}}
                                        </th>
                                        <th>
                                            {{row.Clicks}}
                                        </th>
                                        <th>
                                            {{row.Ctr}}
                                        </th>
                                        <th>
                                            {{row.Impressions}}
                                        </th>
                                        <th>
                                            {{row.Spend}}
                                        </th>
                                        <th>
                                            {{row.AverageCpc}}
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-lg btn_animated" @click.prevent="resetMetricsTable">Back</button>
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
                                                    <v-radio-group name="Currency" class="monitor_main" v-model="editedModal.currency_conversion_check" row :class="{'form-control': true, 'border-red-600':errors.Currency}" >
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
    // props: ['customerAccounts', 'error'],
    components: {
        Field, 
        Form, 
    },
    data() {
        return {
            showLoader: false,
            customers: [],
            campaigns: [],
            campaignsMetrics: [],
            singleExpand: true,
            microsoftHeaders: [
                { title: 'Account Name',  key: 'account_name' },
                { title: 'Account ID',  key: 'account_id' },
                { title: 'Account Number',  key: 'account_number' },
                { title: 'Manager Name', align: 'start', sortable: false, key: 'manager_account' },
                { title: 'Account 2FA Sync', key: 'status' },
                { title: 'Currency Conversion (USD)', key: 'currency_conversion_check' },
                { title: 'Action',  key: '', sortable: false },
            ],
            expanded: [],
            microsoftExpanded: [],
            itemsPerPage: -1,
            editedModal: {
                id: '',
                currency_conversion_check: '',
            },
            permissions: {},
        }
    },
    computed: {
        schema() {
            return yup.object({
                Currency: yup.string().required(),
            });
        },
    },
    mounted() {
        this.getBingCustomerAccounts();
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
            this.axios.get(this.$api + '/settings/microsoftAds/getAccessToken', {
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
        // get bing customer account
        getBingCustomerAccounts() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/microsoftAds', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    console.log(Data, '-- Data --')
                    this.customers = Data.result;
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
        // delete customer account
        deleteCustomerAccount(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/settings/microsoftAds/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getBingCustomerAccounts();
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
        // get data for edit and set it in modal
        showEditedModal(id, currency_conversion_check) {
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
            this.axios.post(this.$api + '/settings/microsoftAd/microsoftCurrencyConverstionCheck', formData, {
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
                    this.getBingCustomerAccounts();
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
        // view matrics
        viewMetrics(campaignId, accountId, customerId, token_id) {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('campaignId', campaignId);
            formData.append('accountId', accountId);
            formData.append('customerId', customerId);
            formData.append('token_id', token_id);
            this.axios.post(this.$api + '/settings/googleAds/getAccessToken', formData, {
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
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // reset matrics table
        resetMetricsTable() {
            this.campaignsMetrics = [];
        },
    }
}
</script>

<style scoped>
.add-width {
    width: 15px;
}
</style>

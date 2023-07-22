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
                        <span>Google Ads Integration</span>

                        <v-spacer />
                        <v-btn @click.prevent="getAccessToken" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="!restrictUser">
                            <img src="/assets/img/icons/google-ads.svg" class="add-width mr-2">
                            <span class="btn-inner--text">Sync Google Accounts</span>
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Google Ads Integration List
                        </v-card-title>

                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="customers" :single-expand="singleExpand" item-key="customer_id" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name}}
                            </template>
                            <template v-slot:[`item.customer_id`]="{ item }">
                                {{item.selectable.customer_id}}
                            </template>
                            <template v-slot:[`item.manager_account`]="{ item }">
                                {{item.selectable.manager_account ? item.selectable.manager_account :  '-'}}
                            </template>
                            <template v-slot:[`item.currency_conversion_check`]="{ item }">
                                <router-link to="" @click="showEditedModal(item.selectable.id, item.selectable.currency_conversion_check)">{{item.selectable.currency_conversion_check == '1' ? 'Enabled' : 'Disabled'}}</router-link>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteCustomer(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>                                                            
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

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
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Enable/Disable Currency Converstion (USD)</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeUpdateModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="updateCurrencyConverstionCheck" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    <label class="form-control-label" for="input-username">Currency Converstion (USD)</label>
                                    <Field name="Currency" v-model="editedModal.currency_conversion_check">
                                        <v-radio-group inline v-model="editedModal.currency_conversion_check">
                                            <v-radio class="monitor me-3" label="Enabled" value="1"></v-radio>
                                            <v-radio class="monitor" label="Disabled" value="0"></v-radio>
                                        </v-radio-group>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Currency">Currency converstion can not be empty</span>
                                </v-col>
                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeUpdateModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
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
                { title: 'Action',  key: 'action', sortable: false},
            ],
            itemsPerPage: -1,
            editedModal: {
                id: '',
                currency_conversion_check: '',
            },
            permissions: {},
            backendErrorMessage: '',
            multipleErrors: [],
            restrictUser: true,
        }
    },
    mounted() {
        this.getCustomerAccounts();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    window.location.href = response.data.redirectUrl;
                }else {
                    this.$toast.open({
                        message: response.data.message,
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
                    this.restrictUser = Data.restrict_user;
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
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getCustomerAccounts();
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
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.closeUpdateModal();
                    this.getCustomerAccounts();
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
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
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        window.$('#metricsModel').modal({backdrop: 'static', keyboard: false});
                        this.openModal();
                        this.showLoader = false;
                    }else {
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
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
    width: 15px;
}
</style>

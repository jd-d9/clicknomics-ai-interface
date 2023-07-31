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
                        <span>Microsoft Ads Integration</span>

                        <v-spacer />
                        <v-btn @click.prevent="fetchAccessToken" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="!restrictUser">
                            <img src="/assets/img/icons/microsoft.svg" class="add-width mr-2">
                            <span class="btn-inner--text">Sync Microsoft Accounts</span>
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Microsoft Ads Integration List
                        </v-card-title>

                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="microsoftHeaders" :items="customers" :single-expand="singleExpand" item-key="manager_account" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">    <!--  :expanded.sync="microsoftExpanded"  -->
                            <template v-slot:[`item.account_name`]="{ item }">
                                {{item.selectable.account_name ? item.selectable.account_name : '-'}}
                            </template>
                            <template v-slot:[`item.account_id`]="{ item }">
                                {{item.selectable.account_id ? item.selectable.account_id : '-'}}
                            </template>
                            <template v-slot:[`item.account_number`]="{ item }">
                                {{item.selectable.account_number ? item.selectable.account_number : '-'}}
                            </template>
                            <template v-slot:[`item.manager_account`]="{ item }">
                                {{item.selectable.manager_account ? item.selectable.manager_account : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <div :style="{color: item.selectable.status === 'Acccount Synced Successfully' ? 'green' : 'red'}">
                                    {{item.selectable.status ? item.selectable.status : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.currency_conversion_check`]="{ item }">
                                <router-link to="" @click="showEditedModal(item.selectable.id, item.selectable.currency_conversion_check)">{{item.selectable.currency_conversion_check == '1' ? 'Enabled' : 'Disabled'}}</router-link>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteCustomerAccount(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
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
                                    <span class="text-red-600" v-if="errors.Currency">Currency converstion is a required field</span>
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
import axios from '@axios';
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
            message: {},
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
                { title: 'Action',  key: 'action', sortable: false },
            ],
            expanded: [],
            microsoftExpanded: [],
            itemsPerPage: -1,
            editedModal: {
                id: '',
                currency_conversion_check: '',
            },
            permissions: {},
            restrictUser: true,
            backendErrorMessage: '',
            multipleErrors: [],
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // open and close modal
        openUpdateModal() {
            window.$('#updateEditedData').modal('show');
        },
        closeUpdateModal() {
            window.$('#updateEditedData').modal('hide');
        },
        // get access token
        fetchAccessToken() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/microsoftAd/getAccessToken', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                    window.location.href = response.data.redirectUrl;
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
        // get bing customer account
        getBingCustomerAccounts() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/microsoftAds', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    console.log(Data, '-- Data --')
                    this.customers = Data.result;
                    this.permissions = Data.permission;
                    this.restrictUser = Data.restrict_user;
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
        // delete customer account
        deleteCustomerAccount(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/settings/microsoftAds/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.getBingCustomerAccounts();
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
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
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
            axios.post(this.$api + '/settings/microsoftAd/microsoftCurrencyConverstionCheck', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
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
                    this.closeUpdateModal();
                    this.getBingCustomerAccounts();
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

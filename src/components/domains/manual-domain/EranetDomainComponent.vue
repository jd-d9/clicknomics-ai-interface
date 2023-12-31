<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Eranet Domains</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" v-if="showImportIcon" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden && showImportIcon">
                            <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>

                            <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn @click="createActivity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Eranet Domains List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col cols="12" lg="7" md="7" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.account`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.account ? item.selectable.account : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.status ? item.selectable.status : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.domain`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.domain ? item.selectable.domain : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.auto_renewals`]="{ item }">
                                <v-switch color="primary" disabled :model-value="item.selectable.auto_renewals == 'Active' ? true : false"></v-switch>
                            </template>
                            <template v-slot:[`item.expire_date`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{format_date(item.selectable.expire_date)}}
                                </div>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
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

        <!-- Start Import CSV Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Eranet Domains</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form @submit.prevent="uploadCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-import">Import</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeImportCsvModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End Import CSV Modal -->
        <div class="modal fade" id="viewDetail" tabindex="-1" role="dialog" aria-labelledby="viewDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report</h5>
                        <button type="button" class="close" aria-label="Close" data-dismiss="modal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{$filters.toCurrency(viewModalDetail.amount)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Description :</span> {{viewModalDetail.description}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Create & Update RM AMEX Plum Activity-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{activityType}} Eranet Domains</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>

                    <Form @submit="saveEranetDomainData" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Account (email)</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true , 'border-red-600':errors.Email }" v-model="activity.account"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain Name</label>
                                    <Field type="text" id="input-username" name="Name" :class="{'form-control': true , 'border-red-600':errors.Name }" v-model="activity.domain_name"/>
                                    <span class="text-red-600" v-if="errors.Name">Domain name is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain Creation Date</label>
                                    <Field v-model="activity.creation_date" name="createDate">
                                        <datepicker name="createDate" :class="{'border-red-600':errors.createDate }" v-model:value="activity.creation_date" valueType="format" format="YYYY-MM-DD"></datepicker>                                                
                                    </Field>
                                    <span class="text-red-600" v-if="errors.createDate">Domain creation date is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain Expiration Date</label>
                                    <Field name="expDate" v-model="activity.expiration_date">
                                        <datepicker name="expDate" :class="{'border-red-600':errors.expDate }" v-model:value="activity.expiration_date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.expDate">Domain expiration date is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain Auto Renew Status</label>
                                    <Field name="renewStatus" v-model="activity.auto_renew_status">
                                        <v-select name="renewStatus" :class="{'form-control autocomplete': true , 'border-red-600':errors.renewStatus }" :items="accountStatusList" v-model="activity.auto_renew_status"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.renewStatus">Domain auto renew status is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Status</label>
                                    <Field name="Status" v-model="activity.status">
                                        <v-select name="Status" :class="{'form-control autocomplete': true , 'border-red-600':errors.Status}" :items="accountStatusList" v-model="activity.status"></v-select>
                                    </Field>
                                    <ErrorMessage class="text-red-600" name="Status"/>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="reset" class="text-none bg-blue-darken-4 btn_animated mr-5 ml--4" id="reset_button" append-icon="mdi-content-save" style="opacity: 0">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
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
import { Field, Form, ErrorMessage } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        Field,
        Form, 
        ErrorMessage
    },
    data() {
        return {
            message: {},
            abc: true,
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Account (email)', key: 'account'},
                { title: 'Status', align: 'start', sortable: true, key: 'status' },
                { title: 'Domain Name', key: 'domain' },
                { title: 'Domain Auto Renew Status', key: 'auto_renewals', align: 'center' },
                { title: 'Domain Expiration', key: 'expire_date' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            file: '',
            selected: [],
            viewModalDetail: {},
            itemsPerPage: -1,
            accountTypeList: [
                {
                    title: 'Page'
                },
                {
                    title: 'M365'
                },
                {
                    title: 'Other'
                },
            ],
            activity: {
                id: '',
                type : '',
                account : '',
                status : '',
                domain_name : '',
                auto_renew_status : '',
                expiration_date : '',
                creation_date : '',
                notes: ''
            },
            selectedFile: '',
            activityType: 'Create',
            accountStatusList: [
                {
                    title: 'Active'
                },
                {
                    title: 'InActive'
                },
            ],
            showImportIcon: true,
            permissions: {},
            backendErrorMessage: '',
            multipleErrors: [],
            isHidden: false,
        }
    },
    filters: {
        dateCell (value) {
            let dt = new Date(value)

            return dt.getDate()
        },
        date (val) {
            return val ? val.toDateString() : ''
        }
    },
    computed: {
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
                Name: yup.string().required(),
                createDate: yup.string().required(),
                expDate: yup.string().required(),
                renewStatus: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    mounted() {
        this.getDomainList();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // manage modal open close
        openImportCsvModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeImportCsvModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null);
            window.$('#exampleModalCenter').modal('hide');
        },
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#createUpdateData').modal('hide');
        },
        // get domain listing
        getDomainList() {
            this.showLoader = true;
            axios.get(this.$api + '/domains/eranetDomains', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
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
        // get data for edit
        edit(id) {
            const result = this.dataMetrics.find((val) => {
                return val.id == id
            });
            this.activityType = 'Update'
            this.activity.id = id;
            this.activity.account = result.account;
            this.activity.status = result.status;
            this.activity.domain_name = result.domain
            this.activity.auto_renew_status = result.auto_renewals;
            this.activity.expiration_date = moment(result.expire_date).format('YYYY-MM-DD');
            this.activity.creation_date = moment(result.creation_date).format('YYYY-MM-DD');
            // this.activity.notes = result.notes ? result.notes : '';
            this.openModal();
        },
        // create new domain
        createActivity() {
            this.activityType = 'Create';
            this.activity.id = '';
            this.activity.type = '';
            this.activity.account = '';
            this.activity.status = '';
            this.activity.domain_name = '';
            this.activity.auto_renew_status = '';
            this.activity.expiration_date = '';
            this.activity.creation_date = '';
            setTimeout(() => {
                document.getElementById('reset_button').click();               
                this.openModal();
            }, 100);
        },
        // delete domain
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/domains/eranetDomains/' + id, {
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
                        this.getDomainList();
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
        // save and update domain
        saveEranetDomainData() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('account', this.activity.account);
            formData.append('status', this.activity.status);
            formData.append('domain_name', this.activity.domain_name);
            formData.append('auto_renew_status', this.activity.auto_renew_status);
            formData.append('expire_date', moment(this.activity.expiration_date).format('YYYY-MM-DD'));
            formData.append('creation_date', moment(this.activity.creation_date).format('YYYY-MM-DD'));
            this.activityType != 'Create' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Create' ? '/domains/eranetDomains' : `/domains/eranetDomains/${this.activity.id}`
            axios.post(`${this.$api}${postUrl}`, formData, {
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
                    this.closeModal();
                    this.getDomainList();
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
        // downloading csv
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'eranet'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                },
                responseType: 'blob',
            })
            .then(response => {
                let blob = new Blob([response.data], { type:'application/csv' } );
                const _url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = _url;
                link.setAttribute('download', 'demo.csv');
                document.body.appendChild(link);
                link.click();
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
        // choose file and import csv
        uploadCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/domains/eranetDomains/importEranetDomainCSV', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeImportCsvModal();
                    this.getDomainList();
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // select csv file
        chooseFile(e) {
            this.selectedFile = e.target.files[0];
        },
        // formatting date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            }else {
                return '-';
            }
        },
    }
}
</script>

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
                            <span>Urls Uptime Europe Monitor</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>
    
                            <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>
    
                            <v-btn @click.prevent="createUptimeModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Urls Uptime Europe Monitor List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col v-if="selected.length > 0" class="font-medium font-weight-normal v_select_design pr-0">
                                    <div class="mr-2 text-end d-flex justify-end">
                                        <v-btn @click="deleteSelected" :disabled="permissions.delete_auth == '0'" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                            Remove Selected
                                        </v-btn>
                                    </div>
                                </v-col>
                                <v-col cols="12" lg="7" md="7" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search" show-select v-model="selected" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.raw_url`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.raw_url ? item.selectable.raw_url : '-'}}
                                </div>
                                <v-tooltip activator="parent" location="top" v-if="item.selectable.raw_url">{{item.selectable.raw_url}}</v-tooltip>
                            </template>
                            <template v-slot:[`item.certificate_check_enabled`]="{ item }">
                                <v-icon color="green-darken-2" v-if="item.selectable.certificate_check_enabled">
                                    mdi mdi-check-circle
                                </v-icon>
                                <v-icon color="red-darken-4" v-else>
                                    mdi mdi-close-circle
                                </v-icon>
                            </template>
                            <template v-slot:[`item.certificate_issuer`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.certificate_issuer ? item.selectable.certificate_issuer : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.certificate_expiration_date`]="{ item }">
                                {{item.selectable.certificate_expiration_date ? item.selectable.certificate_expiration_date : '-'}}
                            </template>
                            <template v-slot:[`item.uptime_status`]="{ item }">
                                <v-icon color="green-darken-2" v-if="item.uptime_status == 'up'">
                                    mdi mdi-check-circle
                                </v-icon>
                                <v-icon color="red-darken-4" v-else-if="item.uptime_status == 'down'">
                                    mdi mdi-close-circle
                                </v-icon>
                                <div v-else>{{item.uptime_status}}</div>
                            </template>
                            <template v-slot:[`item.final_url`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.final_url ? item.selectable.final_url : '-'}}
                                </div>
                                <!-- <v-tooltip activator="parent" location="top" v-if="item.selectable.final_url">{{item.selectable.final_url}}</v-tooltip> -->
                            </template>
                            <template  v-slot:[`item.offer_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.offer_name ? item.selectable.offer_name : '-'}}
                                </div>
                                <v-tooltip activator="parent" location="top" v-if="item.selectable.offer_name">{{item.selectable.offer_name}}</v-tooltip>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
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

        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Urls Uptime Europe Monitor</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
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
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="uptimeUsa" tabindex="-1" role="dialog" aria-labelledby="uptimeUsaTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Urls Uptime Europe Monitor</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeUptimeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="addNew" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Site Url</label>
                                    <Field type="text" id="input-username" name="siteUrl" :class="{'form-control': true, 'border-red-600': errors.siteUrl}" v-model="item.site_url" placeholder="https://..."/>
                                    <span class="text-red-600" v-if="errors.siteUrl">Site url is a required field</span>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Select Test Type</label>
                                    <v-radio-group inline v-model="item.uptime_check_method" @update:modelValue="getActive">
                                        <v-radio class="monitor me-3" label="HTTP" value="get"></v-radio>
                                        <v-radio class="monitor" label="HEAD" value="head"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <p class="m-0">{{testDescription}}</p>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Offer Name</label>
                                    <Field type="text" id="input-username" name="offerName" :class="{'form-control': true, 'border-red-600': errors.offerName}" v-model="item.offer_name" placeholder="Offer Name"/>
                                    <span class="text-red-600" v-if="errors.siteUrl">Offer name is a required field</span>
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
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeUptimeModal">Close</v-btn>
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
import _ from 'lodash';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, 
        Field,
    },
    data() {
        return {
            message: {},
            showLoader: false,
            search: '',
            headers: [
                { title: 'Site Url', key: 'raw_url'},
                { title: 'Certificate Enabled', key: 'certificate_check_enabled', align: 'center' },
                { title: 'Certificate Issuer', key: 'certificate_issuer' },
                { title: 'Certificate Expiration Date', key: 'certificate_expiration_date', align: 'center' },
                { title: 'Uptime Status', align: 'center', sortable: true, key: 'uptime_status' },
                { title: 'Final Url ', key: 'final_url' },
                { title: 'Offer Name', sortable: true, key: 'offer_name' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            dataMetrics: [],
            permissions: {},
            itemsPerPage: -1,
            descriptionFilter: [],
            item: {
                id:'',
                site_url: '',
                offer_name: '',
                uptime_check_method: 'get'
            },
            testDescription: "HTTP tests are great for testing any standard website that you would access using your browser. If you don't know what test type to use this one is likely the best option.",
            selected: [],
            selectedRange: '',
            selectedFile: '',
            backendErrorMessage: '',
            multipleErrors: [],
            activityType: 'Create',
            isHidden: false,
        }
    },
    computed: {
        schema() {
            return yup.object({
                siteUrl: yup.string().required(),
                offerName: yup.string().required(),
            });
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getData();
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null);
            window.$('#exampleModalCenter').modal('hide');
        },
        createUptimeModal() {
            window.$('#uptimeUsa').modal('show');
        },
        closeUptimeModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#uptimeUsa').modal('hide');
        },
        getActive() {
            if(this.item.uptime_check_method == 'head') {
                this.testDescription = "HEAD tests are like HTTP tests except they do not load the body of the site and instead of a GET/POST request only via a HEAD type; not all servers support this."
            }else {
                this.testDescription = "HTTP tests are great for testing any standard website that you would access using your browser. If you don't know what test type to use this one is likely the best option."
            }
        },
        // get listings
        getData() {
            this.showLoader = true;
            axios.get(this.$api + '/monitoring/urlUpTimeEurope', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
                    this.showLoader = false;
                } else {
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
        },
        // add new 
        addNew() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('site_url', this.item.site_url);
            formData.append('uptime_check_method', this.item.uptime_check_method);
            formData.append('offer_name', this.item.offer_name);
            this.activityType != 'Create' && formData.append('id', this.item.id);
            axios.post(this.$api + '/monitoring/urlUpTimeEurope', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.getData();
                    this.closeUptimeModal();
                    this.showLoader = false;
                } else {
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
        // get data for edit
        edit(id) {
            this.activityType = 'Edit';
            const data = _.filter(this.dataMetrics, x => { return x.id == id; });
            const result = data[0];
            this.item.id = id;
            this.item.site_url = result.raw_url;
            this.item.uptime_check_method = result.uptime_check_method;
            this.item.offer_name = result.offer_name;
            this.getActive();
            this.createUptimeModal();
        },
        //  delete data
        deleteData(id) {
            this.showLoader = true;
            axios.delete(this.$api + '/monitoring/urlUpTimeEurope/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.getData();
                    this.showLoader = false;
                } else {
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
        },
        // delete selected items
        deleteSelected() {
            const confirmDelete = window.confirm('Do you really want to delete?');
            if(confirmDelete) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('selectedRow', JSON.stringify(multipleRow));
                axios.post(this.$api + '/monitoring/deleteEuropeUrlToMonitor', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.selected = [];
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.getData();
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
        // download csv file
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'uptimeMonitor'
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
        // upload csv file
        uploadCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/monitoring/importEuropeMonitorCsv', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getData();
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
    }
}
</script>

<style scoped>
</style>
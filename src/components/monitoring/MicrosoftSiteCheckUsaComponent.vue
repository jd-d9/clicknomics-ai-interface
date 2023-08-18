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
                            <span>Microsoft Defender Usa Site Check</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon @click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>
    
                            <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>
                            
                            <v-btn @click.prevent="createDomainModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus" :disabled="permissions.create_auth == '0'">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Microsoft Defender Usa Site Check List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end">
                                <v-col v-if="selected.length > 0" class="font-medium font-weight-normal v_select_design pr-0">
                                    <div class="mr-2 text-end d-flex justify-end">
                                        <v-btn @click="deleteSelected" :disabled="permissions.delete_auth == '0'" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                            Remove Selected
                                        </v-btn>
                                    </div>
                                </v-col>
                                <v-col class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-3" :headers="headers" :items="urlList" :items-per-page="itemsPerPage" show-select v-model="selected" :search="search">
                            <template v-slot:[`item.url`]="{ item }">
                                {{item.selectable.url ? item.selectable.url : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <td v-if="item.selectable.status">
                                    <i class="fas fa-exclamation-triangle mr-2" style="color:red" v-if="item.selectable.status === '403'"></i>
                                    <i class="fas fa-check-circle mr-2" style="color:green" v-if="item.selectable.status != '403'"></i>
                                    {{item.selectable.status == '403' ? 'Site Detected as malicious' :  'Site is not malicious'}}
                                </td>
                                <td v-else>
                                    -
                                </td>
                            </template>
                            <template v-slot:[`item.primary_language`]="{ item }">
                                {{item.selectable.primary_language ? item.selectable.primary_language : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Microsoft Defender Usa Site Check</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form @submit.prevent="importCsv">
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

        <div class="modal fade" id="adddomain" tabindex="-1" role="dialog" aria-labelledby="adddomainTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Microsoft Defender Usa Site Check</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeDomainModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="addNew" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain</label>
                                    <Field type="text" id="input-username" name="domain" :class="{'form-control': true, 'border-red-600': errors.domain}" v-model="item.site_url" placeholder="Domain"/>
                                    <span class="text-red-600" v-if="errors.domain">Domain is a required field</span>
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
                                <v-btn type="reset" class="text-none bg-blue-darken-4 btn_animated mr-5" id="reset_button" append-icon="mdi-content-save" style="opacity: 0">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeDomainModal">Close</v-btn>
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
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form,
        Field
    },
    data() {
        return {
            message: {},
            showLoader: false,
            search: '',
            headers: [
                { title: 'Site Url', key: 'url'},
                { title: 'Detection Result', key: 'status' },
                { title: 'Request Result', key: 'error_code', sortable: false },
                { title: 'Action', key: 'action', sortable: false },
            ],
            urlList: [],
            itemsPerPage: -1,
            descriptionFilter: [],
            item: {
              site_url: '',
            },
            selected: [],
            permissions: {},
            selectedFile: '',
            isHidden: false,
            resultMessage: '',
            dialog: false,
            domain: '',
            resultData: [],
            resultId: '',
            backendErrorMessage: '',
            multipleErrors: [],
            statusMessages: [
                { status: '200', message: 'OK' },
                { status: '201', message: 'Created' },
                { status: '202', message: 'Accepted' },
                { status: '203', message: 'Non-Authoritative Information' },
                { status: '204', message: 'No Content' },
                { status: '205', message: 'Reset Content' },
                { status: '206', message: 'Partial Content' },
                { status: '207', message: 'Multi-Status' },
                { status: '208', message: 'Already Reported (WebDAV)' },
                { status: '226', message: 'IM Used' },
                { status: '300', message: 'Multiple Choices' },
                { status: '301', message: 'Moved Permanently' },
                { status: '302', message: 'Found' },
                { status: '303', message: 'See Other' },
                { status: '304', message: 'Not Modified' },
                { status: '305', message: 'Use Proxy' },
                { status: '307', message: 'Temporary Redirect' },
                { status: '308', message: 'Permanent Redirect' },
                { status: '400', message: 'Bad Request' },
                { status: '401', message: 'Unauthorized' },
                { status: '402', message: 'Payment Required' },
                { status: '403', message: 'Forbidden' },
                { status: '404', message: 'Not Found' },
                { status: '405', message: 'Method Not Allowed' },
                { status: '406', message: 'Not Acceptable' },
                { status: '407', message: 'Proxy Authentication Required' },
                { status: '408', message: 'Request Timeout' },
                { status: '409', message: 'Conflict' },
                { status: '410', message: 'Gone' },
                { status: '411', message: 'Length Required' },
                { status: '412', message: 'Precondition Failed' },
                { status: '413', message: 'Request Entity Too Large' },
                { status: '414', message: 'Request-URI Too Long' },
                { status: '415', message: 'Unsupported Media Type' },
                { status: '416', message: 'Requested Range Not Satisfiable' },
                { status: '417', message: 'Expectation Failed' },
                { status: '418', message: `I'm a teapot` },
                { status: '420', message: 'Enhance Your Calm' },
                { status: '421', message: 'Misdirected Request' },
                { status: '422', message: 'Unprocessable Entity' },
                { status: '423', message: 'Locked' },
                { status: '424', message: 'Failed Dependency' },
                { status: '425', message: 'Too Early' },
                { status: '426', message: 'Upgrade Required' },
                { status: '428', message: 'Precondition Required' },
                { status: '429', message: 'Too Many Requests' },
                { status: '431', message: 'Request Header Fields Too Large' },
                { status: '444', message: 'No Response' },
                { status: '449', message: 'Retry With' },
                { status: '450', message: 'Blocked by Windows Parental Controls' },
                { status: '451', message: 'Unavailable For Legal Reasons' },
                { status: '497', message: 'HTTP Request Sent to HTTPS Port' },
                { status: '498', message: 'Token expired/invalid' },
                { status: '499', message: 'Client Closed Request' },
                { status: '500', message: 'Internal Server Error' },
                { status: '501', message: 'Not Implemented' },
                { status: '502', message: 'Bad Gateway' },
                { status: '503', message: 'Service Unavailable' },
                { status: '504', message: 'Gateway Timeout' },
                { status: '505', message: 'HTTP Version Not Supported' },
                { status: '506', message: 'Variant Also Negotiates' },
                { status: '507', message: 'Insufficient Storage' },
                { status: '508', message: 'Loop Detected' },
                { status: '509', message: 'Bandwidth Limit Exceeded' },
                { status: '510', message: 'Not Extended' },
                { status: '511', message: 'Network Authentication Required' },
                { status: '521', message: 'Web Server is Down' },
                { status: '523', message: 'Origin is Unreachable' },
                { status: '525', message: 'SSL Handshake Failed' },
                { status: '598', message: 'Network read timeout error' },
                { status: '599', message: 'Network connect timeout error' },
            ]
        }
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
    computed: {
        schema() {
            return yup.object({
                domain: yup.string().required(),
            });
        },
    },
    methods: {
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null) ;
            window.$('#exampleModalCenter').modal('hide');
        },
        createDomainModal() {
            window.$('#adddomain').modal('show');
        },
        closeDomainModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#adddomain').modal('hide');
        },
        // get listings
        getData() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/monitoring/microsoftDefender';
            queryString.set('type', 'USA');
            const url = `${ajaxUrl}?${queryString.toString()}`;
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if (response.data.success) {
                    const getData = response.data;
                    this.urlList = getData.data;
                    this.permissions = getData.permission;
                    this.urlList.map((item) => {
                        item.error_code = this.errorCode(item.status)
                        return item;
                    })
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
        // error code
        errorCode(errorCode) {
            if(errorCode) {
                const error = this.statusMessages.find(item => item.status == errorCode);
                return error ? error.message : '-'
            } else {
                return '-'
            }
        },
        // create new record
        addNew() {
            this.showLoader = true;
            axios.post(this.$api + '/monitoring/microsoftDefender', {
                site_url: this.item.site_url,
                type: 'USA',
            }, {
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
                    this.closeDomainModal();
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
        // delete card payment list 
        deleteData(id) {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/monitoring/microsoftDefender/' + id;
            queryString.set('type', 'USA');
            const url = `${ajaxUrl}?${queryString.toString()}`;
            axios.delete(url, {
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
                    this.getData();
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
                formData.append('type', 'USA');
                axios.post(this.$api + '/monitoring/deleteMicrosoftDefenderMutipleRows', formData, {
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
        // downloading csv
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'microsoftDefender'
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
        importCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/monitoring/importMicrosoftDefenderCSV', {
                file: this.selectedFile,
                type: 'USA',
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
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
                                    <li class="breadcrumb-item active" aria-current="page">Flokinet Domains</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right" v-if="showImportIcon">
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="downloadCsv">
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="openImportCsvModal">Import CSV</router-link>
                            <button @click="createActivity" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add New Record</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex search_width" cols="12" sm="3">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <!-- data table component -->
                                            <v-data-table class="table-hover-class adding-font-size table-with-checkbox" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                                <template v-slot:[`item.account`]="{ item }">
                                                    <td class="text-ellipsis w-50">{{item.selectable.account ? item.selectable.account : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.status`]="{ item }">
                                                    <td class="text-ellipsis w-50">{{item.selectable.status ? item.selectable.status : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.domain`]="{ item }">
                                                    <td class="text-ellipsis w-50">{{item.selectable.domain ? item.selectable.domain : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.auto_renewals`]="{ item }">
                                                    <td>
                                                        <v-switch disabled :model-value="item.selectable.auto_renewals == 'Active' ? true : false"></v-switch>
                                                    </td>
                                                </template>
                                                <template v-slot:[`item.expire_date`]="{ item }">
                                                    <td class="text-ellipsis w-50">{{item.selectable.expire_date ? format_date(item.selectable.expire_date) : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <button class="disable-button" :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                                            <img src="/assets/img/icons/edit.svg" class="img-width" title="Edit">
                                                        </button>
                                                        <button class="disable-button" :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="img-width" title="Delete">
                                                        </button>
                                                    </td>
                                                </template>
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn
                                                            elevation="2"
                                                            variant="outlined"
                                                            raised
                                                            rounded="xl"
                                                            class="me-1 disable-button"
                                                            :disabled="permissions.delete_auth == '0'"
                                                            @click="deleteSelected"
                                                        >Remove Selected</v-btn>
                                                    </div>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-app>
                                </div>
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
        <!-- Start Import CSV Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Flokinet</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true">&times;</span>
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
                                    <!-- <Field @change="chooseFile" title="Choose CSV" :class="{'border-red-600': errors.selectFile}" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/> -->
                                </div>
                                <!-- <ErrorMessage class="text-red-600" name="selectFile"/> -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeImportCsvModal">Close</button>
                            <button type="submit" class="btn btn-primary">Import</button>
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
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{viewModalDetail.amount}}
                        </p> <!--  {{viewModalDetail.amount | toCurrency}}  -->
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
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Flokinet</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="saveFlokinetDomainData" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <label class="form-control-label" for="input-username">Account (email)</label>
                                            <Field type="text" id="input-username" name="Email" :class="{'form-control': true , 'border-red-600':errors.Email }" v-model="activity.account"/>
                                            <ErrorMessage class="text-red-600" name="Email"/>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <label class="form-control-label" for="input-username">Domain Name</label>
                                            <Field type="text" id="input-username" name="Name" :class="{'form-control': true , 'border-red-600':errors.Name }" v-model="activity.domain_name"/>
                                            <span class="text-red-600" v-if="errors.Name">Domain name is a required field</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0 mt-3">
                                            <label class="form-control-label" for="input-username">Domain Creation Date</label>
                                            <Field v-model="activity.creation_date" name="createDate">
                                                <datepicker name="createDate" v-model:value="activity.creation_date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.createDate">Domain creation date is a required field</span>
                                        </div>
                                        <div class="col-lg-6 py-0 mt-3">
                                            <label class="form-control-label" for="input-username">Domain Expiration Date</label>
                                            <Field name="expDate" v-model="activity.expiration_date">
                                                <datepicker name="expDate" v-model:value="activity.expiration_date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.expDate">Domain expiration date is a required field</span>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0 mt-3">
                                            <label class="form-control-label" for="input-username">Domain Auto Renew Status</label>
                                            <Field name="renewStatus" v-model="activity.auto_renew_status">
                                                <v-select name="renewStatus" :class="{'form-control': true , 'border-red-600':errors.renewStatus }" :items="accountStatusList" v-model="activity.auto_renew_status"></v-select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.expDate">Domain auto renew status is a required field</span>
                                        </div>
                                        <div class="col-lg-6 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Status</label>
                                                <Field name="Status" v-model="activity.status">
                                                    <v-select name="Status" :class="{'form-control': true , 'border-red-600':errors.Status}" :items="accountStatusList" v-model="activity.status"></v-select>
                                                </Field>
                                                <ErrorMessage class="text-red-600" name="Status"/>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
            abc: true,
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Account (email)', key: 'account'},
                { title: 'Status', align: 'start', sortable: true, key: 'status' },
                { title: 'Domain Name', key: 'domain' },
                { title: 'Domain Auto Renew Status', key: 'auto_renewals' },
                { title: 'Domain Expiration', key: 'expire_date' },
                { title: 'Action', key: 'action' },
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
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        }
    },
    mounted() {
        // this.dataMetrics = this.list;
        // this.dataMetrics = this.list.map((item) => {
        //     item.renewAuto = item.auto_renewals == 'Active' ? 1 : 0;
        //     return item;
        // })
        this.getDomainList();
    },
    methods: {
        // manage modal open close
        openImportCsvModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeImportCsvModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // get domain listing
        getDomainList() {
            this.showLoader = true;
            this.axios.get(this.$api + '/domains/flokinetDomains', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data.data;
                    this.permissions = getData.permission;
                    console.log(getData, 'getData');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
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
            this.activity.expiration_date = result.expire_date;
            this.activity.creation_date = result.creation_date;
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
            // this.activity.notes = '';
            this.openModal();
        },
        // delete domain
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/domains/flokinetDomains/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                        this.getDomainList();
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
        // handle upload
        handleUpload(event) {
            const files = event.target.files;
            console.log(files[0].name, '2121212')
            this.file = files;
        },
        // view data
        // view(id) {
        //     this.viewModalDetail = _.find(this.dataMetrics, ['id', id]);
        //     window.$('#viewDetail').modal('show');
        // },
        // save and update domain
        saveFlokinetDomainData() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('account', this.activity.account);
            formData.append('status', this.activity.status);
            formData.append('domain', this.activity.domain_name);
            formData.append('auto_renewals', this.activity.auto_renew_status);
            formData.append('expire_date', moment(this.activity.expiration_date).format('YYYY-MM-DD'));
            formData.append('creation_date', moment(this.activity.creation_date).format('YYYY-MM-DD'));
            this.activityType != 'Create' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Create' ? '/domains/flokinetDomains' : `/domains/flokinetDomains/${this.activity.id}`
            this.axios.post(`${this.$api}${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                    this.closeModal();
                    this.getDomainList();
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
        // downloading csv
        downloadCsv() {
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'flokinet'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
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
                this.$toast.open({
                    message: 'File downloaded',
                    position: 'top-right',
                    duration: '5000',
                    type: 'success'
                });
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
        // choose file and import csv
        uploadCsv() {
            this.showLoader = true;
            this.axios.post(this.$api + '/domains/flokinetDomains/importFlokinetDomainCSV', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeImportCsvModal();
                    this.getDomainList();
                    this.showLoader = false;
                    this.selectedFile = '';
                    this.$toast.open({
                        message: 'File imported',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
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
        },
        // select csv file
        chooseFile(e) {
            this.selectedFile = e.target.files[0];
        },
        // formatting date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
    }
}
</script>

<style scoped>
.img-width {
    width: 25px;
}
</style>

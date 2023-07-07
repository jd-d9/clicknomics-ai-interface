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
                                    <li class="breadcrumb-item active" aria-current="page">Management System Residential VPS</li>
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
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="openModal">Import CSV</router-link>
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'" @click.prevent="createActivity">Add New Record</button>
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
                                                <!-- <v-spacer></v-spacer> -->
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="3" v-if="false">
                                                        <v-select solo :items="descriptionFilter" label="Description Filter" :clearable="true" v-model="descriptionValue" @change="getDatacenterVpcManagementSystemReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex" cols="12" sm="3" v-if="false">
                                                        <v-select solo :items="transactionTypeFilter" label="Transaction Type Filter" :clearable="true" v-model="transactionTypeValue" @change="getDatacenterVpcManagementSystemReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex" cols="12" sm="3" v-if="false">
                                                        <template>
                                                            <!-- <date-range-picker v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
                                                                <div slot="header" slot-scope="header" class="slot">
                                                                    <h3 class="m-0">Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                                                </div>
                                                                <template #input="picker" style="min-width: 350px;">
                                                                    {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                                                </template>
                                                                <template #date="data">
                                                                    <span class="small">{{ data.date | dateCell }}</span>
                                                                </template>
                                                                <template #ranges="ranges">
                                                                    <div class="ranges">
                                                                        <ul>
                                                                        <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                                                            <b>{{ name }}</b> <small class="text-muted">{{ range[0].toDateString() }} -
                                                                            {{ range[1].toDateString() }}</small>
                                                                        </li>
                                                                        </ul>
                                                                    </div>
                                                                </template>
                                                                <div slot="footer" slot-scope="data" class="slot">
                                                                    <div>
                                                                        <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                                                    </div>
                                                                    <div style="margin-left: auto">
                                                                        <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
                                                                    </div>
                                                                </div>
                                                            </date-range-picker> -->
                                                        </template>
                                                    </v-col>
                                                    <v-col class="d-flex search_width" cols="12" sm="3">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table class="table-hover-class table-with-checkbox" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}"  v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage"> <!-- @current-items="currentItems"  -->
                                                <template v-slot:[`item.company`]="{ item }">
                                                    <td>{{item.selectable.company}}</td>
                                                </template>
                                                <template v-slot:[`item.ip`]="{ item }">
                                                    <td>{{item.selectable.ip}}</td>
                                                </template>
                                                <template v-slot:[`item.notes`]="{ item }">
                                                    <td>{{item.selectable.notes ? item.selectable.notes : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <button class="disable-button" :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit">
                                                        </button>
                                                        <button class="disable-button" :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete">
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Management System Residential VPS</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
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
                                    <input @change="chooseFile" title="Choose CSV"  class="inputFile form-control-file" type="file" name="chooseFile" required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeModal">Close</button>
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
                        </p> <!--   {{viewModalDetail.amount | toCurrency}}   -->
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
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Management System Residential VPS</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeRmAmexModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="saveResidentialVpcManagementSystem" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Name</label>
                                                <Field type="text" id="input-username" name="Company" :class="{'form-control': true , 'border-red-600':errors.Company }" v-model="activity.company"/>
                                                <span class="text-red-600" v-if="errors.Company">Name Can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">IP</label>
                                                <Field type="text" id="input-username" name="Ip" :class="{'form-control': true , 'border-red-600':errors.Ip }" v-model="activity.ip"/>
                                                <span class="text-red-600" v-if="errors.Ip">IP Can not be empty</span>
                                                <!-- <span class="text-red-600" v-if="backendErrorMessage">{{backendErrorMessage}}</span> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <textarea :class="{'form-control': true}"  name="" cols="30" rows="10" v-model="activity.notes"></textarea>
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
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, Field
    },
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Name', align: 'start', sortable: false, key: 'company' },
                { title: 'IP ', key: 'ip' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            selected: [],
            viewModalDetail: {},
            currentItemsTable: [],
            itemsPerPage: -1,
            activity: {
                id: '',
                company : '',
                ip : '',
                notes : '',
            },
            activityType: 'Create',
            descriptionFilter: [],
            transactionTypeFilter: [],
            descriptionValue: '',
            transactionTypeValue: '',
            dateRangeTabReport: {startDate, endDate},
            items: [ 'CREDIT','DEBIT'],
            selectedtTransactionType: [ 'CREDIT','DEBIT'],
            cardMemberList: [],
            showImportIcon: true,
            permissions: {},
            selectedFile: '',
            // backendErrorMessage: '',
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
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        schema() {
            return yup.object({
                Company: yup.string().required(),
                Ip: yup.string().required(),
            });
        },
    },
    mounted() {
        this.getDatacenterVpcManagementSystemReport();
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        // open and close view details modal
        openRmAmexModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeRmAmexModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // get data center vps listings data
        getDatacenterVpcManagementSystemReport() {
            this.showLoader = true;
            this.axios.get(this.$api + '/management_system/residentialvps', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.dataMetrics = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // filterIPMChaseInkActivity() {
        //     this.showLoader = true;
        //     let formData = new FormData();
        //     formData.append('startDate', this.dateRangeTabReport.startDate.toDateString());
        //     formData.append('endDate', this.dateRangeTabReport.endDate.toDateString());
        //     this.selectedtTransactionType.length == this.items.length ? formData.append('transactionTypeValue', 'ALL') : formData.append('transactionTypeValue', this.selectedtTransactionType);
        //     const csrf = document.querySelector('meta[name="csrf-token"]').content;
        //     axios.defaults.headers.common = {
        //         'X-Requested-With': 'XMLHttpRequest',
        //         'X-CSRF-TOKEN': csrf
        //     };
        //     axios.post('/filterIPMChaseInkActivity' , formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         },
        //     })
        //     .then(response => {
        //         // console.log(response);
        //         this.cardMemberList = response.data.data;
        //         this.showLoader = false;

        //     }).catch((error) => {
        //         this.showLoader = false;
        //     })
        // },
        checkOpenPicker(e) {
            console.log(e)
            setTimeout(() => {
                this.getDatacenterVpcManagementSystemReport();
            },100)
        },
        // edit data
        edit(id) {
            const result = this.dataMetrics.find((val) => {
                return val.id == id
            });
            this.activityType = 'Update'
            this.activity.id = id;
            this.activity.company = result.company;
            this.activity.ip = result.ip;
            this.activity.notes = result.notes ? result.notes : '';
            this.openRmAmexModal();
        },
        // create new data
        createActivity() {
            this.activityType = 'Create';
            this.activity.id = '';
            this.activity.company = '';
            this.activity.ip = '';
            this.activity.notes = '';
            this.openRmAmexModal();
        },
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/management_system/residentialvps/' + id, {
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
                        this.getDatacenterVpcManagementSystemReport();
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
        // delete selected/multiple delete
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('selectedRecord', JSON.stringify(multipleRow));
                this.axios.post(this.$api + '/management_system/residentialvps/deleteMutipleRecord', formData, {
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
                        this.selected = [];
                        this.getDatacenterVpcManagementSystemReport();
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
        // view
        view(id) {
            console.log(id)
            // this.viewModalDetail = _.find(this.dataMetrics, ['id', id]);
            window.$('#viewDetail').modal('show');
        },
        // save and update
        saveResidentialVpcManagementSystem() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('company', this.activity.company);
            formData.append('ip', this.activity.ip);
            formData.append('notes', this.activity.notes);
            this.activityType != 'Create' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Create' ? '/management_system/residentialvps' : `/management_system/residentialvps/${this.activity.id}`
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
                    this.closeRmAmexModal();
                    this.getDatacenterVpcManagementSystemReport();
                    this.showLoader = false;
                    // this.backendErrorMessage = '';
                }
            })
            .catch(error => {
                console.log(error)
                // this.backendErrorMessage = error.response.data.errors[0]
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
                filename: 'datacenterVpcManagementSystem'
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
        // upload csv file
        uploadCsv() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('file', this.selectedFile);
            this.axios.post(this.$api + '/management_system/residentialvps/importLocalCSV', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getDatacenterVpcManagementSystemReport();
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
        }
    }
}
</script>

<style scoped>

</style>

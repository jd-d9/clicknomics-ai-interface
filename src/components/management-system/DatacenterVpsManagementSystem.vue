<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Management System Datacenter VPS</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right" v-if="showImportIcon">
                            <router-link to="/admin/img/doc/ipm-management-system-datavps-demo.csv" class="btn btn-lg btn-neutral btn_animated" download>
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" data-toggle="modal" data-target="#exampleModalCenter" class="btn btn-lg btn-neutral btn_animated">Import CSV</router-link>
                            <router-link to="" @click="createActivity" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--6">
            <div class="row justify-content-center">
                <div class="col">
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
                                                <!-- <template v-slot:item.action="{ item }">
                                                    <td>
                                                        <a href="javascript:void(0);" @click="edit(item.id)">
                                                            <img src="/admin/img/icons/edit.svg" style="width:30px">
                                                        </a>
                                                        <a href="javascript:void(0);" @click="deleteData(item.id)">
                                                            <img src="/admin/img/icons/bin.svg" style="width:30px">
                                                        </a>
                                                    </td>
                                                </template> -->
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn
                                                            elevation="2"
                                                            outlined
                                                            raised
                                                            rounded
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
            </div>
        </div>
        <!-- Start Import CSV Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Management System Datacenter VPS</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="uploadCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="file">{{file[0].name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="handleUpload($event)" title="Choose CSV"  class="inputFile form-control-file" type="file" name="chooseFile"  required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Management System Datacenter VPS</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <form @submit.prevent="saveDatacenterVpcManagementSystem">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Name</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.company">
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">IP</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.ip">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <textarea :class="{'form-control': true}"  name="" cols="30" rows="10" v-model="activity.notes"></textarea>
                                                <!-- <ValidationProvider v-slot="{ errors }" rules="required" name="Notes">
                                                    <span class="text-red-600">{{ errors[0] }}</span>
                                                </ValidationProvider> -->
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Vue.filter('toCurrency', function (value) {
//     // value =  parseInt(value);
//     // if (typeof value !== "number") {
//     //     return value;
//     // }
//     value = parseFloat(value).toFixed(2);
//     var formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 2
//     });
//     return formatter.format(value);
// });
export default {
    components: {

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
            showImportIcon: true
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
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        }
    },
    mounted() {
        this.getDatacenterVpcManagementSystemReport();
    },
    methods: {
        getDatacenterVpcManagementSystemReport() {
            this.showLoader = true;
            // let formData = new FormData();
            // formData.append('startDate', this.dateRange.startDate.toDateString());
            // formData.append('endDate', this.dateRange.endDate.toDateString());
            // if(this.descriptionValue) {
            //     formData.append('descriptionValue', this.descriptionValue);
            // }
            // if(this.transactionTypeValue) {
            //     formData.append('transactionTypeValue', this.transactionTypeValue);
            // }
            // const csrf = document.querySelector('meta[name="csrf-token"]').content;
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': csrf
            // };
            // axios.post('/getDatacenterVpcManagementSystemReport' , formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // })
            // .then(response => {
            //     console.log(response);
            //     if(response) {
            //         const result = response.data.data;
            //         // result.map((data) => {
            //         //     data.date = data.date.split(' ')[0];
            //         // });
            //         this.dataMetrics = result;
            //         // response.data.allDescription.map((data) => {
            //         //     this.descriptionFilter.push({'text' : data.description});
            //         // });
            //         // response.data.allTransactionType.map((data) => {
            //         //     this.transactionTypeFilter.push({'text' : data.transaction_type});
            //         // });
            //     }
            //     this.showLoader = false;

            // }).catch((error) => {
            //     console.log(error)
            //     this.showLoader = false;
            // })
        },
        filterIPMChaseInkActivity() {
            // this.showLoader = true;
            // let formData = new FormData();
            // formData.append('startDate', this.dateRangeTabReport.startDate.toDateString());
            // formData.append('endDate', this.dateRangeTabReport.endDate.toDateString());
            // this.selectedtTransactionType.length == this.items.length ? formData.append('transactionTypeValue', 'ALL') : formData.append('transactionTypeValue', this.selectedtTransactionType);
            // const csrf = document.querySelector('meta[name="csrf-token"]').content;
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': csrf
            // };
            // axios.post('/filterIPMChaseInkActivity' , formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // })
            // .then(response => {
            //     // console.log(response);
            //     this.cardMemberList = response.data.data;
            //     this.showLoader = false;

            // }).catch((error) => {
            //     this.showLoader = false;
            // })
        },
        checkOpenPicker(e) {
            console.log(e)
            setTimeout(() => {
                this.getDatacenterVpcManagementSystemReport();
            },100)
        },
        checkOpenPickerTabReport() {
             setTimeout(() => {
                // this.filterIPMChaseInkActivity();
            },100)
        },
        edit(id) {
            console.log(id)
            // window.location.href = `/bank_accounts/ipmchase/${id}/edit`;
            // const data = _.filter(this.dataMetrics, x => { return x.id == id; });
            // const restult = data[0];
            // this.activityType = 'Update'
            // this.activity.id = id;
            // this.activity.company = restult.company;
            // this.activity.ip = restult.ip;
            // this.activity.notes = restult.notes ? restult.notes : '';
            // window.$('#createUpdateData').modal('show');
        },
        createActivity() {
            this.activityType = 'Create';
            this.activity.id = '';
            this.activity.company = '';
            this.activity.ip = '';
            this.activity.notes = '';
            window.$('#createUpdateData').modal('show');
        },
        deleteData(id) {
            console.log(id)
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                // axios.defaults.headers.common = {
                //     'X-Requested-With': 'XMLHttpRequest',
                //     'X-CSRF-TOKEN': window.csrf_token
                // };
                // let formData = new FormData();
                // formData.append('id', id);
                // axios.post(`/deleteDatacenterVpcManagementSystemRow`, formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                // }).then(response => {
                //     if(response) {
                //         console.log(response, 'sasa')
                //         this.showLoader = false;
                //         this.message = {
                //             text: response.data.message,
                //             type: 'success',
                //         };
                //         Bus.$emit('flash-message', this.message, '');
                //         this.dataMetrics = _.filter(this.dataMetrics, x => { return x.id !== id; });
                //     }else {
                //         this.showLoader = false;
                //         this.message = {
                //             text: 'Something Went Wrong!',
                //             type: 'error',
                //         }
                //         Bus.$emit('flash-message', this.message, '');
                //     }
                // }).catch(error => {
                //     this.showLoader = false;
                //     console.log(error);
                //     this.message = {
                //         text: error.response.data.message,
                //         type: 'error',
                //     }
                //     Bus.$emit('flash-message', this.message, '');
                // });
            }
        },
        handleUpload(event) {
            const files = event.target.files;
            console.log(files[0].name, '2121212')
            this.file = files;
        },
        // upload csv file
        uploadCsv() {
            this.showLoader = true;
            // let formData = new FormData();
            // formData.append('file', this.file[0]);
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': window.csrf_token
            // };
            // axios.post(`/importDatacenterVpcManagementSystemCSV`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //         this.showLoader = false;
            //         this.message = {
            //             text: response.data.message,
            //             type: 'success',
            //         };
            //         Bus.$emit('flash-message', this.message, '/management_system/datavps');
            //     }else {
            //         this.showLoader = false;
            //         this.message = {
            //             text: 'Something Went Wrong!',
            //             type: 'error',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //     }
            // }).catch((error) => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // });
        },
        // delete selected/multiple delete
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                // axios.defaults.headers.common = {
                //     'X-Requested-With': 'XMLHttpRequest',
                //     'X-CSRF-TOKEN': window.csrf_token
                // };
                // let formData = new FormData();
                // formData.append('selectedRow', JSON.stringify(this.selected));
                // axios.post(`/deleteDatacenterVpcManagementSystemMutipleRows`, formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                // }).then(response => {
                //     if(response) {
                //         console.log(response, 'sasa')
                //         this.showLoader = false;
                //         this.message = {
                //             text: response.data.message,
                //             type: 'success',
                //         };
                //         Bus.$emit('flash-message', this.message, '');
                //         this.dataMetrics = this.dataMetrics.filter(ar => !this.selected.find(rm => (rm.id === ar.id) ));
                //         this.selected = [];
                //     }else {
                //         this.showLoader = false;
                //         this.message = {
                //             text: 'Something Went Wrong!',
                //             type: 'error',
                //         }
                //         Bus.$emit('flash-message', this.message, '');
                //     }
                // }).catch(error => {
                //     this.showLoader = false;
                //     console.log(error);
                //     this.message = {
                //         text: error.response.data.message,
                //         type: 'error',
                //     }
                //     Bus.$emit('flash-message', this.message, '');
                // });
            }
        },
        // view
        view(id) {
            console.log(id)
            // this.viewModalDetail = _.find(this.dataMetrics, ['id', id]);
            window.$('#viewDetail').modal('show');
        },
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
        // save and update
        saveDatacenterVpcManagementSystem() {
            this.showLoader = true;
            // let formData = new FormData();
            // formData.append('id', this.activity.id);
            // formData.append('company', this.activity.company);
            // formData.append('ip', this.activity.ip);
            // formData.append('notes', this.activity.notes);
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': window.csrf_token
            // };
            // const postUrl = this.activityType == 'Create' ? 'saveDatacenterVpcManagementSystem' : 'updateDatacenterVpcManagementSystem'
            // axios.post(`/${postUrl}`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //         this.showLoader = false;
            //         this.message = {
            //             text: response.data.message,
            //             type: 'success',
            //         };
            //         Bus.$emit('flash-message', this.message, '');
            //         $('#createUpdateData').modal('hide');
            //         this.getDatacenterVpcManagementSystemReport();
            //     }else {
            //         this.showLoader = false;
            //         this.message = {
            //             text: 'Something Went Wrong!',
            //             type: 'error',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //     }
            // }).catch((error) => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // });
        }
    }
}
</script>

<style scoped>

</style>

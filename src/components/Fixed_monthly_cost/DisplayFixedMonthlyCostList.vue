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
                                    <li class="breadcrumb-item active" aria-current="page">Fixed Monthly Cost List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="downloadCsv">
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="openImportCsvModal">Import CSV</router-link>
                            <button @click.prevent="this.$router.push('/accounting/fixedMonthlyCost/create')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add New Record</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1'">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-spacer></v-spacer>
                                                <v-row class="align-items-center">
                                                    <v-col class="d-flex" cols="12" sm="4">daterange</v-col>
                                                    <!-- <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <template>
                                                            <date-range-picker v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
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
                                                                        <router-link tock="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</router-link>
                                                                    </div>
                                                                </div>
                                                            </date-range-picker>
                                                        </template>
                                                    </v-col> -->
                                                    <div class="col-3 ms-auto">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchCosts">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <!-- data table component -->
                                            <v-data-table class="table-hover-class adding-font-size elevation-1" :headers="headers" :items="dataMetrics" :itemsPerPage="itemsPerPage" show-select v-model="selected">
                                                <!-- <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.date}}</td>
                                                        <td>${{item.selectable.amount}}</td>
                                                        <td>
                                                            <router-link :to="'/accounting/fixedMonthlyCost/'+ item.selectable.id +'/edit'">
                                                                <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                            </router-link>
                                                            <router-link to="" @click="deleteData(item.selectable.id)">
                                                                <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                            </router-link>
                                                        </td>
                                                    </tr>
                                                </template> -->
                                                <template v-slot:[`item.date`]="{ item }">
                                                    <td>{{item.selectable.date}}</td>
                                                </template>
                                                <template v-slot:[`item.amount`]="{ item }">
                                                    <td>{{item.selectable.amount}}</td>
                                                </template>
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <button @click.prevent="this.$router.push('/accounting/fixedMonthlyCost/'+ item.selectable.id +'/edit')" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                        </button>
                                                        <button @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                            <img src="/assets/img/icons/bin.svg" class="icon-width">
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
                                                            @click="deleteSelected"
                                                            class="me-1"
                                                        >Remove Selected</v-btn>
                                                        <v-btn
                                                            elevation="2"
                                                            raised
                                                            variant="outlined"
                                                            rounded="xl"
                                                            @click="openCreateUpdateData"
                                                        >Edit Selected</v-btn>
                                                    </div>
                                                </template>
                                                <template v-slot:tbody v-if="dataMetrics.length > 0">
                                                    <tr class="total_table table-body-back">
                                                        <td>-</td>
                                                        <td>Totals</td>
                                                        <td>${{ sumField }}</td>
                                                        <td>-</td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-app>
                                </div>
                            </div>
                        </div>
                    </v-app>
                </div>
                <div class="col" v-else>
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="chooseFile"  required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeImportCsvModal">Close</button>
                            <button type="submit" class="btn btn-primary" @click.prevent="importCsv">Import</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Bulk Edit Operation Cost</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeCreateUpdateData">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row" v-for="(item, index) in seletedForEdit" :key="index">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group date-picker-3 date-picker-disabled">
                                            <label class="form-control-label" for="input-username">Date</label>
                                            <datepicker :disabled="true" v-model="item.date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Amount</label>
                                            <input type="number" id="input-username"  :class="{'form-control': true}" placeholder="Add Amount" v-model="item.amount">
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <v-divider class="mt-0 mb-0"></v-divider>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="editSelected">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
// import moment from 'moment';
export default {
    components: {
        Datepicker
    },
    data() {
        return {
            hideShowLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
            searchInput: '',
            headers: [
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Amount', key: 'amount' },
                { title: 'Action', key: 'action' },
            ],
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            selected: [],
            selectedId: [],
            seletedForEdit: [],
            selectedFile: '',
            permissions: {}
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    watch: {
        selected(val) {
            this.selectedId = [];
            val.forEach((data) => {
                this.selectedId.push({id: data});
            })
        }
    },
    mounted() {
        this.getFixedMonthlyCostList();
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        // open/close bulk edition operation cost modal
        openCreateUpdateData() {
            window.$('#createUpdateData').modal('show');
            this.seletedForEdit = [];
            this.dataMetrics.forEach((val) => {
                this.selectedId.forEach((data) => {
                    if(data.id == val.id) {
                        this.seletedForEdit.push({
                            id: val.id,
                            date: new Date(val.date),
                            amount: val.amount
                        })
                    }
                })
            })
        },
        closeCreateUpdateData() {
            window.$('#createUpdateData').modal('hide');
            this.seletedForEdit = [];
        },
        // search costs from table
        searchCosts() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                       val.date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get all data of fixed monthly cost list
        getFixedMonthlyCostList() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/fixedMonthlyCost', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data.data;
                    this.dataMetricsFilter = getData.data.data;
                    this.permissions = getData.permission;
                    console.log(getData, 'getData');
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // delete selected items
        deleteSelected() {
            const confirmDelete = window.confirm('Do you really want to delete?');
            if(confirmDelete) {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/accounting/fixedMonthlyCost/deleteMutipleRows', {
                    id: JSON.stringify(this.selectedId)
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Record deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getFixedMonthlyCostList();
                        this.hideShowLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.hideShowLoader = false;
                });
            }
        },
        // edit bult selected items
        editSelected() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/fixedMonthlyCost/saveBulkEditOpsCost', {
                rowdata: JSON.stringify(this.seletedForEdit)
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Record updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.closeCreateUpdateData();
                    this.getFixedMonthlyCostList();
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // delete from table
        deleteData(id) {
            this.hideShowLoader = true;
            this.axios.delete(this.$api + '/accounting/fixedMonthlyCost/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Fixed monthly cost deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getFixedMonthlyCostList();
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // downloading csv
        downloadCsv() {
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'fixedMonthlyCost'
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
                console.log(error);
            });
        },
        // choose file and import csv
        importCsv() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/fixedMonthlyCost/importOpsCostCSV', {
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
                    this.getFixedMonthlyCostList();
                    this.hideShowLoader = false;
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
                this.hideShowLoader = false;
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
    button[disabled] {
        cursor: not-allowed !important;
    }
    a[disabled] {
        cursor: not-allowed !important;
    }
    .disable-button[disabled] {
        cursor: not-allowed;
    }
    .set-cursor:hover, .set-cursor {
        cursor: not-allowed !important;
    }
    .adding-font-size tbody tr td{
        font-size: 14px !important;
    }
</style>

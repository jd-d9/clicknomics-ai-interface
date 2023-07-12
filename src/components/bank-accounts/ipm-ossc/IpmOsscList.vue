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
                                    <li class="breadcrumb-item active" aria-current="page">OneSSCorp - Others Payment List</li>
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
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="openModal">Import CSV</router-link>
                            <router-link to="/bank_accounts/onesscorp/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="3">
                                                        <v-select solo :items="descriptionFilter" label="Description Filter" :clearable="true" v-model="descriptionValue" @update:modelValue="getOnessCorpReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex" cols="12" sm="3">
                                                        <v-select solo :items="recepientFilter" label="Recepient Type Filter" :clearable="true" v-model="recepientValue" @update:modelValue="getOnessCorpReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="3">
                                                        <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                                    </v-col>
                                                    <v-col class="d-flex search_width" cols="12" sm="3">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table class="table-hover-class table-with-checkbox" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                                <template v-slot:[`item.amount`]="{ item }">
                                                    <td>{{item.selectable.amount}}</td>
                                                    <!-- <td>{{item.selectable.amount | toCurrency}}</td> -->
                                                </template>
                                                <template v-slot:[`item.fees`]="{ item }">
                                                    <td>{{item.selectable.fees}}</td>
                                                    <!-- <td>{{item.selectable.fees | toCurrency}}</td> -->
                                                </template>
                                                <template v-slot:[`item.grandtotal`]="{ item }">
                                                    <td>{{item.selectable.grand_total}}</td>
                                                    <!-- <td>{{item.selectable.grand_total | toCurrency}}</td> -->
                                                </template>
                                                <template  v-slot:[`item.description`]="{ item }">
                                                    <td v-if="item.selectable.description.length > 50">{{item.selectable.description.substring(0,50)+'...'}}</td>
                                                    <td v-else>{{item.selectable.description}}</td>
                                                </template>
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <router-link to="" @click="edit(item.selectable.id)">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                        </router-link>
                                                        <router-link to="" @click="deleteData(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                        </router-link>
                                                        <router-link to="" @click="view(item.selectable.id)">
                                                            <img src="/assets/img/icons/eye.svg" class="icon-width">
                                                        </router-link>
                                                    </td>
                                                </template>
                                                <template v-slot:body v-if="dataMetrics.length > 0">
                                                    <tr class="total_table">
                                                        <td>Totals</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>{{ sumField }}</td>
                                                        <td>{{ sumFee }}</td>
                                                        <td>{{ sumGrandtotal }}</td>
                                                        <!-- <td>{{ sumField | toCurrency }}</td>
                                                        <td>{{ sumFee | toCurrency }}</td>
                                                        <td>{{ sumGrandtotal | toCurrency }}</td> -->
                                                        <td>-</td>
                                                    </tr>
                                                </template>
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty" @click="deleteSelected">
                                                            Remove Selected
                                                        </v-btn>
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
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import OneSSCorp - SX - Others Payment List</h5>
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
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/>
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
        <div class="modal fade" id="viewDetail" tabindex="-1" role="dialog" aria-labelledby="viewDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeViewModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Description :</span> {{viewModalDetail.description}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Recepient :</span> {{viewModalDetail.recepient}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{viewModalDetail.amount}}
                            <!-- <span class="font-weight-bold"> Amount :</span> {{viewModalDetail.amount | toCurrency}} -->
                        </p>
                        <p>
                            <span class="font-weight-bold"> Fees :</span> {{viewModalDetail.fees}}
                            <!-- <span class="font-weight-bold"> Fees :</span> {{viewModalDetail.fees | toCurrency}} -->
                        </p>
                        <p>
                            <span class="font-weight-bold"> Grand Total :</span> {{viewModalDetail.grandtotal}}
                            <!-- <span class="font-weight-bold"> Grand Total :</span> {{viewModalDetail.grandtotal | toCurrency}} -->
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from '../../common/DateRangePicker.vue';
import moment from 'moment';
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
        DateRangePicker
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
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Description ', key: 'description' },
                { title: 'Recepient ', key: 'recepient' },
                { title: 'Amount', key: 'amount' },
                { title: 'Fees', key: 'fees' },
                { title: 'Grand Total', key: 'grandtotal' },
                { title: 'Action', key: 'action' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            selected: [],
            viewModalDetail: {},
            currentItemsTable: [],
            itemsPerPage: -1,
            descriptionFilter: [],
            recepientFilter: [],
            descriptionValue: null,
            recepientValue: null,
            selectedFile: '',
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
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
        sumFee() {
            const key = 'fees';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumGrandtotal() {
            const key = 'grandtotal';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
    },
    mounted() {
        // const urlSearchParams = new URLSearchParams(window.location.search);
        // const params = Object.fromEntries(urlSearchParams.entries());
        // if(params.hasOwnProperty('month') && params.hasOwnProperty('year')) {
        //     const month = this.getMonthFromString(params.month);
        //     const year = parseInt(params.year);
        //     let startDate = new Date(year, month - 1, 1);
        //     let endDate = new Date(year, month, 0, 11, 59, 59, 999);
        //     this.dateRange.startDate = startDate;
        //     this.dateRange.endDate = endDate;
        // }

        // if(params.hasOwnProperty('startDate') && params.hasOwnProperty('endDate')) {
        //     this.dateRange.startDate = new Date(parseInt(params.startDate));
        //     this.dateRange.endDate = new Date(parseInt(params.endDate));
        //     if(params.hasOwnProperty('transactionType')) {
        //         this.transactionTypeValue = params.transactionType;
        //     }
        // }
        this.getOnessCorpReport();
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        openViewModal() {
            window.$('#viewDetail').modal('show');
        },
        closeViewModal() {
            window.$('#viewDetail').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getOnessCorpReport();
        },
        // get all data
        getOnessCorpReport() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/bank_account/onesscorp';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.descriptionValue) {
                queryString.set('descriptionValue', this.descriptionValue);
            }
            if(this.recepientValue) {
                queryString.set('recepientValue', this.recepientValue);
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            this.axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.dataMetrics = Data.data.data;
                    Data.allDescription.forEach((val) => {
                        this.descriptionFilter.push({
                            title: val.description
                        })
                    });
                    Data.allRecepient.forEach((val) => {
                        this.recepientFilter.push({
                            title: val.recepient
                        })
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // redirect to form component
        edit(id) {
            this.$router.push(`/bank_accounts/onesscorp/${id}/edit`);
        },
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/bank_account/onesscorp/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getOnessCorpReport();
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
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
        // delete multiple/selected
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('selectedRecord', JSON.stringify(multipleRow));
                this.axios.post(this.$api + '/bank_account/onesscorp/deleteMutipleRecord', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getOnessCorpReport();
                        this.$toast.open({
                            message: 'Records deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
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
        // download csv file
        downloadCsv() {
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'ipmonesscorp'
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
            this.axios.post(this.$api + '/bank_account/onesscorp/importIpmCSV', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getOnessCorpReport();
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
        // view details
        view(id) {
            this.viewModalDetail = this.dataMetrics.find((val) => {
                return val.id == id;
            });
            this.openViewModal();
        },
        // getMonthFromString(mon){
        //     return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
        // }
    }
}
</script>

<style scoped>

</style>

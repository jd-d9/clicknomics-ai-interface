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
                        <span>IPM Divvy Activity</span>
                        <v-spacer />

                        <div>
                            <v-btn @click.prevent="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>

                            <v-btn @click.prevent="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn to="/payment_methods/ipm-divvy-card/activity/create" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus" :disabled="permissions.create_auth == '0'">
                                Add New
                            </v-btn>
                        </div>      
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            IPM Divvy Activity List
                        </v-card-title>
                        <!-- tab panel title div -->
                        <div class="mt-4">
                            <v-tabs v-model="tabplumactivity" fixed-tabs bg-color="green-lighten-4" class="mb-3">
                                <v-tab value="activity" class="font-weight-bold" color="green-darken-4">Activity</v-tab>
                                <v-tab value="reports" class="font-weight-bold">Reports</v-tab>
                            </v-tabs>

                            <v-window v-model="tabplumactivity">
                                <v-window-item value="activity">
                                    <v-row class="d-flex align-center justify-end">
                                        <v-col class="font-medium font-weight-normal pr-0 text-right">
                                            <v-btn v-if="selected.length > 0" @click.prevent="deleteSelected" class="ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                                Remove Selected
                                            </v-btn>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal pr-0">
                                            <date-range-picker class="date_picker pt-2" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="cardMemberFilter" clearable variant="outlined" placeholder="Card Member Filter" @update:modelValue="getActivities" v-model="cardMemberValue"></v-select>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="merchantFilter" clearable variant="outlined" placeholder="Description Filter" @update:modelValue="getActivities" v-model="merchantValue"></v-select>
                                        </v-col>                                            
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="transactionTypeFilter" clearable variant="outlined" placeholder="Transaction Type Filter" @update:modelValue="getActivities" v-model="transactionTypeValue"></v-select>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal">
                                            <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                        </v-col>
                                    </v-row> 

                                    <!-- data table component -->
                                    <v-data-table class="table-hover-class mt-4" show-select :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                        <template v-slot:[`item.date`]="{ item }">
                                            {{ item.selectable.date ? item.selectable.date : '-' }}
                                        </template>
                                        <template v-slot:[`item.card`]="{ item }">
                                            {{ item.selectable.card ? item.selectable.card : '-' }}
                                        </template>
                                        <template v-slot:[`item.merchant`]="{ item }">
                                            {{ item.selectable.merchant ? item.selectable.merchant : '-' }}
                                        </template>
                                        <template v-slot:[`item.name`]="{ item }">
                                            {{ item.selectable.name ? item.selectable.name : '-' }}
                                        </template>
                                        <template v-slot:[`item.amount`]="{ item }">
                                            {{ $filters.toCurrency(item.selectable.amount) }}
                                        </template>
                                        <template v-slot:[`item.transaction_type`]="{ item }">
                                            {{ item.selectable.transaction_type ? item.selectable.transaction_type : '-' }}
                                        </template>
                                        <template v-slot:[`item.action`]="{ item }">    
                                            <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="edit(item.selectable.id, item.selectable)" :disabled="permissions.update_auth == '0'">
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
                                        <template v-slot:tbody v-if="dataMetrics.length > 0">
                                            <tr class="total_table table-body-back bg-blue-darken-2">
                                                <td></td>
                                                <td>Totals</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td class="text-center">{{ $filters.toCurrency(sumField) }}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-window-item>

                                <v-window-item value="reports">
                                    <v-row class="d-flex align-center justify-end ma-0">
                                        <v-spacer />
                                        <date-range-picker class="date_picker pt-2" :value="selectedRange" @update:value="updateRangeTwo"></date-range-picker>
                                        <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                            <v-select v-model="selectedtTransactionType" :items="items" chips multiple clearable variant="outlined" placeholder="Transaction Type Filter" @update:modelValue="getReports"></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="6" sm="6" md="4" lg="3" v-for="data of filterData" :key="data">
                                            <v-card class="card_design" :class="data.totalAmount == '0' ? 'bg-blue-lighten-4' : 'bg-green-lighten-4'">
                                                <v-card-title :class="data.totalAmount == '0' ? 'text-blue-darken-2' : 'text-green-darken-1'">
                                                    <p class="text-subtitle-2 font-weight-bold">{{data.card_member ? data.card_member : '-'}}</p>
                                                </v-card-title>
                                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="data.totalAmount == '0' ? 'text-blue-darken-2' : 'text-green-darken-1'">
                                                    {{ $filters.toCurrency(data.totalAmount) }}
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                            </v-window>
                        </div>
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

        <!-- import csv -->
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Import IPM Divvy Activity List</h5>
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
                                    <input name="Choosecsv" @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file"  required/>
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
    </div>
</template>

<script>
import axios from '@axios';
import moment from 'moment';
import DateRangePicker from '../../common/DateRangePicker.vue';
export default {
    components: {
        DateRangePicker,
    },
    data() {
        return{
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Date', sortable: false, key: 'date' },
                { title: 'Card', key: 'card' },
                { title: 'Merchant', key: 'merchant' },
                { title: 'Name ', key: 'name', align: 'center' },
                { title: 'Amount', key: 'amount', align: 'center' },
                { title: 'Transaction Type', key: 'transaction_type', align: 'center' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            cardMemberValue: null,
            merchantValue: null,
            transactionTypeValue: null,
            selected: [],
            tabplumactivity: 'activity',
            viewModalDetail: {},
            currentItemsTable: [],
            itemsPerPage: -1,
            cardMemberFilter: [],
            merchantFilter: [],
            transactionTypeFilter: [],
            items: ['CREDIT','DEBIT'],
            selectedtTransactionType: ['CREDIT','DEBIT'],
            filterData: [],
            permissions: {},
            selectedFile: '',
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            selectedRangeTwo: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getActivities();
        this.getReports();
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getActivities();
        },
        updateRangeTwo(range) {
            this.selectedRangeTwo = range;
            this.getReports();
        },
        // get activities
        getActivities() {
            setTimeout(() => {
                this.showLoader = true;
                const queryString = new URLSearchParams();
                const ajaxUrl = this.$api + '/paymentMethod/paymentActivity/divvyActivity';
                if(this.selectedRange) {
                    queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                    queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
                }
                if(this.cardMemberValue) {
                    queryString.set('cardMemberValue', this.cardMemberValue);
                }
                if(this.merchantValue) {
                    queryString.set('merchantValue', this.merchantValue);
                }
                if(this.transactionTypeValue) {
                    queryString.set('transactionTypeValue', this.transactionTypeValue);
                }
                const url = `${ajaxUrl}?${queryString.toString()}`;
                axios.get(url, {
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
                        this.cardMemberFilter = [];
                        this.merchantFilter = [];
                        this.transactionTypeFilter = [];
                        getData.allCardMembers.forEach((val) => {
                            this.cardMemberFilter.push({
                                title: val.name
                            })
                        });
                        getData.allMerchant.forEach((val) => {
                            this.merchantFilter.push({
                                title: val.merchant
                            })
                        });
                        getData.allTransactionType.forEach((val) => {
                            this.transactionTypeFilter.push({
                                title: val.transaction_type
                            })
                        });
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
            }, 100);
        },
        // set transaction type value
        setTransactionType() {
            if(this.selectedtTransactionType.length == 2) {
                return 'ALL';
            } if(this.selectedtTransactionType.length == 1) {
                return this.selectedtTransactionType[0];
            } if(this.selectedtTransactionType.length == 0) {
                return '';
            }
        },
        // get reports data
        getReports() {
            setTimeout(() => {
                this.showLoader = true;
                axios.post(this.$api + '/paymentMethod/paymentActivity/divvyActivitys/filter', {
                    startDate: moment(this.selectedRangeTwo.split('-').shift()).format('DD-MM-YYYY'),
                    endDate: moment(this.selectedRangeTwo.split('-').pop()).format('DD-MM-YYYY'),
                    transactionTypeValue: this.setTransactionType()
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.filterData = response.data.data;
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
            }, 100);
        },
        // edit item
        edit(id, data) {
            localStorage.setItem('editData', JSON.stringify(data));
            this.$router.push(`/payment_methods/ipm-divvy-card/activity/${id}/edit`);
        },
        // delete selected data/multiple data
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('selectedRow', JSON.stringify(multipleRow));
                axios.post(this.$api + '/paymentMethod/paymentActivity/divvyActivitys/deleteMutipleRows', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getActivities();
                        this.selected = [];
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
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
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/paymentMethod/paymentActivity/divvyActivity/' + id, {
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
                        this.getActivities();
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
            }
        },
        // downloading csv
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'divvyActivity'
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
                this.message = {
                    text: response.data.message,
                    type: 'success',
                }
                this.$eventBus.emit('flash-message', this.message, '');
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
            axios.post(this.$api + '/paymentMethod/paymentActivity/divvyActivitys/importCSV', {
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
                    this.getActivities();
                    this.showLoader = false;
                    this.selectedFile = '';
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
        }
    },
}
</script>
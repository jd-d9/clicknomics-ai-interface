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
                            <span>RM AMEX Plum Activity</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" v-if="showImportIcon" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden && showImportIcon">
                            <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn to="" @click.prevent="addNew" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus"  :disabled="permissions.create_auth == '0'">
                                Add New
                            </v-btn>
                        </div>      
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            RM AMEX Plum Activity List
                            <!-- tab panel title div -->
                            <div class="mt-4">
                                <v-tabs v-model="tabplumactivity" fixed-tabs bg-color="green-lighten-4" class="mb-3">
                                    <v-tab value="activity" class="font-weight-bold" color="green-darken-4" @click.prevent="showImportIcon = true">Activity</v-tab>
                                    <v-tab value="reports" class="font-weight-bold" @click.prevent="getReports">Reports</v-tab>
                                </v-tabs>

                                <v-window v-model="tabplumactivity">
                                    <v-window-item value="activity" class="tab_responsive">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-col class="font-medium font-weight-normal text-right pr-0" v-if="selected.length > 0" >
                                                <v-btn v-if="selected.length > 0" @click.prevent="deleteSelected" class="ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                                    Remove Selected
                                                </v-btn>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal pr-0">
                                                <date-range-picker class="date_picker pt-2" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal pr-0 v_select_design">
                                                <v-select :items="cardMemberFilter" clearable variant="outlined" placeholder="Card Member Filter" @update:modelValue="getActivities" v-model="cardMemberValue"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal pr-0 v_select_design">
                                                <v-select :items="descriptionFilter" clearable variant="outlined" placeholder="Description Filter" @update:modelValue="getActivities" v-model="descriptionValue"></v-select>
                                            </v-col>                                            
                                            <v-col class="font-medium font-weight-normal pr-0 v_select_design">
                                                <v-select :items="transactionTypeFilter" clearable variant="outlined" placeholder="Transaction Type Filter" @update:modelValue="getActivities" v-model="transactionTypeValue"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal">
                                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                            </v-col>
                                        </v-row> 

                                        <!-- data table component -->
                                        <v-data-table class="table-hover-class mt-4" show-select :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                                            <template v-slot:[`item.date`]="{ item }">
                                                {{ item.selectable.date ? item.selectable.date : '-' }}
                                            </template>
                                            <template v-slot:[`item.description`]="{ item }">
                                                {{ item.selectable.description ? item.selectable.description : '-' }}
                                            </template>
                                            <template v-slot:[`item.card_member`]="{ item }">
                                                {{ item.selectable.card_member ? item.selectable.card_member : '-' }}
                                            </template>
                                            <template v-slot:[`item.account`]="{ item }">
                                                {{ item.selectable.account ? item.selectable.account : '-' }}
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
                                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
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
                                        <v-row class="d-flex align-center justify-end">
                                            <v-col cols="12" lg="4" md="4" sm="12" class="font-medium font-weight-normal">
                                                <date-range-picker class="date_picker pt-2" :value="selectedRangeTwo" @update:value="updateRangeTwo"></date-range-picker>
                                            </v-col>                                        
                                            <v-col cols="12" lg="4" md="4" sm="12" class="font-medium font-weight-normal v_select_design">
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
                        </v-card-title>
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
                        <h5 class="modal-title">Import RM AMEX Plum Activity List</h5>
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
import DateRangePicker from '../common/DateRangePicker.vue';
export default {
    components: {
        DateRangePicker,
    },
    data() {
        return{
            showLoader: false,
            showImportIcon: true,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Date', sortable: false, key: 'date' },
                { title: 'Description', key: 'description' },
                { title: 'Card Member', key: 'card_member' },
                { title: 'Account ', key: 'account', align: 'center' },
                { title: 'Amount', key: 'amount', align: 'center' },
                { title: 'Transaction Type', key: 'transaction_type', align: 'center' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            cardMemberValue: null,
            descriptionValue: null,
            transactionTypeValue: null,
            selected: [],
            tabplumactivity: 'activity',
            currentItemsTable: [],
            itemsPerPage: -1,
            cardMemberFilter: [],
            descriptionFilter: [],
            transactionTypeFilter: [],
            items: [ 'CREDIT','DEBIT'],
            selectedtTransactionType: [ 'CREDIT','DEBIT'],
            filterData: [],
            permissions: {},
            selectedFile: '',
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            selectedRangeTwo: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            isHidden: false,
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getActivities();
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null);
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
                const ajaxUrl = this.$api + '/paymentMethod/paymentActivity/rmAmexPlumActivity';
                if(this.selectedRange) {
                    queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                    queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
                }
                if(this.cardMemberValue) {
                    queryString.set('cardMemberValue', this.cardMemberValue);
                }
                if(this.descriptionValue) {
                    queryString.set('descriptionValue', this.descriptionValue);
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
                        this.descriptionFilter = [];
                        this.transactionTypeFilter = [];
                        getData.allCardMembers.forEach((val) => {
                            this.cardMemberFilter.push({
                                title: val.card_member
                            })
                        });
                        getData.allDescription.forEach((val) => {
                            this.descriptionFilter.push({
                                title: val.description
                            })
                        });
                        getData.allTransactionType.forEach((val) => {
                            this.transactionTypeFilter.push({
                                title: val.transaction_type
                            })
                        });
                        const currentItems = {
                            itemsPerPage: -1
                        };
                        this.currentItems(currentItems);
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
            this.showImportIcon = false;
            setTimeout(() => {
                this.showLoader = true;
                axios.post(this.$api + '/paymentMethod/paymentActivity/rmAmexPlumActivitys/filter', {
                    startDate: moment(this.selectedRangeTwo.split('-').shift()).format('DD-MM-YYYY'),
                    endDate: moment(this.selectedRangeTwo.split('-').pop()).format('DD-MM-YYYY'),
                    transaction_type: this.setTransactionType()
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
            localStorage.setItem('breadCrumbMessage', 'RM AMEX Plum Activity');
            this.$router.push(`/payment_methods/rm-amex-plum-card/activity/${id}/edit`);
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
                axios.post(this.$api + '/paymentMethod/paymentActivity/rmAmexPlumActivitys/deleteMutipleRows', formData, {
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
                axios.delete(this.$api + '/paymentMethod/paymentActivity/rmAmexPlumActivity/' + id, {
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
        // upload csv file
        uploadCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/paymentMethod/paymentActivity/rmAmexPlumActivitys/importCSV', {
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
        // add new payment
        addNew() {
            localStorage.setItem('breadCrumbMessage', 'RM AMEX Plum Activity');
            this.$router.push('/payment_methods/rm-amex-plum-card/activity/create');
        },
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.dataMetrics.filter((val) => {
                    return val.date && val.date.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase()) ||
                           val.card_member && val.card_member.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.description && val.description.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.account && val.account.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.transaction_type && val.transaction_type.toLowerCase().includes(this.search.toLowerCase())
                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.dataMetrics;
            }
            else {
                const data = this.dataMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
        },
    },
}
</script>
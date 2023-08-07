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
                        <span>IPM PayPal Payment</span>
                        <v-spacer/>
                        <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/bank_accounts/ipm-paypal/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus" :disabled="permissions.create_auth == '0'">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    IPM PayPal Payment List
                                </v-col>
                            </v-row>                            
                            <v-row class="d-flex align-center justify-end">
                                <div v-if="selected.length > 0" class="mr-2">
                                    <v-btn @click="deleteSelected" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                        Remove Selected
                                    </v-btn>
                                </div>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="nameFilter" clearable variant="outlined" placeholder="Name Filter" v-model="nameValue" @update:modelValue="getPaypalPaymentsReport"></v-select>
                                </v-col>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="typeFilter" clearable variant="outlined" placeholder="Type Filter" v-model="typeValue" @update:modelValue="getPaypalPaymentsReport"></v-select>
                                </v-col>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="statusFilter" clearable variant="outlined" placeholder="Status Filter" v-model="statusValue" @update:modelValue="getPaypalPaymentsReport"></v-select>
                                </v-col>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="transactionTypeFilter" clearable variant="outlined" placeholder="Transaction Type Filter" v-model="transactionTypeValue" @update:modelValue="getPaypalPaymentsReport"></v-select>
                                </v-col>
                                <v-col class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.date`]="{ item }">
                                {{item.selectable.date ? item.selectable.date : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.type`]="{ item }">
                                {{item.selectable.type ? item.selectable.type : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                {{item.selectable.status ? item.selectable.status : '-'}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                {{$filters.toCurrency(item.selectable.amount)}}
                            </template>
                            <template v-slot:[`item.from_email_address`]="{ item }">
                                {{item.selectable.from_email_address ? item.selectable.from_email_address : '-'}}
                            </template>
                            <template v-slot:[`item.to_email_address`]="{ item }">
                                {{item.selectable.to_email_address ? item.selectable.to_email_address : '-'}}
                            </template>
                            <template v-slot:[`item.transaction_type`]="{ item }">
                                {{item.selectable.transaction_type ? item.selectable.transaction_type : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="this.$router.push(`/bank_accounts/ipm-paypal/${item.selectable.id}/edit`)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>  
                            </template>
                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ $filters.toCurrency(sumField) }}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import IPM PayPal Payment List</h5>
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
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from '../../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker
    },
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Name', key: 'name' },
                { title: 'Type', key: 'type' },
                { title: 'Status ', key: 'status' },
                { title: 'Amount', key: 'amount' },
                { title: 'From Email Address', key: 'from_email_address' },
                { title: 'To Email Address', key: 'to_email_address' },
                { title: 'Transaction Type', key: 'transaction_type' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            nameFilter: [],
            nameValue: null,
            typeFilter: [],
            typeValue: null,
            statusFilter: [],
            statusValue: null,
            transactionTypeFilter: [],
            transactionTypeValue: null,
            selected: [],
            viewModalDetail: {},
            currentItemsTable: [],
            itemsPerPage: -1,
            descriptionFilter: [],
            recepientFilter: [],
            descriptionValue: null,
            recepientValue: null,
            permissions: {},
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
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if(params.startDate && params.endDate) {
            this.selectedRange = `${moment(new Date(parseInt(params.startDate))).format('ddd MMM DD YYYY')} - ${moment(new Date(parseInt(params.endDate))).format('ddd MMM DD YYYY')}`
        }
        this.getPaypalPaymentsReport();
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null) ;
            window.$('#exampleModalCenter').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getPaypalPaymentsReport();
        },
        // get all data
        getPaypalPaymentsReport() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/bank_account/payPalPayment';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.nameValue) {
                queryString.set('nameValue', this.nameValue);
            }
            if(this.statusValue) {
                queryString.set('statusValue', this.statusValue);
            }
            if(this.typeValue) {
                queryString.set('typeValue', this.typeValue);
            }
            if(this.transactionTypeValue) {
                queryString.set('transactionTypeValue', this.transactionTypeValue);
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
                    this.statusFilter = [];
                    this.nameFilter = [];
                    this.transactionTypeFilter = [];
                    this.typeFilter = [];
                    getData.allName.forEach((val) => {
                        this.nameFilter.push({
                            title: val.name
                        })
                    });
                    getData.allStatus.forEach((val) => {
                        this.statusFilter.push({
                            title: val.status
                        })
                    });
                    getData.allTransactionType.forEach((val) => {
                        this.transactionTypeFilter.push({
                            title: val.transaction_type
                        })
                    });
                    getData.allType.forEach((val) => {
                        this.typeFilter.push({
                            title: val.type
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
        },
        // redirect to form component
        edit(id) {
            this.$router.push(`/bank_accounts/onesscorp/${id}/edit`);
        },
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/bank_account/payPalPayment/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getPaypalPaymentsReport();
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
                axios.post(this.$api + '/bank_account/payPalPayment/deleteMutipleRecord', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getPaypalPaymentsReport();
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
        // download csv file
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'ipmpaypal'
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
            axios.post(this.$api + '/bank_account/payPalPayment/importIpmCSV', {
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
                    this.getPaypalPaymentsReport();
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
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.dataMetrics.filter((val) => {
                    return val.date && val.date.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase()) ||
                           val.name && val.name.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.status && val.status.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.type && val.type.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.transaction_type && val.transaction_type.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.from_email_address && val.from_email_address.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.to_email_address && val.to_email_address.toLowerCase().includes(this.search.toLowerCase())
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
    }
}
</script>

<style scoped>

</style>

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
                        <span>Ipm Sxm Payment</span>
                        <v-spacer />
                        <v-btn @click.prevent="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/bank_accounts/ipm-sxm/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus" :disabled="permissions.create_auth == '0'">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Ipm Sxm Payment List
                            <v-spacer></v-spacer>
                            <div v-if="selected.length > 0" class="mr-2">
                                <v-btn @click="deleteSelected" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                    Remove Selected
                                </v-btn>
                            </div>
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                <v-select :items="descriptionFilter" clearable variant="outlined" placeholder="Description Filter" v-model="descriptionValue" @update:modelValue="getSxmReport"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.date`]="{ item }">
                                {{item.selectable.date ? item.selectable.date : '-'}}
                            </template>
                            <template  v-slot:[`item.description`]="{ item }">
                                <div v-if="item.selectable.description.length > 50">
                                    {{item.selectable.description ? item.selectable.description.substring(0,50)+'...' : '-'}}
                                </div>
                                <div v-else>{{item.selectable.description ? item.selectable.description : '-'}}</div>
                            </template>
                            <template v-slot:[`item.receipent`]="{ item }">
                                {{item.selectable.receipent ? item.selectable.receipent : '-'}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                {{$filters.toCurrency(item.selectable.amount)}}
                            </template>
                            <template v-slot:[`item.fees`]="{ item }">
                                {{$filters.toCurrency(item.selectable.fees)}}
                            </template>
                            <template v-slot:[`item.grandtotal`]="{ item }">
                                {{$filters.toCurrency(item.selectable.grandtotal)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="this.$router.push(`/bank_accounts/ipm-sxm/${item.selectable.id}/edit`)" :disabled="permissions.update_auth == '0'">
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
                                
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click.prevent="view(item.selectable.id)" :disabled="permissions.view == '0'">
                                    <v-icon color="deep-purple-darken-4">
                                        mdi-eye
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                                </v-btn>  
                            </template>
                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ $filters.toCurrency(sumField) }}</td>
                                    <td>{{ $filters.toCurrency(sumFee) }}</td>
                                    <td>{{ $filters.toCurrency(sumGrandtotal) }}</td>
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import OneSSCorp - SX - Others Payment List</h5>
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
        <div class="modal fade" id="viewDetail" tabindex="-1" role="dialog" aria-labelledby="viewDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeViewModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date ? viewModalDetail.date : '-'}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Description :</span> {{viewModalDetail.description ? viewModalDetail.description : '-'}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Recepient :</span> {{viewModalDetail.recepient ? viewModalDetail.recepient : '-'}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{$filters.toCurrency(viewModalDetail.amount)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Fees :</span> {{$filters.toCurrency(viewModalDetail.fees)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Grand Total :</span> {{$filters.toCurrency(viewModalDetail.grandtotal)}}
                        </p>
                    </div>
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
                { title: 'Description ', key: 'description' },
                { title: 'Recepient ', key: 'recepient' },
                { title: 'Amount', key: 'amount' },
                { title: 'Fees', key: 'fees' },
                { title: 'Grand Total', key: 'grandtotal' },
                { title: 'Action', key: 'action', align: 'center' },
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
        },
        sumFee() {
            const key = 'fees';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumGrandtotal() {
            const key = 'grandtotal';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
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
        this.getSxmReport();
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
        openViewModal() {
            window.$('#viewDetail').modal('show');
        },
        closeViewModal() {
            window.$('#viewDetail').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getSxmReport();
        },
        // get all data
        getSxmReport() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/bank_account/sxMedia';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.descriptionValue) {
                queryString.set('descriptionValue', this.descriptionValue);
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
                    this.descriptionFilter = [];
                    getData.allDescription.forEach((val) => {
                        this.descriptionFilter.push({
                            title: val.description
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
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/bank_account/sxMedia/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getSxmReport();
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
                axios.post(this.$api + '/bank_account/sxMedia/deleteMutipleRecord', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.getSxmReport();
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
                filename: 'ipmBankSX'
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
            axios.post(this.$api + '/bank_account/sxMedia/importIpmCSV', {
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
                    this.getSxmReport();
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
        // view details
        view(id) {
            this.viewModalDetail = this.dataMetrics.find((val) => {
                return val.id == id;
            });
            this.openViewModal();
        },
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.dataMetrics.filter((val) => {
                    return val.date && val.date.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase()) ||
                           val.description && val.description.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.recepient && val.recepient.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.grandtotal && val.grandtotal.toString().includes(this.search.toLowerCase()) ||
                           val.fees && val.fees.toString().includes(this.search.toLowerCase())
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

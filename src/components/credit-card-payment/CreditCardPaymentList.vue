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
                        <span>Credit Cards Payments</span>

                        <v-spacer />
                        <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/accounting/creditCardPayments/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    Credit Cards Payments
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <select v-model="fromAccount" @change="filterFromAccount" class="form-control serch_table">
                                        <option disabled selected>From Account Filter</option>
                                        <option :value="val.title" v-for="(val, index) of fromAccountFilter" :key="index">
                                            {{ val.title }}
                                        </option>
                                    </select>
                                    <!-- <v-select clearable variant="solo" placeholder="From Account Filter"  :items="fromAccountFilter" v-model="fromAccount" @update:modelValue="filterFromAccount"
                                    ></v-select>-->
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <select v-model="toAccount" @change="filterToAccount" class="form-control serch_table">
                                        <option disabled selected>To Account Filter</option>
                                        <option :value="val.title" v-for="(val, index) of toAccountFilter" :key="index">
                                            {{ val.title }}
                                        </option>
                                    </select>
                                    <!-- <v-select clearable variant="solo" label="To Account Filter"  :items="toAccountFilter" v-model="toAccount" @update:modelValue="filterToAccount"></v-select> -->
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchPayments"/>
                                </v-col>
                            </v-row>                          
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />

                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="creditCardPaymentList" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.payment_date`]="{ item }">
                                {{item.selectable.payment_date}}
                            </template>
                            <template v-slot:[`item.from_account`]="{ item }">
                                {{item.selectable.from_account}}
                            </template>
                            <template v-slot:[`item.to_account`]="{ item }">
                                {{item.selectable.to_account}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                ${{item.selectable.amount}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                {{item.selectable.status}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon  @click.prevent="this.$router.push('/accounting/creditCardPayments/' + item.selectable.id + '/edit')" :disabled="permissions.update_auth == '0'">
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
                            <template v-slot:tbody v-if="creditCardPaymentList.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>${{ sumField }}</td>
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

        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Credit Card Payments List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form @submit="importCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="chooseFile" name="Choosecsv" title="Choose CSV" class="inputFile form-control-file" accept=".csv" type="file" required/>
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
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker,
    },
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            showLoader: false,
            creditCardPaymentList: [],
            creditCardPaymentFilter: [],
            permissions: {},
            search: '',
            headers: [
                { title: 'Payment ID', key: 'id' },
                { title: 'Payment Date', align: 'start', sortable: true, key: 'payment_date' },
                { title: 'From Account', align: 'start', sortable: true, key: 'from_account' },
                { title: 'To Account', align: 'start', sortable: true, key: 'to_account' },
                { title: 'Amount', align: 'start', sortable: true, key: 'amount' },
                { title: 'Status', align: 'start', sortable: true, key: 'status' },
                { title: 'Action', align: 'center', key: 'action' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            selectedFile: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            fromAccountFilter: [],
            fromAccount: null,
            toAccountFilter: [],
            toAccount: null,
            searchInput: '',
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
    mounted() {
        this.getCreditCardPaymentList();
    },
    computed: {
        // total row
        sumField() {
            const key = 'amount';
            return this.creditCardPaymentList.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        }
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
            this.getCreditCardPaymentList();
        },
        // search payment from table
        searchPayments() {
            this.creditCardPaymentList = this.creditCardPaymentFilter.filter((val) => {
                return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.from_account.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.to_account.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.status.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.payment_date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // from account list filtering
        filterFromAccount() {
            if(this.fromAccount == null) {
                this.creditCardPaymentList = this.creditCardPaymentFilter;
            }
            else {
                this.creditCardPaymentList = this.creditCardPaymentFilter.filter((val) => {
                    return val.from_account == this.fromAccount;
                })
            }
        },
        // to account list filtering
        filterToAccount() {
            if(this.toAccount == null) {
                this.creditCardPaymentList = this.creditCardPaymentFilter;
            }
            else {
                this.creditCardPaymentList = this.creditCardPaymentFilter.filter((val) => {
                    return val.to_account == this.toAccount;
                })
            }
        },
        // get credit card payment list 
        getCreditCardPaymentList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/creditCardPayments';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            this.axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.creditCardPaymentList = getData.data;
                    this.creditCardPaymentFilter = getData.data;
                    this.permissions = getData.permission;
                    response.data.allfromAccount.forEach((val) => {
                        this.fromAccountFilter.push({
                            title: val.from_account,
                        })
                    });
                    response.data.alltoAccount.forEach((val) => {
                        this.toAccountFilter.push({
                            title: val.to_account,
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
        // delete card payment list 
        deleteData(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/accounting/creditCardPayments/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Credit Card Payment Deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getCreditCardPaymentList();
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
            // /admin/img/doc/ipm-credit-card-payment-demo.csv
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'creditCardPayments'
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
        importCsv() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/creditCardPayments/importCreditCardPayment', {
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
                    this.getCreditCardPaymentList();
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

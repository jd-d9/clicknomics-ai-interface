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
                                    <li class="breadcrumb-item active" aria-current="page">Credit Cards Payments</li>
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
                            <button @click.prevent="this.$router.push('/accounting/creditCardPayments/create')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add New Record</button>
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
                                                <!-- <v-spacer></v-spacer> -->
                                                <v-row class=" align-items-center">
                                                    <v-col class="d-flex" cols="12" sm="3">
                                                        <div class="select-network-filter">
                                                            <v-select
                                                            clearable
                                                            variant="solo"
                                                            label="From Account Filter" 
                                                            :items="fromAccountFilter"
                                                            v-model="fromAccount"
                                                            @update:modelValue="filterFromAccount"
                                                            ></v-select>
                                                        </div>
                                                    </v-col>
                                                    <v-col class="d-flex" cols="12" sm="3">
                                                        <div class="select-network-filter">
                                                            <v-select
                                                            clearable
                                                            variant="solo"
                                                            label="To Account Filter" 
                                                            :items="toAccountFilter"
                                                            v-model="toAccount"
                                                            @update:modelValue="filterToAccount"
                                                            ></v-select>
                                                        </div>
                                                    </v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="3">
                                                        <!-- <template>
                                                            <date-range-picker v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
                                                                <div slot="header" slot-scope="header" class="slot">
                                                                    <h3 class="m-0">Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                                                </div>
                                                                <template #input="picker" style="min-width: 350px;">
                                                                    {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                                                </template>/a>
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
                                                            </date-range-picker>
                                                        </template> -->
                                                    </v-col>
                                                    <div class="col-3 ms-auto">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <!-- data table component -->
                                            <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="creditCardPaymentList" :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.id}}</td>
                                                        <td>{{item.selectable.payment_date}}</td>
                                                        <td>{{item.selectable.from_account}}</td>
                                                        <td>{{item.selectable.to_account}}</td>
                                                        <td>${{item.selectable.amount }}</td>
                                                        <td>{{item.selectable.status}}</td>
                                                        <td>
                                                            <button @click.prevent="this.$router.push('/accounting/creditCardPayments/' + item.selectable.id + '/edit')" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/edit.svg" class="img-width">
                                                            </button>
                                                            <button @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/bin.svg" class="img-width">
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-slot:tbody v-if="creditCardPaymentList.length > 0">
                                                    <tr class="total_table table-body-back">
                                                        <td>Totals</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>${{ sumField }}</td>
                                                        <td>-</td>
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Credit Card Payments List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true">&times;</span>
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
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeImportCsvModal">Close</button>
                            <button type="submit" class="btn btn-primary">Import</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            hideShowLoader: false,
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
                { title: 'Action', key: '' },
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
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/creditCardPayments', {
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // delete card payment list 
        deleteData(id) {
            this.hideShowLoader = true;
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
                console.log(error);
                this.hideShowLoader = false;
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
                console.log(error);
            });
        },
        // choose file and import csv
        importCsv() {
            this.hideShowLoader = true;
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
    .img-width {
        width: 30px;
    }
</style>

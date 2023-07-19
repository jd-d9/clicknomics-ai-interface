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
                        <span>OneSSCorp - Others Payment</span>
                        <v-spacer />
                        <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/bank_accounts/onesscorp/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    OneSSCorp - Others Payment List
                                </v-col>
                            </v-row>                            
                            <v-row class="d-flex align-center justify-end">
                                <v-spacer></v-spacer>
                                <div v-if="selected.length > 0" class="mr-2">
                                    <v-btn @click="deleteSelected" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                        Remove
                                    </v-btn>
                                </div>
                                <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="descriptionFilter" clearable variant="outlined" placeholder="Description Filter" v-model="descriptionValue" @update:modelValue="getOnessCorpReport"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select :items="recepientFilter" clearable variant="outlined" placeholder="Recepient Type Filter" v-model="recepientValue" @update:modelValue="getOnessCorpReport"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal pr-0">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.amount`]="{ item }">
                                {{$filters.currencyUSD(item.selectable.amount)}}
                            </template>
                            <template v-slot:[`item.fees`]="{ item }">
                                {{$filters.currencyUSD(item.selectable.fees)}}
                            </template>
                            <template v-slot:[`item.grandtotal`]="{ item }">
                                {{$filters.currencyUSD(item.selectable.grand_total)}}
                            </template>
                            <template  v-slot:[`item.description`]="{ item }">
                                <div v-if="item.selectable.description.length > 50">
                                    {{item.selectable.description.substring(0,50)+'...'}}
                                </div>
                                <div v-else>{{item.selectable.description}}</div>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click="edit(item.selectable.id)">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click="deleteData(item.selectable.id)">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>  
                                
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click="view(item.selectable.id)">
                                    <v-icon color="deep-purple-darken-4">
                                        mdi-eye
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                                </v-btn>  
                            </template>
                            <template v-slot:tbody v-if="dataMetrics.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ $filters.currencyUSD(sumField) }}</td>
                                    <td>{{ $filters.currencyUSD(sumFee) }}</td>
                                    <td>{{ $filters.currencyUSD(sumGrandtotal) }}</td>
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
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Description :</span> {{viewModalDetail.description}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Recepient :</span> {{viewModalDetail.recepient}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{$filters.currencyUSD(viewModalDetail.amount)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Fees :</span> {{$filters.currencyUSD(viewModalDetail.fees)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Grand Total :</span> {{$filters.currencyUSD(viewModalDetail.grand_total)}}
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
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumFee() {
            const key = 'fees';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumGrandtotal() {
            const key = 'grand_total';
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

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if(params.startDate && params.endDate) {
            this.selectedRange = `${moment(new Date(parseInt(params.startDate))).format('ddd MMM DD YYYY')} - ${moment(new Date(parseInt(params.endDate))).format('ddd MMM DD YYYY')}`
            // console.log(this.selectedRange, '---- this.selectedRange -----');
            console.log(params.transactionType, 'params.transactionType ---');
        }
        this.getOnessCorpReport();
    },
    methods: {
        // currency(val) {
        //     return this.$filters.currency(val);
        // },
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
                    this.permissions = Data.permission;
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

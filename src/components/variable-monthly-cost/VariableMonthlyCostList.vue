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
                                    <li class="breadcrumb-item active" aria-current="page">Variable Monthly Cost List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <button @click.prevent="this.$router.push('/accounting/variableMonthlyCost/create')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add New Record</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-spacer></v-spacer>
                                                <v-row class="align-items-center">
                                                    <v-col class="d-flex" cols="12" sm="5"></v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <date-range-picker :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                                    </v-col>
                                                    <div class="col-3 ms-auto">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <!-- data table component -->
                                            <v-data-table class="table-hover-class" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.date}}</td>
                                                        <td>${{item.selectable.amount}}</td>
                                                        <td>{{item.selectable.notes ? item.selectable.notes : '-'}}</td>
                                                        <td>
                                                            <button @click.prevent="this.$router.push('/accounting/variableMonthlyCost/' + item.selectable.id + '/edit')" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                            </button>
                                                            <button @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-slot:tbody v-if="dataMetrics.length > 0">
                                                    <tr class="total_table table-body-back">
                                                        <td>Totals</td>
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
                <div class="col" v-if="permissions.view != '1' && !showLoader">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                        <form>
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
    </div>
</template>

<script>
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    component: {
        DateRangePicker,
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
            permissions: {},
            search: '',
            headers: [
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Amount', key: 'amount' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: '' },
            ],
            // dateRange: {startDate, endDate},
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            selectedRange: 'Thu Jun 15 2023 - Sun Jul 23 2023'
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    mounted() {
        this.getVariablePaymentList();
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getVariablePaymentList();
        },
        // search payment from table
        searchPayments() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.notes && val.notes.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get variable payment list
        getVariablePaymentList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/variableCost';
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
                    const allData = response.data;
                    this.dataMetrics = allData.data.data;
                    this.dataMetricsFilter = allData.data.data;
                    this.permissions = allData.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // delete variable monthly cost
        deleteData(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/accounting/variableCost/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Variable monthly cost deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getVariablePaymentList();
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        }
    }
}
</script>

<style scoped>
    .icon-width {
        width: 30px;
    }
</style>

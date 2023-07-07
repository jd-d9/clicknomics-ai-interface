<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-4 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Team Member Payments</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-8 text-right" v-if="showImportIcon">
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="downloadCsv">
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" data-target="#importCsvModal" class="btn btn-lg btn-neutral btn_animated" @click="openImportCsvModal">Import CSV</router-link>
                            <router-link to="" data-target="#fromAccountModal" class="btn btn-lg btn-neutral btn_animated" @click.prevent="openFromAccountModal">Add From Account</router-link>
                            <router-link to="" data-target="#teamMemberModal" class="btn btn-lg btn-neutral btn_animated" @click.prevent="openTeamMemberModal">Add To Account</router-link>
                            <button @click.prevent="this.$router.push('/accounting/teamMembersPayments/create')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add New Record</button>
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
                            <div class="card-header">
                                <div class="nav-wrapper report_tabpanel">
                                    <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-icons-text" role="tablist">
                                        <li class="nav-item">
                                            <router-link to="" class="nav-link mb-sm-3 mb-md-0 active" id="tabs-icons-text-3-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-3" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false" @click="this.showImportIcon = true">
                                                <span class="btn-inner--text">Payments</span>
                                            </router-link>
                                        </li>
                                        <li class="nav-item">
                                            <router-link to="" class="nav-link mb-sm-4 mb-md-0" id="tabs-icons-text-4-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-4" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false" @click="genrateTeamMembersPaymentsReport">
                                                <span class="btn-inner--text">Reports</span>
                                            </router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="finance_data tab-content myTabContent"> <!-- v-if="type == 'Listing'" -->
                                    <div class="tab-pane fade show active" id="tabs-icons-text-3" role="tabpanel" aria-labelledby="tabs-icons-text-3-tab">
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
                                                                item-value="key"
                                                                v-model="fromAccount"
                                                                @update:modelValue="getTeamMemberPaymentList"
                                                                ></v-select>
                                                                <!-- <v-select solo :items="fromAccountFilter" label="From Account Filter" :clearable="true" v-model="fromAccount" @change="getTeamMembersPaymentsList"></v-select> -->
                                                            </div>
                                                        </v-col>
                                                        <v-col class="d-flex" cols="12" sm="3">
                                                            <div class="select-network-filter">
                                                                <v-select
                                                                clearable
                                                                variant="solo"
                                                                label="To Account Filter" 
                                                                :items="toAccountFilter"
                                                                item-value="key"
                                                                v-model="toAccount"
                                                                @update:modelValue="getTeamMemberPaymentList"
                                                                ></v-select>
                                                            </div>
                                                        </v-col>
                                                        <v-col class="d-flex justify-content-end" cols="12" sm="3">
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
                                                <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="teamMemberPaymentList" :itemsPerPage="itemsPerPage">
                                                    <template v-slot:item="{ item }">
                                                        <tr class="table-body-back">
                                                            <td>{{item.selectable.id}}</td>
                                                            <td>{{item.selectable.payment_date}}</td>
                                                            <td>{{item.selectable.fromaccountlist.team_member_name}}</td>
                                                            <td>{{item.selectable.toaccountlist.team_member_name}}</td>
                                                            <td>${{item.selectable.amount }}</td>
                                                            <td>{{item.selectable.status}}</td>
                                                            <td>
                                                                <button @click.prevent="this.$router.push('/accounting/teamMembersPayments/'+ item.selectable.id +'/edit')" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                    <img src="/assets/img/icons/edit.svg" class="img-width">
                                                                </button>
                                                                <button @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                                    <img src="/assets/img/icons/bin.svg" class="img-width">
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                    <template v-slot:tbody v-if="teamMemberPaymentList.length > 0">
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
                                    <div class="tab-pane fade show" id="tabs-icons-text-4" role="tabpanel" aria-labelledby="tabs-icons-text-4-tab">
                                        <v-app>
                                            <v-card>
                                                <v-card-title>
                                                    <v-row>
                                                        <v-col class="d-flex justify-content-center" cols="12" sm="12">
                                                            <date-range-picker :value="selectedRangeTwo" @update:value="updateRangeTwo"></date-range-picker>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-title>
                                                <div class="row m-auto pt-3" v-if="cardMemberList.length > 0">
                                                    <div class="col-md-3 py-0 dashboard_card" v-for="(item, index) in cardMemberList" :key="index">
                                                        <div class="card card-stats add-border">
                                                            <h5 class="card-title m-0 p-0">
                                                                <div class="row m-0">
                                                                    <div class="col-md-12 add-background py-3">
                                                                        FROM: {{item.from_account}}
                                                                    </div>
                                                                    <div class="col-md-12 add-background-two py-3">
                                                                        TO: {{item.to_account}}
                                                                    </div>
                                                                </div>
                                                            </h5>
                                                            <div class="card-body">
                                                                <h2 class="font-weight-bold mb-0">{{item.total_amount}}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row m-auto" v-else>
                                                    <div class="col-md-12 text-center">
                                                        <div>
                                                            No data available
                                                        </div>
                                                    </div>
                                                </div>
                                            </v-card>
                                        </v-app>
                                    </div>
                                </div>
                                <div class="d-none">    <!-- v-else -->
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex justify-content-center" cols="12" sm="12">
                                                        <!-- <template>
                                                            <date-range-picker class="report" v-model="dateRangeTabReport" format="mm/dd/yyyy" @update="checkOpenPickerTabReport">
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
                                                        </template> -->
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <template>
                                                <div class="row m-auto pt-3" v-if="cardMemberList.length > 0">
                                                    <div class="col-md-3 py-0 dashboard_card" v-for="(item, index) in cardMemberList" :key="index">
                                                        <div class="card card-stats add-border">
                                                            <h5 class="card-title m-0 p-0">
                                                                <div class="row m-0">
                                                                    <div class="col-md-12 add-background py-3">
                                                                        FROM: {{item.from_account}}
                                                                    </div>
                                                                    <div class="col-md-12 add-background-two py-3">
                                                                        TO: {{item.to_account}}
                                                                    </div>
                                                                </div>
                                                            </h5>
                                                            <div class="card-body">
                                                                <h2 class="font-weight-bold mb-0">{{item.total_amount}}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row m-auto" v-else>
                                                    <div class="col-md-12 text-center">
                                                        <div>
                                                            No data available
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
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
        <!-- import csv -->
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Team Member Payments List</h5>
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
                                    <input name="Choosecsv" @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file"  required/>
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
        <!-- Add Team Members -->
        <div class="modal fade" id="teamMemberModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Add To Account</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeTeamMemberModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <Form @submit="addToAccount" :validation-schema="toAccSchema" v-slot="{ errors }">
                        <div class="modal-body">
                            <Field name="toAccName" type="text" id="input-username" :class="{'form-control': true, 'border-red-600': errors.toAccName}" placeholder="Name" v-model="teamMemberName"/>
                            <span class="text-red-600" v-if="errors.toAccName">Name can not be empty</span>
                            <!-- <ErrorMessage class="text-red-600" name="toAccName"/> -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeTeamMemberModal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        <!-- Add From Account -->
        <div class="modal fade" id="fromAccountModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Add From Account</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeFromAccountModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <Form @submit="addFromAccount" :validation-schema="fromAccSchema" v-slot="{ errors }">
                        <div class="modal-body">
                            <Field type="text" name="fromAccName" id="input-username"  :class="{'form-control': true, 'border-red-600': errors.fromAccName}" placeholder="Name" v-model="teamMemberName"/>
                            <span class="text-red-600" v-if="errors.fromAccName">Name can not be empty</span>
                            <!-- <ErrorMessage class="text-red-600" name="Name"/> -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeFromAccountModal">Close</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    components: {
        Form, 
        Field,
        DateRangePicker
    },
    data() {
        return {
            showLoader: false,
            teamMemberPaymentList: [],
            teamMemberPaymentFilter: [],
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
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            teamMemberName: '',
            fromAccountFilter: [],
            fromAccount: null,
            toAccountFilter: [],
            toAccount: null,
            cardMemberList: [],
            showImportIcon: true,
            selectedFile: '',
            searchInput: '',
            selectedRange: 'Thu Jun 15 2023 - Sun Jul 23 2023',
            selectedRangeTwo: 'Thu Jun 15 2023 - Sun Jul 23 2023'
        }
    },
    computed: {
        fromAccSchema() {
            return yup.object({
                fromAccName: yup.string().required(),
            });
        },
        toAccSchema() {
            return yup.object({
                toAccName: yup.string().required(),
            });
        },
        // total row
        sumField() {
            const key = 'amount';
            return this.teamMemberPaymentList.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    mounted() {
        this.getTeamMemberPaymentList();
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        // open/close from account modal
        openFromAccountModal() {
            window.$('#fromAccountModal').modal('show');
        },
        closeFromAccountModal() {
            window.$('#fromAccountModal').modal('hide');
        },
        // open/close import csv modal
        openTeamMemberModal() {
            window.$('#teamMemberModal').modal('show');
        },
        closeTeamMemberModal() {
            window.$('#teamMemberModal').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getTeamMemberPaymentList();
        },
        // update date range
        updateRangeTwo(range) {
            this.selectedRangeTwo = range;
            this.genrateTeamMembersPaymentsReport();
        },
        // search payment from table
        searchPayments() {
            this.teamMemberPaymentList = this.teamMemberPaymentFilter.filter((val) => {
                return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.fromaccountlist.team_member_name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.toaccountlist.team_member_name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.status.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.payment_date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get team member payment details
        getTeamMemberPaymentList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/teamMemberPayment';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.fromAccount) {
                queryString.set('fromAccount', this.fromAccount)
            }
            if(this.toAccount) {
                queryString.set('toAccount', this.toAccount)
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
                    this.teamMemberPaymentList = allData.data.data;
                    this.teamMemberPaymentFilter = allData.data.data;
                    this.permissions = allData.permission;
                    this.fromAccountFilter = [];
                    allData.allfromAccount.forEach((val) => {
                        this.fromAccountFilter.push({
                            title: val.fromaccountlist.team_member_name,
                            key: val.fromaccountlist.id
                        })
                    });
                    this.toAccountFilter = [];
                    allData.alltoAccount.forEach((val) => {
                        this.toAccountFilter.push({
                            title: val.toaccountlist.team_member_name,
                            key: val.toaccountlist.id
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
        // delete team member payment
        deleteData(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/accounting/teamMemberPayment/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Team member payment deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getTeamMemberPaymentList();
                    this.showLoader = false;
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
        // adding to account
        addToAccount() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/teamMemberPayments/addToAccountMembers', {
                team_member_name: this.teamMemberName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Team member added',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeTeamMemberModal();
                    this.teamMemberName = '';
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
        // adding from account
        addFromAccount() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/teamMemberPayments/addFromAccountMembers', {
                team_member_name: this.teamMemberName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Team member added',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeFromAccountModal();
                    this.teamMemberName = '';
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
        // generate report
        genrateTeamMembersPaymentsReport() {
            this.showImportIcon = false;
            // window.$('a[data-bs-toggle="tab"]').on('shown.bs.tab', (e) =>  {
            //     console.log(this.showImportIcon, e.target, '111')
            //     if(window.$(e.target).attr('href') == '#tabs-icons-text-3') {
            //         console.log(this.showImportIcon, '222')
            //         this.showImportIcon = true;
            //     }else {
            //         console.log(this.showImportIcon, '333')
            //         this.showImportIcon = false;
            //     }
            // });
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/teamMemberPayments/genrateTeamMembersPaymentsReport', {
                startDate: moment(this.selectedRangeTwo.split('-').shift()).format('DD-MM-YYYY'),
                endDate: moment(this.selectedRangeTwo.split('-').pop()).format('DD-MM-YYYY'),
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.cardMemberList = response.data.data;
                    this.showLoader = false;
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
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'teamMembersPayments'
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
                    this.getTeamMemberPaymentList();
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

<style scoped>
    .img-width {
        width: 30px;
    }
    .active .btn-inner--text {
        color: white;
    }
    .add-border {
        border: 2px solid #005eb3;
    }
    .add-background {
        background: #005eb3;
    }
    .add-background-two {
        background: #05b675;
    }
</style>

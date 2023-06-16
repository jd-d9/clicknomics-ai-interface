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
                        <div class="col-lg-8 text-right">
                            <router-link to="/admin/img/doc/ipm-team-member-payment-demo.csv" class="btn btn-lg btn-neutral btn_animated" download>
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" data-target="#importCsvModal" class="btn btn-lg btn-neutral btn_animated" @click="openImportCsvModal">Import CSV</router-link>
                            <router-link to="" data-target="#fromAccountModal" class="btn btn-lg btn-neutral btn_animated" @click.prevent="openFromAccountModal">Add From Account</router-link>
                            <router-link to="" data-target="#teamMemberModal" class="btn btn-lg btn-neutral btn_animated" @click.prevent="openTeamMemberModal">Add To Account</router-link>
                            <router-link to="/accounting/teamMembersPayments/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <v-app>
                        <div class="card">
                            <div class="card-header">
                                <div class="nav-wrapper report_tabpanel">
                                    <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-icons-text" role="tablist">
                                        <li class="nav-item">
                                            <router-link to="" class="nav-link mb-sm-3 mb-md-0 active" id="tabs-icons-text-3-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-3" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false">
                                                <span class="btn-inner--text">Payments</span>
                                            </router-link>
                                        </li>
                                        <li class="nav-item">
                                            <router-link to="" class="nav-link mb-sm-4 mb-md-0" id="tabs-icons-text-4-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-4" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false"> <!-- @click="genrateTeamMembersPaymentsReport" -->
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
                                                                v-model="fromAccount"
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
                                                                ></v-select>
                                                            </div>
                                                        </v-col>
                                                        <v-col class="d-flex justify-content-end" cols="12" sm="3"></v-col>
                                                        <div class="col-3 ms-auto">
                                                            <div class="ms-auto search-input position-relative">
                                                                <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                            </div>
                                                        </div>
                                                    </v-row>
                                                </v-card-title>
                                                <!-- data table component -->
                                                <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="teamMemberPaymentList" @current-items="currentItems" :itemsPerPage="itemsPerPage">
                                                    <template v-slot:item="{ item }">
                                                        <tr>
                                                            <td>{{item.selectable.id}}</td>
                                                            <td>{{item.selectable.payment_date}}</td>
                                                            <td>{{item.selectable.from_account}}</td>
                                                            <td>{{item.selectable.to_account}}</td>
                                                            <td>{{item.selectable.amount }}</td>
                                                            <td>{{item.selectable.status}}</td>
                                                            <td>
                                                                <router-link :to="'accounting/teamMembersPayments/'+ item.selectable.id +'/edit'">
                                                                    <img src="/assets/img/icons/edit.svg" class="img-width">
                                                                </router-link>
                                                                <router-link to="" @click="deleteData(item.selectable.id)">
                                                                    <img src="/assets/img/icons/bin.svg" class="img-width">
                                                                </router-link>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                    <template v-slot:tbody v-if="teamMemberPaymentList.length > 0">
                                                        <tr class="total_table">
                                                            <td>Totals</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>{{ sumField }}</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                        </tr>
                                                    </template>
                                                    <!--  v-if="dataMetrics.length > 0" -->
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
                                                <div class="row m-auto pt-3">
                                                    <div class="col-md-3 py-0 dashboard_card">
                                                        <div class="card card-stats add-border">
                                                            <h5 class="card-title m-0 p-0">
                                                                <div class="row m-0">
                                                                    <div class="col-md-12 add-background py-3">
                                                                        FROM: item.from_account
                                                                    </div>
                                                                    <div class="col-md-12 add-background-two py-3">
                                                                        TO: item.to_account
                                                                    </div>
                                                                </div>
                                                            </h5>
                                                            <div class="card-body">
                                                                <h2 class="font-weight-bold mb-0">item.total_amount</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row m-auto">
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
                                <div class="d-none">
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
                                                        <div class="card card-stats" style="border: 2px solid #005eb3;">
                                                            <h5 class="card-title m-0 p-0">
                                                                <div class="row m-0">
                                                                    <div class="col-md-12" style="background: #005eb3;">
                                                                        FROM: {{item.from_account}}
                                                                    </div>
                                                                    <div class="col-md-12" style="background: #05b675;">
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
            </div>
        </div>
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Team Member Payments List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
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
                    <form>
                        <div class="modal-body">
                            <input type="text" id="input-username" :class="{'form-control': true }" placeholder="Name" v-model="teamMemberName">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" @click.prevent="addToAccount">Save</button>
                        </div>
                    </form>
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
                    <form>
                        <div class="modal-body">
                            <input type="text" id="input-username"  :class="{'form-control': true}" placeholder="Name" v-model="teamMemberName">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeFromAccountModal">Close</button>
                            <button type="submit" class="btn btn-primary" @click.prevent="addFromAccount">Save</button>
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
        return {
            hideShowLoader: false,
            teamMemberPaymentList: [],
            teamMemberPaymentFilter: [],
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
            showImportIcon: true
        }
    },
    computed: {
        bodyAppend() {
            return `body.append`
        }
    },
    watch: {
        // from account list filtering
        fromAccount(val) {
            if(val) {
                this.teamMemberPaymentList = this.teamMemberPaymentFilter.filter((val) => {
                    return val.from_account == this.fromAccount;
                })
            }
            else {
                this.teamMemberPaymentList = this.teamMemberPaymentFilter;
            }
        },
        // to account list filtering
        toAccount(val) {
            if(val) {
                this.teamMemberPaymentList = this.teamMemberPaymentFilter.filter((val) => {
                    return val.to_account == this.toAccount;
                })
            }
            else {
                this.teamMemberPaymentList = this.teamMemberPaymentFilter;
            }
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
        // search payment from table
        // searchPayments() {
        //     this.creditCardPaymentList = this.creditCardPaymentFilter.filter((val) => {
        //         return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
        //                 val.id.toString().includes(this.searchInput.toLowerCase()) || 
        //                 val.from_account.toLowerCase().includes(this.searchInput.toLowerCase()) || 
        //                 val.to_account.toLowerCase().includes(this.searchInput.toLowerCase()) || 
        //                 val.status.toLowerCase().includes(this.searchInput.toLowerCase()) || 
        //                 val.payment_date.toLowerCase().includes(this.searchInput.toLowerCase())
        //     })
        // },
        // get team member payment details
        getTeamMemberPaymentList() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/teamMemberPayment', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data, 'data-------')
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // delete team member payment
        deleteData(id) {
            this.hideShowLoader = true;
            this.axios.delete(this.$api + '/accounting/teamMemberPayment/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data, 'data-------')
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // adding to account
        addToAccount() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/teamMemberPayment/addToAccountMembers', {
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
                    this.hideShowLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeTeamMemberModal();
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // adding from account
        addFromAccount() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/teamMemberPayment/addFromAccountMembers', {
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
                    this.hideShowLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeFromAccountModal();
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
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

<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Email Notification</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <a href="javascript:void(0);" class="btn btn-lg btn-neutral btn_animated" data-bs-toggle="modal" data-bs-target="#createUpdateData" @click="createRecord">Add New Record</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="v-card v-sheet theme--light">
                                <div class="card-header text-end">
                                    <div class="row">
                                        <div class="col-3 ms-auto">
                                            <div class="ms-auto search-input position-relative">
                                                <input type="search" placeholder="Search">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- data table component -->
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}"  v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" class="table-with-checkbox" @current-items="currentItems" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <td>
                                            <a href="javascript:void(0);" @click="edit(item.id)">
                                                <img src="/assets/img/icons/edit.svg" class="img-width">
                                            </a>
                                            <a href="javascript:void(0);" @click="deleteData(item.id)">
                                                <img src="/assets/img/icons/bin.svg" class="img-width">
                                            </a>
                                        </td>
                                    </template>
                                    <template v-slot:top v-if="selected.length > 0">
                                        <div class="p-2 text-right">
                                            <v-btn
                                                elevation="2"
                                                outlined
                                                raised
                                                rounded
                                                @click="deleteSelected"
                                            >Remove Selected</v-btn>
                                        </div>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Create & Update RM AMEX Plum Activity -->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Email Notification User</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <form>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.email">
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Daily Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.daily_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Monthly Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.monthly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Weekly Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.weekly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">URL Uptime Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.url_uptime_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Account Monitoring Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.account_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network Monitoring Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.networks_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Ads Issue Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.ads_issue_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Domain Expires Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.domain_expires_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Payment Declined Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.payment_declined_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Website Speed Test Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.speed_test_report"></v-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" data-bs-dismiss="modal" class="btn btn-primary btn-lg btn_animated">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import $ from 'jquery';
export default {
    data() {
        return {
            // images: {
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            // },
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Email', key: 'email'},
                { title: 'Daily Report', align: 'start', sortable: false, key: 'daily_report' },
                { title: 'Monthly Report ', key: 'monthly_report', sortable: false },
                { title: 'Weekly Report', key: 'weekly_report', sortable: false },
                { title: 'URL Uptime', key: 'url_uptime_report', sortable: false },
                { title: 'Account Monitoring', key: 'account_monitoring_report', sortable: false },
                { title: 'Network Monitoring', key: 'networks_monitoring_report', sortable: false },
                { title: 'Ads Issue Report', key: 'ads_issue_report', sortable: false },
                { title: 'Domain Expires', key: 'domain_expires_report', sortable: false },
                { title: 'Payment Declined', key: 'payment_declined_report', sortable: false },
                { title: 'Speed Test', key: 'speed_test_report', sortable: false },
                { title: 'Action', key: 'action' },
            ],
            file: '',
            selected: [],
            currentItemsTable: [],
            itemsPerPage: -1,
            accountTypeList: [
                {
                    text: 'Active'
                },
                {
                    text: 'Inactive'
                },
            ],
            activity: {
                id: '',
                email: '',
                daily_report : 'Active',
                monthly_report : 'Active',
                weekly_report : 'Active',
                url_uptime_report : 'Active',
                account_monitoring_report : 'Active',
                networks_monitoring_report : 'Active',
                ads_issue_report : 'Active',
                domain_expires_report : 'Active',
                payment_declined_report : 'Active',
                speed_test_report : 'Active',
            },
            activityType: 'Add',
            showImportIcon: true
        }
    },
    methods: {
        // create record
        createRecord() {
            this.activityType = 'Add';
            this.activity.email = '';
            this.activity.daily_report = 'Active';
            this.activity.monthly_report = 'Active';
            this.activity.weekly_report = 'Active';
            this.activity.url_uptime_report = 'Active';
            this.activity.account_monitoring_report = 'Active';
            this.activity.networks_monitoring_report = 'Active';
            this.activity.ads_issue_report = 'Active';
            this.activity.domain_expires_report = 'Active';
            this.activity.payment_declined_report = 'Active';
            this.activity.speed_test_report = 'Active';
            // $(document).ready(() => {
            //     $('.btn_animated').click(() => {
            //         $('#createUpdateData').modal(); 
            //     })
            // })
        },
    },
    mounted() {

    }
}
</script>

<style scoped>
    .img-width {
        width: 25px;
    }
</style>

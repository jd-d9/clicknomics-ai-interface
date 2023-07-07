<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Email Notification</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'" @click.prevent="createActivity">Add New Record</button>
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
                                                <v-row>
                                                    <v-col class="d-flex search_width" cols="12" sm="4">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchData">
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table class="table-hover-class elevation-1 adding-font-size table-with-checkbox" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage"> <!--  @current-items="currentItems"  -->
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <button class="disable-button" :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                                            <img src="/assets/img/icons/edit.svg" class="img-width" title="Edit">
                                                        </button>
                                                        <button class="disable-button" :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="img-width" title="Delete">
                                                        </button>
                                                    </td>
                                                </template>
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn
                                                            elevation="2"
                                                            variant="outlined"
                                                            raised
                                                            rounded="xl"
                                                            class="me-1 disable-button"
                                                            :disabled="permissions.delete_auth == '0'"
                                                            @click="deleteSelected"
                                                        >Remove Selected</v-btn>
                                                    </div>
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
        <!-- Create & Update RM AMEX Plum Activity-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Email Notification User</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="saveEmailNotificationUser" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <Field type="text" id="input-username" name="Email" :class="{'form-control': true , 'border-red-600':errors.Email }" v-model="activity.email"/>
                                            <ErrorMessage class="text-red-600" name="Email"/>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Daily Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.daily_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Monthly Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.monthly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Weekly Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.weekly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">URL Uptime Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.url_uptime_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Account Monitoring Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.account_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network Monitoring Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.networks_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Ads Issue Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.ads_issue_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Domain Expires Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.domain_expires_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Payment Declined Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.payment_declined_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Website Speed Test Report</label>
                                                <v-select :class="{'form-control': true }" :items="accountTypeList" v-model="activity.speed_test_report"></v-select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';

// Vue.filter('toCurrency', function (value) {
//     value = parseFloat(value).toFixed(2);
//     var formatter = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 2
//     });
//     return formatter.format(value);
// });
export default {
    // props: [ 'list'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
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
                    title: 'Active'
                },
                {
                    title: 'Inactive'
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
            showImportIcon: true,
            searchInput: '',
            permissions: {}
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
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
            });
        },
    },
    mounted() {
        this.getListings();
        // this.getDomainList();
        // this.dataMetrics = this.list
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // search data from table
        searchData() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return  val.email.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.monthly_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.daily_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.weekly_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.url_uptime_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.account_monitoring_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.ads_issue_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.domain_expires_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.payment_declined_report.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.speed_test_report.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get listing data
        getListings() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/emailNotification', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    console.log(Data, 'data')
                    this.dataMetrics = Data.data.data;
                    this.dataMetricsFilter = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // open model for edit and set field values
        edit(id) {
            console.log(id)
            this.openModal();
            // const data = _.filter(this.dataMetrics, x => { return x.id == id; });
            const result = this.dataMetrics.find((val) => {
                return val.id == id
            });
            this.activityType = 'Update'
            this.activity.id = id;
            this.activity.email = result.email;
            this.activity.daily_report = result.daily_report;
            this.activity.monthly_report = result.monthly_report;
            this.activity.weekly_report = result.weekly_report
            this.activity.url_uptime_report = result.url_uptime_report;
            this.activity.account_monitoring_report = result.account_monitoring_report;
            this.activity.networks_monitoring_report = result.networks_monitoring_report;
            this.activity.ads_issue_report = result.ads_issue_report;
            this.activity.domain_expires_report = result.domain_expires_report;
            this.activity.payment_declined_report = result.payment_declined_report;
            this.activity.speed_test_report = result.speed_test_report;
        },
        // open model for create and set field values
        createActivity() {
            this.openModal();
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
        },
        // delete single data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/settings/emailNotification/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getListings();
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
            }
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
                formData.append('id', JSON.stringify(multipleRow));
                this.axios.post(this.$api + '/settings/emailNotification/deleteMutipleRows', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.selected = [];
                        this.getListings();
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
            }
        },
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
        // save and update email notification
        saveEmailNotificationUser() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('email', this.activity.email);
            formData.append('daily_report', this.activity.daily_report);
            formData.append('monthly_report', this.activity.monthly_report);
            formData.append('weekly_report', this.activity.weekly_report);
            formData.append('url_uptime_report', this.activity.url_uptime_report);
            formData.append('account_monitoring_report', this.activity.account_monitoring_report);
            formData.append('networks_monitoring_report', this.activity.networks_monitoring_report);
            formData.append('ads_issue_report', this.activity.ads_issue_report);
            formData.append('domain_expires_report', this.activity.domain_expires_report);
            formData.append('payment_declined_report', this.activity.payment_declined_report);
            formData.append('speed_test_report', this.activity.speed_test_report);
            this.activityType != 'Add' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Add' ? '/settings/emailNotification' : `/settings/emailNotification/${this.activity.id}`
            this.axios.post(`${this.$api}${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Data saved',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.closeModal();
                    this.getListings();
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
        }
    }
}
</script>

<style scoped>
    .adding-font-size tbody tr td{
        font-size: 14px !important;
    }
    .img-width {
        width: 25px;
    }
</style>

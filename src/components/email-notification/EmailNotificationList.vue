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
                            <router-link to="" @click="createActivity" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
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
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex search_width" cols="12" sm="3">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table class="table-hover-class elevation-1adding-font-size table-with-checkbox" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}"  v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage"> <!--  @current-items="currentItems"  -->
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <router-link to="" @click="edit(item.id)">
                                                            <img src="/admin/img/icons/edit.svg" style="width:25px">
                                                        </router-link>
                                                        <router-link to="" @click="deleteData(item.id)">
                                                            <img src="/admin/img/icons/bin.svg" style="width:25px">
                                                        </router-link>
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
                                <form>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" v-model="activity.email">
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Daily Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.daily_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Monthly Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.monthly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Weekly Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.weekly_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">URL Uptime Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.url_uptime_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Account Monitoring Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.account_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network Monitoring Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.networks_monitoring_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Ads Issue Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.ads_issue_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Domain Expires Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.domain_expires_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Payment Declined Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.payment_declined_report"></v-select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Website Speed Test Report</label>
                                                <v-select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="accountTypeList" v-model="activity.speed_test_report"></v-select>
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
    // components: {
    //     LoaderComponent,
    //     DateRangePicker
    // },
    data() {
        return {
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
            showImportIcon: true,
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
        }
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
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        edit(id) {
            console.log(id)
            // const data = _.filter(this.dataMetrics, x => { return x.id == id; });
            // const restult = data[0];
            // this.activityType = 'Update'
            // this.activity.id = id;
            // this.activity.email = restult.email;
            // this.activity.daily_report = restult.daily_report;
            // this.activity.monthly_report = restult.monthly_report;
            // this.activity.weekly_report = restult.weekly_report
            // this.activity.url_uptime_report = restult.url_uptime_report;
            // this.activity.account_monitoring_report = restult.account_monitoring_report;
            // this.activity.networks_monitoring_report = restult.networks_monitoring_report;
            // this.activity.ads_issue_report = restult.ads_issue_report;
            // this.activity.domain_expires_report = restult.domain_expires_report;
            // this.activity.payment_declined_report = restult.payment_declined_report;
            // this.activity.speed_test_report = restult.speed_test_report;
        },
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
        deleteData(id) {
            console.log(id)
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                // axios.defaults.headers.common = {
                //     'X-Requested-With': 'XMLHttpRequest',
                //     'X-CSRF-TOKEN': window.csrf_token
                // };
                // let formData = new FormData();
                // formData.append('id', id);
                // axios.post(`/deleteEmailNotificationUserRow`, formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                // }).then(response => {
                //     if(response) {
                //         console.log(response, 'sasa')
                //         this.showLoader = false;
                //         this.message = {
                //             text: response.data.message,
                //             type: 'success',
                //         };
                //         Bus.$emit('flash-message', this.message, '');
                //         this.dataMetrics = _.filter(this.dataMetrics, x => { return x.id !== id; });
                //     }else {
                //         this.showLoader = false;
                //         this.message = {
                //             text: 'Something Went Wrong!',
                //             type: 'error',
                //         }
                //         Bus.$emit('flash-message', this.message, '');
                //     }
                // }).catch(error => {
                //     this.showLoader = false;
                //     console.log(error);
                //     this.message = {
                //         text: error.response.data.message,
                //         type: 'error',
                //     }
                //     Bus.$emit('flash-message', this.message, '');
                // });
            }
        },
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                // axios.defaults.headers.common = {
                //     'X-Requested-With': 'XMLHttpRequest',
                //     'X-CSRF-TOKEN': window.csrf_token
                // };
                // let formData = new FormData();
                // formData.append('selectedRow', JSON.stringify(this.selected));
                // axios.post(`/deleteEmailNotificationUserMutipleRows`, formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                // }).then(response => {
                //     if(response) {
                //         console.log(response, 'sasa')
                //         this.showLoader = false;
                //         this.message = {
                //             text: response.data.message,
                //             type: 'success',
                //         };
                //         Bus.$emit('flash-message', this.message, '');
                //         this.dataMetrics = this.dataMetrics.filter(ar => !this.selected.find(rm => (rm.id === ar.id) ));
                //         this.selected = [];
                //     }else {
                //         this.showLoader = false;
                //         this.message = {
                //             text: 'Something Went Wrong!',
                //             type: 'error',
                //         }
                //         Bus.$emit('flash-message', this.message, '');
                //     }
                // }).catch(error => {
                //     this.showLoader = false;
                //     console.log(error);
                //     this.message = {
                //         text: error.response.data.message,
                //         type: 'error',
                //     }
                //     Bus.$emit('flash-message', this.message, '');
                // });
            }
        },
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
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
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': window.csrf_token
            // };
            // const postUrl = this.activityType == 'Add' ? 'saveEmailNotificationUser' : 'updateEmailNotificationUser'
            // axios.post(`/${postUrl}`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //         this.showLoader = false;
            //         this.message = {
            //             text: response.data.message,
            //             type: 'success',
            //         };
            //         this.dataMetrics = response.data.data;
            //         Bus.$emit('flash-message', this.message, '');
            //         $('#createUpdateData').modal('hide');
            //     }else {
            //         this.showLoader = false;
            //         this.message = {
            //             text: 'Something Went Wrong!',
            //             type: 'error',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //     }
            // }).catch((error) => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // });
        }
    }
}
</script>

<style scoped>
    .adding-font-size tbody tr td{
        font-size: 14px !important;
    }
</style>

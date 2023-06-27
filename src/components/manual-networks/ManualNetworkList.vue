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
                                    <li class="breadcrumb-item active" aria-current="page">Manual Network List</li>
                                </ol>
                            </nav>
                        </div>
                        <!-- <div class="col-lg-6 col-5 text-right">
                            <a href="/admin/img/doc/manual-networks-metrics.csv" class="btn btn-lg btn-neutral btn_animated" download>
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </a>
                            <a href="#exampleModalCenter"  data-toggle="modal" data-target="#exampleModalCenter" class="btn btn-lg btn-neutral btn_animated">Import CSV</a>
                            <a href="/networks/manualNetworks/create" class="btn btn-lg btn-neutral btn_animated">Add Revenue</a>
                        </div> -->
                        <div class="col-lg-6 col-5 text-right">
                            <button @click.prevent="createActivity" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add Manual Network</button>
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
                                                <v-spacer></v-spacer>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                    <div class="col-3 ms-auto mt-2 add-height">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search"  @current-items="currentItems" :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.id}}</td>
                                                        <td>{{item.selectable.network}}</td>
                                                        <td>{{item.selectable.email ? item.selectable.email : '-'}}</td>
                                                        <td>{{item.selectable.platform_type ? item.selectable.platform_type : '-'}}</td>
                                                        <td>{{item.selectable.company ? item.selectable.company : '-'}}</td>
                                                        <td>{{item.selectable.notes ? item.selectable.notes : '-'}}</td>
                                                        <td>{{format_date(item.selectable.created_at)}}</td>
                                                        <td>
                                                            <button @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                            </button>
                                                            <button @click.prevent="showConfirmation(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                            </button>
                                                        </td>
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
        <!-- Start confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="400" class="delete-confirm-card">
                    <v-card>
                        <v-card-title class="text-h5 text-center">Delete Account</v-card-title>
                        <v-card-text>Are you sure you want to delete your affiliate?.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="cancel()"> Cancel </v-btn>
                            <v-btn color="green darken-1" text @click="deleteAccount()"> Delete </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
        <!--End confirmation alert box -->
        <!-- Create & Update Manual Network List-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Manual Network</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <Form @submit="saveManualNetwork" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Network Name</label>
                                            <Field type="text" name="Name" id="input-username" :class="{'form-control': true , 'border-red-600':errors.Name}" placeholder="Add Name" v-model="list.name"/>
                                            <span class="text-red-600" v-if="errors.Name">Network name can not be empty</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Email" v-model="list.email">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Platform Type</label>
                                            <input type="text" id="input-username"  :class="{'form-control': true}" placeholder="Type" v-model="list.platform_type">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Company</label>
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Company" v-model="list.company">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Notes</label>
                                            <textarea :class="{'form-control': true}"  name="" cols="30" rows="5" v-model="list.notes"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    // props: ['networks'],
    components: {
        Form, Field
    },
    data() {
        return {
            hideShowLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
            search: '',
            headers: [
                { title: 'Network ID', align: 'start', sortable: false, key: 'id' },
                { title: 'Network Name', key: 'network' },
                { title: 'Email', key: 'email' },
                { title: 'Platform Type', key: 'platform_type' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added', key: 'created_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            currentItemsTable: [],
            itemsPerPage: -1,
            list: {
                id: null,
                name: null,
                email: null,
                platform_type: null,
                notes: null,
                company: null,
            },
            activityType: 'Create',
            confirmationBox: false,
            accountIdToDelete: '',
            accountIdToEdit: '',
            permissions: {},
            searchInput: '',
        }
    },
    computed: {
        schema() {
            return yup.object({
                Name: yup.string().required(),
            });
        },
    },
    mounted() {
        this.getManualNetworkListing();
    },
    methods: {
        // search payment from table
        searchPayments() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return  val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.company && val.company.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.email.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.network.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.notes && val.notes.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.platform_type.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.created_at.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // get manual network listing
        getManualNetworkListing() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/network/manualNetworks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    console.log(data);
                    this.dataMetrics = data.data.data;
                    this.dataMetricsFilter = data.data.data;
                    this.permissions = data.permission;
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.hideShowLoader = false;
            });
        },
        // create and update network
        saveManualNetwork() {
            this.hideShowLoader = true;
            let formData = new FormData();
            formData.append('id', this.list.id);
            formData.append('network', this.list.name);
            formData.append('email', this.list.email);
            formData.append('platform_type', this.list.platform_type);
            formData.append('notes', this.list.notes);
            formData.append('company', this.list.company);
            this.activityType == 'Update' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Create' ? 'network/manualNetworks' : `network/manualNetworks/${this.accountIdToEdit}`;
            this.axios.post(`${this.$api}/${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: this.activityType == 'Create' ? 'Manual network created' : 'Manual network updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getManualNetworkListing();
                    this.closeModal();
                    this.hideShowLoader = false;
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
                this.hideShowLoader = false;
            });
        },
        // open modal for create new network
        createActivity() {
            this.activityType = 'Create';
            this.list.name = '';
            this.list.email = '';
            this.list.platform_type = '';
            this.list.notes = '';
            this.list.company = '';
            this.openModal();
        },
        // get data for edit
        edit(id) {
            const restult = this.dataMetrics.find((val) => {
                return val.id == id
            });
            this.accountIdToEdit = id;
            this.activityType = 'Update'
            this.list.id = id;
            this.list.name = restult.network;
            this.list.email = restult.email;
            this.list.platform_type = restult.platform_type;
            this.list.notes = restult.notes ? restult.notes : '';
            this.list.company = restult.company ? restult.company : '';
            this.openModal();
        },
        // open and close delet modal
        showConfirmation(id) {
            this.accountIdToDelete = id;
            this.confirmationBox = true;
        },
        cancel() {
            this.accountIdToDelete = '';
            this.confirmationBox = false;
        },
        // delete network
        deleteAccount() {
            this.hideShowLoader = true;
            this.axios.delete(this.$api + '/network/manualNetworks/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Network deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getManualNetworkListing();
                    this.cancel();
                    this.hideShowLoader = false;
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
                this.hideShowLoader = false;
            });
        },
    }
}
</script>

<style scoped>
    .add-height {
        height: 50px;
    }
</style>

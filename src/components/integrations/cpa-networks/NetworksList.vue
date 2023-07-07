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
                                    <li class="breadcrumb-item active" aria-current="page">CPA Networks List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button @click.prevent="this.$router.push('/settings/networks/affiliates')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">
                                <img src="/assets/img/icons/networks.svg" class="add-width">
                                Integrate New CPA Network
                            </button>
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
                                <v-data-table class="table-hover-class elevation-1" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="linkedNewtworks" :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.selectable.id}}</td>
                                            <td>{{item.selectable.name}}</td>
                                            <td>{{item.selectable.email ? item.selectable.email : '-' }}</td>
                                            <td>{{item.selectable.affiliate_id}}</td>
                                            <td class="text-capitalize">{{item.selectable.network}}</td>
                                            <td>{{item.selectable.company ? item.selectable.company : '-' }}</td>
                                            <td>{{item.selectable.notes ? item.selectable.notes : '-' }}</td>
                                            <td>{{changeFormat(item.selectable.created_at)}}</td>
                                            <td>
                                                <button @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                        <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                    </button>
                                                <button @click.prevent="showConfirmation(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                    <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                </button>
                                                <!-- <button @click.prevent="viewAccount(item.id)" :disabled="permissions.view == '0'" class="disable-button">
                                                    <img src="/admin/img/icons/eye.svg" class="icon-width">
                                                </button> -->
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
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
        <!-- confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="400">
                    <v-card class="delete-confirm-card">
                        <v-card-title class="text-h5 text-center">Delete Account</v-card-title>
                        <v-card-text>Are you sure you want to delete your affiliate?.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="cancel"> Cancel </v-btn>
                            <v-btn color="green darken-1" text @click="deleteCpaNetworkist"> Delete </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
        <template>
            <v-row justify="center">
                <v-dialog v-model="showEditForm" persistent max-width="600px">
                    <v-app>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title text-white">Edit Your Network Name</h5>
                            </div>
                            <div class="modal-body">
                                <div class="col-12">
                                    <div class="row">
                                        <div class="col-lg-12 p-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Network Name*</label>
                                                <input type="text" class="form-control" required v-model="network_name">
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Email</label>
                                                <input type="text" class="form-control" placeholder="Email" v-model="email">
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Company</label>
                                                <input type="text" class="form-control" placeholder="Company" v-model="company">
                                            </div>
                                        </div>
                                        <div class="col-lg-12 p-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <textarea :class="{'form-control': true}"  name="" cols="30" rows="5" v-model="notes"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-lg-12 py-0 text-right">
                                            <button type="submit" class="btn btn-secondary btn-lg btn_animated" @click="close">Close</button>
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click="updateCpaNetworkist">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-app>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            showLoader: false,
            confirmationBox: false,
            showEditForm: false,
            accountIdToDelete: '',
            accountIdEdit: '',
            network_name: '',
            notes: '',
            email: '',
            company: '',
            singleExpand: true,
            networkHeaders: [
                { title: 'Network ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Network Name', align: 'start', sortable: true, key: 'name' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Login ID',  key: 'affiliate_id' },
                { title: 'Platform Type',  key: 'network' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            linkedNewtworks: [],
            permissions: {},
            itemsPerPage: -1
        }
    },
    mounted() {
        this.getCpaNetworkist();
    },
    methods: {
        // show confirmation modal
        showConfirmation(id) {
            this.accountIdToDelete = id;
            this.confirmationBox = true;
        },
        // cancle delete modal
        cancel() {
            this.accountIdToDelete = '';
            this.confirmationBox = false;
        },
        // edit network
        edit(id) {
            console.log(id)
            this.accountIdEdit = id;
            this.showEditForm = true;
            const data = this.linkedNewtworks.find((val) => {
                return val.id == id
            });
            console.log(data)
            this.network_name = data.name;
            this.notes = data.notes ? data.notes : '';
            this.company = data.company ? data.company : '';
            this.email = data.email;
        },
        // close edit modal
        close() {
            this.accountIdEdit = '';
            this.showEditForm = false;
        },
        // change date format
        changeFormat(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        // get cpa network list
        getCpaNetworkist() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/networks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const allData = response.data;
                    this.linkedNewtworks = allData.data.data;
                    this.permissions = allData.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // delete network list
        deleteCpaNetworkist() {
            this.showLoader = true;
            this.axios.delete(this.$api + '/settings/networks/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'CPA network deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.cancel();
                    this.getCpaNetworkist();
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
        // update network list
        updateCpaNetworkist() {
            this.showLoader = true;
            this.axios.post(this.$api + '/settings/networks/' + this.accountIdEdit, {
                _method: 'PUT',
                name: this.network_name,
                email: this.email,
                company: this.company,
                notes: this.notes,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'CPA network updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.close();
                    this.getCpaNetworkist();
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
    }
}
</script>

<style scoped>
    .add-width {
        width: 15px;
    }
</style>

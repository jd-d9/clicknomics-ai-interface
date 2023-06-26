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
                                    <li class="breadcrumb-item active" aria-current="page">Domains List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/domain/integrate" class="btn btn-lg btn-neutral btn_animated">
                                <img src="/assets/img/icons/networks.svg" class="add-width">
                                Integrate Domain
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hidehideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <!-- data table -->
                                <v-data-table class="table-hover-class elevation-1" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.id}}</td>
                                            <td>{{item.email ? item.email : '-' }}</td>
                                            <td>{{item.domain_selected}}</td>
                                            <td>{{format_date(item.created_at)}}</td>
                                            <td>
                                                <router-link to="" @click="edit(item.id)">
                                                    <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                </router-link>
                                                <router-link to="" @click="showConfirmation(item.id)">
                                                    <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                </router-link>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                    </v-app>
                </div>
            </div>
        </div>
        <!-- confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="400">
                    <v-card>
                        <v-card-title class="text-h5 text-center">Delete Account</v-card-title>
                        <v-card-text>Are you sure you want to delete your domain record?.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="cancel()"> Cancel </v-btn>
                            <v-btn color="green darken-1" text @click="deleteAccount()"> Delete </v-btn>
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
                                            <button type="submit" class="btn btn-secondary btn-lg btn_animated" @click="showEditForm = false">Close</button>
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click="updateNetworkName">Save</button>
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
// import Bus from 'path/of/bus';
import moment from 'moment';
export default {
    // props: ['affiliates'],
    data() {
        return {
            hideShowLoader: false,
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
                { title: 'ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Domain Selected',  key: 'domain_selected' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1
        }
    },
    mounted() {
        this.linkedNewtworks = this.affiliates;
    },
    methods: {
        edit(id) {
            this.accountIdEdit = id;
            this.showEditForm = true;
            const data = _.find(this.affiliates, ['id', id]);
            this.network_name = data.name;
            this.notes = data.notes ? data.notes : '';
            this.company = data.company ? data.company : '';
            this.email = data.email;
        },
        showConfirmation(id) {
            this.accountIdToDelete = id;
            this.confirmationBox = true;
        },
        cancel() {
            this.accountIdToDelete = '';
            this.confirmationBox = false;
        },
        // delete network name
        deleteAccount() {
            this.confirmationBox = false;
            this.hideShowLoader = true;
            this.axios.defaults.headers.common = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': window.csrf_token
            };
            let formData = new FormData();
            formData.append('id', this.accountIdToDelete);
            this.axios.post('/deleteDomainCredentials' , formData)
            .then(response => {
                this.hideShowLoader = false;
                this.message = {
                    text: response.data.message,
                    type: 'success',
                };
                Bus.$emit('flash-message', this.message, '/settings/domain');
            }).catch(error => {
                this.hideShowLoader = false;
                console.log(error);
                this.message = {
                    text: error.response.data.message,
                    type: 'error',
                }
                Bus.$emit('flash-message', this.message, '');
            });


            // =====================

            // this.hideShowLoader = true;
            // this.axios.delete(this.$api + '/accounting/teamMemberPayment/' + id, {
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${sessionStorage.getItem('Token')}`
            //     }
            // })
            // .then(response => {
            //     if(response.data.success) {
            //         this.$toast.open({
            //             message: 'Team member payment deleted',
            //             position: 'top-right',
            //             duration: '5000',
            //             type: 'success'
            //         });
            //         this.getTeamMemberPaymentList();
            //         this.hideShowLoader = false;
            //     }
            // })
            // .catch(error => {
            //     console.log(error);
            //     this.hideShowLoader = false;
            // });
        },
        // update network name
        updateNetworkName() {
            this.showEditForm = false;
             this.hideShowLoader = true;
            this.axios.defaults.headers.common = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': window.csrf_token
            };
            let formData = new FormData();
            formData.append('id', this.accountIdEdit);
            formData.append('network_name', this.network_name);
            formData.append('notes', this.notes);
            formData.append('company', this.company);
            formData.append('email', this.email);
            this.axios.post('affiliates/updateNetworkName' , formData)
            .then(response => {
                this.hideShowLoader = false;
                this.message = {
                    text: response.data.message,
                    type: 'success',
                };
                Bus.$emit('flash-message', this.message, '/settings/networks');
            }).catch(error => {
                this.hideShowLoader = false;
                console.log(error);
                this.message = {
                    text: error.response.data.message,
                    type: 'error',
                }
                Bus.$emit('flash-message', this.message, '');
            });
        },
        viewAccount(id) {
            window.open(`/reporting/affiliates/reports/${id}`);
        },
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
    }
}
</script>

<style scoped>
    .add-width {
        width: 15px;
    }
</style>

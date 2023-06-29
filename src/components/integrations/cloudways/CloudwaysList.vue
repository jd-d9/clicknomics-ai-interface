<template>
    <div>
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
                                    <li class="breadcrumb-item active" aria-current="page">Cloudways List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button @click.prevent="this.$router.push('/settings/cloudways/integrate')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">
                                <img src="/assets/img/icons/networks.svg" class="add-width">Integrate Cloudways
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
                <div class="col" v-if="permissions.view == '1'">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <!-- datatable component -->
                                <v-data-table class="table-hover-class elevation-1" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="listData" :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.selectable.id}}</td>
                                            <td>{{item.selectable.email ? item.selectable.email : '-' }}</td>
                                            <td>{{format_date(item.selectable.created_at)}}</td>
                                            <td>
                                                <button @click.prevent="showConfirmation(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                    <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
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
        <!-- confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="400">
                    <v-card>
                        <v-card-title class="text-h5 text-center">Delete Account</v-card-title>
                        <v-card-text>Are you sure you want to delete your cloudways record?.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="cancel()"> Cancel </v-btn>
                            <v-btn color="green darken-1" text @click="deleteAccount()"> Delete </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    // props: ['cloudwaysList'],
    data() {
        return {
            showLoader: false,
            confirmationBox: false,
            accountIdToDelete: '',
            singleExpand: true,
            networkHeaders: [
                { title: 'ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            listData: [],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        this.getCloudwaysListing();
    },
    methods: {
        // open and close confirm delete modal
        showConfirmation(id) {
            this.accountIdToDelete = id;
            this.confirmationBox = true;
        },
        cancel() {
            this.accountIdToDelete = '';
            this.confirmationBox = false;
        },
        // get cloudways listing data
        getCloudwaysListing() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/cloudways', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.listData = data.data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // delete cloudway data
        deleteAccount() {
            this.showLoader = true;
            this.axios.delete(this.$api + '/settings/cloudways/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Record deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getCloudwaysListing();
                    this.cancel();
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

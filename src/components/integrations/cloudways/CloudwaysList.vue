<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Cloudways</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="this.$router.push('/settings/cloudways/integrate')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Integrate Cloudways
                            </v-btn>
                        </div>  
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            Cloudways List
                        </v-card-title>

                        <!-- datatable component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="listData" :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{format_date(item.selectable.created_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="showConfirmation(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>                                                            
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="500">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Delete Account</h5>
                            <button type="button" class="close" aria-label="Close" @click="cancel()">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" >
                                    <label class="font-weight-medium" for="input-username">
                                        Are you sure you want to delete your cloudways record?.
                                    </label>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-delete-empty" @click="deleteAccount()">Delete</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click="cancel()">Cancel</v-btn>
                            </v-col>
                        </div>
                    </div>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
import axios from '@axios';
import moment from 'moment';
export default {
    // props: ['cloudwaysList'],
    data() {
        return {
            message: {},
            showLoader: false,
            confirmationBox: false,
            accountIdToDelete: '',
            singleExpand: true,
            networkHeaders: [
                { title: 'ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: 'action', sortable: false},
            ],
            listData: [],
            itemsPerPage: -1,
            permissions: {},
            isHidden: false,
        }
    },
    mounted() {
        this.getCloudwaysListing();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
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
            axios.get(this.$api + '/settings/cloudways', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.listData = data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
        // delete cloudway data
        deleteAccount() {
            this.showLoader = true;
            axios.delete(this.$api + '/settings/cloudways/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.getCloudwaysListing();
                    this.cancel();
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            }else {
                return '-';
            }
        },
    }
}
</script>

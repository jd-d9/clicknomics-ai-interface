<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <router-link to="/dashboard" class="d-flex align-center">
                            <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                            <span>Dashboard</span>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Domains List</span>

                        <v-spacer />
                        <v-btn @click.prevent="this.$router.push('/settings/domain/integrate')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Integrate Domain
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Domains List
                        </v-card-title>

                        <!-- data table -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.domain_selected`]="{ item }">
                                {{item.selectable.domain_selected ? item.selectable.domain_selected : '-'}}
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
                                        Are you sure you want to delete your domain record?.
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

        <template>
            <v-row justify="center">
                <v-dialog v-model="showEditForm" persistent max-width="600px">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Edit Your Network Name</h5>
                            <button type="button" class="close" aria-label="Close" @click="showEditForm = false">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <Form :validation-schema="editSchema" v-slot="{ errors }">
                            <div class="modal-body">
                                <v-row class="align-center">
                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Network Name</label>
                                        <Field type="text" id="input-username" name="NetworkName" :class="{'form-control': true, 'border-red-600': errors.NetworkName}" placeholder="Name" v-model.trim="network_name"/>
                                        <span class="text-red-600" v-if="errors.NetworkName">Network Name can not be empty</span>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Email</label>
                                        <Field type="text" id="input-username" name="NetworkName" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model.trim="email"/>
                                        <span class="text-red-600" v-if="errors.NetworkName">Email can not be empty</span>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Company</label>
                                        <Field type="text" id="input-username" name="NetworkName" :class="{'form-control': true, 'border-red-600': errors.Company}" placeholder="Company" v-model.trim="company"/>
                                        <span class="text-red-600" v-if="errors.NetworkName">Company can not be empty</span>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Notes</label>
                                        <Field name="Notes" v-model="notes">
                                            <textarea :class="{'form-control': true, 'border-red-600': errors.Notes}" name="Notes" rows="5" v-model="notes"></textarea>
                                        </Field>
                                        <span class="text-red-600" v-if="errors.Notes">Notes can not be empty</span>
                                    </v-col>
                                </v-row>
                            </div>
                            <div class="modal-footer">
                                <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" @click.prevent="updateNetworkName">Save</v-btn>    
                                    <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click="showEditForm = false">Close</v-btn>
                                </v-col>
                            </div>
                        </Form>
                    </div>
                </v-dialog>
            </v-row>
        </template>
    </div>
</template>

<script>
// import Bus from 'path/of/bus';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
import moment from 'moment';
export default {
    components: {
        Form, Field
    },
    // props: ['affiliates'],
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
                { title: 'ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Domain Selected',  key: 'domain_selected' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: 'action', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getDomainListing();
        // this.linkedNewtworks = this.affiliates;
    },
    computed: {
        schema() {
            return yup.object({
                NetworkName: yup.string().required(),
                Email: yup.string().required().email(),
                Company: yup.string().required(),
                Role: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    methods: {
        // open and cancle confirmation modal
        showConfirmation(id) {
            this.accountIdToDelete = id;
            this.confirmationBox = true;
        },
        cancel() {
            this.accountIdToDelete = '';
            this.confirmationBox = false;
        },
        // get domain listing
        getDomainListing() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/domain', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.linkedNewtworks = data.data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
                this.showLoader = false;
            });
        },
        // delete network name
        deleteAccount() {
            this.showLoader = true;
            this.axios.delete(this.$api + '/settings/domain/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getDomainListing();
                    this.cancel();
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
                this.showLoader = false;
            });
        },
        // format date
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

<style scoped>
    .add-width {
        width: 15px;
    }
</style>

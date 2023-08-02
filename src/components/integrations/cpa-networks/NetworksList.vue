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
                        <span>CPA Networks</span>
                        <v-spacer />
                        <v-btn @click.prevent="this.$router.push('/settings/networks/affiliates')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0' || !restrictUser" prepend-icon="mdi-plus">
                            Integrate New CPA Network
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>
                
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1'">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            CPA Networks List
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table-server class="table-hover-class mt-4"  :headers="networkHeaders" :items="linkedNewtworks" :single-expand="singleExpand" :items-length="linkedNewtworks.total" v-model:options="options" item-key="customer_id">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.affiliate_id`]="{ item }">
                                {{item.selectable.affiliate_id ? item.selectable.affiliate_id : '-'}}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                <span class="text-capitalize">{{item.selectable.network ? item.selectable.network : '-'}}</span>
                            </template>
                            <template v-slot:[`item.company`]="{ item }">
                                {{item.selectable.company ? item.selectable.company : '-' }}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-' }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{changeFormat(item.selectable.created_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="showConfirmation(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>  
                                
                                <!-- <v-btn class="ma-2 bg-blue-lighten-4" variant="text" icon @click.prevent="viewAccount(item.id)" :disabled="permissions.view == '0'">
                                    <v-icon color="blue-darken-2">
                                        mdi-eye
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                                </v-btn>  -->
                            </template>
                        </v-data-table-server>
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
                            <button type="button" class="close" aria-label="Close" @click="cancel">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" >
                                    <label class="font-weight-medium" for="input-username">
                                        Are you sure you want to delete your affiliate?.
                                    </label>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-delete-empty" @click.prevent="deleteCpaNetworkist">Delete</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="cancel">Cancel</v-btn>
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
                            <button type="button" class="close" aria-label="Close" @click="close">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <Form @submit="updateCpaNetworkist" :validation-schema="schema" v-slot="{ errors }">
                            <div class="modal-body">
                                <v-row class="align-center">
                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Network Name</label>
                                        <Field type="text" id="input-username" name="NetworkName" :class="{'form-control': true, 'border-red-600': errors.NetworkName}" placeholder="Name" v-model.trim="network_name"/>
                                        <span class="text-red-600" v-if="errors.NetworkName">Network is a required field</span>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Email</label>
                                        <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model.trim="email"/>
                                        <ErrorMessage class="text-red-600" name="Email"/>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Company</label>
                                        <input type="text" id="input-username" name="Company" :class="{'form-control': true}" placeholder="Company" v-model.trim="company"/>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                        <label class="form-control-label" for="input-username">Notes</label>
                                        <textarea :class="{'form-control': true}" name="Notes" rows="5" v-model="notes"></textarea>
                                    </v-col>

                                    <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                        <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                    </v-col>
    
                                    <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                        <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                    </v-col>
                                </v-row>
                            </div>
                            <div class="modal-footer">
                                <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                    <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="close">Close</v-btn>
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
import axios from '@axios';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import moment from 'moment';
export default {
    components: {
        Form, 
        Field,
        ErrorMessage
    },
    data() {
        return {
            message: {},
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
                { title: 'Login ID',  key: 'affiliate_id', align: 'center' },
                { title: 'Platform Type',  key: 'network' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added',  key: 'created_at', align: 'center' },
                { title: 'Action',  key: 'action', align: 'center', sortable: false},
            ],
            linkedNewtworks: [],
            permissions: {
                view:'1'
            },
            backendErrorMessage: '',
            multipleErrors: [],
            restrictUser: true,
            options:{},
        }
    },
    mounted() {
        // this.getCpaNetworkist();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    computed: {
        schema() {
            return yup.object({
                NetworkName: yup.string().required(),
                Email: yup.string().required().email(),
            });
        },
    },
    watch:{
        options: {
            handler(val) {
                console.log(val,'sdfsf')
                this.getCpaNetworkist();
            },
            deep: true,
        },
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
        // close edit modal
        close() {
            this.accountIdEdit = '';
            this.showEditForm = false;
        },
        // change date format
        changeFormat(date) {
            if(date) {
                return moment(date).format('YYYY-MM-DD');
            }else {
                return '-';
            }
        },
        // get cpa network list
        getCpaNetworkist() {
            this.showLoader = true;
            const { sortBy, page,itemsPerPage } = this.options;

            axios.get(this.$api + `/settings/networks?perPage=${itemsPerPage}&page=${page}&sortBy=${JSON.stringify(sortBy)}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const allData = response.data;
                    this.linkedNewtworks = allData.data;
                    this.permissions = allData.permission;
                    this.restrictUser = allData.restrict_user;
                    this.showLoader = false;
                }else {
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // delete network list
        deleteCpaNetworkist() {
            this.showLoader = true;
            axios.delete(this.$api + '/settings/networks/' + this.accountIdToDelete, {
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
                    this.cancel();
                    this.getCpaNetworkist();
                    this.showLoader = false;
                }else {
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // edit network
        edit(id) {
            this.accountIdEdit = id;
            this.showEditForm = true;
            const data = this.linkedNewtworks.find((val) => {
                return val.id == id
            });
            this.network_name = data.name;
            this.notes = data.notes ? data.notes : '';
            this.company = data.company ? data.company : '';
            this.email = data.email;
        },
        // update network list
        updateCpaNetworkist() {
            this.showLoader = true;
            axios.post(this.$api + '/settings/networks/' + this.accountIdEdit, {
                _method: 'PUT',
                name: this.network_name,
                email: this.email,
                company: this.company,
                notes: this.notes,
            }, {
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
                    this.close();
                    this.getCpaNetworkist();
                    this.backendErrorMessage = '',
                    this.multipleErrors = [],
                    this.showLoader = false;
                }else {
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.backendErrorMessage = error.response.data.message;
                }
                if(error.response.data.error) {
                    this.backendErrorMessage = error.response.data.error;
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.backendErrorMessage = error.response.data.errors[0];
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.multipleErrors = error.response.data.errors;
                    }
                }
                this.showLoader = false;
            });
        },
    }
}
</script>

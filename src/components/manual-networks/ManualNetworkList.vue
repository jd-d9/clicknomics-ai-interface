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
                        <span>Manual Network</span>
                        <v-spacer />
                        <!-- <v-btn to="/admin/img/doc/manual-networks-metrics.csv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn to="#exampleModalCenter" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn> -->

                        <v-btn @click.prevent="createActivity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Manual Network List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchPayments"/>
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search"  @current-items="currentItems" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                {{item.selectable.network}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-'}}
                            </template>
                            <template v-slot:[`item.platform_type`]="{ item }">
                                {{item.selectable.platform_type ? item.selectable.platform_type : '-'}}
                            </template>
                            <template v-slot:[`item.company`]="{ item }">
                                {{item.selectable.company ? item.selectable.company : '-'}}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-'}}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{format_date(item.selectable.created_at)}}
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

        <!-- Start confirmation alert box -->
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
                                    <label class="font-weight-medium">
                                        Are you sure you want to delete your affiliate?.
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
        <!--End confirmation alert box -->
        
        <!-- Create & Update Manual Network List-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{activityType}} Manual Network</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="saveManualNetwork" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row class="align-center">
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Network Name</label>
                                    <Field type="text" name="Name" id="input-username" :class="{'form-control': true, 'border-red-600':errors.Name}" placeholder="Add Name" v-model="list.name"/>
                                    <span class="text-red-600" v-if="errors.Name">Network name is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="text" name="Email" id="input-username" :class="{'form-control': true, 'border-red-600':errors.Email}" placeholder="Email" v-model="list.email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Platform Type</label>
                                    <Field type="text" name="Platform" id="input-username" :class="{'form-control': true, 'border-red-600':errors.Platform}" placeholder="Type" v-model="list.platform_type"/>
                                    <span class="text-red-600" v-if="errors.Name">Platform type is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Company</label>
                                    <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Company" v-model="list.company">
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <textarea :class="{'form-control': true}" name="Notes" rows="5" v-model="list.notes"></textarea>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    // props: ['networks'],
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
                { title: 'Network ID', align: 'start', sortable: false, key: 'id' },
                { title: 'Network Name', key: 'network' },
                { title: 'Email', key: 'email' },
                { title: 'Platform Type', key: 'platform_type' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added', key: 'created_at' },
                { title: 'Action',  key: 'action', sortable: false},
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
                Email: yup.string().required().email(),
                Platform: yup.string().required()
            });
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
            this.showLoader = true;
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
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // create and update network
        saveManualNetwork() {
            this.showLoader = true;
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
            this.showLoader = true;
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
    .add-height {
        height: 50px;
    }
</style>

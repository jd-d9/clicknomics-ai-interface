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
                            <span>Manual Network</span>
                        </div>
                        <v-spacer/>
                        <!-- <v-btn to="/admin/img/doc/manual-networks-metrics.csv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn to="#exampleModalCenter" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn> -->
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="createActivity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated"
                                :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus"> <!-- || !restrictUser -- Abhi ke liye comment - backend -->
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Manual Network List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col cols="12" lg="7" md="7" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4"
                            :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100, -1] }" :headers="headers"
                            :items="dataMetrics" :search="search"
                            :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{ item.selectable.id ? item.selectable.id : '-' }}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                {{ item.selectable.network ? item.selectable.network : '-' }}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{ item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.platform_type`]="{ item }">
                                {{ item.selectable.platform_type ? item.selectable.platform_type : '-' }}
                            </template>
                            <template v-slot:[`item.company`]="{ item }">
                                {{ item.selectable.company ? item.selectable.company : '-' }}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{ item.selectable.notes ? item.selectable.notes : '-' }}
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                {{ format_date(item.selectable.created_at) }}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon
                                    @click.prevent="edit(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon
                                    @click.prevent="showConfirmation(item.selectable.id)"
                                    :disabled="permissions.delete_auth == '0'">
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
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <label class="font-weight-medium">
                                        Are you sure you want to delete your affiliate?.
                                    </label>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3"
                                    append-icon="mdi-delete-empty" @click="deleteAccount()">Delete</v-btn>
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close"
                                    @click="cancel()">Cancel</v-btn>
                            </v-col>
                        </div>
                    </div>
                </v-dialog>
            </v-row>
        </template>
        <!--End confirmation alert box -->

        <!-- Create & Update Manual Network List-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{ activityType }} Manual Network</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <Form @submit="saveManualNetwork" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row class="align-center">
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Network Name</label>
                                    <Field type="text" name="Name" id="input-username"
                                        :class="{ 'form-control': true, 'border-red-600': errors.Name }" placeholder="Add Name"
                                        v-model="list.name" />
                                    <span class="text-red-600" v-if="errors.Name">Network name is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="email" name="Email" id="input-username"
                                        :class="{ 'form-control': true, 'border-red-600': errors.Email }" placeholder="Email"
                                        v-model="list.email" />
                                    <ErrorMessage class="text-red-600" name="Email" />
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Platform Type</label>
                                    <Field type="text" name="Platform" id="input-username"
                                        :class="{ 'form-control': true, 'border-red-600': errors.Platform }" placeholder="Type"
                                        v-model="list.platform_type" />
                                    <span class="text-red-600" v-if="errors.Name">Platform type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Company</label>
                                    <input type="text" id="input-username" :class="{ 'form-control': true }"
                                        placeholder="Company" v-model="list.company">
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <textarea :class="{ 'form-control': true }" name="Notes" rows="5"
                                        v-model="list.notes"></textarea>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12"
                                    class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12"
                                    class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ ind + 1
                                        + '.' }} {{ error }}</small>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="reset" id="reset_button" class="text-none"
                                    append-icon="mdi-content-save">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3"
                                    append-icon="mdi-content-save">Save</v-btn>
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close"
                                    @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@axios';
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
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Network ID', align: 'start', sortable: false, key: 'id' },
                { title: 'Network Name', key: 'network' },
                { title: 'Email', key: 'email' },
                { title: 'Platform Type', key: 'platform_type' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added', key: 'created_at' },
                { title: 'Action', key: 'action', sortable: false },
            ],
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
            restrictUser: true,
            backendErrorMessage: '',
            multipleErrors: [],
            isHidden: false,
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
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // formate date
        format_date(value) {
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            } else {
                return '-';
            }
        },
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#createUpdateData').modal('hide');
        },
        // get manual network listing
        getManualNetworkListing() {
            this.showLoader = true;
            axios.get(this.$api + '/network/manualNetworks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if (response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
                    this.restrictUser = getData.restrict_user;
                    this.showLoader = false;
                } else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if (error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.errors) {
                    if (error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    } else if (error.response.data.errors.length == 0) {
                        this.backendErrorMessage = '';
                    } else {
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
            axios.post(`${this.$api}/${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
                .then(response => {
                    if (response.data.success) {
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.getManualNetworkListing();
                        this.closeModal();
                        this.showLoader = false;
                    } else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.backendErrorMessage = error.response.data.message;
                    }
                    if (error.response.data.error) {
                        this.backendErrorMessage = error.response.data.error;
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.backendErrorMessage = error.response.data.errors[0];
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
                            this.multipleErrors = error.response.data.errors;
                        }
                    }
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
            setTimeout(() => {
                document.getElementById('reset_button').click();
                this.openModal();
            }, 100)
        },
        // get data for edit
        edit(id) {
            document.getElementById('reset_button').click();
            setTimeout(() => {
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
            }, 100)
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
            axios.delete(this.$api + '/network/manualNetworks/' + this.accountIdToDelete, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
                .then(response => {
                    if (response.data.success) {
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.getManualNetworkListing();
                        this.cancel();
                        this.showLoader = false;
                    } else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.showLoader = false;
                    }
                }).catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
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
    }
}
</script>

<style scoped>.add-height {
    height: 50px;
}

#reset_button {
    opacity: 0 !important;
    cursor: default !important;
}</style>

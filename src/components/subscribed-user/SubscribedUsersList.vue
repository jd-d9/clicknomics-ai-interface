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
                            <span>Subscribed Users</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="addNewUser" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Add User
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Subscribed Users
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col cols="12" lg="6" md="6" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.first_name`]="{ item }">
                                <span v-if="item.selectable.first_name != null && item.selectable.last_name != null">{{item.selectable.first_name + ' ' + item.selectable.last_name}}</span>
                                <span v-else>-</span>
                            </template>
                            <template v-slot:[`item.subscribe_user_email`]="{ item }">
                                {{item.selectable.subscribe_user_email ? '******' : '-'}}
                            </template>
                            <template v-slot:[`item.company_name`]="{ item }">
                                {{item.selectable.company_name ? item.selectable.company_name : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-switch color="primary" v-model="item.selectable.status" hide-details true-value="1" false-value="0" class="ms-auto d-inline-flex justify-content-end mr-2" @click="updateStatus(item.selectable.id)"></v-switch>
                            </template>
                            <template v-slot:[`item.trial_ends_at`]="{ item }">
                                {{format_date(item.selectable.trial_ends_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editUser(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteUser(item.selectable.id)" v-if="item.selectable.role_id != roleId" :disabled="permissions.delete_auth == '0'">
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
    </div>
</template>

<script>
    import axios from '@axios';
    import moment from 'moment';
    export default {
        data() {
            return {
                message: {},
                search: '',
                headers: [
                    { title: 'ID', key: 'id', align: 'start' },
                    { title: 'Name', key: 'first_name' },
                    { title: 'Email', key: 'subscribe_user_email' },
                    { title: 'Company Name', key: 'company_name' },
                    { title: 'Status', key: 'status' },
                    { title: 'Expire On', key: 'trial_ends_at' },
                    { title: 'Action', align:'center', key: 'action', sortable: false },
                ],
                itemsPerPage: -1,
                roleId: sessionStorage.getItem('roleId'),
                showLoader: false,
                items: [],
                permissions: {},
                isHidden: false,
            }
        },
        methods: {
            // formate date
            format_date(value){
                if (value) {
                    return moment(String(value)).format('YYYY-MM-DD');
                } else {
                    return '-';
                }
            },
            // get subscribe user data
            getUsersData() {
                this.showLoader = true;
                axios.get(this.$api + '/settings/subscribeUser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        const getData = response.data;
                        this.items = getData.data;
                        this.permissions = getData.permission;
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
                    this.showLoader = false;
                    console.log(error)
                }); 
            },
            // add new user
            addNewUser() {
                this.$router.push('/settings/subscribed_user/create')
            },
            // redirect on edit page
            editUser(id) {
                this.$router.push('/settings/subscribed_user/' + id + '/edit');
            },
            // delete regestered user
            deleteUser(id) {
                this.showLoader = true;
                axios.delete(this.$api + '/settings/subscribeUser/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.getUsersData();
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
            // update status
            updateStatus(id) {
                this.showLoader = true;
                axios.get(this.$api + '/settings/subscribeUser/changeStatus/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                        this.message = {
                            text: response.data.message,
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.getUsersData();
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
            }
        },
        mounted() {
            this.getUsersData();
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            this.isHidden = screen.width < 960 ? true : false;
            window.addEventListener('resize', () => {
                this.isHidden = screen.width < 960 ? true : false;
            });
        }
    }
</script>
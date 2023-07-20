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
                        <span>Subscribe Users</span>
                        <v-spacer />

                        <v-btn @click.prevent="addNewUser" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add User
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Subscribe Users
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchUser"/>
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-'}}
                            </template>
                            <template v-slot:[`item.company_name`]="{ item }">
                                {{item.selectable.company_name ? item.selectable.company_name : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-switch color="#0d47a1" v-model="item.selectable.status" hide-details true-value="1" false-value="0" class="ms-auto d-inline-flex justify-content-end mr-2"></v-switch>
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
    export default {
        data() {
            return {
                // images: {
                //     edit: require('/assets/img/icons/edit.svg'),
                //     bin: require('/assets/img/icons/bin.svg'),
                // },
                search: '',
                headers: [
                    { title: 'ID', key: 'id', align: 'start' },
                    { title: 'Name', key: 'name' },
                    { title: 'Email', key: 'email' },
                    { title: 'Company Name', key: 'company_name' },
                    { title: 'Status', key: 'status' },
                    { title: 'Action', align:'center', key: 'action', sortable: false },
                ],
                itemsPerPage: -1,
                roleId: sessionStorage.getItem('roleId'),
                showLoader: false,
                items: [],
                userFilter: [],
                permissions: {},
                searchInput: '',
            }
        },
        methods: {
            // get subscribe user data
            getUsersData() {
                this.showLoader = true;
                this.axios.get(this.$api + '/settings/subscribeUser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        const getData = response.data;
                        this.items = getData.data.data;
                        this.userFilter = getData.data.data;
                        this.permissions = getData.permission;
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    this.showLoader = false;
                    console.log(error)
                }); 
            },
            // search user from table
            searchUser() {
                this.items = this.userFilter.filter((val) => {
                    return val.name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                           val.id.toString().includes(this.searchInput.toLowerCase()) || 
                           val.email.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                           val.company_name.toLowerCase().includes(this.searchInput.toLowerCase())
                })
            },
            // add new user
            addNewUser() {
                this.$router.push('/settings/subscribe_user/create')
            },
            // redirect on edit page
            editUser(id) {
                this.$router.push('/settings/subscribe_user/' + id + '/edit');
            },
            // delete regestered user
            deleteUser(id) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/settings/subscribeUser/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getUsersData();
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
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    console.log(error)
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
        }
    }
</script>
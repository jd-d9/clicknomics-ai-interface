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
                        <span>User Roles</span>
                        <v-spacer />

                        <v-btn @click.prevent="addNewUserRole" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add User Role
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            User Roles List
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.role_name`]="{ item }">
                                {{item.selectable.role_name ? item.selectable.role_name : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon :disabled="permissions.update_auth == '0'" @click.prevent="editRole(item.selectable.id)">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon v-if="item.selectable.id != '1'" :disabled="permissions.delete_auth == '0'" @click.prevent="deleteRole(item.selectable.id)">
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
            items: [],
            showLoader: false,
            permissions: {},
            headers: [
                { title: 'ID', key: 'id', align: 'start' },
                { title: 'Role Name', key: 'role_name' },
                { title: 'Action', align:'center', key: 'action', sortable: false },
            ],
        }
    },
    methods: {
        // get all user role
        getUserRole() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/role', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.data.roles);
                    this.items = response.data.data.roles;
                    this.permissions = response.data.data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                this.showLoader = false;
                console.log(error)
            }); 
        },
        // add new user role
        addNewUserRole() {
            this.$router.push('/settings/user_management/user_roles/create');
        },
        // edit user role
        editRole(id) {
            this.$router.push('/settings/user_management/user_roles/' + id + '/edit');
        },
        // delete user role
        deleteRole(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/settings/role/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.showLoader = false;
                    this.$toast.open({
                        message: 'Role deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getUserRole();
                }
            })
            .catch(error => {
                this.showLoader = false;
                this.$toast.open({
                    message: error.response.data.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
            }); 
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getUserRole();
    }
}
</script>

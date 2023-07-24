<template>
    <div>
        <loader-component v-if="showLoader"></loader-component>
        <v-card class="card_design mb-4">
            <v-card-title class="d-flex justify-space-between">
                {{breadCrumbMessage}} Role
            </v-card-title>
            <v-divider class="border-opacity-100 my-4" color="success" />

            <form @submit.prevent="manageUserRole">
                <v-row>
                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Role Name</label>
                        <input type="text" id="input-username" name="Rolename"
                            :class="{ 'form-control': true, 'border-red-600': roleNameInvalid }" placeholder="Role Name"
                            v-model.trim="roleName" @blur="roleNameIsValid" />
                        <span class="text-red-600" v-if="roleNameInvalid">Role name can not be empty</span>
                    </v-col>
                </v-row>

                <!-- data table component -->
                <v-data-table class="table-hover-class mt-4" :headers="headers" :items="menuItem"
                    :itemsPerPage="itemsPerPage">
                    <template v-slot:[`item.parent`]="{ item }">
                        {{ item.selectable.parent ? item.selectable.parent.menu : '-' }}
                    </template>
                    <template v-slot:[`item.menu`]="{ item }">
                        {{ item.selectable.menu ? item.selectable.menu : '-' }}
                    </template>
                    <template v-slot:[`item.view`]="{ item }">
                        <label class="custom-toggle">
                            <input type="checkbox" v-model="item.selectable.view"
                                :disabled="isDisabled(item.selectable, 'view')">
                            <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                data-label-on="Yes"></span>
                        </label>
                    </template>
                    <template v-slot:[`item.create`]="{ item }">
                        <label class="custom-toggle">
                            <input type="checkbox" v-model="item.selectable.create_auth"
                                :disabled="isDisabled(item.selectable, 'create')">
                            <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                data-label-on="Yes"></span>
                        </label>
                    </template>
                    <template v-slot:[`item.edit`]="{ item }">
                        <label class="custom-toggle">
                            <input type="checkbox" v-model="item.selectable.update_auth"
                                :disabled="isDisabled(item.selectable, 'edit')">
                            <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                data-label-on="Yes"></span>
                        </label>
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                        <label class="custom-toggle">
                            <input type="checkbox" v-model="item.selectable.delete_auth"
                                :disabled="isDisabled(item.selectable, 'delete')">
                            <span class="custom-toggle-slider rounded-circle" data-label-off="No"
                                data-label-on="Yes"></span>
                        </label>
                    </template>
                </v-data-table>

                <v-col cols="12" sm="12" md="12" lg="12">
                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3"
                        append-icon="mdi-content-save">Save</v-btn>
                    <v-btn type="reset" v-if="!toggleButton" class="text-none bg-red-darken-2 btn_animated"
                        append-icon="mdi-backup-restore">Reset</v-btn>
                </v-col>
            </form>
        </v-card>
    </div>
</template>

<script>
// import * as yup from 'yup';
// import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    // components: {
    //     Form, 
    //     Field, 
    //     ErrorMessage
    // },
    data() {
        return {
            roleName: '',
            roleNameInvalid: '',
            showLoader: false,
            menuItem: [],
            toggleButton: false,
            headers: [
                { title: 'Parent Menu', key: 'parent', align: 'start' },
                { title: 'Menu Name', key: 'menu', align: 'start' },
                { title: 'View', key: 'view', align: 'center' },
                { title: 'Create', key: 'create', align: 'center' },
                { title: 'Edit', key: 'edit', align: 'center' },
                { title: 'Delete', key: 'delete', align: 'center' },
            ],
            view: 'No',
            create: 'No',
            edit: 'No',
            delete: 'No',
            itemsPerPage: -1,
            breadCrumbMessage: 'Create',
        }
    },
    // computed: {
    //     schema() {
    //         return yup.object({
    //             Rolename: yup.string().required(),
    //         });
    //     },
    // },
    methods: {
        // get all user roles
        getAllUserRole() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/rolemenulist', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.menuItem = response.data.data;
                    console.log(this.menuItem);
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
        // role name validation
        roleNameIsValid() {
            if (!this.roleName) {
                this.roleNameInvalid = 'Role name must not be empty';
            }
            else {
                this.roleNameInvalid = '';
            }
        },
        // get user role data for edit user role
        getUserRole() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/role/' + this.$route.params.id + '/edit', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.menuItem = response.data.data.menus;
                    this.roleName = response.data.data.role.role_name;
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
        // create and update user role
        manageUserRole() {
            this.roleNameIsValid();
            // update user role
            if (this.$route.params.id) {
                if (!this.roleName || this.roleNameInvalid) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    return false;
                }
                else {
                    this.showLoader = true;
                    this.axios.post(this.$api + '/settings/role/' + this.$route.params.id, {
                        role_name: this.roleName,
                        role_permission: JSON.stringify(this.menuItem),
                        _method: 'PUT'
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                        }
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.$toast.open({
                                message: response.data.message,
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.$router.push('/settings/user_management/user_roles');
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
                }
            }
            // create user role
            else {
                if (!this.roleName || this.roleNameInvalid) {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    return false;
                }
                else {
                    this.showLoader = true;
                    this.axios.post(this.$api + '/settings/role', {
                        role_name: this.roleName,
                        role_permission: JSON.stringify(this.menuItem)
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                        }
                    })
                    .then(response => {
                        if (response.data.success) {
                            this.menuItem = response.data;
                            console.log(this.menuItem);
                            this.$toast.open({
                                message: response.data.message,
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.$router.push('/settings/user_management/user_roles');
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
                }
            }
        },
        // reset form data
        resetForm() {
            window.location.reload();
        },
        isDisabled(value, type) {
            console.log(value, type)
            if (value.menu == 'Dashboard') {
                if (type != 'view') {
                    return true;
                }
            } else if (value.view != true) {
                value.create_auth = false;
                value.update_auth = false;
                value.delete_auth = false;
                console.log(value.view)
                if (type == 'view') {
                    return false;
                } else {
                    return true;
                }
            } else if (value.resource) {
                const permission = value.resource.split(',');
                if (type == 'view') {
                    return permission.includes('0') ? false : true;
                    // console.log(permission.includes('0'), value.menu, type);
                } else if (type == 'create') {
                    return permission.includes('1') ? false : true;
                    // console.log(permission.includes('1'), value.menu, type);
                } else if (type == 'edit') {
                    return permission.includes('2') ? false : true;
                    // console.log(permission.includes('2'), value.menu, type);
                } else if (type == 'delete') {
                    return permission.includes('3') ? false : true;
                    // console.log(permission.includes('3'), value.menu, type);
                }
            } else {
                return false;
            }
        },

    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getAllUserRole();
        if (this.$route.params.id) {
            this.getUserRole();
            this.toggleButton = true;
            this.breadCrumbMessage = 'Edit';
        }
    }
}
</script>

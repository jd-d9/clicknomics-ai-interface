<template>
    <div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class=" col ">
                    <div class="card">
                        <div class="card-body">
                            <Form @submit.prevent="manageUserRole">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Role Name</label>
                                            <input type="text" name="Rolename" id="input-username" :class="{'form-control': true, 'border-red-600': roleNameInvalid}" placeholder="Role Name" v-model.trim="roleName" @blur="roleNameIsValid"/>
                                            <span v-if="roleNameInvalid" class="text-red-600">Role name can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Rolename"/> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="table-responsive">
                                    <table class="table align-items-center">
                                        <thead class="thead-light">
                                            <tr>
                                                <th class="border-right">Module</th>
                                                <th class="text-center border-right collumn-width">View</th>
                                                <th class="text-center border-right collumn-width">Create</th>
                                                <th class="text-center border-right collumn-width">Edit</th>
                                                <th class="text-center border-right collumn-width">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody class="list">
                                            <tr v-for="(list, index) in menuItem" :key="index">
                                                <th>{{list.menu}}</th>
                                                <td class="text-center">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox"  v-model="list.view">
                                                        <span class="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </td>
                                                <td class="text-center">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox"  v-model="list.create_auth">
                                                        <span class="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </td>
                                                <td class="text-center">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox"  v-model="list.update_auth">
                                                        <span class="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </td>
                                                <td class="text-center">
                                                    <label class="custom-toggle">
                                                        <input type="checkbox"  v-model="list.delete_auth">
                                                        <span class="custom-toggle-slider rounded-circle" data-label-off="No" data-label-on="Yes"></span>
                                                    </label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                            <button type="button" v-if="!toggleButton" class="btn btn-secondary btn-lg btn_animated" @click.prevent="resetForm">Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import * as yup from 'yup';
// import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
// import { required } from '@vee-validate/rules';
// import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
// defineRule('required', required);
// loadLocaleFromURL(
//   'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/ar.json'
// );
// configure({
//     generateMessage: localize('en', {
//         messages: {
//             required: '{field} can not be empty!',
//         },
//         // fields: {
//         //     Status: {
//         //         required: 'Status can not be empty!!!'
//         //     }
//         // }
//     }),
// });
export default {
    // components: {
    //     Form, Field, ErrorMessage
    // },
    data() {
        return {
            roleName: '',
            roleNameInvalid: '',
            hideShowLoader: false,
            menuItem: [],
            toggleButton: false,
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
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/settings/rolemenulist', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.menuItem = response.data.data;
                    console.log(this.menuItem);
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                this.hideShowLoader = false;
                console.log(error)
            }); 
        },
        // role name validation
        roleNameIsValid() {
            if(!this.roleName) {
                this.roleNameInvalid = 'Role name must not be empty';
            }
            else {
                this.roleNameInvalid = '';
            }
        },
        // get user role data for edit user role
        getUserRole() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/settings/role/' + this.$route.params.id + '/edit', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.menuItem = response.data.data.menus;
                    this.roleName = response.data.data.role.role_name;
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                this.hideShowLoader = false;
                console.log(error)
            }); 
        },
        // create and update user role
        manageUserRole() {
            this.roleNameIsValid();
            // update user role
            if(this.$route.params.id) {
                this.hideShowLoader = true;
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
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Role details updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.$router.push('/settings/user_management/user_roles');
                        this.hideShowLoader = false;
                    }
                })
                .catch(error => {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.hideShowLoader = false;
                    console.log(error)
                }); 
            }
            // create user role
            else {
                if(!this.roleName || this.roleNameInvalid) {
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                    return false;
                }
                else{
                    this.hideShowLoader = true;
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
                        if(response.data.success) {
                            this.menuItem = response.data;
                            console.log(this.menuItem);
                            this.$toast.open({
                                message: 'New role created',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.$router.push('/settings/user_management/user_roles');
                            this.hideShowLoader = false;
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
                        this.hideShowLoader = false;
                    }); 
                }
            }
        },
        // reset form data
        resetForm() {
            window.location.reload();
        }
    },
    mounted() {
        this.getAllUserRole();
        if(this.$route.params.id) {
            this.getUserRole();
            this.toggleButton = true;
        }
    }
}
</script>

<style  scoped>
    .border-red-600 {
        --border-opacity: 1;
        border-color: #e53e3e;
        border-color: rgba(229,62,62,var(--border-opacity));
    }
    .border-right, .thead-light {
        border: 1px solid #dedede !important;
    }
    .table th, .table td {
        padding: 0.75rem !important;
    }
    .collumn-width {
        width: 15%;
    }
    .list tr:last-child {
        border-bottom: 1px solid transparent !important;
    }
</style>

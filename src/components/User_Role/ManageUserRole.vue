<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a href="/settings/user_management/user_roles">User Roles</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">{{ breadCrumbText }}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/user_management/user_roles" class="btn btn-lg btn-neutral btn_animated">Back</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class=" col ">
                    <div class="card">
                        <div class="card-body">
                            <form>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Role Name</label>
                                            <input type="text" id="input-username" :class="{'form-control': true, 'is-invalid': roleNameInvalid }" placeholder="Role Name" v-model.trim="roleName" @keyup="roleNameIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ roleNameInvalid }}</strong>
                                            </span>
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
                                    <div class="col-lg-6" v-if="!toggleButton">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="createUserRole">Save</button>
                                            <button type="button" class="btn btn-secondary btn-lg btn_animated">Reset</button>
                                        </div>
                                    </div>
                                    <div class="col-lg-6" v-else>
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="updateUserRole">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roleName: '',
            roleNameInvalid: '',
            hideShowLoader: false,
            menuItem: [],
            toggleButton: false,
            breadCrumbText: 'Create User Role',
        }
    },
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
        // create new user role
        createUserRole() {
            this.roleNameIsValid();
            if(!this.roleName || this.roleNameInvalid) {
                window.scrollTo({top: 0, behavior: 'smooth'});
                return false
            }
            else {
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
        },
        // get new user role
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
        // update user role
        updateUserRole() {
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
    },
    mounted() {
        this.getAllUserRole();
        if(this.$route.params.id) {
            this.getUserRole();
            this.toggleButton = true;
            this.breadCrumbText = 'Edit User Role';
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

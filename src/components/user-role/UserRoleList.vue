<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header content -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">User Roles</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="rolePermission.create_auth == '0'" @click.prevent="addNewUserRole">Add User Role</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="rolePermission.view == '1'">
                    <div class="card">
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table align-items-center">
                                    <thead class="thead-light">
                                        <tr>
                                            <th class="collumn-width2 border-right">Id</th>
                                            <th class="border-right">Role Name</th>
                                            <th class="border-right text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="list add-side-borders">
                                        <tr v-for="(role, index) in items" :key="index">
                                            <th>{{role.id}}</th>
                                            <td>{{role.role_name}}</td>
                                            <td class="text-center collumn-width">
                                                <button class="disable-button" :disabled="rolePermission.update_auth == '0'" @click.prevent="editRole(role.id)">
                                                    <img src="/assets/img/icons/edit.svg" class="image-width" title="Edit role">
                                                </button>
                                                <button class="disable-button text-start" v-if="role.id != '1'" :disabled="rolePermission.delete_auth == '0'" @click.prevent="deleteRole(role.id)">
                                                    <img src="/assets/img/icons/bin.svg" class="image-width" title="Delete role">
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" v-else>
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
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
            // images: {
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            // },
            items: [],
            showLoader: false,
            rolePermission: {},
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
                    this.rolePermission = response.data.data.permission;
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
        this.getUserRole();
    }
}
</script>

<style scoped>
    .image-width {
        width: 30px;
    }
    .border-right, .thead-light {
        border: 1px solid #dedede !important;
    }
    .table th {
        padding: 0.75rem !important;
    }
    .collumn-width {
        width: 15%;
    }
    .collumn-width2 {
        width: 25%;
    }
    .disable {
        pointer-events: none;
        cursor: progress;
    }
    .disable-button {
        border: none;
        background: transparent;
    }
    .disable-button[disabled] {
        cursor: not-allowed;
    }
    .add-side-borders {
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;
    }
</style>

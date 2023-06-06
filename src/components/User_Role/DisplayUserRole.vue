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
                                    <li class="breadcrumb-item active" aria-current="page">User Roles</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/user_management/user_roles/create" class="btn btn-lg btn-neutral btn_animated">Add User Role</a>
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
                            <div class="table-responsive">
                                <table class="table align-items-center">
                                    <thead class="thead-light">
                                        <tr>
                                            <th class="collumn-width2 border-right">Id</th>
                                            <th class="border-right">Role Name</th>
                                            <th class="border-right text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="list">
                                        <tr v-for="(role, index) in items" :key="index">
                                            <th>{{role.id}}</th>
                                            <td>{{role.role_name}}</td>
                                            <!-- <td class="collumn-width text-center">
                                                <a href="javascript:void(0);" @click="editRole(role.id)">
                                                    <img :src="images.edit" class="image-width" title="Edit role">
                                                </a>
                                            </td> -->
                                            <td class="text-center">
                                                <a href="javascript:void(0);" @click="editRole(role.id)">
                                                    <img :src="images.edit" class="image-width" title="Edit role">
                                                </a>
                                                <a href="javascript:void(0);" @click="deleteRole(role.id)">
                                                    <img :src="images.bin" class="image-width" title="Delete role">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
            images: {
                edit: require('../../assets/img/icons/edit.svg'),
                bin: require('../../assets/img/icons/bin.svg'),
            },
            items: [],
            hideShowLoader: false
        }
    },
    methods: {
        // get all user role
        getUserRole() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/settings/role', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.data.data);
                    this.items = response.data.data.data;
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                this.hideShowLoader = false;
                console.log(error)
            }); 
        },
        // delete user role
        deleteRole(id) {
            this.axios.delete(this.$api + '/settings/role/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
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
                this.$toast.open({
                    message: error.response.data.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
            }); 
        },
        // edit user role
        editRole(id) {
            this.$router.push('/settings/user_management/user_roles/' + id + '/edit');
        }
    },
    mounted() {
        this.getUserRole();
    }
}
</script>

<style scoped>
    a[disabled]:hover {
    cursor: not-allowed;
    }
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
</style>

<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Users</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="userPermissions.create_auth == '0'" @click.prevent="addNewUser">Add User</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="userPermissions.view == '1'">
                    <div class="card">
                        <div class="card-body">
                            <div class="v-card v-sheet theme--light">
                                <div class="card-header text-end">
                                    <div class="row">
                                        <div class="col-3 ms-auto">
                                            <div class="ms-auto search-input position-relative">
                                                <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchUser">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- data table component -->
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items" :search="search" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <th>{{item.selectable.id}}</th>
                                            <td>{{item.selectable.name}}</td>
                                            <td>{{item.selectable.email}}</td>
                                            <td>+{{item.selectable.country_code}} - {{item.selectable.phone_number}}</td>
                                            <td class="text-center">
                                                <button class="disable-button" :disabled="userPermissions.update_auth == '0'" @click.prevent="editUser(item.selectable.id)">
                                                    <img :src="images.edit" class="icon-width" title="Edit user">
                                                </button>
                                                <button class="disable-button" :disabled="userPermissions.delete_auth == '0'" @click.prevent="deleteUser(item.selectable.id)" v-if="item.selectable.role_id != roleId">
                                                    <img :src="images.bin" class="icon-width" title="Delete user">
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
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
                images: {
                    edit: require('../../assets/img/icons/edit.svg'),
                    bin: require('../../assets/img/icons/bin.svg'),
                },
                search: '',
                headers: [
                    { title: 'ID', key: 'id', align: 'start' },
                    { title: 'Name', key: 'name' },
                    { title: 'Email', key: 'email' },
                    { title: 'Mobile No.', key: 'phone_number' },
                    { title: 'Action', align:'center', key: 'action', sortable: false },
                ],
                itemsPerPage: -1,
                roleId: sessionStorage.getItem('roleId'),
                hideShowLoader: false,
                items: [],
                userFilter: [],
                userPermissions: {},
                searchInput: '',
            }
        },
        methods: {
            // get regestered user data
            getUsersData() {
                this.hideShowLoader = true;
                this.axios.get(this.$api + '/settings/user', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data.data.user.data, 'users');
                        this.items = response.data.data.user.data;
                        this.userFilter = response.data.data.user.data;
                        this.userPermissions = response.data.data.permission;
                        this.hideShowLoader = false;
                    }
                })
                .catch(error => {
                    this.hideShowLoader = false;
                    console.log(error)
                }); 
            },
            // search user from table
            searchUser() {
                this.items = this.userFilter.filter((val) => {
                    return val.name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                           val.id.toString().includes(this.searchInput.toLowerCase()) || 
                           val.email.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                           val.country_code.concat(" ", val.phone_number).toLowerCase().includes(this.searchInput.toLowerCase())
                })
            },
            // add new user
            addNewUser() {
                this.$router.push('/settings/user_management/users/create')
            },
            // redirect on edit page
            editUser(id) {
                this.$router.push('/settings/user_management/users/' + id + '/edit');
            },
            // delete regestered user
            deleteUser(id) {
                console.log(id, 'id')
                this.hideShowLoader = true;
                this.axios.delete(this.$api + '/settings/user/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.hideShowLoader = false;
                        this.$toast.open({
                            message: 'User deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getUsersData();
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
        mounted() {
            this.getUsersData();
        }
    }
</script>

<style>
    .search-input {
        width: 80%;
    }
    .search-input input{
        width: 100%;
        border: none !important;
        border-radius: 0px !important;
        border-bottom: 2px solid rgb(182, 182, 182) !important;
        background: transparent !important;
        padding: 6px 2px !important;
        height: unset !important;
        font-size: 16px !important;
    }
    .search-input input:focus{
        outline: none;
    }
    .search-input::before {
        position: absolute;
        content: '';
        z-index: 50000;
        width: 100%;
        height: 2px;
        top: 96%;
        left: 0;
        transform: scale(0, 1);
        background-color: rgb(4 96 180);
    }
    @font-face {
        font-family: fontAwesomeFont;
        src: url(../../assets/fonts/font_awesome/fa-solid-900.ttf);
    }
    .search-input:hover::before {
        transform: scale(1, 1);
        transition: all 0.4s ease;
    }
    .search-input::after {
        content: '\f002';
        position: absolute;
        background-color: rgb(232 240 254);
        color: rgb(4 96 180);
        font-family: fontAwesomeFont;
        font-size: 18px;
        top: 5px;
        right: 5px;
    }
    /* may be it's necessary to keep in scoped tag if not working */
    .icon-width {
        width: 30px;
    }
    .table-body-back {
        font-size: 14px !important;
    }
    .table-body-back th {
        font-weight: 600 !important;
    }
    .disable-button {
        border: none;
        background: transparent;
    }
    .disable-button[disabled] {
        cursor: not-allowed;
    }
</style>
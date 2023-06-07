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
                            <router-link to="/settings/user_management/users/create" class="btn btn-lg btn-neutral btn_animated">Add User</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
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
                                <table-component :users="items" :updateUserData="getUsersData"></table-component>
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
</style>
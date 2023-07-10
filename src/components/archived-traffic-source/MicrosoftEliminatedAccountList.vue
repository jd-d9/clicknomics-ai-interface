<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Microsoft Eliminated Accounts List</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <v-data-table class="table-hover-class elevation-1" :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <td>{{item.selectable.name}}</td>
                                            <td>{{item.selectable.account_id}}</td>
                                            <td>{{item.selectable.number}}</td>
                                            <td>{{format_date(item.selectable.deleted_at)}}</td>
                                            <td>
                                                <button class="disable-button" @click.prevent="restoreMicrosoftAdsAccount(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                                    <img src="/assets/img/icons/restore.svg" class="icon-width" title="Restore">
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                    </v-app>
                </div>
                <div class="col" v-if="permissions.view != '1' && !showLoader">
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
import moment from 'moment';
export default {
    // props: ['list'],
    components: {
    },
    data() {
        return {
            showLoader: false,
            singleExpand: true,
            networkHeaders: [
                { title: 'Account Name',  key: 'name' },
                { title: 'Account ID',  key: 'account_id' },
                { title: 'Account Number',  key: 'number' },
                { title: 'Date On Removed',  key: 'deleted_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        this.getAllData();
    },
    methods: {
        // get listing of all data
        getAllData() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/archivedmicrosoftads', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.linkedNewtworks = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // restore account
        restoreMicrosoftAdsAccount(id) {
            if(confirm("Do you really want to restore account?")) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('id', id);
                this.axios.post(this.$api + '/settings/archivedmicrosoftads/restoreMicrosftAdsAccount', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Account restored',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getAllData();
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    console.log(error);
                    this.showLoader = false;
                });
            }
        },
        // format date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
    }
}
</script>

<style scoped>

</style>

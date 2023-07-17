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
                                    <li class="breadcrumb-item active" aria-current="page">Eliminated Manual Networks List</li>
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
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="linkedNewtworks" :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.id}}</td>
                                                        <td>{{item.selectable.network}}</td>
                                                        <td>{{item.selectable.email ? item.selectable.email : '-'}}</td>
                                                        <td>{{item.selectable.platform_type ? item.selectable.platform_type : '-'}}</td>
                                                        <td>{{item.selectable.company ? item.selectable.company : '-'}}</td>
                                                        <td>{{item.selectable.notes ? item.selectable.notes : '-'}}</td>
                                                        <td>{{format_date(item.selectable.deleted_at)}}</td>
                                                        <td>
                                                            <router-link to="" @click="restoreManualNetwork(item.selectable.id)">
                                                                <img src="/assets/img/icons/restore.svg" style="width:30px">
                                                            </router-link>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-app>
                                </div>
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
    data() {
        return {
            showLoader: false,
            linkedNewtworks: [],
            headers: [
                { title: 'Network ID', align: 'start', sortable: false, key: 'id' },
                { title: 'Network Name', key: 'network' },
                { title: 'Email', key: 'email' },
                { title: 'Platform Type', key: 'platform_type' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date On Removed', key: 'deleted_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        this.getEliminatedAutomatedNetwork();
    },
    methods: {
        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
        // get manual network listing
        getEliminatedAutomatedNetwork() {
            this.showLoader = true;
            this.axios.get(this.$api + '/network/eliminated-manual-networks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.linkedNewtworks = data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // restore data
        restoreManualNetwork(id) {
            if(confirm("Do you really want to restore network?")) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('id', id);
                this.axios.post(this.$api + '/network/eliminated-manual-network/restoreManualNetwork', formData,{
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                        }
                    })
                .then(response => {
                    this.showLoader = false;
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.linkedNewtworks = response.data.data;
                }).catch(error => {
                    this.showLoader = false;
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                });
            }
        },
    }
}
</script>

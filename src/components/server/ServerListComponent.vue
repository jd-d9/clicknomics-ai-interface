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
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active text-capitalize" aria-current="page">Cloudways Server List</li>
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
                    <div class="card">
                        <div class="card shadow">
                            <div class="card-body">
                                <div class="tab-content" id="myTabContent">
                                    <div class="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <v-app>
                                            <v-card>
                                                <v-card-title>
                                                    <v-spacer></v-spacer>
                                                    <v-row>
                                                        <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                        <v-col class="d-flex search_width" cols="12" sm="4">
                                                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-title>
                                                <!-- data table component -->
                                                <v-data-table :headers="headers" :items="serverListRecord" :search="search" :single-expand="singleExpand" show-expand v-model:expanded="expanded" item-value="server_id" class="table-hover-class adding-font-size elevation-1" :itemsPerPage="itemsPerPage">
                                                    <template v-slot:expanded-row="{ columns, item }">
                                                        <td class="exapanded" :colspan="columns.length">
                                                            <!-- exapnded table data -->
                                                            <table class="table align-items-center" v-if="serverListRecord.length > 0">
                                                                <thead class="thead-light">
                                                                    <tr>
                                                                        <th class="border-right" scope="col">Label</th>
                                                                        <th class="border-right" scope="col">App User</th>
                                                                        <th class="border-right" scope="col">App FQDN</th>
                                                                        <th class="border-right" scope="col">App CNAME</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="list">
                                                                    <tr v-for="(row , index) in item.selectable.children" :key="index">
                                                                        <td>
                                                                            {{row.label}}
                                                                        </td>
                                                                        <td>
                                                                            {{row.app_user}}
                                                                        </td>
                                                                        <td>
                                                                            {{row.app_fqdn}}
                                                                        </td>
                                                                        <td>
                                                                            {{row.cname}}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </template>
                                                </v-data-table>
                                            </v-card>
                                        </v-app>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
export default {
    data() {
        return {
            showLoader: false,
            serverListRecord: [],
            search: '',
            singleExpand: true,
            expanded: [],
            headers: [
                { title: '', key: 'data-table-expand' },
                { title: 'Email', align: 'start', sortable: true, key: 'cloudways_parent.email' },
                { title: 'Server ID', align: 'start', sortable: true, key: 'server_id' },
                { title: 'Name', key: 'label' },
                { title: 'IP', key: 'public_ip' },
                { title: 'Platform', key: 'platform' },
            ],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        this.getListingData();
    },
    methods: {
        // get all data listings
        getListingData() {
            this.showLoader = true;
            this.axios.get(this.$api + '/server', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.serverListRecord = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
    }
}
</script>
<style scoped>
.thead-light {
    height: 50px !important;
}
.border-right, .thead-light {
    border: 1px solid #dedede !important;
}
.list tr td{
    height: 45px !important;
}
.exapanded {
    box-shadow: inset 0 0 6px #aaa;
    padding: 10px !important;
}
</style>

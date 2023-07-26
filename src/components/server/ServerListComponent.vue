<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <router-link to="/dashboard" class="d-flex align-center">
                            <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                            <span>Dashboard</span>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Cloudways Server</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Cloudways Server List
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                    <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <!-- data table component -->
                        <v-data-table :headers="headers" :items="serverListRecord" :search="search" :single-expand="singleExpand" show-expand v-model:expanded="expanded" item-value="server_id" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                            <template v-slot:expanded-row="{ columns, item }">
                                <td class="exapanded bg-light-green-lighten-5" :colspan="columns.length" v-if="item.selectable.children.length > 0">
                                    <!-- exapnded table data -->
                                    <table class="table align-items-center" v-if="serverListRecord.length > 0">
                                        <thead class="thead-light">
                                            <tr>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Label</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">App User</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">App FQDN</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">App CNAME</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="list">
                                            <tr v-for="(row , index) in item.selectable.children" :key="index">
                                                <td class="v-data-table__td">
                                                    {{row.label ? row.label : '-'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.app_user ? row.app_user : '-'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.app_fqdn ? row.app_fqdn : '-'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.cname ? row.cname : '-'}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getListingData();
    },
    methods: {
        // get all data listings
        getListingData() {
            this.showLoader = true;
            this.axios.get(this.$api + '/server', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.serverListRecord = Data.data.data;
                    this.permissions = Data.permission;
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

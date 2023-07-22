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
                        <span>Microsoft Eliminated Accounts</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Microsoft Eliminated Accounts List
                        </v-card-title>

                        <v-data-table :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage" class="table-hover-class mt-4">
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name}}
                            </template>
                            <template v-slot:[`item.account_id`]="{ item }">
                                {{item.selectable.account_id}}
                            </template>
                            <template v-slot:[`item.number`]="{ item }">
                                {{item.selectable.number}}
                            </template>
                            <template v-slot:[`item.deleted_at`]="{ item }">
                                {{format_date(item.selectable.deleted_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click.prevent="restoreMicrosoftAdsAccount(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="deep-purple-darken-4">
                                        mdi-restore
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Restore</v-tooltip>
                                </v-btn>                                                            
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
                { title: 'Action',  key: 'action', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1,
            permissions: {},
        }
    },
    mounted() {
        this.getAllData();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
                }else {
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
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
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getAllData();
                        this.showLoader = false;
                    }else {
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
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

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
                        <span>Google Eliminated Accounts</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Google Eliminated Accounts List
                        </v-card-title>

                        <v-data-table :headers="networkHeaders" :items="linkedNewtworks" :single-expand="singleExpand" item-key="customer_id" :itemsPerPage="itemsPerPage" class="table-hover-class mt-4">
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.customer_id`]="{ item }">
                                {{item.selectable.customer_id ? item.selectable.customer_id : '-'}}
                            </template>
                            <template v-slot:[`item.deleted_at`]="{ item }">
                                {{format_date(item.selectable.deleted_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click.prevent="restoreGoogleAdsAccount(item.selectable.id)" :disabled="permissions.update_auth == '0'">
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
import axios from '@axios';
export default {
    // props: ['list'],
    components: {
    },
    data() {
        return {
            message: {},
            showLoader: false,
            singleExpand: true,
            networkHeaders: [
                { title: 'Account Name',  key: 'name' },
                { title: 'Account ID',  key: 'customer_id' },
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
            axios.get(this.$api + '/settings/archivedgoogleads', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.linkedNewtworks = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
        // restore account
        restoreGoogleAdsAccount(id) {
            if(confirm("Do you really want to restore account?")) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('id', id);
                axios.post(this.$api + '/settings/archivedgoogleads/restoreGoogleAdsAccount', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.getAllData();
                        this.showLoader = false;
                    }else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                    }
                    this.showLoader = false;
                });
            }
        },
        // format date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            }
            else {
                return '-';
            }
        },
    }
}
</script>

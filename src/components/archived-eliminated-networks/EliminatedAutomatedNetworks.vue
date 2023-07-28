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
                        <span>CPA Eliminated Networks</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            CPA Eliminated Networks List
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="linkedNewtworks" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.affiliate_id`]="{ item }">
                                {{item.selectable.affiliate_id ? item.selectable.affiliate_id : '-'}}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                <div class="text-capitalize">{{item.selectable.network ? item.selectable.network : '-'}}</div>
                            </template>
                            <template v-slot:[`item.company`]="{ item }">
                                {{item.selectable.company ? item.selectable.company : '-' }}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-' }}
                            </template>
                            <template v-slot:[`item.deleted_at`]="{ item }">
                                {{format_date(item.selectable.deleted_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click="restoreAutomatedNetwork(item.selectable.id)">
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
    data() {
        return {
            message: {},
            showLoader: false,
            linkedNewtworks: [],
            headers: [
                { title: 'Network ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Network Name', align: 'start', sortable: true, key: 'name' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Login ID',  key: 'affiliate_id', align: 'center' },
                { title: 'Platform Type',  key: 'network', align: 'center' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date On Removed',  key: 'deleted_at', align: 'center' },
                { title: 'Action',  key: 'action', align: 'center', sortable: false},
            ],
            itemsPerPage: -1,
            list: {
                id: null,
                name: null,
                email: null,
                platform_type: null,
                notes: null,
                company: null,
            },
            permissions: {},
        }
    },
    mounted() {
        this.getEliminatedAutomatedNetwork();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            }
            else {
                return '-';
            }
        },
        // get manual network listing
        getEliminatedAutomatedNetwork() {
            this.showLoader = true;
            axios.get(this.$api + '/network/eliminated-automated-networks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.linkedNewtworks = data.data;
                    this.permissions = data.permission;
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
        // restore data
        restoreAutomatedNetwork(id) {
            if(confirm("Do you really want to restore network?")) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('id', id);
                axios.post(this.$api + '/network/eliminated-automated-network/restoreAutomatedNetwork', formData,{
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: this.getAccessToken()
                        }
                    })
                .then(response => {
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.linkedNewtworks = response.data.data;
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
    }
}
</script>

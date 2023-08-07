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
                        <span>Namesilo Domain</span>
                        <v-spacer />
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Namesilo Domain List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.email`]="{ item }">
                                {{ item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                {{ item.selectable.status ? item.selectable.status : '-' }}
                            </template>
                            <template v-slot:[`item.domain`]="{ item }">
                                {{ item.selectable.domain ? item.selectable.domain : '-' }}
                            </template>
                            <template v-slot:[`item.auto_renew`]="{ item }">
                                <v-switch color="primary" :model-value="item.auto_renew == 'Yes' ? true : false" @change="updateAutoRenewal(item)"></v-switch>
                            </template>
                            <template v-slot:[`item.expires`]="{ item }">
                                {{item.selectable.expires ? item.selectable.expires : '-'}}
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
import axios from '@axios'
export default {
    components: {
    },

    data() {
        return{
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Account (email)', key: 'email'},
                { title: 'Status', align: 'start', sortable: true, key: 'status' },
                { title: 'Domain Name', key: 'domain' },
                { title: 'Domain Auto Renew Status', key: 'auto_renew', align: 'center' },
                { title: 'Domain Expiration', key: 'expires', align: 'center' },
            ],
            itemsPerPage: -1,
            selected: [],
            permissions:{},
            showLoader:false
        }
    },
    mounted() {
        this.pull()
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        pull() {
            this.showLoader = true;
            const ajaxUrl = this.$api + '/domains/automated_domain/namesilo?domain_type=namesilo';
            const url = `${ajaxUrl}`;
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
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
        updateAutoRenewal(item) {
            this.showLoader = true;
            let data = {
                renewAuto: item.renewAuto,
                id: item.id,
                domain_type:'namesilo'
            }
            const ajaxUrl = this.$api + '/domains/automated_domain/namesiloAutoRenewUpdate';
            const url = `${ajaxUrl}`;
            axios.post(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            },data)
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
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
    },
}
</script>
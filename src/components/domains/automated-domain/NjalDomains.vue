<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Njal Domains</span>
                        </div>
                        <v-spacer/>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view === 1 && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Njal Domains List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col cols="12" lg="7" md="7" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                                </v-col>
                            </v-row>
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
                            <template v-slot:[`item.autorenew`]="{ item }">
                                <v-switch color="primary" :model-value="item.selectable.autorenew == '1'" disabled="disabled"></v-switch>
                            </template>
                            <template v-slot:[`item.expiry`]="{ item }">
                                {{item.selectable.expiry ? item.selectable.expiry : '-'}}
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
import axios from '@axios';
export default {
    components: {
    },

    data() {
        return{
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Account (email)', key: 'email'},
                { title: 'Domain Name', key: 'domain' },
                { title: 'Domain Auto Renew Status', key: 'autorenew', align: 'center' },
                { title: 'Domain Expiration', key: 'expiry', align: 'center' },
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
            const ajaxUrl = this.$api + '/domains/automated_domain/njal?domain_type=njal';
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
    },
}
</script>
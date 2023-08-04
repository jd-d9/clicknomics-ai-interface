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
                        <span>Namecheap Domain</span>
                        <v-spacer />
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader"> 
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Namecheap Domain List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.domain_credentials`]="{ item }">
                                {{ item.selectable.domain_credentials.email }}
                            </template>
                            <template v-slot:[`item.Name`]="{ item }">
                                {{ item.selectable.Name }}
                            </template>
                            <template v-slot:[`item.AutoRenew`]="{ item }">
                                <v-switch color="primary" :model-value="item.selectable.AutoRenew == 'true' ? true : false" disabled="disabled"></v-switch>
                            </template>
                            <template v-slot:[`item.Expires`]="{ item }">
                                {{item.selectable.Expires}}
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!--  v-if="permissions.view != '1' && !showLoader" -->
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
                { title: 'Account (email)', key: 'domain_credentials'},
                { title: 'Domain Name', key: 'Name' },
                { title: 'Domain Auto Renew Status', key: 'AutoRenew', align: 'center' },
                { title: 'Domain Expiration', key: 'Expires', align: 'center' },
            ],
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
            const ajaxUrl = this.$api + '/domains/automated_domain/namecheap?domain_type=namecheap';
            
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
    },
}
</script>
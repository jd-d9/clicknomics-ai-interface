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
                        <span>Authentication History</span>
                        <v-spacer />
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Authentication History List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.logged_in`]="{ item }">
                                {{ item.selectable.logged_in }}
                            </template>
                            <template v-slot:[`item.device_type`]="{ item }">
                                {{ item.selectable.device_type }}
                            </template>
                            <template v-slot:[`item.device_email`]="{ item }">
                                {{ item.selectable.device_email }}
                            </template>
                            <template v-slot:[`item.ip_address`]="{ item }">
                                {{item.selectable.ip_address}}
                            </template>
                            <template v-slot:[`item.app_version`]="{ item }">
                                {{ item.selectable.app_version }}
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!--  v-if="permissions.view != '1' && !showLoader" -->
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return{
            dataMetrics: [
                {
                    logged_in: '2023-07-06, 8:00 AM',
                    device_type: 'Web',
                    device_email: 'adminweb@gmail.com',
                    ip_address: '127.0.0.1',
                    app_version:'10.5',
                },
                {
                    logged_in: '2023-07-06, 8:00 AM',
                    device_type: 'Web',
                    device_email: 'adminweb@gmail.com',
                    ip_address: '127.0.0.1',
                    app_version:'10.5',
                },
            ],
            search: '',
            headers: [
                { title: 'Logged In On', align: 'start', sortable: true, key: 'logged_in' },
                { title: 'Device Type', key: 'device_type', sortable:false },
                { title: 'Device Email', key: 'device_email' },
                { title: 'Ip Address', key: 'ip_address', align: 'center', sortable:false },
                { title: 'App Version', key: 'app_version', align: 'center', sortable:false },
            ],
            selected: [],
            itemsCardName: [],
            valueCardName: '',
        }
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        createActivity() {
            window.$('#createUpdateData').modal('show');
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
}
</script>
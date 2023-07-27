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
                        <span>Njal Domains</span>
                        <v-spacer />
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Njal Domains List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.account`]="{ item }">
                                {{ item.selectable.account }}
                            </template>
                            <template v-slot:[`item.domain`]="{ item }">
                                {{ item.selectable.domain }}
                            </template>
                            <template v-slot:[`item.auto_renewals`]="{ item }">
                                <v-switch color="primary" :model-value="item.auto_renewals == 'Active' ? true : false"></v-switch>
                            </template>
                            <template v-slot:[`item.expire_date`]="{ item }">
                                {{item.selectable.expire_date}}
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
                    account: 'dominiosipm@protonmail.com',
                    domain: 'coletrack.com',
                    auto_renewals: '',
                    expire_date:'2023-07-06',
                },
                {
                    account: 'dominiosipm@protonmail.com',
                    domain: 'espatrack.com',
                    auto_renewals: '',
                    expire_date:'2023-07-06',
                }
            ],
            search: '',
            headers: [
                { title: 'Account (email)', key: 'account'},
                { title: 'Domain Name', key: 'domain' },
                { title: 'Domain Auto Renew Status', key: 'auto_renewals', align: 'center' },
                { title: 'Domain Expiration', key: 'expire_date', align: 'center' },
            ],
            selected: [],
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
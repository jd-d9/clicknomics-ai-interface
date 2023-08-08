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
                        <span>Ads Issues</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Ads Issues List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.microsoft_ads_account_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.microsoft_ads_account_name ? item.selectable.microsoft_ads_account_name : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.CampaignName`]="{ item }">
                                {{item.selectable.CampaignName ? item.selectable.CampaignName : '-'}}
                            </template>
                            <template v-slot:[`item.AdId`]="{ item }">
                                {{item.selectable.AdId ? item.selectable.AdId : '-'}}
                            </template>
                            <template v-slot:[`item.Domain`]="{ item }">
                                {{item.selectable.Domain ? item.selectable.Domain : '-'}}
                            </template>
                            <template v-slot:[`item.EditorialStatus`]="{ item }">
                                {{item.selectable.EditorialStatus ? item.selectable.EditorialStatus : '-'}}
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
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
        return {
            showLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'id'},
                { title: 'Account Name', key: 'microsoft_ads_account_name' },
                { title: 'Campaign Name', key: 'CampaignName' },
                { title: 'Ads ID', key: 'AdId' },
                { title: 'Domain', key: 'Domain' },
                { title: 'Editorial Status', key: 'EditorialStatus' },
            ],
            urlList: [
                {
                    id: '1',
                    microsoft_ads_account_name: 'Diamond Events & Productions',
                    CampaignName: 'BarXStop - 12082022',
                    AdId: '84319342772234',
                    Domain: 'getbarxstop.com',
                    EditorialStatus: 'Disapproved',
                }
            ],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            item: {
                id:'',
                notes: '',
            }
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
    }
}
</script>

<style scoped>
</style>
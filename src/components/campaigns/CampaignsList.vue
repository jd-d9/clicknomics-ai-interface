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
                            <span>Campaigns</span>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            Campaigns List

                            <!-- tab panel title div -->
                            <div class="mt-2">
                                <v-tabs v-model="tabCampaigns" fixed-tabs bg-color="green-lighten-4" class="mb-3">
                                    <v-tab value="google_campaigns" class="font-weight-bold" color="green-darken-4 ">
                                        <img src="assets/img/icons/google-ads.svg" class="w-20 mr-2"> Google Campaigns
                                    </v-tab>
                                    <v-tab value="microsoft_campaigns" class="font-weight-bold">
                                        <img src="assets/img/icons/microsoft.svg" class="w-20 mr-2">Microsoft Campaigns
                                    </v-tab>
                                </v-tabs>

                                <v-window v-model="tabCampaigns">
                                    <v-window-item value="google_campaigns">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-spacer></v-spacer>
                                            <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                                <v-select v-model="valueGoogle" :items="itemsGoogle" chips variant="outlined" placeholder="Custom Filter" multiple @update:modelValue="fetchGoogleCampaign"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal v_select_design">
                                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" hide-details/>
                                            </v-col>
                                        </v-row>

                                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="googleCampaigns" :search="search"  :single-expand="singleExpand" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                                            <template v-slot:[`item.campaign_id`]="{ item }">
                                                {{item.selectable.campaign_id ? item.selectable.campaign_id : '-'}}
                                            </template>
                                            <template v-slot:[`item.campaign_name`]="{ item }">
                                                {{item.selectable.campaign_name ? item.selectable.campaign_name : '-'}}
                                            </template>
                                            <template v-slot:[`item.google_ads_account`]="{ item }">
                                                {{item.selectable.google_ads_account.name ? item.selectable.google_ads_account.name : '-'}}
                                            </template>
                                            <template v-slot:[`item.campaign_status`]="{ item }">
                                                {{item.selectable.campaign_status ? item.selectable.campaign_status : '-'}}
                                            </template>
                                        </v-data-table>
                                    </v-window-item>

                                    <v-window-item value="microsoft_campaigns">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-spacer></v-spacer>
                                            <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                                <v-select v-model="valueMicrosoft" :items="itemsMicrosoft" chips variant="outlined" placeholder="Custom Filter" multiple @update:modelValue="fetchMicrosoftCampaign"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal v_select_design">
                                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="microsoftSearch" hide-details/>
                                            </v-col>
                                        </v-row>

                                        <v-data-table :headers="micosoftHeaders" :items="micosoftCampaigns" :search="microsoftSearch" :single-expand="singleExpand" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                                            <template v-slot:[`item.CampaignId`]="{ item }">
                                                {{item.selectable.CampaignId ? item.selectable.CampaignId : '-'}}
                                            </template>
                                            <template v-slot:[`item.CampaignName`]="{ item }">
                                                {{item.selectable.CampaignName ? item.selectable.CampaignName : '-'}}
                                            </template>
                                            <template v-slot:[`item.microsoft_ads_account`]="{ item }">
                                                {{item.selectable.microsoft_ads_account.name ? item.selectable.microsoft_ads_account.name : '-'}}
                                            </template>
                                            <template v-slot:[`item.Status`]="{ item }">
                                                {{item.selectable.Status ? item.selectable.Status : '-'}}
                                            </template>
                                        </v-data-table>
                                    </v-window-item>
                                </v-window>
                            </div>
                        </v-card-title>
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
    // props: ['googleCampaignList', 'microsoftCampaignList'],
    components: {
    },
    data() {
        return {
            message: {},
            showLoader: false,
            search: '',
            microsoftSearch: '',
            googleHeaders: [
                { title: 'Campaign ID', key: 'campaign_id' },
                { title: 'Campaign Name', key: 'campaign_name' },
                { title: 'Account Name', align: 'start', sortable: false, key: 'google_ads_account' },
                { title: 'Campaign Status', key: 'campaign_status', align: 'center' },
            ],
            micosoftHeaders: [
                { title: 'Campaign ID', key: 'CampaignId' },
                { title: 'Campaign Name', key: 'CampaignName' },
                { title: 'Account Name', align: 'start', sortable: false, key: 'microsoft_ads_account' },
                { title: 'Campaign Status', key: 'Status', align: 'center' },
            ],
            googleCampaigns: [],
            googleCampaignList: [],
            micosoftCampaigns: [],
            micosoftCampaignsList: [],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            itemsGoogle: ['Removed', 'Paused', 'Enabled'],
            valueGoogle: ['Removed', 'Paused', 'Enabled'],
            itemsMicrosoft: ['Paused', 'BudgetPaused', 'Active'],
            valueMicrosoft: ['Paused', 'BudgetPaused', 'Active'],
            permissions: {},
            tabCampaigns: 'google_campaigns',
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
        // get campains listing data
        getAllData() {
            this.showLoader = true;
            axios.get(this.$api + '/campaigns', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.googleCampaigns = Data.googlecampaign;
                    this.googleCampaignsList = Data.googlecampaign;
                    this.micosoftCampaigns = Data.microsoftcampaign;
                    this.micosoftCampaignsList = Data.microsoftcampaign;
                    this.permissions = Data.permission;
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
        // fetch google campains
        fetchGoogleCampaign() {
            this.googleCampaigns = this.googleCampaignsList.filter(data => this.valueGoogle.find(rm => (rm.toLowerCase() === data.campaign_status.toLowerCase())));
        },
        // fetch microsoft campains
        fetchMicrosoftCampaign() {
            this.micosoftCampaigns = this.micosoftCampaignsList.filter(data => this.valueMicrosoft.find(rm => (rm.toLowerCase() === data.Status.toLowerCase())));
        }
    }
}
</script>

<style scoped>

</style>

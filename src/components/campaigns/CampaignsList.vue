<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Campaigns</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <div class="card">
                        <div class="card-header">
                            <div class="nav-wrapper report_tabpanel">
                                <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-icons-text" role="tablist">
                                    <li class="nav-item">
                                        <router-link to="" class="nav-link mb-sm-3 mb-md-0 active" id="tabs-icons-text-1-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-1" role="tab" aria-controls="tabs-icons-text-1" aria-selected="true">
                                            <span class="btn-inner--icon"><img src="assets/img/icons/google-ads.svg" class="icon-width"></span>
                                            <span class="btn-inner--text">Google Campaigns</span>
                                        </router-link>
                                    </li>
                                    <li class="nav-item">
                                        <router-link to="" class="nav-link mb-sm-3 mb-md-0" id="tabs-icons-text-2-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-2" role="tab" aria-controls="tabs-icons-text-2" aria-selected="false">
                                            <span class="btn-inner--icon"><img src="assets/img/icons/microsoft.svg" class="icon-width"></span>
                                            <span class="btn-inner--text">Microsoft Campaigns</span>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="card shadow">
                            <div class="card-body">
                                <div class="tab-content" id="myTabContent">
                                    <div class="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                        <v-app>
                                            <v-card>
                                                <v-card-title>
                                                    <v-row>
                                                        <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                        <v-col class="d-flex" cols="12" sm="4">
                                                            <v-select v-model="valueGoogle" :items="itemsGoogle" chips label="Custom Filter" multiple solo @update:modelValue="fetchGoogleCampaign"></v-select>
                                                        </v-col>
                                                        <v-col class="d-flex search_width" cols="12" sm="4">
                                                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-title>
                                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="googleCampaigns" :search="search"  :single-expand="singleExpand" class="elevation-1" :itemsPerPage="itemsPerPage">
                                                </v-data-table>
                                            </v-card>
                                        </v-app>
                                    </div>
                                    <div class="tab-pane fade" id="tabs-icons-text-2" role="tabpanel" aria-labelledby="tabs-icons-text-2-tab">
                                        <v-app>
                                            <v-card>
                                                <v-card-title>
                                                    <v-row>
                                                        <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                        <v-col class="d-flex" cols="12" sm="4">
                                                            <v-select v-model="valueMicrosoft" :items="itemsMicrosoft" chips label="Custom Filter" multiple solo @update:modelValue="fetchMicrosoftCampaign"></v-select>
                                                        </v-col>
                                                        <v-col class="d-flex search_width" cols="12" sm="4">
                                                            <v-text-field v-model="microsoftSearch" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-title>
                                                <v-data-table :headers="micosoftHeaders" :items="micosoftCampaigns" :search="microsoftSearch" :single-expand="singleExpand" class="elevation-1" :itemsPerPage="itemsPerPage">
                                                </v-data-table>
                                            </v-card>
                                        </v-app>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col" v-if="permissions.view != '1' && !showLoader">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // props: ['googleCampaignList', 'microsoftCampaignList'],
    components: {
    },
    data() {
        return {
            showLoader: false,
            search: '',
            microsoftSearch: '',
            googleHeaders: [
                { title: 'Campaign ID', key: 'campaign_id' },
                { title: 'Campaign Name', key: 'campaign_name' },
                { title: 'Account Name', align: 'start', sortable: false, key: 'google_ads_account.name' },
                { title: 'Campaign Status', key: 'campaign_status' },
            ],
            micosoftHeaders: [
                { title: 'Campaign ID', key: 'CampaignId' },
                { title: 'Campaign Name', key: 'CampaignName' },
                { title: 'Account Name', align: 'start', sortable: false, key: 'microsoft_ads_account.name' },
                { title: 'Campaign Status', key: 'Status' },
            ],
            googleCampaigns: [],
            googleCampaignList: [],
            micosoftCampaigns: [],
            micosoftCampaignsList: [],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            itemsGoogle: ['REMOVED', 'PAUSED', 'ENABLED'],
            valueGoogle: ['REMOVED', 'PAUSED', 'ENABLED'],
            itemsMicrosoft: ['Paused', 'BudgetPaused', 'Active'],
            valueMicrosoft: ['Paused', 'BudgetPaused', 'Active'],
            permissions: {},
        }
    },
    mounted() {
        this.getAllData();
    },
    methods: {
        // get campains listing data
        getAllData() {
            this.showLoader = true;
            this.axios.get(this.$api + '/campaigns', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
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
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // fetch google campains
        fetchGoogleCampaign() {
            this.googleCampaigns = this.googleCampaignsList.filter(data => this.valueGoogle.find(rm => (rm === data.campaign_status) ));
        },
        // fetch microsoft campains
        fetchMicrosoftCampaign() {
            this.micosoftCampaigns = this.micosoftCampaignsList.filter(data => this.valueMicrosoft.find(rm => (rm === data.Status) ));
        }
    }
}
</script>

<style scoped>

</style>

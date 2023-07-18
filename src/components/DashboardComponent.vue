<template>
    <div>
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <v-row class="mb-1 align-items-center">
                        <v-col class="d-flex" cols="12" sm="4">
                            <h6 class="font-weight-bold text-h6 px-3">
                                Date: {{daily_date}}
                            </h6>
                        </v-col>
                        <!-- <v-col class="text-orange text-center" cols="12" sm="4" v-if="trialDays > 0">
                            You have only {{ trialDays }} days left of your trial period
                        </v-col> -->
                        <v-col class="text-orange text-center" cols="12" sm="4" v-if="trialDays > 0">
                            Your trial period is expiring in {{ trialDays }} days
                        </v-col>
                        <v-col class="d-flex justify-content-end" cols="12" :sm="trialDays > 0 ? 4 : 8">
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                        </v-col>
                    </v-row>

                    <h6 class="font-weight-bold text-h6 px-3 mb-3">Cost</h6>
                    <v-row class="ma-0 mb-3 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_ops_cost == 0, 'bg-green-lighten-4': daily_ops_cost > 0, 'bg-orange-lighten-4': daily_ops_cost < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Operations Cost</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_ops_cost == 0, 'text-green-darken-1': daily_ops_cost > 0, 'text-orange': daily_ops_cost < 0}">{{$filters.toCurrency(daily_ops_cost)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_microsoft_ads_cost == 0, 'bg-green-lighten-4': daily_microsoft_ads_cost > 0, 'bg-orange-lighten-4': daily_microsoft_ads_cost < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Ads Cost
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_microsoft_ads_cost == 0, 'text-green-darken-1': daily_microsoft_ads_cost > 0, 'text-orange': daily_microsoft_ads_cost < 0}">{{$filters.toCurrency(daily_microsoft_ads_cost)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_google_ads_cost == 0, 'bg-green-lighten-4': daily_google_ads_cost > 0, 'bg-orange-lighten-4': daily_google_ads_cost < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Ads Cost
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_google_ads_cost == 0, 'text-green-darken-1': daily_google_ads_cost > 0, 'text-orange': daily_google_ads_cost < 0}">{{$filters.toCurrency(daily_google_ads_cost)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': (facebookAccount) == 0, 'bg-green-lighten-4': (facebookAccount) > 0, 'bg-orange-lighten-4': (facebookAccount) < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Ads Cost
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': (facebookAccount) == 0, 'text-green-darken-1': (facebookAccount) > 0, 'text-orange': (facebookAccount) < 0}">{{$filters.toCurrency(facebookAccount)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': (daily_total_ads_cost - daily_ops_cost) == 0, 'bg-green-lighten-4': (daily_total_ads_cost - daily_ops_cost) > 0, 'bg-orange-lighten-4': (daily_total_ads_cost - daily_ops_cost) < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Total Ads Cost</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': (daily_total_ads_cost - daily_ops_cost) == 0, 'text-green-darken-1': (daily_total_ads_cost - daily_ops_cost) > 0, 'text-orange': (daily_total_ads_cost - daily_ops_cost) < 0}">{{$filters.toCurrency(daily_total_ads_cost - daily_ops_cost)}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- <v-divider class="border-opacity-100 my-4 mx-2" color="success" />  -->

                    <h6 class="font-weight-bold text-h6 px-3 mb-3">Revenue</h6>
                    <v-row class="ma-0 mb-3 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_conversion == 0, 'bg-green-lighten-4': daily_conversion > 0, 'bg-orange-lighten-4': daily_conversion < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Conversions</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_conversion == 0, 'text-green-darken-1': daily_conversion > 0, 'text-orange': daily_conversion < 0}">{{daily_conversion}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_total_revenue == 0, 'bg-green-lighten-4': daily_total_revenue > 0, 'bg-orange-lighten-4': daily_total_revenue < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Commissions</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_total_revenue == 0, 'text-green-darken-1': daily_total_revenue > 0, 'text-orange': daily_total_revenue < 0}">{{$filters.toCurrency(daily_total_revenue)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_net_profit == 0, 'bg-green-lighten-4': daily_net_profit > 0, 'bg-orange-lighten-4': daily_net_profit < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Net Profits</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_net_profit == 0, 'text-green-darken-1': daily_net_profit > 0, 'text-orange': daily_net_profit < 0}">{{$filters.toCurrency(daily_net_profit)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_roas == 0, 'bg-green-lighten-4': daily_roas > 0, 'bg-orange-lighten-4': daily_roas < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">ROAS</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_roas == 0, 'text-green-darken-1': daily_roas > 0, 'text-orange': daily_roas < 0}">{{$filters.toCurrency(daily_roas)}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_roi == 0, 'bg-green-lighten-4': daily_roi > 0, 'bg-orange-lighten-4': daily_roi < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">ROI</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_roi == 0, 'text-green-darken-1': daily_roi > 0, 'text-orange': daily_roi < 0}">{{$filters.toCurrency(daily_roi)}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <h6 class="font-weight-bold text-h6 px-3 mb-3">General Stats</h6>                    
                    <!-- Start Microsoft -->
                    <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftMasterAccount == 0, 'bg-green-lighten-4': microsoftMasterAccount > 0, 'bg-orange-lighten-4': microsoftMasterAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Master Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftMasterAccount == 0, 'text-green-darken-1': microsoftMasterAccount > 0, 'text-orange': microsoftMasterAccount < 0}">{{microsoftMasterAccount}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftAccount == 0, 'bg-green-lighten-4': microsoftAccount > 0, 'bg-orange-lighten-4': microsoftAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Child Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftAccount == 0, 'text-green-darken-1': microsoftAccount > 0, 'text-orange': microsoftAccount < 0}">{{microsoftAccount}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftActiveCampaigns == 0, 'bg-green-lighten-4': microsoftActiveCampaigns > 0, 'bg-orange-lighten-4': microsoftActiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Active Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftActiveCampaigns == 0, 'text-green-darken-1': microsoftActiveCampaigns > 0, 'text-orange': microsoftActiveCampaigns < 0}">{{microsoftActiveCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftInactiveCampaigns == 0, 'bg-green-lighten-4': microsoftInactiveCampaigns > 0, 'bg-orange-lighten-4': microsoftInactiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Inactive Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftInactiveCampaigns == 0, 'text-green-darken-1': microsoftInactiveCampaigns > 0, 'text-orange': microsoftInactiveCampaigns < 0}">{{microsoftInactiveCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftTotalCampaigns == 0, 'bg-green-lighten-4': microsoftTotalCampaigns > 0, 'bg-orange-lighten-4': microsoftTotalCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Total Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftTotalCampaigns == 0, 'text-green-darken-1': microsoftTotalCampaigns > 0, 'text-orange': microsoftTotalCampaigns < 0}">{{microsoftTotalCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Start Google -->
                    <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleMasterAccount == 0, 'bg-green-lighten-4': googleMasterAccount > 0, 'bg-orange-lighten-4': googleMasterAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Master Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleMasterAccount == 0, 'text-green-darken-1': googleMasterAccount > 0, 'text-orange': googleMasterAccount < 0}">{{googleMasterAccount}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleAccount == 0, 'bg-green-lighten-4': googleAccount > 0, 'bg-orange-lighten-4': googleAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Child Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleAccount == 0, 'text-green-darken-1': googleAccount > 0, 'text-orange': googleAccount < 0}">{{googleAccount}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleActiveCampaigns == 0, 'bg-green-lighten-4': googleActiveCampaigns > 0, 'bg-orange-lighten-4': googleActiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Active Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleActiveCampaigns == 0, 'text-green-darken-1': googleActiveCampaigns > 0, 'text-orange': googleActiveCampaigns < 0}">{{googleActiveCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleInactiveCampaigns == 0, 'bg-green-lighten-4': googleInactiveCampaigns > 0, 'bg-orange-lighten-4': googleInactiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Inactive Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleInactiveCampaigns == 0, 'text-green-darken-1': googleInactiveCampaigns > 0, 'text-orange': googleInactiveCampaigns < 0}">{{googleInactiveCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleTotalCampaigns == 0, 'bg-green-lighten-4': googleTotalCampaigns > 0, 'bg-orange-lighten-4': googleTotalCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Total Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleTotalCampaigns == 0, 'text-green-darken-1': googleTotalCampaigns > 0, 'text-orange': googleTotalCampaigns < 0}">{{googleTotalCampaigns}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Start Facebook -->
                    <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design bg-blue-lighten-4">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Master Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design bg-blue-lighten-4">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Child Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design bg-blue-lighten-4">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Active Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design bg-blue-lighten-4">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Inactive Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">0</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design bg-blue-lighten-4">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/facebook.svg" class="mr-2 mt--1" style="width:15px;">Facebook Total Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">0</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Start general -->
                    <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': networks == 0, 'bg-green-lighten-4': networks > 0, 'bg-orange-lighten-4': networks < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Automated Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': networks == 0, 'text-green-darken-1': networks > 0, 'text-orange': networks < 0}">{{networks}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': manualNetworks == 0, 'bg-green-lighten-4': manualNetworks > 0, 'bg-orange-lighten-4': manualNetworks < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Manual Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': manualNetworks == 0, 'text-green-darken-1': manualNetworks > 0, 'text-orange': manualNetworks < 0}">{{manualNetworks}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': (networks + manualNetworks) == 0, 'bg-green-lighten-4': (networks + manualNetworks) > 0, 'bg-orange-lighten-4': (networks + manualNetworks) < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Total Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': (networks + manualNetworks) == 0, 'text-green-darken-1': (networks + manualNetworks) > 0, 'text-orange': (networks + manualNetworks) < 0}">{{networks + manualNetworks}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import DateRangePicker from './common/DateRangePicker.vue';
import moment from 'moment';
 export default {
    components: {
        DateRangePicker,
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            facebookAccount: 0,
            googleAccount: 0,
            microsoftAccount: 0,
            googleMasterAccount: 0,
            microsoftMasterAccount: 0,
            networks: 0,
            manualNetworks: 0,
            offers: 0,
            campaigns: 0,
            opsCosts: 0,
            netProfit: 0,
            adsCost: 0,
            totalCosts: 0,
            totalRevenue: 0,
            grossProfit: 0,
            googleActiveCampaigns: 0,
            googleInactiveCampaigns: 0,
            googleTotalCampaigns: 0,
            microsoftActiveCampaigns: 0,
            microsoftInactiveCampaigns: 0,
            microsoftTotalCampaigns: 0,
            daily_ops_cost: 0,
            daily_microsoft_ads_cost: 0,
            daily_google_ads_cost: 0,
            daily_total_ads_cost: 0,
            daily_total_revenue: 0,
            daily_net_profit: 0,
            daily_conversion: 0,
            daily_roas: 0,
            daily_roi: 0,
            daily_date: 0,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            trialDays: null,
        }
    },
    mounted() {
        const isAuthenticated = sessionStorage.getItem('Token');
        const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));

        if(isAuthenticated && isVerified) {
            this.$router.push('/dashboard');
        }
        else{
            sessionStorage.clear();
            this.$router.push('/login');
        }
        this.fetchDashboardRecord();
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.fetchDashboardRecord();
        },
        // fetch dashboard data
        fetchDashboardRecord() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/dashboard';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            this.axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.data);
                    const dashboardData = response.data.data;
                    this.facebookAccount = dashboardData.facebook_account
                    this.googleAccount = dashboardData.google_account;
                    this.microsoftAccount = dashboardData.microsoft_account;
                    this.googleMasterAccount = dashboardData.google_manager_account;
                    this.microsoftMasterAccount = dashboardData.microsoft_manager_account;
                    this.networks = dashboardData.networks;
                    this.manualNetworks = dashboardData.manual_network;
                    this.offers = dashboardData.offers;
                    this.campaigns = dashboardData.campaigns;
                    this.opsCosts = dashboardData.ops_costs;
                    this.netProfit = this.kFormatter(dashboardData.net_profit);
                    this.adsCost = this.kFormatter(dashboardData.ads_cost);
                    this.totalCosts = this.kFormatter(dashboardData.total_costs);
                    this.totalRevenue = this.kFormatter(dashboardData.total_revenue);
                    this.grossProfit = this.kFormatter(dashboardData.gross_profit);
                    this.googleActiveCampaigns = dashboardData.googleActiveCampaigns;
                    this.googleInactiveCampaigns = dashboardData.googleInactiveCampaigns;
                    this.googleTotalCampaigns = dashboardData.googleTotalCampaigns;
                    this.microsoftActiveCampaigns = dashboardData.microsoftActiveCampaigns;
                    this.microsoftInactiveCampaigns = dashboardData.microsoftInactiveCampaigns;
                    this.microsoftTotalCampaigns = dashboardData.microsoftTotalCampaigns;
                    // Daily Report
                    this.daily_ops_cost = dashboardData.daily_ops_cost;
                    this.daily_microsoft_ads_cost = dashboardData.daily_microsoft_ads_cost;
                    this.daily_google_ads_cost = dashboardData.daily_google_ads_cost;
                    this.daily_total_ads_cost = dashboardData.daily_total_ads_cost;
                    this.daily_total_revenue = dashboardData.daily_total_revenue;
                    this.daily_net_profit = dashboardData.daily_net_profit;
                    this.daily_conversion = dashboardData.daily_conversion;
                    this.daily_roas = dashboardData.daily_roas;
                    this.daily_roi = dashboardData.daily_roi;
                    this.daily_date = dashboardData.daily_date;
                    // trial days count
                    this.trialDays = response.data.trialEnd;
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
                console.log(error);
                this.showLoader = false;
            });
        },
        // formater
        kFormatter(num) {
            return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
        },
    },
 }
</script>

<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <v-row class="mx-0 mb-1 align-items-center justify-space-between d-flex top_header_button">
                        <v-col>
                            <h6 class="font-weight-bold text-h6 mb-0">
                                Date: {{daily_date ? daily_date : '-'}}
                            </h6>
                        </v-col>
                        <v-col class="d-flex justify-content-end font-medium font-weight-normal">
                            <date-range-picker class="date_picker" style="padding: 9px 0px;" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                        </v-col>
                    </v-row>

                    <v-divider class="border-opacity-100 mb-3 mt-0 mx-2" color="success" />    

                    <!-- cost -->
                    <h6 class="font-weight-bold text-h6 px-2 mb-3">Cost</h6>
                    <v-row class="ma-0 mb-3 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
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

                    <!-- renevue -->
                    <h6 class="font-weight-bold text-h6 px-2 mb-3">Revenue</h6>
                    <v-row class="ma-0 mb-3 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': daily_conversion == 0, 'bg-green-lighten-4': daily_conversion > 0, 'bg-orange-lighten-4': daily_conversion < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Conversions</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': daily_conversion == 0, 'text-green-darken-1': daily_conversion > 0, 'text-orange': daily_conversion < 0}">{{daily_conversion ? daily_conversion : 0}}</v-card-text>
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

                <!-- general stats -->
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <h6 class="font-weight-bold text-h6 px-2 mb-3">General Stats</h6>                    
                    <!-- Start Microsoft -->
                    <v-row class="ma-0 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftMasterAccount == 0, 'bg-green-lighten-4': microsoftMasterAccount > 0, 'bg-orange-lighten-4': microsoftMasterAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Master Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftMasterAccount == 0, 'text-green-darken-1': microsoftMasterAccount > 0, 'text-orange': microsoftMasterAccount < 0}">{{microsoftMasterAccount ? microsoftMasterAccount : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftAccount == 0, 'bg-green-lighten-4': microsoftAccount > 0, 'bg-orange-lighten-4': microsoftAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Child Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftAccount == 0, 'text-green-darken-1': microsoftAccount > 0, 'text-orange': microsoftAccount < 0}">{{microsoftAccount ? microsoftAccount : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftActiveCampaigns == 0, 'bg-green-lighten-4': microsoftActiveCampaigns > 0, 'bg-orange-lighten-4': microsoftActiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Active Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftActiveCampaigns == 0, 'text-green-darken-1': microsoftActiveCampaigns > 0, 'text-orange': microsoftActiveCampaigns < 0}">{{microsoftActiveCampaigns ? microsoftActiveCampaigns : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftInactiveCampaigns == 0, 'bg-green-lighten-4': microsoftInactiveCampaigns > 0, 'bg-orange-lighten-4': microsoftInactiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Inactive Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftInactiveCampaigns == 0, 'text-green-darken-1': microsoftInactiveCampaigns > 0, 'text-orange': microsoftInactiveCampaigns < 0}">{{microsoftInactiveCampaigns ? microsoftInactiveCampaigns : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': microsoftTotalCampaigns == 0, 'bg-green-lighten-4': microsoftTotalCampaigns > 0, 'bg-orange-lighten-4': microsoftTotalCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/microsoft.svg" class="mr-2 mt--1" style="width:15px;">Microsoft Total Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': microsoftTotalCampaigns == 0, 'text-green-darken-1': microsoftTotalCampaigns > 0, 'text-orange': microsoftTotalCampaigns < 0}">{{microsoftTotalCampaigns ? microsoftTotalCampaigns : 0 }}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Start Google -->
                    <v-row class="ma-0 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleMasterAccount == 0, 'bg-green-lighten-4': googleMasterAccount > 0, 'bg-orange-lighten-4': googleMasterAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Master Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleMasterAccount == 0, 'text-green-darken-1': googleMasterAccount > 0, 'text-orange': googleMasterAccount < 0}">{{googleMasterAccount ? googleMasterAccount : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleAccount == 0, 'bg-green-lighten-4': googleAccount > 0, 'bg-orange-lighten-4': googleAccount < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Child Accounts
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleAccount == 0, 'text-green-darken-1': googleAccount > 0, 'text-orange': googleAccount < 0}">{{googleAccount ? googleAccount : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleActiveCampaigns == 0, 'bg-green-lighten-4': googleActiveCampaigns > 0, 'bg-orange-lighten-4': googleActiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Active Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleActiveCampaigns == 0, 'text-green-darken-1': googleActiveCampaigns > 0, 'text-orange': googleActiveCampaigns < 0}">{{googleActiveCampaigns ? googleActiveCampaigns : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleInactiveCampaigns == 0, 'bg-green-lighten-4': googleInactiveCampaigns > 0, 'bg-orange-lighten-4': googleInactiveCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Inactive Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleInactiveCampaigns == 0, 'text-green-darken-1': googleInactiveCampaigns > 0, 'text-orange': googleInactiveCampaigns < 0}">{{googleInactiveCampaigns ? googleInactiveCampaigns : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': googleTotalCampaigns == 0, 'bg-green-lighten-4': googleTotalCampaigns > 0, 'bg-orange-lighten-4': googleTotalCampaigns < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                    <img src="../assets/img/icons/google-ads.svg" class="mr-2 mt--1" style="width:15px;">Google Total Campaigns
                                </v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': googleTotalCampaigns == 0, 'text-green-darken-1': googleTotalCampaigns > 0, 'text-orange': googleTotalCampaigns < 0}">{{googleTotalCampaigns ? googleTotalCampaigns : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Start Facebook -->
                    <!-- <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
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
                    </v-row> -->

                    <!-- Start network -->
                    <v-row class="ma-0 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': networks == 0, 'bg-green-lighten-4': networks > 0, 'bg-orange-lighten-4': networks < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Automated Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': networks == 0, 'text-green-darken-1': networks > 0, 'text-orange': networks < 0}">{{networks ? networks : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': manualNetworks == 0, 'bg-green-lighten-4': manualNetworks > 0, 'bg-orange-lighten-4': manualNetworks < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Manual Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': manualNetworks == 0, 'text-green-darken-1': manualNetworks > 0, 'text-orange': manualNetworks < 0}">{{manualNetworks ? manualNetworks : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                        <v-col class="py-0 five_row mb-4">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': (networks + manualNetworks) == 0, 'bg-green-lighten-4': (networks + manualNetworks) > 0, 'bg-orange-lighten-4': (networks + manualNetworks) < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Total Networks</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': (networks + manualNetworks) == 0, 'text-green-darken-1': (networks + manualNetworks) > 0, 'text-orange': (networks + manualNetworks) < 0}">{{(networks ? networks : 0) + (manualNetworks ? manualNetworks : 0)}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>

                <!-- subscription -->
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0" v-if="subscribedUser">
                    <h6 class="font-weight-bold text-h6 px-2 mb-3">Subscription</h6>
                    <v-row class="ma-0 mb-3 row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-xs-1"> <!--  row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1  -->
                        <v-col class="py-0 five_row mb-2">
                            <v-card class="card_design" :class="{'bg-blue-lighten-4': subscribedUser == 0, 'bg-green-lighten-4': subscribedUser > 0, 'bg-orange-lighten-4': subscribedUser < 0}">
                                <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">Total Subscribed User</v-card-title>
                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2" :class="{'text-blue-darken-2': subscribedUser == 0, 'text-green-darken-1': subscribedUser > 0, 'text-orange': subscribedUser < 0}">{{subscribedUser ? subscribedUser : 0}}</v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from './common/DateRangePicker.vue';
import moment from 'moment';
 export default {
    components: {
        DateRangePicker,
    },
    data() {
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            subscribedUser: 0,
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
            selectedRange: `${moment().format('ddd MMM DD YYYY')} - ${moment().format('ddd MMM DD YYYY')}`,
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // let userSession = localStorage.getItem('user-session')
        // if(userSession){
        //     const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
        //     let sessionData = JSON.parse(decryptedObject)

        //     const isAuthenticated = sessionData.Token;
        //     const isVerified = sessionData.isTwoFactorVerified;
        //     const verifiedBy = sessionData.verifiedBy;

        //     if(!isAuthenticated && !isVerified) {
        //         this.$router.push('/login');
        //     } else if(isAuthenticated && !isVerified) {
        //         verifiedBy === 'email' ? this.$router.push('/authenticator/validate/email') :this.$router.push('/authenticator/validate');
        //     }
        // }
        // const isAuthenticated = sessionStorage.getItem('Token');
        // const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));

        // if(isAuthenticated && isVerified) {
        //     this.$router.push('/dashboard');
        // }
        // else{
        //     sessionStorage.clear();
        //     this.$router.push('/login');
        // }
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
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const dashboardData = response.data.data;
                    this.subscribedUser = dashboardData.subscriptionUserCount
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
        // formater
        kFormatter(num) {
            return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
        },
    },
 }
</script>

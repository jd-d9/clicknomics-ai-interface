<template>
    <div>
        <LoaderComponent v-if="showLoader"></LoaderComponent>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <v-sheet rounded="lg">
                        <v-card>
                            <v-card-title class="font-weight-bold">Date: 12/05/2023</v-card-title>
                            <!-- <date-range-picker v-model="dateRange">
                                <div slot="header" slot-scope="header" class="slot">
                                    <h3>Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                </div>
                                <template #input="picker">
                                    {{ picker.startDate }} - {{ picker.endDate }}
                                </template>
                                <template #date="data">
                                    <span class="small">{{ data.date }}</span>
                                </template>
                                <template #ranges="ranges">
                                    <div class="ranges">
                                        <ul>
                                            <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                                <b>{{ name }}</b> 
                                                <small class="text-muted">{{ range[0].toDateString() }} - {{ range[1].toDateString() }}</small>
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                                <div slot="footer" slot-scope="data" class="slot">
                                    <div>
                                        <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                    </div>
                                    <div style="margin-left: auto">
                                        <a href="javascript:void(0)" @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
                                    </div>
                                </div>
                            </date-range-picker> -->
                            <!-- <date-range-picker
                                ref="picker"
                                :opens="opens"
                                :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy HH:mm:ss' }"
                                :minDate="minDate" :maxDate="maxDate"
                                :singleDatePicker="singleDatePicker"
                                :timePicker="timePicker"
                                :timePicker24Hour="timePicker24Hour"
                                :showWeekNumbers="showWeekNumbers"
                                :showDropdowns="showDropdowns"
                                :autoApply="autoApply"
                                v-model="dateRange"
                                @update="updateValues"
                                @toggle="logEvent('event: open', $event)"
                                @start-selection="logEvent('event: startSelection', $event)"
                                @finish-selection="logEvent('event: finishSelection', $event)"
                                :linkedCalendars="linkedCalendars"
                                :dateFormat="dateFormat"
                            >
                                <template v-slot:input="picker">
                                    {{ picker.startDate }} - {{ picker.endDate }}
                                </template>
                            </date-range-picker> -->
                            <!-- <date-range-picker :ranges="false" singleDatePicker="single" :opens="'left'" v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker"> -->
                            <!-- <template>
                                <date-range-picker :opens="'left'" v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
                                    <template v-slot:header="header" #slot-scope="header" class="slot">
                                        <h3 class="m-0">Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                    </template>
                                    <template #input="picker" style="min-width: 480px;">
                                        {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                    </template>
                                    <template #date="data">
                                        <span class="small">{{ data.date | dateCell }}</span>
                                    </template>
                                    <template #ranges="ranges">
                                        <div class="ranges">
                                            <ul>
                                            <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                                <b>{{ name }}</b> <small class="text-muted">{{ range[0].toDateString() }} -
                                                {{ range[1].toDateString() }}</small>
                                            </li>
                                            </ul>
                                        </div>
                                    </template>
                                    <template v-slot:footer="footer" #slot-scope="data" class="slot">
                                        <div>
                                            <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                        </div>
                                        <div style="margin-left: auto">
                                            <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
                                        </div>
                                    </template>
                                </date-range-picker>
                            </template> -->
                            <!-- <v-select solo :items="dateFilterRange" label="Report Year" v-model="homeReport" @change="fetchDashboardData()"></v-select> -->
                            <v-card-text>
                                <v-col cols="12" sm="12" md="12" lg="12" class="tagline_class text-center pb-0">
                                    <hr/>
                                    <p>cost</p>
                                </v-col>
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Operations Cost</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Ads Cost
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Ads Cost
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Ads Cost
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Total Ads Cost</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <v-card-text>
                                <v-col cols="12" sm="12" md="12" lg="12" class="tagline_class text-center pb-0">
                                    <hr/>
                                    <p>Revenue</p>
                                </v-col>
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Conversions</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Commissions</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Net Profits</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">$0.00</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">ROAS</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0.00%</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">ROI</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0.00%</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>

        <v-container class="mb-3">
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="pa-0">
                    <v-sheet rounded="lg">
                        <v-card>
                            <v-card-title class="font-weight-bold">General Stats</v-card-title>
                            <!-- <div class="nav-wrapper report_tabpanel">
                                <ul class="nav nav-pills nav-fill flex-column flex-md-row" id="tabs-icons-text" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link mb-sm-3 mb-md-0 active" id="tabs-icons-text-1-tab" data-toggle="tab" href="#tabs-icons-text-1" role="tab" aria-controls="tabs-icons-text-1" aria-selected="true">
                                            <span class="btn-inner--text">General Stats</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link mb-sm-3 mb-md-0" id="tabs-icons-text-2-tab" data-toggle="tab" href="#tabs-icons-text-2" role="tab" aria-controls="tabs-icons-text-2" aria-selected="false">
                                            <span class="btn-inner--text">Profit & Loss</span>
                                        </a>
                                    </li>
                                </ul>
                            </div> -->
                            
                            <!-- Start Microsoft -->
                            <v-card-text class="mt-4">
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Master Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Child Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Active Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Inactive Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Total Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <!-- Start Google -->
                            <v-card-text>
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Master Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Child Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Active Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Inactive Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Total Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <!-- Start Facebook -->
                            <v-card-text>
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Master Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Child Accounts
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Active Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Inactive Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">
                                                <img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Total Campaigns
                                            </v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                            <!-- Start general -->
                            <v-card-text>
                                <v-row class="ma-0 row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Automated Networks</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Manual Networks</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col class="py-0 five_row dashboard_card">
                                        <v-card class="card-stats">
                                            <v-card-title class="card-title">Total Networks</v-card-title>
                                            <v-card-text class="card-body">
                                                <h2 class="font-weight-bold mb-0">0</h2>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-sheet>
                </v-col>
            </v-row>
            <!-- <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                </div>
                <div class="tab-pane fade" id="tabs-icons-text-2" role="tabpanel" aria-labelledby="tabs-icons-text-2-tab">
                    <div class="row">
                        <div class="col-md-6">
                            <h3 class="mb-0">Dashboard Data</h3>
                        </div>
                        <div class="col-md-6">
                            <v-select :items="dateFilter" label="Report Date" v-model="yearRange"></v-select>
                        </div>
                    </div>
                    <div class="finance_data">
                        <div class="row">
                            <div class="col-md-6 mb-3 ml-auto">
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->
        </v-container>
    </div>
</template>

<script>
 export default {
    // filters: {
    //     dateCell (value) {
    //         let dt = new Date(value)

    //         return dt.getDate()
    //     },
    //     date (val) {
    //         return val ? val.toDateString() : ''
    //     }
    // },
    data() {
        let today = new Date();
        let startDate = today;
        let endDate = today;
        endDate.setDate(endDate.getDate() + 6)
        return {
            dateRange: {startDate, endDate},
            showLoader: false,
            itemsPerPage: 5,
        }
    },
    filters: {
        dateCell (value) {
        let dt = new Date(value)

        return dt.getDate()
        },
        date (val) {
        return val ? val.toLocaleString() : ''
        }
    },
    methods: {
        checkOpenPicker(e) {
            setTimeout(() => {
                console.log(e)
                // this.fetchDashboardData();
            },100)
        },
    },
 }
</script>

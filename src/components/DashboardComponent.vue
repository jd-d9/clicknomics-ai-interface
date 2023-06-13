<template>
    <div>
        <LoaderComponent v-if="hideShowLoader"></LoaderComponent>
        <div class="container-fluid mt--3">
            <div class="row justify-content-center mt--3">
                <div class="col">
                    <!-- page content -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0 float-left pt-2"><b>Date: 12/05/2023</b></h3>
                            <div class="float-right">
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
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="col-md-12 tagline_class text-center">
                                <hr/>
                                <p>cost</p>
                            </div>
                            <div class="row row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">Operations Cost</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Ads Cost</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Ads Cost</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Ads Cost</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">Total Ads Cost</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12 tagline_class text-center">
                                <hr/>
                                <p>Revenue</p>
                            </div>
                            <div class="row row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">Conversions</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">0</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">Commissions</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">Net Profits</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">$0.00</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">ROAS</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">0.00%</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="five_row py-0 dashboard_card">
                                    <div class="card card-stats">
                                        <h5 class="card-title m-0">ROI</h5>
                                        <div class="card-body">
                                            <h2 class="font-weight-bold mb-0">0.00%</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- general stats contents -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0"><b>General Stats</b></h3>
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
                        </div>
                        <div class="card-body">
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="tabs-icons-text-1" role="tabpanel" aria-labelledby="tabs-icons-text-1-tab">
                                    <div class="row row-cols-lg-5 row-cols-md-4 row-cols-sm-2 row-cols-xs-1">
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Master Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Child Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Active Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Inactive Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/microsoft.svg" class="mr-2" style="width:20px;">Microsoft Total Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Master Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Child Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Active Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Inactive Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/google-ads.svg" class="mr-2" style="width:20px;">Google Total Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Master Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Child Accounts</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Active Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Inactive Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0"><img src="../assets/img/icons/facebook.svg" class="mr-2" style="width:20px;">Facebook Total Campaigns</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0">Automated Networks</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0">Manual Networks</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="five_row py-0 dashboard_card">
                                            <div class="card card-stats">
                                                <h5 class="card-title m-0">Total Networks</h5>
                                                <div class="card-body">
                                                    <h2 class="font-weight-bold mb-0">0</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="tabs-icons-text-2" role="tabpanel" aria-labelledby="tabs-icons-text-2-tab">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <!-- <h3 class="mb-0">Dashboard Data</h3> -->
                                        </div>
                                        <div class="col-md-6">
                                            <v-select :items="dateFilter" label="Report Date" v-model="yearRange"></v-select>
                                        </div>
                                    </div>
                                    <div class="finance_data">
                                        <div class="row">
                                            <div class="col-md-6 mb-3 ml-auto">
                                                <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        return {
            hideShowLoader: false,
            dateRange: {startDate, endDate},
            itemsPerPage: 5,
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
<style scoped>
    .padding-only {
        padding-bottom: 30px;
    }
</style>

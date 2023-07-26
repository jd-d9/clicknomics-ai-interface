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
                        <span>Google Real Time Reports </span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Google Real Time Reports List
                        </v-card-title>
                        <!-- data table component -->
                        <div>
                            <v-data-table-server class="table-hover-class mt-4"  v-model:items-per-page="itemsPerPage"  :items-length="totalPageCount" v-model:options="options" :headers="headers" :items="googleCampaignMetrics" v-model:expanded="expanded" show-expand item-value="name">
                                <template v-slot:expanded-row="{ columns, item }">
                                    <td :colspan="columns.length" style="padding:10px" class="exapanded bg-light-green-lighten-5" v-if="item.selectable.children.length > 0">
                                        <table class="table align-items-center">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Campaign Name 
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Clicks
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Cost 
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Click Through Rate
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Impressions
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Cost Per Click
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Conversions
                                                        </div>
                                                    </th>
                                                    <th class="v-data-table__td" scope="col">
                                                        <div class="v-data-table-header__content">
                                                            Campaign Status
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(row , index) in item.raw.children" :key="index">
                                                    <td class="v-data-table__td">
                                                        {{row.campaign.name ? row.campaign.name : '-'}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.clicks ? $filters.toNumberWithoutDecimal(row.metrics.clicks) : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.costMicros ? $filters.toNumber(parseFloat(row.metrics.costMicros / 1000000).toFixed(2))  : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.ctr ? $filters.toNumber((row.metrics.ctr * 100).toFixed(2)) : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.impressions ? $filters.toNumberWithoutDecimal(row.metrics.impressions) : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.averageCpc ? $filters.toNumber(parseFloat(row.metrics.averageCpc / 1000000).toFixed(2))  : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.metrics.conversions ? $filters.toNumber(row.metrics.conversions) : '0.00')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{ row.campaign.status ? row.campaign.status : '-'}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td class="exapanded bg-light-green-lighten-5 text-center" :colspan="columns.length" style="padding:10px" v-else>
                                        No Data Found
                                    </td>
                                </template>
                            </v-data-table-server>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

export default {
    data() {
        return {
            options:{},
            itemsData: [
                {
                    text: 'All Time',
                    code: 'all_time'
                },
                {
                    text: 'Today',
                    code: 'TODAY'
                },
                {
                    text: 'Yesterday',
                    code: 'YESTERDAY'
                },
                {
                    text: 'This Week',
                    code: 'THIS_WEEK_MON_SUN'
                },
                {
                    text: 'Last Week',
                    code: 'LAST_WEEK_MON_SUN'
                },
                {
                    text: 'This Month',
                    code: 'THIS_MONTH'
                },
                {
                    text: 'Last Month',
                    code: 'LAST_MONTH'
                },

            ],
            reportRange: 'Today',
            microsoftReportRange: 'Today',
            items:[],
            googleCampaignMetrics:[],
            singleExpand: true,
            page: 1,
            itemsPerPage: 5,
            numberOfPages: 0,
            totalPageCount: 0,
            expanded: [],
            showLoader: false,
            linkedNewtworks: [],
            headers: [
                { title: '', key: 'data-table-expand' },
                { title: 'Account Name', align: 'start', sortable: true, key: 'name' },
                { title: 'Impressions', key: 'impressions',sortable: true, },
                { title: 'Clicks', key: 'clicks',sortable: true, },
                { title: 'Cost', key: 'costMicros',sortable: true, },
                { title: 'Cost Per Click', key: 'averageCpc',sortable: true, },
                { title: 'Click Through Rate', key: 'ctr',sortable: true, },
                { title: 'Absolute Top Impression %', key: 'absoluteTopImpressionPercentage',sortable: true, },
                { title: 'Conversions', key: 'conversions',sortable: true, },
                { title: 'Conversion Rate', key: 'conversions_from_interactions_rate',sortable: true, },
                { title: 'Cost Per Conversion', key: 'cost_per_conversion',sortable: true, },
            ],
            permissions: {},
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    watch:{
        options: {
            handler() {
                this.getGoogleAdsMetrics();
            },
        },
        deep: true,
    },
    methods: {
        // get google analytics data
        getGoogleAdsMetrics() {
            this.googleCampaignMetrics = [];
            this.showLoader = true;
            const { sortBy, sortDesc, page,itemsPerPage } = this.options;
            let pageNumber = 1;
            // if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
            //     console.log(this.page, 'page'); 
            // }
            if(page){
                pageNumber = page;
            }
            let formData = new FormData();
            formData.append('reportRange','TODAY')
            this.axios.get(this.$api + `/realTimeReports/googleAdsReport?size=${itemsPerPage}&page=${pageNumber}&reportRange=Today` ,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                const responseData = response.data.data;
                if(responseData) {
                    // Add All Campaign data into Account
                    let dataTemp = [];
                    responseData.map((data) => {
                        dataTemp.push({
                            name: data.accountName,
                            clicks: _.sumBy(data.results, function(o) { return o.metrics.clicks ? Number(o.metrics.clicks) : 0}),
                            costMicros: _.sumBy(data.results, function(o) { return o.metrics.costMicros ? Number(o.metrics.costMicros) : 0}),
                            ctr: _.sumBy(data.results, function(o) { return o.metrics.ctr ? Number(o.metrics.ctr) : 0}),
                            impressions: _.sumBy(data.results, function(o) { return o.metrics.impressions ? Number((o.metrics.impressions)) : 0}),
                            averageCpc: _.sumBy(data.results, function(o) { return o.metrics.averageCpc ? Number(o.metrics.averageCpc) : 0}),
                            conversions: _.sumBy(data.results, function(o) { return o.metrics.conversions ? Number(o.metrics.conversions) : 0}),
                            absoluteTopImpressionPercentage: _.sumBy(data.results, function(o) { return o.metrics.absoluteTopImpressionPercentage ? Number(o.metrics.absoluteTopImpressionPercentage) : 0}),
                            cost_per_conversion: _.sumBy(data.results, function(o) { return o.metrics.costPerConversion ? Number(o.metrics.costPerConversion) : 0}),
                            conversions_from_interactions_rate: _.sumBy(data.results, function(o) { return o.metrics.conversionsFromInteractionsRate ? Number(o.metrics.conversionsFromInteractionsRate) : 0}),
                            children: data.results
                        })
                    });

                    dataTemp.map((row) => {
                        this.googleCampaignMetrics.push({
                            name: row.name,
                            clicks: this.$filters.toNumberWithoutDecimal(row.clicks),
                            costMicros: row.costMicros !== 0 ? ('$'+parseFloat(row.costMicros / 1000000).toFixed(2))  : '$0.00',
                            ctr: this.$filters.toNumberWithPercentage(row.ctr ? (row.ctr * 100) : 0.00),
                            impressions: this.$filters.toNumberWithoutDecimal(row.impressions !== 0 ? row.impressions : 0.00),
                            averageCpc: row.averageCpc !== 0 ? ('$'+parseFloat(row.averageCpc / 1000000).toFixed(2))  : '$0.00',
                            conversions: this.$filters.toNumber(row.conversions !== 0 ? row.conversions : 0.00),
                            absoluteTopImpressionPercentage: row.absoluteTopImpressionPercentage !== 0 ? (parseFloat(row.absoluteTopImpressionPercentage).toFixed(2)+'%') : '0.00%',
                            cost_per_conversion: this.$filters.toNumber(row.cost_per_conversion !== 0 ? parseFloat(row.cost_per_conversion / 1000000).toFixed(2) : 0.00),
                            conversions_from_interactions_rate: this.$filters.toNumber(row.conversions_from_interactions_rate !== 0 ? row.conversions_from_interactions_rate : 0.00),
                            children: row.children
                        });
                        return row;
                    });

                    if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
                        this.googleCampaignMetrics = this.googleCampaignMetrics.sort((a, b) => {
                            const sortA = a[sortBy[0]];
                            const sortB = b[sortBy[0]];

                            if (sortDesc[0]) {
                            if (sortA < sortB) return 1;
                            if (sortA > sortB) return -1;
                                return 0;
                            } else {
                                if (sortA < sortB) return -1;
                                if (sortA > sortB) return 1;
                                return 0;
                            }
                        });
                    }
                }else if(response.data.success != true) {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }

                // For Pagination
                this.totalPageCount = response.data.customers.total;
                this.numberOfPages = response.data.customers.last_page;
                this.page = page;
                this.showLoader = false;
            }).catch(error => {
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
        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD');
            }else {
                return '-';
            }
        },
    }
}
</script>

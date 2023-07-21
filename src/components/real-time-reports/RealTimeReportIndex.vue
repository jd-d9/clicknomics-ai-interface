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
                                    <li class="breadcrumb-item active" aria-current="page">Real Time Reports {{reportType}}</li>
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
                <div class="col">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card v-if="reportType == 'google'">
                                            <v-data-table class="table-hover-class elevation-1"  v-model:items-per-page="itemsPerPage" :page="page" :server-items-length="totalPageCount" :pageCount="numberOfPages" :options="options" :headers="headers" :items="googleCampaignMetrics" v-model:expanded="expanded" show-expand item-value="name">
                                                <template v-slot:expanded-row="{ columns, item }">
                                                    <tr>
                                                        <td :colspan="columns.length" style="padding:10px">
                                                            <table class="table align-items-center">
                                                                <thead class="thead-light">
                                                                    <tr>
                                                                        <th scope="col">Campaign Name </th>
                                                                        <th scope="col">Clicks</th>
                                                                        <th scope="col">Cost </th>
                                                                        <th scope="col">Click Through Rate</th>
                                                                        <th scope="col">Impressions</th>
                                                                        <th scope="col">Cost Per Click</th>
                                                                        <th scope="col">Conversions</th>
                                                                        <th scope="col">Campaign Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(row , index) in item.raw.children" :key="index">
                                                                        <td>
                                                                            {{row.campaign.name ? row.campaign.name : '-'}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.clicks ? $filters.toNumberWithoutDecimal(row.metrics.clicks) : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.costMicros ? $filters.toNumber(parseFloat(row.metrics.costMicros / 1000000).toFixed(2))  : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.ctr ? $filters.toNumber((row.metrics.ctr * 100).toFixed(2)) : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.impressions ? $filters.toNumberWithoutDecimal(row.metrics.impressions) : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.averageCpc ? $filters.toNumber(parseFloat(row.metrics.averageCpc / 1000000).toFixed(2))  : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.metrics.conversions ? $filters.toNumber(row.metrics.conversions) : '0.00')}}
                                                                        </td>
                                                                        <td>
                                                                            {{ row.campaign.status ? row.campaign.status : '-'}}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                        <v-card v-if="reportType == 'microsoft'">
                                            <v-data-table class="table-hover-class elevation-1"  :itemsPerPage="itemsPerPage" :page="page" :server-items-length="totalPageCount" :pageCount="numberOfPages" :options="options" :headers="microsoftHeaders" :items="microsoftCampaignMetrics" v-model:expanded="expanded" show-expand item-value="name">
                                                <template v-slot:expanded-row="{ columns, item }">
                                                    <tr>
                                                        <td :colspan="columns.length" style="padding:10px">
                                                            <table class="table align-items-center">
                                                                <thead class="thead-light">
                                                                    <tr>
                                                                        <th scope="col">Campaign Name</th>
                                                                        <th scope="col">DailyBudget </th>
                                                                        <th scope="col">Campaign Status</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(row , index) in item.raw.children" :key="index">
                                                                        <td>
                                                                            {{row.name ? row.name : '-'}}
                                                                        </td>
                                                                        <td>
                                                                            {{(row.dailyBudget ? $filters.toCurrency(row.dailyBudget) : '-')}}
                                                                        </td>
                                                                        <td>
                                                                            {{row.status ? row.status : '-'}}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-app>
                                </div>
                            </div>
                        </div>
                    </v-app>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

export default {
    data() {
        return {
            reportType:'',
            options:[],
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
            // microsoft
            microsoftCampaignMetrics:[],
            microsoftHeaders: [
                { title: 'Account Name', align: 'start', sortable: true, key: 'AccountName' },
                { title: 'Clicks', key: 'Clicks', sortable: true,},
                { title: 'Click Through Rate', key: 'Ctr', sortable: true,},
                { title: 'Spend', key: 'Spend', sortable: true,},
                { title: 'Cost Per Click', key: 'AverageCpc', sortable: true,},
                { title: 'Impressions', key: 'Impressions', sortable: true,},
                { title: 'Impressions (Top)%', key: 'AbsoluteTopImpressionRatePercent', sortable: true,},
            ],
            permissions: {},
        }
    },
    mounted() {
        this.reportType = this.$route.params.reportType ? this.$route.params.reportType : '';
    },
    watch:{
        '$route.params.reportType':{
            handler(value){
                this.reportType = value
                this.pull()
            },
            deep:true,
            immediate: true
        }
    },
    methods: {
        // pull data
        pull(){
            if(this.reportType == 'google') {
                this.getGoogleAdsMetrics();
            }else if(this.reportType == 'microsoft') {
                this.getMicrosoftAdsMetrics();
            }
        },
        // get google analytics data
        getGoogleAdsMetrics() {
            this.googleCampaignMetrics = [];
            this.showLoader = true;
            const { sortBy, sortDesc, page } = this.options;
            let pageNumber = 1;
            if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
                console.log(this.page, 'page');
                pageNumber = this.page;
            }
            let formData = new FormData();
            formData.append('reportRange','TODAY')
            // // const filter = _.find(this.items, (o) =>  { return o.text == this.reportRange; });
            this.axios.get(this.$api + `/realTimeReports/googleAdsReport?size=${this.itemsPerPage}&page=${pageNumber}&reportRange=Today` ,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                }

                // For Pagination
                this.totalPageCount = response.data.customers.total;
                this.numberOfPages = response.data.customers.last_page;
                this.page = page;
                this.showLoader = false;
            }).catch(error => {
                this.showLoader = false;
                console.log(error);
            })
        },
        getMicrosoftAdsMetrics() {
            this.microsoftCampaignMetrics = [];
            this.showLoader = true;
            let formData = new FormData();
            // const filter = _.find(this.dateFilterMicrosoft, (o) =>  { return o.text == this.microsoftReportRange; });
            const { sortBy, sortDesc, page } = this.options;
            // let pageNumber = page;
            let pageNumber = 1;
            if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
                pageNumber = this.page;
            }
            formData.append('reportRange', 'Today');

            this.axios.get(this.$api + `/realTimeReport?size=${this.itemsPerPage}&page=${pageNumber}&reportRange=Today`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                const responseData = response.data.data;
                responseData.map((data) => {
                    if(Array.isArray(data.metrics)) {
                        this.microsoftCampaignMetrics.push({
                            'AccountName': data.metrics[0].AccountName,
                            'Clicks': this.$filters.toNumberWithoutDecimal(data.metrics[0].Clicks),
                            'Ctr': data.metrics[0].Ctr ? this.$filters.toNumber(data.metrics[0].Ctr) : this.$filters.toNumber(0),
                            'Spend': this.$filters.toCurrency(data.metrics[0].Spend),
                            'AverageCpc': this.$filters.toNumber(data.metrics[0].AverageCpc),
                            'Impressions': this.$filters.toNumberWithoutDecimal(data.metrics[0].Impressions),
                            'AbsoluteTopImpressionRatePercent': data.metrics[0].AbsoluteTopImpressionRatePercent ? this.$filters.toNumberWithPercentage(data.metrics[0].AbsoluteTopImpressionRatePercent) : 0,
                            'children' : data.campaign
                        });
                    }
                });
                // For Pagination
                this.totalPageCountMicrosoft = response.data.accounts.total;
                this.numberOfPagesMicrosoft = response.data.accounts.last_page;
                this.pageMicrosoft = page;
                this.showLoader = false;
                if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
                    this.microsoftCampaignMetrics = this.microsoftCampaignMetrics.sort((a, b) => {
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
            }).catch(error => {
                console.log(error)
                this.showLoader = false;
            })
        },

        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
    }
}
</script>

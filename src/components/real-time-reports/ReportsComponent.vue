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
                        <span>Real Time Reports CPA Networks</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Real Time Reports CPA Networks List
                        </v-card-title>
                        <div>
                            <v-data-table-server class="table-hover-class mt-4" v-model:items-per-page="itemsPerPage" v-model:options="options" :headers="networksheaders" :items="networkMetrics" :items-length="totalPageCount" v-model:expanded="expanded" show-expand item-value="name">
                                <template v-slot:expanded-row="{ columns, item }">
                                    <td :colspan="columns.length" style="padding:10px" class="exapanded bg-light-green-lighten-5" v-if="item.selectable.children.length > 0">
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'cake'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Format</th>
                                                    <!-- <th scope="col">Price</th> -->
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <th scope="col">Conversions Percentage</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">EPC</th>
                                                    <th scope="col">Events</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.offer_name ? row.offer_name : '-'}}</td>
                                                    <td>{{ row.price_format ? row.price_format : '-'}}</td>
                                                    <!-- <td>{{ row.price | toCurrency}}</td> -->
                                                    <td>{{ row.clicks ? row.clicks : '-'}}</td>
                                                    <td>{{ row.conversions ? row.conversions : '-'}}</td>
                                                    <td>{{ formatPercentage(row.conversion_rate * 100) + '%'}}</td>
                                                    <td>{{ $filters.toCurrency(row.revenue)}}</td>
                                                    <td>{{ formatPercentage(row.epc) }}</td>
                                                    <td>{{ row.events ? row.events : '-'}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9"  class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--End  table for cake network -->
                                        <!--Start table for hasoffers network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'hasoffers'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <!-- <th scope="col">Time</th> -->
                                                    <th scope="col">Offer</th>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <!-- <th scope="col">Status</th>
                                                    <th scope="col">Payout</th>
                                                    <th scope="col">Transaction ID</th> -->
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <!-- <td>{{ row.Stat.date}}</td> -->
                                                    <td>{{ row.Offer.name ? row.Offer.name : '-'}}</td>
                                                    <td>{{ row.Stat.clicks ? row.Stat.clicks : '-'}}</td>
                                                    <td>{{ row.Stat.conversions ? row.Stat.conversions : '-'}}</td>
                                                    <!-- <td>{{ row.Stat.conversion_status}}</td>
                                                    <td>{{ row.Stat.approved_payout | toCurrency}}</td>
                                                    <td>{{ row.Stat.ad_id}}</td> -->
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="5"  class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for hasoffers network -->
                                        <!--Start table for everflow network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'everflow'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Offer</th>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Unique Click</th>
                                                    <th scope="col">Duplicate Click</th>
                                                    <th scope="col">Invalid Click</th>
                                                    <th scope="col">CVR</th>
                                                    <th scope="col">RPC</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">Redirect Traffic Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.offer_name ? row.offer_name : '-'}}</td>
                                                    <td>{{ row.total_click ? row.total_click : '-'}}</td>
                                                    <td>{{ row.unique_click ? row.unique_click : '-'}}</td>
                                                    <td>{{ row.duplicate_click ? row.duplicate_click : '-'}}</td>
                                                    <td>{{ row.invalid_click ? row.invalid_click : '-'}}</td>
                                                    <td>{{ formatPercentage(row.cvr) + '%'}}</td>
                                                    <td>{{ $filters.toCurrency(row.rpc)}}</td>
                                                    <td>{{ $filters.toCurrency(row.revenue)}}</td>
                                                    <td>{{ $filters.toCurrency(row.redirect_traffic_revenue)}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9" class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for everflow network -->
                                        <!--Start table for ClickBooth network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'clickbooth'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <th scope="col">Conversion Rate</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">EPC</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.clicks ? row.clicks : '-'}}</td>
                                                    <td>{{ row.conversions ? row.conversions : '-'}}</td>
                                                    <td>{{ formatPercentage(row.conversion_rate)}}</td>
                                                    <td>{{ $filters.toCurrency(row.revenue)}}</td>
                                                    <td>{{ formatPercentage(row.epc)}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9" class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for ClickBooth network -->
                                        <!--Start table for Clickdealer network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'clickdealer'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <th scope="col">Events</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">EPC</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.clicks ? row.clicks : '-'}}</td>
                                                    <td>{{ row.conversions ? row.conversions : '-'}}</td>
                                                    <td>{{ row.events ? row.events : '-'}}</td>
                                                    <td>{{ $filters.toCurrency(row.revenue)}}</td>
                                                    <td>{{ formatPercentage(row.epc)}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9" class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for Clickdealer network -->
                                        <!--Start table for Clickdealer network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'w4'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Campaign ID</th>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">EPC</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.campaign_id ? row.campaign_id : '-'}}</td>
                                                    <td>{{ row.total_clicks ? row.total_clicks : '-'}}</td>
                                                    <td>{{ row.total_conversions ? row.total_conversions : '-'}}</td>
                                                    <td>{{ $filters.toCurrency(row.payout ? row.payout : 0)}}</td>
                                                    <td>{{ formatPercentage(row.epc)}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9" class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for Clickdealer network -->
                                        <!--Start table for Affise network -->
                                        <table class="table align-items-center" v-if="item.raw.network_type == 'affise'">
                                            <thead class="thead-light">
                                                <tr>
                                                    <th scope="col">Clicks</th>
                                                    <th scope="col">Conversions</th>
                                                    <th scope="col">Revenue</th>
                                                    <th scope="col">EPC</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="item.raw.child.length > 0">
                                                <tr v-for="(row , index) in item.raw.child" :key="index">
                                                    <td>{{ row.clicks ? row.clicks : '-'}}</td>
                                                    <td>{{ row.conversions ? row.conversions : '-'}}</td>
                                                    <td>{{ $filters.toCurrency(row.payouts ? row.payouts : 0)}}</td>
                                                    <td>{{ formatPercentage(row.epc)}}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <td colspan="9" class="text-center"> No Data Found</td>
                                            </tbody>
                                        </table>
                                        <!--Start table for Affise network -->
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
import _ from 'lodash';
import axios from '@axios';
export default {
    data() {
        return {
            reportsData: [],
            search: '',
            networksheaders: [
                { title: '', key: 'data-table-expand' },
                { title: 'Network Name', align: 'start', sortable: false, key: 'network_name' },
                { title: 'Email', align: 'start', sortable: false, key: 'email' },
                { title: 'Clicks', align: 'start', sortable: false, key: 'clicks' },
                { title: 'Conversions', align: 'start', sortable: false, key: 'conversions' },
                { title: 'Revenue',  key: 'total_revenue', sortable: false, },
            ],
            networkMetrics: [],
            expanded: [],
            page: 1,
            itemsPerPage: 5,
            numberOfPages: 0,
            totalPageCount: 0,
            loading: true,
            options: {},
            currentItemsTable: [],
            permissions: {},
            showLoader:false,
        }
    },
    mounted() {
        // this.fetchNetworkReport();
    },
    watch:{
        options: {
            handler() {
                this.fetchNetworkReport();
            },
        },
        deep: true,
    },
    methods: {
        formatPercentage(value) {
            if(value) {
                return parseFloat(value).toFixed(2);
            }else {
                return '-';
            }
        },
        fetchNetworkReport() {
            this.showLoader = true;
            let { page, itemsPerPage } = this.options;
            
            if(!page && !itemsPerPage){
                page = this.page
                itemsPerPage = this.itemsPerPage
            }

            axios.get(this.$api + `/realTimeReports/networkAdsReport?size=${itemsPerPage}&page=${page}`,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data && response.data.data) {
                    let responseData =  _.cloneDeep(response.data.data);
                    responseData.map((result) => {
                        result.name = result.network_name + result.email;
                        if(result.network_type == 'cake') {
                            result.child = result.children.data ? result.children.data : [];
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.revenue ? Number((o.revenue)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.clicks ? Number((o.clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.conversions ? Number((o.conversions)) : 0});
                        }else if(result.network_type == 'hasoffers') {
                            result.child = result.children.response.data.data;
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.Stat.payout ? Number((o.Stat.payout)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.Stat.clicks ? Number((o.Stat.clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.Stat.conversions ? Number((o.Stat.conversions)) : 0});
                        }else if(result.network_type == 'everflow') {
                            result.child = result.children;
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.revenue ? Number((o.revenue)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.total_click ? Number((o.total_click)) : 0});
                            let calulatedConversion = 0;
                            if(result.child.length > 0) {
                                result.child.map((o) => {
                                    calulatedConversion = calulatedConversion + ( (o.cvr ? Number(o.cvr) : 0) / 100 ) * (o.total_click ? Number(o.total_click) : 0 );
                                });
                            }
                            result.conversions = Math.round(calulatedConversion);
                        }else if(result.network_type == 'clickbooth') {
                            result.child = [];
                            if(result.children && "days" in result.children) {
                                result.child = ( _.isArray(result.children.days.day) ? result.children.days.day : Array(result.children.days.day) );
                            }
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.revenue ? Number((o.revenue)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.clicks ? Number((o.clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.conversions ? Number((o.conversions)) : 0});
                        }else if(result.network_type == 'clickdealer') {
                            result.child = result.children.days ? ( _.isArray(result.children.days) ? result.children.days : Array(result.children.days) ) : [];
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.revenue ? Number((o.revenue)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.clicks ? Number((o.clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.conversions ? Number((o.conversions)) : 0});
                        }else if(result.network_type == 'w4') {
                            result.child = result.children.data.results ? ( _.isArray(result.children.data.results) ? result.children.data.results : Array(result.children.data.results) ) : [];
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.payout ? Number((o.payout)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.total_clicks ? Number((o.total_clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.total_conversions ? Number((o.total_conversions)) : 0});
                        }else if(result.network_type == 'affise') {
                            result.child = result.children.stats ? ( _.isArray(result.children.stats) ? result.children.stats : Array(result.children.stats) ) : [];
                            result.total_revenue = this.$filters.toCurrency(_.sumBy(result.child, function(o) { return o.payouts ? Number((o.payouts)) : 0}));
                            result.clicks = _.sumBy(result.child, function(o) { return o.clicks ? Number((o.clicks)) : 0});
                            result.conversions = _.sumBy(result.child, function(o) { return o.conversions ? Number((o.conversions)) : 0});
                        }
                    });
                    this.networkMetrics = responseData;
                    // For Pagination
                    this.totalPageCount = response.data.networks.total;
                    this.numberOfPages = response.data.networks.last_page;
                    this.showLoader = false;
                }
                else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
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
        currentItems(currentItems) {
            this.currentItemsTable = currentItems;
        },
    }
}
</script>

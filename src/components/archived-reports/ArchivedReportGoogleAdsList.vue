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
                            <span>Archived Reports Google</span>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Archived Reports Google List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end">
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                                <v-col class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table :headers="headers" :items="googleCampaignMetrics" :search="search" :single-expand="singleExpand" v-model:expanded="expanded" item-value="name" show-expand class="table-hover-class mt-4" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <td class="exapanded bg-light-green-lighten-5" :colspan="columns.length" style="padding:10px" v-if="item.selectable.children.length > 0">
                                    <table class="table align-items-center" v-if="googleCampaignMetrics.length > 0">
                                        <thead class="thead-light">
                                            <tr>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Campaign Name</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Clicks</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Cost (USD Currency)</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Cost (Account Currency)</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Click Through Rate</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Impressions</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Cost Per Click</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Conversions</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Campaign Status</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="list">
                                            <tr v-for="(row , index) in item.selectable.children" :key="index">
                                                <td class="v-data-table__td">
                                                    {{row.campaign_name ? row.campaign_name : '-'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumberWithoutDecimal(row.clicks ? row.clicks : '0')}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.costMicros ? '$' + parseFloat(row.costMicros / 1000000).toFixed(2)  : '$0.00'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.costMicrosConverted ? `${item.currency} -` + parseFloat(row.costMicrosConverted / 1000000).toFixed(2)  : row.costMicros ? '$' + parseFloat(row.costMicros / 1000000).toFixed(2)  : '$0.00'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumber(row.ctr ? (row.ctr * 100).toFixed(2) : '0')}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumberWithoutDecimal(row.impressions ? row.impressions : '0')}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumber(row.averageCpc ? parseFloat(row.averageCpc / 1000000).toFixed(2)  : '0')}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumber(row.conversions ? row.conversions : '0')}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.campaign_status ? row.campaign_status : '-'}}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td class="exapanded bg-light-green-lighten-5 text-center" :colspan="columns.length" style="padding:10px" v-else>
                                    No Data Found
                                </td>
                            </template>
                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td>{{$filters.toNumberWithoutDecimal(sumImpressions)}}</td>
                                    <td>{{$filters.toNumberWithoutDecimal(sumClick)}}</td>
                                    <td>{{$filters.toCurrency(sumCostMicros)}}</td>
                                    <td></td>
                                    <td>{{$filters.toCurrency(sumAverageCpc)}}</td>
                                    <td>{{$filters.toNumberWithPercentage(sumCtr)}}</td>
                                    <td>{{$filters.toNumber(sumAbsoluteTopImpressionPercentage)}}%</td>
                                    <td>{{$filters.toNumber(sumConversions)}}</td>
                                    <td>{{$filters.toNumber(sumConversionsFromInteractions)}}</td>
                                    <td>{{$filters.toNumber(sumCostPerConversion)}}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import _ from 'lodash';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import axios from '@axios';
import mixin from '../../mixin.js';
export default {
    mixins: [mixin],
    components: {
        DateRangePicker,
    },
    data() {
        return {
            message: {},
            showLoader: false,
            googleCampaignMetrics: [],
            currentItemsTable: [],
            search: '',
            singleExpand: true,
            expanded: [],
            itemsPerPage: -1,
            isSortable: true,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumCostMicros() {
            const key = 'costMicros';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                let num = item.costMicros.substring(1);
                // num = num.replace(/\,/g,'');
                num = num.replace(/_/g,'');
                item.costMicros = parseFloat(num);
                return item;
            });
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumClick() {
            const key = 'clicks';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.clicks = parseFloat(Number(item.clicks.replace(/_/g,'')));
                return item;
            });
            return  data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumCtr() {
            const key = 'ctr';
            return (this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)) / this.googleCampaignMetrics.length
        },
        sumImpressions() {
            const key = 'impressions';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.impressions = parseFloat(Number(item.impressions.replace(/_/g,'')));
                return item;
            });
            return data.reduce((a, b) => parseFloat((a)) + parseFloat(b[key] || 0), 0)
        },
        sumAverageCpc() {
            const key = 'averageCpc';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                let num = item.averageCpc.substring(1);
                // num = num.replace(/\,/g,'');
                num = num.replace(/_/g,'');
                item.averageCpc = parseFloat(num);
                return item;
            });
            return (data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)) / this.currentItemsTable.length
        },
        sumConversions() {
            const key = 'conversions';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumAbsoluteTopImpressionPercentage() {
            const key = 'absoluteTopImpressionPercentage';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumCostPerConversion() {
            const key = 'cost_per_conversion';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumConversionsFromInteractions() {
            const key = 'conversions_from_interactions_rate';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        headers() {
            return [
                { title: '', key: 'data-table-expand' },
                { title: 'Account Name', align: 'start', sortable: this.isSortable, key: 'name' },
                { title: 'Impressions', key: 'impressions', sortable: this.isSortable },
                { title: 'Clicks', key: 'clicks', sortable: this.isSortable },
                { title: 'Cost (USD Currency)', key: 'costMicros', sortable: this.isSortable },
                { title: 'Cost (Account Currency)', key: 'costMicrosConverted', sortable: this.isSortable },
                { title: 'Cost Per Click', key: 'averageCpc', sortable: this.isSortable },
                { title: 'Click Through Rate', key: 'ctr', sortable: this.isSortable },
                { title: 'Absolute Top Impression %', key: 'absoluteTopImpressionPercentage', sortable: this.isSortable },
                { title: 'Conversions', key: 'conversions', sortable: this.isSortable },
                { title: 'Conversion Rate', key: 'conversions_from_interactions_rate', sortable: this.isSortable },
                { title: 'Cost Per Conversion', key: 'cost_per_conversion', sortable: this.isSortable },
            ]
        },
    },
    mounted() {
        this.fetchGoogleAdsMetrics();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.fetchGoogleAdsMetrics();
        },
        // fetch google report list
        fetchGoogleAdsMetrics() {
            this.googleCampaignMetrics = [];
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/archivedReport';
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
                    let responseData = response.data.data;
                    responseData = _.map(responseData, (res) => {
                        _.map(res.campaign, (t) => {
                            t.absoluteTopImpressionPercentage = _.sumBy(t.metrics, function(o) { return o.absoluteTopImpressionPercentage ? Number(o.absoluteTopImpressionPercentage) : 0})
                            t.averageCpc = _.sumBy(t.metrics, function(o) { return o.averageCpc ? Number(o.averageCpc) : 0})
                            t.clicks = _.sumBy(t.metrics, function(o) { return o.clicks ? Number(o.clicks) : 0})
                            t.conversions = _.sumBy(t.metrics, function(o) { return o.conversions ? Number(o.conversions) : 0})
                            t.conversionsFromInteractionsRate =  _.sumBy(t.metrics, function(o) { return o.conversionsFromInteractionsRate ? Number(o.conversionsFromInteractionsRate) : 0})
                            t.costMicros = _.sumBy(t.metrics, function(o) { return o.costMicros ? Number(o.costMicros) : 0})
                            t.costPerConversion = _.sumBy(t.metrics, function(o) { return o.costPerConversion ? Number(o.costPerConversion) : 0})
                            t.ctr = _.sumBy(t.metrics, function(o) { return o.ctr ? Number(o.ctr) : 0})
                            t.impressions = _.sumBy(t.metrics, function(o) { return o.impressions ? Number(o.impressions) : 0})
                            if(t.costMicros != 0 && res.currency_exchange_rate && res.currency_exchange_rate != null){
                                t.costMicrosConverted =  t.costMicros / res.currency_exchange_rate;
                            }
                        });
                        return res;
                    });
                    let dataTemp = [];
                    responseData.map((data) => {
                        dataTemp.push({
                            name: data.name,
                            clicks: _.sumBy(data.campaign, function(o) { return o.clicks ? Number(o.clicks) : 0}),
                            costMicros: _.sumBy(data.campaign, function(o) { return o.costMicros ? Number(o.costMicros) : 0}),
                            costMicrosConverted: _.sumBy(data.campaign, function(o) { return o.costMicrosConverted ? Number(o.costMicrosConverted) : 0}),
                            ctr: _.sumBy(data.campaign, function(o) { return o.ctr ? Number(o.ctr) : 0}),
                            impressions: _.sumBy(data.campaign, function(o) { return o.impressions ? Number((o.impressions)) : 0}),
                            averageCpc: _.sumBy(data.campaign, function(o) { return o.averageCpc ? Number(o.averageCpc) : 0}),
                            conversions: _.sumBy(data.campaign, function(o) { return o.conversions ? Number(o.conversions) : 0}),
                            absoluteTopImpressionPercentage: _.sumBy(data.campaign, function(o) { return o.absoluteTopImpressionPercentage ? Number(o.absoluteTopImpressionPercentage) : 0}),
                            cost_per_conversion: _.sumBy(data.campaign, function(o) { return o.costPerConversion ? Number(o.costPerConversion) : 0.00}),
                            conversions_from_interactions_rate: _.sumBy(data.campaign, function(o) { return o.conversionsFromInteractionsRate ? Number(o.conversionsFromInteractionsRate) :  0.00}),
                            children: data.campaign,
                            currency: data.currency
                        })
                    });
                    dataTemp.map((row) => {
                        this.googleCampaignMetrics.push({
                            name: row.name,
                            clicks: this.$filters.toNumberWithoutDecimal(row.clicks),
                            costMicros: row.costMicros !== 0 ? ('$'+parseFloat(row.costMicros / 1000000).toFixed(2))  : '$0.00',
                            costMicrosConverted: row.costMicrosConverted !== 0 ? (`${row.currency} -`+parseFloat(row.costMicrosConverted / 1000000).toFixed(2))  : row.costMicros !== 0 ? ('$'+parseFloat(row.costMicros / 1000000).toFixed(2))  : '$0.00',
                            ctr: this.$filters.toNumberWithPercentage(row.ctr ? (row.ctr) : 0.00),
                            impressions: this.$filters.toNumberWithoutDecimal(row.impressions !== 0 ? row.impressions : 0.00),
                            averageCpc: row.averageCpc !== 0 ? ('$'+parseFloat(row.averageCpc / 1000000).toFixed(2))  : '$0.00',
                            conversions: this.$filters.toNumber(row.conversions !== 0 ? row.conversions : 0.00),
                            absoluteTopImpressionPercentage: row.absoluteTopImpressionPercentage !== 0 ? (parseFloat(row.absoluteTopImpressionPercentage).toFixed(2)+'%') : '0.00%',
                            cost_per_conversion: this.$filters.toNumber(row.cost_per_conversion !== 0 ? parseFloat(row.cost_per_conversion / 1000000).toFixed(2) : 0.00),
                            conversions_from_interactions_rate: this.$filters.toNumber(row.conversions_from_interactions_rate !== 0 ? row.conversions_from_interactions_rate : 0.00),
                            children: row.children,
                            currency: row.currency
                        });
                        return row;
                    });
                    const currentItems = {
                        itemsPerPage: -1
                    };
                    this.currentItems(currentItems);
                    if(this.googleCampaignMetrics.length > 0){
                        setTimeout(() => {
                            this.resizableGrid(document.getElementsByTagName('table')[0]);
                        }, 1000)
                    }
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
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.googleCampaignMetrics.filter((val) => {
                    return val.name && val.name.toLowerCase().includes(this.search.toLowerCase()) || 
                           val.impressions && val.impressions.toString().includes(this.search.toLowerCase()) ||
                           val.clicks && val.clicks.toString().includes(this.search.toLowerCase()) ||
                           val.costMicros && val.costMicros.toString().includes(this.search.toLowerCase()) ||
                           val.costMicrosConverted && val.costMicrosConverted.toString().includes(this.search.toLowerCase()) ||
                           val.averageCpc && val.averageCpc.toString().includes(this.search.toLowerCase()) ||
                           val.ctr && val.ctr.toString().includes(this.search.toLowerCase()) ||
                           val.absoluteTopImpressionPercentage && val.absoluteTopImpressionPercentage.toString().includes(this.search.toLowerCase()) ||
                           val.conversions && val.conversions.toString().includes(this.search.toLowerCase()) ||
                           val.conversions_from_interactions_rate && val.conversions_from_interactions_rate.toString().includes(this.search.toLowerCase()) ||
                           val.cost_per_conversion && val.cost_per_conversion.toString().includes(this.search.toLowerCase())

                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.googleCampaignMetrics;
            }
            else {
                const data = this.googleCampaignMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
        },
    }
}
</script>

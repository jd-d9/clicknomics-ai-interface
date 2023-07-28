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
                        <span>Master Accounting</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader"  -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Master Accounting List
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design">
                                    <v-select variant="outlined" placeholder="Report Year" v-model="yearRange" :items="dateFilter" @update:modelValue="fetchDashboardData"></v-select>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table :single-expand="singleExpand" :itemsPerPage="itemsPerPage" :headers="headers" :items="dataMetrics" class="table-hover-class mt-4" :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100, -1] }">
                            <template v-slot:item="{ item }">
                                <tr :class="{'total_table': item.total_table }">
                                    <td>
                                        {{ item.selectable.date}}
                                    </td>
                                    <td>{{ $filters.toCurrency(item.selectable.spendCost) }}</td>
                                    <td>{{ $filters.toCurrency(item.selectable.totalRevenue) }}</td>
                                    <td @click="fetchMonthlyChasePmts(item.selectable.date)" v-if="item.selectable.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.selectable.chasePmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.selectable.chasePmts) }}</td>
                                    <td @click="fetchMonthlyOsscPmts(item.selectable.date)" v-if="item.selectable.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.selectable.osscXsmPmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.selectable.osscXsmPmts) }}</td>
                                    <td @click="fetchMonthlySxmPmts(item.selectable.date)" v-if="item.selectable.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.selectable.sxmPmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.selectable.sxmPmts) }}</td>
                                    <td>{{ $filters.toCurrency(item.selectable.totalPmts) }}</td>
                                    <td>{{ $filters.toCurrency(item.selectable.grossProfit) }}</td>
                                    <td @click="fetchMonthlyOperationsCost(item.selectable.date)" v-if="item.selectable.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.selectable.operationsCost) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.selectable.operationsCost) }}</td>
                                    <td>{{ formatPercentage(item.selectable.roas) + '%'}}</td>
                                    <td>{{ $filters.toCurrency(item.selectable.netProfit) }}</td>
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
import axios from '@axios';
import _ from 'lodash';
export default {
    data() {
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Month', align: 'start', sortable: false, key: 'date' },
                { title: 'Total Ads Spend Cost', key: 'spendCost' },
                { title: 'Total Revenue', key: 'totalRevenue' },
                { title: 'Chase Pmts ', key: 'chasePmts' },
                { title: 'OSSC Pmts', key: 'osscXsmPmts' },
                { title: 'SXM Pmts ', key: 'sxmPmts' },
                { title: 'Total Pmts ', key: 'totalPmts' },
                { title: 'Gross Profit', key: 'grossProfit' },
                { title: 'Operations Cost', key: 'operationsCost' },
                { title: 'ROAS', key: 'roas' },
                { title: 'Net Profit', key: 'netProfit' },
            ],
            itemsPerPage: -1,
            dateFilter: [
                {
                    title: '2021',
                },
                {
                    title: '2020',
                },
                {
                    title: '2019',
                }
            ],
            yearRange: '2021',
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        const d = new Date();
        if(d.getFullYear() === 2022) {
            this.dateFilter.unshift(
                {
                    text: '2022',
                },
            )
            this.yearRange = '2022'
        }
        this.fetchDashboardData();
    },
    methods: {
        // get data using year
        fetchDashboardData() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/masterAccouting';
            if(this.yearRange) {
                queryString.set('reportYear', this.yearRange);
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
                    this.showLoader = false;
                    const responseData = response.data.data;
                    this.dataMetrics = responseData;
                    if(responseData.length > 0) {
                        this.dataMetrics.push({
                            'date': `Total ${this.yearRange}`,
                            'spendCost' : _.sumBy(this.dataMetrics, function(o) { return Number(o.spendCost) }),
                            'totalRevenue' : _.sumBy(this.dataMetrics, function(o) { return Number(o.totalRevenue) }),
                            'chasePmts' : _.sumBy(this.dataMetrics, function(o) { return Number(o.chasePmts) }),
                            'osscXsmPmts' : _.sumBy(this.dataMetrics, function(o) { return Number(o.osscXsmPmts) }),
                            'sxmPmts' : _.sumBy(this.dataMetrics, function(o) { return Number(o.sxmPmts) }),
                            'totalPmts' : _.sumBy(this.dataMetrics, function(o) { return Number(o.totalPmts) }),
                            'grossProfit' : _.sumBy(this.dataMetrics, function(o) { return Number(o.grossProfit) }),
                            'operationsCost' : _.sumBy(this.dataMetrics, function(o) { return Number(o.operationsCost) }),
                            'roas' : _.sumBy(this.dataMetrics, function(o) { return Number(o.roas) }) / _.filter(this.dataMetrics, function(o) { if (Number(o.roas) > 0) return o }).length,
                            'netProfit' : _.sumBy(this.dataMetrics, function(o) { return Number(o.netProfit) }),
                            'total_table': true
                        })
                    }
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            }).catch(error => {
                if (error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.errors) {
                    if (error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    } else if (error.response.data.errors.length == 0) {
                        this.backendErrorMessage = '';
                    } else {
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
        formatPercentage(value) {
            if(value) {
                return parseFloat(value * 100).toFixed(2);
            }else {
                return parseFloat(0 * 100).toFixed(2);
            }
        },
        fetchMonthlyChasePmts(month) {
            window.open(`/bank_accounts/ipmchase/list?year=${this.yearRange}&month=${month}`);
        },
        fetchMonthlyOsscPmts(month) {
            window.open(`/bank_accounts/onesscorp/list?year=${this.yearRange}&month=${month}`);
        },
        fetchMonthlySxmPmts(month) {
            window.open(`/bank_accounts/ipm-sxm/list?year=${this.yearRange}&month=${month}`);
        },
        fetchMonthlyOperationsCost(month){
            window.open(`/accounting/fixedMonthlyCost?year=${this.yearRange}&month=${month}`);
        },
    }
}
</script>

<style scoped>

</style>

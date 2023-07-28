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
                                    <v-select clearable variant="outlined" placeholder="Report Year" v-model="yearRange" :items="dateFilter" @update:modelValue="fetchDashboardData"></v-select>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table :single-expand="singleExpand" :itemsPerPage="itemsPerPage" :headers="headers" :items="dataMetrics" :search="search" class="table-hover-class mt-4" :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100, -1] }">
                            <template v-slot:item="{ item }">
                                <tr :class="{'total_table': item.total_table }">
                                    <td>
                                        {{ item.date}}
                                    </td>
                                    <td>{{ $filters.toCurrency(item.spendCost) }}</td>
                                    <td>{{ $filters.toCurrency(item.totalRevenue) }}</td>
                                    <td @click="fetchMonthlyChasePmts(item.date)" v-if="item.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.chasePmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.chasePmts) }}</td>
                                    <td @click="fetchMonthlyOsscPmts(item.date)" v-if="item.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.osscXsmPmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.osscXsmPmts) }}</td>
                                    <td @click="fetchMonthlySxmPmts(item.date)" v-if="item.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.sxmPmts) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.sxmPmts) }}</td>
                                    <td>{{ $filters.toCurrency(item.totalPmts) }}</td>
                                    <td>{{ $filters.toCurrency(item.grossProfit) }}</td>
                                    <td @click="fetchMonthlyOperationsCost(item.date)" v-if="item.date != `Total ${yearRange}`">
                                        <router-link to="">
                                            {{ $filters.toCurrency(item.operationsCost) }}
                                        </router-link>
                                    </td>
                                    <td v-else>{{ $filters.toCurrency(item.operationsCost) }}</td>
                                    <td>{{ formatPercentage(item.roas) + '%'}}</td>
                                    <td>{{ $filters.toCurrency(item.netProfit) }}</td>
                                </tr>
                            </template>
                        </v-data-table>

                        <div class="card" v-if="false">
                            <div class="card-header">
                                <h3 class="mb-0">Finance</h3>
                            </div>
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-card>
                                        <v-card-title>
                                            <v-spacer></v-spacer>
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <v-select @change="getFinanceReport" :items="monthFilter" label="Report Month" v-model="monthRange"></v-select>
                                                </div>
                                                <div class="col-md-6">
                                                    <v-select @change="getFinanceReport" :items="dateFilter" label="Report Year" v-model="yearRange"></v-select>
                                                </div>
                                            </div>
                                        </v-card-title>
                                        <v-data-table :headers="headers" :items="dataMetrics" :search="search"></v-data-table>
                                    </v-card>
                                </div>
                            </div>
                        </div>
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
        // this.getFinanceReport();
        const d = new Date();
        if(d.getFullYear() === 2022) {
            this.dateFilter.unshift(
                {
                    text: '2022',
                },
            )
            this.yearRange = '2022'
        }
        // this.fetchDashboardData();
    },
    methods: {
        getFinanceReport() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('reportYear', this.yearRange);
            formData.append('reportMonth', this.monthRange);
            const csrf = document.querySelector('meta[name="csrf-token"]').content;
            axios.defaults.headers.common = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf
            };
            axios.post('/getFinanceReport' , formData)
            .then(response => {
                console.log(response);
                this.dataMetrics = response.data.data;
                this.showLoader = false;

            }).catch((error) => {
                console.log(error)
                this.showLoader = false;
            })
        },
        fetchDashboardData() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('reportYear', this.yearRange);
            const csrf = document.querySelector('meta[name="csrf-token"]').content;
            axios.defaults.headers.common = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf
            };
            axios.post('/getDashboard' , formData)
            .then(response => {
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
            }).catch((error) => {
                console.log(error)
                this.showLoader = false;
            });
        },
        formatPercentage(value) {
            return parseFloat(value * 100).toFixed(2);
        },
        fetchMonthlyReport(date) {
            // window.open(`/accounting/monthlyReport/${this.yearRange}/${date}`);
            window.location.href = `/accounting/monthlyReport/${this.yearRange}/${date}`;
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
        kFormatter(num) {
            return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
        }
    }
}
</script>

<style scoped>

</style>

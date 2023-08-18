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
                            <span>Archived Reports CPA Networks</span>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Archived Reports CPA Networks List
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
                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networksheaders" :items="networkMetrics" :search="search" :single-expand="singleExpand" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.network_name`]="{ item }">
                                {{item.selectable.network_name ? item.selectable.network_name : '-'}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-'}}
                            </template>
                            <template v-slot:[`item.clicks`]="{ item }">
                                {{item.selectable.clicks ? item.selectable.clicks : 0}}
                            </template>
                            <template v-slot:[`item.conversions`]="{ item }">
                                {{item.selectable.conversions ? item.selectable.conversions : 0}}
                            </template>
                            <template v-slot:[`item.epc`]="{ item }">
                                {{item.selectable.epc ? item.selectable.epc : 0}}
                            </template>
                            <template v-slot:[`item.conversions_rate`]="{ item }">
                                {{item.selectable.conversions_rate ? item.selectable.conversions_rate : 0}}
                            </template>
                            <template v-slot:[`item.total_revenue`]="{ item }">
                                {{$filters.toCurrency(item.selectable.total_revenue)}}
                            </template>
                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td>{{ sumClicks ? sumClicks : '-' }}</td>
                                    <td>{{ sumConversions ? sumConversions : '-' }}</td>
                                    <td></td>
                                    <td></td>
                                    <td>{{$filters.toCurrency(sumRevenue)}}</td>
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
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import _ from 'lodash';
import axios from '@axios';
import mixin from '../../mixin.js';
export default {
    props: ['reports', 'type'],
    mixins: [mixin],
    components: {
        DateRangePicker
    },
    watch: {
        options: {
            handler() {
                this.fetchArchivedNetworksReportMetrics();
            },
        },
        deep: true,
    },
    filters: {
        dateCell (value) {
            let dt = new Date(value)

            return dt.getDate()
        },
        date (val) {
            return val ? val.toDateString() : ''
        },
    },
    data() {
        return {
            message: {},
            showLoader: false,
            reportsData: [],
            search: '',
            networkMetrics: [],
            currentItemsTable: [],
            singleExpand: true,
            expanded: [],
            page: 1,
            itemsPerPage: -1,
            options: {},
            isSortable: true,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumRevenue() {
            const key = 'total_revenue';
            let data = _.cloneDeep(this.currentItemsTable);
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumClicks() {
            const key = 'clicks';
            let data = _.cloneDeep(this.currentItemsTable);
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumConversions() {
            const key = 'conversions';
            let data = _.cloneDeep(this.currentItemsTable);
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        networksheaders: function() {
            return [
                { title: 'Network Name', align: 'start', sortable: this.isSortable, key: 'network_name' },
                { title: 'Email', align: 'start', sortable: this.isSortable, key: 'email' },
                { title: 'Clicks', align: 'start', sortable: this.isSortable, key: 'clicks' },
                { title: 'Conversions', align: 'start', sortable: this.isSortable, key: 'conversions' },
                { title: 'EPC', align: 'start', sortable: this.isSortable, key: 'epc' },
                { title: 'Conversion Rate', align: 'start', sortable: this.isSortable, key: 'conversions_rate' },
                { title: 'Revenue',  key: 'total_revenue', sortable: this.isSortable, },
            ]
        }
    },
    mounted() {
        this.fetchArchivedNetworksReportMetrics();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.fetchArchivedNetworksReportMetrics();
        },
        // fetch network archived networks report
        fetchArchivedNetworksReportMetrics() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/archivedReports/fetchArchivedNetworksReportMetrics';
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
                    this.networkMetrics = response.data.data;
                    this.networkMetrics.map((data) => {
                        data.revenue = this.$filters.toCurrency(data.total_revenue);
                    });
                    const currentItems = {
                        itemsPerPage: -1
                    };
                    this.currentItems(currentItems);
                    if(this.networkMetrics.length > 0){
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
                const data = this.networkMetrics.filter((val) => {
                    return val.network_name && val.network_name.toLowerCase().includes(this.search.toLowerCase()) || 
                           val.email && val.email.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.clicks && val.clicks.toString().includes(this.search.toLowerCase()) ||
                           val.conversions && val.conversions.toString().includes(this.search.toLowerCase()) ||
                           val.epc && val.epc.toString().includes(this.search.toLowerCase()) ||
                           val.conversions_rate && val.conversions_rate.toString().includes(this.search.toLowerCase()) ||
                           val.total_revenue && val.total_revenue.toString().includes(this.search.toLowerCase())
                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.networkMetrics;
            }
            else {
                const data = this.networkMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
        },
    }
}
</script>

<style scoped>

</style>

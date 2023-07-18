<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <!-- <h6 class="h2 text-white d-block mb-0">User Roles</h6> -->
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Archived Reports CPA Networks</li>
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
                <div class=" col ">
                    <div class="card">
                        <div class="card-body">
                            <v-app>
                                <v-card>
                                    <v-card-title>
                                        <v-spacer></v-spacer>
                                        <v-row>
                                            <v-col class="d-flex" cols="12" sm="4"></v-col>
                                            <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                            </v-col>
                                            <v-col class="d-flex search_width" cols="12" sm="4">
                                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-card-title>
                                    <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networksheaders" :items="networkMetrics" :search="search" :single-expand="singleExpand" class="elevation-1 table-expand" :itemsPerPage="itemsPerPage">
                                        <template v-slot:tbody v-if="networkMetrics.length > 0">
                                            <tr class="total_table">
                                                <td>Totals</td>
                                                <td>-</td>
                                                <td>{{ sumClicks }}</td>
                                                <td>{{ sumConversions }}</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>{{$filters.toCurrency(sumRevenue)}}</td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-app>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import _ from 'lodash';
export default {
    props: ['reports', 'type'],
    components: {
        DateRangePicker
    },
    //this one will populate new data set when user changes current page.
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
            showLoader: false,
            reportsData: [],
            search: '',
            networkMetrics: [],
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
            let data = _.cloneDeep(this.networkMetrics);
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumClicks() {
            const key = 'clicks';
            let data = _.cloneDeep(this.networkMetrics);
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumConversions() {
            const key = 'conversions';
            let data = _.cloneDeep(this.networkMetrics);
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
                { title: 'Revenue',  key: 'revenue', sortable: this.isSortable, },
            ]
        }
    },
    mounted() {
        this.fetchArchivedNetworksReportMetrics();
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
            this.axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.networkMetrics = response.data.data;
                    this.networkMetrics.map((data) => {
                        data.revenue = this.$filters.toCurrency(data.total_revenue);
                    });
                    if(this.networkMetrics.length > 0){
                        setTimeout(() => {
                            this.resizableGrid(document.getElementsByTagName('table')[0]);
                        }, 1000)
                    }
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // made resizable table
        resizableGrid(table) {
            const self = this;
            var row = table.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
            if (!cols) return;

            table.style.overflow = 'hidden';

            var tableHeight = table.offsetHeight;

            for (var i=0;i<cols.length;i++){
                var div = createDiv(tableHeight, i);
                cols[i].appendChild(div);
                cols[i].style.position = 'relative';
                setListeners(div, table);
            }

            function setListeners(div, table){
                var pageX,curCol,nxtCol,curColWidth,nxtColWidth,columnId,currentEl;
                let activeBar = false;

                div.addEventListener('mousedown', function (e) {
                    activeBar = true;
                    currentEl = e.target;
                    curCol = e.target.parentElement;
                    nxtCol = curCol.nextElementSibling;
                    pageX = e.pageX;
                    columnId = e.target.id.split('-')[1];

                    var padding = paddingDiff(curCol);

                    curColWidth = curCol.offsetWidth - padding;
                    if (nxtCol)
                    nxtColWidth = nxtCol.offsetWidth - padding;
                });

                div.addEventListener('mouseover', function (e) {
                    e.target.style.borderRight = '2px solid #0000ff';
                })

                div.addEventListener('mouseout', function (e) {
                    if(activeBar) return;
                    e.target.style.borderRight = '';
                     setTimeout(() => {
                        self.isSortable = true;
                    }, 100);
                })

                document.addEventListener('mousemove', function (e) {
                    if (curCol) {
                        self.isSortable = false;
                        var diffX = e.pageX - pageX;

                        if (nxtCol)
                        window.$(`tbody tr td:nth-child(${columnId})`).each(function () {
                            window.$(this).css('width', (curColWidth + diffX)+'px');
                            window.$(this).find('div').css('width', (curColWidth + diffX)+'px');

                            window.$(this).next().css('width', (nxtColWidth - (diffX))+'px');
                            window.$(this).next().find('div').css('width', (nxtColWidth - (diffX))+'px');
                        });
                        window.$('div[id^="col-"]').css('height', table.offsetHeight+'px')
                    }
                });

                document.addEventListener('mouseup', function () {
                    curCol = undefined;
                    nxtCol = undefined;
                    pageX = undefined;
                    nxtColWidth = undefined;
                    curColWidth = undefined;
                    activeBar = false;
                    if(currentEl) {
                        currentEl.style.borderRight = '';
                        setTimeout(() => {
                            self.isSortable = true;
                        }, 100);
                    }
                });
            }

            function createDiv(height, i){
                var div = document.createElement('div');
                div.setAttribute('id', `col-${i+1}`);
                div.style.top = 0;
                div.style.right = 0;
                div.style.width = '5px';
                div.style.position = 'absolute';
                div.style.cursor = 'col-resize';
                div.style.userSelect = 'none';
                div.style.height = height + 'px';
                return div;
            }

            function paddingDiff(col){
                if (getStyleVal(col,'box-sizing') == 'border-box'){
                    return 0;
                }

                var padLeft = getStyleVal(col,'padding-left');
                var padRight = getStyleVal(col,'padding-right');
                return (parseInt(padLeft) + parseInt(padRight));
            }

            function getStyleVal(elm,css){
                return (window.getComputedStyle(elm, null).getPropertyValue(css))
            }
        },
    }
}
</script>

<style scoped>

</style>

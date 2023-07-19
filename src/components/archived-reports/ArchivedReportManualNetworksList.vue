<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header content -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Archived Reports Manual Network</li>
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
                    <!-- page content -->
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="4">
                                                        <v-select solo :items="networkNameFilter" label="Network Name Filter" item-value="key" :clearable="true" v-model="networkName" @update:modelValue="getManualNetworksReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                                    </v-col>
                                                    <v-col class="d-flex search_width" cols="12" sm="4">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" class="elevation-1 table-expand">
                                                <template v-slot:item="{ item }">
                                                    <tr>
                                                        <td>{{item.selectable.manual_network.network}}</td>
                                                        <td>{{$filters.toCurrency(item.selectable.amount)}}</td>
                                                    </tr>
                                                </template>
                                                <template v-slot:tbody v-if="dataMetrics.length > 0">
                                                    <tr class="total_table">
                                                        <td>Totals</td>
                                                        <td>{{ $filters.toCurrency(sumField) }}</td>
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
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            search: '',
            itemsPerPage: -1,
            networkNameFilter: [],
            networkName: null,
            isSortable: true,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        headers: function() {
            return [
                { title: 'Network Name', key: 'network', sortable: this.isSortable },
                { title: 'Amount', key: 'amount', sortable: this.isSortable },
            ]
        }
    },
    mounted() {
        this.getManualNetworksReport();
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getManualNetworksReport();
        },
        // get data of manual network reports
        getManualNetworksReport() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/archivedReports/getManualNetworksReport';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.networkName) {
                queryString.set('network_id', this.networkName);
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
                    this.dataMetrics = response.data.data;
                    if(response) {
                        response.data.allNetworks.map((data) => {
                            this.networkNameFilter.push({
                                title : data.network,
                                key : data.id
                            });
                        });
                    }
                    if(this.dataMetrics.length > 0){
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
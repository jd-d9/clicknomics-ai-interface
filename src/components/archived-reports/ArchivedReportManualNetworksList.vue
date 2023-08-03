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
                        <span>Archived Reports Manual Network</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Archived Reports Manual Network List
                            <v-spacer></v-spacer>
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                <v-select variant="outlined" :items="networkNameFilter" placeholder="Network Name Filter" item-value="key" :clearable="true" v-model="networkName" @update:modelValue="getManualNetworksReport"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" >
                            <template v-slot:[`item.network`]="{ item }">
                                {{item.selectable.network ? item.selectable.network : '-'}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                {{$filters.toCurrency(item.selectable.amount)}}
                            </template>
                            <template v-slot:tbody v-if="dataMetrics.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td>{{ $filters.toCurrency(sumField) }}</td>
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
import axios from '@axios';
export default {
    components: {
        DateRangePicker
    },
    data() {
        return {
            message: {},
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.dataMetrics = response.data.data;
                    if(response) {
                        this.networkNameFilter = [];
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

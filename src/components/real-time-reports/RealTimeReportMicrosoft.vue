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
                        <span>Microsoft Real Time Reports </span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Microsoft Real Time Reports List
                        </v-card-title>
                        <!-- data table component -->
                        <div>
                            <v-data-table class="table-hover-class mt-4"  :itemsPerPage="itemsPerPage" :page="page" :server-items-length="totalPageCount" :pageCount="numberOfPages" v-model:options="options" :headers="microsoftHeaders" :items="microsoftCampaignMetrics" v-model:expanded="expanded" show-expand item-value="name">
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
                                                            DailyBudget 
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
                                                        {{row.name ? row.name : '-'}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{(row.dailyBudget ? $filters.toCurrency(row.dailyBudget) : '-')}}
                                                    </td>
                                                    <td class="v-data-table__td">
                                                        {{row.status ? row.status : '-'}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td class="exapanded bg-light-green-lighten-5 text-center" :colspan="columns.length" style="padding:10px" v-else>
                                        No Data Found
                                    </td>
                                </template>
                            </v-data-table>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            reportType:'',
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
            // microsoft
            microsoftCampaignMetrics:[],
            microsoftHeaders: [
                { title: '', key: 'data-table-expand' },
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    watch:{
        options: {
            handler() {
                this.getMicrosoftAdsMetrics();
            },
        },
        deep: true,
    },
    methods: {
        getMicrosoftAdsMetrics() {
            this.microsoftCampaignMetrics = [];
            this.showLoader = true;
            let formData = new FormData();
            let { sortBy, sortDesc, page, itemsPerPage } = this.options;
            // let pageNumber = page;
            if(!page && !itemsPerPage){
                page = this.page
                itemsPerPage = this.itemsPerPage
            }
            // if (sortBy && sortBy.length === 1 && sortDesc.length === 1) {
            //     pageNumber = this.page;
            // }
            formData.append('reportRange', 'Today');

            this.axios.get(this.$api + `/realTimeReport?size=${itemsPerPage}&page=${page}&reportRange=Today`,{
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

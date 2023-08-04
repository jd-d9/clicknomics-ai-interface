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
                        <span>Archived Reports Microsoft</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Archived Reports Microsoft List
                            <v-spacer></v-spacer>
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :headers="microsoftHeaders" :items="microsoftCampaignMetrics" :search="search" :single-expand="singleExpand" v-model:expanded="microsoftExpanded" item-value="managerAccountName" show-expand :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.management_system`]="{item}">
                                <div class="text-ellipsis" style="width:180px">
                                    <router-link to="" @click="showManagementTypeModal(item.selectable.id, item.selectable.management_type, item.selectable.management_system)">{{item.selectable.management_system ? item.selectable.management_system : '-' }}</router-link>
                                </div>
                            </template>
                            <template v-slot:expanded-row="{ columns, item }">
                                <td class="exapanded bg-light-green-lighten-5" :colspan="columns.length" style="padding:10px" v-if="item.selectable.children.length > 0">
                                    <table class="table align-items-center" v-if="microsoftCampaignMetrics.length > 0">
                                        <thead class="thead-light">
                                            <tr>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Campaign Name</div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Clicks </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Ctr </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Spend (USD Currency) </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Spend (Account Currency) </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Average Cpc </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Impressions </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Absolute Top Impression Rate Percent </div>
                                                </th>
                                                <th class="v-data-table__td" scope="col">
                                                    <div class="v-data-table-header__content">Campaign Status</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="list">
                                            <tr v-for="(row , index) in item.selectable.children" :key="index">
                                                <td class="v-data-table__td">
                                                    {{row.CampaignName ? row.CampaignName : '-'}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumberWithoutDecimal(row.clicks ? row.clicks : 0)}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{parseFloat(row.ctr ? row.ctr : 0).toFixed(2)}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toCurrency(row.spend ? row.spend : 0)}}
                                                </td>
                                                <td v-if="row.currency && row.currency !='USD'">
                                                    {{`${row.currency} - `+parseFloat(row.spendConverted ? row.spendConverted :row.spend).toFixed(2) }}
                                                </td>
                                                <td v-else>
                                                    {{$filters.toCurrency(row.spend ? row.spend : 0)}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{parseFloat(row.averageCpc ? row.averageCpc : 0).toFixed(2)}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumberWithoutDecimal(row.impressions ? row.impressions : 0)}}
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{$filters.toNumber(row.absoluteTopImpressionRatePercent ? row.absoluteTopImpressionRatePercent : 0)}}%
                                                </td>
                                                <td class="v-data-table__td">
                                                    {{row.Status ? row.Status : '-'}}
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
                                    <td></td>
                                    <td></td>
                                    <td>{{$filters.toNumberWithoutDecimal(sumMicrosoftClick)}}</td>
                                    <td>{{$filters.toNumber(sumMicrosoftCtr)}}</td>
                                    <td>{{$filters.toCurrency(sumMicrosoftSpend)}}</td>
                                    <td></td>
                                    <td>{{$filters.toNumber(sumMicrosoftAverageCpc)}}</td>
                                    <td>{{$filters.toNumberWithoutDecimal(sumMicrosoftImpressions)}}</td>
                                    <td>{{$filters.toNumber(sumMicrosoftAbsoluteTopImpressionPercentage)}}%</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Modal Management System Add -->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Management System Type</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div> 

                    <Form @submit="addManagementType" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Select Management Type</label>
                                    <Field name="Type" v-model="managementModal.type">
                                        <v-select @update:modelValue="updateData(managementModal.type)" name="Type" :class="{'form-control autocomplete': true , 'border-red-600':errors.Type }" :items="managementSystemType" v-model="managementModal.type" item-value="key"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Type">Management type is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Management System</label>
                                    <Field name="System" v-model="managementModal.management_system">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.System }" name="System" :items="managementSystemList" v-model="managementModal.management_system"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.System">Management system is a required field</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import * as yup from 'yup';
import { Field, Form } from 'vee-validate';
import axios from '@axios';
// Charts
import * as chartConfigs from '../common/Charts/config';
// import LineChart from '../common/Charts/LineChart';
export default {
    // props: ['reportType', 'datacenter', 'residential', 'multilogin', 'localsystem'],
    components: {
        // LineChart,
        DateRangePicker,
        Field, 
        Form, 
    },
    data() {
        return {
            message: {},
            showLoader: false,
            microsoftCampaignMetrics: [],
            currentItemsTable: [],
            search: '',
            microsoftReportRange: 'Last One Year',
            singleExpand: true,
            microsoftExpanded: [],
            bigLineChart: {
                allData: [],
                dataLabel: '',
                dataSetsLabel: '',
                activeIndex: 0,
                chartData: {
                    datasets: [],
                    labels: [],
                },
                extraOptions: chartConfigs.blueChartOptions,
            },
            itemsPerPage: -1,
            managementSystemType: [
                {
                    title: 'Local',
                    key: 'local'
                },
                {
                    title: 'Data Center VPS',
                    key: 'dataCenterVps'
                },
                {
                    title: 'Residential VPS',
                    key: 'residentialVps'
                },
                {
                    title: 'Multilogin',
                    key: 'multilogin'
                },
            ],
            managementModal: {
                id: '',
                type: '',
                management_system: ''
            },
            managementSystemList: [],
            isSortable: true,
            backendErrorMessage: '',
            multipleErrors: [],
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        schema() {
            return yup.object({
                Type: yup.string().required(),
                System: yup.string().required(),
            });
        },
        sumMicrosoftClick() {
            const key = 'clicks';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.clicks = parseFloat(Number(item.clicks.replace(/_/g,'')));
                return item;
            });
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        sumMicrosoftCtr() {
            const key = 'ctr';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.ctr = parseFloat(Number(item.ctr.replace(/_/g,'')));
                return item;
            });
            return (data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)) / this.microsoftCampaignMetrics.length;
        },
        sumMicrosoftSpend() {
            const key = 'spend';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                let num = item.spend.substring(1);
                num = num.replace(/_/g,'');
                item.spend = parseFloat(num);
                return item;
            });
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        },
        sumMicrosoftAverageCpc() {
            const key = 'averageCpc';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.averageCpc = parseFloat(Number(item.averageCpc.replace(/_/g,'')));
                return item;
            });
            return (data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)) / this.microsoftCampaignMetrics.length;
        },
        sumMicrosoftImpressions() {
            const key = 'impressions';
            let data = _.cloneDeep(this.currentItemsTable);
            data.map((item) => {
                item.impressions = parseFloat(Number(item.impressions.replace(/_/g,'')));
                return item;
            });
            return data.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        },
        sumMicrosoftAbsoluteTopImpressionPercentage() {
            const key = 'absoluteTopImpressionRatePercent';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        },
        microsoftHeaders() {
            return [
                { title: '', key: 'data-table-expand' },
                { title: 'Manager Account Name', align: 'start', sortable: this.isSortable, key: 'managerAccountName' },
                { title: 'Account Name',  key: 'name', sortable: this.isSortable },
                { title: 'Management System',  key: 'management_system', sortable: this.isSortable },
                { title: 'Clicks', key: 'clicks', sortable: this.isSortable },
                { title: 'Click Through Rate', key: 'ctr', sortable: this.isSortable },
                { title: 'Spend (USD Currency)', key: 'spend', sortable: this.isSortable },
                { title: 'Spend (Account Currency)', key: 'spendConverted', sortable: this.isSortable },
                { title: 'Cost Per Click', key: 'averageCpc', sortable: this.isSortable },
                { title: 'Impressions', key: 'impressions', sortable: this.isSortable },
                { title: 'Impressions (Top)%', key: 'absoluteTopImpressionRatePercent', sortable: this.isSortable },
            ]
        }
    },
    mounted() {
        this.fetchMicrosoftAdsMetrics();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.fetchMicrosoftAdsMetrics();
        },
        // fetch microsoft data
        fetchMicrosoftAdsMetrics() {
            this.microsoftCampaignMetrics = [];
            this.showLoader = true;
            setTimeout(() => {
                const queryString = new URLSearchParams();
                const ajaxUrl = this.$api + '/archivedReports/fetchMicrosoftReportMetrics';
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
                                t.clicks = _.sumBy(t.report, function(o) { return o.Clicks ? Number(o.Clicks) : 0})
                                t.ctr = _.sumBy(t.report, function(o) { return o.Ctr ? parseFloat(o.Ctr) : 0})
                                t.impressions = _.sumBy(t.report, function(o) { return o.Impressions ? Number(o.Impressions) : 0})
                                t.spend = _.sumBy(t.report, function(o) { return o.Spend ? Number(o.Spend) : 0})
                                t.averageCpc =  _.sumBy(t.report, function(o) { return o.AverageCpc ? Number(o.AverageCpc) : 0})
                                t.absoluteTopImpressionRatePercent = t.report.length > 0 ? _.meanBy( t.report, function(o) { return parseFloat(o.AbsoluteTopImpressionRatePercent) }) : 0
                                t.averageCpcCount = _.filter(t.report, function(o) { if (o.AverageCpc > 0) return o }).length;
                                if(t.spend != 0 && res.currency_exchange_rate && res.currency_exchange_rate != null){
                                    t.spendConverted =  t.spend / res.currency_exchange_rate;
                                }
                            });
                            return res;
                        });
                        let dataTemp = [];
                        responseData.map((data) => {
                            data.campaign.map((campaign) => {
                                campaign.averageCpc =  campaign.averageCpcCount > 0 ? parseFloat((campaign.averageCpc / campaign.averageCpcCount)).toFixed(2) : 0;
                                campaign;
                                campaign.currency = data.currency;
                            });
                            dataTemp.push(data);
                        });
                        const deep = _.cloneDeep(dataTemp);
                        deep.map((data) => {
                            this.microsoftCampaignMetrics.push({
                                name: data.name,
                                managerAccountName: data.parentCustomerName,
                                management_type: data.management_type,
                                management_system: data.management_system,
                                id: data.id,
                                clicks: this.$filters.toNumberWithoutDecimal(_.sumBy(data.campaign, function(o) { return o.clicks ? Number(o.clicks) : 0})),
                                ctr: this.$filters.toNumber(_.sumBy(data.campaign, function(o) { return o.ctr ? Number(o.ctr) : 0})),
                                impressions: this.$filters.toNumberWithoutDecimal(_.sumBy(data.campaign, function(o) { return o.impressions ? Number((o.impressions)) : 0})),
                                spend: this.$filters.toCurrency(_.sumBy(data.campaign, function(o) { return o.spend ? Number(o.spend) : 0})),
                                spendConverted: _.sumBy(data.campaign, function(o) { return o.spendConverted ? Number(o.spendConverted) : 0}) != 0 ? `${data.currency} -`+parseFloat(_.sumBy(data.campaign, function(o) { return o.spendConverted ? Number(o.spendConverted) : 0})).toFixed(2) : (data.currency =="USD" || !data.currency ? this.$filters.toCurrency(_.sumBy(data.campaign, function(o) { return o.spend ? Number(o.spend) : 0})) : `${data.currency} - `+parseFloat(_.sumBy(data.campaign, function(o) { return o.spend ? Number(o.spend) : 0})).toFixed(2)),
                                averageCpc: this.$filters.toNumber(_.sumBy(data.campaign, function(o) { return o.averageCpc ? Number(o.averageCpc) : 0})) ,
                                absoluteTopImpressionRatePercent: this.$filters.toNumberWithPercentage(_.sumBy(data.campaign, function(o) { return o.absoluteTopImpressionRatePercent ? Number(o.absoluteTopImpressionRatePercent) : 0}) ),
                                children: data.campaign,
                                currency: data.currency,
                                currency_conversion_check: data.currency_conversion_check,
                            });
                        });
                        const currentItems = {
                            itemsPerPage: -1
                        };
                        this.currentItems(currentItems);
                        if(this.microsoftCampaignMetrics.length > 0){
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
            },100)
        },
        // add management type
        addManagementType() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.managementModal.id);
            formData.append('type', this.managementModal.type);
            formData.append('management_system', this.managementModal.management_system);
            axios.post(this.$api + '/archivedReports/addManagementTypeToMicrosoftAccount', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.fetchMicrosoftAdsMetrics();
                    this.closeModal();
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    const index = this.microsoftCampaignMetrics.findIndex(item => item.id === this.managementModal.id)
                    this.microsoftCampaignMetrics[index].management_type = this.managementModal.type;
                    this.microsoftCampaignMetrics[index].management_system = this.managementModal.management_system;
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
                    this.backendErrorMessage = error.response.data.message;
                }
                if(error.response.data.error) {
                    this.backendErrorMessage = error.response.data.error;
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.backendErrorMessage = error.response.data.errors[0];
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.multipleErrors = error.response.data.errors;
                    }
                }
                this.showLoader = false;
            });
        },
        // show management type modal
        showManagementTypeModal(id, type, management_system) {
            this.managementModal.id = id;
            this.managementModal.type = type;
            this.managementModal.management_system = management_system;
            this.updateData();
            this.openModal();
        },
        // update data
        updateData() {
            setTimeout(() => {
                this.showLoader = true;
                const queryString = new URLSearchParams();
                const ajaxUrl = this.$api + '/archivedReports/getManagementSystem';
                if(this.managementModal.type) {
                    if(this.managementModal.type == 'Local') {
                        queryString.set('type', 'local');
                    }else {
                        queryString.set('type', this.managementModal.type);
                    }
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
                        const getData = response.data.data;
                        this.managementSystemList = [];
                        this.managementSystemList = getData.map((val) => {
                            if(this.managementModal.type.toLowerCase() == 'local') {
                                return {title: val.type.concat('-', val.country.name).concat('-', val.city)};
                            }
                            if(this.managementModal.type.toLowerCase() == 'multilogin') {
                                return {title: val.profile_name};
                            }else {
                                return {title: val.company};
                            }
                        })
                        this.showLoader = false;
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
            }, 200)
        },
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.microsoftCampaignMetrics.filter((val) => {
                    return val.managerAccountName && val.managerAccountName.toLowerCase().includes(this.search.toLowerCase()) || 
                           val.name && val.name.toLowerCase().includes(this.search.toLowerCase()) || 
                           val.management_system && val.management_system.toString().includes(this.search.toLowerCase()) ||
                           val.clicks && val.clicks.toString().includes(this.search.toLowerCase()) ||
                           val.ctr && val.ctr.toString().includes(this.search.toLowerCase()) ||
                           val.spend && val.spend.toString().includes(this.search.toLowerCase()) ||
                           val.spendConverted && val.spendConverted.toString().includes(this.search.toLowerCase()) ||
                           val.averageCpc && val.averageCpc.toString().includes(this.search.toLowerCase()) ||
                           val.impressions && val.impressions.toString().includes(this.search.toLowerCase()) ||
                           val.absoluteTopImpressionRatePercent && val.absoluteTopImpressionRatePercent.toString().includes(this.search.toLowerCase())

                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.microsoftCampaignMetrics;
            }
            else {
                const data = this.microsoftCampaignMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
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
.add-side-borders tbody td, .add-side-borders thead th{
    border-left: 1px solid #dee2e6 !important;
    border-right: 1px solid #dee2e6 !important;
}
</style>

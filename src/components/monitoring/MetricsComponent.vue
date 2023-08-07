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
                        <span>Networks Campaign Metrics</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Networks Campaign Metrics List
                            <v-spacer></v-spacer>
                            <date-range-picker class="date_picker" :value="selectedRange"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.network_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.network_name}}
                                </div>
                            </template>
                            <template v-slot:[`item.affiliate_id`]="{ item }">
                                {{item.selectable.affiliate_id}}
                            </template>
                            <template v-slot:[`item.campaign_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.campaign_name}}
                                </div>
                            </template>
                            <template v-slot:[`item.conversion_rate`]="{ item }">
                                {{item.selectable.conversion_rate}}
                            </template>
                            <template v-slot:[`item.epc`]="{ item }">
                                {{item.selectable.epc}}
                            </template>
                            <template v-slot:[`item.network_type`]="{ item }">
                                {{item.selectable.network_type}}
                            </template>
                            <template v-slot:[`item.monitor_date`]="{ item }">
                                {{item.selectable.monitor_date}}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-'}}
                            </template>
                            <template v-slot:[`item.action`]>    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editMetricsModal">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>

        <div class="modal fade" id="MetricsModal" tabindex="-1" role="dialog" aria-labelledby="MetricsModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Notes</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeMetricsModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <textarea type="text" id="input-username" name="Email" :class="{'form-control': true}" v-model="item.notes" rows="4" placeholder="Notes"></textarea>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeMetricsModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from '../common/DateRangePicker.vue';

export default {
    components: {
        DateRangePicker
    },
    data() {
        return {
            selectedRange: `Mon Jan 02 2023 - Sun Feb 05 2023`,
            showLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'id'},
                { title: 'Network Name', key: 'network_name' },
                { title: 'Login ID', key: 'affiliate_id' },
                { title: 'Camapign Name', key: 'campaign_name' },
                { title: 'Conversion Rate', key: 'conversion_rate' },
                { title: 'EPC', key: 'epc' },
                { title: 'Platform Type', key: 'network_type' },
                { title: 'Monitor Date', key: 'monitor_date' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action' },
            ],
            urlList: [
                {
                    id:'298',
                    network_name:'GuruMedia',
                    affiliate_id:'301592',
                    campaign_name:'Keto Maxx - Nutra / Diet - SS - [US, CA]',
                    conversion_rate:'10.00',
                    epc:'14.60',
                    network_type:'Everflow',
                    monitor_date:'2022-05-29',
                    notes:'-',
                    action:'',
                }
            ],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            item: {
                id:'',
                notes: '',
            },
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        editMetricsModal() {
            window.$('#MetricsModal').modal('show');
        },
        closeMetricsModal() {
            window.$('#MetricsModal').modal('hide');
        },
    }
}
</script>

<style scoped>
</style>
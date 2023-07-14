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
                        <span>Variable Monthly Cost List</span>
                        <v-spacer />
                        <v-btn @click.prevent="this.$router.push('/accounting/variableMonthlyCost/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Variable Monthly Cost
                            <v-spacer></v-spacer>
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                            <div class="col-3 pr-1">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchPayments"/>
                            </div>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.date`]="{ item }">
                                {{item.selectable.date}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                ${{item.selectable.amount}}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">  
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="this.$router.push('/accounting/variableMonthlyCost/' + item.selectable.id + '/edit')" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn> 
                            </template>

                            <template v-slot:tbody v-if="dataMetrics.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td class="text-center">${{ sumField }}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                        <form>
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="file">{{file[0].name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="handleUpload($event)" title="Choose CSV"  class="inputFile form-control-file" type="file" name="chooseFile"  required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-import">Import</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" data-dismiss="modal">Close</v-btn>
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
import moment from 'moment';
export default {
    components: {
        DateRangePicker,
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
            permissions: {},
            search: '',
            headers: [
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Amount', key: 'amount', align: 'center' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            // dateRange: {startDate, endDate},
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    mounted() {
        this.getVariablePaymentList();
    },
    methods: {
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getVariablePaymentList();
        },
        // search payment from table
        searchPayments() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.notes && val.notes.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get variable payment list
        getVariablePaymentList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/variableCost';
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
                    const allData = response.data;
                    this.dataMetrics = allData.data.data;
                    this.dataMetricsFilter = allData.data.data;
                    this.permissions = allData.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // delete variable monthly cost
        deleteData(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/accounting/variableCost/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Variable monthly cost deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getVariablePaymentList();
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        }
    }
}
</script>
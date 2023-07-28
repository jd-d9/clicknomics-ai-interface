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
                        <span>IPM Chase Ink Activity</span>
                        <v-spacer />

                        <div>
                            <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn to="/payment_methods/ipm-chase-ink-card/activity/create" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>      
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            IPM Chase Ink Activity List
                        </v-card-title>
                        <!-- tab panel title div -->
                        <div class="mt-4">
                            <v-tabs v-model="tabplumactivity" fixed-tabs bg-color="green-lighten-4" class="mb-3">
                                <v-tab value="activity" class="font-weight-bold" color="green-darken-4">Activity</v-tab>
                                <v-tab value="reports" class="font-weight-bold">Reports</v-tab>
                            </v-tabs>

                            <v-window v-model="tabplumactivity">
                                <v-window-item value="activity">
                                    <v-row class="d-flex align-center justify-end">
                                        <v-col class="font-medium font-weight-normal pr-0 text-right">
                                            <v-btn @click="deleteSelected" class="ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                                Remove Selected
                                            </v-btn>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal pr-0">
                                            <date-range-picker class="date_picker pt-2" :value="selectedRange" ></date-range-picker>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="cardMemberFilter" clearable variant="outlined" placeholder="Card Member Filter" @change="getRmAmexPlumActivityReport" v-model="cardMemberValue"></v-select>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="descriptionFilter" clearable variant="outlined" placeholder="Description Filter" @change="getRmAmexPlumActivityReport" v-model="descriptionValue"></v-select>
                                        </v-col>                                            
                                        <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                            <v-select :items="transactionTypeFilter" clearable variant="outlined" placeholder="Transaction Type Filter" @change="getRmAmexPlumActivityReport" v-model="transactionTypeValue"></v-select>
                                        </v-col>
                                        <v-col class="font-medium font-weight-normal">
                                            <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                        </v-col>
                                    </v-row> 

                                    <!-- data table component -->
                                    <v-data-table class="table-hover-class mt-4" show-select :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                        <template v-slot:[`item.date`]="{ item }">
                                            {{ item.selectable.date }}
                                        </template>
                                        <template v-slot:[`item.description`]="{ item }">
                                            {{ item.selectable.description }}
                                        </template>
                                        <template v-slot:[`item.card_member`]="{ item }">
                                            {{ item.selectable.card_member }}
                                        </template>
                                        <template v-slot:[`item.account`]="{ item }">
                                            {{item.selectable.account}}
                                        </template>
                                        <template v-slot:[`item.amount`]="{ item }">
                                            {{ item.selectable.amount }}
                                        </template>
                                        <template v-slot:[`item.transaction_type`]="{ item }">
                                            {{ item.selectable.transaction_type }}
                                        </template>
                                        <template v-slot:[`item.action`]>    
                                            <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon>
                                                <v-icon color="green-darken-2">
                                                    mdi-pencil
                                                </v-icon>
                                                <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                            </v-btn>

                                            <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon>
                                                <v-icon color="red-darken-4">
                                                    mdi-delete-empty
                                                </v-icon>
                                                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                            </v-btn>                                                            
                                        </template>
                                        <template v-slot:tbody v-if="dataMetrics.length > 0">
                                            <tr class="total_table table-body-back bg-blue-darken-2">
                                                <td></td>
                                                <td>Totals</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td class="text-center">$123.00</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-window-item>

                                <v-window-item value="reports">
                                    <v-row class="d-flex align-center justify-end ma-0">
                                        <v-spacer />
                                        <date-range-picker class="date_picker pt-2" :value="selectedRange" ></date-range-picker>
                                        <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                            <v-select v-model="selectedtTransactionType" :items="items" chips clearable variant="outlined" placeholder="Transaction Type Filter" @change="filterRmAmexPlumActivity"></v-select>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="6" sm="6" md="4" lg="3">
                                            <v-card class="card_design bg-blue-lighten-4">
                                                <v-card-title>
                                                    <p class="text-subtitle-2 font-weight-bold">IMRAN EPGX</p>
                                                </v-card-title>
                                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                                    $0.00
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="4" lg="3">
                                            <v-card class="card_design bg-green-lighten-4">
                                                <v-card-title>
                                                    <p class="text-subtitle-2 font-weight-bold">Weqqweqwe</p>
                                                </v-card-title>
                                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-green-darken-1">
                                                    $123.00
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="4" lg="3">
                                            <v-card class="card_design bg-blue-lighten-4">
                                                <v-card-title>
                                                    <p class="text-subtitle-2 font-weight-bold">IMRAN AMEXD</p>
                                                </v-card-title>
                                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                                    $0.00
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="4" lg="3">
                                            <v-card class="card_design bg-blue-lighten-4">
                                                <v-card-title>
                                                    <p class="text-subtitle-2 font-weight-bold">AIMEE ANDERSON</p>
                                                </v-card-title>
                                                <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                                    $0.00
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                            </v-window>
                        </div>
                    </v-card>
                </v-col>
                <!--  v-if="permissions.view != '1' && !showLoader" -->
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>

        <!-- import csv -->
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Import Team Member Payments List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>                    
                    <form @submit="importCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input name="Choosecsv" @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file"  required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-import">Import</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeImportCsvModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from '../../common/DateRangePicker.vue';

export default {
    components: {
        DateRangePicker,
    },
    data() {
        return{
            dataMetrics: [
                {
                    date: '2023-07-06',
                    description: 'sdsasaj ekr ajwnessmndfn',
                    card_member: 'weqqweqwe',
                    account: '11539',
                    amount:'$500.00',
                    transaction_type: 'Credit',
                    action: '',
                },
                {
                    date: '2023-07-06',
                    description: 'ajwnessmndfn',
                    card_member: 'sdsdsd',
                    account: '1165639',
                    amount:'$123.00',
                    transaction_type: 'Debit',
                    action: '',
                },
            ],
            search: '',
            headers: [
                { title: 'Date', sortable: false, key: 'date' },
                { title: 'Description', key: 'description' },
                { title: 'Card Member', key: 'card_member' },
                { title: 'Account ', key: 'account', align: 'center' },
                { title: 'Amount', key: 'amount', align: 'center' },
                { title: 'Transaction Type', key: 'transaction_type', align: 'center' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            selected: [],
            itemsCardName: [],
            valueCardName: '',
            tabplumactivity: 'activity',
            selectedRange: `Sat Jul 01 2023 - Mon Jul 31 2023`,
        }
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        createActivity() {
            window.$('#createUpdateData').modal('show');
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
}
</script>
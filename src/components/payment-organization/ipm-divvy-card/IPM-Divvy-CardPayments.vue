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
                        <span>IPM Divvy Card Payments</span>
                        <v-spacer />

                        <div>
                            <v-btn class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>

                            <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn to="/payment_methods/ipm-divvy-card/create" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>      
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            IPM Divvy Card Payments List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                <v-select clearable variant="outlined" placeholder="Name Custom Filter" :items="itemsCardName" v-model="valueCardName" @change="filterPayments"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{ item.selectable.id }}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{ item.selectable.name }}
                            </template>
                            <template v-slot:[`item.card_type`]="{ item }">
                                {{ item.selectable.card_type }}
                            </template>
                            <template v-slot:[`item.card_last_four_digit`]="{ item }">
                                {{item.selectable.card_last_four_digit}}
                            </template>
                            <template v-slot:[`item.card_expiration`]="{ item }">
                                {{ item.selectable.card_expiration }}
                            </template>
                            <template v-slot:[`item.card_cvv`]="{ item }">
                                {{ item.selectable.card_cvv }}
                            </template>
                            <template v-slot:[`item.card_security`]="{ item }">
                                {{ item.selectable.card_security }}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes}}
                            </template>
                            <template v-slot:[`item.billing_address`]="{ item }">
                                {{ item.selectable.billing_address }}
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
                        </v-data-table>
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
export default {
    components: {
    },
    data() {
        return{
            dataMetrics: [
                {
                    id: '1',
                    name: 'Iman Wag',
                    card_type: 'IPM AMEX Plum Card',
                    card_last_four_digit: '460',
                    card_expiration:'2023-07-06',
                    card_cvv: '1489',
                    card_security: ' - ',
                    notes: ' - ',
                    billing_address: ' - ',
                    action: '',
                },
            ],
            search: '',
            headers: [
                { title: 'Card ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Card Name', key: 'name' },
                { title: 'Card Type', key: 'card_type', align: 'center' },
                { title: 'Card Last Four', key: 'card_last_four_digit', align: 'center' },
                { title: 'Card Expiration', key: 'card_expiration', align: 'center' },
                { title: 'Card CVV', key: 'card_cvv', align: 'center' },
                { title: 'Card Security', key: 'card_security', align: 'center' },
                { title: 'Notes', key: 'notes' },
                { title: 'Billing Address', key: 'billing_address' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            selected: [],
            itemsCardName: [],
            valueCardName: '',
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
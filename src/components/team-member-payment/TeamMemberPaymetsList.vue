<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs class="team_member_responsive">
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Team Member Payments</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" v-if="showImportIcon" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden && showImportIcon">
                            <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>

                            <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn @click="openFromAccountModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add From Account
                            </v-btn>

                            <v-btn @click="openTeamMemberModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add To Account
                            </v-btn>

                            <v-btn @click.prevent="this.$router.push('/accounting/teamMembersPayments/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            Team Member Payments List
                            <!-- tab panel title div -->
                            <div class="mt-2">
                                <v-tabs v-model="tabteampayment" fixed-tabs bg-color="green-lighten-4" class="mb-3">
                                    <v-tab value="payments" class="font-weight-bold" color="green-darken-4" @click.prevent="showImportIcon = true">Payments</v-tab>
                                    <v-tab value="reports" class="font-weight-bold" @click.prevent="getReports">Reports</v-tab>
                                </v-tabs>

                                <v-window v-model="tabteampayment">
                                    <v-window-item value="payments">
                                        <v-row class="d-flex align-center justify-end">
                                            <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                                <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                                <v-select clearable variant="outlined" placeholder="From Account Filter" :items="fromAccountFilter" v-model="fromAccount" @update:modelValue="getTeamMemberPaymentList" item-value="key"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                                <v-select clearable variant="outlined" placeholder="From Account Filter" :items="toAccountFilter" v-model="toAccount" @update:modelValue="getTeamMemberPaymentList" item-value="key"></v-select>
                                            </v-col>
                                            <v-col class="font-medium font-weight-normal">
                                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                            </v-col>
                                        </v-row> 

                                        <!-- data table component -->
                                        <v-data-table class="table-hover-class mt-4" :headers="headers" :items="teamMemberPaymentList" :items-per-page="itemsPerPage" :search="search" @update:options="currentItems($event)">
                                            <template v-slot:[`item.id`]="{ item }">
                                                {{item.selectable.id ? item.selectable.id : '-'}}
                                            </template>
                                            <template v-slot:[`item.payment_date`]="{ item }">
                                                {{item.selectable.payment_date ? item.selectable.payment_date : '-'}}
                                            </template>
                                            <template v-slot:[`item.from_account_team_member`]="{ item }">
                                                {{item.selectable.from_account_team_member ? item.selectable.from_account_team_member : '-'}}
                                            </template>
                                            <template v-slot:[`item.to_account_team_member`]="{ item }">
                                                {{item.selectable.to_account_team_member ? item.selectable.to_account_team_member : '-'}}
                                            </template>
                                            <template v-slot:[`item.amount`]="{ item }">
                                                {{$filters.toCurrency(item.selectable.amount)}}
                                            </template>
                                            <template v-slot:[`item.status`]="{ item }">
                                                {{item.selectable.status ? item.selectable.status : '-'}}
                                            </template>
                                            <template v-slot:[`item.action`]="{ item }">    
                                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="this.$router.push('/accounting/teamMembersPayments/'+ item.selectable.id +'/edit')" :disabled="permissions.update_auth == '0'">
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
                                            
                                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                                <tr class="total_table table-body-back bg-blue-darken-2">
                                                    <td>Totals</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td class="text-center">{{ $filters.toCurrency(sumField) }}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </v-window-item>

                                    <v-window-item value="reports">
                                        <v-row class="d-flex align-center justify-end ma-0">
                                            <v-spacer />
                                            <v-col cols="12" lg="3" md="3" sm="5" class="font-medium font-weight-normal v_select_design pr-0">
                                                <date-range-picker class="date_picker" :value="selectedRangeTwo" @update:value="updateRangeTwo"></date-range-picker>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="cardMemberList.length > 0" class="mt-4">
                                            <v-col cols="6" sm="6" md="4" lg="3" v-for="(item, index) in cardMemberList" :key="index">
                                                <v-card class="card_design" :class="item.total_amount == '0' ? 'bg-blue-lighten-4' : 'bg-green-lighten-4'">
                                                    <v-card-title class="text-subtitle-2 text-uppercase font-weight-normal">
                                                        <div class="d-flex align-cenyer justify-space-between">
                                                            <span>From: {{item.from_account ? item.from_account : '-'}}</span>
                                                            <span>TO: {{item.to_account ? item.to_account : '-'}}</span>
                                                        </div>
                                                    </v-card-title>
                                                    <v-card-text class="font-weight-medium text-h3 pa-0 mt-2" :class="item.total_amount == '0' ? 'text-blue-darken-2' : 'text-green-darken-1'">
                                                        {{item.total_amount ? item.total_amount : '-'}}
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                        </v-row>

                                        <v-col cols="12" sm="12" md="12" lg="12" v-else>
                                            <v-card class="border-0">
                                                <v-card-title class="d-flex justify-content-center align-center">
                                                     No data available
                                                </v-card-title>
                                            </v-card>
                                        </v-col>
                                    </v-window-item>
                                </v-window>
                            </div>                          
                        </v-card-title>
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
                    <form @submit.prevent="importCsv">
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
        <!-- Add Team Members -->
        <div class="modal fade" id="teamMemberModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add To Account</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeTeamMemberModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>                    
                    <Form @submit="addToAccount" :validation-schema="toAccSchema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">To Account Name</label>
                                    <Field name="toAccName" type="text" id="input-username" :class="{'form-control': true, 'border-red-600': errors.toAccName}" placeholder="Account Name" v-model="teamMemberName"/>
                                    <span class="text-red-600" v-if="errors.toAccName">Account name is a required field</span>
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
                                <v-btn type="reset" class="text-none bg-blue-darken-4 btn_animated mr-3 ml--4" id="reset_button" append-icon="mdi-content-save" style="opacity: 0">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeTeamMemberModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
        <!-- Add From Account -->
        <div class="modal fade" id="fromAccountModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add From Account</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeFromAccountModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>                    
                    <Form @submit="addFromAccount" :validation-schema="fromAccSchema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">From Account Name</label>
                                    <Field name="fromAccName" type="text" id="input-username" :class="{'form-control': true, 'border-red-600': errors.fromAccName}" placeholder="Account Name" v-model="teamMemberName"/>
                                    <span class="text-red-600" v-if="errors.fromAccName">Account name is a required field</span>
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
                                <v-btn type="reset" class="text-none bg-blue-darken-4 btn_animated mr-5 ml--4" id="reset_button_from" append-icon="mdi-content-save" style="opacity: 0">Reset</v-btn>
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeFromAccountModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
import mixin from '../../mixin'
export default {
    components: {
        Form, 
        Field,
        DateRangePicker
    },
    mixins:[mixin],
    data() {
        return {
            message: {},
            showLoader: false,
            teamMemberPaymentList: [],
            permissions: {},
            search: '',
            headers: [
                { title: 'Payment ID', key: 'id' },
                { title: 'Payment Date', align: 'center', sortable: true, key: 'payment_date' },
                { title: 'From Account', align: 'center', sortable: true, key: 'from_account_team_member' },
                { title: 'To Account', align: 'center', sortable: true, key: 'to_account_team_member' },
                { title: 'Amount', align: 'center', sortable: true, key: 'amount' },
                { title: 'Status', align: 'center', sortable: true, key: 'status' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            teamMemberName: '',
            fromAccountFilter: [],
            fromAccount: null,
            toAccountFilter: [],
            toAccount: null,
            cardMemberList: [],
            showImportIcon: true,
            selectedFile: '',
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            selectedRangeTwo: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            tabteampayment: 'payments',
            backendErrorMessage: '',
            multipleErrors: [],
            isHidden: false,
        }
    },
    computed: {
        fromAccSchema() {
            return yup.object({
                fromAccName: yup.string().required(),
            });
        },
        toAccSchema() {
            return yup.object({
                toAccName: yup.string().required(),
            });
        },
        // total row
        sumField() {
            const key = 'amount';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getTeamMemberPaymentList();
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null);
            window.$('#importCsvModal').modal('hide');
        },
        // open/close from account modal
        openFromAccountModal() {
            window.$('#fromAccountModal').modal('show');
        },
        closeFromAccountModal() {
            document.getElementById('reset_button_from').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#fromAccountModal').modal('hide');
        },
        // open/close import csv modal
        openTeamMemberModal() {
            window.$('#teamMemberModal').modal('show');
        },
        closeTeamMemberModal() {
            document.getElementById('reset_button').click();
            this.backendErrorMessage = '';
            this.multipleErrors = [];
            window.$('#teamMemberModal').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getTeamMemberPaymentList();
        },
        // update date range
        updateRangeTwo(range) {
            this.selectedRangeTwo = range;
            this.genrateTeamMembersPaymentsReport();
        },
        // get team member payment details
        getTeamMemberPaymentList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/teamMemberPayment';
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            if(this.fromAccount) {
                queryString.set('fromAccount', this.fromAccount)
            }
            if(this.toAccount) {
                queryString.set('toAccount', this.toAccount)
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
                    const allData = response.data;
                    this.teamMemberPaymentList = allData.data;
                    this.permissions = allData.permission;
                    this.fromAccountFilter = [];
                    allData.allfromAccount.forEach((val) => {
                        this.fromAccountFilter.push({
                            title: val.fromaccountlist.team_member_name,
                            key: val.fromaccountlist.id
                        })
                    });
                    this.toAccountFilter = [];
                    allData.alltoAccount.forEach((val) => {
                        this.toAccountFilter.push({
                            title: val.toaccountlist.team_member_name,
                            key: val.toaccountlist.id
                        })
                    });
                    const currentItems = {
                        itemsPerPage: -1
                    };
                    this.currentItems(currentItems);
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
        // delete team member payment
        deleteData(id) {
            this.showLoader = true;
            axios.delete(this.$api + '/accounting/teamMemberPayment/' + id, {
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
                    this.getTeamMemberPaymentList();
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
        // adding to account
        addToAccount() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/teamMemberPayments/addToAccountMembers', {
                team_member_name: this.teamMemberName
            }, {
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
                    this.showLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeTeamMemberModal();
                    this.teamMemberName = '';
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
        // adding from account
        addFromAccount() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/teamMemberPayments/addFromAccountMembers', {
                team_member_name: this.teamMemberName
            }, {
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
                    this.showLoader = false;
                    this.getTeamMemberPaymentList();
                    this.closeFromAccountModal();
                    this.teamMemberName = '';
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
        // get report listing and hide import icons
        getReports() {
            this.showImportIcon = false;
            this.genrateTeamMembersPaymentsReport();
        },
        // generate report
        genrateTeamMembersPaymentsReport() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/teamMemberPayments/genrateTeamMembersPaymentsReport', {
                startDate: moment(this.selectedRangeTwo.split('-').shift()).format('DD-MM-YYYY'),
                endDate: moment(this.selectedRangeTwo.split('-').pop()).format('DD-MM-YYYY'),
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.cardMemberList = response.data.data;
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
        // downloading csv
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'teamMembersPayments'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                },
                responseType: 'blob',
            })
            .then(response => {
                let blob = new Blob([response.data], { type:'application/csv' } );
                const _url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = _url;
                link.setAttribute('download', 'demo.csv');
                document.body.appendChild(link);
                link.click();
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
        // choose file and import csv
        importCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/teamMemberPayments/importTeamMembersPayment', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeImportCsvModal();
                    this.getTeamMemberPaymentList();
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // select csv file
        chooseFile(e) {
            this.selectedFile = e.target.files[0];
        },
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.teamMemberPaymentList.filter((val) => {
                    return val.id && val.id.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase()) ||
                           val.payment_date && val.payment_date.toString().includes(this.search.toLowerCase()) ||
                           val.from_account_team_member && val.from_account_team_member.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.to_account_team_member && val.to_account_team_member.toLowerCase().includes(this.search.toLowerCase()) ||
                           val.status && val.status.toLowerCase().includes(this.search.toLowerCase())
                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.teamMemberPaymentList;
            }
            else {
                const data = this.teamMemberPaymentList.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
        },
    }
}
</script>

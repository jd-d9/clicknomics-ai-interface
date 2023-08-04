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
                        <span>Fixed Monthly Cost</span>
                        <v-spacer />
                        <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click="openImportCsvModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/accounting/fixedMonthlyCost/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Fixed Monthly Cost List
                            <v-spacer></v-spacer>
                            <div v-if="selected.length > 0" class="mr-2">
                                <v-btn @click="deleteSelected" :disabled="permissions.delete_auth == '0'" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                    Remove Selected
                                </v-btn>
                                <v-btn @click="openCreateUpdateData" :disabled="permissions.update_auth == '0'" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-pencil">
                                    Edit
                                </v-btn>
                            </div>
                            <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                            </v-col>                            
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-3" :headers="headers" :items="dataMetrics" v-model:page="currentPage" :items-per-page="itemsPerPage" show-select v-model="selected" :search="search" ref="refrenseItem" @update:options="currentItems($event)">
                            <template v-slot:[`item.date`]="{ item }">
                                {{item.selectable.date ? item.selectable.date : '-'}}
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                ${{item.selectable.amount ? item.selectable.amount : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="this.$router.push('/accounting/fixedMonthlyCost/'+ item.selectable.id +'/edit')" :disabled="permissions.update_auth == '0'">
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
                                    <td></td>
                                    <td>Totals</td>
                                    <td class="text-center">{{ $filters.toCurrency(sumField) }}</td>
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

        <!-- Page content -->
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
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
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/>
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
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document" style="max-width:600px">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Bulk Operation Cost</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeCreateUpdateData">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <!-- <form @submit.prevent="editSelected">
                        <div class="modal-body">
                            <v-row v-for="(item, index) in seletedForEdit" :key="index">
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Date</label>
                                    <datepicker name="date" v-model:value="item.date" :disabled="true" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </v-col>
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Amount</label>
                                    <input name="Amount" type="number" id="input-username" :class="{'form-control': true}" placeholder="Add Amount" v-model="item.amount"/>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeCreateUpdateData">Close</v-btn>
                            </v-col>
                        </div>
                    </form> -->

                    <Form @submit="editSelected" :validation-schema="editSchema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row v-for="(item, index) in seletedForEdit" :key="index">
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Date</label>
                                    <datepicker v-model:value="item.date" :disabled="true" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Amount</label>
                                    <Field name="Amount" type="number" id="input-username" :class="{'form-control': true, 'border-red-600': errors.Amount}" placeholder="Add Amount" v-model="item.amount"/>
                                    <ErrorMessage class="text-red-600" name="Amount"/>
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
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeCreateUpdateData">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>

                    <!-- <Form @submit="editSelected" :initial-values="initialData" :validation-schema="schema">
                        <div class="modal-body">
                            <FieldArray name="seletedForEdit" v-slot="{ fields }">
                                <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                                    <v-row v-for="(item, index) in seletedForEdit" :key="index">
                                        <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                            <label class="form-control-label" for="input-username">Date</label>
                                            <datepicker v-model:value="item.date" :disabled="true" valueType="format" format="YYYY-MM-DD"></datepicker>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                            <label class="form-control-label" for="input-username">Amount</label>
                                            <Field :name="`Amount[${index}]`" type="number" id="input-username" :class="{'form-control': true, 'border-red-600': errors.Amount}" placeholder="Add Amount" v-model="item.amount"/>
                                            <ErrorMessage class="text-red-600" name="Amount"/>
                                        </v-col>
                                    </v-row>
                                </fieldset>
                            </FieldArray>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeCreateUpdateData">Close</v-btn>
                            </v-col>
                        </div>
                    </Form> -->
                    <!-- <Form @submit="editSelected" :initial-values="initialData" :validation-schema="schema">
                        <FieldArray name="seletedForEdit" v-slot="{ fields }">
                            <fieldset class="InputGroup" v-for="(field, idx) in fields" :key="field.key">
                                <legend>User #{{ idx }}</legend>
                                <label :for="`date_${idx}`">Name</label>
                                <Field :id="`date_${idx}`" :name="`seletedForEdit[${idx}].date`">
                                    <datepicker v-model:value="item.date" :disabled="true" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </Field>
                                <ErrorMessage :name="`seletedForEdit[${idx}].date`" />
                    
                                <label :for="`amount_${idx}`">Email</label>
                                <Field :id="`amount_${idx}`" :name="`seletedForEdit[${idx}].amount`" type="email"/>
                                <ErrorMessage :name="`seletedForEdit[${idx}].amount`" />
                            </fieldset>
                        </FieldArray>
                        <button type="submit">Submit</button>
                    </Form> -->
                    <!-- <form @submit.prevent="editSelected">
                        <div class="modal-body">
                            <v-row v-for="(item, index) in seletedForEdit" :key="index">
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Date</label>
                                    <datepicker name="date" v-model:value="item.date" :disabled="true" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Amount</label>
                                    <input name="Amount" type="number" id="input-username" :class="{'form-control': true}" placeholder="Add Amount" v-model="item.amount"/>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeCreateUpdateData">Close</v-btn>
                            </v-col>
                        </div>
                    </form> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@axios';
import * as yup from 'yup';
import { Field, Form, ErrorMessage } from 'vee-validate';
// import * as yup from 'yup';
// import { Field, Form, ErrorMessage, FieldArray } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        Datepicker,
        DateRangePicker,
        Field, 
        Form, 
        ErrorMessage,
        // FieldArray,
    },
    data() {
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Date', align: 'start', sortable: false, key: 'date' },
                { title: 'Amount', key: 'amount', align: 'center' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            selected: [],
            selectedId: [],
            seletedForEdit: [],
            selectedFile: '',
            permissions: {
                view:'1'
            },
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
            initialData: {
                seletedForEdit: [],
            },
            backendErrorMessage: '',
            multipleErrors: [],
            currentPage: 1,
            // schema: yup.object().shape({
            //     users: yup
            //     .array()
            //     .of(
            //         yup.object().shape({
            //             name: yup.string().required().label('Name'),
            //             email: yup.string().email().required().label('Email'),
            //         })
            //     )
            //     .strict(),
            // }),
        }
    },
    computed: {
        editSchema() {
            return yup.object({
                Amount: yup.string().required(),
            });
        },
        // displayedItems() {
        //     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        //     const endIndex = startIndex + this.itemsPerPage;
        //     console.log(this.dataMetrics.slice(startIndex, endIndex), 'startindex');
        //     return 'test';
        //     // return this.dataMetrics.slice(startIndex, endIndex);
        // },
        // total row
        sumField() {
            const key = 'amount';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0);
        }
    },
    watch: {
        selected(val) {
            this.selectedId = [];
            val.forEach((data) => {
                this.selectedId.push({id: data});
            })
        }
    },
    mounted() {
        this.getFixedMonthlyCostList();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null) ;
            window.$('#importCsvModal').modal('hide');
        },
        // open/close bulk edition operation cost modal
        openCreateUpdateData() {
            window.$('#createUpdateData').modal('show');
            this.seletedForEdit = [];
            this.dataMetrics.forEach((val) => {
                this.selectedId.forEach((data) => {
                    if(data.id == val.id) {
                        this.seletedForEdit.push({
                            id: val.id,
                            date: val.date,
                            amount: val.amount
                        })
                    }
                })
            })
        },
        closeCreateUpdateData() {
            window.$('#createUpdateData').modal('hide');
            this.seletedForEdit = [];
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getFixedMonthlyCostList();
        },
        // get all data of fixed monthly cost list
        getFixedMonthlyCostList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/fixedMonthlyCost';

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
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.permissions = getData.permission;
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
        // delete selected items
        deleteSelected() {
            const confirmDelete = window.confirm('Do you really want to delete?');
            if(confirmDelete) {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/fixedMonthlyCost/deleteMutipleRows', {
                    selectedRow: JSON.stringify(this.selectedId)
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
                        this.getFixedMonthlyCostList();
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
            }
        },
        // edit bult selected items
        editSelected() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/fixedMonthlyCost/saveBulkEditOpsCost', {
                rowdata: JSON.stringify(this.seletedForEdit)
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
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.closeCreateUpdateData();
                    this.getFixedMonthlyCostList();
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
        // delete from table
        deleteData(id) {
            this.showLoader = true;
            axios.delete(this.$api + '/accounting/fixedMonthlyCost/' + id, {
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
                    this.getFixedMonthlyCostList();
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
                filename: 'fixedMonthlyCost'
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
                this.message = {
                    text: response.data.message,
                    type: 'success',
                }
                this.$eventBus.emit('flash-message', this.message, '');
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
            axios.post(this.$api + '/accounting/fixedMonthlyCost/importOpsCostCSV', {
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
                    this.getFixedMonthlyCostList();
                    this.showLoader = false;
                    this.selectedFile = '';
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
        // // current items for sum field
        // currentItems(currentItems) {
        //     if(this.search) {
        //         const data = this.dataMetrics.filter((val) => {
        //             return val.date.toString().includes(this.search.toLowerCase()) || 
        //                    val.amount.toString().includes(this.search.toLowerCase())
        //         })
        //         this.currentItemsTable = data;
        //     }
        //     else if(currentItems.itemsPerPage == -1) {
        //         this.currentItemsTable = this.dataMetrics;
        //     }
        //     else {
        //         const data = this.dataMetrics.slice(0, currentItems.itemsPerPage);
        //         this.currentItemsTable = data;
        //     }
        // },
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.dataMetrics.filter((val) => {
                    return val.date && val.date.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase())
                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
                // data.length >= 10 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data;
                // currentItems.itemsPerPage >= 10 ? this.currentItemsTable = this.dataMetrics.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data;
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.dataMetrics;
            }
            else {
                const data = this.dataMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
        },
    }
}
</script>

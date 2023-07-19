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
                        <span>Invoice</span>
                        <v-spacer />
                        <v-btn @click.prevent="this.$router.push('/accounting/invoice/template')" href="" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-layers">
                            Templates
                        </v-btn>

                        <v-btn @click.prevent="this.$router.push('/accounting/invoice/create')" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Invoice List
                            <v-row class="d-flex justify-space-between align-center">
                                <v-spacer></v-spacer>
                                <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design pr-0">
                                    <!-- <select v-model="networkSelected" class="form-control serch_table">
                                        <option disabled selected>Network Filter</option>
                                        <option :value="val.title" v-for="(val, index) of networkFilter" :key="index">
                                            {{ val.title }}
                                        </option>
                                    </select> -->
                                    <v-select clearable variant="outlined" placeholder="Network Filter" :items="networkFilter" v-model="networkSelected"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchInvoice"/>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="invoiceList" :search="search" :single-expand="singleExpand" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.invoice_number`]="{ item }">
                                {{item.selectable.invoice_number}}
                            </template>
                            <template v-slot:[`item.network_name`]="{ item }">
                                <router-link to="" @click="openCreateNetworkModal(item.selectable.id, item.selectable.network_add_type, item.selectable.network_name)">
                                    {{item.selectable.network_name ? item.selectable.network_name : '-'}}
                                </router-link>
                            </template>
                            <template v-slot:[`item.invoice_issue_date`]="{ item }">
                                {{item.selectable.invoice_issue_date}}
                            </template>
                            <template v-slot:[`item.invoice_due_date`]="{ item }">
                                {{item.selectable.invoice_due_date}}
                            </template>
                            <template v-slot:[`item.is_invoice_edited`]="{ item }">
                                <router-link to="" @click="openNumberEditedModal(item.selectable.id, item.selectable.is_invoice_edited)">{{item.selectable.is_invoice_edited == '1' ? 'Yes' : 'No'}}</router-link>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editInvoice(item.selectable.id)">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click.prevent="downloadInvoice(item.selectable.id)">
                                    <v-icon color="deep-purple-darken-1">
                                        mdi-download
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Download</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-blue-lighten-4" variant="text" icon @click.prevent="openShareInvoice(item.selectable.id)">
                                    <v-icon color="blue-darken-2">
                                        mdi-share-variant
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Share invoice in email</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deleteInvoice(item.selectable.id)">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" class="add-dialog-max-width" width="600">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Add email to share</h5>
                            <button type="button" class="close" aria-label="Close" @click="closeShareInvoice">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <form>
                            <div class="modal-body">
                                <div v-for="(item, index) in emailList" :key="index">
                                    <v-row class="align-center">
                                        <v-col cols="10">
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Email" v-model="item.email">
                                        </v-col>
                                        <v-col cols="2" v-if="index > 0">
                                            <v-btn
                                                class="bg-red-lighten-4"
                                                variant="text" width="40px" height="40px"
                                                icon="mdi-close"
                                                color="red-darken-4"
                                                @click="emailList.splice(index, 1)"
                                            ></v-btn>
                                        </v-col>
                                        <v-col cols="2" v-else>
                                            <v-btn
                                                class="bg-green-lighten-4"
                                                variant="text" width="40px" height="40px"
                                                icon="mdi-plus"
                                                color="green-darken-2"
                                                @click="addNewItem"
                                            ></v-btn>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                            
                            <div class="modal-footer pt-0">
                                <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-send" @click.prevent="shareInvoice">Send</v-btn>    
                                    <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click="closeShareInvoice">Cancel</v-btn>
                                </v-col>
                            </div>
                        </form>
                    </div>
                </v-dialog>
            </v-row>
        </template>
         <!-- Modal Network Add -->
        <div class="modal fade" id="createNetworkModal" tabindex="-1" role="dialog" aria-labelledby="createNetworkModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">CPA Network Company</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeCreateNetworkModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    <label class="form-control-label" for="input-username">Add Network Manually</label>
                                    <v-radio-group inline v-model="networkModal.networkAddType" @change="resetNetworkName">
                                        <v-radio class="monitor" label="YES" :value="1"></v-radio>
                                        <v-radio class="monitor" label="NO" :value="0"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" v-if="networkModal.networkAddType">
                                    <label class="form-control-label" for="input-username">CPA Network Name</label>
                                    <input type="text" :class="{'form-control': true}" v-model="networkModal.networkName">
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" v-else>
                                    <label class="form-control-label" for="input-username">Select CPA Network</label>
                                    <v-autocomplete :class="{'form-control': true}" variant="outlined" :items="networkList" v-model="networkModal.networkName"></v-autocomplete>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" @click.prevent="addCpaNetwork">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeImportCsvModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- edited modal  -->
        <div class="modal fade" id="numberEditedModal" tabindex="-1" role="dialog" aria-labelledby="numberEditedModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Invoice Edited Data</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeNumberEditedModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" >
                                    <label class="form-control-label" for="input-username">Is Invoice Edited?</label>
                                    <v-radio-group inline v-model="editedModal.is_invoice_edited">
                                        <v-radio class="monitor me-3" label="YES" value="1"></v-radio>
                                        <v-radio class="monitor" label="NO" value="0"></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" @click.prevent="isInvoiceEdited">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeNumberEditedModal">Close</v-btn>
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
    name: "SlotsDemo",
    components: {
        DateRangePicker,
    },
    filters: {
        dateCell (value) {
            let dt = new Date(value)
            return dt.getDate()
        },
        date (val) {
            return val ? val.toLocaleString() : ''
        }
    },
    data() {
        return {
            // images: {
            //     logo: require('/assets/img/brand/logo.png'),
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            //     download: require('/assets/img/icons/download.svg'),
            //     share: require('/assets/img/icons/share.svg'),
            // },
            headers: [
                { title: 'ID', key: 'id', sortable: this.isSortable},
                { title: 'Invoice Number', key: 'invoice_number', sortable: this.isSortable },
                { title: 'Network', key: 'network_name', sortable: this.isSortable },
                { title: 'Invoice Issue Date', key: 'invoice_issue_date', align: 'center', sortable: this.isSortable },
                { title: 'Invoice Due Date', key: 'invoice_due_date', align: 'center', sortable: this.isSortable },
                { title: 'Invoice Number Edited', key: 'is_invoice_edited', align: 'center', sortable: this.isSortable },
                { title: 'Action', key: 'actions', align: 'center', sortable: this.isSortable },
            ],
            showLoader: false,
            search: '',
            item: {},
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            invoiceList: [],
            invoiceFilter: [],
            emailList: [
                {
                    email: ''
                }
            ],
            invoiceId: '',
            networkModal: {
                id: '',
                networkAddType: 0,
                networkName: '',
            },
            editedModal: {
                id: '',
                is_invoice_edited: '',
            },
            networkFilter: [],
            networkSelected: null,
            isSortable: true,
            dialog: false,
            selectedInvoiceId: '',
            searchInput: '',
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    mounted() {
        this.getInvoicesList();
        this.fetchNetworkList();
        this.filterUsingNetwork();
    },
    watch: {
        networkSelected(val) {
            if(val) {
                this.invoiceList = this.invoiceFilter.filter((data) => {
                    return data.network_name == this.networkSelected;
                })
            }
            else {
                this.invoiceList = this.invoiceFilter;
            }
        }
    },
    methods: {
        // setting date formate
        dateFormat (classes, date) {
            if (!classes.disabled) {
                classes.disabled = date.getTime() < new Date()
            }
            return classes
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.fetchNetworkList();
        },
        // get network list data
        fetchNetworkList() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/accounting/invoices/fetchInvoiceList';
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
                    this.networkFilter = [];
                    console.log(response.data.networksList)
                    response.data.networksList.forEach((val) => {
                        if(val.network_name && val.network_name !== null) {
                            this.networkFilter.push(val.network_name);
                        }
                    })
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // invoice list filter using selected network
        filterUsingNetwork() {
           console.log(this.invoiceList, this.networkSelected, 'oifihfg')
        },
        // search user from table
        searchInvoice() {
            this.invoiceList = this.invoiceFilter.filter((val) => {
                return val.invoice_number.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.network_name && val.network_name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_issue_date.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_due_date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // add multiple email address field
        addNewItem() {
            this.emailList.push({
                email: '',
            })
        },
        // get invoices list
        getInvoicesList() {
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/invoice', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.invoiceList = response.data.data.invoiceList;
                    this.invoiceFilter = response.data.data.invoiceList;
                    console.log(response.data.data.invoiceList, 'this.invoiceList')
                    this.showLoader = false;
                }
            })
            .catch(error => {
                this.showLoader = false;
                console.log(error)
            });
        },
        // delete invoice
        deleteInvoice(id) {
            this.showLoader = true;
            this.axios.delete(this.$api + '/accounting/invoice/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Invoice deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getInvoicesList();
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // edit invoice
        editInvoice(id) {
            this.$router.push('/accounting/invoice/' + id + '/edit');
        },
        // downloading invoice/pdf
        downloadInvoice(id) {
            this.axios.get(this.$api + '/accounting/invoices/exportPDF/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                },
                responseType: 'blob',
            })
            .then(response => {
                let blob = new Blob([response.data], { type:'application/pdf' } );
                const _url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = _url;
                link.setAttribute('download', 'invoice_' + id +'.pdf');
                document.body.appendChild(link);
                link.click();
                this.$toast.open({
                    message: 'Invoice downloaded',
                    position: 'top-right',
                    duration: '5000',
                    type: 'success'
                });
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // open share invoice modal
        openShareInvoice(id) {
            this.dialog = true;
            this.selectedInvoiceId = id;
        },
        // close share invoice modal
        closeShareInvoice() {
            this.dialog = false;
            this.emailList = [{email: ''}];
        },
        // share invoice in mail
        shareInvoice() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/sendEmailInvoice', {
                id: this.selectedInvoiceId,
                emailList: JSON.stringify(this.emailList)
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Invoice sent',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.dialog = false;
                    this.emailList = [{email: ''}];
                }
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // open/close modals is invoice edited modal
        openNumberEditedModal(id, edited) {
            this.editedModal.id = id;
            this.editedModal.is_invoice_edited = edited;
            window.$('#numberEditedModal').modal('show');
        },
        closeNumberEditedModal() {
            this.editedModal.id = '';
            this.editedModal.is_invoice_edited = '';
            window.$('#numberEditedModal').modal('hide');
        },
        // update invoice numbered is edited
        isInvoiceEdited() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/updateInvoiceEditedData', {
                id: this.editedModal.id,
                is_invoice_edited: this.editedModal.is_invoice_edited
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.showLoader = false;
                    this.closeNumberEditedModal();
                    this.getInvoicesList();
                }
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // open/close create network modals
        openCreateNetworkModal(id, type, name) {
            this.networkModal.id = id;
            this.networkModal.networkAddType = (type == 'live' ? 0 : 1);
            this.networkModal.networkName = name;
            window.$('#createNetworkModal').modal('show');
        },
        closeCreateNetworkModal() {
            window.$('#createNetworkModal').modal('hide');
            this.resetNetworkModal();
        },
        // reset network name
        resetNetworkName() {
           this.networkModal.networkName = '';
        },
        resetNetworkModal() {
            this.networkModal = {
                id: '',
                networkAddType: 0,
                networkName: '',
            }
        },
        // adding cpa network
        addCpaNetwork() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/addNetworkCompanyToInvoice', {
                id: this.networkModal.id,
                network_name: this.networkModal.networkName,
                network_add_type: this.networkModal.networkAddType === 0 ?  'live' : 'manual'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.showLoader = false;
                    this.closeCreateNetworkModal();
                    this.getInvoicesList();
                    this.fetchNetworkList();
                }
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        }
    }
}
</script>
 
<style>
.v-radio-group .v-input__details{display: none;}
</style>

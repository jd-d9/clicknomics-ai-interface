<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Invoice</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/invoice/template" class="btn btn-lg btn-neutral btn_animated">Templates</router-link>
                            <router-link to="/accounting/invoice/create" class="btn btn-lg btn-neutral btn_animated">Add New Invoice</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="v-card v-sheet theme--light">
                                <div class="card-header text-end">
                                    <div class="row">
                                        <v-col class="d-flex" cols="12" sm="4">
                                            <v-select
                                            label="Network Filter" 
                                            :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                                            variant="solo"
                                            @change="fetchInvoiceList"
                                            ></v-select>
                                        </v-col>
                                        <div class="col-4">
                                            <input type="date" class="date-picker">
                                        </div>
                                        <div class="col-3 ms-auto">
                                            <div class="ms-auto search-input position-relative">
                                                <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchInvoice">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- data table component -->
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="invoiceList" :search="search"  :single-expand="singleExpand" class="elevation-1 table-expand" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr class="table-body-back">
                                            <th>{{item.selectable.id}}</th>
                                            <td>{{item.selectable.invoice_number}}</td>
                                            <td>{{item.selectable.network_name ? item.selectable.network_name : '-'}}</td>
                                            <td>{{item.selectable.invoice_issue_date}}</td>
                                            <td>{{item.selectable.invoice_due_date}}</td>
                                            <td>
                                                <router-link to="" data-bs-target="#updateEditedData" data-bs-toggle="modal">{{item.selectable.is_invoice_edited == '1' ? 'Yes' : 'No'}}</router-link>
                                            </td>
                                            <td>
                                                <button class="disable-button" @click.prevent="editInvoice(item.selectable.id)">
                                                    <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit user">
                                                </button>
                                                <button class="disable-button" @click.prevent="downloadInvoice(item.selectable.id)">
                                                    <img src="/assets/img/icons/download.svg" class="icon-width" title="Delete user">
                                                </button>
                                                <button class="disable-button" @click.prevent="shareInvoice(item.selectable.id)">
                                                    <img src="/assets/img/icons/share.svg" class="icon-width" title="Edit user">
                                                </button>
                                                <button class="disable-button" @click.prevent="deleteInvoice(item.selectable.id)">
                                                    <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete user">
                                                </button>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="800">
                    <v-card>
                        <form>
                            <v-card-title class="text-h5">
                                Add email to share
                            </v-card-title>
                            <v-card-text>
                                <div class="add-products-form">
                                    <div v-for="(item, index) in emailList" :key="index" class="single-product-form mb-3">
                                        <v-card outlined class="d-flex">
                                            <!-- Left Form -->
                                            <div class="pa-5 flex-grow-1">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <ValidationProvider v-slot="{ errors }" rules="required|email" :name="'Email_'+(index+1)">
                                                            <input type="text" id="input-username" :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" placeholder="Email" v-model="item.email">
                                                            <span class="text-red-600">error</span>
                                                        </ValidationProvider>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            <!-- Item Actions -->
                                            <div class="d-flex flex-column item-actions rounded-0 pa-1" v-if="index > 0">
                                                <v-btn icon small @click="emailList.splice(index, 1)">
                                                    <v-icon size="20">
                                                        {{ 'mdi-close' }}
                                                    </v-icon>
                                                </v-btn>
                                                <v-spacer></v-spacer>
                                            </div>
                                        </v-card>
                                    </div>
                                    <v-btn color="primary" class="mt-4" outlined @click="addNewItem">
                                        Add Item
                                    </v-btn>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="dialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn color="green darken-1" text type="submit">
                                    Send
                                </v-btn>
                            </v-card-actions>
                        </form>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
         <!-- Modal Network Add -->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">CPA Network Company</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Add Network Manually</label>
                                            <v-app>
                                                <v-radio-group class="monitor_main" v-model="networkModal.networkAddType" row :class="{'form-control': true, 'border-red-600':errors!= '' ? true : false  }" @change="resetNetworkName">
                                                    <v-radio class="monitor" label="YES" :value="1"></v-radio>
                                                    <v-radio class="monitor" label="NO" :value="0"></v-radio>
                                                </v-radio-group>
                                            </v-app>
                                            <span class="text-red-600">error</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 py-0" v-if="networkModal.networkAddType">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">CPA Network Name</label>
                                            <input type="text" :class="{'form-control': true, 'border-red-600':errors!= '' ? true : false  }" v-model="networkModal.networkName">
                                            <span class="text-red-600">error</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 py-0" v-if="!networkModal.networkAddType">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Select CPA Network</label>
                                            <v-autocomplete :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :items="networkList" v-model="networkModal.networkName"></v-autocomplete>
                                            <span class="text-red-600">error</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- edited modal  -->
        <div class="modal fade" id="updateEditedData" tabindex="-1" role="dialog" aria-labelledby="updateEditedDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Update Invoice Edited Data</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Is Invoice Edited?</label>
                                            <v-app>
                                                <v-radio-group class="monitor_main" v-model="editedModal.is_invoice_edited" row :class="{'form-control': true}" >
                                                    <v-radio class="monitor" label="YES" :value="1"></v-radio>
                                                    <v-radio class="monitor" label="NO" :value="0"></v-radio>
                                                </v-radio-group>
                                            </v-app>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
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
                { title: 'Invoice Issue Date', key: 'invoice_issue_date', sortable: this.isSortable },
                { title: 'Invoice Due Date', key: 'invoice_due_date', sortable: this.isSortable },
                { title: 'Invoice Number Edited', key: 'is_invoice_edited', sortable: this.isSortable },
                { title: 'Action', key: 'actions', sortable: this.isSortable },
            ],
            hideShowLoader: false,
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
                is_invoice_edited: 0,
            },
            dateRange: {startDate, endDate},
            networkFilter: [],
            networkSelected: '',
            isSortable: true
        }
    },
    mounted() {
        this.getInvoicesList();
    },
    methods: {
        // search user from table
        searchInvoice() {
            this.invoiceList = this.invoiceFilter.filter((val) => {
                return val.invoice_number.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        // val.network_name.toString().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_issue_date.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_due_date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get invoices list
        getInvoicesList() {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                this.hideShowLoader = false;
                console.log(error)
            });
        },
        // delete invoice
        deleteInvoice(id) {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // edit invoice
        editInvoice(id) {
            this.$router.push('/accounting/invoice/' + id + '/edit');
        }
    }
}
</script>

<style>
.select-tag, .date-picker {
    border-radius: 4px;
    border: none;
    padding: 6px 7px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    width: 100%;
}
.date-picker {
    width: unset;
}
.date-picker:focus {
    outline: none;
}
.v-selection-control-group {
    flex-direction: row !important;
}
.v-application__wrap {
    min-height: 11vh !important;
    flex: unset !important;
    width: 100%;
}
</style>

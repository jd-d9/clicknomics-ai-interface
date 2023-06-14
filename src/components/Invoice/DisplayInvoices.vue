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
                            <v-app>
                                <v-card>
                                    <v-card-title>
                                        <v-row>
                                            <v-col class="d-flex" cols="12" sm="4">
                                                <div class="select-network-filter">
                                                    <v-select
                                                    label="Network Filter" 
                                                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
                                                    variant="solo"
                                                    @change="fetchInvoiceList"
                                                    ></v-select>
                                                </div>
                                            </v-col>
                                            <!-- <v-col class="d-flex" cols="12" sm="4">
                                                <v-text-field label="Search" variant="solo"></v-text-field>
                                                <v-text-field label="Search" variant="underlined"></v-text-field>
                                            </v-col> -->
                                            <div class="col-4">
                                                <!-- <input type="date" class="date-picker"> -->
                                                <!-- <date-range-picker v-model="dateRange">
                                                    <div slot="header" slot-scope="header" class="slot">
                                                        <h3>Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                                    </div>
                                                    <template #input="picker">
                                                        {{ picker.startDate }} - {{ picker.endDate }}
                                                    </template>
                                                    <template #date="data">
                                                        <span class="small">{{ data.date }}</span>
                                                    </template>
                                                    <template #ranges="ranges">
                                                        <div class="ranges">
                                                            <ul>
                                                                <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                                                    <b>{{ name }}</b> 
                                                                    <small class="text-muted">{{ range[0].toDateString() }} - {{ range[1].toDateString() }}</small>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </template>
                                                    <div slot="footer" slot-scope="data" class="slot">
                                                        <div>
                                                            <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                                        </div>
                                                        <div style="margin-left: auto">
                                                            <a href="javascript:void(0)" @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
                                                        </div>
                                                    </div>
                                                </date-range-picker> -->
                                            </div>
                                            <div class="col-3 ms-auto">
                                                <div class="ms-auto search-input position-relative">
                                                    <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchInvoice">
                                                </div>
                                            </div>
                                        </v-row>
                                    </v-card-title>
                                    <!-- data table component -->
                                    <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="invoiceList" :search="search"  :single-expand="singleExpand" class="elevation-1 table-expand" :itemsPerPage="itemsPerPage">
                                        <template v-slot:item="{ item }">
                                            <tr>
                                                <th>{{item.selectable.id}}</th>
                                                <td>{{item.selectable.invoice_number}}</td>
                                                <td>
                                                    <router-link to="" @click="openCreateNetworkModal(item.selectable.id)">
                                                        {{item.selectable.network_name ? item.selectable.network_name : '-'}}
                                                    </router-link>
                                                </td>
                                                <td>{{item.selectable.invoice_issue_date}}</td>
                                                <td>{{item.selectable.invoice_due_date}}</td>
                                                <td>
                                                    <router-link to="" @click="openNumberEditedModal(item.selectable.id, item.selectable.is_invoice_edited)">{{item.selectable.is_invoice_edited == '1' ? 'Yes' : 'No'}}</router-link>
                                                </td>
                                                <td>
                                                    <button class="disable-button" @click.prevent="editInvoice(item.selectable.id)">
                                                        <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit invoice">
                                                    </button>
                                                    <button class="disable-button" @click.prevent="downloadInvoice(item.selectable.id)">
                                                        <img src="/assets/img/icons/download.svg" class="icon-width" title="Download invoice">
                                                    </button>
                                                    <button class="disable-button" @click.prevent="openShareInvoice(item.selectable.id)">
                                                        <img src="/assets/img/icons/share.svg" class="icon-width" title="Share invoice in email">
                                                    </button>
                                                    <button class="disable-button" @click.prevent="deleteInvoice(item.selectable.id)">
                                                        <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete invoice">
                                                    </button>
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-app>
                            <!-- <div class="v-card v-sheet theme--light">
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" class="add-dialog-max-width">
                    <v-card>
                        <form>
                            <v-card-title class="text-h5">Add email to share</v-card-title>
                            <v-card-text>
                                <!-- <div class="add-products-form"> -->
                                    <div v-for="(item, index) in emailList" :key="index" class="single-product-form my-2">
                                        <v-card class="d-flex">
                                            <div class="pa-5 flex-grow-1">
                                                <v-row>
                                                    <v-col cols="12">
                                                        <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Email" v-model="item.email">
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            <div class="d-flex flex-column item-actions rounded-0 pa-1" v-if="index > 0">
                                                <v-btn icon small @click="emailList.splice(index, 1)">
                                                    <v-icon size="20">{{ 'mdi-close' }}</v-icon>
                                                </v-btn>
                                                <v-spacer></v-spacer>
                                            </div>
                                        </v-card>
                                    </div>
                                    <v-btn color="primary" class="mt-2" variant="outlined" @click="addNewItem">Add Item</v-btn>
                                <!-- </div> -->
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="green darken-1" text @click="closeShareInvoice">Cancel</v-btn>
                                <v-btn color="green darken-1" text type="submit" @click.prevent="shareInvoice">Send</v-btn>
                            </v-card-actions>
                        </form>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
         <!-- Modal Network Add -->
        <div class="modal fade" id="createNetworkModal" tabindex="-1" role="dialog" aria-labelledby="createNetworkModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">CPA Network Company</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeCreateNetworkModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group radio-button-app">
                                            <label class="form-control-label" for="input-username">Add Network Manually</label>
                                            <v-app>
                                                <v-radio-group inline class="monitor_main" v-model="networkModal.networkAddType" @change="resetNetworkName">
                                                    <v-radio class="monitor" label="YES" value="1"></v-radio>
                                                    <v-radio class="monitor" label="NO" value="0"></v-radio>
                                                </v-radio-group>
                                            </v-app>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 py-0"> <!-- v-if="networkModal.networkAddType" -->
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">CPA Network Name</label>
                                            <input type="text" :class="{'form-control': true}" v-model="networkModal.networkName">
                                        </div>
                                    </div>
                                    <div class="col-lg-12 py-0"> <!-- v-if="!networkModal.networkAddType" -->
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Select CPA Network</label>
                                            <div class="select-network-filter select-network-filter-two">
                                                <v-autocomplete :class="{'form-control': true}" variant="outlined" :items="networkList" v-model="networkModal.networkName"></v-autocomplete>
                                            </div>
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
        <div class="modal fade" id="numberEditedModal" tabindex="-1" role="dialog" aria-labelledby="numberEditedModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Update Invoice Edited Data</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeNumberEditedModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group radio-button-app mb-0">
                                            <label class="form-control-label mb-4" for="input-username">Is Invoice Edited?</label>
                                            <v-app>
                                                <v-radio-group inline class="monitor_main" v-model="editedModal.is_invoice_edited">
                                                    <v-radio class="monitor me-3" label="YES" value="1"></v-radio>
                                                    <v-radio class="monitor" label="NO" value="0"></v-radio>
                                                </v-radio-group>
                                            </v-app>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="isInvoiceEdited">Save</button>
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
        let startDate = today;
        let endDate = today;
        endDate.setDate(endDate.getDate() + 6)
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
                is_invoice_edited: '',
            },
            dateRange: {startDate, endDate},
            networkFilter: [],
            networkSelected: '',
            isSortable: true,
            dialog: false,
            selectedInvoiceId: '',
        }
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
        // add multiple email address field
        addNewItem() {
            this.emailList.push({
                email: '',
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
                console.log(error);
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
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                    this.dialog = false;
                    this.emailList = [{email: ''}];
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
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
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                    this.closeNumberEditedModal();
                    this.getInvoicesList();
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // open/close create network modals
        openCreateNetworkModal() {
            window.$('#createNetworkModal').modal('show');
        },
        closeCreateNetworkModal() {
            window.$('#createNetworkModal').modal('hide');
        },

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
.add-dialog-max-width {
    max-width: 800px;
}
</style>

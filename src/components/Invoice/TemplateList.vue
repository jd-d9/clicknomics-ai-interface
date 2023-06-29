<template>
    <div class="bg-default main-content-height">
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
                                    <li class="breadcrumb-item active" aria-current="page">Invoice Template List</li>
                                </ol>
                            </nav>
                        </div>
                        <!-- <div class="col-lg-6 text-right">
                            <router-link to="/accounting/invoice" class="btn btn-lg btn-neutral btn_animated">Back</router-link>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card shadow">
                            <div class="card-body">
                                <v-app>
                                    <v-card>
                                        <v-card-title>
                                            <!-- <v-row></v-row> -->
                                                <div class="row">
                                                    <div class="col-3 ms-auto">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchInvoice">
                                                        </div>
                                                    </div>
                                                </div>
                                        </v-card-title>
                                        <!-- data table component -->
                                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="templateList" :search="search"  :single-expand="singleExpand" class="elevation-1 table-hover-class" :itemsPerPage="itemsPerPage">
                                            <template v-slot:item="{ item }">
                                                <tr class="table-body-back">
                                                    <th>{{item.selectable.id}}</th>
                                                    <td>
                                                        <router-link to="" @click.prevent="editTemplateName(item.selectable.id)">
                                                            {{item.selectable.template_name}} 
                                                            <i class="fa-solid fa-pen-to-square edit-icon-pen"></i>
                                                        </router-link>
                                                    </td>
                                                    <td>{{item.selectable.invoice_number}}</td>
                                                    <td>{{item.selectable.invoice_issue_date}}</td>
                                                    <td>{{item.selectable.invoice_due_date}}</td>
                                                    <td>
                                                        <button class="btn btn-lg btn-neutral" @click.prevent="createInvoiceFromTemp(item.selectable.id)">Create Invoice From Template</button>
                                                        <router-link :to="'/accounting/invoice/template/' + item.selectable.id + '/edit'" class="disable-button">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit template">
                                                        </router-link>
                                                        <button class="disable-button" @click.prevent="deleteTemplate(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete template">
                                                        </button>
                                                    </td>
                                                </tr>
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </v-app>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
          <!-- Modal Update Template -->
        <div class="modal fade" id="editTemplateNameModal" tabindex="-1" role="dialog" aria-labelledby="editTemplateNameModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Update Template Name</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Template Name</label>
                                            <input type="text" :class="{'form-control': true }" v-model="selectedTemplateName">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="updateTemplateName">Save</button>
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
        return {
            // images: {
            //     logo: require('/assets/img/brand/logo.png'),
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            //     download: require('/assets/img/icons/download.svg'),
            //     share: require('/assets/img/icons/share.svg'),
            // },
            showLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'id'},
                { title: 'Template Name', key: 'template_name'},
                { title: 'Invoice Number', key: 'invoice_number' },
                { title: 'Invoice Issue Date', key: 'invoice_issue_date' },
                { title: 'Invoice Due Date', key: 'invoice_due_date' },
                { title: 'Action', key: 'actions', },
            ],
            searchInput: '',
            templateList: [],
            templateFilter: [],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            selectedTemplateName: '',
            selectedTemplateId: '',
            // selectedTemplate: {
            //     id: '',
            //     name: ''
            // }
        }
    },
    mounted() {
        this.getTemplateData();
    },
    methods: {
        // opening modal
        openModal() {
            window.$('#editTemplateNameModal').modal('show');
        },
        // closing modal
        closeModal() {
            window.$('#editTemplateNameModal').modal('hide');
        },
        // search user from table
        searchInvoice() {
            this.templateList = this.templateFilter.filter((val) => {
                return val.invoice_number.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.template_name.toString().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_issue_date.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.invoice_due_date.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get templates
        getTemplateData() {
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/invoices/invoiceTemplate', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.data, 'data')
                    this.templateList = response.data.data;
                    this.templateFilter = response.data.data;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // deleting template
        deleteTemplate(id) {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/deleteInvoiceTemplate', {  // must use post method for this(from backend side)
                id: id,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Template deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getTemplateData();
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
        // open modal and get template name
        editTemplateName(id) {
            this.openModal();
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/invoices/invoicetemplateShow/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.selectedTemplateName = response.data.data.template_name;
                    this.selectedTemplateId = response.data.data.id;
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
        // update template name
        updateTemplateName() {
            this.showLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/updateInvoiceTemplateName', {
                id: this.selectedTemplateId,
                template_name: this.selectedTemplateName
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getTemplateData();
                    this.$toast.open({
                        message: 'Template name updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
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
        // create invoice from template redirect link
        createInvoiceFromTemp(id) {
            this.$router.push('/accounting/invoice/' + id + '/createFromTemplate');
        }
    }    
}
</script>

<style scoped>
    .edit-icon-pen {
        color: green;
    }
</style>

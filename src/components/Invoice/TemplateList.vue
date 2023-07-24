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
                        <span>Templates</span>
                        <v-spacer />

                        <v-btn to="/accounting/invoice" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Invoice Template List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal pa-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchInvoice"/>
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="templateList" :search="search" :single-expand="singleExpand" class="table-hover-class mt-4" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.template_name`]="{ item }">
                                <router-link to="" @click.prevent="editTemplateName(item.selectable.id)">
                                    {{item.selectable.template_name ? item.selectable.template_name : '-'}} 
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                </router-link>
                            </template>
                            <template v-slot:[`item.invoice_number`]="{ item }">
                                {{item.selectable.invoice_number ? item.selectable.invoice_number : '-'}}
                            </template>
                            <template v-slot:[`item.invoice_issue_date`]="{ item }">
                                {{item.selectable.invoice_issue_date ? item.selectable.invoice_issue_date : '-'}}
                            </template>
                            <template v-slot:[`item.invoice_due_date`]="{ item }">
                                {{item.selectable.invoice_due_date ? item.selectable.invoice_due_date : '-'}}
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">    
                                <v-btn class="ma-2 bg-blue-lighten-4" variant="text" icon @click.prevent="createInvoiceFromTemp(item.selectable.id)">
                                    <v-icon color="blue-darken-2">
                                        mdi-plus
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Create Invoice From Template</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon :to="'/accounting/invoice/template/' + item.selectable.id + '/edit'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                                
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon  @click.prevent="deleteTemplate(item.selectable.id)">
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

       <!-- Modal Update Template -->
        <div class="modal fade" id="editTemplateNameModal" tabindex="-1" role="dialog" aria-labelledby="editTemplateNameModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Template Name</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    <label class="form-control-label" for="input-username">Template Name</label>
                                    <input type="text" placeholder="Template Name" :class="{'form-control': true }" v-model="selectedTemplateName">
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
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" @click.prevent="updateTemplateName">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
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
    data() {
        return {
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
            backendErrorMessage: '',
            multipleErrors: [],
            // selectedTemplate: {
            //     id: '',
            //     name: ''
            // }
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
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
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
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
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getTemplateData();
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
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
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.error) {
                    this.$toast.open({
                        message: error.response.data.error,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.$toast.open({
                            message: error.response.data.errors[0],
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                }
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
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.showLoader = false;
                }else {
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
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

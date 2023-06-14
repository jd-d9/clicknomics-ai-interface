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
                                    <li class="breadcrumb-item active" aria-current="page">{{ dynamicBredCrumb }}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right" v-if="!toggleElement">
                            <button type="submit" class="btn btn-lg btn-neutral btn_animated" @click.prevent="createInvoice">Create Invoice</button>
                        </div>
                        <div class="col-lg-6 text-right" v-else>
                            <router-link to="" type="button" class="btn btn-lg btn-neutral btn_animated" @click="openModal">Create New Template</router-link>
                            <button type="submit" class="btn btn-lg btn-neutral btn_animated" @click.prevent="updateTemplate">Update Template</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card shadow">
                            <div class="card-body">
                                <v-app data-app="true" id="app">
                                    <v-card variant="outlined" class="app-invoice-editable">
                                        <div class="py-5 px-4">
                                            <div class="invoice-header d-flex flex-wrap justify-space-between">
                                                <!-- Left Content -->
                                                <div class="col-5">
                                                    <div class="d-flex align-center mb-4">
                                                        <span class="field-wrapper-span company-name-field text--primary font-weight-bold text-xl">
                                                            <v-text-field v-model="invoiceData.companyName" outlined dense class="flex-grow-0 text-xl" label="Company Name" placeholder="Company Name" hide-details="auto"></v-text-field>
                                                        </span>
                                                    </div>
                                                    <span class="field-wrapper-span d-block">
                                                        <v-textarea auto-grow v-model="invoiceData.companyDetail" outlined rows="3" hide-details="auto" label="Company Detail" placeholder="Company Detail"></v-textarea>
                                                    </span>
                                                </div>
                                                <!-- Right Content -->
                                                <div class="text-right">
                                                    <div class="d-flex align-center justify-end">
                                                        <span class="me-2">Invoice Number:</span>
                                                        <span class="field-wrapper-span width-adding">
                                                            <v-text-field v-model="invoiceData.invoiceData.invoiceNumber" outlined dense class="header-inputs flex-grow-0" hide-details="auto"></v-text-field>
                                                        </span>
                                                    </div>
                                                    <div class="mt-3 d-flex align-center justify-end">
                                                        <span class="me-2">Date Issued: </span>
                                                        <datepicker
                                                        inputFormat="yyyy-MM-dd"
                                                        v-model="invoiceData.invoiceData.issuedDate"
                                                        :lowerLimit="new Date()"
                                                        :locale="locale"
                                                        :clearable="true"
                                                        />
                                                    </div>
                                                    <div class="mt-3 d-flex align-center justify-end">
                                                        <span class="me-2">Due Date: </span>
                                                        <datepicker
                                                        inputFormat="yyyy-MM-dd"
                                                        v-model="invoiceData.invoiceData.dueDate"
                                                        :locale="locale"
                                                        :lowerLimit="invoiceData.invoiceData.issuedDate"
                                                        :clearable="true"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider class="border-opacity-100"></v-divider>
                                        <!-- Payment Details -->
                                        <div class="py-5 px-4">
                                            <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
                                                <div class="field-wrapper-span col-md-12">
                                                    <v-textarea label="Bill To" auto-grow v-model="invoiceData.billTo" outlined rows="3" hide-details="auto" placeholder="Bill To"></v-textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider class="border-opacity-100"></v-divider>
                                        <!-- Add purchased products -->
                                        <div class="add-products-form py-5 px-4">
                                            <div class="single-product-form" v-for="(product, index) in invoiceData.purchasedProducts" :key="index">
                                                <div class="add-products-header mb-2 d-none d-md-flex">
                                                    <div class="px-4 flex-grow-1 font-weight-semibold">
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                                <span>Item</span>
                                                            </v-col>
                                                            <v-col cols="12" md="2">
                                                                <span>Cost</span>
                                                            </v-col>
                                                            <v-col cols="12" md="2">
                                                                <span>Quantity</span>
                                                            </v-col>
                                                            <v-col cols="12" md="2">
                                                                <span>Price</span>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                    <div class="header-spacer"></div>
                                                </div>
                                                <!-- Left Form -->
                                                <v-card outlined class="d-flex">
                                                    <div class="pa-5 pb-4 flex-grow-1 padding-top">
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                                <span class="field-wrapper-span">
                                                                    <v-textarea 
                                                                    v-model="product.description"
                                                                    outlined label="Description" 
                                                                    rows="3" hide-details="auto" 
                                                                    placeholder="Description"
                                                                    ></v-textarea>
                                                                </span>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4">
                                                                <span class="field-wrapper-span">
                                                                    <v-text-field
                                                                    v-model="product.cost"
                                                                    dense min="0"
                                                                    type="number" hide-details="auto"
                                                                    label="Cost" step="any"
                                                                    placeholder="$"
                                                                    ></v-text-field>
                                                                </span>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4">
                                                                <span class="field-wrapper-span">
                                                                    <v-text-field
                                                                    v-model="product.quantity"
                                                                    dense min="0"
                                                                    type="number" hide-details="auto"
                                                                    label="Quantity" placeholder="Quantity"
                                                                    ></v-text-field>
                                                                </span>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4">
                                                                <p class="my-2">
                                                                    <span class="d-inline d-md-none">Price: </span>
                                                                    <span>${{ product.cost * product.quantity }}</span>
                                                                </p>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                    <!-- Item Actions -->
                                                    <div class="d-flex flex-column item-actions rounded-0 pa-1">
                                                        <v-btn v-if="index != 0" icon small @click="invoiceData.purchasedProducts.splice(index, 1)">
                                                            <v-icon size="20">{{ 'mdi-close' }}</v-icon>
                                                        </v-btn>
                                                        <v-spacer></v-spacer>
                                                    </div>
                                                </v-card>
                                            </div>
                                            <v-btn color="primary" class="mt-4" variant="outlined" @click="addNewItem">Add Item</v-btn>
                                        </div>
                                        <v-divider class="border-opacity-100"></v-divider>
                                        <!-- Total -->
                                        <div class="py-5 px-4">
                                            <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
                                                <div class="mb-sm-0 col-md-6 pt-0">
                                                    <span class="field-wrapper-span">
                                                        <v-textarea auto-grow v-model="invoiceData.bankDetail" outlined label="Bank Detail" rows="3" hide-details="auto" placeholder="Bank Detail"></v-textarea>
                                                    </span>    
                                                </div>
                                                <div>
                                                    <table class="w-full">
                                                        <tr>
                                                            <td class="pe-16">Subtotal:</td>
                                                            <th class="text-right">${{totalRequest}}</th>
                                                        </tr>
                                                        <tr>
                                                        </tr>
                                                        <tr>
                                                            <td class="pe-16">Tax:</td>
                                                            <th class="text-right">{{invoiceData.invoiceData.tax}}</th>
                                                        </tr>
                                                    </table>
                                                    <v-divider class="border-opacity-100 mt-3 mb-2"></v-divider>
                                                    <table class="w-full">
                                                        <tr>
                                                            <td class="pe-16">Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                            <th class="text-right">${{totalRequest}}</th>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider class="border-opacity-100"></v-divider>
                                        <div class="px-4 py-5">
                                            <div class="mb-0">
                                                <p class="font-weight-semibold mb-4">TERMS:</p>
                                                <span class="field-wrapper-span">
                                                    <v-textarea
                                                    v-model="invoiceData.note"
                                                    auto-grow
                                                    outlined
                                                    rows="3"
                                                    hide-details="auto"
                                                    ></v-textarea>
                                                </span>
                                            </div>
                                        </div>
                                    </v-card>
                                </v-app>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Update Ads Account List-->
        <div class="modal fade" id="createNewTemplateModal" tabindex="-1" role="dialog" aria-labelledby="createNewTemplateModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Invoice Template</h5>
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
                                            <input type="text" :class="{'form-control': true, 'is-invalid': errorMessage}" v-model="templateName">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ errorMessage }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="saveAsNewTemplate">Save</button>
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
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
export default {
    components: {
        Datepicker,
    },
    data() {
        return {      
            appLogo: '',
            hideShowLoader: false,
            isIssueDateMenuOpen: false,
            isDueDateMenuOpen: false,
            clients: [],
            picked: new Date(),
            invoiceData: {
                invoiceData: {
                    invoiceNumber: Math.random().toString().slice(2, 6),
                    issuedDate: new Date(),
                    dueDate: new Date(),
                    tax: 0,
                    balance: 0,
                    total: 0,
                },
                purchasedProducts: [
                    {
                        cost: null,
                        quantity: 1,
                        description: '',
                    },
                ],
                bankDetail:'',
                billTo: 'Navy Blue Media Pte. Ltd. 10 Anson Road #13-09\nInternational Plaza Singapore (079903) \nReg No. 202029574W',
                companyName: 'Instant Profits Media™',
                companyDetail: 'Instant Profits Media LLC\n1611 Spring Gate Lane Unit #370878\nLas Vegas, NV, 89134\nPhone: +14074139604\nwww.instantprofitsmedia.com - info@instantprofitsmedia.com\nEIN: 82-1197063',
            },
            templateName: '',
            CurrentTemplateName: '',
            saveAsTemplate: 0,
            dynamicBredCrumb: 'Edit Template',
            toggleElement: true,
            isTempInvalid: false,
            errorMessage: ''
        }
    },
    computed: {
        totalRequest() {
            return this.invoiceData.purchasedProducts.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
        }
    },
    mounted() {
        this.getInvoiceData();
        if(location.pathname == '/accounting/invoice/'+ this.$route.params.id +'/createFromTemplate') {
            this.dynamicBredCrumb = 'Create Invoice From Template';
            this.toggleElement = false;
        }
    },
    methods: {
        // opening modal
        openModal() {
            window.$('#createNewTemplateModal').modal('show');
        },
        // closing modal
        closeModal() {
            window.$('#createNewTemplateModal').modal('hide');
        },
        // add new product in product table
        addNewItem() {
            this.invoiceData.purchasedProducts.push({
                cost: null,
                quantity: 1,
                description: '',
            })
        },
        // save invoice
        createInvoice() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/invoice', {
                invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                invoiceData: JSON.stringify( this.invoiceData),
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/accounting/invoice');
                    this.$toast.open({
                        message: 'Invoice created',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // get invoice data for edit
        getInvoiceData() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/invoices/invoicetemplateShow/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.CurrentTemplateName = response.data.data.template_name;
                    this.invoiceData = JSON.parse(response.data.data.invoiceData);
                    this.invoiceData.invoiceData.issuedDate = new Date(this.invoiceData.invoiceData.issuedDate);
                    this.invoiceData.invoiceData.dueDate = new Date(this.invoiceData.invoiceData.dueDate);
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // update template
        updateTemplate() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/invoices/updateTemplate/' + this.$route.params.id, {
                template_name: this.CurrentTemplateName,
                invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                invoiceData: JSON.stringify( this.invoiceData),
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/accounting/invoice/template');
                    this.$toast.open({
                        message: 'Template updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // template name validation
        templateNameIsValid() {
            if(!this.templateName) {
                this.isTempInvalid = true;
                this.errorMessage = 'Template name can not be empty'
            }
            else {
                this.isTempInvalid = false;
                this.errorMessage = ''
            }
        },
        // save data as template
        saveAsNewTemplate() {
            this.templateNameIsValid();
            if(!this.templateName || this.errorMessage || this.isTempInvalid) {
                return false;
            }
            else {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/accounting/invoices/saveTemplate', {
                    template_name: this.templateName,
                    invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                    invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                    invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                    invoiceData: JSON.stringify( this.invoiceData),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/invoice/template');
                        this.closeModal();
                        this.$toast.open({
                            message: 'Template created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.hideShowLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.errorMessage = error;
                    this.hideShowLoader = false;
                });
            }
        },
    }
}
</script>

<style scoped>
    .v-field {
        width: 400px;
    }
    .v-application__wrap {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }
    .add-width {
        width: 120px;
    }
    .app-invoice-editable {
        border-color: rgba(0, 0, 0, 0.1);
    }
    .app-invoice-editable .input-salesperson {
        width: 100px;
    }
    .app-invoice-editable .select-invoice-to {
        width: 190px !important;
    }
    .app-invoice-editable .header-inputs {
        width: 122px;
    }
    .app-invoice-editable .add-products-form .single-product-form:not(:first-child){
        margin-top: 2rem;
    }
    .app-invoice-editable .add-products-form .header-spacer {
        width: 39px;
    }
    .outlined-add-button {
        margin-top: 15px;
        color: #3f51b5;
        text-transform: uppercase;
        border: 1px solid #3f51b5;
        border-radius: 4px;
        height: 36px;
        min-width: 64px;
        padding: 0 16px;
    }
    .outlined-add-button:hover {
        background-color: rgb(240, 241, 249);
    }
    .field-wrapper-span {
        width: 100% !important;
    }
    .field-wrapper-span:first-child {
        width: 50% !important;
    }
    .padding-top {
        padding-top: 32px !important;
    }
    .width-adding, .app-invoice-editable .header-inputs {
        width: 130px !important;
    }
</style>

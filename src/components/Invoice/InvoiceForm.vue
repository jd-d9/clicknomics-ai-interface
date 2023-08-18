<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <router-link to="/accounting/invoice" class="d-flex align-center">
                                <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                                <span>Invoices</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>{{ dynamicBredCrumb }} Invoice</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div v-if="!isHidden">
                            <div class="button_div" v-if="toggleElement">
                                <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-content-save" >
                                    Save As Template
                                </v-btn>
                                <v-btn @click.prevent="saveInvoice" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-content-save" >
                                    Save Invoice
                                </v-btn>
                                <v-btn to="/accounting/invoice" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                    Back
                                </v-btn>
                            </div>
                            <div class="button_div" v-else>
                                <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-content-save" >
                                    Save As Template
                                </v-btn>
                                <v-btn @click.prevent="updateInvoice" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-content-save" >
                                    Update Invoice
                                </v-btn>
                                <v-btn to="/accounting/invoice" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                    Back
                                </v-btn>
                            </div>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            {{ dynamicBredCrumb }} Invoice
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" />     

                        <v-row class="mb-4">
                            <!-- Left Company detail -->
                            <v-col cols="12" sm="12" md="5" lg="5" class="font-medium font-weight-normal position-2">
                                <div class="mb-4">
                                    <label class="form-control-label">Company Name</label>
                                    <input v-model="invoiceData.companyName" class="form-control" label="Company Name" placeholder="Company Name" hide-details="auto" />
                                </div>
                                <div>
                                    <label class="form-control-label">Company Detail</label>
                                    <textarea class="form-control" name="Notes" rows="6" v-model="invoiceData.companyDetail" placeholder="Company Detail"></textarea>
                                </div>
                            </v-col>
                            <v-spacer />

                            <!-- Right Invoice number and date -->
                            <v-col cols="12" sm="12" md="5" lg="4" class="font-medium font-weight-normal position-1">
                                <div class="mb-4 d-flex align-center justify-end">
                                    <label class="mb-0 mr-2">Invoice Number</label>
                                    <input v-model="invoiceData.invoiceData.invoiceNumber" class="form-control" label="Company Name" placeholder="Invoice Number" hide-details="auto" style="width:100px" />
                                </div>
                                <div class="mb-4 d-flex align-center justify-end">
                                    <label class="mb-0 mr-2" style="width:130px">Date Issued</label>
                                    <datepicker v-model:value="invoiceData.invoiceData.issuedDate" :lowerLimit="new Date()" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </div>
                                <div class="mb-4 d-flex align-center justify-end">
                                    <label class="mb-0 mr-2" style="width:130px">Due Date</label>
                                    <datepicker v-model:value="invoiceData.invoiceData.dueDate" :lowerLimit="invoiceData.invoiceData.issuedDate" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </div>
                            </v-col>
                        </v-row>
                        <v-divider class="border-opacity-100 my-4" color="success" />    
                        <v-row>
                            <!-- Payment Details -->
                            <v-col cols="12" sm="12" md="5" lg="5" class="font-medium font-weight-normal">
                                <div>
                                    <label class="form-control-label">Bill To</label>
                                    <textarea class="form-control" name="billto" rows="5" v-model="invoiceData.billTo" placeholder="Bill To"></textarea>
                                </div>
                            </v-col>
                        </v-row>

                        <!-- Add items and cost -->
                        <v-row v-for="(product, index) in invoiceData.purchasedProducts" :key="index">
                            <v-col cols="12" sm="12" md="5" lg="5" class="font-medium font-weight-normal">
                                <label class="form-control-label">Item</label>
                                <textarea v-model="product.description" rows="1" placeholder="Description" @blur="descriptionValidation(product.description)" :class="{'form-control': true, 'border-red-600': invalidDescription}"
                                ></textarea>
                                <span v-if="invalidDescription" class="text-red-600">{{ invalidDescription }}</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="2" lg="2" class="font-medium font-weight-normal">
                                <label class="form-control-label">Cost</label>
                                <input v-model="product.cost" dense min="0" type="number" placeholder="Cost" @blur="costValidation(product.cost)" :class="{'form-control': true, 'border-red-600': invalidDescription}" />
                                <span v-if="invalidCost" class="text-red-600">{{ invalidCost }}</span>
                            </v-col>

                            <v-col cols="12" sm="12" md="2" lg="2" class="font-medium font-weight-normal">
                                <label class="form-control-label">Quantity</label>
                                <input v-model="product.quantity" dense min="0" type="number" placeholder="Quantity" class="form-control"/>
                            </v-col>
                            <v-col cols="12" sm="12" md="2" lg="2" class="font-medium font-weight-normal">
                                <label class="form-control-label">Price</label>
                                <p class="my-2">
                                    <span class="d-inline d-md-none">Price: </span>
                                    <strong>${{ product.cost * product.quantity }}</strong>
                                </p>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" lg="1" class="font-medium font-weight-normal">
                                <label class="form-control-label"></label>
                                <v-btn class="ma-2 bg-blue-lighten-4" variant="text" icon @click="addNewItem">
                                    <v-icon color="blue-darken-2">
                                        mdi-plus
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Add Item</v-tooltip>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="12" md="1" lg="1" class="font-medium font-weight-normal" v-if="index != 0">
                                <label class="form-control-label"></label>
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click="invoiceData.purchasedProducts.splice(index, 1)">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Remove Item</v-tooltip>
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row>
                            <!-- Bank Detail -->
                            <v-col cols="12" sm="12" md="5" lg="5" class="font-medium font-weight-normal">
                                <div>
                                    <label class="form-control-label">Bank Detail</label>
                                    <textarea v-model="invoiceData.bankDetail" rows="5" placeholder="Bank Detail" @blur="bankDetailsValidation(invoiceData.bankDetail)" :class="{'form-control': true, 'border-red-600': invalidBankDetails}"
                                    ></textarea>
                                    <span v-if="invalidBankDetails" class="text-red-600">{{ invalidBankDetails }}</span>
                                </div>
                            </v-col>
                            <v-spacer />
                            <v-col cols="12" sm="12" md="4" lg="3" class="font-medium font-weight-normal mt-5">
                                <table style="width: 100%;">
                                    <tr>
                                        <td><strong>Subtotal</strong></td>
                                        <th class="text-right">${{totalRequest}}</th>
                                    </tr>
                                    <tr>
                                    </tr>
                                    <tr>
                                        <td><strong>Tax</strong></td>
                                        <th class="text-right">{{invoiceData.invoiceData.tax}}</th>
                                    </tr>
                                </table>
                                <v-divider class="border-opacity-100 mt-3 mb-2"></v-divider>
                                <table style="width: 100%;">
                                    <tr>
                                        <td><strong>Total</strong></td>
                                        <th class="text-right">${{totalRequest}}</th>
                                    </tr>
                                </table>
                            </v-col>
                        </v-row>

                        <v-row>
                            <!-- Payment Details -->
                            <v-col cols="12" sm="12" md="5" lg="5" class="font-medium font-weight-normal">
                                <div>
                                    <label class="form-control-label">Terms</label>
                                    <textarea class="form-control" name="terms" rows="5" v-model="invoiceData.note" placeholder="Terms"></textarea>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Update Ads Account List-->
        <div class="modal fade" id="saveAsTemplateModal" tabindex="-1" role="dialog" aria-labelledby="saveAsTemplateModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Invoice Template</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0">
                                    <label class="form-control-label" for="input-username">Template Name</label>
                                    <input type="text" :class="{'form-control': true, 'border-red-600': errorMessage}" v-model="templateName">
                                    <span class="text-red-600" role="alert">{{ errorMessage }}</span>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save" @click.prevent="saveTemplate">Save</v-btn>    
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
import axios from '@axios';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import moment from 'moment';
export default {
    components: {
        Datepicker,
    },
    data() {
        return {   
            message: {},   
            appLogo: '',
            showLoader: false,
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
            saveAsTemplate: 1,
            dynamicBredCrumb: 'Create',
            toggleElement: true,
            isTempInvalid: false,
            errorMessage: '',
            invalidDescription: '',
            invalidCost: '',
            invalidBankDetails: '',
            isHidden: false
        }
    },
    computed: {
        totalRequest() {
            return this.invoiceData.purchasedProducts.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        if(this.$route.params.id) {
            this.dynamicBredCrumb = 'Edit';
            this.toggleElement = false;
            this.getInvoiceData();
        }
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // opening modal
        openModal() {
            this.errorMessage = '';
            this.addValidation();
            this.addValidationTwo();
            this.bankDetailsValidation(this.invoiceData.bankDetail);
            if(this.invalidDescription || this.invalidCost || this.invalidBankDetails) {
                return false;
            }
            else {
                window.$('#saveAsTemplateModal').modal('show');
            }
        },
        // closing modal
        closeModal() {
            window.$('#saveAsTemplateModal').modal('hide');
        },
        // add validations
        addValidation() {
            const value = this.invoiceData.purchasedProducts.filter((val) => {
                return val.description == '';
            })
            if(value.length != 0) {
                this.invalidDescription = 'Description is a required field';
            }
            else {
                this.invalidDescription = '';
            }
        },
        // add validations
        addValidationTwo() {
            const value = this.invoiceData.purchasedProducts.filter((val) => {
                return val.cost == null;
            })
            if(value.length != 0) {
                this.invalidCost = 'Cost is a required field';
            }
            else {
                this.invalidCost = '';
            }
        },
        // description validation
        descriptionValidation(val) {
            if(!val) {
                this.invalidDescription = 'Description is a required field';
            }
            else {
                this.invalidDescription = '';
            }
        },
        // cost validation
        costValidation(val) {
            if(!val) {
                this.invalidCost = 'Cost is a required field';
            }
            else {
                this.invalidCost = '';
            }
        },
        // bank details validation
        bankDetailsValidation(val) {
            if(!val) {
                this.invalidBankDetails = 'Bank details is a required field';
            }
            else {
                this.invalidBankDetails = '';
            }
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
        saveInvoice() {
            this.addValidation();
            this.addValidationTwo();
            this.bankDetailsValidation(this.invoiceData.bankDetail);
            if(this.invalidDescription || this.invalidCost || this.invalidBankDetails) {
                return false;
            }
            else {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/invoice', {
                    invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                    invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                    invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                    invoiceData: JSON.stringify( this.invoiceData),
                    // is_invoice_edited: '0'
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/invoice');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // get invoice data for edit
        getInvoiceData() {
            this.showLoader = true;
            axios.get(this.$api + '/accounting/invoice/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.invoiceData = JSON.parse(response.data.data.invoiceData);
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
        // update invoice
        updateInvoice() {
            this.showLoader = true;
            axios.post(this.$api + '/accounting/invoice/' + this.$route.params.id, {
                _method: 'PUT',
                invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                invoiceData: JSON.stringify( this.invoiceData),
                // is_invoice_edited: '0'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/accounting/invoice');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
        // template name validation
        templateNameIsValid() {
            if(!this.templateName) {
                this.isTempInvalid = true;
                this.errorMessage = 'Template name is a required field'
            }
            else {
                this.isTempInvalid = false;
                this.errorMessage = ''
            }
        },
        // save data as template
        saveTemplate() {
            this.templateNameIsValid();
            if(!this.templateName || this.errorMessage || this.isTempInvalid) {
                return false;
            }
            else {
                this.showLoader = true;
                axios.post(this.$api + '/accounting/invoices/saveTemplate', {
                    invoice_number: this.invoiceData.invoiceData.invoiceNumber,
                    invoice_issue_date: moment(this.invoiceData.invoiceData.issuedDate).format('YYYY-MM-DD'),
                    invoice_due_date: moment(this.invoiceData.invoiceData.dueDate).format('YYYY-MM-DD'),
                    invoiceData: JSON.stringify( this.invoiceData),
                    template_name: this.templateName,
                    save_as_template: this.saveAsTemplate,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/invoice/template');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.showLoader = false;
                        this.closeModal();
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
    }
}
</script>
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
                                    <li class="breadcrumb-item active" aria-current="page">Invoice Create</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="" type="button" class="btn btn-lg btn-neutral btn_animated">Save As Template</router-link>
                            <button type="submit" class="btn btn-lg btn-neutral btn_animated">Save Invoice</button>
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
                                    <v-card class="app-invoice-editable">
                                        <!-- Header -->
                                        <div class="py-5 px-4">
                                            <div class="invoice-header d-flex flex-wrap justify-space-between">
                                                <!-- Left Content -->
                                                <div class="mb-3 col-5">
                                                    <div class="d-flex align-center">
                                                        <!-- Instant Profits Media™ -->
                                                        <span class="font-weight-bold text-xl">
                                                            <v-text-field
                                                                label="Company Name"
                                                                v-model.number="invoiceData.companyName"
                                                                placeholder="Company Name"
                                                                variant="solo"
                                                                class="company-details"
                                                            ></v-text-field>
                                                        </span>
                                                    </div>
                                                    <span class="d-block">
                                                        <v-textarea auto-grow 
                                                        v-model="invoiceData.companyDetail" 
                                                        outlined rows="3" hide-details="auto" 
                                                        label="Company Detail" placeholder="Company Detail" 
                                                        variant="solo"
                                                        :error-messages="errors"
                                                        ></v-textarea>
                                                    </span>
                                                </div>
                                                <!-- Right Content -->
                                                <div class="text-right">
                                                    <div class="mb-4 d-flex align-center">
                                                        <span class="me-2 add-width">Invoice Number:</span>
                                                        <v-text-field v-model.number="invoiceData.invoiceData.invoiceNumber" 
                                                        outlined dense class="header-inputs flex-grow-0" 
                                                        variant="solo" hide-details="auto" 
                                                        :error-messages="errors"
                                                        ></v-text-field>
                                                    </div>
                                                    <div class="mb-4 d-flex align-center">
                                                        <span class="me-2 add-width">Date Issued: </span>
                                                        <datepicker
                                                        v-model="picked"
                                                        :locale="locale"
                                                        :upperLimit="to"
                                                        :lowerLimit="from"
                                                        :clearable="true"
                                                        />
                                                        <!-- <date-picker class="invoice-date-picker d-block" valueType="format" format="YYYY-MM-DD" :error-messages="errors"></date-picker> -->
                                                    </div>
                                                    <div class="mb-4 d-flex align-center">
                                                        <span class="me-2 add-width">Due Date: </span>
                                                        <datepicker v-model="picked"
                                                        :locale="locale" :upperLimit="to" :lowerLimit="from" :clearable="true"/>
                                                        <!-- <date-picker class="invoice-date-picker d-block" valueType="format" format="YYYY-MM-DD" :error-messages="errors"></date-picker> -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider></v-divider>
                                        <!-- Payment Details -->
                                        <div class="py-5 px-4">
                                            <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
                                                <div class="col-md-12">
                                                    <v-textarea label="Bill To" 
                                                    auto-grow outlined rows="3" 
                                                    variant="solo" hide-details="auto" 
                                                    placeholder="Bill To"
                                                    ></v-textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider></v-divider>
                                        <!-- Add purchased products -->
                                        <div class="add-products-form py-5 px-4">
                                            <div class="single-product-form">
                                                <div class="add-products-header mb-2 d-none d-md-flex">
                                                    <div class="px-5 flex-grow-1 font-weight-semibold">
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
                                                    <div class="pa-5 flex-grow-1">
                                                        <v-row>
                                                            <v-col cols="12" md="6">
                                                                <v-textarea outlined label="Description" rows="3" 
                                                                hide-details="auto" 
                                                                placeholder="Description"
                                                                variant="solo"
                                                                ></v-textarea>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4">
                                                                <v-text-field
                                                                outlined
                                                                dense
                                                                min="0"
                                                                type="number"
                                                                hide-details="auto"
                                                                variant="solo"
                                                                label="Cost"
                                                                step="any"
                                                                placeholder="$"
                                                                ></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4" >
                                                                <v-text-field
                                                                outlined
                                                                dense
                                                                min="0"
                                                                type="number"
                                                                variant="solo"
                                                                hide-details="auto"
                                                                label="Quantity"
                                                                placeholder="Quantity"
                                                                ></v-text-field>
                                                            </v-col>
                                                            <v-col cols="12" md="2" sm="4">
                                                                <p class="my-2">
                                                                <span class="d-inline d-md-none">Price: </span>
                                                                <span>$020</span>
                                                                </p>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                    <!-- Item Actions -->
                                                    <div class="d-flex flex-column item-actions rounded-0 pa-1">
                                                        <v-btn icon small @click="invoiceData.purchasedProducts.splice(purchasedProductIndex, 1)">
                                                            <v-icon size="20">
                                                                {{ 'mdi-close' }}
                                                            </v-icon>
                                                        </v-btn>
                                                        <v-spacer></v-spacer>
                                                    </div>
                                                </v-card>
                                            </div>
                                            <button class="outlined-add-button" @click.prevent="addNewItem"> Add Item </button>
                                        </div>
                                        <v-divider></v-divider>
                                        <!-- Total -->
                                        <div class="py-5 px-4">
                                            <div class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
                                                <div class="mb-6 mb-sm-0 col-md-6 pt-0">
                                                    <v-textarea auto-grow outlined label="Bank Detail" 
                                                    rows="3" hide-details="auto" 
                                                    variant="solo"
                                                    placeholder="Bank Detail"></v-textarea>
                                                </div>
                                                <div>
                                                    <table class="w-full">
                                                        <tr>
                                                            <td class="pe-16">Subtotal: </td>
                                                            <th class="text-right">${{invoiceData.invoiceData.balance}}</th>
                                                        </tr>
                                                        <tr>
                                                        </tr>
                                                        <tr>
                                                            <td class="pe-16">Tax:</td>
                                                            <th class="text-right">{{invoiceData.invoiceData.tax}}</th>
                                                        </tr>
                                                    </table>
                                                    <v-divider class="mt-4 mb-3"></v-divider>
                                                    <table class="w-full">
                                                        <tr>
                                                            <td class="pe-16">Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                                            <th class="text-right">${{totalRequest}}</th>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <v-divider></v-divider>
                                        <div class="px-5 py-4">
                                            <div class="mb-0">
                                                <p class="font-weight-semibold mb-2">TERMS:</p>
                                                <v-textarea auto-grow outlined 
                                                rows="3" hide-details="auto"
                                                variant="solo"
                                                ></v-textarea>
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
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Invoice Template</h5>
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
                                            <label class="form-control-label" for="input-username">Template Name</label>
                                            <input type="text" :class="{'form-control': true, 'border-red-600':errors!= '' ? true : false  }" v-model="templateName">
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
import Datepicker from "vue3-datepicker";
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
            totalRequest: '0.00',
            invoiceData: {
                invoiceData: {
                    invoiceNumber: Math.random().toString().slice(2, 6),
                    issuedDate: '',
                    dueDate: '',
                    tax: 0,
                    balance: '0.00',
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
                billTo: '',
                companyName: 'Instant Profits Media™',
                companyDetail: 'Instant Profits Media LLC\n1611 Spring Gate Lane Unit #370878\nLas Vegas, NV, 89134\nPhone: +14074139604\nwww.instantprofitsmedia.com - info@instantprofitsmedia.com\nEIN: 82-1197063',
            },
            templateName: '',
            saveAsTemplate: 0,
            messages: [
                {
                avatar: 'https://avatars0.githubusercontent.com/u/9064066?v=4&s=460',
                name: 'John Leider',
                title: 'Welcome to Vuetify!',
                excerpt: 'Thank you for joining our community...',
                },
                {
                color: 'red',
                icon: 'mdi-account-multiple',
                name: 'Social',
                new: 1,
                total: 3,
                title: 'Twitter',
                },
                {
                color: 'teal',
                icon: 'mdi-tag',
                name: 'Promos',
                new: 2,
                total: 4,
                title: 'Shop your way',
                exceprt: 'New deals available, Join Today',
                },
            ],
            lorem: 'Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.',
            
        }
    },
    methods: {

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
</style>

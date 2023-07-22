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
                        <span>Ads Accounts</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Ads Accounts List
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design">
                                    <v-select clearable variant="outlined" placeholder="Custom Filter" v-model="value" :items="items" chips multiple @update:modelValue="filterList"></v-select>
                                </v-col>
                                <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                    <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="adsAccountsList" :search="search" :single-expand="singleExpand" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.account_id`]="{ item }">
                                {{item.selectable.account_id ? item.selectable.account_id : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                <div class="text-ellipsis w-150">{{item.selectable.name ? item.selectable.name : '-'}}</div>
                            </template>
                            <template v-slot:[`item.traffic_source`]="{ item }">
                                {{item.selectable.traffic_source ? item.selectable.traffic_source : '-'}}
                            </template>
                            <template v-slot:[`item.payment_method`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.payment_method ? item.selectable.payment_method : '-'}}
                                    <v-tooltip activator="parent" location="top" v-if="item.selectable.payment_method">{{item.selectable.payment_method}}</v-tooltip>
                                </div>
                            </template>
                            <template v-slot:[`item.payment_setting`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.payment_setting ? item.selectable.payment_setting : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.management_system`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.management_system ? item.selectable.management_system : '-'}}
                                    <v-tooltip activator="parent" location="top" v-if="item.selectable.management_system">{{item.selectable.management_system}}</v-tooltip>
                                </div>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.status ? item.selectable.status : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.address`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.address ? item.selectable.address : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.phone`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.phone ? item.selectable.phone : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.email ? item.selectable.email : '-'}}
                                    <v-tooltip activator="parent" location="top" v-if="item.selectable.email">{{item.selectable.email}}</v-tooltip>
                                </div>
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.notes ? item.selectable.notes : '-'}}
                                    <v-tooltip activator="parent" location="top" v-if="item.selectable.notes">{{item.selectable.notes}}</v-tooltip>
                                </div>
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click="edit(item.selectable.account_id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
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

        <!-- Update Ads Account List-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Ads Accounts</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div> 

                    <Form @submit="updateAdsAccountsData" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Account Status</label>
                                    <Field name="Status" v-model="item.status">
                                        <v-select :class="{'form-control autocomplete': true , 'border-red-600':errors.Status}" name='Status' :items="statusList" v-model="item.status"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Status">Account status can not be empty</span>
                                </v-col>
                                
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Payment Setting</label>
                                    <v-select :class="{'form-control autocomplete': true}" :items="paymentSettingList" v-model="item.payment_setting"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Email</label>
                                    <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Email" v-model="item.email">
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Phone</label>
                                    <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Phone" v-model="item.phone">
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Address</label>
                                    <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Address" v-model="item.address">
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Payment Method</label>
                                    <v-select :class="{'form-control autocomplete': true}" :items="paymentMethodList" v-model="item.payment_method"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Management System Type</label>
                                    <v-select @update:modelValue="updateData(item.management_type)" :class="{'form-control autocomplete': true}" :items="managementSystemType" v-model="item.management_type"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal" v-if="item.management_type">
                                    <label class="form-control-label" for="input-username">Management System</label>
                                    <Field name="Management" v-model="item.management_system">
                                        <v-select :class="{'form-control autocomplete': true, 'border-red-600':errors.Management}" name="Management" :items="managementSystem" v-model="item.management_system"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Management">Management system can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <textarea :class="{'form-control': true}"  name="" rows="3" v-model="item.notes"></textarea>
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
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Field, Form } from 'vee-validate';
export default {
    // props: ['list', 'datacenter', 'residential', 'multilogin', 'localsystem'],
    components: {
        Field, 
        Form, 
    },
    data() {
        return {
            showLoader: false,
            search: '',
            googleHeaders: [
                { title: 'ID', key: 'account_id' },
                { title: 'Account Name', key: 'name' },
                { title: 'Traffic Source', key: 'traffic_source' },
                { title: 'Payment Method', key: 'payment_method' },
                { title: 'Payment Setting', key: 'payment_setting' },
                { title: 'Management System', key: 'management_system' },
                { title: 'Account Status', key: 'status' },
                { title: 'Address', key: 'address' },
                { title: 'Phone', key: 'phone' },
                { title: 'Email', key: 'email' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action' },
            ],
            residential: [],
            dataCenter: [],
            multiLogin: [],
            localSystem: [],
            adsAccountsList: [],
            adsAccountsListFilter: [],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            items: ['GOOGLE', 'MICROSOFT'],
            value: ['GOOGLE', 'MICROSOFT'],
            statusList: [
                {
                    title: 'Active'
                },
                {
                    title: 'InActive'
                },
                {
                    title: 'Blocked'
                },
                {
                    title: 'Lost'
                },
            ],
            paymentSettingList: [
                {
                    title: 'Postpay'
                },
                {
                    title: 'Prepay'
                },
            ],
            paymentMethodList: [
                {
                    title: 'RM AMEX Plum Card'
                },
                {
                    title: 'IPM AMEX Plum Card'
                },
                {
                    title: 'IPM Divvy Card'
                },
                {
                    title: 'IPM Chase Ink Card'
                },
            ],
            managementSystemType: [
                {
                    title: 'Local'
                },
                {
                    title: 'Data Center VPS'
                },
                {
                    title: 'Residential VPS'
                },
                {
                    title: 'Multilogin'
                },
            ],
            managementSystem: [],
            item: {
                id:'',
                status: '',
                payment_setting: '',
                email: '',
                phone: '',
                address: '',
                payment_method: '',
                notes: '',
                traffic_source: '',
                management_type: '',
                management_system: ''
            },
            permissions: {},
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        this.getAdAccountListing();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    computed: {
        schema() {
            return yup.object({
                Status: yup.string().required(),
                Management: yup.string().required(),
            });
        },
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // filtering listing
        filterList() {
            this.adsAccountsList = this.adsAccountsListFilter.filter(data => this.value.find(rm => (rm === data.traffic_source)));
        },
        // get data for listing
        getAdAccountListing() {
            this.showLoader = true;
            this.axios.get(this.$api + '/adsaccount', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    console.log(Data, '-- Data --')
                    this.adsAccountsList = Data.data;
                    this.adsAccountsListFilter = Data.data;
                    Data.datacenter.forEach((val) => {
                        this.dataCenter.push({
                            title: val.company,
                            key: val.text
                        }) 
                    });
                    Data.residential.forEach((val) => {
                        this.residential.push({
                            title: val.company,
                            key: val.text
                        }) 
                    });
                    Data.multilogin.forEach((val) => {
                        this.multiLogin.push({
                            title: val.profile_name,
                            key: val.text
                        }) 
                    });
                    Data.localsystem.forEach((val) => {
                        this.localSystem.push({
                            title: val.company,
                            key: val.text
                        }) 
                    });
                    this.permissions = Data.permission;
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
                console.log(error);
                this.showLoader = false;
            });
        },
        // get data for edit and set values in respected fields
        edit(id) {
            const result = this.adsAccountsList.find((val) => {
                return val.account_id == id
            });
            this.item.id = id;
            this.item.status = result.status;
            this.item.traffic_source = result.traffic_source ? result.traffic_source : '';
            this.item.payment_setting = result.payment_setting ? result.payment_setting : '';
            this.item.email = result.email ? result.email : '';
            this.item.phone = result.phone ? result.phone : '';
            this.item.address = result.address ? result.address : '';
            this.item.payment_method = result.payment_method ? result.payment_method : '';
            this.item.notes = result.notes ? result.notes : '';
            this.item.management_type = result.management_type ? result.management_type : '';
            this.item.management_system = result.management_system ? result.management_system : '';
            if(this.item.management_type == 'Residential VPS'){
                this.managementSystem = this.residential;
            }else if(this.item.management_type == 'Data Center VPS'){
                this.managementSystem = this.dataCenter;
            }else if(this.item.management_type == 'Multilogin'){
                this.managementSystem = this.multiLogin;
            }else if(this.item.management_type == 'Local'){
                this.managementSystem = this.localSystem;
            }
            this.openModal();
        },
        // update ad account data
        updateAdsAccountsData() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.item.id);
            formData.append('status', this.item.status);
            formData.append('traffic_source', this.item.traffic_source);
            formData.append('payment_setting', this.item.payment_setting);
            formData.append('email', this.item.email);
            formData.append('phone', this.item.phone);
            formData.append('address', this.item.address);
            formData.append('payment_method', this.item.payment_method);
            formData.append('notes', this.item.notes);
            formData.append('management_type', this.item.management_type);
            formData.append('management_system', this.item.management_system);
            formData.append('_method', 'PUT');
            this.axios.post(this.$api + '/adsaccount/' + this.item.id,  formData,{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Ads accounts updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                    this.getAdAccountListing();
                    this.closeModal();
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
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
        // update data
        updateData(newVal) {
            this.item.management_system  = '';
            if(newVal == 'Residential VPS'){
                this.managementSystem = this.residential;
            }else if(newVal == 'Data Center VPS'){
                this.managementSystem = this.dataCenter;
            }else if(newVal == 'Multilogin'){
                this.managementSystem = this.multiLogin;
            }else if(this.item.management_type == 'Local'){
                this.managementSystem = this.localSystem;
            }
        },
        // update data
        // updateData() {
        //     this.item.management_system  = '';
        //     if(this.item.management_type == 'Residential VPS'){
        //         this.managementSystem = this.residential;
        //     }else if(this.item.management_type == 'Data Center VPS'){
        //         this.managementSystem = this.dataCenter;
        //     }else if(this.item.management_type == 'Multilogin'){
        //         this.managementSystem = this.multiLogin;
        //     }else if(this.item.management_type == 'Local'){
        //         this.managementSystem = this.localSystem;
        //     }
        // }
    }
}
</script>

<style scoped>
.v-application--wrap {
    min-height: inherit !important;
}
</style>

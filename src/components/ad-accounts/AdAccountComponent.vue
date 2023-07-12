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
                                    <li class="breadcrumb-item active" aria-current="page">Ads Accounts</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <div class="card">
                        <div class="card shadow">
                            <div class="card-body">
                                <v-app>
                                    <v-card>
                                        <v-card-title>
                                            <v-row>
                                                <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                <v-col class="d-flex" cols="12" sm="4">
                                                    <v-select v-model="value" :items="items" chips label="Custom Filter" multiple solo @update:modelValue="filterList"></v-select>
                                                </v-col>
                                                <v-col class="d-flex search_width" cols="12" sm="4">
                                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-card-title>
                                        <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="googleHeaders" :items="adsAccountsList" :search="search" :single-expand="singleExpand" class="table-hover-class elevation-1" :itemsPerPage="itemsPerPage">
                                            <template v-slot:item="{ item }">
                                                <tr>
                                                    <td>{{item.selectable.account_id ? item.selectable.account_id : '-'}}</td>
                                                    <td class="text-ellipsis w-20">{{item.selectable.name ? item.selectable.name : '-'}}</td>
                                                    <td>{{item.selectable.traffic_source ? item.selectable.traffic_source : '-'}}</td>
                                                    <td class="text-ellipsis w-20">
                                                        {{item.selectable.payment_method ? item.selectable.payment_method : '-'}}
                                                        <v-tooltip activator="parent" location="bottom" v-if="item.selectable.payment_method">{{item.selectable.payment_method}}</v-tooltip>
                                                    </td>
                                                    <td class="text-ellipsis w-20">{{item.selectable.payment_setting ? item.selectable.payment_setting : '-'}}</td>
                                                    <td class="text-ellipsis w-20">
                                                        {{item.selectable.management_system ? item.selectable.management_system : '-'}}
                                                        <v-tooltip activator="parent" location="bottom" v-if="item.selectable.management_system">{{item.selectable.management_system}}</v-tooltip>
                                                    </td>
                                                    <td class="text-ellipsis w-20">{{item.selectable.status ? item.selectable.status : '-'}}</td>
                                                    <td class="text-ellipsis w-20">{{item.selectable.address ? item.selectable.address : '-'}}</td>
                                                    <td class="text-ellipsis w-20">{{item.selectable.phone ? item.selectable.phone : '-'}}</td>
                                                    <td class="text-ellipsis w-20">
                                                        {{item.selectable.email ? item.selectable.email : '-'}}
                                                        <v-tooltip activator="parent" location="bottom" v-if="item.selectable.email">{{item.selectable.email}}</v-tooltip>
                                                    </td>
                                                    <td class="text-ellipsis w-20">
                                                        {{item.selectable.notes ? item.selectable.notes : '-'}}
                                                        <v-tooltip activator="parent" location="bottom" v-if="item.selectable.notes">{{item.selectable.notes}}</v-tooltip>
                                                    </td>
                                                    <td>
                                                        <button class="disable-button" @click="edit(item.selectable.account_id)" :disabled="permissions.update_auth == '0'">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width">
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
                <div class="col" v-if="permissions.view != '1' && !showLoader">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
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
                        <h5 style="color:#fff;" class="modal-title">Update Ads Accounts</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <Form @submit="updateAdsAccountsData" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Account Status</label>
                                            <Field name="Status" v-model="item.status">
                                                <v-select :class="{'form-control': true , 'border-red-600':errors.Status}" name='Status' :items="statusList" v-model="item.status"></v-select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Status">Account status can not be empty</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Payment Setting</label>
                                            <v-select :class="{'form-control': true}" :items="paymentSettingList" v-model="item.payment_setting"></v-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Email" v-model="item.email">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Phone</label>
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Phone" v-model="item.phone">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Address</label>
                                            <input type="text" id="input-username" :class="{'form-control': true}" placeholder="Address" v-model="item.address">
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Payment Method</label>
                                            <v-select :class="{'form-control': true}" :items="paymentMethodList" v-model="item.payment_method"></v-select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Management System Type</label>
                                            <v-select @update:modelValue="updateData(item.management_type)" :class="{'form-control': true}" :items="managementSystemType" v-model="item.management_type"></v-select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0" v-if="item.management_type">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Management System</label>
                                            <Field name="Management" v-model="item.management_system">
                                                <v-select :class="{'form-control': true, 'border-red-600':errors.Management}" name="Management" :items="managementSystem" v-model="item.management_system"></v-select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Management">Management system can not be empty</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Notes</label>
                                            <textarea :class="{'form-control': true}"  name="" cols="30" rows="5" v-model="item.notes"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
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
                { title: 'Action', key: '' },
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
        }
    },
    mounted() {
        this.getAdAccountListing();
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
                }
            })
            .catch(error => {
                console.log(error);
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
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

<template>
    <div>
        <loader-component v-if="showLoader"></loader-component>
        <v-card class="card_design mb-4">
            <v-card-title class="d-flex justify-space-between" v-if="toggleComponent">
                Create User
            </v-card-title>
            <v-card-title class="d-flex justify-space-between" v-else>
                Edit User
            </v-card-title>

            <v-divider class="border-opacity-100 my-4" color="success" />

            <Form @submit="manageUser" :validation-schema="schema" v-slot="{ errors }">
                <v-row>
                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">First Name</label>
                        <Field type="text" id="input-username" name="firstName" :class="{'form-control': true, 'border-red-600': errors.firstName}" placeholder="First Name" v-model.trim="firstName"/>
                        <span class="text-red-600" v-if="errors.firstName">First name is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Last Name</label>
                        <Field type="text" id="input-username" name="lastName" :class="{'form-control': true, 'border-red-600': errors.lastName}" placeholder="Last Name" v-model.trim="lastName"/>
                        <span class="text-red-600" v-if="errors.lastName">Last name is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Email</label>
                        <Field type="email" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model.trim="userEmail"/>
                        <ErrorMessage class="text-red-600" name="Email"/>
                    </v-col>    

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Company Name</label>
                        <Field type="text" id="input-username" name="companyName" :class="{'form-control': true, 'border-red-600': errors.companyName}" placeholder="Company Name" v-model.trim="companyName"/>
                        <span class="text-red-600" v-if="errors.companyName">Company name is a required field</span>
                    </v-col>   
                    
                    <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                        <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                    </v-col>

                    <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                        <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                    </v-col>
                    
                    <!-- <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Mobile Number</label>
                        <Field type="number" id="input-username" name="Mobile" :class="{'form-control': true, 'border-red-600': errors.Mobile}" placeholder="Mobile Number" v-model.trim="userContact"/>
                        <span class="text-red-600" v-if="errors.Mobile">Mobile number is a required field</span>
                    </v-col> -->
                </v-row>           

                <!-- <v-row>
                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Select Country Code</label>
                        <Field name="Country" v-model="selectedCountry" :class="{'border-red-600': errors.Country}">
                            <select name="Country" v-model="selectedCountry" :class="{'form-control': true, 'border-red-600': errors.Role}">
                                <option value="">Select Country Code</option>
                                <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                    {{item.dial_code}} - {{item.name}}
                                </option>
                            </select>
                        </Field>
                        <span class="text-red-600" v-if="errors.Country">Country code is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Status</label>
                        <Field name="Status" v-model="status" :class="{'border-red-600': errors.Status}">
                            <select :class="{'form-control': true, 'border-red-600': errors.Status}" name="Role" placeholder="Select User Status" v-model="status">
                                <option value="">Select Status</option>
                                <option value="1">Active</option>
                                <option value="0">In-Active</option>
                            </select>
                        </Field>
                        <span class="text-red-600" v-if="errors.Status">Status is a required field</span>
                    </v-col>
                </v-row> -->
                
                <v-row>
                    <v-col cols="12" sm="12" md="12" lg="12">
                        <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">{{toggleComponent ? 'Save' : 'Update'}}</v-btn>    
                        <v-btn type="reset" v-if="toggleComponent" class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-backup-restore">Reset</v-btn>    
                    </v-col>
                </v-row>
            </Form>                    
        </v-card>
    </div>
</template>

<script>
import axios from '@axios';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    components: {
        Form, 
        Field,
        ErrorMessage
    },
    data() {
        return {
            message: {},
            userEmail: '',
            firstName: '',
            lastName: '',
            companyName: '',
            // userContact: '',
            // selectedCountry: '91',
            // status: '',
            // countryDetails: [],
            showLoader: false,
            toggleComponent: true,
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // this.getAndSetCountry();
        if(this.$route.params.id) {       
            this.toggleComponent = false;
            this.editUserDetails(this.$route.params.id);
        }
    },
    computed: {
        schema() {
            return yup.object({
                firstName: yup.string().required(),
                lastName: yup.string().required(),
                Email: yup.string().required().email(),
                companyName: yup.string().required(),
                // Mobile: yup.string().required().min(10),
                // Country: yup.string().required(),
                // Status: yup.string().required(),
            });
        },
    },
    methods:{
        // save and update user
        manageUser() {
            // update user
            if(this.$route.params.id) {
                this.showLoader = true;
                axios.post(this.$api + '/settings/subscribeUser/' + this.$route.params.id, {
                    first_name: this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1),
                    last_name: this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1),
                    email: this.userEmail,
                    company_name: this.companyName,
                    // status: this.status,
                    // phone_number: this.userContact,
                    // country_code: this.selectedCountry,
                    _method: 'PUT'
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken(),
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/subscribed_user');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                        this.showLoader = false;
                    }else {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
            }
            // create user
            else {
                this.showLoader = true;
                axios.post(this.$api + '/settings/subscribeUser', {
                    first_name: this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1),
                    last_name: this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1),
                    email: this.userEmail,
                    company_name: this.companyName,
                    // status: this.status,
                    // phone_number: this.userContact,
                    // country_code: this.selectedCountry,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/subscribed_user');
                        this.showLoader = false;
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    }else {
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
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
            }
        },
        // edit user details
        editUserDetails(id) {
            this.showLoader = true;
            axios.get(this.$api + '/settings/subscribeUser/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    this.firstName = getData.first_name;
                    this.lastName = getData.last_name;
                    this.userEmail = getData.email;
                    this.companyName = getData.company_name;
                    // this.userContact = getData.phone_number
                    // this.status = getData.status
                    // this.selectedCountry = getData.country_code
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
        // get and set country code
        // getAndSetCountry() {
        //     this.showLoader = true;
        //     axios.get(this.$api + '/settings/countries', {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: this.getAccessToken(),
        //         }
        //     })
        //     .then(response => {
        //         if(response.data.success) {
        //             this.countryDetails = response.data.data;
        //             this.countryDetails.sort((a, b) => a.name - b.name);
        //             this.showLoader = false;
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         this.showLoader = false;
        //     });
        // },
        // reset form data
        // resetForm() {
        //     window.location.reload();
        // }
    }
}
</script>


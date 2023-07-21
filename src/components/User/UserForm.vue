<template>
    <div>
        <loader-component v-if="showLoader"></loader-component>
        <v-card class="card_design mb-4">
            <v-card-title class="d-flex justify-space-between">
                Users
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
                        <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                    </v-col>    

                    <!-- <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Mobile Number</label>
                        <Field type="number" id="input-username" name="Mobile" :class="{'form-control': true, 'border-red-600': errors.Mobile}" placeholder="Mobile Number" v-model.trim="userContact"/>
                        <span class="text-red-600" v-if="errors.Mobile">Mobile number is a required field</span>
                    </v-col> -->
                </v-row>           

                <v-row>
                    <!-- <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
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
                    </v-col> -->

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Company Name</label>
                        <Field type="text" id="input-username" name="companyName" :class="{'form-control': true, 'border-red-600': errors.companyName}" placeholder="Company Name" v-model.trim="companyName"/>
                        <span class="text-red-600" v-if="errors.companyName">Company name is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Role</label>
                        <Field name="Role" v-model="roleId" :class="{'border-red-600': errors.Role}">
                            <select :class="{'form-control': true, 'border-red-600': errors.Role}" name="Role" placeholder="Select Role" v-model="roleId">
                                <option value="">Select User Role</option>
                                <option :value="role.id" v-for="(role, index) in roles" :key="index">{{role.role_name}}</option>
                            </select>
                        </Field>
                        <span class="text-red-600" v-if="errors.Role">Role is a required field</span>
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
                </v-row>

                <v-row v-if="toggleComponent">
                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Password</label>
                        <Field type="password" id="input-username" name="Password" :class="{'form-control': true, 'border-red-600': errors.Password}" placeholder="Password" v-model.trim="userPassword"/>
                        <span class="text-red-600" v-if="errors.Password">Password is a required field</span>
                    </v-col>

                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                        <label class="form-control-label">Confirm Password</label>
                        <Field type="password" id="input-username" name="passwordConfirmation" :class="{'form-control': true, 'border-red-600': errors.passwordConfirmation}" placeholder="Confirm Password" v-model="confirmPassword"/>
                        <span class="text-red-600" v-if="errors.passwordConfirmation">Password did not match</span>
                    </v-col>
                </v-row>
                
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
            userEmail: '',
            userPassword: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            companyName: '',
            // userContact: '',
            // selectedCountry: '91',
            roleId: '',
            status: '',
            showLoader: false,
            roles: [],
            // countryDetails: [],
            toggleComponent: true,
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getUserRole();
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
                Password: !this.toggleComponent ? '' : yup.string().required(),
                passwordConfirmation: !this.toggleComponent ? '' : yup.string().required().oneOf([yup.ref('Password')], 'Passwords do not match'),
                // Mobile: yup.string().required().min(10),
                // Country: yup.string().required(),
                Role: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    methods:{
        // save and update user
        manageUser() {
            // update user
            if(this.$route.params.id) {
                this.showLoader = true;
                this.axios.post(this.$api + '/settings/user/' + this.$route.params.id, {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.userEmail,
                    password: this.userPassword,
                    role_id: this.roleId,
                    status: this.status,
                    company_name: this.companyName,
                    // phone_number: this.userContact,
                    // country_code: this.selectedCountry,
                    _method: 'PUT'
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/user');
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
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
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    console.log(error);
                    this.showLoader = false;
                });
            }
            // create user
            else {
                this.showLoader = true;
                this.axios.post(this.$api + '/settings/user', {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.userEmail,
                    password: this.userPassword,
                    role_id: this.roleId,
                    status: this.status,
                    company_name: this.companyName,
                    // phone_number: this.userContact,
                    // country_code: this.selectedCountry,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/settings/user');
                        this.showLoader = false;
                        this.backendErrorMessage = '';
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
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
                    console.log(error.response);
                    this.backendErrorMessage = error.message;
                    this.showLoader = false;
                }); 
            }
        },
        // get all user data
        getUserRole() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/role', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.roles = response.data.data.roles;
                    console.log(this.roles, 'this.roles')
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
        // edit user details
        editUserDetails(id) {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/user/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    this.firstName = getData.first_name;
                    this.lastName = getData.last_name;
                    this.userEmail = getData.email;
                    this.userPassword = getData.password;
                    this.roleId = getData.role_id;
                    this.status = getData.status;
                    this.companyName = getData.company_name;
                    // this.userContact = getData.phone_number
                    // this.selectedCountry = getData.country_code
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
        // get and set country code
        // getAndSetCountry() {
        //     this.showLoader = true;
        //     this.axios.get(this.$api + '/settings/countries', {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
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


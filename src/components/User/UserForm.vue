<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <Form @submit="manageUser" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Name</label>
                                            <Field type="text" id="input-username" class="form-control" name="Name" :class="{'border-red-600': errors.Name}" placeholder="Name" v-model.trim="userName"/>
                                            <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Name"/> -->
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <Field type="email" id="input-username" name="Email" class="form-control" :class="{'border-red-600': errors.Email}" placeholder="Email" v-model="userEmail"/>
                                            <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                            <ErrorMessage class="text-red-600" name="Email"/>
                                            <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" v-if="toggleComponent">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Password</label>
                                            <Field type="password" id="input-username" name="Password" class="form-control" :class="{'border-red-600': errors.Password}" placeholder="Password" v-model="userPassword"/>
                                            <span class="text-red-600" v-if="errors.Password">Password can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Password"/> -->
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Confirm Password</label>
                                            <Field type="password" id="input-username" name="Confirmpass" class="form-control" :class="{'border-red-600': errors.Confirmpass || invalidConfirmPassword}" placeholder="Confirm Password" @blur="confirmPasswordValid" v-model="confirmPassword"/>
                                            <span class="text-red-600" v-if="errors.Confirmpass">Confirm password can not be empty</span>
                                            <span class="text-red-600" v-if="invalidConfirmPassword">{{invalidConfirmPassword}}</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Confirmpass"/> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Select Country Code</label>
                                            <Field name="Country" v-model="selectedCountry" :class="{'border-red-600': errors.Country}">
                                                <select class="form-control" name="Country" v-model="selectedCountry" :class="{'border-red-600': errors.Country}">
                                                    <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                                        {{item.dial_code}} - {{item.name}}
                                                    </option>
                                                </select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Country">Country code can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Country"/> -->
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Mobile Number</label>
                                            <Field type="number" id="input-username" name="Mobile" class="form-control" :class="{'border-red-600': errors.Mobile}" placeholder="Mobile Number" v-model="userContact"/>
                                            <span class="text-red-600" v-if="errors.Mobile">Mobile number can not be empty or should be enter minimum 10 character</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Mobile"/> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Role</label>
                                            <Field name="Role" v-model="roleId" :class="{'border-red-600': errors.Role}">
                                                <select class="form-control" name="Role" placeholder="Select Role" v-model="roleId">
                                                    <option value="">Select User Role</option>
                                                    <option :value="role.id" v-for="(role, index) in roles" :key="index">{{role.role_name}}</option>
                                                </select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Role">Role can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Role"/> -->
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Status</label>
                                            <Field name="Status" v-model="status" :class="{'border-red-600': errors.Role}">
                                                <select class="form-control" name="Status" placeholder="User Status"  v-model="status">
                                                    <option value="1">Active</option>
                                                    <option value="0">In-Active</option>
                                                </select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Status">Status can not be empty</span>
                                            <ErrorMessage class="text-red-600" name="Status"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated">{{toggleComponent ? 'Save' : 'Update'}}</button>
                                            <button type="reset" v-if="toggleComponent" class="btn btn-secondary btn-lg btn_animated">Reset</button>  <!--  @click.prevent="resetForm"  -->
                                        </div>
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
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            userEmail: '',
            userPassword: '',
            confirmPassword: '',
            userName: '',
            userContact: '',
            invalidConfirmPassword: '',
            selectedCountry: '91',
            phone_number: '',
            roleId: '',
            status: '1',
            showLoader: false,
            roles: [],
            countryDetails: [],
            toggleComponent: true,
        }
    },
    mounted() {
        this.getUserRole();
        this.getAndSetCountry();
        if(this.$route.params.id) {       
            this.toggleComponent = false;
            this.editUserDetails(this.$route.params.id);
        }
    },
    computed: {
        schema() {
            return yup.object({
                Name: yup.string().required(),
                Email: yup.string().required().email(),
                Password: !this.toggleComponent ? '' : yup.string().required(),
                Confirmpass: !this.toggleComponent ? '' : yup.string().required(),
                Mobile: yup.string().required().min(10),
                Country: yup.string().required(),
                Role: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    methods:{
        // confirm password validation
        confirmPasswordValid() {
            if(this.confirmPassword != this.userPassword) {
                this.invalidConfirmPassword = 'Please re-enter password';
            }
            else {
                this.invalidConfirmPassword = '';
            }
        },
        // save and update user
        manageUser() {
            // update user
            if(this.$route.params.id) {
                this.showLoader = true;
                this.axios.post(this.$api + '/settings/user/' + this.$route.params.id, {
                    name: this.userName,
                    email: this.userEmail,
                    password: this.userPassword,
                    phone_number: this.userContact,
                    role_id: this.roleId,
                    status: this.status,
                    country_code: this.selectedCountry,
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
                            message: 'User details updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
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
                this.confirmPasswordValid();
                if(this.invalidConfirmPassword) {
                    return false;
                }
                else {
                    this.showLoader = true;
                    this.axios.post(this.$api + '/settings/user', {
                        name: this.userName,
                        email: this.userEmail,
                        password: this.userPassword,
                        phone_number: this.userContact,
                        role_id: this.roleId,
                        status: this.status,
                        country_code: this.selectedCountry,
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
                                message: 'New user created',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error.response);
                        this.backendErrorMessage = error.response.data.message;
                        this.backendErrorMessage = error.response.data.errors[0];
                        this.showLoader = false;
                    }); 
                }
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
                    this.userName = response.data.data.name
                    this.userEmail = response.data.data.email
                    this.userPassword = response.data.data.password
                    this.userContact = response.data.data.phone_number
                    this.roleId = response.data.data.role_id
                    this.status = response.data.data.status
                    this.selectedCountry = response.data.data.country_code
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // get and set country code
        getAndSetCountry() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/countries', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.countryDetails = response.data.data;
                    this.countryDetails.sort((a, b) => a.name - b.name);
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // reset form data
        // resetForm() {
        //     window.location.reload();
        // }
    }
}
</script>

<style  scoped>
.border-red-600 {
    --border-opacity: 1;
    border-color: #e53e3e;
    border-color: rgba(229,62,62,var(--border-opacity));
}
.text-red-600 {
    --text-opacity: 1;
    color: #e53e3e;
    color: rgba(229,62,62,var(--text-opacity));
}
</style>

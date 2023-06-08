<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <router-link to="/settings/user">Users</router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">{{ breadCrumbText }}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/user" class="btn btn-lg btn-neutral btn_animated">Back</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <form>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Name</label>
                                            <input type="text" id="input-username" class="form-control" :class="{'is-invalid': invalidName}" placeholder="Name" v-model.trim="userName" @keyup="nameIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ invalidName }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Email</label>
                                            <input type="email" id="input-username" class="form-control" :class="{'is-invalid': invalidEmail}" placeholder="Email" v-model="userEmail" @keyup="emailIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ invalidEmail }}</strong>
                                            </span>
                                            <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" v-if="toggleSomeComponent">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Password</label>
                                            <input type="password" id="input-username" class="form-control" :class="{'is-invalid': invalidPassword}" placeholder="Password" v-model="userPassword" @keyup="passwordIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ invalidPassword }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Confirm Password</label>
                                            <input type="password" id="input-username" class="form-control" :class="{'is-invalid': invalidConfirmPassword}" placeholder="Confirm Password" v-model="confirmPassword" @keyup="confirmPasswordIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ invalidConfirmPassword }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Select Country Code</label>
                                            <select class="form-control" v-model="selectedCountry">
                                                <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                                    {{item.dial_code}} - {{item.name}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Mobile Number</label>
                                            <input type="number" id="input-username" class="form-control" :class="{'is-invalid': invalidContact}" placeholder="Mobile Number" v-model="userContact" @keyup="mobileIsValid">
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ invalidContact }}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Role</label>
                                            <select class="form-control" placeholder="Select Role" v-model="roleId">
                                                <option value="">Select User Role</option>
                                                <option :value="role.id" v-for="(role, index) in roles" :key="index">{{role.role_name}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Status</label>
                                            <select class="form-control" placeholder="User Status"  v-model="status">
                                                <option value="1">Active</option>
                                                <option value="0">In-Active</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 py-0" v-if="toggleSomeComponent">
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="saveAndCreateUser">Save</button>
                                            <button type="reset" class="btn btn-secondary btn-lg btn_animated" @click.prevent="resetForm">Reset</button>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0" v-else>
                                        <div class="form-group">
                                            <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="updateUserDetails">Update</button>
                                        </div>
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
            userEmail: '',
            userPassword: '',
            confirmPassword: '',
            userName: '',
            userContact: '',
            invalidEmail: '',
            invalidPassword: '',
            invalidConfirmPassword: '',
            invalidName: '',
            invalidContact: '',
            selectedCountry: '91',
            phone_number: '',
            roleId: '',
            status: '1',
            hideShowLoader: false,
            roles: [],
            countryDetails: [],
            toggleSomeComponent: true,
            breadCrumbText: 'Create User'
        }
    },
    methods:{
        // name validation
        nameIsValid() {
            const nameFormate = /^[A-Za-z ]+$/;
            if(!this.userName) {
                this.invalidName = 'Name is required.';
            }
            else if(!this.userName.match(nameFormate)) {
                this.invalidName = 'Please enter valid name.';
            }
            else {
                this.invalidName = '';
            }
        },
        // email validation
        emailIsValid() {
            const mailFormat = /^[^@]+@\w+(\.\w+)+\w$/;
            if(!this.userEmail) {
                this.invalidEmail = 'Email is required.';
            }
            else if(!this.userEmail.match(mailFormat)) {
                this.invalidEmail = 'Please enter valid email.';
            }
            else {
                this.invalidEmail = '';
            }
        },
        // password validation
        passwordIsValid() {
            if(!this.userPassword) {
                this.invalidPassword = 'Password is required.';
            }
            else if(this.userPassword.length < 6) {
                this.invalidPassword = 'Please enter valid password.';
            }
            else {
                this.invalidPassword = '';
            }
        },
        // confirm password validation
        confirmPasswordIsValid() {
            if(!this.confirmPassword) {
                this.invalidConfirmPassword = 'Password is required.';
            }
            else if(!this.confirmPassword.match(this.userPassword)) {
                this.invalidConfirmPassword = 'Please re-enter your password.';
            }
            else {
                this.invalidConfirmPassword = '';
            }
        },
        // mobile number validation
        mobileIsValid() {
            const mobileFormat =  /^[0-9]+$/;
            if(!this.userContact) {
                this.invalidContact = 'Mobile number is required.';
            }
            else if(!this.userContact.toString().match(mobileFormat)) {
                this.invalidContact = 'Please enter valid mobile number.';
            }
            else if(this.userContact.toString().length !== 10) {
                this.invalidContact = 'Mobile number must be 10 number.';
            }
            else {
                this.invalidContact = '';
            }
        },
        // save and create user
        saveAndCreateUser() {
            this.nameIsValid();
            this.emailIsValid();
            this.passwordIsValid();
            this.confirmPasswordIsValid();
            this.mobileIsValid();
            if(!this.userEmail || !this.userPassword || !this.confirmPassword || !this.userName || !this.userContact || this.invalidEmail || this.invalidPassword || this.invalidConfirmPassword || this.invalidName || this.invalidContact) {
                return false;
            }
            else {
                this.hideShowLoader = true;
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
                        this.hideShowLoader = false;
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
                    this.backendErrorMessage = error.response.data.message;
                    this.hideShowLoader = false;
                }); 
            }
        },
        // get all user data
        getUserRole() {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            }); 
        },
        // edit user details
        editUserDetails(id) {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // update(edit) user details
        updateUserDetails() {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
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
                this.hideShowLoader = false;
            });
        },
        // get and set country code
        getAndSetCountry() {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // reset form data
        resetForm() {
            window.location.reload();
        }
    },
    mounted() {
        this.getUserRole();
        this.getAndSetCountry();
        if(this.$route.params.id) {       
            this.toggleSomeComponent = false;
            this.editUserDetails(this.$route.params.id);
            this.breadCrumbText = 'Edit User'
        }
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

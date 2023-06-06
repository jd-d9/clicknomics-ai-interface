<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">My Profile</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/dashboard" class="btn btn-lg btn-neutral btn_animated">Back</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col-xl-4 order-xl-2">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0">My Profile</h3>
                        </div>
                        <div class="card-body">
                            <div class="bg-white border-0">
                                <div class="row align-items-center">
                                    <div class="col-12 text-center mt-3">
                                        <div>
                                            <span class="avatar avatar-lg rounded-circle mr-4 wd-100 ht-100">
                                                <img :src="profileImage ? profileImage : images.user" alt="profile image">
                                            </span>
                                        </div>
                                        <div class="file_select">
                                            <a href="javascript:void(0)" class="btn btn-primary btn-lg btn_animated">Choose File</a>
                                            <input class="cursor-pointer" type="file" accept="image/*" id="file-input" @change="updateProfilePhoto">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="my-4">
                            <!-- user email section -->
                            <h6 class="heading-small text-muted mb-4">User Email
                                <button class="btn btn-sm float-right button-border" v-if="!userEmailToggle" type="button" @click="userEmailToggle = !userEmailToggle">
                                    <img :src="images.edit" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <div id="userName" v-if="!userEmailToggle">
                                    <div class="form-group m-0">
                                        <p class="font-weight-normal m-0 text-color">{{ currentEmail }}</p>
                                    </div>
                                </div>
                                <form id="userNameForm" v-show="userEmailToggle">
                                    <div class="form-group">
                                        <label  class="d-block form-control-label">Current user email</label>
                                        <p class="font-weight-normal m-0 text-color">{{ currentEmail }}</p>
                                        <label class="d-block form-control-label mt-2">New user email</label>
                                        <input type="text" id="input-username" :class="{'form-control': true, 'is-invalid': invalidEmail }" placeholder="Email" v-model="email" @keyup="emailIsValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidEmail }}</strong>
                                        </span>
                                    </div>
                                    <button class="btn btn-primary btn-lg btn_animated" type="submit" @click.prevent="updateUserEmail">Update user Email</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="userEmailToggle = !userEmailToggle">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <loader-component v-if="hideShowLoader"></loader-component>
                <div class="col-xl-8 order-xl-1">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0">My Profile</h3>
                        </div>
                        <div class="card-body">
                            <!-- user profile section -->
                            <h6 class="heading-small text-muted mb-4">Profile Details
                                <button class="btn btn-sm float-right button-border" v-if="!profileDetailsToggle" type="button" @click="profileDetailsToggle = !profileDetailsToggle">
                                    <img :src="images.edit" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <form v-show="profileDetailsToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Name</label>
                                        <input type="text" id="input-username"  :class="{'form-control': true }" placeholder="Name" v-model="name">
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <label class="form-control-label" for="input-username">Select Country Code</label>
                                                <select class="form-control" v-model="countryCode">
                                                    <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                                        {{item.dial_code}} - {{item.name}}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <label class="form-control-label" for="input-username">Mobile Number</label>
                                                <input type="number" id="input-username" :class="{'form-control': true }" placeholder="Mobile Number" v-model="phoneNumber">
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-lg btn_animated" type="submit" @click.prevent="updateUserDetails">Update User Detail</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="profileDetailsToggle = !profileDetailsToggle">Close</button>
                                </form>
                                <div id="userDetailsForm" v-if="!profileDetailsToggle">
                                    <div class="row">
                                        <div class="form-group col-md-6  py-0 m-0">
                                            <label for="formGroupExampleInput" class="form-control-label">Name</label>
                                            <p class="font-weight-normal m-0 text-color">{{ name }}</p>
                                        </div>
                                        <div class="form-group col-md-6  py-0 m-0">
                                            <label for="formGroupExampleInput" class="form-control-label">Phone number</label>
                                            <p class="font-weight-normal m-0 text-color" v-if="phoneNumber">{{ countryCode }} - {{ phoneNumber }}</p>
                                            <p class="font-weight-normal m-0" v-else>-</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr class="my-4">
                            <!-- password section -->
                            <h6 class="heading-small text-muted mb-4">Password
                                <button class="btn btn-sm float-right button-border" v-if="!passwordToggle" type="button" @click="passwordToggle = !passwordToggle">
                                    <img :src="images.edit" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <form id="changePasswordForm" v-show="passwordToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Current password</label>
                                        <input type="password" name="old_password" :class="{'form-control': true, 'is-invalid': invalidCurrentPassword }" v-model="currentPassword" @keyup="currentPasswordIsValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidCurrentPassword }}</strong>
                                        </span>
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">New password</label>
                                        <input type="password" id="input-username" :class="{'form-control': true, 'is-invalid': invalidPassword }" placeholder="Password" v-model="password" @keyup="passwordIsValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidPassword }}</strong>
                                        </span>
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Repeat New password</label>
                                        <input type="text" id="input-username" :class="{'form-control': true, 'is-invalid': invalidConfirmPass }" placeholder="Confirm Password" v-model="passwordConfirmation" @keyup="confirmPassValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidConfirmPass }}</strong>
                                        </span>
                                    </div>
                                    <button class="btn btn-primary btn-lg btn_animated" type="submit" @click.prevent="updateUserPassword">Update password</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="passwordToggle = !passwordToggle">Close</button>
                                </form>
                                <div id="changePassword" v-if="!passwordToggle">
                                    <h4 class="tx-normal tx-color-04 tx-spacing--2">
                                        <span>XXXX</span>
                                        <span class="ml-1">XXXX</span>
                                    </h4>
                                </div>
                            </div>
                            <!-- 2fa section -->
                            <hr class="my-4">
                            <h6 class="heading-small text-muted mb-4">2FA Verification
                                <button class="btn btn-sm float-right button-border" v-if="!TwoFaVerifyToggle" type="button" @click="TwoFaVerifyToggle = !TwoFaVerifyToggle">
                                    <img :src="images.edit" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <form id="changePasswordForm" v-show="TwoFaVerifyToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">2FA Verification Status</label>
                                        <select :class="{'form-control': true }" placeholder="User Status"  v-model="verificationStatus">
                                            <option value="1">Enabled</option>
                                            <option value="0">Disabled</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Remember 2FA Verification For 30 Days.</label>
                                        <select :class="{'form-control': true }" placeholder="User Status"  v-model="remember2Fa">
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                    <button class="btn btn-primary btn-lg btn_animated" type="submit" @click.prevent="update2FaVerify">Update</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="TwoFaVerifyToggle = !TwoFaVerifyToggle">Close</button>
                                </form>
                                <div id="changePassword" v-if="!TwoFaVerifyToggle">
                                    <h4 class="tx-normal tx-color-04 tx-spacing--2">
                                        <span class="ml-1">{{ verificationStatus === '1' ? 'Enabled' : 'Disabled' }}</span>
                                    </h4>
                                </div>
                            </div>
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
                images: {
                    logo: require('../../assets/img/brand/logo.png'),
                    edit: require('../../assets/img/icons/edit.svg'),
                    user: require('../../assets/img/icons/dummy-user.png')
                },
                userEmailToggle: false,
                passwordToggle: false,
                profileDetailsToggle: false,
                TwoFaVerifyToggle: false,
                currentUserDetails: {},
                profileImage: '',
                email: '',
                currentEmail: '',
                name: '',
                countryCode: '',
                phoneNumber: '',
                password: '',
                passwordConfirmation: '',
                currentPassword: '',
                verificationStatus: '1',
                remember2Fa: '1',
                hideShowLoader: false,
                countryDetails: [],
                invalidEmail: '',
                invalidCurrentPassword: '',
                invalidPassword: '',
                invalidConfirmPass: '',
            }
        },
        methods: {
            // email validation
            emailIsValid() {
                const mailFormat = /^[^@]+@\w+(\.\w+)+\w$/;
                if(!this.email) {
                    this.invalidEmail = 'Email is required.';
                }
                else if(!this.email.match(mailFormat)) {
                    this.invalidEmail = 'Please enter valid email.';
                }
                else {
                    this.invalidEmail = '';
                }
            },
            // current password validation
            currentPasswordIsValid() {
                if(!this.currentPassword) {
                    this.invalidCurrentPassword = 'Password is required.';
                }
                else {
                    this.invalidCurrentPassword = '';
                }
            },
            // password validation
            passwordIsValid() {
                if(!this.password) {
                    this.invalidPassword = 'Password is required.';
                }
                else if(this.password.length < 6) {
                    this.invalidPassword = 'Please enter valid password.';
                }
                else {
                    this.invalidPassword = '';
                }
            },
            // confirm password validation
            confirmPassValid() {
                if(!this.passwordConfirmation) {
                    this.invalidConfirmPass = 'Field is required.';
                }
                else if(!this.passwordConfirmation.match(this.password)) {
                    this.invalidConfirmPass = 'Please re-enter password.';
                }
                else {
                    this.invalidConfirmPass = '';
                }
            },
            // get current loged in user data
            getCurrentUserData() {
                this.hideShowLoader = true;
                this.axios.get(this.$api + '/settings/getsingleuser', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.currentUserDetails = response.data.data;
                        this.profileImage = this.currentUserDetails.profile_image;
                        this.currentEmail = this.currentUserDetails.email;
                        this.name = this.currentUserDetails.name;
                        this.countryCode = this.currentUserDetails.country_code;
                        this.phoneNumber = this.currentUserDetails.phone_number;
                        this.verificationStatus = this.currentUserDetails.verification_status;
                        this.remember2Fa = this.currentUserDetails.two_factor_code;
                        this.backendErrorMessage = '';
                        this.hideShowLoader = false;
                        console.log(this.currentUserDetails, 'currentUserData');
                    }
                })
                .catch(error => {
                    this.backendErrorMessage = error.response.data.errors[0];
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
            // upload image
            updateProfilePhoto(event) {
                this.hideShowLoader = true;
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                    let profileImage64 = reader.result;
                    this.profileImage = profileImage64;
                    this.axios.post(this.$api + '/userprofiles/userimage', {
                        profile_image: profileImage64
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                        }
                    })
                    .then(response => {
                        if(response.data.success) {
                            this.$toast.open({
                                message: 'Profile image updated',
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
                }
                reader.readAsDataURL(file);
            },
            // updating user email
            updateUserEmail() {
                this.emailIsValid();
                if(this.invalidEmail || !this.email) {
                    console.log('if');
                    return false;
                }
                else {
                    console.log('else');
                    this.hideShowLoader = true;
                    this.axios.post(this.$api + '/userprofiles/useremail', {
                        email: this.email
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                        }
                    })
                    .then(response => {
                        if(response.data.success) {
                            this.$toast.open({
                                message: 'User email updated',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.hideShowLoader = false;
                            this.getCurrentUserData();
                            this.userEmailToggle = false;
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
                }
            },
            // updating profile details
            updateUserDetails() {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/userprofiles/userdetail', {
                    name: this.name,
                    phone_number : this.phoneNumber,
                    country_code : this.countryCode
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Profile details updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.hideShowLoader = false;
                        this.profileDetailsToggle = false;
                        this.getCurrentUserData();
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
            // updating user password
            updateUserPassword() {
                this.passwordIsValid();
                this.confirmPassValid();
                this.currentPasswordIsValid();
                if(this.invalidConfirmPass || this.invalidPassword || this.invalidCurrentPassword || !this.password || !this.currentPassword || !this.passwordConfirmation) {
                    return false;
                }
                else {
                    this.hideShowLoader = true;
                    this.axios.post(this.$api + '/userprofiles/userpassword', {
                        currentPassword: this.currentPassword,
                        password : this.password,
                        password_confirmation : this.passwordConfirmation
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                        }
                    })
                    .then(response => {
                        if(response.data.success) {
                            this.$toast.open({
                                message: 'Password updated',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.hideShowLoader = false;
                            this.getCurrentUserData();
                            this.passwordToggle = false;
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
                }
            },
            // updating user 2Fa verification
            update2FaVerify() {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/userprofiles/usertwofactor', {
                    verification_status: this.verificationStatus,
                    remember_2fa: this.remember2Fa
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: '2Fa verification updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.hideShowLoader = false;
                        this.getCurrentUserData();
                        this.TwoFaVerifyToggle = false;
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
            }
        },
        mounted() {
            this.getCurrentUserData();
            this.getAndSetCountry();
        }
    }
</script>

<style scoped>
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

.button-border {
    border: none;
}
.image-width {
    width: 1.875rem;
}
.text-color {
    color: #525f7f;
}
.cursor-pointer {
    cursor: pointer;
}
</style>

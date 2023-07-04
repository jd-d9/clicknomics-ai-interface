<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">My Profile</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/dashboard" class="btn btn-lg btn-neutral btn_animated">Back</router-link>
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
                                                <img :src="profileImage ? profileImage : '/assets/img/icons/dummy-user.png'" alt="profile image">
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
                                    <img src="/assets/img/icons/edit.svg" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <div id="userName" v-if="!userEmailToggle">
                                    <div class="form-group m-0">
                                        <p class="font-weight-normal m-0 text-color">{{ currentEmail }}</p>
                                    </div>
                                </div>
                                <Form @submit="updateUserEmail" :validation-schema="mailSchema" v-slot="{ errors }" v-show="userEmailToggle">
                                    <div class="form-group">
                                        <label  class="d-block form-control-label">Current user email</label>
                                        <p class="font-weight-normal m-0 text-color">{{ currentEmail }}</p>
                                        <label class="d-block form-control-label mt-2">New user email</label>
                                        <Field type="text" id="input-username" name="UserEmail" :class="{'form-control': true, 'border-red-600': errors.UserEmail}" placeholder="Email" v-model="email"/>
                                        <span class="text-red-600" v-if="errors.UserEmail">User email can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="UserEmail"/> -->
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Update user Email</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="userEmailToggle = !userEmailToggle">Close</button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
                <loader-component v-if="showLoader"></loader-component>
                <div class="col-xl-8 order-xl-1">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0">My Profile</h3>
                        </div>
                        <div class="card-body">
                            <!-- user profile section -->
                            <h6 class="heading-small text-muted mb-4">Profile Details
                                <button class="btn btn-sm float-right button-border" v-if="!profileDetailsToggle" type="button" @click="profileDetailsToggle = !profileDetailsToggle">
                                    <img src="/assets/img/icons/edit.svg" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <Form @submit="updateUserDetails" :validation-schema="userSchema" v-slot="{ errors }" v-show="profileDetailsToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Name</label>
                                        <Field type="text" id="input-username" name="Name" :class="{'form-control': true, 'border-red-600': errors.Name}" placeholder="Name" v-model="name"/>
                                        <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="Name"/> -->
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <label class="form-control-label" for="input-username">Select Country Code</label>
                                                <Field v-model="countryCode" name="Country" :class="{'border-red-600': errors.Country}">
                                                    <select class="form-control" name="Country" v-model="countryCode" :class="{'border-red-600': errors.Country}">
                                                        <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                                            {{item.dial_code}} - {{item.name}}
                                                        </option>
                                                    </select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Country">Country code can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Country"/> -->
                                            </div>
                                            <div class="col-lg-6 py-0">
                                                <label class="form-control-label" for="input-username">Mobile Number</label>
                                                <Field type="number" name="Mobile" id="input-username" :class="{'form-control': true, 'border-red-600': errors.Mobile}" placeholder="Mobile Number" v-model="phoneNumber"/>
                                                <span class="text-red-600" v-if="errors.Mobile">Mobile number can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Mobile"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Update User Detail</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="profileDetailsToggle = !profileDetailsToggle">Close</button>
                                </Form>
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
                                    <img src="/assets/img/icons/edit.svg" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <Form @submit="updateUserPassword" :validation-schema="passSchema" v-slot="{ errors }" v-show="passwordToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Current password</label>
                                        <Field type="password" name="currentPass" :class="{'form-control': true, 'border-red-600': errors.currentPass}" v-model="currentPassword"/>
                                        <span class="text-red-600" v-if="errors.currentPass">Current password can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="currentPass"/> -->
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">New password</label>
                                        <Field type="password" id="input-username" name="newPass" :class="{'form-control': true, 'border-red-600': errors.newPass}" placeholder="Password" v-model="password"/>
                                        <span class="text-red-600" v-if="errors.newPass">New password can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="currentPass"/> -->
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Repeat New password</label>
                                        <Field type="password" id="input-username" name="repeatPass" :class="{'form-control': true, 'border-red-600': errors.repeatPass}" placeholder="Confirm Password" v-model="passwordConfirmation"/>
                                        <span class="text-red-600" v-if="errors.repeatPass">Reapet new password can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="repeatPass"/> -->
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Update password</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="passwordToggle = !passwordToggle">Close</button>
                                </Form>
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
                                    <img src="/assets/img/icons/edit.svg" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <Form @submit="update2FaVerify" :validation-schema="verifySchema" v-slot="{ errors }" v-show="TwoFaVerifyToggle">
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">2FA Verification Status</label>
                                        <Field name="TwoFaVerify" v-model="verificationStatus">
                                            <select :class="{'form-control': true, 'border-red-600': errors.TwoFaVerify}" name="TwoFaVerify" placeholder="User Status" v-model="verificationStatus">
                                                <option value="1">Enabled</option>
                                                <option value="0">Disabled</option>
                                            </select>
                                        </Field>
                                        <span class="text-red-600" v-if="errors.TwoFaVerify">Verification status can not be empty</span>
                                        <!-- <ErrorMessage class="text-red-600" name="TwoFaVerify"/> -->
                                    </div>
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Remember 2FA Verification For 30 Days.</label>
                                        <Field name="Remember" v-model="remember2Fa">
                                            <select :class="{'form-control': true, 'border-red-600': errors.Remember}" name="Remember" placeholder="User Status" v-model="remember2Fa">
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                        </Field>
                                        <span class="text-red-600" v-if="errors.Remember">2FA verification can not be empty</span>
                                        <ErrorMessage class="text-red-600" name="Remember"/>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Update</button>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="TwoFaVerifyToggle = !TwoFaVerifyToggle">Close</button>
                                </Form>
                                <div id="changePassword" v-if="!TwoFaVerifyToggle">
                                    <h4 class="tx-normal tx-color-04 tx-spacing--2">
                                        <span class="ml-1">{{ verificationStatus === '1' ? 'Enabled' : 'Disabled' }}</span>
                                    </h4>
                                </div>
                            </div>
                            <!-- subscription plan section -->
                            <hr class="my-4">
                            <h6 class="heading-small text-muted mb-4">Subscription Plan
                                <button class="btn btn-sm float-right button-border" v-if="!subscriptionPlanToggle" type="button" @click="subscriptionPlanToggle = !subscriptionPlanToggle">
                                    <img src="/assets/img/icons/eye.svg" class="image-width">
                                </button>
                            </h6>
                            <div>
                                <div v-show="subscriptionPlanToggle">
                                    <label for="formGroupExampleInput2" class="d-block form-control-label">Plan Name</label>
                                    <h3 class="tx-color-04 tx-spacing--2">{{subscriptionPlan ? subscriptionPlan : 'Example plan name'}}</h3>
                                    <label for="formGroupExampleInput2" class="d-block form-control-label mt-3">Trial Days</label>
                                    <h3 class="tx-color-04 tx-spacing--2">{{trialEndsAt ? trialEndsAt : 'Example trial duration'}}</h3>
                                    <button class="btn btn-secondary btn-lg btn_animated" type="button" @click="subscriptionPlanToggle = !subscriptionPlanToggle">Close</button>
                                </div>
                                <div id="changePassword" v-if="!subscriptionPlanToggle">
                                    <h4 class="tx-normal tx-color-04 tx-spacing--2">{{subscriptionPlan ? subscriptionPlan : 'Example plan name'}}</h4>
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
    import * as yup from 'yup';
    import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
    import { required } from '@vee-validate/rules';
    import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
    defineRule('required', required);
    loadLocaleFromURL(
    'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/ar.json'
    );
    configure({
        generateMessage: localize('en', {
            messages: {
                required: '{field} can not be empty!',
            },
            // fields: {
            //     Status: {
            //         required: 'Status can not be empty!!!'
            //     }
            // }
        }),
    });
    export default {
        emits: ['updating-profile-details'],
        components: {
            Form, Field, ErrorMessage
        },
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                //     edit: require('/assets/img/icons/edit.svg'),
                //     user: require('/assets/img/icons/dummy-user.png')
                // },
                userEmailToggle: false,
                profileDetailsToggle: false,
                passwordToggle: false,
                TwoFaVerifyToggle: false,
                subscriptionPlanToggle: false,
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
                subscriptionPlan: '',
                trialEndsAt: '',
                showLoader: false,
                countryDetails: [],
            }
        },
        computed: {
            mailSchema() {
                return yup.object({
                    UserEmail: yup.string().required().email(),
                });
            },
            userSchema() {
                return yup.object({
                    Name: yup.string().required(),
                    Country: yup.string().required(),
                    Mobile: yup.string().required(),
                });
            },
            passSchema() {
                return yup.object({
                    currentPass: yup.string().required(),
                    newPass: yup.string().required(),
                    repeatPass: yup.string().required(),
                });
            },
            verifySchema() {
                return yup.object({
                    TwoFaVerify: yup.string().required(),
                    Remember: yup.string().required(),
                });
            },
        },
        methods: {
            // get current loged in user data
            getCurrentUserData() {
                this.showLoader = true;
                this.axios.get(this.$api + '/settings/getprofileuser', {
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
                        this.remember2Fa = this.currentUserDetails.remember_2fa;
                        this.subscriptionPlan = this.currentUserDetails.subscriptions;
                        this.trialEndsAt = this.currentUserDetails.trial_ends_at;
                        this.backendErrorMessage = '';
                        this.showLoader = false;
                        console.log(this.currentUserDetails, 'currentUserData');
                    }
                })
                .catch(error => {
                    this.backendErrorMessage = error.response.data.errors[0];
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
            // upload image
            updateProfilePhoto(event) {
                this.showLoader = true;
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                    let profileImage64 = reader.result;
                    this.profileImage = profileImage64;
                    this.axios.post(this.$api + '/userprofiles/updateProfileImage', {
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
                            this.showLoader = false;
                            this.getCurrentUserData();
                            this.$emit('updating-profile-details', 'update');
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
                reader.readAsDataURL(file);
            },
            // updating user email
            updateUserEmail() {
                this.showLoader = true;
                this.axios.post(this.$api + '/userprofiles/updateUserEmail', {
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
                        this.showLoader = false;
                        this.getCurrentUserData();
                        this.userEmailToggle = false;
                        sessionStorage.setItem('Email', this.email);
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
            },
            // updating profile details
            updateUserDetails() {
                this.showLoader = true;
                this.axios.post(this.$api + '/userprofiles/updateUserDetail', {
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
                        this.showLoader = false;
                        this.getCurrentUserData();
                        this.profileDetailsToggle = false;
                        this.$emit('updating-profile-details', 'update');
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
            },
            // updating user password
            updateUserPassword() {
                this.showLoader = true;
                this.axios.post(this.$api + '/userprofiles/updateUserPassword', {
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
                        this.showLoader = false;
                        this.getCurrentUserData();
                        this.passwordToggle = false;
                        this.currentPassword = '';
                        this.password = '';
                        this.passwordConfirmation = '';
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
            },
            // updating user 2Fa verification
            update2FaVerify() {
                this.showLoader = true;
                this.axios.post(this.$api + '/userprofiles/update2FAVerificationStatus', {
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
                        this.showLoader = false;
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
                    this.showLoader = false;
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
<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <router-link to="/dashboard">
                            <v-icon icon="mdi-view-dashboard"></v-icon>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-3" color="#00cd00"></v-icon>
                        <span>My Profile</span>
                        <v-btn href="/dashboard" class="ms-auto text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>
                <!-- profile form -->
                <v-col cols="12" sm="12" md="7" lg="8" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="mb-0 d-flex justify-space-between">
                            Personal Details
                            <v-icon v-if="!profileDetailsToggle" @click="profileDetailsToggle = !profileDetailsToggle" icon="mdi-pencil" size="small" color="#00cd00"></v-icon>
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-3" color="success" />

                        <div>
                            <!-- user profile section -->
                            <div>
                                <Form @submit="updateUserDetails" :validation-schema="userSchema" v-slot="{ errors }" v-show="profileDetailsToggle">
                                    <v-row>
                                        <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                            <label>Name</label>
                                            <v-text-field placeholder="Email" variant="outlined" id="input-username" name="Name" v-model="name" :error-messages="errors.Name"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                            <label>Select Country Code</label>
                                            <!-- <v-select
                                                :items="countryDetails"
                                                label="Compact"
                                                item-title="item.name"
                                                item-value="item.dial_code"
                                            ></v-select> -->
                                            <Field v-model="countryCode" name="Country" :class="{'border-red-600': errors.Country}">
                                                <select class="form-control" name="Country" v-model="countryCode" :class="{'border-red-600': errors.Country}">
                                                    <option :value="item.dial_code" v-for="(item, index) in countryDetails" :key="index">
                                                        {{item.dial_code}} - {{item.name}}
                                                    </option>
                                                </select>
                                            </Field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                            <label>Name</label>
                                            <v-text-field placeholder="Email" variant="outlined" id="input-username" name="Name" v-model="name" :error-messages="errors.Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <!-- <div>
                                        <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-autorenew">Update Email</v-btn>

                                        <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click="userEmailToggle = !userEmailToggle">Close</v-btn>
                                    </div> -->
                                    <div class="form-group">
                                        <label for="formGroupExampleInput2" class="d-block form-control-label">Name</label>
                                        <Field type="text" id="input-username" name="Name" :class="{'form-control': true, 'border-red-600': errors.Name}" placeholder="Name" v-model="name"/>
                                        <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
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
                                <v-row id="userDetailsForm" v-if="!profileDetailsToggle">
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label>Name : 
                                            <span class="font-weight-medium text-blue-darken-4">{{ name }}</span>
                                        </label>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                        <label>Phone number : 
                                            <span class="font-weight-medium text-blue-darken-4" v-if="phoneNumber">{{ countryCode }} - {{ phoneNumber }}</span>
                                            <span class="font-weight-medium text-blue-darken-4" v-else></span>
                                        </label>
                                    </v-col>
                                </v-row>
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
                                <v-row v-if="!passwordToggle">
                                    <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal">
                                        <label>
                                            <span class="font-weight-medium text-blue-darken-4">XXXX XXXX</span>
                                        </label>
                                    </v-col>
                                </v-row>
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
                                <v-row v-if="!TwoFaVerifyToggle">
                                    <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal">
                                        <label>
                                            <span class="font-weight-medium text-blue-darken-4">
                                                {{ verificationStatus === '1' ? 'Enabled' : 'Disabled' }}
                                            </span>
                                        </label>
                                    </v-col>
                                </v-row>
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
                                <v-row v-if="!subscriptionPlanToggle">
                                    <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal">
                                        <label>
                                            <span class="font-weight-medium text-blue-darken-4">
                                                {{subscriptionPlan ? subscriptionPlan : 'Example plan name'}}
                                            </span>
                                        </label>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <!-- profile photo and email-->
                <v-col cols="12" sm="12" md="5" lg="4" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="mb-0">Profile Image</v-card-title>
                        <v-divider class="border-opacity-100 my-3" color="success" />

                        <!-- profile image -->
                        <div class="d-flex align-center justify-space-between">
                            <v-avatar size="70" color="primary">
                                <v-img :src="profileImage ? profileImage : '/assets/img/icons/dummy-user.png'" alt="profile image"></v-img>
                            </v-avatar>
                            <v-file-input accept="image/*" id="file-input" @change="updateProfilePhoto" prepend-icon="mdi-camera" label="Avatar" variant="outlined" class="ml-5 mt-3"></v-file-input>
                        </div>
                    </v-card>

                    <!-- User Email id -->
                    <v-card class="card_design">
                        <v-card-title class="mb-0">User Email</v-card-title>
                        <v-divider class="border-opacity-100 my-3" color="success" />
                        <v-card-text class="pa-0">
                            <div id="userName" v-if="!userEmailToggle" class="font-weight-medium d-flex justify-space-between">
                                {{ currentEmail }}
                                <v-icon v-if="!userEmailToggle" @click="userEmailToggle = !userEmailToggle" icon="mdi-email-edit-outline" size="large" color="#00cd00"></v-icon>
                            </div>
                            <div>
                                <Form @submit="updateUserEmail" :validation-schema="mailSchema" v-show="userEmailToggle" v-slot="{ errors }">
                                    <div class="font-medium font-weight-normal">
                                        <label>Current user email : 
                                            <span class="font-weight-medium text-blue-darken-4">{{ currentEmail }}</span>
                                        </label>
                                    </div>

                                    <div class="font-medium font-weight-normal">
                                        <label class="font-medium mb-2">New User Email</label>
                                        <div class="mb-2">
                                            <v-text-field placeholder="Email" variant="outlined" id="input-username" name="UserEmail" v-model="email" :error-messages="errors.UserEmail"></v-text-field>
                                        </div>
                                    </div>
                                    <div>
                                        <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-autorenew">Update Email</v-btn>

                                        <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click="userEmailToggle = !userEmailToggle">Close</v-btn>
                                    </div>
                                </Form>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <!-- page content -->
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
<!-- 
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
</style> -->
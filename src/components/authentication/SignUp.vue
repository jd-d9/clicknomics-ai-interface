<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-7 pb-lg-8 pt-lg-8">
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <v-container class="mt--8 mt-lg--8 pb-5 login_screen">
            <v-row>
                <v-col cols="12" sm="12" md="7" lg="5" class="m-auto">
                    <v-card class="card_design mb-4 pa-10">
                        <v-card-title class="text-center">
                            <img src="/assets/img/brand/logo.png" alt="logo" height="40">
                            <v-divider class="border-opacity-100 mt-4 mb-4" color="success" />
                            <h1 class="mt-0 mb-3 text-center">Register</h1>
                            <!-- <h1 class="mt-0 mb-0 text-left">Welcome to clicknomics</h1>
                            <p class="font-weight-medium text-left">Use these awesome forms for Register.</p> -->
                        </v-card-title>

                        <Form class="login_form" @submit="signUpUser" :validation-schema="schema" v-slot="{ errors }">
                            <!-- <div class="col-12">
                                <div class="profile-image-wrapper">
                                    <label class="profile-image">
                                        <input type="file" class="d-none" @change="uploadProfilePhoto">
                                        <img :src="profileImage" alt="img">
                                    </label>
                                    <label class="edit-icon">
                                        <input type="file" class="d-none" @change="uploadProfilePhoto">
                                        <img src="/assets/img/icons/edit.svg" alt="img">
                                    </label>
                                </div>
                            </div> -->
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-account" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="name" type="text" name="firstName" class="text-capitalize" :class="{'form-control': true ,'border-red-600': errors.firstName}" placeholder="First Name" v-model="firstName"/>
                                    <span class="text-red-600" v-if="errors.firstName">First name is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-account" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="name" type="text" name="lastName" class="text-capitalize" :class="{'form-control': true ,'border-red-600': errors.lastName}" placeholder="Last Name" v-model="lastName"/>
                                    <span class="text-red-600" v-if="errors.lastName">Last name is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-email-variant" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="email" type="email" name="Email" :class="{'form-control': true ,'border-red-600': errors.Email}" autocomplete="email" placeholder="Email" v-model="userEmail" @blur="emailIsAvail"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-office-building" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="company" type="text" name="companyName" :class="{'form-control': true ,'border-red-600': errors.companyName}" placeholder="Company Name" v-model="companyName"/>
                                    <span class="text-red-600" v-if="errors.companyName">Company name is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="password" type="password" name="Password" :class="{'form-control': true ,'border-red-600': errors.Password || passwordValidation}" placeholder="Password" v-model="userPassword" @keyup="validatePassword"/>
                                    <ErrorMessage class="text-red-600" name="Password" v-if="!passwordValidation"/>
                                    <span class="text-red-600" v-if="passwordValidation">{{passwordValidation}}</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="confirm_password" type="password" name="passwordConfirmation" :class="{'form-control': true ,'border-red-600': errors.passwordConfirmation}" placeholder="Confirm password" v-model="confirmPassword"/>
                                    <span class="text-red-600" v-if="errors.passwordConfirmation">Password did not match</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>

                                <!-- <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-flag" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field v-model="countryCode" name="Country" :class="{'border-red-600': errors.Country}">
                                        <select placeholder="Select country code" name="Country" v-model="countryCode" :class="{'form-control': true ,'border-red-600': errors.Country}">
                                            <option value="">Select country code</option>
                                            <option :value="item.dial_code" v-for="(item, index) in countryCodeListing" :key="index">
                                                {{item.dial_code}} - {{item.name}}
                                            </option>
                                        </select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Country">Country code is required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-phone" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="confirm_password" type="number" name="Mobile" :class="{'form-control': true ,'border-red-600': errors.Mobile}" autocomplete="current-password" placeholder="Mobile number" v-model="mobileNumber"/>
                                    <ErrorMessage class="text-red-600" name="Mobile"/>
                                </v-col> -->
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Sign Up</v-btn>   
                                <p class="font-weight-medium text-muted text-body-2 mb-0">Already have an account? <router-link to="/login" class="text-blue-darken-2"> Login </router-link></p>
                            </div>
                        </Form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import * as yup from 'yup';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import defaultImage from '../../assets/img/DefaultImage.js';
    import axios from '@axios';
    export default {
        components: {
            Form, 
            Field, 
            ErrorMessage
        },
        data() {
            return {
                showLoader: false,
                countryCodeListing: [],
                firstName: '',
                lastName: '',
                userEmail: '',
                companyName: '',
                userPassword: '',
                confirmPassword: '',
                profileImage: defaultImage,
                // countryCode: '',
                // mobileNumber: '',
                backendErrorMessage: '',
                multipleErrors: [],
                passwordValidation: '',
            }
        },
        computed: {
            schema() {
                return yup.object({
                    firstName: yup.string().required(),
                    lastName: yup.string().required(),
                    Email: yup.string().required().email(),
                    companyName: yup.string().required(),
                    Password: yup.string().required(),
                    passwordConfirmation: yup.string().required().oneOf([yup.ref('Password')], 'Passwords do not match'),
                    // Mobile: yup.string().required().min(10).max(10)
                });
            },
        },
        mounted() {
            // this.getAndSetCountryCode();
            let userSession = localStorage.getItem('user-session')
            if(userSession){
                const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
                let sessionData = JSON.parse(decryptedObject)

                const isAuthenticated = sessionData.Token;
                const isVerified = sessionData.isTwoFactorVerified;
                const verifiedBy = sessionData.verifiedBy;

                if(isAuthenticated && isVerified) {
                    this.$router.push('/dashboard');
                } else if(isAuthenticated && !isVerified) {
                    verifiedBy === 'email' ? this.$router.push('/authenticator/validate/email') :this.$router.push('/authenticator/validate');
                }
            }
        },
        methods: {
            // password validation
            validatePassword() {
                const validPassword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
                if(!this.userPassword.match(validPassword)) {
                    this.passwordValidation = 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
                }else {
                    this.passwordValidation = '';
                }
            },
            // submit data and signup user
            signUpUser() {
                if(this.passwordValidation) {
                    return false;
                }
                else {
                    this.showLoader = true;
                    axios.post(this.$api + '/registration', {
                        first_name: this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1),
                        last_name: this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1),
                        email: this.userEmail,
                        company_name: this.companyName,
                        password: this.userPassword,
                        password_confirmation: this.confirmPassword,
                        plan_id: 1,
                        // plan_id: sessionStorage.getItem('subscriptionPlanId'),
                        // country_code: this.countryCode,
                        // phone_number: this.mobileNumber,
                        // profile_image: this.profileImage,
                    })
                    .then(response => {
                        // let planId = sessionStorage.getItem('subscriptionPlanId');
                        let planId = 1;
                        if(response.data.success) {
                            this.backendErrorMessage = '';
                            this.multipleErrors = [],
                            // set plan id
                            this.showLoader = true;
                            axios.get(this.$api + '/subscription/' + planId, {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${response.data.data}`
                                }
                            })
                            .then(response => {
                                if(response.data.success) {
                                    this.$toast.open({
                                        message: 'User registration successfully!',
                                        position: 'top-right',
                                        duration: '5000',
                                        type: 'success'
                                    });
                                    this.showLoader = false;
                                    this.$router.push('/login');
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
                }
            },
            // email is available or not
            emailIsAvail() {
                this.showLoader = true;
                axios.post(this.$api + '/registration/checkEmail', {
                    email: this.userEmail,
                })
                .then(response => {
                    if(response.data.success) {
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
                    console.log(error)
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
            // // upload profile image
            // uploadProfilePhoto(event) {
            //     const file = event.target.files[0];
            //     const reader = new FileReader();
            //     reader.onloadend = () => {
            //         let profileImage64 = reader.result;
            //         this.profileImage = profileImage64;
            //     }
            //     reader.readAsDataURL(file);
            // },
            // get and set country code
            // getAndSetCountryCode() {
            //     this.showLoader = true;
            //     axios.get(this.$api + '/countries')
            //     .then(response => {
            //         if(response.data.success) {
            //             this.countryCodeListing = response.data.data;
            //             this.countryCodeListing.sort((a, b) => a.name - b.name);
            //             console.log(this.countryCodeListing, 'countryCodeListing');
            //             this.showLoader = false;
            //         }
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         this.showLoader = false;
            //     });
            // },
        }
    }
</script>

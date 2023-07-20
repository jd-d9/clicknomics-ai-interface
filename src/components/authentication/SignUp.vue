<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
            <div class="container">
                <div class="header-body text-center mb-5">
                    <div class="row justify-content-center">
                        <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                            <h1 class="text-white">Welcome to clicknomics</h1>
                            <p class="text-lead text-white">Use these awesome forms to Register.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <div class="container mt--7 mt-lg--8 pb-5">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-md-7">
                    <div class="card bg-secondary border-0 mb-0">
                        <div class="card-body px-lg-5 py-lg-5">
                            <div class="row">
                                <div class="col-4"></div>
                                <div class="col-4 text-center">
                                    <div class="text-center logo_responsive d-flex justify-content-between">
                                        <img src="/assets/img/brand/logo.png" alt="logo" class="mx-auto" style="width: 80%">
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <v-btn to="/login" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                        Back
                                    </v-btn> 
                                </div>
                            </div>
                            <Form class="mt-5 login_form" @submit="signUpUser" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
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
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/person.svg">
                                            </span>
                                            <Field id="name" type="text" name="firstName" class="form-control" :class="{'border-red-600': errors.firstName}" placeholder="First Name" v-model="firstName"/>
                                            <span class="text-red-600" v-if="errors.firstName">First name is required field</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/person.svg">
                                            </span>
                                            <Field id="name" type="text" name="lastName" class="form-control" :class="{'border-red-600': errors.lastName}" placeholder="Last Name" v-model="lastName"/>
                                            <span class="text-red-600" v-if="errors.lastName">Last name is required field</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/envelope.svg">
                                            </span>
                                            <Field id="email" type="email" name="Email" class="form-control" :class="{'border-red-600': errors.Email}" autocomplete="email" placeholder="Email" v-model="userEmail"/>
                                            <ErrorMessage class="text-red-600" name="Email"/>
                                            <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/envelope.svg">
                                            </span>
                                            <Field id="company" type="text" name="companyName" class="form-control" :class="{'border-red-600': errors.companyName}" placeholder="Company Name" v-model="companyName"/>
                                            <span class="text-red-600" v-if="errors.companyName">Company name is required field</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/lock.svg">
                                            </span>
                                            <Field id="password" type="password" name="Password" class="form-control" :class="{'border-red-600': errors.Password}" placeholder="Password" v-model="userPassword"/>
                                            <span class="text-red-600" v-if="errors.Password">Password is required field</span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/lock.svg">
                                            </span>
                                            <Field id="confirm_password" type="password" name="passwordConfirmation" class="form-control" :class="{'border-red-600': errors.passwordConfirmation}" placeholder="Confirm password" v-model="confirmPassword"/>
                                            <span class="text-red-600" v-if="errors.passwordConfirmation">Password did not match</span>
                                        </div>
                                    </div>
                                    <!-- <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/country.png">
                                            </span>
                                            <Field v-model="countryCode" name="Country" :class="{'border-red-600': errors.Country}">
                                                <select class="form-control" name="Country" v-model="countryCode" :class="{'border-red-600': errors.Country}">
                                                    <option value="">Select country code</option>
                                                    <option :value="item.dial_code" v-for="(item, index) in countryCodeListing" :key="index">
                                                        {{item.dial_code}} - {{item.name}}
                                                    </option>
                                                </select>
                                            </Field>
                                            <span class="text-red-600" v-if="errors.Country">Country code is required field</span>
                                        </div>
                                    </div> -->
                                    <!-- <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon form_icon_32">
                                                <img src="/assets/img/icons/phone.png">
                                            </span>
                                            <Field id="confirm_password" type="number" name="Mobile" class="form-control" :class="{'border-red-600': errors.Mobile}" autocomplete="current-password" placeholder="Mobile number" v-model="mobileNumber"/>
                                            <ErrorMessage class="text-red-600" name="Mobile"/>
                                        </div>
                                    </div> -->
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Sign Up</button>
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
    import defaultImage from '../../assets/img/DefaultImage.js';
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
        // mounted() {
        //     this.getAndSetCountryCode();
        // },
        methods: {
            // submit data and signup user
            signUpUser() {
                this.showLoader = true;
                this.axios.post(this.$api + '/registration', {
                    first_name: this.firstName,
                    last_name: this.lastName,
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
                        // set plan id
                        this.showLoader = true;
                        this.axios.get(this.$api + '/subscription/' + planId, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${response.data.data}`
                            }
                        })
                        .then(response => {
                            if(response.data.success) {
                                this.$toast.open({
                                    message: response.data.message,
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
                            console.log(error);
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
                    console.log(error, 'error')
                    this.backendErrorMessage = error.message;
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
            //     this.axios.get(this.$api + '/countries')
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

<style scoped>
    .form_icon img {
        width: 30px;
    }
    .logo_responsive img {
        width: 25%;
    }
    .height {
        height: 100vh;
    }
    .form_icon_32 img {
        width: 32px;
    }
    .profile-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 1px solid #b9bbbc;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile-image-wrapper {
        position: relative;
        width: 150px;
        margin: 0 auto;
        margin-bottom: 20px;
    }
    .profile-image-wrapper .edit-icon {
        position: absolute;
        top: 75%;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile-image-wrapper .edit-icon img {
        width: 20px;
        height: 20px;
    }
    .profile-image img {
        width: 100%;
    }
</style>
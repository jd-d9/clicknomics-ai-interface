<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-7 pb-lg-8 pt-lg-9">
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <v-container class="mt--8 mt-lg--8 pb-5 login_screen">
            <v-row>
                <v-col cols="12" sm="8" md="5" lg="4" class="m-auto">
                    <v-card class="card_design mb-4 pa-10">
                        <v-card-title class="text-center">
                            <img src="/assets/img/brand/logo.png" alt="logo" height="40">
                            <v-divider class="border-opacity-100 mt-5 mb-4" color="success" />
                            <h1 class="mt-0 mb-0 text-left">Welcome to clicknomics</h1>
                            <p class="font-weight-medium text-left">Please login to continue.</p>
                        </v-card-title>

                        <Form class="login_form" @submit="submitAndAuthenticateUser" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-email-variant" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="email" type="email" name="Email" :class="{'form-control': true ,'border-red-600': errors.Email}" autocomplete="email" placeholder="Email" v-model="userEmail"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                    <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="password" type="password" name="Password" :class="{'form-control': true ,'border-red-600': errors.Password}" autocomplete="current-password" placeholder="Password" v-model="userPassword"/>
                                    <ErrorMessage class="text-red-600" name="Password"/>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" sm="6" md="6" lg="6" class="font-medium font-weight-normal position-relative">
                                    <div class="custom-control custom-control-alternative custom-checkbox">
                                        <input class="custom-control-input" type="checkbox" name="remember" id="customCheckLogin">
                                        <label class="custom-control-label" for="customCheckLogin">
                                            <span class="text-muted">Remember me</span>
                                        </label>
                                    </div>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" lg="6" class="font-medium font-weight-normal position-relative text-right">
                                    <router-link to="/password/reset" class="text-underline">
                                        <small class="font-weight-600 text-blue-darken-2">Forgot password?</small>
                                    </router-link>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Sign In</v-btn>   
                                <p class="font-weight-medium text-muted text-body-2 mb-0">Don't have any account? <router-link to="/signup" class="text-blue-darken-2"> Register</router-link></p>
                                <!-- Don't have any account? <router-link to="/subscribe-plan"> Register</router-link> -->
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
    export default {
        components: {
            Form, Field, ErrorMessage
        },
        data() {
            return {
                showLoader: false,
                userEmail: '',
                userPassword: '',
                invalidEmail: '',
                invalidPassword: '',
                backendErrorMessage: '',
                userDetailsForm: false
            }
        },
        computed: {
            schema() {
                return yup.object({
                    Email: yup.string().required().email(),
                    Password: yup.string().required().min(6),
                });
            },
        },
        mounted() {
            const isAuthenticated = sessionStorage.getItem('Token');
            const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));
            const verifiedBy = JSON.parse(sessionStorage.getItem('verifiedBy'));

            if(isAuthenticated && isVerified) {
                this.$router.push('/dashboard');
            } else if(isAuthenticated && !isVerified) {
                verifiedBy === 'email' ? this.$router.push('/authenticator/validate/email') :this.$router.push('/authenticator/validate');
            }
        },
        methods: {
            // check validation and signin user
            submitAndAuthenticateUser() {
                this.showLoader = true;
                this.axios.get(this.$api_main + '/sanctum/csrf-cookie').then(res => {
                    console.log(res, '212121')
                    this.axios.post(this.$api + '/login', {
                        email: this.userEmail,
                        password: this.userPassword
                    })
                    .then(response => {
                        if(response.data.success) {
                            const responseData = response.data;
                            sessionStorage.setItem('Token', responseData.token);
                            sessionStorage.setItem('Email', this.userEmail);
                            sessionStorage.setItem('verifiedBy', responseData.verified_by);
                            sessionStorage.setItem('isTwoFactorVerified', responseData.isTwoFactorVerified);
                            
                            if(responseData.isTwoFactorVerified) {
                                this.$toast.open({
                                    // message: 'You are successfully logged in',
                                    message: response.data.message,
                                    position: 'top-right',
                                    duration: '5000',
                                    type: 'success'
                                });
                                this.$router.push('/dashboard');
                            } else {
                                if(responseData.verified_by === 'email') {
                                    this.$router.push('/authenticator/validate/email');
                                } else {
                                    this.$router.push('/authenticator/validate');
                                }
                                this.backendErrorMessage = '';
                                this.showLoader = false;
                                this.$toast.open({
                                    // message: 'Please scan qr code or can use try another for authentication',
                                    message: response.data.message,
                                    position: 'top-right',
                                    duration: '5000',
                                    type: 'success'
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error, 'error')
                        this.backendErrorMessage = error.response.data.message;
                        this.showLoader = false;
                    }); 
                }); 
            },
        }
    }
</script>

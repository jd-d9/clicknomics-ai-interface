<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-7 pb-lg-7 pt-lg-8">
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
                            <v-divider class="border-opacity-100 mt-5 mb-1" color="success" />
                            <!-- <h1 class="mt-0 mb-0 text-left">Welcome to clicknomics</h1>
                            <p class="font-weight-medium text-left">Two Factor Verification.</p> -->
                        </v-card-title>

                        <form class="login_form mt" @submit.prevent="sendCodeInEmail" v-if="toggleComponent">
                            <div id="qrcode">
                                <div class="mt-4 text-center">
                                    <p class="font-weight-medium">Verify via email address?
                                    <router-link to="/authenticator/validate" id="show_validate" class="text-blue-darken-2 font-weight-600">Try Another Way</router-link></p>
                                </div>
                                <div class="text-center">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Send Auth Code In Email.</v-btn>   
                                </div>
                            </div>
                        </form>

                        <Form class="login_form mt-3" @submit="checkCodeAndAuthUser" :validation-schema="schema" v-slot="{ errors }" v-else>
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label>Enter an authenticator app code</label>
                                    <Field id="authentication-code" name="Authentication" placeholder="Authenticator app code" class="form-control mb-2" :class="{'form-control': true ,'border-red-600': errors.Authentication}" type="text" v-model="authCode"/>
                                    <span class="text-red-600" v-if="errors.Authentication">Authenticator code is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal py-0">
                                    <label>2FA Verification For 30 Days.</label>
                                    <select class="form-control" placeholder="User Status" v-model="rememberVerification">
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6" sm="6" md="6" lg="6" class="font-medium font-weight-normal position-relative text-left">
                                    <router-link to="" class="text-underline" @click.prevent="sendCodeInEmail">
                                        <small class="font-weight-600 text-blue-darken-2">Resend Code</small>
                                    </router-link>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" lg="6" class="font-medium font-weight-normal position-relative text-right">
                                    <router-link to="/authenticator/validate" class="text-underline">
                                        <small class="font-weight-600 text-blue-darken-2">Try Another way.</small>
                                    </router-link>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Authenticate</v-btn>   
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
    import { Form, Field } from 'vee-validate';
    import axios from '@axios';
    export default {
        components: {
            Form, Field
        },
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                // },
                message: {},
                authCode: '',
                key: '',
                email: '',
                sessionData: '',
                verifiedBy: '',
                rememberVerification: 1,
                toggleComponent: true,
                showLoader: false,
                backendErrorMessage: '',
                multipleErrors: [],
            }
        },
        mounted() {
            // const isAuthenticated = sessionStorage.getItem('Token');
            // const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));

            // if(isAuthenticated && isVerified) {
            //     this.$router.push('/dashboard');
            // } else if(!isAuthenticated && !isVerified) {
            //     this.$router.push('/login');
            // }
        }, 
        computed: {
            schema() {
                return yup.object({
                    Authentication: yup.string().required(),
                });
            },
        },
        methods: {
            // send validation code in email(try another way method)
            sendCodeInEmail() {
                this.showLoader = true;
                axios.get(this.$api + '/authenticator/sendVerifyEmail', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                        if(this.authCode) {
                            this.authCode = '';
                            document.getElementById('authentication-code').focus();
                        }
                        this.toggleComponent = false;
                        this.showLoader = false;
                    }else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
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
            },
            // check authentication code and allow user to logged in
            checkCodeAndAuthUser() {
                let userSession = localStorage.getItem('user-session')
                if(userSession){
                    const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
                    this.sessionData = JSON.parse(decryptedObject)
                    this.email = this.sessionData.Email
                }
                this.showLoader = true;
                axios.post(this.$api + '/authenticator/validateTwoFactorCode', {
                    two_factor_code: this.authCode,
                    remember_2fa: this.rememberVerification,
                    email: this.email,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.message = {
                            text: 'Logged in successfully!',
                            type: 'success',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                        this.sessionData.isTwoFactorVerified = true;
                        const encryptedData = this.$CryptoJS.AES.encrypt(JSON.stringify(this.sessionData), "Clicknomics-AI").toString()
                        localStorage.setItem('user-session',encryptedData)

                        this.showLoader = false;
                        this.$router.push('/dashboard');
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
                    }else {
                        this.message = {
                            text: response.data.message,
                            type: 'error',
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
        }
    }
</script>

<style scoped>
    .height {
        height: 100vh;
    }
    .image-width {
        width: 50%;
    }
</style>
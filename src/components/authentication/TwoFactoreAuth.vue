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
                <v-col cols="12" sm="12" md="8" lg="5" class="m-auto">
                    <v-card class="card_design mb-4 pa-10">
                        <v-card-title class="text-center">
                            <img src="/assets/img/brand/logo.png" alt="logo" height="40">
                            <v-divider class="border-opacity-100 mt-5 mb-4" color="success" />
                            <!-- <h1 class="mt-0 mb-0 text-left">Welcome to clicknomics</h1>
                            <p class="font-weight-medium text-left">Please login to continue.</p> -->
                        </v-card-title>

                        <v-row>
                            <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                <div class="d-flex justify-content-between align-center">
                                    <div v-html="displayQrCode"></div>
                                    <p class="font-weight-medium ml-3">
                                        Unfortunately, you cannot recover your secret keys in your Authenticator app. If you haven't saved the QR codes or secret keys, you should contact the support team of service which you protect with Authenticator and they will help you to restore the access to your account.
                                    </p>
                                </div>
                            </v-col>
                        </v-row>
                        <Form @submit="checkCodeAndAuthUser" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal">
                                    <label>Enter an authenticator app code</label>
                                    <Field name="Authentication" placeholder="Authenticator app code" :class="{'form-control': true ,'border-red-600': errors.Authentication}" type="text" v-model="authCode"/>
                                    <span class="text-red-600" v-if="errors.Authentication">Authenticator code is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="font-medium font-weight-normal">
                                    <label>2FA Verification For 30 Days</label>
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
                                    <router-link to="" class="text-underline" @click.prevent="openModal">
                                        <small class="font-weight-600 text-blue-darken-2">Regenerate 2FA click here?</small>
                                    </router-link>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" lg="6" class="font-medium font-weight-normal position-relative text-right">
                                    <router-link to="/authenticator/validate/email" class="text-underline" @click="tryAnother === true">
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
            <!-- edited modal  -->
            <div class="modal fade" id="confirm2FAModal" tabindex="-1" role="dialog" aria-labelledby="confirm2FAModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Confirm</h5>
                            <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                                <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" >
                                    <label class="font-weight-medium" for="input-username">
                                        Are you sure you want to reset 2FA?
                                    </label>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-red-darken-2 btn_animated mr-3" @click.prevent="resetTwoFactor">Yes</v-btn>    
                                <v-btn class="text-none bg-blue-darken-4 btn_animated" @click.prevent="closeModal">No</v-btn>
                            </v-col>
                        </div>
                    </div>
                </div>
            </div>
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
                message: {},
                showLoader: false,
                displayQrCode: '',
                authCode: '',
                email: '',
                sessionData: '',
                key: '',
                verifiedBy: '',
                rememberVerification: 1,
                tryAnother: false,
                backendErrorMessage: '',
                multipleErrors: [],
            }
        },
        computed: {
            schema() {
                return yup.object({
                    Authentication: yup.string().required(),
                });
            },
        },
        methods: {
            // open and close reset 2FA modal
            openModal() {
                window.$('#confirm2FAModal').modal('show');
            },
            closeModal() {
                window.$('#confirm2FAModal').modal('hide');
            },
            // get and show QR code
            showAuthQrcode() {
                this.showLoader = true;
                axios.get(this.$api + '/authenticator/getQrcode', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    const getData = response.data;
                    this.displayQrCode = getData.inlineUrl;
                    this.key = getData.key;
                    this.verifiedBy = getData.verified_by;
                    this.showLoader = false;
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                    }
                    this.showLoader = false;
                });
            },
            // reset 2factor authentication
            resetTwoFactor() {
                this.showLoader = true;
                axios.get(this.$api + '/authenticator/reset2FAEmail', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.closeModal();
                        this.backendErrorMessage = '';
                        this.multipleErrors = [];
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
                axios.post(this.$api + '/authenticator/validateCode', {
                    google2fa_secret: this.authCode,
                    key: this.key,
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
        },
        mounted() {
            // const isAuthenticated = sessionStorage.getItem('Token');
            // const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));

            // if(isAuthenticated && isVerified) {
            //     this.$router.push('/dashboard');
            // } else if(!isAuthenticated && !isVerified) {
            //     this.$router.push('/login');
            // }
            this.showAuthQrcode();
        }
    }
</script>

<style scoped>
    .height {
        height: 100vh;
    }
    .image-height {
        height: 2.5rem;
    }
    .font-size {
        font-size: .875rem;
    }
</style>
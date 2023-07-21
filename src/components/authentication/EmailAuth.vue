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
                            <v-divider class="border-opacity-100 mt-5 mb-4" color="success" />
                            <h1 class="mt-0 mb-0 text-left">Welcome to clicknomics</h1>
                            <p class="font-weight-medium text-left">Two Factor Verification.</p>
                        </v-card-title>

                        <form class="login_form" @submit.prevent="sendCodeInEmail" v-if="toggleComponent">
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

                        <Form class="login_form" @submit="checkCodeAndAuthUser" :validation-schema="schema" v-slot="{ errors }" v-else>
                            <Field name="Authentication" placeholder="Authenticator app code" class="form-control mb-2" :class="{'border-red-600': errors.Authentication}" type="text" v-model="authCode"/>
                            <span class="text-red-600" v-if="errors.Authentication">Authenticator code can not be empty</span>
                            <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                            <div class="form-group">
                                <label for="formGroupExampleInput2" class="d-block form-control-label">Remember 2FA Verification For 30 Days.</label>
                                <select class="select-option" placeholder="User Status" v-model="rememberVerification">
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            <div class="for-responsive d-flex justify-content-between">
                                <router-link to="/authenticator/validate" class="float-right mb-2">Try Another Way</router-link>
                                <a href="javascript:void(0)" class="float-right mb-2" @click.prevent="sendCodeInEmail">Resend Code</a>
                            </div>
                            <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Authenticate</button>
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
    export default {
        components: {
            Form, Field
        },
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                // },
                authCode: '',
                key: '',
                verifiedBy: '',
                rememberVerification: 1,
                toggleComponent: true,
                showLoader: false,
            }
        },
        mounted() {
            const isAuthenticated = sessionStorage.getItem('Token');
            const isVerified = JSON.parse(sessionStorage.getItem('isTwoFactorVerified'));

            if(isAuthenticated && isVerified) {
                this.$router.push('/dashboard');
            } else if(!isAuthenticated && !isVerified) {
                this.$router.push('/login');
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
            // send validation code in email(try another way method)
            sendCodeInEmail() {
                this.showLoader = true;
                this.axios.get(this.$api + '/authenticator/sendVerifyEmail', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'We have emailed a verification code',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.toggleComponent = false;
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
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    console.log(error)
                    this.showLoader = false;
                });
            },
            // check authentication code and allow user to logged in
            checkCodeAndAuthUser() {
                this.showLoader = true;
                this.axios.post(this.$api + '/authenticator/validateTwoFactorCode', {
                    two_factor_code: this.authCode,
                    remember_2fa: this.rememberVerification,
                    email: sessionStorage.getItem('Email'),
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
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
                        sessionStorage.setItem('isTwoFactorVerified', true);
                        this.showLoader = false;
                        this.$router.push('/dashboard');
                        this.backendErrorMessage = '';
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
                    this.backendErrorMessage = error.message;
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
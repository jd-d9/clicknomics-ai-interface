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
                            <h1 class="mt-0 mb-0 text-left">Reset Password!</h1>
                            <p class="font-weight-medium text-left">Use these awesome forms for Reset Password.</p>
                        </v-card-title>

                        <form class="login_form" @submit.prevent="setNewPassword">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-email-variant" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <input id="email" type="email" class="form-control" :class="{'form-control': true ,'border-red-600': invalidEmail}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail" @keyup="emailIsValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidEmail }}</strong>
                                    </span>
                                    <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <input id="password" type="password" class="form-control" :class="{'form-control': true ,'border-red-600': invalidPassword}" autocomplete="password" autofocus placeholder="New Password" v-model="newPassword" @keyup="passwordIsValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidPassword }}</strong>
                                    </span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <input id="password" type="password" class="form-control" :class="{'form-control': true ,'border-red-600': invalidConfirmPass}" autocomplete="current-password" placeholder="Confirm New Password" v-model="confirmNewPassword" @keyup="confirmPassValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidConfirmPass }}</strong>
                                    </span>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Reset Password</v-btn>   
                            </div>
                        </form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import { useRoute } from 'vue-router';
    // import * as yup from 'yup';
    // import { Form, Field, ErrorMessage } from 'vee-validate';
    export default {
        // components: {
        //     Form, 
        //     Field, 
        //     ErrorMessage
        // },
        data() {
            return {
                showLoader: false,
                userEmail: '',
                newPassword: '',
                confirmNewPassword: '',
                invalidEmail: '',
                invalidConfirmPass: '',
                invalidPassword: '',
                backendErrorMessage: '',
                userDetailsForm: false,
                route: useRoute(),
            }
        },
        computed: {
            // schema() {
            //     return yup.object({
            //         Authentication: yup.string().required(),
            //     });
            // },
        },
        methods: {
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
                if(!this.newPassword) {
                    this.invalidPassword = 'Password is required.';
                }
                else if(this.newPassword.length < 6) {
                    this.invalidPassword = 'Please enter valid password.';
                }
                else {
                    this.invalidPassword = '';
                }
            },
            // confirm password validation
            confirmPassValid() {
                if(!this.confirmNewPassword) {
                    this.invalidConfirmPass = 'Field is required.';
                }
                else if(!this.confirmNewPassword.match(this.newPassword)) {
                    this.invalidConfirmPass = 'Please re-enter password.';
                }
                else {
                    this.invalidConfirmPass = '';
                }
            },
            // check validation and signin user
            setNewPassword() {
                this.passwordIsValid();
                this.confirmPassValid();
                if(this.invalidEmail || !this.userEmail ||this.invalidConfirmPass || this.invalidPassword || !this.newPassword || !this.confirmNewPassword) {
                    return false;
                }
                else{
                    this.showLoader = true;
                    this.axios.post(this.$api + '/resetpassword', {
                        token: this.route.query.token,
                        email: this.route.query.email,
                        password: this.newPassword,
                        password_confirmation: this.confirmNewPassword,
                    })
                    .then(response => {
                        if(response.data.success) {
                            this.$router.push('/login');
                            this.backendErrorMessage = '';
                            this.showLoader = false;
                            this.$toast.open({
                                message: response.data.message,
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                        }else {
                            this.showLoader = false;
                            this.$toast.open({
                                message: response.data.message,
                                position: 'top-right',
                                duration: '5000',
                                type: 'error'
                            });
                        }
                    })
                    .catch(error => {
                        this.backendErrorMessage = error.response.data.message;
                        this.showLoader = false;
                    }); 
                }
            },
        },
        mounted() {
            this.userEmail = this.route.query.email;
        }
    }
</script>

<style scoped>
    .form_icon img {
        width: 30px;
    }
    .logo_responsive img {
        width: 50%;
    }

    .height {
        height: 100vh;
    }
</style>
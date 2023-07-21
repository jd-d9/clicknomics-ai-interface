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
                            <h1 class="mt-0 mb-0 text-left">Reset Password!</h1>
                            <p class="font-weight-medium text-left">Use these awesome forms for Reset Password.</p>
                        </v-card-title>

                        <Form class="login_form" @submit="sendResetPasswordLink" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-email-variant" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="email" type="email" name="Email" :class="{'form-control': true ,'border-red-600': errors.Email}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail"/>
                                    <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                    <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Send Password Reset Link</v-btn>   
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
            Form, 
            Field, 
            ErrorMessage
        },
        data() {
            return {
                userEmail: '',
                invalidEmail: '',
                backendErrorMessage: '',
                showLoader: false,
            }
        }, 
        computed: {
            schema() {
                return yup.object({
                    Email: yup.string().required().email(),
                });
            },
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
            // send reset password link in mail
            sendResetPasswordLink() {
                this.showLoader = true;
                this.emailIsValid();
                if(!this.userEmail || this.invalidEmail) {
                    return false;
                }
                else{
                    this.axios.post(this.$api + '/forgotpassword', {
                        email: this.userEmail,
                    })
                    .then(response => {
                        if(response.data.success) {
                            this.userEmail = '';
                            this.$toast.open({
                                message: response.data.message,
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.backendErrorMessage = '';
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
                        console.log(error.response);
                        this.backendErrorMessage = error.message;
                        this.showLoader = false;
                    });
                }
            }
        }
    }
</script>

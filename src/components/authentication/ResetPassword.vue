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
                            <h1 class="mt-0 mb-0 text-center">Forgot Your Password?</h1>
                            <p class="font-weight-medium text-left text-wrap">Enter your email and we'll send you a link to reset your password.</p>
                            <!-- <h1 class="mt-0 mb-0 text-left">Reset Password!</h1>
                                <p class="font-weight-medium text-left">Use these awesome forms for Reset Password.</p> -->
                        </v-card-title>

                        <Form class="login_form" @submit="sendResetPasswordLink" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-email-variant" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="email" type="email" name="Email" :class="{'form-control': true ,'border-red-600': errors.Email}" placeholder="Email" v-model="userEmail"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Reset Password</v-btn>   
                                <p class="font-weight-medium text-muted text-body-2 mb-0"><router-link to="/login" class="text-blue-darken-2">Back To Login</router-link></p>
                            </div>
                        </Form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import axios from '@axios';
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
                message: {},
                userEmail: '',
                invalidEmail: '',
                backendErrorMessage: '',
                multipleErrors: [],
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
            // send reset password link in mail
            sendResetPasswordLink() {
                this.showLoader = true;
                axios.post(this.$api + '/forgotpassword', {
                    email: this.userEmail,
                })
                .then(response => {
                    if(response.data.success) {
                        this.userEmail = '';
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                        this.$router.push('/login');
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
            }
        }
    }
</script>

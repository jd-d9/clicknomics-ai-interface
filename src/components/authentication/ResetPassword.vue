<template>
    <div class="bg-default">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Main content -->
        <div class="main-content height" id="panel">
            <!-- Header -->
            <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
                <div class="container">
                    <div class="header-body text-center mb-5">
                        <div class="row justify-content-center">
                            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                                <h1 class="text-white">Reset Password!</h1>
                                <p class="text-lead text-white">Use these awesome forms to Reset Password.</p>
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
                    <div class="col-lg-5 col-md-7">
                        <div class="card bg-secondary border-0 mb-0">
                            <div class="card-body px-lg-5 py-lg-5">
                                <div class="text-center logo_responsive">
                                    <img src="/assets/img/brand/logo.png" style="width:50%">
                                </div>
                                <Form class="mt-5 login_form" @submit="sendResetPasswordLink" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="form-group mb-3 position-relative">
                                        <span class="form_icon">
                                            <img src="/assets/img/icons/envelope.svg">
                                        </span>
                                        <Field id="email" type="email" name="Email" class="form-control" :class="{'border-red-600': errors.Email}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail"/>
                                        <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                        <ErrorMessage class="text-red-600" name="Email"/>
                                        <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Send Password Reset Link</button>
                                    </div>
                                </Form>
                            </div>
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

<style scoped>
    .form_icon img {
        width: 30px;
    }
    .height {
        height: 100vh;
    }
</style>
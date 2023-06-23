<template>
    <div class="main-content bg-default height">
        <loader-component v-if="hideShowLoader"></loader-component>
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
                                <img src="/assets/img/brand/logo.png" alt="logo">
                            </div>
                            <form class="mt-5 login_form" @submit.prevent="setNewPassword">
                                <div class="form-group mb-3 position-relative">
                                    <span class="form_icon">
                                        <img src="/assets/img/icons/envelope.svg">
                                    </span>
                                    <input id="email" type="email" class="form-control" :class="{'is-invalid': invalidEmail}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail" @keyup="emailIsValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidEmail }}</strong>
                                    </span>
                                    <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </div>
                                <div class="form-group mb-3 position-relative">
                                    <span class="form_icon">
                                        <img src="/assets/img/icons/lock.svg">
                                    </span>
                                    <input id="password" type="password" class="form-control" :class="{'is-invalid': invalidPassword}" autocomplete="password" autofocus placeholder="New Password" v-model="newPassword" @keyup="passwordIsValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidPassword }}</strong>
                                    </span>
                                </div>
                                <div class="form-group mb-3 position-relative">
                                    <span class="form_icon">
                                        <img src="/assets/img/icons/lock.svg">
                                    </span>
                                    <input id="password" type="password" class="form-control" :class="{'is-invalid': invalidConfirmPass}" autocomplete="current-password" placeholder="Confirm New Password" v-model="confirmNewPassword" @keyup="confirmPassValid">
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ invalidConfirmPass }}</strong>
                                    </span>
                                </div>
                                <div class="row">
                                    <div class="col-6 text-left">
                                        <div class="custom-control custom-control-alternative custom-checkbox">
                                            <input class="custom-control-input" type="checkbox" name="remember" id="customCheckLogin">
                                            <label class="custom-control-label" for="customCheckLogin">
                                                <span class="text-muted">Remember me</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Reset Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { useRoute } from 'vue-router';
    // import * as yup from 'yup';
    // import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
    // import { required } from '@vee-validate/rules';
    // import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
    // defineRule('required', required);
    // loadLocaleFromURL(
    // 'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/ar.json'
    // );
    // configure({
    //     generateMessage: localize('en', {
    //         messages: {
    //             required: '{field} can not be empty!',
    //         },
    //         // fields: {
    //         //     Status: {
    //         //         required: 'Status can not be empty!!!'
    //         //     }
    //         // }
    //     }),
    // });
    export default {
        // components: {
        //     Form, Field, ErrorMessage
        // },
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                //     envelope: require('/assets/img/icons/envelope.svg'),
                //     lock: require('/assets/img/icons/lock.svg'),
                // },
                hideShowLoader: false,
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
                    this.hideShowLoader = true;
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
                            this.hideShowLoader = false;
                            this.$toast.open({
                                message: 'New password successfully set',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                        }
                    })
                    .catch(error => {
                        this.backendErrorMessage = error.response.data.message;
                        this.hideShowLoader = false;
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
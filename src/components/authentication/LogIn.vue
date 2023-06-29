<template>
    <div class="main-content bg-default height">
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
            <div class="container">
                <div class="header-body text-center mb-5">
                    <div class="row justify-content-center">
                        <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                            <h1 class="text-white">Welcome to clicknomics</h1>
                            <p class="text-lead text-white">Please login to continue.</p>
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
                            <Form class="mt-5 login_form" @submit="submitAndAuthenticateUser" :validation-schema="schema" v-slot="{ errors }">
                                <div class="form-group mb-3 position-relative">
                                    <span class="form_icon">
                                        <img src="/assets/img/icons/envelope.svg">
                                    </span>
                                    <Field id="email" type="email" name="Email" class="form-control" :class="{'border-red-600': errors.Email}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail"/>
                                    <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                    <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </div>
                                <div class="form-group mb-3 position-relative">
                                    <span class="form_icon">
                                        <img src="/assets/img/icons/lock.svg">
                                    </span>
                                    <Field id="password" type="password" name="Password" class="form-control" :class="{'border-red-600': errors.Password}" autocomplete="current-password" placeholder="Password" v-model="userPassword"/>
                                    <!-- <span class="text-red-600" v-if="errors.Password">Password can not be empty</span> -->
                                    <ErrorMessage class="text-red-600" name="Password"/>
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
                                    <div class="col-6 text-right">
                                        <router-link to="/password/reset" class="text-dark text-underline">
                                            <small class="font-weight-600">Forgot password?</small>
                                        </router-link>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Sign In</button>
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
    import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
    import { required } from '@vee-validate/rules';
    import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
    defineRule('required', required);
    loadLocaleFromURL(
    'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/ar.json'
    );
    configure({
        generateMessage: localize('en', {
            messages: {
                required: '{field} can not be empty!',
            },
            // fields: {
            //     Status: {
            //         required: 'Status can not be empty!!!'
            //     }
            // }
        }),
    });
    export default {
        components: {
            Form, Field, ErrorMessage
        },
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                //     envelope: require('/assets/img/icons/envelope.svg'),
                //     lock: require('/assets/img/icons/lock.svg'),
                // },
                hideShowLoader: false,
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
                this.hideShowLoader = true;
                this.axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(res => {
                    console.log(res, '212121')
                    this.axios.post(this.$api + '/login', {
                        email: this.userEmail,
                        password: this.userPassword
                    })
                    .then(response => {
                        if(response.data.success) {
                            // this.$session.set('Token', response.data.token);
                            // this.$session.set('Email', this.userEmail);
                            // console.log(this.$session, 'vue-session');
                            const responseData = response.data;
                            sessionStorage.setItem('Token', responseData.token);
                            sessionStorage.setItem('Email', this.userEmail);
                            sessionStorage.setItem('verifiedBy', responseData.verified_by);
                            sessionStorage.setItem('isTwoFactorVerified', responseData.isTwoFactorVerified);
                            
                            if(responseData.isTwoFactorVerified) {
                                this.$router.push('/dashboard');
                            } else {
                                if(responseData.verified_by === 'email') {
                                    this.$router.push('/authenticator/validate/email');
                                } else {
                                    this.$router.push('/authenticator/validate');
                                }

                            }
                            
                            this.backendErrorMessage = '';
                            this.hideShowLoader = false;
                            this.$toast.open({
                                message: 'Please scan qr code or can use try another for authentication',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error, 'error')
                        this.backendErrorMessage = error.response.data.message;
                        this.hideShowLoader = false;
                    }); 
                }); 
            },
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
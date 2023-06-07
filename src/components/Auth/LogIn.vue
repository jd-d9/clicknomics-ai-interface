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
                                <img :src="images.logo" alt="logo">
                            </div>
                            <!-- <ValidationObserver v-slot="{ submitAndAuthenticateUser }"> -->
                                <form class="mt-5 login_form" @submit.prevent="submitAndAuthenticateUser">
                                    <div class="form-group mb-3 position-relative">
                                        <span class="form_icon">
                                            <img :src="images.envelope">
                                        </span>
                                        <input id="email" type="email" class="form-control" :class="{'is-invalid': invalidEmail}" autocomplete="email" autofocus placeholder="Email" v-model="userEmail" @keyup="emailIsValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidEmail }}</strong>
                                        </span>
                                        <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        <!-- <ValidationProvider v-slot="{ error }" rules="required" name="Email">
                                            <input type="email" id="input-username" :class="{'form-control': true , 'border-red-600':error!= '' ? true : false }" placeholder="Email" v-model="userEmail">
                                            <span class="text-red-600">{{ error }}</span>
                                        </ValidationProvider> -->
                                        <!-- <ValidationProvider v-slot="{ error }" rules="required|email" name="email">
                                            <input type="email" id="input-username" :class="{'form-control': true , 'border-red-600':error!= '' ? true : false }" placeholder="Email" v-model="email">
                                            <span class="text-red-600">{{ error[0] }}</span>
                                        </ValidationProvider> -->
                                    </div>
                                    <div class="form-group mb-3 position-relative">
                                        <span class="form_icon">
                                            <img :src="images.lock">
                                        </span>
                                        <input id="password" type="password" class="form-control" :class="{'is-invalid': invalidPassword}" autocomplete="current-password" placeholder="Password" v-model="userPassword" @keyup="passwordIsValid">
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ invalidPassword }}</strong>
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
                                        <div class="col-6 text-right">
                                            <router-link to="/password/reset" class="text-dark text-underline">
                                                <small class="font-weight-600">Forgot password?</small>
                                            </router-link>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Sign In</button>
                                    </div>
                                </form>
                            <!-- </ValidationObserver> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                images: {
                    logo: require('../../assets/img/brand/logo.png'),
                    envelope: require('../../assets/img/icons/envelope.svg'),
                    lock: require('../../assets/img/icons/lock.svg'),
                },
                hideShowLoader: false,
                userEmail: '',
                userPassword: '',
                invalidEmail: '',
                invalidPassword: '',
                backendErrorMessage: '',
                userDetailsForm: false
            }
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
                if(!this.userPassword) {
                    this.invalidPassword = 'Password is required.';
                }
                else if(this.userPassword.length < 6) {
                    this.invalidPassword = 'Please enter valid password.';
                }
                else {
                    this.invalidPassword = '';
                }
            },
            // check validation and signin user
            submitAndAuthenticateUser() {
                this.emailIsValid();
                this.passwordIsValid();
                if(this.invalidEmail || this.invalidPassword || !this.userEmail || !this.userPassword) {
                    return false;
                }
                else{
                    this.hideShowLoader = true;
                    this.axios.post(this.$api + '/login', {
                        email: this.userEmail,
                        password: this.userPassword
                    })
                    .then(response => {
                        if(response.data.success) {
                            // this.$session.set('Token', response.data.token);
                            // this.$session.set('Email', this.userEmail);
                            // console.log(this.$session, 'vue-session');
                            sessionStorage.setItem('Token', response.data.token);
                            sessionStorage.setItem('Email', this.userEmail);
                            this.$router.push('/authenticator/validate');
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
                }
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
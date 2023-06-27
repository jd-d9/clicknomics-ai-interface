<template>
    <div class="main-content bg-default height" id="panel">
        <loader-component v-if="hideShowLoader"></loader-component>
            <div class="main-content">
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
                        <div class="col-lg-9 col-md-7">
                            <div class="card bg-secondary border-0 mb-0">
                                <div class="card-body px-lg-4 py-lg-4">
                                    <div class="text-center logo_responsive  mb-5">
                                        <img src="/assets/img/brand/logo.png" class="image-height">
                                    </div>
                                    <Form @submit="checkCodeAndAuthUser" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="text-center">
                                            <div v-html="displayQrCode"></div>
                                        </div>
                                        <div class="text-center"></div>
                                        <span class="d-block mb-4 font-size">
                                            Unfortunately, you cannot recover your secret keys in your Authenticator app. If you haven't saved the QR codes or secret keys, you should contact the support team of service which you protect with Authenticator and they will help you to restore the access to your account.
                                        </span>
                                        <span class="mb-2">Enter an authenticator app code:</span>
                                        <Field name="Authentication" placeholder="Authenticator app code" class="form-control mb-2" :class="{'border-red-600': errors.Authentication}" type="text" v-model="authCode"/>
                                        <span class="text-red-600" v-if="errors.Authentication">Authenticator code can not be empty</span>
                                        <ErrorMessage class="text-red-600" name="Authentication"/>
                                        <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        <div class="form-group">
                                            <label for="formGroupExampleInput2" class="d-block form-control-label">Remember 2FA Verification For 30 Days.</label>
                                            <select class="select-option" placeholder="User Status" v-model="rememberVerification">
                                                <option value="1">Yes</option>
                                                <option value="0">No</option>
                                            </select>
                                            <!-- <span class="text-red-600">error</span> -->
                                        </div>
                                        <div class="for-responsive">
                                            <a href="javascript:void(0)" class="text-right" data-bs-toggle="modal" data-bs-target="#confirm2FAModal">Regenerate 2FA click here?</a>
                                            <router-link to="/authenticator/validate/email" class="float-right mb-2" @click="tryAnother === true">Try Another way.</router-link>
                                        </div>
                                        <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Authenticate</button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- edited modal  -->
            <div class="modal fade" id="confirm2FAModal" tabindex="-1" role="dialog" aria-labelledby="confirm2FAModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-white">Confirm</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span class="text-white" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Are you sure want to reset 2FA?</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="button" class="btn btn-primary btn-lg btn_animated">Yes</button>
                                        <button type="button" class="btn btn-danger btn-lg btn_animated text-white" data-bs-dismiss="modal">No</button>
                                    </div>
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
                // },
                hideShowLoader: false,
                displayQrCode: '',
                authCode: '',
                key: '',
                verifiedBy: '',
                rememberVerification: 1,
                tryAnother: false,
                backendErrorMessage: '',
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
            // get and show QR code
            showAuthQrcode() {
                this.hideShowLoader = true;
                this.axios.get(this.$api + '/authenticator/getQrcode', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    console.log(response.data, 'qr code url');
                    const getData = response.data;
                    this.displayQrCode = getData.inlineUrl;
                    this.key = getData.key;
                    this.verifiedBy = getData.verified_by;
                    this.hideShowLoader = false;
                })
                .catch(error => {
                    this.hideShowLoader = false;
                    console.log(error)
                });
            },
            // check authentication code and allow user to logged in
            checkCodeAndAuthUser() {
                // if scan and enter auth code
                if(this.displayQrCode && !this.tryAnother || this.verifiedBy == '2fa App') {  // 2fa app
                    this.hideShowLoader = true;
                    this.axios.post(this.$api + '/authenticator/validateCode', {
                        google2fa_secret: this.authCode,
                        key: this.key,
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
                                message: 'You are successfully logged in',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.hideShowLoader = false;
                            this.$router.push('/dashboard');
                            this.backendErrorMessage = '';
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.backendErrorMessage = error.response.data.message;
                        this.hideShowLoader = false;
                    });
                }
                // if use try another way method
                else {
                    this.hideShowLoader = true;
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
                                message: 'You are successfully logged in',
                                position: 'top-right',
                                duration: '5000',
                                type: 'success'
                            });
                            this.hideShowLoader = false;
                            this.$router.push('/dashboard');
                            this.backendErrorMessage = '';
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        this.backendErrorMessage = error.response.data.message;
                        this.hideShowLoader = false;
                    });
                }
            }
        },
        mounted() {
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
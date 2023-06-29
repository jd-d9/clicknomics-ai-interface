<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
            <div class="container">
                <div class="header-body text-center mb-5">
                    <div class="row justify-content-center">
                        <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                            <h1 class="text-white">Subscription plans</h1>
                            <p class="text-lead text-white">We have best plans for you.</p>
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
                <div class="col-lg-4 col-md-6">
                    <div class="card bg-secondary border-0 mb-0">
                        <div class="card-body px-lg-5 py-lg-5">
                            <div class="plan">
                                <span class="plan-heading fw-bold">Free</span>
                                
                            </div>
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
                showLoader: false,
                userName: '',
                userEmail: '',
                userPassword: '',
                confirmPassword: '',
                countryCode: '',
                mobileNumber: '',
                backendErrorMessage: '',
            }
        },
        computed: {

        },
        methods: {

        }
    }
</script>

<style scoped>
    .form_icon img {
        width: 30px;
    }
    .logo_responsive img {
        width: 25%;
    }
    .height {
        height: 100vh;
    }
    .form_icon_32 img {
        width: 32px;
    }
    .plan-heading {
        font-size: 28px;
    }
</style>
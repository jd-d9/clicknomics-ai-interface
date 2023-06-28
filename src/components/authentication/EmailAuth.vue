<template>
    <div class="bg-default">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Main content -->
        <div class="main-content height" id="panel">
            <div class="main-content">
                <!-- Header -->
                <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
                    <div class="container">
                        <div class="header-body text-center mb-5">
                            <div class="row justify-content-center">
                                <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                                    <h1 class="text-white">Welcome to clicknomics</h1>
                                    <p class="text-lead text-white">Two Factor Verification.</p>
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
                <div class="container mt--7 mt-lg--8">
                    <div class="row justify-content-center">
                        <div class="col-lg-7 col-md-7">
                            <div class="card bg-secondary border-0">
                                <div class="card-body px-lg-5 py-lg-5">
                                    <div class="text-center logo_responsive">
                                        <img src="/assets/img/brand/logo.png" class="image-width">
                                    </div>
                                    <form class="mt-5 login_form" @submit.prevent="sendCodeInEmail">
                                        <div id="qrcode" class="text-center">
                                            <span class="d-block">
                                                Verify via email address?
                                            </span>
                                            <router-link to="/authenticator/validate" id="show_validate">Try Another Way</router-link>
                                            <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Send Auth Code In Email.</button>
                                        </div>
                                    </form>
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
    export default {
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                // },
                showLoader: false,
            }
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
                        this.$router.push('/authenticator/validate');
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
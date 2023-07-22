<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Main content -->
        <div id="panel">
            <!-- Header -->
            <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
                <div class="container">
                    <div class="header-body text-center mb-5">
                        <div class="row justify-content-center">
                            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                                <h1 class="text-white">Welcome to clicknomics</h1>
                                <p class="text-lead text-white">Reset 2Factor Authentication!</p>
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
                                <form class="mt-5 login_form" @submit.prevent="resetTwoFactorAuth">
                                    <div class="form-group mb-3 position-relative">
                                        <span class="form_icon">
                                            <img src="/assets/img/icons/envelope.svg">
                                        </span>
                                    </div>
                                    <div class="text-center">
                                        <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Reset 2Factor Authentication</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { useRoute } from 'vue-router';
    export default {
        data() {
            return {
                // images: {
                //     logo: require('/assets/img/brand/logo.png'),
                //     envelope: require('/assets/img/icons/envelope.svg'),
                // },
                showLoader: false,
                route: useRoute(),
            }
        },
        methods: {
            // send token and reset authentication
            resetTwoFactorAuth() {
                this.showLoader = true;
                this.axios.post(this.$api + '/authenticator/reset', {
                    token: this.route.query.token,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.$router.push('/login');
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error.response);
                    this.$toast.open({
                        message: error.response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                });
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
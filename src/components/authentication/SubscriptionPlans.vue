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
                <div class="col-lg-4 col-md-6" v-for="plan in plans" :key="plan">
                    <div class="card bg-secondary border-0 mb-0">
                        <div class="card-body px-lg-5 py-lg-5">
                            <div class="plan">
                                <h2 class="plan-heading text-center fw-bold">{{plan.name}}</h2>
                                <p class="plan-price text-center mb-0">${{plan.amount}}</p>
                                <p class="mb-0 text-center text-size">Per Month</p>
                                <hr class="my-4 dropdown-divider">
                                <div class="plan-content">
                                    <p>1 Seat</p>
                                    <p>1 Runner</p>
                                    <p>300 Pipeline GB-minute</p>
                                    <router-link to="/signup" class="btn btn-primary mt-4 btn-block btn_animated">Select Plan</router-link>
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
                showLoader: false,
                plans: [],
                userName: '',
                userEmail: '',
                userPassword: '',
                confirmPassword: '',
                countryCode: '',
                mobileNumber: '',
                backendErrorMessage: '',
            }
        },
        mounted() {
            this.getPlans();
        },
        methods: {
            // get plans listing
            getPlans() {
                this.showLoader = true;
                this.axios.get(this.$api + '/subscription')
                .then(response => {
                    if(response.data.success) {
                        this.plans = response.data.data;
                        console.log(this.plans)
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
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
        position: relative;
        font-size: 25px;
        margin-bottom: 30px;
    }
    .plan-heading::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 40%;
        width: 20%;
        height: 4px;
        background-color: #005eb3;
    }
    .plan-price {
        font-size: 45px;
        line-height: 1;
    }
    .text-size {
        font-size: 12px;
    }
    .dropdown-divider {
        border-top: 1px solid #e5e5e5 !important;
    }
</style>
<template>
    <div class="bg-default main-content-height">
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
                <div class="card bg-transparent">
                    <div class="card-header bg-transparent">
                        <div class="nav-wrapper report_tabpanel">
                            <ul class="nav nav-pills nav-fill flex-column flex-md-row justify-content-center" id="tabs-icons-text" role="tablist">
                                <li class="nav-item">
                                    <router-link to="" class="nav-link mb-sm-3 mb-md-0 active" id="tabs-icons-text-2-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-2" role="tab" aria-controls="tabs-icons-text-2" aria-selected="false">
                                        <span class="btn-inner--text">All</span>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="" class="nav-link mb-sm-3 mb-md-0" id="tabs-icons-text-3-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-3" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false">
                                        <span class="btn-inner--text">Monthly</span>
                                    </router-link>
                                </li>
                                <li class="nav-item">
                                    <router-link to="" class="nav-link mb-sm-4 mb-md-0" id="tabs-icons-text-4-tab" data-bs-toggle="tab" data-bs-target="#tabs-icons-text-4" role="tab" aria-controls="tabs-icons-text-3" aria-selected="false">
                                        <span class="btn-inner--text">Yearly</span>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="finance_data tab-content myTabContent">
                            <div class="tab-pane fade show active" id="tabs-icons-text-2" role="tabpanel" aria-labelledby="tabs-icons-text-2-tab">
                                <div class="row justify-content-center">
                                    <div class="col-lg-4 col-md-6 mb-4" v-for="plan in allPlans" :key="plan">
                                        <div class="card bg-secondary border-0 mb-0">
                                            <div class="card-body px-lg-5 py-lg-5">
                                                <div class="plan">
                                                    <h2 class="plan-heading text-center fw-bold">{{plan.name}}</h2>
                                                    <p class="plan-price text-center mb-0">${{plan.amount}}</p>
                                                    <p class="mb-0 text-center text-size">Per {{plan.interval}}</p>
                                                    <hr class="my-4 dropdown-divider">
                                                    <div class="plan-content">
                                                        <p>{{plan.trial_period_days}} Trial period day</p>
                                                        <p>{{plan.user_limit}} User access limit</p>
                                                        <router-link to='' class="btn btn-primary mt-4 btn-block btn_animated" @click="selectPlan(plan.id)">Select Plan</router-link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade show" id="tabs-icons-text-3" role="tabpanel" aria-labelledby="tabs-icons-text-3-tab">
                                <div class="row justify-content-center">
                                    <div class="col-lg-4 col-md-6 mb-4" v-for="plan in monthlyPlans" :key="plan">
                                        <div class="card bg-secondary border-0 mb-0">
                                            <div class="card-body px-lg-5 py-lg-5">
                                                <div class="plan">
                                                    <h2 class="plan-heading text-center fw-bold">{{plan.name}}</h2>
                                                    <p class="plan-price text-center mb-0">${{plan.amount}}</p>
                                                    <p class="mb-0 text-center text-size">Per {{plan.interval}}</p>
                                                    <hr class="my-4 dropdown-divider">
                                                    <div class="plan-content">
                                                        <p>{{plan.trial_period_days}} Trial period day</p>
                                                        <p>{{plan.user_limit}} User access limit</p>
                                                        <router-link to='' class="btn btn-primary mt-4 btn-block btn_animated" @click="selectPlan(plan.id)">Select Plan</router-link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade show" id="tabs-icons-text-4" role="tabpanel" aria-labelledby="tabs-icons-text-4-tab">
                                <div class="row justify-content-center">
                                    <div class="col-lg-4 col-md-6 mb-4" v-for="plan in yearlyPlans" :key="plan">
                                        <div class="card bg-secondary border-0 mb-0">
                                            <div class="card-body px-lg-5 py-lg-5">
                                                <div class="plan">
                                                    <h2 class="plan-heading text-center fw-bold">{{plan.name}}</h2>
                                                    <p class="plan-price text-center mb-0">${{plan.amount}}</p>
                                                    <p class="mb-0 text-center text-size">Per {{plan.interval}}</p>
                                                    <hr class="my-4 dropdown-divider">
                                                    <div class="plan-content">
                                                        <p>{{plan.trial_period_days}} Trial period day</p>
                                                        <p>{{plan.user_limit}} User access limit</p>
                                                        <router-link to='' class="btn btn-primary mt-4 btn-block btn_animated" @click="selectPlan(plan.id)">Select Plan</router-link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                allPlans: [],
                monthlyPlans: [],
                yearlyPlans: [],
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
                        this.allPlans = response.data.data;
                        this.monthlyPlans = this.allPlans.filter((val) => {
                            return val.interval.toLowerCase() == 'month';
                        });
                        this.yearlyPlans = this.allPlans.filter((val) => {
                            return val.interval.toLowerCase() == 'year';
                        });
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
            },
            // select plan and redirect to register page
            selectPlan(id) {
                // this.$toast.open({
                //     message: 'Plan selected, please register your self',
                //     position: 'top-right',
                //     duration: '5000',
                //     type: 'success'
                // });
                sessionStorage.setItem('subscriptionPlanId', id);
                this.$router.push('/signup');
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
    .card {
        box-shadow: none;
    }
    .card-header {
        border-bottom: none;
    }
    .card-header {
        padding: 0;
    }
    .nav-fill .nav-item {
        flex: unset;
    }
    .nav-pills .nav-link.active, .nav-pills .show > .nav-link {
        color: #005eb3 !important;
        background-color: #fff !important;
    }
    .report_tabpanel .nav-pills .nav-link {
        color: #fff;
        background-color: transparent;
        border: 1px solid white;
    }
</style>
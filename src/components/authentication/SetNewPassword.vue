<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-7 pb-lg-7 pt-lg-8">
            <div class="separator separator-bottom separator-skew zindex-100">
                <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
                </svg>
            </div>
        </div>
        <!-- Page content -->
        <v-container class="mt--8 mt-lg--8 pb-5 login_screen">
            <v-row>
                <v-col cols="12" sm="8" md="5" lg="4" class="m-auto">
                    <v-card class="card_design mb-4 pa-10">
                        <v-card-title class="text-center">
                            <img src="/assets/img/brand/logo.png" alt="logo" height="40">
                            <v-divider class="border-opacity-100 mt-5 mb-3" color="success" />
                            <h1 class="mt-0 mb-3 text-center">Set New Password!</h1>
                        </v-card-title>

                        <Form class="login_form" @submit="setNewPassword" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field id="password" type="password" name="Password" class="form-control" :class="{'form-control': true ,'border-red-600': errors.Password}" placeholder="New Password" v-model="newPassword"/>
                                    <ErrorMessage class="text-red-600" name="Password"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative">
                                    <v-icon icon="mdi-lock-outline" size="30" color="#00cd00" class="form_icon"></v-icon>
                                    <Field name="confirmPassword" id="password" type="password" class="form-control" :class="{'form-control': true ,'border-red-600': errors.confirmPassword}" placeholder="Confirm New Password" v-model="confirmNewPassword"/>
                                    <span class="text-red-600" v-if="errors.confirmPassword">Password did not match</span>
                                </v-col>

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>
                            </v-row>
                            <div class="text-center">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mt-4 mb-3 btn-block">Reset Password</v-btn>   
                            </div>
                        </Form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import { useRoute } from 'vue-router';
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
                showLoader: false,
                newPassword: '',
                confirmNewPassword: '',
                backendErrorMessage: '',
                multipleErrors: [],
                route: useRoute(),
            }
        },
        computed: {
            schema() {
                return yup.object({
                    Password: yup.string().required().min(6),
                    confirmPassword: yup.string().required().oneOf([yup.ref('Password')], 'Passwords do not match'),
                });
            },
        },
        methods: {
            // check validation and signin user
            setNewPassword() {
                this.showLoader = true;
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
                        this.multipleErrors = [];
                        this.showLoader = false;
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                    }else {
                        this.showLoader = false;
                        this.$toast.open({
                            message: response.data.message,
                            position: 'top-right',
                            duration: '5000',
                            type: 'error'
                        });
                    }
                })
                .catch(error => {
                    if(error.response.data.message) {
                        this.backendErrorMessage = error.response.data.message;
                    }
                    if(error.response.data.error) {
                        this.backendErrorMessage = error.response.data.error;
                    }
                    if(error.response.data.errors) {
                        if(error.response.data.errors.length == 1) {
                            this.backendErrorMessage = error.response.data.errors[0];
                        }else if(error.response.data.errors.length == 0){
                            this.backendErrorMessage = '';
                        }else {
                            this.multipleErrors = error.response.data.errors;
                        }
                    }
                    this.showLoader = false;
                });
            },
        },
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
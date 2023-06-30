<template>
    <div class="main-content bg-default height">
        <loader-component v-if="showLoader"></loader-component>
        <!-- Header -->
        <div class="header bg-gradient-primary py-5 pb-lg-7 pt-lg-6">
            <div class="container">
                <div class="header-body text-center mb-5">
                    <div class="row justify-content-center">
                        <div class="col-xl-5 col-lg-6 col-md-8 px-5">
                            <h1 class="text-white">Welcome to clicknomics</h1>
                            <p class="text-lead text-white">Use these awesome forms to Register.</p>
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
                <div class="col-lg-10 col-md-7">
                    <div class="card bg-secondary border-0 mb-0">
                        <div class="card-body px-lg-5 py-lg-5">
                            <div class="text-center logo_responsive">
                                <img src="/assets/img/brand/logo.png" alt="logo">
                            </div>
                            <Form class="mt-5 login_form" @submit="signUpUser" :validation-schema="schema" v-slot="{ errors }">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="profile-image-wrapper">
                                            <label class="profile-image">
                                                <input type="file" class="d-none" @change="uploadProfilePhoto">
                                                <img :src="profileImage" alt="img">
                                            </label>
                                            <label class="edit-icon">
                                                <input type="file" class="d-none" @change="uploadProfilePhoto">
                                                <img src="/assets/img/icons/edit.svg" alt="img">
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/person.svg">
                                            </span>
                                            <Field id="name" type="text" name="Name" class="form-control" :class="{'border-red-600': errors.Name}" placeholder="Name" v-model="userName"/>
                                            <span class="text-red-600" v-if="errors.Name">Name can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Name"/> -->
                                            <small class="backend-error" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/envelope.svg">
                                            </span>
                                            <Field id="email" type="email" name="Email" class="form-control" :class="{'border-red-600': errors.Email}" autocomplete="email" placeholder="Email" v-model="userEmail"/>
                                            <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                            <ErrorMessage class="text-red-600" name="Email"/>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/lock.svg">
                                            </span>
                                            <Field id="password" type="password" name="Password" class="form-control" :class="{'border-red-600': errors.Password}" autocomplete="current-password" placeholder="Password" v-model="userPassword"/>
                                            <span class="text-red-600" v-if="errors.Password">Password can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Password"/> -->
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/lock.svg">
                                            </span>
                                            <Field id="confirm_password" type="password" name="confPassword" class="form-control" :class="{'border-red-600': errors.confPassword}" autocomplete="current-password" placeholder="Confirm password" v-model="confirmPassword"/>
                                            <span class="text-red-600" v-if="errors.confPassword">Confirm password can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="confPassword"/> -->
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon">
                                                <img src="/assets/img/icons/country.png">
                                            </span>
                                            <Field id="confirm_password" type="text" name="Country" class="form-control" :class="{'border-red-600': errors.Country}" autocomplete="current-password" placeholder="Country code" v-model="countryCode"/>
                                            <span class="text-red-600" v-if="errors.Country">Country code can not be empty</span>
                                            <!-- <ErrorMessage class="text-red-600" name="Country"/> -->
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group mb-3 position-relative">
                                            <span class="form_icon form_icon_32">
                                                <img src="/assets/img/icons/phone.png">
                                            </span>
                                            <Field id="confirm_password" type="number" name="Mobile" class="form-control" :class="{'border-red-600': errors.Mobile}" autocomplete="current-password" placeholder="Mobile number" v-model="mobileNumber"/>
                                            <!-- <span class="text-red-600" v-if="errors.Mobile">Mobile number can not be empty</span> -->
                                            <ErrorMessage class="text-red-600" name="Mobile"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary mt-4 btn-block btn_animated">Sign Up</button>
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
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import defaultImage from '../../assets/img/DefaultImage.js';
    export default {
        components: {
            Form, Field, ErrorMessage
        },
        data() {
            return {
                showLoader: false,
                userName: '',
                userEmail: '',
                userPassword: '',
                confirmPassword: '',
                countryCode: '',
                mobileNumber: '',
                profileImage: defaultImage,
                backendErrorMessage: '',
            }
        },
        computed: {
            schema() {
                return yup.object({
                    Name: yup.string().required(),
                    Email: yup.string().required().email(),
                    Password: yup.string().required(),
                    confPassword: yup.string().required(),
                    Country: yup.string().required(),
                    Mobile: yup.string().required().min(10)
                });
            },
        },
        methods: {
            // submit data and signup user
            signUpUser() {
                this.showLoader = true;
                this.axios.post(this.$api + '/registration', {
                    name: this.userName,
                    email: this.userEmail,
                    password: this.userPassword,
                    password_confirmation: this.confirmPassword,
                    country_code: this.countryCode,
                    phone_number: this.mobileNumber,
                    profile_image: this.profileImage,
                })
                .then(response => {
                    if(response.data.success) {
                        this.showLoader = false;
                        this.backendErrorMessage = '';
                        this.$toast.open({
                            message: 'User registration success',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.$router.push('/login');
                    }
                })
                .catch(error => {
                    console.log(error, 'error')
                    this.backendErrorMessage = error.response.data.message;
                    this.showLoader = false;
                }); 
            },
            // upload profile image
            uploadProfilePhoto(event) {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                    let profileImage64 = reader.result;
                    this.profileImage = profileImage64;
                }
                reader.readAsDataURL(file);
            },
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
    .profile-image {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 1px solid #b9bbbc;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile-image-wrapper {
        position: relative;
        width: 150px;
        margin: 0 auto;
        margin-bottom: 20px;
    }
    .profile-image-wrapper .edit-icon {
        position: absolute;
        top: 75%;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #e2e2e2;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .profile-image-wrapper .edit-icon img {
        width: 20px;
        height: 20px;
    }
    .profile-image img {
        width: 100%;
    }
</style>
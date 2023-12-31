<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs class="form_breadcume">
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Integrate Cloudways</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/settings/cloudways" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            Integrate Cloudways
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" /> 

                        <Form @submit="integrateCloudwaysServer" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model="email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">API KEY</label>
                                    <Field type="text" id="input-username" name="apiKey" :class="{'form-control': true, 'border-red-600': errors.apiKey}" placeholder="API KEY" v-model="api_key"/>
                                    <span class="text-red-600" v-if="errors.apiKey">Api key is a required field</span>
                                </v-col> 

                                <v-col v-if="backendErrorMessage" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-if="backendErrorMessage">{{ backendErrorMessage }}</small>
                                </v-col>

                                <v-col v-if="multipleErrors.length > 0" cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal position-relative mb-0 mt-0 pt-0 pb-0">
                                    <small class="text-red-600" v-for="(error, ind) in multipleErrors" :key="ind">{{ind + 1 + '.'}} {{ error }}</small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                </v-col> 
                            </v-row>
                        </Form>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from '@axios';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    // props: ['report'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            message: {},
            showLoader: false,
            api_key: '',
            email: '',
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    computed: {
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
                apiKey: yup.string().required(),
            });
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        // create new cloudway
        integrateCloudwaysServer() {
            this.showLoader = true;
            axios.post(this.$api + '/settings/cloudways', {
                email: this.email,
                api_key: this.api_key,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/cloudways');
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.backendErrorMessage = '';
                    this.multipleErrors = [];
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
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
    }
}
</script>

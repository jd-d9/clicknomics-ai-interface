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
                            <span>Integrate Domain</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/settings/domain" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title>
                            Integrate Domain
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" /> 

                        <Form @submit="integrateDomain" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" placeholder="Email" v-model="email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col> 
                                
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Domain Platform</label>
                                    <Field name="Domain" v-model="domain_selected">
                                        <select name="Domain" :class="{'form-control': true , 'border-red-600':errors.Domain}" placeholder="Select Role" v-model="domain_selected">
                                            <option value="">Select Network</option>
                                            <option value="Namecheap">Namecheap</option>
                                            <option value="GoDaddy">GoDaddy</option>
                                            <option value="Namesilo">Namesilo</option>
                                            <option value="Njal">Njal</option>
                                            <option value="Easydns">Easydns</option>
                                        </select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Domain">Domain platform is a required field</span>
                                </v-col> 

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">API KEY</label>
                                    <Field type="text" id="input-username" name="apiKey" :class="{'form-control': true, 'border-red-600': errors.apiKey}" placeholder="API KEY" v-model="api_key"/>
                                    <span class="text-red-600" v-if="errors.apiKey">Api key is a required field</span>
                                </v-col>  

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal" v-if="domain_selected == 'Namecheap' || domain_selected == 'Easydns'">
                                    <label class="form-control-label">User Name</label>
                                    <Field type="text" id="input-username" name="userName" :class="{'form-control': true, 'border-red-600': errors.userName}" placeholder="User Name" v-model="username"/>
                                    <span class="text-red-600" v-if="errors.userName">User Name is a required field</span>
                                </v-col> 

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal" v-if="domain_selected == 'GoDaddy' || domain_selected == 'Easydns'">
                                    <label class="form-control-label">{{ domain_selected == 'Easydns' ? 'Token' : 'API Secret'}}</label>
                                    <Field type="text" id="input-username" name="apisecret" :class="{'form-control': true, 'border-red-600': errors.apisecret}" :placeholder="domain_selected == 'Easydns' ? 'Token' : 'API Secret'" v-model="api_secret"/>
                                    <span class="text-red-600" v-if="errors.apisecret">{{errors.domain_selected == 'Easydns' ? 'Token' : 'API Secret' + 'is a required field'}}</span>
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
import { Form, Field,ErrorMessage } from 'vee-validate';
export default {
    // props: ['report'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            message: {},
            showLoader: false,
            domain_selected: '',
            api_key: '',
            api_secret: '',
            username: '',
            email: '',
            backendErrorMessage: '',
            multipleErrors: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    computed: {
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
                Domain: yup.string().required(),
                apiKey: yup.string().required(),
                userName: this.domain_selected == 'Namecheap' || this.domain_selected == 'Easydns' ? yup.string().required() : '',
                apisecret: this.domain_selected == 'GoDaddy' || this.domain_selected == 'Easydns' ? yup.string().required() : '',
            });
        },
    },
    methods: {
        // integrate new domain
        integrateDomain() {
            this.showLoader = true;
            axios.post(this.$api + '/settings/domain', {
                email: this.email,
                domain_selected: this.domain_selected,
                api_secret: this.api_secret,
                api_key: this.api_key,
                username: this.username,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/domain');
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

<style scoped>

</style>

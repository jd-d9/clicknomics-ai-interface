<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <router-link to="/settings/plaid" class="d-flex align-center">
                                <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                                <span>Plaid</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Create</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/settings/plaid" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            Create Plaid
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />  
                        <Form @submit="addNewPliad" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Client Id</label>
                                    <Field type="text" id="input-username" name="clientId" :class="{'form-control': true, 'border-red-600': errors.clientId}" step=".01" placeholder="Add Client Id" v-model="clientId"/>
                                    <span class="text-red-600" v-if="errors.clientId">Client id is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Client Secret</label>
                                    <Field type="text" id="input-username" name="clientSecret" :class="{'form-control': true, 'border-red-600': errors.clientSecret}" step=".01" placeholder="Add Client Secrete" v-model="clientSecret" @update:modelValue="getInstitutions"/>
                                    <span class="text-red-600" v-if="errors.clientSecret">Client secret is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Email</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true, 'border-red-600': errors.Email}" step=".01" placeholder="Add Email" v-model="email"/>
                                    <ErrorMessage class="text-red-600" name="Email"/>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Institution</label>
                                    <Field name="institution" v-model="institution">
                                        <v-autocomplete :class="{'form-control autocomplete': true, 'border-red-600': errors.institution}" :items="itemList" v-model="institution" placeholder="Select institution" item-value="key"></v-autocomplete>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.institution">Institution is a required field</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Notes</label>
                                    <textarea :class="{ 'form-control': true }" name="" rows="3" v-model="notes"></textarea>
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
    components: {
        Form, 
        Field,
        ErrorMessage
    },
    data() {
        return {
            message: {},
            showLoader: false,
            itemList: [],
            backendErrorMessage: '',
            multipleErrors: [],
            clientId: '',
            clientSecret: '',
            notes: '',
            email: '',
            institution: '',
            institutionName: '',
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
                clientId: yup.string().required(),
                clientSecret: yup.string().required(),
                Email: yup.string().required().email(),
                institution: yup.string().required(),
            });
        },
    },
    watch: {
        // send institution name using institution id
        institution(val) {
            const name = this.itemList.filter((data) => {
                return data.key == val
            })
            if(name.length > 0) {
                this.institutionName = name[0].title;
            }
        }
    },
    methods: {
        // create new pliad
        addNewPliad() {
            this.showLoader = true;
            axios.post(this.$api + '/settings/publicTokenexchange', {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                email: this.email,
                institution_id: this.institution,
                notes: this.notes,
                institute_name: this.institutionName,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/plaid');
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
        // get institution data
        getInstitutions() {
            this.showLoader = true;
            axios.post(this.$api + '/settings/getInstitute', {
                client_id: this.clientId,
                client_secret: this.clientSecret,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.itemList = [];
                    response.data.data.institutions.forEach((val) => {
                        this.itemList.push({
                            title: val.name,
                            key: val.institution_id
                        })
                    });
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

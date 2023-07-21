<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <router-link to="/dashboard" class="d-flex align-center">
                            <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                            <span>Dashboard</span>
                        </router-link>
                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Integrate Cloudways</span>

                        <v-spacer />
                        <v-btn to="/settings/cloudways" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
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
                                    <span class="text-red-600" v-if="errors.apiKey">Api key can not be empty</span>
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
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
    // props: ['report'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            api_key: '',
            email: '',
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
            this.axios.post(this.$api + '/settings/cloudways', {
                email: this.email,
                api_key: this.api_key,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/cloudways');
                    this.$toast.open({
                        message: 'Cloudway created',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
    }
}
</script>

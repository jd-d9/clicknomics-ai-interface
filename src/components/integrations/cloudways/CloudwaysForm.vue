<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Integrate Cloudways</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/cloudways" class="btn btn-lg btn-neutral btn_animated">View Cloudways Data</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="hideShowLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="integrateCloudwaysServer" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Email</label>
                                                <Field type="text" id="input-username" name="Email" :class="{'form-control': true , 'border-red-600':errors.Email}" placeholder="Email" v-model="email"/>
                                                <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                                <ErrorMessage class="text-red-600" name="Email"/>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">API KEY</label>
                                                <Field type="text" id="input-username" name="apiKey" :class="{'form-control': true , 'border-red-600':errors.apiKey}" placeholder="Name" v-model="api_key"/>
                                                <span class="text-red-600" v-if="errors.apiKey">Api key can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="apiKey"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Integrate</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
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
export default {
    // props: ['report'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            hideShowLoader: false,
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
    methods: {
        // create new cloudway
        integrateCloudwaysServer() {
            this.hideShowLoader = true;
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
                    this.hideShowLoader = false;
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
                this.hideShowLoader = false;
            });
        },
    }
}
</script>

<style scoped>

</style>

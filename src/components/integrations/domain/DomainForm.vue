<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <!-- <h6 class="h2 text-white d-block mb-0">Integrate Cake Affiliate</h6> -->
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Integrate Domain</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/domain" class="btn btn-lg btn-neutral btn_animated">View Domains</router-link>
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
                                <Form @submit="integrateDomain" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Email</label>
                                                <Field type="text" id="input-username" name="Email" :class="{'form-control': true , 'border-red-600':errors.Email }" placeholder="Email" v-model="email"/>
                                                <!-- <span class="text-red-600" v-if="errors.Email">Email can not be empty</span> -->
                                                <ErrorMessage class="text-red-600" name="Email"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Domain Platform</label>
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
                                                <span class="text-red-600" v-if="errors.Domain">Domain platform can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Domain"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">API KEY</label>
                                                <Field name="apiKey" type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors.apiKey}" placeholder="Name" v-model="api_key"/>
                                                <span class="text-red-600" v-if="errors.apiKey">Api key can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="apiKey"/> -->
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0" v-if="domain_selected == 'Namecheap' || domain_selected == 'Easydns'">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Username</label>
                                                <input type="text" :class="{'form-control': true}" placeholder="Username" v-model="username"/>
                                                <!-- <Field name="userName" type="text" :class="{'form-control': true , 'border-red-600':errors.userName}" placeholder="Username" v-model="username"/> -->
                                                <!-- <span class="text-red-600" v-if="errors.userName">Username can not be empty</span> -->
                                                <!-- <ErrorMessage class="text-red-600" name="userName"/> -->
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0" v-if="domain_selected == 'GoDaddy' || domain_selected == 'Easydns'">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">{{ domain_selected == 'Easydns' ? 'Token' : 'API Secret'}}</label>
                                                <input type="text" :class="{'form-control': true}" :placeholder="domain_selected == 'Easydns' ? 'Token' : 'API Secret'" v-model="api_secret"/>
                                                <!-- <Field type="text" :name="domain_selected == 'Easydns' ? 'Token' : 'API Secret'" :class="{'form-control': true , 'border-red-600':errors.domain_selected == 'Easydns' ? 'Token' : 'API Secret'}" :placeholder="domain_selected == 'Easydns' ? 'Token' : 'API Secret'" v-model="api_secret"/> -->
                                                <!-- <span class="text-red-600" v-if="errors.errors.domain_selected == 'Easydns' ? 'Token' : 'API Secret'">{{errors.domain_selected == 'Easydns' ? 'Token' : 'API Secret' + 'can not be empty'}}</span> -->
                                                <!-- <ErrorMessage class="text-red-600" :name="errors.domain_selected == 'Easydns' ? 'Token' : 'API Secret'"/> -->
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
import { Form, Field,ErrorMessage } from 'vee-validate';
export default {
    // props: ['report'],
    components: {
        Form, Field, ErrorMessage
    },
    data() {
        return {
            hideShowLoader: false,
            domain_selected: '',
            api_key: '',
            api_secret: '',
            username: '',
            email: '',
        }
    },
    mounted() {
    },
    computed: {
        schema() {
            return yup.object({
                Email: yup.string().required().email(),
                Domain: yup.string().required(),
                apiKey: yup.string().required(),
            });
        },
    },
    methods: {
        // integrate new domain
        integrateDomain() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/settings/domain', {
                email: this.email,
                domain_selected: this.domain_selected,
                api_secret: this.api_secret,
                api_key: this.api_key,
                username: this.username,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/settings/domain');
                    this.$toast.open({
                        message: 'Domain created',
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

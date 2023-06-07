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
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Integrate Domain</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/domain" class="btn btn-lg btn-neutral btn_animated">View Domains</a>
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
                                <form>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Email</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" placeholder="Email" v-model="email">
                                                <span class="text-red-600">{{ errors[0] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Domain Platform</label>
                                                <select :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" placeholder="Select Role" v-model="domain_selected">
                                                    <option value="">Select Network</option>
                                                    <option value="Namecheap">Namecheap</option>
                                                    <option value="GoDaddy">GoDaddy</option>
                                                    <option value="Namesilo">Namesilo</option>
                                                    <option value="Njal">Njal</option>
                                                    <option value="Easydns">Easydns</option>
                                                </select>
                                                <span class="text-red-600">{{ errors[0] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">API KEY</label>
                                                <input type="text" id="input-username"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" placeholder="Name" v-model="api_key">
                                                <span class="text-red-600">{{ errors[0] }}</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0" v-if="domain_selected == 'Namecheap' || domain_selected == 'Easydns'">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Username</label>
                                                <input type="text" :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" placeholder="Username" v-model="username">
                                                <span class="text-red-600">{{ errors[0] }}</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0" v-if="domain_selected == 'GoDaddy' || domain_selected == 'Easydns'">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">{{ domain_selected == 'Easydns' ? 'Token' : 'API Secret'}}</label>
                                                <input type="text"  :class="{'form-control': true , 'border-red-600':errors!= '' ? true : false }" :placeholder="domain_selected == 'Easydns' ? 'Token' : 'API Secret'" v-model="api_secret">
                                                <span class="text-red-600">{{ errors[0] }}</span>
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
                                </form>
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
            images: {
                edit: require('../../assets/img/icons/edit.svg'),
                bin: require('../../assets/img/icons/bin.svg'),
                networks: require('../../assets/img/icons/networks.svg'),
            },
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
    methods: {

    }
}
</script>

<style scoped>

</style>

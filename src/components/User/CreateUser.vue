<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header contents -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <router-link to="/settings/user">Users</router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Create User</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <router-link to="/settings/user" class="btn btn-lg btn-neutral btn_animated">Back</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- user form component -->
        <user-form></user-form>
    </div>
</template>

<script>
import UserForm from './UserForm.vue';
export default {
    components: {
        UserForm,
    },
    data() {
        return {

        }
    },
    methods:{

    },
    mounted() {

    }
}
</script>

<style  scoped>

</style>

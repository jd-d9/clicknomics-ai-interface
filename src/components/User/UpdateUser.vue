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
                            <router-link to="/settings/user" class="d-flex align-center">
                                <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                                <span>Users</span>
                            </router-link>
    
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Edit User</span>
                        </div>
                        <v-spacer/>
                        <div class="button_div">
                            <v-btn to="/settings/user" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                                Back
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <!-- user form component -->
                    <user-form></user-form>
                </v-col>
            </v-row>
        </v-container> 
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }
}
</script>

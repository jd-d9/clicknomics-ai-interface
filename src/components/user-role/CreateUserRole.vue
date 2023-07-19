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
                        <span>Create User Roles</span>

                        <v-spacer />
                        <v-btn to="/settings/user_management/user_roles" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <!-- user role form component -->
                    <user-role-form></user-role-form>
                </v-col>
            </v-row>
        </v-container>        
    </div>
</template>

<script>
import UserRoleForm from './UserRoleForm.vue';
export default {
    components: {
        UserRoleForm
    },
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {

    }
}
</script>

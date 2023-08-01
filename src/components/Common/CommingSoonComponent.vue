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
                        <span v-if="toggleElement">{{ this.$route.params.routeName }}</span>
                        <span v-else>Archived Reports Facebook</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title v-if="toggleElement">
                            {{ this.$route.params.routeName }}
                        </v-card-title>
                        <v-card-title v-else>
                            Archived Reports Facebook
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <v-col class="text-center m-auto" cols="12" sm="8" md="6" lg="4">
                            <img src="/assets/img/brand/coming_soon.png" style="width:100%" alt="" title="">
                        </v-col>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            toggleElement: true,
        }
    },
    methods: {

    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        
        if(window.location.pathname == '/reporting/archivedReports/facebook') {
            this.toggleElement = false;
        }else {
            this.toggleElement = true;
        }
    }
}
</script>

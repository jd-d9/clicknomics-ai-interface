<template>
    <div class="bg-default main-content-height">
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
                                    <li class="breadcrumb-item active" aria-current="page" v-if="toggleElement">{{ this.$route.params.routeName }}</li>
                                    <li class="breadcrumb-item active" aria-current="page" v-else>Archived Reports Facebook</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">Coming Soon</h4>
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
            toggleElement: true,
        }
    },
    methods: {

    },
    mounted() {
        if(window.location.pathname == '/reporting/archivedReports/facebook') {
            this.toggleElement = false;
        }else {
            this.toggleElement = true;
        }
        console.log(this.$route.params.routeName, 'Route Name');
    }
}
</script>

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
                                    <li class="breadcrumb-item active" aria-current="page">Process Email Report</li>
                                </ol>
                            </nav>
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
                            <v-app>
                                <div class="col-12">
                                <form>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <input type="date" class="form-control" v-model="resultDate">
                                                <!-- <date-picker :class="{'border-red-600':errors!= '' ? true : false }"  v-model="date" valueType="format" format="YYYY-MM-DD"></date-picker> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click="dialog = true">Generate Report</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                </div>
                                <v-dialog v-model="dialog" width="500">
                                    <v-card>
                                        <v-card-title class="text-h5 text-center">Email Send Successfully</v-card-title>
                                        <v-card-text>Report For Date {{resultDate}} Send Successfully</v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-app>
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
            hideShowLoader: false,
            dialog: false,
            date: '',
            resultDate: '',
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

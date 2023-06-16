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
                                    <li class="breadcrumb-item active" aria-current="page">Add Fixed Monthly Cost</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/fixedMonthlyCost" class="btn btn-lg btn-neutral btn_animated">View Fixed Monthly Cost Listing</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoaderComponent v-if="showLoader"></LoaderComponent>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <!-- <div class="card-header">
                            <h3 class="mb-0 float-left">Fixed Monthly Cost</h3>
                            <div class="float-right">
                                <router-link to="/accounting/fixedMonthlyCost" class="btn btn-lg btn-neutral btn_animated">View Fixed Monthly Cost Listing</router-link>
                            </div>
                        </div> -->
                        <div class="card-body">
                            <div class="col-12">
                                <form>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <date-picker v-model="date" valueType="format" range format="YYYY-MM-DD"></date-picker>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <input type="number" id="input-username"  :class="{'form-control': true}" placeholder="Add Amount" v-model="amount">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
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
            showLoader: false,
            date: '',
            amount: '',
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

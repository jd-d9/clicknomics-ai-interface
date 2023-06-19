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
                                    <li class="breadcrumb-item active" aria-current="page">{{breadCrumbMessage}} Variable Monthly Cost</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/variableMonthlyCost" class="btn btn-lg btn-neutral btn_animated">View Variable Monthly Cost Listing</router-link>
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
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3" v-if="toggleElement">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <datepicker v-model="date" range :locale="locale" :clearable="true" format="YYYY-MM-DD"/>
                                                <div :class="{'date-is-invalid': invalidDate}">
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ invalidDate }}</strong>
                                                    </span>
                                                </div>
                                            </div>
                                            <!-- <div class="form-group date-picker-3" v-else>
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <datepicker v-model="date" :locale="locale" :clearable="true" format="YYYY-MM-DD"/>
                                                <div :class="{'date-is-invalid': invalidDate}">
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ invalidDate }}</strong>
                                                    </span>
                                                </div>
                                            </div> -->
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <input type="number" id="input-username"  :class="{'form-control': true}" step=".01" placeholder="Add Amount" v-model="amount">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <textarea :class="{'form-control': true}"  name="" cols="30" rows="10" v-model="notes"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" v-if="toggleElement">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="createVariableMonthlyCost">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" v-else>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click.prevent="updateVariableMonthlyCost">Update</button>
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
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
export default {
    components: {
        Datepicker
    },
    data() {
        return {
            hideShowLoader: false,
            date: '',
            amount: '',
            notes: '',
            breadCrumbMessage: 'Add',
            toggleElement: true,
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbMessage = 'Update';
            this.toggleElement = false;
        }
    },
    methods: {
        // create variable monthly cost
        createVariableMonthlyCost() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/variableCost', {
                date: '2023-06-01,2023-06-07',
                // date: moment(this.date).format('YYYY-MM-DD'),
                amount: this.amount,
                notes: this.notes,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/accounting/variableMonthlyCost');
                    this.$toast.open({
                        message: 'Variable monthly cost created',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // get data for edit
        getDataForEdit() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data.data;
                    console.log(data)
                    this.date = new Date(data.date),
                    this.amount = data.amount,
                    this.notes = data.notes,
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // update variable monthly cost
        updateVariableMonthlyCost() {
            this.hideShowLoader = true;
            this.axios.post(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                _method: 'PUT',
                date: moment(this.date).format('YYYY-MM-DD'),
                amount: this.amount,
                notes: this.notes,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$router.push('/accounting/variableMonthlyCost');
                    this.$toast.open({
                        message: 'Variable monthly cost updated',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
    }
}
</script>

<style scoped>

</style>

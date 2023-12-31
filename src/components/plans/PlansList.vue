<template>
    <div class="bg-default main-content-height">
        <loader-component v-if="showLoader"></loader-component>
        <v-container>
            <v-row class="ma-0">
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-breadcrumbs>
                        <div class="d-flex">
                            <router-link to="/dashboard" class="d-flex align-center">
                                <v-icon icon="mdi-view-dashboard mr-2"></v-icon>
                                <span>Dashboard</span>
                            </router-link>
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>Plan Management </span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="addNewPlan" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Plan List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end responsive_margin">
                                <v-col cols="12" lg="6" md="6" sm="12" class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search"/>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :search="search" :items="items" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id ? item.selectable.id : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name ? item.selectable.name : '-'}}
                            </template>
                            <template v-slot:[`item.plan_detail`]="{ item }">
                                {{$filters.toCurrency(item.selectable.plan_detail.amount)}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                {{item.selectable.status == 0 ? 'Inactive' : 'Active'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">  
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editPlan(item.selectable.id)" :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deletePlan(item.selectable.id)" :disabled="permissions.delete_auth == '0' || item.selectable.id == 1">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn> 
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import axios from '@axios';
export default {
    data() {
        return {
            message: {},
            headers: [
                { title: 'ID', key: 'id', align: 'start' },
                { title: 'Name', key: 'name' },
                { title: 'Amount', key: 'plan_detail' },
                { title: 'Status', key: 'status' },
                { title: 'Action', align:'center', key: 'action', sortable: false },
            ],
            itemsPerPage: -1,
            search: '',
            items: [],
            plansFilter: [],
            permissions: {},
            showLoader: false,
            isHidden: false,
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getPlans();
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // get all plans
        getPlans() {
            this.showLoader = true;
            axios.get(this.$api + '/settings/plan', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    console.log(data, 'data -- data')
                    this.items = data.data;
                    // this.items = data.data.map((val) => {
                    //     return {...val,planData: JSON.parse(val.planData)}
                    // })
                    console.log(this.items)
                    this.plansFilter = data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
        // for display amount value which has interval value month
        displayAmount(data) {
            if(data.length > 1) {
                const Data = data.find((val) => {
                    return val.interval == 'month'
                })
                return Data ? Data.amount : data[0].amount;
            }
            else if(data.length == 1){
                return data[0].amount;
            }
        },
        // add new plan
        addNewPlan() {
            this.$router.push('/settings/plan-management/create');
        },
        // edit plan
        editPlan(id) {
            this.$router.push('/settings/plan-management/' + id + '/edit');
        },
        // delete plan
        deletePlan(id) {
            this.showLoader = true;
            axios.delete(this.$api + '/settings/plan/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.getPlans();
                }else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if(error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if(error.response.data.errors) {
                    if(error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }else if(error.response.data.errors.length == 0){
                        this.backendErrorMessage = '';
                    }else {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                }
                this.showLoader = false;
            });
        },
    }
}
</script>

<style scoped>
    .image-width {
        width: 30px;
    }
    .border-right, .thead-light {
        border: 1px solid #dedede !important;
    }
    .table th {
        padding: 0.75rem !important;
    }
    .collumn-width {
        width: 15%;
    }
    .collumn-width2 {
        width: 25%;
    }
    .disable {
        pointer-events: none;
        cursor: progress;
    }
    .disable-button {
        border: none;
        background: transparent;
    }
    .disable-button[disabled] {
        cursor: not-allowed;
    }
    .add-side-borders {
        border-left: 1px solid #dee2e6;
        border-right: 1px solid #dee2e6;
    }
</style>

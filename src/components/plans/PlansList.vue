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
                        <span>Plan Management </span>

                        <v-spacer />
                        <v-btn @click.prevent="addNewPlan" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Plan Management List
                            <v-spacer></v-spacer>
                            <div class="col-3 pr-1">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="searchInput" @keyup="searchPlan"/>
                            </div>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name}}
                            </template>
                            <template v-slot:[`item.plan_detail`]="{ item }">
                                ${{displayAmount(item.selectable.plan_detail)}}
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

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon @click.prevent="deletePlan(item.selectable.id)" :disabled="permissions.delete_auth == '0'">
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
export default {
    data() {
        return {
            // images: {
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            // },
            headers: [
                { title: 'ID', key: 'id', align: 'start' },
                { title: 'Name', key: 'name' },
                { title: 'Amount', key: 'amount' },
                { title: 'Status', key: 'status' },
                { title: 'Action', align:'center', key: 'action', sortable: false },
            ],
            itemsPerPage: -1,
            searchInput: '',
            items: [],
            plansFilter: [],
            permissions: {},
            showLoader: false,
        }
    },
    mounted() {
        this.getPlans();
    },
    methods: {
        // search plan from table
        searchPlan() {
            this.items = this.plansFilter.filter((val) => {
                return  val.name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.amount.toString().concat(" ", val.currency).toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.id.toString().includes(this.searchInput.toLowerCase()) 
            })
        },
        // get all plans
        getPlans() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/plan', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.items = data.data;
                    // this.items = data.data.map((val) => {
                    //     return {...val,planData: JSON.parse(val.planData)}
                    // })
                    console.log(this.items)
                    this.plansFilter = data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                this.showLoader = false;
                console.log(error)
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
            this.axios.delete(this.$api + '/settings/plan/' + id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.showLoader = false;
                    this.$toast.open({
                        message: 'Plan deleted',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.getPlans();
                }
            })
            .catch(error => {
                this.showLoader = false;
                this.$toast.open({
                    message: error.response.data.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
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

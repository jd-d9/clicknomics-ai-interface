<template>
    <div class="bg-default main-content-height">
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <!-- header content -->
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <router-link to="/dashboard"><i class="fas fa-home"></i></router-link>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Plans</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'" @click.prevent="addNewPlan">Add New Plan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col" v-if="permissions.view == '1'">
                    <div class="card">
                        <div class="card-body">
                            <v-app>
                                <v-card>
                                    <v-card-title>
                                        <v-spacer></v-spacer>
                                        <div class="text-end">
                                            <div class="row">
                                                <div class="col-3 ms-auto">
                                                    <div class="ms-auto search-input position-relative">
                                                        <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPlan">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </v-card-title>
                                    <!-- data table component -->
                                    <v-data-table class="table-hover-class" :footer-props="{'items-per-page-options': [5, 10, 15, -1], 'items-per-page-text': 'Rows per page:'}" :headers="headers" :items="items" :itemsPerPage="itemsPerPage">
                                        <template v-slot:item="{ item }">
                                            <tr class="table-body-back">
                                                <th>{{item.selectable.id}}</th>
                                                <td>{{item.selectable.name}}</td>
                                                <!-- currently working on this portion -->
                                                <td v-for="data in item.selectable.planData" :key="data">
                                                    <span v-if="item.selectable.planData.length == 1">${{data.amount}}</span>
                                                    <!-- <span v-if="item.selectable.planData.length > 1 && data.interval == 'month'">${{data.amount}}</span> -->
                                                </td>
                                                <td>{{item.selectable.status == 0 ? 'Inactive' : 'Active'}}</td>
                                                <td class="text-center">
                                                    <button class="disable-button" :disabled="permissions.update_auth == '0'" @click.prevent="editPlan(item.selectable.id)">
                                                        <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit user">
                                                    </button>
                                                    <!-- <button class="disable-button" :disabled="permissions.delete_auth == '0'" @click.prevent="deletePlan(item.selectable.id)">
                                                        <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete user">
                                                    </button> -->
                                                </td>
                                            </tr>
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-app>
                        </div>
                    </div>
                </div>
                <div class="col" v-else>
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
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
                    // this.items = data.data;
                    this.items = data.data.map((val) => {
                        return {...val,planData: JSON.parse(val.planData)}
                    })
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
        // add new plan
        addNewPlan() {
            this.$router.push('/settings/plan-management/create');
        },
        // edit plan
        editPlan(id) {
            this.$router.push('/settings/plan-management/' + id + '/edit');
        },
        // delete plan
        // deletePlan(id) {
        //     this.showLoader = true;
        //     this.axios.delete(this.$api + '/settings/plan/' + id, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${sessionStorage.getItem('Token')}`
        //         }
        //     })
        //     .then(response => {
        //         if(response.data.success) {
        //             this.showLoader = false;
        //             this.$toast.open({
        //                 message: 'Plan deleted',
        //                 position: 'top-right',
        //                 duration: '5000',
        //                 type: 'success'
        //             });
        //             this.getPlans();
        //         }
        //     })
        //     .catch(error => {
        //         this.showLoader = false;
        //         this.$toast.open({
        //             message: error.response.data.message,
        //             position: 'top-right',
        //             duration: '5000',
        //             type: 'error'
        //         });
        //     }); 
        // },
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

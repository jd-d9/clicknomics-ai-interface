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
                        <span>CPA Eliminated Networks</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            CPA Eliminated Networks List
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="linkedNewtworks" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.id`]="{ item }">
                                {{item.selectable.id}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                {{item.selectable.name}}
                            </template>
                            <template v-slot:[`item.email`]="{ item }">
                                {{item.selectable.email ? item.selectable.email : '-' }}
                            </template>
                            <template v-slot:[`item.affiliate_id`]="{ item }">
                                {{item.selectable.affiliate_id}}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                <div class="text-capitalize">{{item.selectable.network}}</div>
                            </template>
                            <template v-slot:[`item.company`]="{ item }">
                                {{item.selectable.company ? item.selectable.company : '-' }}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-' }}
                            </template>
                            <template v-slot:[`item.deleted_at`]="{ item }">
                                {{format_date(item.selectable.deleted_at)}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click="restoreAutomatedNetwork(item.selectable.id)">
                                    <v-icon color="deep-purple-darken-4">
                                        mdi-restore
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Restore</v-tooltip>
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
import moment from 'moment';
export default {
    data() {
        return {
            showLoader: false,
            linkedNewtworks: [],
            headers: [
                { title: 'Network ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Network Name', align: 'start', sortable: true, key: 'name' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Login ID',  key: 'affiliate_id', align: 'center' },
                { title: 'Platform Type',  key: 'network', align: 'center' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date On Removed',  key: 'deleted_at', align: 'center' },
                { title: 'Action',  key: 'action', align: 'center', sortable: false},
            ],
            itemsPerPage: -1,
            list: {
                id: null,
                name: null,
                email: null,
                platform_type: null,
                notes: null,
                company: null,
            },
            permissions: {},
        }
    },
    mounted() {
        this.getEliminatedAutomatedNetwork();
    },
    methods: {
        // formate date
        format_date(value){
            if (value) {
                return moment(String(value)).format('YYYY-MM-DD')
            }
        },
        // get manual network listing
        getEliminatedAutomatedNetwork() {
            this.showLoader = true;
            this.axios.get(this.$api + '/network/eliminated-automated-networks', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data;
                    this.linkedNewtworks = data.data;
                    this.permissions = data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // restore data
        restoreAutomatedNetwork(id) {
            if(confirm("Do you really want to restore network?")) {
                this.showLoader = true;
                let formData = new FormData();
                formData.append('id', id);
                this.axios.post(this.$api + '/network/eliminated-automated-network/restoreAutomatedNetwork', formData,{
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                        }
                    })
                .then(response => {
                    this.showLoader = false;
                    this.$toast.open({
                        message: response.data.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.linkedNewtworks = response.data.data;
                }).catch(error => {
                    this.showLoader = false;
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                });
            }
        },
    }
}
</script>

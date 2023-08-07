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
                        <span>Blacklist Integrity Check</span>
                        <v-spacer />
                        <v-btn @click.prevent="createDomainModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                        Blacklist Integrity Check List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.url`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.url ? item.selectable.url : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.ip`]="{ item }">
                                {{item.selectable.ip ? item.selectable.ip : '-'}}
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <div class="text-red-lighten-1" v-if="item.selectable.status ==='Listed'">
                                    {{item.selectable.status ? 'Blacklisted' : '-'}}
                                </div>
                                <div class="text-green-lighten-1" v-if="item.selectable.status ==='OK'">
                                    {{item.selectable.status ? 'No Issues' : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.action`]>    
                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon>
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>  
                                <v-btn class="ma-2 bg-deep-purple-lighten-4" variant="text" icon @click.prevent="viewblacklistModal">
                                    <v-icon color="deep-purple-darken-4">
                                        mdi-eye
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">View</v-tooltip>
                                </v-btn>  
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>

        <div class="modal fade" id="adddomain" tabindex="-1" role="dialog" aria-labelledby="adddomainTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Blacklist Integrity Check</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeDomainModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Domain</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true}" v-model="item.site_url" placeholder="Domain"/>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeDomainModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="viewBlacklist" tabindex="-1" role="dialog" aria-labelledby="viewBlacklistTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report Url</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeblacklistModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul style="text-decoration:none">
                            <li v-for="(item , index) in resultData" :key="index">
                                <span><b>{{item.host}} :</b></span>
                                <span v-if="item.listed == false" style="color:green">
                                    No Issues
                                </span>
                                <span v-else style="color:red">
                                    Blacklisted
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {

    },
    data() {
        return {
            message: {},
            showLoader: false,
            search: '',
            headers: [
                { title: 'Site Url', key: 'url'},
                { title: 'Site IP', key: 'ip', align: 'center' },
                { title: 'Status', key: 'status' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            urlList: [
                {
                    url:'https://prmsclletrck.com/click.php',
                    ip:'104.21.39.105',
                    status:'Blacklisted',
                    action:'',
                }
            ],
            itemsPerPage: -1,
            descriptionFilter: [],
            item: {
              site_url: '',
            },
            selected: [],
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {

        createDomainModal() {
            window.$('#adddomain').modal('show');
        },
        closeDomainModal() {
            window.$('#adddomain').modal('hide');
        },
        viewblacklistModal() {
            window.$('#viewBlacklist').modal('show');
        },
        closeblacklistModal() {
            window.$('#viewBlacklist').modal('hide');
        },  
    }
}
</script>

<style scoped>
</style>
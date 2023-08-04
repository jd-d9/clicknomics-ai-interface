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
                        <span>Urls Uptime Usa Monitor</span>
                        <v-spacer />
                        <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                            Demo.csv
                        </v-btn>

                        <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                            Import CSV
                        </v-btn>

                        <v-btn @click.prevent="createUptimeModal" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                            Add New
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Urls Uptime Usa Monitor List
                            <v-spacer></v-spacer>
                            <div class="mr-2">
                                <v-btn @click="deleteSelected" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                    Remove Selected
                                </v-btn>
                            </div>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" v-model="selected" show-select :headers="headers" :items="urlList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.raw_url`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.raw_url ? item.selectable.raw_url : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.certificate_check_enabled`]="{ item }">
                                <v-icon color="green-darken-2" v-if="item.selectable.certificate_check_enabled">
                                    mdi mdi-check-circle
                                </v-icon>
                                <v-icon color="red-darken-4" v-else>
                                    mdi mdi-close-circle
                                </v-icon>
                            </template>
                            <template v-slot:[`item.certificate_issuer`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.certificate_issuer ? item.selectable.certificate_issuer : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.certificate_expiration_date`]="{ item }">
                                {{item.selectable.certificate_expiration_date}}
                            </template>
                            <template v-slot:[`item.uptime_status`]="{ item }">
                                <v-icon color="green-darken-2" v-if="item.uptime_status == 'up'">
                                    mdi mdi-check-circle
                                </v-icon>
                                <v-icon color="red-darken-4" v-else-if="item.uptime_status == 'down'">
                                    mdi mdi-close-circle
                                </v-icon>
                                <div v-else>Not Yet Checked</div>
                            </template>
                            <template v-slot:[`item.final_url`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.final_url ? item.selectable.final_url : '-'}}
                                </div>
                            </template>
                            <template  v-slot:[`item.offer_name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.offer_name ? item.selectable.offer_name : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.action`]>    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="createUptimeModal">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon>
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
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

        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Urls Uptime Usa Monitor</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form @submit.prevent="uploadCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" accept=".csv" name="selectFile" required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-import">Import</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="uptimeUsa" tabindex="-1" role="dialog" aria-labelledby="uptimeUsaTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Urls Uptime Usa Monitor</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeUptimeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Site Url</label>
                                    <Field type="text" id="input-username" name="Email" :class="{'form-control': true}" v-model="item.site_url" placeholder="https://..."/>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Select Test Type</label>
                                    <Field name="" v-model="item.uptime_check_method">
                                        <v-radio-group inline v-model="item.uptime_check_method" @change="getActive">
                                            <v-radio class="monitor me-3" label="HTTP" value="get"></v-radio>
                                            <v-radio class="monitor" label="HEAD" value="head"></v-radio>
                                        </v-radio-group>
                                    </Field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <p class="m-0">{{testDescription}}</p>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Offer Name</label>
                                    <Field type="text" id="input-username" name="" :class="{'form-control': true}" v-model="item.offer_name" placeholder="Offer Name"/>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeUptimeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
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
                { title: 'Site Url', key: 'raw_url'},
                { title: 'Certificate Enabled', key: 'certificate_check_enabled', align: 'center' },
                { title: 'Certificate Issuer', key: 'certificate_issuer' },
                { title: 'Certificate Expiration Date', key: 'certificate_expiration_date', align: 'center' },
                { title: 'Uptime Status', align: 'center', sortable: true, key: 'uptime_status' },
                { title: 'Final Url ', key: 'final_url' },
                { title: 'Offer Name', sortable: true, key: 'offer_name' },
                { title: 'Action', key: 'action', align: 'center' },
            ],
            urlList: [
                {
                    raw_url:'https://clicknomics.io',
                    certificate_check_enabled:'',
                    certificate_issuer:'GTS CA 1C3',
                    certificate_expiration_date:'2023-01-31',
                    uptime_status:'',
                    final_url:'https://www.google.com/',
                    offer_name:'Google',
                    action:'',
                }
            ],
            itemsPerPage: -1,
            descriptionFilter: [],
            item: {
                id:'',
                site_url: '',
                offer_name: '',
                uptime_check_method: 'get'
            },
            testDescription: "HTTP tests are great for testing any standard website that you would access using your browser. If you don't know what test type to use this one is likely the best option.",
            selected: [],
            selectedRange: '',
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        createUptimeModal() {
            window.$('#uptimeUsa').modal('show');
        },
        closeUptimeModal() {
            window.$('#uptimeUsa').modal('hide');
        },
        getActive() {
            if(this.item.uptime_check_method == 'head') {
                this.testDescription = "HEAD tests are like HTTP tests except they do not load the body of the site and instead of a GET/POST request only via a HEAD type; not all servers support this."
            }else {
                this.testDescription = "HTTP tests are great for testing any standard website that you would access using your browser. If you don't know what test type to use this one is likely the best option."
            }
        },
    }
}
</script>

<style scoped>
</style>
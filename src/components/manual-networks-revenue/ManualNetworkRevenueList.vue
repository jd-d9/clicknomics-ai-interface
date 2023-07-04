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
                                    <li class="breadcrumb-item active" aria-current="page">Archived Reports Manual Network</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <button @click.prevent="abcd" class="btn btn-lg btn-neutral btn_animated">
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i></span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </button>
                            <button @click.prevent="openModal" class="btn btn-lg btn-neutral btn_animated">Import CSV</button>
                            <button @click.prevent="this.$router.push('/networks/manualNetworks/create')" class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'">Add Revenue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <v-app>
                        <div class="card">
                            <!-- <div class="card-header">
                                <h3 class="mb-0 float-left pt-3">Manual Network Metrics</h3>
                                <div class="float-right">
                                    <a href="/networks/manualNetworks/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</a>
                                </div>
                            </div> -->
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="4">
                                                        <div class="select-network-filter">
                                                            <v-select
                                                            clearable
                                                            variant="solo"
                                                            label="Network Name Filter" 
                                                            :items="networkNameFilter"
                                                            v-model="networkName"
                                                            @update:modelValue="getManualNetworksEntry"
                                                            ></v-select>
                                                        </div>
                                                    </v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        datepicker
                                                    </v-col>
                                                    <div class="col-3 ms-auto mt-2 add-height">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <!-- datatable component -->
                                            <v-data-table class="table-hover-class elevation-1 table-expand" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr class="table-body-back">
                                                        <td>{{item.selectable.date}}</td>
                                                        <td>
                                                            <div class="text-ellipsis">
                                                                {{item.selectable.network_id}}
                                                            </div>
                                                        </td>
                                                        <td>{{item.selectable.amount}}</td>
                                                        <td>
                                                            <a href="javascript:void(0);" @click="edit(item.selectable.id)">
                                                                <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                            </a>
                                                            <a href="javascript:void(0);" @click="deleteData(item.selectable.id)">
                                                                <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-slot:tbody v-if="dataMetrics.length > 0">
                                                    <tr class="total_table table-body-back">
                                                        <td>Totals</td>
                                                        <td>-</td>
                                                        <td>${{sumField}}</td>
                                                        <td>-</td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-app>
                                </div>
                            </div>
                        </div>
                    </v-app>
                </div>
            </div>
        </div>
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Manual Network Metrics</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="uploadCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{selectedFile.name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" name="chooseFile" required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeModal">Close</button>
                            <button type="submit" class="btn btn-primary">Import</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);

        let presentDate = new Date();
        presentDate.setHours(0, 0, 0, 0);

        let yesterday = new Date();
        yesterday.setDate(presentDate.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        let thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        let thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);

        return {
            showLoader: false,
            dataMetrics: [],
            search: '',
            // headers: [
            //     { title: 'Date', align: 'start', sortable: false, key: 'date' },
            //     { title: 'Network Name', key: 'network', sortable: true },
            //     { title: 'Amount', key: 'amount' },
            //     { title: 'Action', key: '' },
            // ],
            dateRange: {startDate, endDate},
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            networkNameFilter: [],
            networkName: null,
            customRanges: {
                'Today': [presentDate, presentDate],
                'Yesterday': [yesterday, yesterday],
                'This month': [thisMonthStart, thisMonthEnd],
                'Last month': [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)],
                'This year': [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
                'Last year': [new Date((today.getFullYear() -1), 0, 1), new Date((today.getFullYear() -1), 11, 31)],
            },
            selectedFile: '',
            isSortable: true,
            searchInput: '',
            permissions: {}
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        headers: function() {
            return [
                { title: 'Date', align: 'start', sortable: this.isSortable, key: 'date' },
                { title: 'Network Name', key: 'network', sortable: this.isSortable },
                { title: 'Amount', key: 'amount',sortable: this.isSortable },
                { title: 'Action', key: '' },
            ]
        }
    },
    mounted() {
        this.getManualNetworksEntry();
        this.updateCsvWithTodayDate('ipm-manual-networks-metrics-demo.csv');
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        // search payment from table
        searchPayments() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return  val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.company && val.company.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.email.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.network.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.notes && val.notes.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.platform_type.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.created_at.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get manual network metrics listing
        getManualNetworksEntry() {
            this.showLoader = true;
            this.axios.get(this.$api + '/network/manualNetworksMetrics', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data.data;
                    console.log(this.dataMetrics, 'this.dataMetrics---')
                    this.dataMetricsFilter = getData.data.data;
                    this.permissions = getData.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        checkOpenPicker() {
            setTimeout(() => {
                this.getManualNetworksEntry();
            },100)
        },
        // edit data
        edit(id) {
            window.location.href = `/networks/manualNetworks/${id}/edit`;
        },
        // delete data
        deleteData(id) {
            console.log(id);
            if(confirm("Do you really want to delete?")) {
                // this.showLoader = true;
                // axios.defaults.headers.common = {
                //     'X-Requested-With': 'XMLHttpRequest',
                //     'X-CSRF-TOKEN': window.csrf_token
                // };
                // let formData = new FormData();
                // formData.append('id', id);
                // axios.post(`/networks/manualNetworks/deleteManualNetworksRow`, formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     },
                // }).then(response => {
                //     if(response) {
                //         console.log(response, 'sasa')
                //         this.showLoader = false;
                //         this.message = {
                //             text: response.data.message,
                //             type: 'success',
                //         };
                //         Bus.$emit('flash-message', this.message, '');
                //         this.dataMetrics = _.filter(this.dataMetrics, x => { return x.id !== id; });
                //     }else {
                //         this.showLoader = false;
                //         this.message = {
                //             text: 'Something Went Wrong!',
                //             type: 'error',
                //         }
                //         Bus.$emit('flash-message', this.message, '');
                //     }
                // }).catch(error => {
                //     this.showLoader = false;
                //     console.log(error);
                //     this.message = {
                //         text: error.response.data.message,
                //         type: 'error',
                //     }
                //     Bus.$emit('flash-message', this.message, '');
                // });
            }
        },
        handleUpload(event) {
            const files = event.target.files;
            console.log(files[0].name, '2121212')
            this.file = files;
        },
        uploadCsv() {
            // this.showLoader = true;
            // let formData = new FormData();
            // formData.append('file', this.file[0]);
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': window.csrf_token
            // };
            // axios.post(`/importManualNetworksMetrics`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //         this.showLoader = false;
            //         this.message = {
            //             text: response.data.message,
            //             type: 'success',
            //         };
            //         Bus.$emit('flash-message', this.message, '/networks/manualNetworks');
            //     }else {
            //         this.showLoader = false;
            //         this.message = {
            //             text: 'Something Went Wrong!',
            //             type: 'error',
            //         }
            //         Bus.$emit('flash-message', this.message, '');
            //     }
            // }).catch((error) => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // });
        },
        // select csv file
        chooseFile(e) {
            this.selectedFile = e.target.files[0];
        },
        updateCsvWithTodayDate(filename) {
            console.log(filename)
            // const today = new Date().toISOString().slice(0, 10);
            // let formData = new FormData();
            // formData.append('date', today);
            // formData.append('filename', filename);
            // const csrf = document.querySelector('meta[name="csrf-token"]').content;
            // axios.defaults.headers.common = {
            //     'X-Requested-With': 'XMLHttpRequest',
            //     'X-CSRF-TOKEN': csrf
            // };
            // axios.post(`/updateCsvWithTodayDate`,formData,{
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     },
            // }).then(response => {
            //     if(response) {
            //         console.log(response, 'sasa')
            //     }
            // }).catch((error) => {
            //     this.showLoader = false;
            //     console.log(error);
            //     this.message = {
            //         text: error.response.data.message,
            //         type: 'error',
            //     }
            //     Bus.$emit('flash-message', this.message, '');
            // });
        }
    }
}
</script>

<style scoped>

</style>

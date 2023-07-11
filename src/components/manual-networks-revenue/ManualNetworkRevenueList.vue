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
                            <button @click.prevent="downloadCsv" class="btn btn-lg btn-neutral btn_animated">
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
                <div class="col" v-if="permissions.view == '1' && !showLoader">
                    <v-app>
                        <div class="card">
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
                                                            item-value="key"
                                                            v-model="networkName"
                                                            @update:modelValue="getManualNetworksEntry"
                                                            ></v-select>
                                                        </div>
                                                    </v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <date-range-picker :value="selectedRange" @update:value="updateRange"></date-range-picker>
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
                                                                {{item.selectable.manual_network.network}}
                                                            </div>
                                                        </td>
                                                        <td>{{item.selectable.amount}}</td>
                                                        <td>
                                                            <button @click.prevent="this.$router.push('/networks/manualNetworks/'+ item.selectable.id +'/edit')" :disabled="permissions.update_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/edit.svg" class="icon-width">
                                                            </button>
                                                            <button @click.prevent="deleteData(item.selectable.id)" :disabled="permissions.delete_auth == '0'" class="disable-button">
                                                                <img src="/assets/img/icons/bin.svg" class="icon-width">
                                                            </button>
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
                <div class="col" v-if="permissions.view != '1' && !showLoader">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="text-center">You have no access for this page</h4>
                        </div>
                    </div>
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
                    <form @submit.prevent="importCsv">
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
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker
    },
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            dataMetricsFilter: [],
            search: '',
            // headers: [
            //     { title: 'Date', align: 'start', sortable: false, key: 'date' },
            //     { title: 'Network Name', key: 'network', sortable: true },
            //     { title: 'Amount', key: 'amount' },
            //     { title: 'Action', key: '' },
            // ],
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            networkNameFilter: [],
            networkName: null,
            selectedFile: '',
            isSortable: true,
            searchInput: '',
            permissions: {},
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
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
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getManualNetworksEntry();
        },
        // search payment from table
        searchPayments() {
            this.dataMetrics = this.dataMetricsFilter.filter((val) => {
                return  val.id.toString().includes(this.searchInput.toLowerCase()) || 
                        val.amount.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.date.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        val.manual_network.network.toLowerCase().includes(this.searchInput.toLowerCase())
            })
        },
        // get manual network metrics listing
        getManualNetworksEntry() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/network/manualNetworksMetrics';
            if(this.networkName) {
                queryString.set('networkName', this.networkName)
            }
            if(this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            this.axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data;
                    console.log(getData, 'getData');
                    this.dataMetrics = getData.data.data;
                    this.dataMetricsFilter = getData.data.data;
                    getData.allNetworks.forEach((val) => {
                        this.networkNameFilter.push(
                            {
                                key: val.manual_network.id,
                                title: val.manual_network.network
                            }
                        )
                    });
                    this.permissions = getData.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // checkOpenPicker() {
        //     setTimeout(() => {
        //         this.getManualNetworksEntry();
        //     },100)
        // },
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/network/manualNetworksMetrics/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Record deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getManualNetworksEntry();
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error)
                    this.$toast.open({
                        message: error.message,
                        position: 'top-right',
                        duration: '5000',
                        type: 'error'
                    });
                    this.showLoader = false;
                });
            }
        },
        // download csv file
        downloadCsv() {
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'manualnetworksmetrics'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                },
                responseType: 'blob',
            })
            .then(response => {
                let blob = new Blob([response.data], { type:'application/csv' } );
                const _url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = _url;
                link.setAttribute('download', 'demo.csv');
                document.body.appendChild(link);
                link.click();
                this.$toast.open({
                    message: 'File downloaded',
                    position: 'top-right',
                    duration: '5000',
                    type: 'success'
                });
            })
            .catch(error => {
                console.log(error)
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
        },
        // choose file and import csv
        importCsv() {
            this.showLoader = true;
            this.axios.post(this.$api + '/network/manualNetworksMetrics/importManualNetworksMetrics', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getManualNetworksEntry();
                    this.showLoader = false;
                    this.selectedFile = '';
                    this.$toast.open({
                        message: 'File imported',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.$toast.open({
                    message: error.message,
                    position: 'top-right',
                    duration: '5000',
                    type: 'error'
                });
                this.showLoader = false;
            });
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

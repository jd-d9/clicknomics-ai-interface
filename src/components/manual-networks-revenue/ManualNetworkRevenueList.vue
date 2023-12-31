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
                            <span>Archived Reports Manual Network</span>
                        </div>
                        <v-spacer/>
                        <v-btn class="ma-2 bg-green-lighten-4 hidden-md-and-up" variant="text" icon v-on:click="isHidden = !isHidden">
                            <v-icon color="green-darken-2">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <div class="button_div" v-if="!isHidden">
                            <v-btn @click.prevent="downloadCsv"
                                class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated"
                                prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>

                            <v-btn @click.prevent="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated"
                                prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>

                            <v-btn @click.prevent="this.$router.push('/networks/manualNetworks/create')"
                                class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated"
                                :disabled="permissions.create_auth == '0'" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Archived Reports Manual Network List
                            <v-spacer></v-spacer>
                            <v-row class="d-flex align-center justify-end">
                                <v-col class="font-medium font-weight-normal pr-0">
                                    <date-range-picker class="date_picker" :value="selectedRange" @update:value="updateRange"></date-range-picker>
                                </v-col>
                                <v-col class="font-medium font-weight-normal v_select_design pr-0">
                                    <v-select clearable variant="outlined" placeholder="Network Name Filter" :items="networkNameFilter" item-value="key" v-model="networkName" @update:modelValue="getManualNetworksEntry"></v-select>
                                </v-col>
                                <v-col class="font-medium font-weight-normal">
                                    <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4"
                            :footer-props="{ 'items-per-page-options': [5, 10, 15, 25, 50, 100, -1] }" :headers="headers"
                            :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage" @update:options="currentItems($event)">
                            <template v-slot:[`item.date`]="{ item }">
                                {{ item.selectable.date ? item.selectable.date : '-' }}
                            </template>
                            <template v-slot:[`item.network`]="{ item }">
                                <div class="text-ellipsis">
                                    {{ item.selectable.network ? item.selectable.network : '-' }}
                                </div>
                            </template>
                            <template v-slot:[`item.amount`]="{ item }">
                                {{ $filters.toCurrency(item.selectable.amount) }}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon
                                    @click.prevent="this.$router.push('/networks/manualNetworks/' + item.selectable.id + '/edit')"
                                    :disabled="permissions.update_auth == '0'">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon
                                    @click.prevent="deleteData(item.selectable.id)"
                                    :disabled="permissions.delete_auth == '0'">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                </v-btn>
                            </template>

                            <template v-slot:tbody v-if="currentItemsTable.length > 0">
                                <tr class="total_table table-body-back bg-blue-darken-2">
                                    <td>Totals</td>
                                    <td></td>
                                    <td class="text-center">{{ $filters.toCurrency(sumField) }}</td>
                                    <td></td>
                                </tr>
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

        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Import Manual Network Metrics</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form @submit.prevent="importCsv">
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="selectedFile">{{ selectedFile.name }}
                                    </div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input name="Choosecsv" @change="chooseFile" title="Choose CSV"
                                        class="inputFile form-control-file" type="file" required />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer pt-0">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3"
                                    append-icon="mdi-import">Import</v-btn>
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close"
                                    @click.prevent="closeModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@axios';
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
import mixin from '../../mixin.js';
export default {
    mixins: [mixin],
    components: {
        DateRangePicker
    },
    data() {
        return {
            message: {},
            showLoader: false,
            dataMetrics: [],
            search: '',
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            networkNameFilter: [],
            networkName: null,
            selectedFile: '',
            isSortable: true,
            permissions: {},
            isHidden: false,
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.currentItemsTable.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        headers: function () {
            return [
                { title: 'Date', align: 'start', sortable: this.isSortable, key: 'date' },
                { title: 'Network Name', key: 'network', sortable: this.isSortable },
                { title: 'Amount', align: 'center', key: 'amount', sortable: this.isSortable },
                { title: 'Action', align: 'center', key: 'action' },
            ]
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getManualNetworksEntry();
        this.updateCsvWithTodayDate('ipm-manual-networks-metrics-demo.csv');
        this.isHidden = screen.width < 960 ? true : false;
        window.addEventListener('resize', () => {
            this.isHidden = screen.width < 960 ? true : false;
        });
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            this.selectedFile = '';
            window.$('input[type=file]').val(null);
            window.$('#exampleModalCenter').modal('hide');
        },
        // update date range
        updateRange(range) {
            this.selectedRange = range;
            this.getManualNetworksEntry();
        },
        // get manual network metrics listing
        getManualNetworksEntry() {
            this.showLoader = true;
            const queryString = new URLSearchParams();
            const ajaxUrl = this.$api + '/network/manualNetworksMetrics';
            if (this.networkName) {
                queryString.set('networkName', this.networkName)
            }
            if (this.selectedRange) {
                queryString.set('startDate', moment(this.selectedRange.split('-').shift()).format('DD-MM-YYYY'));
                queryString.set('endDate', moment(this.selectedRange.split('-').pop()).format('DD-MM-YYYY'));
            }
            const url = `${ajaxUrl}?${queryString.toString()}`;
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if (response.data.success) {
                    const getData = response.data;
                    this.dataMetrics = getData.data;
                    this.networkNameFilter = [];
                    getData.allNetworks.forEach((val) => {
                        this.networkNameFilter.push(
                            {
                                key: val.manual_network.id,
                                title: val.manual_network.network
                            }
                        )
                    });
                    this.permissions = getData.permission;
                    const currentItems = {
                        itemsPerPage: -1
                    };
                    this.currentItems(currentItems);
                    if(this.dataMetrics.length > 0){
                        setTimeout(() => {
                            this.resizableGrid(document.getElementsByTagName('table')[0]);
                        }, 1000)
                    }
                    this.showLoader = false;
                } else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if (error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.errors) {
                    if (error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    } else if (error.response.data.errors.length == 0) {
                        this.backendErrorMessage = '';
                    } else {
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
        // delete data
        deleteData(id) {
            if (confirm("Do you really want to delete?")) {
                this.showLoader = true;
                axios.delete(this.$api + '/network/manualNetworksMetrics/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.getAccessToken()
                    }
                })
                    .then(response => {
                        if (response.data.success) {
                            this.message = {
                                text: response.data.message,
                                type: 'success',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                            this.getManualNetworksEntry();
                            this.showLoader = false;
                        } else {
                            this.message = {
                                text: response.data.message,
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                            this.showLoader = false;
                        }
                    })
                    .catch(error => {
                        if (error.response.data.message) {
                            this.message = {
                                text: error.response.data.message,
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                        if (error.response.data.error) {
                            this.message = {
                                text: error.response.data.error,
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        }
                        if (error.response.data.errors) {
                            if (error.response.data.errors.length == 1) {
                                this.message = {
                                    text: error.response.data.errors[0],
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            } else if (error.response.data.errors.length == 0) {
                                this.backendErrorMessage = '';
                            } else {
                                this.message = {
                                    text: error.response.data.errors[0],
                                    type: 'error',
                                }
                                this.$eventBus.emit('flash-message', this.message, '');
                            }
                        }
                        this.showLoader = false;
                    });
            }
        },
        // download csv file
        downloadCsv() {
            axios.post(this.$api + '/settings/downloadfile', {
                filename: 'manualnetworksmetrics'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: this.getAccessToken(),
                },
                responseType: 'blob',
            })
                .then(response => {
                    let blob = new Blob([response.data], { type: 'application/csv' });
                    const _url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = _url;
                    link.setAttribute('download', 'demo.csv');
                    document.body.appendChild(link);
                    link.click();
                })
                .catch(error => {
                    if (error.response.data.message) {
                        this.message = {
                            text: error.response.data.message,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.error) {
                        this.message = {
                            text: error.response.data.error,
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    }
                    if (error.response.data.errors) {
                        if (error.response.data.errors.length == 1) {
                            this.message = {
                                text: error.response.data.errors[0],
                                type: 'error',
                            }
                            this.$eventBus.emit('flash-message', this.message, '');
                        } else if (error.response.data.errors.length == 0) {
                            this.backendErrorMessage = '';
                        } else {
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
        // choose file and import csv
        importCsv() {
            this.showLoader = true;
            axios.post(this.$api + '/network/manualNetworksMetrics/importManualNetworksMetrics', {
                file: this.selectedFile
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: this.getAccessToken()
                }
            })
            .then(response => {
                if (response.data.success) {
                    this.closeModal();
                    this.getManualNetworksEntry();
                    this.showLoader = false;
                    this.message = {
                        text: response.data.message,
                        type: 'success',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                } else {
                    this.message = {
                        text: response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                    this.showLoader = false;
                }
            })
            .catch(error => {
                if (error.response.data.message) {
                    this.message = {
                        text: error.response.data.message,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.error) {
                    this.message = {
                        text: error.response.data.error,
                        type: 'error',
                    }
                    this.$eventBus.emit('flash-message', this.message, '');
                }
                if (error.response.data.errors) {
                    if (error.response.data.errors.length == 1) {
                        this.message = {
                            text: error.response.data.errors[0],
                            type: 'error',
                        }
                        this.$eventBus.emit('flash-message', this.message, '');
                    } else if (error.response.data.errors.length == 0) {
                        this.backendErrorMessage = '';
                    } else {
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
        // current items for sum field
        currentItems(currentItems) {
            if(this.search) {
                const data = this.dataMetrics.filter((val) => {
                    return val.date && val.date.toString().includes(this.search.toLowerCase()) || 
                           val.amount && val.amount.toString().includes(this.search.toLowerCase()) ||
                           val.network && val.network.toLowerCase().includes(this.search.toLowerCase())
                })
                data.length <= 10 ? this.currentItemsTable = data : (currentItems.itemsPerPage != -1 ? this.currentItemsTable = data.slice(0, currentItems.itemsPerPage) : this.currentItemsTable = data);
            }
            else if(currentItems.itemsPerPage == -1) {
                this.currentItemsTable = this.dataMetrics;
            }
            else {
                const data = this.dataMetrics.slice(0, currentItems.itemsPerPage);
                this.currentItemsTable = data;
            }
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

<style scoped></style>

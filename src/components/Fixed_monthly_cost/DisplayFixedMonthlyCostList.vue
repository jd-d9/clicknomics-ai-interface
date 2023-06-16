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
                                    <li class="breadcrumb-item active" aria-current="page">Fixed Monthly Cost List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/admin/img/doc/ipm-ops-cost-demo.csv" class="btn btn-lg btn-neutral btn_animated" download>
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="openImportCsvModal">Import CSV</router-link>
                            <router-link to="/accounting/fixedMonthlyCost/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
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
                    <v-app>
                        <div class="card">
                            <!-- <div class="card-header">
                                <h3 class="mb-0 float-left pt-3">Fixed Monthly Cost List</h3>
                                <div class="float-right">
                                    <router-link to="/admin/img/doc/demo-ops-cost.csv" class="mr-4" download>Demo.csv</router-link>
                                    <router-link to="#exampleModalCenter"  data-toggle="modal" data-target="#exampleModalCenter" class="btn btn-lg btn-neutral btn_animated">Import CSV</router-link>
                                    <router-link to="/accounting/fixedMonthlyCost/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</router-link>
                                </div>
                            </div> -->
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-spacer></v-spacer>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <!-- <template>
                                                            <date-range-picker v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
                                                                <div slot="header" slot-scope="header" class="slot">
                                                                    <h3 class="m-0">Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                                                </div>
                                                                <template #input="picker" style="min-width: 350px;">
                                                                    {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                                                </template>
                                                                <template #date="data">
                                                                    <span class="small">{{ data.date | dateCell }}</span>
                                                                </template>
                                                                <template #ranges="ranges">
                                                                    <div class="ranges">
                                                                        <ul>
                                                                        <li v-for="(range, name) in ranges.ranges" :key="name" @click="ranges.clickRange(range)">
                                                                            <b>{{ name }}</b> <small class="text-muted">{{ range[0].toDateString() }} -
                                                                            {{ range[1].toDateString() }}</small>
                                                                        </li>
                                                                        </ul>
                                                                    </div>
                                                                </template>
                                                                <div slot="footer" slot-scope="data" class="slot">
                                                                    <div>
                                                                        <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                                                    </div>
                                                                    <div style="margin-left: auto">
                                                                        <router-link tock="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</router-link>
                                                                    </div>
                                                                </div>
                                                            </date-range-picker>
                                                        </template> -->
                                                    </v-col>
                                                    <div class="col-3 ms-auto">
                                                        <div class="ms-auto search-input position-relative">
                                                            <input type="search" placeholder="Search" v-model="searchInput" @keyup="searchPayments">
                                                        </div>
                                                    </div>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table :headers="headers" :items="dataMetrics" :search="search" @current-items="currentItems"  :itemsPerPage="itemsPerPage" show-select class="table-with-checkbox"  v-model="selected">
                                                <!-- <template v-slot:item="{ item }">
                                                    <tr>
                                                        <td>{{item.date}}</td>
                                                        <td>{{item.amount | toCurrency}}</td>
                                                        <td>
                                                            <router-link to="javascript:void(0);" @click="edit(item.id)">
                                                                <img src="/admin/img/icons/edit.svg" style="width:30px">
                                                            </router-link>
                                                            <router-link to="javascript:void(0);" @click="deleteData(item.id)">
                                                                <img src="/admin/img/icons/bin.svg" style="width:30px">
                                                            </router-link>
                                                        </td>
                                                    </tr>
                                                </template> -->
                                                <!-- <template v-slot:item.amount="{ item }">
                                                    <td>{{item.amount}}</td>
                                                </template> -->
                                                <!-- <template v-slot:item.action="{ item }">
                                                    <td>
                                                        <router-link to="javascript:void(0);" @click="edit(item.id)">
                                                            <img src="/admin/img/icons/edit.svg" style="width:30px">
                                                        </router-link>
                                                        <router-link to="javascript:void(0);" @click="deleteData(item.id)">
                                                            <img src="/admin/img/icons/bin.svg" style="width:30px">
                                                        </router-link>
                                                    </td>
                                                </template> -->
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn
                                                            elevation="2"
                                                            variant="outlined"
                                                            raised
                                                            rounded="xl"
                                                            @click="deleteSelected"
                                                        >Remove Selected</v-btn>
                                                        <v-btn
                                                            elevation="2"
                                                            raised
                                                            variant="outlined"
                                                            rounded="xl"
                                                            @click="openCreateUpdateData"
                                                        >Edit Selected</v-btn>
                                                    </div>
                                                </template>
                                                <template v-slot:tbody v-if="dataMetrics.length > 0">
                                                    <tr class="total_table">
                                                        <td>-</td>
                                                        <td>Totals</td>
                                                        <td>{{ sumField }}</td>
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
        <div class="modal fade" id="importCsvModal" tabindex="-1" role="dialog" aria-labelledby="importCsvModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeImportCsvModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="file-upload">
                                <div class="file-select">
                                    <div class="file-select-button" id="fileName">Choose File</div>
                                    <div class="file-select-name" id="noFile" v-if="file">{{file[0].name}}</div>
                                    <div class="file-select-name" id="noFile" v-else>No file chosen...</div>
                                    <input @change="handleUpload($event)" title="Choose CSV"  class="inputFile form-control-file" type="file" name="chooseFile"  required/>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click.prevent="closeImportCsvModal">Close</button>
                            <button type="submit" class="btn btn-primary">Import</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Bulk Edit Operation Cost</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeCreateUpdateData">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row" v-for="(item, index) in selected" :key="index">
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Date</label>
                                            <date-picker :disabled="true" v-model="item.date" valueType="format" format="YYYY-MM-DD"></date-picker>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Amount</label>
                                            <input type="number" id="input-username"  :class="{'form-control': true}" placeholder="Add Amount" v-model="item.amount">
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <v-divider class="mt-0 mb-0"></v-divider>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 py-0 text-right">
                                        <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                    </div>
                                </div>
                            </form>
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
            hideShowLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { text: 'Date', align: 'start', sortable: false, value: 'date' },
                { text: 'Amount', value: 'amount' },
                { text: 'Action', value: 'action' },
            ],
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1,
            selected: [],
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        // open/close import csv modal
        openImportCsvModal() {
            window.$('#importCsvModal').modal('show');
        },
        closeImportCsvModal() {
            window.$('#importCsvModal').modal('hide');
        },
        // open/close bulk edition operation cost modal
        openCreateUpdateData() {
            window.$('#createUpdateData').modal('show');
        },
        closeCreateUpdateData() {
            window.$('#createUpdateData').modal('hide');
        },
    }
}
</script>

<style scoped>

</style>

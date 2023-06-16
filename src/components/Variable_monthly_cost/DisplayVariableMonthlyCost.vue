<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Variable Monthly Cost List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <!-- <a href="/admin/img/doc/demo-ops-cost.csv" class="btn btn-lg btn-neutral btn_animated" download>
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </a>
                            <a href="#exampleModalCenter"  data-toggle="modal" data-target="#exampleModalCenter" class="btn btn-lg btn-neutral btn_animated">Import CSV</a> -->
                            <a href="/accounting/variableMonthlyCost/create" class="btn btn-lg btn-neutral btn_animated">Add New Record</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoaderComponent v-if="showLoader"></LoaderComponent>
        <!-- Page content -->
        <div class="container-fluid mt--6">
            <div class="row justify-content-center">
                <div class="col">
                    <v-app>
                        <div class="card">
                            <div class="card-body">
                                <div class="finance_data">
                                    <v-app>
                                        <v-card>
                                            <v-card-title>
                                                <v-spacer></v-spacer>
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="4"></v-col>
                                                    <v-col class="d-flex justify-content-end" cols="12" sm="4">
                                                        <template>
                                                            <date-range-picker v-model="dateRange" format="mm/dd/yyyy" @update="checkOpenPicker">
                                                                <!--    header slot-->
                                                                <div slot="header" slot-scope="header" class="slot">
                                                                    <h3 class="m-0">Calendar header</h3> <span v-if="header.in_selection"> - in selection</span>
                                                                </div>
                                                                <!--    input slot (new slot syntax)-->
                                                                <template #input="picker" style="min-width: 350px;">
                                                                    {{ picker.startDate | date }} - {{ picker.endDate | date }}
                                                                </template>
                                                                <!--    date slot-->
                                                                <template #date="data">
                                                                    <span class="small">{{ data.date | dateCell }}</span>
                                                                </template>
                                                                <!--    ranges (new slot syntax) -->
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
                                                                <!--    footer slot-->
                                                                <div slot="footer" slot-scope="data" class="slot">
                                                                    <div>
                                                                        <b class="text-black">Calendar footer</b> {{ data.rangeText }}
                                                                    </div>
                                                                    <div style="margin-left: auto">
                                                                        <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-primary btn-sm">Choose current</a>
                                                                    </div>
                                                                </div>
                                                            </date-range-picker>
                                                        </template>
                                                    </v-col>
                                                    <v-col class="d-flex search_width" cols="12" sm="4">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table :headers="headers" :items="dataMetrics" :search="search" @current-items="currentItems"  :itemsPerPage="itemsPerPage">
                                                <template v-slot:item="{ item }">
                                                    <tr>
                                                        <td>{{item.date}}</td>
                                                        <td>{{item.amount | toCurrency}}</td>
                                                        <td>{{item.notes ? item.notes : '-'}}</td>
                                                        <td>
                                                            <a href="javascript:void(0);" @click="edit(item.id)">
                                                                <img src="/admin/img/icons/edit.svg" style="width:30px">
                                                            </a>
                                                            <a href="javascript:void(0);" @click="deleteData(item.id)">
                                                                <img src="/admin/img/icons/bin.svg" style="width:30px">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template slot="body.append" v-if="dataMetrics.length > 0">
                                                    <tr class="total_table">
                                                        <td>Totals</td>
                                                        <td>{{ sumField | toCurrency }}</td>
                                                        <td>-</td>
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
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Fixed Monthly Cost List</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <ValidationObserver v-slot="{handleSubmit}">
                        <form @submit.prevent="handleSubmit(uploadCsv)">
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
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Import</button>
                            </div>
                        </form>
                    </ValidationObserver>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { text: 'Date', align: 'start', sortable: false, value: 'date' },
                { text: 'Amount', value: 'amount' },
                { text: 'Notes', value: 'notes' },
                { text: 'Action', value: '' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            currentItemsTable: [],
            itemsPerPage: -1
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped>

</style>

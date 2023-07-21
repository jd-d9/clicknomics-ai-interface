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
                                    <li class="breadcrumb-item active" aria-current="page">Management System Local</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right" v-if="showImportIcon">
                            <router-link to="" class="btn btn-lg btn-neutral btn_animated" @click="downloadCsv">
                                <div>
                                    <span class="btn-inner--icon"><i class="ni ni-cloud-download-95"></i> </span>
                                    <span class="btn-inner--text">Demo.csv</span>
                                </div>
                            </router-link>
                            <router-link to="" @click="openModal" class="btn btn-lg btn-neutral btn_animated">Import CSV</router-link>
                            <button class="btn btn-lg btn-neutral btn_animated" :disabled="permissions.create_auth == '0'" @click.prevent="createActivity">Add New Record</button>
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
                                                <!-- <v-spacer></v-spacer> -->
                                                <v-row>
                                                    <v-col class="d-flex" cols="12" sm="3" v-if="false">
                                                        <v-select solo :items="descriptionFilter" label="Description Filter" :clearable="true" v-model="descriptionValue" @change="getLocalManagementSystemReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex" cols="12" sm="3" v-if="false">
                                                        <v-select solo :items="transactionTypeFilter" label="Transaction Type Filter" :clearable="true" v-model="transactionTypeValue" @change="getLocalManagementSystemReport"></v-select>
                                                    </v-col>
                                                    <v-col class="d-flex search_width" cols="12" sm="3">
                                                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-card-title>
                                            <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}"  v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" class="table-hover-class table-with-checkbox" :itemsPerPage="itemsPerPage">
                                                <template v-slot:[`item.type`]="{ item }">
                                                    <td>{{item.selectable.type}}</td>
                                                </template>
                                                <template v-slot:[`item.country`]="{ item }">
                                                    <!-- <td>{{item.selectable.country}}</td> -->
                                                    <td>{{item.selectable.country.name}}</td>
                                                </template>
                                                <template v-slot:[`item.city`]="{ item }">
                                                    <td>{{item.selectable.city}}</td>
                                                </template>
                                                <template v-slot:[`item.notes`]="{ item }">
                                                    <td>{{item.selectable.notes ? item.selectable.notes : '-'}}</td>
                                                </template>
                                                <template v-slot:[`item.action`]="{ item }">
                                                    <td>
                                                        <button class="disable-button" :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                                            <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit">
                                                        </button>
                                                        <button class="disable-button" :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
                                                            <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete">
                                                        </button>
                                                    </td>
                                                </template>
                                                <template v-slot:top v-if="selected.length > 0">
                                                    <div class="p-2 text-right">
                                                        <v-btn
                                                            elevation="2"
                                                            variant="outlined"
                                                            raised
                                                            rounded="xl"
                                                            class="me-1 disable-button"
                                                            :disabled="permissions.delete_auth == '0'"
                                                            @click="deleteSelected"
                                                        >Remove Selected</v-btn>
                                                    </div>
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
        <!-- Start Import CSV Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Management System Local</h5>
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
        <!-- End Import CSV Modal -->
        <div class="modal fade" id="viewDetail" tabindex="-1" role="dialog" aria-labelledby="viewDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeViewModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <span class="font-weight-bold">Date :</span> {{viewModalDetail.date ? viewModalDetail.date : '-'}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Amount :</span> {{$filters.toCurrency(viewModalDetail.amount)}}
                        </p>
                        <p>
                            <span class="font-weight-bold"> Description :</span> {{viewModalDetail.description ? viewModalDetail.description : '-'}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Create & Update RM AMEX Plum Activity-->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">{{activityType}} Management System Local</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeRmAmexModal">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="card-body">
                            <div class="col-12">
                                <Form @submit="saveLocalManagementSystem" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Type</label>
                                                <Field name="Type" v-model="activity.type">
                                                    <v-select name="Type" :class="{'form-control': true , 'border-red-600':errors.Type }" :items="statusList" v-model="activity.type"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Type">Type Can not be empty</span>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Country</label>
                                                <Field name="Country" v-model="activity.country">
                                                    <v-select name="Country" :class="{'form-control': true , 'border-red-600':errors.Country }" :items="countryList" item-value="key" v-model="activity.country"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Country">Country Can not be empty</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0">
                                            <label class="form-control-label" for="input-username">City</label>
                                            <Field type="text" name="City" id="input-username" :class="{'form-control': true , 'border-red-600':errors.City }" v-model="activity.city"/>
                                            <span class="text-red-600" v-if="errors.City">City Can not be empty</span>
                                        </div>
                                        <div class="col-lg-12 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <textarea :class="{'form-control': true}"  name="" cols="30" rows="10" v-model="activity.notes"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
export default {
    // props: [ 'countries'],
    components: {
        Form, Field
    },
    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            showLoader: false,
            dataMetrics: [],
            search: '',
            headers: [
                { title: 'Type', align: 'start', sortable: false, key: 'type' },
                { title: 'Country ', key: 'country' },
                { title: 'City', key: 'city' },
                { title: 'Notes', key: 'notes' },
                { title: 'Action', key: 'action' },
            ],
            dateRange: {startDate, endDate},
            file: '',
            selected: [],
            viewModalDetail: {},
            itemsPerPage: -1,
            statusList: [
                {
                    title: 'House'
                },
                {
                    title: 'Apartment'
                },
                {
                    title: 'Office'
                },
            ],
            activity: {
                id: '',
                type : '',
                country : '',
                city : '',
                notes : '',
            },
            activityType: 'Create',
            descriptionFilter: [],
            transactionTypeFilter: [],
            descriptionValue: '',
            transactionTypeValue: '',
            dateRangeTabReport: {startDate, endDate},
            items: [ 'CREDIT','DEBIT'],
            selectedtTransactionType: [ 'CREDIT','DEBIT'],
            cardMemberList: [],
            countryList: [],
            showImportIcon: true,
            permissions: {},
            selectedFile: '',
        }
    },
    filters: {
        dateCell (value) {
            let dt = new Date(value)

            return dt.getDate()
        },
        date (val) {
            return val ? val.toDateString() : ''
        }
    },
    computed: {
        sumField() {
            const key = 'amount';
            return this.dataMetrics.reduce((a, b) => parseFloat(a) + parseFloat(b[key] || 0), 0)
        },
        schema() {
            return yup.object({
                Type: yup.string().required(),
                Country: yup.string().required(),
                City: yup.string().required(),
            });
        },
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        this.getLocalManagementSystemReport();
        this.getAndSetCountry();
        // this.countryList = this.countries.map((data) => {
        //     data.text = data.name;
        //     return data;
        // });
    },
    methods: {
        // open and close modal
        openModal() {
            window.$('#exampleModalCenter').modal('show');
        },
        closeModal() {
            window.$('#exampleModalCenter').modal('hide');
        },
        // open and close view details modal
        openViewModal() {
            window.$('#viewDetail').modal('show');
        },
        closeViewModal() {
            window.$('#viewDetail').modal('hide');
        },
        // open and close view details modal
        openRmAmexModal() {
            window.$('#createUpdateData').modal('show');
        },
        closeRmAmexModal() {
            window.$('#createUpdateData').modal('hide');
        },
        // get management system data
        getLocalManagementSystemReport() {
            this.showLoader = true;
            this.axios.get(this.$api + '/management_system/local', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const Data = response.data;
                    this.dataMetrics = Data.data.data;
                    this.permissions = Data.permission;
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error)
                this.showLoader = false;
            });
        },
        // get and set country code
        getAndSetCountry() {
            this.showLoader = true;
            this.axios.get(this.$api + '/settings/countries', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
                }
            })
            .then(response => {
                if(response.data.success) {
                    response.data.data.forEach((val) => {
                        this.countryList.push({
                            key: val.id,
                            title: val.name
                        })
                    });
                    this.countryList.sort((a, b) => a.name - b.name);
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        },
        // filterIPMChaseInkActivity() {
        //     this.showLoader = true;
        //     let formData = new FormData();
        //     formData.append('startDate', this.dateRangeTabReport.startDate.toDateString());
        //     formData.append('endDate', this.dateRangeTabReport.endDate.toDateString());
        //     this.selectedtTransactionType.length == this.items.length ? formData.append('transactionTypeValue', 'ALL') : formData.append('transactionTypeValue', this.selectedtTransactionType);
        //     const csrf = document.querySelector('meta[name="csrf-token"]').content;
        //     axios.defaults.headers.common = {
        //         'X-Requested-With': 'XMLHttpRequest',
        //         'X-CSRF-TOKEN': csrf
        //     };
        //     axios.post('/filterIPMChaseInkActivity' , formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         },
        //     })
        //     .then(response => {
        //         // console.log(response);
        //         this.cardMemberList = response.data.data;
        //         this.showLoader = false;

        //     }).catch((error) => {
        //         this.showLoader = false;
        //     })
        // },
        checkOpenPicker(e) {
            console.log(e)
            setTimeout(() => {
                this.getLocalManagementSystemReport();
            },100)
        },
        // edit data
        edit(id) {
            const result = this.dataMetrics.find((val) => {
                return val.id == id
            });
            console.log(result, 'result')
            this.activityType = 'Update';
            this.activity.id = id;
            this.activity.type = result.type;
            this.activity.country = result.country_id;
            this.activity.city = result.city;
            this.activity.notes = result.notes ? result.notes : '';
            this.openRmAmexModal();
        },
        // create new
        createActivity() {
            this.activityType = 'Create';
            this.activity.id = '';
            this.activity.type = '';
            this.activity.country = '';
            this.activity.city = '';
            this.activity.notes = '';
            this.openRmAmexModal();
        },
        // delete data
        deleteData(id) {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                this.axios.delete(this.$api + '/management_system/local/' + id, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.getLocalManagementSystemReport();
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
        // delete selected / multiple delete
        deleteSelected() {
            if(confirm("Do you really want to delete?")) {
                this.showLoader = true;
                let formData = new FormData();
                let multipleRow = [];
                this.selected.forEach((val) => {
                    multipleRow.push({id: val});
                })
                formData.append('selectedRecord', JSON.stringify(multipleRow));
                this.axios.post(this.$api + '/management_system/local/deleteMutipleRecord', formData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$toast.open({
                            message: 'Data deleted',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.selected = [];
                        this.getLocalManagementSystemReport();
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
        // view selected
        view(id) {
            console.log(id)
            // this.viewModalDetail = _.find(this.dataMetrics, ['id', id]);
            this.openViewModal();
        },
        // save and update management system
        saveLocalManagementSystem() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('id', this.activity.id);
            formData.append('type', this.activity.type);
            formData.append('country_id', this.activity.country);
            formData.append('city', this.activity.city);
            formData.append('notes', this.activity.notes);
            this.activityType != 'Create' && formData.append('_method', 'PUT');
            const postUrl = this.activityType == 'Create' ? '/management_system/local' : `/management_system/local/${this.activity.id}`
            this.axios.post(`${this.$api}${postUrl}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'Data saved',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    this.closeRmAmexModal();
                    this.getLocalManagementSystemReport();
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
        },
        // downloading csv
        downloadCsv() {
            this.axios.post(this.$api + '/settings/downloadfile', {
                filename: 'localmanagementsystem'
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
        // upload csv file
        uploadCsv() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('file', this.selectedFile);
            this.axios.post(this.$api + '/management_system/local/importLocalCSV', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.closeModal();
                    this.getLocalManagementSystemReport();
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
        }
    }
}
</script>

<style scoped>

</style>

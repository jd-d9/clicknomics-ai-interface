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
                        <span>Local System </span>
                        <v-spacer />
                        <div v-if="showImportIcon">
                            <v-btn @click="downloadCsv" class="ms-auto ml-2 text-none bg-deep-purple-darken-1 btn_animated" prepend-icon="mdi-download">
                                Demo.csv
                            </v-btn>
    
                            <v-btn @click="openModal" class="ms-auto ml-2 text-none bg-green-darken-1 btn_animated" prepend-icon="mdi-import">
                                Import CSV
                            </v-btn>
    
                            <v-btn :disabled="permissions.create_auth == '0'" @click.prevent="createActivity" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-plus">
                                Add New
                            </v-btn>
                        </div>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view == '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Local System List
                            <v-spacer></v-spacer>
                            <div v-if="selected.length > 0" class="mr-2">
                                <v-btn :disabled="permissions.delete_auth == '0'" @click="deleteSelected" class="ms-auto ml-2 text-none bg-red-darken-4 btn_animated" prepend-icon="mdi-delete-empty">
                                    Remove Selected
                                </v-btn>
                            </div>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design pr-0" v-if="false">
                                <v-select :items="descriptionFilter" placeholder="Description Filter" clearable variant="outlined" v-model="descriptionValue" @change="getLocalManagementSystemReport"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design pr-0" v-if="false">
                                <v-select :items="transactionTypeFilter" placeholder="Transaction Type Filter" clearable variant="outlined" v-model="transactionTypeValue" @change="getLocalManagementSystemReport"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}"  v-model="selected" show-select :headers="headers" :items="dataMetrics" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.type`]="{ item }">
                                {{item.selectable.type}}
                            </template>
                            <template v-slot:[`item.country`]="{ item }">
                                <!-- {{item.selectable.country}} -->
                                {{item.selectable.country.name}}
                            </template>
                            <template v-slot:[`item.city`]="{ item }">
                                {{item.selectable.city}}
                            </template>
                            <template v-slot:[`item.notes`]="{ item }">
                                {{item.selectable.notes ? item.selectable.notes : '-'}}
                            </template>
                            <template v-slot:[`item.action`]="{ item }">    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon :disabled="permissions.update_auth == '0'" @click.prevent="edit(item.selectable.id)">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>

                                <v-btn class="ma-2 bg-red-lighten-4" variant="text" icon :disabled="permissions.delete_auth == '0'" @click.prevent="deleteData(item.selectable.id)">
                                    <v-icon color="red-darken-4">
                                        mdi-delete-empty
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Delete</v-tooltip>
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

        <!-- Start Import CSV Modal -->
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Import Local System</h5>
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
                                    <input @change="chooseFile" title="Choose CSV" class="inputFile form-control-file" type="file" name="chooseFile" required/>
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
        <!-- End Import CSV Modal -->


        <div class="modal fade" id="viewDetail" tabindex="-1" role="dialog" aria-labelledby="viewDetailTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Report</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeViewModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
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
                        <h5 class="modal-title">{{activityType}} Local System</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeRmAmexModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>

                    <Form @submit="saveLocalManagementSystem" :validation-schema="schema" v-slot="{ errors }">
                        <div class="modal-body">
                            <v-row class="align-center">
                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Type</label>
                                    <Field name="Type" v-model="activity.type">
                                        <v-select name="Type" :class="{'form-control autocomplete': true , 'border-red-600':errors.Type }" :items="statusList" v-model="activity.type"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Type">Type Can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="6" lg="6" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">Country</label>
                                    <Field name="Country" v-model="activity.country">
                                        <v-select name="Country" :class="{'form-control autocomplete': true , 'border-red-600':errors.Country }" :items="countryList" item-value="key" v-model="activity.country"></v-select>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Country">Country Can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label">City</label>
                                    <Field type="text" name="City" id="input-username" :class="{'form-control': true , 'border-red-600':errors.City }" v-model="activity.city" placeholder="City"/>
                                    <span class="text-red-600" v-if="errors.City">City Can not be empty</span>
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Notes</label>
                                    <textarea :class="{'form-control': true}" placeholder="Notes" name="Notes" rows="3" v-model="activity.notes"></textarea>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeRmAmexModal">Close</v-btn>
                            </v-col>
                        </div>
                    </Form>
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
                { title: 'Action', key: 'action', align: 'center' },
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

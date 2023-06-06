<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center ">
                        <div class="col-lg-6 col-7 pt-0">
                            <!-- <h6 class="h2 text-white d-block mb-0">User Roles</h6> -->
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">CPA Networks List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/networks/affiliates" class="btn btn-lg btn-neutral btn_animated">
                                <img :src="images.networks" class="img-width2">
                                Integrate New CPA Network
                            </a>
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
                    <div class="card">
                        <div class="card-body">
                            <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id"  class="elevation-1" :itemsPerPage="itemsPerPage">
                                <template v-slot:item="{ item }">
                                    <tr>
                                        <td>{{item.id}}</td>
                                        <td>{{item.name}}</td>
                                        <td>{{item.email ? item.email : '-' }}</td>
                                        <td>{{item.affiliate_id}}</td>
                                        <td class="text-capitalize">{{item.network}}</td>
                                        <td>{{item.company ? item.company : '-' }}</td>
                                        <td>{{item.notes ? item.notes : '-' }}</td>
                                        <td>{{format_date(item.created_at)}}</td>
                                        <td>
                                            <a href="javascript:void(0);" @click="edit(item.id)">
                                                    <img :src="images.edit" class="img-width">
                                                </a>
                                            <a href="javascript:void(0);" @click="showConfirmation(item.id)">
                                                <img :src="images.bin" class="img-width">
                                            </a>
                                            <!-- <a href="javascript:void(0);" @click="viewAccount(item.id)">
                                                <img :src="images.eye" class="img-width">
                                            </a> -->
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                            <!-- <div class="table-responsive">
                                <table class="table align-items-center">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th style="width:15%;" class="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="list">
                                        <tr v-for="(account, index) in affiliates" :key="index">
                                            <th>{{index+1}}</th>
                                            <td>{{account.name}}</td>
                                            <td class="text-center">
                                                <a href="javascript:void(0);" @click="edit(account.id)">
                                                    <img :src="images.edit" class="img-width">
                                                </a>
                                                <a href="javascript:void(0);" @click="showConfirmation(account.id)">
                                                    <img :src="images.bin" class="img-width">
                                                </a>
                                                <a href="javascript:void(0);" @click="viewAccount(account.id)">
                                                    <img :src="images.eye" class="img-width">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- confirmation alert box -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="confirmationBox" persistent max-width="400">
                    <v-card>
                        <v-card-title class="text-h5 text-center">Delete Account</v-card-title>
                        <v-card-text>Are you sure you want to delete your affiliate?.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="cancel()"> Cancel </v-btn>
                            <v-btn color="green darken-1" text @click="deleteAccount()"> Delete </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
        <template>
                <v-row justify="center">
                    <v-dialog v-model="showEditForm" persistent max-width="600px">
                        <v-app>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 style="color:#fff;" class="modal-title">Edit Your Network Name</h5>
                                </div>
                                <div class="modal-body">
                                    <div class="col-12">
                                        <div class="row">
                                            <div class="col-lg-12 p-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Network Name*</label>
                                                    <input type="text" class="form-control" required v-model="network_name">
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Email</label>
                                                    <input type="text" class="form-control" placeholder="Email" v-model="email">
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Company</label>
                                                    <input type="text" class="form-control" placeholder="Company" v-model="company">
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Notes</label>
                                                    <textarea :class="{'form-control': true}"  name="" cols="30" rows="5" v-model="notes"></textarea>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 py-0 text-right">
                                                <button type="submit" class="btn btn-secondary btn-lg btn_animated" @click="showEditForm = false">Close</button>
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated" @click="updateNetworkName">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Network Name*" required v-model="network_name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Email" v-model="email"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-card-actions>
                                <v-btn color="blue darken-1" text @click="showEditForm = false"> Close </v-btn>
                                <v-btn color="blue darken-1" text @click="updateNetworkName"> Save </v-btn>
                            </v-card-actions> -->
                        </v-app>
                    </v-dialog>
                </v-row>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: {
                edit: require('../../assets/img/icons/edit.svg'),
                bin: require('../../assets/img/icons/bin.svg'),
                eye: require('../../assets/img/icons/eye.svg'),
                networks: require('../../assets/img/icons/networks.svg'),
            },
            hideShowLoader: false,
            confirmationBox: false,
            showEditForm: false,
            accountIdToDelete: '',
            accountIdEdit: '',
            network_name: '',
            notes: '',
            email: '',
            company: '',
            singleExpand: true,
            networkHeaders: [
                { title: 'Network ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Network Name', align: 'start', sortable: true, key: 'name' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Login ID',  key: 'affiliate_id' },
                { title: 'Platform Type',  key: 'network' },
                { title: 'Company', key: 'company' },
                { title: 'Notes', key: 'notes' },
                { title: 'Date Added',  key: 'created_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1
        }
    },
}
</script>

<style scoped>
    .box-shadow {
        border-radius: 4px;
        box-shadow: 0 2px 1px #c2c2c2;
    }
    .img-width {
        width: 30px;
    }
    .img-width2 {
        width: 15px;
    }
</style>

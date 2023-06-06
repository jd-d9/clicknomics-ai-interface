<template>
    <div>
        <div class="header bg-primary pb-6">
            <div class="container-fluid">
                <div class="header-body">
                    <div class="row align-items-center mt--4">
                        <div class="col-lg-6 col-7 pt-0">
                            <nav aria-label="breadcrumb" class="d-none d-block ">
                                <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
                                    <li class="breadcrumb-item">
                                        <a href="/dashboard"><i class="fas fa-home"></i></a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Domains List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 col-5 text-right">
                            <a href="/settings/domain/integrate" class="btn btn-lg btn-neutral btn_animated">
                                <img :src="images.networks" class="img-width2">
                                Integrate Domain
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
                    <div class="box-shadow">
                        <div class="card">
                            <div class="card-body">
                                <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id"  class="elevation-1" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{item.id}}</td>
                                            <td>{{item.email ? item.email : '-' }}</td>
                                            <td>{{item.domain_selected}}</td>
                                            <td>{{format_date(item.created_at)}}</td>
                                            <td>
                                                <!-- <a href="javascript:void(0);" @click="edit(item.id)">
                                                    <img :src="images.edit" class="img-width">
                                                </a> -->
                                                <a href="javascript:void(0);" @click="showConfirmation(item.id)">
                                                    <img :src="images.bin" class="img-width">
                                                </a>
                                            </td>
                                        </tr>
                                    </template>
                                </v-data-table>
                            </div>
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
                        <v-card-text>Are you sure you want to delete your domain record?.</v-card-text>
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
                bin: require('../../assets/img/icons/bin.svg'),
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
                { title: 'ID', align: 'start', sortable: true, key: 'id' },
                { title: 'Email', align: 'start', sortable: true, key: 'email' },
                { title: 'Domain Selected',  key: 'domain_selected' },
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

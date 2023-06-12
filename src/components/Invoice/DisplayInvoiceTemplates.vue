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
                                    <li class="breadcrumb-item active" aria-current="page">Invoice Template List</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <a href="/accounting/invoice" class="btn btn-lg btn-neutral btn_animated">Back</a>
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
                        <div class="card shadow">
                            <div class="card-body">
                                <div class="v-card v-sheet theme--light">
                                    <div class="card-header text-end">
                                        <div class="row">
                                            <div class="col-3 ms-auto">
                                                <div class="ms-auto search-input position-relative">
                                                    <input type="search" placeholder="Search" v-model="searchInput">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- data table component -->
                                    <v-data-table :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="invoiceList" :search="search"  :single-expand="singleExpand" class="elevation-1" :itemsPerPage="itemsPerPage">
                                        <template v-slot:item="{ item }">
                                            <tr class="table-body-back">
                                                <th>{{item.selectable.id}}</th>
                                                <td>
                                                    <router-link to="" data-bs-target="#createUpdateData" data-bs-toggle="modal">
                                                        {{item.selectable.name}} <i class="fa-solid fa-pen-to-square edit-icon-pen"></i>
                                                    </router-link>
                                                </td>
                                                <td>{{item.selectable.email}}</td>
                                                <td>+{{item.selectable.country_code}} - {{item.selectable.phone_number}}</td>
                                                <td>{{item.selectable.email}}</td>
                                                <td>
                                                    <button class="btn btn-lg btn-neutral">Create Invoice From Template</button>
                                                    <button class="disable-button" @click.prevent="editUser(item.selectable.id)">
                                                        <img src="/assets/img/icons/edit.svg" class="icon-width" title="Edit user">
                                                    </button>
                                                    <button class="disable-button" @click.prevent="deleteUser(item.selectable.id)">
                                                        <img src="/assets/img/icons/bin.svg" class="icon-width" title="Delete user">
                                                    </button>
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
        </div>
          <!-- Modal Update Template -->
        <div class="modal fade" id="createUpdateData" tabindex="-1" role="dialog" aria-labelledby="createUpdateDataTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 style="color:#fff;" class="modal-title">Update Template Name</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span style="color:#fff;" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <form>
                                <div class="row">
                                    <div class="col-lg-12 py-0">
                                        <div class="form-group">
                                            <label class="form-control-label" for="input-username">Template Name</label>
                                            <input type="text" :class="{'form-control': true }" v-model="selectedTemplate.name">
                                        </div>
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
            // images: {
            //     logo: require('/assets/img/brand/logo.png'),
            //     edit: require('/assets/img/icons/edit.svg'),
            //     bin: require('/assets/img/icons/bin.svg'),
            //     download: require('/assets/img/icons/download.svg'),
            //     share: require('/assets/img/icons/share.svg'),
            // },
            hideShowLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'id'},
                { title: 'Template Name', key: 'template_name'},
                { title: 'Invoice Number', key: 'invoice_number' },
                { title: 'Invoice Issue Date', key: 'invoice_issue_date' },
                { title: 'Invoice Due Date', key: 'invoice_due_date' },
                { title: 'Action', key: 'actions', },
            ],
            invoiceList: [
                {
                    "id": 1,
                    "name": "Test Media Buyer",
                    "email": "test@gmail.com",
                    "email_verified_at": null,
                    "last_login": null,
                    "role_id": 29,
                    "status": "1",
                    "country_code": "62",
                    "phone_number": "7878000000",
                    "created_by": 5,
                    "updated_by": 5,
                    "profile_image": null,
                    "created_at": "2023-06-09T04:59:55.000000Z",
                    "updated_at": "2023-06-09T05:00:19.000000Z",
                    "google2fa_secret": null,
                    "reset_2fa_token": null,
                    "reset_2fa_at": null,
                    "two_factor_code": null,
                    "two_factor_expires_at": null,
                    "verified_by": null,
                    "verified_at": null,
                    "verification_status": null,
                    "remember_2fa": null
                },
            ],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            selectedTemplate: {
                id: '',
                name: ''
            }
        }
    },
    methods: {

    }    
}
</script>

<style scoped>
    .edit-icon-pen {
        color: green;
    }
</style>

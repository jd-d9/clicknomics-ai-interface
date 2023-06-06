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
                                    <li class="breadcrumb-item active" aria-current="page">Microsoft Eliminated Accounts List</li>
                                </ol>
                            </nav>
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
                            <div class="box-shadow">
                                <v-data-table :headers="networkHeaders" :items="linkedNewtworks"  :single-expand="singleExpand" item-key="customer_id"  class="elevation-1" :itemsPerPage="itemsPerPage">
                                    <template v-slot:item="{ item }">
                                        <tr>
                                            <td>{{item.name}}</td>
                                            <td>{{item.account_id}}</td>
                                            <td>{{item.number}}</td>
                                            <td>{{format_date(item.deleted_at)}}</td>
                                            <td>
                                                <a href="javascript:void(0);">
                                                    <img :src="images.restore" class="img-width">
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            images: {
                restore: require('../../assets/img/icons/restore.svg'),
            },
            hideShowLoader: false,
            singleExpand: true,
            networkHeaders: [
                { title: 'Account Name',  key: 'name' },
                { title: 'Account ID',  key: 'account_id' },
                { title: 'Account Number',  key: 'number' },
                { title: 'Date On Removed',  key: 'deleted_at' },
                { title: 'Action',  key: '', sortable: false},
            ],
            linkedNewtworks: [],
            itemsPerPage: -1
        }
    },
    methods: {

    }
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
</style>

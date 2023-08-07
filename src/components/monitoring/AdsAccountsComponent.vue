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
                        <span>Monitoring Ads Accounts</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"><!-- v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex align-center justify-end">
                            Monitoring Ads Accounts List
                            <v-spacer></v-spacer>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal v_select_design py-0 pr-0">
                                <v-select v-model="value" :items="items" chips placeholder="Custom Filter" multiple clearable variant="outlined" @change="filterList"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0">
                                <input type="search" class="form-control serch_table" placeholder="Search" v-model="search" single-line hide-details />
                            </v-col>
                        </v-card-title>

                        <!-- data table component -->
                        <v-data-table class="table-hover-class mt-4" :footer-props="{'items-per-page-options': [5, 10, 15, 25, 50, 100, -1]}" :headers="headers" :items="adsAccountsList" :search="search" :itemsPerPage="itemsPerPage">
                            <template v-slot:[`item.account_id`]="{ item }">
                                {{item.selectable.account_id ? item.selectable.account_id : '-'}}
                            </template>
                            <template v-slot:[`item.name`]="{ item }">
                                <div class="text-ellipsis w-150">
                                    {{item.selectable.name ? item.selectable.name : '-'}}
                                </div>
                            </template>
                            <template v-slot:[`item.traffic_source`]="{ item }">
                                {{item.selectable.traffic_source ? item.selectable.traffic_source : '-'}}
                            </template>
                            <template v-slot:[`item.monitoring_check_enabled`]="{ item }">
                                <div class="text-green-lighten-1" v-if="item.selectable.monitoring_check_enabled == '1'">
                                    Enabled
                                </div>
                                <div class="text-red-lighten-1" v-else>
                                    Disabled
                                </div>
                            </template>
                            <template v-slot:[`item.action`]>    
                                <v-btn class="ma-2 bg-green-lighten-4" variant="text" icon @click.prevent="editAdsAccountModal">
                                    <v-icon color="green-darken-2">
                                        mdi-pencil
                                    </v-icon>
                                    <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0" v-if="permissions.view != '1' && !showLoader">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>

        <div class="modal fade" id="adsAccountModal" tabindex="-1" role="dialog" aria-labelledby="adsAccountModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Monitoring Ads Accounts</h5>
                        <button type="button" class="close" aria-label="Close" @click.prevent="closeAdsAccountModal">
                            <span aria-hidden="true" class="mdi mdi-close-circle"></span>
                        </button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12" class="pb-0 font-medium font-weight-normal">
                                    <label class="form-control-label" for="input-username">Monitoring Check Enabled</label>
                                    <Field v-model="item.monitoring_check_enabled">
                                        <v-select :class="{'form-control autocomplete': true}" :items="statusList" v-model="item.monitoring_check_enabled"></v-select>
                                    </Field>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="modal-footer">
                            <v-col cols="12" sm="12" md="12" lg="12" class="text-right pa-0">
                                <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                <v-btn class="text-none bg-red-darken-2 btn_animated" append-icon="mdi-close" @click.prevent="closeAdsAccountModal">Close</v-btn>
                            </v-col>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {

    },
    data() {
        return {
            showLoader: false,
            search: '',
            headers: [
                { title: 'ID', key: 'account_id' },
                { title: 'Account Name', key: 'name' },
                { title: 'Traffic Source', key: 'traffic_source' },
                { title: 'Monitoring Enabled', key: 'monitoring_check_enabled' },
                { title: 'Action', key: 'action' },
            ],
            adsAccountsList: [
                {
                    account_id: '5288641337',
                    name: 'IPM - 283',
                    traffic_source: 'GOOGLE',
                    monitoring_check_enabled: 'Disabled',
                    action: '',
                }
            ],
            singleExpand: true,
            page: 1,
            itemsPerPage: -1,
            items: ['GOOGLE', 'MICROSOFT'],
            value: ['GOOGLE', 'MICROSOFT'],
            statusList: [
                {
                    title: 'Enabled'
                },
                {
                    title: 'Disabled'
                },
            ],
            item: {
                id:'',
                monitoring_check_enabled: '',
                traffic_source: ''
            }
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
    methods: {
        editAdsAccountModal() {
            window.$('#adsAccountModal').modal('show');
        },
        closeAdsAccountModal() {
            window.$('#adsAccountModal').modal('hide');
        },
    }
}
</script>

<style scoped>
</style>
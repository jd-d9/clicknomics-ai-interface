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
                        <span>Credit Card Payments Report</span>
                        <v-spacer />
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0"> <!--  v-if="permissions.view == '1' && !showLoader" -->
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between align-center">
                            Credit Card Payments Report
                            <v-spacer></v-spacer>
                            <date-range-picker class="date_picker" :value="selectedRange" @update="checkOpenPicker"></date-range-picker>
                            <v-col cols="12" sm="12" md="3" lg="3" class="font-medium font-weight-normal py-0 pr-0 v_select_design">
                                <v-select clearable variant="outlined" placeholder="Custom Filter" v-model="selectedtTransactionType" :items="items" chips multiple @change="genrateArchivedReportsPayments"></v-select>
                            </v-col>
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" />

                        <v-row class="mt-4">
                            <v-col cols="6" sm="6" md="4" lg="3">
                                <v-card class="card_design bg-green-lighten-4">
                                    <v-card-title>
                                        <p class="text-subtitle-2 font-weight-bold">RM AMEX Plum Card</p>
                                    </v-card-title>
                                    <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                        <router-link to="" class="text-green-darken-1">
                                            $3000
                                        </router-link>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="6" md="4" lg="3">
                                <v-card class="card_design bg-blue-lighten-4">
                                    <v-card-title>
                                        <p class="text-subtitle-2 font-weight-bold">IPM Divvy Card</p>
                                    </v-card-title>
                                    <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                        $0.00
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="6" md="4" lg="3">
                                <v-card class="card_design bg-green-lighten-4">
                                    <v-card-title>
                                        <p class="text-subtitle-2 font-weight-bold">IPM AMEX Plum Card</p>
                                    </v-card-title>
                                    <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                        <router-link to="" class="text-green-darken-1">
                                            $3000
                                        </router-link>
                                    </v-card-text>
                                </v-card>
                            </v-col>

                            <v-col cols="6" sm="6" md="4" lg="3">
                                <v-card class="card_design bg-blue-lighten-4">
                                    <v-card-title>
                                        <p class="text-subtitle-2 font-weight-bold">IPM Chase Ink Card</p>
                                    </v-card-title>
                                    <v-card-text class="font-weight-medium text-h4 pa-0 mt-2 text-blue-darken-2">
                                        $0.00
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <!--  v-if="permissions.view != '1' && !showLoader" -->
                <!-- <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-content-center align-center">
                            You have no access for this page
                        </v-card-title>
                    </v-card>
                </v-col> -->
            </v-row>
        </v-container>
    </div>
</template>

<script>
import DateRangePicker from '../common/DateRangePicker.vue';
import moment from 'moment';
export default {
    components: {
        DateRangePicker,
    },

    data() {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 11, 59, 59, 999);
        return {
            showLoader: false,
            items: [ 'CREDIT','DEBIT'],
            selectedtTransactionType: [ 'CREDIT','DEBIT'],
            cardMemberList: [],

            dateRange: {startDate, endDate},
            selectedRange: `${moment().startOf('month').format('ddd MMM DD YYYY')} - ${moment().endOf('month').format('ddd MMM DD YYYY')}`,
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    },
}
</script>
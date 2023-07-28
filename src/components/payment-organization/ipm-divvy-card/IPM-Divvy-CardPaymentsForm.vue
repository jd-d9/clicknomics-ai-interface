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
                        <router-link to="/payment_methods/ipm-divvy-card" class="d-flex align-center">
                            <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                            <span>IPM Divvy Card Payments</span>
                        </router-link>

                        <v-icon icon="mdi-rhombus-medium" class="mx-2" color="#00cd00"></v-icon>
                        <span>Create</span>
                        <v-spacer />
                        <v-btn to="/payment_methods/ipm-divvy-card" class="ms-auto ml-2 text-none bg-blue-darken-4 btn_animated" prepend-icon="mdi-keyboard-backspace" >
                            Back
                        </v-btn>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            Create IPM Divvy Card Payments
                        </v-card-title>

                        <v-divider class="border-opacity-100 my-4" color="success" /> 
                        <Form>
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Name</label>
                                    <input type="text" :class="{'form-control': true }" placeholder="Card Name" v-model="name" />
                                    <!-- <span class="text-red-600" v-if="errors.Date">Date can not be empty</span> -->
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Type</label>
                                    <v-select :class="{'form-control autocomplete': true}" :items="cardType" v-model="type" placeholder="Select To Card Type"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Last Four Digit</label>
                                    <input type="number" maxlength='5' id="input-username" name="Amount" :class="{'form-control': true}" placeholder="Card Last Four Digit" v-model="last_four_digit"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Expiration</label>
                                    <datepicker placeholder="Select Date" name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card CVV</label>
                                    <input type="number" maxlength='5' id="input-username" name="Amount" :class="{'form-control': true}" placeholder="Card CVV" v-model="last_four_digit"/>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Security</label>
                                    <input type="number" :class="{'form-control': true}" placeholder="Security" v-model="security">
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Card Status</label>
                                    <v-select :class="{'form-control autocomplete': true}" :items="cardStatusList" v-model="cardStatus" placeholder="Select Card Status"></v-select>
                                </v-col>

                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Billing Address</label>
                                    <input type="text" :class="{'form-control': true }" placeholder="Billing Address" v-model="name" />
                                </v-col>

                                <v-col cols="12" sm="12" md="12" lg="12" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Notes</label>
                                    <textarea :class="{'form-control': true}" name="Notes" rows="5" v-model="notes"></textarea>
                                </v-col>

                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Save</v-btn>    
                                </v-col>
                            </v-row>
                        </Form> 
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

export default {
    components: {
        Datepicker,
    },
    data() {
        return{
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
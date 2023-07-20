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
                        <span>Process Email Report</span>
                    </v-breadcrumbs>
                </v-col>

                <v-col cols="12" sm="12" md="12" lg="12" class="py-0">
                    <v-card class="card_design mb-4">
                        <v-card-title class="d-flex justify-space-between">
                            Add Process Email Report 
                        </v-card-title>
                        <v-divider class="border-opacity-100 my-4" color="success" />    

                        <Form @submit="genrateEmailDailyReport" :validation-schema="schema" v-slot="{ errors }">
                            <v-row>
                                <v-col cols="12" sm="12" md="4" lg="4" class="font-medium font-weight-normal">
                                    <label class="form-control-label">Date</label>
                                    <Field name="Date" v-model="date" :class="{'border-red-600': errors.Date}">
                                        <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD" :class="{'border-red-600': errors.Date}"></datepicker>
                                    </Field>
                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                </v-col>
                                <v-col cols="12" sm="12" md="12" lg="12">
                                    <v-btn type="submit" class="text-none bg-blue-darken-4 btn_animated mr-3" append-icon="mdi-content-save">Generate Report</v-btn>    
                                </v-col>
                            </v-row>
                        </Form>
                    </v-card>
                    <v-dialog v-model="dialog" width="500" class="delete-confirm-card">
                        <v-card>
                            <v-card-title class="text-h5 text-center">Email Send Successfully</v-card-title>
                            <v-card-text>Report For Date {{resultDate}} Send Successfully</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import * as yup from 'yup';
import { Form, Field } from 'vee-validate';
import Datepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
export default {
    // props: ['network'],
    components: {
        Datepicker,
        Form, Field
    },
    data() {
        return {
            showLoader: false,
            dialog: false,
            date: '',
            resultDate: '',
        }
    },
    mounted() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // this.$nextTick(() => {
        //     window.$('.mx-datepicker input').addClass('datepicker-input');
        // })
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
            });
        },
    },
    methods: {
        // generate email report and send via email
        genrateEmailDailyReport() {
            this.showLoader = true;
            let formData = new FormData();
            formData.append('date', this.date);
            this.axios.post(this.$api + '/settings/processEmailReport/genrateEmailDailyReport', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    this.$toast.open({
                        message: 'We have emailed report',
                        position: 'top-right',
                        duration: '5000',
                        type: 'success'
                    });
                    console.log(response)
                    this.resultDate = this.date;
                    this.dialog = true;
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
                this.resultDate = '';
                this.showLoader = false;
            });
        },
    }
}
</script>

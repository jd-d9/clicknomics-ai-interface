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
                                    <li class="breadcrumb-item active" aria-current="page">Process Email Report</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <loader-component v-if="showLoader"></loader-component>
        <!-- Page content -->
        <div class="container-fluid mt--3">
            <div class="row justify-content-center">
                <div class="col">
                    <div class="card">
                        <div class="card-body">
                            <v-app>
                                <div class="col-12">
                                    <Form @submit="genrateEmailDailyReport" :validation-schema="schema" v-slot="{ errors }">
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <label class="form-control-label" for="input-username">Date</label>
                                                    <Field name="Date" v-model="date" :class="{'border-red-600': errors.Date}">
                                                        <datepicker name="Date" v-model:value="date" valueType="format" format="YYYY-MM-DD"></datepicker>
                                                    </Field>
                                                    <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6 py-0">
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-primary btn-lg btn_animated">Generate Report</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
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
                            </v-app>
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

<style scoped>

</style>

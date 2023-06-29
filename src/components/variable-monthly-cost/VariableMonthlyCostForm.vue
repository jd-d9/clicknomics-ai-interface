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
                                    <li class="breadcrumb-item active" aria-current="page">{{breadCrumbMessage}} Variable Monthly Cost</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/variableMonthlyCost" class="btn btn-lg btn-neutral btn_animated">View Variable Monthly Cost Listing</router-link>
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
                            <div class="col-12">
                                <Form @submit="manageVariableMonthlyCost" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <Field name="Date" v-model="date" :class="{'border-red-600': errors.Date}">
                                                    <datepicker v-model="date" range="true" name="Date" :clearable="true" format="YYYY-MM-DD"/>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Date"/> -->
                                                <!-- <vueified-date-range-picker @selected="cb"></vueified-date-range-picker> -->
                                            </div>
                                            <!-- <div class="form-group date-picker-3" v-else>
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <datepicker v-model="date" :locale="locale" :clearable="true" format="YYYY-MM-DD"/>
                                                <div :class="{'date-is-invalid': invalidDate}">
                                                    <span class="invalid-feedback" role="alert">
                                                        <strong>{{ invalidDate }}</strong>
                                                    </span>
                                                </div>
                                            </div> -->
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Amount</label>
                                                <Field type="number" id="input-username" name="Amount" :class="{'form-control': true, 'border-red-600': errors.Amount}" step=".01" placeholder="Add Amount" v-model="amount"/>
                                                <span class="text-red-600" v-if="errors.Amount">Amount can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Amount"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 py-0 mt-3">
                                            <div class="form-group">
                                                <label class="form-control-label" for="input-username">Notes</label>
                                                <Field name="Notes" v-model="notes">
                                                    <textarea :class="{'form-control': true, 'border-red-600': errors.Notes}" name="Notes" cols="30" rows="10" v-model="notes"></textarea>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Notes">Notes can not be empty</span>
                                                <ErrorMessage class="text-red-600" name="Notes"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">{{toggleElement ? 'Save' : 'Update'}}</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
import * as yup from 'yup';
import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
import { required } from '@vee-validate/rules';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
defineRule('required', required);
loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/ar.json'
);
configure({
    generateMessage: localize('en', {
        messages: {
            required: '{field} can not be empty!',
        },
        // fields: {
        //     Status: {
        //         required: 'Status can not be empty!!!'
        //     }
        // }
    }),
});
export default {
    components: {
        Datepicker,
        Form, Field, ErrorMessage
    },
    data() {
        return {
            showLoader: false,
            date: '',
            amount: '',
            notes: '',
            breadCrumbMessage: 'Add',
            toggleElement: true,
        }
    },
    mounted() {
        if(this.$route.params.id) {
            this.getDataForEdit();
            this.breadCrumbMessage = 'Update';
            this.toggleElement = false;
        }
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
                Amount: yup.string().required(),
                Notes: yup.string().required(),
            });
        },
    },
    methods: {
        // create and update variable monthly cost
        manageVariableMonthlyCost() {
            // update variable monthly cost
            if(this.$route.params.id) {
                this.showLoader = true;
                this.axios.post(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                    _method: 'PUT',
                    date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    notes: this.notes,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/variableMonthlyCost');
                        this.$toast.open({
                            message: 'Variable monthly cost updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showLoader = false;
                });
            }
            // create variable monthly cost
            else {
                this.showLoader = true;
                this.axios.post(this.$api + '/accounting/variableCost', {
                    date: '2023-06-01,2023-06-07',
                    // date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    notes: this.notes,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/variableMonthlyCost');
                        this.$toast.open({
                            message: 'Variable monthly cost created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.showLoader = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.showLoader = false;
                });
            }
        },
        // get data for edit
        getDataForEdit() {
            this.showLoader = true;
            this.axios.get(this.$api + '/accounting/variableCost/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const data = response.data.data;
                    console.log(data)
                    this.date = new Date(data.date),
                    this.amount = data.amount,
                    this.notes = data.notes,
                    this.showLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.showLoader = false;
            });
        }
    }
}
</script>

<style scoped>

</style>

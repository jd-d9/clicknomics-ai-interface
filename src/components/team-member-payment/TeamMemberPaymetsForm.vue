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
                                    <li class="breadcrumb-item active" aria-current="page">Team Member Payments {{breadCrumbMessage}}</li>
                                </ol>
                            </nav>
                        </div>
                        <div class="col-lg-6 text-right">
                            <router-link to="/accounting/teamMembersPayments" class="btn btn-lg btn-neutral btn_animated">View Team Member Payments Listing</router-link>
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
                            <div class="col-12">
                                <Form @submit="manageTeamMemberPayment" :validation-schema="schema" v-slot="{ errors }">
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group date-picker-3">
                                                <label class="form-control-label" for="input-username">Date</label>
                                                <Field name="Date" v-model="date" label="Nice Name" :class="{'border-red-600': errors.Date}">
                                                    <datepicker inputFormat="yyyy-MM-dd" v-model="date" :locale="locale" :clearable="true" name="Date"/>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Date">Date can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Date"/> -->
                                            </div>
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
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-two select-network-filter-height">
                                                <label class="form-control-label" for="input-username">From Account</label>
                                                <Field v-model="fromAccount" name="Fromaccount">
                                                    <v-autocomplete name="Fromaccount" :class="{'form-control': true, 'border-red-600': errors.Fromaccount}" variant="outlined" :items="list" v-model="fromAccount" item-title="title" item-value="key"></v-autocomplete>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Fromaccount">From account can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Fromaccount"/> -->
                                            </div>
                                        </div>
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">To Account</label>
                                                <Field v-model="toAccount" name="Toaccount">
                                                    <v-select name="Toaccount" :class="{'form-control': true, 'border-red-600': errors.Toaccount}" :items="creditLines" v-model="toAccount" item-title="title" item-value="key"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Toaccount">To account can not be empty</span>
                                                <!-- <ErrorMessage class="text-red-600" name="Toaccount"/> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group select-network-filter select-network-filter-height">
                                                <label class="form-control-label" for="input-username">Status</label>
                                                <Field v-model="status" name="Status">
                                                    <v-select name="Status" :class="{'form-control': true, 'border-red-600': errors.Status}" :items="statusList" v-model="status"></v-select>
                                                </Field>
                                                <span class="text-red-600" v-if="errors.Status">Status can not be empty</span>
                                                <ErrorMessage class="text-red-600" name="Status"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6 py-0">
                                            <div class="form-group">
                                                <button type="submit" class="btn btn-primary btn-lg btn_animated">Save</button>
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
import * as yup from 'yup';
import { localize, loadLocaleFromURL } from '@vee-validate/i18n';
import { required } from '@vee-validate/rules';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import Datepicker from 'vue3-datepicker';
import moment from 'moment';
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
            hideShowLoader: false,
            date: '',
            amount: '',
            fromAccount: '',
            toAccount: '',
            status: '',
            list: [],
            creditLines: [],
            statusList: [
                {
                    title: 'Initiated'
                },
                {
                    title: 'Completed'
                },
            ],
            accountList: [],
            fromAccountList: [],
            toggleComponent: true,
            breadCrumbMessage: 'Create',
        }
    },
    mounted() {
        this.getFromToAccountDropdownData();
        if(this.$route.params.id) {
            this.toggleComponent = false;
            this.breadCrumbMessage = 'Edit';
            this.getDataForEdit();
        }
    },
    computed: {
        schema() {
            return yup.object({
                Date: yup.string().required(),
                Amount: yup.string().required(),
                Fromaccount: yup.string().required(),
                Toaccount: yup.string().required(),
                Status: yup.string().required(),
            });
        },
    },
    methods: {
        // get data for edit
        getDataForEdit() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/teamMemberPayment/' + this.$route.params.id, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    this.date = new Date(getData.payment_date);
                    this.amount = getData.amount;
                    this.fromAccount = getData.from_account;
                    this.toAccount = getData.to_account;
                    this.status = getData.status,
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
        // create and update team member payment
        manageTeamMemberPayment() {
            // update team member payment
            if(this.$route.params.id) {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/accounting/teamMemberPayment/' + this.$route.params.id, {
                    _method: 'PUT',
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/teamMembersPayments');
                        this.$toast.open({
                            message: 'Credit card payment updated',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.hideShowLoader = false;
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
                    this.hideShowLoader = false;
                });
            }
            // create team member payment
            else {
                this.hideShowLoader = true;
                this.axios.post(this.$api + '/accounting/teamMemberPayment', {
                    payment_date: moment(this.date).format('YYYY-MM-DD'),
                    amount: this.amount,
                    from_account: this.fromAccount,
                    to_account: this.toAccount,
                    status: this.status,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                    }
                })
                .then(response => {
                    if(response.data.success) {
                        this.$router.push('/accounting/teamMembersPayments');
                        this.$toast.open({
                            message: 'Team member payment created',
                            position: 'top-right',
                            duration: '5000',
                            type: 'success'
                        });
                        this.hideShowLoader = false;
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
                    this.hideShowLoader = false;
                });
            }
        },
        // get fromaccount and toaccount dropdown data
        getFromToAccountDropdownData() {
            this.hideShowLoader = true;
            this.axios.get(this.$api + '/accounting/teamMemberPayments/teammemberlist', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem('Token')}`
                }
            })
            .then(response => {
                if(response.data.success) {
                    const getData = response.data.data;
                    // get to account data
                    getData.filter((val) => {
                        return val.team_member_type == 'toAccount';
                    }).forEach((val) => {
                        this.creditLines.push({
                            title: val.team_member_name,
                            key: val.id
                        })
                    });
                    // get from account data
                    getData.filter((val) => {
                        return val.team_member_type == 'fromAccount';
                    }).forEach((val) => {
                        this.list.push({
                            title: val.team_member_name,
                            key: val.id
                        })
                    });
                    this.hideShowLoader = false;
                }
            })
            .catch(error => {
                console.log(error);
                this.hideShowLoader = false;
            });
        },
    }
}
</script>

<style scoped>

</style>

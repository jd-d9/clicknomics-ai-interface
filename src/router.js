import {createRouter, createWebHistory} from 'vue-router';
import EmailAuth from './components/Auth/EmailAuth.vue';
import LogIn from './components/Auth/LogIn.vue';
import TwoFA from './components/Auth/TwoFactoreAuth.vue';
import ResetPassword from './components/Auth/ResetPassword.vue';
import SetNewPassword from './components/Auth/SetNewPassword.vue';
import DashboardComponent from './components/DashboardComponent.vue';
import UserProfile from './components/User_Profile/UserProfile.vue';
import DisplayUsers from './components/User/DisplayUsers.vue';
import CreateUser from './components/User/CreateUser.vue';
import UpdateUser from './components/User/UpdateUser.vue';
import DisplayUserRole from './components/User_Role/DisplayUserRole.vue';
import CreateUserRole from './components/User_Role/CreateUserRole.vue';
import UpdateUserRole from './components/User_Role/UpdateUserRole.vue';
import DisplayInvoices from './components/Invoice/DisplayInvoices.vue';
import DisplayTemplates from './components/Invoice/DisplayTemplates.vue';
import InvoiceForm from './components/Invoice/InvoiceForm.vue';
import TemplateForm from './components/Invoice/TemplateForm.vue';
import CreditCardPayment from './components/Credit_Card_Payment/DisplayCreditCardPayment.vue';
import CreditCardPaymentForm from './components/Credit_Card_Payment/CreditCardPaymentForm.vue';
import DisplayTeamMemberPaymets from './components/Team_member_payment/DisplayTeamMemberPaymets.vue';
import TeamMemberPaymetsForm from './components/Team_member_payment/TeamMemberPaymetsForm.vue';
import DisplayVariableMonthlyCost from './components/Variable_monthly_cost/DisplayVariableMonthlyCost.vue';
import VariableMonthlyCostForm from './components/Variable_monthly_cost/VariableMonthlyCostForm.vue';
import DisplayFixedMonthlyCost from './components/Fixed_monthly_cost/DisplayFixedMonthlyCostList.vue';
import FixedMonthlyCostForm from './components/Fixed_monthly_cost/FixedMonthlyCostForm.vue';
import NetworksList from './components/Integrations/Cpa_Networks_List/NetworksList.vue';
import IntegrateNetwork from './components/Integrations/Cpa_Networks_List/IntegrateCpaNetwork.vue';
import DisplayDomainList from './components/Integrations/Domain_list/DisplayDomainList.vue';
import ManageEmailNotification from './components/Email_Notification/ManageEmailNotification.vue';
import ProcessEmailReport from './components/Reports/ProcessEmailReport.vue';
import MicrosoftEliminatedAccounts from './components/Archived_Traffic_Source/MicrosoftEliminatedAccounts.vue';
import eliminatedAccount from './components/Archived_Traffic_Source/eliminatedAccount.vue';
import CloudWayList from './components/Integrations/CloudWayList.vue';
import IntegrationDomain from './components/Integrations/IntegrationDomain.vue';
import CommingSoonComponent from './components/Common/CommingSoonComponent.vue';
import NotFoundPage from './components/Common/NotFoundPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // user login and authentications
        {path: '/login', component: LogIn},
        {path: '/password/reset', component: ResetPassword},
        {path: '/set_new_password', component: SetNewPassword},
        {path: '/', redirect: '/dashboard', meta: {auth: true}},
        {path: '/authenticator/validate', component: TwoFA, meta: {auth: true}},
        {path: '/authenticator/validate/email', component: EmailAuth, meta: {auth: true}},
        // dashboard
        {path: '/dashboard', component: DashboardComponent, meta: {auth: true}},
        // user profile / user / user role
        {path: '/my_profile', component: UserProfile, meta: {auth: true}},
        {path: '/settings/user', component: DisplayUsers, meta: {auth: true}},
        {path: '/settings/user_management/users/create', component: CreateUser, meta: {auth: true}},
        {path: '/settings/user_management/users/:id/edit', component: UpdateUser, meta: {auth: true}},
        {path: '/settings/user_management/user_roles', component: DisplayUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/create', component: CreateUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/:id/edit', component: UpdateUserRole, meta: {auth: true}},
        // invoice and template
        {path: '/accounting/invoice', component: DisplayInvoices, meta: {auth: true}},
        {path: '/accounting/invoice/template', component: DisplayTemplates, meta: {auth: true}},
        {path: '/accounting/invoice/create', component: InvoiceForm, meta: {auth: true}},
        {path: '/accounting/invoice/:id/edit', component: InvoiceForm, meta: {auth: true}},
        {path: '/accounting/invoice/template/:id/edit', component: TemplateForm, meta: {auth: true}},
        {path: '/accounting/invoice/:id/createFromTemplate', component: TemplateForm, meta: {auth: true}},
        // credit card payments
        {path: '/accounting/creditCardPayments', component: CreditCardPayment, meta: {auth: true}},
        {path: '/accounting/creditCardPayments/create', component: CreditCardPaymentForm, meta: {auth: true}},
        {path: '/accounting/creditCardPayments/:id/edit', component: CreditCardPaymentForm, meta: {auth: true}},
        // team member payments
        {path: '/accounting/teamMembersPayments', component: DisplayTeamMemberPaymets, meta: {auth: true}},
        {path: '/accounting/teamMembersPayments/create', component: TeamMemberPaymetsForm, meta: {auth: true}},
        {path: '/accounting/teamMembersPayments/:id/edit', component: TeamMemberPaymetsForm, meta: {auth: true}},
        // variable monthly cost
        {path: '/accounting/variableMonthlyCost', component: DisplayVariableMonthlyCost, meta: {auth: true}},
        {path: '/accounting/variableMonthlyCost/create', component: VariableMonthlyCostForm, meta: {auth: true}},
        {path: '/accounting/variableMonthlyCost/:id/edit', component: VariableMonthlyCostForm, meta: {auth: true}},
        // fixed monthly cost
        {path: '/accounting/fixedMonthlyCost', component: DisplayFixedMonthlyCost, meta: {auth: true}},
        {path: '/accounting/fixedMonthlyCost/create', component: FixedMonthlyCostForm, meta: {auth: true}},
        {path: '/accounting/fixedMonthlyCost/:id/edit', component: FixedMonthlyCostForm, meta: {auth: true}},
        // settings/integration/networks
        {path: '/settings/networks', component: NetworksList, meta: {auth: true}},
        {path: '/settings/networks/affiliates', component: IntegrateNetwork, meta: {auth: true}},
        // settings/integration/domain
        {path: '/settings/domain', component: DisplayDomainList, meta: {auth: true}},
        // other
        {path: '/settings/emailNotification', component: ManageEmailNotification, meta: {auth: true}},
        {path: '/settings/processEmailReport', component: ProcessEmailReport, meta: {auth: true}},
        {path: '/settings/archived-accounts-microsoft', component: MicrosoftEliminatedAccounts, meta: {auth: true}},
        {path: '/settings/archived-accounts-google', component: eliminatedAccount, meta: {auth: true}},
        {path: '/settings/cloudways', component: CloudWayList, meta: {auth: true}},
        {path: '/settings/domain/integrate', component: IntegrationDomain, meta: {auth: true}},
        {path: '/help/:routeName', component: CommingSoonComponent, meta: {auth: true}},
        // not found page
        {path: '/:notFound(.*)', component: NotFoundPage},
    ]
});

router.beforeEach((to, from, next) => {
    if(to.meta.auth) {
        const registeredUserId = sessionStorage.getItem('Token');
        if(registeredUserId) {
            next();
        }
        else {
            next('/login');
        }
    }
    else {
        next();
    }
})

export default router;
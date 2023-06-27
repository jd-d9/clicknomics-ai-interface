import {createRouter, createWebHistory} from 'vue-router';
import EmailAuth from './components/authentication/EmailAuth.vue';
import LogIn from './components/authentication/LogIn.vue';
import TwoFA from './components/authentication/TwoFactoreAuth.vue';
import ResetPassword from './components/authentication/ResetPassword.vue';
import SetNewPassword from './components/authentication/SetNewPassword.vue';
import DashboardComponent from './components/DashboardComponent.vue';
import UserProfile from './components/user-profile/UserProfile.vue';
import DisplayUsers from './components/user/UsersList.vue';
import CreateUser from './components/user/CreateUser.vue';
import UpdateUser from './components/user/UpdateUser.vue';
import DisplayUserRole from './components/user-role/UserRoleList.vue';
import CreateUserRole from './components/user-role/CreateUserRole.vue';
import UpdateUserRole from './components/user-role/UpdateUserRole.vue';
import DisplayInvoices from './components/invoice/InvoiceList.vue';
import DisplayTemplates from './components/invoice/TemplateList.vue';
import InvoiceForm from './components/invoice/InvoiceForm.vue';
import TemplateForm from './components/invoice/TemplateForm.vue';
import CreditCardPayment from './components/credit-card-payment/CreditCardPaymentList.vue';
import CreditCardPaymentForm from './components/credit-card-payment/CreditCardPaymentForm.vue';
import DisplayTeamMemberPaymets from './components/team-member-payment/TeamMemberPaymetsList.vue';
import TeamMemberPaymetsForm from './components/team-member-payment/TeamMemberPaymetsForm.vue';
import DisplayVariableMonthlyCost from './components/variable-monthly-cost/VariableMonthlyCostList.vue';
import VariableMonthlyCostForm from './components/variable-monthly-cost/VariableMonthlyCostForm.vue';
import DisplayFixedMonthlyCost from './components/fixed-monthly-cost/FixedMonthlyCostList.vue';
import FixedMonthlyCostForm from './components/fixed-monthly-cost/FixedMonthlyCostForm.vue';
import NetworksList from './components/integrations/cpa-networks/NetworksList.vue';
import IntegrateNetwork from './components/integrations/cpa-networks/IntegrateNetworkForm.vue';
import DomainList from './components/integrations/domain/DomainList.vue';
import DomainForm from './components/integrations/domain/DomainForm.vue';
import CloudwaysList from './components/integrations/cloudways/CloudwaysList.vue';
import CloudwaysForm from './components/integrations/cloudways/CloudwaysForm.vue';
import ManualNetworkList from './components/manual-networks/ManualNetworkList.vue';
import ManualNetworkRevenueForm from './components/manual-networks-revenue/ManualNetworkRevenueForm.vue';
import ManualNetworkRevenueList from './components/manual-networks-revenue/ManualNetworkRevenueList.vue';
import CommingSoonComponent from './components/common/CommingSoonComponent.vue';
import NotFoundPage from './components/common/NotFoundPage.vue';

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
        {path: '/settings/domain', component: DomainList, meta: {auth: true}},
        {path: '/settings/domain/integrate', component: DomainForm, meta: {auth: true}},
        // settings/integration/cloudways
        {path: '/settings/cloudways', component: CloudwaysList, meta: {auth: true}},
        {path: '/settings/cloudways/integrate', component: CloudwaysForm, meta: {auth: true}},
        // network module
        {path: '/networks/manualNetworks', component: ManualNetworkList, meta: {auth: true}},
        // add manual network revenue moule
        {path: '/networks/manualNetworks/create', component: ManualNetworkRevenueForm, meta: {auth: true}},
        {path: '/networks/manualNetworks/list', component: ManualNetworkRevenueList, meta: {auth: true}},
        // other
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
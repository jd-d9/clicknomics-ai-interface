import {createRouter, createWebHistory} from 'vue-router';
import SignUp from './components/authentication/SignUp.vue';
import SubscriptionPlans from './components/authentication/SubscriptionPlans.vue';
import LogIn from './components/authentication/LogIn.vue';
import TwoFA from './components/authentication/TwoFactoreAuth.vue';
import EmailAuth from './components/authentication/EmailAuth.vue';
import ResetPassword from './components/authentication/ResetPassword.vue';
import SetNewPassword from './components/authentication/SetNewPassword.vue';
import ResetTwoFactorAuth from './components/authentication/ResetTwoFactorAuth.vue';
import DashboardComponent from './components/DashboardComponent.vue';
import UserProfile from './components/user-profile/UserProfile.vue';
import DisplayUsers from './components/user/UsersList.vue';
import CreateUser from './components/user/CreateUser.vue';
import UpdateUser from './components/user/UpdateUser.vue';
import DisplaySubscribeUsers from './components/subscribed-user/SubscribedUsersList.vue';
import CreateSubscribeUser from './components/subscribed-user/CreateSubscribedUser.vue';
import UpdateSubscribeUser from './components/subscribed-user/UpdateSubscribedUser.vue';
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
import GoogleAdsComponent from './components/integrations/traffic-sources/GoogleAdsComponent.vue';
import MicrosoftAdsComponent from './components/integrations/traffic-sources/MicrosoftAdsComponent.vue';
import PlansList from './components/plans/PlansList.vue';
import PlansForm from './components/plans/PlansForm.vue';
import ManualNetworkList from './components/manual-networks/ManualNetworkList.vue';
import ManualNetworkRevenueForm from './components/manual-networks-revenue/ManualNetworkRevenueForm.vue';
import ManualNetworkRevenueList from './components/manual-networks-revenue/ManualNetworkRevenueList.vue';
import EliminatedAutomatedNetworks from './components/archived-eliminated-networks/EliminatedAutomatedNetworks';
import EliminatedManualNetworks from './components/archived-eliminated-networks/EliminatedManualNetworks';
import EmailNotificationList from './components/email-notification/EmailNotificationList.vue';
import ProcessEmailReportComponent from './components/process-email-report/ProcessEmailReportComponent.vue';
import GoogleEliminatedAccountList from './components/archived-traffic-source/GoogleEliminatedAccountList.vue';
import MicrosoftEliminatedAccountList from './components/archived-traffic-source/MicrosoftEliminatedAccountList.vue';
import LocalManagementSystem from './components/management-system/LocalManagementSystem.vue';
import DatacenterVpsManagementSystem from './components/management-system/DatacenterVpsManagementSystem.vue';
import ResidentialVpsManagementSystem from './components/management-system/ResidentialVpsManagementSystem.vue';
import MultiLoginManagementSystem from './components/management-system/MultiLoginManagementSystem.vue';
import ServerListComponent from './components/server/ServerListComponent.vue';

// Domains Section
import EranetDomainComponent from './components/domains/manual-domain/EranetDomainComponent.vue';
import FlokinetDomainComponent from './components/domains/manual-domain/FlokinetDomainComponent.vue';
import NamecheapDomain from './components/domains/automated-domain/NamecheapDomain';
import GodaddyDomain from './components/domains/automated-domain/GodaddyDomain';
import NamesiloDomain from './components/domains/automated-domain/NamesiloDomain';
import NjalDomains from './components/domains/automated-domain/NjalDomains';
import EasydnsDomains from './components/domains/automated-domain/EasydnsDomains';


import AdAccountComponent from './components/ad-accounts/AdAccountComponent.vue';
import CampaignsList from './components/campaigns/CampaignsList.vue';
import IpmChaseList from './components/bank-accounts/ipm-chase/IpmChaseList.vue';
import IpmChaseForm from './components/bank-accounts/ipm-chase/IpmChaseForm.vue';
import IpmOsscList from './components/bank-accounts/ipm-ossc/IpmOsscList.vue';
import IpmOsscForm from './components/bank-accounts/ipm-ossc/IpmOsscForm.vue';
import ArchivedReportMicrosoftAdsList from './components/archived-reports/ArchivedReportMicrosoftAdsList.vue';
import ArchivedReportGoogleAdsList from './components/archived-reports/ArchivedReportGoogleAdsList.vue';
import ArchivedReportNetwoksList from './components/archived-reports/ArchivedReportNetwoksList.vue';
import ArchivedReportManualNetworksList from './components/archived-reports/ArchivedReportManualNetworksList.vue';
import CommingSoonComponent from './components/common/CommingSoonComponent.vue';
import NotFoundPage from './components/common/NotFoundPage.vue';

// report section
import RealTimeReportGoogle from './components/real-time-reports/RealTimeReportGoogle';
import RealTimeReportMicrosoft from './components/real-time-reports/RealTimeReportMicrosoft';
import ReportsComponent from './components/real-time-reports/ReportsComponent';
import CreditCardPaymentReport from './components/payments-reports/CreditCardPaymentReport';
import BankAccountsPaymentReport from './components/payments-reports/BankAccountsPaymentReport';
import TeamMemberPaymentsReport from './components/payments-reports/TeamMemberPaymentsReport';

// Payment Methods Section
import RM_AMEX_PlumCardPayments from './components/payment-organization/rm-amex-plum/RM-AMEX-PlumCardPayments';
import RM_AMEX_PlumCardPaymentsForm from './components/payment-organization/rm-amex-plum/RM-AMEX-PlumCardPaymentsForm';
import IPM_AMEX_PlumCardPayments from './components/payment-organization/ipm-amex-plum/IPM-AMEX-PlumCardPayments';
import IPM_AMEX_PlumCardPaymentsForm from './components/payment-organization/ipm-amex-plum/IPM-AMEX-PlumCardPaymentsForm';
import IPM_Divvy_CardPayments from './components/payment-organization/ipm-divvy-card/IPM-Divvy-CardPayments';
import IPM_Divvy_CardPaymentsForm from './components/payment-organization/ipm-divvy-card/IPM-Divvy-CardPaymentsForm';
import IPM_ChaseInkCardPayments from './components/payment-organization/ipm-chase-ink-card/IPM-ChaseInkCardPayments';
import IPM_ChaseInkCardPaymentsForm from './components/payment-organization/ipm-chase-ink-card/IPM-ChaseInkCardPaymentsForm';



const router = createRouter({
    history: createWebHistory(),
    routes: [
        // user login and authentications
        {path: '/signup', component: SignUp},
        {path: '/subscribe-plan', component: SubscriptionPlans},
        {path: '/login', component: LogIn},
        {path: '/password/reset', component: ResetPassword},
        {path: '/set_new_password', component: SetNewPassword},
        {path: '/', redirect: '/dashboard', meta: {auth: true}},
        {path: '/authenticator/validate', component: TwoFA, meta: {auth: true}},
        {path: '/authenticator/validate/email', component: EmailAuth, meta: {auth: true}},
        {path: '/authenticator/reset2FA', component: ResetTwoFactorAuth, meta: {auth: true}},
        // dashboard
        {path: '/dashboard', component: DashboardComponent, meta: {auth: true}},
        // user profile / user / user role
        {path: '/my-profile', component: UserProfile, meta: {auth: true}},
        {path: '/settings/user', component: DisplayUsers, meta: {auth: true}},
        {path: '/settings/user_management/users/create', component: CreateUser, meta: {auth: true}},
        {path: '/settings/user_management/users/:id/edit', component: UpdateUser, meta: {auth: true}},
        {path: '/settings/user_management/user_roles', component: DisplayUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/create', component: CreateUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/:id/edit', component: UpdateUserRole, meta: {auth: true}},
        // subscribed user module
        {path: '/settings/subscribed_user', component: DisplaySubscribeUsers, meta: {auth: true}},
        {path: '/settings/subscribed_user/create', component: CreateSubscribeUser, meta: {auth: true}},
        {path: '/settings/subscribed_user/:id/edit', component: UpdateSubscribeUser, meta: {auth: true}},
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
        // settings/integration/traffic-sources
        {path: '/settings/googleAds', component: GoogleAdsComponent, meta: {auth: true}},
        {path: '/settings/microsoftAds', component: MicrosoftAdsComponent, meta: {auth: true}},
        // settings/integration/networks
        {path: '/settings/networks', component: NetworksList, meta: {auth: true}},
        {path: '/settings/networks/affiliates', component: IntegrateNetwork, meta: {auth: true}},
        // settings/integration/domain
        {path: '/settings/domain', component: DomainList, meta: {auth: true}},
        {path: '/settings/domain/integrate', component: DomainForm, meta: {auth: true}},
        // settings/integration/cloudways
        {path: '/settings/cloudways', component: CloudwaysList, meta: {auth: true}},
        {path: '/settings/cloudways/integrate', component: CloudwaysForm, meta: {auth: true}},
        // settings/plan module
        {path: '/settings/plan-management', component: PlansList, meta: {auth: true}},
        {path: '/settings/plan-management/create', component: PlansForm, meta: {auth: true}},
        {path: '/settings/plan-management/:id/edit', component: PlansForm, meta: {auth: true}},
        // network module
        {path: '/networks/manualNetworks', component: ManualNetworkList, meta: {auth: true}},
        // add manual network revenue module
        {path: '/networks/manualNetworks/create', component: ManualNetworkRevenueForm, meta: {auth: true}},
        {path: '/networks/manualNetworks/:id/edit', component: ManualNetworkRevenueForm, meta: {auth: true}},
        {path: '/networks/manualNetworks/list', component: ManualNetworkRevenueList, meta: {auth: true}},
        // archived eliminated network module
        {path: '/networks/eliminated-automated-networks', component: EliminatedAutomatedNetworks, meta: {auth: true}},
        {path: '/networks/eliminated-manual-networks', component: EliminatedManualNetworks, meta: {auth: true}},
        // email notification module
        {path: '/settings/emailNotification', component: EmailNotificationList, meta: {auth: true}},
        // process email report module
        {path: '/settings/processEmailReport', component: ProcessEmailReportComponent, meta: {auth: true}},
        // archived traffic source module
        {path: '/settings/archived-accounts-google', component: GoogleEliminatedAccountList, meta: {auth: true}},
        {path: '/settings/archived-accounts-microsoft', component: MicrosoftEliminatedAccountList, meta: {auth: true}},
        // management system module
        {path: '/management_system/local', component: LocalManagementSystem, meta: {auth: true}},
        {path: '/management_system/datavps', component: DatacenterVpsManagementSystem, meta: {auth: true}},
        {path: '/management_system/residentialvps', component: ResidentialVpsManagementSystem, meta: {auth: true}},
        {path: '/management_system/multilogin', component: MultiLoginManagementSystem, meta: {auth: true}},

        // domains/manual module
        {path: '/domains/eranet', component: EranetDomainComponent, meta: {auth: true}},
        {path: '/domains/flokinet', component: FlokinetDomainComponent, meta: {auth: true}},
        // domains/automated module
        {path: '/domains/namecheap', component: NamecheapDomain, meta: {auth: true}},
        {path: '/domains/godaddy', component: GodaddyDomain, meta: {auth: true}},
        {path: '/domains/namesilo', component: NamesiloDomain, meta: {auth: true}},
        {path: '/domains/njal', component: NjalDomains, meta: {auth: true}},
        {path: '/domains/easydns', component: EasydnsDomains, meta: {auth: true}},

        // server module
        {path: '/servers', component: ServerListComponent, meta: {auth: true}},
        // ad accounts module
        {path: '/ad-accounts', component: AdAccountComponent, meta: {auth: true}},
        // campaigns module
        {path: '/campaigns', component: CampaignsList, meta: {auth: true}},

        // bank-accounts/ipm-chase module
        {path: '/bank_accounts/ipmchase/list', component: IpmChaseList, meta: {auth: true}},
        {path: '/bank_accounts/ipmchase/create', component: IpmChaseForm, meta: {auth: true}},
        {path: '/bank_accounts/ipmchase/:id/edit', component: IpmChaseForm, meta: {auth: true}},
        // bank-accounts/ipm-ossc module
        {path: '/bank_accounts/onesscorp/list', component: IpmOsscList, meta: {auth: true}},
        {path: '/bank_accounts/onesscorp/create', component: IpmOsscForm, meta: {auth: true}},
        {path: '/bank_accounts/onesscorp/:id/edit', component: IpmOsscForm, meta: {auth: true}},

        // report/realtime-report module
        {path: '/reporting/realTimeReports/google', component: RealTimeReportGoogle, meta: {auth: true}},
        {path: '/reporting/realTimeReports/microsoft', component: RealTimeReportMicrosoft, meta: {auth: true}},
        {path: '/reporting/realTimeReports/networks', component: ReportsComponent, meta: {auth: true}},
        // report/payments-report module
        {path: '/reporting/payments/credit-card', component: CreditCardPaymentReport, meta: {auth: true}},
        {path: '/reporting/payments/bank-accounts', component: BankAccountsPaymentReport, meta: {auth: true}},
        {path: '/reporting/payments/team-members', component: TeamMemberPaymentsReport, meta: {auth: true}},
        // report/archived-report module
        {path: '/reporting/archivedReports/microsoft', component: ArchivedReportMicrosoftAdsList, meta: {auth: true}},
        {path: '/reporting/archivedReports/google', component: ArchivedReportGoogleAdsList, meta: {auth: true}},
        {path: '/reporting/archivedReports/networks', component: ArchivedReportNetwoksList, meta: {auth: true}},
        {path: '/reporting/archivedReports/manualNetworks', component: ArchivedReportManualNetworksList, meta: {auth: true}},
        {path: '/reporting/archivedReports/facebook', component: CommingSoonComponent, meta: {auth: true}},

        // Payment Methods Module
        {path: '/payment_methods/rm-amex-plum-card', component: RM_AMEX_PlumCardPayments, meta: {auth: true}},
        {path: '/payment_methods/rm-amex-plum-card/create', component: RM_AMEX_PlumCardPaymentsForm, meta: {auth: true}},
        {path: '/payment_methods/ipm-amex-plum-card', component: IPM_AMEX_PlumCardPayments, meta: {auth: true}},
        {path: '/payment_methods/ipm-amex-plum-card/create', component: IPM_AMEX_PlumCardPaymentsForm, meta: {auth: true}},
        {path: '/payment_methods/ipm-divvy-card', component: IPM_Divvy_CardPayments, meta: {auth: true}},
        {path: '/payment_methods/ipm-divvy-card/create', component: IPM_Divvy_CardPaymentsForm, meta: {auth: true}},
        {path: '/payment_methods/ipm-chase-ink-card', component: IPM_ChaseInkCardPayments, meta: {auth: true}},
        {path: '/payment_methods/ipm-chase-ink-card/create', component: IPM_ChaseInkCardPaymentsForm, meta: {auth: true}},
        

        // comming soon pages
        {path: '/help/:routeName', component: CommingSoonComponent, meta: {auth: true}},
        {path: '/reporting/realTimeReports/facebook', component: CommingSoonComponent, meta: {auth: true}},


        // not found page
        {path: '/:notFound(.*)', component: NotFoundPage},
    ]
});

router.beforeEach((to, from, next) => {
    if(to.meta.auth) {
        const registeredUserId = localStorage.getItem('user-session')
        console.log(registeredUserId, 'registeredUserId');
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
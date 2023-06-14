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
import ManageEmailNotification from './components/Email_Notification/ManageEmailNotification.vue';
import ProcessEmailReport from './components/Reports/ProcessEmailReport.vue';
import MicrosoftEliminatedAccounts from './components/Archived_Traffic_Source/MicrosoftEliminatedAccounts.vue';
import eliminatedAccount from './components/Archived_Traffic_Source/eliminatedAccount.vue';
import CloudWayList from './components/Integrations/CloudWayList.vue';
import DomainList from './components/Integrations/DomainList.vue';
import IntegrationDomain from './components/Integrations/IntegrationDomain.vue';
import NetworkList from './components/Integrations/NetworkList.vue';
import CommingSoonComponent from './components/Common/CommingSoonComponent.vue';
import NotFoundPage from './components/Common/NotFoundPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/login', component: LogIn},
        {path: '/password/reset', component: ResetPassword},
        {path: '/set_new_password', component: SetNewPassword},
        {path: '/', redirect: '/dashboard', meta: {auth: true}},
        {path: '/dashboard', component: DashboardComponent, meta: {auth: true}},
        {path: '/authenticator/validate', component: TwoFA, meta: {auth: true}},
        {path: '/authenticator/validate/email', component: EmailAuth, meta: {auth: true}},
        {path: '/my_profile', component: UserProfile, meta: {auth: true}},
        {path: '/settings/user', component: DisplayUsers, meta: {auth: true}},
        {path: '/settings/user_management/users/create', component: CreateUser, meta: {auth: true}},
        {path: '/settings/user_management/users/:id/edit', component: UpdateUser, meta: {auth: true}},
        {path: '/settings/user_management/user_roles', component: DisplayUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/create', component: CreateUserRole, meta: {auth: true}},
        {path: '/settings/user_management/user_roles/:id/edit', component: UpdateUserRole, meta: {auth: true}},
        {path: '/accounting/invoice', component: DisplayInvoices, meta: {auth: true}},
        {path: '/accounting/invoice/template', component: DisplayTemplates, meta: {auth: true}},
        {path: '/accounting/invoice/create', component: InvoiceForm, meta: {auth: true}},
        {path: '/accounting/invoice/:id/edit', component: InvoiceForm, meta: {auth: true}},
        {path: '/accounting/invoice/template/:id/edit', component: TemplateForm, meta: {auth: true}},
        {path: '/accounting/invoice/:id/createFromTemplate', component: TemplateForm, meta: {auth: true}},
        {path: '/settings/emailNotification', component: ManageEmailNotification, meta: {auth: true}},
        {path: '/settings/processEmailReport', component: ProcessEmailReport, meta: {auth: true}},
        {path: '/settings/archived-accounts-microsoft', component: MicrosoftEliminatedAccounts, meta: {auth: true}},
        {path: '/settings/archived-accounts-google', component: eliminatedAccount, meta: {auth: true}},
        {path: '/settings/cloudways', component: CloudWayList, meta: {auth: true}},
        {path: '/settings/domain', component: DomainList, meta: {auth: true}},
        {path: '/settings/domain/integrate', component: IntegrationDomain, meta: {auth: true}},
        {path: '/settings/networks', component: NetworkList, meta: {auth: true}},
        {path: '/help/:routeName', component: CommingSoonComponent, meta: {auth: true}},
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
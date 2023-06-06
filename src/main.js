// window.Popper = require('popper.js').default;
// window.$ = window.jQuery = require('jquery');
// require('bootstrap');

// import jQuery from 'jquery';
// window.$ = jQuery;

// global.jQuery = require('jquery');
// const $ = global.jQuery;
// window.$ = $;

import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { loadFonts } from './plugins/webfontloader';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
// import VueSessionStorage from 'vue-sessionstorage';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components'
import { VDataTable } from 'vuetify/labs/VDataTable';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoaderComponent from './components/Common/LoaderComponent.vue';
import NavAndSideBar from './components/Navbar_and_Sidebar/NavAndSideBar.vue';
import TableComponent from './components/User/TableComponent.vue';

loadFonts();

const vuetify = createVuetify({
  directives,
  labsComponents,
  components: {
    VDataTable
  }
})

const app = createApp(App);
app.config.globalProperties.$api = process.env.VUE_APP_API;
app.use(router);
app.use(VueAxios, axios);
app.use(ToastPlugin);
app.use(vuetify);
require('@/assets/css/argon.css');
require('@/assets/css/responsive.css');
require('@/assets/css/dark-argon.css');
// app.config.globalProperties.$session = VueSessionStorage;
// app.use(VueSessionStorage);
// Vue.use(VueSessionStorage);
// Vue.config.productionTip = false;
app.component('loader-component', LoaderComponent);
app.component('nav-and-side-bar', NavAndSideBar);
app.component('table-component', TableComponent);
app.mount('#app');

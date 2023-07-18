// window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
require('bootstrap');

import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { loadFonts } from './plugins/webfontloader';
import axios from 'axios';
axios.defaults.withCredentials = true;

import VueAxios from 'vue-axios';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import '@mdi/font/css/materialdesignicons.css';
// vuetify
import 'vuetify/dist/vuetify.css';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';
import { VDataTable } from 'vuetify/labs/VDataTable';
// bootstrap
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// components
import LoaderComponent from './components/common/LoaderComponent.vue';
import NavAndSideBar from './components/navbar-and-sidebar/NavAndSideBar.vue';

loadFonts();
const vuetify = createVuetify({
  directives,
  labsComponents,
  components: {
    VDataTable
  },
  theme: {
    themes: {
      light: {
          primary: '#3f51b5',
          secondary: '#696969',
          accent: '#8c9eff',
          error: '#b71c1c',
      },
    },
  },
})

const app = createApp(App);
app.config.globalProperties.$api = process.env.VUE_APP_API;
app.config.globalProperties.$api_main = process.env.VUE_APP_API_MAIN;
app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  },
  toNumberWithoutDecimal(value) {
      var formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0
      });
      return formatter.format(value);
  },
  toCurrency(value) {
    value = parseFloat(value).toFixed(2);
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return formatter.format(value);
  },
  toNumber(value) {
    value = parseFloat(value).toFixed(2);
    var formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
    });
    return formatter.format(value);
  },
  toNumberWithPercentage(value) {
      value = parseFloat(value).toFixed(2);
      var formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2
      });
      return formatter.format(value)+ '%';
  },
}
app.use(router);
app.use(VueAxios, axios);
app.use(ToastPlugin);
app.use(vuetify);
// css
require('@/assets/css/argon.css');
require('@/assets/css/style.css');
require('@/assets/css/responsive.css');
require('@/assets/css/dark-argon.css');
// components
app.component('loader-component', LoaderComponent);
app.component('nav-and-side-bar', NavAndSideBar);
app.mount('#app');

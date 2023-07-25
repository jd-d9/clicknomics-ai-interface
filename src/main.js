// window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
require('bootstrap');


import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { loadFonts } from './plugins/webfontloader';
import axios from 'axios';
import VueCryptojs from 'vue-cryptojs'
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
import { VDataTableServer } from 'vuetify/labs/VDataTable'
// bootstrap
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// mixins
import mixin from './mixin.js';
// text editor
import 'jodit/build/jodit.min.css';
import JoditVue from 'jodit-vue';
// components
import LoaderComponent from './components/common/LoaderComponent.vue';
import NavAndSideBar from './components/navbar-and-sidebar/NavAndSideBar.vue';

loadFonts();
const vuetify = createVuetify({
  directives,
  labsComponents,
  components: {
    VDataTable,
    VDataTableServer
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

axios.interceptors.request.use(
  config => {
    console.log(config, 'config ----')
    const userSession = localStorage.getItem('user-session');
    // to do
    if(userSession) {
      // const decryptedObject = this.$CryptoJS.AES.decrypt(userSession, "Clicknomics-AI").toString(this.$CryptoJS.enc.Utf8)
      // let sessionData = JSON.parse(decryptedObject)
      console.log('---- decryptedObject ----')
      // const isAuthenticated = sessionData.Token;
      // const isVerified = sessionData.isTwoFactorVerified;
      // const verifiedBy = sessionData.verifiedBy;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized error
      sessionStorage.clear();
      // Redirect to login page or any other handling for 401 error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

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
    if(value) {
      return formatter.format(value);
    } else {
      return formatter.format(0);
    }
  },
  toCurrency(value) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    if(value) {
      value = parseFloat(value).toFixed(2);
      return formatter.format(value);
    }
    else {
      return formatter.format(0);
    }
  },
  toNumber(value) {
    value = parseFloat(value).toFixed(2);
    var formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
    });
    if(value) {
      return formatter.format(value);
    } else {
      return formatter.format(0);
    }
  },
  toNumberWithPercentage(value) {
      value = parseFloat(value).toFixed(2);
      var formatter = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2
      });
      if(value) {
        return formatter.format(value)+ '%';
      } else {
        return formatter.format(0);
      }
  },
}
app.use(router);
app.use(VueAxios, axios);
app.use(ToastPlugin);
app.use(VueCryptojs);
app.use(vuetify);
app.use(JoditVue);
app.mixin(mixin);
// css
require('@/assets/css/argon.css');
require('@/assets/css/style.css');
require('@/assets/css/responsive.css');
require('@/assets/css/dark-argon.css');
// components
app.component('loader-component', LoaderComponent);
app.component('nav-and-side-bar', NavAndSideBar);
app.mount('#app');

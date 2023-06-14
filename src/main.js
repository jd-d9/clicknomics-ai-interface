// window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
require('bootstrap');

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
// vuetify
import 'vuetify/dist/vuetify.css';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';
import { VDataTable } from 'vuetify/labs/VDataTable';
// bootstrap
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// date range picker
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css';
import LoaderComponent from './components/Common/LoaderComponent.vue';
import NavAndSideBar from './components/Navbar_and_Sidebar/NavAndSideBar.vue';

loadFonts();
// const myCustomLightTheme = {
//   dark: false,
//   colors: {
//     background: '#FFFFFF',
//     surface: '#FFFFFF',
//     primary: '#6200EE',
//     'primary-darken-1': '#3700B3',
//     secondary: '#03DAC6',
//     'secondary-darken-1': '#018786',
//     error: '#B00020',
//     info: '#2196F3',
//     success: '#4CAF50',
//     warning: '#FB8C00',
//   },
// }
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
app.use(router);
app.use(VueAxios, axios);
app.use(ToastPlugin);
app.use(vuetify);
// import 'vuetify/styles';
require('@/assets/css/argon.css');
require('@/assets/css/responsive.css');
require('@/assets/css/dark-argon.css');
// app.config.globalProperties.$session = VueSessionStorage;
// app.use(VueSessionStorage);
// Vue.use(VueSessionStorage);
// Vue.config.productionTip = false;
app.component('loader-component', LoaderComponent);
app.component('nav-and-side-bar', NavAndSideBar);
app.component('date-range-picker', DateRangePicker);
app.mount('#app');

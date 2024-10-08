import { createApp } from 'vue'

import App from './App.vue'
import router from "./router/index.js";
import BootstrapVue3 from 'bootstrap-vue-3';
import VueApexCharts from "vue3-apexcharts";
import vClickOutside from "click-outside-vue3";
import { registerScrollSpy } from 'vue3-scroll-spy';
import { Table, Column } from 'vxe-table';
import 'vxe-table/lib/style.css';
import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import Maska from 'maska'
import { i18n } from "./i18n.js"
import { initFirebaseBackend } from './authUtils.js'
import { configureFakeBackend } from './helpers/fake-backend.js';

const firebaseConfig = {
    apiKey: process.env.VUE_APP_APIKEY,
    authDomain: process.env.VUE_APP_AUTHDOMAIN,
    databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
    projectId: process.env.VUE_APP_PROJECTId,
    storageBucket: process.env.VUE_APP_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_APPId,
    measurementId: process.env.VUE_APP_MEASUREMENTID
};

if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
    initFirebaseBackend(firebaseConfig);
} else {
    configureFakeBackend();
}

import 'sweetalert2/dist/sweetalert2.min.css';
import '@vueform/slider/themes/default.css';

import store from "./state/store.js";

import "../src/design/app.scss";

import TablePager from '@/components/table-pager.vue';
createApp(App)
    .component('TablePager', TablePager)
    .use(store)
    .use(router)
    .use(require('vue-chartist'))
    .use(BootstrapVue3)
    .use(VueApexCharts)
    .use(vClickOutside)
    .use(i18n)
    .use(registerScrollSpy)
    .use(Maska)
    .use(VxeUI)
    .use(Table)
    .use(Column)
    .mount('#app')
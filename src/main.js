import { createApp } from 'vue'
import App from '@/App.vue'
import router from "@/router";
import BootstrapVue3 from 'bootstrap-vue-3';
import VueApexCharts from "vue3-apexcharts";
import vClickOutside from "click-outside-vue3";
import { registerScrollSpy } from 'vue3-scroll-spy';
import { Table, Column } from 'vxe-table';
import 'vxe-table/lib/style.css';
import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
import Maska from 'maska'
import { i18n } from "@/i18n.js"
import { initFirebaseBackend } from '@/authUtils.js'
import { configureFakeBackend } from '@/helpers/fake-backend.js';
import Antd from 'ant-design-vue';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@vueform/slider/themes/default.css';
import store from "@/state/store.js";
import "@/design/app.scss";
import TablePager from '@/components/table-pager.vue';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY,
  authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_APP_VITE_APP_DATABASEURL,
  projectId: import.meta.env.VITE_APP_PROJECTId,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_APPId,
  measurementId: import.meta.env.VITE_APP_MEASUREMENTID
};

if (import.meta.env.VITE_APP_DEFAULT_AUTH === "firebase") {
  initFirebaseBackend(firebaseConfig);
} else {
  configureFakeBackend();
}


createApp(App)
  .component('TablePager', TablePager)
  .use(store)
  .use(router)
  .use(BootstrapVue3)
  .use(VueApexCharts)
  .use(vClickOutside)
  .use(i18n)
  .use(registerScrollSpy)
  .use(Maska)
  .use(VxeUI)
  .use(Table)
  .use(Column)
  .use(Antd)
  .mount('#app')
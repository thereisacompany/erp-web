import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from '@/App.vue'
import router from "@/router/index";
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
import Antd from 'ant-design-vue';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@vueform/slider/themes/default.css';
import store from "@/state/store.js";
import "@/design/app.scss";
import TablePager from '@/components/table-pager.vue';
import zhTW from 'vxe-table/lib/locale/lang/zh-TW'
import 'vxe-table/lib/style.css'

const pinia = createPinia();

VxeUI.setI18n('zh-TW', zhTW)
// 切换指定语言
VxeUI.setLanguage('zh-TW')
// 获取当前使用的语言
VxeUI.getLanguage()

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
  .use(pinia)
  .mount('#app')
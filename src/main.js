import Vue from 'vue';
import App from './App.vue';
import * as echarts from 'echarts';
import _ from "lodash";
import api from "@/Api/api";
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element)
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.img_url ="../../assets/icon"
global.echarts = echarts;
global._ = _
new Vue({
  render: h => h(App)
}).$mount("#app")
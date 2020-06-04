import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import 'vue-awesome/icons/arrow-left'
import 'vue-awesome/icons/arrow-right'

import Icon from "vue-awesome/components/Icon.vue";

Vue.config.productionTip = false;
Vue.component('v-icon', Icon)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

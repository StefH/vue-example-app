/* eslint-disable import/order */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import './styles/quasar.styl';
import 'quasar-framework/dist/quasar.ie.polyfills';
import 'quasar-extras/animate';
import 'quasar-extras/material-icons';
import 'quasar-extras/fontawesome';

import Quasar from 'quasar';
import Vue2Filters from 'vue2-filters';

Vue.use(Quasar, {
  config: {},
});

Vue.use(Vue2Filters);

Vue.filter('ALLCAPS', (value) => {
  if (!value) {
    return '';
  }

  return value.toUpperCase();
});

Vue.config.productionTip = false;

new Vue({
  router,
  mixins: [Vue2Filters.mixin],
  render: h => h(App),
}).$mount('#app');

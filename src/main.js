/* eslint-disable import/order */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

import './styles/quasar.styl';
import 'quasar-framework/dist/quasar.ie.polyfills';
import 'quasar-extras/animate';
import 'quasar-extras/material-icons';
import 'quasar-extras/fontawesome';
// import { HelloWorld } from './components/HelloWorld.vue';

import Quasar from 'quasar';
import Vue2Filters from 'vue2-filters';

Vue.prototype.$appName = 'My App !!!';

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

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './components',

  // Do not look in subdirectories
  false,

  // Include all .vue files
  /[\w-]+\.vue$/,
);

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);

  // Get the PascalCase version of the component name
  const componentName = upperFirst(
    camelCase(
      fileName
        // Remove the "./_" from the beginning
        .replace(/^\.\/_/, '')
        // Remove the file extension from the end
        .replace(/\.\w+$/, ''),
    ),
  );

  console.log(`Globally register the component: ${componentName}`);

  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig);
});

// Define a new component called button-counter
Vue.component('button-counter', {
  data() {
    return {
      count: 0,
    };
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});

Vue.config.productionTip = false;

new Vue({
  beforeCreate() {
    console.log(this.$appName);
  },
  router,
  mixins: [Vue2Filters.mixin],
  render: h => h(App),
}).$mount('#app');

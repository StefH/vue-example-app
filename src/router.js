import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Color from './views/Color.vue';
import Generate from './views/Generate.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
        },
        {
          path: '/about',
          name: 'about',
          component: About,
        },
        {
          path: '/color',
          name: 'color',
          component: Color,
        },
        {
          path: '/generate',
          name: 'generate',
          component: Generate,
        },
      ],
    },
  ],
});

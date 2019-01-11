import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import People from './views/People.vue';
import Login from './views/Login.vue';
import Entry from './views/Entry.vue';
import Person from './views/Person.vue';
import Create from './views/Create.vue';
import Modify from './views/Modify.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/people',
      name: 'people',
      component: People,
    },
    {
      path: '/entry/:id',
      name: 'entry',
      component: Entry,
      props: true,
    },
    {
      path: '/people/:name',
      name: 'person',
      component: Person,
      props: true,
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
    },
    {
      path: '/modify/:id',
      name: 'modify',
      component: Modify,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});

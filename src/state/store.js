import { createStore } from 'vuex'

import auth from './modules/auth';
import authfack from './modules/authfack';
import index from './modules/index';
import layout from './modules/layout';
import notification from './modules/notification';
import todo from './modules/todo';
import user from './modules/user';

const store = createStore({
  modules: {
    auth,
    authfack,
    index,
    layout,
    notification,
    todo,
    user
  },
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: import.meta.env.NODE_ENV !== 'production',
})

export default store


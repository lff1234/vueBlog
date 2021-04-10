// import '@babel/polyfill';
// import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import Element from 'element-ui';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
// Vue.use(Element);

Vue.use(mavonEditor);

Vue.prototype.$store = store;
// Vue.prototype.$message = Message;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
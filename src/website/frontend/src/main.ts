import VueCookies from 'vue-cookies';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';

createApp(App).use(router).use(VueCookies).mount('#app');

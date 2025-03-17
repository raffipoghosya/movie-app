import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ✅ Ավելացնում ենք Vue Router

const app = createApp(App);
app.use(router); // ✅ Օգտագործում ենք router-ը
app.mount('#app');

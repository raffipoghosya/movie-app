import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // ✅ Պետք է լինի './router'

const app = createApp(App);

app.use(router); // ✅ Անպայման ավելացրու router-ը
app.mount('#app');

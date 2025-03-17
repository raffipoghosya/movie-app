import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';  // ✅ Փոխում ենք ուղին
import MovieDetails from '../views/MovieDetails.vue'; // ✅ Փոխում ենք ուղին

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: MovieDetails }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

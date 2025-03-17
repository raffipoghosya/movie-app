import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // ✅ Պետք է լինի '../views/Home.vue'
import MovieDetails from '../views/MovieDetails.vue'; // ✅ Պետք է լինի '../views/MovieDetails.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: MovieDetails }, // ✅ URL-ում ID-ն պետք է ճիշտ փոխանցվի
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

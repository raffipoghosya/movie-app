import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MovieDetails from '../views/MovieDetails.vue';
import Favorites from '../views/Favorites.vue';
import TopRated from '../views/TopRated.vue'; // ✅ Նոր էջը ներմուծում ենք

const routes = [
  { path: '/', component: Home },
  { path: '/movie/:id', component: MovieDetails },
  { path: '/favorites', component: Favorites },
  { path: '/top-rated', component: TopRated }, // ✅ Ավելացրինք նոր էջը
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

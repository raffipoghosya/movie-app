<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTopRatedMovies } from '../services/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const topMovies = ref<Movie[]>([]);

// loadTopRatedMovies
const loadTopRatedMovies = async () => {
  topMovies.value = await getTopRatedMovies();
};

onMounted(() => {
  loadTopRatedMovies();
});
</script>

<template>
  <div class="container">
    <h1>⭐ Top Rated Movies</h1>

    <div v-if="topMovies.length > 0" class="movies-grid">
      <div v-for="movie in topMovies" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id">
          <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
        </router-link>

        <p>⭐ {{ movie.vote_average }} | 📅 {{ movie.release_date }}</p>
      </div>
    </div>

    <p v-else class="loading">⏳ Loading top rated movies...</p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.movie-card {
  background: #222;
  padding: 10px;
  border-radius: 10px;
  color: white;
  text-align: center;
}

.movie-card img {
  width: 100%;
  border-radius: 5px;
}

.loading {
  font-size: 18px;
  color: #ffcc00;
}
</style>

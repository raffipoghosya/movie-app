<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { removeFromFavorites } from '../services/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const favoriteMovies = ref<Movie[]>([]);

// loadFavorites localStorage
const loadFavorites = () => {
  favoriteMovies.value = JSON.parse(localStorage.getItem('favorites') || '[]');
};

// removeFavorite
const removeFavorite = (movieId: number) => {
  removeFromFavorites(movieId);
  loadFavorites(); 
};

onMounted(() => {
  loadFavorites();
});
</script>

<template>
  <div class="container">
    <h1>⭐ Favorite Movies</h1>

    <div v-if="favoriteMovies.length > 0" class="movies-grid">
      <div v-for="movie in favoriteMovies" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id" class="movie-link">
          <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title" />
          <h3>{{ movie.title }}</h3>
        </router-link>

        <p>⭐ {{ movie.vote_average ?? 'N/A' }} | 📅 {{ movie.release_date ?? 'Unknown' }}</p>

        <!-- removeFavorite -->
        <button @click="removeFavorite(movie.id)">❌ Remove</button>
      </div>
    </div>

    <p v-else class="no-favorites">😢 No favorite movies yet.</p>
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
  transition: transform 0.2s ease-in-out;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.movie-card img {
  width: 100%;
  border-radius: 5px;
}

button {
  background-color: #ff4444;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
  color: white;
}

button:hover {
  background-color: #cc0000;
}

.no-favorites {
  font-size: 18px;
  color: #ffcc00;
}
</style>

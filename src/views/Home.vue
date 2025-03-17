<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre } from '../services/movieService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

const movies = ref<Movie[]>([]);
const genres = ref<Genre[]>([]);
const selectedGenre = ref<number | null>(null);
const searchQuery = ref('');
const isSearching = ref(false);

// ✅ Ստանալ ժանրերի ցանկը
const loadGenres = async () => {
  genres.value = await getGenres();
};

// ✅ Ֆունկցիա՝ ֆիլմի ժանրերը ստանալու համար
const getMovieGenres = (genreIds: number[]) => {
  return genreIds
    .map((id) => genres.value.find((genre) => genre.id === id)?.name)
    .filter((name) => name)
    .join(', '); // Միացնում ենք ժանրերի անունները ստորակետով
};

// ✅ Բեռնել ֆիլմերը՝ ըստ որոնման կամ ժանրի
const loadMovies = async () => {
  isSearching.value = false;

  if (searchQuery.value.length > 2) {
    isSearching.value = true;
    movies.value = await searchMovies(searchQuery.value);
  } else if (selectedGenre.value) {
    movies.value = await getMoviesByGenre(selectedGenre.value);
  } else {
    movies.value = await getPopularMovies();
  }
};

// ✅ Երբ փոխվում է որոնումը, սպասում ենք 500ms (debounce)
watch(searchQuery, async (newQuery) => {
  if (newQuery.length > 2 || newQuery.length === 0) {
    setTimeout(async () => {
      await loadMovies();
    }, 500);
  }
});

// ✅ Երբ ընտրվում է նոր ժանր, նորից բեռնում ենք ֆիլմերը
watch(selectedGenre, async () => {
  await loadMovies();
});

onMounted(async () => {
  await loadGenres();
  await loadMovies();
});
</script>

<template>
  <div class="container">
    <h1>Popular Movies</h1>

    <!-- 🔍 Որոնման դաշտ -->
    <input 
      v-model="searchQuery"
      placeholder="Search for movies..."
      class="search-input"
    />

    <!-- 🎬 Ժանրերի ընտրացանկ -->
    <select v-model="selectedGenre" class="genre-select">
      <option :value="null">All Genres</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>

    <div class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title || 'No Title'" />
        <h3>{{ movie.title || 'Untitled' }}</h3>
        <p>⭐ {{ movie.vote_average ?? 'N/A' }} | 📅 {{ movie.release_date ?? 'Unknown' }}</p>
        <!-- 🎭 Ցուցադրել ֆիլմի ժանրերը -->
        <p class="genres">🎭 {{ getMovieGenres(movie.genre_ids) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

.search-input, .genre-select {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #222;
  color: white;
  text-align: center;
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

.genres {
  color: #ffcc00;
  font-size: 14px;
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre, addToFavorites, removeFromFavorites } from '../services/movieService';

// 🔥 Movie և Genre ինտերֆեյսներ
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
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// ✅ Բեռնում ենք ժանրերի ցանկը
const loadGenres = async () => {
  genres.value = await getGenres();
};

// ✅ Ստանում ենք ֆիլմի ժանրերի անունները
const getMovieGenres = (genreIds: number[]) => {
  return genreIds
    .map((id) => genres.value.find((genre) => genre.id === id)?.name)
    .filter((name) => name)
    .join(', ');
};

// ✅ Ստուգում ենք, արդյոք ֆիլմը արդեն "հավանված" է
const isFavorite = (movie: Movie) => {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  return favorites.some((m: Movie) => m.id === movie.id);
};

// ✅ Ավելացնում կամ հեռացնում ենք "հավանել" ֆիլմերը
const toggleFavorite = (movie: Movie) => {
  if (isFavorite(movie)) {
    removeFromFavorites(movie.id);
  } else {
    addToFavorites(movie);
  }
};

// ✅ Բեռնում ենք ֆիլմերը (Infinite Scroll + Search + Genre)
const loadMovies = async (isNewSearch = false) => {
  if (isNewSearch) {
    movies.value = [];
    currentPage.value = 1;
  }

  if (isLoading.value || currentPage.value > totalPages.value) return;

  isLoading.value = true;
  let newMovies = [];

  if (searchQuery.value.length > 2) {
    isSearching.value = true;
    newMovies = await searchMovies(searchQuery.value, currentPage.value);
  } else if (selectedGenre.value) {
    newMovies = await getMoviesByGenre(selectedGenre.value, currentPage.value);
  } else {
    try {
      const response = await getPopularMovies(currentPage.value);
      if (Array.isArray(response)) {
        newMovies = response;
        totalPages.value = 10; 
      } else if (response && response.results) {
        newMovies = response.results;
        totalPages.value = response.total_pages || 1;
      } else {
        newMovies = [];
      }
    } catch (error) {
      console.error("❌ Error fetching movies:", error);
      newMovies = [];
    }
  }

  movies.value = [...movies.value, ...newMovies];
  currentPage.value++;
  isLoading.value = false;
};

// ✅ Երբ որոնումը փոխվի, նորից բեռնել տվյալները (debounce 200ms)
watch(searchQuery, async (newQuery) => {
  if (newQuery.length > 2 || newQuery.length === 0) {
    setTimeout(async () => {
      await loadMovies(true);
    }, 200);
  }
});

// ✅ Երբ ընտրվում է նոր ժանր, նորից բեռնում ենք ֆիլմերը
watch(selectedGenre, async () => {
  await loadMovies(true);
});

// ✅ Անսահման սկրոլի event listener
const handleScroll = () => {
  const bottomReached =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (bottomReached && !isLoading.value) {
    loadMovies();
  }
};

// ✅ Ավելացնում ենք scroll event
onMounted(async () => {
  await loadGenres();
  await loadMovies();
  window.addEventListener('scroll', handleScroll);
});

// ✅ Ջնջում ենք event listener-ը, երբ component-ը դուրս է գալիս
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="container">
    <h1>Popular Movies</h1>

    <!-- 🔍 Որոնման դաշտ -->
    <input v-model="searchQuery" placeholder="Search for movies..." class="search-input" />

    <!-- 🎬 Ժանրերի ընտրացանկ -->
    <select v-model="selectedGenre" class="genre-select">
      <option :value="null">All Genres</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>

    <div class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <!-- ✅ Այստեղ ավելացրու router-link -->
        <router-link :to="'/movie/' + movie.id" class="movie-link">
          <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title || 'No Title'" />
          <h3>{{ movie.title || 'Untitled' }}</h3>
        </router-link>

        <p>⭐ {{ movie.vote_average ?? 'N/A' }} | 📅 {{ movie.release_date ?? 'Unknown' }}</p>
        <p class="genres">🎭 {{ getMovieGenres(movie.genre_ids) }}</p>

        <!-- ✅ Հավանելու կոճակ -->
        <button @click="toggleFavorite(movie)">
          {{ isFavorite(movie) ? '⭐ Remove' : '⭐ Favorite' }}
        </button>
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

.genres {
  color: #ffcc00;
  font-size: 14px;
}

button {
  background-color: #ffcc00;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 5px;
}

button:hover {
  background-color: #e6b800;
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getPopularMovies, searchMovies, getGenres, getMoviesByGenre, addToFavorites, removeFromFavorites } from "../services/movieService";

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

const router = useRouter();
const movies = ref<Movie[]>([]);
const genres = ref<Genre[]>([]);
const selectedGenre = ref<number | null>(null);
const searchQuery = ref("");
const isSearching = ref(false);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

//  Load genres
const loadGenres = async () => {
  genres.value = await getGenres();
};

//  Get movie genres
const getMovieGenres = (genreIds: number[]) => {
  return genreIds
    .map((id) => genres.value.find((genre) => genre.id === id)?.name)
    .filter((name) => name)
    .join(", ");
};

//  Load movies (Infinite Scroll + Search + Genre)
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
      console.log("🎬 API Response:", response);

      if (Array.isArray(response)) {
        newMovies = response;
        totalPages.value = 10;
      } else if (response && response.results) {
        newMovies = response.results;
        totalPages.value = response.total_pages || 1;
      } else {
        console.warn("⚠ API response is empty:", response);
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

// Pick a random movie
const pickRandomMovie = () => {
  if (movies.value.length === 0) return;
  const randomMovie = movies.value[Math.floor(Math.random() * movies.value.length)];
  console.log("🎲 Random Movie:", randomMovie);

  if (randomMovie) {
    router.push(`/movie/${randomMovie.id}`);
  }
};

//  Toggle favorite
const toggleFavorite = (movie: Movie) => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favorites.some((m: Movie) => m.id === movie.id)) {
    removeFromFavorites(movie.id);
  } else {
    addToFavorites(movie);
  }
};

//  Check if a movie is a favorite
const isFavorite = (movie: Movie) => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favorites.some((m: Movie) => m.id === movie.id);
};

//  Watch for search input changes
watch(searchQuery, async (newQuery) => {
  if (newQuery.length > 2 || newQuery.length === 0) {
    setTimeout(async () => {
      await loadMovies(true);
    }, 200);
  }
});

//  Watch for genre selection changes
watch(selectedGenre, async () => {
  await loadMovies(true);
});

//  Infinite scroll event listener
const handleScroll = () => {
  const bottomReached =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

  if (bottomReached && !isLoading.value) {
    loadMovies();
  }
};

//  Add scroll event listener
onMounted(async () => {
  await loadGenres();
  await loadMovies();
  window.addEventListener("scroll", handleScroll);
});

// Remove event listener when component unmounts
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="container">
    <h1>Popular Movies</h1>

    <!--  Search input -->
    <input v-model="searchQuery" placeholder="Search for movies..." class="search-input" />

    <!-- Genre selection -->
    <select v-model="selectedGenre" class="genre-select">
      <option :value="null">All Genres</option>
      <option v-for="genre in genres" :key="genre.id" :value="genre.id">
        {{ genre.name }}
      </option>
    </select>

    <!--  Random movie button -->
    <button @click="pickRandomMovie" class="random-button">Random Movie</button>

    <!--  Transition Group for Smooth Animation -->
    <transition-group name="fade" tag="div" class="movies-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <router-link :to="'/movie/' + movie.id" class="movie-link">
          <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title || 'No Title'" />
          <h3>{{ movie.title || 'Untitled' }}</h3>
        </router-link>

        <p>⭐ {{ movie.vote_average ?? 'N/A' }} | 📅 {{ movie.release_date ?? 'Unknown' }}</p>
        <p class="genres">🎭 {{ getMovieGenres(movie.genre_ids) }}</p>

        <!-- Favorite Button -->
        <button @click="toggleFavorite(movie)" class="favorite-button">
          {{ isFavorite(movie) ? "⭐ Remove" : "⭐ Favorite" }}
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

.search-input,
.genre-select {
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

/*  Random Movie Button */
.random-button {
  background-color: #ff4444;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.random-button:hover {
  background-color: #cc0000;
}

/*  Favorite Button */
.favorite-button {
  background-color: #ff4444;
  border: none;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.favorite-button:hover {
  background-color: #cc0000;
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

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

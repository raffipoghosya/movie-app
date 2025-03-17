<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../services/api'; // ✅ Ճիշտ ուղի

const route = useRoute();
const movie = ref<any | null>(null); // ✅ Նշել "any" կամ "null"՝ տիպի սխալներից խուսափելու համար

// ✅ Բեռնել ֆիլմի մանրամասն տվյալները
const fetchMovieDetails = async () => {
  try {
    const response = await apiClient.get(`/movie/${route.params.id}`, {
      params: { append_to_response: 'credits,videos' }
    });
    console.log("🎬 Movie Details API Response:", response.data); // ✅ Ստուգում API-ից ստացված տվյալները
    movie.value = response.data;
  } catch (error) {
    console.error('❌ Error fetching movie details:', error);
  }
};

// ✅ Ժանրերի ցուցադրումը ապահովող computed property
const movieGenres = computed(() => {
  return movie.value?.genres?.map((g: any) => g.name).join(', ') || 'Unknown';
});

onMounted(fetchMovieDetails);
</script>

<template>
  <div v-if="movie" class="movie-details">
    <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt="Movie Poster" class="poster" />
    <h1>{{ movie.title }}</h1>
    <p>{{ movie.overview }}</p>
    <p>🎭 Genres: {{ movieGenres }}</p>
    <p>⭐ Rating: {{ movie.vote_average ?? 'N/A' }}</p>
    <p>📅 Release Date: {{ movie.release_date ?? 'Unknown' }}</p>

    <h2>Cast</h2>
    <div class="cast">
      <div v-for="actor in movie.credits?.cast?.slice(0, 6) || []" :key="actor.id" class="actor">
        <img v-if="actor.profile_path" :src="'https://image.tmdb.org/t/p/w200' + actor.profile_path" :alt="actor.name" />
        <p>{{ actor.name }}</p>
      </div>
    </div>

    <h2>Trailers</h2>
    <div class="trailers">
      <iframe v-for="video in movie.videos?.results?.slice(0, 3) || []" :key="video.id"
        :src="'https://www.youtube.com/embed/' + video.key" allowfullscreen></iframe>
    </div>
  </div>
</template>

<style scoped>
.movie-details {
  text-align: center;
  padding: 20px;
}

.poster {
  max-width: 300px;
  border-radius: 10px;
}

.cast {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.actor {
  text-align: center;
}

.actor img {
  width: 100px;
  border-radius: 50%;
}

.trailers {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.trailers iframe {
  width: 300px;
  height: 200px;
}
</style>

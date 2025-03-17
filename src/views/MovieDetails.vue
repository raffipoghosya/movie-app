<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "../services/api";

// ✅ Swiper-ի մասերը
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const route = useRoute();
const router = useRouter();
const movie = ref<any>(null); // ✅ Պահպանում ենք ֆիլմի տվյալները

// ✅ Ստուգում ենք, որ ID-ն ճիշտ է
console.log("📌 Current Movie ID:", route.params.id);

// ✅ API հարցումը կատարելու ֆունկցիա
const fetchMovieDetails = async () => {
  console.log("🚀 Fetching movie details for ID:", route.params.id);

  try {
    const response = await apiClient.get(`/movie/${route.params.id}`, {
      params: { append_to_response: "credits,videos" },
    });

    console.log("🎬 Movie Details API Response:", response.data);
    movie.value = response.data;
  } catch (error) {
    console.error("❌ Error fetching movie details:", error);
  }
};

// ✅ Բեռնում ենք ֆիլմի տվյալները, երբ էջը բացվում է
onMounted(fetchMovieDetails);

// ✅ Եթե ID-ն փոխվում է, կրկին բեռնում ենք տվյալները
watch(() => route.params.id, fetchMovieDetails);
</script>

<template>
  <div v-if="movie" class="movie-details">
    <button @click="router.back()" class="back-button">🔙 Back</button>

    <h2>{{ movie.title || "Unknown" }}</h2>
    <img
      v-if="movie.poster_path"
      :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
      alt="Movie Poster"
      class="poster"
    />
    <p>{{ movie.overview || "No description available." }}</p>

    <p v-if="movie.genres">
      🎭 Genres: {{ movie.genres.map((g) => g.name).join(", ") }}
    </p>
    <p v-else>🎭 Genres: Unknown</p>

    <p>⭐ Rating: {{ movie.vote_average ?? "N/A" }}</p>
    <p>📅 Release Date: {{ movie.release_date ?? "Unknown" }}</p>

    <h2>🎥 Trailers</h2>

    <!-- ✅ Swiper Carousel -->
    <swiper
      v-if="movie.videos?.results?.length"
      :modules="[Navigation, Pagination]"
      navigation
      pagination
      class="trailer-carousel"
    >
      <swiper-slide v-for="video in movie.videos.results.slice(0, 5)" :key="video.id">
        <iframe
          :src="'https://www.youtube.com/embed/' + video.key"
          allowfullscreen
        ></iframe>
      </swiper-slide>
    </swiper>

    <h2>🎭 Cast</h2>
    <div class="cast">
      <div v-for="actor in movie.credits?.cast?.slice(0, 6)" :key="actor.id" class="actor">
        <img
          v-if="actor.profile_path"
          :src="'https://image.tmdb.org/t/p/w200' + actor.profile_path"
          :alt="actor.name"
        />
        <p>{{ actor.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-details {
  text-align: center;
  padding: 20px;
}

.back-button {
  background-color: #ffcc00;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.poster {
  max-width: 300px;
  border-radius: 10px;
}

/* ✅ Swiper-ի դիզայն */
.trailer-carousel {
  width: 80%;
  margin: auto;
}

.trailer-carousel iframe {
  width: 100%;
  height: 300px;
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
</style>

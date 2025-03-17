<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// ✅ Փոխում ենք ռեժիմը (Dark ↔ Light)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');

  console.log("🌙 Dark Mode is now:", isDarkMode.value); // ✅ Ստուգում ենք, որ ֆունկցիան կանչվում է
  
  document.documentElement.classList.toggle('dark', isDarkMode.value);
};

// ✅ Սկզբում ստուգում ենք նախորդ theme-ը (localStorage)
onMounted(() => {
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});
</script>

<template>
  <nav>
    <router-link to="/">🏠 Home</router-link>
    <router-link to="/favorites">⭐ Favorites</router-link>
    <router-link to="/top-rated">🎬 Top Rated</router-link>

    <!-- 🌙 Dark Mode Toggle -->
    <button @click="toggleDarkMode">
      {{ isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode" }}
    </button>
  </nav>

  <!-- 🎬 Ավելացնում ենք Page Transitions -->
  <transition name="page" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<style scoped>
/* ✅ Navigation Bar */
nav {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: var(--bg-nav);
  color: var(--text-color);
}

nav a {
  color: inherit;
  text-decoration: none;
  font-size: 18px;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* ✅ Page Transition Animation */
.page-enter-active, .page-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.page-enter, .page-leave-to {
  opacity: 0;
}

/* ✅ Light / Dark Mode Styles */
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --bg-nav: #f0f0f0;
}

.dark {
  --bg-color: #121212;
  --text-color: #ffffff;
  --bg-nav: #222222;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
}

/* 🌙 Dark Mode Toggle Button */
button {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>

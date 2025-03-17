<template>
  <nav>
    <router-link to="/">🏠 Home</router-link>
    <router-link to="/favorites">⭐ Favorites</router-link>
    <router-link to="/top-rated">🎬 Top Rated</router-link> <!-- ✅ Ավելացրինք -->
  </nav>

  <router-view></router-view>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
  background-color: #222;
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

nav a:hover {
  text-decoration: underline;
}
</style>

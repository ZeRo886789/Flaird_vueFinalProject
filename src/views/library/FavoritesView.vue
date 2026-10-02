<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import FavoriteCard from '../../components/cards/FavoriteCard.vue'

const auth = useAuthStore()
const library = useLibraryStore()

const userFavorites = computed(() => library.favorites.filter(f => f.startsWith(`${auth.currentUser?.id}:`)))

const favoriteTitles = computed(() => {
  const allTitles = [...anime, ...manga]
  return userFavorites.value.map(fav => {
    const titleId = fav.split(':')[1]
    return allTitles.find(t => t.id === Number(titleId))
  }).filter(Boolean)
})
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>My Favorites</h1>
        <p class="page-header__description">Your saved titles in one focused collection.</p>
      </div>
    </header>

    <div v-if="favoriteTitles.length === 0" class="empty-state">
      <h3>No Favorites Yet</h3>
      <p>You haven't added any titles to your favorites.</p>
      <RouterLink to="/anime" class="btn btn--primary">Discover Anime</RouterLink>
      <RouterLink to="/manga" class="btn btn--outline" style="margin-left: 12px;">Discover Manga</RouterLink>
    </div>

    <div v-else class="media-grid">
      <FavoriteCard v-for="title in favoriteTitles" :key="title.id" :title="title" />
    </div>
  </section>
</template>
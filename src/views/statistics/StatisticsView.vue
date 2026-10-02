<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { useSocialStore } from '../../stores/socialStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import StatCard from '../../components/statistics/StatCard.vue'
import GenreChart from '../../components/statistics/GenreChart.vue'
import ProgressChart from '../../components/statistics/ProgressChart.vue'

const auth = useAuthStore()
const library = useLibraryStore()
const social = useSocialStore()

const userLibrary = computed(() => library.currentUserItems)
const userFavorites = computed(() => library.favorites.filter(f => f.startsWith(`${auth.currentUser?.id}:`)))
const userRatings = computed(() => library.ratings.filter(r => r.key.startsWith(`${auth.currentUser?.id}:`)))

const stats = computed(() => {
  const lib = userLibrary.value
  const animeLib = lib.filter(x => x.type === 'anime')
  const mangaLib = lib.filter(x => x.type === 'manga')

  const totalEpisodes = animeLib.reduce((sum, x) => sum + (x.progress || 0), 0)
  const totalChapters = mangaLib.reduce((sum, x) => sum + (x.progress || 0), 0)

  const avgRating = userRatings.value.length > 0
    ? (userRatings.value.reduce((sum, r) => sum + r.rating, 0) / userRatings.value.length).toFixed(1)
    : '0.0'

  const completedCount = lib.filter(x => x.status === 'completed').length
  const totalCount = lib.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return {
    animeCompleted: lib.filter(x => x.status === 'completed' && x.type === 'anime').length,
    animeWatching: lib.filter(x => x.status === 'watching').length,
    mangaCompleted: lib.filter(x => x.status === 'completed' && x.type === 'manga').length,
    mangaReading: lib.filter(x => x.status === 'reading').length,
    totalTitles: totalCount,
    avgRating,
    totalEpisodes,
    totalChapters,
    completionRate,
    favorites: userFavorites.value.length,
    reviews: social.reviews.filter(r => r.userId === auth.currentUser?.id).length
  }
})

const genreData = computed(() => {
  const lib = userLibrary.value
  const allTitles = [...anime, ...manga]
  const genreCount = {}

  lib.forEach(item => {
    const title = allTitles.find(t => t.id === item.titleId)
    if (title) {
      title.genres.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1
      })
    }
  })

  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([genre, count]) => ({ genre, count }))
})

const statusData = computed(() => {
  const lib = userLibrary.value
  const statuses = ['planning', 'watching', 'reading', 'completed', 'paused', 'dropped']
  return statuses.map(s => ({
    status: s,
    count: lib.filter(x => x.status === s).length,
    label: s.charAt(0).toUpperCase() + s.slice(1)
  })).filter(s => s.count > 0)
})

const typeData = computed(() => {
  const lib = userLibrary.value
  return [
    { type: 'anime', count: lib.filter(x => x.type === 'anime').length },
    { type: 'manga', count: lib.filter(x => x.type === 'manga').length }
  ].filter(t => t.count > 0)
})
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Statistics</h1>
        <p class="page-header__description">Personal analytics for completion, ratings, genres, episodes, and chapters.</p>
      </div>
    </header>

    <div v-if="stats.totalTitles === 0" class="empty-state">
      <h3>No Data Yet</h3>
      <p>Start tracking titles to see your statistics.</p>
      <RouterLink to="/anime" class="btn btn--primary">Browse Anime</RouterLink>
      <RouterLink to="/manga" class="btn btn--outline" style="margin-left: 12px;">Browse Manga</RouterLink>
    </div>

    <div v-else class="statistics-content">
      <div class="stats-grid">
        <StatCard label="Anime Completed" :value="stats.animeCompleted" icon="✅" />
        <StatCard label="Anime Watching" :value="stats.animeWatching" icon="📺" />
        <StatCard label="Manga Completed" :value="stats.mangaCompleted" icon="🏁" />
        <StatCard label="Manga Reading" :value="stats.mangaReading" icon="📖" />
        <StatCard label="Total Titles" :value="stats.totalTitles" icon="📚" />
        <StatCard label="Average Rating" :value="stats.avgRating" icon="★" />
        <StatCard label="Episodes Watched" :value="stats.totalEpisodes" icon="▶" />
        <StatCard label="Chapters Read" :value="stats.totalChapters" icon="📄" />
        <StatCard label="Favorites" :value="stats.favorites" icon="♥" />
        <StatCard label="Reviews Written" :value="stats.reviews" icon="✍" />
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3>Library Completion</h3>
          <ProgressChart :percentage="stats.completionRate" label="Completed" />
        </div>

        <div class="chart-card">
          <h3>By Type</h3>
          <ProgressChart :data="typeData" :max="Math.max(...typeData.map(t => t.count))" />
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card full-width">
          <h3>Favorite Genres</h3>
          <GenreChart :data="genreData" />
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card full-width">
          <h3>Library by Status</h3>
          <ProgressChart :data="statusData" :max="Math.max(...statusData.map(s => s.count))" />
        </div>
      </div>
    </div>
  </section>
</template>
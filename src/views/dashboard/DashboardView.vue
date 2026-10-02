<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { useSocialStore } from '../../stores/socialStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import AnimeCard from '../../components/cards/AnimeCard.vue'
import MangaCard from '../../components/cards/MangaCard.vue'
import ContinueCard from '../../components/cards/ContinueCard.vue'
import StatCard from '../../components/statistics/StatCard.vue'
import ActivityCard from '../../components/social/ActivityCard.vue'

const auth = useAuthStore()
const library = useLibraryStore()
const social = useSocialStore()

const userLibrary = computed(() => [...library.currentUserItems])
const userFavorites = computed(() => [...library.favorites].filter(f => f.startsWith(`${auth.currentUser?.id}:`)))

const stats = computed(() => {
  const lib = userLibrary.value
  return {
    animeWatching: lib.filter(x => x.status === 'watching').length,
    animeCompleted: lib.filter(x => x.status === 'completed' && x.type === 'anime').length,
    mangaReading: lib.filter(x => x.status === 'reading').length,
    mangaCompleted: lib.filter(x => x.status === 'completed' && x.type === 'manga').length,
    totalTitles: lib.length,
    favorites: userFavorites.value.length,
    episodesWatched: lib.filter(x => x.type === 'anime').reduce((sum, x) => sum + (x.progress || 0), 0),
    chaptersRead: lib.filter(x => x.type === 'manga').reduce((sum, x) => sum + (x.progress || 0), 0),
    avgRating: lib.length > 0
      ? (lib.reduce((sum, x) => {
          const rating = library.ratings.find(r => r.key === `${auth.currentUser.id}:${x.titleId}`)
          return sum + (rating?.rating || 0)
        }, 0) / lib.length).toFixed(1)
      : '0.0'
  }
})

const continueWatching = computed(() => {
  const watching = [...userLibrary.value].filter(x => x.status === 'watching' && x.type === 'anime')
  return watching.map(item => {
    const title = anime.find(a => a.id === item.titleId)
    return { item, title }
  }).filter(x => x.title).slice(0, 4)
})

const continueReading = computed(() => {
  const reading = [...userLibrary.value].filter(x => x.status === 'reading' && x.type === 'manga')
  return reading.map(item => {
    const title = manga.find(a => a.id === item.titleId)
    return { item, title }
  }).filter(x => x.title).slice(0, 4)
})

const recentlyAdded = computed(() => {
  return [...userLibrary.value].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4).map(item => {
    const title = [...anime, ...manga].find(a => a.id === item.titleId)
    return { item, title }
  }).filter(x => x.title)
})

const recentActivity = computed(() => {
  return [...social.activities]
    .filter(a => a.userId === auth.currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">Your dashboard</div>
        <h1>Welcome back, {{ auth.currentUser?.username }} 👋</h1>
        <p class="page-header__description">Here's what's happening with your library.</p>
      </div>
    </header>

    <div class="stats-grid">
      <StatCard label="Anime Watching" :value="stats.animeWatching" icon="📺" />
      <StatCard label="Anime Completed" :value="stats.animeCompleted" icon="✅" />
      <StatCard label="Manga Reading" :value="stats.mangaReading" icon="📖" />
      <StatCard label="Manga Completed" :value="stats.mangaCompleted" icon="🏁" />
      <StatCard label="Total Titles" :value="stats.totalTitles" icon="📚" />
      <StatCard label="Favorites" :value="stats.favorites" icon="♥" />
      <StatCard label="Episodes Watched" :value="stats.episodesWatched" icon="▶" />
      <StatCard label="Chapters Read" :value="stats.chaptersRead" icon="📄" />
      <StatCard label="Avg Rating" :value="stats.avgRating" icon="★" />
    </div>

    <div class="dashboard-sections">
      <div class="dashboard-section" v-if="continueWatching.length > 0">
        <div class="section-header">
          <h2>Continue Watching</h2>
        </div>
        <div class="continue-grid">
          <ContinueCard
            v-for="c in continueWatching"
            :key="c.item.id"
            :title="c.title"
            :progress="c.item.progress"
            :total="c.title.episodes"
            :type="'anime'"
          />
        </div>
      </div>

      <div class="dashboard-section" v-if="continueReading.length > 0">
        <div class="section-header">
          <h2>Continue Reading</h2>
        </div>
        <div class="continue-grid">
          <ContinueCard
            v-for="c in continueReading"
            :key="c.item.id"
            :title="c.title"
            :progress="c.item.progress"
            :total="c.title.chapters"
            :type="'manga'"
          />
        </div>
      </div>

      <div class="dashboard-section" v-if="recentlyAdded.length > 0">
        <div class="section-header">
          <h2>Recently Added</h2>
          <RouterLink to="/library" class="btn btn--ghost btn--sm">View all</RouterLink>
        </div>
        <div class="media-grid">
          <template v-for="r in recentlyAdded" :key="r.item.id">
            <AnimeCard v-if="r.title.type === 'anime'" :item="r.title" />
            <MangaCard v-else-if="r.title.type === 'manga'" :item="r.title" />
          </template>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2>Recent Activity</h2>
        </div>
        <div class="activity-list">
          <ActivityCard
            v-for="activity in recentActivity"
            :key="activity.id"
            :activity="activity"
            :user="auth.currentUser"
          />
          <div v-if="recentActivity.length === 0" class="empty-state">
            <p>No recent activity. Start tracking titles to see your activity here!</p>
            <RouterLink to="/anime" class="btn btn--primary">Browse Anime</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
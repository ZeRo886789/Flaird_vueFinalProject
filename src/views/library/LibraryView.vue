<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import AnimeCard from '../../components/cards/AnimeCard.vue'
import MangaCard from '../../components/cards/MangaCard.vue'
import ContinueCard from '../../components/cards/ContinueCard.vue'
import ProgressBar from '../../components/common/ProgressBar.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'

const auth = useAuthStore()
const library = useLibraryStore()

const userLibrary = computed(() => library.currentUserItems.filter(item => getTitle(item)))
const statusFilter = ref('all')

const getTitle = (item) => {
  const allTitles = [...anime, ...manga]
  return allTitles.find(t => t.id === item.titleId)
}

const filteredLibrary = computed(() => {
  if (statusFilter.value === 'all') return userLibrary.value
  return userLibrary.value.filter(x => x.status === statusFilter.value)
})

const groupedLibrary = computed(() => {
  const groups = {}
  const statuses = ['watching', 'reading', 'planning', 'completed', 'paused', 'dropped']
  statuses.forEach(s => groups[s] = [])
  filteredLibrary.value.forEach(item => {
    if (groups[item.status]) groups[item.status].push(item)
  })
  return groups
})

const statusLabels = {
  watching: 'Watching',
  reading: 'Reading',
  planning: 'Planning',
  completed: 'Completed',
  paused: 'Paused',
  dropped: 'Dropped'
}
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>My Library</h1>
        <p class="page-header__description">All tracked titles, statuses, and progress live here.</p>
      </div>
    </header>

    <div class="library-filters">
      <button
        v-for="status in ['all', 'watching', 'reading', 'planning', 'completed', 'paused', 'dropped']"
        :key="status"
        class="btn btn--ghost btn--sm"
        :class="{ active: statusFilter === status }"
        @click="statusFilter = status"
      >
        {{ status === 'all' ? 'All' : statusLabels[status] }}
      </button>
    </div>

    <div v-if="userLibrary.length === 0" class="empty-state">
      <h3>Your Library Is Empty</h3>
      <p>Start tracking anime or manga to build your collection.</p>
      <RouterLink to="/anime" class="btn btn--primary">Explore Titles</RouterLink>
    </div>

    <div v-else class="library-content">
      <div v-for="status in ['watching', 'reading', 'planning', 'completed', 'paused', 'dropped']" :key="status" class="library-status-section">
        <div v-if="groupedLibrary[status] && groupedLibrary[status].length > 0" class="library-status-header">
          <h2>{{ statusLabels[status] }} ({{ groupedLibrary[status].length }})</h2>
        </div>
        <div v-if="groupedLibrary[status] && groupedLibrary[status].length > 0" class="library-grid">
          <div v-for="item in groupedLibrary[status]" :key="item.id" class="library-item">
            <div class="library-item__cover">
              <img :src="getTitle(item)?.cover" :alt="getTitle(item)?.title" loading="lazy" decoding="async" />
            </div>
            <div class="library-item__info">
              <RouterLink :to="getTitle(item).type === 'anime' ? '/anime/' + getTitle(item).id : '/manga/' + getTitle(item).id" class="library-item__title">
                {{ getTitle(item)?.title }}
              </RouterLink>
              <div class="library-item__meta">
                <StatusBadge :status="item.status" />
                <span>{{ getTitle(item)?.type === 'anime' ? 'Anime' : 'Manga' }}</span>
              </div>
              <ProgressBar
                :current="item.progress"
                :total="getTitle(item).type === 'anime' ? getTitle(item).episodes : getTitle(item).chapters"
                :show-label="true"
                size="sm"
              />
              <div class="library-item__percent">{{ getTitle(item) ? Math.round((item.progress / (getTitle(item).type === 'anime' ? getTitle(item).episodes : getTitle(item).chapters)) * 100) : 0 }}%</div>
            </div>
            <RouterLink :to="'/library/progress'" class="btn btn--ghost btn--sm library-item__edit">Edit</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
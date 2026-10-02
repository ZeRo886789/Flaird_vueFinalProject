<script setup>
import { ref, computed } from 'vue'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import { useAuthStore } from '../../stores/authStore'
import SearchBar from '../../components/common/SearchBar.vue'
import AnimeCard from '../../components/cards/AnimeCard.vue'
import MangaCard from '../../components/cards/MangaCard.vue'
import UserCard from '../../components/social/UserCard.vue'

const q = ref('')
const activeTab = ref('all')

const auth = useAuthStore()

const allTitles = computed(() => [...anime, ...manga])

const filteredAnime = computed(() => {
  if (!q.value) return []
  const query = q.value.toLowerCase().trim()
  return [...anime].filter(x =>
    x.title.toLowerCase().includes(query) ||
    x.genres.some(g => g.toLowerCase().includes(query))
  )
})

const filteredManga = computed(() => {
  if (!q.value) return []
  const query = q.value.toLowerCase().trim()
  return [...manga].filter(x =>
    x.title.toLowerCase().includes(query) ||
    x.genres.some(g => g.toLowerCase().includes(query))
  )
})

const filteredUsers = computed(() => {
  if (!q.value) return []
  const query = q.value.toLowerCase().trim()
  return [...auth.users].filter(u =>
    u.username.toLowerCase().includes(query) ||
    u.name.toLowerCase().includes(query)
  )
})

const hasResults = computed(() =>
  filteredAnime.value.length > 0 ||
  filteredManga.value.length > 0 ||
  filteredUsers.value.length > 0
)
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Search</h1>
        <p class="page-header__description">Global discovery for anime, manga, users, and community content.</p>
      </div>
    </header>

    <div class="search-page">
      <SearchBar v-model="q" placeholder="Search FLAIRD..." class="search-page__bar" />

      <div v-if="q" class="search-tabs">
        <button
          v-for="tab in ['all', 'anime', 'manga', 'users']"
          :key="tab"
          class="search-tab"
          :class="{ active: activeTab === tab }"
          @click="activeTab = tab"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <span class="search-tab__count">
            {{ tab === 'all' ? (filteredAnime.length + filteredManga.length + filteredUsers.length) :
               tab === 'anime' ? filteredAnime.length :
               tab === 'manga' ? filteredManga.length : filteredUsers.length }}
          </span>
        </button>
      </div>

      <div v-if="!q" class="search-empty">
        <p>Start typing to search across anime, manga, and users.</p>
      </div>

      <div v-if="q && (activeTab === 'all' || activeTab === 'anime')" class="search-results">
        <h3 v-if="filteredAnime.length > 0" class="results-section-title">Anime ({{ filteredAnime.length }})</h3>
        <div v-if="filteredAnime.length > 0" class="media-grid">
          <AnimeCard v-for="item in filteredAnime" :key="item.id" :item="item" :show-actions="true" />
        </div>
      </div>

      <div v-if="q && (activeTab === 'all' || activeTab === 'manga')" class="search-results">
        <h3 v-if="filteredManga.length > 0" class="results-section-title">Manga ({{ filteredManga.length }})</h3>
        <div v-if="filteredManga.length > 0" class="media-grid">
          <MangaCard v-for="item in filteredManga" :key="item.id" :item="item" :show-actions="true" />
        </div>
      </div>

      <div v-if="q && (activeTab === 'all' || activeTab === 'users')" class="search-results">
        <h3 v-if="filteredUsers.length > 0" class="results-section-title">Users ({{ filteredUsers.length }})</h3>
        <div v-if="filteredUsers.length > 0" class="users-list">
          <UserCard
            v-for="user in filteredUsers"
            :key="user.id"
            :user="user"
            :show-stats="true"
          />
        </div>
      </div>

      <div v-if="q && !hasResults" class="empty-state">
        <h3>No results found</h3>
        <p>Try different keywords or check your spelling.</p>
      </div>
    </div>
  </section>
</template>

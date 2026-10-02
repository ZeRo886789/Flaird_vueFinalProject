<script setup>
import { ref, computed } from 'vue'
import { anime } from '../../data/anime'
import { genres } from '../../data/genres'
import { resolveAnimeCover } from '../../utils/mediaCovers'
import AnimeCard from '../../components/cards/AnimeCard.vue'
import SearchBar from '../../components/common/SearchBar.vue'

const animeBackground = resolveAnimeCover("Frieren: Beyond Journey's End")

const q = ref('')
const statusFilter = ref('all')
const genreFilter = ref('all')
const sortBy = ref('rating')

const filtered = computed(() => {
  let result = [...anime]

  if (q.value) {
    const query = q.value.toLowerCase().trim()
    result = result.filter(x =>
      x.title.toLowerCase().includes(query) ||
      x.genres.some(g => g.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(x => x.status === statusFilter.value)
  }

  if (genreFilter.value !== 'all') {
    result = result.filter(x => x.genres.includes(genreFilter.value))
  }

  switch (sortBy.value) {
    case 'popular':
    case 'rating':
      result.sort((a, b) => b.score - a.score)
      break
    case 'az':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'year':
      result.sort((a, b) => b.year - a.year)
      break
  }

  return result
})

const allGenres = computed(() => [...new Set(anime.flatMap(a => a.genres))].sort())

const hasActiveFilters = computed(() => {
  return q.value || statusFilter.value !== 'all' || genreFilter.value !== 'all'
})

function clearFilters() {
  q.value = ''
  statusFilter.value = 'all'
  genreFilter.value = 'all'
  sortBy.value = 'rating'
}
</script>

<template>
  <section
    class="page-container catalog-page catalog-page--anime"
    :style="{ '--catalog-bg': `url('${animeBackground}')` }"
  >
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">Catalog</div>
        <h1>Anime</h1>
        <p class="page-header__description">Browse, filter, and add titles to your personal library.</p>
      </div>
      <div class="catalog-header__count">{{ filtered.length }} titles</div>
    </header>

    <div class="catalog-toolbar">
      <SearchBar v-model="q" placeholder="Search anime..." />
      <div class="catalog-filters">
        <select v-model="statusFilter" class="select">
          <option value="all">All Status</option>
          <option value="Finished Airing">Finished Airing</option>
          <option value="Currently Airing">Currently Airing</option>
          <option value="Not yet aired">Not yet aired</option>
        </select>
        <select v-model="genreFilter" class="select">
          <option value="all">All Genres</option>
          <option v-for="g in allGenres" :key="g" :value="g">{{ g }}</option>
        </select>
        <select v-model="sortBy" class="select">
          <option value="rating">Rating</option>
          <option value="az">A-Z</option>
          <option value="year">Year</option>
        </select>
        <button
          v-if="hasActiveFilters"
          class="btn btn--ghost btn--sm"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
    </div>

    <div class="media-grid">
      <AnimeCard
        v-for="item in filtered"
        :key="item.id"
        :item="item"
        :show-actions="true"
      />
    </div>

    <div
      v-if="filtered.length === 0"
      class="empty-state"
    >
      <h3>No anime found</h3>
      <p>We couldn't find anything matching your current search and filters.</p>
      <button v-if="hasActiveFilters" class="btn btn--primary" @click="clearFilters">
        Clear filters
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '../../stores/libraryStore'
import RatingStars from '../common/RatingStars.vue'
import GenreBadge from '../common/GenreBadge.vue'
import StatusBadge from '../common/StatusBadge.vue'

const props = defineProps({
  item: { type: Object, required: true },
  showActions: { type: Boolean, default: false }
})

const router = useRouter()
const library = useLibraryStore()

const isInLibrary = computed(() =>
  library.currentUserItems.some(x => x.titleId === props.item.id)
)
const isFavorite = computed(() => library.isFavorite(props.item.id))

function goToDetails() {
  router.push({ name: 'anime-details', params: { id: props.item.id } })
}

function toggleFavorite(e) {
  e.stopPropagation()
  library.toggleFavorite(props.item.id)
}

function addToLibrary(e) {
  e.stopPropagation()
  library.addToLibrary(props.item, 'planning')
}
</script>

<template>
  <article class="media-card" @click="goToDetails">
    <div class="media-card__image-wrapper">
      <img class="media-card__image" :src="item.cover" :alt="item.title" loading="lazy" decoding="async"
        @error="$event.target.classList.add('media-card__image_broken')" />
      <button v-if="showActions" class="media-card__favorite" @click="toggleFavorite" :class="{ active: isFavorite }" aria-label="Toggle favorite">
        {{ isFavorite ? '♥' : '♡' }}
      </button>
    </div>
    <div class="media-card__body">
      <div class="media-card__title">{{ item.title }}</div>
      <div class="media-card__meta">
        <RatingStars :rating="item.score" :max="5" :readonly="true" size="sm" />
        <span>{{ item.episodes }} eps</span>
      </div>
      <div class="media-card__genres">
        <GenreBadge v-for="g in item.genres.slice(0, 3)" :key="g" :genre="g" size="sm" />
        <span v-if="item.genres.length > 3" class="genre-more">+{{ item.genres.length - 3 }}</span>
      </div>
      <div class="media-card__badges">
        <StatusBadge :status="item.status" size="sm" />
      </div>
      <div v-if="showActions" class="media-card__actions">
        <button v-if="!isInLibrary" class="btn btn--primary btn--sm" @click="addToLibrary">Add to Library</button>
        <span v-else class="btn btn--ghost btn--sm" style="cursor: default;">In Library</span>
      </div>
    </div>
  </article>
</template>

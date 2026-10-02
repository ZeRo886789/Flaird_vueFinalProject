<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLibraryStore } from '../../stores/libraryStore'
import RatingStars from '../common/RatingStars.vue'
import GenreBadge from '../common/GenreBadge.vue'

const props = defineProps({
  title: { type: Object, required: true }
})

const router = useRouter()
const library = useLibraryStore()

const routeName = computed(() =>
  props.title.type === 'anime' ? 'anime-details' : 'manga-details'
)

function goToDetails() {
  router.push({ name: routeName.value, params: { id: props.title.id } })
}

function removeFavorite(e) {
  e.stopPropagation()
  library.toggleFavorite(props.title.id)
}
</script>

<template>
  <article class="favorite-card" @click="goToDetails">
    <div class="favorite-card__cover">
      <img class="favorite-card__image" :src="title.cover" :alt="title.title" loading="lazy" decoding="async"
        @error="$event.target.classList.add('favorite-card__image_broken')" />
      <button class="favorite-card__remove" @click="removeFavorite" aria-label="Remove from favorites">×</button>
    </div>
    <div class="favorite-card__content">
      <h3 class="favorite-card__title">{{ title.title }}</h3>
      <div class="favorite-card__meta">
        <RatingStars :rating="title.score" :max="5" :readonly="true" size="sm" />
        <span>{{ title.type === 'anime' ? title.episodes + ' eps' : title.chapters + ' ch' }}</span>
      </div>
      <div class="favorite-card__genres">
        <GenreBadge v-for="g in title.genres.slice(0, 3)" :key="g" :genre="g" size="sm" />
      </div>
    </div>
  </article>
</template>

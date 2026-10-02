<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  release: { type: Object, required: true }
})

const router = useRouter()

const episodeOrChapter = computed(() => {
  return props.release.type === 'anime'
    ? `Episode ${props.release.episode}`
    : `Chapter ${props.release.chapter}`
})

function goToDetails() {
  if (!props.release.titleId) return
  router.push({
    name: props.release.type === 'anime' ? 'anime-details' : 'manga-details',
    params: { id: props.release.titleId }
  })
}
</script>

<template>
  <article class="release-card" @click="goToDetails">
    <img class="release-card__cover" :src="release.cover" :alt="release.title" loading="lazy" decoding="async"
      @error="$event.target.classList.add('release-card__cover_broken')" />
    <div class="release-card__info">
      <div class="release-card__title">{{ release.title }}</div>
      <div class="release-card__meta">
        <span class="release-card__type">{{ release.type === 'anime' ? 'Anime' : 'Manga' }}</span>
        <span class="release-card__episode">{{ episodeOrChapter }}</span>
      </div>
      <div class="release-card__time">{{ release.time }}</div>
    </div>
    <span class="release-card__status">{{ release.status }}</span>
  </article>
</template>

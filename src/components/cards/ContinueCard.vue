<script setup>
import { useRouter } from 'vue-router'
import ProgressBar from '../common/ProgressBar.vue'

const props = defineProps({
  title: { type: Object, required: true },
  progress: { type: Number, required: true },
  total: { type: Number, required: true },
  type: { type: String, required: true }
})

const router = useRouter()

function goToDetails() {
  router.push({
    name: props.type === 'anime' ? 'anime-details' : 'manga-details',
    params: { id: props.title.id }
  })
}
</script>

<template>
  <article class="continue-card" @click="goToDetails">
    <div class="continue-card__cover">
      <img class="continue-card__image" :src="title.cover" :alt="title.title" loading="lazy" decoding="async"
        @error="$event.target.classList.add('continue-card__image_broken')" />
    </div>
    <div class="continue-card__content">
      <h3 class="continue-card__title">{{ title.title }}</h3>
      <div class="continue-card__progress">
        <ProgressBar :current="progress" :total="total" :show-label="true" size="sm" />
      </div>
      <div class="continue-card__action">Continue {{ type === 'anime' ? 'Watching' : 'Reading' }} →</div>
    </div>
  </article>
</template>

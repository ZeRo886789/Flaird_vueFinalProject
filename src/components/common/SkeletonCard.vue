<script setup>
defineProps({
  type: { type: String, default: 'media' } // media, list, card
})
</script>

<template>
  <div v-if="type === 'media'" class="skeleton-card skeleton-card--media">
    <div class="skeleton-card__image"></div>
    <div class="skeleton-card__body">
      <div class="skeleton-card__title"></div>
      <div class="skeleton-card__meta"></div>
      <div class="skeleton-card__meta"></div>
    </div>
  </div>

  <div v-else-if="type === 'list'" class="skeleton-card skeleton-card--list">
    <div class="skeleton-card__avatar"></div>
    <div class="skeleton-card__body">
      <div class="skeleton-card__title"></div>
      <div class="skeleton-card__meta"></div>
    </div>
  </div>

  <div v-else class="skeleton-card skeleton-card--card">
    <div class="skeleton-card__image"></div>
    <div class="skeleton-card__body">
      <div class="skeleton-card__title"></div>
      <div class="skeleton-card__text"></div>
      <div class="skeleton-card__text"></div>
    </div>
  </div>
</template>
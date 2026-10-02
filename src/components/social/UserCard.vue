<script setup>
defineProps({
  user: { type: Object, required: true },
  showStats: { type: Boolean, default: false },
  stats: { type: Object, default: () => ({}) }
})

function getAvatarInitial(name) {
  return name?.charAt(0)?.toUpperCase() || 'U'
}
</script>

<template>
  <div class="user-card" :class="{ 'user-card--with-stats': showStats }">
    <div class="user-card__avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
      <span v-else class="avatar-placeholder">{{ getAvatarInitial(user.name) }}</span>
    </div>
    <div class="user-card__info">
      <h3 class="user-card__name">{{ user.name }}</h3>
      <p class="user-card__username">@{{ user.username }}</p>
      <p v-if="user.bio" class="user-card__bio">{{ user.bio }}</p>
    </div>

    <div v-if="showStats" class="user-card__stats">
      <div class="user-stat">
        <span class="user-stat__value">{{ stats.animeCompleted + stats.mangaCompleted }}</span>
        <span class="user-stat__label">Completed</span>
      </div>
      <div class="user-stat">
        <span class="user-stat__value">{{ stats.animeWatching + stats.mangaReading }}</span>
        <span class="user-stat__label">Watching/Reading</span>
      </div>
      <div class="user-stat">
        <span class="user-stat__value">{{ stats.favorites }}</span>
        <span class="user-stat__label">Favorites</span>
      </div>
      <div class="user-stat">
        <span class="user-stat__value">{{ stats.avgRating }}</span>
        <span class="user-stat__label">Avg Rating</span>
      </div>
    </div>
  </div>
</template>
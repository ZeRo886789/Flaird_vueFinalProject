<script setup>
defineProps({
  activity: { type: Object, required: true },
  title: { type: Object, default: null },
  user: { type: Object, default: null }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

const activityIcons = {
  'completed': '✅',
  'rated': '★',
  'added': '📚',
  'reviewed': '✍',
  'favorited': '♥'
}

const activityMessages = {
  'completed': 'completed',
  'rated': 'rated',
  'added': 'added to library',
  'reviewed': 'reviewed',
  'favorited': 'favorited'
}
</script>

<template>
  <article class="activity-card">
    <div class="activity-card__icon">{{ activityIcons[activity.type] || '🔔' }}</div>
    <div class="activity-card__content">
      <div class="activity-card__header">
        <span class="activity-card__username">{{ user?.name || activity.userId }}</span>
        <span class="activity-card__action">{{ activityMessages[activity.type] || activity.type }}</span>
        <span class="activity-card__title" v-if="title">{{ title.title }}</span>
      </div>
      <time class="activity-card__time">{{ formatDate(activity.createdAt) }}</time>
    </div>
    <div v-if="activity.type === 'rated' && activity.rating" class="activity-card__rating">
      <span v-for="i in 5" :key="i" class="activity-star" :class="{ filled: i <= activity.rating }">★</span>
    </div>
  </article>
</template>
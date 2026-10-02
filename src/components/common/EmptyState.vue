<script setup>
defineProps({
  title: { type: String, default: 'Nothing here' },
  message: { type: String, default: 'No data to display.' },
  actionText: { type: String, default: '' },
  actionLink: { type: String, default: '' },
  icon: { type: String, default: '' }
})
</script>

<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-state__icon">{{ icon }}</div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__message">{{ message }}</p>
    <RouterLink v-if="actionText && actionLink" :to="actionLink" class="btn btn--primary empty-state__action">{{ actionText }}</RouterLink>
    <slot />
  </div>
</template>
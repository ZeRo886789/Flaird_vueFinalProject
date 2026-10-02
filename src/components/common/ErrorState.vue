<script setup>
defineProps({
  title: { type: String, default: 'Something Went Wrong' },
  message: { type: String, default: 'We couldn\'t load this content.' },
  actionText: { type: String, default: 'Try Again' },
  onRetry: { type: Function, default: () => {} }
})
</script>

<template>
  <div class="error-state">
    <div class="error-state__icon">⚠</div>
    <h3 class="error-state__title">{{ title }}</h3>
    <p class="error-state__message">{{ message }}</p>
    <button class="btn btn--primary error-state__action" @click="onRetry">{{ actionText }}</button>
    <slot />
  </div>
</template>
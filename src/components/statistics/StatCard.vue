<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: '' }
})
</script>

<template>
  <article class="stat-card">
    <div class="stat-card__icon" v-if="icon">{{ icon }}</div>
    <div class="stat-card__content">
      <div class="stat-card__label">{{ label }}</div>
      <div class="stat-card__value">{{ value }}</div>
    </div>
  </article>
</template>
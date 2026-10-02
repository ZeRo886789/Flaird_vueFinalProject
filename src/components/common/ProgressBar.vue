<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 100 },
  showLabel: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.min(100, Math.max(0, Math.round((props.current / props.total) * 100)))
})
</script>

<template>
  <div class="progress" :class="`progress--${size}`" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100">
    <div class="progress__bar" :style="{ width: `${percentage}%` }"></div>
    <span v-if="showLabel" class="progress__label">{{ current }} / {{ total }} ({{ percentage }}%)</span>
  </div>
</template>

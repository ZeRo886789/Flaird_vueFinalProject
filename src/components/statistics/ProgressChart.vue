<script setup>
defineProps({
  data: { type: Array, default: () => [] },
  max: { type: Number, default: 100 },
  percentage: { type: Number, default: null },
  label: { type: String, default: '' }
})
</script>

<template>
  <div class="progress-chart">
    <div v-if="percentage !== null" class="progress-chart__radial">
      <svg class="progress-chart__svg" viewBox="0 0 100 100">
        <circle
          class="progress-chart__bg"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--border)"
          stroke-width="8"
        />
        <circle
          class="progress-chart__fg"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--primary)"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="283"
          :stroke-dashoffset="283 - (283 * percentage / 100)"
          style="transform: rotate(-90deg); transform-origin: 50px 50px;"
        />
      </svg>
      <div class="progress-chart__center">
        <span class="progress-chart__percentage">{{ percentage }}%</span>
        <span class="progress-chart__label" v-if="label">{{ label }}</span>
      </div>
    </div>

    <div v-else class="progress-chart__bars">
      <div v-for="item in data" :key="item.type || item.status" class="progress-chart__bar">
        <div class="progress-chart__bar-label">{{ item.label || item.type || item.status }}</div>
        <div class="progress-chart__bar-wrapper">
          <div
            class="progress-chart__bar-fill"
            :style="{ width: `${(item.count / max) * 100}%` }"
          ></div>
        </div>
        <span class="progress-chart__bar-count">{{ item.count }}</span>
      </div>
    </div>
  </div>
</template>
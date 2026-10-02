<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const maxCount = computed(() =>
  Math.max(
    ...props.data.map(item => item.count),
    1
  )
)
</script>

<template>
  <div class="genre-chart">
    <div
      v-for="item in data"
      :key="item.genre"
      class="genre-chart__bar"
    >
      <div class="genre-chart__label">{{ item.genre }}</div>
      <div class="genre-chart__bar-wrapper">
        <div
          class="genre-chart__fill"
          :style="{ width: `${(item.count / maxCount) * 100}%` }"
        ></div>
      </div>
      <span class="genre-chart__count">{{ item.count }}</span>
    </div>
  </div>
</template>

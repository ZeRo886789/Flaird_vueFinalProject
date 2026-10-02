<script setup>
defineProps({
  status: { type: String, required: true },
  size: { type: String, default: 'md' } // sm, md, lg
})

const statusClasses = {
  'watching': 'badge--watching',
  'reading': 'badge--reading',
  'planning': 'badge--planning',
  'completed': 'badge--completed',
  'paused': 'badge--paused',
  'dropped': 'badge--dropped',
  'Finished Airing': 'badge--finished',
  'Currently Airing': 'badge--airing',
  'Not yet aired': 'badge--not-aired',
  'Publishing': 'badge--publishing',
  'Finished': 'badge--finished',
  'Hiatus': 'badge--hiatus'
}

const statusLabels = {
  'watching': 'Watching',
  'reading': 'Reading',
  'planning': 'Planning',
  'completed': 'Completed',
  'paused': 'Paused',
  'dropped': 'Dropped'
}
</script>

<template>
  <span class="badge badge--status" :class="[`badge--${size}`, statusClasses[status] || '']">
    {{ statusLabels[status] || status }}
  </span>
</template>
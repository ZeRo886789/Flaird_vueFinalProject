<script setup>
defineProps({
  genre: { type: String, required: true },
  size: { type: String, default: 'md' } // sm, md, lg
})
</script>

<template>
  <span class="badge badge--genre" :class="`badge--${size}`">{{ genre }}</span>
</template>
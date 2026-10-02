<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  rating: { type: Number, default: null },
  max: { type: Number, default: 5 },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['update:modelValue'])

const stars = computed(() =>
  Array.from({ length: props.max }, (_, i) => i + 1)
)

const hoverValue = ref(0)

const displayedRating = computed(() =>
  props.rating ?? props.modelValue
)

function setRating(value) {
  if (props.readonly) return
  emit('update:modelValue', value)
}

function handleMouseEnter(star) {
  if (!props.readonly) {
    hoverValue.value = star
  }
}

function handleMouseLeave() {
  if (!props.readonly) {
    hoverValue.value = 0
  }
}

function handleKeyDown(event, value) {
  if (props.readonly) return

  if (event.key === 'ArrowRight' && value < props.max) {
    setRating(value + 1)
  }

  if (event.key === 'ArrowLeft' && value > 1) {
    setRating(value - 1)
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    setRating(value)
  }
}
</script>

<template>
  <div
    class="rating"
    :class="`rating--${size}`"
    :aria-label="`${displayedRating} out of ${max} stars`"
    role="radiogroup"
  >
    <span
      v-for="star in stars"
      :key="star"
      class="rating__star"
      :class="{
        'is-filled': star <= displayedRating,
        'is-hover': star <= hoverValue
      }"
      @click="setRating(star)"
      @mouseenter="handleMouseEnter(star)"
      @mouseleave="handleMouseLeave"
      @keydown="handleKeyDown($event, star)"
      tabindex="0"
      role="radio"
      :aria-checked="star <= displayedRating"
      :aria-label="`${star} stars`"
    >
      ★
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search...' }
})

defineEmits(['update:modelValue', 'search'])
</script>

<template>
  <div class="search-box">
    <span class="search-box__icon">⌕</span>
    <input
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.enter="$emit('search')"
      class="search-box__input"
    />
  </div>
</template>
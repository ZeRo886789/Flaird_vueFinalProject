<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actions: { type: Array, default: () => [] }
})

defineSlots(['default', 'actions'])
</script>

<template>
  <header class="page-header">
    <div class="page-header__content">
      <div class="page-header__main">
        <div v-if="eyebrow" class="page-header__eyebrow">{{ eyebrow }}</div>
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="description" class="page-header__description">{{ description }}</p>
      </div>
      <div v-if="actions.length > 0 || $slots.actions" class="page-header__actions">
        <slot name="actions">
          <component
            v-for="action in actions"
            :key="action.label"
            :is="action.component || 'RouterLink'"
            :to="action.to"
            class="btn"
            :class="action.class"
            @click="action.onClick"
          >
            {{ action.label }}
          </component>
        </slot>
      </div>
    </div>
  </header>
</template>
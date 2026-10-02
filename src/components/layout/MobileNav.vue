<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { icon: '⌂', label: 'Home', path: '/dashboard' },
  { icon: '◈', label: 'Discover', path: '/anime' },
  { icon: '▦', label: 'Library', path: '/library' },
  { icon: '♥', label: 'Favorites', path: '/favorites' },
  { icon: '☰', label: 'More', path: '/profile' }
]
</script>

<template>
  <nav class="mobile-nav">
    <div class="mobile-nav__links">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="mobile-nav__link"
        :class="{ active: route.path === item.path || (item.path !== '/dashboard' && route.path.startsWith(item.path)) }"
      >
        <span class="mobile-nav__icon">{{ item.icon }}</span>
        <span class="mobile-nav__label">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
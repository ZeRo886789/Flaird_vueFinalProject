<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const mainNav = [
  { icon: '⌂', label: 'Dashboard', path: '/dashboard' },
  { icon: '◈', label: 'Anime', path: '/anime' },
  { icon: '▱', label: 'Manga', path: '/manga' },
  { icon: '⌕', label: 'Search', path: '/search' }
]

const libraryNav = [
  { icon: '▦', label: 'My Library', path: '/library' },
  { icon: '📈', label: 'Progress', path: '/library/progress' },
  { icon: '♥', label: 'Favorites', path: '/favorites' },
  { icon: '◷', label: 'Calendar', path: '/calendar' }
]

const communityNav = [
  { icon: '◎', label: 'Community', path: '/community' }
]

const accountNav = [
  { icon: '◉', label: 'Profile', path: '/profile' },
  { icon: '📊', label: 'Statistics', path: '/statistics' },
  { icon: '🔔', label: 'Notifications', path: '/notifications' },
  { icon: '⚙', label: 'Settings', path: '/settings' }
]

function isActive(path) {
  return route.path === path || (path !== '/' && route.path.startsWith(path + '/'))
}

function logout() {
  auth.logout()
  router.push({ name: 'landing' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <RouterLink to="/" class="brand">
        <span class="brand__mark">F</span><span>FLAIRD</span>
      </RouterLink>
    </div>

    <nav class="sidebar__nav">
      <div class="sidebar__section">
        <div class="sidebar__label">MAIN</div>
        <RouterLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="sidebar__link"
          :class="{ active: isActive(item.path) }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="sidebar__section">
        <div class="sidebar__label">LIBRARY</div>
        <RouterLink
          v-for="item in libraryNav"
          :key="item.path"
          :to="item.path"
          class="sidebar__link"
          :class="{ active: isActive(item.path) }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="sidebar__section">
        <div class="sidebar__label">COMMUNITY</div>
        <RouterLink
          v-for="item in communityNav"
          :key="item.path"
          :to="item.path"
          class="sidebar__link"
          :class="{ active: isActive(item.path) }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="sidebar__section">
        <div class="sidebar__label">ACCOUNT</div>
        <RouterLink
          v-for="item in accountNav"
          :key="item.path"
          :to="item.path"
          class="sidebar__link"
          :class="{ active: isActive(item.path) }"
        >
          <span class="sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="sidebar__footer">
      <button class="btn btn--ghost btn--danger" @click="logout">
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
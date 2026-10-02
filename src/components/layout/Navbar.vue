<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'
import SearchBar from '../common/SearchBar.vue'

const auth = useAuthStore()
const app = useAppStore()
const router = useRouter()
const searchQuery = ref('')
const showSearch = ref(false)
const isMobile = ref(false)

function handleResize() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
  }
}

const unreadCount = computed(() => app.notifications.filter(
  n => n.userId === auth.currentUser?.id && !n.read
).length)
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">
      <RouterLink to="/" class="brand">
        <span class="brand__mark">F</span><span>FLAIRD</span>
      </RouterLink>

      <div class="navbar__search" v-show="showSearch || !isMobile">
        <SearchBar v-model="searchQuery" placeholder="Search anime, manga, users..." @search="handleSearch" />
      </div>

      <div class="navbar__actions">
        <button v-if="isMobile" class="btn btn--ghost btn--icon" @click="showSearch = !showSearch" aria-label="Search">
          ⌕
        </button>

        <RouterLink v-if="!auth.currentUser" class="btn btn--ghost hide-mobile" to="/login">Log in</RouterLink>
        <RouterLink v-if="!auth.currentUser" class="btn btn--primary" to="/register">Get started</RouterLink>

        <div v-else class="navbar__user-menu">
          <RouterLink class="btn btn--ghost" to="/notifications">
            🔔
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
          </RouterLink>
          <RouterLink class="btn btn--ghost" to="/profile">{{ auth.currentUser.username }}</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
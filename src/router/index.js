import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },
  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/dashboard/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/anime', name: 'anime', component: () => import('../views/catalog/AnimeView.vue') },
  { path: '/manga', name: 'manga', component: () => import('../views/catalog/MangaView.vue') },
  { path: '/anime/:id', name: 'anime-details', component: () => import('../views/catalog/AnimeDetailsView.vue') },
  { path: '/manga/:id', name: 'manga-details', component: () => import('../views/catalog/MangaDetailsView.vue') },
  { path: '/search', name: 'search', component: () => import('../views/discovery/SearchView.vue') },
  { path: '/library', name: 'library', component: () => import('../views/library/LibraryView.vue'), meta: { requiresAuth: true } },
  { path: '/library/progress', name: 'progress', component: () => import('../views/library/ProgressView.vue'), meta: { requiresAuth: true } },
  { path: '/favorites', name: 'favorites', component: () => import('../views/library/FavoritesView.vue'), meta: { requiresAuth: true } },
  { path: '/calendar', name: 'calendar', component: () => import('../views/discovery/CalendarView.vue') },
  { path: '/community', name: 'community', component: () => import('../views/social/CommunityView.vue') },
  { path: '/profile', name: 'profile', component: () => import('../views/social/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/user/:id', name: 'user-profile', component: () => import('../views/social/UserProfileView.vue') },
  { path: '/statistics', name: 'statistics', component: () => import('../views/statistics/StatisticsView.vue'), meta: { requiresAuth: true } },
  { path: '/notifications', name: 'notifications', component: () => import('../views/notifications/NotificationsView.vue'), meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: () => import('../views/settings/SettingsView.vue'), meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: '404', component: () => import('../views/errors/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' })
})

router.beforeEach((to) => {
  const currentUser = localStorage.getItem('flaird_current_user')
  if (to.meta.requiresAuth && !currentUser) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router

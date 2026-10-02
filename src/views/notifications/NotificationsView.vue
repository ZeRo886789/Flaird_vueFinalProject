<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'

const auth = useAuthStore()
const app = useAppStore()

const userNotifications = computed(() => app.notifications
  .filter(n => n.userId === auth.currentUser?.id)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

const unreadCount = computed(() => userNotifications.value.filter(n => !n.read).length)

function markAsRead(notification) {
  notification.read = true
  localStorage.setItem('flaird_notifications', JSON.stringify(app.notifications))
}

function markAllAsRead() {
  app.notifications.forEach(n => {
    if (n.userId === auth.currentUser?.id) n.read = true
  })
  localStorage.setItem('flaird_notifications', JSON.stringify(app.notifications))
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Notifications
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </h1>
        <p class="page-header__description">Likes, comments, releases, and local account activity.</p>
      </div>
      <button v-if="unreadCount > 0" class="btn btn--ghost btn--sm" @click="markAllAsRead">Mark all as read</button>
    </header>

    <div v-if="userNotifications.length === 0" class="empty-state">
      <h3>No Notifications</h3>
      <p>You're all caught up!</p>
    </div>

    <div v-else class="notifications-list">
      <article
        v-for="notification in userNotifications"
        :key="notification.id"
        class="notification-item"
        :class="{ unread: !notification.read }"
        @click="markAsRead(notification)"
      >
        <div class="notification-item__icon">
          <span v-if="notification.type === 'like'">♥</span>
          <span v-else-if="notification.type === 'comment'">💬</span>
          <span v-else-if="notification.type === 'release'">📅</span>
          <span v-else-if="notification.type === 'complete'">✅</span>
          <span v-else>🔔</span>
        </div>
        <div class="notification-item__content">
          <p class="notification-item__message">{{ notification.message }}</p>
          <time class="notification-item__time">{{ formatTime(notification.createdAt) }}</time>
        </div>
        <div v-if="!notification.read" class="notification-item__unread-dot" />
      </article>
    </div>
  </section>
</template>
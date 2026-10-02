<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { useSocialStore } from '../../stores/socialStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import StatCard from '../../components/statistics/StatCard.vue'
import ActivityCard from '../../components/social/ActivityCard.vue'
import UserCard from '../../components/social/UserCard.vue'
import ReviewCard from '../../components/social/ReviewCard.vue'

const route = useRoute()
const auth = useAuthStore()
const library = useLibraryStore()
const social = useSocialStore()

const activeTab = ref('activity')

const targetUser = computed(() =>
  auth.users.find(u => u.id === route.params.id)
)

const userLibrary = computed(() =>
  targetUser.value
    ? [...library.library].filter(x => x.userId === targetUser.value.id)
    : []
)

const userFavorites = computed(() =>
  targetUser.value
    ? library.favorites.filter(f => f.startsWith(`${targetUser.value.id}:`))
    : []
)

const userReviews = computed(() =>
  targetUser.value
    ? [...social.reviews]
      .filter(r => r.userId === targetUser.value.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []
)

const userActivities = computed(() =>
  targetUser.value
    ? [...social.activities]
      .filter(a => a.userId === targetUser.value.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []
)

const stats = computed(() => {
  if (!targetUser.value) return {}
  const lib = userLibrary.value
  return {
    animeCompleted: lib.filter(x => x.status === 'completed' && x.type === 'anime').length,
    mangaCompleted: lib.filter(x => x.status === 'completed' && x.type === 'manga').length,
    animeWatching: lib.filter(x => x.status === 'watching').length,
    mangaReading: lib.filter(x => x.status === 'reading').length,
    favorites: userFavorites.value.length,
    total: lib.length
  }
})

const allTitles = computed(() => [...anime, ...manga])

function getTitle(id) {
  return allTitles.value.find(t => t.id === Number(id))
}
</script>

<template>
  <section class="page-container" v-if="targetUser">
    <header class="page-header profile-header">
      <UserCard :user="targetUser" :show-stats="true" :stats="stats" />
    </header>

    <div class="profile-tabs">
      <button
        v-for="tab in ['activity', 'reviews']"
        :key="tab"
        class="profile-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab === 'activity' ? 'Activity' : 'Reviews' }}
      </button>
    </div>

    <div v-if="activeTab === 'activity'" class="activity-feed">
      <ActivityCard
        v-for="activity in userActivities"
        :key="activity.id"
        :activity="activity"
        :title="getTitle(activity.titleId)"
      />
      <div v-if="userActivities.length === 0" class="empty-state">
        <p>No activity yet.</p>
      </div>
    </div>

    <div v-if="activeTab === 'reviews'" class="reviews-list">
      <ReviewCard
        v-for="review in userReviews"
        :key="review.id"
        :review="review"
        :title="getTitle(review.titleId)"
        :user="targetUser"
        :can-edit="false"
      />
      <div v-if="userReviews.length === 0" class="empty-state">
        <p>No reviews yet.</p>
      </div>
    </div>
  </section>

  <div v-else class="page-container">
    <div class="error-state">
      <h2>User not found</h2>
      <RouterLink to="/community" class="btn btn--primary">Back to Community</RouterLink>
    </div>
  </div>
</template>

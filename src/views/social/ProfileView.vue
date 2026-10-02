<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { useSocialStore } from '../../stores/socialStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import StatCard from '../../components/statistics/StatCard.vue'
import ActivityCard from '../../components/social/ActivityCard.vue'
import ReviewCard from '../../components/social/ReviewCard.vue'
import UserCard from '../../components/social/UserCard.vue'
import Modal from '../../components/common/Modal.vue'

const auth = useAuthStore()
const library = useLibraryStore()
const social = useSocialStore()
const router = useRouter()

const activeTab = ref('activity')
const showEditProfile = ref(false)
const editName = ref(auth.currentUser?.name || '')
const editBio = ref(auth.currentUser?.bio || '')

const userLibrary = computed(() => [...library.currentUserItems])
const userFavorites = computed(() => [...library.favorites].filter(f => f.startsWith(`${auth.currentUser?.id}:`)))
const userReviews = computed(() => [...social.reviews]
  .filter(r => r.userId === auth.currentUser?.id)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)
const userActivities = computed(() => [...social.activities]
  .filter(a => a.userId === auth.currentUser?.id)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

const stats = computed(() => {
  const lib = userLibrary.value
  return {
    animeCompleted: lib.filter(x => x.status === 'completed' && x.type === 'anime').length,
    mangaCompleted: lib.filter(x => x.status === 'completed' && x.type === 'manga').length,
    animeWatching: lib.filter(x => x.status === 'watching').length,
    mangaReading: lib.filter(x => x.status === 'reading').length,
    total: lib.length,
    favorites: userFavorites.value.length,
    reviews: userReviews.value.length,
    avgRating: lib.length > 0
      ? (lib.reduce((sum, x) => {
          const rating = library.ratings.find(r => r.key === `${auth.currentUser.id}:${x.titleId}`)
          return sum + (rating?.rating || 0)
        }, 0) / lib.length).toFixed(1)
      : '0.0'
  }
})

function saveProfile() {
  auth.updateProfile({ name: editName.value, bio: editBio.value })
  showEditProfile.value = false
}

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <section class="page-container">
    <header class="page-header profile-header">
      <UserCard :user="auth.currentUser" :show-stats="true" :stats="stats" />
      <button class="btn btn--ghost" @click="showEditProfile = true">Edit Profile</button>
    </header>

    <div class="profile-tabs">
      <button
        v-for="tab in ['activity', 'reviews', 'library']"
        :key="tab"
        class="profile-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab === 'activity' ? 'Activity' : tab === 'reviews' ? 'Reviews' : 'Library' }}
      </button>
    </div>

    <div v-if="activeTab === 'activity'" class="profile-section">
      <ActivityCard
        v-for="activity in userActivities.slice(0, 20)"
        :key="activity.id"
        :activity="activity"
        :user="auth.currentUser"
      />
      <div v-if="userActivities.length === 0" class="empty-state">
        <p>No activity yet. Start tracking titles!</p>
      </div>
    </div>

    <div v-if="activeTab === 'reviews'" class="profile-section">
      <ReviewCard
        v-for="review in userReviews"
        :key="review.id"
        :review="review"
        :can-edit="true"
      />
      <div v-if="userReviews.length === 0" class="empty-state">
        <p>No reviews yet.</p>
      </div>
    </div>

    <div v-if="activeTab === 'library'" class="profile-section">
      <h3>Your Library Summary</h3>
      <div class="stats-grid">
        <StatCard label="Total Titles" :value="stats.total" icon="📚" />
        <StatCard label="Completed" :value="stats.animeCompleted + stats.mangaCompleted" icon="✅" />
        <StatCard label="Favorites" :value="stats.favorites" icon="♥" />
        <StatCard label="Reviews" :value="stats.reviews" icon="✍" />
      </div>
    </div>

    <Modal v-if="showEditProfile" @close="showEditProfile = false" title="Edit Profile">
      <template #default>
        <div class="form-group">
          <label>Name</label>
          <input v-model="editName" class="input" required />
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea v-model="editBio" rows="3" class="textarea" placeholder="Tell us about yourself..." />
        </div>
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="saveProfile">Save</button>
        <button class="btn btn--ghost" @click="showEditProfile = false">Cancel</button>
      </template>
    </Modal>
  </section>
</template>
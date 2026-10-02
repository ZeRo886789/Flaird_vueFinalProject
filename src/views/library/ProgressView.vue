<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useLibraryStore } from '../../stores/libraryStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import ProgressBar from '../../components/common/ProgressBar.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import Modal from '../../components/common/Modal.vue'

const auth = useAuthStore()
const library = useLibraryStore()

const userLibrary = computed(() => [...library.currentUserItems])
const selectedItem = ref(null)
const progressValue = ref(0)
const statusValue = ref('planning')
const statusFilter = ref('all')

const filteredLibrary = computed(() => {
  if (statusFilter.value === 'all') {
    return userLibrary.value
  }
  return userLibrary.value.filter(item => item.status === statusFilter.value)
})

const getTitle = (item) => {
  const allTitles = [...anime, ...manga]
  return allTitles.find(t => t.id === item.titleId) || null
}

function openProgressModal(item) {
  const title = getTitle(item)
  if (title) {
    selectedItem.value = { item, title }
    progressValue.value = item.progress
    statusValue.value = item.status
  }
}

function saveProgress() {
  if (selectedItem.value) {
    library.updateProgress(selectedItem.value.item.titleId, progressValue.value, statusValue.value)
    selectedItem.value = null
  }
}

function getProgressPercent(item, title) {
  if (!title) return 0
  const total = title.type === 'anime' ? Number(title.episodes) : Number(title.chapters)
  if (!Number.isFinite(total) || total <= 0) return 0
  const progress = Math.min(Math.max(Number(item.progress) || 0, 0), total)
  return Math.round((progress / total) * 100)
}
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Progress Tracker</h1>
        <p class="page-header__description">Manage your episode and chapter progress for all tracked titles.</p>
      </div>
    </header>

    <div v-if="userLibrary.length === 0" class="empty-state">
      <h3>No titles in your library</h3>
      <p>Add titles from the catalog to start tracking your progress.</p>
      <RouterLink to="/anime" class="btn btn--primary">Browse Anime</RouterLink>
      <RouterLink to="/manga" class="btn btn--outline" style="margin-left: 12px;">Browse Manga</RouterLink>
    </div>

    <div v-else class="progress-list">
      <div class="progress-filters">
        <button
          v-for="status in ['all', 'planning', 'watching', 'reading', 'completed', 'paused', 'dropped']"
          :key="status"
          class="btn btn--ghost btn--sm"
          :class="{ active: statusFilter === status }"
          @click="statusFilter = status"
        >
          {{ status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1) }}
        </button>
      </div>

      <div class="progress-grid">
        <div
          v-for="libItem in filteredLibrary"
          :key="libItem.id"
          class="progress-card"
          v-if="getTitle(libItem)"
        >
          <div class="progress-card__cover">
            <img :src="getTitle(libItem)?.cover" :alt="getTitle(libItem)?.title" loading="lazy" decoding="async"
              @error="$event.target.classList.add('media-card__image_broken')" />
          </div>
          <div class="progress-card__info">
            <div class="progress-card__title">{{ getTitle(libItem)?.title }}</div>
            <div class="progress-card__meta">
              <StatusBadge :status="libItem.status" />
              <span class="progress-card__meta-type">{{ getTitle(libItem)?.type === 'anime' ? 'Anime' : 'Manga' }}</span>
            </div>
            <ProgressBar
              :current="libItem.progress"
              :total="getTitle(libItem).type === 'anime' ? getTitle(libItem).episodes : getTitle(libItem).chapters"
              :show-label="true"
              size="sm"
            />
            <div class="progress-card__percent">{{ getProgressPercent(libItem, getTitle(libItem)) }}%</div>
          </div>
          <button class="progress-card__edit" @click="openProgressModal(libItem)">Edit</button>
        </div>
      </div>
    </div>

    <Modal v-if="selectedItem" @close="selectedItem = null" :title="`Edit Progress: ${selectedItem.title.title}`">
      <template #default>
        <div class="progress-edit-form">
          <div class="form-group">
            <label>Status</label>
            <select v-model="statusValue" class="select">
              <option value="planning">Planning</option>
              <option v-if="selectedItem.title.type === 'anime'" value="watching">Watching</option>
              <option v-if="selectedItem.title.type === 'manga'" value="reading">Reading</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
          <div class="form-group">
            <label>Progress</label>
            <div class="progress-input-row">
              <input
                type="number"
                v-model.number="progressValue"
                :min="0"
                :max="selectedItem.title.type === 'anime' ? selectedItem.title.episodes : selectedItem.title.chapters"
                class="input"
                style="width: 100px;"
              />
              <span class="progress-input-divider">/</span>
              <span class="progress-input-total">{{ selectedItem.title.type === 'anime' ? selectedItem.title.episodes : selectedItem.title.chapters }}</span>
            </div>
          </div>
          <ProgressBar :current="progressValue" :total="selectedItem.title.type === 'anime' ? selectedItem.title.episodes : selectedItem.title.chapters" :show-label="true" />
        </div>
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="saveProgress">Save</button>
        <button class="btn btn--ghost" @click="selectedItem = null">Cancel</button>
      </template>
    </Modal>
  </section>
</template>

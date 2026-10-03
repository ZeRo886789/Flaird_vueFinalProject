<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLibraryStore } from '../../stores/libraryStore'
import { anime } from '../../data/anime'
import { manga } from '../../data/manga'
import ProgressBar from '../../components/common/ProgressBar.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import Modal from '../../components/common/Modal.vue'

const route = useRoute()
const library = useLibraryStore()

const selectedItem = ref(null)
const progressValue = ref(0)
const statusValue = ref('planning')

const statusFilter = ref('all')
const sortMode = ref('recent')

const allTitles = computed(() => [
  ...anime,
  ...manga
])

const resolvedLibrary = computed(() => {
  return library.currentUserItems
    .map(item => ({
      item,
      title: allTitles.value.find(
        title => title.id === item.titleId
      ) || null
    }))
    .filter(entry => entry.title)
})

function getTotal(title) {
  if (!title) {
    return 0
  }

  const total =
    title.type === 'anime'
      ? Number(title.episodes)
      : Number(title.chapters)

  return Number.isFinite(total) && total > 0
    ? total
    : 0
}

function getProgress(entry) {
  if (!entry?.item) {
    return 0
  }

  return Math.max(
    Number(entry.item.progress) || 0,
    0
  )
}

function getProgressPercent(entry) {
  const total = getTotal(entry?.title)

  if (!total) {
    return 0
  }

  const progress = Math.min(
    getProgress(entry),
    total
  )

  return Math.round(
    (progress / total) * 100
  )
}

function getUnitLabel(title, amount = 1) {
  if (!title) {
    return 'Units'
  }

  if (title.type === 'anime') {
    return amount === 1
      ? 'Episode'
      : 'Episodes'
  }

  return amount === 1
    ? 'Chapter'
    : 'Chapters'
}

function getActiveStatus(title) {
  return title?.type === 'anime'
    ? 'watching'
    : 'reading'
}

function getDisplayStatus(entry) {
  return entry?.item?.status || 'planning'
}

function getUpdatedTime(entry) {
  const value = entry?.item?.updatedAt

  if (!value) {
    return 0
  }

  const time = new Date(value).getTime()

  return Number.isFinite(time)
    ? time
    : 0
}

function formatRelativeDate(entry) {
  const timestamp = getUpdatedTime(entry)

  if (!timestamp) {
    return 'No recent update'
  }

  const diff =
    Date.now() - timestamp

  const minutes = Math.floor(
    diff / 60000
  )

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  const hours = Math.floor(
    minutes / 60
  )

  if (hours < 24) {
    return `${hours}h ago`
  }

  const days = Math.floor(
    hours / 24
  )

  if (days === 1) {
    return 'Yesterday'
  }

  if (days < 7) {
    return `${days}d ago`
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: 'short',
      day: 'numeric'
    }
  ).format(
    new Date(timestamp)
  )
}

const filteredLibrary = computed(() => {
  let result = [...resolvedLibrary.value]

  if (statusFilter.value !== 'all') {
    result = result.filter(
      entry =>
        entry.item.status ===
        statusFilter.value
    )
  }

  switch (sortMode.value) {
    case 'progress-desc':
      result.sort(
        (a, b) =>
          getProgressPercent(b) -
          getProgressPercent(a)
      )
      break

    case 'progress-asc':
      result.sort(
        (a, b) =>
          getProgressPercent(a) -
          getProgressPercent(b)
      )
      break

    case 'title':
      result.sort(
        (a, b) =>
          a.title.title.localeCompare(
            b.title.title
          )
      )
      break

    case 'recent':
    default:
      result.sort(
        (a, b) =>
          getUpdatedTime(b) -
          getUpdatedTime(a)
      )
      break
  }

  return result
})

const continueQueue = computed(() => {
  return resolvedLibrary.value
    .filter(entry =>
      entry.item.status === 'watching' ||
      entry.item.status === 'reading'
    )
    .sort(
      (a, b) =>
        getUpdatedTime(b) -
        getUpdatedTime(a)
    )
    .slice(0, 4)
})

const milestoneEntries = computed(() => {
  return resolvedLibrary.value.filter(
    entry =>
      getProgressPercent(entry) >= 75 &&
      getProgressPercent(entry) < 100
  )
})

const progressStats = computed(() => {
  const entries =
    resolvedLibrary.value

  const active = entries.filter(
    entry =>
      entry.item.status === 'watching' ||
      entry.item.status === 'reading'
  )

  const totalUnits = entries.reduce(
    (sum, entry) =>
      sum + getTotal(entry.title),
    0
  )

  const completedUnits =
    entries.reduce(
      (sum, entry) =>
        sum +
        Math.min(
          getProgress(entry),
          getTotal(entry.title)
        ),
      0
    )

  const overallPercent =
    totalUnits > 0
      ? Math.round(
          (completedUnits /
            totalUnits) *
            100
        )
      : 0

  const weekAgo =
    Date.now() -
    7 * 24 * 60 * 60 * 1000

  const updatedThisWeek =
    entries.filter(
      entry =>
        getUpdatedTime(entry) >=
        weekAgo
    ).length

  return {
    active: active.length,
    totalUnits,
    completedUnits,
    overallPercent,
    updatedThisWeek
  }
})

function quickAdvance(entry, amount) {
  if (!entry?.item || !entry?.title) {
    return
  }

  const total =
    getTotal(entry.title)

  if (!total) {
    return
  }

  let nextProgress =
    getProgress(entry) + amount

  nextProgress = Math.min(
    nextProgress,
    total
  )

  let nextStatus =
    entry.item.status

  if (
    nextProgress > 0 &&
    nextStatus === 'planning'
  ) {
    nextStatus =
      getActiveStatus(entry.title)
  }

  if (
    nextProgress >= total
  ) {
    nextProgress = total
    nextStatus = 'completed'
  }

  library.updateProgress(
    entry.item.titleId,
    nextProgress,
    nextStatus
  )
}

function openProgressModal(entry) {
  if (!entry?.item || !entry?.title) {
    return
  }

  selectedItem.value = entry

  const total =
    getTotal(entry.title)

  progressValue.value =
    Math.min(
      Math.max(
        Number(entry.item.progress) || 0,
        0
      ),
      total
    )

  statusValue.value =
    entry.item.status ||
    'planning'
}

function closeProgressModal() {
  selectedItem.value = null
}

function saveProgress() {
  if (!selectedItem.value) {
    return
  }

  const {
    item,
    title
  } = selectedItem.value

  const total =
    getTotal(title)

  let progress =
    Math.min(
      Math.max(
        Number(progressValue.value) || 0,
        0
      ),
      total
    )

  let status =
    statusValue.value

  if (
    status === 'completed' &&
    total > 0
  ) {
    progress = total
  }

  if (
    progress > 0 &&
    status === 'planning'
  ) {
    status =
      getActiveStatus(title)
  }

  library.updateProgress(
    item.titleId,
    progress,
    status
  )

  closeProgressModal()
}

function openTitleFromQuery() {
  const rawId =
    route.query.titleId

  if (!rawId) {
    return
  }

  const titleId =
    Number(rawId)

  if (!Number.isFinite(titleId)) {
    return
  }

  const entry =
    resolvedLibrary.value.find(
      entry =>
        entry.item.titleId ===
        titleId
    )

  if (entry) {
    openProgressModal(entry)
  }
}

watch(
  [
    () => route.query.titleId,
    resolvedLibrary
  ],
  openTitleFromQuery,
  {
    immediate: true
  }
)
</script>

<template>
  <section
    class="page-container progress-dashboard"
  >

    <header
      class="page-header progress-dashboard__header"
    >
      <div>

        <div class="page-header__eyebrow">
          FLAIRD • TRACKING CENTER
        </div>

        <h1>Progress Center</h1>

        <p
          class="page-header__description"
        >
          Track what you're watching,
          what you're reading, and how
          close you are to finishing.
        </p>

      </div>

      <div
        class="progress-dashboard__overall"
      >

        <span>
          Overall Progress
        </span>

        <strong>
          {{ progressStats.overallPercent }}%
        </strong>

      </div>
    </header>


    <section
      class="progress-overview"
      aria-label="Progress overview"
    >

      <div class="progress-stat">
        <span class="progress-stat__icon">
          ▶
        </span>

        <div>
          <small>
            Active Titles
          </small>

          <strong>
            {{ progressStats.active }}
          </strong>

          <span>
            Watching / Reading
          </span>
        </div>
      </div>


      <div class="progress-stat">
        <span class="progress-stat__icon">
          %
        </span>

        <div>
          <small>
            Overall Progress
          </small>

          <strong>
            {{ progressStats.overallPercent }}%
          </strong>

          <span>
            Across your library
          </span>
        </div>
      </div>


      <div class="progress-stat">
        <span class="progress-stat__icon">
          ✓
        </span>

        <div>
          <small>
            Units Completed
          </small>

          <strong>
            {{ progressStats.completedUnits }}
          </strong>

          <span>
            Episodes + chapters
          </span>
        </div>
      </div>


      <div class="progress-stat">
        <span class="progress-stat__icon">
          ↗
        </span>

        <div>
          <small>
            Updated This Week
          </small>

          <strong>
            {{ progressStats.updatedThisWeek }}
          </strong>

          <span>
            Tracked titles
          </span>
        </div>
      </div>

    </section>


    <section
      v-if="continueQueue.length > 0"
      class="progress-section"
    >

      <div class="progress-section__header">

        <div>
          <span
            class="progress-section__eyebrow"
          >
            KEEP GOING
          </span>

          <h2>
            Continue Queue
          </h2>

          <p>
            Your most recently updated
            active titles.
          </p>
        </div>

      </div>


      <div class="continue-progress-grid">

        <article
          v-for="entry in continueQueue"
          :key="entry.item.id"
          class="continue-progress-card"
        >

          <img
            class="continue-progress-card__cover"
            :src="entry.title.cover"
            :alt="entry.title.title"
            loading="lazy"
            decoding="async"
          />

          <div
            class="continue-progress-card__content"
          >

            <div
              class="continue-progress-card__top"
            >

              <div>

                <h3>
                  {{ entry.title.title }}
                </h3>

                <div
                  class="continue-progress-card__meta"
                >
                  <StatusBadge
                    :status="entry.item.status"
                  />

                  <span>
                    {{
                      entry.title.type === 'anime'
                        ? 'Anime'
                        : 'Manga'
                    }}
                  </span>
                </div>

              </div>

              <span
                class="continue-progress-card__percent"
              >
                {{ getProgressPercent(entry) }}%
              </span>

            </div>


            <ProgressBar
              :current="getProgress(entry)"
              :total="getTotal(entry.title)"
              :show-label="true"
              size="sm"
            />


            <div
              class="continue-progress-card__actions"
            >

              <span>
                {{ formatRelativeDate(entry) }}
              </span>

              <div>

                <button
                  type="button"
                  class="quick-btn"
                  :title="`Add 1 ${getUnitLabel(entry.title)}`"
                  @click="
                    quickAdvance(entry, 1)
                  "
                >
                  +1
                </button>

                <button
                  type="button"
                  class="quick-btn quick-btn--primary"
                  :title="`Add 5 ${getUnitLabel(entry.title, 5)}`"
                  @click="
                    quickAdvance(entry, 5)
                  "
                >
                  +5
                </button>

                <button
                  type="button"
                  class="quick-btn"
                  @click="
                    openProgressModal(entry)
                  "
                >
                  Edit
                </button>

              </div>

            </div>

          </div>

        </article>

      </div>

    </section>


    <section
      v-if="milestoneEntries.length > 0"
      class="milestone-panel"
    >

      <div
        class="milestone-panel__icon"
      >
        ✦
      </div>

      <div>

        <strong>
          Almost there
        </strong>

        <p>
          {{ milestoneEntries.length }}
          {{
            milestoneEntries.length === 1
              ? 'title is'
              : 'titles are'
          }}
          at 75% or more.
        </p>

      </div>

      <div
        class="milestone-panel__items"
      >

        <span
          v-for="entry in milestoneEntries.slice(0, 3)"
          :key="entry.item.id"
        >
          {{ entry.title.title }}
          <b>
            {{ getProgressPercent(entry) }}%
          </b>
        </span>

      </div>

    </section>


    <section
      class="progress-section progress-all"
    >

      <div
        class="progress-section__header progress-section__header--controls"
      >

        <div>
          <span
            class="progress-section__eyebrow"
          >
            TRACKING LOG
          </span>

          <h2>
            All Progress
          </h2>

          <p>
            Update and organize every
            tracked title from one place.
          </p>
        </div>


        <div
          class="progress-controls"
        >

          <select
            v-model="statusFilter"
            class="select progress-select"
            aria-label="Filter progress"
          >

            <option value="all">
              All Statuses
            </option>

            <option value="watching">
              Watching
            </option>

            <option value="reading">
              Reading
            </option>

            <option value="planning">
              Planning
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="paused">
              Paused
            </option>

            <option value="dropped">
              Dropped
            </option>

          </select>


          <select
            v-model="sortMode"
            class="select progress-select"
            aria-label="Sort progress"
          >

            <option value="recent">
              Recently Updated
            </option>

            <option value="progress-desc">
              Most Progress
            </option>

            <option value="progress-asc">
              Least Progress
            </option>

            <option value="title">
              A → Z
            </option>

          </select>

        </div>

      </div>


      <div
        v-if="resolvedLibrary.length === 0"
        class="progress-empty"
      >

        <div class="progress-empty__icon">
          ◌
        </div>

        <h3>
          Nothing to track yet
        </h3>

        <p>
          Add an anime or manga to your
          library and your progress
          workspace will appear here.
        </p>

        <div
          class="progress-empty__actions"
        >

          <RouterLink
            to="/anime"
            class="btn btn--primary"
          >
            Browse Anime
          </RouterLink>

          <RouterLink
            to="/manga"
            class="btn btn--outline"
          >
            Browse Manga
          </RouterLink>

        </div>

      </div>


      <div
        v-else-if="
          filteredLibrary.length === 0
        "
        class="progress-empty"
      >

        <div class="progress-empty__icon">
          ◌
        </div>

        <h3>
          No matching progress
        </h3>

        <p>
          No tracked titles match the
          selected status.
        </p>

        <button
          type="button"
          class="btn btn--ghost"
          @click="
            statusFilter = 'all'
          "
        >
          Show All
        </button>

      </div>


      <div
        v-else
        class="progress-log"
      >

        <article
          v-for="entry in filteredLibrary"
          :key="entry.item.id"
          class="progress-log-item"
        >

          <img
            class="progress-log-item__cover"
            :src="entry.title.cover"
            :alt="entry.title.title"
            loading="lazy"
            decoding="async"
          />


          <div
            class="progress-log-item__main"
          >

            <div
              class="progress-log-item__title-row"
            >

              <div>

                <RouterLink
                  :to="
                    entry.title.type === 'anime'
                      ? `/anime/${entry.title.id}`
                      : `/manga/${entry.title.id}`
                  "
                  class="progress-log-item__title"
                >
                  {{ entry.title.title }}
                </RouterLink>

                <div
                  class="progress-log-item__meta"
                >

                  <StatusBadge
                    :status="getDisplayStatus(entry)"
                  />

                  <span>
                    {{
                      entry.title.type === 'anime'
                        ? 'Anime'
                        : 'Manga'
                    }}
                  </span>

                  <span>
                    {{ formatRelativeDate(entry) }}
                  </span>

                </div>

              </div>


              <strong
                class="progress-log-item__percent"
              >
                {{ getProgressPercent(entry) }}%
              </strong>

            </div>


            <ProgressBar
              :current="getProgress(entry)"
              :total="getTotal(entry.title)"
              :show-label="true"
              size="sm"
            />


            <div
              class="progress-log-item__actions"
            >

              <button
                type="button"
                class="quick-btn"
                @click="
                  quickAdvance(entry, 1)
                "
              >
                +1
                {{ getUnitLabel(entry.title) }}
              </button>

              <button
                type="button"
                class="quick-btn"
                @click="
                  quickAdvance(entry, 5)
                "
              >
                +5
              </button>

              <button
                type="button"
                class="btn btn--ghost btn--sm"
                @click="
                  openProgressModal(entry)
                "
              >
                Edit Progress
              </button>

            </div>

          </div>

        </article>

      </div>

    </section>


    <Modal
      v-if="selectedItem"
      :title="
        `Edit Progress: ${
          selectedItem.title.title
        }`
      "
      @close="closeProgressModal"
    >

      <div
        class="progress-edit-form"
      >

        <div class="form-group">

          <label
            for="progress-status"
          >
            Status
          </label>

          <select
            id="progress-status"
            v-model="statusValue"
            class="select"
          >

            <option value="planning">
              Planning
            </option>

            <option
              v-if="
                selectedItem.title.type ===
                'anime'
              "
              value="watching"
            >
              Watching
            </option>

            <option
              v-if="
                selectedItem.title.type ===
                'manga'
              "
              value="reading"
            >
              Reading
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="paused">
              Paused
            </option>

            <option value="dropped">
              Dropped
            </option>

          </select>

        </div>


        <div class="form-group">

          <label
            for="progress-number"
          >
            Progress
          </label>

          <div
            class="progress-input-row"
          >

            <input
              id="progress-number"
              type="number"
              v-model.number="
                progressValue
              "
              :min="0"
              :max="
                getTotal(
                  selectedItem.title
                )
              "
              step="1"
              inputmode="numeric"
              class="input"
            />

            <span
              class="progress-input-divider"
            >
              /
            </span>

            <span
              class="progress-input-total"
            >
              {{
                getTotal(
                  selectedItem.title
                )
              }}
            </span>

          </div>

        </div>


        <ProgressBar
          :current="progressValue"
          :total="
            getTotal(
              selectedItem.title
            )
          "
          :show-label="true"
        />

      </div>


      <template #actions>

        <button
          type="button"
          class="btn btn--primary"
          @click="saveProgress"
        >
          Save
        </button>

        <button
          type="button"
          class="btn btn--ghost"
          @click="
            closeProgressModal
          "
        >
          Cancel
        </button>

      </template>

    </Modal>

  </section>
</template>

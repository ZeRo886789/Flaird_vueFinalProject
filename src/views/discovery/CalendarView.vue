<script setup>
import { ref, computed } from 'vue'
import { releases } from '../../data/releases'
import ReleaseCard from '../../components/cards/ReleaseCard.vue'

const sections = computed(() => {
  const today = new Date('2026-10-02')
  const groups = {
    'Today': [],
    'Tomorrow': [],
    'This Week': [],
    'Later': []
  }

  releases.forEach(release => {
    if (groups[release.status]) {
      groups[release.status].push(release)
    }
  })

  return Object.entries(groups).filter(([_, items]) => items.length > 0)
})
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Release Calendar</h1>
        <p class="page-header__description">A curated release schedule grouped by day and week.</p>
      </div>
    </header>

    <div class="calendar-sections">
      <div v-for="[sectionName, items] in sections" :key="sectionName" class="calendar-section">
        <h2 class="calendar-section__title">{{ sectionName }}</h2>
        <div class="release-grid">
          <ReleaseCard v-for="release in items" :key="release.id" :release="release" />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'
import { exportLocalData } from '../../utils/exportData'
import { importLocalData } from '../../utils/importData'
import Modal from '../../components/common/Modal.vue'
import ConfirmDialog from '../../components/common/ConfirmDialog.vue'

const auth = useAuthStore()
const app = useAppStore()

const theme = ref(app.theme)
const reducedMotion = ref(app.settings.reducedMotion)
const compactCards = ref(app.settings.compactCards)
const autoplayPreviews = ref(app.settings.autoplayPreviews)

const showImportModal = ref(false)
const importFile = ref(null)
const showResetConfirm = ref(false)

function saveTheme() {
  app.setTheme(theme.value)
}

function saveSettings() {
  app.updateSettings({
    reducedMotion: reducedMotion.value,
    compactCards: compactCards.value,
    autoplayPreviews: autoplayPreviews.value
  })
}

function handleExport() {
  exportLocalData()
}

async function handleImport() {
  if (!importFile.value) return
  try {
    await importLocalData(importFile.value)
    alert('Data imported successfully! The page will reload.')
    location.reload()
  } catch (error) {
    alert('Failed to import data. Please check the file format.')
    console.error(error)
  }
}

function triggerImport() {
  document.getElementById('import-file').click()
}

function onFileChange(event) {
  importFile.value = event.target.files[0]
}

function resetAllData() {
  app.resetAll()
}
</script>

<template>
  <section class="page-container">
    <header class="page-header">
      <div>
        <div class="page-header__eyebrow">FLAIRD</div>
        <h1>Settings</h1>
        <p class="page-header__description">Theme, motion, card density, export/import, and local-data controls.</p>
      </div>
    </header>

    <div class="settings-sections">
      <div class="settings-section">
        <h2>Appearance</h2>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Theme</h3>
            <p>Choose your preferred color scheme.</p>
          </div>
          <div class="setting-control">
            <select v-model="theme" class="select" @change="saveTheme">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Reduce Animations</h3>
            <p>Minimize motion effects for accessibility.</p>
          </div>
          <div class="setting-control">
            <label class="toggle">
              <input type="checkbox" v-model="reducedMotion" @change="saveSettings" />
              <span class="toggle__slider"></span>
            </label>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Compact Cards</h3>
            <p>Use smaller cards in grids for more density.</p>
          </div>
          <div class="setting-control">
            <label class="toggle">
              <input type="checkbox" v-model="compactCards" @change="saveSettings" />
              <span class="toggle__slider"></span>
            </label>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Autoplay Previews</h3>
            <p>Automatically play video previews on hover.</p>
          </div>
          <div class="setting-control">
            <label class="toggle">
              <input type="checkbox" v-model="autoplayPreviews" @change="saveSettings" />
              <span class="toggle__slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Data Management</h2>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Export My Data</h3>
            <p>Download a JSON backup of your FLAIRD data.</p>
          </div>
          <div class="setting-control">
            <button class="btn btn--outline" @click="handleExport">Export Data</button>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Import Data</h3>
            <p>Restore from a previously exported backup file.</p>
          </div>
          <div class="setting-control">
            <button class="btn btn--outline" @click="showImportModal = true">Import Data</button>
            <input type="file" id="import-file" accept=".json" @change="onFileChange" style="display: none;" />
          </div>
        </div>
      </div>

      <div class="settings-section danger-zone">
        <h2>Danger Zone</h2>
        <div class="setting-row">
          <div class="setting-info">
            <h3>Reset Local Data</h3>
            <p>Permanently delete all your local FLAIRD data. This cannot be undone.</p>
          </div>
          <div class="setting-control">
            <button class="btn btn--danger" @click="showResetConfirm = true">Reset Data</button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showImportModal" @close="showImportModal = false; importFile = null" title="Import Data">
      <template #default>
        <p class="text-muted">Select a FLAIRD backup JSON file to restore your data. This will overwrite your current local data.</p>
        <input type="file" id="import-file-modal" accept=".json" @change="onFileChange" class="input" style="margin-top: 12px;" />
        <p v-if="importFile" class="text-muted" style="margin-top: 8px; font-size: 0.875rem;">{{ importFile.name }}</p>
      </template>
      <template #actions>
        <button class="btn btn--primary" @click="handleImport" :disabled="!importFile">Import</button>
        <button class="btn btn--ghost" @click="showImportModal = false; importFile = null">Cancel</button>
      </template>
    </Modal>

    <ConfirmDialog
      v-if="showResetConfirm"
      title="Reset Local Data"
      message="Are you sure? This will remove all your locally stored FLAIRD data including your account, library, reviews, and settings. This cannot be undone."
      @confirm="resetAllData"
      @cancel="showResetConfirm = false"
      confirm-text="Reset Data"
      confirm-class="btn--danger"
    />
  </section>
</template>
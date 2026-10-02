<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'
import MobileNav from './components/layout/MobileNav.vue'
import Footer from './components/layout/Footer.vue'
import { useAppStore } from './stores/appStore'

const appStore = useAppStore()

onMounted(() => {
  document.documentElement.dataset.theme = appStore.theme
  if (appStore.settings.reducedMotion) {
    document.body.classList.add('reduced-motion')
  }
})
</script>

<template>
  <div class="app-shell" :data-theme="appStore.theme">
    <Navbar />
    <div class="app-inner">
      <Sidebar />
      <main class="app-main">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
    <MobileNav />
    <Footer />
  </div>
</template>
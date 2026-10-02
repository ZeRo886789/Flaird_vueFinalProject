<template>
  <section class="landing page-container">
    <div class="hero">
      <div class="hero__content">
        <div class="hero__eyebrow">Anime & Manga Tracker</div>
        <h1>Track. <span class="text-gradient">Discover.</span> Connect.</h1>
        <p class="hero__copy">FLAIRD brings your anime, manga, progress, favorites, ratings, reviews, and community activity into one focused personal library.</p>
        <div class="hero__actions">
          <RouterLink class="btn btn--primary" to="/register">Create your library</RouterLink>
          <RouterLink class="btn" to="/anime">Explore titles</RouterLink>
        </div>
      </div>
    </div>

    <div class="features">
      <h2 class="features__title">Everything you need to organize your collection</h2>
      <div class="features__grid">
        <article class="feature-card">
          <div class="feature-card__icon">📚</div>
          <h3>Track Your Progress</h3>
          <p>Keep your anime episodes and manga chapters organized with detailed progress tracking.</p>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">📖</div>
          <h3>Build Your Library</h3>
          <p>Create your own personal collection with statuses, ratings, and favorites.</p>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">🔍</div>
          <h3>Discover New Titles</h3>
          <p>Browse anime and manga through filters, search, and curated recommendations.</p>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">💬</div>
          <h3>Connect With Community</h3>
          <p>Share reviews, comment on discussions, and interact with other fans.</p>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">📊</div>
          <h3>See Your Statistics</h3>
          <p>Understand your watching and reading habits with detailed analytics.</p>
        </article>
        <article class="feature-card">
          <div class="feature-card__icon">🎨</div>
          <h3>Customize Your Experience</h3>
          <p>Themes, compact mode, reduced motion, and data export/import.</p>
        </article>
      </div>
    </div>

    <div class="cta-section">
      <h2>Ready to organize your collection?</h2>
      <p>Start building your FLAIRD library today.</p>
      <RouterLink to="/register" class="btn btn--primary btn--lg">Create Account</RouterLink>
    </div>
  </section>
</template>
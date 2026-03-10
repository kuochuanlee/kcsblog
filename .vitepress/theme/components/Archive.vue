<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../data/posts.data.ts'

const postsByYear = computed(() => {
  const years: Record<string, any[]> = {}
  posts.forEach(post => {
    const year = new Date(post.date.time).getFullYear()
    if (!years[year]) years[year] = []
    years[year].push(post)
  })
  return Object.keys(years).sort((a, b) => Number(b) - Number(a)).map(year => ({
    year,
    posts: years[year]
  }))
})
</script>

<template>
  <div class="archive-container">
    <div v-for="group in postsByYear" :key="group.year" class="year-group">
      <h2 class="year-title">{{ group.year }}</h2>
      <div class="posts-list">
        <div v-for="post in group.posts" :key="post.url" class="post-item">
          <span class="post-date">{{ new Date(post.date.time).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' }) }}</span>
          <a :href="post.url" class="post-link">{{ post.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem; /* 移除頂部 padding */
}
.year-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--vp-c-text-1);
}
.post-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  padding-left: 1rem;
}
.post-date {
  font-family: monospace;
  color: var(--vp-c-text-2);
  margin-right: 1.5rem;
  width: 50px;
}
.post-link {
  font-size: 1.1rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}
.post-link:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}
</style>

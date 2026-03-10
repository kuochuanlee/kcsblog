<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../data/posts.data.ts'

const selectedCategory = ref<string | null>(null)

const categoriesWithPosts = computed(() => {
  const catMap: Record<string, any[]> = {}
  posts.forEach(post => {
    post.categories.forEach(cat => {
      if (!catMap[cat]) catMap[cat] = []
      catMap[cat].push(post)
    })
  })
  return Object.keys(catMap).sort().map(cat => ({
    name: cat,
    count: catMap[cat].length,
    posts: catMap[cat]
  }))
})

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return []
  return categoriesWithPosts.value.find(c => c.name === selectedCategory.value)?.posts || []
})

function selectCategory(catName: string) {
  selectedCategory.value = catName === selectedCategory.value ? null : catName
}
</script>

<template>
  <div class="categories-container">
    <div class="category-list">
      <div 
        v-for="cat in categoriesWithPosts" 
        :key="cat.name" 
        class="category-card"
        :class="{ active: selectedCategory === cat.name }"
        @click="selectCategory(cat.name)"
      >
        <span class="category-name">{{ cat.name }}</span>
        <span class="category-count">{{ cat.count }} 篇文章</span>
      </div>
    </div>

    <div v-if="selectedCategory" class="selected-category-posts">
      <h2 class="section-title">分類: {{ selectedCategory }}</h2>
      <div class="posts-list">
        <div v-for="post in filteredPosts" :key="post.url" class="post-row">
          <span class="post-date">{{ new Date(post.date.time).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}</span>
          <a :href="withBase(post.url)" class="post-link">{{ post.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.category-card {
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}
.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.category-card.active {
  background-color: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}
.category-name {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}
.category-count {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  display: inline-block;
}
.post-row {
  display: flex;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.post-date {
  font-family: monospace;
  color: var(--vp-c-text-2);
  margin-right: 1.5rem;
  width: 100px;
}
.post-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}
.post-link:hover {
  text-decoration: underline;
}
</style>

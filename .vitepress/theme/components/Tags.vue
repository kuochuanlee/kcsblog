<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as posts } from '../../data/posts.data.ts'

const selectedTag = ref<string | null>(null)

const tagsWithPosts = computed(() => {
  const tagsMap: Record<string, any[]> = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tagsMap[tag]) tagsMap[tag] = []
      tagsMap[tag].push(post)
    })
  })
  return Object.keys(tagsMap).sort().map(tag => ({
    name: tag,
    count: tagsMap[tag].length,
    posts: tagsMap[tag]
  }))
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  return tagsWithPosts.value.find(t => t.name === selectedTag.value)?.posts || []
})

function selectTag(tagName: string) {
  selectedTag.value = tagName === selectedTag.value ? null : tagName
}
</script>

<template>
  <div class="tags-container">
    <div class="tags-cloud">
      <button 
        v-for="tag in tagsWithPosts" 
        :key="tag.name" 
        class="tag-item"
        :class="{ active: selectedTag === tag.name }"
        @click="selectTag(tag.name)"
      >
        #{{ tag.name }} <span class="tag-count">({{ tag.count }})</span>
      </button>
    </div>

    <div v-if="selectedTag" class="selected-tag-posts">
      <h2 class="section-title">標籤: #{{ selectedTag }}</h2>
      <div class="posts-list">
        <div v-for="post in filteredPosts" :key="post.url" class="post-row">
          <span class="post-date">{{ new Date(post.date.time).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}</span>
          <a :href="post.url" class="post-link">{{ post.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tags-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}
.tag-item {
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vp-c-text-2);
}
.tag-item:hover {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.tag-item.active {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}
.tag-count {
  font-size: 0.8rem;
  opacity: 0.7;
}
.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
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
}
.post-link:hover {
  text-decoration: underline;
}
</style>

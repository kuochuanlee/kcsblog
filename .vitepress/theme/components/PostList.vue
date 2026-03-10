<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from '../../data/posts.data.ts'
</script>

<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.url" class="post-item">
      <a :href="withBase(post.url)" class="post-title">{{ post.title }}</a>
      <div class="post-meta">
        <span class="post-date">{{ post.date.string }}</span>
        <span class="post-divider">•</span>
        <span class="post-reading-time">{{ post.readingTime }} 分鐘閱讀</span>
      </div>
      <p v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt"></p>
      <div v-if="post.tags.length" class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  margin-top: 2rem;
}
.post-item {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s;
}
.post-title:hover {
  color: var(--vp-c-brand-2);
}
.post-meta {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
}
.post-divider {
  margin: 0 0.5rem;
}
.post-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  margin: 0.75rem 0;
}
.post-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.post-tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  color: var(--vp-c-text-2);
}
</style>

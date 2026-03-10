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
      <div v-if="post.excerpt" class="post-excerpt">
        {{ post.excerpt }}
      </div>
      
      <div class="post-footer">
        <a :href="withBase(post.url)" class="read-more">閱讀全文 →</a>
        <div v-if="post.tags.length" class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-list {
  margin-top: 2rem;
}
.post-item {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.post-title {
  font-size: 1.6rem;
  font-weight: 700;
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
  margin: 0.6rem 0 1rem;
}
.post-divider {
  margin: 0 0.5rem;
}
.post-excerpt {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--vp-c-text-1);
  margin: 1rem 0 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
}
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.read-more {
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
}
.read-more:hover {
  background-color: var(--vp-c-brand-1);
  color: white !important;
  text-decoration: none;
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

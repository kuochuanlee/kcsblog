<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { page, frontmatter } = useData()

const title = computed(() => frontmatter.value.title || page.value.title)

const dateString = computed(() => {
  const date = page.value.lastUpdated || frontmatter.value.date
  if (!date) return null
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
const isFunctionalPage = computed(() => {
  const titles = ['歸檔', '分類', '標籤']
  return titles.includes(title.value)
})
</script>

<template>
  <div v-if="!frontmatter.layout || frontmatter.layout === 'doc'" class="post-meta-container">
    <div class="meta-item-group">
      <!-- 文章標題 (略大) -->
      <div class="meta-item post-main-title">
        <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
        <span class="title-text" :class="{ 'no-divider': isFunctionalPage }">{{ title }}</span>
      </div>

      <!-- 其他資訊 (小一點) - 功能頁面隱藏日期 -->
      <div v-if="!isFunctionalPage" class="meta-sub-info">
        <!-- 分類 -->
        <div v-if="frontmatter.categories?.length" class="meta-item">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span v-for="cat in frontmatter.categories" :key="cat" class="meta-link">
            {{ cat }}
          </span>
        </div>

        <!-- 標籤 -->
        <div v-if="frontmatter.tags?.length" class="meta-item">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          <span v-for="tag in frontmatter.tags" :key="tag" class="meta-tag">
            {{ tag }}
          </span>
        </div>

        <!-- 日期 -->
        <div v-if="dateString" class="meta-item">
          <svg class="meta-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span class="meta-date">{{ dateString }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-meta-container {
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.meta-item-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  align-items: center;
}

.meta-svg {
  width: 1rem;
  height: 1rem;
  color: var(--vp-c-text-2); /* 預設灰白色調 */
}

.post-main-title {
  color: var(--vp-c-brand-1);
  font-weight: 700;
  font-size: 1.2rem;
}

.post-main-title .meta-svg {
  color: var(--vp-c-brand-1); /* 標題圖示跟著品牌色 */
}

.title-text {
  border-right: 1.5px solid var(--vp-c-divider);
  padding-right: 1.2rem;
}

.title-text.no-divider {
  border-right: none !important;
  padding-right: 0 !important;
}

.title-text.no-divider {
  border-right: none;
  padding-right: 0;
}

.meta-sub-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.meta-link {
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.meta-tag {
  background-color: var(--vp-c-bg-soft);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
}

.meta-date {
  font-style: italic;
}

/* 針對行動版調整 */
@media (max-width: 768px) {
  .post-meta-container {
    margin-top: -1rem;
  }
  .title-text {
    border-right: none;
    padding-right: 0;
  }
  .meta-item-group {
    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
  .meta-sub-info {
    gap: 0.5rem 1rem;
  }
}
</style>

import type { Theme } from 'vitepress'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import PostList from './components/PostList.vue'
import Archive from './components/Archive.vue'
import Tags from './components/Tags.vue'
import Categories from './components/Categories.vue'
import PostMeta from './components/PostMeta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostMeta)
    })
  },
  enhanceApp({ app }) {
    // 註冊全域組件
    app.component('PostList', PostList)
    app.component('Archive', Archive)
    app.component('Tags', Tags)
    app.component('Categories', Categories)
  }
} satisfies Theme

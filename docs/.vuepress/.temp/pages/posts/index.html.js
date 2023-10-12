export const data = JSON.parse("{\"key\":\"v-e1e3da16\",\"path\":\"/posts/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{\"layout\":\"Posts\"},\"headers\":[],\"git\":{},\"filePathRelative\":null}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}

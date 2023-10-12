export const data = JSON.parse("{\"key\":\"v-1a5d3af2\",\"path\":\"/.vuepress/aboutme/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{\"modules\":[\"BannerBrand\"],\"bannerBrand\":{\"bgImage\":\"/bg.svg\",\"title\":\"useRequest\",\"description\":\"一个帮助你管理网络请求的工具\",\"tagline\":\"基于Vue + Composition Api，响应式的网络请求状态、具备缓存能力、解决竞态问题、能够真正地取消网络请求、极致轻量化的一个工具库\",\"buttons\":[{\"text\":\"Guide\",\"link\":\"/docs/guide/introduce\"}]},\"isShowTitleInHome\":true},\"headers\":[],\"git\":{},\"filePathRelative\":\".vuepress/aboutme/README.md\"}")

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

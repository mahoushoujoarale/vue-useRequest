export const themeData = JSON.parse("{\"repo\":\"mahoushoujoarale/vue3-useRequest\",\"logo\":\"/logo.png\",\"navbar\":[{\"text\":\"文档\",\"link\":\"/document/\"},{\"text\":\"API参考\",\"link\":\"/api/\"},{\"text\":\"关于我\",\"children\":[{\"text\":\"Github\",\"link\":\"https://github.com/mahoushoujoarale\"},{\"text\":\"掘金\",\"link\":\"https://juejin.cn/user/3369351964272237/posts\"},{\"text\":\"简介\",\"link\":\"/aboutme/\"},{\"text\":\"支持\",\"link\":\"/donation/\"}]},{\"text\":\"ISSUES\",\"link\":\"https://github.com/mahoushoujoarale/vue3-useRequest/issues\"}],\"series\":{\"/document/\":[{\"text\":\"基础\",\"children\":[\"introduce\",\"usage\"],\"collapsible\":true},{\"text\":\"高级\",\"children\":[\"home\",\"series\",\"comments\"]}]}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}

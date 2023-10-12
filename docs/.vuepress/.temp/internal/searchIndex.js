export const searchIndex = [
  {
    "title": "",
    "headers": [],
    "path": "/timeline/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/posts/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/friendship-link/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/api/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "💫 About Me:",
    "headers": [],
    "path": "/aboutme/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/document/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "Buy Me A Coffee",
    "headers": [
      {
        "level": 2,
        "title": "WeChat & AliPay",
        "slug": "wechat-alipay",
        "link": "#wechat-alipay",
        "children": []
      }
    ],
    "path": "/donation/",
    "pathLocale": "/",
    "extraFields": []
  },
  {
    "title": "",
    "headers": [],
    "path": "/404.html",
    "pathLocale": "/",
    "extraFields": []
  }
]

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSearchIndex) {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ searchIndex }) => {
    __VUE_HMR_RUNTIME__.updateSearchIndex(searchIndex)
  })
}

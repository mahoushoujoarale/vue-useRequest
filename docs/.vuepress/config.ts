import { defineUserConfig } from 'vuepress';
import { recoTheme } from 'vuepress-theme-reco';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'useRequest',
  description: 'A library for manage your request for Vue + Composition API',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  theme: recoTheme({
    repo: 'mahoushoujoarale/vue-useRequest',
    logo: '/logo.png',
    navbar: [
      { text: '文档', link: '/document/guide' },
      { text: 'API参考', link: '/api/' },
      {
        text: '关于我',
        children: [
          { text: 'Github', link: 'https://github.com/mahoushoujoarale' },
          { text: '掘金', link: 'https://juejin.cn/user/3369351964272237/posts' },
          { text: '简介', link: '/aboutme/' },
          { text: '支持', link: '/donation/' },
        ],
      },
      { text: 'ISSUES', link: 'https://github.com/mahoushoujoarale/vue-useRequest/issues' },
    ],
    series: {
      '/document/': [
        {
          text: '介绍',
          children: ['guide', 'quick-start'],
        },
        {
          text: '文档',
          children: ['global-options', 'request', 'cache', 'cancel'],
        },
      ],
    },
  }),
});

import { defineUserConfig } from 'vuepress';
import { recoTheme } from 'vuepress-theme-reco';

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'useRequest',
  description: 'A library for manage your request for Vue + Composition API',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  theme: recoTheme({
    repo: 'mahoushoujoarale/vue3-useRequest',
    logo: '/logo.png',
    navbar: [
      { text: '文档', link: '/document/' },
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
      { text: 'ISSUES', link: 'https://github.com/mahoushoujoarale/vue3-useRequest/issues' },
    ],
    series: {
      '/document/': [
        {
          text: '基础',
          children: ['introduce', 'usage'],
          collapsible: true, // 默认展开，true 为折叠
        },
        {
          text: '高级',
          children: ['home', 'series', 'comments'],
        },
      ],
    },
  }),
});

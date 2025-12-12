// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Laby的博客',
  tagline: '探索现代Web开发的全部领域',
  favicon: 'img/logo.jpg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    experimental_faster: true, // Build acceleration
  },

  // Set the production url of your site here
  url: 'https://laby-umr.github.io',
  baseUrl: '/',

  // 性能优化：预连接和 DNS 预解析
  headTags: [
    // DNS 预解析
    {
      tagName: 'link',
      attributes: {
        rel: 'dns-prefetch',
        href: 'http://120.48.86.168:48080',
      },
    },
    // 预连接 API
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'http://120.48.86.168:48080',
        crossorigin: 'anonymous',
      },
    },
  ],

  // GitHub pages deployment config.
  organizationName: 'laby-umr', // GitHub org/user name.
  projectName: 'laby-blog-private', // repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  // i18n 配置 - 应用 3.9.2 优化
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        direction: 'ltr',
        htmlLang: 'zh-Hans',
        // 新特性：translate 标志（3.9+）
        translate: true, // 启用翻译
      },
      'en': {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en',
        translate: true,
      },
    },
  },

  plugins: [
    // PWA 支持
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.jpg',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#667eea',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black-translucent',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/logo.jpg',
          },
        ],
      },
    ],
    [
      'docusaurus-plugin-module-alias',
      {
        alias: {
          '@site/blog/authors': './blog/authors',
        },
      },
    ],
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        // 配置选项
        hashed: true, // 为了加快构建速度，推荐启用哈希
        language: ["en", "zh"], // 支持的语言
        indexDocs: true,
        indexBlog: true,
        docsRouteBasePath: "/docs",
        blogRouteBasePath: "/blog",
        docsDir: "docs",
        blogDir: "blog",
        highlightSearchTermsOnTargetPage: true,
        searchBarShortcutHint: false,
        searchBarShortcut: false, // 禁用快捷键以避免错误
      },
    ],
    // Blog API 配置插件
    function blogApiConfigPlugin(context, options) {
      return {
        name: 'blog-api-config-plugin',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'script',
                innerHTML: `
                  window.blogApiConfig = {
                    apiBaseUrl: '${process.env.NODE_ENV === 'production' 
                      ? 'http://120.48.86.168:48080' 
                      : 'http://120.48.86.168:48080'}'
                  };
                `,
              },
            ],
          };
        },
      };
    },
  ],

  // Markdown 配置 - 应用 3.9.2 新特性
  markdown: {
    mermaid: true,
    // 新特性：emoji 配置（3.9+）
    emoji: true, // 启用 emoji 自动转换
    // 新特性：Markdown 钩子函数（3.9+）
    hooks: {
      // 处理损坏的 Markdown 链接
      onBrokenMarkdownLinks: (link) => {
        console.warn(`Broken markdown link detected: ${link}`);
        return undefined; // 返回 undefined 使用默认行为，或返回备用 URL
      },
      // 处理损坏的 Markdown 图片
      onBrokenMarkdownImages: (image) => {
        console.warn(`Broken markdown image detected: ${image}`);
        return '/img/placeholder.png'; // 返回占位图片
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/MasterLiu93/blog-web/tree/main/',
          routeBasePath: 'docs',
          path: 'docs',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // 使用默认日期格式
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/MasterLiu93/blog-web/tree/main/',
          // 优化：增加每页文章数到 10 篇，减少分页请求
          postsPerPage: 10,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '全部博客文章',
          blogDescription: '关注前后端开发、DevOps和系统架构设计的技术博客',
          // 优化：添加摘要截断标记
          truncateMarker: /<!--\s*truncate\s*-->/,
          feedOptions: {
            type: 'all',
            title: 'Laby的博客',
            description: '关注前后端开发、DevOps和系统架构设计的技术博客',
            copyright: `Copyright © ${new Date().getFullYear()} Laby的博客`,
            language: 'zh-CN',
          },
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // Add Mermaid theme
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 设置图片亮暗模式
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      // 添加Giscus评论系统
      giscus: {
        repo: 'MasterLiu93/web-blog',
        repoId: 'R_kgDOPZrqqQ',
        category: 'Announcements',
        categoryId: 'DIC_kwDOPZrqqc4Ct73X',
        mapping: 'pathname',
        strict: '0',
        reactionsEnabled: '1',
        emitMetadata: '0',
        inputPosition: 'bottom',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN',
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Laby的博客',
        logo: {
          alt: 'Laby的博客Logo',
          src: 'img/logo.jpg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '知识库导航',
          },
          {to: '/blog', label: '博客', position: 'left'},
          {to: '/projects', label: '项目', position: 'left'},
          {to: '/music', label: '音乐', position: 'left'},
          {to: '/contact', label: '联系我', position: 'left'},
          {to: '/about', label: '关于我', position: 'right'},
          // 添加语言切换菜单
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/MasterLiu93',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // Footer配置 - 使用自定义Footer组件
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} Laby的博客. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'java', 'scala', 'go', 'rust', 'swift', 
          'kotlin', 'csharp', 'php', 'python', 'bash', 
          'powershell', 'sql', 'typescript', 'jsx', 'tsx',
          'yaml', 'json', 'css', 'markdown', 'diff'
        ],
        // 启用代码行高亮功能
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          }
        ],
        defaultLanguage: 'javascript',
      },
      // 添加元数据，有助于SEO
      metadata: [
        {name: 'keywords', content: 'blog, javascript, typescript, react, vue, java, spring, 前端, 后端, 全栈开发'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {property: 'og:type', content: 'website'},
        {property: 'og:title', content: 'Laby的博客 - 探索现代Web开发的全部领域'},
        {property: 'og:description', content: '关注前后端开发、DevOps和系统架构设计的技术博客'},
      ],
    }),
};

// 直接导出配置对象
module.exports = config;

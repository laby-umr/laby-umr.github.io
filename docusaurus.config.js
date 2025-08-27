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
  url: 'https://masterliu93.github.io',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'MasterLiu93', // GitHub org/user name.
  projectName: 'blog-web', // repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        direction: 'ltr',
        htmlLang: 'zh-Hans',
      },
      'en': {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en',
      },
    },
  },

  plugins: [
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
        searchBarShortcutHint: false
      },
    ],
  ],

  // Add Mermaid markdown support
  markdown: {
    mermaid: true,
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
          postsPerPage: 5,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: '全部博客文章',
          blogDescription: '关注前后端开发、DevOps和系统架构设计的技术博客',
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
      footer: {
        style: 'dark',
        links: [
          {
            title: '内容',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: '知识库导航',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社交账号',
            items: [
              {
                label: '项目',
                to: '/projects',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MasterLiu93',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '关于我',
                to: '/about',
              },
            ],
          },
        ],
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

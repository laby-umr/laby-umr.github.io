# Algolia DocSearch v4 + AI 助手配置指南

## 📋 前提条件

### 1. 申请 Algolia DocSearch
访问：https://docsearch.algolia.com/apply/

**申请技巧**：
- ✅ 强调这是**技术知识库**，而不仅仅是博客
- ✅ 突出知识库部分（frontend、backend 文档）
- ✅ 说明对开发者社区的价值
- ❌ 不要只说是个人博客

### 2. 获取凭证
申请通过后，Algolia 会提供：
```
appId: "YOUR_APP_ID"
apiKey: "YOUR_SEARCH_API_KEY"  
indexName: "YOUR_INDEX_NAME"
```

### 3. 创建 AI Assistant（可选）
在 Algolia 控制台创建 AskAI assistant，获取：
```
assistantId: "YOUR_ASSISTANT_ID"
```

## 🔧 配置步骤

### Step 1: 安装依赖

```bash
# 卸载本地搜索插件
npm uninstall @easyops-cn/docusaurus-search-local

# 安装 DocSearch v4
npm install @docsearch/react@4
```

### Step 2: 更新 docusaurus.config.js

#### 移除本地搜索配置
删除这部分：
```javascript
// ❌ 删除
[
  require.resolve("@easyops-cn/docusaurus-search-local"),
  {
    // ...
  },
],
```

#### 添加 Algolia 配置
在 `themeConfig` 中添加：

```javascript
themeConfig: {
  // ... 其他配置
  
  // ✅ 添加 Algolia DocSearch v4 配置
  algolia: {
    // Algolia 提供的凭证
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'YOUR_INDEX_NAME',
    
    // 可选：AI 助手配置（DocSearch v4 新特性）
    askAi: {
      assistantId: 'YOUR_ASSISTANT_ID',
      // AI 助手的显示文本
      placeholder: '向 AI 提问...',
      // 自定义提示
      systemMessage: '你是一个帮助开发者的技术助手。',
    },
    
    // 可选：上下文搜索
    contextualSearch: true,
    
    // 可选：搜索参数
    searchParameters: {
      facetFilters: ['language:zh-Hans'],
    },
    
    // 可选：搜索页面路径
    searchPagePath: 'search',
  },
}
```

### Step 3: 完整配置示例

```javascript
// docusaurus.config.js
module.exports = {
  // ...
  
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    
    // Algolia DocSearch v4 配置
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || 'YOUR_APP_ID',
      apiKey: process.env.ALGOLIA_API_KEY || 'YOUR_SEARCH_API_KEY',
      indexName: process.env.ALGOLIA_INDEX_NAME || 'YOUR_INDEX_NAME',
      
      // DocSearch v4 + AI 助手
      askAi: {
        assistantId: process.env.ALGOLIA_ASSISTANT_ID || 'YOUR_ASSISTANT_ID',
        placeholder: '向 AI 助手提问技术问题...',
        systemMessage: `你是 Laby 技术博客的 AI 助手。
你可以回答关于前端开发、后端开发、系统设计、Java、Spring、React、Vue 等技术问题。
基于博客的知识库内容提供准确的答案。`,
        // AI 助手按钮文本
        buttonLabel: 'AI 助手',
      },
      
      // 上下文搜索（多语言站点）
      contextualSearch: true,
      
      // 搜索参数
      searchParameters: {
        // 只搜索中文内容（如果需要）
        facetFilters: ['language:zh-Hans'],
        // 高亮搜索词
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      },
      
      // 搜索页面路径
      searchPagePath: 'search',
      
      // 自定义样式
      placeholder: '搜索文档...',
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索文档',
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询',
            resetButtonAriaLabel: '清除查询',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消',
          },
          footer: {
            selectText: '选择',
            navigateText: '导航',
            closeText: '关闭',
            searchByText: '搜索提供方',
          },
        },
      },
    },
    
    // ... 其他配置
  },
};
```

### Step 4: 环境变量配置（推荐）

创建 `.env` 文件：
```bash
# .env
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_search_api_key
ALGOLIA_INDEX_NAME=your_index_name
ALGOLIA_ASSISTANT_ID=your_assistant_id
```

创建 `.env.example` 文件：
```bash
# .env.example
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=
ALGOLIA_ASSISTANT_ID=
```

添加到 `.gitignore`：
```bash
# .gitignore
.env
```

## 🎨 AI 助手功能特性

### 对话式搜索
用户可以用自然语言提问：
- "如何实现 React 组件懒加载？"
- "Spring Boot 和 Spring MVC 的区别是什么？"
- "什么是分布式系统的 CAP 理论？"

### AI 功能
- 📖 基于你的文档内容回答
- 🔍 智能理解问题意图
- 💬 提供对话式体验
- 🎯 引用相关文档片段

## 🧪 测试配置

### 1. 启动开发服务器
```bash
npm start
```

### 2. 测试搜索
- 点击搜索框
- 输入关键词测试普通搜索
- 点击 AI 助手按钮测试 AI 功能

### 3. 检查控制台
查看是否有配置错误或警告

## 📊 对比：本地搜索 vs Algolia DocSearch v4

| 功能 | 本地搜索 | Algolia DocSearch v4 |
|------|----------|---------------------|
| 费用 | 免费 ✅ | 免费（需申请）✅ |
| AI 助手 | 无 ❌ | 有 ✅ |
| 搜索速度 | 快 ✅ | 非常快 ✅ |
| 搜索质量 | 一般 | 优秀 ✅ |
| 配置难度 | 简单 ✅ | 中等 |
| 数据隐私 | 完全本地 ✅ | 第三方服务 |
| 搜索分析 | 无 ❌ | 有 ✅ |
| 依赖性 | 无依赖 ✅ | 依赖 Algolia |

## ⚠️ 注意事项

### 1. API Key 安全
- ✅ 使用环境变量
- ✅ 不要提交到 Git
- ✅ 使用 Search-Only API Key（不是 Admin API Key）

### 2. 索引更新
Algolia 会自动爬取你的网站，或者你可以手动配置：
- 使用 Algolia Crawler（推荐）
- 使用 DocSearch Scraper
- 部署时自动更新索引

### 3. 费用
- DocSearch Program 对开源项目**完全免费**
- 如果被拒绝，付费方案起价约 $1/月（适合个人）

## 🔗 参考资源

- [Algolia DocSearch 申请](https://docsearch.algolia.com/apply/)
- [DocSearch v4 文档](https://docsearch.algolia.com/docs/v4/)
- [AskAI 功能文档](https://docsearch.algolia.com/docs/v4/askai)
- [Docusaurus 搜索配置](https://docusaurus.io/docs/search)

## 🎯 建议

### 如果您的目标是个人博客
**建议：保持使用本地搜索** ✅
- 已经足够好用
- 完全免费且无依赖
- 配置简单，维护方便

### 如果您强调技术知识库
**可以尝试申请 Algolia** 🚀
- 强调知识库的技术价值
- 突出对开发者的帮助
- AI 助手能提升用户体验

---

**创建时间**: 2025-12-12  
**适用版本**: Docusaurus 3.9.2+

// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 * - create an ordered group of docs
 * - render a sidebar for each doc of that group
 * - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 *
 * * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // 自定义侧边栏配置，使用中文显示但对应英文URL路径
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '前端开发',
      link: {
        type: 'generated-index',
        description: '前端开发相关的技术文档、框架使用和最佳实践',
        slug: 'frontend' // 使用slug属性指定英文路径
      },
      items: [
        'frontend/frontend-intro',
        {
          type: 'category',
          label: 'HTML和CSS',
          items: ['frontend/html-css/html-basics', 'frontend/html-css/css-basics', 'frontend/html-css/modern-layouts']
        },
        {
          type: 'category',
          label: 'JavaScript',
          items: ['frontend/javascript/js-basics', 'frontend/javascript/es6-plus', 'frontend/javascript/async-js']
        },
        {
          type: 'category',
          label: 'React',
          items: ['frontend/react/react-basics', 'frontend/react/hooks', 'frontend/react/state-management']
        },
        {
          type: 'category',
          label: '移动应用开发',
          items: ['frontend/mobile-dev/mobile-intro', 'frontend/mobile-dev/react-native', 'frontend/mobile-dev/flutter', 'frontend/mobile-dev/pwa']
        }
      ]
    },
    {
      type: 'category',
      label: '后端开发',
      link: {
        type: 'generated-index',
        description: 'Java 后端开发完全指南，包括Java基础、集合框架、并发编程、JVM、Spring框架等',
        slug: 'backend' // 使用slug属性指定英文路径
      },
      items: [
        'backend/backend-intro',
        {
          type: 'category',
          label: 'Java基础',
          items: [
            'backend/java-basics/data-types',
            'backend/java-basics/oop',
            'backend/java-basics/string',
            'backend/java-basics/exceptions',
            'backend/java-basics/generics',
            'backend/java-basics/reflection',
            'backend/java-basics/annotations',
            'backend/java-basics/lambda',
            'backend/java-basics/stream-api',
          ]
        },
        {
          type: 'category',
          label: 'Java集合框架',
          items: [
            'backend/java-collections/collection-interface',
            'backend/java-collections/list',
            'backend/java-collections/set',
            'backend/java-collections/map',
            'backend/java-collections/queue',
            'backend/java-collections/collection-utils',
            'backend/java-collections/deduplication',
          ]
        },
        {
          type: 'category',
          label: '并发编程',
          items: [
            'backend/concurrency/thread-basics',
            'backend/concurrency/thread-safety',
            'backend/concurrency/threadlocal',
            'backend/concurrency/locks',
            'backend/concurrency/concurrent-containers',
            'backend/concurrency/concurrent-utils',
            'backend/concurrency/atomic-classes',
            'backend/concurrency/thread-pool',
            'backend/concurrency/completable-future',
          ]
        },
        {
          type: 'category',
          label: 'JVM',
          items: [
            'backend/jvm/memory-model',
            'backend/jvm/class-loading',
            'backend/jvm/garbage-collection',
            'backend/jvm/bytecode',
            'backend/jvm/jvm-tuning',
          ]
        },
        {
          type: 'category',
          label: 'Spring框架',
          items: [
            'backend/spring/ioc',
            'backend/spring/aop',
            'backend/spring/spring-mvc',
            'backend/spring/spring-boot',
            'backend/spring/spring-cloud',
            'backend/spring/transaction',
          ]
        },
        {
          type: 'category',
          label: '数据库与ORM',
          items: [
            'backend/database-orm/database-intro',
            'backend/database-orm/mysql',
            'backend/database-orm/mybatis',
            'backend/database-orm/redis',
            'backend/database-orm/mybatis-plus',
          ]
        },
        {
          type: 'category',
          label: '微服务',
          items: [
            'backend/microservices/service-discovery',
            'backend/microservices/api-gateway',
            'backend/microservices/circuit-breaker',
            'backend/microservices/config-center',
            'backend/microservices/distributed-tracing',
          ]
        },
        {
          type: 'category',
          label: '分布式系统',
          items: [
            'backend/distributed-systems/distributed-theory',
            'backend/distributed-systems/distributed-cache',
            'backend/distributed-systems/distributed-lock',
            'backend/distributed-systems/distributed-transaction',
            'backend/distributed-systems/distributed-search',
          ]
        },
        {
          type: 'category',
          label: '消息队列',
          items: [
            'backend/message-queues/kafka',
            'backend/message-queues/rabbitmq',
            'backend/message-queues/rocketmq',
          ]
        },
        {
          type: 'category',
          label: '网络编程',
          items: [
            'backend/network-programming/tcp-ip',
            'backend/network-programming/http-https',
            'backend/network-programming/socket',
            'backend/network-programming/netty',
          ]
        },
        {
          type: 'category',
          label: '设计模式',
          items: [
            'backend/design-patterns/code-quality-intro',
            'backend/design-patterns/creational-patterns',
            'backend/design-patterns/structural-patterns',
            'backend/design-patterns/behavioral-patterns',
          ]
        },
        {
          type: 'category',
          label: '系统设计',
          items: [
            'backend/system-design/devops-intro',
            'backend/system-design/high-availability',
            'backend/system-design/high-performance',
            'backend/system-design/high-concurrency',
            'backend/system-design/circuit-breaking',
            'backend/system-design/fallback',
            'backend/system-design/rate-limiting',
          ]
        }
      ]
    }
  ]
};

export default sidebars;

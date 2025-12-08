import React, { useState } from 'react';
import { Bubble, Sender, ThoughtChain, Attachments, Prompts, Welcome, Suggestion } from '@ant-design/x';
import { RobotOutlined, CloseOutlined, FileTextOutlined, LinkOutlined, CodeOutlined } from '@ant-design/icons';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  // Demo 数据 - 使用 Ant Design X 支持的格式
  const [messages, setMessages] = useState([
    {
      key: '1',
      role: 'ai',
      content: '👋 你好！我是 Laby 的技术助手\n\n下面展示 Ant Design X 的各种渲染效果：'
    },
    {
      key: '2',
      role: 'local',
      content: '展示一下文本和 Markdown'
    },
    {
      key: '3',
      role: 'ai',
      content: `## Spring Cloud 核心组件

**服务注册与发现**
- Eureka - Netflix 开源的服务注册中心
- Nacos - 阿里巴巴开源的服务注册与配置中心

**API 网关**
- Gateway - Spring Cloud 官方网关
- Zuul - Netflix 开源的 API 网关

**配置中心**
- Config Server - 集中化配置管理
- Nacos Config - 动态配置服务

**负载均衡**
- LoadBalancer - 客户端负载均衡
- Ribbon - Netflix 负载均衡器`
    },
    {
      key: '4',
      role: 'local',
      content: '展示思维链'
    },
    {
      key: '5',
      role: 'ai',
      content: (
        <ThoughtChain
          items={[
            {
              status: 'success',
              title: '分析需求',
              description: '理解用户的技术问题'
            },
            {
              status: 'success',
              title: '搜索文档',
              description: '在知识库中查找相关内容'
            },
            {
              status: 'success',
              title: '整理答案',
              description: '组织结构化的回复内容'
            },
            {
              status: 'pending',
              title: '生成回复',
              description: '正在生成最终答案...'
            }
          ]}
        />
      )
    },
    {
      key: '6',
      role: 'local',
      content: '推荐一些学习资源'
    },
    {
      key: '7',
      role: 'ai',
      content: `📚 **推荐学习资源**

🔧 [Spring Cloud 微服务架构](/docs/backend/microservices)
完整的微服务架构设计与实践

📝 [Java 并发编程](/docs/interview/java-并发)
深入理解 Java 并发机制

🏗️ [WMS 系统设计](/docs/projectDesign/wms-system-design)
企业级仓库管理系统完整方案

💾 [MySQL 优化实战](/docs/interview/mysql-interview)
数据库性能优化技巧与实践`
    },
    {
      key: '8',
      role: 'local',
      content: '展示代码示例'
    },
    {
      key: '9',
      role: 'ai',
      content: `**Spring Boot 启动类示例**

\`\`\`java
@SpringBootApplication
@EnableDiscoveryClient
public class Application {
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
\`\`\`

**配置文件 application.yml**

\`\`\`yaml
spring:
  application:
    name: demo-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
server:
  port: 8080
\`\`\``
    },
    {
      key: '10',
      role: 'local',
      content: '系统架构图'
    },
    {
      key: '11',
      role: 'ai',
      content: `**微服务架构设计**

\`\`\`mermaid
graph TB
    A[客户端] --> B[API Gateway]
    B --> C[认证服务]
    B --> D[用户服务]
    B --> E[订单服务]
    D --> F[(MySQL)]
    E --> F
    E --> G[(Redis)]
\`\`\`

**核心特性：**
• 服务注册与发现
• 统一网关入口
• 分布式配置
• 熔断降级
• 链路追踪`
    },
    {
      key: '12',
      role: 'local',
      content: '性能指标'
    },
    {
      key: '13',
      role: 'ai',
      content: `📊 **系统性能指标**

| 指标 | 数值 | 状态 |
|------|------|------|
| QPS | 10,000+ | ✅ 优秀 |
| 响应时间 | <100ms | ✅ 优秀 |
| 可用性 | 99.99% | ✅ 优秀 |
| 并发用户 | 50,000+ | ✅ 良好 |

**优化建议：**
1. 使用 Redis 缓存热点数据
2. 数据库读写分离
3. CDN 加速静态资源
4. 消息队列削峰填谷`
    },
    {
      key: '14',
      role: 'local',
      content: '展示列表'
    },
    {
      key: '15',
      role: 'ai',
      content: `**Java 面试题分类**

**基础知识** ⭐⭐
• 数据类型与变量
• 面向对象特性

**并发编程** ⭐⭐⭐⭐
• 线程创建与管理
• 锁机制详解

**JVM 原理** ⭐⭐⭐⭐⭐
• 内存模型
• 垃圾回收`
    },
    {
      key: '16',
      role: 'local',
      content: '展示附件'
    },
    {
      key: '17',
      role: 'ai',
      content: (
        <div>
          <p>📎 **相关文档附件**</p>
          <Attachments
            items={[
              {
                name: 'Spring Cloud 架构设计.pdf',
                size: '2.5 MB',
                icon: <FileTextOutlined />
              },
              {
                name: 'Java 面试题汇总.docx',
                size: '1.8 MB',
                icon: <FileTextOutlined />
              },
              {
                name: 'WMS 系统设计文档.pdf',
                size: '3.2 MB',
                icon: <FileTextOutlined />
              }
            ]}
          />
        </div>
      )
    },
    {
      key: '18',
      role: 'local',
      content: '给我一些快捷提示'
    },
    {
      key: '19',
      role: 'ai',
      content: (
        <div>
          <p>💡 **你可以问我：**</p>
          <Prompts
            items={[
              { key: '1', label: '🔧 Spring Cloud 微服务架构' },
              { key: '2', label: '📝 Java 并发编程详解' },
              { key: '3', label: '🏗️ WMS 系统设计方案' },
              { key: '4', label: '💾 MySQL 性能优化技巧' },
              { key: '5', label: '🔍 Redis 缓存实战' },
              { key: '6', label: '🌐 分布式系统设计' }
            ]}
          />
        </div>
      )
    },
    {
      key: '20',
      role: 'local',
      content: '展示更多内容格式'
    },
    {
      key: '21',
      role: 'ai',
      content: `### 🎯 技术栈推荐

**后端技术**
1. Spring Boot - 快速开发框架
2. Spring Cloud - 微服务生态
3. MyBatis Plus - ORM 框架
4. Redis - 缓存中间件

**前端技术**
1. React 19 - UI 框架
2. Ant Design - 组件库
3. TypeScript - 类型安全
4. Vite - 构建工具

> 💡 提示：选择合适的技术栈能大幅提升开发效率！`
    }
  ]);

  const handleSend = async (value) => {
    if (!value.trim()) return;
    
    const userMessage = {
      key: Date.now().toString(),
      role: 'local',
      content: value
    };
    setMessages(prev => [...prev, userMessage]);
    setContent('');
    
    // 模拟 AI 回复
    setTimeout(() => {
      const aiMessage = {
        key: (Date.now() + 1).toString(),
        role: 'ai',
        content: `收到你的问题："${value}"\n\n这是一个演示回复，展示了如何使用 Ant Design X 的 Bubble 组件。`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label="打开 AI 助手"
        >
          <RobotOutlined className={styles.icon} />
          <span className={styles.badge}>AI</span>
        </button>
      )}

      {/* AI 助手面板 */}
      {isOpen && (
        <div className={styles.assistantPanel}>
          {/* 头部 */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <RobotOutlined className={styles.headerIcon} />
              <div className={styles.headerText}>
                <h3>AI 助手</h3>
                <span className={styles.status}>
                  <span className={styles.statusDot}></span>
                  在线
                </span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="关闭"
            >
              <CloseOutlined />
            </button>
          </div>

          {/* 消息列表 - 使用 Ant Design X 的 Bubble.List */}
          <div className={styles.messagesContainer}>
            <Bubble.List items={messages} />
          </div>

          {/* 输入框 - 使用 Ant Design X 的 Sender */}
          <div className={styles.senderWrapper}>
            <Sender
              value={content}
              onChange={setContent}
              onSubmit={handleSend}
              placeholder="输入你的问题..."
            />
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { Bubble, Sender, Attachments, ThoughtChain } from '@ant-design/x';
import { RobotOutlined, CloseOutlined, SendOutlined, FileTextOutlined, CheckCircleOutlined, LoadingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

/**
 * AI 博客助手组件
 * 提供智能问答、文章推荐、技术咨询等功能
 */
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  // Demo 数据展示所有渲染效果
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'ai',
      content: '👋 你好！我是 Laby 的技术助手\n\n我可以展示各种丰富的内容格式，包括：文本、列表、表格、代码、链接等。'
    },
    {
      id: '2',
      role: 'user',
      content: '展示一下 Spring Cloud 的核心组件'
    },
    {
      id: '3',
      role: 'ai',
      content: {
        type: 'rich',
        title: '🔧 Spring Cloud 核心组件',
        items: [
          { icon: '🔍', name: 'Eureka', desc: '服务注册与发现' },
          { icon: '⚙️', name: 'Config', desc: '配置中心' },
          { icon: '🚪', name: 'Gateway', desc: 'API 网关' },
          { icon: '⚖️', name: 'LoadBalancer', desc: '负载均衡' },
          { icon: '🔌', name: 'Feign', desc: '声明式服务调用' },
          { icon: '🛡️', name: 'Hystrix', desc: '熔断器' }
        ]
      }
    },
    {
      id: '4',
      role: 'user',
      content: 'Java 面试题有哪些分类？'
    },
    {
      id: '5',
      role: 'ai',
      content: {
        type: 'table',
        title: '📝 Java 面试题分类',
        headers: ['分类', '难度', '题目数', '推荐指数'],
        rows: [
          ['Java 基础', '⭐⭐', '50+', '⭐⭐⭐⭐⭐'],
          ['并发编程', '⭐⭐⭐⭐', '30+', '⭐⭐⭐⭐⭐'],
          ['JVM 原理', '⭐⭐⭐⭐⭐', '25+', '⭐⭐⭐⭐'],
          ['Spring 框架', '⭐⭐⭐', '40+', '⭐⭐⭐⭐⭐'],
          ['数据库', '⭐⭐⭐', '35+', '⭐⭐⭐⭐']
        ]
      }
    },
    {
      id: '6',
      role: 'user',
      content: '推荐一些学习资源'
    },
    {
      id: '7',
      role: 'ai',
      content: {
        type: 'links',
        title: '📚 推荐学习资源',
        links: [
          { title: 'Spring Cloud 微服务架构', url: '/docs/backend/microservices', desc: '完整的微服务架构设计' },
          { title: 'Java 并发编程', url: '/docs/interview/java-并发', desc: '深入理解并发机制' },
          { title: 'WMS 系统设计', url: '/docs/projectDesign/wms-system-design', desc: '企业级仓库管理系统' },
          { title: 'MySQL 优化实战', url: '/docs/interview/mysql-interview', desc: '数据库性能优化技巧' }
        ]
      }
    },
    {
      id: '8',
      role: 'user',
      content: '展示一段代码示例'
    },
    {
      id: '9',
      role: 'ai',
      content: {
        type: 'code',
        title: '💻 Spring Boot 启动类示例',
        language: 'java',
        code: `@SpringBootApplication
@EnableDiscoveryClient
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`
      }
    },
    {
      id: '10',
      role: 'user',
      content: '系统架构是怎样的？'
    },
    {
      id: '11',
      role: 'ai',
      content: {
        type: 'thinking',
        steps: [
          { status: 'success', title: '分析需求', desc: '理解系统功能需求' },
          { status: 'success', title: '设计架构', desc: '选择微服务架构' },
          { status: 'success', title: '技术选型', desc: 'Spring Cloud + MySQL + Redis' },
          { status: 'loading', title: '生成方案', desc: '正在整理架构文档...' }
        ]
      }
    },
    {
      id: '12',
      role: 'ai',
      content: {
        type: 'cards',
        title: '🏗️ 系统设计方案',
        cards: [
          { icon: '🏪', title: 'WMS 仓库管理', desc: '智能仓储解决方案', tag: '热门' },
          { icon: '👥', title: 'CRM 客户管理', desc: '客户关系管理系统', tag: '推荐' },
          { icon: '📦', title: 'OMS 订单管理', desc: '高并发订单处理', tag: '新' },
          { icon: '🔧', title: 'ERP 资源规划', desc: '企业资源管理', tag: '' }
        ]
      }
    },
    {
      id: '13',
      role: 'user',
      content: '性能指标如何？'
    },
    {
      id: '14',
      role: 'ai',
      content: {
        type: 'metrics',
        title: '📊 系统性能指标',
        metrics: [
          { label: 'QPS', value: '10,000+', trend: 'up', color: '#52c41a' },
          { label: '响应时间', value: '<100ms', trend: 'down', color: '#52c41a' },
          { label: '可用性', value: '99.99%', trend: 'stable', color: '#1890ff' },
          { label: '并发用户', value: '50,000+', trend: 'up', color: '#faad14' }
        ]
      }
    }
  ]);

  // 预设提示词
  const promptItems = [
    {
      key: '1',
      label: '🔧 Spring Cloud 微服务',
      description: '了解微服务架构设计'
    },
    {
      key: '2',
      label: '📝 Java 面试准备',
      description: '查看高频面试题'
    },
    {
      key: '3',
      label: '🏗️ 系统设计案例',
      description: 'WMS/CRM/ERP 设计'
    },
    {
      key: '4',
      label: '💻 前端开发指南',
      description: 'React/Vue 技术栈'
    }
  ];

  // 处理发送消息
  const handleSend = async (value) => {
    if (!value.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: value
    };
    setMessages(prev => [...prev, userMessage]);
    setContent('');

    // 模拟 AI 回复（实际应该调用后端 API）
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(value)
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // 生成 AI 回复（临时模拟，实际应该调用 AI API）
  const generateAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('spring') || lowerQuestion.includes('微服务')) {
      return '🔧 **Spring Cloud 微服务架构**\n\n为你整理了以下学习资源：\n\n**核心组件**\n• 服务注册发现 - Eureka/Nacos\n• 配置中心 - Config Server\n• API 网关 - Gateway\n• 负载均衡 - LoadBalancer\n\n**推荐阅读**\n📖 [微服务架构文档](/docs/backend/microservices)\n🎯 [WMS 系统设计](/docs/projectDesign/wms-system-design)\n\n💡 想深入了解哪个组件？';
    }
    
    if (lowerQuestion.includes('面试') || lowerQuestion.includes('interview')) {
      return '📝 **Java 面试题库**\n\n**基础知识**\n• [Java 基础](/docs/interview/java-基础)\n• [并发编程](/docs/interview/java-并发)\n• [JVM 原理](/docs/interview/java-虚拟机)\n\n**框架技术**\n• [Spring 框架](/docs/interview/java-spring)\n\n**数据库**\n• [MySQL](/docs/interview/mysql-interview)\n• [Redis](/docs/interview/Redis-interview)\n\n🎯 选择一个方向开始准备吧！';
    }
    
    if (lowerQuestion.includes('系统设计') || lowerQuestion.includes('design')) {
      return '🏗️ **系统设计方案**\n\n**企业级系统**\n• [WMS 仓库管理](/docs/projectDesign/wms-system-design)\n• [CRM 客户管理](/docs/projectDesign/crm-system-design)\n• [ERP 资源规划](/docs/projectDesign/erp-system-design)\n• [OMS 订单管理](/docs/projectDesign/oms-system-design)\n\n**创新技术**\n• [数字孪生系统](/docs/projectDesign/digital-twin-system-design)\n\n✨ 每个方案都有完整的架构图和代码';
    }
    
    return `💭 收到你的问题了！\n\n"${question}"\n\n我可以帮你：\n• 🔍 搜索技术文档\n• 📚 推荐学习资源\n• 💡 解答技术问题\n• 🎯 系统设计建议\n\n试试点击下方的快捷问题，或者换个方式提问吧！`;
  };

  // 处理提示词点击
  const handlePromptClick = (item) => {
    const questionMap = {
      '1': 'Spring Cloud 微服务架构',
      '2': 'Java 面试题',
      '3': '系统设计方案',
      '4': '前端开发技术'
    };
    handleSend(questionMap[item.key] || item.label);
  };

  // 渲染富文本内容
  const renderContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }

    switch (content.type) {
      case 'rich': // 列表项
        return (
          <div className={styles.richContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <div className={styles.itemsList}>
              {content.items.map((item, idx) => (
                <div key={idx} className={styles.listItem}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <div className={styles.itemContent}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDesc}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'table': // 表格
        return (
          <div className={styles.tableContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {content.headers.map((header, idx) => (
                      <th key={idx}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.rows.map((row, idx) => (
                    <tr key={idx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'links': // 链接列表
        return (
          <div className={styles.linksContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <div className={styles.linksList}>
              {content.links.map((link, idx) => (
                <a key={idx} href={link.url} className={styles.linkCard}>
                  <div className={styles.linkTitle}>{link.title}</div>
                  <div className={styles.linkDesc}>{link.desc}</div>
                </a>
              ))}
            </div>
          </div>
        );

      case 'code': // 代码块
        return (
          <div className={styles.codeContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <pre className={styles.codeBlock}>
              <code className={`language-${content.language}`}>{content.code}</code>
            </pre>
          </div>
        );

      case 'thinking': // 思维链
        return (
          <div className={styles.thinkingContent}>
            <div className={styles.thinkingSteps}>
              {content.steps.map((step, idx) => (
                <div key={idx} className={styles.thinkingStep}>
                  <div className={styles.stepIcon}>
                    {step.status === 'success' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    {step.status === 'loading' && <LoadingOutlined style={{ color: '#1890ff' }} />}
                    {step.status === 'pending' && <ClockCircleOutlined style={{ color: '#d9d9d9' }} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>{step.title}</div>
                    <div className={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cards': // 卡片网格
        return (
          <div className={styles.cardsContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <div className={styles.cardsGrid}>
              {content.cards.map((card, idx) => (
                <div key={idx} className={styles.card}>
                  {card.tag && <span className={styles.cardTag}>{card.tag}</span>}
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <div className={styles.cardTitle}>{card.title}</div>
                  <div className={styles.cardDesc}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'metrics': // 指标展示
        return (
          <div className={styles.metricsContent}>
            <div className={styles.contentTitle}>{content.title}</div>
            <div className={styles.metricsGrid}>
              {content.metrics.map((metric, idx) => (
                <div key={idx} className={styles.metricCard}>
                  <div className={styles.metricLabel}>{metric.label}</div>
                  <div className={styles.metricValue} style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className={styles.metricTrend}>
                    {metric.trend === 'up' && '↑ 上升'}
                    {metric.trend === 'down' && '↓ 下降'}
                    {metric.trend === 'stable' && '→ 稳定'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return JSON.stringify(content);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <button
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label={translate({ id: 'aiAssistant.openButton', message: '打开 AI 助手' })}
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
                <h3>
                  <Translate id="aiAssistant.title">AI 助手</Translate>
                </h3>
                <span className={styles.status}>
                  <span className={styles.statusDot}></span>
                  <Translate id="aiAssistant.online">在线</Translate>
                </span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label={translate({ id: 'aiAssistant.closeButton', message: '关闭' })}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* 消息列表 */}
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${styles[`message-${msg.role}`]}`}>
                <div className={styles.messageContent}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            
            {/* 快捷问题 */}
            {false && (
              <div className={styles.quickQuestions}>
                <div className={styles.quickTitle}>
                  💡 {translate({ id: 'aiAssistant.quickQuestions', message: '快速开始' })}
                </div>
                <div className={styles.questionGrid}>
                  {promptItems.map((item) => (
                    <button
                      key={item.key}
                      className={styles.questionCard}
                      onClick={() => handlePromptClick(item)}
                    >
                      <div className={styles.questionLabel}>{item.label}</div>
                      <div className={styles.questionDesc}>{item.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 输入框 */}
          <div className={styles.senderWrapper}>
            <Sender
              value={content}
              onChange={setContent}
              onSubmit={handleSend}
              placeholder={translate({
                id: 'aiAssistant.inputPlaceholder',
                message: '输入你的问题...'
              })}
              prefix={<SendOutlined />}
            />
          </div>
        </div>
      )}
    </>
  );
}

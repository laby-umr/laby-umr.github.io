#  Java SpringBoot 面试题集

>  **总题数**: 26道 |  **重点领域**: 自动配置、Starter、微服务 |  **难度分布**: 中级

本文档整理了 Java Spring Boot 的完整26道面试题目，涵盖自动配置、Starter机制、微服务开发等各个方面。

---

##  面试题目列表

### 1. Spring Boot 工程启动以后，我希望将数据库中已有的固定内容，打入到 Redis 缓存中，请问如何处理？

**答案：**

有以下几种方式可以在 Spring Boot 启动后执行初始化操作：

**方式一：实现 CommandLineRunner 接口**
```java
@Component
@Order(1)  // 多个实现时可以指定执行顺序
public class RedisInitRunner implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        List<User> users = userRepository.findAll();
        users.forEach(user -> {
            redisTemplate.opsForValue().set("user:" + user.getId(), user);
        });
        System.out.println("Redis 缓存初始化完成");
    }
}
```

**方式二：实现 ApplicationRunner 接口**
```java
@Component
public class RedisInitApplicationRunner implements ApplicationRunner {
    @Autowired
    private DataService dataService;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 加载固定配置数据
        Map<String, Object> configData = dataService.loadConfigData();
        configData.forEach((key, value) -> {
            redisTemplate.opsForValue().set(key, value);
        });
    }
}
```

**方式三：使用 @PostConstruct 注解**
```java
@Component
public class RedisInitializer {
    @Autowired
    private DataRepository dataRepository;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @PostConstruct
    public void init() {
        // 注意：此时 Spring 容器可能还未完全初始化
        List<Data> dataList = dataRepository.findAll();
        dataList.forEach(data -> {
            redisTemplate.opsForValue().set("data:" + data.getId(), data);
        });
    }
}
```

**方式四：监听 ApplicationReadyEvent 事件**
```java
@Component
public class RedisInitListener {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private ConfigRepository configRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        // 应用完全启动后执行
        List<Config> configs = configRepository.findAll();
        configs.forEach(config -> {
            redisTemplate.opsForHash().put("configs", config.getKey(), config.getValue());
        });
    }
}
```

**推荐方案：** 使用 `ApplicationRunner` 或监听 `ApplicationReadyEvent`，因为它们在应用完全启动后执行，此时所有 Bean 都已初始化完成。

### 2. 说说 Springboot 的启动流程？

**答案：**

Spring Boot 的启动流程主要分为以下几个阶段：

**1. 启动入口**
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**2. 详细启动流程**

```
1. 创建 SpringApplication 实例
   ├─ 推断应用类型（Servlet、Reactive、None）
   ├─ 加载 ApplicationContextInitializer
   ├─ 加载 ApplicationListener
   └─ 推断主启动类

2. 执行 run() 方法
   ├─ 创建 StopWatch（记录启动时间）
   ├─ 配置 Headless 属性
   ├─ 获取并启动 SpringApplicationRunListeners
   ├─ 准备环境（Environment）
   │  ├─ 创建环境对象
   │  ├─ 配置环境
   │  └─ 发布 ApplicationEnvironmentPreparedEvent
   ├─ 打印 Banner
   ├─ 创建 ApplicationContext
   │  ├─ 根据应用类型创建对应的上下文
   │  └─ AnnotationConfigServletWebServerApplicationContext
   ├─ 准备 ApplicationContext
   │  ├─ 设置环境
   │  ├─ 后置处理（postProcessApplicationContext）
   │  ├─ 应用初始化器（applyInitializers）
   │  └─ 发布 ApplicationContextInitializedEvent
   ├─ 加载 Bean 定义
   │  ├─ 加载主配置类
   │  └─ 发布 ApplicationPreparedEvent
   ├─ 刷新上下文（refresh）
   │  ├─ 准备刷新
   │  ├─ 获取 BeanFactory
   │  ├─ 准备 BeanFactory
   │  ├─ 后置处理 BeanFactory
   │  ├─ 调用 BeanFactoryPostProcessor
   │  ├─ 注册 BeanPostProcessor
   │  ├─ 初始化消息源
   │  ├─ 初始化事件广播器
   │  ├─ 刷新特定上下文（创建 Web 容器）
   │  ├─ 注册监听器
   │  ├─ 实例化所有非懒加载单例 Bean
   │  └─ 完成刷新（发布 ContextRefreshedEvent）
   ├─ 刷新后处理（afterRefresh）
   ├─ 发布 ApplicationStartedEvent
   ├─ 调用 Runners（CommandLineRunner、ApplicationRunner）
   ├─ 发布 ApplicationReadyEvent
   └─ 启动完成
```

**3. 核心步骤说明**

- **推断应用类型**：根据 classpath 中的类判断是 Web 应用还是普通应用
- **加载初始化器和监听器**：从 `META-INF/spring.factories` 加载
- **准备环境**：加载配置文件（application.properties/yml）
- **创建上下文**：根据应用类型创建对应的 ApplicationContext
- **自动配置**：通过 `@EnableAutoConfiguration` 加载自动配置类
- **启动内嵌容器**：如 Tomcat、Jetty、Undertow
- **执行 Runners**：执行用户自定义的初始化逻辑

**4. 关键源码位置**
```java
// SpringApplication.java
public ConfigurableApplicationContext run(String... args) {
    StopWatch stopWatch = new StopWatch();
    stopWatch.start();
    ConfigurableApplicationContext context = null;
    Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
    configureHeadlessProperty();
    SpringApplicationRunListeners listeners = getRunListeners(args);
    listeners.starting();
    try {
        ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
        ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
        Banner printedBanner = printBanner(environment);
        context = createApplicationContext();
        exceptionReporters = getSpringFactoriesInstances(SpringBootExceptionReporter.class,
                new Class[] { ConfigurableApplicationContext.class }, context);
        prepareContext(context, environment, listeners, applicationArguments, printedBanner);
        refreshContext(context);
        afterRefresh(context, applicationArguments);
        stopWatch.stop();
        listeners.started(context);
        callRunners(context, applicationArguments);
    } catch (Throwable ex) {
        handleRunFailure(context, ex, exceptionReporters, listeners);
        throw new IllegalStateException(ex);
    }
    listeners.running(context);
    return context;
}
```

### 3. 什么是 Spring Boot？

**答案：**

Spring Boot 是由 Pivotal 团队提供的基于 Spring 框架的全新框架，旨在简化 Spring 应用的初始搭建和开发过程。

**核心理念：**
- **约定优于配置（Convention over Configuration）**：提供默认配置，减少开发者配置工作
- **开箱即用（Out of the Box）**：快速启动和运行应用
- **独立运行**：内嵌 Web 容器，可以独立运行

**主要特点：**

1. **简化配置**
   - 无需繁琐的 XML 配置
   - 使用注解和自动配置
   - 提供默认配置值

2. **快速开发**
   - 提供大量 Starter 依赖
   - 自动配置常用框架
   - 快速搭建项目骨架

3. **独立运行**
   - 内嵌 Tomcat、Jetty、Undertow
   - 打包成可执行 JAR
   - 无需部署到外部容器

4. **生产就绪**
   - 提供健康检查、监控、指标
   - Actuator 端点
   - 外部化配置

**与传统 Spring 的区别：**

| 特性 | 传统 Spring | Spring Boot |
|------|------------|-------------|
| 配置方式 | 大量 XML 配置 | 注解 + 自动配置 |
| 依赖管理 | 手动管理版本 | Starter 统一管理 |
| 容器部署 | 需要外部容器 | 内嵌容器 |
| 启动方式 | 部署 WAR 包 | 运行 JAR 包 |
| 开发效率 | 配置繁琐 | 快速开发 |

**示例：**
```java
// 传统 Spring 需要大量配置
// Spring Boot 只需一个注解
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### 4. Spring Boot 的核心特性有哪些？

**答案：**

**1. 自动配置（Auto-Configuration）**
- 根据项目依赖自动配置 Spring 应用
- 通过 `@EnableAutoConfiguration` 实现
- 可以通过 `exclude` 排除不需要的自动配置
```java
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
```

**2. Starter 依赖（Starter Dependencies）**
- 预定义的依赖描述符
- 简化 Maven/Gradle 配置
- 常用 Starter：
  - `spring-boot-starter-web`：Web 开发
  - `spring-boot-starter-data-jpa`：JPA 数据访问
  - `spring-boot-starter-security`：安全框架
  - `spring-boot-starter-test`：测试框架

**3. 内嵌容器（Embedded Server）**
- 内置 Tomcat、Jetty、Undertow
- 无需部署 WAR 包
- 直接运行 JAR 包
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 默认使用 Tomcat -->
</dependency>
```

**4. Actuator 监控**
- 提供生产级别的监控和管理功能
- 健康检查、指标收集、审计
- 常用端点：
  - `/actuator/health`：健康状态
  - `/actuator/metrics`：应用指标
  - `/actuator/info`：应用信息
  - `/actuator/env`：环境变量

**5. 外部化配置（Externalized Configuration）**
- 支持多种配置源
- 配置文件：application.properties/yml
- 环境变量、命令行参数
- 配置优先级机制
```yaml
# application.yml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
```

**6. Spring Boot CLI**
- 命令行工具
- 快速原型开发
- Groovy 脚本支持

**7. 开发者工具（DevTools）**
- 热部署（自动重启）
- LiveReload 支持
- 开发时配置
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

**8. 简化的测试**
- `@SpringBootTest` 注解
- 自动配置测试环境
- Mock 支持
```java
@SpringBootTest
class ApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

### 5. Spring Boot 是如何通过 main 方法启动 web 项目的？

**答案：**

Spring Boot 通过 `SpringApplication.run()` 方法启动 Web 项目，核心原理如下：

**1. 启动入口**
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**2. 启动原理**

**第一步：创建 SpringApplication 对象**
```java
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    this.resourceLoader = resourceLoader;
    this.primarySources = new LinkedHashSet<>(Arrays.asList(primarySources));
    // 推断应用类型：SERVLET、REACTIVE、NONE
    this.webApplicationType = WebApplicationType.deduceFromClasspath();
    // 加载初始化器
    setInitializers(getSpringFactoriesInstances(ApplicationContextInitializer.class));
    // 加载监听器
    setListeners(getSpringFactoriesInstances(ApplicationListener.class));
    // 推断主启动类
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

**第二步：推断应用类型**
```java
static WebApplicationType deduceFromClasspath() {
    // 如果存在 DispatcherHandler 且不存在 DispatcherServlet，则为 REACTIVE
    if (ClassUtils.isPresent(WEBFLUX_INDICATOR_CLASS, null) 
        && !ClassUtils.isPresent(WEBMVC_INDICATOR_CLASS, null)) {
        return WebApplicationType.REACTIVE;
    }
    // 如果不存在 Servlet 相关类，则为 NONE
    for (String className : SERVLET_INDICATOR_CLASSES) {
        if (!ClassUtils.isPresent(className, null)) {
            return WebApplicationType.NONE;
        }
    }
    // 否则为 SERVLET
    return WebApplicationType.SERVLET;
}
```

**第三步：创建 ApplicationContext**
```java
protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    if (contextClass == null) {
        switch (this.webApplicationType) {
            case SERVLET:
                // Web 应用创建 AnnotationConfigServletWebServerApplicationContext
                contextClass = Class.forName(DEFAULT_SERVLET_WEB_CONTEXT_CLASS);
                break;
            case REACTIVE:
                contextClass = Class.forName(DEFAULT_REACTIVE_WEB_CONTEXT_CLASS);
                break;
            default:
                contextClass = Class.forName(DEFAULT_CONTEXT_CLASS);
        }
    }
    return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
}
```

**第四步：刷新上下文，启动 Web 容器**
```java
// ServletWebServerApplicationContext.java
@Override
protected void onRefresh() {
    super.onRefresh();
    try {
        // 创建 Web 服务器（Tomcat、Jetty、Undertow）
        createWebServer();
    } catch (Throwable ex) {
        throw new ApplicationContextException("Unable to start web server", ex);
    }
}

private void createWebServer() {
    WebServer webServer = this.webServer;
    ServletContext servletContext = getServletContext();
    if (webServer == null && servletContext == null) {
        // 获取 ServletWebServerFactory（如 TomcatServletWebServerFactory）
        ServletWebServerFactory factory = getWebServerFactory();
        // 创建 Web 服务器并启动
        this.webServer = factory.getWebServer(getSelfInitializer());
    }
}
```

**第五步：启动内嵌 Tomcat**
```java
// TomcatServletWebServerFactory.java
@Override
public WebServer getWebServer(ServletContextInitializer... initializers) {
    Tomcat tomcat = new Tomcat();
    // 配置 Tomcat
    Connector connector = new Connector(this.protocol);
    connector.setPort(getPort());
    tomcat.getService().addConnector(connector);
    // 配置 Context
    prepareContext(tomcat.getHost(), initializers);
    // 返回 TomcatWebServer
    return getTomcatWebServer(tomcat);
}

// TomcatWebServer.java
public TomcatWebServer(Tomcat tomcat, boolean autoStart) {
    this.tomcat = tomcat;
    this.autoStart = autoStart;
    // 启动 Tomcat
    initialize();
}

private void initialize() {
    // 启动 Tomcat 服务器
    this.tomcat.start();
}
```

**3. 关键点总结**

1. **应用类型推断**：根据 classpath 中的类判断是否为 Web 应用
2. **创建专用上下文**：Web 应用使用 `ServletWebServerApplicationContext`
3. **自动配置 Web 容器**：通过 `ServletWebServerFactory` 创建内嵌容器
4. **启动容器**：在 `onRefresh()` 阶段启动 Tomcat/Jetty/Undertow
5. **注册 DispatcherServlet**：自动配置 Spring MVC 的前端控制器

**4. 为什么可以通过 main 方法启动？**

- Spring Boot 将 Web 容器（Tomcat）作为一个普通对象内嵌到应用中
- 不需要将应用部署到外部容器
- 通过 Java 应用的方式启动，容器随应用启动而启动
- 打包成可执行 JAR，包含所有依赖和内嵌容器

### 6. SpringBoot 是如何实现自动配置的？

**答案：**

Spring Boot 自动配置是通过 `@EnableAutoConfiguration` 注解实现的，核心原理是条件化配置和 SPI 机制。

**1. 核心注解**

```java
@SpringBootApplication
  └─ @EnableAutoConfiguration
       └─ @Import(AutoConfigurationImportSelector.class)
```

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration  // 核心注解
@ComponentScan
public @interface SpringBootApplication {
}
```

**2. 自动配置原理**

**第一步：加载自动配置类**
```java
// AutoConfigurationImportSelector.java
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, 
                                                  AnnotationAttributes attributes) {
    // 从 META-INF/spring.factories 加载自动配置类
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
        EnableAutoConfiguration.class, 
        getBeanClassLoader()
    );
    return configurations;
}
```

**第二步：读取 spring.factories 文件**
```properties
# spring-boot-autoconfigure.jar 中的 META-INF/spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,\
org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration,\
org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration,\
...
```

**第三步：条件化配置**

自动配置类使用 `@Conditional` 注解进行条件判断：

```java
@Configuration
@ConditionalOnClass({DataSource.class, EmbeddedDatabaseType.class})
@ConditionalOnMissingBean(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
```

**3. 常用条件注解**

| 注解 | 说明 |
|------|------|
| `@ConditionalOnClass` | 类路径存在指定类时生效 |
| `@ConditionalOnMissingClass` | 类路径不存在指定类时生效 |
| `@ConditionalOnBean` | 容器中存在指定 Bean 时生效 |
| `@ConditionalOnMissingBean` | 容器中不存在指定 Bean 时生效 |
| `@ConditionalOnProperty` | 配置文件中存在指定属性时生效 |
| `@ConditionalOnResource` | 类路径存在指定资源时生效 |
| `@ConditionalOnWebApplication` | 是 Web 应用时生效 |
| `@ConditionalOnNotWebApplication` | 不是 Web 应用时生效 |

**4. 自动配置示例**

**Redis 自动配置：**
```java
@Configuration
@ConditionalOnClass(RedisOperations.class)
@EnableConfigurationProperties(RedisProperties.class)
@Import({LettuceConnectionConfiguration.class, JedisConnectionConfiguration.class})
public class RedisAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean(name = "redisTemplate")
    public RedisTemplate<Object, Object> redisTemplate(
            RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
    
    @Bean
    @ConditionalOnMissingBean
    public StringRedisTemplate stringRedisTemplate(
            RedisConnectionFactory redisConnectionFactory) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}
```

**5. 配置属性绑定**

```java
@ConfigurationProperties(prefix = "spring.datasource")
public class DataSourceProperties {
    private String url;
    private String username;
    private String password;
    private String driverClassName;
    // getters and setters
}
```

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**6. 自动配置流程总结**

```
1. @SpringBootApplication
   └─ @EnableAutoConfiguration
      └─ @Import(AutoConfigurationImportSelector.class)

2. AutoConfigurationImportSelector
   └─ 读取 META-INF/spring.factories
      └─ 加载所有自动配置类

3. 条件判断
   └─ @ConditionalOnXxx 注解
      └─ 满足条件则生效

4. 属性绑定
   └─ @ConfigurationProperties
      └─ 绑定配置文件属性

5. 创建 Bean
   └─ 注册到 Spring 容器
```

**7. 如何排除自动配置**

```java
// 方式一：使用 exclude 属性
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})

// 方式二：配置文件
spring:
  autoconfigure:
    exclude:
      - org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

**8. 查看生效的自动配置**

```yaml
# application.yml
debug: true  # 启动时打印自动配置报告
```

或使用 Actuator：
```
GET /actuator/conditions
```

### 7. Spring Boot 支持哪些嵌入 Web 容器？

**答案：**

Spring Boot 支持以下三种主流的嵌入式 Web 容器：

**1. Tomcat（默认）**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 默认包含 Tomcat -->
</dependency>
```

**配置示例：**
```yaml
server:
  port: 8080
  tomcat:
    max-threads: 200
    min-spare-threads: 10
    max-connections: 10000
    accept-count: 100
```

**2. Jetty**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- 排除 Tomcat -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 添加 Jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

**配置示例：**
```yaml
server:
  port: 8080
  jetty:
    threads:
      max: 200
      min: 10
```

**3. Undertow**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <!-- 排除 Tomcat -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 添加 Undertow -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

**配置示例：**
```yaml
server:
  port: 8080
  undertow:
    threads:
      io: 4
      worker: 200
    buffer-size: 1024
    direct-buffers: true
```

**容器对比：**

| 特性 | Tomcat | Jetty | Undertow |
|------|--------|-------|----------|
| 默认容器 | ✅ | ❌ | ❌ |
| 性能 | 中等 | 中等 | 高 |
| 内存占用 | 中等 | 较小 | 最小 |
| 并发处理 | 好 | 好 | 优秀 |
| Servlet 支持 | 完整 | 完整 | 完整 |
| WebSocket | 支持 | 支持 | 支持 |
| 社区活跃度 | 最高 | 高 | 中等 |
| 适用场景 | 通用 | 轻量级 | 高并发 |

**选择建议：**
- **Tomcat**：默认选择，社区支持最好，适合大多数场景
- **Jetty**：轻量级，适合资源受限环境
- **Undertow**：高性能，适合高并发场景，内存占用最小

### 8. Spring Boot 中 application.properties 和 application.yml 的区别是什么？

**答案：**

两者都是 Spring Boot 的配置文件，主要区别在于格式和可读性。

**1. 格式对比**

**application.properties：**
```properties
server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/db
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**application.yml：**
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

**2. 主要区别**

| 特性 | application.properties | application.yml |
|------|----------------------|-----------------|
| 格式 | key=value | 层级结构 |
| 可读性 | 较差（重复前缀多） | 好（层级清晰） |
| 配置复杂度 | 简单配置友好 | 复杂配置友好 |
| 数组/列表 | 不直观 | 直观 |
| 多行文本 | 不支持 | 支持 |
| 注释 | # 或 ! | # |
| 文件大小 | 较大 | 较小 |
| 学习成本 | 低 | 稍高 |

**3. 数组/列表配置对比**

**properties：**
```properties
spring.profiles.active=dev,test
my.servers[0]=dev.example.com
my.servers[1]=prod.example.com
```

**yml：**
```yaml
spring:
  profiles:
    active: dev,test

my:
  servers:
    - dev.example.com
    - prod.example.com
```

**4. 多行文本配置**

**properties：**
```properties
# 不支持多行，需要使用 \n
my.description=This is a long \
description that spans \
multiple lines
```

**yml：**
```yaml
# 支持多行
my:
  description: |
    This is a long
    description that spans
    multiple lines
```

**5. 加载优先级**

当两个文件同时存在时：
- `application.properties` 优先级高于 `application.yml`
- 相同配置项，properties 会覆盖 yml

**6. 使用建议**

- **简单项目**：使用 properties，配置少，简单直观
- **复杂项目**：使用 yml，层级清晰，可读性好
- **团队习惯**：根据团队习惯选择
- **推荐**：yml 格式，更现代化，可读性更好

### 9. 如何在 Spring Boot 中定义和读取自定义配置？

**答案：**

Spring Boot 提供多种方式读取自定义配置。

**方式一：使用 @Value 注解**

**配置文件：**
```yaml
app:
  name: MyApplication
  version: 1.0.0
  author: John Doe
```

**读取配置：**
```java
@Component
public class AppConfig {
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.version}")
    private String version;
    
    @Value("${app.author:Unknown}")  // 默认值
    private String author;
    
    @Value("${app.timeout:30}")
    private int timeout;
}
```

**方式二：使用 @ConfigurationProperties（推荐）**

**配置文件：**
```yaml
app:
  name: MyApplication
  version: 1.0.0
  author: John Doe
  email: john@example.com
  servers:
    - dev.example.com
    - prod.example.com
  database:
    host: localhost
    port: 3306
    username: root
```

**配置类：**
```java
@Component
@ConfigurationProperties(prefix = "app")
@Data  // Lombok
public class AppProperties {
    private String name;
    private String version;
    private String author;
    private String email;
    private List<String> servers;
    private Database database;
    
    @Data
    public static class Database {
        private String host;
        private int port;
        private String username;
    }
}
```

**使用配置：**
```java
@Service
public class AppService {
    @Autowired
    private AppProperties appProperties;
    
    public void printConfig() {
        System.out.println("App Name: " + appProperties.getName());
        System.out.println("Version: " + appProperties.getVersion());
        System.out.println("Servers: " + appProperties.getServers());
        System.out.println("DB Host: " + appProperties.getDatabase().getHost());
    }
}
```

**方式三：使用 Environment**

```java
@Component
public class ConfigReader {
    @Autowired
    private Environment env;
    
    public void readConfig() {
        String appName = env.getProperty("app.name");
        String version = env.getProperty("app.version", "1.0.0");  // 默认值
        Integer port = env.getProperty("server.port", Integer.class, 8080);
    }
}
```

**方式四：使用 @PropertySource 加载自定义配置文件**

**自定义配置文件 custom.properties：**
```properties
custom.api.url=https://api.example.com
custom.api.key=abc123
custom.api.timeout=5000
```

**配置类：**
```java
@Configuration
@PropertySource("classpath:custom.properties")
@ConfigurationProperties(prefix = "custom.api")
@Data
public class CustomApiProperties {
    private String url;
    private String key;
    private int timeout;
}
```

**方式五：读取复杂对象配置**

**配置文件：**
```yaml
users:
  - name: Alice
    age: 25
    email: alice@example.com
  - name: Bob
    age: 30
    email: bob@example.com
```

**配置类：**
```java
@Component
@ConfigurationProperties(prefix = "users")
@Data
public class UsersProperties {
    private List<User> users = new ArrayList<>();
    
    @Data
    public static class User {
        private String name;
        private int age;
        private String email;
    }
}
```

**启用 @ConfigurationProperties：**

**方式 1：在配置类上添加 @Component**
```java
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties { }
```

**方式 2：在启动类上添加 @EnableConfigurationProperties**
```java
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class Application { }
```

**方式 3：使用 @ConfigurationPropertiesScan**
```java
@SpringBootApplication
@ConfigurationPropertiesScan("com.example.config")
public class Application { }
```

**最佳实践：**
- 简单配置使用 `@Value`
- 复杂配置使用 `@ConfigurationProperties`
- 使用类型安全的配置类
- 提供默认值
- 添加配置验证（JSR-303）

**配置验证示例：**
```java
@Component
@ConfigurationProperties(prefix = "app")
@Validated
@Data
public class AppProperties {
    @NotBlank
    private String name;
    
    @Min(1)
    @Max(65535)
    private int port;
    
    @Email
    private String email;
}
```

### 10. Spring Boot 配置文件加载优先级你知道吗？

**答案：**

Spring Boot 配置文件的加载遵循特定的优先级顺序，优先级高的配置会覆盖优先级低的配置。

**1. 配置源优先级（从高到低）**

```
1. 命令行参数
   java -jar app.jar --server.port=9090

2. SPRING_APPLICATION_JSON 中的属性
   SPRING_APPLICATION_JSON='{"server.port":9090}' java -jar app.jar

3. ServletConfig 初始化参数

4. ServletContext 初始化参数

5. JNDI 属性（java:comp/env）

6. Java 系统属性（System.getProperties()）
   java -Dserver.port=9090 -jar app.jar

7. 操作系统环境变量
   export SERVER_PORT=9090

8. RandomValuePropertySource（random.* 属性）

9. jar 包外部的 application-{profile}.properties/yml

10. jar 包内部的 application-{profile}.properties/yml

11. jar 包外部的 application.properties/yml

12. jar 包内部的 application.properties/yml

13. @PropertySource 注解指定的配置文件

14. 默认属性（SpringApplication.setDefaultProperties）
```

**2. 配置文件位置优先级（从高到低）**

```
1. file:./config/          # 当前目录的 /config 子目录
2. file:./config/*/        # 当前目录的 /config 子目录的子目录
3. file:./                 # 当前目录
4. classpath:/config/      # classpath 的 /config 目录
5. classpath:/             # classpath 根目录
```

**示例目录结构：**
```
project/
├── config/
│   ├── application.yml          # 优先级最高
│   └── dev/
│       └── application.yml      # 优先级第二
├── application.yml              # 优先级第三
└── target/
    └── app.jar
        └── application.yml      # 优先级最低（jar 内）
```

**3. Profile 配置优先级**

```yaml
# application.yml（基础配置）
server:
  port: 8080

# application-dev.yml（开发环境）
server:
  port: 8081

# application-prod.yml（生产环境）
server:
  port: 8082
```

**激活 Profile：**
```bash
# 方式一：命令行
java -jar app.jar --spring.profiles.active=dev

# 方式二：配置文件
spring:
  profiles:
    active: dev

# 方式三：环境变量
export SPRING_PROFILES_ACTIVE=dev
```

**优先级：** `application-{profile}.yml` > `application.yml`

**4. 文件格式优先级**

当同时存在时：`properties` > `yml` > `yaml`

```
application.properties    # 优先级最高
application.yml          # 优先级中等
application.yaml         # 优先级最低
```

**5. 实际应用示例**

**场景：** 本地开发时覆盖配置

**项目中的配置（application.yml）：**
```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/db
```

**本地配置文件（./config/application.yml）：**
```yaml
server:
  port: 8081
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db
```

**命令行参数：**
```bash
java -jar app.jar --server.port=9090
```

**最终生效：**
- `server.port=9090`（命令行优先级最高）
- `spring.datasource.url=jdbc:mysql://localhost:3306/db`（本地配置覆盖）

**6. 查看配置加载情况**

**方式一：启用 debug 日志**
```yaml
logging:
  level:
    org.springframework.boot.context.config: DEBUG
```

**方式二：使用 Actuator**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

访问：`GET /actuator/env`

**7. 最佳实践**

- **基础配置**：放在 jar 包内的 `application.yml`
- **环境配置**：使用 `application-{profile}.yml`
- **敏感配置**：使用环境变量或外部配置文件
- **临时配置**：使用命令行参数
- **本地开发**：在项目根目录创建 `config/application.yml`（不提交到版本控制）

### 11. Spring Boot 打成的 jar 和普通的 jar 有什么区别 ?

**答案：**

Spring Boot 打包的 JAR（Fat JAR/Uber JAR）与普通 JAR 有本质区别。

**1. 结构对比**

**普通 JAR 结构：**
```
my-app.jar
├── META-INF/
│   └── MANIFEST.MF
└── com/
    └── example/
        └── MyClass.class
```

**Spring Boot JAR 结构：**
```
my-app.jar
├── META-INF/
│   └── MANIFEST.MF          # 包含启动类信息
├── BOOT-INF/
│   ├── classes/             # 应用的 class 文件
│   │   └── com/
│   │       └── example/
│   │           └── Application.class
│   └── lib/                 # 所有依赖的 jar 包
│       ├── spring-boot-*.jar
│       ├── spring-core-*.jar
│       └── ...
└── org/
    └── springframework/
        └── boot/
            └── loader/      # Spring Boot 类加载器
```

**2. MANIFEST.MF 对比**

**普通 JAR：**
```
Manifest-Version: 1.0
Main-Class: com.example.MyClass
```

**Spring Boot JAR：**
```
Manifest-Version: 1.0
Spring-Boot-Version: 3.0.0
Main-Class: org.springframework.boot.loader.JarLauncher
Start-Class: com.example.Application
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
```

**3. 主要区别**

| 特性 | 普通 JAR | Spring Boot JAR |
|------|---------|----------------|
| 依赖包含 | 不包含依赖 | 包含所有依赖（Fat JAR） |
| 启动方式 | 需要指定 classpath | 直接运行 |
| Main-Class | 应用主类 | JarLauncher |
| 类加载器 | 默认类加载器 | 自定义类加载器 |
| 文件大小 | 小 | 大（包含所有依赖） |
| 独立运行 | 否 | 是 |
| 嵌入容器 | 无 | 有（Tomcat/Jetty/Undertow） |

**4. 启动方式对比**

**普通 JAR：**
```bash
# 需要指定所有依赖
java -cp "app.jar:lib/*" com.example.MyClass
```

**Spring Boot JAR：**
```bash
# 直接运行
java -jar app.jar
```

**5. Spring Boot JAR 启动原理**

```java
// JarLauncher 启动流程
1. JarLauncher.main()
   ├─ 创建自定义类加载器（LaunchedURLClassLoader）
   ├─ 加载 BOOT-INF/lib/ 下的所有 jar
   ├─ 加载 BOOT-INF/classes/ 下的类
   └─ 反射调用 Start-Class（真正的主类）

2. Application.main()
   └─ SpringApplication.run()
```

**6. 打包配置**

**Maven：**
```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <mainClass>com.example.Application</mainClass>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**Gradle：**
```groovy
plugins {
    id 'org.springframework.boot' version '3.0.0'
}

bootJar {
    mainClass = 'com.example.Application'
}
```

**7. 解压查看 Spring Boot JAR**

```bash
# 解压 jar 包
jar -xvf app.jar

# 或使用 unzip
unzip app.jar -d app-extracted
```

**8. 优缺点对比**

**Spring Boot JAR 优点：**
- 独立运行，无需外部依赖
- 包含所有依赖，部署简单
- 内嵌 Web 容器，无需额外安装
- 一个文件即可运行

**Spring Boot JAR 缺点：**
- 文件体积大（通常几十 MB）
- 启动稍慢（需要解压和加载依赖）
- 更新依赖需要重新打包

**9. 生成可执行 JAR**

Spring Boot JAR 可以在 Linux/Unix 系统上直接执行：

```bash
# 添加执行权限
chmod +x app.jar

# 直接运行
./app.jar
```

这是因为 Spring Boot 在 JAR 文件开头添加了 shell 脚本：
```bash
#!/bin/bash
exec java -jar "$0" "$@"
```

**10. 打包成 WAR**

如果需要部署到外部容器：

```java
@SpringBootApplication
public class Application extends SpringBootServletInitializer {
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(Application.class);
    }
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

```xml
<packaging>war</packaging>
```

### 12. Spring Boot 是否可以使用 XML 配置 ?

**答案：**

可以，但不推荐。Spring Boot 推荐使用 Java 配置和注解，但仍然支持 XML 配置。

**方式一：使用 @ImportResource 导入 XML 配置**

**XML 配置文件（beans.xml）：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <bean id="userService" class="com.example.service.UserService">
        <property name="userRepository" ref="userRepository"/>
    </bean>
    
    <bean id="userRepository" class="com.example.repository.UserRepository"/>
</beans>
```

**启动类：**
```java
@SpringBootApplication
@ImportResource("classpath:beans.xml")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**方式二：在配置类中导入**

```java
@Configuration
@ImportResource({"classpath:beans.xml", "classpath:services.xml"})
public class XmlConfig {
}
```

**为什么不推荐使用 XML？**

1. **冗余**：XML 配置比注解更冗长
2. **类型安全**：Java 配置有编译时检查
3. **重构友好**：IDE 可以更好地支持 Java 配置
4. **Spring Boot 理念**：约定优于配置

**对比示例：**

**XML 方式：**
```xml
<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource">
    <property name="driverClassName" value="${spring.datasource.driver-class-name}"/>
    <property name="jdbcUrl" value="${spring.datasource.url}"/>
    <property name="username" value="${spring.datasource.username}"/>
    <property name="password" value="${spring.datasource.password}"/>
</bean>
```

**Java 配置方式（推荐）：**
```java
@Configuration
public class DataSourceConfig {
    @Bean
    public DataSource dataSource(
            @Value("${spring.datasource.url}") String url,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }
}
```

**使用场景：**
- 迁移老项目到 Spring Boot
- 集成第三方库的 XML 配置
- 团队习惯使用 XML

### 13. SpringBoot 默认同时可以处理的最大连接数是多少？

**答案：**

Spring Boot 默认使用 Tomcat 作为嵌入式容器，其默认配置如下：

**Tomcat 默认配置：**
- **最大线程数（max-threads）**：200
- **最小空闲线程数（min-spare-threads）**：10
- **最大连接数（max-connections）**：8192（BIO 模式）或 10000（NIO 模式）
- **等待队列长度（accept-count）**：100

**配置说明：**

```yaml
server:
  port: 8080
  tomcat:
    threads:
      max: 200              # 最大工作线程数
      min-spare: 10         # 最小空闲线程数
    max-connections: 10000  # 最大连接数
    accept-count: 100       # 等待队列长度
    connection-timeout: 20000  # 连接超时时间（毫秒）
```

**参数详解：**

**1. max-threads（最大线程数）**
- 默认值：200
- 含义：Tomcat 创建的最大工作线程数
- 影响：决定了同时处理请求的能力
- 建议：根据 CPU 核心数和业务特点调整

**2. min-spare-threads（最小空闲线程数）**
- 默认值：10
- 含义：Tomcat 始终保持的最小线程数
- 影响：减少线程创建开销

**3. max-connections（最大连接数）**
- 默认值：10000（NIO）
- 含义：服务器接受的最大连接数
- 影响：超过此数的连接会被拒绝或等待

**4. accept-count（等待队列长度）**
- 默认值：100
- 含义：当所有线程都在使用时，等待队列的长度
- 影响：超过此数的连接会被拒绝

**处理流程：**

```
1. 客户端发起连接
   ├─ 连接数 < max-connections？
   │  ├─ 是：接受连接
   │  └─ 否：进入等待队列
   │
2. 等待队列
   ├─ 队列长度 < accept-count？
   │  ├─ 是：等待
   │  └─ 否：拒绝连接
   │
3. 处理请求
   ├─ 空闲线程 > 0？
   │  ├─ 是：分配线程处理
   │  └─ 否：等待线程释放
   │
4. 线程池
   ├─ 当前线程数 < max-threads？
   │  ├─ 是：创建新线程
   │  └─ 否：等待
```

**不同容器的默认配置：**

**Tomcat：**
```yaml
server:
  tomcat:
    threads:
      max: 200
    max-connections: 10000
    accept-count: 100
```

**Jetty：**
```yaml
server:
  jetty:
    threads:
      max: 200
      min: 8
    max-queue-capacity: 0  # 无限制
```

**Undertow：**
```yaml
server:
  undertow:
    threads:
      io: 4              # IO 线程数（通常为 CPU 核心数）
      worker: 200        # 工作线程数
    buffer-size: 1024
```

**性能调优建议：**

**1. CPU 密集型应用：**
```yaml
server:
  tomcat:
    threads:
      max: 100  # CPU 核心数 * 2
```

**2. IO 密集型应用：**
```yaml
server:
  tomcat:
    threads:
      max: 500  # 可以设置更大
    max-connections: 20000
```

**3. 高并发场景：**
```yaml
server:
  tomcat:
    threads:
      max: 800
    max-connections: 20000
    accept-count: 500
```

**监控和测试：**

```java
@RestController
public class MonitorController {
    @GetMapping("/thread-info")
    public Map<String, Object> getThreadInfo() {
        ThreadPoolExecutor executor = (ThreadPoolExecutor) 
            ((TomcatWebServer) ((WebServerApplicationContext) applicationContext)
                .getWebServer()).getTomcat().getConnector()
                .getProtocolHandler().getExecutor();
        
        Map<String, Object> info = new HashMap<>();
        info.put("activeCount", executor.getActiveCount());
        info.put("poolSize", executor.getPoolSize());
        info.put("corePoolSize", executor.getCorePoolSize());
        info.put("maximumPoolSize", executor.getMaximumPoolSize());
        info.put("queueSize", executor.getQueue().size());
        return info;
    }
}
```

**压力测试工具：**
```bash
# 使用 Apache Bench
ab -n 10000 -c 200 http://localhost:8080/api/test

# 使用 JMeter
# 配置线程组，模拟并发请求
```

### 14. 如何理解 Spring Boot 中的 starter？

**答案：**

Starter 是 Spring Boot 的核心特性之一，是一组预定义的依赖描述符，用于简化项目依赖管理。

**1. Starter 的作用**

- **简化依赖管理**：一个 Starter 包含一组相关依赖
- **版本管理**：自动管理依赖版本，避免版本冲突
- **自动配置**：提供默认配置，开箱即用
- **约定优于配置**：遵循最佳实践

**2. 常用 Starter**

| Starter | 功能 | 包含的主要依赖 |
|---------|------|---------------|
| spring-boot-starter-web | Web 开发 | Spring MVC, Tomcat, Jackson |
| spring-boot-starter-data-jpa | JPA 数据访问 | Hibernate, Spring Data JPA |
| spring-boot-starter-data-redis | Redis | Lettuce, Spring Data Redis |
| spring-boot-starter-security | 安全框架 | Spring Security |
| spring-boot-starter-test | 测试 | JUnit, Mockito, AssertJ |
| spring-boot-starter-aop | AOP | Spring AOP, AspectJ |
| spring-boot-starter-validation | 数据验证 | Hibernate Validator |
| spring-boot-starter-actuator | 监控 | Actuator |
| spring-boot-starter-logging | 日志 | Logback, SLF4J |
| spring-boot-starter-jdbc | JDBC | HikariCP, Spring JDBC |

**3. Starter 示例**

**使用前（传统方式）：**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>5.3.20</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.20</version>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-core</artifactId>
        <version>9.0.62</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.13.3</version>
    </dependency>
    <!-- 还有很多其他依赖... -->
</dependencies>
```

**使用后（Starter 方式）：**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**4. Starter 的命名规范**

- **官方 Starter**：`spring-boot-starter-*`
- **第三方 Starter**：`*-spring-boot-starter`

**示例：**
```xml
<!-- 官方 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- 第三方（MyBatis） -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
```

**5. 自定义 Starter**

**场景：** 封装公司内部通用功能

**步骤一：创建 Starter 项目**

**项目结构：**
```
my-spring-boot-starter/
├── pom.xml
└── src/main/java/
    └── com/example/starter/
        ├── MyAutoConfiguration.java
        ├── MyProperties.java
        └── MyService.java
└── src/main/resources/
    └── META-INF/
        └── spring.factories
```

**pom.xml：**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

**配置属性类：**
```java
@ConfigurationProperties(prefix = "my.service")
@Data
public class MyProperties {
    private String name = "default";
    private int timeout = 30;
}
```

**服务类：**
```java
public class MyService {
    private MyProperties properties;
    
    public MyService(MyProperties properties) {
        this.properties = properties;
    }
    
    public void doSomething() {
        System.out.println("Service: " + properties.getName());
    }
}
```

**自动配置类：**
```java
@Configuration
@EnableConfigurationProperties(MyProperties.class)
@ConditionalOnClass(MyService.class)
public class MyAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyProperties properties) {
        return new MyService(properties);
    }
}
```

**spring.factories：**
```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.starter.MyAutoConfiguration
```

**步骤二：使用自定义 Starter**

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>my-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

```yaml
# application.yml
my:
  service:
    name: MyApp
    timeout: 60
```

```java
@RestController
public class TestController {
    @Autowired
    private MyService myService;
    
    @GetMapping("/test")
    public String test() {
        myService.doSomething();
        return "OK";
    }
}
```

**6. Starter 的优势**

- **依赖管理简化**：一个依赖引入多个相关库
- **版本统一**：避免版本冲突
- **自动配置**：减少配置代码
- **最佳实践**：遵循 Spring Boot 规范
- **可扩展**：可以自定义 Starter

**7. 查看 Starter 包含的依赖**

```bash
# Maven
mvn dependency:tree

# Gradle
gradle dependencies
```

### 15. Spring Boot 如何处理跨域请求（CORS）？

**答案：**

Spring Boot 提供多种方式处理跨域请求（CORS）。

**方式一：使用 @CrossOrigin 注解（局部配置）**

**在 Controller 上：**
```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // 允许特定域名
public class UserController {
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
```

**在方法上：**
```java
@RestController
@RequestMapping("/api")
public class UserController {
    
    @CrossOrigin(
        origins = {"http://localhost:3000", "https://example.com"},
        methods = {RequestMethod.GET, RequestMethod.POST},
        maxAge = 3600,
        allowedHeaders = "*",
        exposedHeaders = "Authorization",
        allowCredentials = "true"
    )
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
```

**方式二：全局配置（推荐）**

**方法 1：实现 WebMvcConfigurer**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 所有接口
                .allowedOrigins("http://localhost:3000", "https://example.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**方法 2：使用 CorsFilter**
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("https://example.com");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

**方式三：配置文件方式（Spring Boot 2.4+）**

```yaml
spring:
  web:
    cors:
      allowed-origins: "http://localhost:3000,https://example.com"
      allowed-methods: "GET,POST,PUT,DELETE,OPTIONS"
      allowed-headers: "*"
      exposed-headers: "Authorization"
      allow-credentials: true
      max-age: 3600
```

**方式四：使用 Spring Security 配置**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().configurationSource(corsConfigurationSource())
            .and()
            .csrf().disable()
            .authorizeRequests()
            .anyRequest().authenticated();
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

**CORS 参数说明：**

| 参数 | 说明 | 示例 |
|------|------|------|
| allowedOrigins | 允许的源 | `http://localhost:3000` |
| allowedMethods | 允许的 HTTP 方法 | `GET, POST, PUT, DELETE` |
| allowedHeaders | 允许的请求头 | `*` 或 `Content-Type, Authorization` |
| exposedHeaders | 暴露给客户端的响应头 | `Authorization` |
| allowCredentials | 是否允许发送 Cookie | `true` |
| maxAge | 预检请求缓存时间（秒） | `3600` |

**CORS 工作原理：**

**简单请求：**
```
客户端 -> 服务器
GET /api/users HTTP/1.1
Origin: http://localhost:3000

服务器 -> 客户端
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

**预检请求（Preflight）：**
```
客户端 -> 服务器（OPTIONS 请求）
OPTIONS /api/users HTTP/1.1
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

服务器 -> 客户端
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600

客户端 -> 服务器（实际请求）
POST /api/users HTTP/1.1
Origin: http://localhost:3000
Content-Type: application/json
```

**常见问题：**

**1. 允许所有域名（开发环境）：**
```java
config.addAllowedOriginPattern("*");  // 使用 Pattern 而不是 Origin
config.setAllowCredentials(true);
```

**2. 生产环境配置：**
```java
// 只允许特定域名
config.setAllowedOrigins(Arrays.asList(
    "https://www.example.com",
    "https://app.example.com"
));
```

**3. 动态配置：**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

```yaml
# application.yml
cors:
  allowed-origins:
    - http://localhost:3000
    - https://example.com
```

### 16. 在 Spring Boot 中你是怎么使用拦截器的？

**答案：**

Spring Boot 中使用拦截器需要实现 `HandlerInterceptor` 接口并注册到 Spring MVC 配置中。

**步骤一：创建拦截器**

```java
@Component
public class LoginInterceptor implements HandlerInterceptor {
    
    /**
     * 在请求处理之前执行
     * 返回 true 继续执行，返回 false 中断请求
     */
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        
        if (token == null || token.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized");
            return false;
        }
        
        // 验证 token
        if (!validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return false;
        }
        
        // 将用户信息存入 request
        request.setAttribute("userId", getUserIdFromToken(token));
        return true;
    }
    
    /**
     * 在请求处理之后、视图渲染之前执行
     */
    @Override
    public void postHandle(HttpServletRequest request, 
                          HttpServletResponse response, 
                          Object handler, 
                          ModelAndView modelAndView) throws Exception {
        // 可以修改 ModelAndView
        System.out.println("postHandle executed");
    }
    
    /**
     * 在整个请求完成之后执行（视图渲染完成后）
     * 无论是否发生异常都会执行
     */
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) throws Exception {
        // 清理资源、记录日志等
        System.out.println("afterCompletion executed");
    }
    
    private boolean validateToken(String token) {
        // 验证逻辑
        return true;
    }
    
    private String getUserIdFromToken(String token) {
        // 解析 token
        return "user123";
    }
}
```

**步骤二：注册拦截器**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private LoginInterceptor loginInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")  // 拦截所有请求
                .excludePathPatterns(    // 排除路径
                    "/login",
                    "/register",
                    "/public/**",
                    "/static/**",
                    "/error"
                )
                .order(1);  // 执行顺序
    }
}
```

**常见拦截器示例：**

**1. 日志拦截器**
```java
@Component
@Slf4j
public class LogInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        
        log.info("Request URL: {}, Method: {}", 
                request.getRequestURI(), 
                request.getMethod());
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        
        log.info("Request completed in {} ms, Status: {}", 
                endTime - startTime, 
                response.getStatus());
    }
}
```

**2. 权限拦截器**
```java
@Component
public class PermissionInterceptor implements HandlerInterceptor {
    
    @Autowired
    private UserService userService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        // 检查是否是 HandlerMethod
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        
        // 检查方法上的权限注解
        RequirePermission annotation = handlerMethod.getMethodAnnotation(RequirePermission.class);
        if (annotation == null) {
            return true;
        }
        
        // 获取用户信息
        String userId = (String) request.getAttribute("userId");
        User user = userService.findById(userId);
        
        // 检查权限
        String requiredPermission = annotation.value();
        if (!user.hasPermission(requiredPermission)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Permission denied");
            return false;
        }
        
        return true;
    }
}

// 自定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String value();
}

// 使用
@RestController
public class AdminController {
    
    @RequirePermission("admin:user:delete")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable String id) {
        // ...
    }
}
```

**3. 限流拦截器**
```java
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    private final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) throws Exception {
        String clientIp = getClientIp(request);
        
        // 每个 IP 每秒最多 10 个请求
        RateLimiter limiter = limiters.computeIfAbsent(
            clientIp, 
            k -> RateLimiter.create(10.0)
        );
        
        if (!limiter.tryAcquire()) {
            response.setStatus(429);  // Too Many Requests
            response.getWriter().write("Rate limit exceeded");
            return false;
        }
        
        return true;
    }
    
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
```

**拦截器执行流程：**

```
请求到达
  ↓
preHandle (拦截器1)
  ↓
preHandle (拦截器2)
  ↓
Controller 方法执行
  ↓
postHandle (拦截器2)
  ↓
postHandle (拦截器1)
  ↓
视图渲染
  ↓
afterCompletion (拦截器2)
  ↓
afterCompletion (拦截器1)
  ↓
响应返回
```

**多个拦截器配置：**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private LoginInterceptor loginInterceptor;
    @Autowired
    private LogInterceptor logInterceptor;
    @Autowired
    private PermissionInterceptor permissionInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 日志拦截器 - 最先执行
        registry.addInterceptor(logInterceptor)
                .addPathPatterns("/**")
                .order(1);
        
        // 登录拦截器
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login", "/register")
                .order(2);
        
        // 权限拦截器 - 最后执行
        registry.addInterceptor(permissionInterceptor)
                .addPathPatterns("/admin/**")
                .order(3);
    }
}
```

**拦截器 vs 过滤器：**

| 特性 | 拦截器（Interceptor） | 过滤器（Filter） |
|------|---------------------|-----------------|
| 实现方式 | 实现 HandlerInterceptor | 实现 Filter |
| 依赖 | Spring MVC | Servlet |
| 作用范围 | Spring MVC 请求 | 所有请求 |
| 访问 Spring Bean | 可以 | 可以（需配置） |
| 执行时机 | Controller 前后 | Servlet 前后 |
| 方法数量 | 3 个 | 2 个 |
| 获取方法信息 | 可以 | 不可以 |

**使用建议：**
- **拦截器**：处理业务逻辑相关的拦截（登录、权限、日志）
- **过滤器**：处理通用的请求/响应处理（编码、压缩、CORS）

### 17. SpringBoot 中如何实现定时任务 ?

**答案：**

Spring Boot 提供多种方式实现定时任务。

**方式一：使用 @Scheduled 注解（推荐）**

**步骤一：启用定时任务**
```java
@SpringBootApplication
@EnableScheduling  // 启用定时任务
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**步骤二：创建定时任务**
```java
@Component
@Slf4j
public class ScheduledTasks {
    
    /**
     * 固定延迟：上次执行完成后延迟指定时间再执行
     */
    @Scheduled(fixedDelay = 5000)  // 5秒
    public void taskWithFixedDelay() {
        log.info("Fixed delay task: {}", LocalDateTime.now());
    }
    
    /**
     * 固定频率：按固定频率执行，不管上次是否完成
     */
    @Scheduled(fixedRate = 5000)
    public void taskWithFixedRate() {
        log.info("Fixed rate task: {}", LocalDateTime.now());
    }
    
    /**
     * 初始延迟：首次延迟指定时间后执行
     */
    @Scheduled(initialDelay = 10000, fixedRate = 5000)
    public void taskWithInitialDelay() {
        log.info("Task with initial delay: {}", LocalDateTime.now());
    }
    
    /**
     * Cron 表达式：灵活的时间配置
     */
    @Scheduled(cron = "0 0 2 * * ?")  // 每天凌晨2点执行
    public void taskWithCron() {
        log.info("Cron task: {}", LocalDateTime.now());
    }
    
    /**
     * 从配置文件读取
     */
    @Scheduled(cron = "${task.cron}")
    public void taskFromConfig() {
        log.info("Task from config: {}", LocalDateTime.now());
    }
}
```

**Cron 表达式详解：**

```
格式：秒 分 时 日 月 周 [年]

示例：
0 0 2 * * ?          # 每天凌晨2点
0 0/5 * * * ?        # 每5分钟
0 0 9-17 * * ?       # 每天9点到17点每小时
0 0 12 ? * WED       # 每周三中午12点
0 0 12 1 * ?         # 每月1号中午12点
0 15 10 15 * ?       # 每月15号上午10:15
0 0 0 * * ?          # 每天0点
*/10 * * * * ?       # 每10秒

特殊字符：
*  : 所有值
?  : 不指定值（日和周互斥）
-  : 范围
,  : 列举
/  : 步长
L  : 最后（Last）
W  : 工作日（Weekday）
#  : 第几个
```

**配置文件：**
```yaml
# application.yml
task:
  cron: "0 0 2 * * ?"  # 每天凌晨2点
```

**方式二：使用 TaskScheduler**

```java
@Configuration
public class SchedulerConfig {
    
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("scheduled-task-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(60);
        return scheduler;
    }
}

@Component
public class DynamicScheduledTask {
    
    @Autowired
    private TaskScheduler taskScheduler;
    
    private ScheduledFuture<?> scheduledFuture;
    
    /**
     * 动态启动定时任务
     */
    public void startTask() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }
        
        scheduledFuture = taskScheduler.scheduleAtFixedRate(
            () -> {
                System.out.println("Dynamic task: " + LocalDateTime.now());
            },
            Duration.ofSeconds(5)
        );
    }
    
    /**
     * 停止定时任务
     */
    public void stopTask() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }
    }
    
    /**
     * 使用 Cron 表达式
     */
    public void startCronTask(String cron) {
        scheduledFuture = taskScheduler.schedule(
            () -> {
                System.out.println("Cron task: " + LocalDateTime.now());
            },
            new CronTrigger(cron)
        );
    }
}
```

**方式三：使用 Quartz**

**添加依赖：**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-quartz</artifactId>
</dependency>
```

**创建 Job：**
```java
public class MyJob extends QuartzJobBean {
    
    @Override
    protected void executeInternal(JobExecutionContext context) {
        System.out.println("Quartz job executed: " + LocalDateTime.now());
    }
}
```

**配置 Quartz：**
```java
@Configuration
public class QuartzConfig {
    
    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob(MyJob.class)
                .withIdentity("myJob")
                .storeDurably()
                .build();
    }
    
    @Bean
    public Trigger trigger() {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail())
                .withIdentity("myTrigger")
                .withSchedule(
                    CronScheduleBuilder.cronSchedule("0 0 2 * * ?")
                )
                .build();
    }
}
```

**配置线程池：**

```yaml
# application.yml
spring:
  task:
    scheduling:
      pool:
        size: 10  # 线程池大小
      thread-name-prefix: scheduled-task-
```

**或使用 Java 配置：**
```java
@Configuration
public class SchedulingConfig implements SchedulingConfigurer {
    
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(taskExecutor());
    }
    
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("scheduled-task-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(60);
        scheduler.initialize();
        return scheduler;
    }
}
```

**异步定时任务：**

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync  // 启用异步
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Component
@Slf4j
public class AsyncScheduledTasks {
    
    @Async
    @Scheduled(fixedRate = 5000)
    public void asyncTask() {
        log.info("Async task start: {}, Thread: {}", 
                LocalDateTime.now(), 
                Thread.currentThread().getName());
        
        try {
            Thread.sleep(10000);  // 模拟耗时操作
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        log.info("Async task end: {}", LocalDateTime.now());
    }
}
```

**分布式定时任务：**

对于分布式环境，推荐使用：
- **XXL-JOB**：轻量级分布式任务调度平台
- **Elastic-Job**：分布式调度解决方案
- **SchedulerX**：阿里云分布式任务调度

**最佳实践：**

1. **避免长时间任务阻塞**：使用异步或增加线程池大小
2. **异常处理**：捕获异常，避免任务中断
3. **幂等性**：确保任务可以重复执行
4. **监控告警**：记录任务执行情况
5. **分布式锁**：多实例环境下避免重复执行

**示例：带异常处理和日志的定时任务**
```java
@Component
@Slf4j
public class RobustScheduledTask {
    
    @Scheduled(cron = "0 0 2 * * ?")
    public void robustTask() {
        log.info("Task started at: {}", LocalDateTime.now());
        
        try {
            // 业务逻辑
            performTask();
            log.info("Task completed successfully");
        } catch (Exception e) {
            log.error("Task failed: {}", e.getMessage(), e);
            // 发送告警
            sendAlert(e);
        }
    }
    
    private void performTask() {
        // 实际业务逻辑
    }
    
    private void sendAlert(Exception e) {
        // 发送告警通知
    }
}
```

### 18. 什么是 Spring Actuator？它有什么优势？

**答案：**

Spring Boot Actuator 是 Spring Boot 提供的生产级别的监控和管理功能模块。

**1. 添加依赖**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**2. 常用端点（Endpoints）**

| 端点 | 说明 | 默认启用 |
|------|------|---------|
| `/actuator/health` | 健康检查 | ✅ |
| `/actuator/info` | 应用信息 | ✅ |
| `/actuator/metrics` | 应用指标 | ❌ |
| `/actuator/env` | 环境变量 | ❌ |
| `/actuator/beans` | Spring Beans | ❌ |
| `/actuator/mappings` | 请求映射 | ❌ |
| `/actuator/configprops` | 配置属性 | ❌ |
| `/actuator/loggers` | 日志配置 | ❌ |
| `/actuator/heapdump` | 堆转储 | ❌ |
| `/actuator/threaddump` | 线程转储 | ❌ |
| `/actuator/prometheus` | Prometheus 指标 | ❌ |

**3. 配置端点**

```yaml
management:
  endpoints:
    web:
      exposure:
        include: "*"  # 暴露所有端点
        # include: health,info,metrics  # 暴露指定端点
        exclude: heapdump,threaddump  # 排除端点
      base-path: /actuator  # 端点基础路径
  endpoint:
    health:
      show-details: always  # 显示详细健康信息
    shutdown:
      enabled: true  # 启用关闭端点（默认禁用）
  server:
    port: 9090  # 单独的管理端口
```

**4. Health 健康检查**

**默认健康检查：**
```json
GET /actuator/health

{
  "status": "UP",
  "components": {
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 500000000000,
        "free": 300000000000,
        "threshold": 10485760
      }
    },
    "db": {
      "status": "UP",
      "details": {
        "database": "MySQL",
        "validationQuery": "isValid()"
      }
    },
    "redis": {
      "status": "UP",
      "details": {
        "version": "6.2.6"
      }
    }
  }
}
```

**自定义健康检查：**
```java
@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 检查自定义服务状态
        boolean serviceUp = checkService();
        
        if (serviceUp) {
            return Health.up()
                    .withDetail("service", "available")
                    .withDetail("version", "1.0.0")
                    .build();
        } else {
            return Health.down()
                    .withDetail("service", "unavailable")
                    .withDetail("error", "Connection timeout")
                    .build();
        }
    }
    
    private boolean checkService() {
        // 实际检查逻辑
        return true;
    }
}
```

**5. Info 信息端点**

**配置文件：**
```yaml
info:
  app:
    name: My Application
    version: 1.0.0
    description: Spring Boot Application
  company:
    name: Example Corp
```

**Java 配置：**
```java
@Component
public class AppInfoContributor implements InfoContributor {
    
    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("build-time", LocalDateTime.now())
               .withDetail("active-users", 1000)
               .withDetail("custom-info", "some value");
    }
}
```

**6. Metrics 指标**

**查看所有指标：**
```
GET /actuator/metrics

{
  "names": [
    "jvm.memory.used",
    "jvm.memory.max",
    "jvm.gc.pause",
    "http.server.requests",
    "system.cpu.usage",
    "process.uptime"
  ]
}
```

**查看具体指标：**
```
GET /actuator/metrics/jvm.memory.used

{
  "name": "jvm.memory.used",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 123456789
    }
  ],
  "availableTags": [
    {
      "tag": "area",
      "values": ["heap", "nonheap"]
    }
  ]
}
```

**自定义指标：**
```java
@Component
public class CustomMetrics {
    
    private final Counter orderCounter;
    private final Gauge activeUsers;
    
    public CustomMetrics(MeterRegistry registry) {
        // 计数器
        this.orderCounter = Counter.builder("orders.created")
                .description("Total orders created")
                .tag("type", "online")
                .register(registry);
        
        // 仪表
        this.activeUsers = Gauge.builder("users.active", this, CustomMetrics::getActiveUserCount)
                .description("Active users count")
                .register(registry);
    }
    
    public void recordOrder() {
        orderCounter.increment();
    }
    
    private double getActiveUserCount() {
        // 返回活跃用户数
        return 100.0;
    }
}
```

**7. 动态修改日志级别**

```bash
# 查看日志配置
GET /actuator/loggers

# 查看特定 logger
GET /actuator/loggers/com.example.service

# 修改日志级别
POST /actuator/loggers/com.example.service
Content-Type: application/json

{
  "configuredLevel": "DEBUG"
}
```

**8. 安全配置**

```java
@Configuration
public class ActuatorSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .requestMatchers("/actuator/health").permitAll()
            .requestMatchers("/actuator/info").permitAll()
            .requestMatchers("/actuator/**").hasRole("ADMIN")
            .and()
            .httpBasic();
        return http.build();
    }
}
```

**或使用配置文件：**
```yaml
spring:
  security:
    user:
      name: admin
      password: admin123
      roles: ADMIN
```

**9. 集成 Prometheus**

**添加依赖：**
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

**配置：**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

**访问：**
```
GET /actuator/prometheus
```

**10. Actuator 的优势**

- **生产就绪**：提供生产级别的监控功能
- **开箱即用**：无需额外配置即可使用基本功能
- **可扩展**：支持自定义健康检查和指标
- **集成友好**：易于集成 Prometheus、Grafana 等监控系统
- **安全可控**：支持端点级别的安全控制
- **实时监控**：实时查看应用状态和指标
- **问题诊断**：提供线程转储、堆转储等诊断工具

**11. 最佳实践**

- 生产环境限制端点访问权限
- 使用独立的管理端口
- 定期监控健康检查和指标
- 集成到监控系统（Prometheus + Grafana）
- 自定义业务相关的健康检查和指标

### 19. Spring Boot 2.x 与 1.x 版本有哪些主要的改进和区别？

### 20. Spring Boot 3.x 与 2.x 版本有哪些主要的改进和区别？

### 21. 说说你对 Spring Boot 事件机制的了解？

### 22. 在 Spring Boot 中如何实现多数据源配置？

**答案：**

Spring Boot 支持多种方式配置多数据源。

**方式一：手动配置多数据源（推荐）**

**步骤一：配置文件**
```yaml
spring:
  datasource:
    primary:
      jdbc-url: jdbc:mysql://localhost:3306/db1
      username: root
      password: 123456
      driver-class-name: com.mysql.cj.jdbc.Driver
    secondary:
      jdbc-url: jdbc:mysql://localhost:3306/db2
      username: root
      password: 123456
      driver-class-name: com.mysql.cj.jdbc.Driver
```

**步骤二：配置主数据源**
```java
@Configuration
@MapperScan(
    basePackages = "com.example.mapper.primary",
    sqlSessionFactoryRef = "primarySqlSessionFactory"
)
public class PrimaryDataSourceConfig {
    
    @Bean(name = "primaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    @Primary
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean(name = "primarySqlSessionFactory")
    @Primary
    public SqlSessionFactory primarySqlSessionFactory(
            @Qualifier("primaryDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(
            new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/primary/*.xml")
        );
        return bean.getObject();
    }
    
    @Bean(name = "primaryTransactionManager")
    @Primary
    public DataSourceTransactionManager primaryTransactionManager(
            @Qualifier("primaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

**步骤三：配置从数据源**
```java
@Configuration
@MapperScan(
    basePackages = "com.example.mapper.secondary",
    sqlSessionFactoryRef = "secondarySqlSessionFactory"
)
public class SecondaryDataSourceConfig {
    
    @Bean(name = "secondaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.secondary")
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean(name = "secondarySqlSessionFactory")
    public SqlSessionFactory secondarySqlSessionFactory(
            @Qualifier("secondaryDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(
            new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/secondary/*.xml")
        );
        return bean.getObject();
    }
    
    @Bean(name = "secondaryTransactionManager")
    public DataSourceTransactionManager secondaryTransactionManager(
            @Qualifier("secondaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

**步骤四：使用**
```java
// 主数据源 Mapper
package com.example.mapper.primary;

@Mapper
public interface UserMapper {
    User findById(Long id);
}

// 从数据源 Mapper
package com.example.mapper.secondary;

@Mapper
public interface OrderMapper {
    Order findById(Long id);
}

// Service
@Service
public class BusinessService {
    @Autowired
    private UserMapper userMapper;  // 使用主数据源
    
    @Autowired
    private OrderMapper orderMapper;  // 使用从数据源
    
    public void doSomething() {
        User user = userMapper.findById(1L);
        Order order = orderMapper.findById(1L);
    }
}
```

**方式二：使用 AbstractRoutingDataSource 动态切换**

**步骤一：定义数据源枚举**
```java
public enum DataSourceType {
    PRIMARY,
    SECONDARY
}
```

**步骤二：数据源上下文**
```java
public class DataSourceContextHolder {
    private static final ThreadLocal<DataSourceType> contextHolder = new ThreadLocal<>();
    
    public static void setDataSource(DataSourceType dataSourceType) {
        contextHolder.set(dataSourceType);
    }
    
    public static DataSourceType getDataSource() {
        return contextHolder.get();
    }
    
    public static void clearDataSource() {
        contextHolder.remove();
    }
}
```

**步骤三：动态数据源**
```java
public class DynamicDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSource();
    }
}
```

**步骤四：配置数据源**
```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.secondary")
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @Primary
    public DataSource dynamicDataSource() {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        
        Map<Object, Object> dataSourceMap = new HashMap<>();
        dataSourceMap.put(DataSourceType.PRIMARY, primaryDataSource());
        dataSourceMap.put(DataSourceType.SECONDARY, secondaryDataSource());
        
        dynamicDataSource.setTargetDataSources(dataSourceMap);
        dynamicDataSource.setDefaultTargetDataSource(primaryDataSource());
        
        return dynamicDataSource;
    }
}
```

**步骤五：自定义注解**
```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface DataSource {
    DataSourceType value() default DataSourceType.PRIMARY;
}
```

**步骤六：AOP 切面**
```java
@Aspect
@Component
@Order(1)  // 确保在事务之前执行
public class DataSourceAspect {
    
    @Around("@annotation(com.example.annotation.DataSource)")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        
        DataSource dataSource = method.getAnnotation(DataSource.class);
        if (dataSource != null) {
            DataSourceContextHolder.setDataSource(dataSource.value());
        }
        
        try {
            return point.proceed();
        } finally {
            DataSourceContextHolder.clearDataSource();
        }
    }
}
```

**步骤七：使用**
```java
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    // 使用主数据源（默认）
    public User findById(Long id) {
        return userMapper.findById(id);
    }
    
    // 使用从数据源
    @DataSource(DataSourceType.SECONDARY)
    public User findByIdFromSecondary(Long id) {
        return userMapper.findById(id);
    }
}
```

**方式三：使用 JPA 多数据源**

```java
@Configuration
@EnableJpaRepositories(
    basePackages = "com.example.repository.primary",
    entityManagerFactoryRef = "primaryEntityManagerFactory",
    transactionManagerRef = "primaryTransactionManager"
)
public class PrimaryJpaConfig {
    
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean primaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("primaryDataSource") DataSource dataSource) {
        return builder
                .dataSource(dataSource)
                .packages("com.example.entity.primary")
                .persistenceUnit("primary")
                .build();
    }
    
    @Bean
    @Primary
    public PlatformTransactionManager primaryTransactionManager(
            @Qualifier("primaryEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }
}
```

**方式四：使用 Sharding-JDBC（分库分表）**

```xml
<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
    <version>4.1.1</version>
</dependency>
```

```yaml
spring:
  shardingsphere:
    datasource:
      names: ds0,ds1
      ds0:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/db0
        username: root
        password: 123456
      ds1:
        type: com.zaxxer.hikari.HikariDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        jdbc-url: jdbc:mysql://localhost:3306/db1
        username: root
        password: 123456
    sharding:
      tables:
        t_order:
          actual-data-nodes: ds$->{0..1}.t_order_$->{0..1}
          table-strategy:
            inline:
              sharding-column: order_id
              algorithm-expression: t_order_$->{order_id % 2}
          database-strategy:
            inline:
              sharding-column: user_id
              algorithm-expression: ds$->{user_id % 2}
```

**注意事项：**

1. **事务管理**：多数据源事务需要使用分布式事务（如 Seata）
2. **连接池配置**：每个数据源都需要配置连接池
3. **性能考虑**：避免跨数据源的复杂查询
4. **数据一致性**：注意多数据源之间的数据一致性问题

### 23. Spring Boot 中如何实现异步处理？

**答案：**

Spring Boot 提供了 `@Async` 注解来实现异步处理。

**步骤一：启用异步支持**

```java
@SpringBootApplication
@EnableAsync  // 启用异步支持
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**步骤二：使用 @Async 注解**

```java
@Service
@Slf4j
public class AsyncService {
    
    /**
     * 无返回值的异步方法
     */
    @Async
    public void asyncMethod() {
        log.info("Async method start, Thread: {}", Thread.currentThread().getName());
        try {
            Thread.sleep(5000);  // 模拟耗时操作
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        log.info("Async method end");
    }
    
    /**
     * 有返回值的异步方法 - 使用 Future
     */
    @Async
    public Future<String> asyncMethodWithFuture() {
        log.info("Async method with Future start");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return new AsyncResult<>("Result from async method");
    }
    
    /**
     * 有返回值的异步方法 - 使用 CompletableFuture（推荐）
     */
    @Async
    public CompletableFuture<String> asyncMethodWithCompletableFuture() {
        log.info("Async method with CompletableFuture start");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return CompletableFuture.completedFuture("Result from async method");
    }
}
```

**步骤三：调用异步方法**

```java
@RestController
@Slf4j
public class AsyncController {
    
    @Autowired
    private AsyncService asyncService;
    
    @GetMapping("/async")
    public String testAsync() {
        log.info("Controller start");
        
        // 调用异步方法（不会阻塞）
        asyncService.asyncMethod();
        
        log.info("Controller end");
        return "Async method called";
    }
    
    @GetMapping("/async-with-result")
    public String testAsyncWithResult() throws Exception {
        log.info("Controller start");
        
        // 调用有返回值的异步方法
        CompletableFuture<String> future = asyncService.asyncMethodWithCompletableFuture();
        
        // 等待结果
        String result = future.get();  // 阻塞等待
        
        log.info("Controller end, result: {}", result);
        return result;
    }
    
    @GetMapping("/async-multiple")
    public String testMultipleAsync() throws Exception {
        log.info("Controller start");
        
        // 并发执行多个异步任务
        CompletableFuture<String> future1 = asyncService.asyncMethodWithCompletableFuture();
        CompletableFuture<String> future2 = asyncService.asyncMethodWithCompletableFuture();
        CompletableFuture<String> future3 = asyncService.asyncMethodWithCompletableFuture();
        
        // 等待所有任务完成
        CompletableFuture.allOf(future1, future2, future3).join();
        
        log.info("All async methods completed");
        return "All completed";
    }
}
```

**配置线程池（推荐）**

**方式一：配置文件**
```yaml
spring:
  task:
    execution:
      pool:
        core-size: 10          # 核心线程数
        max-size: 20           # 最大线程数
        queue-capacity: 100    # 队列容量
        keep-alive: 60s        # 线程空闲时间
      thread-name-prefix: async-task-
```

**方式二：Java 配置（更灵活）**
```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // 核心线程数
        executor.setCorePoolSize(10);
        
        // 最大线程数
        executor.setMaxPoolSize(20);
        
        // 队列容量
        executor.setQueueCapacity(100);
        
        // 线程名称前缀
        executor.setThreadNamePrefix("async-task-");
        
        // 拒绝策略
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        // 等待所有任务完成后再关闭线程池
        executor.setWaitForTasksToCompleteOnShutdown(true);
        
        // 等待时间
        executor.setAwaitTerminationSeconds(60);
        
        executor.initialize();
        return executor;
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }
}

// 自定义异常处理器
public class CustomAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {
    
    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        System.err.println("Async method exception: " + method.getName());
        System.err.println("Exception: " + ex.getMessage());
    }
}
```

**多个线程池配置**

```java
@Configuration
@EnableAsync
public class MultipleAsyncConfig {
    
    /**
     * 用于 IO 密集型任务
     */
    @Bean(name = "ioTaskExecutor")
    public Executor ioTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(20);
        executor.setMaxPoolSize(50);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("io-task-");
        executor.initialize();
        return executor;
    }
    
    /**
     * 用于 CPU 密集型任务
     */
    @Bean(name = "cpuTaskExecutor")
    public Executor cpuTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(Runtime.getRuntime().availableProcessors());
        executor.setMaxPoolSize(Runtime.getRuntime().availableProcessors() * 2);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("cpu-task-");
        executor.initialize();
        return executor;
    }
}

// 使用指定的线程池
@Service
public class TaskService {
    
    @Async("ioTaskExecutor")
    public void ioTask() {
        // IO 密集型任务
    }
    
    @Async("cpuTaskExecutor")
    public void cpuTask() {
        // CPU 密集型任务
    }
}
```

**异步方法的注意事项**

**1. 必须是 public 方法**
```java
// ✅ 正确
@Async
public void asyncMethod() { }

// ❌ 错误
@Async
private void asyncMethod() { }
```

**2. 不能在同一个类中调用**
```java
@Service
public class MyService {
    
    // ❌ 错误：同类调用不会异步执行
    public void method1() {
        this.asyncMethod();  // 不会异步
    }
    
    @Async
    public void asyncMethod() { }
}

// ✅ 正确：通过注入调用
@Service
public class MyService {
    @Autowired
    private MyService self;  // 注入自己
    
    public void method1() {
        self.asyncMethod();  // 会异步执行
    }
    
    @Async
    public void asyncMethod() { }
}
```

**3. 异常处理**
```java
@Service
@Slf4j
public class AsyncService {
    
    @Async
    public CompletableFuture<String> asyncMethodWithException() {
        try {
            // 业务逻辑
            if (someCondition) {
                throw new RuntimeException("Error occurred");
            }
            return CompletableFuture.completedFuture("Success");
        } catch (Exception e) {
            log.error("Async method error", e);
            return CompletableFuture.failedFuture(e);
        }
    }
}

// 调用时处理异常
@RestController
public class AsyncController {
    
    @GetMapping("/async-with-exception")
    public String testAsyncWithException() {
        asyncService.asyncMethodWithException()
            .thenAccept(result -> {
                System.out.println("Success: " + result);
            })
            .exceptionally(ex -> {
                System.err.println("Error: " + ex.getMessage());
                return null;
            });
        
        return "Called";
    }
}
```

**实际应用场景**

**1. 发送邮件**
```java
@Service
public class EmailService {
    
    @Async
    public void sendEmail(String to, String subject, String content) {
        // 发送邮件（耗时操作）
        log.info("Sending email to: {}", to);
        // ...
    }
}
```

**2. 日志记录**
```java
@Service
public class LogService {
    
    @Async
    public void saveLog(OperationLog log) {
        // 保存日志到数据库
        logRepository.save(log);
    }
}
```

**3. 数据同步**
```java
@Service
public class DataSyncService {
    
    @Async
    public CompletableFuture<Void> syncData() {
        // 同步数据到其他系统
        return CompletableFuture.runAsync(() -> {
            // 同步逻辑
        });
    }
}
```

**4. 批量处理**
```java
@Service
public class BatchService {
    
    @Async
    public CompletableFuture<List<Result>> batchProcess(List<Data> dataList) {
        List<Result> results = dataList.stream()
            .map(this::process)
            .collect(Collectors.toList());
        
        return CompletableFuture.completedFuture(results);
    }
    
    private Result process(Data data) {
        // 处理单个数据
        return new Result();
    }
}
```

### 24. Spring 如何在 SpringBoot 启动时执行特定代码？有哪些方式？

### 25. Spring SpringBoot（Spring）中为什么不推荐使用 @Autowired ？

### 26. @Async 什么时候会失效？

---

##  学习指南

**核心要点：**
- Spring Boot 自动配置原理
- Starter 机制和自定义Starter
- 配置文件和环境管理
- Spring Boot 在微服务中的应用

**学习路径建议：**
1. 掌握 Spring Boot 自动配置机制
2. 熟悉常用Starter的使用
3. 学习配置文件和环境管理
4. 理解Spring Boot在微服务架构中的应用

#  Java Spring 面试题集

>  **总题数**: 71道 |  **重点领域**: IOC、AOP、MVC、事务管理 |  **难度分布**: 中级到高级

本文档整理了 Java Spring 框架的完整71道面试题目，涵盖核心容器、AOP、数据访问、Web开发等各个方面。

---

##  面试题目列表

### 1. 什么是循环依赖（常问）？

**循环依赖**是指两个或多个Bean之间相互依赖，形成一个闭环的依赖关系。最典型的情况是A依赖B，B又依赖A，形成循环依赖。

**循环依赖的三种类型**：

1. **构造器循环依赖**：
   - A的构造方法中依赖B的实例，而B的构造方法中依赖A的实例
   - 这种依赖无法被Spring解决，会导致`BeanCurrentlyInCreationException`异常
   - 因为基于构造器注入，对象需要在实例化时就注入所有依赖

2. **Setter方法循环依赖**：
   - A的setter方法中依赖B的实例，而B的setter方法中依赖A的实例
   - 这种依赖可以被Spring的三级缓存机制解决
   - 单例作用域下，默认可以解决此类循环依赖

3. **原型(Prototype)循环依赖**：
   - 原型作用域的Bean之间存在循环依赖
   - Spring无法解决，会抛出`BeanCurrentlyInCreationException`异常
   - 因为原型Bean每次获取都会创建新实例，无法提前暴露创建中的对象

**循环依赖示例代码**：
```java
@Component
public class A {
    @Autowired
    private B b;
}

@Component
public class B {
    @Autowired
    private A a;
}
```

**为什么会有循环依赖问题**：
- Spring IoC容器管理Bean生命周期，包括实例化和初始化
- 在依赖注入过程中，容器需要先创建所依赖的Bean
- 如果存在循环依赖，就会导致无法完成初始化过程

**循环依赖的危害**：
- 可能导致启动异常，应用无法正常运行
- 增加系统复杂性，不利于代码理解和维护
- 可能带来内存泄漏或资源释放问题
- 表明设计可能存在问题，违反了单一职责原则

**解决循环依赖的方法**：
1. 重构设计，消除循环依赖
2. 使用@Lazy注解延迟加载
3. 使用setter注入替代构造器注入
4. 使用@PostConstruct进行延迟初始化
5. 使用AOP进行解耦

**最佳实践**：
- 应当尽量避免设计中的循环依赖
- 优先使用构造器注入，遇到循环依赖时再考虑setter注入
- 使用依赖倒置和接口分离原则优化设计

### 2. Spring 如何解决循环依赖？

Spring通过**三级缓存机制**解决单例作用域下的setter循环依赖问题。这三级缓存是：

**1. 一级缓存(singletonObjects)**：
- 完全初始化好的单例对象的缓存
- 存放已经经历了完整生命周期、可以直接使用的Bean
- Map类型，key是Bean名称，value是完整Bean对象

**2. 二级缓存(earlySingletonObjects)**：
- 早期的单例对象缓存，已实例化但尚未完全初始化（尚未填充属性）
- 存放原始Bean对象，用于解决循环依赖
- Map类型，key是Bean名称，value是早期Bean对象

**3. 三级缓存(singletonFactories)**：
- 单例对象工厂的缓存
- 存放Bean工厂对象，主要用于生成早期的单例对象
- Map类型，key是Bean名称，value是对象工厂

**循环依赖解决流程**：

假设有循环依赖的Bean A和Bean B：

1. **创建Bean A**：
   - 实例化Bean A，此时尚未填充属性
   - 将A的对象工厂放入三级缓存(singletonFactories)
   - ObjectFactory会返回A的早期引用，可能是原始对象，也可能是代理对象

2. **填充Bean A的属性**：
   - 发现A依赖B，开始创建Bean B

3. **创建Bean B**：
   - 实例化Bean B，此时尚未填充属性
   - 将B的对象工厂放入三级缓存(singletonFactories)

4. **填充Bean B的属性**：
   - 发现B依赖A
   - 尝试从一级缓存获取A，未找到
   - 尝试从二级缓存获取A，未找到
   - 从三级缓存获取A的工厂，调用getObject()方法得到A的早期引用
   - 将A从三级缓存移动到二级缓存
   - B注入A的早期引用，完成B的初始化
   - 将B放入一级缓存(singletonObjects)，从二、三级缓存移除B

5. **继续完成Bean A的创建**：
   - A注入已经完全初始化的B
   - 完成A的初始化
   - 将A放入一级缓存(singletonObjects)，从二、三级缓存移除A

**关键代码解析**：
```java
// Spring容器解决循环依赖的核心代码（简化版）
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从一级缓存获取
    Object singletonObject = this.singletonObjects.get(beanName);
    
    // 如果一级缓存没有，并且该Bean正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        // 从二级缓存获取
        singletonObject = this.earlySingletonObjects.get(beanName);
        
        // 如果二级缓存没有，并且允许获取早期引用
        if (singletonObject == null && allowEarlyReference) {
            // 从三级缓存获取对象工厂
            ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
            if (singletonFactory != null) {
                // 通过工厂创建早期引用
                singletonObject = singletonFactory.getObject();
                // 放入二级缓存，从三级缓存移除
                this.earlySingletonObjects.put(beanName, singletonObject);
                this.singletonFactories.remove(beanName);
            }
        }
    }
    return singletonObject;
}
```

**注意事项**：
1. 只能解决单例作用域的Bean循环依赖
2. 不能解决构造器注入的循环依赖
3. 不能解决@Depends-On循环依赖
4. 不能解决多例（prototype）作用域的Bean循环依赖
5. AOP可能会导致额外的复杂性，但Spring的三级缓存机制已经考虑到了这点

**总结**：Spring通过巧妙的三级缓存设计，成功解决了单例Bean之间的循环依赖问题，让开发者在大多数情况下无需关心这个问题。

### 3. 为什么 Spring 循环依赖需要三级缓存，二级不够吗？

Spring的循环依赖解决机制中，**三级缓存**看似复杂，但其实每个缓存都有其特定的用途。为了理解为什么需要三级缓存而不是二级缓存，我们需要分析各缓存的具体作用：

**二级缓存不够的核心原因：AOP代理对象的处理**

如果只有二级缓存(完成品、半成品)，无法同时解决循环依赖和AOP代理的问题。三级缓存的关键在于**延迟代理对象的创建**。

**详细分析**：

1. **一级缓存(singletonObjects)**：
   - 存储完全初始化好的Bean
   - 任何时候获取Bean，首先从这里取

2. **二级缓存(earlySingletonObjects)**：
   - 存储早期曝光的Bean，即已实例化但未完成属性填充和初始化的对象
   - 作用是在循环依赖中提前返回未完成的实例

3. **三级缓存(singletonFactories)**：
   - 存储Bean的**工厂对象**，这些工厂可以返回Bean的早期引用，也可以是其AOP代理
   - **关键点**：工厂可以动态决定返回原始Bean还是其代理对象

**为何需要三级缓存**：

1. **AOP代理的时机问题**：
   - Spring的设计原则是在Bean完全初始化后才创建其AOP代理
   - 但循环依赖要求提前曝光Bean的引用
   - 如果直接把原始Bean放入二级缓存，后续再创建代理，会导致有些地方注入的是原始Bean，有些地方注入的是代理Bean

2. **提供统一的对象视图**：
   - 三级缓存中的工厂模式确保无论是否存在循环依赖，获取到的都是同一个对象（原始对象或其代理）

3. **延迟代理创建**：
   - 只有真正发生循环依赖时，才会触发提前创建代理
   - 如果没有循环依赖，则按照正常流程在Bean完全初始化后创建代理

**对比二级缓存方案**：

如果只有两级缓存：
1. 要么在实例化后就立即创建代理放入二级缓存（可能导致不必要的代理创建）
2. 要么在出现循环引用时才使用原始对象（导致同一Bean的不同引用可能指向不同对象）

**关键代码示例**：
```java
// 三级缓存中的工厂创建逻辑（简化）
addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));

// 获取早期引用方法
protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
    Object exposedObject = bean;
    if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
        for (SmartInstantiationAwareBeanPostProcessor bp : getBeanPostProcessorCache().smartInstantiationAware) {
            // 如果需要，这里会创建AOP代理
            exposedObject = bp.getEarlyBeanReference(exposedObject, beanName);
        }
    }
    return exposedObject;
}
```

**场景说明**：
假设Bean A和Bean B循环依赖，且Bean A需要被AOP代理：

1. **使用三级缓存**：
   - 创建A的原始对象，放入三级缓存的工厂
   - 填充A的属性，发现依赖B
   - 创建B，填充B的属性，发现依赖A
   - 通过三级缓存的工厂获取A的引用（如果需要，创建A的代理）
   - 完成B的创建，注入到A
   - 完成A的创建
   - 结果：B注入的是A的代理对象，容器获取的A也是同一个代理对象

2. **如果只有二级缓存**：
   - 创建A的原始对象，放入二级缓存
   - B直接引用了这个原始对象
   - A完成创建后，创建了代理对象
   - 结果：B持有的是A的原始对象，而容器中保存的是A的代理对象，不一致

**总结**：
三级缓存的核心价值在于**保证所有引用都指向同一个对象（原始对象或其代理）**，解决了循环依赖和AOP代理的矛盾。这是Spring设计的精妙之处，通过ObjectFactory的延迟执行特性，确保了对象一致性。

### 4. 看过源码吗？说下 Spring 由哪些重要的模块组成？

Spring框架是一个模块化设计的生态系统，由多个功能明确的模块组成。作为一个经常阅读Spring源码的开发者，我可以详细说明其核心模块结构：

**1. 核心容器(Core Container)**：
- **spring-core**：提供框架的基础功能，包含IoC和DI的核心实现
  - 核心工具类、资源加载机制、类型转换系统
  - 源码核心类：`Resource`, `BeanUtils`, `ReflectionUtils`

- **spring-beans**：Bean工厂相关实现，包含Bean的定义、创建和管理
  - BeanFactory接口及实现
  - Bean生命周期管理、依赖解析
  - 源码核心类：`BeanFactory`, `DefaultListableBeanFactory`, `BeanDefinition`

- **spring-context**：构建于core和beans模块之上，提供上下文框架
  - ApplicationContext接口及实现
  - 国际化、事件传播、资源加载、环境抽象
  - 源码核心类：`ApplicationContext`, `ClassPathXmlApplicationContext`

- **spring-expression(SpEL)**：提供强大的表达式语言支持
  - 运行时查询和操作对象图
  - 源码核心类：`Expression`, `ExpressionParser`

**2. AOP和设备支持(AOP and Instrumentation)**：
- **spring-aop**：面向切面编程的实现
  - 基于JDK动态代理和CGLIB的AOP实现
  - 源码核心类：`Advisor`, `Advice`, `Pointcut`, `AopProxy`

- **spring-aspects**：与AspectJ的集成
  - 提供对AspectJ的支持
  - 源码核心类：`AspectJExpressionPointcut`

- **spring-instrument**：提供类植入支持和类加载器实现
  - 主要用于应用服务器
  - 源码核心类：`InstrumentationSavingAgent`

**3. 数据访问/集成(Data Access/Integration)**：
- **spring-jdbc**：JDBC抽象层
  - 简化JDBC操作，处理异常
  - JdbcTemplate模板类
  - 源码核心类：`JdbcTemplate`, `DataSource`

- **spring-tx**：事务管理
  - 声明式和编程式事务
  - 事务同步管理
  - 源码核心类：`PlatformTransactionManager`, `TransactionTemplate`

- **spring-orm**：ORM框架集成
  - 与Hibernate、JPA、iBatis等集成
  - 源码核心类：`HibernateTemplate`, `JpaTransactionManager`

- **spring-oxm**：Object/XML映射
  - 提供抽象层简化XML映射
  - 源码核心类：`Marshaller`, `Unmarshaller`

- **spring-jms**：JMS消息集成
  - 发送和接收消息的支持
  - 源码核心类：`JmsTemplate`, `MessageListener`

**4. Web**：
- **spring-web**：Web开发基础支持
  - 文件上传、REST客户端、远程调用
  - 源码核心类：`WebApplicationContext`, `MultipartResolver`

- **spring-webmvc**：Web MVC框架实现
  - MVC框架、视图解析、Controller映射
  - 源码核心类：`DispatcherServlet`, `Controller`, `ViewResolver`

- **spring-websocket**：WebSocket支持
  - 提供WebSocket和SockJS实现
  - 源码核心类：`WebSocketHandler`, `SockJsService`

- **spring-webflux**：响应式Web框架
  - 非阻塞响应式应用支持
  - 源码核心类：`WebClient`, `RouterFunction`

**5. 测试(Test)**：
- **spring-test**：测试模块
  - Spring应用的单元测试和集成测试支持
  - 源码核心类：`SpringJUnitConfig`, `MockMvc`

**模块依赖关系**：
```
                             ┌─────────────────┐
                             │     spring-test │
                             └─────────────────┘
                                      ▲
                                      │
┌────────────┐     ┌───────────┐     │     ┌───────────┐
│ spring-aop ├────►│spring-beans├────►│     │spring-jdbc│
└────────────┘     └─────┬─────┘     │     └─────┬─────┘
                         │           │           │
                         ▼           │           ▼
                   ┌──────────┐      │     ┌──────────┐
                   │spring-core│◄─────┼─────┤spring-tx │
                   └──────────┘      │     └──────────┘
                         ▲           │
                         │           │
               ┌───────────────────┐ │  ┌─────────────┐
               │  spring-context   │◄┼──┤spring-orm   │
               └─────────┬─────────┘ │  └─────────────┘
                         │           │
                         ▼           │
                  ┌──────────────┐   │
                  │spring-webmvc │◄──┘
                  └──────────────┘
```

**Spring源码组织结构**：
- 源码按功能模块组织，每个模块一个独立的Maven/Gradle项目
- 核心功能在spring-core、spring-beans、spring-context中实现
- 各模块有明确的职责边界，相互协作完成功能

**Spring框架扩展点**：
- BeanPostProcessor：Bean实例化和初始化的扩展
- BeanFactoryPostProcessor：BeanFactory配置的扩展
- ApplicationListener：事件监听机制
- Aware接口族：获取容器资源
- InitializingBean/DisposableBean：Bean生命周期控制

**总结**：Spring框架通过模块化设计实现了高内聚、低耦合的架构，使开发者可以只引入需要的模块而不必加载整个框架，同时提供了丰富的扩展点以满足定制化需求。

### 5. 什么是 Spring IOC？

**IoC (Inversion of Control，控制反转)** 是Spring框架最核心的设计原则，它将传统Java开发中的依赖管理方式颠倒过来，将对象的创建和依赖关系的维护从代码中移到外部容器。

**传统依赖管理 vs IoC**：

**传统方式**：
```java
public class UserService {
    // 主动创建依赖对象
    private UserDao userDao = new UserDaoImpl();
    
    public User getUser(String id) {
        return userDao.findById(id);
    }
}
```

**IoC方式**：
```java
public class UserService {
    // 不再主动创建，由容器注入
    @Autowired
    private UserDao userDao;
    
    public User getUser(String id) {
        return userDao.findById(id);
    }
}
```

**IoC的核心思想**：
1. **控制**：指对象的创建、管理和销毁等生命周期的控制权
2. **反转**：将控制权从应用代码转移到外部容器
3. **依赖注入(DI)**：IoC的一种实现方式，容器主动将依赖注入到组件中

**Spring IoC容器的功能**：
1. **Bean的实例化**：创建对象实例
2. **Bean的装配**：注入依赖关系
3. **Bean的生命周期管理**：初始化和销毁
4. **Bean的作用域控制**：单例、原型等
5. **Bean的延迟加载**：按需实例化

**Spring IoC容器的实现**：
- **BeanFactory**：基础IoC容器，提供基本的DI支持
- **ApplicationContext**：高级IoC容器，扩展了BeanFactory，提供更多企业级功能

**IoC容器初始化流程**：
1. **读取配置**：XML、注解或Java配置类
2. **解析配置**：转化为BeanDefinition
3. **注册BeanDefinition**：存入BeanDefinitionRegistry
4. **实例化非延迟Bean**：创建单例Bean
5. **初始化Bean**：属性注入、执行初始化方法等

**依赖注入的方式**：
1. **构造器注入**：通过构造方法注入依赖
   ```java
   @Component
   public class UserService {
       private final UserDao userDao;
       
       // 构造器注入
       @Autowired
       public UserService(UserDao userDao) {
           this.userDao = userDao;
       }
   }
   ```

2. **Setter注入**：通过setter方法注入依赖
   ```java
   @Component
   public class UserService {
       private UserDao userDao;
       
       // setter注入
       @Autowired
       public void setUserDao(UserDao userDao) {
           this.userDao = userDao;
       }
   }
   ```

3. **字段注入**：直接在字段上注入依赖
   ```java
   @Component
   public class UserService {
       // 字段注入
       @Autowired
       private UserDao userDao;
   }
   ```

**IoC容器的核心组件**：
1. **BeanDefinition**：Bean的定义信息，包括类名、作用域、依赖等
2. **BeanDefinitionReader**：读取并解析配置信息
3. **BeanFactory**：Bean的工厂，负责创建和管理Bean
4. **BeanPostProcessor**：Bean的后处理器，在Bean创建过程中介入处理

**IoC的优势**：
1. **松耦合**：组件之间的依赖关系由容器管理，降低耦合
2. **可测试性**：可以方便地模拟依赖，进行单元测试
3. **模块化**：各组件关注自身业务逻辑，依赖交由容器管理
4. **灵活配置**：可以通过配置改变组件间的依赖关系，无需修改代码
5. **生命周期管理**：统一管理对象的创建和销毁

**IoC的实际应用示例**：
```java
// 配置类
@Configuration
public class AppConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setUsername("root");
        dataSource.setPassword("password");
        return dataSource;
    }
    
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}

// 使用IoC容器
public class Application {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        JdbcTemplate jdbcTemplate = context.getBean(JdbcTemplate.class);
        // 使用jdbcTemplate
    }
}
```

**总结**：
Spring IoC通过控制反转和依赖注入，实现了对象创建和依赖关系的解耦，使应用更加模块化、可测试和可维护。它是Spring框架的核心特性，为其他功能模块如AOP、事务管理等提供了基础支持。

### 6. Spring IOC 有什么好处？

**IOC(Inversion of Control，控制反转)**是Spring框架的核心设计原则，通过反转对象创建和依赖管理的控制权，为应用程序带来了诸多好处：

**1. 松耦合(Loose Coupling)**：
- **降低组件间依赖**：组件不需要知道依赖的具体实现，只需了解接口
- **提高代码复用性**：组件可以独立使用和测试，更容易在不同场景中复用
- **简化系统重构**：可以轻松替换实现类，而不影响调用方

```java
// 不使用IOC
public class UserService {
    // 紧耦合，直接依赖实现类
    private UserDaoImpl userDao = new UserDaoImpl();
}

// 使用IOC
public class UserService {
    // 松耦合，依赖接口
    @Autowired
    private UserDao userDao; // 具体实现由Spring容器注入
}
```

**2. 更好的可测试性**：
- **单元测试更简单**：可以轻松模拟依赖对象(Mock)
- **测试替代实现**：可以在测试环境使用特殊实现
- **无需初始化完整依赖链**：测试时只关注被测组件

```java
// 测试更容易
@Test
public void testUserService() {
    // 创建测试替代品(模拟对象)
    UserDao mockDao = Mockito.mock(UserDao.class);
    when(mockDao.findById(1)).thenReturn(new User(1, "Test User"));
    
    // 手动注入模拟对象
    UserService service = new UserService();
    ReflectionTestUtils.setField(service, "userDao", mockDao);
    
    // 测试业务方法
    User user = service.getUserById(1);
    assertEquals("Test User", user.getName());
}
```

**3. 关注点分离(Separation of Concerns)**：
- **专注业务逻辑**：开发者只需关注组件的核心功能
- **基础设施交给框架**：对象生命周期、依赖管理等由Spring处理
- **声明式编程**：通过注解或XML配置声明依赖，而非硬编码

**4. 更好的可维护性**：
- **代码更清晰**：依赖关系显式声明，易于理解
- **标准化组件管理**：统一的依赖注入方式
- **集中式配置**：依赖关系在配置文件或注解中集中管理

**5. 生命周期管理**：
- **统一管理对象创建和销毁**：Spring容器控制Bean的完整生命周期
- **延迟初始化**：支持Bean的懒加载，优化资源使用
- **作用域控制**：灵活控制Bean的作用域(单例、原型、请求、会话等)

**6. AOP支持**：
- **横切关注点**：通过IOC容器更容易实现AOP功能
- **无侵入增强**：不修改业务代码即可添加日志、事务等功能
- **可插拔服务**：可以动态启用或禁用某些横切功能

**7. 提高开发效率**：
- **减少样板代码**：无需手动创建对象和管理依赖
- **开箱即用的集成**：与各种技术栈的预配置集成
- **丰富的生态系统**：大量现成的组件可以直接注入使用

**8. 企业级功能支持**：
- **声明式事务**：基于IOC和AOP实现的事务管理
- **安全框架集成**：与Spring Security等无缝协作
- **缓存抽象**：统一的缓存访问机制

**9. 模块化应用设计**：
- **组件化开发**：鼓励将应用拆分为独立组件
- **按需装配**：只加载应用需要的组件
- **清晰的模块边界**：通过依赖注入定义模块接口

**10. 设计模式的实现**：
- **工厂模式**：BeanFactory和ApplicationContext
- **单例模式**：默认的Bean作用域
- **代理模式**：AOP实现
- **观察者模式**：事件监听机制

**Spring IOC使用示例**：

**XML配置方式**：
```xml
<!-- applicationContext.xml -->
<beans>
    <bean id="userDao" class="com.example.UserDaoImpl" />
    
    <bean id="userService" class="com.example.UserServiceImpl">
        <property name="userDao" ref="userDao" />
    </bean>
</beans>
```

**注解配置方式**：
```java
@Repository
public class UserDaoImpl implements UserDao {
    // 实现省略
}

@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    
    @Autowired
    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }
}
```

**Java配置方式**：
```java
@Configuration
public class AppConfig {
    @Bean
    public UserDao userDao() {
        return new UserDaoImpl();
    }
    
    @Bean
    public UserService userService(UserDao userDao) {
        return new UserServiceImpl(userDao);
    }
}
```

### 7. Spring 中的 DI 是什么？

**DI(Dependency Injection，依赖注入)**是实现IoC的主要方式，是Spring框架中一种用于管理对象依赖关系的核心机制。通过DI，对象的依赖不再由对象自身创建，而是由外部容器注入，从而实现了"控制反转"。

**1. DI的基本概念**：

- **依赖**：当一个类A使用另一个类B的功能时，我们说A依赖于B
- **注入**：向类中提供其所依赖的对象的过程
- **控制反转**：依赖对象的控制权由类转移到外部容器

**2. Spring支持的主要依赖注入方式**：

**构造器注入(Constructor Injection)**：
- 通过构造函数参数注入依赖
- 依赖在对象创建时提供
- 可以确保依赖不为null
- 适合强制性依赖

```java
@Service
public class UserServiceImpl implements UserService {
    private final UserDao userDao;
    private final EmailService emailService;
    
    // 构造器注入
    @Autowired
    public UserServiceImpl(UserDao userDao, EmailService emailService) {
        this.userDao = userDao;
        this.emailService = emailService;
    }
}
```

XML配置:
```xml
<bean id="userService" class="com.example.UserServiceImpl">
    <constructor-arg ref="userDao" />
    <constructor-arg ref="emailService" />
</bean>
```

**Setter注入(Setter Injection)**：
- 通过setter方法注入依赖
- 对象创建后注入依赖
- 允许可选依赖
- 支持后期重新注入

```java
@Service
public class UserServiceImpl implements UserService {
    private UserDao userDao;
    private EmailService emailService;
    
    // setter注入
    @Autowired
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @Autowired
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
}
```

XML配置:
```xml
<bean id="userService" class="com.example.UserServiceImpl">
    <property name="userDao" ref="userDao" />
    <property name="emailService" ref="emailService" />
</bean>
```

**字段注入(Field Injection)**：
- 直接在类的字段上注入依赖
- 代码最简洁
- 但不推荐用于生产环境(难以测试、隐藏依赖)

```java
@Service
public class UserServiceImpl implements UserService {
    // 字段注入
    @Autowired
    private UserDao userDao;
    
    @Autowired
    private EmailService emailService;
}
```

**3. 接口注入**：
- 实现特定的注入接口
- Spring中较少使用这种方式
- 通常用于特定框架集成

**4. 依赖注入的类型**：

**基于值的注入**：
- 注入基本类型、字符串等值
- 使用@Value注解或XML中的value属性

```java
@Service
public class EmailService {
    @Value("${mail.from}")
    private String fromAddress;
    
    @Value("${mail.reply-to}")
    private String replyTo;
}
```

**基于Bean的注入**：
- 注入其他Bean引用
- 使用@Autowired、@Resource或XML中的ref属性

**集合注入**：
- 注入数组、列表、集合、映射等
- 在XML中使用列表、集合和映射标签

```xml
<bean id="courseService" class="com.example.CourseService">
    <property name="courseNames">
        <list>
            <value>Java Programming</value>
            <value>Spring Framework</value>
            <value>Database Design</value>
        </list>
    </property>
</bean>
```

**5. 自动装配(Autowiring)模式**：

- **no**：不进行自动装配，需要显式指定依赖
- **byName**：根据属性名称自动装配
- **byType**：根据属性类型自动装配(若有多个匹配类型的Bean，会抛出异常)
- **constructor**：类似byType，但应用于构造器参数
- **autodetect**：先尝试constructor，再尝试byType(已过时)

**6. 注解驱动的依赖注入**：

- **@Autowired**：Spring提供的注解，默认按类型装配，可与@Qualifier结合使用指定名称
- **@Inject**：JSR-330标准注解，功能类似@Autowired
- **@Resource**：JSR-250标准注解，默认按名称装配，其次按类型
- **@Value**：注入简单值，支持SpEL表达式
- **@Qualifier**：细化自动装配的匹配规则

**7. DI的最佳实践**：

- **优先使用构造器注入**：
  - 保证依赖不可变
  - 确保必要依赖在对象创建时可用
  - 防止NullPointerException
  - 有助于识别构造器参数过多的情况(可能需要重构)

- **为接口而非实现注入**：
  - 降低耦合度
  - 便于更换实现
  - 方便测试(可以注入模拟对象)

- **避免字段注入**：
  - 隐藏依赖关系
  - 难以进行单元测试
  - 与容器紧密耦合
  - 无法创建不可变对象

- **使用合适的作用域**：
  - 默认单例适合无状态服务
  - 原型适合有状态对象
  - 请求/会话作用域适合web应用

**8. DI的优势**：

- **解耦组件**：减少组件间的直接依赖
- **提高可测试性**：便于使用模拟对象进行单元测试
- **灵活配置**：可以在不修改代码的情况下改变依赖关系
- **支持热插拔**：可在运行时替换组件实现
- **更专注业务逻辑**：减少基础设施代码

**9. 注意事项**：

- **循环依赖**：构造器注入无法解决循环依赖问题，Setter注入可以
- **加载顺序**：需要正确管理Bean的初始化顺序
- **依赖过多**：过多的依赖可能表明类的责任过大，违反单一责任原则
- **异常处理**：注意处理依赖注入可能引发的异常，如NoSuchBeanDefinitionException

### 8. 什么是 Spring Bean？

**Spring Bean**是Spring框架IoC容器管理的对象，是构成Spring应用程序的基础构建块。这些Bean由Spring容器负责实例化、配置、装配并管理其完整生命周期。

**1. Bean的定义**：

Bean是在Spring应用中由IoC容器实例化、组装和管理的Java对象。与普通Java对象的区别在于：
- 由Spring容器创建和管理
- 遵循特定的生命周期
- 可以通过依赖注入获取其他Bean
- 具有可配置的作用域、延迟加载等特性

**2. Bean的配置方式**：

**XML配置**：
```xml
<bean id="userService" class="com.example.service.UserServiceImpl">
    <property name="userDao" ref="userDao"/>
    <property name="maxRetries" value="3"/>
</bean>
```

**注解配置**：
```java
@Component  // 或@Service, @Repository, @Controller等
public class UserServiceImpl implements UserService {
    // Bean实现
}
```

**Java配置**：
```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        UserServiceImpl service = new UserServiceImpl();
        service.setMaxRetries(3);
        return service;
    }
}
```

**自动扫描配置**：
```xml
<context:component-scan base-package="com.example"/>
```
或
```java
@Configuration
@ComponentScan("com.example")
public class AppConfig {
    // 配置
}
```

**3. Bean的命名**：

- **ID**：Bean的唯一标识符
- **Name**：Bean的别名，可以有多个
- 未指定名称时，默认使用类名首字母小写

```xml
<!-- 带ID和Name的Bean定义 -->
<bean id="userService" name="userSrv,userManager" class="com.example.UserServiceImpl"/>
```

**4. Bean的作用域(Scope)**：

Spring提供了多种Bean作用域，用于控制Bean实例的生命周期和可见性：

- **singleton**(默认)：整个应用中只创建一个实例
- **prototype**：每次请求都创建新实例
- **request**：每个HTTP请求创建一个实例(仅Web环境)
- **session**：每个HTTP会话创建一个实例(仅Web环境)
- **application**：每个ServletContext创建一个实例(仅Web环境)
- **websocket**：每个WebSocket创建一个实例(仅Web环境)
- **自定义作用域**：实现Scope接口创建自定义作用域

```java
@Component
@Scope("prototype")
public class ShoppingCart {
    // 购物车实现
}
```

**5. Bean的生命周期**：

Spring Bean的生命周期包括多个阶段，每个阶段都可以进行自定义处理：

**初始化阶段**：
1. 实例化Bean
2. 设置Bean属性
3. BeanNameAware和BeanFactoryAware回调
4. ApplicationContextAware回调(如果实现了该接口)
5. BeanPostProcessor的预处理方法
6. InitializingBean的afterPropertiesSet方法
7. 自定义init-method方法
8. BeanPostProcessor的后处理方法

**销毁阶段**：
1. DisposableBean的destroy方法
2. 自定义destroy-method方法

**生命周期控制方式**：

**接口方式**：
```java
public class UserService implements InitializingBean, DisposableBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        // 初始化逻辑
    }
    
    @Override
    public void destroy() throws Exception {
        // 销毁逻辑
    }
}
```

**注解方式**：
```java
@Component
public class UserService {
    @PostConstruct
    public void init() {
        // 初始化逻辑
    }
    
    @PreDestroy
    public void cleanup() {
        // 销毁逻辑
    }
}
```

**XML方式**：
```xml
<bean id="userService" class="com.example.UserService" 
      init-method="init" destroy-method="cleanup"/>
```

**6. Bean的延迟初始化(Lazy Initialization)**：

默认情况下，单例Bean在容器启动时就会被实例化。可以通过延迟初始化改变这一行为：

```java
@Component
@Lazy
public class ExpensiveService {
    // 此Bean将在首次使用时才被实例化
}
```

```xml
<bean id="expensiveService" class="com.example.ExpensiveService" lazy-init="true"/>
```

**7. Bean的依赖注入**：

Spring支持多种依赖注入方式，使Bean可以获取其所需的依赖：

- 构造器注入
- Setter方法注入
- 字段注入
- 接口注入

**8. Bean的自动装配(Autowiring)**：

Spring可以自动装配Bean之间的依赖关系，减少配置工作：

```java
@Component
public class UserService {
    private final UserRepository repository;
    
    @Autowired  // 自动装配UserRepository类型的Bean
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

**9. Bean的继承**：

Bean定义可以继承其他Bean的配置，形成父子关系：

```xml
<bean id="baseService" abstract="true">
    <property name="timeout" value="30000"/>
    <property name="maxRetries" value="3"/>
</bean>

<bean id="userService" class="com.example.UserService" parent="baseService">
    <property name="userDao" ref="userDao"/>
</bean>
```

**10. 特殊类型的Bean**：

- **FactoryBean**：用于创建复杂Bean的工厂
- **BeanPostProcessor**：用于Bean初始化前后的处理
- **BeanFactoryPostProcessor**：用于BeanFactory配置的修改

**11. Bean的实例化方式**：

- **构造函数实例化**：最常用的方式
- **静态工厂方法**：通过调用静态工厂方法创建Bean
- **实例工厂方法**：通过调用另一个Bean的实例方法创建Bean

**12. Bean的元数据**：

Spring Bean可以包含丰富的元数据，用于描述其特性和行为：

- **依赖描述**
- **初始化和销毁方法**
- **作用域信息**
- **懒加载标志**
- **自动装配模式**
- **依赖检查设置**

### 9. Spring 中的 BeanFactory 是什么？

**BeanFactory**是Spring框架中最基础、最核心的IoC容器接口，负责实例化、配置和管理Bean。它是Spring容器功能的最基本抽象，定义了访问和管理Bean的基本方法，是Spring IoC容器系列的根接口。

**1. BeanFactory的核心功能**：

- **Bean的实例化与管理**：创建、获取和管理Bean实例
- **依赖注入**：为Bean注入依赖
- **Bean生命周期管理**：控制Bean的初始化和销毁
- **作用域管理**：维护不同作用域的Bean实例
- **配置元数据处理**：读取和解析Bean定义

**2. BeanFactory接口定义**：

BeanFactory接口定义了多个用于访问和管理Bean的方法：

```java
public interface BeanFactory {
    // 根据名称获取Bean
    Object getBean(String name) throws BeansException;
    
    // 根据名称和类型获取Bean
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;
    
    // 根据类型获取Bean
    <T> T getBean(Class<T> requiredType) throws BeansException;
    
    // 检查是否包含指定名称的Bean
    boolean containsBean(String name);
    
    // 检查指定名称的Bean是否为单例
    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;
    
    // 检查指定名称的Bean是否为原型
    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;
    
    // 其他方法...
}
```

**3. BeanFactory的主要实现类**：

- **XmlBeanFactory**(已过时)：基于XML配置文件的BeanFactory实现
- **DefaultListableBeanFactory**：最常用的BeanFactory实现，是许多IoC容器的基础
- **ConfigurableBeanFactory**：可配置的BeanFactory接口，支持单例和原型
- **HierarchicalBeanFactory**：具有层次结构的BeanFactory接口，支持父子容器
- **AutowireCapableBeanFactory**：支持自动装配的BeanFactory接口
- **ListableBeanFactory**：支持枚举Bean的BeanFactory接口

**4. BeanFactory的使用示例**：

```java
// 创建BeanFactory实例
DefaultListableBeanFactory factory = new DefaultListableBeanFactory();

// 配置Bean定义加载器
XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(factory);
reader.loadBeanDefinitions(new ClassPathResource("applicationContext.xml"));

// 获取Bean实例
UserService userService = factory.getBean("userService", UserService.class);

// 使用Bean
userService.createUser("admin", "password");
```

**5. BeanFactory与ApplicationContext的区别**：

BeanFactory是Spring容器的基础接口，而ApplicationContext是其高级实现，提供了更多企业级功能：

| 特性 | BeanFactory | ApplicationContext |
|-------|------------|-------------------|
| Bean实例化时机 | 延迟加载(第一次获取时) | 启动时实例化(可配置) |
| 国际化支持 | 不支持 | 支持 |
| 事件发布 | 不支持 | 支持 |
| AOP集成 | 需手动配置 | 默认集成 |
| 资源访问 | 有限支持 | 更丰富的资源加载能力 |
| 数据验证 | 不支持 | 支持 |
| Web支持 | 无 | 有专门的Web实现 |

**6. BeanFactory懒加载机制**：

BeanFactory采用延迟加载策略，只有在第一次请求Bean时才会实例化它：
- 减少启动时的资源消耗
- 适合资源受限的环境
- 但可能导致问题延迟暴露

**7. BeanFactory的加载过程**：

1. **加载配置元数据**：从XML、注解或Java配置加载Bean定义
2. **解析Bean定义**：将配置信息转换为BeanDefinition对象
3. **注册Bean定义**：在BeanDefinitionRegistry中注册BeanDefinition
4. **后处理Bean定义**：应用BeanFactoryPostProcessor进行定义修改
5. **实例化Bean**：在请求时创建Bean实例
6. **依赖注入**：为Bean注入依赖
7. **应用Bean后处理器**：使用BeanPostProcessor处理Bean
8. **初始化Bean**：调用初始化方法

**8. BeanFactory的扩展点**：

- **BeanFactoryPostProcessor**：允许在实例化Bean前修改Bean定义
- **BeanPostProcessor**：允许在Bean初始化前后对其进行处理
- **FactoryBean**：自定义Bean的创建逻辑

**9. BeanFactory中的Bean作用域**：

- **singleton**：单例作用域，每个容器只创建一个实例
- **prototype**：原型作用域，每次请求都创建新实例

**10. BeanFactory的层次结构**：

BeanFactory支持父子层次结构：
- 子BeanFactory可以访问父BeanFactory中的Bean
- 但父BeanFactory无法访问子BeanFactory中的Bean
- 适合构建模块化应用

```java
// 创建父BeanFactory
DefaultListableBeanFactory parentFactory = new DefaultListableBeanFactory();
// 配置父BeanFactory...

// 创建子BeanFactory
DefaultListableBeanFactory childFactory = new DefaultListableBeanFactory(parentFactory);
// 配置子BeanFactory...

// 子BeanFactory可以访问父BeanFactory中的Bean
Object parentBean = childFactory.getBean("parentBean");
```

**11. 主要使用场景**：

- **资源受限环境**：嵌入式系统、移动应用等
- **需要精细控制Bean加载时机**：延迟初始化重要的场景
- **自定义容器扩展**：构建自定义容器实现
- **特殊部署场景**：非标准化的部署环境

### 10. Spring 中的 FactoryBean 是什么？

**FactoryBean**是Spring框架中的一种特殊Bean，它是一个工厂Bean，用于生产其他Bean实例。与普通Bean不同，当从容器获取FactoryBean时，容器返回的不是FactoryBean本身，而是它创建的Bean实例。这种机制为复杂Bean的创建提供了灵活的方法，特别是当Bean的创建过程需要复杂逻辑时。

**1. FactoryBean接口定义**：

```java
public interface FactoryBean<T> {
    // 返回此工厂创建的对象实例
    T getObject() throws Exception;
    
    // 返回此工厂创建的对象的类型
    Class<?> getObjectType();
    
    // 返回由FactoryBean创建的对象是否是单例
    default boolean isSingleton() {
        return true;
    }
}
```

**2. FactoryBean的工作原理**：

- 当容器处理实现了FactoryBean接口的Bean时，它会调用getObject()方法获取实际的Bean
- 默认情况下，容器返回FactoryBean生成的对象实例
- 如果想要获取FactoryBean本身，需要在Bean名称前加上"&"前缀

```java
// 获取FactoryBean创建的Bean
Object bean = context.getBean("myBean");

// 获取FactoryBean本身
FactoryBean factoryBean = (FactoryBean) context.getBean("&myBean");
```

**3. FactoryBean的实现示例**：

```java
@Component("myDataSource")
public class DataSourceFactoryBean implements FactoryBean<DataSource> {
    private String url;
    private String username;
    private String password;
    
    // setter方法省略...
    
    @Override
    public DataSource getObject() throws Exception {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaxActive(100);
        dataSource.setMaxIdle(30);
        dataSource.setMaxWait(10000);
        return dataSource;
    }
    
    @Override
    public Class<?> getObjectType() {
        return DataSource.class;
    }
    
    @Override
    public boolean isSingleton() {
        return true; // 返回单例数据源
    }
}
```

**4. FactoryBean的应用场景**：

**复杂对象创建**：
- 创建需要复杂初始化的对象
- 对象创建需要运行时信息
- 需要进行条件逻辑判断来决定返回的对象类型

**代理对象创建**：
- 创建AOP代理
- 动态代理的应用
- RMI代理对象

**第三方库集成**：
- 整合不是按Spring期望方式配置的第三方组件
- 封装复杂的第三方API初始化逻辑

**延迟加载或按需加载**：
- 对象创建开销大，需要延迟初始化
- 条件性地创建对象

**5. Spring中常用的FactoryBean实现**：

- **ProxyFactoryBean**：创建AOP代理
- **JndiObjectFactoryBean**：通过JNDI查找获取对象
- **LocalSessionFactoryBean**：创建Hibernate SessionFactory
- **SqlSessionFactoryBean**：创建MyBatis SqlSessionFactory
- **RestTemplateBuilder**：构建RestTemplate实例

**6. FactoryBean和BeanFactory的区别**：

| 特性 | FactoryBean | BeanFactory |
|------|------------|-------------|
| 类型 | 接口，由开发者实现 | 接口，由Spring框架实现 |
| 作用 | 创建特定的Bean实例 | Spring IoC容器的根接口 |
| 使用场景 | 复杂Bean的创建 | 管理和获取所有Bean |
| 使用方式 | 被Spring容器调用 | 作为Spring容器使用 |
| 获取方法 | getObject() | getBean() |
| 实例数量 | 一个FactoryBean对应一种Bean | 管理多种Bean |

**7. FactoryBean的生命周期**：

FactoryBean本身也是容器管理的Bean，因此遵循标准的Bean生命周期：
- 实例化
- 依赖注入
- 初始化
- 销毁

而FactoryBean创建的Bean可以有独立的生命周期管理。

**8. FactoryBean与XML配置结合**：

```xml
<bean id="myDataSource" class="com.example.DataSourceFactoryBean">
    <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
    <property name="username" value="root"/>
    <property name="password" value="password"/>
</bean>

<!-- 使用FactoryBean创建的DataSource -->
<bean id="userDao" class="com.example.UserDaoImpl">
    <property name="dataSource" ref="myDataSource"/>
</bean>
```

**9. FactoryBean与Java配置结合**：

```java
@Configuration
public class AppConfig {
    @Bean
    public DataSourceFactoryBean dataSourceFactoryBean() {
        DataSourceFactoryBean factoryBean = new DataSourceFactoryBean();
        factoryBean.setUrl("jdbc:mysql://localhost:3306/mydb");
        factoryBean.setUsername("root");
        factoryBean.setPassword("password");
        return factoryBean;
    }
    
    @Bean
    public UserDao userDao(DataSource dataSource) {
        UserDaoImpl userDao = new UserDaoImpl();
        userDao.setDataSource(dataSource);
        return userDao;
    }
}
```

**10. FactoryBean的高级特性**：

- **懒加载支持**：FactoryBean可以延迟创建目标Bean
- **依赖注入**：FactoryBean可以使用Spring的依赖注入获取所需依赖
- **条件创建**：可以基于环境或配置条件创建不同实例
- **生命周期回调**：可以实现InitializingBean或使用@PostConstruct来初始化

**11. 自定义SmartFactoryBean**：

SmartFactoryBean是FactoryBean的扩展接口，增加了对早期初始化的控制：

```java
public interface SmartFactoryBean<T> extends FactoryBean<T> {
    // 控制是否需要在启动时就急切地初始化
    default boolean isEagerInit() {
        return false;
    }
}
```

**12. FactoryBean与普通Bean对比**：

**FactoryBean方式**：
```java
// 定义FactoryBean
public class ComplexObjectFactoryBean implements FactoryBean<ComplexObject> {
    private String param1;
    private int param2;
    
    @Override
    public ComplexObject getObject() throws Exception {
        ComplexObject obj = new ComplexObject();
        // 复杂初始化逻辑...
        return obj;
    }
    
    @Override
    public Class<?> getObjectType() {
        return ComplexObject.class;
    }
}
```

**普通Bean方式**：
```java
@Configuration
public class AppConfig {
    @Bean
    public ComplexObject complexObject() {
        ComplexObject obj = new ComplexObject();
        // 复杂初始化逻辑...
        return obj;
    }
}
```

FactoryBean方式更适合需要封装复杂创建逻辑的场景，特别是当这些逻辑需要被多处复用时。

#  Java Spring 面试题集

>  **总题数**: 71道 |  **重点领域**: IOC、AOP、MVC、事务管理 |  **难度分布**: 中级到高级

本文档整理了 Java Spring 框架的完整71道面试题目，涵盖核心容器、AOP、数据访问、Web开发等各个方面。

---

##  面试题目列表

### 1. 什么是循环依赖（常问）？

### 2. Spring 如何解决循环依赖？

### 3. 为什么 Spring 循环依赖需要三级缓存，二级不够吗？

### 4. 看过源码吗？说下 Spring 由哪些重要的模块组成？

### 5. 什么是 Spring IOC？

### 6. Spring IOC 有什么好处？

### 7. Spring 中的 DI 是什么？

### 8. 什么是 Spring Bean？

### 9. Spring 中的 BeanFactory 是什么？

### 10. Spring 中的 FactoryBean 是什么？

### 11. Spring 中的 ObjectFactory 是什么？

### 12. Spring 中的 ApplicationContext 是什么？

### 13. Spring Bean 一共有几种作用域？

### 14. Spring 一共有几种注入方式？

### 15. 什么是 AOP？

### 16. Spring AOP默认用的是什么动态代理，两者的区别？

### 17. 能说说 Spring 拦截链的实现吗？

### 18. Spring AOP 和 AspectJ 有什么区别？

### 19. 说下 Spring Bean 的生命周期？

### 20. 说下对 Spring MVC 的理解？

### 21. Spring MVC 具体的工作原理？

### 22. SpringMVC 父子容器是什么知道吗？

### 23. 你了解的 Spring 都用到哪些设计模式？

### 24. Spring 事务有几个隔离级别？

### 25. Spring 有哪几种事务传播行为?

### 26. Spring 事务传播行为有什么用?

### 27. Spring 的优点

### 28. Spring AOP 相关术语都有哪些？

### 29. Spring 通知有哪些类型？

### 30. Spring IOC 容器初始化过程？

### 31. Spring Bean 注册到容器有哪些方式？

### 32. Spring 自动装配的方式有哪些？

### 33. @Qualifier 注解有什么作用

### 34. @Bean和@Component有什么区别？

### 35. @Component、@Controller、@Repository和@Service 的区别？

### 36. Spring 事务在什么情况下会失效？

### 37. 说说 Spring 启动过程？

### 38. Spring 的单例 Bean 是否有并发安全问题？

### 39. Spring中的@Primary注解的作用是什么？

### 40. Spring中的@Value注解的作用是什么？

### 41. Spring 中的 @Profile 注解的作用是什么？

### 42. Spring 中的 @PostConstruct 和 @PreDestroy 注解的作用是什么？

### 43. Spring 中的 @RequestBody 和 @ResponseBody 注解的作用是什么？

### 44. Spring 中的 @PathVariable 注解的作用是什么？

### 45. Spring中的 @ModelAttribute 注解的作用是什么？

### 46. Spring 中的 @ExceptionHandler 注解的作用是什么？

### 47. Spring 中的 @ResponseStatus 注解的作用是什么？

### 48. Spring 中的 @RequestHeader 和 @CookieValue 注解的作用是什么？

### 49. Spring 中的 @SessionAttribute 注解的作用是什么？

### 50. Spring 中的 @Validated 和 @Valid 注解有什么区别？

### 51. Spring 中的 @Scheduled 注解的作用是什么？

### 52. Spring 中的 @Cacheable 和 @CacheEvict 注解的作用是什么？

### 53. Spring 中的 @Conditional 注解的作用是什么？

### 54. Spring 中的 @Lazy 注解的作用是什么？

### 55. Spring 中的 @PropertySource 注解的作用是什么？

### 56. Spring 中的 @EventListener 注解的作用是什么？

### 57. @Async 注解的原理是什么？

### 58. Spring 和 Spring MVC 的关系是什么？

### 59. Spring WebFlux 是什么？它与 Spring MVC 有何不同？

### 60. 介绍下 Spring MVC 的核心组件？

### 61. 什么是 Restful 风格的接口？

### 62. Spring MVC中的Controller是什么？如何定义一个Controller？

### 63. Spring MVC 中如何处理表单提交？

### 64. Spring MVC 中的视图解析器有什么作用？

### 65. Spring MVC 中的拦截器是什么？如何定义一个拦截器？

### 66. Spring MVC 中的国际化支持是如何实现的？

### 67. Spring MVC 中如何处理异常？

### 68. Spring 中的 JPA 和 Hibernate 有什么区别？

### 69. @Async 如何避免内部调用失效？

### 70. @Async 什么时候会失效？

### 71. 在 Spring 中，拦截器和过滤器有什么区别？

---

##  学习指南

**核心要点：**
- Spring IOC 容器和依赖注入机制
- AOP 面向切面编程原理和应用
- Spring MVC 请求处理流程
- 事务管理和声明式事务
- Spring Boot 自动配置原理

**学习路径建议：**
1. 掌握 Spring IOC 和 AOP 核心概念
2. 深入理解 Spring MVC 工作原理
3. 学习 Spring Boot 自动化配置
4. 掌握 Spring Cloud 微服务开发
5. 熟悉 Spring 生态系统工具

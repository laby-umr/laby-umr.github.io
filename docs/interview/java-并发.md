#  Java 并发面试题集

>  **总题数**: 62道 |  **重点领域**: 线程、锁、并发容器、JMM |  **难度分布**: 中级到高级

本文档整理了 Java 并发的完整62道面试题目，涵盖线程基础、锁机制、并发容器、内存模型等各个方面。

---

##  面试题目列表

### 1. 什么是 Java 中的线程同步？

### 2. Java 中的线程安全是什么意思？

### 3. 什么是协程？Java 支持协程吗？

### 4. 线程的生命周期在 Java 中是如何定义的？

### 5. Java 中线程之间如何进行通信？

### 6. Java 中如何创建多线程？

### 7. 你了解 Java 线程池的原理吗？

### 8. 如何合理地设置 Java 线程池的线程数？

### 9. Java 线程池有哪些拒绝策略？

### 10. Java 并发库中提供了哪些线程池实现？它们有什么区别？

### 11. Java 线程池核心线程数在运行过程中能修改吗？如何修改？

### 12. 线程池中 shutdown 与 shutdownNow 的区别是什么？

### 13. 线程池内部任务出异常后，如何知道是哪个线程出了异常？

### 14. Java 中的 DelayQueue 和 ScheduledThreadPool 有什么区别？

### 15. 什么是 Java 的 Timer？

### 16. 你了解时间轮（Time Wheel）吗？有哪些应用场景？

### 17. 你使用过哪些 Java 并发工具类？

### 18. 什么是 Java 的 Semaphore？

### 19. 什么是 Java 的 CyclicBarrier？

### 20. 什么是 Java 的 CountDownLatch？

### 21. 什么是 Java 的 StampedLock？

### 22. 什么是 Java 的 CompletableFuture？

### 23. 什么是 Java 的 ForkJoinPool？

### 24. 如何在 Java 中控制多个线程的执行顺序？

### 25. 你使用过 Java 中的哪些阻塞队列？

### 26. 你使用过 Java 中的哪些原子类？

### 27. 你使用过 Java 的累加器吗？

### 28. 什么是 Java 的 CAS（Compare-And-Swap）操作？

### 29. 说说 AQS 吧？

### 30. Java 中 ReentrantLock 的实现原理是什么？

### 31. Java 的 synchronized 是怎么实现的？

### 32. Synchronized 修饰静态方法和修饰普通方法有什么区别？

### 33. Java 中的 synchronized 轻量级锁是否会进行自旋？

### 34. Synchronized 能不能禁止指令重排序？

### 35. 当 Java 的 synchronized 升级到重量级锁后，所有线程都释放锁了，此时它还是重量级锁吗？

### 36. 什么是 Java 中的锁自适应自旋？

### 37. Synchronized 和 ReentrantLock 有什么区别？

### 38. Volatile 与 Synchronized 的区别是什么？

### 39. 如何优化 Java 中的锁的使用？

### 40. 你了解 Java 中的读写锁吗？

### 41. 什么是 Java 内存模型（JMM）？

### 42. 什么是 Java 中的原子性、可见性和有序性？

### 43. 什么是 Java 的 happens-before 规则？

### 44. 什么是 Java 中的指令重排？

### 45. Java 中的 final 关键字是否能保证变量的可见性？

### 46. 为什么在 Java 中需要使用 ThreadLocal？

### 47. Java 中的 ThreadLocal 是如何实现线程资源隔离的？

### 48. 为什么 Java 中的 ThreadLocal 对 key 的引用为弱引用？

### 49. Java 中使用 ThreadLocal 的最佳实践是什么？

### 50. Java 中的 InheritableThreadLocal 是什么？

### 51. ThreadLocal 的缺点？

### 52. 为什么 Netty 不使用 ThreadLocal 而是自定义了一个 FastThreadLocal ？

### 53. 什么是 Java 的 TransmittableThreadLocal？

### 54. Java 中 Thread.sleep 和 Thread.yield 的区别？

### 55. Java 中 Thread.sleep(0) 的作用是什么？

### 56. Java 中什么情况会导致死锁？如何避免？

### 57. Java 中 volatile 关键字的作用是什么？

### 58. 什么是 Java 中的 ABA 问题？

### 59. 在 Java 中主线程如何知晓创建的子线程是否执行成功？

### 60. 创建线程池有哪些方式？

### 61. 线程安全的集合有哪些?

### 62. Java 创建线程有哪些方式？

---

##  学习指南

**核心要点：**
- Java 线程生命周期和状态转换
- 锁机制和并发控制原理
- 并发容器和原子操作
- 内存模型和可见性保证

**学习路径建议：**
1. 掌握 Java 线程基础和生命周期
2. 深入理解锁机制和 AQS 原理
3. 熟悉并发容器和原子类
4. 掌握 JMM 和并发编程最佳实践

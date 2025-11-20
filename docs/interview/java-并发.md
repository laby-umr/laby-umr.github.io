#  Java 并发面试题集

>  **总题数**: 62道 |  **重点领域**: 线程、锁、并发容器、JMM |  **难度分布**: 中级到高级

本文档整理了 Java 并发的完整62道面试题目，涵盖线程基础、锁机制、并发容器、内存模型等各个方面。

---

##  面试题目列表

### 1. 什么是 Java 中的线程同步？

**答案：**

线程同步是指协调多个线程对共享资源的访问，确保在同一时刻只有一个线程能够访问特定的资源，从而避免数据不一致和竞态条件。

**主要同步机制：**
- **synchronized 关键字**：提供互斥锁机制
- **Lock 接口**：提供更灵活的锁操作（ReentrantLock、ReadWriteLock）
- **volatile 关键字**：保证变量的可见性
- **wait/notify 机制**：线程间的协作通信
- **并发工具类**：Semaphore、CountDownLatch、CyclicBarrier 等

```java
// synchronized 同步示例
public class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### 2. Java 中的线程安全是什么意思？

**答案：**

线程安全是指当多个线程同时访问某个类、对象或方法时，这个类、对象或方法始终能表现出正确的行为，不会出现数据不一致或不可预期的结果。

**线程安全的实现方式：**

1. **互斥同步（悲观锁）**：synchronized、ReentrantLock
2. **非阻塞同步（乐观锁）**：CAS 操作、原子类
3. **无同步方案**：
   - 栈封闭（局部变量）
   - ThreadLocal
   - 不可变对象（final、String）

**线程安全级别：**
- **不可变**：String、Integer 等
- **绝对线程安全**：所有操作都是线程安全的
- **相对线程安全**：单次操作是线程安全的，如 Vector、HashTable
- **线程兼容**：需要外部同步，如 ArrayList、HashMap
- **线程对立**：无法在多线程环境使用

```java
// 线程安全的单例模式
public class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

### 3. 什么是协程？Java 支持协程吗？

**答案：**

**协程（Coroutine）** 是一种轻量级的用户态线程，由程序自己控制调度，不需要操作系统内核参与。协程的切换开销远小于线程切换。

**协程的特点：**
- 轻量级：占用内存小，创建销毁快
- 用户态调度：不需要内核态切换
- 协作式调度：由程序控制何时挂起和恢复
- 高并发：可以创建大量协程

**Java 对协程的支持：**

传统 Java（Java 8-18）不直接支持协程，但可以通过以下方式实现类似功能：
- **Quasar 库**：提供 Fiber（纤程）实现
- **Kotlin 协程**：在 JVM 上运行的协程
- **Project Loom**：Java 19+ 引入的虚拟线程（Virtual Threads）

```java
// Java 19+ 虚拟线程示例
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}
```

### 4. 线程的生命周期在 Java 中是如何定义的？

**答案：**

Java 线程有 6 种状态，定义在 `Thread.State` 枚举中：

**1. NEW（新建）**
- 线程被创建但还未调用 start() 方法

**2. RUNNABLE（可运行）**
- 调用 start() 后，线程可能正在运行或等待 CPU 时间片
- 包含操作系统的 Ready 和 Running 状态

**3. BLOCKED（阻塞）**
- 线程等待获取监视器锁（synchronized）

**4. WAITING（等待）**
- 无限期等待另一个线程执行特定操作
- 触发条件：Object.wait()、Thread.join()、LockSupport.park()

**5. TIMED_WAITING（计时等待）**
- 等待指定时间后自动返回
- 触发条件：Thread.sleep()、Object.wait(timeout)、Thread.join(timeout)

**6. TERMINATED（终止）**
- 线程执行完成或异常退出

```java
// 状态转换示例
public class ThreadStateDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(1000); // TIMED_WAITING
                synchronized (ThreadStateDemo.class) {
                    ThreadStateDemo.class.wait(); // WAITING
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        System.out.println("NEW: " + thread.getState()); // NEW
        thread.start();
        Thread.sleep(100);
        System.out.println("RUNNABLE: " + thread.getState()); // RUNNABLE
        Thread.sleep(1000);
        System.out.println("TIMED_WAITING: " + thread.getState()); // TIMED_WAITING
    }
}
```

### 5. Java 中线程之间如何进行通信？

**答案：**

Java 提供了多种线程间通信机制：

**1. wait/notify/notifyAll 机制**
```java
public class WaitNotifyDemo {
    private static final Object lock = new Object();
    
    public void producer() throws InterruptedException {
        synchronized (lock) {
            System.out.println("生产数据");
            lock.notify(); // 唤醒等待线程
        }
    }
    
    public void consumer() throws InterruptedException {
        synchronized (lock) {
            lock.wait(); // 等待通知
            System.out.println("消费数据");
        }
    }
}
```

**2. volatile 共享变量**
```java
private volatile boolean flag = false;

// 线程1
flag = true;

// 线程2
while (!flag) {
    // 等待
}
```

**3. CountDownLatch**
```java
CountDownLatch latch = new CountDownLatch(3);
// 线程完成后调用
latch.countDown();
// 主线程等待
latch.await();
```

**4. CyclicBarrier**
```java
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("所有线程到达屏障");
});
barrier.await();
```

**5. Semaphore 信号量**
```java
Semaphore semaphore = new Semaphore(3);
semaphore.acquire(); // 获取许可
semaphore.release(); // 释放许可
```

**6. BlockingQueue 阻塞队列**
```java
BlockingQueue<String> queue = new LinkedBlockingQueue<>();
queue.put("data"); // 生产者
String data = queue.take(); // 消费者
```

**7. Condition 条件变量**
```java
Lock lock = new ReentrantLock();
Condition condition = lock.newCondition();
condition.await(); // 等待
condition.signal(); // 唤醒
```

### 6. Java 中如何创建多线程？

**答案：**

Java 创建线程有 4 种主要方式：

**1. 继承 Thread 类**
```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running");
    }
}

// 使用
MyThread thread = new MyThread();
thread.start();
```

**2. 实现 Runnable 接口**
```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable running");
    }
}

// 使用
Thread thread = new Thread(new MyRunnable());
thread.start();

// Lambda 方式
new Thread(() -> System.out.println("Lambda")).start();
```

**3. 实现 Callable 接口（有返回值）**
```java
public class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "Callable result";
    }
}

// 使用
FutureTask<String> futureTask = new FutureTask<>(new MyCallable());
new Thread(futureTask).start();
String result = futureTask.get(); // 获取返回值
```

**4. 使用线程池**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);

// 提交 Runnable
executor.submit(() -> System.out.println("Task"));

// 提交 Callable
Future<String> future = executor.submit(() -> "Result");
String result = future.get();

executor.shutdown();
```

**推荐方式：**
- 实现 Runnable/Callable 接口（避免单继承限制）
- 使用线程池（更好的资源管理和性能）

### 7. 你了解 Java 线程池的原理吗？

**答案：**

**线程池核心参数（ThreadPoolExecutor）：**

```java
public ThreadPoolExecutor(
    int corePoolSize,        // 核心线程数
    int maximumPoolSize,     // 最大线程数
    long keepAliveTime,      // 空闲线程存活时间
    TimeUnit unit,           // 时间单位
    BlockingQueue<Runnable> workQueue,  // 任务队列
    ThreadFactory threadFactory,        // 线程工厂
    RejectedExecutionHandler handler    // 拒绝策略
)
```

**执行流程：**

1. 提交任务时，如果线程数 < corePoolSize，创建新线程执行
2. 如果线程数 >= corePoolSize，任务放入队列
3. 如果队列满了且线程数 < maximumPoolSize，创建新线程
4. 如果线程数 >= maximumPoolSize 且队列满了，执行拒绝策略

```
提交任务
   ↓
线程数 < corePoolSize? → 是 → 创建核心线程执行
   ↓ 否
队列未满? → 是 → 加入队列等待
   ↓ 否
线程数 < maximumPoolSize? → 是 → 创建非核心线程执行
   ↓ 否
执行拒绝策略
```

**示例：**
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,                          // 核心线程数
    10,                         // 最大线程数
    60L,                        // 空闲线程存活时间
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100),  // 队列容量
    Executors.defaultThreadFactory(),
    new ThreadPoolExecutor.AbortPolicy()  // 拒绝策略
);
```

**线程池状态：**
- RUNNING：接受新任务并处理队列任务
- SHUTDOWN：不接受新任务，但处理队列任务
- STOP：不接受新任务，不处理队列任务，中断正在执行的任务
- TIDYING：所有任务已终止
- TERMINATED：terminated() 方法执行完成

### 8. 如何合理地设置 Java 线程池的线程数？

**答案：**

线程数设置需要根据任务类型和系统资源来决定：

**1. CPU 密集型任务**
- 特点：大量计算，很少 I/O 操作
- 推荐线程数：**CPU 核心数 + 1**
- 原因：避免过多线程切换开销

```java
int cpuCount = Runtime.getRuntime().availableProcessors();
int threadCount = cpuCount + 1;
```

**2. I/O 密集型任务**
- 特点：大量网络、磁盘 I/O 操作
- 推荐线程数：**CPU 核心数 × 2** 或 **CPU 核心数 / (1 - 阻塞系数)**
- 阻塞系数：0.8-0.9 之间

```java
int cpuCount = Runtime.getRuntime().availableProcessors();
// 方式1
int threadCount = cpuCount * 2;

// 方式2（更精确）
double blockingCoefficient = 0.9; // I/O 时间占比
int threadCount = (int) (cpuCount / (1 - blockingCoefficient));
```

**3. 混合型任务**
- 可以拆分为 CPU 密集和 I/O 密集，分别使用不同线程池

**4. 实际考虑因素：**
- 系统内存大小（每个线程占用内存）
- 任务执行时间
- 任务优先级
- 系统负载情况

**动态调整示例：**
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    10, 50, 60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(1000)
);

// 运行时动态调整
executor.setCorePoolSize(20);
executor.setMaximumPoolSize(100);
```

**最佳实践：**
- 通过压测确定最优值
- 监控线程池运行状态（活跃线程数、队列大小）
- 根据实际情况动态调整

### 9. Java 线程池有哪些拒绝策略？

**答案：**

Java 提供了 4 种内置拒绝策略（RejectedExecutionHandler）：

**1. AbortPolicy（默认）**
- 直接抛出 RejectedExecutionException 异常
- 适用于关键任务，不允许丢失

```java
new ThreadPoolExecutor.AbortPolicy()
// 抛出异常，调用者需要处理
```

**2. CallerRunsPolicy**
- 由调用线程（提交任务的线程）执行该任务
- 适用于不允许任务丢失，且可以降低提交速度的场景

```java
new ThreadPoolExecutor.CallerRunsPolicy()
// 主线程执行任务，降低提交速度
```

**3. DiscardPolicy**
- 静默丢弃任务，不抛出异常
- 适用于允许任务丢失的场景

```java
new ThreadPoolExecutor.DiscardPolicy()
// 直接丢弃，不做任何处理
```

**4. DiscardOldestPolicy**
- 丢弃队列中最老的任务，然后重新提交当前任务
- 适用于任务有时效性的场景

```java
new ThreadPoolExecutor.DiscardOldestPolicy()
// 丢弃队列头部任务，重试当前任务
```

**自定义拒绝策略：**
```java
public class CustomRejectedHandler implements RejectedExecutionHandler {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        // 记录日志
        log.warn("Task rejected: {}", r.toString());
        
        // 保存到数据库或消息队列
        saveToDatabase(r);
        
        // 或者使用备用线程池
        backupExecutor.execute(r);
    }
}
```

**选择建议：**
- 关键业务：AbortPolicy + 异常处理
- 可降级业务：CallerRunsPolicy
- 允许丢失：DiscardPolicy
- 时效性任务：DiscardOldestPolicy

### 10. Java 并发库中提供了哪些线程池实现？它们有什么区别？

**答案：**

Executors 工厂类提供了几种常用线程池：

**1. FixedThreadPool（固定大小线程池）**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);
// 等价于
new ThreadPoolExecutor(5, 5, 0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>());
```
- 核心线程数 = 最大线程数
- 使用无界队列 LinkedBlockingQueue
- 适用于负载较重的服务器，限制线程数

**2. CachedThreadPool（缓存线程池）**
```java
ExecutorService executor = Executors.newCachedThreadPool();
// 等价于
new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS,
    new SynchronousQueue<Runnable>());
```
- 核心线程数为 0，最大线程数无限
- 使用 SynchronousQueue（不存储元素）
- 线程空闲 60 秒后回收
- 适用于执行大量短期异步任务

**3. SingleThreadExecutor（单线程线程池）**
```java
ExecutorService executor = Executors.newSingleThreadExecutor();
// 等价于
new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS,
    new LinkedBlockingQueue<Runnable>());
```
- 只有一个线程
- 保证任务按顺序执行
- 适用于需要顺序执行的场景

**4. ScheduledThreadPool（定时任务线程池）**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
```
- 支持定时和周期性任务执行
- 使用 DelayedWorkQueue

```java
// 延迟执行
executor.schedule(task, 5, TimeUnit.SECONDS);

// 固定频率执行
executor.scheduleAtFixedRate(task, 0, 1, TimeUnit.SECONDS);

// 固定延迟执行
executor.scheduleWithFixedDelay(task, 0, 1, TimeUnit.SECONDS);
```

**5. WorkStealingPool（工作窃取线程池，Java 8+）**
```java
ExecutorService executor = Executors.newWorkStealingPool();
```
- 基于 ForkJoinPool 实现
- 每个线程有自己的任务队列
- 空闲线程可以"窃取"其他线程的任务
- 适用于任务执行时间不均匀的场景

**对比总结：**

| 类型 | 核心线程数 | 最大线程数 | 队列 | 适用场景 |
|------|-----------|-----------|------|---------|
| FixedThreadPool | n | n | 无界队列 | 负载较重的服务器 |
| CachedThreadPool | 0 | 无限 | SynchronousQueue | 大量短期任务 |
| SingleThreadExecutor | 1 | 1 | 无界队列 | 顺序执行任务 |
| ScheduledThreadPool | n | Integer.MAX_VALUE | DelayedWorkQueue | 定时任务 |
| WorkStealingPool | CPU核心数 | - | 多队列 | 任务时间不均 |

**注意：** 阿里巴巴开发手册不推荐使用 Executors 创建线程池，建议手动创建 ThreadPoolExecutor，明确参数，避免资源耗尽风险。

### 11. Java 线程池核心线程数在运行过程中能修改吗？如何修改？

**答案：**

可以修改。ThreadPoolExecutor 提供了动态调整线程池参数的方法：

**修改核心线程数：**
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5, 10, 60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100)
);

// 动态修改核心线程数
executor.setCorePoolSize(10);

// 获取当前核心线程数
int coreSize = executor.getCorePoolSize();
```

**修改最大线程数：**
```java
executor.setMaximumPoolSize(20);
```

**修改空闲线程存活时间：**
```java
executor.setKeepAliveTime(120L, TimeUnit.SECONDS);
```

**注意事项：**

1. **增加核心线程数**：会立即创建新线程（如果有任务在等待）
2. **减少核心线程数**：多余的核心线程会在空闲后被回收
3. **最大线程数必须 >= 核心线程数**：否则抛出 IllegalArgumentException

**动态调整场景示例：**
```java
public class DynamicThreadPool {
    private ThreadPoolExecutor executor;
    
    public void adjustByLoad() {
        int queueSize = executor.getQueue().size();
        int activeCount = executor.getActiveCount();
        
        // 根据队列大小和活跃线程数动态调整
        if (queueSize > 100 && activeCount < executor.getMaximumPoolSize()) {
            executor.setCorePoolSize(executor.getCorePoolSize() + 5);
        } else if (queueSize < 10 && executor.getCorePoolSize() > 5) {
            executor.setCorePoolSize(executor.getCorePoolSize() - 5);
        }
    }
}
```

**监控线程池状态：**
```java
// 当前线程池大小
int poolSize = executor.getPoolSize();

// 活跃线程数
int activeCount = executor.getActiveCount();

// 队列中任务数
int queueSize = executor.getQueue().size();

// 已完成任务数
long completedTaskCount = executor.getCompletedTaskCount();

// 总任务数
long taskCount = executor.getTaskCount();
```

### 12. 线程池中 shutdown 与 shutdownNow 的区别是什么？

**答案：**

**shutdown() 方法：**
- 温和关闭，不接受新任务
- 继续执行队列中的任务
- 等待所有任务执行完成
- 不会中断正在执行的任务

```java
executor.shutdown();

// 等待所有任务完成
try {
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        executor.shutdownNow(); // 超时后强制关闭
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
}
```

**shutdownNow() 方法：**
- 立即关闭，不接受新任务
- 尝试停止所有正在执行的任务（发送中断信号）
- 不再执行队列中等待的任务
- 返回等待执行的任务列表

```java
List<Runnable> notExecutedTasks = executor.shutdownNow();
System.out.println("未执行的任务数: " + notExecutedTasks.size());
```

**对比表：**

| 特性 | shutdown() | shutdownNow() |
|------|-----------|---------------|
| 接受新任务 | 否 | 否 |
| 执行队列任务 | 是 | 否 |
| 中断运行任务 | 否 | 是（发送中断） |
| 返回值 | void | List&lt;Runnable&gt; |
| 关闭速度 | 慢（等待完成） | 快（立即停止） |

**完整关闭示例：**
```java
public void shutdownGracefully(ExecutorService executor) {
    executor.shutdown(); // 禁止新任务提交
    
    try {
        // 等待 60 秒让任务完成
        if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
            // 超时后强制关闭
            List<Runnable> droppedTasks = executor.shutdownNow();
            System.out.println("强制关闭，丢弃任务: " + droppedTasks.size());
            
            // 再等待 60 秒
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                System.err.println("线程池未能正常关闭");
            }
        }
    } catch (InterruptedException e) {
        // 当前线程被中断，强制关闭线程池
        executor.shutdownNow();
        Thread.currentThread().interrupt();
    }
}
```

**注意事项：**
1. shutdownNow() 不保证能停止正在执行的任务（任务需要响应中断）
2. 任务应该正确处理 InterruptedException
3. 使用 awaitTermination() 等待线程池真正终止

### 13. 线程池内部任务出异常后，如何知道是哪个线程出了异常？

**答案：**

线程池任务异常处理有多种方式：

**1. 使用 Future.get() 捕获异常**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);

Future<?> future = executor.submit(() -> {
    throw new RuntimeException("任务异常");
});

try {
    future.get(); // 会抛出 ExecutionException
} catch (ExecutionException e) {
    Throwable cause = e.getCause();
    System.out.println("任务异常: " + cause.getMessage());
}
```

**2. 在任务内部捕获异常**
```java
executor.submit(() -> {
    try {
        // 任务逻辑
        int result = 1 / 0;
    } catch (Exception e) {
        System.out.println("线程: " + Thread.currentThread().getName() 
            + " 异常: " + e.getMessage());
        // 记录日志或上报
    }
});
```

**3. 自定义 ThreadFactory 设置 UncaughtExceptionHandler**
```java
ThreadFactory factory = new ThreadFactory() {
    private AtomicInteger threadNumber = new AtomicInteger(1);
    
    @Override
    public Thread newThread(Runnable r) {
        Thread thread = new Thread(r);
        thread.setName("MyPool-" + threadNumber.getAndIncrement());
        
        // 设置未捕获异常处理器
        thread.setUncaughtExceptionHandler((t, e) -> {
            System.out.println("线程 " + t.getName() + " 异常: " + e.getMessage());
            // 记录日志、发送告警
        });
        
        return thread;
    }
};

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5, 10, 60L, TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(),
    factory
);
```

**4. 重写 ThreadPoolExecutor.afterExecute() 方法**
```java
public class CustomThreadPoolExecutor extends ThreadPoolExecutor {
    
    public CustomThreadPoolExecutor(int corePoolSize, int maximumPoolSize,
            long keepAliveTime, TimeUnit unit, BlockingQueue<Runnable> workQueue) {
        super(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue);
    }
    
    @Override
    protected void afterExecute(Runnable r, Throwable t) {
        super.afterExecute(r, t);
        
        if (t == null && r instanceof Future<?>) {
            try {
                Future<?> future = (Future<?>) r;
                if (future.isDone()) {
                    future.get();
                }
            } catch (ExecutionException e) {
                t = e.getCause();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        if (t != null) {
            System.out.println("任务执行异常: " + t.getMessage());
            // 记录日志、发送告警
        }
    }
}
```

**5. 使用 CompletableFuture 处理异常**
```java
CompletableFuture.supplyAsync(() -> {
    // 任务逻辑
    return 1 / 0;
}, executor).exceptionally(ex -> {
    System.out.println("异常处理: " + ex.getMessage());
    return null;
});
```

**最佳实践：**
- submit() 提交的任务使用 Future.get() 获取异常
- execute() 提交的任务使用 UncaughtExceptionHandler
- 重要任务在内部 try-catch 处理异常
- 记录详细的异常信息（线程名、时间、堆栈）

### 14. Java 中的 DelayQueue 和 ScheduledThreadPool 有什么区别？

**答案：**

**DelayQueue：**
- 是一个阻塞队列，存储 Delayed 元素
- 只有到期的元素才能被取出
- 需要手动从队列中取元素并处理
- 更灵活，可以自定义处理逻辑

```java
public class DelayedTask implements Delayed {
    private String name;
    private long delayTime; // 延迟时间（毫秒）
    private long expire;    // 到期时间
    
    public DelayedTask(String name, long delayTime) {
        this.name = name;
        this.delayTime = delayTime;
        this.expire = System.currentTimeMillis() + delayTime;
    }
    
    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(expire - System.currentTimeMillis(), 
            TimeUnit.MILLISECONDS);
    }
    
    @Override
    public int compareTo(Delayed o) {
        return Long.compare(this.expire, ((DelayedTask) o).expire);
    }
}

// 使用
DelayQueue<DelayedTask> queue = new DelayQueue<>();
queue.put(new DelayedTask("task1", 5000)); // 5秒后到期

// 手动取出并处理
DelayedTask task = queue.take(); // 阻塞直到有元素到期
System.out.println("执行任务: " + task.getName());
```

**ScheduledThreadPool：**
- 是一个线程池，专门用于执行定时任务
- 自动调度和执行任务
- 支持固定延迟和固定频率执行
- 内部使用 DelayedWorkQueue

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);

// 延迟执行（一次性）
scheduler.schedule(() -> {
    System.out.println("5秒后执行");
}, 5, TimeUnit.SECONDS);

// 固定频率执行（周期性）
scheduler.scheduleAtFixedRate(() -> {
    System.out.println("每秒执行一次");
}, 0, 1, TimeUnit.SECONDS);

// 固定延迟执行（周期性）
scheduler.scheduleWithFixedDelay(() -> {
    System.out.println("上次执行完成后延迟1秒再执行");
}, 0, 1, TimeUnit.SECONDS);
```

**主要区别：**

| 特性 | DelayQueue | ScheduledThreadPool |
|------|-----------|---------------------|
| 类型 | 阻塞队列 | 线程池 |
| 自动执行 | 否，需手动取出 | 是，自动调度执行 |
| 周期任务 | 不支持 | 支持 |
| 线程管理 | 需自己管理 | 自动管理 |
| 使用复杂度 | 较高 | 较低 |
| 灵活性 | 高 | 中 |
| 适用场景 | 自定义调度逻辑 | 标准定时任务 |

**scheduleAtFixedRate vs scheduleWithFixedDelay：**

```java
// scheduleAtFixedRate: 固定频率
// 如果任务执行时间 < 间隔时间，按固定频率执行
// 如果任务执行时间 > 间隔时间，任务执行完立即开始下一次
scheduler.scheduleAtFixedRate(task, 0, 1, TimeUnit.SECONDS);
// 0s -> 1s -> 2s -> 3s (理想情况)

// scheduleWithFixedDelay: 固定延迟
// 上次任务执行完成后，延迟指定时间再执行
scheduler.scheduleWithFixedDelay(task, 0, 1, TimeUnit.SECONDS);
// 0s -> 任务完成(0.5s) -> 1.5s -> 任务完成(2s) -> 3s
```

**选择建议：**
- 简单定时任务：使用 ScheduledThreadPool
- 复杂调度逻辑：使用 DelayQueue
- 需要周期执行：使用 ScheduledThreadPool
- 需要动态调整延迟：使用 DelayQueue

### 15. 什么是 Java 的 Timer？

**答案：**

Timer 是 Java 早期提供的定时任务工具类，使用单线程执行所有定时任务。

```java
Timer timer = new Timer();

// 延迟执行
timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println("5秒后执行");
    }
}, 5000);

// 周期执行
timer.scheduleAtFixedRate(new TimerTask() {
    @Override
    public void run() {
        System.out.println("每秒执行");
    }
}, 0, 1000);
```

**Timer 的缺点：**

1. **单线程执行**：所有任务串行执行，一个任务延迟会影响其他任务
2. **异常处理差**：任务抛出异常会导致整个 Timer 终止
3. **不支持绝对时间**：基于相对时间，系统时间改变会影响调度
4. **功能有限**：不支持线程池、返回值等

```java
// 问题示例：一个任务异常导致 Timer 终止
Timer timer = new Timer();
timer.schedule(new TimerTask() {
    @Override
    public void run() {
        throw new RuntimeException("异常");
    }
}, 1000);

timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println("这个任务不会执行");
    }
}, 2000);
```

**替代方案：**
- 使用 ScheduledExecutorService（推荐）
- 使用 Quartz 等专业调度框架
- 使用 Spring 的 @Scheduled 注解

### 16. 你了解时间轮（Time Wheel）吗？有哪些应用场景？

**答案：**

**时间轮（Time Wheel）** 是一种高效的定时器算法，用于管理大量定时任务。

**原理：**
- 类似时钟，将时间分成多个槽位（slot）
- 每个槽位存储该时间点要执行的任务
- 指针按固定频率移动，执行当前槽位的任务
- 支持多层时间轮（秒、分、时）

```
时间轮示意图：
     0
  7     1
6         2
  5     3
     4

每个槽位存储任务链表
指针每秒移动一格
```

**简单实现：**
```java
public class SimpleTimeWheel {
    private List<Set<Task>> wheel;
    private int tickDuration;  // 每格时间（毫秒）
    private int wheelSize;     // 轮子大小
    private int currentTick;   // 当前指针位置
    
    public SimpleTimeWheel(int tickDuration, int wheelSize) {
        this.tickDuration = tickDuration;
        this.wheelSize = wheelSize;
        this.wheel = new ArrayList<>(wheelSize);
        for (int i = 0; i < wheelSize; i++) {
            wheel.add(new HashSet<>());
        }
    }
    
    public void addTask(Task task, long delayMs) {
        int ticks = (int) (delayMs / tickDuration);
        int index = (currentTick + ticks) % wheelSize;
        wheel.get(index).add(task);
    }
    
    public void tick() {
        Set<Task> tasks = wheel.get(currentTick);
        tasks.forEach(Task::run);
        tasks.clear();
        currentTick = (currentTick + 1) % wheelSize;
    }
}
```

**优点：**
- 添加/删除任务时间复杂度 O(1)
- 适合大量定时任务
- 内存占用可控

**缺点：**
- 精度受限于 tick 间隔
- 不适合长时间延迟（需要多层时间轮）

**应用场景：**

1. **Netty 的 HashedWheelTimer**
```java
HashedWheelTimer timer = new HashedWheelTimer(
    100, TimeUnit.MILLISECONDS,  // tick 间隔
    512                          // 轮子大小
);

timer.newTimeout(timeout -> {
    System.out.println("任务执行");
}, 5, TimeUnit.SECONDS);
```

2. **Kafka 的延迟操作**
3. **Dubbo 的超时检测**
4. **连接超时管理**
5. **会话过期检测**

**与其他定时器对比：**

| 方案 | 添加任务 | 删除任务 | 适用场景 |
|------|---------|---------|---------|
| Timer | O(log n) | O(n) | 少量任务 |
| ScheduledThreadPool | O(log n) | O(log n) | 中等任务 |
| 时间轮 | O(1) | O(1) | 大量任务 |

### 17. 你使用过哪些 Java 并发工具类？

**答案：**

Java 并发包（java.util.concurrent）提供了丰富的并发工具类：

**1. 同步工具类**

**CountDownLatch（倒计数门栓）**
```java
CountDownLatch latch = new CountDownLatch(3);

// 工作线程
new Thread(() -> {
    System.out.println("任务1完成");
    latch.countDown();
}).start();

// 主线程等待
latch.await(); // 等待计数归零
System.out.println("所有任务完成");
```

**CyclicBarrier（循环栅栏）**
```java
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("所有线程到达屏障");
});

// 每个线程
barrier.await(); // 等待其他线程
```

**Semaphore（信号量）**
```java
Semaphore semaphore = new Semaphore(3); // 3个许可

semaphore.acquire(); // 获取许可
try {
    // 执行任务
} finally {
    semaphore.release(); // 释放许可
}
```

**Exchanger（交换器）**
```java
Exchanger<String> exchanger = new Exchanger<>();

// 线程1
String data1 = exchanger.exchange("数据1");

// 线程2
String data2 = exchanger.exchange("数据2");
```

**2. 并发容器**

```java
// 线程安全的 Map
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();

// 线程安全的 List（读多写少）
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

// 线程安全的 Set
CopyOnWriteArraySet<String> set = new CopyOnWriteArraySet<>();

// 阻塞队列
BlockingQueue<String> queue = new LinkedBlockingQueue<>();
```

**3. 原子类**

```java
// 原子整数
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();

// 原子引用
AtomicReference<User> userRef = new AtomicReference<>();
userRef.compareAndSet(oldUser, newUser);

// 原子数组
AtomicIntegerArray array = new AtomicIntegerArray(10);

// 原子字段更新器
AtomicIntegerFieldUpdater<User> updater = 
    AtomicIntegerFieldUpdater.newUpdater(User.class, "age");
```

**4. 锁**

```java
// 可重入锁
ReentrantLock lock = new ReentrantLock();

// 读写锁
ReadWriteLock rwLock = new ReentrantReadWriteLock();

// 邮戳锁（Java 8+）
StampedLock stampedLock = new StampedLock();
```

**5. 异步编程**

```java
// CompletableFuture
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenApply(s -> s + " World");

// ForkJoinPool
ForkJoinPool pool = new ForkJoinPool();
```

**6. 线程池**

```java
// 标准线程池
ExecutorService executor = Executors.newFixedThreadPool(5);

// 定时线程池
ScheduledExecutorService scheduler = 
    Executors.newScheduledThreadPool(5);
```

**常用场景总结：**
- 等待多个任务完成：CountDownLatch
- 多线程协同工作：CyclicBarrier
- 限流控制：Semaphore
- 线程安全集合：ConcurrentHashMap、CopyOnWriteArrayList
- 原子操作：AtomicInteger、AtomicReference
- 异步编程：CompletableFuture

### 18. 什么是 Java 的 Semaphore？

**答案：**

Semaphore（信号量）是一个计数信号量，用于控制同时访问特定资源的线程数量。

**核心方法：**
- `acquire()`：获取许可，如果没有可用许可则阻塞
- `release()`：释放许可
- `tryAcquire()`：尝试获取许可，立即返回
- `availablePermits()`：返回可用许可数

**基本使用：**
```java
// 创建3个许可的信号量
Semaphore semaphore = new Semaphore(3);

public void accessResource() {
    try {
        semaphore.acquire(); // 获取许可
        System.out.println(Thread.currentThread().getName() + " 访问资源");
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    } finally {
        semaphore.release(); // 释放许可
    }
}
```

**应用场景：**

**1. 限流控制**
```java
public class RateLimiter {
    private Semaphore semaphore;
    
    public RateLimiter(int maxConcurrent) {
        this.semaphore = new Semaphore(maxConcurrent);
    }
    
    public void execute(Runnable task) {
        try {
            semaphore.acquire();
            task.run();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();
        }
    }
}
```

**2. 数据库连接池**
```java
public class ConnectionPool {
    private Semaphore semaphore;
    private List<Connection> connections;
    
    public ConnectionPool(int size) {
        this.semaphore = new Semaphore(size);
        this.connections = new ArrayList<>(size);
        // 初始化连接
    }
    
    public Connection getConnection() throws InterruptedException {
        semaphore.acquire();
        return connections.remove(0);
    }
    
    public void releaseConnection(Connection conn) {
        connections.add(conn);
        semaphore.release();
    }
}
```

**公平性：**
```java
// 非公平模式（默认）：性能更好
Semaphore semaphore = new Semaphore(3);

// 公平模式：按照请求顺序获取许可
Semaphore fairSemaphore = new Semaphore(3, true);
```

### 19. 什么是 Java 的 CyclicBarrier？

**答案：**

CyclicBarrier（循环栅栏）是一个同步辅助类，让一组线程相互等待，直到所有线程都到达某个公共屏障点。

**特点：**
- 可循环使用（Cyclic）
- 所有线程到达屏障点后，可以执行一个可选的屏障动作
- 适用于多线程协同工作的场景

**基本使用：**
```java
CyclicBarrier barrier = new CyclicBarrier(3, () -> {
    System.out.println("所有线程都到达屏障，执行汇总操作");
});

// 每个线程
public void doWork() {
    try {
        System.out.println(Thread.currentThread().getName() + " 开始工作");
        Thread.sleep(1000);
        System.out.println(Thread.currentThread().getName() + " 完成工作，等待其他线程");
        
        barrier.await(); // 等待其他线程
        
        System.out.println(Thread.currentThread().getName() + " 继续执行");
    } catch (InterruptedException | BrokenBarrierException e) {
        e.printStackTrace();
    }
}
```

**应用场景：**

**1. 多线程计算后汇总**
```java
public class ParallelCalculation {
    private CyclicBarrier barrier;
    private int[] results;
    
    public ParallelCalculation(int threadCount) {
        this.results = new int[threadCount];
        this.barrier = new CyclicBarrier(threadCount, () -> {
            // 所有线程计算完成，汇总结果
            int sum = Arrays.stream(results).sum();
            System.out.println("总和: " + sum);
        });
    }
    
    public void calculate(int index) {
        try {
            // 执行计算
            results[index] = index * 10;
            
            // 等待其他线程
            barrier.await();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**2. 多阶段任务**
```java
CyclicBarrier barrier = new CyclicBarrier(3);

for (int phase = 0; phase < 3; phase++) {
    final int currentPhase = phase;
    for (int i = 0; i < 3; i++) {
        new Thread(() -> {
            System.out.println("阶段" + currentPhase + " 执行");
            try {
                barrier.await(); // 等待本阶段所有线程完成
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

**重要方法：**
```java
// 等待其他线程
barrier.await();

// 带超时的等待
barrier.await(10, TimeUnit.SECONDS);

// 重置屏障
barrier.reset();

// 获取等待线程数
int waiting = barrier.getNumberWaiting();

// 检查屏障是否被破坏
boolean broken = barrier.isBroken();
```

### 20. 什么是 Java 的 CountDownLatch？

**答案：**

CountDownLatch（倒计数门栓）是一个同步辅助类，允许一个或多个线程等待其他线程完成操作。

**特点：**
- 基于计数器，初始化时设置计数值
- 调用 `countDown()` 减少计数
- 调用 `await()` 阻塞直到计数归零
- 一次性使用，不能重置

**基本使用：**
```java
CountDownLatch latch = new CountDownLatch(3);

// 工作线程
for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println(Thread.currentThread().getName() + " 执行任务");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        latch.countDown(); // 计数减1
    }).start();
}

// 主线程等待
latch.await(); // 阻塞直到计数归零
System.out.println("所有任务完成");
```

**应用场景：**

**1. 等待多个线程完成初始化**
```java
public class ApplicationStartup {
    private CountDownLatch latch;
    
    public void start() throws InterruptedException {
        latch = new CountDownLatch(3);
        
        // 初始化数据库
        new Thread(() -> {
            System.out.println("初始化数据库");
            latch.countDown();
        }).start();
        
        // 初始化缓存
        new Thread(() -> {
            System.out.println("初始化缓存");
            latch.countDown();
        }).start();
        
        // 初始化配置
        new Thread(() -> {
            System.out.println("初始化配置");
            latch.countDown();
        }).start();
        
        // 等待所有初始化完成
        latch.await();
        System.out.println("应用启动完成");
    }
}
```

**2. 并行任务执行**
```java
public class ParallelTask {
    public void executeParallel(List<Runnable> tasks) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(tasks.size());
        
        for (Runnable task : tasks) {
            new Thread(() -> {
                try {
                    task.run();
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        
        latch.await(); // 等待所有任务完成
    }
}
```

**3. 模拟并发测试**
```java
public class ConcurrencyTest {
    public void testConcurrency(int threadCount) throws InterruptedException {
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(threadCount);
        
        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                try {
                    startLatch.await(); // 等待开始信号
                    // 执行测试
                    System.out.println("执行测试");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    endLatch.countDown();
                }
            }).start();
        }
        
        startLatch.countDown(); // 发出开始信号，所有线程同时开始
        endLatch.await(); // 等待所有线程完成
        System.out.println("测试完成");
    }
}
```

**CountDownLatch vs CyclicBarrier：**

| 特性 | CountDownLatch | CyclicBarrier |
|------|---------------|---------------|
| 可重用性 | 不可重用 | 可重用 |
| 等待方式 | 一个或多个线程等待 | 所有线程相互等待 |
| 计数方式 | 递减到0 | 递增到N |
| 屏障动作 | 无 | 有 |
| 使用场景 | 主线程等待子线程 | 多线程协同 |

### 21. 什么是 Java 的 StampedLock？

### 22. 什么是 Java 的 CompletableFuture？

### 23. 什么是 Java 的 ForkJoinPool？

### 24. 如何在 Java 中控制多个线程的执行顺序？

### 25. 你使用过 Java 中的哪些阻塞队列？

### 26. 你使用过 Java 中的哪些原子类？

**答案：**

Java 提供了 java.util.concurrent.atomic 包，包含多种原子类，保证操作的原子性。

**1. 基本类型原子类**
```java
// AtomicInteger
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // i++
count.getAndIncrement();  // ++i
count.addAndGet(5);       // i += 5
count.compareAndSet(0, 1); // CAS操作

// AtomicLong
AtomicLong longValue = new AtomicLong(0L);

// AtomicBoolean
AtomicBoolean flag = new AtomicBoolean(false);
flag.compareAndSet(false, true);
```

**2. 数组类型原子类**
```java
// AtomicIntegerArray
AtomicIntegerArray array = new AtomicIntegerArray(10);
array.incrementAndGet(0);  // 数组索引0的元素+1
array.compareAndSet(0, 1, 2); // CAS操作

// AtomicLongArray
AtomicLongArray longArray = new AtomicLongArray(10);

// AtomicReferenceArray
AtomicReferenceArray<String> refArray = new AtomicReferenceArray<>(10);
```

**3. 引用类型原子类**
```java
// AtomicReference
AtomicReference<User> userRef = new AtomicReference<>();
User oldUser = new User("张三");
User newUser = new User("李四");
userRef.compareAndSet(oldUser, newUser);

// AtomicStampedReference（解决ABA问题）
AtomicStampedReference<String> stampedRef = 
    new AtomicStampedReference<>("初始值", 0);
int stamp = stampedRef.getStamp();
stampedRef.compareAndSet("初始值", "新值", stamp, stamp + 1);

// AtomicMarkableReference（标记是否被修改过）
AtomicMarkableReference<String> markableRef = 
    new AtomicMarkableReference<>("初始值", false);
markableRef.compareAndSet("初始值", "新值", false, true);
```

**4. 字段更新器**
```java
class User {
    volatile int age;
    volatile String name;
}

// AtomicIntegerFieldUpdater
AtomicIntegerFieldUpdater<User> ageUpdater = 
    AtomicIntegerFieldUpdater.newUpdater(User.class, "age");
User user = new User();
ageUpdater.incrementAndGet(user);

// AtomicReferenceFieldUpdater
AtomicReferenceFieldUpdater<User, String> nameUpdater = 
    AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "name");
nameUpdater.compareAndSet(user, "旧名字", "新名字");
```

**应用场景示例：**
```java
// 1. 计数器
public class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public int getCount() {
        return count.get();
    }
}

// 2. 单例模式
public class Singleton {
    private static final AtomicReference<Singleton> INSTANCE = 
        new AtomicReference<>();
    
    public static Singleton getInstance() {
        while (true) {
            Singleton current = INSTANCE.get();
            if (current != null) {
                return current;
            }
            current = new Singleton();
            if (INSTANCE.compareAndSet(null, current)) {
                return current;
            }
        }
    }
}
```

### 27. 你使用过 Java 的累加器吗？

**答案：**

Java 8 引入了累加器（Accumulator），在高并发场景下性能优于原子类。

**1. LongAdder（长整型累加器）**
```java
LongAdder adder = new LongAdder();

// 多线程累加
for (int i = 0; i < 10; i++) {
    new Thread(() -> {
        for (int j = 0; j < 1000; j++) {
            adder.increment(); // 加1
            adder.add(5);      // 加5
        }
    }).start();
}

// 获取结果
long sum = adder.sum();
```

**2. LongAccumulator（长整型累积器）**
```java
// 自定义累积函数（求最大值）
LongAccumulator accumulator = new LongAccumulator(Long::max, Long.MIN_VALUE);

accumulator.accumulate(100);
accumulator.accumulate(200);
accumulator.accumulate(50);

long max = accumulator.get(); // 200
```

**3. DoubleAdder 和 DoubleAccumulator**
```java
DoubleAdder doubleAdder = new DoubleAdder();
doubleAdder.add(1.5);
double sum = doubleAdder.sum();

DoubleAccumulator doubleAccumulator = 
    new DoubleAccumulator(Double::sum, 0.0);
```

**性能对比：**
```java
// AtomicLong vs LongAdder 性能测试
public class PerformanceTest {
    public static void testAtomicLong() {
        AtomicLong atomicLong = new AtomicLong(0);
        long start = System.currentTimeMillis();
        
        // 10个线程，每个累加100万次
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000000; j++) {
                    atomicLong.incrementAndGet();
                }
            }).start();
        }
        
        // AtomicLong: 约2000ms
    }
    
    public static void testLongAdder() {
        LongAdder longAdder = new LongAdder();
        long start = System.currentTimeMillis();
        
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000000; j++) {
                    longAdder.increment();
                }
            }).start();
        }
        
        // LongAdder: 约500ms（快4倍）
    }
}
```

**原理：**
- AtomicLong：所有线程竞争同一个变量，CAS 冲突多
- LongAdder：每个线程维护自己的计数器（Cell），最后汇总，减少竞争

**内部结构：**
```
LongAdder
├── base (基础值)
└── cells[] (Cell数组)
    ├── Cell[0] (线程1的计数)
    ├── Cell[1] (线程2的计数)
    └── Cell[2] (线程3的计数)

sum() = base + Cell[0] + Cell[1] + Cell[2] + ...
```

**选择建议：**
- 低并发场景：AtomicLong（更简单）
- 高并发累加：LongAdder（性能更好）
- 需要 CAS 操作：AtomicLong
- 只需要累加：LongAdder

### 28. 什么是 Java 的 CAS（Compare-And-Swap）操作？

**答案：**

CAS（Compare-And-Swap）是一种无锁的原子操作，用于实现并发控制。

**原理：**
CAS 包含三个操作数：
- V：内存位置（变量）
- E：预期值（Expected）
- N：新值（New）

只有当 V 的值等于 E 时，才将 V 的值设置为 N，否则不做任何操作。整个过程是原子的。

**伪代码：**
```java
boolean compareAndSwap(Variable V, int E, int N) {
    if (V == E) {
        V = N;
        return true;
    }
    return false;
}
```

**Java 中的 CAS：**
```java
AtomicInteger count = new AtomicInteger(0);

// CAS 操作
boolean success = count.compareAndSet(0, 1);
// 如果当前值是0，则设置为1，返回true
// 如果当前值不是0，不做任何操作，返回false

// 自旋 CAS
public void increment() {
    int oldValue;
    int newValue;
    do {
        oldValue = count.get();
        newValue = oldValue + 1;
    } while (!count.compareAndSet(oldValue, newValue));
}
```

**底层实现：**
```java
// Unsafe 类提供的 CAS 方法
public final native boolean compareAndSwapInt(
    Object o,      // 对象
    long offset,   // 字段偏移量
    int expected,  // 预期值
    int x          // 新值
);

// CPU 指令（x86）
lock cmpxchg [内存地址], 新值
```

**CAS 的优点：**
1. 无锁，避免线程阻塞和上下文切换
2. 性能高于 synchronized
3. 适合低并发场景

**CAS 的缺点：**

**1. ABA 问题**
```java
// 线程1：读取值A
int value = atomicInt.get(); // A

// 线程2：A -> B -> A
atomicInt.compareAndSet(A, B);
atomicInt.compareAndSet(B, A);

// 线程1：CAS成功，但值已经被修改过
atomicInt.compareAndSet(A, C); // 成功，但不知道中间变化

// 解决方案：使用版本号
AtomicStampedReference<Integer> stampedRef = 
    new AtomicStampedReference<>(A, 0);
int stamp = stampedRef.getStamp();
stampedRef.compareAndSet(A, C, stamp, stamp + 1);
```

**2. 循环时间长开销大**
```java
// 高并发下，CAS 失败次数多，CPU 开销大
public void increment() {
    int oldValue;
    int newValue;
    do {
        oldValue = count.get();
        newValue = oldValue + 1;
        // 高并发下可能循环很多次
    } while (!count.compareAndSet(oldValue, newValue));
}

// 解决方案：使用 LongAdder 或加锁
```

**3. 只能保证一个共享变量的原子操作**
```java
// 不能同时 CAS 多个变量
// 解决方案：
// 1. 使用 AtomicReference 包装多个变量
class Pair {
    int a;
    int b;
}
AtomicReference<Pair> pairRef = new AtomicReference<>(new Pair());

// 2. 使用锁
synchronized (lock) {
    a++;
    b++;
}
```

**应用场景：**
- 原子类（AtomicInteger、AtomicReference）
- 并发容器（ConcurrentHashMap）
- AQS（AbstractQueuedSynchronizer）
- 乐观锁实现

### 29. 说说 AQS 吧？

**答案：**

AQS（AbstractQueuedSynchronizer）是 Java 并发包的核心基础框架，用于构建锁和同步器。

**核心思想：**
- 使用一个 int 类型的 state 变量表示同步状态
- 使用 FIFO 队列管理等待线程
- 提供独占模式和共享模式

**核心组件：**

**1. 同步状态（state）**
```java
private volatile int state;

// 获取状态
protected final int getState()

// 设置状态
protected final void setState(int newState)

// CAS 设置状态
protected final boolean compareAndSetState(int expect, int update)
```

**2. 等待队列（CLH 队列）**
```
head -> Node1 -> Node2 -> Node3 -> tail
        (等待)   (等待)   (等待)
```

每个 Node 包含：
- thread：等待的线程
- waitStatus：等待状态
- prev/next：前驱/后继节点

**工作流程：**

**独占模式（如 ReentrantLock）：**
```java
// 1. 尝试获取锁
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&  // 尝试获取（子类实现）
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) {  // 加入队列等待
        selfInterrupt();
    }
}

// 2. 释放锁
public final boolean release(int arg) {
    if (tryRelease(arg)) {  // 尝试释放（子类实现）
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);  // 唤醒后继节点
        return true;
    }
    return false;
}
```

**共享模式（如 Semaphore、CountDownLatch）：**
```java
// 获取共享锁
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)  // 尝试获取
        doAcquireShared(arg);  // 加入队列等待
}

// 释放共享锁
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {  // 尝试释放
        doReleaseShared();  // 唤醒后继节点
        return true;
    }
    return false;
}
```

**自定义同步器示例：**
```java
// 自定义互斥锁
public class Mutex implements Lock {
    private static class Sync extends AbstractQueuedSynchronizer {
        // 尝试获取锁
        @Override
        protected boolean tryAcquire(int arg) {
            return compareAndSetState(0, 1);
        }
        
        // 尝试释放锁
        @Override
        protected boolean tryRelease(int arg) {
            setState(0);
            return true;
        }
        
        // 是否被独占
        @Override
        protected boolean isHeldExclusively() {
            return getState() == 1;
        }
        
        Condition newCondition() {
            return new ConditionObject();
        }
    }
    
    private final Sync sync = new Sync();
    
    @Override
    public void lock() {
        sync.acquire(1);
    }
    
    @Override
    public void unlock() {
        sync.release(1);
    }
    
    // 其他方法实现...
}
```

**基于 AQS 的同步器：**
- ReentrantLock：独占锁
- ReentrantReadWriteLock：读写锁
- Semaphore：信号量
- CountDownLatch：倒计数门栓
- CyclicBarrier：循环栅栏（基于 ReentrantLock）

**AQS 的优势：**
1. 提供统一的框架，简化同步器实现
2. 高效的等待队列管理
3. 支持可中断、超时、公平/非公平
4. 提供 Condition 支持

### 30. Java 中 ReentrantLock 的实现原理是什么？

**答案：**

ReentrantLock 是基于 AQS 实现的可重入独占锁。

**核心特性：**
1. 可重入：同一线程可以多次获取锁
2. 公平/非公平：支持两种模式
3. 可中断：支持中断等待
4. 可超时：支持超时获取锁
5. Condition 支持：支持多个条件变量

**内部结构：**
```java
public class ReentrantLock implements Lock {
    private final Sync sync;
    
    // 抽象同步器
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // state 表示重入次数
    }
    
    // 非公平同步器
    static final class NonfairSync extends Sync {
        final void lock() {
            // 直接尝试 CAS 获取锁
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                acquire(1);
        }
    }
    
    // 公平同步器
    static final class FairSync extends Sync {
        final void lock() {
            // 必须排队
            acquire(1);
        }
        
        protected final boolean tryAcquire(int acquires) {
            // 检查队列中是否有等待线程
            if (hasQueuedPredecessors())
                return false;
            // ...
        }
    }
}
```

**加锁流程：**

**非公平锁：**
```java
public void lock() {
    // 1. 直接尝试 CAS 获取锁
    if (compareAndSetState(0, 1)) {
        setExclusiveOwnerThread(Thread.currentThread());
        return;
    }
    
    // 2. CAS 失败，调用 AQS 的 acquire
    acquire(1);
        // 2.1 tryAcquire：再次尝试获取
        // 2.2 失败则加入等待队列
        // 2.3 park 阻塞线程
}
```

**公平锁：**
```java
public void lock() {
    acquire(1);
        // 1. tryAcquire：检查队列是否有等待线程
        // 2. 有等待线程则直接失败
        // 3. 没有等待线程则尝试 CAS 获取
        // 4. 失败则加入队列等待
}
```

**重入实现：**
```java
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    
    if (c == 0) {
        // 锁空闲，尝试获取
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    } else if (current == getExclusiveOwnerThread()) {
        // 当前线程已持有锁，重入
        int nextc = c + acquires;
        if (nextc < 0) // 溢出检查
            throw new Error("Maximum lock count exceeded");
        setState(nextc);  // 增加重入次数
        return true;
    }
    return false;
}
```

**解锁流程：**
```java
public void unlock() {
    release(1);
}

protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    
    boolean free = false;
    if (c == 0) {
        // 重入次数归零，完全释放锁
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);  // 减少重入次数
    return free;
}
```

**使用示例：**
```java
ReentrantLock lock = new ReentrantLock();

// 基本使用
lock.lock();
try {
    // 临界区代码
} finally {
    lock.unlock();
}

// 可中断
try {
    lock.lockInterruptibly();
    // 临界区代码
} catch (InterruptedException e) {
    // 处理中断
} finally {
    lock.unlock();
}

// 超时获取
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // 临界区代码
    } finally {
        lock.unlock();
    }
} else {
    // 获取锁失败
}

// Condition 使用
Condition condition = lock.newCondition();
lock.lock();
try {
    condition.await();  // 等待
    condition.signal(); // 唤醒
} finally {
    lock.unlock();
}
```

**公平锁 vs 非公平锁：**

| 特性 | 公平锁 | 非公平锁 |
|------|-------|---------|
| 获取顺序 | 按排队顺序 | 可插队 |
| 性能 | 较低 | 较高 |
| 吞吐量 | 较低 | 较高 |
| 线程切换 | 更多 | 更少 |
| 适用场景 | 需要公平性 | 追求性能 |

**默认使用非公平锁：**
```java
// 非公平锁（默认）
ReentrantLock lock = new ReentrantLock();

// 公平锁
ReentrantLock fairLock = new ReentrantLock(true);
```

### 31. Java 的 synchronized 是怎么实现的？

**答案：**

synchronized 是 Java 提供的内置锁机制，基于对象监视器（Monitor）实现。

**实现层次：**

**1. 字节码层面**
```java
public void syncMethod() {
    synchronized (this) {
        // 临界区代码
    }
}

// 字节码
monitorenter  // 进入监视器（获取锁）
// 临界区代码
monitorexit   // 退出监视器（释放锁）
monitorexit   // 异常情况的释放
```

**2. 对象头（Mark Word）**

Java 对象在内存中的布局：
```
|--------------------------------------------------------------|
| Object Header (对象头)                                        |
|--------------------------------------------------------------|
| Mark Word (标记字段，8字节)                                    |
| Class Pointer (类型指针，4/8字节)                              |
|--------------------------------------------------------------|
| Instance Data (实例数据)                                      |
|--------------------------------------------------------------|
| Padding (对齐填充)                                            |
|--------------------------------------------------------------|
```

Mark Word 存储锁信息：
```
|----------|---------------------------|
| 锁状态    | Mark Word 内容             |
|----------|---------------------------|
| 无锁     | hashCode | age | 0 | 01   |
| 偏向锁   | threadID | epoch | 1 | 01 |
| 轻量级锁 | 栈中锁记录指针 | 00        |
| 重量级锁 | Monitor 指针 | 10          |
| GC标记   | 空 | 11                      |
|----------|---------------------------|
```

**3. 锁升级过程**

**无锁 → 偏向锁 → 轻量级锁 → 重量级锁**

**偏向锁（Biased Locking）：**
```java
// 第一次获取锁
// 1. 检查 Mark Word 是否为可偏向状态
// 2. CAS 将线程 ID 写入 Mark Word
// 3. 成功则获取偏向锁

// 再次获取锁（同一线程）
// 1. 检查 Mark Word 中的线程 ID
// 2. 如果是当前线程，直接执行（无需 CAS）

// 其他线程竞争
// 1. 撤销偏向锁
// 2. 升级为轻量级锁
```

**轻量级锁（Lightweight Locking）：**
```java
// 获取锁
// 1. 在栈帧中创建锁记录（Lock Record）
// 2. 复制 Mark Word 到锁记录
// 3. CAS 将对象头的 Mark Word 替换为指向锁记录的指针
// 4. 成功则获取轻量级锁
// 5. 失败则自旋重试
// 6. 自旋一定次数后升级为重量级锁

// 释放锁
// 1. CAS 将锁记录中的 Mark Word 替换回对象头
// 2. 成功则释放锁
// 3. 失败则升级为重量级锁
```

**重量级锁（Heavyweight Locking）：**
```java
// 获取锁
// 1. 对象头指向 Monitor 对象
// 2. 线程进入 Monitor 的 EntryList
// 3. 竞争 Monitor 的 owner
// 4. 获取失败则阻塞（park）

// Monitor 结构
ObjectMonitor {
    _owner;      // 持有锁的线程
    _EntryList;  // 等待获取锁的线程队列
    _WaitSet;    // 调用 wait() 的线程队列
    _count;      // 重入次数
}
```

**完整流程图：**
```
对象创建
   ↓
无锁状态（001）
   ↓ 线程1访问
偏向锁（101）- 线程ID = 线程1
   ↓ 线程2竞争
轻量级锁（00）- 自旋获取
   ↓ 自旋失败/竞争激烈
重量级锁（10）- 阻塞等待
```

**代码示例：**
```java
public class SynchronizedDemo {
    private Object lock = new Object();
    
    // 同步代码块
    public void method1() {
        synchronized (lock) {
            // 临界区
        }
    }
    
    // 同步实例方法（锁是 this）
    public synchronized void method2() {
        // 临界区
    }
    
    // 同步静态方法（锁是 Class 对象）
    public static synchronized void method3() {
        // 临界区
    }
}
```

**优化技术：**
1. **锁消除**：JIT 编译器检测到不可能存在竞争，消除锁
2. **锁粗化**：多个连续的加锁解锁操作合并为一次
3. **自适应自旋**：根据历史自旋成功率动态调整自旋次数

### 32. Synchronized 修饰静态方法和修饰普通方法有什么区别？

**答案：**

主要区别在于锁的对象不同：

**1. 修饰普通方法（实例方法）**
```java
public class MyClass {
    // 锁对象是 this（当前实例）
    public synchronized void instanceMethod() {
        // 临界区
    }
    
    // 等价于
    public void instanceMethod2() {
        synchronized (this) {
            // 临界区
        }
    }
}
```

**特点：**
- 锁对象是当前实例（this）
- 不同实例之间不互斥
- 同一实例的多个同步方法互斥

**示例：**
```java
MyClass obj1 = new MyClass();
MyClass obj2 = new MyClass();

// 线程1和线程2不互斥（不同实例）
new Thread(() -> obj1.instanceMethod()).start();
new Thread(() -> obj2.instanceMethod()).start();

// 线程3和线程4互斥（同一实例）
new Thread(() -> obj1.instanceMethod()).start();
new Thread(() -> obj1.instanceMethod()).start();
```

**2. 修饰静态方法（类方法）**
```java
public class MyClass {
    // 锁对象是 MyClass.class（类对象）
    public static synchronized void staticMethod() {
        // 临界区
    }
    
    // 等价于
    public static void staticMethod2() {
        synchronized (MyClass.class) {
            // 临界区
        }
    }
}
```

**特点：**
- 锁对象是 Class 对象（MyClass.class）
- 所有实例共享同一个锁
- 类的所有静态同步方法互斥

**示例：**
```java
MyClass obj1 = new MyClass();
MyClass obj2 = new MyClass();

// 线程1和线程2互斥（共享类锁）
new Thread(() -> MyClass.staticMethod()).start();
new Thread(() -> MyClass.staticMethod()).start();

// 线程3和线程4也互斥（共享类锁）
new Thread(() -> obj1.staticMethod()).start();
new Thread(() -> obj2.staticMethod()).start();
```

**3. 混合使用**
```java
public class MyClass {
    // 实例锁
    public synchronized void instanceMethod() {
        System.out.println("实例方法");
    }
    
    // 类锁
    public static synchronized void staticMethod() {
        System.out.println("静态方法");
    }
}

// 不互斥（锁对象不同）
new Thread(() -> new MyClass().instanceMethod()).start();
new Thread(() -> MyClass.staticMethod()).start();
```

**对比总结：**

| 特性 | 修饰实例方法 | 修饰静态方法 |
|------|------------|------------|
| 锁对象 | this（实例对象） | Class 对象 |
| 作用范围 | 当前实例 | 所有实例 |
| 互斥范围 | 同一实例的同步方法 | 所有静态同步方法 |
| 使用场景 | 实例变量保护 | 静态变量保护 |

**最佳实践：**
```java
public class Counter {
    private int instanceCount = 0;
    private static int staticCount = 0;
    
    // 保护实例变量
    public synchronized void incrementInstance() {
        instanceCount++;
    }
    
    // 保护静态变量
    public static synchronized void incrementStatic() {
        staticCount++;
    }
    
    // 或者使用显式锁对象
    private final Object instanceLock = new Object();
    private static final Object staticLock = new Object();
    
    public void increment() {
        synchronized (instanceLock) {
            instanceCount++;
        }
    }
    
    public static void incrementStatic2() {
        synchronized (staticLock) {
            staticCount++;
        }
    }
}
```

### 33. Java 中的 synchronized 轻量级锁是否会进行自旋？

**答案：**

是的，轻量级锁会进行自旋，但有条件限制。

**自旋的原因：**
- 避免线程阻塞和唤醒的开销
- 适用于锁持有时间短的场景
- 线程在用户态自旋，不进入内核态

**自旋过程：**
```java
// 轻量级锁获取流程
while (true) {
    // 1. 尝试 CAS 获取锁
    if (CAS成功) {
        获取锁成功;
        break;
    }
    
    // 2. CAS 失败，自旋重试
    if (自旋次数 < 最大自旋次数) {
        自旋次数++;
        continue; // 继续自旋
    } else {
        // 3. 自旋失败，升级为重量级锁
        升级为重量级锁();
        阻塞等待();
        break;
    }
}
```

**自旋策略：**

**1. 固定次数自旋（JDK 1.6 之前）**
```java
// 默认自旋10次
-XX:PreBlockSpin=10
```

**2. 自适应自旋（JDK 1.6+）**
```java
// 根据历史自旋成功率动态调整
if (上次自旋成功) {
    允许更多次自旋;
} else {
    减少自旋次数;
}

// 如果某个锁自旋很少成功，可能直接省略自旋
```

**自旋的条件：**

1. **CPU 核心数 > 1**
   - 单核 CPU 自旋无意义（持有锁的线程无法释放）
   
2. **锁持有时间短**
   - 自旋时间 < 线程阻塞/唤醒时间
   
3. **竞争不激烈**
   - 竞争激烈时直接升级为重量级锁

**自旋优化示例：**
```java
public class SpinLockDemo {
    private AtomicReference<Thread> owner = new AtomicReference<>();
    
    public void lock() {
        Thread current = Thread.currentThread();
        
        // 自旋获取锁
        while (!owner.compareAndSet(null, current)) {
            // 自旋等待
            // CPU 空转，不释放 CPU
        }
    }
    
    public void unlock() {
        Thread current = Thread.currentThread();
        owner.compareAndSet(current, null);
    }
}
```

**自旋的优缺点：**

**优点：**
- 避免线程阻塞和上下文切换
- 适合锁持有时间短的场景
- 提高并发性能

**缺点：**
- 占用 CPU 资源
- 锁持有时间长时浪费 CPU
- 可能导致 CPU 使用率高

**JVM 参数控制：**
```bash
# 开启/关闭自旋锁优化（默认开启）
-XX:+UseSpinning
-XX:-UseSpinning

# 设置自旋次数（JDK 1.6 之前）
-XX:PreBlockSpin=10

# 开启自适应自旋（JDK 1.6+ 默认开启）
-XX:+UseAdaptiveSpinning
```

**锁升级与自旋的关系：**
```
偏向锁
   ↓ 有竞争
轻量级锁（自旋获取）
   ↓ 自旋失败
重量级锁（阻塞等待）
```

**实际应用建议：**
- 锁持有时间短（几十个指令）：自旋有效
- 锁持有时间长：自旋浪费 CPU，应直接阻塞
- 高并发场景：考虑使用 ReentrantLock 或无锁方案

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


### 21. 什么是 Java 的 StampedLock？

**答案：**

StampedLock 是 Java 8 引入的一种锁，提供了三种模式的读写控制，性能优于 ReadWriteLock。

**三种锁模式：**

1. **写锁（Writing）**：独占锁
2. **悲观读锁（Reading）**：共享锁，不允许写
3. **乐观读（Optimistic Reading）**：不加锁，通过版本号验证

**基本使用：**
```java
public class Point {
    private double x, y;
    private final StampedLock lock = new StampedLock();
    
    // 写操作
    public void move(double deltaX, double deltaY) {
        long stamp = lock.writeLock(); // 获取写锁
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp); // 释放写锁
        }
    }
    
    // 乐观读
    public double distanceFromOrigin() {
        long stamp = lock.tryOptimisticRead(); // 乐观读
        double currentX = x;
        double currentY = y;
        
        if (!lock.validate(stamp)) { // 验证是否有写操作
            stamp = lock.readLock(); // 升级为悲观读锁
            try {
                currentX = x;
                currentY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
    
    // 悲观读
    public double getX() {
        long stamp = lock.readLock();
        try {
            return x;
        } finally {
            lock.unlockRead(stamp);
        }
    }
}
```

**锁升级：**
```java
// 读锁升级为写锁
long stamp = lock.readLock();
try {
    // 读取数据
    long writeStamp = lock.tryConvertToWriteLock(stamp);
    if (writeStamp != 0L) {
        stamp = writeStamp;
        // 执行写操作
    } else {
        lock.unlockRead(stamp);
        stamp = lock.writeLock();
        // 执行写操作
    }
} finally {
    lock.unlock(stamp);
}
```

**特点：**
- 乐观读不阻塞写操作，性能更好
- 不支持重入
- 不支持 Condition
- 适合读多写少的场景

**与 ReadWriteLock 对比：**

| 特性 | StampedLock | ReadWriteLock |
|------|------------|---------------|
| 乐观读 | 支持 | 不支持 |
| 性能 | 更高 | 较低 |
| 重入 | 不支持 | 支持 |
| Condition | 不支持 | 支持 |

### 22. 什么是 Java 的 CompletableFuture？

**答案：**

CompletableFuture 是 Java 8 引入的异步编程工具，实现了 Future 和 CompletionStage 接口，支持链式调用和组合操作。

**创建 CompletableFuture：**
```java
// 1. 无返回值异步任务
CompletableFuture<Void> future1 = CompletableFuture.runAsync(() -> {
    System.out.println("异步任务");
});

// 2. 有返回值异步任务
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
    return "结果";
});

// 3. 手动完成
CompletableFuture<String> future3 = new CompletableFuture<>();
future3.complete("手动设置结果");
```

**链式调用：**
```java
CompletableFuture.supplyAsync(() -> {
    return "Hello";
})
.thenApply(s -> s + " World")           // 转换结果
.thenApply(String::toUpperCase)         // 继续转换
.thenAccept(System.out::println)        // 消费结果
.thenRun(() -> System.out.println("完成")); // 执行动作
```

**组合操作：**
```java
// 1. 两个任务都完成后执行
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");

CompletableFuture<String> combined = future1.thenCombine(future2, (s1, s2) -> {
    return s1 + " " + s2;
});

// 2. 任意一个完成后执行
CompletableFuture<String> fastest = future1.applyToEither(future2, s -> s);

// 3. 所有任务完成
CompletableFuture<Void> allOf = CompletableFuture.allOf(future1, future2);

// 4. 任意任务完成
CompletableFuture<Object> anyOf = CompletableFuture.anyOf(future1, future2);
```

**异常处理：**
```java
CompletableFuture.supplyAsync(() -> {
    if (true) throw new RuntimeException("错误");
    return "结果";
})
.exceptionally(ex -> {
    System.out.println("异常处理: " + ex.getMessage());
    return "默认值";
})
.handle((result, ex) -> {
    if (ex != null) {
        return "异常: " + ex.getMessage();
    }
    return result;
})
.whenComplete((result, ex) -> {
    if (ex != null) {
        System.out.println("失败: " + ex.getMessage());
    } else {
        System.out.println("成功: " + result);
    }
});
```

**实际应用场景：**
```java
// 并行调用多个服务
public CompletableFuture<OrderInfo> getOrderInfo(String orderId) {
    CompletableFuture<Order> orderFuture = 
        CompletableFuture.supplyAsync(() -> orderService.getOrder(orderId));
    
    CompletableFuture<User> userFuture = 
        CompletableFuture.supplyAsync(() -> userService.getUser(orderId));
    
    CompletableFuture<Product> productFuture = 
        CompletableFuture.supplyAsync(() -> productService.getProduct(orderId));
    
    return orderFuture.thenCombine(userFuture, (order, user) -> {
        return new OrderInfo(order, user);
    }).thenCombine(productFuture, (orderInfo, product) -> {
        orderInfo.setProduct(product);
        return orderInfo;
    });
}
```

**常用方法总结：**
- `thenApply`：转换结果
- `thenAccept`：消费结果
- `thenRun`：执行动作
- `thenCompose`：扁平化嵌套 Future
- `thenCombine`：组合两个 Future
- `exceptionally`：异常处理
- `handle`：结果和异常统一处理
- `whenComplete`：完成时回调

### 23. 什么是 Java 的 ForkJoinPool？

**答案：**

ForkJoinPool 是 Java 7 引入的线程池，专门用于执行可以递归分解的任务，采用"分而治之"的策略和工作窃取算法。

**核心概念：**

1. **Fork（分解）**：将大任务分解为小任务
2. **Join（合并）**：合并小任务的结果
3. **Work Stealing（工作窃取）**：空闲线程从其他线程的队列中窃取任务

**使用方式：**

**1. RecursiveTask（有返回值）**
```java
public class SumTask extends RecursiveTask<Long> {
    private static final int THRESHOLD = 10000;
    private long[] array;
    private int start;
    private int end;
    
    public SumTask(long[] array, int start, int end) {
        this.array = array;
        this.start = start;
        this.end = end;
    }
    
    @Override
    protected Long compute() {
        if (end - start <= THRESHOLD) {
            // 任务足够小，直接计算
            long sum = 0;
            for (int i = start; i < end; i++) {
                sum += array[i];
            }
            return sum;
        } else {
            // 任务太大，分解为两个子任务
            int middle = (start + end) / 2;
            SumTask leftTask = new SumTask(array, start, middle);
            SumTask rightTask = new SumTask(array, middle, end);
            
            // Fork：异步执行子任务
            leftTask.fork();
            rightTask.fork();
            
            // Join：等待子任务完成并合并结果
            long leftResult = leftTask.join();
            long rightResult = rightTask.join();
            
            return leftResult + rightResult;
        }
    }
}

// 使用
ForkJoinPool pool = new ForkJoinPool();
long[] array = new long[100000];
SumTask task = new SumTask(array, 0, array.length);
long result = pool.invoke(task);
```

**2. RecursiveAction（无返回值）**
```java
public class PrintTask extends RecursiveAction {
    private static final int THRESHOLD = 50;
    private int start;
    private int end;
    
    public PrintTask(int start, int end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    protected void compute() {
        if (end - start <= THRESHOLD) {
            for (int i = start; i < end; i++) {
                System.out.println(i);
            }
        } else {
            int middle = (start + end) / 2;
            PrintTask leftTask = new PrintTask(start, middle);
            PrintTask rightTask = new PrintTask(middle, end);
            
            invokeAll(leftTask, rightTask); // 执行所有子任务
        }
    }
}
```

**工作窃取算法：**
```
线程1队列: [Task1, Task2, Task3]  ← 从尾部取任务
线程2队列: [Task4, Task5]         ← 从尾部取任务
线程3队列: []                     ← 空闲，从其他队列头部窃取任务

线程3窃取 → 从线程1队列头部取 Task1
```

**特点：**
- 适合计算密集型任务
- 自动负载均衡（工作窃取）
- 减少线程竞争（每个线程有自己的队列）
- 默认线程数等于 CPU 核心数

**应用场景：**
- 大数组排序、求和
- 并行流（Stream.parallel()）
- 递归算法并行化
- 图像处理、数据分析

**与普通线程池对比：**

| 特性 | ForkJoinPool | ThreadPoolExecutor |
|------|-------------|-------------------|
| 任务类型 | 可分解的递归任务 | 独立任务 |
| 队列 | 双端队列（每线程） | 单一队列 |
| 负载均衡 | 工作窃取 | 无 |
| 适用场景 | 计算密集型 | 通用 |

### 24. 如何在 Java 中控制多个线程的执行顺序？

**答案：**

Java 提供了多种方式控制线程执行顺序：

**1. 使用 join() 方法**
```java
Thread t1 = new Thread(() -> System.out.println("线程1"));
Thread t2 = new Thread(() -> System.out.println("线程2"));
Thread t3 = new Thread(() -> System.out.println("线程3"));

t1.start();
t1.join(); // 等待 t1 完成

t2.start();
t2.join(); // 等待 t2 完成

t3.start();
t3.join(); // 等待 t3 完成
```

**2. 使用 CountDownLatch**
```java
CountDownLatch latch1 = new CountDownLatch(1);
CountDownLatch latch2 = new CountDownLatch(1);

new Thread(() -> {
    System.out.println("线程1");
    latch1.countDown();
}).start();

new Thread(() -> {
    try {
        latch1.await(); // 等待线程1完成
        System.out.println("线程2");
        latch2.countDown();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

new Thread(() -> {
    try {
        latch2.await(); // 等待线程2完成
        System.out.println("线程3");
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();
```

**3. 使用 CyclicBarrier**
```java
CyclicBarrier barrier = new CyclicBarrier(3);

// 所有线程同时开始
for (int i = 0; i < 3; i++) {
    final int id = i;
    new Thread(() -> {
        try {
            System.out.println("线程" + id + " 准备");
            barrier.await(); // 等待其他线程
            System.out.println("线程" + id + " 开始执行");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
}
```

**4. 使用 Semaphore**
```java
Semaphore semaphore1 = new Semaphore(1);
Semaphore semaphore2 = new Semaphore(0);
Semaphore semaphore3 = new Semaphore(0);

new Thread(() -> {
    try {
        semaphore1.acquire();
        System.out.println("线程1");
        semaphore2.release();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

new Thread(() -> {
    try {
        semaphore2.acquire();
        System.out.println("线程2");
        semaphore3.release();
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

new Thread(() -> {
    try {
        semaphore3.acquire();
        System.out.println("线程3");
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();
```

**5. 使用 wait/notify**
```java
public class SequentialExecution {
    private int flag = 1;
    private final Object lock = new Object();
    
    public void thread1() {
        synchronized (lock) {
            while (flag != 1) {
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("线程1");
            flag = 2;
            lock.notifyAll();
        }
    }
    
    public void thread2() {
        synchronized (lock) {
            while (flag != 2) {
                try {
                    lock.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("线程2");
            flag = 3;
            lock.notifyAll();
        }
    }
}
```

**6. 使用 CompletableFuture**
```java
CompletableFuture.runAsync(() -> {
    System.out.println("线程1");
})
.thenRun(() -> {
    System.out.println("线程2");
})
.thenRun(() -> {
    System.out.println("线程3");
});
```

**7. 使用单线程线程池**
```java
ExecutorService executor = Executors.newSingleThreadExecutor();

executor.submit(() -> System.out.println("任务1"));
executor.submit(() -> System.out.println("任务2"));
executor.submit(() -> System.out.println("任务3"));

executor.shutdown();
```

**选择建议：**
- 简单顺序执行：join() 或单线程线程池
- 复杂依赖关系：CountDownLatch 或 CompletableFuture
- 循环执行：CyclicBarrier
- 精确控制：Semaphore 或 wait/notify

### 25. 你使用过 Java 中的哪些阻塞队列？

**答案：**

Java 并发包提供了多种阻塞队列（BlockingQueue），用于生产者-消费者模式。

**1. ArrayBlockingQueue（有界数组队列）**
```java
// 创建容量为10的队列
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

// 添加元素
queue.put("element"); // 队列满时阻塞
queue.offer("element", 1, TimeUnit.SECONDS); // 超时返回false

// 获取元素
String element = queue.take(); // 队列空时阻塞
String element2 = queue.poll(1, TimeUnit.SECONDS); // 超时返回null
```

**特点：**
- 基于数组实现
- 有界队列，必须指定容量
- FIFO 顺序
- 支持公平/非公平锁

**2. LinkedBlockingQueue（有界链表队列）**
```java
// 无界队列（最大容量 Integer.MAX_VALUE）
BlockingQueue<String> queue1 = new LinkedBlockingQueue<>();

// 有界队列
BlockingQueue<String> queue2 = new LinkedBlockingQueue<>(100);
```

**特点：**
- 基于链表实现
- 可选有界/无界
- FIFO 顺序
- 吞吐量通常高于 ArrayBlockingQueue

**3. PriorityBlockingQueue（优先级队列）**
```java
BlockingQueue<Task> queue = new PriorityBlockingQueue<>();

class Task implements Comparable<Task> {
    private int priority;
    
    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}
```

**特点：**
- 基于堆实现
- 无界队列
- 按优先级排序
- 不保证同优先级的顺序

**4. DelayQueue（延迟队列）**
```java
BlockingQueue<DelayedTask> queue = new DelayQueue<>();

class DelayedTask implements Delayed {
    private long delayTime;
    private long expire;
    
    @Override
    public long getDelay(TimeUnit unit) {
        return unit.convert(expire - System.currentTimeMillis(), 
            TimeUnit.MILLISECONDS);
    }
    
    @Override
    public int compareTo(Delayed o) {
        return Long.compare(this.expire, ((DelayedTask) o).expire);
    }
}
```

**特点：**
- 元素必须实现 Delayed 接口
- 只有到期的元素才能被取出
- 适用于定时任务、缓存过期

**5. SynchronousQueue（同步队列）**
```java
BlockingQueue<String> queue = new SynchronousQueue<>();

// 生产者
new Thread(() -> {
    try {
        queue.put("data"); // 阻塞直到有消费者取走
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();

// 消费者
new Thread(() -> {
    try {
        String data = queue.take(); // 阻塞直到有生产者放入
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}).start();
```

**特点：**
- 不存储元素
- 每个 put 必须等待一个 take
- 适用于传递性场景
- CachedThreadPool 使用此队列

**6. LinkedTransferQueue（传输队列）**
```java
TransferQueue<String> queue = new LinkedTransferQueue<>();

// 生产者
queue.transfer("data"); // 阻塞直到消费者接收

// 消费者
String data = queue.take();
```

**特点：**
- 无界队列
- 支持 transfer 方法（直接传递）
- 性能优于 LinkedBlockingQueue

**7. LinkedBlockingDeque（双端队列）**
```java
BlockingDeque<String> deque = new LinkedBlockingDeque<>();

// 可以从两端操作
deque.putFirst("first");
deque.putLast("last");
String first = deque.takeFirst();
String last = deque.takeLast();
```

**特点：**
- 双端队列
- 可以从头尾两端操作
- 适用于工作窃取模式

**对比总结：**

| 队列类型 | 有界性 | 数据结构 | 特点 |
|---------|-------|---------|------|
| ArrayBlockingQueue | 有界 | 数组 | 固定容量 |
| LinkedBlockingQueue | 可选 | 链表 | 高吞吐量 |
| PriorityBlockingQueue | 无界 | 堆 | 优先级排序 |
| DelayQueue | 无界 | 堆 | 延迟获取 |
| SynchronousQueue | 0 | 无 | 直接传递 |
| LinkedTransferQueue | 无界 | 链表 | 支持传输 |
| LinkedBlockingDeque | 可选 | 链表 | 双端操作 |

**使用场景：**
- 固定容量限流：ArrayBlockingQueue
- 生产者-消费者：LinkedBlockingQueue
- 任务优先级：PriorityBlockingQueue
- 定时任务：DelayQueue
- 线程池任务传递：SynchronousQueue

### 26. 你使用过 Java 中的哪些原子类？

**答案：**

Java 提供了 java.util.concurrent.atomic 包，包含多种原子类，保证操作的原子性。

**1. 基本类型原子类**
```java
// AtomicInteger
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();  // i++
count.getAndIncrement();  // ++i
count.addAndGet(5);       // i += 5
count.compareAndSet(0, 1); // CAS操作

// AtomicLong
AtomicLong longValue = new AtomicLong(0L);

// AtomicBoolean
AtomicBoolean flag = new AtomicBoolean(false);
flag.compareAndSet(false, true);
```

**2. 数组类型原子类**
```java
// AtomicIntegerArray
AtomicIntegerArray array = new AtomicIntegerArray(10);
array.incrementAndGet(0);  // 数组索引0的元素+1
array.compareAndSet(0, 1, 2); // CAS操作

// AtomicLongArray
AtomicLongArray longArray = new AtomicLongArray(10);

// AtomicReferenceArray
AtomicReferenceArray<String> refArray = new AtomicReferenceArray<>(10);
```

**3. 引用类型原子类**
```java
// AtomicReference
AtomicReference<User> userRef = new AtomicReference<>();
User oldUser = new User("张三");
User newUser = new User("李四");
userRef.compareAndSet(oldUser, newUser);

// AtomicStampedReference（解决ABA问题）
AtomicStampedReference<String> stampedRef = 
    new AtomicStampedReference<>("初始值", 0);
int stamp = stampedRef.getStamp();
stampedRef.compareAndSet("初始值", "新值", stamp, stamp + 1);

// AtomicMarkableReference（标记是否被修改过）
AtomicMarkableReference<String> markableRef = 
    new AtomicMarkableReference<>("初始值", false);
markableRef.compareAndSet("初始值", "新值", false, true);
```

**4. 字段更新器**
```java
class User {
    volatile int age;
    volatile String name;
}

// AtomicIntegerFieldUpdater
AtomicIntegerFieldUpdater<User> ageUpdater = 
    AtomicIntegerFieldUpdater.newUpdater(User.class, "age");
User user = new User();
ageUpdater.incrementAndGet(user);

// AtomicReferenceFieldUpdater
AtomicReferenceFieldUpdater<User, String> nameUpdater = 
    AtomicReferenceFieldUpdater.newUpdater(User.class, String.class, "name");
nameUpdater.compareAndSet(user, "旧名字", "新名字");
```

**应用场景示例：**
```java
// 1. 计数器
public class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public int getCount() {
        return count.get();
    }
}

// 2. 单例模式
public class Singleton {
    private static final AtomicReference<Singleton> INSTANCE = 
        new AtomicReference<>();
    
    public static Singleton getInstance() {
        while (true) {
            Singleton current = INSTANCE.get();
            if (current != null) {
                return current;
            }
            current = new Singleton();
            if (INSTANCE.compareAndSet(null, current)) {
                return current;
            }
        }
    }
}
```


### 27. 你使用过 Java 的累加器吗？

**答案：**

Java 8 引入了累加器（Accumulator），在高并发场景下性能优于原子类。

**1. LongAdder（长整型累加器）**
```java
LongAdder adder = new LongAdder();

// 多线程累加
for (int i = 0; i < 10; i++) {
    new Thread(() -> {
        for (int j = 0; j < 1000; j++) {
            adder.increment(); // 加1
            adder.add(5);      // 加5
        }
    }).start();
}

// 获取结果
long sum = adder.sum();
```

**2. LongAccumulator（长整型累积器）**
```java
// 自定义累积函数（求最大值）
LongAccumulator accumulator = new LongAccumulator(Long::max, Long.MIN_VALUE);

accumulator.accumulate(100);
accumulator.accumulate(200);
accumulator.accumulate(50);

long max = accumulator.get(); // 200
```

**3. DoubleAdder 和 DoubleAccumulator**
```java
DoubleAdder doubleAdder = new DoubleAdder();
doubleAdder.add(1.5);
double sum = doubleAdder.sum();

DoubleAccumulator doubleAccumulator = 
    new DoubleAccumulator(Double::sum, 0.0);
```

**性能对比：**
```java
// AtomicLong vs LongAdder 性能测试
public class PerformanceTest {
    public static void testAtomicLong() {
        AtomicLong atomicLong = new AtomicLong(0);
        // 10个线程，每个累加100万次
        // AtomicLong: 约2000ms
    }
    
    public static void testLongAdder() {
        LongAdder longAdder = new LongAdder();
        // 10个线程，每个累加100万次
        // LongAdder: 约500ms（快4倍）
    }
}
```

**原理：**
- AtomicLong：所有线程竞争同一个变量，CAS 冲突多
- LongAdder：每个线程维护自己的计数器（Cell），最后汇总，减少竞争

**内部结构：**
```
LongAdder
├── base (基础值)
└── cells[] (Cell数组)
    ├── Cell[0] (线程1的计数)
    ├── Cell[1] (线程2的计数)
    └── Cell[2] (线程3的计数)

sum() = base + Cell[0] + Cell[1] + Cell[2] + ...
```

**选择建议：**
- 低并发场景：AtomicLong（更简单）
- 高并发累加：LongAdder（性能更好）
- 需要 CAS 操作：AtomicLong
- 只需要累加：LongAdder

### 28. 什么是 Java 的 CAS（Compare-And-Swap）操作？

**答案：**

CAS（Compare-And-Swap）是一种无锁的原子操作，用于实现并发控制。

**原理：**
CAS 包含三个操作数：
- V：内存位置（变量）
- E：预期值（Expected）
- N：新值（New）

只有当 V 的值等于 E 时，才将 V 的值设置为 N，否则不做任何操作。整个过程是原子的。

**伪代码：**
```java
boolean compareAndSwap(Variable V, int E, int N) {
    if (V == E) {
        V = N;
        return true;
    }
    return false;
}
```


**Java 中的 CAS：**
```java
AtomicInteger count = new AtomicInteger(0);

// CAS 操作
boolean success = count.compareAndSet(0, 1);
// 如果当前值是0，则设置为1，返回true
// 如果当前值不是0，不做任何操作，返回false

// 自旋 CAS
public void increment() {
    int oldValue;
    int newValue;
    do {
        oldValue = count.get();
        newValue = oldValue + 1;
    } while (!count.compareAndSet(oldValue, newValue));
}
```

**底层实现：**
```java
// Unsafe 类提供的 CAS 方法
public final native boolean compareAndSwapInt(
    Object o,      // 对象
    long offset,   // 字段偏移量
    int expected,  // 预期值
    int x          // 新值
);

// CPU 指令（x86）
lock cmpxchg [内存地址], 新值
```

**CAS 的优点：**
1. 无锁，避免线程阻塞和上下文切换
2. 性能高于 synchronized
3. 适合低并发场景

**CAS 的缺点：**

**1. ABA 问题**
```java
// 线程1：读取值A
int value = atomicInt.get(); // A

// 线程2：A -> B -> A
atomicInt.compareAndSet(A, B);
atomicInt.compareAndSet(B, A);

// 线程1：CAS成功，但值已经被修改过
atomicInt.compareAndSet(A, C); // 成功，但不知道中间变化

// 解决方案：使用版本号
AtomicStampedReference<Integer> stampedRef = 
    new AtomicStampedReference<>(A, 0);
int stamp = stampedRef.getStamp();
stampedRef.compareAndSet(A, C, stamp, stamp + 1);
```

**2. 循环时间长开销大**
```java
// 高并发下，CAS 失败次数多，CPU 开销大
public void increment() {
    int oldValue;
    int newValue;
    do {
        oldValue = count.get();
        newValue = oldValue + 1;
        // 高并发下可能循环很多次
    } while (!count.compareAndSet(oldValue, newValue));
}

// 解决方案：使用 LongAdder 或加锁
```

**3. 只能保证一个共享变量的原子操作**
```java
// 不能同时 CAS 多个变量
// 解决方案：
// 1. 使用 AtomicReference 包装多个变量
class Pair {
    int a;
    int b;
}
AtomicReference<Pair> pairRef = new AtomicReference<>(new Pair());

// 2. 使用锁
synchronized (lock) {
    a++;
    b++;
}
```

**应用场景：**
- 原子类（AtomicInteger、AtomicReference）
- 并发容器（ConcurrentHashMap）
- AQS（AbstractQueuedSynchronizer）
- 乐观锁实现

### 29. 说说 AQS 吧？

**答案：**

AQS（AbstractQueuedSynchronizer）是 Java 并发包的核心基础框架，用于构建锁和同步器。

**核心思想：**
- 使用一个 int 类型的 state 变量表示同步状态
- 使用 FIFO 队列管理等待线程
- 提供独占模式和共享模式

**核心组件：**

**1. 同步状态（state）**
```java
private volatile int state;

// 获取状态
protected final int getState()

// 设置状态
protected final void setState(int newState)

// CAS 设置状态
protected final boolean compareAndSetState(int expect, int update)
```

**2. 等待队列（CLH 队列）**
```
head -> Node1 -> Node2 -> Node3 -> tail
        (等待)   (等待)   (等待)
```

每个 Node 包含：
- thread：等待的线程
- waitStatus：等待状态
- prev/next：前驱/后继节点

**工作流程：**

**独占模式（如 ReentrantLock）：**
```java
// 1. 尝试获取锁
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&  // 尝试获取（子类实现）
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg)) {  // 加入队列等待
        selfInterrupt();
    }
}

// 2. 释放锁
public final boolean release(int arg) {
    if (tryRelease(arg)) {  // 尝试释放（子类实现）
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);  // 唤醒后继节点
        return true;
    }
    return false;
}
```

**共享模式（如 Semaphore、CountDownLatch）：**
```java
// 获取共享锁
public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)  // 尝试获取
        doAcquireShared(arg);  // 加入队列等待
}

// 释放共享锁
public final boolean releaseShared(int arg) {
    if (tryReleaseShared(arg)) {  // 尝试释放
        doReleaseShared();  // 唤醒后继节点
        return true;
    }
    return false;
}
```


**自定义同步器示例：**
```java
// 自定义互斥锁
public class Mutex implements Lock {
    private static class Sync extends AbstractQueuedSynchronizer {
        // 尝试获取锁
        @Override
        protected boolean tryAcquire(int arg) {
            return compareAndSetState(0, 1);
        }
        
        // 尝试释放锁
        @Override
        protected boolean tryRelease(int arg) {
            setState(0);
            return true;
        }
        
        // 是否被独占
        @Override
        protected boolean isHeldExclusively() {
            return getState() == 1;
        }
        
        Condition newCondition() {
            return new ConditionObject();
        }
    }
    
    private final Sync sync = new Sync();
    
    @Override
    public void lock() {
        sync.acquire(1);
    }
    
    @Override
    public void unlock() {
        sync.release(1);
    }
    
    // 其他方法实现...
}
```

**基于 AQS 的同步器：**
- ReentrantLock：独占锁
- ReentrantReadWriteLock：读写锁
- Semaphore：信号量
- CountDownLatch：倒计数门栓
- CyclicBarrier：循环栅栏（基于 ReentrantLock）

**AQS 的优势：**
1. 提供统一的框架，简化同步器实现
2. 高效的等待队列管理
3. 支持可中断、超时、公平/非公平
4. 提供 Condition 支持

### 30. Java 中 ReentrantLock 的实现原理是什么？

**答案：**

ReentrantLock 是基于 AQS 实现的可重入独占锁。

**核心特性：**
1. 可重入：同一线程可以多次获取锁
2. 公平/非公平：支持两种模式
3. 可中断：支持中断等待
4. 可超时：支持超时获取锁
5. Condition 支持：支持多个条件变量

**重入实现：**
```java
protected final boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    
    if (c == 0) {
        // 锁空闲，尝试获取
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    } else if (current == getExclusiveOwnerThread()) {
        // 当前线程已持有锁，重入
        int nextc = c + acquires;
        if (nextc < 0) // 溢出检查
            throw new Error("Maximum lock count exceeded");
        setState(nextc);  // 增加重入次数
        return true;
    }
    return false;
}
```

**解锁流程：**
```java
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    
    boolean free = false;
    if (c == 0) {
        // 重入次数归零，完全释放锁
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);  // 减少重入次数
    return free;
}
```

**使用示例：**
```java
ReentrantLock lock = new ReentrantLock();

// 基本使用
lock.lock();
try {
    // 临界区代码
} finally {
    lock.unlock();
}

// 可中断
try {
    lock.lockInterruptibly();
    // 临界区代码
} catch (InterruptedException e) {
    // 处理中断
} finally {
    lock.unlock();
}

// 超时获取
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // 临界区代码
    } finally {
        lock.unlock();
    }
} else {
    // 获取锁失败
}
```

**公平锁 vs 非公平锁：**

| 特性 | 公平锁 | 非公平锁 |
|------|-------|---------|
| 获取顺序 | 按排队顺序 | 可插队 |
| 性能 | 较低 | 较高 |
| 吞吐量 | 较低 | 较高 |
| 线程切换 | 更多 | 更少 |
| 适用场景 | 需要公平性 | 追求性能 |

### 31. Java 的 synchronized 是怎么实现的？

**答案：**

synchronized 是 Java 提供的内置锁机制，基于对象监视器（Monitor）实现。

**实现层次：**

**1. 字节码层面**
```java
public void syncMethod() {
    synchronized (this) {
        // 临界区代码
    }
}

// 字节码
monitorenter  // 进入监视器（获取锁）
// 临界区代码
monitorexit   // 退出监视器（释放锁）
monitorexit   // 异常情况的释放
```

**2. 对象头（Mark Word）**

Java 对象在内存中的布局：
```
|--------------------------------------------------------------|
| Object Header (对象头)                                        |
|--------------------------------------------------------------|
| Mark Word (标记字段，8字节)                                    |
| Class Pointer (类型指针，4/8字节)                              |
|--------------------------------------------------------------|
| Instance Data (实例数据)                                      |
|--------------------------------------------------------------|
| Padding (对齐填充)                                            |
|--------------------------------------------------------------|
```

Mark Word 存储锁信息：
```
|----------|---------------------------|
| 锁状态    | Mark Word 内容             |
|----------|---------------------------|
| 无锁     | hashCode | age | 0 | 01   |
| 偏向锁   | threadID | epoch | 1 | 01 |
| 轻量级锁 | 栈中锁记录指针 | 00        |
| 重量级锁 | Monitor 指针 | 10          |
| GC标记   | 空 | 11                      |
|----------|---------------------------|
```

**3. 锁升级过程**

**无锁 → 偏向锁 → 轻量级锁 → 重量级锁**

**偏向锁（Biased Locking）：**
- 第一次获取锁时，CAS 将线程 ID 写入 Mark Word
- 再次获取锁（同一线程），直接执行（无需 CAS）
- 其他线程竞争时，撤销偏向锁，升级为轻量级锁

**轻量级锁（Lightweight Locking）：**
- 在栈帧中创建锁记录（Lock Record）
- CAS 将对象头的 Mark Word 替换为指向锁记录的指针
- 成功则获取轻量级锁
- 失败则自旋重试
- 自旋一定次数后升级为重量级锁

**重量级锁（Heavyweight Locking）：**
- 对象头指向 Monitor 对象
- 线程进入 Monitor 的 EntryList
- 竞争 Monitor 的 owner
- 获取失败则阻塞（park）

**Monitor 结构：**
```java
ObjectMonitor {
    _owner;      // 持有锁的线程
    _EntryList;  // 等待获取锁的线程队列
    _WaitSet;    // 调用 wait() 的线程队列
    _count;      // 重入次数
}
```

**完整流程图：**
```
对象创建
   ↓
无锁状态（001）
   ↓ 线程1访问
偏向锁（101）- 线程ID = 线程1
   ↓ 线程2竞争
轻量级锁（00）- 自旋获取
   ↓ 自旋失败/竞争激烈
重量级锁（10）- 阻塞等待
```

**优化技术：**
1. **锁消除**：JIT 编译器检测到不可能存在竞争，消除锁
2. **锁粗化**：多个连续的加锁解锁操作合并为一次
3. **自适应自旋**：根据历史自旋成功率动态调整自旋次数

### 32. Synchronized 修饰静态方法和修饰普通方法有什么区别？

**答案：**

主要区别在于锁的对象不同：

**1. 修饰普通方法（实例方法）**
```java
public class MyClass {
    // 锁对象是 this（当前实例）
    public synchronized void instanceMethod() {
        // 临界区
    }
    
    // 等价于
    public void instanceMethod2() {
        synchronized (this) {
            // 临界区
        }
    }
}
```

**特点：**
- 锁对象是当前实例（this）
- 不同实例之间不互斥
- 同一实例的多个同步方法互斥

**2. 修饰静态方法（类方法）**
```java
public class MyClass {
    // 锁对象是 MyClass.class（类对象）
    public static synchronized void staticMethod() {
        // 临界区
    }
    
    // 等价于
    public static void staticMethod2() {
        synchronized (MyClass.class) {
            // 临界区
        }
    }
}
```

**特点：**
- 锁对象是 Class 对象（MyClass.class）
- 所有实例共享同一个锁
- 类的所有静态同步方法互斥

**对比总结：**

| 特性 | 修饰实例方法 | 修饰静态方法 |
|------|------------|------------|
| 锁对象 | this（实例对象） | Class 对象 |
| 作用范围 | 当前实例 | 所有实例 |
| 互斥范围 | 同一实例的同步方法 | 所有静态同步方法 |
| 使用场景 | 实例变量保护 | 静态变量保护 |

### 33. Java 中的 synchronized 轻量级锁是否会进行自旋？

**答案：**

是的，轻量级锁会进行自旋，但有条件限制。

**自旋的原因：**
- 避免线程阻塞和唤醒的开销
- 适用于锁持有时间短的场景
- 线程在用户态自旋，不进入内核态

**自旋过程：**
```java
// 轻量级锁获取流程
while (true) {
    // 1. 尝试 CAS 获取锁
    if (CAS成功) {
        获取锁成功;
        break;
    }
    
    // 2. CAS 失败，自旋重试
    if (自旋次数 < 最大自旋次数) {
        自旋次数++;
        continue; // 继续自旋
    } else {
        // 3. 自旋失败，升级为重量级锁
        升级为重量级锁();
        阻塞等待();
        break;
    }
}
```

**自旋策略：**

**1. 固定次数自旋（JDK 1.6 之前）**
```java
// 默认自旋10次
-XX:PreBlockSpin=10
```

**2. 自适应自旋（JDK 1.6+）**
- 根据历史自旋成功率动态调整
- 如果上次自旋成功，允许更多次自旋
- 如果某个锁自旋很少成功，可能直接省略自旋

**自旋的条件：**
1. **CPU 核心数 > 1**（单核 CPU 自旋无意义）
2. **锁持有时间短**
3. **竞争不激烈**

**JVM 参数控制：**
```bash
# 开启/关闭自旋锁优化（默认开启）
-XX:+UseSpinning
-XX:-UseSpinning

# 设置自旋次数（JDK 1.6 之前）
-XX:PreBlockSpin=10

# 开启自适应自旋（JDK 1.6+ 默认开启）
-XX:+UseAdaptiveSpinning
```

### 34. Synchronized 能不能禁止指令重排序？

**答案：**

能。synchronized 可以禁止指令重排序，保证有序性。

**原理：**

synchronized 通过以下机制保证有序性：

1. **happens-before 规则**
   - 对一个锁的解锁 happens-before 于后续对这个锁的加锁
   - 保证解锁前的所有操作对加锁后的操作可见

2. **内存屏障**
   - 进入 synchronized 块时插入 Load 屏障
   - 退出 synchronized 块时插入 Store 屏障
   - 防止临界区内的指令重排到临界区外

**示例：**
```java
public class SynchronizedOrdering {
    private int a = 0;
    private int b = 0;
    
    public synchronized void method1() {
        a = 1;  // 操作1
        b = 2;  // 操作2
    }
    
    public synchronized void method2() {
        int x = b;  // 操作3
        int y = a;  // 操作4
    }
}
```

**保证：**
- 操作1和操作2不会重排到 synchronized 块外
- 操作3和操作4不会重排到 synchronized 块外
- 如果线程1先执行 method1，线程2后执行 method2，则线程2一定能看到 a=1, b=2

**与 volatile 的区别：**

| 特性 | synchronized | volatile |
|------|-------------|----------|
| 原子性 | 保证 | 不保证 |
| 可见性 | 保证 | 保证 |
| 有序性 | 保证 | 保证 |
| 性能 | 较低 | 较高 |
| 适用场景 | 复合操作 | 单个变量 |

### 35. 当 Java 的 synchronized 升级到重量级锁后，所有线程都释放锁了，此时它还是重量级锁吗？

**答案：**

是的，锁升级是单向的，不会降级（在大多数 JVM 实现中）。

**原因：**

1. **性能考虑**
   - 锁降级需要额外的检测和处理逻辑
   - 降级过程本身有开销
   - 如果频繁升级降级，反而降低性能

2. **实现复杂度**
   - 需要判断何时降级
   - 需要处理降级过程中的并发问题
   - 增加 JVM 实现复杂度

3. **实际场景**
   - 一旦升级为重量级锁，说明存在竞争
   - 竞争可能再次发生
   - 保持重量级锁状态更合理

**锁升级路径（单向）：**
```
无锁 → 偏向锁 → 轻量级锁 → 重量级锁
      ↓        ↓          ↓
      不可逆    不可逆      不可逆
```

**特殊情况：**

某些 JVM 实现（如 JDK 15+ 的 ZGC）在 GC 时可能会重置锁状态，但这不是常规的锁降级机制。

**JVM 参数：**
```bash
# 禁用偏向锁（直接从无锁到轻量级锁）
-XX:-UseBiasedLocking

# 偏向锁延迟启动时间（默认4秒）
-XX:BiasedLockingStartupDelay=0
```

**最佳实践：**
- 避免不必要的锁竞争
- 减少锁持有时间
- 使用合适的并发工具类
- 考虑使用 ReentrantLock（可以更灵活地控制）


### 36. 什么是 Java 中的锁自适应自旋？

**答案：**

锁自适应自旋是 JDK 1.6 引入的优化技术，根据历史自旋成功率动态调整自旋次数。

**传统自旋（固定次数）：**
```java
// JDK 1.6 之前，固定自旋10次
for (int i = 0; i < 10; i++) {
    if (tryAcquireLock()) {
        return; // 获取成功
    }
}
// 自旋失败，阻塞
```

**自适应自旋：**
```java
// 根据历史记录动态调整
if (上次在这个锁上自旋成功) {
    允许更长时间的自旋;
} else if (上次自旋失败) {
    减少自旋时间或直接阻塞;
}

// 如果某个锁很少自旋成功，可能直接跳过自旋
if (这个锁历史上自旋成功率很低) {
    直接阻塞，不自旋;
}
```

**自适应策略：**

1. **基于锁的历史**
   - 记录每个锁的自旋成功率
   - 成功率高的锁允许更多自旋
   - 成功率低的锁减少或跳过自旋

2. **基于线程的历史**
   - 如果线程最近自旋成功过，允许更多自旋
   - 如果线程最近自旋总是失败，减少自旋

3. **基于持有锁的线程状态**
   - 如果持有锁的线程正在运行，自旋等待
   - 如果持有锁的线程已被挂起，直接阻塞

**优点：**
- 更智能的自旋策略
- 减少无效自旋，降低 CPU 浪费
- 提高锁的整体性能

**JVM 参数：**
```bash
# 开启自适应自旋（JDK 1.6+ 默认开启）
-XX:+UseAdaptiveSpinning

# 关闭自适应自旋
-XX:-UseAdaptiveSpinning
```

**示例场景：**
```java
// 场景1：锁持有时间短，竞争少
// 自适应自旋会增加自旋次数，提高性能

// 场景2：锁持有时间长，竞争激烈
// 自适应自旋会减少自旋次数，避免 CPU 浪费

// 场景3：某个锁从不自旋成功
// 自适应自旋会跳过自旋，直接阻塞
```

### 37. Synchronized 和 ReentrantLock 有什么区别？

**答案：**

**对比总结：**

| 特性 | synchronized | ReentrantLock |
|------|-------------|---------------|
| 实现层面 | JVM 内置（关键字） | JDK 实现（类） |
| 锁的获取/释放 | 自动 | 手动（需要 try-finally） |
| 可中断 | 不支持 | 支持（lockInterruptibly） |
| 超时获取 | 不支持 | 支持（tryLock(timeout)） |
| 公平锁 | 非公平 | 支持公平/非公平 |
| 条件变量 | 单个（wait/notify） | 多个（Condition） |
| 可重入 | 支持 | 支持 |
| 锁状态查询 | 不支持 | 支持（isLocked、getHoldCount） |
| 性能 | JDK 1.6+ 优化后相当 | 相当 |

**1. 使用方式**
```java
// synchronized：自动释放
public synchronized void method() {
    // 临界区
}

// ReentrantLock：手动释放
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // 临界区
} finally {
    lock.unlock(); // 必须在 finally 中释放
}
```

**2. 可中断**
```java
// synchronized：不可中断
synchronized (lock) {
    // 无法响应中断
}

// ReentrantLock：可中断
try {
    lock.lockInterruptibly();
    // 可以响应中断
} catch (InterruptedException e) {
    // 处理中断
}
```

**3. 超时获取**
```java
// synchronized：不支持超时

// ReentrantLock：支持超时
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // 获取锁成功
    } finally {
        lock.unlock();
    }
} else {
    // 获取锁超时
}
```

**4. 公平锁**
```java
// synchronized：只支持非公平锁

// ReentrantLock：支持公平锁
ReentrantLock fairLock = new ReentrantLock(true);
```

**5. 条件变量**
```java
// synchronized：单个条件变量
synchronized (lock) {
    lock.wait();
    lock.notify();
}

// ReentrantLock：多个条件变量
Condition condition1 = lock.newCondition();
Condition condition2 = lock.newCondition();
condition1.await();
condition1.signal();
```

**6. 锁状态查询**
```java
// synchronized：不支持

// ReentrantLock：支持
boolean isLocked = lock.isLocked();
int holdCount = lock.getHoldCount();
boolean hasQueuedThreads = lock.hasQueuedThreads();
```

**选择建议：**
- 简单场景：使用 synchronized（代码简洁）
- 需要高级功能：使用 ReentrantLock
  - 可中断
  - 超时获取
  - 公平锁
  - 多个条件变量
  - 锁状态查询

### 38. Volatile 与 Synchronized 的区别是什么？

**答案：**

**对比总结：**

| 特性 | volatile | synchronized |
|------|---------|-------------|
| 类型 | 关键字（变量修饰符） | 关键字（方法/代码块） |
| 原子性 | 不保证 | 保证 |
| 可见性 | 保证 | 保证 |
| 有序性 | 保证（禁止重排） | 保证 |
| 阻塞 | 不阻塞 | 可能阻塞 |
| 性能 | 高 | 较低 |
| 适用场景 | 单个变量 | 复合操作 |

**1. 原子性**
```java
// volatile：不保证原子性
private volatile int count = 0;

public void increment() {
    count++; // 非原子操作，线程不安全
}

// synchronized：保证原子性
private int count = 0;

public synchronized void increment() {
    count++; // 原子操作，线程安全
}
```

**2. 可见性**
```java
// volatile：保证可见性
private volatile boolean flag = false;

// 线程1
flag = true; // 立即对其他线程可见

// 线程2
while (!flag) {
    // 能立即看到 flag 的变化
}

// synchronized：也保证可见性
private boolean flag = false;

synchronized (lock) {
    flag = true; // 解锁时刷新到主内存
}

synchronized (lock) {
    if (flag) { // 加锁时从主内存读取
        // ...
    }
}
```

**3. 有序性**
```java
// volatile：禁止指令重排
private volatile boolean initialized = false;
private int value;

// 线程1
value = 10;
initialized = true; // 不会重排到 value = 10 之前

// 线程2
if (initialized) {
    int x = value; // 一定能看到 value = 10
}

// synchronized：也禁止指令重排
synchronized (lock) {
    value = 10;
    initialized = true;
}
```

**4. 使用场景**

**volatile 适用场景：**
```java
// 1. 状态标志
private volatile boolean running = true;

public void stop() {
    running = false;
}

public void run() {
    while (running) {
        // 执行任务
    }
}

// 2. 双重检查锁定（DCL）
private volatile static Singleton instance;

public static Singleton getInstance() {
    if (instance == null) {
        synchronized (Singleton.class) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
    }
    return instance;
}

// 3. 独立观察
private volatile long lastUpdateTime;

public void update() {
    // 更新数据
    lastUpdateTime = System.currentTimeMillis();
}
```

**synchronized 适用场景：**
```java
// 1. 复合操作
private int count = 0;

public synchronized void increment() {
    count++; // 读-改-写
}

// 2. 多个变量的一致性
private int a = 0;
private int b = 0;

public synchronized void update() {
    a++;
    b++; // 保证 a 和 b 同时更新
}

// 3. 等待/通知机制
synchronized (lock) {
    while (!condition) {
        lock.wait();
    }
    // 执行操作
    lock.notify();
}
```

**性能对比：**
- volatile：读写操作几乎无开销
- synchronized：有锁竞争时开销较大

**选择建议：**
- 单个变量的可见性：volatile
- 复合操作：synchronized 或 Lock
- 需要等待/通知：synchronized 或 Lock + Condition

### 39. 如何优化 Java 中的锁的使用？

**答案：**

**1. 减少锁的持有时间**
```java
// 不好的做法
public synchronized void method() {
    // 大量非临界区代码
    doSomething();
    // 临界区代码
    criticalSection();
    // 更多非临界区代码
    doMore();
}

// 优化后
public void method() {
    doSomething();
    
    synchronized (lock) {
        // 只锁临界区
        criticalSection();
    }
    
    doMore();
}
```

**2. 减小锁的粒度**
```java
// 不好的做法：锁整个对象
public class UserService {
    private synchronized void updateUser() { }
    private synchronized void updateOrder() { }
}

// 优化后：使用不同的锁
public class UserService {
    private final Object userLock = new Object();
    private final Object orderLock = new Object();
    
    public void updateUser() {
        synchronized (userLock) { }
    }
    
    public void updateOrder() {
        synchronized (orderLock) { }
    }
}
```

**3. 锁分段（Lock Striping）**
```java
// ConcurrentHashMap 的实现思想
public class StripedMap {
    private static final int N_LOCKS = 16;
    private final Node[] buckets;
    private final Object[] locks;
    
    public StripedMap(int numBuckets) {
        buckets = new Node[numBuckets];
        locks = new Object[N_LOCKS];
        for (int i = 0; i < N_LOCKS; i++) {
            locks[i] = new Object();
        }
    }
    
    private final int hash(Object key) {
        return Math.abs(key.hashCode() % buckets.length);
    }
    
    public Object get(Object key) {
        int hash = hash(key);
        synchronized (locks[hash % N_LOCKS]) {
            // 访问 buckets[hash]
        }
    }
}
```

**4. 使用读写锁**
```java
// 不好的做法：读写都用同一个锁
private final Object lock = new Object();

public Object read() {
    synchronized (lock) {
        return data;
    }
}

public void write(Object newData) {
    synchronized (lock) {
        data = newData;
    }
}

// 优化后：使用读写锁
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();

public Object read() {
    rwLock.readLock().lock();
    try {
        return data;
    } finally {
        rwLock.readLock().unlock();
    }
}

public void write(Object newData) {
    rwLock.writeLock().lock();
    try {
        data = newData;
    } finally {
        rwLock.writeLock().unlock();
    }
}
```

**5. 使用无锁数据结构**
```java
// 不好的做法：使用锁
private int count = 0;

public synchronized void increment() {
    count++;
}

// 优化后：使用原子类
private AtomicInteger count = new AtomicInteger(0);

public void increment() {
    count.incrementAndGet();
}
```

**6. 避免锁嵌套**
```java
// 不好的做法：可能死锁
public synchronized void method1() {
    synchronized (lock2) {
        // ...
    }
}

public synchronized void method2() {
    synchronized (lock1) {
        // ...
    }
}

// 优化后：统一加锁顺序或避免嵌套
public void method1() {
    synchronized (lock1) {
        synchronized (lock2) {
            // ...
        }
    }
}
```

**7. 使用 ConcurrentHashMap 替代 Hashtable**
```java
// 不好的做法
Map<String, String> map = new Hashtable<>();

// 优化后
Map<String, String> map = new ConcurrentHashMap<>();
```

**8. 使用 ThreadLocal**
```java
// 不好的做法：共享变量需要同步
private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-DD");

public synchronized String format(Date date) {
    return sdf.format(date);
}

// 优化后：每个线程独立
private ThreadLocal<SimpleDateFormat> sdf = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("yyyy-MM-DD")
);

public String format(Date date) {
    return sdf.get().format(date);
}
```

**9. 使用 StampedLock（读多写少）**
```java
// 使用乐观读
private final StampedLock lock = new StampedLock();

public double read() {
    long stamp = lock.tryOptimisticRead();
    double value = this.value;
    
    if (!lock.validate(stamp)) {
        stamp = lock.readLock();
        try {
            value = this.value;
        } finally {
            lock.unlockRead(stamp);
        }
    }
    
    return value;
}
```

**10. 锁粗化（适当情况下）**
```java
// 不好的做法：频繁加锁解锁
for (int i = 0; i < 1000; i++) {
    synchronized (lock) {
        // 操作
    }
}

// 优化后：锁粗化
synchronized (lock) {
    for (int i = 0; i < 1000; i++) {
        // 操作
    }
}
```

### 40. 你了解 Java 中的读写锁吗？

**答案：**

读写锁（ReadWriteLock）允许多个读线程同时访问，但写线程访问时会阻塞所有读写线程。

**核心思想：**
- 读-读：不互斥
- 读-写：互斥
- 写-写：互斥

**基本使用：**
```java
public class Cache {
    private final Map<String, Object> cache = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    
    // 读操作
    public Object get(String key) {
        readLock.lock();
        try {
            return cache.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    // 写操作
    public void put(String key, Object value) {
        writeLock.lock();
        try {
            cache.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
}
```

**特性：**

**1. 公平性**
```java
// 非公平锁（默认）
ReadWriteLock rwLock = new ReentrantReadWriteLock();

// 公平锁
ReadWriteLock fairRwLock = new ReentrantReadWriteLock(true);
```

**2. 可重入**
```java
// 同一线程可以多次获取读锁或写锁
readLock.lock();
readLock.lock(); // 可重入
try {
    // ...
} finally {
    readLock.unlock();
    readLock.unlock();
}
```

**3. 锁降级**
```java
// 支持写锁降级为读锁
writeLock.lock();
try {
    // 写操作
    
    readLock.lock(); // 获取读锁
} finally {
    writeLock.unlock(); // 释放写锁，降级为读锁
}

try {
    // 读操作
} finally {
    readLock.unlock();
}
```

**4. 不支持锁升级**
```java
// 不支持读锁升级为写锁
readLock.lock();
try {
    writeLock.lock(); // 会死锁！
    // ...
} finally {
    readLock.unlock();
}
```

**应用场景：**

**1. 缓存系统**
```java
public class DataCache {
    private Map<String, Data> cache = new HashMap<>();
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public Data getData(String key) {
        rwLock.readLock().lock();
        try {
            Data data = cache.get(key);
            if (data == null) {
                rwLock.readLock().unlock();
                rwLock.writeLock().lock();
                try {
                    // 双重检查
                    data = cache.get(key);
                    if (data == null) {
                        data = loadFromDatabase(key);
                        cache.put(key, data);
                    }
                    rwLock.readLock().lock();
                } finally {
                    rwLock.writeLock().unlock();
                }
            }
            return data;
        } finally {
            rwLock.readLock().unlock();
        }
    }
}
```

**2. 配置管理**
```java
public class ConfigManager {
    private Properties config = new Properties();
    private ReadWriteLock rwLock = new ReentrantReadWriteLock();
    
    public String getProperty(String key) {
        rwLock.readLock().lock();
        try {
            return config.getProperty(key);
        } finally {
            rwLock.readLock().unlock();
        }
    }
    
    public void reload() {
        rwLock.writeLock().lock();
        try {
            config = loadConfig();
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
```

**性能对比：**

| 场景 | synchronized | ReadWriteLock |
|------|-------------|---------------|
| 读多写少 | 性能较低 | 性能高 |
| 读少写多 | 性能相当 | 性能相当 |
| 只读 | 性能较低 | 性能高 |

**最佳实践：**
- 读多写少场景使用读写锁
- 读写比例相当时使用普通锁
- 考虑使用 StampedLock（性能更好）


### 41. 什么是 Java 内存模型（JMM）？

**答案：**

Java 内存模型（Java Memory Model，JMM）是一种规范，定义了 Java 程序中各个变量的访问规则，以及在 JVM 中将变量存储到内存和从内存中读取变量的底层细节。

**核心概念：**

**1. 主内存与工作内存**
```
线程1                线程2                线程3
工作内存              工作内存              工作内存
  ↓↑                  ↓↑                  ↓↑
  ←←←←←←←←←←←←←←←←←←←←←→→→→→→→→→→→→→→→→→→→→
                    主内存
            （共享变量存储位置）
```

- **主内存**：所有线程共享，存储共享变量
- **工作内存**：每个线程私有，存储主内存变量的副本

**2. 内存交互操作**

8 种原子操作：
- **lock（锁定）**：作用于主内存，标识变量为线程独占
- **unlock（解锁）**：作用于主内存，释放锁定的变量
- **read（读取）**：作用于主内存，把变量值传输到工作内存
- **load（载入）**：作用于工作内存，把 read 的值放入工作内存副本
- **use（使用）**：作用于工作内存，把值传递给执行引擎
- **assign（赋值）**：作用于工作内存，把执行引擎的值赋给工作内存变量
- **store（存储）**：作用于工作内存，把值传送到主内存
- **write（写入）**：作用于主内存，把 store 的值写入主内存变量

**3. JMM 三大特性**

**原子性（Atomicity）：**
```java
// 原子操作
int a = 10;        // 原子
a = b;             // 非原子（读b + 写a）
a++;               // 非原子（读a + 加1 + 写a）
a = a + 1;         // 非原子

// 保证原子性
synchronized (lock) {
    a++;
}

AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();
```

**可见性（Visibility）：**
```java
// 问题：线程2可能看不到线程1的修改
private boolean flag = false;

// 线程1
flag = true;

// 线程2
while (!flag) {
    // 可能一直循环
}

// 解决方案1：volatile
private volatile boolean flag = false;

// 解决方案2：synchronized
synchronized (lock) {
    flag = true;
}
```

**有序性（Ordering）：**
```java
// 可能发生指令重排
int a = 0;
boolean flag = false;

// 线程1
a = 1;           // 操作1
flag = true;     // 操作2（可能重排到操作1之前）

// 线程2
if (flag) {
    int b = a;   // 可能 b = 0
}

// 解决方案：volatile 禁止重排
private volatile boolean flag = false;
```

**4. happens-before 规则**

如果操作 A happens-before 操作 B，则 A 的结果对 B 可见。

**规则列表：**
1. **程序顺序规则**：单线程内，前面的操作 happens-before 后面的操作
2. **锁规则**：unlock happens-before 后续对同一个锁的 lock
3. **volatile 规则**：volatile 写 happens-before 后续对该变量的读
4. **传递性**：A happens-before B，B happens-before C，则 A happens-before C
5. **线程启动规则**：Thread.start() happens-before 线程内的所有操作
6. **线程终止规则**：线程内所有操作 happens-before Thread.join() 返回
7. **中断规则**：interrupt() happens-before 检测到中断事件
8. **对象终结规则**：构造函数结束 happens-before finalize() 方法

**示例：**
```java
// 程序顺序规则
int a = 1;  // 操作1
int b = 2;  // 操作2 happens-before 操作1

// 锁规则
synchronized (lock) {
    a = 1;  // 操作1
}
// unlock happens-before 下一个 lock

synchronized (lock) {
    int b = a;  // 能看到 a = 1
}

// volatile 规则
volatile boolean flag = false;
int a = 0;

// 线程1
a = 1;
flag = true;  // volatile 写

// 线程2
if (flag) {  // volatile 读
    int b = a;  // 一定能看到 a = 1
}
```

**5. 内存屏障**

JMM 通过内存屏障（Memory Barrier）实现：
- **LoadLoad 屏障**：Load1; LoadLoad; Load2（确保 Load1 先于 Load2）
- **StoreStore 屏障**：Store1; StoreStore; Store2（确保 Store1 先于 Store2）
- **LoadStore 屏障**：Load1; LoadStore; Store2（确保 Load1 先于 Store2）
- **StoreLoad 屏障**：Store1; StoreLoad; Load2（确保 Store1 先于 Load2）

**volatile 的内存屏障：**
```java
// volatile 写
StoreStore 屏障
volatile 写操作
StoreLoad 屏障

// volatile 读
volatile 读操作
LoadLoad 屏障
LoadStore 屏障
```

### 42. 什么是 Java 中的原子性、可见性和有序性？

**答案：**

这是并发编程的三大特性，JMM 的核心内容。

**1. 原子性（Atomicity）**

**定义：** 一个操作或多个操作要么全部执行成功，要么全部不执行，中间不会被打断。

**原子操作：**
```java
// 原子操作
int a = 10;              // 赋值操作
int b = a;               // 非原子（读a + 写b）
a++;                     // 非原子（读a + 加1 + 写a）
long c = 0L;             // 非原子（64位，分两次写入）
```

**保证原子性的方式：**
```java
// 1. synchronized
private int count = 0;

public synchronized void increment() {
    count++;  // 保证原子性
}

// 2. Lock
private final Lock lock = new ReentrantLock();

public void increment() {
    lock.lock();
    try {
        count++;
    } finally {
        lock.unlock();
    }
}

// 3. 原子类
private AtomicInteger count = new AtomicInteger(0);

public void increment() {
    count.incrementAndGet();  // 原子操作
}
```

**2. 可见性（Visibility）**

**定义：** 当一个线程修改了共享变量的值，其他线程能够立即得知这个修改。

**可见性问题：**
```java
// 线程1
private boolean flag = false;

public void writer() {
    flag = true;  // 写入工作内存，可能不会立即刷新到主内存
}

// 线程2
public void reader() {
    while (!flag) {  // 从工作内存读取，可能读到旧值
        // 可能一直循环
    }
}
```

**保证可见性的方式：**
```java
// 1. volatile
private volatile boolean flag = false;

// 2. synchronized
private boolean flag = false;

public synchronized void writer() {
    flag = true;  // 解锁时刷新到主内存
}

public synchronized void reader() {
    if (flag) {  // 加锁时从主内存读取
        // ...
    }
}

// 3. final
private final int value = 10;  // final 变量保证可见性

// 4. Lock
private final Lock lock = new ReentrantLock();

public void writer() {
    lock.lock();
    try {
        flag = true;
    } finally {
        lock.unlock();  // 解锁时刷新
    }
}
```

**3. 有序性（Ordering）**

**定义：** 程序执行的顺序按照代码的先后顺序执行。

**指令重排问题：**
```java
// 单例模式的双重检查锁定
public class Singleton {
    private static Singleton instance;
    
    public static Singleton getInstance() {
        if (instance == null) {  // 第一次检查
            synchronized (Singleton.class) {
                if (instance == null) {  // 第二次检查
                    instance = new Singleton();  // 可能发生指令重排
                    // 1. 分配内存
                    // 2. 初始化对象
                    // 3. 将 instance 指向内存
                    // 可能重排为：1 -> 3 -> 2
                }
            }
        }
        return instance;
    }
}

// 问题：线程A执行到3，线程B看到 instance != null，但对象未初始化
```

**保证有序性的方式：**
```java
// 1. volatile（禁止指令重排）
private static volatile Singleton instance;

// 2. synchronized（happens-before 规则）
synchronized (lock) {
    a = 1;
    b = 2;  // 不会重排到 synchronized 块外
}

// 3. happens-before 规则
// 程序顺序规则、锁规则、volatile 规则等
```

**三者关系：**

| 特性 | volatile | synchronized | Lock | Atomic |
|------|---------|-------------|------|--------|
| 原子性 | ✗ | ✓ | ✓ | ✓ |
| 可见性 | ✓ | ✓ | ✓ | ✓ |
| 有序性 | ✓ | ✓ | ✓ | ✓ |

**实际应用：**
```java
public class Counter {
    // 可见性：volatile
    private volatile boolean running = true;
    
    // 原子性：AtomicInteger
    private AtomicInteger count = new AtomicInteger(0);
    
    // 有序性 + 原子性：synchronized
    private int value = 0;
    
    public synchronized void updateValue() {
        value++;  // 保证原子性和有序性
    }
    
    public void stop() {
        running = false;  // 保证可见性
    }
    
    public void increment() {
        count.incrementAndGet();  // 保证原子性
    }
}
```

### 43. 什么是 Java 的 happens-before 规则？

**答案：**

happens-before 是 JMM 中定义的两个操作之间的偏序关系，用于保证内存可见性。

**定义：**
如果操作 A happens-before 操作 B，那么 A 的执行结果对 B 可见，且 A 的执行顺序在 B 之前。

**8 大 happens-before 规则：**

**1. 程序顺序规则（Program Order Rule）**
```java
// 单线程内，前面的操作 happens-before 后面的操作
int a = 1;  // 操作1
int b = 2;  // 操作2 happens-before 操作1
int c = a + b;  // 能看到 a=1, b=2
```

**2. 锁规则（Monitor Lock Rule）**
```java
// 对一个锁的解锁 happens-before 后续对这个锁的加锁
synchronized (lock) {
    a = 1;  // 操作1
}  // unlock

// 另一个线程
synchronized (lock) {  // lock
    int b = a;  // 操作2，能看到 a=1
}
```

**3. volatile 变量规则（Volatile Variable Rule）**
```java
// volatile 写 happens-before 后续对该变量的读
volatile boolean flag = false;
int a = 0;

// 线程1
a = 1;  // 操作1
flag = true;  // volatile 写，操作2

// 线程2
if (flag) {  // volatile 读，操作3
    int b = a;  // 操作4，能看到 a=1
}
// 操作2 happens-before 操作3
// 操作1 happens-before 操作2（程序顺序规则）
// 操作3 happens-before 操作4（程序顺序规则）
// 因此操作1 happens-before 操作4
```

**4. 传递性规则（Transitivity）**
```java
// A happens-before B，B happens-before C
// 则 A happens-before C
int a = 1;  // 操作A
int b = a;  // 操作B
int c = b;  // 操作C
// A happens-before B happens-before C
```

**5. 线程启动规则（Thread Start Rule）**
```java
// Thread.start() happens-before 线程内的所有操作
int a = 1;  // 操作1

Thread thread = new Thread(() -> {
    int b = a;  // 操作2，能看到 a=1
});

thread.start();  // happens-before 操作2
```

**6. 线程终止规则（Thread Termination Rule）**
```java
// 线程内所有操作 happens-before Thread.join() 返回
Thread thread = new Thread(() -> {
    a = 1;  // 操作1
});

thread.start();
thread.join();  // 等待线程结束

int b = a;  // 操作2，能看到 a=1
// 操作1 happens-before join() 返回
```

**7. 线程中断规则（Thread Interruption Rule）**
```java
// interrupt() happens-before 检测到中断事件
Thread thread = new Thread(() -> {
    while (!Thread.interrupted()) {  // 操作2
        // 能检测到中断
    }
});

thread.start();
thread.interrupt();  // 操作1 happens-before 操作2
```

**8. 对象终结规则（Finalizer Rule）**
```java
// 对象的构造函数结束 happens-before finalize() 方法
public class MyObject {
    private int value;
    
    public MyObject() {
        value = 10;  // 操作1
    }  // 构造函数结束
    
    @Override
    protected void finalize() {
        int a = value;  // 操作2，能看到 value=10
    }
}
```

**实际应用示例：**

**1. 双重检查锁定（DCL）**
```java
public class Singleton {
    private static volatile Singleton instance;
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                    // volatile 写 happens-before 后续读
                }
            }
        }
        return instance;
    }
}
```

**2. 生产者-消费者**
```java
public class ProducerConsumer {
    private volatile boolean ready = false;
    private int data;
    
    // 生产者
    public void produce() {
        data = 42;  // 操作1
        ready = true;  // volatile 写，操作2
    }
    
    // 消费者
    public void consume() {
        if (ready) {  // volatile 读，操作3
            int value = data;  // 操作4，能看到 data=42
        }
    }
}
```

**3. 线程安全的延迟初始化**
```java
public class LazyInit {
    private volatile Helper helper;
    
    public Helper getHelper() {
        Helper h = helper;
        if (h == null) {
            synchronized (this) {
                h = helper;
                if (h == null) {
                    h = new Helper();
                    helper = h;  // volatile 写
                }
            }
        }
        return h;  // volatile 读，能看到完整初始化的对象
    }
}
```

**总结：**
- happens-before 保证内存可见性
- 不需要显式同步也能保证可见性
- 是 JMM 的核心概念
- 理解 happens-before 有助于编写正确的并发代码

### 44. 什么是 Java 中的指令重排？

**答案：**

指令重排是指编译器和处理器为了优化程序性能而对指令序列进行重新排序的一种手段。

**三种重排：**

**1. 编译器优化重排**
```java
// 原始代码
int a = 1;
int b = 2;
int c = a + b;

// 编译器可能重排为
int b = 2;
int a = 1;
int c = a + b;
```

**2. 指令级并行重排**
```java
// CPU 可能并行执行不相关的指令
int a = 1;  // 指令1
int b = 2;  // 指令2（可能与指令1并行）
```

**3. 内存系统重排**
```java
// 写缓冲区可能导致写操作重排
a = 1;  // 写入缓冲区
b = 2;  // 可能先刷新到内存
```

**重排的原则：**

**as-if-serial 语义：**
- 单线程内，重排后的执行结果与顺序执行的结果一致
- 不会对存在数据依赖的操作进行重排

```java
// 有数据依赖，不会重排
int a = 1;
int b = a + 1;  // 依赖 a，不会重排到 a=1 之前

// 无数据依赖，可能重排
int a = 1;
int b = 2;  // 可能重排
```

**重排导致的问题：**

**1. 双重检查锁定问题**
```java
public class Singleton {
    private static Singleton instance;
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                    // 正常顺序：
                    // 1. 分配内存
                    // 2. 初始化对象
                    // 3. instance 指向内存
                    
                    // 重排后可能：
                    // 1. 分配内存
                    // 3. instance 指向内存
                    // 2. 初始化对象
                }
            }
        }
        return instance;  // 可能返回未初始化的对象
    }
}

// 解决方案：volatile
private static volatile Singleton instance;
```

**2. 可见性问题**
```java
// 线程1
int a = 0;
boolean flag = false;

public void writer() {
    a = 1;  // 操作1
    flag = true;  // 操作2（可能重排到操作1之前）
}

// 线程2
public void reader() {
    if (flag) {  // 可能看到 flag=true
        int b = a;  // 但 a 可能还是 0
    }
}

// 解决方案：volatile
private volatile boolean flag = false;
```

**3. 初始化安全问题**
```java
public class UnsafeInit {
    private int value;
    private boolean initialized;
    
    public UnsafeInit() {
        value = 10;  // 操作1
        initialized = true;  // 操作2（可能重排到操作1之前）
    }
    
    public int getValue() {
        if (initialized) {  // 可能看到 initialized=true
            return value;  // 但 value 可能还是 0
        }
        return -1;
    }
}
```

**禁止重排的方式：**

**1. volatile**
```java
// volatile 写之前的操作不会重排到 volatile 写之后
// volatile 读之后的操作不会重排到 volatile 读之前
private volatile boolean flag = false;

public void writer() {
    a = 1;  // 不会重排到 flag=true 之后
    flag = true;  // volatile 写
}

public void reader() {
    if (flag) {  // volatile 读
        int b = a;  // 不会重排到 flag 读之前
    }
}
```

**2. synchronized**
```java
// synchronized 块内的操作不会重排到块外
synchronized (lock) {
    a = 1;
    b = 2;  // 不会重排到 synchronized 块外
}
```

**3. final**
```java
// final 字段的初始化不会重排到构造函数之外
public class FinalExample {
    private final int value;
    
    public FinalExample() {
        value = 10;  // 不会重排到构造函数之外
    }
}
```

**4. happens-before 规则**
```java
// 遵循 happens-before 规则的操作不会重排
```

**内存屏障：**

JVM 通过插入内存屏障指令来禁止重排：

```java
// volatile 写
StoreStore 屏障  // 禁止前面的写与 volatile 写重排
volatile 写
StoreLoad 屏障   // 禁止 volatile 写与后面的读/写重排

// volatile 读
volatile 读
LoadLoad 屏障    // 禁止 volatile 读与后面的读重排
LoadStore 屏障   // 禁止 volatile 读与后面的写重排
```

**最佳实践：**
1. 使用 volatile 保证可见性和有序性
2. 使用 synchronized 或 Lock 保证原子性和有序性
3. 理解 happens-before 规则
4. 避免依赖指令执行顺序
5. 使用不可变对象

### 45. Java 中的 final 关键字是否能保证变量的可见性？

**答案：**

是的，final 关键字能保证变量的可见性，但有特定的条件和限制。

**final 的可见性保证：**

**1. final 字段的初始化安全**
```java
public class FinalExample {
    private final int value;
    private final String name;
    
    public FinalExample() {
        value = 10;
        name = "test";
        // 构造函数结束时，final 字段对其他线程可见
    }
}

// 线程1
FinalExample obj = new FinalExample();

// 线程2
int v = obj.value;  // 一定能看到 value=10
String n = obj.name;  // 一定能看到 name="test"
```

**2. final 的 happens-before 规则**
```java
// 对象的构造函数中对 final 字段的写入
// happens-before
// 在构造函数外对该对象的 final 字段的读取

public class SafePublication {
    private final int value;
    
    public SafePublication() {
        value = 42;  // final 写
    }  // 构造函数结束
    
    public int getValue() {
        return value;  // final 读，一定能看到 42
    }
}
```

**3. final 引用对象的可见性**
```java
public class FinalReference {
    private final int[] array;
    
    public FinalReference() {
        array = new int[10];
        array[0] = 1;  // 对 final 引用对象的修改也可见
    }
    
    public int getFirst() {
        return array[0];  // 一定能看到 array[0]=1
    }
}
```

**final 的限制：**

**1. 不保证非 final 字段的可见性**
```java
public class MixedFields {
    private final int finalValue;
    private int normalValue;
    
    public MixedFields() {
        finalValue = 10;  // 保证可见
        normalValue = 20;  // 不保证可见
    }
}

// 其他线程可能看到 finalValue=10，但 normalValue=0
```

**2. 不保证 final 字段修改后的可见性**
```java
public class MutableFinal {
    private final List<String> list = new ArrayList<>();
    
    public void add(String item) {
        list.add(item);  // 修改 final 引用的对象，不保证可见性
    }
}

// 解决方案：使用 volatile 或同步
private final List<String> list = new CopyOnWriteArrayList<>();
```

**3. 构造函数中的 this 逃逸**
```java
// 错误示例：this 逃逸
public class ThisEscape {
    private final int value;
    
    public ThisEscape() {
        // 在构造函数中将 this 传递出去
        EventListener listener = new EventListener() {
            public void onEvent(Event e) {
                doSomething(e);
            }
        };
        
        source.registerListener(listener);  // this 逃逸
        
        value = 42;  // final 字段的可见性保证失效
    }
}

// 正确做法：构造函数完成后再注册
public class SafeConstruction {
    private final int value;
    
    private SafeConstruction() {
        value = 42;
    }
    
    public static SafeConstruction newInstance() {
        SafeConstruction obj = new SafeConstruction();
        source.registerListener(obj);  // 构造完成后注册
        return obj;
    }
}
```

**final 与 volatile 的对比：**

| 特性 | final | volatile |
|------|-------|----------|
| 可见性 | 保证（初始化） | 保证（所有操作） |
| 有序性 | 保证（初始化） | 保证（所有操作） |
| 可修改 | 不可修改 | 可修改 |
| 性能 | 无开销 | 有轻微开销 |
| 适用场景 | 不可变字段 | 可变状态标志 |

**实际应用：**

**1. 不可变对象**
```java
public final class ImmutablePoint {
    private final int x;
    private final int y;
    
    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public int getX() { return x; }
    public int getY() { return y; }
}
// 线程安全，无需同步
```

**2. 安全发布**
```java
public class SafePublisher {
    private final Map<String, String> config;
    
    public SafePublisher() {
        Map<String, String> temp = new HashMap<>();
        temp.put("key1", "value1");
        temp.put("key2", "value2");
        config = Collections.unmodifiableMap(temp);
        // final 保证 config 对其他线程可见
    }
}
```

**3. 单例模式**
```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    
    private Singleton() {
        // 初始化
    }
    
    public static Singleton getInstance() {
        return INSTANCE;  // final 保证可见性
    }
}
```

**最佳实践：**
1. 尽可能使用 final 修饰不可变字段
2. 避免构造函数中的 this 逃逸
3. final 引用的可变对象仍需同步
4. 结合不可变模式使用
5. 理解 final 的可见性保证范围

### 46. 为什么在 Java 中需要使用 ThreadLocal？

**答案：**

ThreadLocal 提供线程局部变量，每个线程都有自己独立的变量副本，互不干扰。

**使用场景：**

**1. 线程安全的日期格式化**
```java
// 问题：SimpleDateFormat 不是线程安全的
private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

public String format(Date date) {
    return sdf.format(date); // 多线程下会出错
}

// 解决方案：ThreadLocal
private static final ThreadLocal<SimpleDateFormat> sdf = 
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

public String format(Date date) {
    return sdf.get().format(date); // 每个线程独立
}
```

**2. 数据库连接管理**
```java
public class ConnectionManager {
    private static final ThreadLocal<Connection> connectionHolder = 
        new ThreadLocal<>();
    
    public static Connection getConnection() {
        Connection conn = connectionHolder.get();
        if (conn == null) {
            conn = DriverManager.getConnection(url, user, password);
            connectionHolder.set(conn);
        }
        return conn;
    }
    
    public static void closeConnection() {
        Connection conn = connectionHolder.get();
        if (conn != null) {
            conn.close();
            connectionHolder.remove(); // 清理
        }
    }
}
```

**3. 用户上下文传递**
```java
public class UserContext {
    private static final ThreadLocal<User> currentUser = new ThreadLocal<>();
    
    public static void setUser(User user) {
        currentUser.set(user);
    }
    
    public static User getUser() {
        return currentUser.get();
    }
    
    public static void clear() {
        currentUser.remove();
    }
}

// 在过滤器中设置
public class AuthFilter implements Filter {
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) {
        User user = authenticate(request);
        UserContext.setUser(user);
        try {
            chain.doFilter(request, response);
        } finally {
            UserContext.clear(); // 清理
        }
    }
}
```

**4. 事务管理**
```java
public class TransactionManager {
    private static final ThreadLocal<Transaction> transactionHolder = 
        new ThreadLocal<>();
    
    public static void beginTransaction() {
        Transaction tx = new Transaction();
        transactionHolder.set(tx);
    }
    
    public static Transaction getCurrentTransaction() {
        return transactionHolder.get();
    }
    
    public static void commit() {
        Transaction tx = transactionHolder.get();
        if (tx != null) {
            tx.commit();
            transactionHolder.remove();
        }
    }
}
```

**优点：**
1. 线程安全，无需同步
2. 避免参数传递
3. 性能好，无锁竞争

**缺点：**
1. 内存泄漏风险（需要手动清理）
2. 不适合线程池场景（线程复用）
3. 增加内存开销

### 47. Java 中的 ThreadLocal 是如何实现线程资源隔离的？

**答案：**

ThreadLocal 通过在每个线程内部维护一个 Map 来实现资源隔离。

**实现原理：**

**1. 数据结构**
```java
// Thread 类中的字段
public class Thread {
    ThreadLocal.ThreadLocalMap threadLocals = null;
}

// ThreadLocalMap 是 ThreadLocal 的内部类
static class ThreadLocalMap {
    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;
        
        Entry(ThreadLocal<?> k, Object v) {
            super(k);
            value = v;
        }
    }
    
    private Entry[] table; // 哈希表
}
```

**2. set 方法**
```java
public void set(T value) {
    Thread t = Thread.currentThread(); // 获取当前线程
    ThreadLocalMap map = getMap(t);    // 获取线程的 Map
    if (map != null)
        map.set(this, value);          // 以 ThreadLocal 为 key
    else
        createMap(t, value);           // 创建 Map
}

ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}
```

**3. get 方法**
```java
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            return (T)e.value;
        }
    }
    return setInitialValue(); // 初始化
}
```

**4. remove 方法**
```java
public void remove() {
    ThreadLocalMap m = getMap(Thread.currentThread());
    if (m != null)
        m.remove(this);
}
```

**内存结构：**
```
Thread-1
  └── threadLocals (ThreadLocalMap)
        ├── Entry[0]: ThreadLocal1 -> Value1
        ├── Entry[1]: ThreadLocal2 -> Value2
        └── Entry[2]: null

Thread-2
  └── threadLocals (ThreadLocalMap)
        ├── Entry[0]: ThreadLocal1 -> Value3
        └── Entry[1]: ThreadLocal2 -> Value4
```

**哈希冲突解决：**
```java
// 使用线性探测法
private void set(ThreadLocal<?> key, Object value) {
    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1); // 计算索引
    
    for (Entry e = tab[i]; e != null; e = tab[i = nextIndex(i, len)]) {
        ThreadLocal<?> k = e.get();
        
        if (k == key) {
            e.value = value; // 更新
            return;
        }
        
        if (k == null) {
            replaceStaleEntry(key, value, i); // 替换过期 Entry
            return;
        }
    }
    
    tab[i] = new Entry(key, value); // 插入新 Entry
    int sz = ++size;
    if (!cleanSomeSlots(i, sz) && sz >= threshold)
        rehash(); // 扩容
}
```

**示例：**
```java
public class ThreadLocalDemo {
    private static ThreadLocal<Integer> threadLocal = new ThreadLocal<>();
    
    public static void main(String[] args) {
        // 线程1
        new Thread(() -> {
            threadLocal.set(100);
            System.out.println("Thread-1: " + threadLocal.get()); // 100
        }).start();
        
        // 线程2
        new Thread(() -> {
            threadLocal.set(200);
            System.out.println("Thread-2: " + threadLocal.get()); // 200
        }).start();
        
        // 主线程
        threadLocal.set(300);
        System.out.println("Main: " + threadLocal.get()); // 300
    }
}
```

### 48. 为什么 Java 中的 ThreadLocal 对 key 的引用为弱引用？

**答案：**

ThreadLocal 使用弱引用作为 key 是为了避免内存泄漏。

**弱引用的定义：**
```java
static class Entry extends WeakReference<ThreadLocal<?>> {
    Object value;
    
    Entry(ThreadLocal<?> k, Object v) {
        super(k); // ThreadLocal 作为弱引用
        value = v; // value 是强引用
    }
}
```

**引用关系：**
```
栈中的引用 → ThreadLocal 对象 ← 弱引用 ← Entry
                                        ↓
                                      Value（强引用）
```

**为什么使用弱引用：**

**1. 避免 ThreadLocal 对象无法回收**
```java
// 如果使用强引用
public void method() {
    ThreadLocal<String> local = new ThreadLocal<>();
    local.set("value");
    // method 结束后，local 变量被回收
    // 但如果 Entry 持有 ThreadLocal 的强引用
    // ThreadLocal 对象无法被 GC 回收
}

// 使用弱引用
// method 结束后，local 变量被回收
// ThreadLocal 对象没有强引用，可以被 GC 回收
// Entry 的 key 变为 null
```

**2. 自动清理机制**
```java
// ThreadLocalMap 在操作时会清理 key 为 null 的 Entry
private int expungeStaleEntry(int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;
    
    // 清理当前位置
    tab[staleSlot].value = null;
    tab[staleSlot] = null;
    size--;
    
    // 清理后续位置的过期 Entry
    Entry e;
    int i;
    for (i = nextIndex(staleSlot, len); (e = tab[i]) != null; 
         i = nextIndex(i, len)) {
        ThreadLocal<?> k = e.get();
        if (k == null) {
            e.value = null;
            tab[i] = null;
            size--;
        } else {
            // rehash
        }
    }
    return i;
}
```

**内存泄漏问题：**

**问题场景：**
```java
// ThreadLocal 被回收，key 变为 null
// 但 value 仍然被 Entry 强引用
// 如果线程长期存活（如线程池），value 无法回收

ThreadLocal<byte[]> local = new ThreadLocal<>();
local.set(new byte[1024 * 1024]); // 1MB
local = null; // ThreadLocal 被回收

// Entry: key=null, value=1MB 数据
// value 无法被回收，造成内存泄漏
```

**解决方案：**
```java
// 1. 手动调用 remove()
ThreadLocal<String> local = new ThreadLocal<>();
try {
    local.set("value");
    // 使用 local
} finally {
    local.remove(); // 清理
}

// 2. 使用 try-with-resources（自定义）
public class AutoCleanThreadLocal<T> implements AutoCloseable {
    private ThreadLocal<T> threadLocal = new ThreadLocal<>();
    
    public void set(T value) {
        threadLocal.set(value);
    }
    
    public T get() {
        return threadLocal.get();
    }
    
    @Override
    public void close() {
        threadLocal.remove();
    }
}

// 使用
try (AutoCleanThreadLocal<String> local = new AutoCleanThreadLocal<>()) {
    local.set("value");
    // 使用 local
} // 自动清理
```

**引用类型对比：**

| 引用类型 | 回收时机 | 适用场景 |
|---------|---------|---------|
| 强引用 | 永不回收 | 正常对象 |
| 软引用 | 内存不足时 | 缓存 |
| 弱引用 | GC 时 | ThreadLocal key |
| 虚引用 | GC 时 | 回收通知 |

### 49. Java 中使用 ThreadLocal 的最佳实践是什么？

**答案：**

**1. 使用 static final 修饰**
```java
// 推荐：static final
private static final ThreadLocal<SimpleDateFormat> sdf = 
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

// 不推荐：实例变量
private ThreadLocal<SimpleDateFormat> sdf = new ThreadLocal<>();
```

**原因：**
- ThreadLocal 通常作为全局变量使用
- 避免创建多个 ThreadLocal 实例
- 减少内存开销

**2. 及时清理（remove）**
```java
// 推荐：使用 try-finally
ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();

public void doWork() {
    try {
        Connection conn = getConnection();
        connectionHolder.set(conn);
        // 执行业务逻辑
    } finally {
        connectionHolder.remove(); // 清理
    }
}

// 在过滤器中使用
public class RequestContextFilter implements Filter {
    private static final ThreadLocal<RequestContext> contextHolder = 
        new ThreadLocal<>();
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                        FilterChain chain) throws IOException, ServletException {
        try {
            contextHolder.set(new RequestContext(request));
            chain.doFilter(request, response);
        } finally {
            contextHolder.remove(); // 清理
        }
    }
}
```

**3. 使用 initialValue 或 withInitial**
```java
// 方式1：重写 initialValue
private static final ThreadLocal<SimpleDateFormat> sdf = 
    new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    };

// 方式2：使用 withInitial（推荐）
private static final ThreadLocal<SimpleDateFormat> sdf = 
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
```

**4. 避免在线程池中使用**
```java
// 问题：线程池中线程复用，ThreadLocal 数据可能污染
ExecutorService executor = Executors.newFixedThreadPool(10);

executor.submit(() -> {
    threadLocal.set("value1");
    // 任务执行完，线程返回线程池
    // threadLocal 中的数据仍然存在
});

executor.submit(() -> {
    String value = threadLocal.get(); // 可能获取到上一个任务的数据
});

// 解决方案：每次使用前清理
executor.submit(() -> {
    try {
        threadLocal.remove(); // 清理旧数据
        threadLocal.set("value");
        // 执行任务
    } finally {
        threadLocal.remove(); // 清理
    }
});
```

**5. 不要存储大对象**
```java
// 不推荐：存储大对象
private static final ThreadLocal<byte[]> largeData = new ThreadLocal<>();
largeData.set(new byte[10 * 1024 * 1024]); // 10MB

// 推荐：存储引用或小对象
private static final ThreadLocal<String> userId = new ThreadLocal<>();
userId.set("user123");
```

**6. 文档化使用场景**
```java
/**
 * 存储当前请求的用户信息
 * 注意：必须在请求结束时调用 clear() 清理
 */
private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

public static void setUser(User user) {
    currentUser.set(user);
}

public static User getUser() {
    return currentUser.get();
}

/**
 * 清理当前线程的用户信息
 * 必须在请求结束时调用
 */
public static void clear() {
    currentUser.remove();
}
```

**7. 监控和检测**
```java
public class ThreadLocalMonitor {
    private static final ThreadLocal<Long> startTime = new ThreadLocal<>();
    
    public static void start() {
        startTime.set(System.currentTimeMillis());
    }
    
    public static void end() {
        Long start = startTime.get();
        if (start != null) {
            long duration = System.currentTimeMillis() - start;
            System.out.println("Duration: " + duration + "ms");
            startTime.remove(); // 清理
        }
    }
}
```

**8. 使用包装类**
```java
public class ThreadLocalContext<T> {
    private final ThreadLocal<T> threadLocal;
    
    public ThreadLocalContext(Supplier<T> supplier) {
        this.threadLocal = ThreadLocal.withInitial(supplier);
    }
    
    public T get() {
        return threadLocal.get();
    }
    
    public void set(T value) {
        threadLocal.set(value);
    }
    
    public void remove() {
        threadLocal.remove();
    }
    
    // 自动清理
    public void execute(Consumer<T> action) {
        try {
            action.accept(get());
        } finally {
            remove();
        }
    }
}
```

### 50. Java 中的 InheritableThreadLocal 是什么？

**答案：**

InheritableThreadLocal 是 ThreadLocal 的子类，允许子线程继承父线程的 ThreadLocal 值。

**基本使用：**
```java
// ThreadLocal：子线程无法访问父线程的值
private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

public static void main(String[] args) {
    threadLocal.set("父线程的值");
    
    new Thread(() -> {
        System.out.println(threadLocal.get()); // null
    }).start();
}

// InheritableThreadLocal：子线程可以访问父线程的值
private static InheritableThreadLocal<String> inheritableThreadLocal = 
    new InheritableThreadLocal<>();

public static void main(String[] args) {
    inheritableThreadLocal.set("父线程的值");
    
    new Thread(() -> {
        System.out.println(inheritableThreadLocal.get()); // 父线程的值
    }).start();
}
```

**实现原理：**
```java
// Thread 类中的字段
public class Thread {
    ThreadLocal.ThreadLocalMap threadLocals = null;
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null; // 可继承的
}

// Thread 构造函数
private void init(ThreadGroup g, Runnable target, String name, 
                 long stackSize, AccessControlContext acc, 
                 boolean inheritThreadLocals) {
    Thread parent = currentThread();
    
    // 如果父线程有 inheritableThreadLocals，复制给子线程
    if (inheritThreadLocals && parent.inheritableThreadLocals != null)
        this.inheritableThreadLocals = 
            ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
}
```

**自定义继承逻辑：**
```java
// 重写 childValue 方法
private static InheritableThreadLocal<List<String>> inheritableThreadLocal = 
    new InheritableThreadLocal<List<String>>() {
        @Override
        protected List<String> childValue(List<String> parentValue) {
            // 返回父线程值的副本，避免共享
            return new ArrayList<>(parentValue);
        }
    };

public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    list.add("item1");
    inheritableThreadLocal.set(list);
    
    new Thread(() -> {
        List<String> childList = inheritableThreadLocal.get();
        childList.add("item2"); // 不影响父线程的 list
        System.out.println(childList); // [item1, item2]
    }).start();
    
    Thread.sleep(100);
    System.out.println(list); // [item1]
}
```

**应用场景：**

**1. 链路追踪**
```java
public class TraceContext {
    private static final InheritableThreadLocal<String> traceId = 
        new InheritableThreadLocal<>();
    
    public static void setTraceId(String id) {
        traceId.set(id);
    }
    
    public static String getTraceId() {
        return traceId.get();
    }
}

// 主线程
TraceContext.setTraceId("trace-123");

// 子线程自动继承
new Thread(() -> {
    System.out.println(TraceContext.getTraceId()); // trace-123
    // 执行业务逻辑
}).start();
```

**2. 用户上下文传递**
```java
public class UserContext {
    private static final InheritableThreadLocal<User> currentUser = 
        new InheritableThreadLocal<>();
    
    public static void setUser(User user) {
        currentUser.set(user);
    }
    
    public static User getUser() {
        return currentUser.get();
    }
}

// 主线程设置用户
UserContext.setUser(new User("张三"));

// 异步任务自动继承
CompletableFuture.runAsync(() -> {
    User user = UserContext.getUser(); // 张三
    // 执行异步任务
});
```

**局限性：**

**1. 线程池问题**
```java
// 问题：线程池中线程复用，继承的值不会更新
ExecutorService executor = Executors.newFixedThreadPool(10);

inheritableThreadLocal.set("value1");
executor.submit(() -> {
    System.out.println(inheritableThreadLocal.get()); // value1
});

inheritableThreadLocal.set("value2");
executor.submit(() -> {
    // 如果复用了之前的线程，仍然是 value1
    System.out.println(inheritableThreadLocal.get()); // value1（错误）
});

// 解决方案：使用 TransmittableThreadLocal（阿里开源）
```

**2. 内存泄漏**
```java
// 子线程继承父线程的值，增加内存占用
// 需要及时清理
try {
    inheritableThreadLocal.set(value);
    // 创建子线程
} finally {
    inheritableThreadLocal.remove();
}
```

**对比总结：**

| 特性 | ThreadLocal | InheritableThreadLocal |
|------|------------|----------------------|
| 子线程继承 | 否 | 是 |
| 性能 | 较好 | 稍差（需要复制） |
| 内存占用 | 较小 | 较大 |
| 适用场景 | 线程隔离 | 父子线程传递 |

### 51. ThreadLocal 的缺点？

**答案：**

**1. 内存泄漏风险**
- Entry 的 key 是弱引用，但 value 是强引用
- ThreadLocal 被回收后，value 仍然存在
- 线程长期存活（如线程池）会导致内存泄漏

**2. 线程池场景下的问题**
- 线程复用导致数据污染
- 上一个任务的数据可能影响下一个任务

**3. 增加内存开销**
- 每个线程都有独立的副本
- 大对象会占用大量内存

**4. 不适合父子线程传递**
- 普通 ThreadLocal 无法传递给子线程
- InheritableThreadLocal 在线程池中失效

**5. 调试困难**
- 数据隐藏在线程内部
- 难以追踪数据流向

**6. 容易被滥用**
- 过度使用导致代码难以理解
- 隐式依赖增加耦合

### 52. 为什么 Netty 不使用 ThreadLocal 而是自定义了一个 FastThreadLocal？

**答案：**

Netty 的 FastThreadLocal 解决了 ThreadLocal 的性能问题。

**ThreadLocal 的性能问题：**
1. 使用线性探测法解决哈希冲突，性能较差
2. 需要清理过期 Entry，增加开销
3. 哈希计算有开销

**FastThreadLocal 的优化：**

**1. 使用数组代替哈希表**
```java
// ThreadLocal：使用哈希表
ThreadLocalMap {
    Entry[] table; // 哈希表
    // 需要计算哈希值，处理冲突
}

// FastThreadLocal：使用数组
InternalThreadLocalMap {
    Object[] indexedVariables; // 直接数组访问
    // 每个 FastThreadLocal 有固定索引
}
```

**2. 直接索引访问**
```java
// FastThreadLocal 有固定索引
public class FastThreadLocal<V> {
    private final int index; // 固定索引
    
    public final V get() {
        return get(InternalThreadLocalMap.get());
    }
    
    public final V get(InternalThreadLocalMap threadLocalMap) {
        Object v = threadLocalMap.indexedVariable(index); // 直接访问
        if (v != InternalThreadLocalMap.UNSET) {
            return (V) v;
        }
        return initialize(threadLocalMap);
    }
}
```

**3. 配合 FastThreadLocalThread 使用**
```java
// Netty 的线程类
public class FastThreadLocalThread extends Thread {
    private InternalThreadLocalMap threadLocalMap;
    
    public final InternalThreadLocalMap threadLocalMap() {
        return threadLocalMap;
    }
    
    public final void setThreadLocalMap(InternalThreadLocalMap threadLocalMap) {
        this.threadLocalMap = threadLocalMap;
    }
}
```

**性能对比：**
- ThreadLocal：O(n) 最坏情况（线性探测）
- FastThreadLocal：O(1) 直接访问

**使用示例：**
```java
// 定义 FastThreadLocal
private static final FastThreadLocal<String> context = 
    new FastThreadLocal<String>() {
        @Override
        protected String initialValue() {
            return "default";
        }
    };

// 使用
context.set("value");
String value = context.get();
context.remove();
```

### 53. 什么是 Java 的 TransmittableThreadLocal？

**答案：**

TransmittableThreadLocal（TTL）是阿里开源的 ThreadLocal 增强库，解决线程池场景下的上下文传递问题。

**问题场景：**
```java
// InheritableThreadLocal 在线程池中失效
InheritableThreadLocal<String> context = new InheritableThreadLocal<>();

context.set("value1");
executor.submit(() -> {
    System.out.println(context.get()); // value1
});

context.set("value2");
executor.submit(() -> {
    // 如果复用了之前的线程，仍然是 value1
    System.out.println(context.get()); // value1（错误）
});
```

**TTL 解决方案：**
```java
// 使用 TransmittableThreadLocal
TransmittableThreadLocal<String> context = 
    new TransmittableThreadLocal<>();

// 包装线程池
ExecutorService executor = TtlExecutors.getTtlExecutorService(
    Executors.newFixedThreadPool(10)
);

context.set("value1");
executor.submit(() -> {
    System.out.println(context.get()); // value1
});

context.set("value2");
executor.submit(() -> {
    System.out.println(context.get()); // value2（正确）
});
```

**实现原理：**
1. 在任务提交时捕获当前线程的 TTL 值
2. 在任务执行前恢复 TTL 值
3. 在任务执行后清理 TTL 值

**应用场景：**
- 分布式链路追踪
- 日志 MDC 传递
- 用户上下文传递

### 54. Java 中 Thread.sleep 和 Thread.yield 的区别？

**答案：**

| 特性 | Thread.sleep | Thread.yield |
|------|-------------|--------------|
| 作用 | 让线程休眠指定时间 | 让出 CPU 时间片 |
| 状态 | TIMED_WAITING | RUNNABLE |
| 锁 | 不释放锁 | 不释放锁 |
| 时间 | 指定休眠时间 | 立即返回 |
| 保证 | 至少休眠指定时间 | 不保证让出 |
| 异常 | InterruptedException | 无 |

**Thread.sleep：**
```java
public static void sleep(long millis) throws InterruptedException

// 使用
try {
    Thread.sleep(1000); // 休眠1秒
} catch (InterruptedException e) {
    // 处理中断
}
```

**Thread.yield：**
```java
public static native void yield();

// 使用
Thread.yield(); // 建议让出 CPU
```

**使用场景：**
- sleep：需要暂停执行一段时间
- yield：降低线程优先级，让其他线程执行

### 55. Java 中 Thread.sleep(0) 的作用是什么？

**答案：**

Thread.sleep(0) 会触发操作系统重新调度线程，但不会让线程进入休眠状态。

**作用：**
1. 让出当前时间片
2. 触发线程调度
3. 给其他线程执行机会

**与 yield 的区别：**
- sleep(0)：触发操作系统调度
- yield()：仅建议 JVM 调度

**使用场景：**
```java
// 在长时间循环中给其他线程机会
while (running) {
    // 执行任务
    doWork();
    
    // 避免独占 CPU
    Thread.sleep(0);
}
```

### 56. Java 中什么情况会导致死锁？如何避免？

**答案：**

**死锁的四个必要条件：**
1. 互斥：资源不能被共享
2. 持有并等待：持有资源的同时等待其他资源
3. 不可剥夺：资源不能被强制释放
4. 循环等待：存在资源的循环等待链

**死锁示例：**
```java
public class DeadlockDemo {
    private static Object lock1 = new Object();
    private static Object lock2 = new Object();
    
    public static void main(String[] args) {
        // 线程1：先锁 lock1，再锁 lock2
        new Thread(() -> {
            synchronized (lock1) {
                System.out.println("Thread1 获取 lock1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock2) {
                    System.out.println("Thread1 获取 lock2");
                }
            }
        }).start();
        
        // 线程2：先锁 lock2，再锁 lock1
        new Thread(() -> {
            synchronized (lock2) {
                System.out.println("Thread2 获取 lock2");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock1) {
                    System.out.println("Thread2 获取 lock1");
                }
            }
        }).start();
    }
}
```

**避免死锁的方法：**

**1. 固定加锁顺序**
```java
// 统一加锁顺序
public void transfer(Account from, Account to, int amount) {
    Account first = from.id < to.id ? from : to;
    Account second = from.id < to.id ? to : from;
    
    synchronized (first) {
        synchronized (second) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}
```

**2. 使用超时**
```java
Lock lock1 = new ReentrantLock();
Lock lock2 = new ReentrantLock();

public void method() {
    try {
        if (lock1.tryLock(1, TimeUnit.SECONDS)) {
            try {
                if (lock2.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        // 执行操作
                    } finally {
                        lock2.unlock();
                    }
                }
            } finally {
                lock1.unlock();
            }
        }
    } catch (InterruptedException e) {
        // 处理中断
    }
}
```

**3. 死锁检测**
```java
// 使用 JMX 检测死锁
ThreadMXBean tmx = ManagementFactory.getThreadMXBean();
long[] deadlockedThreads = tmx.findDeadlockedThreads();
if (deadlockedThreads != null) {
    ThreadInfo[] threadInfos = tmx.getThreadInfo(deadlockedThreads);
    // 处理死锁
}
```

### 57. Java 中 volatile 关键字的作用是什么？

**答案：**

volatile 保证变量的可见性和有序性，但不保证原子性。

**作用：**
1. 保证可见性：修改立即对其他线程可见
2. 禁止指令重排：保证有序性
3. 不保证原子性：复合操作不是原子的

**使用场景：**
```java
// 1. 状态标志
private volatile boolean running = true;

public void stop() {
    running = false;
}

// 2. 双重检查锁定
private volatile static Singleton instance;

// 3. 独立观察
private volatile long lastUpdateTime;
```

### 58. 什么是 Java 中的 ABA 问题？

**答案：**

ABA 问题是指一个值从 A 变成 B，再变回 A，CAS 操作无法检测到这个变化。

**问题示例：**
```java
AtomicInteger value = new AtomicInteger(100);

// 线程1：读取值 100
int oldValue = value.get(); // 100

// 线程2：100 -> 200 -> 100
value.compareAndSet(100, 200);
value.compareAndSet(200, 100);

// 线程1：CAS 成功，但值已经被修改过
value.compareAndSet(oldValue, 101); // 成功
```

**解决方案：**
```java
// 使用 AtomicStampedReference（版本号）
AtomicStampedReference<Integer> ref = 
    new AtomicStampedReference<>(100, 0);

int stamp = ref.getStamp();
ref.compareAndSet(100, 101, stamp, stamp + 1);
```

### 59. 在 Java 中主线程如何知晓创建的子线程是否执行成功？

**答案：**

**1. 使用 join()**
```java
Thread thread = new Thread(() -> {
    // 执行任务
});
thread.start();
thread.join(); // 等待线程结束
```

**2. 使用 Future**
```java
ExecutorService executor = Executors.newSingleThreadExecutor();
Future<String> future = executor.submit(() -> {
    return "结果";
});

try {
    String result = future.get(); // 获取结果
    System.out.println("成功: " + result);
} catch (ExecutionException e) {
    System.out.println("失败: " + e.getCause());
}
```

**3. 使用 CompletableFuture**
```java
CompletableFuture.supplyAsync(() -> {
    return "结果";
}).whenComplete((result, ex) -> {
    if (ex != null) {
        System.out.println("失败: " + ex);
    } else {
        System.out.println("成功: " + result);
    }
});
```

**4. 使用 CountDownLatch**
```java
CountDownLatch latch = new CountDownLatch(1);
AtomicBoolean success = new AtomicBoolean(false);

new Thread(() -> {
    try {
        // 执行任务
        success.set(true);
    } finally {
        latch.countDown();
    }
}).start();

latch.await();
System.out.println("成功: " + success.get());
```

### 60. 创建线程池有哪些方式？

**答案：**

**1. Executors 工厂方法**
```java
ExecutorService executor1 = Executors.newFixedThreadPool(5);
ExecutorService executor2 = Executors.newCachedThreadPool();
ExecutorService executor3 = Executors.newSingleThreadExecutor();
ScheduledExecutorService executor4 = Executors.newScheduledThreadPool(5);
```

**2. ThreadPoolExecutor 构造函数（推荐）**
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,                          // 核心线程数
    10,                         // 最大线程数
    60L,                        // 空闲线程存活时间
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100),
    Executors.defaultThreadFactory(),
    new ThreadPoolExecutor.AbortPolicy()
);
```

**3. Spring 配置**
```java
@Configuration
public class ThreadPoolConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}
```

### 61. 线程安全的集合有哪些？

**答案：**

**1. 同步集合（synchronized）**
```java
Vector<String> vector = new Vector<>();
Hashtable<String, String> hashtable = new Hashtable<>();
Stack<String> stack = new Stack<>();
```

**2. 并发集合（java.util.concurrent）**
```java
// Map
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();

// List
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

// Set
CopyOnWriteArraySet<String> set = new CopyOnWriteArraySet<>();
ConcurrentSkipListSet<String> sortedSet = new ConcurrentSkipListSet<>();

// Queue
ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
LinkedBlockingQueue<String> blockingQueue = new LinkedBlockingQueue<>();
```

**3. Collections 工具类**
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, String> syncMap = Collections.synchronizedMap(new HashMap<>());
```

### 62. Java 创建线程有哪些方式？

**答案：**

**1. 继承 Thread 类**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running");
    }
}

new MyThread().start();
```

**2. 实现 Runnable 接口**
```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable running");
    }
}

new Thread(new MyRunnable()).start();
```

**3. 实现 Callable 接口**
```java
class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "Callable result";
    }
}

FutureTask<String> task = new FutureTask<>(new MyCallable());
new Thread(task).start();
String result = task.get();
```

**4. 使用线程池**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);
executor.submit(() -> System.out.println("Task"));
executor.shutdown();
```

**5. 使用 CompletableFuture**
```java
CompletableFuture.runAsync(() -> {
    System.out.println("Async task");
});
```

**6. 使用 ForkJoinPool**
```java
ForkJoinPool pool = new ForkJoinPool();
pool.submit(() -> System.out.println("ForkJoin task"));
```

**7. 使用 Timer**
```java
Timer timer = new Timer();
timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println("Timer task");
    }
}, 1000);
```

---

##  总结

本文档涵盖了 Java 并发编程的 62 个核心面试题，包括：

- **线程基础**：线程创建、生命周期、通信机制
- **线程池**：原理、参数配置、拒绝策略
- **锁机制**：synchronized、ReentrantLock、读写锁、AQS
- **并发工具**：CountDownLatch、CyclicBarrier、Semaphore
- **并发容器**：ConcurrentHashMap、阻塞队列
- **原子类**：AtomicInteger、LongAdder、CAS
- **内存模型**：JMM、happens-before、指令重排
- **ThreadLocal**：原理、使用、最佳实践

掌握这些知识点，能够帮助你在面试中脱颖而出，在实际工作中编写高质量的并发代码。

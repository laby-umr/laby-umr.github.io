# 🏗️ Java 虚拟机面试题集

> 📊 **总题数**: 51道 | 🔍 **重点领域**: JVM 内存、垃圾回收、类加载 | 📈 **难度分布**: 中级到高级

本文档整理了 Java 虚拟机的完整51道面试题目，涵盖内存模型、垃圾回收、类加载、性能调优等各个方面。

---

## 📋 面试题目列表

### 1. Java 中有哪些垃圾回收算法？

**答案：**

Java中主要有四种垃圾回收算法，各有特点和适用场景。

**1. 标记-清除算法（Mark-Sweep）**

**原理：**
- 标记阶段：标记所有需要回收的对象
- 清除阶段：回收被标记的对象

**优点：**
- 实现简单

**缺点：**
- 产生内存碎片
- 效率不高（两次遍历）

**2. 标记-复制算法（Mark-Copy）**

**原理：**
- 将内存分为两块
- 只使用其中一块
- GC时将存活对象复制到另一块
- 清空当前块

**优点：**
- 无内存碎片
- 效率高（只遍历存活对象）

**缺点：**
- 内存利用率低（只用一半）
- 存活对象多时效率降低

**应用：**
- 新生代（Eden + Survivor）

**3. 标记-整理算法（Mark-Compact）**

**原理：**
- 标记阶段：标记存活对象
- 整理阶段：将存活对象移动到内存一端
- 清除阶段：清理边界外的内存

**优点：**
- 无内存碎片
- 内存利用率高

**缺点：**
- 需要移动对象，效率较低
- 需要暂停应用（STW）

**应用：**
- 老年代

**4. 分代收集算法（Generational Collection）**

**原理：**
- 根据对象存活周期划分区域
- 新生代：使用复制算法
- 老年代：使用标记-清除或标记-整理

**依据：**
- 弱分代假说：大部分对象朝生夕灭
- 强分代假说：熬过多次GC的对象难以消亡

**优点：**
- 结合各算法优势
- 针对性优化

### 2. JVM 的 TLAB（Thread-Local Allocation Buffer）是什么？

**答案：**

TLAB是JVM为每个线程在Eden区分配的私有缓冲区，用于提高对象分配效率。

**1. 为什么需要TLAB**

**问题：**
- 多线程并发分配对象需要同步
- 频繁加锁影响性能

**解决方案：**
- 为每个线程预分配一块内存
- 线程在自己的TLAB中分配对象
- 无需同步，提高效率

**2. TLAB工作原理**

```java
// 对象分配流程
public Object allocate(int size) {
    // 1. 尝试在TLAB中分配
    if (tlab.canAllocate(size)) {
        return tlab.allocate(size);
    }
    
    // 2. TLAB空间不足，申请新的TLAB
    if (size < TLAB_SIZE) {
        tlab = allocateNewTLAB();
        return tlab.allocate(size);
    }
    
    // 3. 对象太大，直接在Eden区分配（需要加锁）
    return allocateInEden(size);
}
```

**3. TLAB特性**

**大小：**
- 默认占Eden区的1%
- 可通过`-XX:TLABSize`设置

**生命周期：**
- 线程创建时分配
- TLAB用完后重新分配
- 线程结束时回收

**4. 相关JVM参数**

```bash
# 启用TLAB（默认开启）
-XX:+UseTLAB

# 设置TLAB大小
-XX:TLABSize=256k

# TLAB占Eden区的比例
-XX:TLABWasteTargetPercent=1

# 打印TLAB信息
-XX:+PrintTLAB
```

**5. 优势**

- **无锁分配**：避免同步开销
- **减少碎片**：连续分配
- **提高性能**：分配速度快

### 3. Java 是如何实现跨平台的？

**答案：**

Java通过"一次编译，到处运行"的机制实现跨平台。

**1. 核心机制**

**编译过程：**
```
Java源代码(.java) -> 编译器(javac) -> 字节码(.class)
```

**执行过程：**
```
字节码(.class) -> JVM -> 机器码 -> 操作系统
```

**2. 关键组件**

**字节码（Bytecode）：**
- 平台无关的中间代码
- JVM规范定义的指令集
- 所有平台的JVM都能识别

**Java虚拟机（JVM）：**
- 平台相关的虚拟机实现
- 负责将字节码翻译成机器码
- 不同平台有不同的JVM实现

**3. 实现原理**

```java
// 示例代码
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}

// 编译后的字节码（部分）
public static void main(java.lang.String[]);
    Code:
       0: getstatic     #2  // Field java/lang/System.out
       3: ldc           #3  // String Hello World
       5: invokevirtual #4  // Method java/io/PrintStream.println
       8: return
```

**4. 跨平台架构**

```
┌─────────────────────────────────────┐
│         Java Application            │
├─────────────────────────────────────┤
│         Java API (rt.jar)           │
├─────────────────────────────────────┤
│              JVM                    │
├──────────┬──────────┬───────────────┤
│ Windows  │  Linux   │    macOS      │
└──────────┴──────────┴───────────────┘
```

**5. 平台差异处理**

**JNI（Java Native Interface）：**
```java
// 调用本地方法
public class NativeDemo {
    // 声明本地方法
    public native void nativeMethod();
    
    static {
        // 加载平台相关的动态库
        System.loadLibrary("native");
    }
}
```

**6. 优缺点**

**优点：**
- 一次编译，到处运行
- 降低开发成本
- 便于维护

**缺点：**
- 性能略低于原生代码
- 依赖JVM环境
- 启动速度较慢

### 4. JVM 由哪些部分组成？

**答案：**

JVM主要由类加载子系统、运行时数据区、执行引擎和本地接口四部分组成。

**1. 整体架构**

```
┌─────────────────────────────────────────┐
│          Class Loader Subsystem         │
├─────────────────────────────────────────┤
│         Runtime Data Areas              │
│  ┌──────────┬──────────┬──────────┐    │
│  │  Method  │   Heap   │  Stacks  │    │
│  │   Area   │          │          │    │
│  └──────────┴──────────┴──────────┘    │
├─────────────────────────────────────────┤
│          Execution Engine               │
│  ┌──────────┬──────────┬──────────┐    │
│  │Interpreter│   JIT    │    GC    │    │
│  └──────────┴──────────┴──────────┘    │
├─────────────────────────────────────────┤
│        Native Method Interface          │
└─────────────────────────────────────────┘
```

**2. 类加载子系统（Class Loader Subsystem）**

**功能：**
- 加载.class文件
- 链接（验证、准备、解析）
- 初始化

**组成：**
- Bootstrap ClassLoader（启动类加载器）
- Extension ClassLoader（扩展类加载器）
- Application ClassLoader（应用类加载器）

**3. 运行时数据区（Runtime Data Areas）**

**线程共享区域：**

**方法区（Method Area）：**
- 存储类信息、常量、静态变量
- JDK 8后改为元空间（Metaspace）

**堆（Heap）：**
- 存储对象实例
- 垃圾回收的主要区域
- 分为新生代和老年代

**线程私有区域：**

**程序计数器（PC Register）：**
- 记录当前线程执行的字节码行号
- 线程切换后能恢复到正确位置

**虚拟机栈（VM Stack）：**
- 存储局部变量、操作数栈、方法出口
- 每个方法对应一个栈帧

**本地方法栈（Native Method Stack）：**
- 为本地方法服务
- 类似虚拟机栈

**4. 执行引擎（Execution Engine）**

**解释器（Interpreter）：**
- 逐行解释执行字节码
- 启动快，执行慢

**即时编译器（JIT Compiler）：**
- 将热点代码编译成机器码
- 启动慢，执行快
- C1编译器（Client）和C2编译器（Server）

**垃圾回收器（Garbage Collector）：**
- 自动回收不再使用的对象
- 多种GC算法和收集器

**5. 本地接口（Native Interface）**

**JNI（Java Native Interface）：**
- 调用本地方法
- 与操作系统交互

**本地方法库（Native Method Libraries）：**
- C/C++编写的库
- 提供底层功能

**6. 内存分布示例**

```java
public class MemoryDemo {
    // 类信息存储在方法区
    private static int staticVar = 100;  // 静态变量在方法区
    
    public void method() {
        int localVar = 10;           // 局部变量在栈
        Object obj = new Object();   // 对象在堆，引用在栈
        
        // 字符串常量在字符串常量池（堆中）
        String str = "Hello";
    }
}
```

### 5. 编译执行与解释执行的区别是什么？JVM 使用哪种方式？

**答案：**

JVM采用**混合模式**，结合解释执行和编译执行的优势。

**1. 解释执行（Interpretation）**

**特点：**
- 逐行翻译字节码为机器码
- 边解释边执行
- 不生成目标代码

**优点：**
- 启动快
- 内存占用少
- 跨平台性好

**缺点：**
- 执行速度慢
- 重复代码重复解释

**2. 编译执行（Compilation）**

**特点：**
- 一次性将代码编译成机器码
- 生成可执行文件
- 直接执行机器码

**优点：**
- 执行速度快
- 优化充分

**缺点：**
- 启动慢
- 内存占用大
- 平台相关

**3. JVM的混合模式**

**分层编译（Tiered Compilation）：**

```
Level 0: 解释执行
    ↓
Level 1: C1编译（简单优化）
    ↓
Level 2: C1编译（带profiling）
    ↓
Level 3: C1编译（完全优化）
    ↓
Level 4: C2编译（激进优化）
```

**工作流程：**
```java
// 1. 程序启动，解释执行
public void method() {
    // 解释器执行
}

// 2. 方法被频繁调用，触发JIT编译
// 调用次数达到阈值（默认10000次）
if (invocationCount > CompileThreshold) {
    // C1编译器编译（快速编译）
    compileWithC1();
}

// 3. 继续频繁调用，触发C2编译
if (invocationCount > TierThreshold) {
    // C2编译器编译（深度优化）
    compileWithC2();
}
```

**4. 热点代码检测**

**方法调用计数器：**
- 统计方法调用次数
- 达到阈值触发编译

**回边计数器：**
- 统计循环执行次数
- 检测循环热点

**5. JVM参数配置**

```bash
# 只使用解释器
-Xint

# 只使用编译器（需要预热）
-Xcomp

# 混合模式（默认）
-Xmixed

# 设置编译阈值
-XX:CompileThreshold=10000

# 启用分层编译（默认开启）
-XX:+TieredCompilation

# 打印编译信息
-XX:+PrintCompilation
```

**6. 性能对比**

| 特性 | 解释执行 | 编译执行 | 混合模式 |
|------|---------|---------|---------|
| 启动速度 | 快 | 慢 | 中等 |
| 执行速度 | 慢 | 快 | 快 |
| 内存占用 | 小 | 大 | 中等 |
| 优化程度 | 无 | 高 | 高 |
| 适用场景 | 短期运行 | 长期运行 | 通用 |

**7. 实际应用**

```java
// 示例：热点代码
public class HotSpotDemo {
    public static void main(String[] args) {
        // 初始阶段：解释执行
        for (int i = 0; i < 15000; i++) {
            compute(i);  // 前10000次解释执行
                        // 后5000次编译执行
        }
    }
    
    // 热点方法
    public static int compute(int n) {
        return n * n + n;
    }
}
```

**总结：**
JVM使用混合模式，初期解释执行保证快速启动，运行中将热点代码编译优化，兼顾启动速度和执行效率。

### 6. JVM 方法区是否会出现内存溢出?

**答案：**

**会出现内存溢出**，方法区（JDK 8后为元空间）也会发生OOM。

**1. 方法区存储内容**

- 类的元数据信息
- 常量池
- 静态变量
- JIT编译后的代码

**2. 内存溢出场景**

**场景1：加载大量类**
```java
// 动态生成大量类导致OOM
public class MethodAreaOOM {
    public static void main(String[] args) {
        while (true) {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(Object.class);
            enhancer.setUseCache(false);
            enhancer.setCallback(new MethodInterceptor() {
                public Object intercept(Object obj, Method method, 
                                       Object[] args, MethodProxy proxy) {
                    return proxy.invokeSuper(obj, args);
                }
            });
            enhancer.create();  // 动态生成类
        }
    }
}
// 错误：java.lang.OutOfMemoryError: Metaspace
```

**场景2：大量使用反射**
```java
// 反射生成类
ClassPool pool = ClassPool.getDefault();
for (int i = 0; i < 100000; i++) {
    CtClass cc = pool.makeClass("com.example.Class" + i);
    cc.toClass();  // 加载到方法区
}
```

**场景3：JSP页面过多**
- 每个JSP编译成一个类
- 大量JSP导致方法区溢出

**3. JDK版本差异**

**JDK 7及之前（永久代）：**
```bash
# 设置永久代大小
-XX:PermSize=64m
-XX:MaxPermSize=256m

# 错误信息
java.lang.OutOfMemoryError: PermGen space
```

**JDK 8及之后（元空间）：**
```bash
# 设置元空间大小
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=512m

# 错误信息
java.lang.OutOfMemoryError: Metaspace
```

**4. 元空间优势**

- 使用本地内存，不受堆大小限制
- 自动扩展，默认无上限
- 减少Full GC频率

**5. 预防措施**

```bash
# 合理设置元空间大小
-XX:MetaspaceSize=256m
-XX:MaxMetaspaceSize=512m

# 监控元空间使用
-XX:+TraceClassLoading
-XX:+TraceClassUnloading
```

### 7. Java 中堆和栈的区别是什么？

**答案：**

堆和栈是JVM内存中两个重要的区域，用途和特性完全不同。

**1. 核心区别对比**

| 特性 | 堆（Heap） | 栈（Stack） |
|------|-----------|------------|
| 作用域 | 线程共享 | 线程私有 |
| 存储内容 | 对象实例、数组 | 局部变量、方法调用 |
| 生命周期 | 对象创建到GC回收 | 方法调用到返回 |
| 大小 | 较大（GB级） | 较小（MB级） |
| 分配方式 | 动态分配 | 连续分配 |
| 回收方式 | GC自动回收 | 自动弹出 |
| 异常 | OutOfMemoryError | StackOverflowError |
| 速度 | 较慢 | 很快 |

**2. 内存结构**

**堆结构：**
```
Heap
├── Young Generation (新生代)
│   ├── Eden (伊甸区)
│   ├── Survivor 0 (S0)
│   └── Survivor 1 (S1)
└── Old Generation (老年代)
```

**栈结构：**
```
Stack
├── Stack Frame 1 (栈帧1)
│   ├── 局部变量表
│   ├── 操作数栈
│   ├── 动态链接
│   └── 返回地址
├── Stack Frame 2 (栈帧2)
└── ...
```

**3. 代码示例**

```java
public class HeapStackDemo {
    // 静态变量在方法区
    private static int staticVar = 100;
    
    // 实例变量在堆
    private int instanceVar = 200;
    
    public void method(int param) {
        // param在栈（局部变量表）
        int localVar = 10;  // 栈
        
        // obj引用在栈，对象在堆
        Object obj = new Object();
        
        // 数组引用在栈，数组对象在堆
        int[] arr = new int[10];
        
        // 字符串常量池在堆
        String str = "Hello";
    }
}
```

**4. 内存分配示例**

```java
public void test() {
    // 1. 基本类型在栈
    int a = 10;
    double b = 3.14;
    
    // 2. 对象引用在栈，对象在堆
    Person p = new Person();
    
    // 3. 数组在堆
    int[] arr = new int[100];
    
    // 4. 包装类对象在堆
    Integer i = new Integer(10);
}
```

**5. 异常情况**

**堆溢出（OutOfMemoryError）：**
```java
// 不断创建对象
List<byte[]> list = new ArrayList<>();
while (true) {
    list.add(new byte[1024 * 1024]);  // 1MB
}
// java.lang.OutOfMemoryError: Java heap space
```

**栈溢出（StackOverflowError）：**
```java
// 无限递归
public void recursion() {
    recursion();
}
// java.lang.StackOverflowError
```

**6. JVM参数配置**

```bash
# 堆配置
-Xms2g          # 初始堆大小
-Xmx4g          # 最大堆大小
-Xmn1g          # 新生代大小

# 栈配置
-Xss1m          # 每个线程栈大小
```

### 8. 什么是 Java 中的直接内存（堆外内存）？

**答案：**

直接内存是JVM堆外的内存，不受JVM堆大小限制，主要用于NIO操作。

**1. 什么是直接内存**

**定义：**
- 操作系统的本地内存
- 不在JVM堆中
- 通过`DirectByteBuffer`访问

**2. 使用场景**

**NIO操作：**
```java
// 分配直接内存
ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);

// 传统堆内存
ByteBuffer heapBuffer = ByteBuffer.allocate(1024);
```

**文件IO：**
```java
// 使用直接内存进行文件读写
FileChannel channel = new RandomAccessFile("file.txt", "rw").getChannel();
ByteBuffer buffer = ByteBuffer.allocateDirect(1024);

// 读取
channel.read(buffer);

// 写入
buffer.flip();
channel.write(buffer);
```

**3. 直接内存优势**

**零拷贝：**
```
传统IO：
磁盘 -> 内核缓冲区 -> JVM堆 -> 内核缓冲区 -> Socket
(4次拷贝)

直接内存：
磁盘 -> 内核缓冲区 -> 直接内存 -> Socket
(2次拷贝)
```

**减少GC压力：**
- 不在堆中，不参与GC
- 适合大数据量操作

**4. 直接内存管理**

**分配：**
```java
public class DirectMemoryDemo {
    public static void main(String[] args) {
        // 分配100MB直接内存
        ByteBuffer buffer = ByteBuffer.allocateDirect(100 * 1024 * 1024);
        
        // 使用
        buffer.putInt(100);
        
        // 释放（通过GC间接释放）
        buffer = null;
        System.gc();
    }
}
```

**手动释放：**
```java
// 使用Unsafe释放
public static void freeDirectBuffer(ByteBuffer buffer) {
    if (buffer instanceof DirectBuffer) {
        ((DirectBuffer) buffer).cleaner().clean();
    }
}
```

**5. 内存溢出**

```java
// 直接内存溢出
List<ByteBuffer> list = new ArrayList<>();
while (true) {
    ByteBuffer buffer = ByteBuffer.allocateDirect(1024 * 1024);
    list.add(buffer);
}
// java.lang.OutOfMemoryError: Direct buffer memory
```

**6. JVM参数配置**

```bash
# 设置直接内存最大值
-XX:MaxDirectMemorySize=512m

# 不设置则默认等于-Xmx
```

**7. 监控直接内存**

```java
// 获取直接内存使用情况
import sun.misc.SharedSecrets;

long maxDirectMemory = sun.misc.VM.maxDirectMemory();
long usedDirectMemory = SharedSecrets.getJavaNioAccess()
    .getDirectBufferPool().getMemoryUsed();

System.out.println("最大直接内存: " + maxDirectMemory);
System.out.println("已用直接内存: " + usedDirectMemory);
```

**8. 使用建议**

**适用场景：**
- 大文件IO
- 网络通信
- 频繁IO操作

**注意事项：**
- 分配和释放成本高
- 不受GC管理，需手动释放
- 可能导致内存泄漏

### 9. 什么是 Java 中的常量池？

**答案：**

Java中有三种常量池：Class文件常量池、运行时常量池和字符串常量池。

**1. Class文件常量池**

**位置：**
- .class文件中
- 编译期生成

**内容：**
- 字面量（字符串、final常量）
- 符号引用（类、方法、字段）

**查看：**
```bash
# 查看class文件常量池
javap -v ClassName.class
```

**2. 运行时常量池**

**位置：**
- JDK 7之前：方法区（永久代）
- JDK 7及之后：堆中

**特点：**
- 类加载时从Class文件常量池加载
- 动态性（可运行期添加）

**3. 字符串常量池**

**位置：**
- JDK 7之前：永久代
- JDK 7及之后：堆中

**作用：**
- 避免重复创建字符串
- 节省内存

**4. 字符串常量池详解**

**示例1：字面量**
```java
String s1 = "hello";  // 在常量池创建
String s2 = "hello";  // 直接引用常量池
System.out.println(s1 == s2);  // true
```

**示例2：new String()**
```java
String s1 = new String("hello");  // 堆中创建对象
String s2 = "hello";              // 常量池
System.out.println(s1 == s2);     // false

String s3 = s1.intern();          // 返回常量池引用
System.out.println(s2 == s3);     // true
```

**示例3：字符串拼接**
```java
// 编译期确定，放入常量池
String s1 = "hello" + "world";
String s2 = "helloworld";
System.out.println(s1 == s2);  // true

// 运行期确定，在堆中创建
String s3 = "hello";
String s4 = s3 + "world";
String s5 = "helloworld";
System.out.println(s4 == s5);  // false
```

**5. intern()方法**

**JDK 6：**
```java
String s1 = new String("hello");
String s2 = s1.intern();
String s3 = "hello";
System.out.println(s2 == s3);  // true
// intern()将字符串复制到永久代常量池
```

**JDK 7+：**
```java
String s1 = new String("he") + new String("llo");
String s2 = s1.intern();
String s3 = "hello";
System.out.println(s1 == s3);  // true
// intern()将堆中字符串引用放入常量池
```

**6. 常量池大小配置**

```bash
# JDK 6/7 设置字符串常量池大小
-XX:StringTableSize=1000003

# JDK 8+ 默认60013
-XX:StringTableSize=1000003
```

**7. 实际应用**

**优化内存：**
```java
// 大量重复字符串
List<String> list = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    // 使用intern()减少内存占用
    String s = new String("重复字符串").intern();
    list.add(s);
}
```

**注意事项：**
- intern()有性能开销
- 常量池大小有限
- 避免intern()大量不同字符串

### 10. 你了解 Java 的类加载器吗？

**答案：**

类加载器负责将.class文件加载到JVM中，Java采用双亲委派模型。

**1. 类加载器层次**

```
Bootstrap ClassLoader (启动类加载器)
        ↑
Extension ClassLoader (扩展类加载器)
        ↑
Application ClassLoader (应用类加载器)
        ↑
Custom ClassLoader (自定义类加载器)
```

**2. 三种类加载器**

**Bootstrap ClassLoader：**
- C++实现
- 加载核心类库（rt.jar）
- 路径：`$JAVA_HOME/jre/lib`

**Extension ClassLoader：**
- Java实现
- 加载扩展类库
- 路径：`$JAVA_HOME/jre/lib/ext`

**Application ClassLoader：**
- Java实现
- 加载应用类路径（classpath）
- 默认的类加载器

**3. 双亲委派模型**

**工作流程：**
```java
public Class<?> loadClass(String name) {
    // 1. 检查类是否已加载
    Class<?> c = findLoadedClass(name);
    if (c == null) {
        try {
            // 2. 委派给父加载器
            if (parent != null) {
                c = parent.loadClass(name);
            } else {
                // 3. 父加载器为null，委派给Bootstrap
                c = findBootstrapClassOrNull(name);
            }
        } catch (ClassNotFoundException e) {
            // 父加载器无法加载
        }
        
        if (c == null) {
            // 4. 父加载器无法加载，自己加载
            c = findClass(name);
        }
    }
    return c;
}
```

**4. 双亲委派优势**

**避免重复加载：**
- 父加载器已加载，子加载器不再加载

**安全性：**
```java
// 自定义java.lang.String会被拒绝
// 因为Bootstrap已加载核心String类
public class String {
    // 这个类不会被加载
}
```

**5. 自定义类加载器**

```java
public class MyClassLoader extends ClassLoader {
    
    private String classPath;
    
    public MyClassLoader(String classPath) {
        this.classPath = classPath;
    }
    
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        try {
            // 读取class文件
            byte[] classData = loadClassData(name);
            if (classData == null) {
                throw new ClassNotFoundException();
            }
            // 转换为Class对象
            return defineClass(name, classData, 0, classData.length);
        } catch (IOException e) {
            throw new ClassNotFoundException();
        }
    }
    
    private byte[] loadClassData(String className) throws IOException {
        String fileName = classPath + File.separatorChar +
                         className.replace('.', File.separatorChar) + ".class";
        
        try (InputStream is = new FileInputStream(fileName);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
            return baos.toByteArray();
        }
    }
}

// 使用
MyClassLoader loader = new MyClassLoader("/custom/path");
Class<?> clazz = loader.loadClass("com.example.MyClass");
Object obj = clazz.newInstance();
```

**6. 破坏双亲委派**

**场景1：JDBC驱动加载**
```java
// 使用线程上下文类加载器
Thread.currentThread().setContextClassLoader(customLoader);
```

**场景2：OSGi模块化**
- 每个模块独立类加载器
- 平级委派，不遵循双亲委派

**场景3：热部署**
```java
// 重新加载类
public void reload(String className) {
    // 创建新的类加载器
    MyClassLoader newLoader = new MyClassLoader(classPath);
    Class<?> clazz = newLoader.loadClass(className);
    // 使用新类
}
```

**7. 类加载过程**

```
加载 -> 验证 -> 准备 -> 解析 -> 初始化
```

**加载：**
- 读取.class文件
- 生成Class对象

**验证：**
- 文件格式验证
- 元数据验证
- 字节码验证

**准备：**
- 分配内存
- 设置默认值

**解析：**
- 符号引用转为直接引用

**初始化：**
- 执行静态代码块
- 初始化静态变量

### 11. 什么是 Java 中的 JIT（Just-In-Time）?

**答案：**

JIT即时编译器是JVM的核心组件，在运行时将热点字节码编译成本地机器码。

**1. JIT编译器类型**

**C1编译器（Client Compiler）：**
- 快速编译
- 简单优化
- 适合客户端应用

**C2编译器（Server Compiler）：**
- 深度优化
- 编译时间长
- 适合服务端应用

**2. 工作原理**

```java
// 执行流程
public void hotMethod() {
    // 初始：解释执行
    // 调用次数++
    
    // 达到阈值（默认10000次）
    if (invocationCount >= CompileThreshold) {
        // 触发JIT编译
        compileToNativeCode();
    }
    
    // 编译后：直接执行机器码
}
```

**3. 热点检测**

**方法调用计数器：**
```java
// 统计方法调用次数
int invocationCount = 0;

public void method() {
    invocationCount++;
    if (invocationCount > threshold) {
        // 触发编译
    }
}
```

**回边计数器：**
```java
// 统计循环次数
for (int i = 0; i < 100000; i++) {
    // 循环体
    // 回边计数++
}
// 循环热点也会触发编译
```

**4. 分层编译**

```
Level 0: 解释执行
    ↓
Level 1: C1编译（无profiling）
    ↓
Level 2: C1编译（有profiling）
    ↓
Level 3: C1编译（完全优化）
    ↓
Level 4: C2编译（激进优化）
```

**5. JIT优化技术**

**方法内联：**
```java
// 优化前
public int add(int a, int b) {
    return a + b;
}

public void test() {
    int result = add(1, 2);
}

// 优化后（内联）
public void test() {
    int result = 1 + 2;  // 直接内联
}
```

**逃逸分析：**
```java
// 对象未逃逸，可在栈上分配
public void method() {
    Point p = new Point(1, 2);
    int x = p.getX();  // 对象不会逃逸出方法
}
```

**循环展开：**
```java
// 优化前
for (int i = 0; i < 4; i++) {
    sum += arr[i];
}

// 优化后
sum += arr[0];
sum += arr[1];
sum += arr[2];
sum += arr[3];
```

**6. JVM参数**

```bash
# 设置编译阈值
-XX:CompileThreshold=10000

# 禁用JIT
-Xint

# 只用编译模式
-Xcomp

# 打印编译信息
-XX:+PrintCompilation

# 打印内联信息
-XX:+PrintInlining
```

**7. 性能提升**

```java
// 测试JIT效果
public class JITTest {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        
        for (int i = 0; i < 100000; i++) {
            compute();  // 前10000次慢，后续快
        }
        
        long end = System.currentTimeMillis();
        System.out.println("耗时: " + (end - start) + "ms");
    }
    
    static int compute() {
        int sum = 0;
        for (int i = 0; i < 1000; i++) {
            sum += i;
        }
        return sum;
    }
}
```

### 12. JIT 编译后的代码存在哪？

**答案：**

JIT编译后的本地代码存储在**CodeCache**（代码缓存区）中。

**1. CodeCache位置**

- 属于非堆内存
- 独立于Java堆
- 使用本地内存

**2. CodeCache结构**

```
CodeCache
├── Non-nmethods (非方法代码)
│   └── JVM内部代码
├── Profiled nmethods (带profiling的代码)
│   └── C1编译的代码
└── Non-profiled nmethods (不带profiling的代码)
    └── C2编译的代码
```

**3. CodeCache大小配置**

```bash
# 设置CodeCache大小
-XX:ReservedCodeCacheSize=256m

# 初始大小
-XX:InitialCodeCacheSize=128m

# 打印CodeCache使用情况
-XX:+PrintCodeCache
```

**4. 查看CodeCache使用**

```java
// 运行时查看
import sun.management.ManagementFactoryHelper;

MemoryPoolMXBean codeCache = ManagementFactoryHelper
    .getMemoryPools()
    .stream()
    .filter(pool -> pool.getName().contains("Code Cache"))
    .findFirst()
    .orElse(null);

if (codeCache != null) {
    MemoryUsage usage = codeCache.getUsage();
    System.out.println("CodeCache已用: " + usage.getUsed() / 1024 / 1024 + "MB");
    System.out.println("CodeCache最大: " + usage.getMax() / 1024 / 1024 + "MB");
}
```

**5. CodeCache满的影响**

```java
// CodeCache满时的警告
Java HotSpot(TM) 64-Bit Server VM warning: 
CodeCache is full. Compiler has been disabled.

// 后果：
// 1. JIT编译停止
// 2. 只能解释执行
// 3. 性能严重下降
```

**6. 代码淘汰机制**

```java
// 不常用的编译代码会被淘汰
// 释放CodeCache空间
// 需要时重新编译
```

**7. 监控CodeCache**

```bash
# 使用jconsole查看
# Memory -> Code Cache

# 使用jstat
jstat -compiler <pid>

# 输出编译统计
Compiled  Failed  Invalid  Time    FailedType  FailedMethod
1234      0       0        12.34   0
```

### 13. 什么是 Java 的 AOT（Ahead-Of-Time）？

**答案：**

AOT是提前编译技术，在程序运行前将字节码编译成本地机器码。

**1. AOT vs JIT**

| 特性 | AOT | JIT |
|------|-----|-----|
| 编译时机 | 运行前 | 运行时 |
| 启动速度 | 快 | 慢 |
| 峰值性能 | 中等 | 高 |
| 内存占用 | 小 | 大 |
| 优化程度 | 静态优化 | 动态优化 |

**2. Java AOT实现**

**JDK 9引入：**
```bash
# 使用jaotc编译
jaotc --output libHelloWorld.so HelloWorld.class

# 运行时加载
java -XX:AOTLibrary=./libHelloWorld.so HelloWorld
```

**GraalVM Native Image：**
```bash
# 编译成原生可执行文件
native-image -jar application.jar

# 生成可执行文件
./application
```

**3. AOT优势**

**快速启动：**
```java
// JIT启动时间：2-3秒
// AOT启动时间：0.1秒
```

**低内存占用：**
- 无需JIT编译器
- 无需CodeCache
- 适合容器环境

**4. AOT劣势**

**性能上限：**
- 缺少运行时信息
- 无法做激进优化
- 峰值性能低于JIT

**文件体积：**
- 包含所有依赖
- 可执行文件较大

**5. 使用场景**

**适合AOT：**
- 微服务
- Serverless
- 容器应用
- 命令行工具

**适合JIT：**
- 长期运行的服务
- 需要峰值性能
- 复杂业务逻辑

**6. GraalVM示例**

```bash
# 安装GraalVM
sdk install java 21.0.0.r11-grl

# 编译Spring Boot应用
./mvnw package -Pnative

# 生成原生镜像
native-image -jar target/app.jar

# 运行
./app
# 启动时间：小于100ms
# 内存占用：小于50MB
```

**7. 配置参数**

```bash
# 启用AOT
-XX:+UseAOT

# 指定AOT库
-XX:AOTLibrary=./lib.so

# 打印AOT信息
-XX:+PrintAOT
```

### 14. 你了解 Java 的逃逸分析吗？

**答案：**

逃逸分析是JVM的一种优化技术，分析对象的作用域，进行栈上分配、标量替换等优化。

**1. 什么是逃逸**

**对象逃逸：**
- 对象在方法外被引用
- 对象被外部访问

**未逃逸：**
- 对象只在方法内使用
- 不会被外部访问

**2. 逃逸类型**

**方法逃逸：**
```java
// 对象逃逸出方法
public User createUser() {
    User user = new User();
    return user;  // 逃逸
}
```

**线程逃逸：**
```java
// 对象被其他线程访问
private User user;

public void method() {
    this.user = new User();  // 线程逃逸
}
```

**未逃逸：**
```java
// 对象不逃逸
public void method() {
    User user = new User();
    user.setName("Tom");
    System.out.println(user.getName());
    // user不会逃逸出方法
}
```

**3. 逃逸分析优化**

**栈上分配：**
```java
// 优化前：对象在堆上分配
public void method() {
    Point p = new Point(1, 2);  // 堆分配
    int x = p.getX();
}

// 优化后：对象在栈上分配
public void method() {
    // 栈上分配，方法结束自动回收
    // 无需GC
}
```

**标量替换：**
```java
// 优化前
public void method() {
    Point p = new Point(1, 2);
    int sum = p.x + p.y;
}

// 优化后：对象被拆解为标量
public void method() {
    int x = 1;
    int y = 2;
    int sum = x + y;  // 直接使用标量
}
```

**锁消除：**
```java
// 优化前
public void method() {
    StringBuffer sb = new StringBuffer();
    sb.append("a");  // 内部有synchronized
    sb.append("b");
}

// 优化后：sb未逃逸，消除锁
public void method() {
    StringBuffer sb = new StringBuffer();
    sb.append("a");  // 去除synchronized
    sb.append("b");
}
```

**4. 性能对比**

```java
public class EscapeAnalysisTest {
    
    // 未逃逸：栈上分配
    public void noEscape() {
        Point p = new Point(1, 2);
        int sum = p.x + p.y;
    }
    
    // 逃逸：堆上分配
    public Point escape() {
        Point p = new Point(1, 2);
        return p;
    }
    
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        
        for (int i = 0; i < 10000000; i++) {
            noEscape();  // 快，无GC压力
        }
        
        long end = System.currentTimeMillis();
        System.out.println("耗时: " + (end - start) + "ms");
    }
}
```

**5. JVM参数**

```bash
# 启用逃逸分析（默认开启）
-XX:+DoEscapeAnalysis

# 启用标量替换
-XX:+EliminateAllocations

# 启用锁消除
-XX:+EliminateLocks

# 打印逃逸分析结果
-XX:+PrintEscapeAnalysis
```

**6. 实际应用**

```java
// 优化建议：尽量让对象不逃逸
public class Service {
    
    // 好：对象不逃逸
    public void process() {
        Data data = new Data();
        data.calculate();
        // data不逃逸，可栈上分配
    }
    
    // 差：对象逃逸
    private Data data;
    public void process2() {
        this.data = new Data();  // 逃逸
    }
}
```

### 15. Java 中的强引用、软引用、弱引用和虚引用分别是什么？

**答案：**

Java提供四种引用类型，用于不同的内存管理场景。

**1. 强引用（Strong Reference）**

**定义：**
- 最常见的引用
- 只要强引用存在，对象不会被回收

**示例：**
```java
// 强引用
Object obj = new Object();

// 只要obj存在，对象不会被GC
// 即使内存不足也不会回收
// 除非obj = null
```

**特点：**
- 宁可OOM也不回收
- 最常用的引用类型

**2. 软引用（Soft Reference）**

**定义：**
- 内存不足时才回收
- 适合缓存场景

**示例：**
```java
// 创建软引用
SoftReference<byte[]> softRef = new SoftReference<>(new byte[1024 * 1024]);

// 获取对象
byte[] data = softRef.get();
if (data != null) {
    // 对象还在
} else {
    // 对象已被回收
}
```

**应用场景：**
```java
// 图片缓存
public class ImageCache {
    private Map<String, SoftReference<Image>> cache = new HashMap<>();
    
    public Image getImage(String path) {
        SoftReference<Image> ref = cache.get(path);
        
        if (ref != null) {
            Image img = ref.get();
            if (img != null) {
                return img;  // 缓存命中
            }
        }
        
        // 缓存未命中，加载图片
        Image img = loadImage(path);
        cache.put(path, new SoftReference<>(img));
        return img;
    }
}
```

**3. 弱引用（Weak Reference）**

**定义：**
- GC时必定回收
- 生命周期更短

**示例：**
```java
// 创建弱引用
WeakReference<Object> weakRef = new WeakReference<>(new Object());

// 获取对象
Object obj = weakRef.get();
if (obj != null) {
    // 对象还在
}

// GC后
System.gc();
obj = weakRef.get();  // null
```

**应用场景：**
```java
// ThreadLocal实现
public class ThreadLocal<T> {
    static class Entry extends WeakReference<ThreadLocal<?>> {
        Object value;
        
        Entry(ThreadLocal<?> k, Object v) {
            super(k);  // key是弱引用
            value = v;
        }
    }
}

// WeakHashMap
WeakHashMap<Key, Value> map = new WeakHashMap<>();
Key key = new Key();
map.put(key, value);

key = null;  // 去除强引用
System.gc();  // GC后，map中的entry被自动移除
```

**4. 虚引用（Phantom Reference）**

**定义：**
- 最弱的引用
- 无法通过get()获取对象
- 用于跟踪对象回收

**示例：**
```java
// 创建虚引用（必须配合引用队列）
ReferenceQueue<Object> queue = new ReferenceQueue<>();
PhantomReference<Object> phantomRef = new PhantomReference<>(
    new Object(), queue
);

// get()永远返回null
Object obj = phantomRef.get();  // null

// 对象被回收时，虚引用会进入队列
Reference<?> ref = queue.poll();
if (ref != null) {
    // 对象已被回收，执行清理工作
}
```

**应用场景：**
```java
// 监控对象回收
public class ResourceMonitor {
    private ReferenceQueue<Resource> queue = new ReferenceQueue<>();
    
    public void monitor(Resource resource) {
        PhantomReference<Resource> ref = 
            new PhantomReference<>(resource, queue);
        
        // 启动线程监控
        new Thread(() -> {
            try {
                Reference<?> r = queue.remove();  // 阻塞等待
                System.out.println("资源已被回收");
                // 执行清理工作
                cleanup();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

**5. 引用对比**

| 引用类型 | 回收时机 | 用途 | get()返回 |
|---------|---------|------|----------|
| 强引用 | 永不回收 | 普通对象 | 对象 |
| 软引用 | 内存不足 | 缓存 | 对象或null |
| 弱引用 | GC时 | 缓存、防止内存泄漏 | 对象或null |
| 虚引用 | GC时 | 跟踪回收 | 永远null |

**6. 引用队列**

```java
// 配合引用队列使用
ReferenceQueue<Object> queue = new ReferenceQueue<>();

SoftReference<Object> softRef = new SoftReference<>(new Object(), queue);
WeakReference<Object> weakRef = new WeakReference<>(new Object(), queue);

// 对象被回收后，引用会进入队列
System.gc();

Reference<?> ref = queue.poll();
if (ref != null) {
    // 执行清理工作
    System.out.println("对象已被回收");
}
```

**7. 实际应用建议**

```java
// 1. 普通对象：使用强引用
Object obj = new Object();

// 2. 缓存：使用软引用
SoftReference<Cache> cache = new SoftReference<>(new Cache());

// 3. 防止内存泄漏：使用弱引用
WeakHashMap<Key, Value> map = new WeakHashMap<>();

// 4. 监控回收：使用虚引用
PhantomReference<Resource> ref = new PhantomReference<>(resource, queue);
```

### 16. Java 中常见的垃圾收集器有哪些？

**答案：**

Java提供多种垃圾收集器，适用于不同场景。

**1. Serial收集器**

**特点：**
- 单线程收集
- 简单高效
- 适合单核CPU

**使用场景：**
- 客户端应用
- 小内存环境

**参数：**
```bash
# 新生代使用Serial
-XX:+UseSerialGC
```

**2. ParNew收集器**

**特点：**
- Serial的多线程版本
- 新生代收集器
- 配合CMS使用

**参数：**
```bash
-XX:+UseParNewGC
```

**3. Parallel Scavenge收集器**

**特点：**
- 关注吞吐量
- 自适应调节
- 适合后台计算

**参数：**
```bash
-XX:+UseParallelGC
# 设置吞吐量目标
-XX:GCTimeRatio=99
# 最大暂停时间
-XX:MaxGCPauseMillis=100
```

**4. CMS收集器（Concurrent Mark Sweep）**

**特点：**
- 并发收集
- 低停顿
- 适合响应时间敏感应用

**阶段：**
```
1. 初始标记（STW）
2. 并发标记
3. 重新标记（STW）
4. 并发清除
```

**参数：**
```bash
-XX:+UseConcMarkSweepGC
# 触发GC的堆使用率
-XX:CMSInitiatingOccupancyFraction=70
```

**缺点：**
- 产生内存碎片
- 并发模式失败
- CPU资源敏感

**5. G1收集器（Garbage First）**

**特点：**
- 面向服务端
- 可预测停顿
- 整堆收集
- 无内存碎片

**内存布局：**
```
Heap划分为多个Region
每个Region可以是Eden、Survivor或Old
```

**参数：**
```bash
-XX:+UseG1GC
# 期望停顿时间
-XX:MaxGCPauseMillis=200
# 堆大小
-Xmx4g
```

**6. ZGC收集器**

**特点：**
- 超低延迟（小于10ms）
- 支持TB级堆
- 并发收集

**参数：**
```bash
-XX:+UseZGC
-Xmx16g
```

**7. Shenandoah GC**

**特点：**
- 低停顿
- 并发整理
- 与堆大小无关的停顿时间

**8. 收集器组合**

| 新生代 | 老年代 | 说明 |
|--------|--------|------|
| Serial | Serial Old | 单线程 |
| ParNew | CMS | 低延迟 |
| Parallel Scavenge | Parallel Old | 高吞吐 |
| G1 | G1 | 平衡 |

**9. 选择建议**

**小应用（小于100MB）：**
- Serial GC

**中等应用（几GB）：**
- G1 GC

**大内存应用（>10GB）：**
- ZGC或Shenandoah

**低延迟要求：**
- CMS或G1

**高吞吐量要求：**
- Parallel GC

### 17. Java 中如何判断对象是否是垃圾？不同实现方式有何区别？

**答案：**

Java主要使用可达性分析算法判断对象是否为垃圾。

**1. 引用计数法（Java未采用）**

**原理：**
- 为对象添加引用计数器
- 引用+1，失效-1
- 计数为0时回收

**优点：**
- 实现简单
- 判定高效

**缺点：**
```java
// 无法解决循环引用
public class CircularReference {
    public Object ref;
    
    public static void main(String[] args) {
        CircularReference obj1 = new CircularReference();
        CircularReference obj2 = new CircularReference();
        
        obj1.ref = obj2;
        obj2.ref = obj1;
        
        obj1 = null;
        obj2 = null;
        
        // 两个对象互相引用，计数不为0
        // 但实际已成为垃圾
    }
}
```

**2. 可达性分析算法（Java采用）**

**原理：**
- 从GC Roots开始向下搜索
- 不可达的对象即为垃圾

**GC Roots包括：**
```java
// 1. 虚拟机栈中的引用
public void method() {
    Object obj = new Object();  // 栈中引用
}

// 2. 方法区中的静态变量
public class Test {
    private static Object staticObj = new Object();
}

// 3. 方法区中的常量
public class Test {
    private static final Object CONSTANT = new Object();
}

// 4. 本地方法栈中的引用
native void nativeMethod();

// 5. 活跃线程
Thread thread = new Thread();
```

**可达性分析过程：**
```
GC Roots
   |
   ├─> Object A (可达)
   │      |
   │      └─> Object B (可达)
   |
   └─> Object C (可达)

Object D (不可达，垃圾)
   |
   └─> Object E (不可达，垃圾)
```

**3. 对象的生死判定**

**第一次标记：**
```java
// 不可达对象被第一次标记
// 判断是否需要执行finalize()
if (!obj.isReachable() && obj.hasFinalize()) {
    // 放入F-Queue队列
    fQueue.add(obj);
}
```

**finalize()方法：**
```java
public class FinalizeTest {
    public static FinalizeTest instance;
    
    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize被调用");
        // 自救：重新建立引用
        instance = this;
    }
    
    public static void main(String[] args) throws Exception {
        instance = new FinalizeTest();
        
        // 第一次GC
        instance = null;
        System.gc();
        Thread.sleep(500);
        
        if (instance != null) {
            System.out.println("对象存活");  // 自救成功
        }
        
        // 第二次GC
        instance = null;
        System.gc();
        Thread.sleep(500);
        
        if (instance == null) {
            System.out.println("对象死亡");  // finalize只执行一次
        }
    }
}
```

**4. 引用类型判定**

```java
// 强引用：永不回收
Object obj = new Object();

// 软引用：内存不足时回收
SoftReference<Object> soft = new SoftReference<>(new Object());

// 弱引用：GC时回收
WeakReference<Object> weak = new WeakReference<>(new Object());

// 虚引用：无法获取对象
PhantomReference<Object> phantom = new PhantomReference<>(new Object(), queue);
```

**5. 方法区回收**

**类卸载条件：**
```java
// 1. 该类所有实例已被回收
// 2. 加载该类的ClassLoader已被回收
// 3. 该类的Class对象没有被引用

// 示例：动态代理类可能被卸载
Proxy.newProxyInstance(...);
```

### 18. 为什么 Java 的垃圾收集器将堆分为老年代和新生代？

**答案：**

分代收集基于两个假说，针对不同特征的对象采用不同的回收策略。

**1. 分代假说**

**弱分代假说：**
- 大部分对象朝生夕灭
- 98%的对象在创建后很快死亡

**强分代假说：**
- 熬过多次GC的对象难以消亡
- 存活时间长的对象会继续存活

**2. 分代结构**

```
Java Heap
├── Young Generation (新生代)
│   ├── Eden (80%)
│   ├── Survivor 0 (10%)
│   └── Survivor 1 (10%)
└── Old Generation (老年代)
```

**3. 分代优势**

**针对性回收：**
```java
// 新生代：频繁GC，快速回收
// 大部分对象在这里死亡
for (int i = 0; i < 1000000; i++) {
    Object temp = new Object();  // 临时对象
    // 方法结束后成为垃圾
}

// 老年代：少量GC，长期存活
public class Service {
    private static Cache cache = new Cache();  // 长期存活
}
```

**提高效率：**
```
新生代GC（Minor GC）：
- 频率高
- 速度快（复制算法）
- 停顿时间短

老年代GC（Major GC）：
- 频率低
- 速度慢（标记-整理）
- 停顿时间长
```

**4. 对象分配流程**

```java
// 1. 新对象在Eden区分配
Object obj = new Object();

// 2. Eden区满，触发Minor GC
// 存活对象复制到Survivor

// 3. 多次GC后仍存活，晋升到老年代
// 默认15次（-XX:MaxTenuringThreshold=15）

// 4. 大对象直接进入老年代
byte[] bigObj = new byte[10 * 1024 * 1024];  // 10MB
```

**5. 性能对比**

**不分代的问题：**
```
每次GC都扫描整个堆
→ 效率低下
→ 停顿时间长
```

**分代的优势：**
```
Minor GC只扫描新生代
→ 扫描范围小
→ 速度快
→ 停顿时间短
```

**6. 实际数据**

```
新生代对象存活率：1-2%
老年代对象存活率：>90%

Minor GC频率：秒级
Major GC频率：分钟级

Minor GC耗时：几毫秒
Major GC耗时：几百毫秒
```

### 19. 为什么 Java 8 移除了永久代（PermGen）并引入了元空间（Metaspace）？

**答案：**

元空间解决了永久代的诸多问题，提供更灵活的内存管理。

**1. 永久代的问题**

**问题1：大小难以确定**
```bash
# JDK 7永久代配置
-XX:PermSize=64m
-XX:MaxPermSize=256m

# 问题：
# - 设置太小：容易OOM
# - 设置太大：浪费内存
# - 难以预估合适大小
```

**问题2：容易OOM**
```java
// 动态生成大量类
while (true) {
    Enhancer enhancer = new Enhancer();
    enhancer.setSuperclass(Object.class);
    enhancer.create();
}
// java.lang.OutOfMemoryError: PermGen space
```

**问题3：Full GC效率低**
```
永久代GC需要Full GC
→ 停顿时间长
→ 影响应用性能
```

**问题4：内存碎片**
```
永久代使用堆内存
→ 产生碎片
→ 影响分配效率
```

**2. 元空间的优势**

**优势1：使用本地内存**
```bash
# JDK 8元空间配置
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=512m

# 优势：
# - 不占用堆内存
# - 理论上只受物理内存限制
# - 默认无上限（自动扩展）
```

**优势2：自动扩展**
```java
// 元空间会根据需要自动扩展
// 无需精确设置大小
// 减少OOM风险
```

**优势3：GC效率提升**
```
元空间GC独立进行
→ 不影响堆GC
→ 减少Full GC频率
```

**优势4：简化调优**
```bash
# 永久代：需要精确调优
-XX:PermSize=128m
-XX:MaxPermSize=256m

# 元空间：通常只设置最大值
-XX:MaxMetaspaceSize=512m
```

**3. 内存布局变化**

**JDK 7：**
```
Heap
├── Young Generation
├── Old Generation
└── Permanent Generation
    ├── 类元数据
    ├── 字符串常量池
    └── 静态变量
```

**JDK 8：**
```
Heap
├── Young Generation
├── Old Generation
└── 字符串常量池（移到堆）

Metaspace（本地内存）
└── 类元数据
```

**4. 迁移影响**

**字符串常量池迁移：**
```java
// JDK 7+：字符串常量池在堆中
String s1 = "hello";
String s2 = new String("hello");
String s3 = s2.intern();

// s1和s3指向堆中的常量池
System.out.println(s1 == s3);  // true
```

**静态变量迁移：**
```java
// JDK 8：静态变量随Class对象存储在堆中
public class Test {
    private static Object obj = new Object();
    // obj存储在堆中
}
```

**5. 实际案例**

**永久代OOM：**
```java
// JDK 7
// 大量使用CGLib动态代理
for (int i = 0; i < 100000; i++) {
    Enhancer enhancer = new Enhancer();
    enhancer.setSuperclass(MyClass.class);
    enhancer.create();
}
// OutOfMemoryError: PermGen space
```

**元空间自动扩展：**
```java
// JDK 8
// 相同代码不会轻易OOM
// 元空间自动扩展
// 除非达到MaxMetaspaceSize或物理内存限制
```

**6. 监控对比**

```bash
# JDK 7监控永久代
jstat -gcpermcapacity <pid>

# JDK 8监控元空间
jstat -gcmetacapacity <pid>
```

### 20. 为什么 Java 新生代被划分为 S0、S1 和 Eden 区？

**答案：**

新生代的三区划分是为了高效实现复制算法，避免内存碎片。

**1. 新生代结构**

```
Young Generation
├── Eden (80%)
├── Survivor 0 (10%)
└── Survivor 1 (10%)

默认比例：8:1:1
```

**2. 为什么需要两个Survivor**

**问题：只有一个Survivor**
```
Eden → Survivor → Old

问题：
1. 内存碎片
2. 无法区分不同年龄的对象
3. 晋升策略难以实现
```

**解决：使用两个Survivor**
```
Eden + S0 → S1
Eden + S1 → S0

优势：
1. 无内存碎片（复制算法）
2. 对象年龄递增
3. 灵活的晋升策略
```

**3. Minor GC流程**

**第一次GC：**
```java
// 初始状态
Eden: [对象A, B, C, D, E]
S0: []
S1: []

// GC后（假设A、B存活）
Eden: []
S0: [A(age=1), B(age=1)]
S1: []
```

**第二次GC：**
```java
// GC前
Eden: [对象F, G, H]
S0: [A(age=1), B(age=1)]
S1: []

// GC后（假设A、F存活）
Eden: []
S0: []
S1: [A(age=2), F(age=1)]
```

**多次GC后：**
```java
// 对象年龄达到阈值（默认15）
if (age >= MaxTenuringThreshold) {
    // 晋升到老年代
    moveToOld(obj);
}
```

**4. 为什么是8:1:1比例**

**依据：**
```
新生代对象存活率：1-2%
Eden区：80%
Survivor：10% × 2 = 20%

每次GC：
- Eden + 1个Survivor（90%）
- 存活对象复制到另一个Survivor
- 10%空间足够容纳存活对象
```

**内存利用率：**
```
可用空间：Eden + 1个Survivor = 90%
浪费空间：1个Survivor = 10%

对比传统复制算法（50%利用率）
→ 大幅提升内存利用率
```

**5. 空间分配担保**

```java
// 如果Survivor空间不足
if (survivorSize < aliveObjects) {
    // 直接晋升到老年代
    moveToOld(objects);
}

// 老年代空间检查
if (oldGenFreeSpace < youngGenUsedSpace) {
    // 触发Full GC
    fullGC();
}
```

**6. 实际示例**

```java
public class GCTest {
    public static void main(String[] args) {
        // 1. 对象在Eden分配
        byte[] obj1 = new byte[1024 * 1024];  // 1MB
        
        // 2. Eden满，触发Minor GC
        // obj1存活，复制到S0
        
        // 3. 继续分配
        byte[] obj2 = new byte[1024 * 1024];
        
        // 4. 再次GC
        // obj1复制到S1，age=2
        // obj2复制到S1，age=1
        
        // 5. 15次GC后
        // obj1晋升到老年代
    }
}
```

**7. 参数配置**

```bash
# 设置新生代大小
-Xmn512m

# 设置Eden和Survivor比例
-XX:SurvivorRatio=8  # Eden:Survivor = 8:1

# 设置晋升年龄阈值
-XX:MaxTenuringThreshold=15

# 打印GC详情
-XX:+PrintGCDetails
```

**8. 优化建议**

```java
// 1. 避免创建大对象
byte[] big = new byte[10 * 1024 * 1024];  // 直接进老年代

// 2. 复用对象
StringBuilder sb = new StringBuilder();  // 复用

// 3. 及时释放引用
list.clear();  // 帮助GC
list = null;
```

### 21. 什么是三色标记算法？

**答案：**

三色标记算法是并发GC中用于标记对象的核心算法，解决并发标记时的对象漏标问题。

**1. 三色定义**

**白色（White）：**
- 未被访问的对象
- 标记结束后仍为白色的对象会被回收

**灰色（Gray）：**
- 已被访问但其引用的对象未全部访问
- 处于待处理状态

**黑色（Black）：**
- 已被访问且其引用的对象也已访问
- 不会被回收

**2. 标记过程**

```java
// 初始状态：所有对象为白色
初始：所有对象 = 白色

// 从GC Roots开始标记
GC Roots -> 灰色

// 标记过程
while (存在灰色对象) {
    取出一个灰色对象
    标记为黑色
    将其引用的白色对象标记为灰色
}

// 结束：白色对象即为垃圾
```

**3. 标记示例**

```
初始状态：
GC Root -> A -> B -> C
所有对象：白色

第1步：标记GC Root引用的A
A: 灰色
B, C: 白色

第2步：处理A，标记B
A: 黑色
B: 灰色
C: 白色

第3步：处理B，标记C
A, B: 黑色
C: 灰色

第4步：处理C
A, B, C: 黑色

结束：白色对象被回收
```

**4. 并发标记问题**

**对象漏标问题：**
```java
// 并发标记时，应用线程修改引用
初始状态：
A(黑) -> B(灰) -> C(白)

// 应用线程执行：
A.ref = C;  // A引用C
B.ref = null;  // B不再引用C

结果：
A(黑) -> C(白)  // C被漏标！
B(灰)

// C应该存活但被标记为白色
// 会被错误回收
```

**漏标条件（同时满足）：**
1. 黑色对象指向白色对象
2. 灰色对象到白色对象的引用被删除

**5. 解决方案**

**增量更新（Incremental Update）：**
```java
// CMS使用
// 当黑色对象引用白色对象时
if (black.ref = white) {
    // 将黑色对象重新标记为灰色
    black -> 灰色
}

// 破坏条件1
```

**原始快照（SATB - Snapshot At The Beginning）：**
```java
// G1使用
// 当删除引用时
if (gray.ref = null) {
    // 记录被删除的引用
    记录(gray -> white)
}

// 破坏条件2
```

**6. 写屏障实现**

**增量更新写屏障：**
```java
// 伪代码
void writeBarrier(Object obj, Object ref) {
    if (obj.isBlack() && ref.isWhite()) {
        // 重新标记为灰色
        obj.setGray();
    }
    obj.ref = ref;
}
```

**SATB写屏障：**
```java
// 伪代码
void writeBarrier(Object obj, Object oldRef) {
    if (oldRef != null && oldRef.isWhite()) {
        // 记录旧引用
        satbQueue.add(oldRef);
    }
    obj.ref = newRef;
}
```

**7. 实际应用**

**CMS（增量更新）：**
```
初始标记（STW）
    ↓
并发标记（增量更新）
    ↓
重新标记（STW，处理变化）
    ↓
并发清除
```

**G1（SATB）：**
```
初始标记（STW）
    ↓
并发标记（SATB）
    ↓
最终标记（STW，处理SATB队列）
    ↓
筛选回收
```

**8. 性能对比**

| 特性 | 增量更新 | SATB |
|------|---------|------|
| 使用者 | CMS | G1 |
| 重新标记工作量 | 较大 | 较小 |
| 浮动垃圾 | 较少 | 较多 |
| 实现复杂度 | 简单 | 复杂 |

### 22. Java 中的 young GC、old GC、full GC 和 mixed GC 的区别是什么？

**答案：**

不同类型的GC针对不同的内存区域，有不同的触发条件和回收策略。

**1. Young GC（Minor GC）**

**定义：**
- 只回收新生代
- 最频繁的GC类型

**触发条件：**
```java
// Eden区满时触发
if (eden.isFull()) {
    youngGC();
}
```

**回收过程：**
```
1. Eden区存活对象 -> Survivor
2. Survivor区存活对象 -> 另一个Survivor
3. 年龄达标对象 -> 老年代
4. 清空Eden和一个Survivor
```

**特点：**
- 频率高（秒级）
- 速度快（几毫秒）
- 使用复制算法
- STW时间短

**2. Old GC（Major GC）**

**定义：**
- 只回收老年代
- 较少使用的术语

**触发条件：**
```java
// 老年代空间不足
if (oldGen.freeSpace < threshold) {
    oldGC();
}
```

**特点：**
- 频率低
- 速度慢
- 使用标记-整理算法

**注意：**
- Major GC通常伴随Full GC
- 很多情况下两者等价

**3. Full GC**

**定义：**
- 回收整个堆（新生代+老年代）
- 回收方法区

**触发条件：**
```java
// 1. 老年代空间不足
if (oldGen.freeSpace < requiredSpace) {
    fullGC();
}

// 2. 方法区空间不足
if (metaspace.isFull()) {
    fullGC();
}

// 3. 空间分配担保失败
if (promotionFailed) {
    fullGC();
}

// 4. 显式调用System.gc()
System.gc();  // 建议JVM执行Full GC

// 5. CMS并发失败
if (concurrentModeFailure) {
    fullGC();
}
```

**特点：**
- 频率最低
- 耗时最长（几百毫秒到几秒）
- STW时间长
- 影响应用性能

**4. Mixed GC**

**定义：**
- G1特有的GC类型
- 回收新生代+部分老年代

**触发条件：**
```java
// 老年代占用达到阈值
if (oldGenOccupancy > InitiatingHeapOccupancyPercent) {
    mixedGC();
}

// 默认45%
-XX:InitiatingHeapOccupancyPercent=45
```

**回收过程：**
```
1. 回收所有新生代Region
2. 回收部分老年代Region（价值最高的）
3. 根据停顿时间目标选择Region数量
```

**特点：**
- G1独有
- 可预测停顿时间
- 增量回收老年代

**5. GC类型对比**

| GC类型 | 回收区域 | 频率 | 耗时 | STW |
|--------|---------|------|------|-----|
| Young GC | 新生代 | 高 | 短 | 短 |
| Old GC | 老年代 | 低 | 长 | 长 |
| Full GC | 整个堆 | 最低 | 最长 | 最长 |
| Mixed GC | 新生代+部分老年代 | 中 | 中 | 可控 |

**6. 实际案例**

**Young GC示例：**
```java
public class YoungGCTest {
    public static void main(String[] args) {
        for (int i = 0; i < 1000; i++) {
            byte[] temp = new byte[1024 * 1024];  // 1MB
            // 频繁触发Young GC
        }
    }
}
// 日志：[GC (Allocation Failure) [PSYoungGen: 2048K->512K(2560K)] ...
```

**Full GC示例：**
```java
public class FullGCTest {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        while (true) {
            list.add(new byte[1024 * 1024]);  // 1MB
            // 最终触发Full GC
        }
    }
}
// 日志：[Full GC (Ergonomics) [PSYoungGen: 2048K->0K] [ParOldGen: 8192K->8000K] ...
```

**7. 监控GC**

```bash
# 打印GC日志
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps

# 使用jstat监控
jstat -gc <pid> 1000

# 输出示例
S0C    S1C    S0U    S1U      EC       EU        OC         OU       YGC   YGCT    FGC    FGCT
2048.0 2048.0  0.0   512.0  16384.0  8192.0   40960.0   20480.0    100   0.500    5    2.000
```

### 23. 什么条件会触发 Java 的 young GC？

**答案：**

Young GC主要在Eden区空间不足时触发。

**1. 主要触发条件**

**Eden区满：**
```java
// 最常见的触发条件
if (eden.freeSpace < objectSize) {
    // 触发Young GC
    youngGC();
}
```

**2. 对象分配流程**

```java
public Object allocate(int size) {
    // 1. 尝试在TLAB分配
    if (tlab.canAllocate(size)) {
        return tlab.allocate(size);
    }
    
    // 2. TLAB不足，尝试在Eden分配
    if (eden.canAllocate(size)) {
        return eden.allocate(size);
    }
    
    // 3. Eden不足，触发Young GC
    youngGC();
    
    // 4. GC后重试分配
    if (eden.canAllocate(size)) {
        return eden.allocate(size);
    }
    
    // 5. 仍不足，直接分配到老年代
    return oldGen.allocate(size);
}
```

**3. 触发时机示例**

```java
public class YoungGCTrigger {
    public static void main(String[] args) {
        // 假设Eden区大小为10MB
        
        // 分配9MB，未触发GC
        byte[] obj1 = new byte[9 * 1024 * 1024];
        
        // 分配2MB，Eden不足，触发Young GC
        byte[] obj2 = new byte[2 * 1024 * 1024];
        
        // GC日志：
        // [GC (Allocation Failure) [PSYoungGen: 9216K->1024K(10240K)] ...
    }
}
```

**4. 分配失败场景**

**场景1：Eden区满**
```java
// Eden: 8MB已用，2MB空闲
// 分配3MB对象
byte[] obj = new byte[3 * 1024 * 1024];

// 流程：
// 1. Eden空间不足
// 2. 触发Young GC
// 3. 清理Eden
// 4. 重新分配
```

**场景2：大对象直接进老年代**
```java
// 对象大于Eden区
byte[] bigObj = new byte[20 * 1024 * 1024];  // 20MB

// 流程：
// 1. 对象大于Eden
// 2. 不触发Young GC
// 3. 直接分配到老年代
```

**5. 空间分配担保**

```java
// Young GC前检查
if (oldGen.freeSpace < youngGen.usedSpace) {
    // 老年代空间可能不足
    if (HandlePromotionFailure) {
        // 允许冒险，执行Young GC
        youngGC();
    } else {
        // 不允许冒险，执行Full GC
        fullGC();
    }
}
```

**6. 相关JVM参数**

```bash
# 设置新生代大小
-Xmn512m

# 设置Eden和Survivor比例
-XX:SurvivorRatio=8

# 打印GC详情
-XX:+PrintGCDetails

# 打印GC原因
-XX:+PrintGCCause
```

**7. 监控Young GC**

```bash
# 使用jstat
jstat -gcutil <pid> 1000

# 输出
  S0     S1     E      O      M     YGC     YGCT
  0.00  50.00  75.00  30.00  95.00  100    0.500

# E: Eden使用率75%
# YGC: Young GC次数100次
# YGCT: Young GC总耗时0.5秒
```

**8. 优化建议**

```java
// 1. 合理设置新生代大小
-Xmn1g  // 根据应用特点调整

// 2. 避免频繁创建大对象
// 差：
for (int i = 0; i < 1000; i++) {
    byte[] temp = new byte[10 * 1024 * 1024];  // 频繁触发GC
}

// 好：
byte[] buffer = new byte[10 * 1024 * 1024];  // 复用
for (int i = 0; i < 1000; i++) {
    // 使用buffer
}

// 3. 对象池复用
ObjectPool<Buffer> pool = new ObjectPool<>();
Buffer buffer = pool.borrow();
// 使用
pool.return(buffer);
```

### 24. 什么情况下会触发 Java 的 Full GC？

**答案：**

Full GC在多种情况下触发，通常意味着严重的性能问题。

**1. 老年代空间不足**

```java
// 场景1：大对象直接进入老年代
byte[] bigObj = new byte[100 * 1024 * 1024];  // 100MB

// 场景2：Young GC后晋升对象过多
if (oldGen.freeSpace < promotionSize) {
    fullGC();
}

// 场景3：长期存活对象累积
public class Service {
    private static List<Object> cache = new ArrayList<>();
    
    public void addCache() {
        cache.add(new Object());  // 持续累积
        // 最终老年代满，触发Full GC
    }
}
```

**2. 方法区（元空间）满**

```java
// 动态生成大量类
while (true) {
    Enhancer enhancer = new Enhancer();
    enhancer.setSuperclass(Object.class);
    enhancer.setUseCache(false);
    enhancer.create();  // 生成类
}

// 元空间满，触发Full GC
// java.lang.OutOfMemoryError: Metaspace
```

**3. 空间分配担保失败**

```java
// Young GC前检查
long avgPromotionSize = getAveragePromotionSize();

if (oldGen.freeSpace < avgPromotionSize) {
    // 担保失败，触发Full GC
    fullGC();
} else {
    // 执行Young GC
    youngGC();
}

// 如果Young GC后仍无法晋升
if (promotionFailed) {
    // 再次触发Full GC
    fullGC();
}
```

**4. CMS并发失败**

```java
// CMS并发标记期间
// 老年代空间不足以容纳新晋升对象
if (oldGen.freeSpace < promotionSize) {
    // Concurrent Mode Failure
    // 降级为Serial Old，执行Full GC
    fullGC();
}

// 日志：
// [CMS-concurrent-mark: 0.100/0.100 secs]
// [CMS Concurrent Mode Failure]
// [Full GC (Allocation Failure) ...
```

**5. 显式调用System.gc()**

```java
// 不推荐
System.gc();  // 建议JVM执行Full GC

// 可以禁用
-XX:+DisableExplicitGC

// 或改为并发GC
-XX:+ExplicitGCInvokesConcurrent
```

**6. Dump堆内存**

```bash
# jmap触发Full GC
jmap -dump:live,format=b,file=heap.bin <pid>

# live参数会先执行Full GC
```

**7. 晋升失败**

```java
// Promotion Failed
// Survivor空间不足，对象直接晋升老年代
// 但老年代也空间不足

// 示例
public class PromotionFailure {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        
        for (int i = 0; i < 1000; i++) {
            // 创建对象
            byte[] obj = new byte[1024 * 1024];
            list.add(obj);
            
            // 触发Young GC
            // 对象晋升失败
            // 触发Full GC
        }
    }
}
```

**8. Full GC触发条件汇总**

| 触发条件 | 说明 | 频率 | 影响 |
|---------|------|------|------|
| 老年代满 | 最常见 | 中 | 大 |
| 元空间满 | 类加载过多 | 低 | 大 |
| 担保失败 | 空间预估不足 | 低 | 大 |
| CMS失败 | 并发收集失败 | 低 | 极大 |
| System.gc() | 显式调用 | 取决于代码 | 大 |
| 晋升失败 | 空间碎片 | 低 | 大 |

**9. 监控Full GC**

```bash
# GC日志
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-Xloggc:gc.log

# 日志示例
[Full GC (Allocation Failure) 
 [PSYoungGen: 2048K->0K(2560K)] 
 [ParOldGen: 8192K->7000K(10240K)] 
 10240K->7000K(12800K), 
 [Metaspace: 3000K->3000K(1056768K)], 
 0.5000000 secs]

# jstat监控
jstat -gcutil <pid> 1000
  S0     S1     E      O      M     FGC    FGCT
  0.00   0.00  10.00  95.00  90.00   10   5.000
```

**10. 避免Full GC**

```java
// 1. 合理设置堆大小
-Xms4g -Xmx4g  // 初始和最大堆一致

// 2. 调整新生代和老年代比例
-XX:NewRatio=2  // 老年代:新生代 = 2:1

// 3. 避免大对象
// 差：
byte[] big = new byte[10 * 1024 * 1024];

// 好：分批处理
for (int i = 0; i < 10; i++) {
    byte[] small = new byte[1024 * 1024];
    process(small);
}

// 4. 及时释放引用
list.clear();
cache.evict();

// 5. 使用对象池
ObjectPool<Buffer> pool = new ObjectPool<>();

// 6. 选择合适的GC
-XX:+UseG1GC  // G1避免Full GC
-XX:MaxGCPauseMillis=200
```

### 25. 什么是 Java 的 PLAB？

**答案：**

PLAB（Promotion Local Allocation Buffer）是JVM为每个线程在老年代分配的私有缓冲区，用于优化对象晋升性能。

**1. PLAB定义**

**作用：**
- 线程私有的老年代分配缓冲区
- 避免多线程竞争
- 提高对象晋升效率

**类比TLAB：**
```
TLAB: 新生代的线程本地分配缓冲区
PLAB: 老年代的线程本地分配缓冲区
```

**2. 为什么需要PLAB**

**问题：多线程晋升竞争**
```java
// Young GC时，多个线程同时晋升对象
Thread 1: 晋升对象A到老年代
Thread 2: 晋升对象B到老年代
Thread 3: 晋升对象C到老年代

// 没有PLAB：需要同步
synchronized (oldGen) {
    oldGen.allocate(obj);  // 性能瓶颈
}
```

**解决：使用PLAB**
```java
// 每个线程有自己的PLAB
Thread 1: PLAB1 -> 老年代
Thread 2: PLAB2 -> 老年代
Thread 3: PLAB3 -> 老年代

// 无需同步，并行晋升
```

**3. PLAB工作原理**

```java
// 对象晋升流程
public void promoteObject(Object obj) {
    // 1. 尝试在PLAB中分配
    if (plab.canAllocate(obj.size())) {
        plab.allocate(obj);
        return;
    }
    
    // 2. PLAB空间不足，申请新PLAB
    if (obj.size() < PLAB_SIZE) {
        plab = allocateNewPLAB();
        plab.allocate(obj);
        return;
    }
    
    // 3. 对象太大，直接在老年代分配（需要同步）
    synchronized (oldGen) {
        oldGen.allocate(obj);
    }
}
```

**4. PLAB大小**

**默认大小：**
```bash
# 动态调整
# 根据晋升对象大小自动调整PLAB大小

# 查看PLAB统计
-XX:+PrintPLAB

# 输出示例
PLAB: 1024K, waste: 10K, refills: 5
```

**影响因素：**
```
1. 晋升对象的平均大小
2. 晋升频率
3. 线程数量
4. 老年代可用空间
```

**5. PLAB vs TLAB对比**

| 特性 | TLAB | PLAB |
|------|------|------|
| 位置 | 新生代Eden区 | 老年代 |
| 用途 | 新对象分配 | 对象晋升 |
| 大小 | 较小（几KB） | 较大（几KB到几MB） |
| 频率 | 极高 | 中等 |
| 参数 | -XX:TLABSize | 动态调整 |

**6. PLAB优势**

**性能提升：**
```java
// 无PLAB：
// 每次晋升都需要同步
// 性能：1000次晋升/秒

// 有PLAB：
// 批量晋升，减少同步
// 性能：10000次晋升/秒

// 提升10倍
```

**减少碎片：**
```
PLAB连续分配
→ 减少内存碎片
→ 提高老年代利用率
```

**7. 相关参数**

```bash
# 打印PLAB信息
-XX:+PrintPLAB

# 最小PLAB大小
-XX:MinPLABSize=1024

# 最大PLAB大小
-XX:MaxPLABSize=1048576

# PLAB浪费阈值
-XX:PLABWasteTargetPercent=10
```

**8. 实际应用**

```java
// Young GC中的PLAB使用
public class YoungGC {
    
    public void evacuate() {
        // 并行GC线程
        parallelDo(() -> {
            // 每个线程有自己的PLAB
            PLAB plab = allocatePLAB();
            
            // 扫描Survivor区
            for (Object obj : survivor) {
                if (obj.age >= threshold) {
                    // 晋升到老年代
                    promoteWithPLAB(obj, plab);
                }
            }
        });
    }
    
    private void promoteWithPLAB(Object obj, PLAB plab) {
        if (plab.canAllocate(obj.size())) {
            // 在PLAB中分配
            plab.allocate(obj);
        } else {
            // PLAB满，申请新的
            plab = allocateNewPLAB();
            plab.allocate(obj);
        }
    }
}
```

**9. 监控PLAB**

```bash
# GC日志中的PLAB信息
-XX:+PrintGCDetails -XX:+PrintPLAB

# 输出示例
[GC Worker #0: PLAB: 2048K, waste: 100K, refills: 3]
[GC Worker #1: PLAB: 2048K, waste: 50K, refills: 2]
[GC Worker #2: PLAB: 2048K, waste: 80K, refills: 4]

# waste: PLAB浪费的空间
# refills: PLAB重新分配次数
```

**10. 优化建议**

```java
// 1. 减少晋升频率
// 增大新生代，减少Young GC频率
-Xmn2g

// 2. 提高晋升阈值
// 让对象在新生代多停留几次
-XX:MaxTenuringThreshold=15

// 3. 避免大对象晋升
// 大对象直接进老年代，不使用PLAB
-XX:PretenureSizeThreshold=1048576  // 1MB

// 4. 合理设置老年代大小
// 确保有足够空间分配PLAB
-Xmx4g
```

### 26. JVM 垃圾回收时产生的 concurrent mode failure 的原因是什么？

**答案：**

Concurrent Mode Failure是CMS并发收集期间老年代空间不足导致的失败。

**主要原因：**
1. **并发期间晋升过快**：Young GC频繁，对象快速晋升到老年代
2. **触发时机过晚**：CMSInitiatingOccupancyFraction设置过高
3. **内存碎片**：CMS使用标记-清除，产生碎片导致分配失败

**后果：**
- 降级为Serial Old单线程Full GC
- 应用暂停时间长（几秒）
- 严重影响性能

**解决方案：**
```bash
# 提前触发CMS
-XX:CMSInitiatingOccupancyFraction=70

# 增大堆
-Xmx4g

# 或切换到G1
-XX:+UseG1GC
```

### 27. 为什么 Java 中 CMS 垃圾收集器在发生 Concurrent Mode Failure 时的 Full GC 是单线程的？

**答案：**

CMS失败时降级为Serial Old收集器，这是历史设计决定。

**原因：**
1. **历史设计**：CMS设计时选择Serial Old作为后备
2. **数据结构不兼容**：CMS与Parallel Old数据结构不同
3. **实现简单**：Serial Old稳定可靠

**性能影响：**
```
正常CMS：暂停50ms
Serial Old Full GC：暂停5000ms（100倍差距）
```

**解决方案：**
```bash
# 切换到G1（多线程Full GC）
-XX:+UseG1GC
```

### 28. 为什么 Java 中某些新生代和老年代的垃圾收集器不能组合使用？比如 ParNew 和 Parallel Old

**答案：**

收集器组合限制源于框架、数据结构和设计目标的不兼容。

**可用组合：**
```
Serial -> Serial Old
ParNew -> CMS
Parallel -> Parallel Old
G1 -> G1
```

**不兼容原因：**
1. **框架不同**：ParNew基于CMS框架，Parallel Old基于Parallel框架
2. **数据结构不同**：Card Table vs Region-based
3. **设计目标不同**：低延迟 vs 高吞吐量

**推荐配置：**
```bash
# 低延迟
-XX:+UseG1GC

# 高吞吐
-XX:+UseParallelGC
```

### 29. JVM 新生代垃圾回收如何避免全堆扫描？

**答案：**

通过Card Table和写屏障技术避免扫描整个老年代。

**Card Table原理：**
```java
// 将老年代划分为512字节的Card
// 用字节数组记录哪些Card有跨代引用
byte[] cardTable;

// 写屏障自动标记
void writeBarrier(Object obj, Object ref) {
    obj.field = ref;
    if (isOld(obj) && isYoung(ref)) {
        cardTable.markDirty(obj);
    }
}
```

**Young GC流程：**
```java
// 只扫描脏Card，不扫描整个老年代
for (Card card : dirtyCards) {
    scanCard(card);
}
```

**性能提升：**
- 从扫描几GB降到几MB
- 性能提升100倍以上

### 30. Java 的 CMS 垃圾回收器和 G1 垃圾回收器在记忆集的维护上有什么不同？

**答案：**

CMS使用Card Table，G1使用Remembered Set，粒度和精度不同。

**对比：**

| 特性 | CMS Card Table | G1 Remembered Set |
|------|---------------|------------------|
| 粒度 | 512字节 | Region（1-32MB） |
| 记录内容 | 是否有引用 | 精确引用来源 |
| 空间开销 | 0.2% | 5-10% |
| 扫描效率 | 中等 | 高 |
| 适用场景 | 小堆 | 大堆 |

**CMS：**
```java
// 简单标记Card为脏
cardTable[index] = DIRTY;
```

**G1：**
```java
// 精确记录引用来源
region.rset.addReference(fromRegion, card);
```

**选择建议：**
- 小堆（小于4GB）：CMS
- 大堆（大于4GB）：G1

### 31. 为什么 G1 垃圾收集器不维护年轻代到老年代的记忆集？

**答案：**

G1只维护老年代到年轻代的记忆集，因为年轻代总是会被完整收集。

**原因分析：**

**1. 年轻代总是全部收集**
```java
// G1的Young GC
// 总是收集所有年轻代Region
void youngGC() {
    // 收集所有Eden Region
    collectAllEdenRegions();
    
    // 收集所有Survivor Region
    collectAllSurvivorRegions();
    
    // 无需记忆集，因为全部扫描
}
```

**2. 老年代部分收集**
```java
// G1的Mixed GC
// 只收集部分老年代Region
void mixedGC() {
    // 收集所有年轻代
    collectYoungRegions();
    
    // 只收集部分老年代
    collectSelectedOldRegions();
    
    // 需要RSet记录其他老年代Region的引用
}
```

**3. 记忆集的作用**
```
记忆集用于：
- 避免扫描整个堆
- 只扫描可能包含引用的区域

年轻代→老年代：
- 不需要RSet
- 因为年轻代总是全部收集
- 所有引用都会被扫描到

老年代→年轻代：
- 需要RSet
- 因为只收集部分老年代
- 需要知道哪些老年代Region引用了年轻代
```

**4. 内存开销考虑**
```
如果维护年轻代→老年代RSet：
- 额外的内存开销
- 额外的维护成本
- 没有实际收益（因为年轻代总是全收集）
```

### 32. Java 中的 CMS 和 G1 垃圾收集器如何维持并发的正确性？

**答案：**

CMS使用增量更新，G1使用SATB（原始快照），都通过写屏障维持并发正确性。

**CMS增量更新：**
```java
// 当黑色对象引用白色对象时
void cmsWriteBarrier(Object obj, Object ref) {
    if (obj.isBlack() && ref.isWhite()) {
        // 将黑色对象重新标记为灰色
        obj.setGray();
    }
    obj.field = ref;
}
```

**G1 SATB：**
```java
// 记录删除的引用
void g1WriteBarrier(Object obj, Object newRef) {
    Object oldRef = obj.field;
    
    // 记录旧引用
    if (oldRef != null && isMarking) {
        satbQueue.enqueue(oldRef);
    }
    
    obj.field = newRef;
}
```

**对比：**

| 特性 | CMS增量更新 | G1 SATB |
|------|-----------|--------|
| 策略 | 记录新增引用 | 记录删除引用 |
| 重新标记工作量 | 较大 | 较小 |
| 浮动垃圾 | 较少 | 较多 |
| 实现复杂度 | 简单 | 复杂 |

### 33. Java G1 相对于 CMS 有哪些进步的地方?

**答案：**

G1在可预测性、内存碎片、大堆支持等方面都优于CMS。

**主要进步：**

**1. 可预测的停顿时间**
```bash
# G1可以设置停顿时间目标
-XX:MaxGCPauseMillis=200

# CMS无法精确控制停顿时间
```

**2. 无内存碎片**
```
CMS：标记-清除，产生碎片
G1：标记-整理，无碎片
```

**3. 大堆支持更好**
```
CMS：适合小于8GB
G1：适合8-64GB
ZGC：大于64GB
```

**4. 分代收集更灵活**
```
CMS：固定的新生代和老年代
G1：动态调整Region角色
```

**5. 避免Concurrent Mode Failure**
```
CMS：可能降级为Serial Old
G1：使用Evacuation Failure机制，性能影响小
```

**6. 整体吞吐量更高**
```
CMS：并发收集，但碎片影响性能
G1：整理内存，长期性能更稳定
```

### 34. 什么是 Java 中的 logging write barrier？

**答案：**

Logging Write Barrier是G1用于维护Remembered Set的写屏障机制。

**工作原理：**
```java
// G1的写屏障
void g1WriteBarrier(Object obj, Object newRef) {
    // 1. SATB写屏障（并发标记期间）
    if (isMarking) {
        Object oldRef = obj.field;
        if (oldRef != null) {
            satbQueue.enqueue(oldRef);
        }
    }
    
    // 2. 实际赋值
    obj.field = newRef;
    
    // 3. RSet维护写屏障
    if (newRef != null) {
        Region fromRegion = getRegion(obj);
        Region toRegion = getRegion(newRef);
        
        if (fromRegion != toRegion) {
            // 记录到日志缓冲区
            logBuffer.add(fromRegion, toRegion, getCard(obj));
        }
    }
}

// 后台线程处理日志
void processLogBuffer() {
    for (LogEntry entry : logBuffer) {
        entry.toRegion.rset.add(entry.fromRegion, entry.card);
    }
}
```

**优势：**
- 应用线程只记录日志，开销小
- 后台线程异步更新RSet
- 减少应用线程停顿

### 35. Java 的 G1 垃圾回收流程是怎样的？

**答案：**

G1包括Young GC、并发标记和Mixed GC三个主要阶段。

**1. Young GC（频繁）**
```
1. 选择所有年轻代Region
2. STW，复制存活对象
3. 部分对象晋升到老年代
4. 时间：10-50ms
```

**2. 并发标记周期**
```
阶段1：初始标记（STW）
- 标记GC Roots
- 时间：几毫秒

阶段2：并发标记
- 并发遍历对象图
- 使用SATB
- 时间：几百毫秒

阶段3：最终标记（STW）
- 处理SATB队列
- 时间：几十毫秒

阶段4：清理（部分STW）
- 统计Region存活率
- 选择回收集合
```

**3. Mixed GC**
```
1. 收集所有年轻代Region
2. 收集部分老年代Region（垃圾最多的）
3. 根据停顿时间目标选择Region数量
4. 时间：可控制在MaxGCPauseMillis内
```

**完整流程：**
```
Young GC → Young GC → ... 
    ↓（老年代占用达到45%）
并发标记周期
    ↓
Mixed GC → Mixed GC → ...
    ↓
Young GC → ...
```

### 36. Java 的 CMS 垃圾回收流程是怎样的？

**答案：**

CMS分为4个阶段：初始标记、并发标记、重新标记、并发清除。

**完整流程：**

**阶段1：初始标记（STW）**
```
- 标记GC Roots直接引用的对象
- 时间短：几毫秒
- 多线程执行
```

**阶段2：并发标记**
```
- 与应用线程并发执行
- 遍历对象图，标记可达对象
- 使用增量更新
- 时间长：几百毫秒
```

**阶段3：重新标记（STW）**
```
- 处理并发标记期间的变化
- 扫描Card Table
- 时间：几十毫秒
- 多线程执行
```

**阶段4：并发清除**
```
- 与应用线程并发执行
- 清除未标记的对象
- 不移动对象，产生碎片
- 时间：几百毫秒
```

**时间线：**
```
初始标记(STW 5ms) → 并发标记(300ms) → 重新标记(STW 50ms) → 并发清除(200ms)
```

### 37. 你了解 Java 的 ZGC（Z Garbage Collector）吗？

**答案：**

ZGC是JDK 11引入的低延迟垃圾收集器，停顿时间小于10ms。

**核心特性：**

**1. 超低延迟**
```
停顿时间：小于10ms
与堆大小无关
适用于大堆（大于64GB）
```

**2. Colored Pointer**
```java
// 64位指针布局
[unused 16bit][Finalizable 1bit][Remapped 1bit][Marked1 1bit][Marked0 1bit][address 44bit]

// 通过指针颜色记录对象状态
// 无需额外内存开销
```

**3. Load Barrier**
```java
// 读屏障，在读取对象时触发
void loadBarrier(Object obj) {
    if (needsBarrier(obj)) {
        // 重定位对象
        obj = relocate(obj);
    }
    return obj;
}
```

**4. 并发收集**
```
所有阶段几乎都是并发的：
- 并发标记
- 并发重定位
- 并发引用处理
```

**使用：**
```bash
-XX:+UseZGC
-Xmx16g
```

### 38. JVM 垃圾回收调优的主要目标是什么？

**答案：**

GC调优目标是平衡延迟、吞吐量和内存占用。

**三大目标：**

**1. 降低延迟**
```
- 减少GC停顿时间
- 减少GC频率
- 目标：GC停顿小于100ms
```

**2. 提高吞吐量**
```
- 增加应用运行时间占比
- 减少GC时间占比
- 目标：GC时间小于5%
```

**3. 控制内存占用**
```
- 合理设置堆大小
- 避免内存浪费
- 目标：内存利用率>70%
```

**不可能三角：**
```
低延迟 ←→ 高吞吐量
    ↑
 低内存

只能同时满足两个目标
```

### 39. 如何对 Java 的垃圾回收进行调优？

**答案：**

GC调优需要分析问题、设置参数、测试验证。

**调优步骤：**

**1. 收集GC日志**
```bash
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-Xloggc:gc.log
```

**2. 分析GC问题**
```
- Young GC频繁？增大新生代
- Full GC频繁？增大老年代
- GC时间长？切换收集器
```

**3. 调整参数**
```bash
# 堆大小
-Xms4g -Xmx4g

# 新生代大小
-Xmn1g

# 收集器
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
```

**4. 验证效果**
```bash
# 监控指标
jstat -gcutil <pid> 1000
```

### 40. 常用的 JVM 配置参数有哪些？

**答案：**

**内存配置：**
```bash
-Xms4g                    # 初始堆大小
-Xmx4g                    # 最大堆大小
-Xmn1g                    # 新生代大小
-Xss1m                    # 线程栈大小
-XX:MetaspaceSize=256m   # 元空间初始大小
-XX:MaxMetaspaceSize=512m # 元空间最大大小
```

**收集器选择：**
```bash
-XX:+UseG1GC              # 使用G1
-XX:+UseZGC               # 使用ZGC
-XX:+UseConcMarkSweepGC  # 使用CMS
-XX:MaxGCPauseMillis=200 # 最大停顿时间
```

**GC日志：**
```bash
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-Xloggc:gc.log
-XX:+UseGCLogFileRotation
-XX:NumberOfGCLogFiles=10
-XX:GCLogFileSize=100M
```

**OOM处理：**
```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/logs/heapdump.hprof
-XX:OnOutOfMemoryError="sh /scripts/restart.sh"
```

**性能调优：**
```bash
-XX:+UseStringDeduplication  # 字符串去重
-XX:+UseTLAB                  # 线程本地分配缓冲
```

### 41. 你常用哪些工具来分析 JVM 性能？

**答案：**

**命令行工具：**
```bash
# jps - 查看Java进程
jps -lvm

# jstat - GC统计
jstat -gcutil <pid> 1000

# jmap - 堆转储
jmap -dump:live,format=b,file=heap.bin <pid>

# jstack - 线程堆栈
jstack <pid> > thread.txt

# jinfo - JVM参数
jinfo -flags <pid>
```

**图形化工具：**
```
- JConsole：实时监控
- VisualVM：全面分析
- JProfiler：性能分析
- MAT：内存分析
- GCViewer：GC日志分析
```

**在线工具：**
```
- Arthas：阿里开源诊断工具
- Async-profiler：CPU/内存分析
```

### 42. 如何在 Java 中进行内存泄漏分析？

**答案：**

**分析步骤：**

**1. 获取堆转储**
```bash
# 手动转储
jmap -dump:live,format=b,file=heap.bin <pid>

# 自动转储（OOM时）
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/logs/heapdump.hprof
```

**2. 使用MAT分析**
```
1. 打开heap.bin
2. 查看Dominator Tree
3. 找到占用内存最多的对象
4. 分析GC Roots引用链
5. 定位泄漏代码
```

**3. 常见泄漏场景**
```java
// 场景1：静态集合
public class Leak {
    private static List<Object> list = new ArrayList<>();
    public void add() {
        list.add(new Object());  // 永不清理
    }
}

// 场景2：ThreadLocal未清理
ThreadLocal<byte[]> local = new ThreadLocal<>();
local.set(new byte[1024 * 1024]);
// 忘记local.remove()

// 场景3：监听器未移除
button.addListener(listener);
// 忘记button.removeListener(listener)
```

### 43. Java 里的对象在虚拟机里面是怎么存储的？

**答案：**

Java对象在内存中分为对象头、实例数据和对齐填充三部分。

**对象结构：**
```
[对象头][实例数据][对齐填充]
```

**1. 对象头（Object Header）**
```
Mark Word（8字节）：
- 哈希码
- GC分代年龄
- 锁状态标志
- 线程ID

Class Pointer（4/8字节）：
- 指向类元数据
- 开启指针压缩为4字节

Array Length（4字节，仅数组）：
- 数组长度
```

**2. 实例数据**
```java
public class User {
    private int age;      // 4字节
    private String name;  // 4/8字节（引用）
}
```

**3. 对齐填充**
```
对象大小必须是8字节的倍数
不足部分用填充补齐
```

**示例计算：**
```java
public class Point {
    private int x;  // 4字节
    private int y;  // 4字节
}

// 对象大小：
// Mark Word: 8字节
// Class Pointer: 4字节（压缩）
// x: 4字节
// y: 4字节
// 总计: 20字节
// 对齐后: 24字节
```

### 44. 说说 Java 的执行流程?

**答案：**

Java代码经过编译、加载、验证、执行多个阶段。

**完整流程：**

**1. 编译阶段**
```
.java源文件
    ↓ javac编译
.class字节码文件
```

**2. 类加载阶段**
```
加载（Loading）
    ↓
验证（Verification）
    ↓
准备（Preparation）
    ↓
解析（Resolution）
    ↓
初始化（Initialization）
```

**3. 执行阶段**
```
字节码
    ↓
解释执行 / JIT编译
    ↓
本地机器码
    ↓
CPU执行
```

**详细流程：**
```java
// 1. 编写代码
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}

// 2. javac编译
javac Hello.java  // 生成Hello.class

// 3. java运行
java Hello

// 4. JVM执行
// - 类加载器加载Hello.class
// - 验证字节码合法性
// - 分配内存，初始化静态变量
// - 执行main方法
// - 解释执行或JIT编译
// - 输出Hello
```

---

##  学习指南

**核心要点：**
- JVM 内存模型和垃圾回收机制
- 类加载过程和双亲委派模型
- 性能监控和调优方法
- 常见内存问题排查

**学习路径建议：**
1. 掌握 JVM 内存结构和对象生命周期
2. 深入理解垃圾回收算法和收集器
3. 学习 JVM 调优参数和监控工具
4. 掌握内存泄漏分析和性能优化

#  Java 基础面试题集

>  **总题数**: 66道 |  **重点领域**: 面向对象、基本语法、JVM |  **难度分布**: 基础到高级

本文档整理了 Java 基础的完整66道面试题目，涵盖面向对象、基本语法、常用API、设计模式等各个方面。

---

##  面试题目列表

### 1. Java 中的序列化和反序列化是什么？

**序列化(Serialization)** 是将Java对象转换为字节序列的过程，便于在网络上传输或保存到磁盘。

**反序列化(Deserialization)** 是从字节序列重构Java对象的过程。

**实现方式**：
- 实现`java.io.Serializable`接口（标记接口，无需实现方法）
- 使用`ObjectOutputStream`进行序列化
- 使用`ObjectInputStream`进行反序列化

**关键点**：
- 使用`transient`关键字标记不需要序列化的字段
- `serialVersionUID`用于版本控制，确保序列化与反序列化的类版本一致
- 序列化会存储对象的完整对象图（包括引用的对象）
- 反序列化不会调用构造器

**示例**：
```java
// 序列化
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"));
oos.writeObject(userObject);

// 反序列化
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"));
User user = (User)ois.readObject();
```

### 2. Java 中 Exception 和 Error 有什么区别？

**Exception（异常）**:
- 表示程序可以处理的异常情况
- 分为受检异常(Checked Exception)和非受检异常(Unchecked Exception)
- 受检异常必须被try-catch或throws声明，如IOException、SQLException
- 非受检异常是RuntimeException的子类，如NullPointerException、ArrayIndexOutOfBoundsException

**Error（错误）**:
- 表示严重问题，通常是不可恢复的
- 程序通常无法处理
- 例如OutOfMemoryError、StackOverflowError、VirtualMachineError

**主要区别**:
1. **可处理性**：Exception通常是可以被程序处理的，Error通常是不可恢复的
2. **来源**：Exception通常是程序问题，Error通常是系统或JVM问题
3. **处理责任**：Exception通常需要开发者处理，Error通常是JVM处理

**异常体系**:
```
Throwable
├── Error
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
└── Exception
    ├── IOException (checked)
    ├── SQLException (checked)
    └── RuntimeException (unchecked)
        ├── NullPointerException
        ├── ArrayIndexOutOfBoundsException
        └── ...
```

### 3. 你认为 Java 的优势是什么？

Java的主要优势包括：

1. **跨平台性**：遵循"一次编写，到处运行"(WORA)的原则，通过JVM实现
2. **面向对象**：完全支持面向对象编程范式，包括封装、继承、多态
3. **安全性**：自带安全管理机制，包括类加载器、字节码验证器和安全管理器
4. **自动内存管理**：垃圾回收机制自动处理内存分配和回收
5. **丰富的API和生态系统**：标准库全面，开源框架丰富
6. **并发支持**：内置线程支持，并发库（如java.util.concurrent）强大
7. **可靠性和稳定性**：成熟语言，大量生产环境验证
8. **向后兼容性**：新版本通常能兼容旧代码
9. **企业级支持**：适合构建大型企业应用
10. **社区活跃**：庞大的开发者社区和丰富的资源

### 4. 什么是 Java 的多态特性？

**多态(Polymorphism)** 是Java面向对象的三大特性之一（封装、继承、多态），允许一个对象在不同情况下表现出不同的行为。

**多态的类型**：
1. **编译时多态（静态多态）**：
   - 方法重载(Overloading)：同一个类中多个同名方法，参数列表不同
   - 在编译时确定调用哪个方法

2. **运行时多态（动态多态）**：
   - 方法重写(Overriding)：子类重写父类的方法
   - 在运行时根据对象的实际类型确定调用哪个方法

**实现多态的必要条件**：
1. 继承或实现（子类继承父类或实现接口）
2. 方法重写（子类重写父类或接口的方法）
3. 父类引用指向子类对象

**示例**：
```java
// 父类引用指向子类对象
Animal animal = new Dog();
animal.makeSound(); // 调用的是Dog类的makeSound方法

// 方法参数多态
public void feedAnimal(Animal animal) {
    animal.eat(); // 根据传入的具体动物调用相应的eat方法
}
```

**多态的好处**：
1. 提高代码的可扩展性和复用性
2. 降低代码耦合度
3. 使程序更加灵活和模块化
4. 支持接口编程而非实现编程

### 5. Java 中的参数传递是按值还是按引用？

**Java中的参数传递只有按值传递(pass by value)**，没有按引用传递。

**对于基本类型**：
- 传递的是实际值的副本
- 方法内对参数的修改不会影响原始变量

**对于引用类型**：
- 传递的是引用的副本（对象引用的值）
- 方法内对引用本身的修改不会影响原始引用
- 但可以通过引用副本修改引用对象的内容，这会影响到原对象

**示例**：
```java
public void testPassByValue() {
    // 基本类型
    int x = 10;
    changeValue(x); // x仍然是10
    
    // 引用类型
    StringBuilder sb = new StringBuilder("Hello");
    changeReference(sb); // sb仍然指向原对象
    modifyReference(sb); // sb的内容变为"Hello World"
}

void changeValue(int num) {
    num = 20; // 只改变副本，不影响原值
}

void changeReference(StringBuilder s) {
    s = new StringBuilder("Hi"); // 只改变引用副本，不影响原引用
}

void modifyReference(StringBuilder s) {
    s.append(" World"); // 修改引用指向的对象内容，会影响原对象
}
```

**常见误解**：
很多人认为Java对象是按引用传递的，这是因为可以通过方法修改对象内容，但严格来说这仍是值传递（传递的是引用的值）。

### 6. 为什么 Java 不支持多重继承？

**Java不支持类的多重继承**（一个类继承多个父类），但支持实现多个接口。这样设计的主要原因是：

**1. 钻石问题（Diamond Problem）**：
- 如果A类有一个方法show()，B和C都继承A并重写show()，D同时继承B和C，调用D.show()会有歧义
- 哪个父类的方法应该被执行？存在方法冲突和二义性

**2. 简化设计**：
- 单继承使类层次结构更清晰
- 避免了多父类带来的复杂性和歧义
- 降低了维护成本

**3. 实际需求的解决方案**：
- Java通过接口实现多重继承的功能特性
- 一个类可以实现多个接口
- 从Java 8开始，接口可以有默认方法和静态方法
- 可以使用组合代替继承

**示例**：
```java
// 使用接口实现多重继承功能
interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

// 一个类实现多个接口
class Duck implements Flyable, Swimmable {
    public void fly() {
        System.out.println("Duck flying");
    }
    
    public void swim() {
        System.out.println("Duck swimming");
    }
}
```

**接口的钻石问题解决**：
Java 8引入默认方法后，也可能遇到钻石问题，此时需要显式指定要使用哪个接口的默认方法，或者重写该方法。

### 7. Java 面向对象编程与面向过程编程的区别是什么？

**面向过程编程(Procedural Programming)**：
- 以过程（算法）为中心，强调步骤和顺序
- 通过一系列的指令和函数调用完成任务
- 数据和操作数据的函数是分离的
- 程序被组织为一系列函数

**面向对象编程(Object-Oriented Programming, OOP)**：
- 以对象为中心，强调数据和行为的封装
- 通过对象之间的交互完成任务
- 数据和操作数据的方法被封装在对象中
- 程序被组织为一组相互协作的对象

**主要区别**：

1. **基本单元**：
   - 面向过程：函数是基本单元
   - 面向对象：类和对象是基本单元

2. **数据组织**：
   - 面向过程：数据和函数分离
   - 面向对象：数据和方法封装在对象中

3. **重用性**：
   - 面向过程：通过函数复用
   - 面向对象：通过继承和多态实现更灵活的复用

4. **维护性**：
   - 面向过程：修改函数可能影响多处
   - 面向对象：封装使修改更加局部化

5. **抽象级别**：
   - 面向过程：较低抽象级别，关注如何实现
   - 面向对象：较高抽象级别，关注做什么

**Java作为OOP语言的特点**：
- 所有代码都在类中
- 支持封装、继承、多态三大核心特性
- 提供接口机制实现多重继承功能
- 强调对象之间的交互而非过程控制

### 8. Java 方法重载和方法重写之间的区别是什么？

**方法重载(Overloading)**：
- 在同一个类中定义多个同名但参数不同的方法
- 编译时多态，编译时根据参数确定调用哪个方法
- 参数必须不同（类型、数量或顺序）
- 返回类型可以相同也可以不同
- 访问修饰符可以相同也可以不同
- 异常声明可以相同也可以不同

**方法重写(Overriding)**：
- 子类重新实现父类中已有的方法
- 运行时多态，运行时根据对象类型确定调用哪个方法
- 方法签名必须相同（名称和参数列表）
- 返回类型必须相同或是父类方法返回类型的子类型
- 访问修饰符不能比父类方法更严格
- 不能抛出比父类方法更宽泛的检查异常

**对比表格**：

| 特性 | 方法重载(Overloading) | 方法重写(Overriding) |
|------|-------------------|------------------|
| 发生位置 | 同一个类 | 子类 |
| 参数 | 必须不同 | 必须相同 |
| 返回类型 | 可以不同 | 必须相同或子类型 |
| 访问修饰符 | 可以不同 | 不能更严格 |
| 异常 | 可以不同 | 不能更宽泛 |
| 多态类型 | 编译时多态 | 运行时多态 |
| 绑定 | 静态绑定 | 动态绑定 |

**示例**：
```java
class Parent {
    void display(int a) {
        System.out.println("Parent: " + a);
    }
    
    Object getObject() {
        return new Object();
    }
}

class Child extends Parent {
    // 方法重载
    void display(int a, int b) {
        System.out.println("Child: " + a + ", " + b);
    }
    
    // 方法重写
    @Override
    void display(int a) {
        System.out.println("Child overriding: " + a);
    }
    
    // 合法的返回类型协变
    @Override
    String getObject() {
        return "Child";
    }
}
```

### 9. 什么是 Java 内部类？它有什么作用？

**内部类(Inner Class)**是定义在另一个类内部的类。Java支持四种内部类：

**1. 成员内部类(Member Inner Class)**：
- 定义在类的成员位置
- 可以访问外部类的所有成员（包括私有）
- 可以被访问修饰符修饰
- 可以使用外部类.this引用外部类实例
- 必须通过外部类实例创建

```java
public class Outer {
    private int outerField = 1;
    
    class Inner {
        void display() {
            System.out.println("OuterField: " + outerField); // 可访问外部类私有成员
            System.out.println("OuterThis: " + Outer.this);
        }
    }
    
    void createInner() {
        Inner inner = new Inner(); // 创建内部类实例
    }
}

// 外部创建内部类实例
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

**2. 静态内部类(Static Nested Class)**：
- 使用static关键字定义
- 不能访问外部类的非静态成员
- 不需要外部类实例即可创建

```java
public class Outer {
    private static int staticOuterField = 1;
    private int outerField = 2;
    
    static class StaticNested {
        void display() {
            System.out.println(staticOuterField); // 可以访问外部类的静态成员
            // System.out.println(outerField); // 编译错误，无法访问非静态成员
        }
    }
}

// 创建静态内部类实例
Outer.StaticNested nested = new Outer.StaticNested();
```

**3. 局部内部类(Local Inner Class)**：
- 定义在方法或代码块内
- 只能在定义它的方法或代码块中使用
- 可以访问外部类成员和有效final的局部变量

```java
public class Outer {
    void method(final int param) {
        final int localVar = 10;
        
        class LocalInner {
            void display() {
                System.out.println(param); // 访问有效final参数
                System.out.println(localVar); // 访问有效final局部变量
            }
        }
        
        LocalInner inner = new LocalInner();
        inner.display();
    }
}
```

**4. 匿名内部类(Anonymous Inner Class)**：
- 没有名字的局部内部类
- 同时声明和实例化
- 通常用于创建接口或抽象类的实现

```java
public class Outer {
    void createRunnable() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous Inner Class");
            }
        };
        new Thread(r).start();
    }
}
```

**内部类的作用**：
1. **封装**：可以将类封装在另一个类中
2. **访问控制**：内部类可以访问外部类的私有成员
3. **逻辑分组**：将密切相关的类分组在一起
4. **回调实现**：便于实现回调和事件处理
5. **提高可读性和维护性**：代码组织更清晰

### 10. JDK8 有哪些新特性？

JDK 8(Java SE 8)在2014年发布，带来了许多重要的新特性，是Java语言的一次重大升级：

**1. Lambda表达式和函数式接口**
- 允许将函数作为方法参数传递
- 简化匿名内部类的使用
```java
// 使用Lambda表达式
Collections.sort(list, (a, b) -> a.compareTo(b));
```

**2. Stream API**
- 支持对集合进行函数式操作
- 提供过滤、映射、归约等操作
```java
List<String> filtered = items.stream()
    .filter(item -> item.startsWith("A"))
    .collect(Collectors.toList());
```

**3. 默认方法和静态方法**
- 接口可以有方法实现（默认方法和静态方法）
- 解决了接口演化的问题
```java
interface Vehicle {
    default void print() {
        System.out.println("I am a vehicle!");
    }
    
    static void blowHorn() {
        System.out.println("Blowing horn!");
    }
}
```

**4. 方法引用**
- 可以引用已有方法作为Lambda表达式
```java
// 方法引用示例
list.forEach(System.out::println);
```

**5. 新的日期和时间API**
- 在java.time包中引入全新的日期时间API
- 线程安全、不可变、更好的设计
```java
LocalDate today = LocalDate.now();
LocalDateTime dateTime = LocalDateTime.of(2023, Month.JANUARY, 1, 10, 30);
```

**6. Optional类**
- 更优雅地处理空值
- 避免NullPointerException
```java
Optional<String> name = Optional.ofNullable(getUserName());
String result = name.orElse("Unknown");
```

**7. Nashorn JavaScript引擎**
- 新的JavaScript引擎，替代了旧的Rhino引擎
- 提供更好的性能和兼容性

**8. Base64编码API**
- 在java.util包中内置Base64编码支持
```java
String encoded = Base64.getEncoder().encodeToString("Hello".getBytes());
```

**9. 并行数组操作**
- Arrays类中新增并行操作方法
```java
Arrays.parallelSort(array);
```

**10. 注解增强**
- 支持重复注解
- 支持类型注解（可以在任何使用类型的地方使用注解）

**11. JVM改进**
- 移除永久代(PermGen)，引入元空间(Metaspace)
- G1垃圾收集器改进

**12. 其他新特性**
- CompletableFuture提供强大的异步编程支持
- StampedLock提供乐观读锁支持
- String.join()方法简化字符串连接
- Files类增强，支持更多文件操作

### 11. Java 中 String、StringBuffer 和 StringBuilder 的区别是什么？

**可变性**：
- **String**：不可变，一旦创建内容不能修改
- **StringBuffer**：可变，线程安全
- **StringBuilder**：可变，非线程安全，但性能更好

**线程安全性**：
- **String**：不可变，因此线程安全
- **StringBuffer**：线程安全，方法使用synchronized修饰
- **StringBuilder**：非线程安全，没有同步措施

**性能比较**：
- **String**：每次操作都会创建新对象，性能最差
- **StringBuffer**：同步操作带来额外开销，性能中等
- **StringBuilder**：无同步开销，性能最好

**适用场景**：
- **String**：适用于少量操作、不经常修改、多线程共享的场景
- **StringBuffer**：适用于多线程环境下字符串频繁修改的场景
- **StringBuilder**：适用于单线程环境下字符串频繁修改的场景

**内部实现**：
- 所有实现都是基于字符数组
- StringBuffer和StringBuilder都继承自AbstractStringBuilder
- 区别在于StringBuffer的方法使用synchronized关键字修饰

**代码示例**：
```java
// String 每次操作创建新对象
String str = "Hello";
str = str + " World"; // 创建了新的String对象

// StringBuffer 同步操作，线程安全
StringBuffer sbuf = new StringBuffer("Hello");
sbuf.append(" World"); // 原对象被修改，线程安全

// StringBuilder 非同步操作，性能最佳
StringBuilder sbld = new StringBuilder("Hello");
sbld.append(" World"); // 原对象被修改，非线程安全
```

**性能测试**（添加10000个字符）：
- StringBuilder: ~10ms
- StringBuffer: ~100ms
- String: ~50000ms

### 12. Java 的 StringBuilder 是怎么实现的？

**StringBuilder**是Java中用于高效处理可变字符串的类，它的主要实现特点包括：

**1. 内部数据结构**：
- 内部使用字符数组(`char[]`)存储数据（JDK 9之前）
- JDK 9及之后使用字节数组(`byte[]`)，采用Latin-1或UTF-16编码
- 继承自AbstractStringBuilder抽象类

**2. 动态扩容机制**：
- 初始默认容量为16个字符
- 当内容超出容量时自动扩容
- 扩容策略：新容量 = 旧容量 * 2 + 2
- 容量可以通过构造函数预先指定

**3. 非线程安全**：
- 没有同步措施保证线程安全
- 优先考虑性能，没有同步开销
- 多线程环境需使用StringBuffer

**4. 主要操作方法**：
- `append()`: 添加内容到末尾
- `insert()`: 在指定位置插入内容
- `delete()`: 删除指定范围的内容
- `replace()`: 替换指定范围的内容
- `reverse()`: 反转字符串内容
- `toString()`: 转换为String对象

**5. 源码关键片段**：
```java
// JDK 8中的关键实现（简化版）
abstract class AbstractStringBuilder {
    char[] value; // 存储字符
    int count;    // 当前使用的长度
    
    // 扩容方法
    void expandCapacity(int minimumCapacity) {
        int newCapacity = (value.length * 2) + 2;
        if (newCapacity < minimumCapacity)
            newCapacity = minimumCapacity;
        value = Arrays.copyOf(value, newCapacity);
    }
}

// StringBuilder继承实现
public final class StringBuilder extends AbstractStringBuilder {
    // append方法（无同步）
    @Override
    public StringBuilder append(String str) {
        super.append(str);
        return this;
    }
    // 其他方法...
}
```

**6. 优化技巧**：
- 预估容量以减少扩容次数
- 链式调用提高可读性和便捷性
- 单线程环境下优先使用StringBuilder

### 13. Java 中包装类型和基本类型的区别是什么？

**基本类型(Primitive Types)**和**包装类型(Wrapper Classes)**是Java中两种不同的数据类型系统：

**基本类型**：
- 直接存储值，非对象
- 存储在栈内存中
- 性能更好，内存占用小
- 不能为null
- 不具备方法和属性
- 包括：byte、short、int、long、float、double、char、boolean

**包装类型**：
- 对基本类型的对象封装
- 引用存储在栈中，对象存储在堆中
- 性能较差，内存占用大
- 可以为null
- 具有类的方法和属性
- 包括：Byte、Short、Integer、Long、Float、Double、Character、Boolean

**主要区别**：

| 特性 | 基本类型 | 包装类型 |
|------|---------|---------|
| 默认值 | 0/false | null |
| 可为null | 否 | 是 |
| 存储位置 | 栈内存 | 堆内存 |
| 性能 | 高 | 较低 |
| 方法调用 | 不支持 | 支持 |
| 泛型支持 | 不支持 | 支持 |

**自动装箱与拆箱**：
- 自动装箱(Autoboxing)：基本类型自动转换为包装类型
- 自动拆箱(Unboxing)：包装类型自动转换为基本类型

```java
// 自动装箱
Integer num = 10; // int 自动转为 Integer

// 自动拆箱
int value = num; // Integer 自动转为 int
```

**使用场景**：
- 基本类型：对性能要求高、内存敏感、值不为null的场景
- 包装类型：泛型集合、可能为null的情况、需要使用对象方法的场景

**注意事项**：
- 包装类型的"=="比较可能出现意外结果（比较对象引用）
- Integer缓存池(-128到127的值被缓存)会影响"=="比较结果
- 包装类型涉及装箱/拆箱操作，频繁操作会影响性能

### 14. 接口和抽象类有什么区别？

接口(Interface)和抽象类(Abstract Class)都是Java中支持抽象的机制，但它们有以下重要区别：

**1. 实现与继承**
- 抽象类：类通过`extends`关键字继承，只能单继承
- 接口：类通过`implements`关键字实现，可以实现多个接口

**2. 成员特性**
- 抽象类：可以有构造方法、实例变量、普通方法、抽象方法
- 接口：只能有常量(public static final)、抽象方法、默认方法(Java 8+)、静态方法(Java 8+)、私有方法(Java 9+)

**3. 修饰符**
- 抽象类：类和方法可以有各种访问修饰符
- 接口：方法默认是public abstract，变量默认是public static final

**4. 设计目的**
- 抽象类：表示"是什么"(is-a)关系，强调类的继承
- 接口：表示"能做什么"(can-do)关系，强调行为的契约

**5. 使用场景**
- 抽象类：当需要共享代码和状态时
- 接口：当需要定义契约而不关心具体实现时

**6. 默认方法(Java 8+)**
- 抽象类：可以有默认实现的方法
- 接口：从Java 8开始可以有默认方法(default)和静态方法(static)

**代码对比**：
```java
// 抽象类示例
abstract class Animal {
    // 构造方法
    public Animal() { }
    
    // 实例变量
    protected String name;
    
    // 普通方法
    public void setName(String name) {
        this.name = name;
    }
    
    // 抽象方法
    public abstract void makeSound();
}

// 接口示例
interface Flyable {
    // 常量(隐式public static final)
    int MAX_HEIGHT = 10000;
    
    // 抽象方法(隐式public abstract)
    void fly();
    
    // 默认方法(Java 8+)
    default void glide() {
        System.out.println("Gliding...");
    }
    
    // 静态方法(Java 8+)
    static boolean canFly(Object obj) {
        return obj instanceof Flyable;
    }
    
    // 私有方法(Java 9+)
    private void helper() {
        System.out.println("Helper method");
    }
}
```

**最佳实践**：
- 优先使用接口，更灵活
- 当需要共享代码实现时使用抽象类
- 使用接口定义类型，使用抽象类提供基础实现
- 有时可以组合使用：抽象类实现接口，提供部分默认实现

### 15. JDK 和 JRE 有什么区别？

**JDK (Java Development Kit)**和**JRE (Java Runtime Environment)**是Java平台的两个重要组件：

**JDK (Java开发工具包)**：
- 包含了开发Java应用程序所需的所有工具
- **包含JRE**，提供运行环境
- 包含**编译器**(javac)，用于将Java源代码转换为字节码
- 包含**调试器**(jdb)，用于调试Java程序
- 包含**文档生成器**(javadoc)，用于生成API文档
- 包含其他开发工具：jar、javap、jlink等

**JRE (Java运行时环境)**：
- 提供运行Java应用程序的环境
- 包含**JVM** (Java虚拟机)，执行Java字节码
- 包含**核心类库**，提供标准API
- 包含**运行时库**，支持JVM运行
- **不包含**开发工具(如编译器)

**组件关系图**：
```
┌────────────────────────────────────┐
│  JDK (Java Development Kit)        │
│  ┌──────────────────────────────┐  │
│  │  开发工具:                   │  │
│  │  - javac (编译器)            │  │
│  │  - jdb (调试器)              │  │
│  │  - javadoc (文档生成器)      │  │
│  │  - jar, jlink, jps等         │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  JRE                  │  │  │
│  │  │  ┌─────────────────┐  │  │  │
│  │  │  │  Java虚拟机    │  │  │  │
│  │  │  │  (JVM)         │  │  │  │
│  │  │  └─────────────────┘  │  │  │
│  │  │                        │  │  │
│  │  │  ┌─────────────────┐  │  │  │
│  │  │  │  类库和API      │  │  │  │
│  │  │  └─────────────────┘  │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**主要区别**：

| 特性 | JDK | JRE |
|------|-----|-----|
| 主要用途 | 开发Java程序 | 运行Java程序 |
| 包含组件 | 开发工具 + JRE | JVM + 类库 |
| 目标用户 | 开发人员 | 终端用户 |
| 安装大小 | 较大 | 较小 |

**实际应用**：
- 如果只需要**运行**Java应用程序，安装JRE即可
- 如果需要**开发**Java应用程序，必须安装JDK
- 大多数开发人员直接安装JDK，因为它包含JRE

**版本发展**：
- 从JDK 9开始，Oracle改变了版本命名和发布策略
- JDK现在包含JRE，但不再单独提供JRE下载
- 可以使用jlink工具创建自定义运行时镜像

### 16. 你使用过哪些 JDK 提供的工具？

JDK提供了丰富的开发和诊断工具，以下是一些常用工具及其用途：

**1. 编译和构建工具**：
- **javac**：Java编译器，将.java源文件编译为.class字节码文件
- **jar**：创建和管理JAR(Java Archive)文件，打包Java应用
- **javadoc**：从源代码中生成API文档
- **jlink**：(Java 9+)创建自定义运行时镜像，生成包含特定模块的精简JRE

**2. 运行工具**：
- **java**：运行Java应用程序的启动器
- **javaw**：Windows平台上不带控制台的Java启动器
- **jdb**：Java调试器，用于调试Java程序
- **jshell**：(Java 9+)Java交互式REPL环境

**3. 诊断工具**：
- **jstat**：监视JVM统计信息（GC、类加载等）
- **jmap**：生成堆转储(heap dump)，分析内存使用
- **jstack**：生成线程堆栈转储，分析线程状态和死锁
- **jcmd**：向运行中的JVM发送诊断命令
- **jconsole**：图形化JVM监控工具
- **jvisualvm**：更强大的可视化监控、故障排除和分析工具
- **jmc**：Java Mission Control，高级监控和管理工具

**4. 安全工具**：
- **keytool**：管理密钥和证书，用于安全通信
- **jarsigner**：JAR文件签名和验证工具

**5. 国际化工具**：
- **native2ascii**：转换包含非ASCII字符的文件

**6. 远程方法调用工具**：
- **rmic**：生成远程对象存根和骨架类
- **rmid**：启动激活系统守护进程

**7. 脚本工具**：
- **jrunscript**：Java命令行脚本外壳

**工具使用场景**：
```bash
# 编译Java源文件
javac MyClass.java

# 运行Java应用
java -cp . com.example.MainClass

# 创建JAR包
jar cf myapp.jar *.class

# 查看运行中的Java进程
jps -l

# 分析堆内存使用情况
jmap -heap <pid>

# 检查线程状态和死锁
jstack <pid>

# 监控GC活动
jstat -gc <pid> 1000
```

**最常用工具组合**：
- 日常开发：javac、java、jar
- 性能分析：jstat、jmap、jstack、jconsole
- 问题诊断：jvisualvm、jmc

### 17. Java 中 hashCode 和 equals 方法是什么？它们与 == 操作符有什么区别？

**equals方法**：
- 定义在Object类中，用于比较两个对象的内容是否相等
- 默认实现比较对象的引用（即内存地址）
- 可被子类重写以实现自定义的相等性比较逻辑
- 应该满足自反性、对称性、传递性、一致性和非空性

**hashCode方法**：
- 定义在Object类中，返回对象的哈希码值（一个整数）
- 默认实现返回对象的内存地址的某种转换（依赖于JVM实现）
- 用于在哈希表数据结构（如HashMap、HashSet）中高效存储和检索对象
- 相等的对象必须有相等的哈希码

**== 操作符**：
- 用于比较基本类型的值或引用类型的引用（内存地址）
- 对于基本类型：比较实际值是否相等
- 对于引用类型：比较引用是否指向同一对象

**三者的关键区别**：

| 特性 | hashCode | equals | == |
|------|----------|--------|-----|
| 返回类型 | int | boolean | boolean |
| 比较内容 | 生成对象的哈希值 | 对象的逻辑相等性 | 值相等或引用相等 |
| 使用场景 | 哈希数据结构 | 对象内容比较 | 基本类型比较或引用比较 |

**hashCode与equals的关系**：
1. 如果两个对象equals比较相等，它们的hashCode值必须相同
2. 如果两个对象hashCode值相同，它们不一定equals相等
3. 重写equals方法时必须同时重写hashCode方法

**示例代码**：
```java
public class Person {
    private String name;
    private int age;
    
    // 构造器等代码省略
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true; // 引用相同直接返回true
        if (obj == null || getClass() != obj.getClass()) return false;
        
        Person person = (Person) obj;
        return age == person.age && 
               Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

// 使用示例
Person p1 = new Person("John", 30);
Person p2 = new Person("John", 30);
Person p3 = p1;

System.out.println(p1.equals(p2)); // true (内容相等)
System.out.println(p1 == p2);      // false (不同对象)
System.out.println(p1 == p3);      // true (相同引用)
System.out.println(p1.hashCode() == p2.hashCode()); // true (内容相等,哈希码相等)
```

**常见错误**：
- 只重写equals不重写hashCode
- 在equals中使用==比较String或其他对象
- 忽略equals的对称性或传递性

### 18. Java 中的 hashCode 和 equals 方法之间有什么关系？

**hashCode和equals方法之间存在密切的关系**，这种关系由Object类的通用约定(general contract)定义：

**1. 一致性原则**：
- 如果两个对象通过equals方法比较相等，则它们的hashCode方法必须返回相同的值
- 反之不成立：hashCode相同的两个对象不一定equals相等（哈希冲突）

**2. 稳定性原则**：
- 在对象的equals比较上使用的属性没有修改的情况下，多次调用hashCode应返回相同的值
- 不同的程序执行可以产生不同的哈希码（不需要在程序执行之间保持一致）

**3. 性能考虑**：
- hashCode应该分散良好，尽量减少碰撞
- hashCode计算应该高效，因为在哈希表中频繁调用

**实际应用场景**：
- 在HashMap、HashSet等基于哈希的集合类中广泛使用
- 这些集合先使用hashCode快速确定可能的存储桶
- 然后使用equals进行精确匹配

**哈希集合的工作原理**：
```
步骤1: 计算key的hashCode
步骤2: 根据hashCode确定存储桶位置
步骤3: 在该存储桶中用equals方法查找精确匹配
```

**正确实现示例**：
```java
public class Student {
    private String id;
    private String name;
    
    // 构造器等代码省略
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Student student = (Student) o;
        return Objects.equals(id, student.id); // 仅基于id比较
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id); // 仅基于id计算哈希
        // 注意：equals和hashCode使用相同的字段
    }
}
```

**不正确实现的后果**：
1. **只重写equals，不重写hashCode**：
   - 对象在HashMap中可能无法正常查找
   - 可能导致意外的重复元素出现在HashSet中
   
2. **只重写hashCode，不重写equals**：
   - 不符合equals和hashCode的约定
   - 可能导致不一致的行为

3. **equals和hashCode使用不同的字段**：
   - 可能导致equals相等的对象在哈希集合中被视为不同对象

**最佳实践**：
- 同时重写equals和hashCode方法
- 使用相同的字段来决定对象相等性和计算哈希码
- 考虑使用IDE生成这些方法或使用Lombok等库
- Java 7+中使用Objects.equals()和Objects.hash()

### 19. 什么是 Java 中的动态代理？

**动态代理**是Java反射机制的一部分，允许在运行时创建接口的实现类，而无需在编译时就确定具体的实现类。

**动态代理的主要用途**：
1. 面向切面编程(AOP)
2. 远程方法调用(RMI)
3. 依赖注入框架
4. 数据库连接和事务管理
5. 方法调用的日志记录、性能监控、安全控制等

**Java中两种主要的动态代理机制**：

**1. JDK动态代理**：
- 基于Java反射API实现
- 只能代理实现了接口的类
- 通过`java.lang.reflect.Proxy`类和`InvocationHandler`接口实现
- 生成的代理类是接口的实现

**JDK动态代理示例**：
```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 定义接口
interface UserService {
    void addUser(String name);
    String findUser(int id);
}

// 实现类
class UserServiceImpl implements UserService {
    @Override
    public void addUser(String name) {
        System.out.println("Adding user: " + name);
    }
    
    @Override
    public String findUser(int id) {
        return "User " + id;
    }
}

// 调用处理器
class LoggingInvocationHandler implements InvocationHandler {
    private final Object target;
    
    public LoggingInvocationHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Before method: " + method.getName());
        Object result = method.invoke(target, args);
        System.out.println("After method: " + method.getName());
        return result;
    }
}

// 使用动态代理
public class Main {
    public static void main(String[] args) {
        // 创建目标对象
        UserService userService = new UserServiceImpl();
        
        // 创建调用处理器
        InvocationHandler handler = new LoggingInvocationHandler(userService);
        
        // 创建代理对象
        UserService proxy = (UserService) Proxy.newProxyInstance(
            UserService.class.getClassLoader(),
            new Class<?>[] { UserService.class },
            handler
        );
        
        // 通过代理调用方法
        proxy.addUser("Alice");
        String user = proxy.findUser(123);
    }
}
```

**2. CGLIB代理**：
- 基于ASM字节码操作框架
- 可以代理没有实现接口的类（通过继承）
- 性能通常优于JDK动态代理
- 不能代理final类或final方法
- Spring框架当中如果bean没有实现接口则默认使用CGLIB代理

**CGLIB代理示例**：
```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

// 普通类(不实现接口)
class UserService {
    public void addUser(String name) {
        System.out.println("Adding user: " + name);
    }
    
    public String findUser(int id) {
        return "User " + id;
    }
}

// 方法拦截器
class LoggingMethodInterceptor implements MethodInterceptor {
    @Override
    public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
        System.out.println("Before method: " + method.getName());
        Object result = proxy.invokeSuper(obj, args);
        System.out.println("After method: " + method.getName());
        return result;
    }
}

// 使用CGLIB代理
public class Main {
    public static void main(String[] args) {
        // 创建增强器
        Enhancer enhancer = new Enhancer();
        // 设置父类
        enhancer.setSuperclass(UserService.class);
        // 设置回调
        enhancer.setCallback(new LoggingMethodInterceptor());
        
        // 创建代理对象
        UserService proxy = (UserService) enhancer.create();
        
        // 通过代理调用方法
        proxy.addUser("Bob");
        String user = proxy.findUser(456);
    }
}
```

**JDK代理与CGLIB代理的对比**：

| 特性 | JDK动态代理 | CGLIB代理 |
|------|------------|----------|
| 实现方式 | 基于接口 | 基于继承 |
| 代理对象类型 | 接口的实现 | 目标类的子类 |
| 限制 | 只能代理接口 | 不能代理final类/方法 |
| 性能 | 较低 | 较高(尤其多次调用) |
| 内置于JDK | 是 | 否(需要额外依赖) |
| 用途 | 面向接口编程 | 非接口类的代理 |

### 20. JDK 动态代理和 CGLIB 动态代理有什么区别？

JDK动态代理和CGLIB动态代理是Java中两种主要的动态代理实现方式，它们具有不同的工作原理和适用场景：

**1. 实现原理**：
- **JDK动态代理**：基于Java标准库的`java.lang.reflect.Proxy`类实现，通过反射机制在运行时生成接口实现类
- **CGLIB动态代理**：基于字节码操作库ASM实现，通过生成目标类的子类来实现代理

**2. 代理对象创建**：
- **JDK动态代理**：
  ```java
  Interface proxy = (Interface) Proxy.newProxyInstance(
      classLoader,
      new Class[] { Interface.class },
      new InvocationHandler() {
          @Override
          public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
              // 前置处理
              Object result = method.invoke(target, args);
              // 后置处理
              return result;
          }
      }
  );
  ```
  
- **CGLIB动态代理**：
  ```java
  Enhancer enhancer = new Enhancer();
  enhancer.setSuperclass(TargetClass.class);
  enhancer.setCallback(new MethodInterceptor() {
      @Override
      public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
          // 前置处理
          Object result = proxy.invokeSuper(obj, args);
          // 后置处理
          return result;
      }
  });
  TargetClass proxy = (TargetClass) enhancer.create();
  ```

**3. 关键区别**：

| 区别点 | JDK动态代理 | CGLIB动态代理 |
|--------|------------|--------------|
| **代理方式** | 接口代理 | 类继承代理 |
| **必要条件** | 目标类必须实现接口 | 目标类不需要实现接口 |
| **生成方式** | 生成接口的实现类 | 生成目标类的子类 |
| **依赖关系** | JDK内置(rt.jar) | 第三方库(cglib.jar) |
| **方法调用** | 通过反射调用 | 通过FastClass机制 |
| **使用限制** | 只能代理接口方法 | 不能代理final类或方法 |
| **调用速度** | 首次调用慢，后续调用一般 | 首次调用慢，后续调用快 |
| **内存占用** | 较低 | 较高(生成更多类) |

**4. 性能对比**：
- **首次调用**：两者都需要生成代理类，性能相似
- **后续调用**：CGLIB通常更快，因为使用FastClass机制而非反射
- **JDK 8+**：JDK代理性能得到显著改进，差距缩小

**5. 适用场景**：
- **JDK动态代理**：
  - 基于接口的编程
  - 不需要额外依赖
  - 内存受限的环境
  - 代理接口方法
  
- **CGLIB动态代理**：
  - 目标类没有实现接口
  - 需要代理非接口方法
  - 性能要求高的场景
  - 需要代理类而非接口

**6. 框架使用**：
- **Spring AOP**：
  - 优先使用JDK动态代理
  - 目标类没有实现接口时，自动切换到CGLIB代理
  - 可通过`proxy-target-class`配置强制使用CGLIB
  
- **Hibernate**：
  - 使用CGLIB创建延迟加载代理

**7. 代码示例对比**：
```java
// 两种代理方式对比

// 共同的接口
interface Service {
    void doSomething();
}

// 目标类
class ServiceImpl implements Service {
    @Override
    public void doSomething() {
        System.out.println("Doing something...");
    }
}

// JDK动态代理
Service jdkProxy = (Service) Proxy.newProxyInstance(
    Service.class.getClassLoader(),
    new Class<?>[] { Service.class },
    (proxy, method, args) -> {
        System.out.println("JDK proxy before");
        Object result = method.invoke(new ServiceImpl(), args);
        System.out.println("JDK proxy after");
        return result;
    }
);

// CGLIB动态代理
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(ServiceImpl.class);
enhancer.setCallback((MethodInterceptor) (obj, method, args, proxy) -> {
    System.out.println("CGLIB proxy before");
    Object result = proxy.invokeSuper(obj, args);
    System.out.println("CGLIB proxy after");
    return result;
});
Service cglibProxy = (Service) enhancer.create();
```

**总结**：选择JDK代理还是CGLIB代理主要取决于目标类是否实现接口、性能要求以及项目依赖情况。

### 21. Java 中的注解原理是什么？

**注解(Annotation)**是Java 5引入的一种特殊类型的接口，用于为代码添加元数据。它们不会直接影响代码逻辑，但可以被编译器、开发工具和运行时环境使用，实现额外的功能。

**1. 注解的定义**：
```java
// 定义一个简单的注解
public @interface MyAnnotation {
    String value() default "";
    int count() default 0;
}
```

**2. 元注解**：用于注解其他注解的特殊注解。

- **@Retention**：定义注解的保留策略
  - SOURCE：仅在源码中保留，编译时丢弃
  - CLASS：保留到编译后的类文件，但运行时不可用（默认值）
  - RUNTIME：运行时可通过反射访问

- **@Target**：定义注解可应用的元素类型
  - TYPE：类、接口、枚举
  - FIELD：字段
  - METHOD：方法
  - PARAMETER：方法参数
  - CONSTRUCTOR：构造器
  - LOCAL_VARIABLE：局部变量
  - ANNOTATION_TYPE：注解
  - PACKAGE：包
  - TYPE_PARAMETER(Java 8)：类型参数
  - TYPE_USE(Java 8)：类型使用

- **@Documented**：指示注解应被JavaDoc工具记录

- **@Inherited**：表示注解可被子类继承

- **@Repeatable(Java 8)**：表示注解可在同一元素上多次使用

**3. 注解的工作原理**：

**编译时处理**：
- 编译器在编译时识别注解
- 可通过注解处理器(Annotation Processor)在编译期处理注解
- 注解处理器可生成新的源文件、修改编译过程等

**运行时处理**：
- 使用Java反射API获取运行时注解信息
- 运行时根据注解信息修改程序行为

**4. 反射获取注解示例**：
```java
// 获取类上的注解
Class<?> clazz = MyClass.class;
MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
if (annotation != null) {
    System.out.println(annotation.value());
    System.out.println(annotation.count());
}

// 获取方法上的注解
Method method = clazz.getMethod("myMethod");
MyAnnotation methodAnnotation = method.getAnnotation(MyAnnotation.class);

// 获取字段上的注解
Field field = clazz.getDeclaredField("myField");
MyAnnotation fieldAnnotation = field.getAnnotation(MyAnnotation.class);
```

**5. 注解处理器**：
- 实现`javax.annotation.processing.Processor`接口
- 在编译时对代码中的注解进行处理
- 用于生成额外代码、验证或文档生成等
- 通过SPI机制注册处理器

```java
@SupportedAnnotationTypes("com.example.MyAnnotation")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MyProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        // 处理注解逻辑
        return true;
    }
}
```

**6. 注解的实现机制**：
- 注解本质上是特殊的接口，继承自`java.lang.annotation.Annotation`
- 编译器会为每个注解生成代理类，实现注解接口
- 注解信息被存储在类文件的属性表中
- JVM加载类时，会解析这些属性并构建内存中的注解对象

**7. 注解的应用场景**：
- **配置信息**：如Spring的`@Component`, `@Autowired`
- **编译检查**：如`@Override`, `@Deprecated`
- **代码生成**：如Lombok的`@Data`, `@Builder`
- **运行时处理**：如JUnit的`@Test`, `@Before`
- **API文档**：如Swagger的`@Api`, `@ApiOperation`

**8. 常见的内置注解**：
- `@Override`：声明方法覆盖父类方法
- `@Deprecated`：标记已过时的元素
- `@SuppressWarnings`：抑制编译器警告
- `@SafeVarargs`：抑制与可变参数相关的警告
- `@FunctionalInterface`：声明函数式接口

**9. Java 8后的注解增强**：
- 类型注解：可以在任何使用类型的地方使用注解
- 重复注解：同一元素可以多次应用相同的注解
- 方法参数反射：可以获取方法参数的名称

### 22. 你使用过 Java 的反射机制吗？如何应用反射？

**反射(Reflection)**是Java的一个强大特性，允许程序在运行时检查和操作类、接口、字段和方法。反射打破了Java的封装性，使程序能够访问原本无法访问的成员，并在运行时动态地创建对象和调用方法。

**1. 反射的核心类**：

- **Class类**：表示类的元信息，是反射的入口点
- **Constructor**：表示类的构造方法
- **Method**：表示类的方法
- **Field**：表示类的字段
- **Parameter(Java 8)**：表示方法参数
- **Annotation**：表示注解

**2. 获取Class对象的方式**：

```java
// 方式1：通过对象的getClass()方法
String str = "Hello";
Class<?> clazz1 = str.getClass();

// 方式2：通过类字面常量
Class<?> clazz2 = String.class;

// 方式3：通过Class.forName()方法
Class<?> clazz3 = Class.forName("java.lang.String");

// 方式4：通过类加载器
ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
Class<?> clazz4 = classLoader.loadClass("java.lang.String");
```

**3. 反射创建对象**：

```java
// 使用Class.newInstance()方法(已过时)
Object obj1 = clazz.newInstance();

// 获取Constructor并创建对象
Constructor<?> constructor1 = clazz.getConstructor(); // 无参构造器
Object obj2 = constructor1.newInstance();

// 带参数的构造器
Constructor<?> constructor2 = clazz.getConstructor(String.class);
Object obj3 = constructor2.newInstance("Hello");
```

**4. 访问和修改字段**：

```java
// 获取公共字段
Field publicField = clazz.getField("fieldName");

// 获取任何字段(包括private)
Field privateField = clazz.getDeclaredField("privatefield");
privateField.setAccessible(true); // 绕过访问限制

// 获取字段值
Object value = privateField.get(obj);

// 设置字段值
privateField.set(obj, newValue);
```

**5. 调用方法**：

```java
// 获取公共方法
Method publicMethod = clazz.getMethod("methodName", paramTypes);

// 获取任何方法(包括private)
Method privateMethod = clazz.getDeclaredMethod("privateMethod", paramTypes);
privateMethod.setAccessible(true); // 绕过访问限制

// 调用方法
Object result = privateMethod.invoke(obj, args);

// 调用静态方法
Object result = staticMethod.invoke(null, args);
```

**6. 获取泛型信息**：

```java
// 获取字段的泛型类型
Field field = clazz.getDeclaredField("listField");
Type genericType = field.getGenericType();

if (genericType instanceof ParameterizedType) {
    ParameterizedType pType = (ParameterizedType) genericType;
    Type[] typeArguments = pType.getActualTypeArguments();
    for (Type typeArgument : typeArguments) {
        Class<?> typeClass = (Class<?>) typeArgument;
        System.out.println("泛型类型: " + typeClass);
    }
}
```

**7. 反射获取注解**：

```java
// 获取类上的注解
Annotation[] annotations = clazz.getAnnotations();

// 获取指定类型的注解
MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);

// 获取方法上的注解
Method method = clazz.getMethod("myMethod");
MyAnnotation methodAnnotation = method.getAnnotation(MyAnnotation.class);
```

**8. 反射的应用场景**：

- **框架开发**：
  - Spring的依赖注入和AOP
  - Hibernate的ORM映射
  - JUnit的测试运行器

- **动态代理**：
  - JDK动态代理使用反射实现接口方法调用
  - 实现AOP切面功能

- **序列化与反序列化**：
  - JSON/XML与对象的相互转换

- **配置文件处理**：
  - 根据配置动态加载和使用类

- **注解处理**：
  - 运行时解析注解并执行相应逻辑

**9. 反射的优缺点**：

**优点**：
- 提高了程序的灵活性和扩展性
- 使框架开发成为可能
- 支持动态加载和使用类

**缺点**：
- 性能开销较大，反射操作比直接调用慢
- 破坏了封装性，可能导致安全问题
- 代码可读性和可维护性降低
- 编译时类型检查失效，可能导致运行时错误

**10. 提高反射性能的技巧**：

- 缓存Constructor/Method/Field对象
- 减少反射调用次数
- 使用setAccessible(true)提高私有成员访问速度

**11. 反射的安全限制**：
- 需要适当的权限才能反射访问私有成员
- SecurityManager可以限制反射操作
- Java模块系统(Java 9+)可以控制反射访问

### 23. 什么是 Java 中的不可变类？

**不可变类(Immutable Class)**是指一旦创建，其实例的状态就不能被改变的类。在Java中，String、Integer等包装类以及BigDecimal、BigInteger都是不可变类的典型例子。

**1. 不可变类的特点**：

- 实例创建后状态不能被修改
- 所有字段都是final的（最佳实践）
- 适当地封装字段（通常是private）
- 不提供修改状态的方法
- 保护性地管理任何可变组件
- 必要时创建对象的防御性拷贝

**2. 创建不可变类的规则**：

1. **将类声明为final**，防止子类化
2. **将所有字段声明为private final**
3. **不提供修改字段的方法**
4. **特别注意包含可变对象引用的字段**：
   - 构造器中创建可变对象的副本
   - getter方法返回可变对象的副本
5. **确保正确处理对象的序列化**（如果需要可序列化）

**3. 不可变类的示例**：

```java
public final class ImmutablePerson {
    private final String name;
    private final int age;
    private final List<String> hobbies; // 可变对象引用

    public ImmutablePerson(String name, int age, List<String> hobbies) {
        this.name = name;
        this.age = age;
        // 创建防御性副本
        this.hobbies = new ArrayList<>(hobbies);
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public List<String> getHobbies() {
        // 返回防御性副本
        return new ArrayList<>(hobbies);
    }

    // 不提供setter方法

    // 提供修改状态的方法时返回新实例
    public ImmutablePerson withName(String newName) {
        return new ImmutablePerson(newName, age, hobbies);
    }

    public ImmutablePerson withAge(int newAge) {
        return new ImmutablePerson(name, newAge, hobbies);
    }
}
```

**4. String类的不可变性**：

String是Java中最常用的不可变类：
- String类被声明为final
- 内部字符数组是private final的
- 没有修改内部状态的方法
- 所有修改操作都返回新的String对象

```java
public final class String implements Serializable, Comparable<String>, CharSequence {
    private final char[] value; // JDK 9之前
    // 或
    private final byte[] value; // JDK 9之后
    
    // 其他字段和方法
}
```

**5. 不可变类的优势**：

1. **线程安全**：
   - 不可变对象天生是线程安全的，无需同步
   - 可以在多线程间自由共享

2. **简化并发编程**：
   - 不存在竞态条件
   - 可以安全地用作HashMap的键

3. **防御性拷贝不再需要**：
   - 状态不会改变，因此不需要防御性拷贝
   - 但仍需注意可变组件

4. **失败原子性**：
   - 操作要么成功，要么失败，没有中间状态

5. **缓存友好**：
   - 对象不变，哈希码可以缓存

**6. 不可变类的局限性**：

1. **为每个不同的值创建新对象**：
   - 可能导致过多对象创建
   - 在某些场景下有性能影响

2. **构造复杂对象系统可能较为繁琐**：
   - 每次修改都需要创建新实例

**7. 不可变类设计模式**：

1. **Builder模式**：
   - 用于创建复杂的不可变对象
   - 分离构建过程和表示

```java
public final class ImmutablePerson {
    private final String name;
    private final int age;
    private final List<String> hobbies;
    
    private ImmutablePerson(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.hobbies = new ArrayList<>(builder.hobbies);
    }
    
    // Getters...
    
    public static class Builder {
        private String name;
        private int age;
        private List<String> hobbies = new ArrayList<>();
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder addHobby(String hobby) {
            this.hobbies.add(hobby);
            return this;
        }
        
        public ImmutablePerson build() {
            return new ImmutablePerson(this);
        }
    }
}
```

2. **工厂方法**：
   - 提供静态工厂方法创建对象
   - 隐藏实现细节，增强API灵活性

**8. 在现代Java中的应用**：
- Java Records (JDK 16+)提供了创建不可变数据类的简洁方式
- Collections.unmodifiableXxx()方法创建不可变集合视图
- Stream API的使用减少了创建中间不可变对象的需求
- Collectors.toUnmodifiableXxx()收集到不可变集合

### 24. 什么是 Java 的 SPI（Service Provider Interface）机制？

**SPI(Service Provider Interface)**是Java提供的一种服务发现机制，允许应用程序动态地发现和加载服务提供者的实现。SPI机制通过在classpath中的特定目录下定义接口的实现来工作，使得服务提供者和服务使用者解耦。

**1. SPI的基本概念**：

- **服务接口**：定义服务的行为和能力
- **服务提供者**：实现服务接口的具体类
- **服务加载器**：用于发现和加载服务实现的工具类(java.util.ServiceLoader)

**2. SPI的工作流程**：

1. 定义服务接口
2. 创建接口的实现类
3. 在META-INF/services/目录下创建以接口全限定名命名的文件
4. 在文件中列出实现类的全限定名
5. 使用ServiceLoader加载实现类

**3. 简单示例**：

**1) 定义服务接口**：
```java
package com.example.spi;

public interface MessageService {
    String getMessage();
}
```

**2) 创建实现类**：
```java
package com.example.spi.impl;

import com.example.spi.MessageService;

public class EmailMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "Email Message";
    }
}

public class SmsMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "SMS Message";
    }
}
```

**3) 创建配置文件**：
在`META-INF/services/com.example.spi.MessageService`文件中添加：
```
com.example.spi.impl.EmailMessageService
com.example.spi.impl.SmsMessageService
```

**4) 使用ServiceLoader加载服务**：
```java
ServiceLoader<MessageService> serviceLoader = ServiceLoader.load(MessageService.class);
for (MessageService service : serviceLoader) {
    System.out.println(service.getMessage());
}
```

**4. SPI在Java核心库中的应用**：

1. **JDBC驱动加载**：
   - java.sql.Driver接口
   - 各数据库厂商提供Driver实现
   - DriverManager通过SPI加载驱动

2. **日志框架集成**：
   - java.util.logging.spi包
   - 替换默认日志实现

3. **Java扩展机制**：
   - javax.imageio.spi包的图像I/O
   - javax.sound.sampled.spi的声音系统

4. **Java加密扩展(JCE)**：
   - java.security.Provider实现
   - 加密算法提供者

**5. Java 9 模块系统中的SPI**：

Java 9引入了模块系统(JPMS)，SPI机制有所变化：
- 使用`provides...with...`声明服务提供者
- 使用`uses`声明服务使用者

```java
// 模块声明文件(module-info.java)
module com.example.provider {
    exports com.example.spi;
    provides com.example.spi.MessageService with
        com.example.spi.impl.EmailMessageService,
        com.example.spi.impl.SmsMessageService;
}

module com.example.consumer {
    requires com.example.provider;
    uses com.example.spi.MessageService;
}
```

**6. SPI的特点和优势**：

- **解耦**：服务接口与实现分离
- **可扩展**：不修改原有代码的情况下增加新功能
- **灵活性**：运行时动态选择实现
- **面向接口编程**：基于接口而非实现
- **动态服务发现**：无需硬编码依赖关系

**7. SPI的局限性**：

- **延迟加载问题**：ServiceLoader会一次性实例化所有服务
- **无法按需加载**：缺乏参数化的初始化机制
- **异常处理复杂**：创建实例时的异常难以定位
- **不支持命名服务**：无法根据名称获取指定实现
- **线程安全问题**：ServiceLoader非线程安全

**8. SPI的实际应用场景**：

- **数据库驱动**：MySQL、PostgreSQL等JDBC驱动
- **日志框架**：SLF4J、Log4j等
- **加密服务提供者**：不同的安全算法实现
- **编译器插件**：如Java编译器的注解处理器
- **编解码器**：音频、视频编解码器

**9. Spring与SPI**：

Spring框架提供了类似的机制：
- Spring的@Component扫描机制
- Spring的FactoryBean接口
- Spring Boot的自动配置

**10. 与其他设计模式的关系**：

- **工厂模式**：ServiceLoader作为工厂创建服务实例
- **策略模式**：不同实现代表不同策略
- **适配器模式**：可用于适配不同服务实现
- **依赖注入**：实现服务的依赖反转

### 25. Java 泛型的作用是什么？

**泛型(Generics)**是Java 5引入的一种特性，允许在定义类、接口和方法时使用类型参数，提供编译时类型安全检查，消除强制类型转换，增强代码的可读性和重用性。

**1. 泛型的主要作用**：

1. **类型安全**：
   - 编译时类型检查，避免运行时ClassCastException
   - 错误提前暴露到编译阶段

2. **消除强制类型转换**：
   - 自动完成类型转换，减少冗余代码
   - 提高代码可读性和可维护性

3. **实现通用算法**：
   - 编写适用于多种类型的通用代码
   - 实现"一次编写，多处使用"

**2. 泛型的基本用法**：

**泛型类**：
```java
// 定义泛型类
public class Box<T> {
    private T value;
    
    public void set(T value) {
        this.value = value;
    }
    
    public T get() {
        return value;
    }
}

// 使用泛型类
Box<Integer> intBox = new Box<>();
intBox.set(123);
Integer value = intBox.get(); // 无需类型转换

Box<String> strBox = new Box<>();
strBox.set("Hello");
String text = strBox.get(); // 无需类型转换
```

**泛型方法**：
```java
// 定义泛型方法
public <E> void printArray(E[] array) {
    for (E element : array) {
        System.out.println(element);
    }
}

// 使用泛型方法
Integer[] intArray = {1, 2, 3};
printArray(intArray);

String[] strArray = {"Hello", "World"};
printArray(strArray);
```

**泛型接口**：
```java
// 定义泛型接口
public interface Comparable<T> {
    int compareTo(T o);
}

// 实现泛型接口
public class Person implements Comparable<Person> {
    private String name;
    private int age;
    
    @Override
    public int compareTo(Person other) {
        return Integer.compare(this.age, other.age);
    }
}
```

**3. 泛型通配符**：

- **无界通配符** `<?>`：
  - 表示任何类型
  - 主要用于不需要写入的场景

```java
public void printList(List<?> list) {
    for (Object o : list) {
        System.out.println(o);
    }
}
```

- **上界通配符** `<? extends T>`：
  - 表示T或T的子类型
  - 主要用于从集合中读取数据

```java
public void drawShapes(List<? extends Shape> shapes) {
    for (Shape s : shapes) {
        s.draw(); // 安全，因为所有元素至少是Shape
    }
    // shapes.add(new Circle()); // 编译错误，不能添加元素
}
```

- **下界通配符** `<? super T>`：
  - 表示T或T的超类型
  - 主要用于向集合中写入数据

```java
public void addRectangles(List<? super Rectangle> shapes) {
    shapes.add(new Rectangle()); // 安全，因为列表接受Rectangle或其超类
    shapes.add(new Square());    // 安全，Square是Rectangle的子类
    // Rectangle r = shapes.get(0); // 编译错误，不能保证读取类型
}
```

**4. PECS原则(Producer Extends Consumer Super)**：
- 如果你从集合中读取数据(Producer)，使用`extends`
- 如果你向集合中写入数据(Consumer)，使用`super`

```java
// 生产者场景 - 读取数据
public void copyElements(List<? extends E> src, List<? super E> dest) {
    for (E e : src) {     // src是生产者
        dest.add(e);      // dest是消费者
    }
}
```

**5. 类型擦除**：
- Java泛型在编译后会进行类型擦除
- 泛型信息不会保留到运行时
- 原始类型替换泛型类型参数

擦除前：
```java
List<String> list = new ArrayList<String>();
list.add("Hello");
String s = list.get(0);
```

擦除后(概念上)：
```java
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0);
```

**6. 泛型的限制**：
- 不能使用基本类型作为泛型类型参数
- 不能创建泛型类型的实例：`new T()`
- 不能创建泛型数组：`new T[]`
- 不能对泛型类型使用`instanceof`
- 静态字段不能使用泛型类的类型参数
- 异常类不能是泛型的

**7. 解决泛型限制的方法**：

- 使用类型标记(Class)解决创建实例问题：
```java
public <T> T createInstance(Class<T> clazz) throws Exception {
    return clazz.getDeclaredConstructor().newInstance();
}
```

- 使用通配符和反射创建泛型数组：
```java
public <T> T[] createArray(Class<T> clazz, int size) {
    @SuppressWarnings("unchecked")
    T[] array = (T[]) Array.newInstance(clazz, size);
    return array;
}
```

**8. 泛型最佳实践**：

1. **尽量指定具体类型参数**：
   - 优先使用`List<String>`而非原始类型`List`
   - 提高代码可读性和类型安全性

2. **合理使用通配符**：
   - 应用PECS原则
   - 集合只读时使用`? extends T`
   - 集合只写时使用`? super T`

3. **不要忽略编译器警告**：
   - 解决警告而非抑制
   - 必要时使用@SuppressWarnings，但要添加注释说明

4. **优先考虑泛型方法**：
   - 单个方法需要泛型时，使用泛型方法而非泛型类
   - 增强方法的适用性

5. **明确设计泛型边界**：
   - 使用有界泛型增加API的表达力
   - 例如`<T extends Comparable<T>>`

**9. 泛型和集合框架**：
- Java集合框架广泛使用泛型
- 提供类型安全的容器
- 避免手动类型转换

**10. 泛型在框架中的应用**：
- Spring的依赖注入
- Hibernate的查询API
- Jackson的JSON处理
- Guava的各种工具类

### 26. 什么是不可变类？如何创建一个不可变类？

**不可变类(Immutable Class)**是一种一旦创建，其状态（即对象的数据）就不能被修改的类。String、Integer等包装类以及BigDecimal、BigInteger都是Java中的不可变类。

**不可变类的特点**：
1. 创建后状态不能改变
2. 所有字段都是final的
3. 安全地用于多线程环境，无需同步
4. 可以缓存实例，节省内存（如Integer的缓存）

**创建不可变类的规则**：

1. **类声明为final**：防止创建子类破坏不可变性

2. **所有字段声明为private和final**：防止直接访问和修改字段

3. **不提供修改字段的方法**：不提供setter方法

4. **确保可变成员变量的安全**：
   - 不直接返回对可变对象的引用
   - 不存储传入的可变对象引用，而是创建副本

5. **构造函数中创建可变对象的副本**

**示例代码**：
```java
public final class ImmutablePerson {
    private final String name;
    private final int age;
    private final List<String> hobbies;
    
    public ImmutablePerson(String name, int age, List<String> hobbies) {
        this.name = name;
        this.age = age;
        
        // 创建可变对象的副本，而不是存储原始引用
        this.hobbies = new ArrayList<>(hobbies);
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    public List<String> getHobbies() {
        // 返回防御性副本，而不是原始引用
        return new ArrayList<>(hobbies);
    }
    
    // 提供修改方法，但返回新的实例，而不是修改现有实例
    public ImmutablePerson withName(String newName) {
        return new ImmutablePerson(newName, this.age, this.hobbies);
    }
    
    public ImmutablePerson withAge(int newAge) {
        return new ImmutablePerson(this.name, newAge, this.hobbies);
    }
    
    public ImmutablePerson withAddedHobby(String hobby) {
        List<String> newHobbies = new ArrayList<>(this.hobbies);
        newHobbies.add(hobby);
        return new ImmutablePerson(this.name, this.age, newHobbies);
    }
}
```

**不可变类的优点**：
1. **线程安全**：无需同步，可以安全地在多线程间共享
2. **简化开发**：无需防御性复制，不用担心状态变化
3. **可缓存**：可以安全地重用实例，提高性能
4. **可作为Map键或Set元素**：状态不变，hashCode不变，确保集合正确性

**不可变类的缺点**：
1. **每次修改都创建新对象**：可能增加内存消耗和垃圾回收压力
2. **需要多个类表示一个概念**：需要配套的Builder类以支持方便构建

**最佳实践**：
- 除非必要，优先考虑使用不可变类
- 使用Builder模式简化复杂不可变对象的创建
- 通过工厂方法提供常用实例，减少对象创建

### 27. Java中SPI机制是什么？有哪些应用场景？

**SPI(Service Provider Interface)**是Java提供的一种服务发现机制，允许第三方为某个接口提供实现。

**SPI的核心思想**：当服务提供者提供了一种接口的实现，服务消费者可以通过查找发现并使用该服务，而不需要了解具体实现细节。

**SPI的工作原理**：
1. 定义服务接口
2. 提供该接口的实现
3. 在实现类的META-INF/services目录下创建以接口全限定名为文件名的文件
4. 在文件中写入实现类的全限定名
5. 使用ServiceLoader加载实现类

**SPI实现步骤示例**：

1. **定义接口**：
```java
package com.example.spi;

public interface MessageService {
    String getMessage();
}
```

2. **提供实现类**：
```java
package com.example.spi.impl;

import com.example.spi.MessageService;

public class EmailMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "Email Message";
    }
}

public class SMSMessageService implements MessageService {
    @Override
    public String getMessage() {
        return "SMS Message";
    }
}
```

3. **创建配置文件**：
在`META-INF/services/com.example.spi.MessageService`文件中：
```
com.example.spi.impl.EmailMessageService
com.example.spi.impl.SMSMessageService
```

4. **使用SPI加载服务**：
```java
ServiceLoader<MessageService> serviceLoader = ServiceLoader.load(MessageService.class);
for (MessageService service : serviceLoader) {
    System.out.println(service.getMessage());
}
```

**Java SPI的应用场景**：

1. **JDBC驱动加载**：
   - Java通过SPI机制加载不同数据库的驱动
   - 应用程序只需调用`DriverManager.getConnection(url)`
   - 具体驱动由各数据库厂商实现

2. **日志框架**：
   - SLF4J使用SPI发现日志实现
   - 应用代码使用SLF4J API
   - 具体实现可以是Log4j、Logback等

3. **JavaEE中的组件发现**：
   - Servlet容器
   - JPA提供者
   - JAXB实现

4. **Spring中的应用**：
   - Spring Boot自动配置
   - Spring的`SpringFactoriesLoader`是SPI的一种变体

5. **Dubbo的扩展机制**：
   - Dubbo基于SPI设计了自己的扩展点加载机制
   - 支持IOC和AOP特性

**SPI的优缺点**：

优点：
1. **松耦合**：服务调用方与提供方解耦
2. **可扩展性**：系统可以方便地引入新的实现
3. **动态加载**：运行时发现服务实现

缺点：
1. **延迟加载**：ServiceLoader加载所有实现，可能影响启动性能
2. **并发不安全**：ServiceLoader非线程安全
3. **异常处理机制不完善**：难以定位具体错误
4. **功能简单**：缺乏IoC、AOP等高级特性

**SPI与API的区别**：
- API（Application Programming Interface）：服务提供方定义接口，供调用方使用
- SPI（Service Provider Interface）：调用方定义接口，供服务提供方实现

**最佳实践**：
- 框架设计时，考虑使用SPI增强扩展性
- 在META-INF/services目录使用UTF-8编码的配置文件
- 在服务提供方模块的pom.xml中配置打包时包含META-INF目录
- 考虑使用增强的SPI框架，如Dubbo的扩展加载机制

### 28. 什么是强引用、软引用、弱引用和虚引用？

Java提供了四种引用类型，它们在对象生命周期管理和内存回收方面有不同的特性。这些引用类型从强到弱依次是：强引用、软引用、弱引用和虚引用。

**1. 强引用（Strong Reference）**

- **特点**：最常见的引用类型，如`Object obj = new Object()`
- **GC行为**：只要对象可达（被强引用），垃圾回收器永远不会回收它
- **使用场景**：常规对象引用
- **生命周期**：直到引用变量被销毁或显式设置为null

```java
// 创建强引用
Object strongRef = new Object();
// 销毁引用
strongRef = null; // 对象可能被GC回收
```

**2. 软引用（Soft Reference）**

- **特点**：表示有用但非必需的对象
- **GC行为**：仅在内存不足时被回收
- **使用场景**：实现内存敏感的缓存，当内存不足时自动释放缓存
- **创建方式**：使用`java.lang.ref.SoftReference`类

```java
// 创建软引用
Object obj = new Object();
SoftReference<Object> softRef = new SoftReference<>(obj);
obj = null; // 原始强引用置为null

// 使用软引用
Object retrievedObj = softRef.get(); // 可能返回null，如果对象已被GC回收
if (retrievedObj != null) {
    // 使用对象
}
```

**3. 弱引用（Weak Reference）**

- **特点**：比软引用更弱，表示非必需的对象
- **GC行为**：下一次垃圾回收时无条件回收
- **使用场景**：规范化映射(canonical mapping)，防止内存泄漏
- **创建方式**：使用`java.lang.ref.WeakReference`类

```java
// 创建弱引用
Object obj = new Object();
WeakReference<Object> weakRef = new WeakReference<>(obj);
obj = null; // 原始强引用置为null

// 使用弱引用
Object retrievedObj = weakRef.get(); // 可能返回null
if (retrievedObj != null) {
    // 使用对象
}
```

**4. 虚引用（Phantom Reference）**

- **特点**：最弱的引用类型，不能通过它访问对象
- **GC行为**：对象被回收时，引用会被加入引用队列
- **使用场景**：跟踪对象的回收状态，执行清理操作
- **创建方式**：使用`java.lang.ref.PhantomReference`类，必须提供引用队列

```java
// 创建虚引用
Object obj = new Object();
ReferenceQueue<Object> refQueue = new ReferenceQueue<>();
PhantomReference<Object> phantomRef = new PhantomReference<>(obj, refQueue);
obj = null; // 原始强引用置为null

// 无法通过虚引用获取对象
Object retrievedObj = phantomRef.get(); // 总是返回null

// 检查引用是否入队（对象是否已回收）
Reference<?> polledRef = refQueue.poll();
if (polledRef == phantomRef) {
    // 对象已被回收，执行清理操作
}
```

**5. 引用队列（Reference Queue）**

- 与软引用、弱引用和虚引用一起使用
- 当引用的对象被垃圾回收器回收时，引用对象会被添加到引用队列中
- 可用于在对象回收后执行后续操作

```java
ReferenceQueue<Object> refQueue = new ReferenceQueue<>();
WeakReference<Object> weakRef = new WeakReference<>(new Object(), refQueue);

// 检查引用队列
Reference<?> polledRef = refQueue.poll();
if (polledRef != null) {
    // 对象已被回收，处理引用
}
```

**6. 各引用类型的应用场景**

1. **强引用**：日常编程中的默认引用
   
2. **软引用**：
   - 实现内存敏感的缓存
   - 图片缓存
   - 大对象缓存

3. **弱引用**：
   - 实现`WeakHashMap`，键不再使用时自动删除条目
   - 规范化映射，一个对象对应唯一实例
   - 观察者模式中的监听器列表，防止内存泄漏

4. **虚引用**：
   - 跟踪对象回收状态
   - 管理直接内存资源
   - 实现清理/终结机制

**7. 不同引用类型的对比**

| 引用类型 | 回收时机 | 获取对象 | 引用队列 | 主要用途 |
|---------|---------|---------|---------|---------|
| 强引用 | 从不 | 直接访问 | 不适用 | 常规对象引用 |
| 软引用 | 内存不足时 | 通过get()方法 | 可选 | 内存敏感的缓存 |
| 弱引用 | 下次GC时 | 通过get()方法 | 可选 | 规范化映射 |
| 虚引用 | 下次GC时 | 不能获取 | 必需 | 资源清理 |

**8. 最佳实践**

- 在缓存实现中，根据缓存重要性选择软引用或弱引用
- 处理大型数据时，考虑使用软引用减少OOM风险
- 实现观察者模式时，使用弱引用避免内存泄漏
- 需要跟踪对象生命周期时，考虑使用虚引用和引用队列
- 使用引用队列时，通常需要单独的清理线程处理回收的引用

### 29. ConcurrentHashMap 在 Java 7 和 Java 8 中的实现有何不同？

**ConcurrentHashMap**是Java中线程安全的HashMap实现，在Java 7和Java 8中有着显著的实现差异。

**Java 7中的ConcurrentHashMap**

**1. 基本结构**：
- 采用**分段锁(Segment)**设计
- 继承自ReentrantLock的Segment数组，默认16个
- 每个Segment内部是一个小型的哈希表(HashEntry数组)

**2. 工作原理**：
- 对整个Map进行分段，每个Segment独立加锁
- 允许多个线程同时操作不同段的数据
- 理论上支持Segment数量的并发度

**3. 关键特性**：
- **锁粒度**：Segment级别，默认16个锁
- **并发度**：取决于Segment数量，默认16
- **内部结构**：二级哈希表（Segment → HashEntry）
- **扩容机制**：每个Segment独立扩容，不影响其他Segment

**4. 代码示例**：
```java
// Java 7中的ConcurrentHashMap内部结构（简化版）
static final class Segment<K,V> extends ReentrantLock implements Serializable {
    transient volatile HashEntry<K,V>[] table;
    transient int count;
    // ...
}

static final class HashEntry<K,V> {
    final int hash;
    final K key;
    volatile V value;
    volatile HashEntry<K,V> next;
}
```

**Java 8中的ConcurrentHashMap**

**1. 基本结构**：
- 摒弃了分段锁设计
- 采用**Node数组+链表+红黑树**结构
- 类似于HashMap，但所有操作都保证线程安全

**2. 工作原理**：
- 使用**CAS(Compare and Swap)**操作和**synchronized**关键字
- CAS用于操作Node数组，synchronized用于链表/红黑树操作
- 基于Node的hash值锁定，更细粒度的锁定

**3. 关键特性**：
- **锁粒度**：桶(bucket)级别，比Segment更细
- **并发度**：理论上等于桶数量
- **内部结构**：数组+链表+红黑树（链表长度>8时转为红黑树）
- **扩容机制**：支持并发扩容，多线程协作完成

**4. 代码示例**：
```java
// Java 8中的ConcurrentHashMap内部结构（简化版）
static final class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    volatile V val;
    volatile Node<K,V> next;
}

// 红黑树节点
static final class TreeNode<K,V> extends Node<K,V> {
    TreeNode<K,V> parent;
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;
    boolean red;
}
```

**主要区别对比**

| 特性 | Java 7 ConcurrentHashMap | Java 8 ConcurrentHashMap |
|-----|--------------------------|--------------------------|
| 锁机制 | 分段锁(Segment) | synchronized + CAS |
| 锁粒度 | Segment级别(较粗) | 桶级别(更细) |
| 数据结构 | Segment数组 + HashEntry数组 | Node数组 + 链表/红黑树 |
| 树化 | 不支持 | 链表长度>8时转为红黑树 |
| 并发度 | 取决于Segment数量，固定 | 理论上等于桶数量，更高 |
| 扩容机制 | Segment独立扩容 | 并发扩容，多线程协作 |
| 内存占用 | 较高(Segment对象开销) | 较低(无Segment开销) |
| 查询性能 | 较好 | 更好(受益于红黑树) |
| 迭代器 | 弱一致性 | 弱一致性 |

**核心API操作对比**

**1. put操作**
- **Java 7**：获取Segment锁，然后在Segment内部操作
- **Java 8**：CAS尝试直接插入，失败则对桶加synchronized锁

**2. get操作**
- **Java 7**：不加锁，通过volatile保证可见性
- **Java 8**：不加锁，通过volatile保证可见性

**3. size操作**
- **Java 7**：先尝试不加锁统计，失败后锁住所有Segment
- **Java 8**：使用CounterCell数组，分散计数，提高并发性

**4. 扩容**
- **Java 7**：单线程扩容Segment内部的HashEntry数组
- **Java 8**：多线程协作扩容，每个线程处理一部分桶

**性能考虑**

1. **Java 8优势**：
   - 锁粒度更细，理论上并发度更高
   - 红黑树提高了大容量场景下的查询性能
   - 多线程协作扩容，提高扩容效率

2. **适用场景**：
   - 读操作远多于写操作：两个版本都很好
   - 写操作频繁：Java 8优势更明显
   - 大数据量、高并发：Java 8性能更好

### 30. Java内存模型（JMM）是什么？它有哪些特性？

**Java内存模型（Java Memory Model，JMM）**是Java虚拟机规范中定义的一种抽象模型，它规定了Java程序中各种变量的访问规则，以及在多线程环境中如何处理共享变量的可见性、原子性和有序性问题。

**1. JMM的核心目标**

- 定义Java多线程程序中变量的访问规则
- 屏蔽各种硬件和操作系统的内存访问差异
- 提供一致的内存可见性保证
- 规范多线程环境下指令重排序的影响

**2. Java内存模型的基本结构**

JMM将内存分为**主内存**和**工作内存**两部分：

- **主内存（Main Memory）**：
  - 所有线程共享
  - 存储Java对象的实例数据
  - 包含原始变量（如int、long等）以及引用变量的引用值

- **工作内存（Working Memory）**：
  - 线程私有，类似于CPU缓存
  - 存储线程需要的变量的副本
  - 线程不能直接访问主内存中的变量

**3. JMM的核心特性**

**3.1 原子性（Atomicity）**：

- 基本保证：基本类型的读写操作是原子的（long和double除外）
- 增强保证：通过synchronized和Lock等实现复合操作的原子性
- 相关API：java.util.concurrent.atomic包中的原子类

```java
// 原子变量示例
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet(); // 原子操作
```

**3.2 可见性（Visibility）**：

- 一个线程对共享变量的修改能够及时被其他线程看到
- 实现方式：volatile、synchronized、final关键字
- 可见性不保证原子性

```java
// volatile保证可见性
private volatile boolean flag = false;

// 线程A
flag = true; // 修改对其他线程立即可见

// 线程B
while (!flag) {
    // 能够感知flag的变化
}
```

**3.3 有序性（Ordering）**：

- 程序按代码顺序执行
- JVM为优化性能可能进行指令重排序
- 重排序不会改变单线程执行结果，但会影响多线程执行结果
- 通过volatile、synchronized、Lock等保证有序性

```java
// 重排序示例
int a = 0;
boolean flag = false;

// 可能的重排序
flag = true;
a = 1;

// 通过volatile防止重排序
private volatile int a = 0;
private volatile boolean flag = false;
```

**4. Happens-Before原则**

JMM定义了多种Happens-Before规则，保证线程间的操作可见性：

1. **程序顺序规则**：单线程内按代码顺序执行
2. **监视器锁规则**：释放锁操作happens-before于随后对同一锁的获取
3. **volatile变量规则**：写volatile变量happens-before于随后对这个变量的读
4. **线程启动规则**：启动线程的操作happens-before于被启动线程的任何操作
5. **线程终止规则**：线程中的所有操作happens-before于其他线程感知到该线程结束
6. **中断规则**：调用线程的interrupt()方法happens-before于被中断线程检测到中断事件
7. **终结器规则**：对象的构造函数执行结束happens-before于终结器（finalize）方法
8. **传递性**：如果A happens-before B，且B happens-before C，则A happens-before C

**5. 内存屏障（Memory Barriers）**

JMM使用内存屏障来禁止特定类型的处理器重排序：

- **LoadLoad屏障**：确保Load1先于Load2完成
- **StoreStore屏障**：确保Store1先于Store2完成
- **LoadStore屏障**：确保Load1先于Store2完成
- **StoreLoad屏障**：确保Store1先于Load2完成（全能屏障）

**6. volatile关键字的内存语义**

- **可见性**：保证变量的修改对所有线程立即可见
- **有序性**：禁止指令重排序
- **实现机制**：
  - 写volatile变量时，会插入StoreStore和StoreLoad屏障
  - 读volatile变量时，会插入LoadLoad和LoadStore屏障

```java
// volatile变量使用场景
public class SafePublication {
    private volatile Object instance;
    
    public void publish() {
        instance = new Object(); // 写volatile变量
    }
    
    public Object getInstance() {
        return instance; // 读volatile变量
    }
}
```

**7. final关键字的内存语义**

- 保证final字段在构造函数完成时被正确初始化
- JMM会禁止final字段的初始化被重排序到构造函数之外
- 保证其他线程看到的final字段值都是初始化后的值

**8. synchronized的内存语义**

- **获取锁**：会清空工作内存，从主内存重新加载共享变量
- **释放锁**：会将工作内存中的修改刷新到主内存
- 提供了互斥性和可见性保证

**9. JMM对并发编程的影响**

1. **单例模式实现**：双重检查锁定需要volatile修饰实例变量

```java
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

### 44. Java注解是什么？如何自定义注解及其应用场景？

**注解(Annotations)**是Java 5引入的一种特殊类型的标记，可以应用于类、方法、字段、参数和其他程序元素。它们提供了一种声明式的编程方式，使开发者能够向代码中添加元数据信息，这些信息可以被编译器、运行时环境或第三方工具使用。

**1. 注解的基础概念**

**1.1 注解的定义**

注解以`@interface`关键字定义：

```java
public @interface MyAnnotation {
    String value() default "defaultValue";
    int count() default 0;
    boolean enabled() default true;
}
```

**1.2 元注解**

元注解是用于注解其他注解的注解，Java提供了几个标准的元注解：

- **@Retention**：指定注解的保留策略
  - SOURCE：只在源码中保留，编译时丢弃
  - CLASS：保留在编译后的类文件中，但运行时不可用（默认）
  - RUNTIME：保留在运行时，可以通过反射访问

- **@Target**：指定注解可以应用于哪些程序元素
  - TYPE：类、接口、枚举
  - FIELD：字段
  - METHOD：方法
  - PARAMETER：方法参数
  - CONSTRUCTOR：构造方法
  - LOCAL_VARIABLE：局部变量
  - ANNOTATION_TYPE：注解类型
  - PACKAGE：包
  - TYPE_PARAMETER：Java 8+，类型参数
  - TYPE_USE：Java 8+，类型使用

- **@Documented**：指定该注解是否包含在JavaDoc文档中

- **@Inherited**：指定该注解可以被子类继承

- **@Repeatable**：Java 8+，指定该注解可以在同一程序元素上多次使用

**1.3 常见的内置注解**

Java提供了一些内置的注解：

- **@Override**：表示方法重写父类方法
- **@Deprecated**：表示元素已过时
- **@SuppressWarnings**：抑制编译器警告
- **@FunctionalInterface**：Java 8+，表示函数式接口
- **@SafeVarargs**：Java 7+，抑制可变参数相关的警告
- **@Native**：Java 8+，表示常量可以被本地代码引用

**2. 自定义注解**

**2.1 创建自定义注解**

```java
// 自定义运行时注解
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface Authorized {
    String[] roles() default {"USER"};
    boolean guestAllowed() default false;
}

// 自定义编译时注解
@Retention(RetentionPolicy.SOURCE)
@Target(ElementType.METHOD)
public @interface MethodInfo {
    String author() default "unknown";
    String date();
    String comment() default "";
}
```

**2.2 自定义可重复注解**

```java
// 定义容器注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Schedules {
    Schedule[] value();
}

// 定义可重复的注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Repeatable(Schedules.class)
public @interface Schedule {
    String cron();
    String description() default "";
}

// 使用可重复注解
@Schedule(cron = "0 0 12 * * ?", description = "Daily job")
@Schedule(cron = "0 0 0 * * ?", description = "Nightly job")
public void periodicJob() {
    // 方法实现
}
```

**2.3 注解的使用方式**

```java
// 应用在类上
@Authorized(roles = {"ADMIN", "MANAGER"})
public class AdminController {
    
    // 应用在方法上
    @Authorized(roles = {"ADMIN"})
    public void deleteUser(int userId) {
        // 方法实现
    }
    
    // 应用在方法上，使用默认值
    @Authorized
    public void viewUsers() {
        // 方法实现
    }
}

// 编译时注解应用
@MethodInfo(author = "John", date = "2023-10-15", comment = "Initial implementation")
public void processData() {
    // 方法实现
}
```

**3. 注解处理方式**

注解本身不会做任何事情，它们需要被处理才能发挥作用。处理注解的方式主要有两种：编译时处理和运行时处理。

**3.1 运行时处理（通过反射API）**

```java
// 运行时处理注解示例
public class AuthorizationHandler {
    public static boolean isAuthorized(Object instance, String methodName, String[] userRoles) {
        try {
            Class<?> clazz = instance.getClass();
            
            // 检查类级别的授权
            if (clazz.isAnnotationPresent(Authorized.class)) {
                Authorized auth = clazz.getAnnotation(Authorized.class);
                if (!hasCommonElement(auth.roles(), userRoles) && !auth.guestAllowed()) {
                    return false;
                }
            }
            
            // 检查方法级别的授权
            Method method = clazz.getMethod(methodName);
            if (method.isAnnotationPresent(Authorized.class)) {
                Authorized auth = method.getAnnotation(Authorized.class);
                return hasCommonElement(auth.roles(), userRoles) || auth.guestAllowed();
            }
            
            return true; // 如果没有注解，默认授权
        } catch (NoSuchMethodException e) {
            return false; // 方法不存在
        }
    }
    
    private static boolean hasCommonElement(String[] array1, String[] array2) {
        for (String str1 : array1) {
            for (String str2 : array2) {
                if (str1.equals(str2)) {
                    return true;
                }
            }
        }
        return false;
    }
}

// 使用处理器
public void executeMethod(Object controller, String methodName) {
    String[] userRoles = getCurrentUserRoles(); // 获取当前用户角色
    if (AuthorizationHandler.isAuthorized(controller, methodName, userRoles)) {
        // 调用方法
        // ...
    } else {
        throw new SecurityException("Unauthorized access");
    }
}
```

**3.2 编译时处理（通过Annotation Processing Tool）**

使用Java的注解处理器API，可以在编译时处理注解：

```java
@SupportedAnnotationTypes("com.example.MethodInfo")
@SupportedSourceVersion(SourceVersion.RELEASE_8)
public class MethodInfoProcessor extends AbstractProcessor {
    
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement annotation : annotations) {
            Set<? extends Element> elements = roundEnv.getElementsAnnotatedWith(annotation);
            
            for (Element element : elements) {
                if (element.getKind() == ElementKind.METHOD) {
                    MethodInfo methodInfo = element.getAnnotation(MethodInfo.class);
                    
                    // 获取注解信息
                    String author = methodInfo.author();
                    String date = methodInfo.date();
                    String comment = methodInfo.comment();
                    
                    // 处理注解，例如生成文档或者验证
                    processingEnv.getMessager().printMessage(
                        Diagnostic.Kind.NOTE,
                        "Method: " + element.getSimpleName() +
                        ", Author: " + author +
                        ", Date: " + date +
                        ", Comment: " + comment,
                        element
                    );
                }
            }
        }
        
        return true;
    }
}
```

要使用这个注解处理器，需要：
1. 将处理器打包成JAR文件
2. 在`META-INF/services/javax.annotation.processing.Processor`文件中注册
3. 在编译时包含该JAR文件

**4. 注解的应用场景**

**4.1 框架配置和元数据**

例如Spring框架中的注解用于配置：

```java
@Controller
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        // 实现
    }
}
```

**4.2 编译时检查和代码生成**

例如Lombok库使用注解来生成代码：

```java
@Data // 自动生成getter、setter、equals、hashCode、toString
@Builder // 生成建造者模式代码
public class User {
    private Long id;
    private String username;
    private String email;
}
```

**4.3 运行时行为修改**

例如在Web应用中进行权限检查：

```java
@RequiresRole("admin")
public void deleteUser(Long userId) {
    // 实现
}
```

**4.4 文档生成**

例如Swagger/OpenAPI注解用于生成API文档：

```java
@ApiOperation(value = "Get user by ID", response = User.class)
@GetMapping("/{id}")
public ResponseEntity<User> getUser(@PathVariable @ApiParam(value = "User ID") Long id) {
    // 实现
}
```

**4.5 单元测试**

JUnit框架中使用注解标记测试方法：

```java
@Test
public void testUserRegistration() {
    // 测试逻辑
}

@Before
public void setup() {
    // 设置测试环境
}

@After
public void cleanup() {
    // 清理测试环境
}
```

**4.6 依赖注入和控制反转**

例如在Spring框架中：

```java
@Component
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    
    // 实现方法
}
```

**5. 实际应用案例**

**5.1 自定义验证注解**

```java
// 定义验证注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface ValidateEmail {
    String message() default "Invalid email format";
    boolean nullable() default false;
}

// 定义处理器
public class ValidationProcessor {
    public List<String> validate(Object object) {
        List<String> errors = new ArrayList<>();
        Class<?> clazz = object.getClass();
        
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(ValidateEmail.class)) {
                ValidateEmail annotation = field.getAnnotation(ValidateEmail.class);
                field.setAccessible(true);
                
                try {
                    String email = (String) field.get(object);
                    if (email == null) {
                        if (!annotation.nullable()) {
                            errors.add(field.getName() + ": Email cannot be null");
                        }
                    } else if (!isValidEmail(email)) {
                        errors.add(field.getName() + ": " + annotation.message());
                    }
                } catch (IllegalAccessException e) {
                    errors.add("Cannot access field: " + field.getName());
                }
            }
        }
        
        return errors;
    }
    
    private boolean isValidEmail(String email) {
        // 简单的邮箱验证逻辑
        return email.matches("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    }
}

// 使用验证注解
public class User {
    private Long id;
    private String name;
    
    @ValidateEmail(message = "Please provide a valid email address")
    private String email;
    
    // 构造方法、getter和setter
}

// 验证对象
User user = new User(1L, "John Doe", "invalid-email");
ValidationProcessor validator = new ValidationProcessor();
List<String> errors = validator.validate(user);
if (!errors.isEmpty()) {
    for (String error : errors) {
        System.out.println("Validation error: " + error);
    }
}
```

**5.2 ORM映射注解**

```java
// 表注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Table {
    String name();
}

// 列注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Column {
    String name() default "";
    boolean primary() default false;
}

// 实体类
@Table(name = "users")
public class User {
    @Column(name = "id", primary = true)
    private Long id;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "email")
    private String email;
    
    // 构造方法、getter和setter
}

// ORM处理器
public class OrmMapper {
    public String generateInsertSql(Object entity) {
        Class<?> clazz = entity.getClass();
        if (!clazz.isAnnotationPresent(Table.class)) {
            throw new IllegalArgumentException("Class must be annotated with @Table");
        }
        
        Table tableAnnotation = clazz.getAnnotation(Table.class);
        String tableName = tableAnnotation.name();
        
        List<String> columnNames = new ArrayList<>();
        List<String> paramPlaceholders = new ArrayList<>();
        List<Object> values = new ArrayList<>();
        
        try {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(Column.class)) {
                    field.setAccessible(true);
                    Column column = field.getAnnotation(Column.class);
                    
                    // 跳过自增主键
                    if (column.primary() && field.get(entity) == null) {
                        continue;
                    }
                    
                    String columnName = column.name().isEmpty() ? 
                        field.getName() : column.name();
                    
                    columnNames.add(columnName);
                    paramPlaceholders.add("?");
                    values.add(field.get(entity));
                }
            }
        } catch (IllegalAccessException e) {
            throw new RuntimeException("Error accessing fields", e);
        }
        
        StringBuilder sql = new StringBuilder();
        sql.append("INSERT INTO ")
           .append(tableName)
           .append(" (")
           .append(String.join(", ", columnNames))
           .append(") VALUES (")
           .append(String.join(", ", paramPlaceholders))
           .append(")");
        
        return sql.toString();
        // 实际应用中还需要一个方法来返回values列表用于设置PreparedStatement参数
    }
}
```

**6. 注解的最佳实践**

**6.1 命名和组织**

- 使用清晰、描述性的名称
- 将相关注解组织在同一个包中
- 遵循Java命名约定，使用驼峰式命名

**6.2 文档和注释**

- 为每个注解提供清晰的JavaDoc
- 解释注解的目的、用法和限制
- 提供使用示例

**6.3 设计考虑**

- 确保注解定义简单明了
- 提供合理的默认值
- 避免过度使用注解
- 考虑注解的组合使用
- 注解应该是声明性的，不应包含业务逻辑

**6.4 处理器设计**

- 使注解处理器可重用
- 提供明确的错误信息
- 确保处理器的线程安全性
- 缓存反射结果以提高性能

**6.5 安全考虑**

- 验证注解的使用是否符合预期
- 防止恶意代码利用注解处理器
- 考虑注解在反射中的安全影响

**7. Java注解与其他技术的比较**

**7.1 注解 vs XML配置**

**优点**：
- 类型安全，编译时检查
- 与代码放在一起，易于维护
- 代码更简洁

**缺点**：
- 修改需要重新编译
- 不适合频繁变化的配置
- 对代码有侵入性

**7.2 注解 vs 代码约定**

**优点**：
- 更明确的语义
- IDE支持更好
- 可以包含元数据

**缺点**：
- 引入了额外的概念
- 可能使简单的事情复杂化

**8. Java注解的局限性**

- 只能包含常量值，不能包含代码块
- 不能直接继承其他注解
- 处理注解需要额外的代码
- 过度使用会导致代码可读性下降
- 依赖反射可能影响性能

**9. 未来发展趋势**

- 更强大的编译时注解处理
- 与模块系统的更好集成
- 更丰富的元注解
- 改进的泛型和注解的结合使用

2. **无锁并发编程**：依赖于对JMM的深入理解
3. **线程池优化**：合理设置工作线程数，避免过多的上下文切换
4. **避免伪共享**：对齐内存以提高缓存效率

**10. JMM与硬件内存架构的关系**

- JMM是一个抽象模型，与具体硬件无关
- JVM通过内存屏障等机制将JMM映射到不同硬件架构
- 屏蔽了不同平台内存模型的差异，实现"一次编写，到处运行"

**11. JDK 9及以后的改进**

- 增强了volatile的语义
- 改进了final字段的初始化保证
- 引入VarHandle API，提供更细粒度的内存访问控制

**最佳实践**：

1. 优先使用高级并发工具（java.util.concurrent包）
2. 正确使用synchronized、volatile和final
3. 避免复杂的无锁算法，除非有性能瓶颈
4. 理解内存可见性问题，避免常见并发陷阱
5. 编写线程安全代码时，考虑原子性、可见性和有序性三个维度

### 31. Java 8中的Stream API有什么特点？如何使用？

**Stream API**是Java 8引入的一种处理集合的方式，它提供了一种高效且易于使用的处理数据的方法，支持函数式编程风格的操作。

**1. Stream API的核心特点**

- **函数式编程**：使用Lambda表达式和方法引用进行操作
- **声明式编程**：关注"做什么"而非"怎么做"
- **流水线操作**：支持中间操作和终端操作链式调用
- **延迟执行**：中间操作不会立即执行，直到遇到终端操作
- **内部迭代**：由Stream API控制迭代，而非由用户代码显式控制

**2. Stream的创建方式**

```java
// 从集合创建
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream1 = list.stream();
Stream<String> parallelStream = list.parallelStream(); // 并行流

// 从数组创建
String[] array = {"a", "b", "c"};
Stream<String> stream2 = Arrays.stream(array);

// Stream.of静态方法
Stream<String> stream3 = Stream.of("a", "b", "c");

// 使用Stream.generate创建无限流
Stream<String> stream4 = Stream.generate(() -> "element").limit(10);

// 使用Stream.iterate创建无限流
Stream<Integer> stream5 = Stream.iterate(0, n -> n + 2).limit(10);

// 使用IntStream、LongStream、DoubleStream创建数值流
IntStream intStream = IntStream.range(1, 5); // 1, 2, 3, 4
LongStream longStream = LongStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5
```

**3. Stream的操作类型**

Stream API操作分为两类：**中间操作**(Intermediate Operations)和**终端操作**(Terminal Operations)。

**3.1 中间操作**：返回一个新的Stream，可以链式调用

- **过滤操作**：
  - `filter(Predicate<T>)`: 过滤元素
  - `distinct()`: 去重
  - `limit(long)`: 限制元素数量
  - `skip(long)`: 跳过元素

- **映射操作**：
  - `map(Function<T, R>)`: 元素转换
  - `flatMap(Function<T, Stream<R>>)`: 压平嵌套流
  - `mapToInt/Long/Double()`: 转换为原始类型流

- **排序操作**：
  - `sorted()`: 自然顺序排序
  - `sorted(Comparator<T>)`: 指定排序方式

**3.2 终端操作**：触发流的计算，返回非Stream结果

- **匹配操作**：
  - `anyMatch(Predicate<T>)`: 任一元素匹配
  - `allMatch(Predicate<T>)`: 所有元素匹配
  - `noneMatch(Predicate<T>)`: 没有元素匹配

- **查找操作**：
  - `findFirst()`: 返回第一个元素
  - `findAny()`: 返回任意元素

- **归约操作**：
  - `reduce(BinaryOperator<T>)`: 将流元素组合
  - `reduce(T, BinaryOperator<T>)`: 指定初始值的归约
  - `count()`: 计数
  - `max(Comparator<T>)`: 最大值
  - `min(Comparator<T>)`: 最小值

- **收集操作**：
  - `collect(Collector<T, A, R>)`: 收集到容器
  - `toArray()`: 转为数组

- **遍历操作**：
  - `forEach(Consumer<T>)`: 对每个元素执行操作

**4. Stream API的常见用例**

**4.1 过滤和收集**：
```java
List<String> filtered = persons.stream()
    .filter(p -> p.getAge() > 18)
    .map(Person::getName)
    .collect(Collectors.toList());
```

**4.2 统计操作**：
```java
// 计算总和
int sum = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

// 计算平均值
double average = persons.stream()
    .mapToInt(Person::getAge)
    .average()
    .orElse(0);

// 分组统计
Map<Department, Long> countByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.counting()
    ));
```

**4.3 查找和匹配**：
```java
// 查找任意一个成年人
Optional<Person> adult = persons.stream()
    .filter(p -> p.getAge() >= 18)
    .findAny();

// 检查是否所有人都成年
boolean allAdult = persons.stream()
    .allMatch(p -> p.getAge() >= 18);
```

**4.4 归约和汇总**：
```java
// 计算总和
int total = numbers.stream()
    .reduce(0, Integer::sum);

// 连接字符串
String joined = strings.stream()
    .reduce("", String::concat);

// 使用joining更高效连接字符串
String joinedBetter = strings.stream()
    .collect(Collectors.joining(", "));
```

**4.5 分组和分区**：
```java
// 按部门分组
Map<Department, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// 按成年与否分区
Map<Boolean, List<Person>> adultPartition = persons.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() >= 18));
```

**5. 并行流(Parallel Stream)**

Stream API提供了并行处理能力，可以利用多核处理器的优势：

```java
// 创建并行流
Stream<String> parallelStream = list.parallelStream();
// 或将顺序流转换为并行流
Stream<String> parallel = stream.parallel();

// 并行处理示例
long count = persons.parallelStream()
    .filter(p -> p.getAge() > 18)
    .count();
```

**并行流注意事项**：
- 确保操作无状态且线程安全
- 避免使用共享状态
- 对于较小的数据集，顺序流可能更快
- 某些操作（如findFirst）在并行流上效率可能更低
- 使用有序集合时，排序操作可能抵消并行优势

**6. Collectors工具类**

`java.util.stream.Collectors`提供了多种预定义的收集器：

```java
// 收集到List
List<String> list = stream.collect(Collectors.toList());

// 收集到Set
Set<String> set = stream.collect(Collectors.toSet());

// 收集到Map
Map<Integer, String> map = persons.stream()
    .collect(Collectors.toMap(Person::getId, Person::getName));

// 连接字符串
String joined = stream.collect(Collectors.joining(", "));

// 分组
Map<Department, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));

// 嵌套分组
Map<Department, Map<EmployeeType, List<Employee>>> byDeptAndType = 
    employees.stream()
        .collect(Collectors.groupingBy(
            Employee::getDepartment,
            Collectors.groupingBy(Employee::getType)
        ));

// 计算统计信息
DoubleSummaryStatistics stats = employees.stream()
    .collect(Collectors.summarizingDouble(Employee::getSalary));
```

**7. Stream API的优势和限制**

**优势**：
- 代码简洁清晰，提高可读性
- 支持函数式编程范式
- 延迟执行提高效率
- 并行处理能力
- 内部迭代减少模板代码

**限制**：
- 不能修改源数据结构
- 只能遍历一次
- 不保证执行顺序（除非明确排序）
- 调试复杂性增加

**8. Stream API的最佳实践**

- 优先使用特定类型的流（IntStream、LongStream、DoubleStream）处理数值
- 适当使用并行流提高性能
- 避免在流操作中修改外部状态
- 链式调用保持代码简洁
- 使用方法引用代替简单的Lambda表达式
- 对于复杂的收集操作，优先使用Collectors工具类
- 考虑使用peek()方法进行调试

### 32. 什么是FunctionalInterface？Java 8中的函数式接口有哪些？

**函数式接口(FunctionalInterface)**是Java 8引入的一个重要概念，指只有一个抽象方法的接口，用于支持Lambda表达式和方法引用。

**1. 函数式接口的特点**

- 只包含**一个**抽象方法（Single Abstract Method，简称SAM）
- 可以包含多个默认方法和静态方法
- 可以包含Object类中的public方法的抽象形式
- 可以使用`@FunctionalInterface`注解标记（非必须但推荐）

**2. @FunctionalInterface注解**

`@FunctionalInterface`是一个标记注解，用于表示一个接口是函数式接口：

```java
@FunctionalInterface
public interface MyFunctional {
    void execute();  // 唯一的抽象方法
    
    // 默认方法，不影响函数式接口的性质
    default void defaultMethod() {
        System.out.println("Default Method");
    }
    
    // 静态方法，不影响函数式接口的性质
    static void staticMethod() {
        System.out.println("Static Method");
    }
    
    // Object类的方法，不计入抽象方法数量
    @Override
    boolean equals(Object obj);
}
```

**3. Java 8内置的函数式接口**

Java 8在`java.util.function`包中提供了多个标准的函数式接口，分为以下几类：

**3.1 基础函数式接口**

1. **Consumer**：接收一个输入参数但不返回任何结果
   ```java
   @FunctionalInterface
   public interface Consumer<T> {
       void accept(T t);
   }
   // 使用示例
   Consumer<String> printer = s -> System.out.println(s);
   printer.accept("Hello World");
   ```

2. **Supplier**：不接收参数但返回一个结果
   ```java
   @FunctionalInterface
   public interface Supplier<T> {
       T get();
   }
   // 使用示例
   Supplier<String> supplier = () -> "Hello World";
   String result = supplier.get();
   ```

3. **Function**：接收一个输入参数并返回一个结果
   ```java
   @FunctionalInterface
   public interface Function<T, R> {
       R apply(T t);
   }
   // 使用示例
   Function<String, Integer> length = s -> s.length();
   Integer len = length.apply("Hello");
   ```

4. **Predicate**：接收一个参数，返回一个布尔结果
   ```java
   @FunctionalInterface
   public interface Predicate<T> {
       boolean test(T t);
   }
   // 使用示例
   Predicate<String> isEmpty = s -> s.isEmpty();
   boolean empty = isEmpty.test("Hello");
   ```

5. **UnaryOperator**：接收一个参数，返回相同类型的结果
   ```java
   @FunctionalInterface
   public interface UnaryOperator<T> extends Function<T, T> {
   }
   // 使用示例
   UnaryOperator<String> toUpperCase = s -> s.toUpperCase();
   String upper = toUpperCase.apply("hello");
   ```

6. **BinaryOperator**：接收两个相同类型参数，返回相同类型的结果
   ```java
   @FunctionalInterface
   public interface BinaryOperator<T> extends BiFunction<T, T, T> {
   }
   // 使用示例
   BinaryOperator<Integer> add = (a, b) -> a + b;
   Integer sum = add.apply(5, 3);
   ```

**3.2 特殊类型的函数式接口**

1. **BiConsumer**：接收两个输入参数，不返回结果
   ```java
   @FunctionalInterface
   public interface BiConsumer<T, U> {
       void accept(T t, U u);
   }
   // 使用示例
   BiConsumer<String, Integer> printEntry = (key, value) -> 
       System.out.println(key + ": " + value);
   printEntry.accept("Age", 30);
   ```

2. **BiFunction**：接收两个输入参数，返回一个结果
   ```java
   @FunctionalInterface
   public interface BiFunction<T, U, R> {
       R apply(T t, U u);
   }
   // 使用示例
   BiFunction<String, String, Integer> sumLengths = 
       (s1, s2) -> s1.length() + s2.length();
   Integer totalLength = sumLengths.apply("Hello", "World");
   ```

3. **BiPredicate**：接收两个输入参数，返回一个布尔结果
   ```java
   @FunctionalInterface
   public interface BiPredicate<T, U> {
       boolean test(T t, U u);
   }
   // 使用示例
   BiPredicate<String, Integer> checkLength = 
       (s, len) -> s.length() == len;
   boolean result = checkLength.test("Hello", 5);
   ```

**3.3 原始类型特化的函数式接口**

为避免基本类型的装箱拆箱开销，Java 8提供了针对基本类型的特化接口：

1. **IntFunction**，**LongFunction**，**DoubleFunction**：
   接收一个基本类型参数，返回泛型结果

2. **ToIntFunction**，**ToLongFunction*，**ToDoubleFunction**：
   接收一个泛型参数，返回基本类型结果

3. **IntConsumer**，**LongConsumer**，**DoubleConsumer**：
   接收一个基本类型参数，不返回结果

4. **IntPredicate**，**LongPredicate**，**DoublePredicate**：
   接收一个基本类型参数，返回布尔结果

5. **IntSupplier**，**LongSupplier**，**DoubleSupplier**：
   不接收参数，返回基本类型结果

6. **IntUnaryOperator**，**LongUnaryOperator**，**DoubleUnaryOperator**：
   接收一个基本类型参数，返回相同类型结果

```java
// 使用示例
IntFunction<String> intToString = i -> Integer.toString(i);
String str = intToString.apply(42);

IntConsumer printer = i -> System.out.println(i);
printer.accept(42);

IntPredicate isEven = i -> i % 2 == 0;
boolean even = isEven.test(42);
```

**4. 多个函数式接口的组合**

函数式接口通常提供了组合方法，允许通过默认方法组合多个操作：

```java
// Predicate组合
Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();
Predicate<String> isNotEmptyAndLong = isNotEmpty.and(s -> s.length() > 10);

// Function组合 (andThen和compose)
Function<String, String> toUpperCase = String::toUpperCase;
Function<String, String> trim = String::trim;
Function<String, String> trimAndUpperCase = trim.andThen(toUpperCase);
Function<String, String> upperCaseAndTrim = trim.compose(toUpperCase);

// Consumer组合
Consumer<String> logger = s -> System.out.println("Log: " + s);
Consumer<String> printer = s -> System.out.println("Print: " + s);
Consumer<String> logAndPrint = logger.andThen(printer);
```

**5. 自定义函数式接口**

可以根据需要定义自己的函数式接口，只需确保它只有一个抽象方法：

```java
@FunctionalInterface
public interface TriFunction<T, U, V, R> {
    R apply(T t, U u, V v);
}

// 使用示例
TriFunction<String, String, String, Integer> calculateLength = 
    (s1, s2, s3) -> s1.length() + s2.length() + s3.length();
Integer length = calculateLength.apply("Hello", "Functional", "Interface");
```

**6. Lambda表达式和方法引用**

函数式接口与Lambda表达式和方法引用密切相关：

**Lambda表达式**作为函数式接口的实例：
```java
Predicate<String> isEmpty = s -> s.isEmpty();
Consumer<String> printer = s -> System.out.println(s);
```

**方法引用**作为函数式接口的实例：
```java
// 静态方法引用
Function<String, Integer> parseInt = Integer::parseInt;

// 实例方法引用（特定实例）
Consumer<String> printer = System.out::println;

// 实例方法引用（任意实例）
Function<String, Integer> getLength = String::length;

// 构造方法引用
Supplier<List<String>> newList = ArrayList::new;
Function<String, Integer> newInteger = Integer::new;
```

**7. 常见应用场景**

函数式接口常用于以下场景：

1. **集合操作**：Stream API操作、集合排序等
   ```java
   // 列表排序
   list.sort(Comparator.comparing(Person::getName));
   
   // Stream操作
   list.stream()
       .filter(p -> p.getAge() > 18)
       .map(Person::getName)
       .forEach(System.out::println);
   ```

2. **异步任务和回调**：
   ```java
   // 线程
   new Thread(() -> System.out.println("Running in a thread")).start();
   
   // 任务提交
   ExecutorService executor = Executors.newSingleThreadExecutor();
   executor.submit(() -> performTask());
   ```

3. **事件处理**：
   ```java
   button.addActionListener(e -> System.out.println("Button clicked"));
   ```

4. **策略模式**：
   ```java
   public void processStrings(List<String> strings, Predicate<String> filter) {
       for (String s : strings) {
           if (filter.test(s)) {
               System.out.println(s);
           }
       }
   }
   
   // 使用不同策略
   processStrings(list, s -> s.startsWith("A"));
   processStrings(list, s -> s.length() > 5);
   ```

5. **延迟执行/懒加载**：
   ```java
   public String getExpensiveValue(Supplier<String> supplier) {
       // 只在需要时调用get()
       if (isRequired()) {
           return supplier.get(); // 延迟计算
       }
       return "Default";
   }
   ```

**8. 最佳实践**

1. 使用`@FunctionalInterface`注解标记函数式接口
2. 优先使用Java标准库提供的函数式接口
3. 在需要重用的Lambda表达式中，考虑使用方法引用
4. 利用函数式接口的组合方法构建复杂行为
5. 为提高性能，针对基本类型使用特化的函数式接口
6. 不要过度使用Lambda表达式，保持代码可读性
7. 在文档中清晰说明函数式接口的行为

### 33. 什么是Java的方法引用？如何使用？

**方法引用(Method Reference)**是Java 8引入的一种语法糖，作为Lambda表达式的简化形式，使代码更加简洁易读。当Lambda表达式的全部内容仅仅是调用一个已存在的方法时，可以使用方法引用来替代。

**1. 方法引用的语法**

方法引用使用双冒号`::`操作符，有以下四种形式：

1. **静态方法引用**：`类名::静态方法名`
2. **特定对象的实例方法引用**：`对象实例::实例方法名`
3. **特定类型的任意对象的实例方法引用**：`类名::实例方法名`
4. **构造方法引用**：`类名::new`

**2. 方法引用的类型详解**

**2.1 静态方法引用**

引用一个类的静态方法。语法：`ClassName::staticMethodName`

```java
// Lambda表达式
Function<String, Integer> parser1 = s -> Integer.parseInt(s);

// 等价的方法引用
Function<String, Integer> parser2 = Integer::parseInt;

// 使用示例
int value = parser2.apply("123"); // 返回123
```

**2.2 特定对象的实例方法引用**

引用一个特定对象实例的方法。语法：`objectReference::instanceMethodName`

```java
// Lambda表达式
Consumer<String> printer1 = s -> System.out.println(s);

// 等价的方法引用
Consumer<String> printer2 = System.out::println;

// 使用示例
printer2.accept("Hello World"); // 打印"Hello World"

// 自定义对象的方法引用
StringBuilder sb = new StringBuilder();
Consumer<String> appender1 = s -> sb.append(s);
Consumer<String> appender2 = sb::append;
```

**2.3 特定类型的任意对象的实例方法引用**

引用特定类型的任意对象的实例方法。语法：`ClassName::instanceMethodName`

这种形式适用于Lambda表达式的第一个参数是方法的接收者（调用者），剩余参数是方法的参数。

```java
// Lambda表达式
Function<String, Integer> lengthFunc1 = s -> s.length();

// 等价的方法引用
Function<String, Integer> lengthFunc2 = String::length;

// 使用示例
int len = lengthFunc2.apply("Hello"); // 返回5

// 带参数的方法
BiPredicate<String, String> contains1 = (s, prefix) -> s.startsWith(prefix);
BiPredicate<String, String> contains2 = String::startsWith;
```

**2.4 构造方法引用**

引用一个类的构造方法。语法：`ClassName::new`

```java
// 无参构造方法引用
Supplier<List<String>> listFactory1 = () -> new ArrayList<>();
Supplier<List<String>> listFactory2 = ArrayList::new;

// 使用示例
List<String> list = listFactory2.get(); // 创建新的ArrayList实例

// 带参数的构造方法引用
Function<Integer, List<String>> sizedListFactory = ArrayList::new;
List<String> sizedList = sizedListFactory.apply(10); // 创建初始容量为10的ArrayList

// 多参数构造方法
BiFunction<String, Integer, Person> personCreator = Person::new;
Person person = personCreator.apply("John", 25); // 调用Person(String name, int age)构造方法
```

**3. Lambda表达式与方法引用的对比**

**3.1 Lambda表达式转换为方法引用的条件**：

1. Lambda表达式的**全部内容**是调用一个已存在的方法
2. 不对参数做任何修改就传入方法
3. 不对方法返回值做任何修改

**3.2 对比示例**：

```java
// 示例1：直接调用方法
// Lambda表达式
Consumer<String> printer1 = s -> System.out.println(s);
// 方法引用
Consumer<String> printer2 = System.out::println;

// 示例2：调用参数的方法
// Lambda表达式
Predicate<String> isEmpty1 = s -> s.isEmpty();
// 方法引用
Predicate<String> isEmpty2 = String::isEmpty;

// 示例3：使用一个参数调用另一个对象的方法
// Lambda表达式
BiPredicate<List<String>, String> contains1 = (list, element) -> list.contains(element);
// 方法引用
BiPredicate<List<String>, String> contains2 = List::contains;

// 示例4：构造器引用
// Lambda表达式
Function<String, Integer> intConverter1 = s -> new Integer(s);
// 构造器引用
Function<String, Integer> intConverter2 = Integer::new;
```

**无法使用方法引用的情况**：

```java
// 对参数进行处理，无法简化为方法引用
Function<String, Integer> lengthPlus1 = s -> s.length() + 1;

// 调用方法后对结果进行处理，无法简化为方法引用
Function<String, Boolean> isEmpty = s -> s.length() == 0;

// 组合多个方法调用，无法简化为方法引用
Function<String, String> normalize = s -> s.trim().toLowerCase();
```

**4. 方法引用在Stream API中的应用**

方法引用与Stream API结合使用非常强大：

```java
// 对象集合处理
List<Person> persons = Arrays.asList(
    new Person("John", 25),
    new Person("Alice", 30),
    new Person("Bob", 20)
);

// 获取所有名字
List<String> names = persons.stream()
    .map(Person::getName)  // 使用方法引用
    .collect(Collectors.toList());

// 按年龄排序
persons.sort(Comparator.comparing(Person::getAge));

// 获取年龄总和
int totalAge = persons.stream()
    .mapToInt(Person::getAge)  // 使用方法引用
    .sum();

// 分组统计
Map<Integer, List<Person>> groupByAge = persons.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// 打印每个人的信息
persons.forEach(System.out::println);  // 使用方法引用
```

**5. 方法引用与集合和数组操作**

```java
String[] names = {"John", "Alice", "Bob"};
List<String> nameList = Arrays.asList(names);

// 数组转List
List<String> nameList2 = Arrays.stream(names)
    .collect(Collectors.toList());

// 排序（使用方法引用）
Arrays.sort(names, String::compareToIgnoreCase);
nameList.sort(String::compareToIgnoreCase);

// List转数组
String[] namesArray = nameList.stream()
    .toArray(String[]::new);  // 构造器引用
```

**6. 方法引用的类型推断**

Java编译器能够根据上下文自动推断方法引用的签名：

```java
// 自动推断出需要的函数式接口类型
Runnable r = System.out::println;  // 推断为不带参数的println方法
Consumer<String> c = System.out::println;  // 推断为带String参数的println方法

// 自动选择正确的重载方法
BiFunction<Integer, Integer, Integer> max = Math::max;  // 选择int max(int, int)
```

**7. 方法引用与泛型方法**

方法引用也可以引用泛型方法：

```java
// 使用泛型方法引用
List<String> list = Arrays.asList("a", "b", "c");
List<Integer> lengths = list.stream()
    .map(String::length)  // 泛型方法引用
    .collect(Collectors.toList());

// 类上的泛型方法引用
Function<List<String>, String> joiner = String::join;  // 引用静态方法String.join(CharSequence, Iterable)
```

**8. 方法引用的优势**

1. **简洁性**：代码更加简洁，减少样板代码
2. **可读性**：直接表明调用了哪个方法，意图更清晰
3. **性能**：与等价的Lambda表达式相比没有性能差异
4. **重用**：可以直接利用已有的方法实现

**9. 使用建议**

1. 当Lambda表达式仅调用一个现有方法时，优先使用方法引用
2. 根据实际情况选择最清晰的语法形式
3. 避免过度使用导致代码难以理解
4. 在文档中解释复杂的方法引用的用途

### 34. Java 8中的Optional类是什么？如何正确使用？

**Optional** 是Java 8引入的一个容器类，代表一个值存在或不存在。Optional的主要目的是解决空指针异常(NullPointerException)问题，提供了一种更优雅的方式来处理可能为null的对象，避免显式的null检查。

**1. Optional的核心特点**

- 可以包含非null值，也可以表示"无值"状态
- 避免null检查的样板代码
- 使代码更具可读性
- 迫使开发者思考"值不存在"的情况

**2. 创建Optional对象**

Optional提供了三种静态工厂方法来创建实例：

```java
// 创建一个空的Optional
Optional<String> empty = Optional.empty();

// 创建一个包含非null值的Optional
Optional<String> present = Optional.of("Hello");

// 创建一个可能包含null值的Optional
Optional<String> nullable = Optional.ofNullable(mayBeNullString);
```

**注意事项**：
- `Optional.of(null)`会抛出NullPointerException
- `Optional.ofNullable(null)`会返回一个空的Optional

**3. 检查值是否存在**

检查Optional是否包含值：

```java
// 使用isPresent方法
Optional<String> opt = Optional.ofNullable(getValue());
if (opt.isPresent()) {
    System.out.println("Value: " + opt.get());
} else {
    System.out.println("No value present");
}

// 使用isEmpty方法 (Java 11+)
if (opt.isEmpty()) {
    System.out.println("No value present");
}
```

**4. 访问Optional中的值**

访问Optional中的值有多种方法，根据不同需求选择：

**4.1 安全地获取值**：

```java
// 使用get()方法 (不推荐，可能抛出NoSuchElementException)
String value = opt.get();

// 使用orElse()方法提供默认值
String value = opt.orElse("Default value");

// 使用orElseGet()方法提供默认值的供应者
String value = opt.orElseGet(() -> computeDefaultValue());

// 使用orElseThrow()方法在值不存在时抛出异常
String value = opt.orElseThrow(); // Java 10+, 抛出NoSuchElementException
String value = opt.orElseThrow(() -> new IllegalStateException("Value not found"));
```

**4.2 条件操作**：

```java
// 存在值时执行操作
opt.ifPresent(value -> System.out.println("Value: " + value));

// 存在值时执行一个操作，否则执行另一个操作 (Java 9+)
opt.ifPresentOrElse(
    value -> System.out.println("Value: " + value),
    () -> System.out.println("No value present")
);
```

**5. 转换Optional值**

Optional提供了转换值的方法，支持链式调用：

```java
// map()方法转换值
Optional<String> nameOpt = Optional.of("John");
Optional<Integer> lengthOpt = nameOpt.map(String::length);

// flatMap()方法处理返回Optional的转换
Optional<User> userOpt = Optional.ofNullable(getUser());
Optional<String> emailOpt = userOpt.flatMap(User::getEmail);
// 假设User::getEmail返回Optional<String>

// 过滤值
Optional<String> longNameOpt = nameOpt.filter(name -> name.length() > 5);

// 或操作 (Java 9+)
Optional<String> result = opt1.or(() -> opt2);
```

**6. Optional的正确使用模式**

**6.1 使用map转换值**：

```java
// 不使用Optional
User user = getUser();
String zipCode = null;
if (user != null) {
    Address address = user.getAddress();
    if (address != null) {
        zipCode = address.getZipCode();
    }
}

// 使用Optional
Optional<User> userOpt = Optional.ofNullable(getUser());
Optional<String> zipCodeOpt = userOpt
    .map(User::getAddress)
    .map(Address::getZipCode);
String zipCode = zipCodeOpt.orElse("Unknown");
```

**6.2 避免嵌套条件**：

```java
// 使用Optional链式调用避免嵌套if-else
String result = Optional.ofNullable(user)
    .map(User::getAddress)
    .map(Address::getCity)
    .map(City::getPostalCode)
    .orElse("Unknown");
```

**6.3 结合流操作**：

```java
// 获取有效的邮件地址
List<String> validEmails = users.stream()
    .map(User::getEmail)
    .filter(Optional::isPresent)
    .map(Optional::get)
    .collect(Collectors.toList());

// Java 9+中更简洁的写法
List<String> validEmails = users.stream()
    .map(User::getEmail)
    .flatMap(Optional::stream)
    .collect(Collectors.toList());
```

**7. Optional的常见误用和最佳实践**

**7.1 不要作为类字段**：
Optional不是为了作为类的字段而设计的，因为它不可序列化

```java
// 错误：不要这样做
public class User {
    private Optional<String> email; // 不推荐
}

// 正确：直接使用可空字段
public class User {
    private String email; // 可以为null
    
    public Optional<String> getEmail() {
        return Optional.ofNullable(email);
    }
}
```

**7.2 不要作为方法参数**：
Optional不应该作为方法参数，这会使API更复杂

```java
// 错误：不要这样做
public void processUser(Optional<User> userOpt) {
    // ...
}

// 正确：使用重载或显式参数
public void processUser(User user) {
    // 处理非null用户
}

public void processWithoutUser() {
    // 处理无用户情况
}
```

**7.3 避免get()方法**：
尽量避免使用get()方法，因为它可能抛出异常

```java
// 不推荐：可能抛出NoSuchElementException
String name = userOpt.get();

// 推荐：提供默认值或处理异常
String name = userOpt.orElse("");
// 或
String name = userOpt.orElseThrow(() -> new CustomException("User not found"));
```

**7.4 理解orElse和orElseGet的区别**：

```java
// orElse总是执行默认值表达式，即使Optional有值
String value = opt.orElse(expensiveOperation());

// orElseGet仅在Optional为空时执行默认值表达式
String value = opt.orElseGet(() -> expensiveOperation());
```

**8. Java 9及以后的Optional增强**

**Java 9增加的方法**：
- `or()`: 提供备选Optional
- `ifPresentOrElse()`: 存在时执行一个操作，否则执行另一个操作
- `stream()`: 将Optional转换为Stream

```java
// or()方法示例
Optional<String> result = opt1.or(() -> opt2);

// stream()方法示例
Stream<String> stream = opt.stream(); // 返回0或1个元素的Stream
```

**Java 10增加的方法**：
- `orElseThrow()`: 无参数版本，抛出NoSuchElementException

**9. Optional使用的性能考虑**

使用Optional可能会引入一些性能开销：
- 额外的对象创建
- 包装和解包的成本
- 方法调用的开销

在性能关键的代码中，可能需要评估使用Optional的成本。对于内部方法，可以考虑显式的null检查，而为公共API提供Optional。

**10. 最佳实践总结**

1. **使用场景**：
   - 作为返回类型，表示可能没有结果
   - 作为包装不确定存在的值
   - 用于链式调用和函数式编程

2. **避免使用场景**：
   - 类的字段
   - 方法参数
   - 集合的元素类型
   - 序列化对象

3. **编码建议**：
   - 优先使用orElse、orElseGet、orElseThrow而不是get
   - 使用ifPresent或map处理存在的值
   - 链式调用减少嵌套代码
   - 理解并合理使用flatMap
   - 在API边界使用Optional
   - 避免创建嵌套的Optional

### 35. Java I/O与NIO有什么区别？应该如何选择？

**Java I/O**和**NIO(New I/O)**是Java中进行输入/输出操作的两个主要API，它们在设计理念、实现方式和适用场景上有显著区别。

**1. 基本概念对比**

| 特性 | Java I/O (io包) | Java NIO (nio包) |
|------|----------------|------------------|
| 设计理念 | 面向流 (Stream-oriented) | 面向缓冲区 (Buffer-oriented) |
| 数据传输方式 | 阻塞式 (Blocking) | 可选阻塞/非阻塞 (Blocking/Non-blocking) |
| I/O模型 | 单向传输 | 通道可双向传输 |
| 处理器使用 | 线程执行期间阻塞 | 单线程可管理多个连接 |
| 缓冲区 | 无内置缓冲区概念 | 基于缓冲区操作 |
| 选择器 | 不支持 | 支持Selector多路复用 |
| API复杂性 | 简单直观 | 较复杂 |
| 出现时间 | JDK 1.0 | JDK 1.4 |

**2. 核心组件比较**

**2.1 Java I/O的核心组件**：

- **字节流**：处理字节数据
  - `InputStream`/`OutputStream`及其子类

- **字符流**：处理字符数据
  - `Reader`/`Writer`及其子类

- **装饰器模式**：通过组合提供额外功能
  - `BufferedInputStream`/`BufferedOutputStream`
  - `DataInputStream`/`DataOutputStream`
  - 等等

**2.2 Java NIO的核心组件**：

- **Buffer**：数据容器
  - `ByteBuffer`, `CharBuffer`, `IntBuffer`等

- **Channel**：连接到IO设备的通道
  - `FileChannel`, `SocketChannel`, `ServerSocketChannel`等

- **Selector**：实现多路复用的选择器
  - 允许单线程监控多个Channel的事件

- **Charset**：字符集编解码器
  - 处理字节和字符之间的转换

**3. 详细功能对比**

**3.1 数据传输模式**

**Java I/O**：
- 面向流的处理方式
- 数据被视为连续的字节流
- 按顺序处理，每次处理一个字节
- 阻塞式API，调用线程等待操作完成

```java
// I/O读取文件示例
try (FileInputStream fis = new FileInputStream("file.txt")) {
    byte[] buffer = new byte[1024];
    int bytesRead;
    while ((bytesRead = fis.read(buffer)) != -1) {
        // 处理读取的数据
        process(buffer, 0, bytesRead);
    }
}
```

**Java NIO**：
- 面向缓冲区的处理方式
- 数据被加载到缓冲区中进行处理
- 可以前后移动位置(flip, rewind)
- 支持非阻塞模式

```java
// NIO读取文件示例
try (FileChannel channel = FileChannel.open(Paths.get("file.txt"), StandardOpenOption.READ)) {
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    while (channel.read(buffer) != -1) {
        buffer.flip(); // 切换到读模式
        while (buffer.hasRemaining()) {
            // 处理数据
            byte b = buffer.get();
            process(b);
        }
        buffer.clear(); // 清空缓冲区准备再次读取
    }
}
```

**3.2 阻塞与非阻塞**

**Java I/O**：
- 总是阻塞模式
- 一个线程只能处理一个连接
- 高并发场景下需要大量线程

**Java NIO**：
- 支持非阻塞模式
- 通过Selector实现多路复用
- 一个线程可以监控多个Channel
- 更高效的资源使用

```java
// NIO非阻塞服务器示例
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));
serverChannel.configureBlocking(false);

Selector selector = Selector.open();
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    int readyChannels = selector.select();
    if (readyChannels == 0) continue;
    
    Set<SelectionKey> selectedKeys = selector.selectedKeys();
    Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
    
    while (keyIterator.hasNext()) {
        SelectionKey key = keyIterator.next();
        
        if (key.isAcceptable()) {
            // 处理连接请求
            handleAccept(key);
        } else if (key.isReadable()) {
            // 处理读事件
            handleRead(key);
        }
        
        keyIterator.remove();
    }
}
```

**3.3 内存使用**

**Java I/O**：
- 每次操作都直接在JVM和操作系统间复制数据
- 不使用中间缓冲区
- 可能引起频繁的系统调用

**Java NIO**：
- 使用Buffer作为中间数据存储
- 减少系统调用次数
- 可以实现零拷贝(Zero-Copy)
- 直接缓冲区(Direct Buffer)可以减少JVM和操作系统间的数据复制

```java
// 使用直接缓冲区
ByteBuffer directBuffer = ByteBuffer.allocateDirect(1024);
// 与操作系统内存映射，减少复制
```

**3.4 API复杂度**

**Java I/O**：
- 简单直观的API
- 易于理解和使用
- 适合初学者和简单场景

**Java NIO**：
- 较复杂的API
- 需要理解Buffer、Channel、Selector等概念
- 状态管理更复杂（如buffer的position, limit, capacity）
- 学习曲线较陡

**4. 文件操作对比**

**4.1 读取文件**

**Java I/O**：
```java
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

**Java NIO**：
```java
// 小文件读取
String content = new String(Files.readAllBytes(Paths.get("file.txt")));

// 大文件读取
try (FileChannel channel = FileChannel.open(Paths.get("file.txt"), StandardOpenOption.READ)) {
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    StringBuilder content = new StringBuilder();
    while (channel.read(buffer) > 0) {
        buffer.flip();
        content.append(StandardCharsets.UTF_8.decode(buffer));
        buffer.clear();
    }
    return content.toString();
}

// 或使用Files工具类（内部使用NIO实现）
List<String> lines = Files.readAllLines(Paths.get("file.txt"));
```

**4.2 写入文件**

**Java I/O**：
```java
try (BufferedWriter writer = new BufferedWriter(new FileWriter("file.txt"))) {
    writer.write("Hello, World!");
    writer.newLine();
    writer.write("Second line");
}
```

**Java NIO**：
```java
// 简单写入
Files.write(Paths.get("file.txt"), "Hello, World!".getBytes());

// 使用Channel写入
try (FileChannel channel = FileChannel.open(
        Paths.get("file.txt"), 
        StandardOpenOption.CREATE, 
        StandardOpenOption.WRITE)) {
    
    ByteBuffer buffer = ByteBuffer.wrap("Hello, World!".getBytes());
    channel.write(buffer);
}
```

**4.3 文件复制**

**Java I/O**：
```java
try (InputStream in = new FileInputStream("source.txt");
     OutputStream out = new FileOutputStream("target.txt")) {
    
    byte[] buffer = new byte[8192];
    int bytesRead;
    while ((bytesRead = in.read(buffer)) != -1) {
        out.write(buffer, 0, bytesRead);
    }
}
```

**Java NIO**：
```java
// 使用Channel复制
try (FileChannel sourceChannel = FileChannel.open(Paths.get("source.txt"), StandardOpenOption.READ);
     FileChannel targetChannel = FileChannel.open(Paths.get("target.txt"), 
             StandardOpenOption.CREATE, StandardOpenOption.WRITE)) {
    
    sourceChannel.transferTo(0, sourceChannel.size(), targetChannel);
    // 或者: targetChannel.transferFrom(sourceChannel, 0, sourceChannel.size());
}

// 或使用Files工具类
Files.copy(Paths.get("source.txt"), Paths.get("target.txt"), StandardCopyOption.REPLACE_EXISTING);
```

**5. 网络编程对比**

**5.1 阻塞式Socket通信**

**Java I/O**：
```java
// 服务器端
ServerSocket serverSocket = new ServerSocket(8080);
Socket clientSocket = serverSocket.accept(); // 阻塞等待连接
BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

String line;
while ((line = in.readLine()) != null) { // 阻塞读取
    out.println("Echo: " + line);
}

// 客户端
Socket socket = new Socket("localhost", 8080);
PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

out.println("Hello, Server!");
System.out.println(in.readLine()); // 阻塞等待响应
```

**Java NIO**：
```java
// 非阻塞服务器
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));
serverChannel.configureBlocking(false);

Selector selector = Selector.open();
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select(); // 等待事件
    Iterator<SelectionKey> keys = selector.selectedKeys().iterator();
    
    while (keys.hasNext()) {
        SelectionKey key = keys.next();
        keys.remove();
        
        if (key.isAcceptable()) {
            // 处理新连接
            ServerSocketChannel server = (ServerSocketChannel) key.channel();
            SocketChannel client = server.accept();
            client.configureBlocking(false);
            client.register(selector, SelectionKey.OP_READ);
        } else if (key.isReadable()) {
            // 处理读事件
            SocketChannel client = (SocketChannel) key.channel();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            int bytesRead = client.read(buffer);
            
            if (bytesRead > 0) {
                buffer.flip();
                client.write(buffer);
                buffer.clear();
            }
        }
    }
}
```

**6. 性能对比**

**Java I/O的优势**：
- 简单场景下代码更简洁
- 单个连接处理的逻辑清晰
- 内存占用较少(不需要为每个连接分配缓冲区)

**Java NIO的优势**：
- 高并发场景下性能更好
- 可以用更少的线程处理更多连接
- 非阻塞模式下CPU利用率更高
- 大文件传输时零拷贝特性提供更好性能
- 内存映射文件能提供极高的I/O性能

**7. 适用场景分析**

**7.1 适合Java I/O的场景**：
- 连接数量较少且稳定的应用
- 消息较短的应用
- 实现简单性比性能更重要的场景
- 代码可读性要求高的场景
- 单线程应用

**7.2 适合Java NIO的场景**：
- 高并发、大量连接的服务器应用
- 需要非阻塞操作的场景
- 长连接应用(如即时通讯)
- 文件操作密集型应用
- 需要高吞吐量的场景
- 需要使用异步I/O模型的场景

**8. Java 7及以后的改进**

**Java 7 引入的 NIO.2 (java.nio.file包)** 提供了更现代的文件系统API：
- **Path** 接口替代File类
- **Files** 工具类提供丰富的文件操作方法
- **文件属性操作**更加强大
- **WatchService** 用于监视文件系统变化
- **异步I/O** 支持（AsynchronousFileChannel等）

```java
// NIO.2 文件操作示例
Path path = Paths.get("file.txt");
Files.write(path, "Hello World".getBytes(), StandardOpenOption.CREATE);

// 异步文件操作
AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(
    path, StandardOpenOption.READ);
ByteBuffer buffer = ByteBuffer.allocate(1024);

fileChannel.read(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
    @Override
    public void completed(Integer result, ByteBuffer attachment) {
        attachment.flip();
        CharBuffer charBuffer = StandardCharsets.UTF_8.decode(attachment);
        System.out.println(charBuffer.toString());
    }
    
    @Override
    public void failed(Throwable exc, ByteBuffer attachment) {
        exc.printStackTrace();
    }
});
```

**9. 选择指南**

选择Java I/O还是NIO时，考虑以下因素：
- **并发连接数**：高并发场景选择NIO
- **业务复杂度**：简单业务逻辑可选I/O
- **性能要求**：对性能要求高选择NIO
- **开发团队经验**：团队对NIO不熟悉时，权衡开发成本
- **代码可维护性**：I/O代码通常更易维护
- **阻塞需求**：需要非阻塞操作必须选NIO
- **内存资源限制**：线程资源紧张选择NIO

**10. 最佳实践**

1. **不要混用**：一个系统中尽量不要混用I/O和NIO
2. **考虑使用框架**：如Netty, MINA等封装了NIO的复杂性
3. **NIO调试复杂**：做好日志记录和异常处理
4. **文件操作推荐NIO.2**：现代Java应用应使用java.nio.file包
5. **网络应用中的选择**：
   - 小规模应用可以使用I/O
   - 高并发应用选择NIO或基于NIO的框架
6. **注意缓冲区管理**：在NIO中正确管理Buffer的状态

### 36. Java中的垃圾回收机制是如何工作的？

**垃圾回收(Garbage Collection, GC)**是Java虚拟机(JVM)自动管理内存的核心机制，它能够自动识别和清理不再使用的对象，释放内存资源。理解垃圾回收机制对于编写高效的Java应用至关重要。

**1. 垃圾回收的基本原理**

垃圾回收的基本思路是识别哪些对象是"存活"的，然后将其他对象视为"垃圾"进行回收。JVM采用的判断对象是否可以回收的算法主要有两种：

- **引用计数法(Reference Counting)**：
  - 为每个对象维护一个引用计数器
  - 每当有引用指向对象时计数器加1，引用失效时减1
  - 计数为0时对象可被回收
  - **缺点**：无法处理循环引用问题

- **可达性分析(Reachability Analysis)**：
  - 从一系列"GC Roots"开始，进行引用链搜索
  - 可从GC Roots直接或间接到达的对象被视为存活
  - 不可达对象被视为垃圾
  - **JVM采用这种算法**

**2. GC Roots包括**：
- 虚拟机栈中引用的对象
- 方法区中静态属性引用的对象
- 方法区中常量引用的对象
- 本地方法栈中JNI引用的对象
- JVM内部引用（类加载器、异常对象等）

**3. Java中的引用类型**

JDK 1.2后，Java将引用分为四种类型，为GC提供了更灵活的内存管理策略：

- **强引用(Strong Reference)**：
  - 最常见的引用（如`Object obj = new Object()`）
  - 只要强引用存在，对象就不会被回收
  
- **软引用(Soft Reference)**：
  - 内存不足时才会被回收
  - 用于实现内存敏感的缓存
  - 通过`SoftReference`类实现
  
- **弱引用(Weak Reference)**：
  - 下一次GC时无条件回收
  - 用于实现规范化映射
  - 通过`WeakReference`和`WeakHashMap`实现
  
- **虚引用(Phantom Reference)**：
  - 不影响对象生命周期，仅用于对象被回收时收到通知
  - 必须和引用队列一起使用
  - 通过`PhantomReference`类实现

**4. 垃圾回收算法**

**4.1 标记-清除算法(Mark-Sweep)**
- **过程**：首先标记所有需要回收的对象，然后统一回收所有被标记的对象
- **优点**：算法简单
- **缺点**：
  - 效率不高（标记和清除两个过程效率都不高）
  - 会产生大量内存碎片

```
[标记前]  O O X O X O O X O X
[标记后]  O O M O M O O M O M  (M=被标记为垃圾)
[清除后]  O O _ O _ O O _ O _  (_=空闲内存)
```

**4.2 复制算法(Copying)**
- **过程**：将内存分为两块，每次只使用一块；当一块用完时，将存活对象复制到另一块，然后清空当前块
- **优点**：
  - 解决内存碎片问题
  - 实现简单，运行高效
- **缺点**：
  - 内存利用率降低
  - 对象存活率高时效率会降低

```
[复制前] [O O X O X O] [        ]  (X=垃圾对象)
[复制后] [          ] [O O O O  ]  (存活对象被复制)
```

**4.3 标记-整理算法(Mark-Compact)**
- **过程**：标记阶段与标记-清除算法一样，但后续不是直接清理，而是将存活对象移动到内存的一端，然后清理边界以外的内存
- **优点**：
  - 解决了内存碎片问题
  - 避免了复制算法的空间浪费
- **缺点**：
  - 需要移动对象，效率低于复制算法

```
[标记后]  O O M O M O O M O M  (M=被标记为垃圾)
[整理后]  O O O O O O _ _ _ _  (_=空闲内存)
```

**4.4 分代收集算法(Generational Collection)**
- **核心思想**：根据对象存活周期将内存划分为几个区域
- **实现**：将堆分为新生代和老年代，不同代使用不同的收集算法
- **优点**：
  - 针对不同年龄对象采用最合适的收集算法
  - 提高GC效率

**5. 堆内存结构和分代回收**

在经典的分代垃圾回收模型中，堆内存被划分为：

**5.1 新生代(Young Generation)**
- **Eden区**：大多数新创建的对象最初都在Eden区分配
- **Survivor区**：包括From和To两个区域，存放经过GC后幸存的对象

**5.2 老年代(Old Generation)**
- 存放长期存活的对象
- 通常经历了多次GC仍存活的对象会被移到这里

**5.3 对象的生命周期**
1. 新创建的对象首先分配在Eden区
2. Eden区满后触发Minor GC，存活对象移动到Survivor区
3. 经过多次Minor GC仍存活的对象进入老年代
4. 老年代满时触发Major GC或Full GC

**6. 垃圾回收器的类型**

JVM提供了多种垃圾回收器，适用于不同的应用场景：

**6.1 Serial收集器**
- 单线程收集器，GC时暂停所有应用线程
- 简单高效，适合单核CPU和小内存环境

**6.2 ParNew收集器**
- Serial的多线程版本
- 常与CMS收集器配合使用

**6.3 Parallel Scavenge收集器**
- 关注吞吐量的多线程收集器
- 可控制吞吐量和最大暂停时间

**6.4 Serial Old收集器**
- Serial收集器的老年代版本
- 单线程，使用标记-整理算法

**6.5 Parallel Old收集器**
- Parallel Scavenge的老年代版本
- 多线程，使用标记-整理算法

**6.6 CMS(Concurrent Mark Sweep)收集器**
- 以最短停顿时间为目标
- 基于标记-清除算法
- 过程：初始标记→并发标记→重新标记→并发清除
- 优点：并发收集，停顿时间短
- 缺点：会产生内存碎片，对CPU资源敏感

**6.7 G1(Garbage-First)收集器**
- JDK 7更新，JDK 9默认
- 将堆划分为多个区域(Region)
- 优先收集垃圾最多的区域
- 过程：初始标记→并发标记→最终标记→筛选回收
- 优点：可预测停顿时间，无内存碎片

**6.8 ZGC(Z Garbage Collector)**
- JDK 11引入的低延迟收集器
- 可处理TB级内存，停顿时间10ms
- 基于Region，使用读屏障和有色指针

**6.9 Shenandoah收集器**
- OpenJDK特有，与ZGC目标类似
- 通过并发标记和复制实现低延迟

**7. GC触发条件**

**7.1 Minor GC触发条件**
- Eden区空间不足时

**7.2 Major/Full GC触发条件**
- 老年代空间不足
- Permanent Generation(永久代)/Metaspace空间不足
- System.gc()调用(建议JVM执行GC，但不保证执行)
- CMS GC出现promotion failed和concurrent mode failure
- Minor GC晋升到老年代的对象大小超过老年代剩余空间

**8. GC调优参数**

**8.1 堆大小相关**
```
-Xms: 初始堆大小
-Xmx: 最大堆大小
-Xmn: 年轻代大小
-XX:SurvivorRatio: Eden区与Survivor区比例
-XX:NewRatio: 年轻代与老年代比例
```

**8.2 GC策略相关**
```
-XX:+UseSerialGC: 使用Serial+Serial Old收集器
-XX:+UseParallelGC: 使用Parallel Scavenge+Parallel Old收集器
-XX:+UseConcMarkSweepGC: 使用ParNew+CMS+Serial Old收集器
-XX:+UseG1GC: 使用G1收集器
-XX:+UseZGC: 使用ZGC收集器
```

**8.3 GC日志相关**
```
-XX:+PrintGCDetails: 打印GC详细信息
-XX:+PrintGCTimeStamps: 打印GC时间戳
-Xloggc:filename: 输出GC日志到文件
```

**9. 对象分配与回收优化**

**9.1 TLAB(Thread Local Allocation Buffer)**
- 线程私有的对象分配区域
- 减少多线程分配对象时的同步开销
- 提高对象分配效率

**9.2 逃逸分析**
- JVM的一种优化技术
- 分析对象的作用域，确定对象是否可以在栈上分配
- 如果对象不会"逃逸"出方法，可以在栈上分配

**9.3 写屏障和读屏障**
- 在分代回收中用于记录跨代引用
- 确保垃圾回收的正确性
- 影响GC性能

**10. JVM内存泄漏常见原因**

1. **静态集合类**：静态集合持有对象引用
2. **未关闭的资源**：如文件、数据库连接等
3. **监听器和回调**：注册但未注销
4. **单例对象**：持有外部对象引用
5. **内部类和匿名内部类**：隐式持有外部类引用

```java
// 内存泄漏示例
public class LeakExample {
    // 静态集合导致的内存泄漏
    private static final List<Object> LEAK_LIST = new ArrayList<>();
    
    public void addToList(Object obj) {
        LEAK_LIST.add(obj); // 对象将永远不会被回收
    }
    
    // 未关闭资源导致的内存泄漏
    public void processFile(String path) throws Exception {
        InputStream is = new FileInputStream(path);
        // 使用流但未关闭，可能导致文件句柄泄漏
        // is.close(); 应该在finally块中关闭
    }
}
```

**11. 实际应用中的GC调优**

**11.1 调优目标**
- 减少Full GC频率
- 降低GC停顿时间
- 提高吞吐量

**11.2 调优步骤**
1. **确定目标**：是降低延迟还是提高吞吐量
2. **收集GC数据**：使用JVM参数开启GC日志
3. **分析GC日志**：使用工具如GCViewer分析
4. **调整参数**：根据分析结果调整JVM参数
5. **验证效果**：重复收集数据并比较结果

**11.3 常见调优实践**
- 选择合适的收集器
- 调整堆大小和代的比例
- 设置合理的初始堆大小，避免频繁扩容
- 对大内存应用考虑G1或ZGC
- 避免创建大量临时对象
- 复用对象而非频繁创建

### 37. Java中的类加载机制是怎样的？

**类加载机制(Class Loading Mechanism)**是Java虚拟机将类的字节码加载到内存、创建对象、链接和初始化的过程，是Java动态扩展能力的重要体现。

**1. 类加载的时机**

类加载通常在以下情况触发：

1. **创建类实例**：使用new关键字、反射、克隆、反序列化
2. **访问类的静态变量**：首次引用类的静态字段（final常量除外）
3. **访问类的静态方法**
4. **初始化子类时**：会先初始化父类
5. **Java虚拟机启动时的主类**
6. **使用反射API**：如Class.forName()
7. **使用JDK 7动态语言支持**：MethodHandle和MethodType

**注意**：通过数组定义引用类、访问类的final静态字段、子类引用父类的静态字段不会触发子类初始化。

**2. 类加载的过程**

类加载过程分为五个阶段：**加载(Loading)**、**验证(Verification)**、**准备(Preparation)**、**解析(Resolution)**和**初始化(Initialization)**。其中验证、准备、解析统称为连接(Linking)。

**2.1 加载(Loading)**

加载是类加载的第一步，主要完成三件事：

1. 通过类的全限定名获取类的二进制字节流
2. 将字节流所代表的静态存储结构转化为方法区的运行时数据结构
3. 在内存中生成一个代表这个类的java.lang.Class对象，作为方法区这个类的访问入口

获取字节流的方式多种多样：
- 从ZIP包中获取（如JAR、WAR、EAR文件）
- 从网络中获取（如Applet）
- 运行时计算生成（如动态代理）
- 从数据库中获取
- 从其他文件中获取（如JSP）

**2.2 验证(Verification)**

验证是连接阶段的第一步，目的是确保类的字节码符合JVM规范，不会危害虚拟机安全。主要包括：

- **文件格式验证**：魔数、版本号、常量池等
- **元数据验证**：是否符合Java语言规范
- **字节码验证**：确保程序语义正确性
- **符号引用验证**：确保解析能正常进行

**2.3 准备(Preparation)**

准备阶段为类的静态变量分配内存并设置初始值（零值），如：

```java
public static int value = 123;  // 准备阶段value值为0，而非123
public static final int CONSTANT = 123;  // 准备阶段CONSTANT值即为123
```

这个阶段不包含实例变量，实例变量会在对象实例化时随对象分配到堆中。

**2.4 解析(Resolution)**

解析阶段是将常量池内的符号引用替换为直接引用的过程。符号引用包括：
- 类和接口的全限定名
- 字段的名称和描述符
- 方法的名称和描述符

解析可能在初始化之后才开始，这是为了支持Java的动态绑定。

**2.5 初始化(Initialization)**

初始化是类加载的最后一步，会执行类构造器`<clinit>()`方法。这个方法由编译器自动生成，包含：
- 静态变量的赋值操作
- 静态代码块中的语句

执行顺序与源文件中出现的顺序一致：

```java
public class InitExample {
    static {
        i = 0;  // 可以赋值，但不能访问
        // System.out.println(i);  // 非法前向引用
    }
    
    static int i = 1;  // 最终i的值为1
    
    static {
        i = 2;  // 修改为2
        System.out.println(i);  // 输出2
    }
}
```

**初始化的特点**：
- JVM保证类的`<clinit>()`方法在多线程环境中被正确加锁、同步
- 父类的初始化先于子类
- 接口初始化不会导致父接口初始化
- 接口中的变量默认是static final的

**3. 类加载器**

类加载器(ClassLoader)负责加载阶段，通过类的全限定名查找并加载类的二进制数据。

**3.1 Java的类加载器分类**

**3.1.1 启动类加载器(Bootstrap ClassLoader)**
- 负责加载Java核心类库
- 位于JRE的`lib`目录，如`rt.jar`
- 由C++实现，是JVM的一部分
- 在Java代码中无法直接引用

**3.1.2 扩展类加载器(Extension ClassLoader)**
- 负责加载JRE的扩展目录（`lib/ext`）
- JDK 9后更名为平台类加载器(Platform ClassLoader)

**3.1.3 应用程序类加载器(Application ClassLoader)**
- 负责加载用户类路径(ClassPath)上的类
- 也称系统类加载器(System ClassLoader)
- 是应用程序默认的类加载器

**3.1.4 自定义类加载器**
- 通过继承`java.lang.ClassLoader`实现
- 常用于实现特殊的类加载逻辑

**3.2 双亲委派模型**

类加载器使用双亲委派模型(Parents Delegation Model)进行组织。当一个类加载器收到类加载请求时，首先将请求委派给父加载器，依次向上。只有当父加载器无法加载时，子加载器才尝试自己加载。

![类加载器层次结构]
```
BootstrapClassLoader
       ↑
ExtensionClassLoader
       ↑
ApplicationClassLoader
       ↑
  自定义ClassLoader
```

**双亲委派的工作流程**：
1. 检查类是否已被加载
2. 如果未加载，委托给父加载器
3. 如果父加载器无法加载，自己尝试加载

**ClassLoader的loadClass方法源码简化版**：
```java
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
    // 检查类是否已加载
    Class<?> c = findLoadedClass(name);
    if (c == null) {
        try {
            if (parent != null) {
                // 委托父加载器加载
                c = parent.loadClass(name, false);
            } else {
                // 使用启动类加载器加载
                c = findBootstrapClassOrNull(name);
            }
        } catch (ClassNotFoundException e) {
            // 父加载器无法加载
        }
        
        if (c == null) {
            // 父加载器无法加载，自己尝试加载
            c = findClass(name);
        }
    }
    if (resolve) {
        resolveClass(c);
    }
    return c;
}
```

**双亲委派的好处**：
- 避免类的重复加载
- 保护核心API不被篡改（安全性）
- 确保类加载的层次性和优先级

**3.3 打破双亲委派模型**

有些场景需要打破双亲委派模型：

1. **JDK 1.2之前**：自定义ClassLoader无法通过双亲委派
2. **SPI机制**：如JDBC、JCE、JNDI等
3. **OSGi模块化**：允许同一个类在不同的模块中加载
4. **Tomcat类加载机制**：实现Web应用隔离
5. **热部署和热替换**：如Spring开发工具、JRebel

**打破双亲委派的实现方式**：
- 重写`loadClass()`方法
- 使用上下文类加载器(Thread Context ClassLoader)

**上下文类加载器示例**：
```java
// 设置上下文类加载器
Thread.currentThread().setContextClassLoader(customClassLoader);

// 获取上下文类加载器
ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();

// 使用上下文类加载器加载类
Class<?> clazz = Class.forName("com.example.MyClass", true, contextClassLoader);
```

**3.4 自定义类加载器**

实现自定义类加载器通常只需要重写`findClass()`方法：

```java
public class CustomClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        // 获取类的字节码
        byte[] classData = loadClassData(name);
        if (classData == null) {
            throw new ClassNotFoundException(name);
        }
        
        // 调用defineClass将字节码转为Class对象
        return defineClass(name, classData, 0, classData.length);
    }
    
    private byte[] loadClassData(String name) {
        // 实现自定义的字节码获取逻辑
        // 如从特定位置读取类文件、网络下载、动态生成等
        // 返回类的字节码数组
    }
}
```

**使用自定义类加载器**：
```java
CustomClassLoader loader = new CustomClassLoader();
Class<?> clazz = loader.loadClass("com.example.MyClass");
Object instance = clazz.newInstance();
```

**自定义类加载器的应用场景**：
- 加密解密类字节码（安全）
- 从网络或数据库加载类
- 热部署
- 类隔离（不同版本的类共存）
- 实现模块化系统（如OSGi）

**4. Class对象和类加载器**

Java中，类由其全限定名和加载它的类加载器共同确定其唯一性。不同类加载器加载的同名类被视为不同的类，它们的Class对象不相等。

```java
ClassLoader loader1 = new CustomClassLoader();
ClassLoader loader2 = new CustomClassLoader();

Class<?> class1 = loader1.loadClass("com.example.MyClass");
Class<?> class2 = loader2.loadClass("com.example.MyClass");

// 尽管类名相同，但由不同的类加载器加载
System.out.println(class1 == class2);  // 输出false
```

**5. 类加载器和命名空间**

每个类加载器都有自己的命名空间，由该加载器及其所有父加载器加载的类组成。

**命名空间特点**：
- 子加载器能访问父加载器加载的类
- 父加载器不能访问子加载器加载的类
- 同级但不同的类加载器相互隔离

这种隔离机制是实现应用隔离（如Web容器中的应用隔离）的基础。

**6. 类加载的并行性**

JVM规范没有强制要求类加载过程的并行性。但在实际实现中：
- 加载阶段可以并行
- 验证阶段可以并行
- 初始化阶段必须是线程安全的

**7. 动态加载与反射**

Java支持运行时动态加载类：

```java
// 动态加载类
Class<?> clazz = Class.forName("com.example.MyClass");

// 创建实例
Object obj = clazz.newInstance();

// 获取方法
Method method = clazz.getMethod("methodName", paramTypes);

// 调用方法
method.invoke(obj, params);
```

与直接使用`new`关键字相比，动态加载提供了更大的灵活性，是Java反射API和很多框架的基础。

**8. JDK 9模块系统的影响**

JDK 9引入了模块系统(JPMS)，对类加载机制产生了影响：
- 新增了模块路径(Module Path)，与传统类路径并存
- 增强了类加载的安全性和访问控制
- 引入平台类加载器替代扩展类加载器
- 模块之间的依赖关系显式声明

**9. 常见问题与解决方案**

**9.1 ClassNotFoundException vs NoClassDefFoundError**
- **ClassNotFoundException**: 当应用尝试通过Class.forName、ClassLoader.loadClass或ClassLoader.findSystemClass加载类但找不到时抛出
- **NoClassDefFoundError**: 当Java虚拟机或ClassLoader实例尝试加载类的定义但找不到时抛出，通常是类加载时的链接错误

**9.2 类加载器泄漏**
- 发生在类加载器无法被垃圾回收的情况
- 常见于Web容器中的应用重新部署
- 解决方案：正确管理类加载器生命周期，使用弱引用

### 38. Java中的异常处理机制是怎样的？

**异常处理机制**是Java提供的处理程序运行时错误的强大工具，它能够改变程序的正常控制流程以处理错误情况，同时保持代码的结构性和可读性。

**1. Java异常体系结构**

Java异常体系以`Throwable`类为根，包含两个主要分支：`Error`和`Exception`。

**1.1 Throwable类**：
- 所有异常的父类
- 包含错误信息和栈追踪
- 主要方法：getMessage(), printStackTrace(), getStackTrace()

**1.2 Error**：
- 表示严重的系统级错误，通常是不可恢复的
- 程序通常无法处理
- 例如：OutOfMemoryError, StackOverflowError, VirtualMachineError

**1.3 Exception**：
- 表示程序可能处理的错误情况
- 分为两类：已检查异常(Checked Exception)和未检查异常(Unchecked Exception)

**异常继承体系图**：
```
       Throwable
       /      \
    Error    Exception
              /     \
 (Checked Exceptions) RuntimeException
                        |
                (Unchecked Exceptions)
```

**2. 已检查异常(Checked Exception)与未检查异常(Unchecked Exception)**

**2.1 已检查异常(Checked Exception)**：
- 编译时期就会检查的异常
- 必须显式处理（try-catch或throws声明）
- Exception的直接子类（除RuntimeException）
- 表示可预见但可能避免不了的异常情况
- 常见例子：IOException, SQLException, ClassNotFoundException

**2.2 未检查异常(Unchecked Exception)**：
- 编译时期不会检查的异常
- 不需要显式处理
- RuntimeException及其子类
- 通常表示程序错误
- 常见例子：NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException

**3. 异常处理语法**

Java提供了try, catch, finally, throw和throws关键字来处理异常。

**3.1 try-catch语句**：

```java
try {
    // 可能抛出异常的代码
    int result = 10 / 0;  // 会抛出ArithmeticException
} catch (ArithmeticException e) {
    // 处理特定类型的异常
    System.out.println("除零错误: " + e.getMessage());
} catch (Exception e) {
    // 处理其他类型的异常
    System.out.println("发生错误: " + e.getMessage());
}
```

**3.2 多catch块和异常类型合并**：

Java 7引入了多种异常类型的合并处理：

```java
try {
    // 可能抛出多种异常的代码
} catch (IOException | SQLException e) {
    // 处理IOException或SQLException
    System.out.println("IO或SQL异常: " + e.getMessage());
}
```

**3.3 finally语句**：

无论是否发生异常，finally块中的代码总会执行（除非JVM退出）：

```java
FileInputStream fis = null;
try {
    fis = new FileInputStream("file.txt");
    // 处理文件
} catch (IOException e) {
    System.out.println("文件处理错误: " + e.getMessage());
} finally {
    // 清理资源，无论是否发生异常
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            // 处理关闭时可能发生的异常
        }
    }
}
```

**3.4 try-with-resources语句**：

Java 7引入的自动资源管理语法，适用于实现AutoCloseable接口的对象：

```java
try (FileInputStream fis = new FileInputStream("file.txt");
     FileOutputStream fos = new FileOutputStream("output.txt")) {
    // 处理文件
    byte[] buffer = new byte[1024];
    int length;
    while ((length = fis.read(buffer)) > 0) {
        fos.write(buffer, 0, length);
    }
} catch (IOException e) {
    System.out.println("文件处理错误: " + e.getMessage());
}
// 资源会自动关闭，无需finally块
```

**3.5 throw语句**：

用于显式抛出异常：

```java
public void deposit(double amount) {
    if (amount <= 0) {
        throw new IllegalArgumentException("存款金额必须为正数");
    }
    // 处理存款逻辑
}
```

**3.6 throws声明**：

在方法签名中声明可能抛出的已检查异常：

```java
public void readFile(String fileName) throws IOException {
    FileInputStream fis = new FileInputStream(fileName);
    // 处理文件
}
```

**3.7 异常链**：

传递原始异常信息：

```java
try {
    // 可能抛出异常的代码
} catch (SQLException e) {
    // 包装原始异常，并提供更多上下文
    throw new ServiceException("数据库操作失败", e);
}
```

**4. 自定义异常**

创建自定义异常通常需要继承Exception（已检查异常）或RuntimeException（未检查异常）：

```java
// 已检查异常
public class InsufficientFundsException extends Exception {
    private double amount;
    
    public InsufficientFundsException(double amount) {
        super("余额不足，还差" + amount + "元");
        this.amount = amount;
    }
    
    public double getAmount() {
        return amount;
    }
}

// 未检查异常
public class UserNotFoundException extends RuntimeException {
    private String userId;
    
    public UserNotFoundException(String userId) {
        super("找不到用户: " + userId);
        this.userId = userId;
    }
    
    public String getUserId() {
        return userId;
    }
}
```

**使用自定义异常**：

```java
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        throw new InsufficientFundsException(amount - balance);
    }
    balance -= amount;
}

public User findUser(String userId) {
    User user = userRepository.findById(userId);
    if (user == null) {
        throw new UserNotFoundException(userId);
    }
    return user;
}
```

**5. 异常处理最佳实践**

**5.1 异常粒度**：
- 粒度适中，既不过细也不过粗
- 精确捕获需要处理的异常
- 不捕获无法处理的异常

**5.2 异常转换**：
- 底层异常转换为应用级异常
- 保留原始异常信息（使用异常链）
- 提供有意义的错误消息

```java
try {
    // 数据库操作
} catch (SQLException e) {
    throw new ServiceException("数据库查询失败", e);
}
```

**5.3 异常处理与日志**：
- 不要捕获异常后不处理或仅打印
- 记录异常的完整信息，包括栈跟踪
- 避免过度记录（如多层传递的异常）

```java
try {
    // 操作
} catch (Exception e) {
    logger.error("操作失败", e);  // 记录完整异常
    throw e;  // 如果需要，可以重新抛出
}
```

**5.4 资源管理**：
- 优先使用try-with-resources
- 确保所有资源都能正确关闭
- 资源关闭顺序与打开顺序相反

**5.5 异常设计原则**：
- 已检查异常用于可恢复的情况
- 未检查异常用于编程错误
- 避免过多的已检查异常
- 不要使用异常控制正常流程

**5.6 性能考虑**：
- 异常处理有性能开销
- 避免用异常处理正常情况
- 避免过度细粒度的try-catch块

错误示例：
```java
// 不要这样做
for (int i = 0; i < list.size(); i++) {
    try {
        process(list.get(i));
    } catch (Exception e) {
        logger.error("处理元素失败", e);
    }
}
```

正确示例：
```java
// 更好的方式
try {
    for (int i = 0; i < list.size(); i++) {
        process(list.get(i));
    }
} catch (Exception e) {
    logger.error("处理列表失败", e);
}
```

**6. Java 7以后的异常处理增强**

**6.1 try-with-resources**：
- 自动关闭实现AutoCloseable的资源
- 优于传统finally块
- 可以处理多个资源
- 可以捕获关闭资源时的异常

**6.2 多异常捕获**：
- 使用`|`合并多个异常处理
- 减少代码重复
- 被捕获的异常类型必须没有继承关系

**6.3 更精确的重抛异常**：
- Java 7以前，重抛异常会丢失具体异常类型
- Java 7以后，编译器会分析可能抛出的异常类型

```java
// Java 7之前
public void method() throws Exception {  // 只能声明为Exception
    try {
        // 可能抛出IOException或SQLException
    } catch (Exception e) {
        // 记录日志
        throw e;  // 编译器认为这里抛出的是Exception
    }
}

// Java 7之后
public void method() throws IOException, SQLException {  // 可以更精确地声明
    try {
        // 可能抛出IOException或SQLException
    } catch (Exception e) {
        // 记录日志
        throw e;  // 编译器可以分析出实际可能的异常类型
    }
}
```

**7. 常见异常及其处理方式**

**7.1 NullPointerException**：
- 尝试访问null对象的方法或属性
- 防御性编程：检查null值
- 考虑使用Optional（Java 8+）

```java
// 预防NPE
if (obj != null) {
    obj.method();
}

// 使用Optional
Optional<User> userOpt = userService.findUser(id);
userOpt.ifPresent(user -> user.updateProfile());
```

**7.2 ArrayIndexOutOfBoundsException**：
- 访问数组越界
- 检查索引范围
- 使用集合类替代数组

```java
// 防止越界
if (index >= 0 && index < array.length) {
    value = array[index];
}
```

**7.3 ClassCastException**：
- 错误的类型转换
- 使用instanceof检查
- 使用泛型避免类型转换

```java
// 安全的类型转换
if (obj instanceof String) {
    String str = (String) obj;
    // 使用str
}
```

**7.4 IOException**：
- I/O操作失败
- 使用try-with-resources
- 考虑重试机制

**7.5 SQLException**：
- 数据库操作失败
- 使用事务管理
- 处理特定的SQL错误码

**7.6 OutOfMemoryError**：
- 内存不足
- 增加JVM内存
- 检查内存泄漏
- 优化大对象处理

**8. 异常处理策略**

**8.1 集中式异常处理**：

在应用程序的顶层捕获并统一处理异常：

```java
// Spring MVC中的全局异常处理
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException e) {
        ErrorResponse error = new ErrorResponse("USER_NOT_FOUND", e.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception e) {
        ErrorResponse error = new ErrorResponse("INTERNAL_ERROR", "服务器内部错误");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

**8.2 事务性资源处理**：

在异常发生时回滚事务：

```java
@Transactional
public void transferMoney(Account from, Account to, BigDecimal amount) {
    from.withdraw(amount);  // 可能抛出InsufficientFundsException
    to.deposit(amount);
    // 如果发生异常，事务会自动回滚
}
```

**8.3 重试机制**：

对于可能暂时失败的操作实现重试逻辑：

```java
public Response callExternalService() {
    int maxRetries = 3;
    int attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            return externalService.call();  // 可能抛出NetworkException
        } catch (NetworkException e) {
            attempt++;
            if (attempt == maxRetries) {
                throw new ServiceUnavailableException("服务不可用", e);
            }
            // 指数退避
            try {
                Thread.sleep(100 * (long)Math.pow(2, attempt));
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw new ServiceUnavailableException("重试中断", ie);
            }
        }
    }
    // 不应该执行到这里
    throw new IllegalStateException("重试逻辑错误");
}
```

**9. Java异常处理的成本**

异常处理会带来性能成本，主要包括：

1. **创建异常对象**：构建异常对象和获取栈跟踪的成本
2. **栈展开**：JVM需要回溯调用栈
3. **异常处理搜索**：JVM查找匹配的catch块

性能优化建议：

- 不要用异常控制正常流程
- 避免捕获再立即重抛
- 精确捕获可能的异常
- 适当使用日志级别

### 39. Java集合框架是如何设计的？常用集合类的底层实现是怎样的？

**Java集合框架(Java Collections Framework)**是Java标准库中用于存储和操作数据集合的架构。它提供了一系列接口和类，使开发者能够以统一、高效的方式处理数据集合。

**1. 集合框架的整体设计**

Java集合框架的设计遵循了几个核心原则：
- **统一的架构**：所有集合类都实现共同的接口
- **接口与实现分离**：通过接口定义行为，具体类实现细节
- **互操作性**：集合之间可以相互转换
- **性能高效**：集合实现针对不同场景进行优化
- **扩展性**：允许用户自定义集合类

**1.1 集合框架的基本结构**

Java集合框架主要包含以下几个核心接口：

![集合框架的继承关系]
```
                 Iterable
                    |
                Collection
                /   |   \
              /     |     \
           Set     List    Queue
           /         \      \
          /           \      \
    SortedSet    RandomAccess  Deque
       |
    NavigableSet
```

**1.2 Map接口及其实现**

Map接口虽然不是Collection的子接口，但也是集合框架的重要组成部分：

```
        Map
        /|\
       / | \
      /  |  \
SortedMap |  ConcurrentMap
     |    |
NavigableMap
```

**2. 主要接口及其特点**

**2.1 Collection接口**
- 集合层次结构的根接口
- 定义了所有集合共有的基本操作
- 主要方法：add(), remove(), contains(), size(), iterator()

**2.2 List接口**
- 有序集合，元素可以重复
- 支持按索引访问元素
- 主要实现：ArrayList, LinkedList, Vector

**2.3 Set接口**
- 不允许重复元素的集合
- 不保证元素顺序（特定实现除外）
- 主要实现：HashSet, LinkedHashSet, TreeSet

**2.4 Queue接口**
- 通常用于存储等待处理的元素
- 按特定顺序（如FIFO）检索元素
- 主要实现：LinkedList, PriorityQueue

**2.5 Map接口**
- 键值对映射
- 键不能重复
- 主要实现：HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap

**3. List实现类的底层原理**

**3.1 ArrayList**

- **数据结构**：基于动态数组
- **随机访问性能**：O(1)，通过索引访问元素
- **内部实现**：
  - 默认初始容量为10
  - 动态增长：当容量不足时，扩容为当前容量的1.5倍
  - 使用transient修饰符避免序列化整个数组
  - 支持快速的随机访问
  - 非线程安全
  
```java
// ArrayList核心源码简化版
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, Serializable {
    // 实际存储元素的数组
    transient Object[] elementData;
    // 当前元素数量
    private int size;
    
    // 添加元素
    public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // 确保容量足够
        elementData[size++] = e;
        return true;
    }
    
    // 按索引获取元素
    public E get(int index) {
        rangeCheck(index);
        return (E) elementData[index];
    }
    
    // 确保内部容量
    private void ensureCapacityInternal(int minCapacity) {
        if (minCapacity - elementData.length > 0)
            grow(minCapacity);
    }
    
    // 扩容逻辑
    private void grow(int minCapacity) {
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1); // 1.5倍扩容
        if (newCapacity < minCapacity) newCapacity = minCapacity;
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
}
```

**3.2 LinkedList**

- **数据结构**：双向链表
- **随机访问性能**：O(n)，需要从头/尾遍历
- **内部实现**：
  - 每个元素都是一个包含前驱和后继引用的节点
  - 同时实现了List和Deque接口
  - 适合频繁的插入和删除操作
  - 非线程安全
  
```java
// LinkedList核心源码简化版
public class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E> {
    // 链表长度
    transient int size;
    // 头节点
    transient Node<E> first;
    // 尾节点
    transient Node<E> last;
    
    // 节点类
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;
        
        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
    
    // 添加元素
    public boolean add(E e) {
        linkLast(e);
        return true;
    }
    
    // 在末尾添加元素
    void linkLast(E e) {
        final Node<E> l = last;
        final Node<E> newNode = new Node<>(l, e, null);
        last = newNode;
        if (l == null)
            first = newNode;
        else
            l.next = newNode;
        size++;
    }
    
    // 获取元素
    public E get(int index) {
        checkElementIndex(index);
        return node(index).item;
    }
    
    // 根据索引获取节点
    Node<E> node(int index) {
        if (index < (size >> 1)) {
            // 从头开始查找
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            // 从尾开始查找
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
}
```

**3.3 Vector**

- **数据结构**：动态数组（与ArrayList相似）
- **特点**：
  - 线程安全（方法被synchronized修饰）
  - 默认容量10，扩容策略是增长原始大小的100%
  - 性能较ArrayList略低（同步开销）
  - 已被ArrayList替代，仅为兼容旧代码保留

**3.4 CopyOnWriteArrayList**

- **数据结构**：内部持有一个数组，所有修改操作都在新数组上进行
- **特点**：
  - 读操作不需要加锁，写操作创建数组副本
  - 适用于读多写少的场景
  - 迭代器不支持修改操作，但保证不抛出ConcurrentModificationException
  - 内存占用较高

**4. Set实现类的底层原理**

**4.1 HashSet**

- **数据结构**：基于HashMap实现
- **内部实现**：
  - 元素作为HashMap的键存储，值使用一个静态Object对象
  - 使用元素的hashCode()和equals()方法判断重复
  - 无序（元素的顺序可能随时间变化）
  - 允许null元素
  
```java
// HashSet核心源码简化版
public class HashSet<E> extends AbstractSet<E> implements Set<E> {
    // 实际存储元素的HashMap
    private transient HashMap<E,Object> map;
    
    // 所有值对应的虚拟对象
    private static final Object PRESENT = new Object();
    
    // 构造函数
    public HashSet() {
        map = new HashMap<>();
    }
    
    // 添加元素
    public boolean add(E e) {
        return map.put(e, PRESENT) == null;
    }
    
    // 判断是否包含元素
    public boolean contains(Object o) {
        return map.containsKey(o);
    }
    
    // 移除元素
    public boolean remove(Object o) {
        return map.remove(o) == PRESENT;
    }
    
    // 迭代器
    public Iterator<E> iterator() {
        return map.keySet().iterator();
    }
    
    // 集合大小
    public int size() {
        return map.size();
    }
}
```

**4.2 LinkedHashSet**

- **数据结构**：基于LinkedHashMap实现的HashSet
- **特点**：
  - 维护插入顺序
  - 性能略低于HashSet
  - 迭代性能优于HashSet

**4.3 TreeSet**

- **数据结构**：基于TreeMap实现的NavigableSet
- **特点**：
  - 元素按照自然顺序或提供的比较器排序
  - 查找、添加和删除操作均为O(log n)
  - 不允许null元素
  - 非线程安全

```java
// TreeSet核心源码简化版
public class TreeSet<E> extends AbstractSet<E> implements NavigableSet<E> {
    // 实际存储的TreeMap
    private transient NavigableMap<E,Object> m;
    
    // 所有值对应的虚拟对象
    private static final Object PRESENT = new Object();
    
    // 构造函数
    public TreeSet() {
        this.m = new TreeMap<>();
    }
    
    public TreeSet(Comparator<? super E> comparator) {
        this.m = new TreeMap<>(comparator);
    }
    
    // 添加元素
    public boolean add(E e) {
        return m.put(e, PRESENT) == null;
    }
    
    // 第一个元素
    public E first() {
        return m.firstKey();
    }
    
    // 最后一个元素
    public E last() {
        return m.lastKey();
    }
}
```

**5. Map实现类的底层原理**

**5.1 HashMap**

- **数据结构**：哈希表 + 链表/红黑树
- **内部实现**：
  - 基于数组 + 链表组成的哈希桶，链表长度超过阈值(8)时转为红黑树
  - 默认初始容量为16，负载因子为0.75
  - 扩容时容量翻倍
  - 非线程安全
  - Java 8以后引入红黑树优化长链表性能

```java
// HashMap核心源码简化版
public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V> {
    // 哈希桶数组
    transient Node<K,V>[] table;
    
    // 键值对数量
    transient int size;
    
    // 扩容阈值
    int threshold;
    
    // 负载因子
    final float loadFactor;
    
    // 默认初始容量
    static final int DEFAULT_INITIAL_CAPACITY = 16;
    
    // 默认负载因子
    static final float DEFAULT_LOAD_FACTOR = 0.75f;
    
    // 树化阈值
    static final int TREEIFY_THRESHOLD = 8;
    
    // 基本节点
    static class Node<K,V> implements Map.Entry<K,V> {
        final int hash;
        final K key;
        V value;
        Node<K,V> next;
        
        // 构造函数
        Node(int hash, K key, V value, Node<K,V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }
    
    // 放入键值对
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }
    
    // 获取键对应的值
    public V get(Object key) {
        Node<K,V> e = getNode(hash(key), key);
        return e == null ? null : e.value;
    }
}
```

**HashMap的哈希冲突解决**：

1. **链地址法**：相同哈希值的元素放在同一链表
2. **红黑树优化**：链表长度超过阈值时转换为红黑树
3. **哈希函数优化**：减少哈希冲突

**5.2 LinkedHashMap**

- **数据结构**：哈希表 + 双向链表
- **特点**：
  - 继承自HashMap，增加了双向链表维护元素顺序
  - 可按插入顺序或访问顺序排序（构造时指定）
  - 适合构建LRU缓存
  - 迭代性能优于HashMap

**5.3 TreeMap**

- **数据结构**：红黑树
- **特点**：
  - 基于红黑树(自平衡二叉查找树)实现
  - 键按自然顺序或提供的比较器排序
  - 查找、添加和删除操作均为O(log n)
  - 非线程安全

**5.4 ConcurrentHashMap**

- **数据结构**：分段锁数组(Java 7) / 哈希表+CAS+Synchronized(Java 8+)
- **Java 7实现**：
  - 数据分为多个Segment，每个Segment独立加锁
  - 每个Segment类似一个独立的HashMap
  - 读操作无锁，写操作仅锁定对应段
  - 默认16个Segment

- **Java 8及以后实现**：
  - 摒弃了Segment设计，直接使用Node数组
  - 使用CAS和synchronized保证线程安全
  - 锁粒度更细，只锁定当前桶
  - 支持红黑树优化

**5.5 Hashtable**

- **数据结构**：哈希表
- **特点**：
  - 线程安全（方法被synchronized修饰）
  - 不允许null键和null值
  - 性能不如ConcurrentHashMap
  - 已被更高效的实现替代

**6. Queue/Deque实现类的底层原理**

**6.1 ArrayDeque**

- **数据结构**：循环数组
- **特点**：
  - 实现了Deque接口，可用作栈或队列
  - 无固定容量限制，自动扩容
  - 不允许null元素
  - 作为栈比Stack性能更好，作为队列比LinkedList性能更好
  - 非线程安全

**6.2 PriorityQueue**

- **数据结构**：基于堆(完全二叉树)
- **特点**：
  - 元素按优先级排序(自然顺序或比较器)
  - 堆顶元素始终是最小元素
  - 插入和删除的时间复杂度为O(log n)
  - 非线程安全

**6.3 LinkedList作为Queue/Deque**

- LinkedList同时实现了List和Deque接口
- 可以用作队列、栈或双端队列
- 链表结构使其在两端增删元素的性能很好

**7. 并发集合类**

Java提供了多种线程安全的集合实现：

**7.1 ConcurrentHashMap**
- 替代Hashtable的高效并发Map实现
- 读操作完全并发，写操作局部锁定

**7.2 CopyOnWriteArrayList/CopyOnWriteArraySet**
- 适用于读多写少的场景
- 修改操作通过复制整个数组实现
- 迭代过程中不会抛出ConcurrentModificationException

**7.3 ConcurrentSkipListMap/ConcurrentSkipListSet**
- 基于跳表实现的并发排序Map/Set
- 替代TreeMap/TreeSet的并发版本
- 所有操作都是线程安全的

**8. 集合工具类**

**8.1 Collections类**

提供了操作集合的静态方法：

- **同步包装器**：synchronizedList(), synchronizedMap()
- **不可变包装器**：unmodifiableList(), unmodifiableMap()
- **类型安全包装器**：checkedList(), checkedMap()
- **单例集合**：singletonList(), singletonMap()
- **空集合**：emptyList(), emptyMap()
- **排序和查找**：sort(), binarySearch()
- **其他操作**：reverse(), shuffle(), min(), max()

**8.2 Arrays类**

提供了操作数组的静态方法：

- **数组与集合转换**：asList()
- **排序和查找**：sort(), binarySearch()
- **复制和填充**：copyOf(), fill()
- **比较**：equals(), compare()
- **流操作**：stream()（Java 8+）

**9. 集合框架的性能比较**

| 集合类 | 随机访问 | 插入/删除 | 查找 | 内存占用 | 有序性 |
|-------|----------|----------|------|---------|-------|
| ArrayList | O(1) | O(n)* | O(n) | 低 | 插入顺序 |
| LinkedList | O(n) | O(1)** | O(n) | 高 | 插入顺序 |
| HashSet | 不支持 | O(1) | O(1) | 中 | 无序 |
| LinkedHashSet | 不支持 | O(1) | O(1) | 高 | 插入顺序 |
| TreeSet | 不支持 | O(log n) | O(log n) | 中 | 排序 |
| HashMap | O(1) | O(1) | O(1) | 中 | 无序 |
| LinkedHashMap | O(1) | O(1) | O(1) | 高 | 可选 |
| TreeMap | O(log n) | O(log n) | O(log n) | 中 | 排序 |

*: 末尾插入为O(1)，中间插入需要移动元素  
**: 需要先找到位置，实际复杂度取决于插入位置

**10. 选择合适的集合类**

根据需求选择合适的集合实现：

1. **需要按索引访问元素**：ArrayList
2. **需要频繁插入、删除元素**：LinkedList
3. **需要保证元素唯一性**：HashSet
4. **需要保证元素唯一且有序**：TreeSet
5. **需要键值对映射**：HashMap
6. **需要键值对且保持插入顺序**：LinkedHashMap
7. **需要键值对且按键排序**：TreeMap
8. **需要线程安全的Map**：ConcurrentHashMap
9. **需要优先级队列**：PriorityQueue
10. **需要双端队列**：ArrayDeque

### 40. Java中的IO模型有哪些？NIO如何实现多路复用？

Java提供了多种I/O模型来处理输入/输出操作，每种模型都有其特定的用途和性能特点。理解这些I/O模型对于开发高性能的Java应用至关重要。

**1. Java I/O模型概览**

Java中主要有四种I/O模型：

**1.1 BIO (Blocking I/O)**
- 传统的阻塞式I/O模型
- 线程发起I/O操作后阻塞等待完成
- 简单直观但扩展性较差

**1.2 NIO (Non-blocking I/O)**
- 非阻塞I/O，基于选择器的多路复用
- 单线程可同时处理多个连接
- 提高了资源利用率和系统吞吐量

**1.3 AIO (Asynchronous I/O)**
- 异步I/O，也称为NIO.2
- 操作系统完成I/O操作后通知应用程序
- 真正的异步非阻塞I/O模型

**1.4 IO多路复用**
- 底层依赖操作系统的select/poll/epoll机制
- NIO通过Selector实现了Java层面的多路复用
- 允许单线程监控多个文件描述符

**2. BIO (Blocking I/O)**

**2.1 工作原理**：
- 一个连接一个线程处理
- I/O操作是同步阻塞的
- 线程在执行读/写操作时被阻塞，直到操作完成

**2.2 代码示例**：
```java
// BIO服务器示例
ServerSocket serverSocket = new ServerSocket(8080);
while (true) {
    // 阻塞等待客户端连接
    Socket clientSocket = serverSocket.accept();
    
    // 为每个客户端创建一个线程处理
    new Thread(() -> {
        try {
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(clientSocket.getInputStream()));
            PrintWriter writer = new PrintWriter(clientSocket.getOutputStream(), true);
            
            String line;
            // 阻塞读取客户端数据
            while ((line = reader.readLine()) != null) {
                writer.println("Echo: " + line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }).start();
}
```

**2.3 BIO的缺点**：
- 连接数增加时，需要创建大量线程
- 线程资源消耗大
- 线程阻塞导致低效，每个连接无论活跃与否都占用一个线程
- 适合连接数少且稳定的场景

**3. NIO (Non-blocking I/O)**

**3.1 核心组件**：

- **Buffer (缓冲区)**
  - 数据的容器，直接与通道交互
  - 常用实现有ByteBuffer, CharBuffer, IntBuffer等
  - 提供了高效的数据读写操作

- **Channel (通道)**
  - 双向数据通道，支持读取和写入
  - 常用实现有FileChannel, SocketChannel, ServerSocketChannel等
  - 可以注册到Selector上进行多路复用

- **Selector (选择器)**
  - 允许单线程处理多个Channel
  - 基于事件驱动模型
  - 通过select()方法监控注册的Channel状态

**3.2 NIO工作原理**：

1. 创建一个Selector
2. 将Channel注册到Selector上，关注特定事件
3. 调用Selector的select()方法阻塞等待事件发生
4. 处理已就绪的事件
5. 重复步骤3-4

**3.3 代码示例**：

```java
// NIO服务器示例
// 创建Selector
Selector selector = Selector.open();

// 创建ServerSocketChannel
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));
serverChannel.configureBlocking(false); // 设置为非阻塞模式

// 注册到Selector
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    // 阻塞等待事件，返回准备就绪的通道数
    int readyChannels = selector.select();
    if (readyChannels == 0) continue;
    
    // 获取就绪事件
    Set<SelectionKey> selectedKeys = selector.selectedKeys();
    Iterator<SelectionKey> keyIterator = selectedKeys.iterator();
    
    while (keyIterator.hasNext()) {
        SelectionKey key = keyIterator.next();
        
        if (key.isAcceptable()) {
            // 处理接受连接事件
            ServerSocketChannel server = (ServerSocketChannel) key.channel();
            SocketChannel client = server.accept();
            client.configureBlocking(false);
            // 注册读事件
            client.register(selector, SelectionKey.OP_READ);
        } else if (key.isReadable()) {
            // 处理读事件
            SocketChannel client = (SocketChannel) key.channel();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            int bytesRead = client.read(buffer);
            
            if (bytesRead > 0) {
                buffer.flip();
                client.write(buffer);
                buffer.clear();
            } else if (bytesRead == -1) {
                // 客户端断开连接
                client.close();
            }
        }
        
        // 从集合中移除已处理的事件
        keyIterator.remove();
    }
}
```

**3.4 Buffer的基本操作**：

```java
// 创建缓冲区
ByteBuffer buffer = ByteBuffer.allocate(1024);

// 写入数据
buffer.put("Hello".getBytes());

// 切换到读模式
buffer.flip();

// 读取数据
byte[] data = new byte[buffer.limit()];
buffer.get(data);

// 清空缓冲区，准备写入
buffer.clear();
```

**3.5 Buffer的三个重要属性**：

- **capacity**：缓冲区的总容量
- **position**：当前读写位置
- **limit**：可读写的上限

**3.6 Buffer的主要方法**：

- **flip()**：从写模式切换到读模式
- **rewind()**：重置position到0，保持limit不变
- **clear()**：清空整个缓冲区
- **compact()**：清空已读数据，保留未读数据
- **mark()/reset()**：标记当前位置/恢复到标记位置

**4. NIO的多路复用机制**

**4.1 多路复用概念**：

多路复用是指使用一个线程监听多个连接（Channel），只有当连接上有数据可以非阻塞地进行I/O操作时，才对这些连接进行操作，避免同步阻塞造成的线程资源浪费。

**4.2 实现原理**：

1. **事件注册**：将Channel注册到Selector，关联感兴趣的事件
2. **事件监听**：Selector监听所有注册的Channel
3. **事件分发**：当Channel有事件发生时，Selector通知应用程序处理

**4.3 可注册的事件类型**：

- **SelectionKey.OP_READ**：Channel可读
- **SelectionKey.OP_WRITE**：Channel可写
- **SelectionKey.OP_CONNECT**：客户端Channel连接完成
- **SelectionKey.OP_ACCEPT**：服务器Channel接受新连接

**4.4 SelectionKey**：

SelectionKey代表Channel在Selector中的注册关系，包含：
- 对应的Channel和Selector
- 感兴趣的事件集合
- 已就绪的事件集合
- 可附加的对象（attachment）

```java
// SelectionKey操作示例
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);

// 修改关注的事件
key.interestOps(SelectionKey.OP_READ | SelectionKey.OP_WRITE);

// 获取已就绪事件
int readyOps = key.readyOps();
boolean isReadable = key.isReadable(); // 等价于(readyOps & SelectionKey.OP_READ) != 0

// 附加对象
key.attach(new ClientSession());
ClientSession session = (ClientSession)key.attachment();
```

**4.5 Selector的核心方法**：

- **select()**：阻塞选择准备就绪的通道
- **select(long timeout)**：最多阻塞timeout毫秒
- **selectNow()**：非阻塞选择
- **wakeup()**：唤醒阻塞在select()的线程
- **close()**：关闭选择器

**4.6 NIO多路复用的底层实现**：

Java NIO的多路复用在不同操作系统上有不同实现：
- **Windows**：基于select实现
- **Linux**：2.6以前使用poll，2.6以后使用epoll
- **macOS/BSD**：使用kqueue

**Selector的底层调用**：
1. Linux上创建Selector实际上是创建epoll实例
2. 将Channel注册到Selector相当于调用epoll_ctl
3. select操作对应epoll_wait系统调用

**5. AIO (Asynchronous I/O)**

**5.1 概念**：

- Java 7引入的NIO.2包提供了异步I/O功能
- 基于回调机制：应用程序发起I/O操作后立即返回
- 操作系统完成I/O后通知应用程序
- 真正的异步非阻塞I/O模型

**5.2 核心组件**：

- **AsynchronousChannel**：异步通道接口
- **AsynchronousSocketChannel**：异步Socket通道
- **AsynchronousServerSocketChannel**：异步服务器Socket通道
- **AsynchronousFileChannel**：异步文件通道
- **CompletionHandler**：操作完成时的回调接口

**5.3 工作原理**：

1. 应用程序发起异步I/O操作
2. 指定CompletionHandler回调
3. I/O操作立即返回
4. 操作系统完成I/O后调用回调函数

**5.4 代码示例**：

```java
// AIO服务器示例
AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));

// 接受连接
serverChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
    @Override
    public void completed(AsynchronousSocketChannel clientChannel, Void attachment) {
        // 继续接受下一个连接
        serverChannel.accept(null, this);
        
        // 分配缓冲区
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        
        // 异步读取
        clientChannel.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
            @Override
            public void completed(Integer bytesRead, ByteBuffer buffer) {
                if (bytesRead > 0) {
                    buffer.flip();
                    // 异步写回
                    clientChannel.write(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
                        @Override
                        public void completed(Integer bytesWritten, ByteBuffer buffer) {
                            if (buffer.hasRemaining()) {
                                // 继续写入剩余数据
                                clientChannel.write(buffer, buffer, this);
                            } else {
                                // 准备下一次读取
                                buffer.clear();
                                clientChannel.read(buffer, buffer, CompletionHandler.this);
                            }
                        }
                        
                        @Override
                        public void failed(Throwable exc, ByteBuffer attachment) {
                            try {
                                clientChannel.close();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    });
                }
            }
            
            @Override
            public void failed(Throwable exc, ByteBuffer attachment) {
                try {
                    clientChannel.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    @Override
    public void failed(Throwable exc, Void attachment) {
        exc.printStackTrace();
    }
});

// 保持主线程不退出
Thread.currentThread().join();
```

**5.5 Future方式**：

除了使用CompletionHandler回调，AIO也支持Future风格：

```java
// 使用Future
AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(
    Paths.get("test.txt"), StandardOpenOption.READ);
    
ByteBuffer buffer = ByteBuffer.allocate(1024);
Future<Integer> result = fileChannel.read(buffer, 0);

// 可以执行其他操作...

// 阻塞等待结果
int bytesRead = result.get(); // 阻塞直到读取完成
```

**6. 各种I/O模型的对比**

| 特性 | BIO | NIO | AIO |
|-----|-----|-----|-----|
| 阻塞类型 | 阻塞 | 非阻塞 | 异步非阻塞 |
| 编程复杂度 | 简单 | 复杂 | 较复杂 |
| 调用方式 | 同步 | 同步(多路复用) | 异步 |
| 适用场景 | 连接数少 | 高并发连接 | I/O密集型 |
| 可靠性 | 较高 | 较高 | 一般 |
| 吞吐量 | 低 | 高 | 高 |

**7. Reactor模式与Proactor模式**

**7.1 Reactor模式**：

- NIO采用的是Reactor模式
- 应用程序通过Selector主动监听事件
- 事件发生时，应用程序负责处理I/O操作
- 同步非阻塞模型

**Reactor模式的角色**：
- **Reactor**：负责监听和分发事件
- **Handler**：处理特定事件
- **Acceptor**：处理客户端连接请求

**7.2 Proactor模式**：

- AIO采用的是Proactor模式
- 应用程序发起异步I/O操作后立即返回
- 系统完成实际I/O操作并通知应用程序
- 异步非阻塞模型

**Proactor模式的角色**：
- **Proactor**：管理异步I/O操作
- **Completion Handler**：处理异步I/O完成事件
- **Asynchronous Operation**：表示异步操作

**8. NIO的适用场景与实践**

**8.1 适用场景**：

- 高并发连接服务器
- 需要管理大量连接但活动连接较少的情况
- 长连接应用（如聊天服务器）
- 需要高吞吐量和低延迟的场景

**8.2 NIO的局限性**：

- 编程模型复杂
- 调试困难
- 在连接数较少时，BIO可能更简单高效
- 依赖操作系统的I/O多路复用支持

**8.3 常见问题及解决方案**：

- **空轮询bug**：早期JDK版本的Selector在某些Linux系统上会出现CPU 100%的bug
  - 解决：升级JDK或重建Selector

- **内存泄漏**：未正确关闭资源可能导致内存泄漏
  - 解决：使用try-with-resources或finally块确保资源关闭

- **数据传输不完整**：非阻塞模式下，read/write方法可能不会一次完成所有数据传输
  - 解决：循环处理，或使用更高级的缓冲区管理

- **多线程访问**：Selector和相关组件不是线程安全的
  - 解决：适当使用同步机制，或采用多Selector模型

**8.4 NIO最佳实践**：

1. **Buffer管理**：
   - 正确处理Buffer的读写模式切换(flip/clear/compact)
   - 考虑使用直接缓冲区(DirectByteBuffer)提高性能
   - 注意缓冲区大小设置，避免过大或过小

2. **Channel管理**：
   - 确保正确关闭Channel
   - 适当配置Channel参数(如TCP参数)
   - 对于文件Channel，考虑使用内存映射或文件锁定

3. **Selector管理**：
   - 定期检查Selector的健康状态
   - 考虑多Selector多线程模型分担负载
   - 适当处理wakeup()机制

4. **异常处理**：
   - 捕获和处理特定的I/O异常
   - 实现正确的错误恢复机制
   - 避免异常导致整个服务器崩溃

**9. 基于Java NIO的开源框架**

**9.1 Netty**：
- 高性能的NIO客户端/服务器框架
- 简化了NIO编程模型
- 提供了丰富的协议支持和编解码器
- 广泛用于高性能网络应用开发

**9.2 Apache MINA**：
- 类似Netty的NIO框架
- 提供了抽象的I/O API
- 支持多种传输协议

**9.3 Grizzly**：
- Oracle开发的NIO框架
- 是Glassfish服务器的网络层
- 支持HTTP/HTTPS等协议

**9.4 Eclipse Vert.x**：
- 基于Netty的反应式应用平台
- 提供了多语言API
- 事件驱动、非阻塞的编程模型

**10. 小结与展望**

**10.1 选择合适的I/O模型**：

- **BIO**：简单应用，连接数少
- **NIO**：高并发服务器，需要处理大量连接
- **AIO**：需要真正异步I/O的场景，如大文件处理

**10.2 未来趋势**：

- 反应式编程模型的普及
- 基于NIO的框架继续发展
- 与Java异步编程模型(CompletableFuture, Flow API)的融合
- 对新型I/O设备(如NVMe SSD)的优化支持

### 41. Java多线程编程的基本概念和实现方式有哪些？

**多线程编程**是Java语言的核心特性之一，它允许程序同时执行多个线程，提高程序的效率和响应性。理解多线程的基本概念和实现方式对于开发高效的Java应用至关重要。

**1. 多线程基础概念**

**1.1 进程与线程的区别**

- **进程(Process)**：
  - 操作系统资源分配的基本单位
  - 拥有独立的内存空间
  - 进程间通信(IPC)相对复杂

- **线程(Thread)**：
  - CPU调度的基本单位
  - 共享所属进程的内存空间
  - 线程间通信相对简单
  - 创建和销毁开销小于进程

**1.2 多线程的优势**

1. **提高资源利用率**：CPU空闲时可执行其他线程
2. **提高响应性**：耗时操作不会阻塞整个程序
3. **简化程序设计**：将复杂任务分解为多个并行执行的子任务

**1.3 多线程的挑战**

1. **线程安全问题**：共享资源访问冲突
2. **死锁、活锁、饥饿**：并发编程中的常见问题
3. **难以调试**：并发bug难以重现和定位
4. **性能开销**：线程创建、上下文切换的开销

**2. 线程的生命周期**

Java线程的生命周期包含以下状态，由`Thread.State`枚举定义：

1. **NEW**：线程创建但未启动
2. **RUNNABLE**：线程正在运行或等待CPU时间片
3. **BLOCKED**：线程阻塞，等待获取监视器锁
4. **WAITING**：线程无限期等待另一个线程执行特定操作
5. **TIMED_WAITING**：线程等待另一个线程执行操作，但有超时限制
6. **TERMINATED**：线程已执行完毕

**线程状态转换图**：

```
    NEW
     |
     v
 RUNNABLE <------+
 /   |   \       |
v    v    v      |
BLOCKED  WAITING TIMED_WAITING
     \     |    /
      \    |   /
       v   v  v
     TERMINATED
```

**3. 创建线程的方式**

**3.1 继承Thread类**

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        // 线程执行代码
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start(); // 启动线程
    }
}
```

**优点**：简单直观
**缺点**：Java单继承限制，无法继承其他类

**3.2 实现Runnable接口**

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        // 线程执行代码
        System.out.println("Thread running: " + Thread.currentThread().getName());
    }
    
    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start(); // 启动线程
        
        // 使用Lambda表达式(Java 8+)
        Thread thread2 = new Thread(() -> {
            System.out.println("Lambda thread running");
        });
        thread2.start();
    }
}
```

**优点**：可以继承其他类，更好地面向对象
**缺点**：无法直接获取线程执行结果

**3.3 实现Callable接口和使用FutureTask**

```java
public class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        // 计算并返回结果
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        return sum;
    }
    
    public static void main(String[] args) throws Exception {
        // 创建Callable实例
        MyCallable callable = new MyCallable();
        // 包装为FutureTask
        FutureTask<Integer> futureTask = new FutureTask<>(callable);
        // 创建线程执行任务
        Thread thread = new Thread(futureTask);
        thread.start();
        
        // 获取计算结果
        Integer result = futureTask.get(); // 阻塞等待结果
        System.out.println("Result: " + result);
    }
}
```

**优点**：可以获取线程执行结果，可以抛出异常
**缺点**：使用较复杂

**3.4 使用线程池**

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class ThreadPoolExample {
    public static void main(String[] args) throws Exception {
        // 创建固定大小的线程池
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        // 提交Runnable任务
        executor.execute(() -> {
            System.out.println("Runnable task executed");
        });
        
        // 提交Callable任务并获取结果
        Future<Integer> future = executor.submit(() -> {
            Thread.sleep(1000);
            return 123;
        });
        
        Integer result = future.get();
        System.out.println("Result: " + result);
        
        // 关闭线程池
        executor.shutdown();
    }
}
```

**优点**：
- 重用线程，减少创建和销毁线程的开销
- 控制并发数，避免资源耗尽
- 提供任务管理和执行服务

**常见的线程池类型**：
- **FixedThreadPool**：固定大小线程池
- **CachedThreadPool**：可缓存线程池，自动调整大小
- **SingleThreadExecutor**：单线程执行器
- **ScheduledThreadPool**：定时任务线程池
- **ForkJoinPool**：Fork/Join框架使用的线程池(Java 7+)

**4. 线程同步与协作**

**4.1 线程同步**

线程同步是确保多个线程安全访问共享资源的机制。

**4.1.1 synchronized关键字**

```java
// 同步方法
public synchronized void syncMethod() {
    // 同步代码
}

// 同步代码块
public void method() {
    synchronized(this) {
        // 同步代码
    }
}

// 同步静态方法(类锁)
public static synchronized void staticSyncMethod() {
    // 同步代码
}

// 同步类
public void method() {
    synchronized(MyClass.class) {
        // 同步代码
    }
}
```

**4.1.2 Lock接口**

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockExample {
    private final Lock lock = new ReentrantLock();
    private int count = 0;
    
    public void increment() {
        lock.lock(); // 获取锁
        try {
            count++;
        } finally {
            lock.unlock(); // 释放锁
        }
    }
    
    // 支持中断的锁获取
    public void incrementInterruptibly() throws InterruptedException {
        lock.lockInterruptibly(); // 可中断锁
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
    
    // 尝试获取锁
    public boolean tryIncrement() {
        if (lock.tryLock()) { // 尝试获取锁但不阻塞
            try {
                count++;
                return true;
            } finally {
                lock.unlock();
            }
        }
        return false;
    }
}
```

**4.1.3 ReadWriteLock**

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockExample {
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private int data = 0;
    
    public int readData() {
        rwLock.readLock().lock(); // 获取读锁
        try {
            return data;
        } finally {
            rwLock.readLock().unlock(); // 释放读锁
        }
    }
    
    public void writeData(int newData) {
        rwLock.writeLock().lock(); // 获取写锁
        try {
            data = newData;
        } finally {
            rwLock.writeLock().unlock(); // 释放写锁
        }
    }
}
```

**4.1.4 volatile关键字**

```java
public class VolatileExample {
    private volatile boolean flag = false; // 保证可见性
    
    public void setFlag() {
        flag = true;
    }
    
    public void doWork() {
        while (!flag) {
            // 等待flag变为true
            // 由于flag是volatile的，其他线程对flag的修改对本线程可见
        }
        // flag为true时继续执行
    }
}
```

**4.2 线程协作**

线程协作是线程之间相互配合完成任务的机制。

**4.2.1 wait/notify/notifyAll**

```java
public class WaitNotifyExample {
    private final Object lock = new Object();
    private boolean condition = false;
    
    public void producer() {
        synchronized (lock) {
            while (condition) {
                try {
                    lock.wait(); // 等待条件变化
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            condition = true;
            // 生产数据
            lock.notifyAll(); // 通知等待的消费者
        }
    }
    
    public void consumer() {
        synchronized (lock) {
            while (!condition) {
                try {
                    lock.wait(); // 等待条件变化
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            condition = false;
            // 消费数据
            lock.notifyAll(); // 通知等待的生产者
        }
    }
}
```

**4.2.2 Condition接口**

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionExample {
    private final Lock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();
    private final Object[] items = new Object[100];
    private int count = 0, putIndex = 0, takeIndex = 0;
    
    public void put(Object item) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) {
                notFull.await(); // 队列满了，等待消费者消费
            }
            items[putIndex] = item;
            putIndex = (putIndex + 1) % items.length;
            count++;
            notEmpty.signal(); // 通知消费者可以消费了
        } finally {
            lock.unlock();
        }
    }
    
    public Object take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {
                notEmpty.await(); // 队列空了，等待生产者生产
            }
            Object item = items[takeIndex];
            items[takeIndex] = null;
            takeIndex = (takeIndex + 1) % items.length;
            count--;
            notFull.signal(); // 通知生产者可以生产了
            return item;
        } finally {
            lock.unlock();
        }
    }
}
```

**4.2.3 CountDownLatch**

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3); // 初始计数为3
        
        // 创建3个工作线程
        for (int i = 0; i < 3; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    System.out.println("Worker " + num + " is working");
                    Thread.sleep(1000); // 模拟工作
                    latch.countDown(); // 完成工作，计数减1
                    System.out.println("Worker " + num + " finished");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
        
        System.out.println("Main thread waiting for all workers");
        latch.await(); // 主线程等待计数器归零
        System.out.println("All workers finished, main thread continues");
    }
}
```

**4.2.4 CyclicBarrier**

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        // 创建栅栏，所有线程到达后执行指定任务
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("All threads have reached the barrier, continue processing");
        });
        
        for (int i = 0; i < 3; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + num + " is working");
                    Thread.sleep(1000); // 模拟工作
                    System.out.println("Thread " + num + " reached the barrier");
                    barrier.await(); // 等待其他线程到达
                    System.out.println("Thread " + num + " continues after barrier");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

**4.2.5 Semaphore**

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    public static void main(String[] args) {
        // 创建信号量，只允许3个线程同时访问资源
        Semaphore semaphore = new Semaphore(3);
        
        for (int i = 0; i < 6; i++) {
            final int num = i;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + num + " is waiting for permit");
                    semaphore.acquire(); // 获取许可
                    System.out.println("Thread " + num + " got permit");
                    Thread.sleep(1000); // 使用资源
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    System.out.println("Thread " + num + " releases permit");
                    semaphore.release(); // 释放许可
                }
            }).start();
        }
    }
}
```

**4.2.6 Phaser**

```java
import java.util.concurrent.Phaser;

public class PhaserExample {
    public static void main(String[] args) {
        Phaser phaser = new Phaser(3); // 注册3个参与者
        
        for (int i = 0; i < 3; i++) {
            final int num = i;
            new Thread(() -> {
                // 阶段1
                System.out.println("Thread " + num + " completing phase 1");
                phaser.arriveAndAwaitAdvance(); // 等待所有线程完成阶段1
                
                // 阶段2
                System.out.println("Thread " + num + " completing phase 2");
                phaser.arriveAndAwaitAdvance(); // 等待所有线程完成阶段2
                
                // 阶段3
                System.out.println("Thread " + num + " completing phase 3");
                phaser.arriveAndDeregister(); // 完成并退出Phaser
            }).start();
        }
    }
}
```

**5. 线程安全的集合类**

Java提供了多种线程安全的集合类，适用于不同场景：

**5.1 同步集合类**

- **Vector**：线程安全的ArrayList
- **Hashtable**：线程安全的HashMap
- **Collections.synchronizedXxx()**：将普通集合包装为同步集合

```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

**5.2 并发集合类**

- **ConcurrentHashMap**：分段锁实现的线程安全HashMap
- **CopyOnWriteArrayList**：写时复制的ArrayList
- **CopyOnWriteArraySet**：基于CopyOnWriteArrayList的Set实现
- **ConcurrentSkipListMap**：基于跳表的排序Map
- **ConcurrentSkipListSet**：基于ConcurrentSkipListMap的排序Set

```java
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();
List<String> concurrentList = new CopyOnWriteArrayList<>();
```

**5.3 阻塞队列**

- **ArrayBlockingQueue**：基于数组的有界阻塞队列
- **LinkedBlockingQueue**：基于链表的可选有界阻塞队列
- **PriorityBlockingQueue**：基于优先级堆的无界阻塞队列
- **DelayQueue**：延迟元素队列
- **SynchronousQueue**：无缓冲的阻塞队列，直接交付

```java
BlockingQueue<Task> taskQueue = new ArrayBlockingQueue<>(100);

// 生产者
void producer() throws InterruptedException {
    Task task = createTask();
    taskQueue.put(task); // 如果队列满，会阻塞
}

// 消费者
void consumer() throws InterruptedException {
    Task task = taskQueue.take(); // 如果队列空，会阻塞
    processTask(task);
}
```

**6. ThreadLocal**

ThreadLocal提供线程局部变量，每个线程都有自己独立的副本，实现线程隔离。

```java
public class ThreadLocalExample {
    // 创建ThreadLocal变量
    private static final ThreadLocal<SimpleDateFormat> dateFormatThreadLocal = 
        ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
    
    public static String formatDate(Date date) {
        // 获取当前线程的SimpleDateFormat
        return dateFormatThreadLocal.get().format(date);
    }
    
    public static void main(String[] args) {
        // 多个线程使用同一个方法，但每个线程都有自己的SimpleDateFormat实例
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                System.out.println(formatDate(new Date()));
                // 使用完毕后清除，防止内存泄漏
                dateFormatThreadLocal.remove();
            }).start();
        }
    }
}
```

**注意**：使用ThreadLocal时要注意及时调用remove()方法，防止内存泄漏。

**7. 线程安全性**

**7.1 线程安全的定义**

线程安全指的是在多线程环境下，对共享资源的操作不会产生不可预期的结果。

**7.2 实现线程安全的方法**

1. **不可变性**：创建不可变对象，如String、Integer等
2. **互斥同步**：使用synchronized、Lock等同步访问共享资源
3. **非阻塞同步**：使用CAS(Compare And Swap)等原子操作
4. **避免共享**：使用ThreadLocal等确保资源不共享
5. **线程安全类**：使用现成的线程安全集合和工具类

**7.3 线程安全的实例设计**

```java
// 不可变对象
public final class ImmutableValue {
    private final int value;
    
    public ImmutableValue(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
    
    public ImmutableValue add(int valueToAdd) {
        return new ImmutableValue(this.value + valueToAdd);
    }
}

// 使用原子类
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet(); // 原子操作，无需额外同步
    }
    
    public int getCount() {
        return count.get();
    }
}
```

**8. 并发编程的最佳实践**

1. **优先使用不可变对象**：避免同步问题
2. **减少锁的粒度**：只锁定必要的代码块
3. **避免在循环中加锁**：尽量将锁移到循环外
4. **避免过度同步**：会降低并发性能
5. **优先使用并发集合**：而非同步包装器
6. **正确使用wait/notify**：总是在循环中检查等待条件
7. **避免嵌套锁**：降低死锁风险
8. **设置合理的线程池大小**：考虑CPU核心数和任务类型
9. **使用线程池执行异步任务**：优于手动创建线程
10. **使用非阻塞算法**：提高并发性能

**9. Java 8+中的并发增强**

**9.1 CompletableFuture**

```java
import java.util.concurrent.CompletableFuture;

public class CompletableFutureExample {
    public static void main(String[] args) throws Exception {
        // 异步执行任务
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Hello";
        });
        
        // 对结果进行转换
        CompletableFuture<String> greetingFuture = future.thenApply(s -> s + " World");
        
        // 消费结果
        greetingFuture.thenAccept(System.out::println);
        
        // 组合两个Future
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");
        
        CompletableFuture<String> combined = future1.thenCombine(future2, (s1, s2) -> s1 + " " + s2);
        System.out.println(combined.get()); // Hello World
    }
}
```

**9.2 并行流(Parallel Streams)**

```java
import java.util.Arrays;
import java.util.List;

public class ParallelStreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // 串行流
        long count1 = numbers.stream()
                .filter(n -> n % 2 == 0)
                .count();
        
        // 并行流
        long count2 = numbers.parallelStream()
                .filter(n -> n % 2 == 0)
                .count();
    }
}
```

**9.3 StampedLock**

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockExample {
    private double x, y;
    private final StampedLock lock = new StampedLock();
    
    // 写锁
    public void move(double deltaX, double deltaY) {
        long stamp = lock.writeLock();
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
    
    // 乐观读
    public double distanceFromOrigin() {
        // 乐观读取(无锁)
        long stamp = lock.tryOptimisticRead();
        double currentX = x, currentY = y;
        
        // 检查读期间是否有修改
        if (!lock.validate(stamp)) {
            // 悲观读取(获取读锁)
            stamp = lock.readLock();
            try {
                currentX = x;
                currentY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
}
```

**9.4 CountedCompleter**

```java
import java.util.concurrent.CountedCompleter;
import java.util.concurrent.ForkJoinPool;

public class CountedCompleterExample {
    public static void main(String[] args) {
        int[] array = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        Sum sum = new Sum(null, array, 0, array.length);
        ForkJoinPool.commonPool().invoke(sum);
        System.out.println("Sum: " + sum.result);
    }
    
    static class Sum extends CountedCompleter<Void> {
        final int[] array;
        final int lo, hi;
        int result;
        
        Sum(Sum parent, int[] array, int lo, int hi) {
            super(parent);
            this.array = array;
            this.lo = lo;
            this.hi = hi;
        }
        
        @Override
        public void compute() {
            if (hi - lo > 1) {
                int mid = (lo + hi) >>> 1;
                // 创建子任务
                Sum left = new Sum(this, array, lo, mid);
                Sum right = new Sum(this, array, mid, hi);
                // 设置待完成的子任务数量
                setPendingCount(2);
                // 启动子任务
                left.fork();
                right.fork();
            } else {
                if (hi > lo)
                    result = array[lo];
                tryComplete(); // 尝试完成当前任务
            }
        }
        
        @Override
        public void onCompletion(CountedCompleter<?> caller) {
            if (caller != this) {
                Sum child = (Sum)caller;
                result += child.result;
            }
        }
    }
}
```

**10. 多线程调试与故障排除**

**10.1 常见并发问题**

1. **竞态条件**：多线程访问共享资源时结果依赖于线程执行顺序
2. **死锁**：两个或多个线程互相等待对方持有的锁
3. **活锁**：线程不断重试失败的操作，但互相让步而无法前进
4. **线程饥饿**：线程无法获取所需资源而无法继续执行
5. **过度同步**：同步过多导致性能下降

**10.2 死锁检测与解决**

死锁发生的四个必要条件：
1. 互斥：资源不能被共享
2. 持有并等待：线程持有资源同时等待其他资源
3. 不可剥夺：资源只能由持有者自愿释放
4. 循环等待：存在循环的资源依赖链

解决死锁的方法：
1. **避免嵌套锁**：按固定顺序获取锁
2. **使用tryLock()**：带超时的锁获取
3. **使用无锁数据结构**：避免使用显式锁
4. **检测与恢复**：定期检查死锁并回滚操作

**死锁示例及修复**：

```java
// 死锁示例
public class DeadlockExample {
    private final Object resource1 = new Object();
    private final Object resource2 = new Object();
    
    public void method1() {
        synchronized(resource1) {
            System.out.println("Thread 1: Holding resource 1...");
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            synchronized(resource2) {
                System.out.println("Thread 1: Holding resource 1 & 2...");
            }
        }
    }
    
    public void method2() {
        synchronized(resource2) { // 锁获取顺序与method1相反，可能导致死锁
            System.out.println("Thread 2: Holding resource 2...");
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            synchronized(resource1) {
                System.out.println("Thread 2: Holding resource 2 & 1...");
            }
        }
    }
    
    // 修复：保持一致的锁获取顺序
    public void method2Fixed() {
        synchronized(resource1) { // 与method1相同的锁获取顺序
            System.out.println("Thread 2: Holding resource 1...");
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            synchronized(resource2) {
                System.out.println("Thread 2: Holding resource 1 & 2...");
            }
        }
    }
}
```

**10.3 线程转储(Thread Dump)分析**

线程转储包含所有线程的状态信息，是诊断线程问题的重要工具。

获取线程转储的方法：
1. `jstack <pid>`命令
2. 在JVM中发送SIGQUIT信号(Linux/Unix)
3. 在JVisualVM、JConsole等工具中查看

线程状态分析：
- RUNNABLE：正在运行或等待系统资源
- BLOCKED：等待进入同步块
- WAITING/TIMED_WAITING：等待其他线程操作
- PARKED：通过LockSupport.park()被挂起

### 42. 设计模式在Java中的应用有哪些？

**设计模式**是软件开发中解决常见问题的可重用解决方案，是经过实践检验的最佳实践。Java作为一种面向对象编程语言，广泛应用了各类设计模式。理解这些模式能帮助开发者编写更灵活、可维护的代码。

**1. 创建型模式(Creational Patterns)**

创建型模式关注对象的创建机制，通过控制对象创建过程来减少系统的复杂性。

**1.1 单例模式(Singleton Pattern)**

确保一个类只有一个实例，并提供一个全局访问点。

**实现方式**：

1. **饿汉式**：类加载时创建实例

```java
public class EagerSingleton {
    // 在类加载时就创建实例
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    // 私有构造函数，防止外部实例化
    private EagerSingleton() {}
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

2. **懒汉式**：延迟创建实例，线程安全版本

```java
public class LazySingleton {
    // 声明但不初始化实例
    private static volatile LazySingleton instance;
    
    private LazySingleton() {}
    
    // 双重检查锁定
    public static LazySingleton getInstance() {
        if (instance == null) {
            synchronized (LazySingleton.class) {
                if (instance == null) {
                    instance = new LazySingleton();
                }
            }
        }
        return instance;
    }
}
```

3. **静态内部类**：延迟加载且线程安全

```java
public class StaticInnerClassSingleton {
    private StaticInnerClassSingleton() {}
    
    private static class SingletonHolder {
        private static final StaticInnerClassSingleton INSTANCE = new StaticInnerClassSingleton();
    }
    
    public static StaticInnerClassSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

4. **枚举实现**：最简洁的实现方式，自动线程安全且防止序列化问题

```java
public enum EnumSingleton {
    INSTANCE;
    
    // 可以添加方法和属性
    public void doSomething() {
        // 方法实现
    }
}
```

**应用**：Spring中的Bean默认是单例的，Java运行时中的Runtime类等。

**1.2 工厂模式(Factory Pattern)**

**简单工厂模式**：由一个工厂类根据传入的参数决定创建哪一种产品类的实例。

```java
public class ShapeFactory {
    public Shape createShape(String type) {
        if (type == null) {
            return null;
        }
        if (type.equalsIgnoreCase("CIRCLE")) {
            return new Circle();
        } else if (type.equalsIgnoreCase("RECTANGLE")) {
            return new Rectangle();
        } else if (type.equalsIgnoreCase("SQUARE")) {
            return new Square();
        }
        return null;
    }
}
```

**工厂方法模式**：定义一个创建对象的接口，让子类决定实例化哪个类。

```java
// 抽象工厂
public abstract class ShapeFactory {
    public abstract Shape createShape();
}

// 具体工厂
public class CircleFactory extends ShapeFactory {
    @Override
    public Shape createShape() {
        return new Circle();
    }
}

public class RectangleFactory extends ShapeFactory {
    @Override
    public Shape createShape() {
        return new Rectangle();
    }
}
```

**抽象工厂模式**：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类。

```java
// 抽象工厂
public interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// 具体工厂
public class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

public class MacFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacCheckbox();
    }
}
```

**应用**：Java Collections中的集合工厂方法，JDBC中获取连接的DriverManager等。

**1.3 建造者模式(Builder Pattern)**

将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

```java
public class Computer {
    // 必要参数
    private final String CPU;
    private final String RAM;
    // 可选参数
    private final String storage;
    private final String graphicsCard;
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.storage = builder.storage;
        this.graphicsCard = builder.graphicsCard;
    }
    
    public static class Builder {
        // 必要参数
        private final String CPU;
        private final String RAM;
        // 可选参数
        private String storage;
        private String graphicsCard;
        
        public Builder(String CPU, String RAM) {
            this.CPU = CPU;
            this.RAM = RAM;
        }
        
        public Builder storage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Builder graphicsCard(String graphicsCard) {
            this.graphicsCard = graphicsCard;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
}

// 使用建造者模式
Computer computer = new Computer.Builder("Intel i7", "16GB")
    .storage("1TB SSD")
    .graphicsCard("NVIDIA RTX 3080")
    .build();
```

**应用**：Java中的StringBuilder、StringBuffer、Lombok的@Builder注解、Spring中的BeanDefinitionBuilder等。

**1.4 原型模式(Prototype Pattern)**

通过复制现有实例来创建新的实例，而不是通过构造函数。

```java
// Cloneable接口实现原型模式
public class Shape implements Cloneable {
    private String type;
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    @Override
    public Shape clone() {
        try {
            return (Shape) super.clone();
        } catch (CloneNotSupportedException e) {
            return null;
        }
    }
}

// 使用原型模式
Shape circle = new Shape();
circle.setType("Circle");
Shape clonedCircle = circle.clone();
```

**应用**：Java中的Object.clone()方法、Spring中的Bean作用域prototype等。

**2. 结构型模式(Structural Patterns)**

结构型模式关注如何组合类和对象以形成更大的结构，同时保持结构的灵活性和高效性。

**2.1 适配器模式(Adapter Pattern)**

将一个类的接口转换成客户希望的另一个接口，使原本由于接口不兼容而不能一起工作的类能一起工作。

```java
// 目标接口
public interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 被适配的接口
public interface AdvancedMediaPlayer {
    void playVlc(String fileName);
    void playMp4(String fileName);
}

// 被适配的类
public class VlcPlayer implements AdvancedMediaPlayer {
    @Override
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }
    
    @Override
    public void playMp4(String fileName) {
        // 什么都不做
    }
}

// 适配器
public class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedMusicPlayer;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer = new VlcPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer = new Mp4Player();
        }
    }
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            advancedMusicPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            advancedMusicPlayer.playMp4(fileName);
        }
    }
}
```

**应用**：Java I/O中的InputStreamReader和OutputStreamWriter、JDBC中的适配器等。

**2.2 装饰器模式(Decorator Pattern)**

动态地给一个对象添加一些额外的职责，比生成子类更加灵活。

```java
// 组件接口
public interface Component {
    void operation();
}

// 具体组件
public class ConcreteComponent implements Component {
    @Override
    public void operation() {
        System.out.println("ConcreteComponent operation");
    }
}

// 装饰器
public abstract class Decorator implements Component {
    protected Component component;
    
    public Decorator(Component component) {
        this.component = component;
    }
    
    @Override
    public void operation() {
        component.operation();
    }
}

// 具体装饰器
public class ConcreteDecoratorA extends Decorator {
    public ConcreteDecoratorA(Component component) {
        super(component);
    }
    
    @Override
    public void operation() {
        super.operation();
        addedBehavior();
    }
    
    private void addedBehavior() {
        System.out.println("Added behavior from ConcreteDecoratorA");
    }
}
```

**应用**：Java I/O中的装饰器模式（如InputStream、BufferedInputStream等）、Swing中的BorderDecorator等。

**2.3 代理模式(Proxy Pattern)**

为其他对象提供一种代理以控制对这个对象的访问。

```java
// 接口
public interface Image {
    void display();
}

// 实际类
public class RealImage implements Image {
    private String fileName;
    
    public RealImage(String fileName) {
        this.fileName = fileName;
        loadFromDisk();
    }
    
    private void loadFromDisk() {
        System.out.println("Loading " + fileName);
    }
    
    @Override
    public void display() {
        System.out.println("Displaying " + fileName);
    }
}

// 代理类
public class ProxyImage implements Image {
    private RealImage realImage;
    private String fileName;
    
    public ProxyImage(String fileName) {
        this.fileName = fileName;
    }
    
    @Override
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(fileName);
        }
        realImage.display();
    }
}

// 使用代理
Image image = new ProxyImage("test.jpg");
// 第一次调用display()时才加载图片
image.display();
```

**应用**：Spring中的AOP和依赖注入、Hibernate中的延迟加载、Java RMI等。

**2.4 组合模式(Composite Pattern)**

将对象组合成树形结构以表示"部分-整体"的层次结构，使客户端可以统一对待单个对象和组合对象。

```java
// 组件接口
public interface Component {
    void operation();
}

// 叶子组件
public class Leaf implements Component {
    private String name;
    
    public Leaf(String name) {
        this.name = name;
    }
    
    @Override
    public void operation() {
        System.out.println("Leaf " + name + " operation");
    }
}

// 复合组件
public class Composite implements Component {
    private List<Component> children = new ArrayList<>();
    private String name;
    
    public Composite(String name) {
        this.name = name;
    }
    
    public void add(Component component) {
        children.add(component);
    }
    
    public void remove(Component component) {
        children.remove(component);
    }
    
    @Override
    public void operation() {
        System.out.println("Composite " + name + " operation");
        for (Component child : children) {
            child.operation();
        }
    }
}
```

**应用**：Swing中的组件层次结构、文件系统的表示等。

**2.5 外观模式(Facade Pattern)**

为子系统中的一组接口提供一个一致的界面，使子系统更容易使用。

```java
// 子系统类
public class CPU {
    public void freeze() { System.out.println("CPU freeze"); }
    public void jump(long position) { System.out.println("CPU jump to position " + position); }
    public void execute() { System.out.println("CPU execute"); }
}

public class Memory {
    public void load(long position, byte[] data) {
        System.out.println("Memory load from position " + position);
    }
}

public class HardDrive {
    public byte[] read(long lba, int size) {
        System.out.println("HardDrive read sector " + lba);
        return new byte[size];
    }
}

// 外观类
public class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    public void start() {
        cpu.freeze();
        memory.load(0, hardDrive.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}

// 使用外观模式
ComputerFacade computer = new ComputerFacade();
computer.start();
```

**应用**：SLF4J对不同日志框架的抽象、Spring中的JdbcTemplate等。

**2.6 桥接模式(Bridge Pattern)**

将抽象部分与其实现部分分离，使它们都可以独立地变化。

```java
// 实现接口
public interface DrawAPI {
    void drawCircle(int radius, int x, int y);
}

// 具体实现
public class RedCircle implements DrawAPI {
    @Override
    public void drawCircle(int radius, int x, int y) {
        System.out.println("Drawing Circle[ color: red, radius: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

public class GreenCircle implements DrawAPI {
    @Override
    public void drawCircle(int radius, int x, int y) {
        System.out.println("Drawing Circle[ color: green, radius: " + radius + ", x: " + x + ", y: " + y + "]");
    }
}

// 抽象类
public abstract class Shape {
    protected DrawAPI drawAPI;
    
    protected Shape(DrawAPI drawAPI) {
        this.drawAPI = drawAPI;
    }
    
    public abstract void draw();
}

// 扩展抽象类
public class Circle extends Shape {
    private int x, y, radius;
    
    public Circle(int x, int y, int radius, DrawAPI drawAPI) {
        super(drawAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        drawAPI.drawCircle(radius, x, y);
    }
}

// 使用桥接模式
Shape redCircle = new Circle(100, 100, 10, new RedCircle());
Shape greenCircle = new Circle(100, 100, 10, new GreenCircle());
redCircle.draw();
greenCircle.draw();
```

**应用**：JDBC中的Driver和DriverManager、AWT中的平台相关实现等。

**3. 行为型模式(Behavioral Patterns)**

行为型模式关注对象间的通信，描述如何分配职责和算法。

**3.1 策略模式(Strategy Pattern)**

定义一系列算法，封装每个算法，并使它们可以互换。策略模式让算法独立于使用它的客户端。

```java
// 策略接口
public interface PaymentStrategy {
    void pay(int amount);
}

// 具体策略
public class CreditCardStrategy implements PaymentStrategy {
    private String cardNumber;
    private String cvv;
    private String expiryDate;
    
    public CreditCardStrategy(String cardNumber, String cvv, String expiryDate) {
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
    }
    
    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid with credit card");
    }
}

public class PayPalStrategy implements PaymentStrategy {
    private String email;
    private String password;
    
    public PayPalStrategy(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    @Override
    public void pay(int amount) {
        System.out.println(amount + " paid using PayPal");
    }
}

// 上下文
public class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// 使用策略模式
ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardStrategy("1234-5678-9012-3456", "123", "12/24"));
cart.checkout(100);

cart.setPaymentStrategy(new PayPalStrategy("example@example.com", "password"));
cart.checkout(200);
```

**应用**：Java中的Comparator接口、Spring中的Resource接口等。

**3.2 观察者模式(Observer Pattern)**

定义对象间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会自动收到通知并更新。

```java
// 观察者接口
public interface Observer {
    void update(String message);
}

// 具体观察者
public class User implements Observer {
    private String name;
    
    public User(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " received: " + message);
    }
}

// 被观察者/主题
public class Topic {
    private List<Observer> observers = new ArrayList<>();
    private String message;
    
    public void register(Observer observer) {
        observers.add(observer);
    }
    
    public void unregister(Observer observer) {
        observers.remove(observer);
    }
    
    public void postMessage(String message) {
        this.message = message;
        notifyObservers();
    }
    
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}

// 使用观察者模式
Topic topic = new Topic();
Observer user1 = new User("User 1");
Observer user2 = new User("User 2");

topic.register(user1);
topic.register(user2);
topic.postMessage("Hello World!");
```

**应用**：Java中的事件监听机制、JavaBeans中的属性变更通知机制、Spring中的ApplicationEvent等。

**3.3 命令模式(Command Pattern)**

将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可撤销的操作。

```java
// 命令接口
public interface Command {
    void execute();
}

// 具体命令
public class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOn();
    }
}

public class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.turnOff();
    }
}

// 接收者
public class Light {
    public void turnOn() {
        System.out.println("Light is on");
    }
    
    public void turnOff() {
        System.out.println("Light is off");
    }
}

// 调用者
public class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
}

// 使用命令模式
Light light = new Light();
Command lightOn = new LightOnCommand(light);
Command lightOff = new LightOffCommand(light);

RemoteControl remote = new RemoteControl();
remote.setCommand(lightOn);
remote.pressButton();

remote.setCommand(lightOff);
remote.pressButton();
```

**应用**：Java中的Runnable接口、Swing中的Action接口、Spring中的JdbcTemplate中的回调等。

**3.4 模板方法模式(Template Method Pattern)**

定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变算法的结构即可重定义算法的某些特定步骤。

```java
// 抽象类定义模板方法
public abstract class Game {
    // 模板方法，定义算法骨架
    public final void play() {
        initialize();
        startPlay();
        endPlay();
    }
    
    // 子类必须实现的抽象方法
    protected abstract void initialize();
    protected abstract void startPlay();
    protected abstract void endPlay();
}

// 具体子类
public class Cricket extends Game {
    @Override
    protected void initialize() {
        System.out.println("Cricket Game Initialized!");
    }
    
    @Override
    protected void startPlay() {
        System.out.println("Cricket Game Started!");
    }
    
    @Override
    protected void endPlay() {
        System.out.println("Cricket Game Finished!");
    }
}

public class Football extends Game {
    @Override
    protected void initialize() {
        System.out.println("Football Game Initialized!");
    }
    
    @Override
    protected void startPlay() {
        System.out.println("Football Game Started!");
    }
    
    @Override
    protected void endPlay() {
        System.out.println("Football Game Finished!");
    }
}

// 使用模板方法模式
Game cricket = new Cricket();
cricket.play();

Game football = new Football();
football.play();
```

**应用**：Java中的各种抽象类、Spring中的JdbcTemplate、Hibernate中的各种回调等。

**3.5 迭代器模式(Iterator Pattern)**

提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露其内部的表示。

```java
// 迭代器接口
public interface Iterator<T> {
    boolean hasNext();
    T next();
}

// 容器接口
public interface Container<T> {
    Iterator<T> getIterator();
}

// 具体容器
public class NameRepository implements Container<String> {
    private String[] names = {"Robert", "John", "Julie", "Lora"};
    
    @Override
    public Iterator<String> getIterator() {
        return new NameIterator();
    }
    
    private class NameIterator implements Iterator<String> {
        private int index;
        
        @Override
        public boolean hasNext() {
            return index < names.length;
        }
        
        @Override
        public String next() {
            if (hasNext()) {
                return names[index++];
            }
            return null;
        }
    }
}

// 使用迭代器模式
Container<String> namesContainer = new NameRepository();
Iterator<String> iterator = namesContainer.getIterator();

while (iterator.hasNext()) {
    String name = iterator.next();
    System.out.println("Name: " + name);
}
```

**应用**：Java集合框架中的Iterator接口等。

**4. 其他重要设计模式**

**4.1 状态模式(State Pattern)**

允许对象在内部状态改变时改变它的行为，使对象看起来好像修改了它的类。

```java
// 状态接口
public interface State {
    void doAction(Context context);
}

// 具体状态
public class StartState implements State {
    @Override
    public void doAction(Context context) {
        System.out.println("Player is in start state");
        context.setState(this);
    }
    
    @Override
    public String toString() {
        return "Start State";
    }
}

public class StopState implements State {
    @Override
    public void doAction(Context context) {
        System.out.println("Player is in stop state");
        context.setState(this);
    }
    
    @Override
    public String toString() {
        return "Stop State";
    }
}

// 上下文
public class Context {
    private State state;
    
    public Context() {
        state = null;
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public State getState() {
        return state;
    }
}

// 使用状态模式
Context context = new Context();

StartState startState = new StartState();
startState.doAction(context);
System.out.println(context.getState().toString());

StopState stopState = new StopState();
stopState.doAction(context);
System.out.println(context.getState().toString());
```

**应用**：Java线程的状态变化、工作流引擎中的状态迁移等。

**4.2 责任链模式(Chain of Responsibility Pattern)**

为请求创建一个接收者对象的链，每个接收者都包含对另一个接收者的引用。沿着这条链传递请求，直到有一个对象处理它。

```java
// 处理者抽象类
public abstract class AbstractLogger {
    public static final int INFO = 1;
    public static final int DEBUG = 2;
    public static final int ERROR = 3;
    
    protected int level;
    protected AbstractLogger nextLogger;
    
    public void setNextLogger(AbstractLogger nextLogger) {
        this.nextLogger = nextLogger;
    }
    
    public void logMessage(int level, String message) {
        if (this.level <= level) {
            write(message);
        }
        if (nextLogger != null) {
            nextLogger.logMessage(level, message);
        }
    }
    
    protected abstract void write(String message);
}

// 具体处理者
public class ConsoleLogger extends AbstractLogger {
    public ConsoleLogger(int level) {
        this.level = level;
    }
    
    @Override
    protected void write(String message) {
        System.out.println("Standard Console::Logger: " + message);
    }
}

public class FileLogger extends AbstractLogger {
    public FileLogger(int level) {
        this.level = level;
    }
    
    @Override
    protected void write(String message) {
        System.out.println("File::Logger: " + message);
    }
}

// 使用责任链模式
AbstractLogger loggerChain = getChainOfLoggers();
loggerChain.logMessage(AbstractLogger.INFO, "This is an information.");
loggerChain.logMessage(AbstractLogger.DEBUG, "This is a debug level information.");
loggerChain.logMessage(AbstractLogger.ERROR, "This is an error information.");

// 创建责任链
private static AbstractLogger getChainOfLoggers() {
    AbstractLogger errorLogger = new ErrorLogger(AbstractLogger.ERROR);
    AbstractLogger fileLogger = new FileLogger(AbstractLogger.DEBUG);
    AbstractLogger consoleLogger = new ConsoleLogger(AbstractLogger.INFO);
    
    errorLogger.setNextLogger(fileLogger);
    fileLogger.setNextLogger(consoleLogger);
    
    return errorLogger;
}
```

**应用**：Java中的异常处理机制、Servlet中的过滤器链、Spring中的拦截器链等。

**5. 设计模式在Java实际应用中的最佳实践**

**5.1 选择合适的设计模式**

- 分析问题的具体需求和约束条件
- 考虑模式的优缺点和适用场景
- 选择最简单、最适合的设计模式
- 避免过度设计和滥用设计模式

**5.2 设计模式的组合使用**

实际应用中，通常需要组合多种设计模式来解决复杂问题。例如：

- Spring框架同时使用了工厂模式、单例模式、代理模式、观察者模式等
- Java集合框架中使用了迭代器模式、工厂模式、装饰器模式等
- Java I/O中使用了装饰器模式、工厂模式、适配器模式等

**5.3 设计模式的实际案例**

**Spring框架中的设计模式应用**：
- IOC容器：工厂模式、单例模式
- AOP：代理模式、装饰器模式
- MVC：复合模式（前端控制器、视图助手、模板视图）
- 事务管理：模板方法模式、代理模式

**Java集合框架中的设计模式应用**：
- ArrayList/LinkedList等：迭代器模式
- Collections.unmodifiableXxx()：装饰器模式
- Collections.synchronizedXxx()：装饰器模式
- Arrays.asList()：适配器模式

**Java并发包中的设计模式应用**：
- Executor框架：命令模式
- Future/Callable：命令模式
- CompletableFuture：观察者模式
- ThreadPoolExecutor：工厂方法模式、模板方法模式

### 43. Java反射机制的原理和应用有哪些？

**反射(Reflection)**是Java的一个强大特性，允许程序在运行时检查和操作类、接口、方法和字段。通过反射，程序可以获取到在编译时无法获取的类型信息，并能够实例化对象、调用方法、访问和修改字段，即使它们是私有的。

**1. 反射的基本概念**

反射允许程序：
- 在运行时检查类、接口、字段和方法
- 在运行时创建类的实例
- 在运行时获取和设置对象的字段值
- 在运行时调用对象的方法
- 在运行时检查注解

反射的核心API位于`java.lang.reflect`包中，主要包括：
- `Class<?>`: 类的元信息
- `Field`: 表示类的成员变量
- `Method`: 表示类的方法
- `Constructor`: 表示类的构造方法
- `Modifier`: 提供访问修饰符信息的工具类
- `Array`: 提供动态创建和访问数组的静态方法
- `Parameter`: Java 8后添加，提供方法参数信息

**2. 获取Class对象的方式**

反射的起点是获取一个类的Class对象，有以下几种方式：

```java
// 1. 通过类名.class
Class<?> clazz1 = String.class;

// 2. 通过对象的getClass()方法
String str = "Hello";
Class<?> clazz2 = str.getClass();

// 3. 通过Class.forName()方法
try {
    Class<?> clazz3 = Class.forName("java.lang.String");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}

// 4. 通过ClassLoader
ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
try {
    Class<?> clazz4 = classLoader.loadClass("java.lang.String");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}

// 5. 基本类型的Class对象
Class<?> intClass = int.class;

// 6. 基本类型包装类的TYPE字段
Class<?> integerClass = Integer.TYPE; // 等同于int.class
```

**3. 反射的主要应用场景**

**3.1 获取类的结构信息**

```java
// 获取类的基本信息
Class<?> clazz = MyClass.class;
String className = clazz.getName(); // 获取完全限定名
String simpleName = clazz.getSimpleName(); // 获取简单类名
Package pkg = clazz.getPackage(); // 获取包信息
Class<?> superClass = clazz.getSuperclass(); // 获取父类
Class<?>[] interfaces = clazz.getInterfaces(); // 获取实现的接口
int modifiers = clazz.getModifiers(); // 获取修饰符
boolean isPublic = Modifier.isPublic(modifiers); // 检查修饰符

// 获取字段信息
Field[] fields = clazz.getDeclaredFields(); // 获取所有声明的字段
Field[] publicFields = clazz.getFields(); // 获取所有公共字段(包括继承的)

for (Field field : fields) {
    String fieldName = field.getName(); // 字段名
    Class<?> fieldType = field.getType(); // 字段类型
    int fieldModifiers = field.getModifiers(); // 字段修饰符
}

// 获取方法信息
Method[] methods = clazz.getDeclaredMethods(); // 获取所有声明的方法
Method[] publicMethods = clazz.getMethods(); // 获取所有公共方法(包括继承的)

for (Method method : methods) {
    String methodName = method.getName(); // 方法名
    Class<?> returnType = method.getReturnType(); // 返回类型
    Class<?>[] paramTypes = method.getParameterTypes(); // 参数类型
    Class<?>[] exceptionTypes = method.getExceptionTypes(); // 异常类型
}

// 获取构造方法信息
Constructor<?>[] constructors = clazz.getDeclaredConstructors(); // 获取所有声明的构造方法
Constructor<?>[] publicConstructors = clazz.getConstructors(); // 获取所有公共构造方法
```

**3.2 创建类的实例**

```java
// 使用默认构造方法创建实例
Class<?> clazz = MyClass.class;
try {
    Object obj = clazz.newInstance(); // 已过时，Java 9开始不推荐使用
} catch (InstantiationException | IllegalAccessException e) {
    e.printStackTrace();
}

// 使用Constructor创建实例(推荐)
try {
    // 获取默认构造方法
    Constructor<?> constructor = clazz.getDeclaredConstructor();
    Object obj = constructor.newInstance();
    
    // 获取带参数的构造方法
    Constructor<?> paramConstructor = clazz.getDeclaredConstructor(String.class, int.class);
    Object paramObj = paramConstructor.newInstance("name", 25);
} catch (Exception e) {
    e.printStackTrace();
}
```

**3.3 访问和修改字段**

```java
// 访问公共字段
Class<?> clazz = MyClass.class;
Object obj = clazz.getDeclaredConstructor().newInstance();
try {
    Field field = clazz.getField("publicField"); // 只能获取公共字段
    Object value = field.get(obj); // 获取字段值
    field.set(obj, "new value"); // 设置字段值
} catch (Exception e) {
    e.printStackTrace();
}

// 访问私有字段
try {
    Field privateField = clazz.getDeclaredField("privateField");
    privateField.setAccessible(true); // 设置访问性，绕过访问检查
    Object value = privateField.get(obj); // 获取私有字段值
    privateField.set(obj, "new private value"); // 修改私有字段值
} catch (Exception e) {
    e.printStackTrace();
}

// 访问静态字段
try {
    Field staticField = clazz.getDeclaredField("CONSTANT");
    staticField.setAccessible(true);
    Object value = staticField.get(null); // 静态字段不需要实例，传null
} catch (Exception e) {
    e.printStackTrace();
}
```

**3.4 调用方法**

```java
// 调用公共方法
Class<?> clazz = MyClass.class;
Object obj = clazz.getDeclaredConstructor().newInstance();
try {
    // 无参方法
    Method method = clazz.getMethod("publicMethod");
    Object result = method.invoke(obj);
    
    // 有参方法
    Method paramMethod = clazz.getMethod("publicParamMethod", String.class, int.class);
    Object paramResult = paramMethod.invoke(obj, "hello", 42);
} catch (Exception e) {
    e.printStackTrace();
}

// 调用私有方法
try {
    Method privateMethod = clazz.getDeclaredMethod("privateMethod");
    privateMethod.setAccessible(true); // 绕过访问检查
    Object result = privateMethod.invoke(obj);
} catch (Exception e) {
    e.printStackTrace();
}

// 调用静态方法
try {
    Method staticMethod = clazz.getDeclaredMethod("staticMethod");
    staticMethod.setAccessible(true);
    Object result = staticMethod.invoke(null); // 静态方法不需要实例，传null
} catch (Exception e) {
    e.printStackTrace();
}
```

**3.5 访问注解**

```java
// 获取类上的注解
Class<?> clazz = MyClass.class;
if (clazz.isAnnotationPresent(MyAnnotation.class)) {
    MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
    String value = annotation.value();
}

// 获取方法上的注解
Method method = clazz.getDeclaredMethod("myMethod");
if (method.isAnnotationPresent(MyMethodAnnotation.class)) {
    MyMethodAnnotation annotation = method.getAnnotation(MyMethodAnnotation.class);
}

// 获取字段上的注解
Field field = clazz.getDeclaredField("myField");
if (field.isAnnotationPresent(MyFieldAnnotation.class)) {
    MyFieldAnnotation annotation = field.getAnnotation(MyFieldAnnotation.class);
}

// 获取参数上的注解(Java 8+)
Method method2 = clazz.getDeclaredMethod("myMethod", String.class);
Parameter[] parameters = method2.getParameters();
for (Parameter parameter : parameters) {
    if (parameter.isAnnotationPresent(MyParamAnnotation.class)) {
        MyParamAnnotation annotation = parameter.getAnnotation(MyParamAnnotation.class);
        String value = annotation.value();
    }
}

// 获取所有注解
Annotation[] annotations = clazz.getAnnotations(); // 包括继承的注解
Annotation[] declaredAnnotations = clazz.getDeclaredAnnotations(); // 仅直接声明的注解
```

**3.6 数组操作**

```java
// 创建数组
int[] intArray = (int[]) Array.newInstance(int.class, 5);

// 设置数组元素
Array.setInt(intArray, 0, 10);
Array.setInt(intArray, 1, 20);

// 获取数组元素
int value = Array.getInt(intArray, 0);

// 创建多维数组
int[][] matrix = (int[][]) Array.newInstance(int.class, 3, 3);

// 获取数组类型信息
Class<?> clazz = intArray.getClass();
boolean isArray = clazz.isArray();
Class<?> componentType = clazz.getComponentType();
```

**4. 反射的实际应用**

**4.1 框架和库中的应用**

反射在许多Java框架和库中得到广泛应用：

- **Spring**: 依赖注入、AOP等核心功能
  - 通过反射创建bean
  - 自动装配依赖
  - 使用注解配置

- **Hibernate/JPA**: ORM映射
  - 将实体类映射到数据库表
  - 通过注解或XML配置访问字段

- **Jackson/Gson**: JSON序列化和反序列化
  - 将JSON字符串转换为Java对象
  - 将Java对象转换为JSON字符串

- **JUnit**: 测试框架
  - 使用注解标记测试方法
  - 自动运行测试案例

- **Android**: 视图绑定等
  - 利用注解绑定视图和控件

**4.2 插件和扩展系统**

许多应用程序使用反射来实现插件或扩展系统：

```java
// 动态加载和实例化插件
public Plugin loadPlugin(String className) throws Exception {
    Class<?> pluginClass = Class.forName(className);
    if (Plugin.class.isAssignableFrom(pluginClass)) {
        return (Plugin) pluginClass.getDeclaredConstructor().newInstance();
    }
    throw new IllegalArgumentException("Not a valid plugin: " + className);
}

// 扫描包中的所有插件
public List<Plugin> scanPlugins(String packageName) {
    // 获取包下所有类
    List<Class<?>> classes = getClassesInPackage(packageName);
    List<Plugin> plugins = new ArrayList<>();
    
    for (Class<?> clazz : classes) {
        // 检查是否是插件类型且有@PluginAnnotation
        if (Plugin.class.isAssignableFrom(clazz) && 
            clazz.isAnnotationPresent(PluginAnnotation.class)) {
            try {
                Plugin plugin = (Plugin) clazz.getDeclaredConstructor().newInstance();
                plugins.add(plugin);
            } catch (Exception e) {
                // 处理异常
            }
        }
    }
    
    return plugins;
}
```

**4.3 动态代理**

反射可以用来创建动态代理，这是很多框架（如Spring AOP）的基础：

```java
// 定义接口
interface UserService {
    void addUser(String username);
    String getUser(int id);
}

// 定义InvocationHandler
class LoggingHandler implements InvocationHandler {
    private final Object target;
    
    public LoggingHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Before method: " + method.getName());
        try {
            Object result = method.invoke(target, args);
            System.out.println("After method: " + method.getName());
            return result;
        } catch (Exception e) {
            System.out.println("Exception in method: " + method.getName());
            throw e;
        }
    }
}

// 创建代理
UserService userService = new UserServiceImpl();
UserService proxy = (UserService) Proxy.newProxyInstance(
    UserService.class.getClassLoader(),
    new Class<?>[] { UserService.class },
    new LoggingHandler(userService)
);

// 调用代理方法
proxy.addUser("user1"); // 会触发日志记录
```

**4.4 依赖注入容器**

简单的依赖注入容器实现：

```java
public class DIContainer {
    private Map<Class<?>, Object> instances = new HashMap<>();
    
    public <T> void register(Class<T> clazz) throws Exception {
        Constructor<T> constructor = clazz.getDeclaredConstructor();
        T instance = constructor.newInstance();
        
        // 查找@Inject注解的字段
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Inject.class)) {
                Class<?> fieldType = field.getType();
                field.setAccessible(true);
                
                // 递归创建依赖
                if (!instances.containsKey(fieldType)) {
                    register(fieldType);
                }
                
                field.set(instance, instances.get(fieldType));
            }
        }
        
        instances.put(clazz, instance);
    }
    
    @SuppressWarnings("unchecked")
    public <T> T get(Class<T> clazz) {
        return (T) instances.get(clazz);
    }
}

// 使用依赖注入容器
DIContainer container = new DIContainer();
container.register(UserService.class);
UserService service = container.get(UserService.class);
```

**5. 反射的性能考虑**

反射虽然强大，但也有性能开销：

1. **访问检查**：特别是访问私有成员时需要绕过访问检查
2. **类型安全检查**：运行时进行而非编译时
3. **缺少编译时优化**：无法进行内联等优化

性能优化策略：

1. **缓存反射对象**：重复使用Class、Method、Field等对象
2. **减少反射调用**：仅在必要时使用反射
3. **使用setAccessible(true)**：减少访问检查的开销
4. **使用方法句柄(MethodHandle)**：Java 7引入的更高效替代方案

```java
// 缓存反射对象示例
public class ReflectionCache {
    private static final Map<String, Method> methodCache = new ConcurrentHashMap<>();
    
    public static Method getMethod(Class clazz, String methodName, Class... paramTypes) 
            throws NoSuchMethodException {
        String key = clazz.getName() + "#" + methodName + Arrays.toString(paramTypes);
        return methodCache.computeIfAbsent(key, k -> {
            try {
                return clazz.getDeclaredMethod(methodName, paramTypes);
            } catch (NoSuchMethodException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
```

**6. 反射的安全性和限制**

反射打破了Java的封装性，可能绕过访问控制。为了安全考虑：

1. **SecurityManager**：可以控制反射操作
2. **模块系统(Java 9+)**：可以限制反射访问
3. **运行时权限**：可以配置安全策略

```java
// 设置安全管理器
System.setSecurityManager(new SecurityManager());

// 安全策略示例（在策略文件中）
// permission java.lang.reflect.ReflectPermission "suppressAccessChecks";
```

**注意事项**：
- 反射不能访问无法通过正常代码访问的成员（如父类的private字段）
- 某些JVM优化可能不适用于使用反射的代码
- 对于模块化应用（Java 9+），需要考虑`opens`和`exports`声明

**7. 方法句柄(MethodHandle)**

Java 7引入的方法句柄提供了一种比反射更高效的动态方法调用机制：

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class MethodHandleExample {
    public static void main(String[] args) throws Throwable {
        // 获取MethodHandles.Lookup对象
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        
        // 查找方法
        MethodType methodType = MethodType.methodType(String.class, int.class);
        MethodHandle handle = lookup.findVirtual(String.class, "substring", methodType);
        
        // 调用方法
        String result = (String) handle.invokeExact("Hello, World", 0);
        
        // 绑定接收者
        MethodHandle boundHandle = handle.bindTo("Hello, World");
        String result2 = (String) boundHandle.invokeExact(0);
    }
}
```

**与反射的比较**：
- 方法句柄性能通常更好
- 方法句柄类型安全性更强
- 反射更灵活，可以获取更多元信息
- 反射更容易使用和理解

**8. 反射与注解处理**

反射常用于运行时处理注解：

```java
// 自定义注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Transactional {
    boolean readOnly() default false;
}

// 使用反射处理注解
public class TransactionAspect {
    public Object invoke(Object target, Method method, Object[] args) throws Throwable {
        if (method.isAnnotationPresent(Transactional.class)) {
            Transactional tx = method.getAnnotation(Transactional.class);
            boolean readOnly = tx.readOnly();
            
            // 开始事务
            startTransaction(readOnly);
            
            try {
                Object result = method.invoke(target, args);
                commitTransaction();
                return result;
            } catch (Exception e) {
                rollbackTransaction();
                throw e;
            }
        } else {
            // 无事务注解，直接调用
            return method.invoke(target, args);
        }
    }
    
    // 事务操作实现...
}
```

**9. 反射的最佳实践**

1. **谨慎使用**：仅在必要时使用反射，不要仅为方便而使用
2. **异常处理**：反射API会抛出多种异常，需要妥善处理
3. **性能优化**：缓存反射对象，避免重复获取
4. **访问控制**：使用`setAccessible(true)`时考虑安全影响
5. **类型安全**：尽量使用泛型提高类型安全性
6. **可读性**：使用有意义的命名和注释
7. **测试覆盖**：反射代码需要更多测试覆盖
8. **考虑替代方案**：如工厂模式、依赖注入框架等

**10. 反射的实际案例分析**

**案例：自定义ORM框架**

实现一个简单的ORM映射，通过反射将Java对象映射到数据库表：

```java
// 表映射注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Table {
    String name();
}

// 列映射注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Column {
    String name();
    boolean primary() default false;
}

// 实体类示例
@Table(name = "users")
public class User {
    @Column(name = "id", primary = true)
    private Long id;
    
    @Column(name = "username")
    private String username;
    
    @Column(name = "email")
    private String email;
    
    // 构造方法、getter和setter...
}

// ORM工具类
public class OrmUtil {
    // 生成插入SQL
    public static String generateInsertSQL(Object entity) {
        Class<?> clazz = entity.getClass();
        if (!clazz.isAnnotationPresent(Table.class)) {
            throw new IllegalArgumentException("Class not annotated with @Table");
        }
        
        Table table = clazz.getAnnotation(Table.class);
        String tableName = table.name();
        
        List<String> columns = new ArrayList<>();
        List<String> values = new ArrayList<>();
        
        try {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(Column.class)) {
                    field.setAccessible(true);
                    Column column = field.getAnnotation(Column.class);
                    
                    // 跳过自增主键
                    if (column.primary() && field.get(entity) == null) {
                        continue;
                    }
                    
                    columns.add(column.name());
                    
                    Object value = field.get(entity);
                    if (value instanceof String) {
                        values.add("'" + value + "'");
                    } else {
                        values.add(String.valueOf(value));
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error generating SQL", e);
        }
        
        return String.format("INSERT INTO %s (%s) VALUES (%s)",
                tableName,
                String.join(", ", columns),
                String.join(", ", values));
    }
    
    // 生成查询SQL并映射结果
    public static <T> T findById(Class<T> clazz, Object id, Connection conn) {
        if (!clazz.isAnnotationPresent(Table.class)) {
            throw new IllegalArgumentException("Class not annotated with @Table");
        }
        
        Table table = clazz.getAnnotation(Table.class);
        String tableName = table.name();
        String primaryKeyColumn = "";
        
        // 查找主键列
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Column.class)) {
                Column column = field.getAnnotation(Column.class);
                if (column.primary()) {
                    primaryKeyColumn = column.name();
                    break;
                }
            }
        }
        
        if (primaryKeyColumn.isEmpty()) {
            throw new IllegalArgumentException("No primary key found");
        }
        
        String sql = String.format("SELECT * FROM %s WHERE %s = ?", 
                tableName, primaryKeyColumn);
        
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setObject(1, id);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToObject(rs, clazz);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error executing query", e);
        }
        
        return null;
    }
    
    // 将结果集映射到对象
    private static <T> T mapResultSetToObject(ResultSet rs, Class<T> clazz) 
            throws Exception {
        T instance = clazz.getDeclaredConstructor().newInstance();
        
        for (Field field : clazz.getDeclaredFields()) {
            if (field.isAnnotationPresent(Column.class)) {
                field.setAccessible(true);
                Column column = field.getAnnotation(Column.class);
                String columnName = column.name();
                
                Object value = rs.getObject(columnName);
                
                if (value != null) {
                    // 处理类型转换
                    if (field.getType() == int.class || field.getType() == Integer.class) {
                        field.set(instance, rs.getInt(columnName));
                    } else if (field.getType() == long.class || field.getType() == Long.class) {
                        field.set(instance, rs.getLong(columnName));
                    } else if (field.getType() == double.class || field.getType() == Double.class) {
                        field.set(instance, rs.getDouble(columnName));
                    } else if (field.getType() == boolean.class || field.getType() == Boolean.class) {
                        field.set(instance, rs.getBoolean(columnName));
                    } else if (field.getType() == Date.class) {
                        field.set(instance, rs.getDate(columnName));
                    } else {
                        field.set(instance, value);
                    }
                }
            }
        }
        
        return instance;
    }
}
```

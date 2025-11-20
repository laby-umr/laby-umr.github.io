#  Java 设计模式面试题集

>  **总题数**: 36道 |  **重点领域**: 设计原则、创建型、结构型、行为型 |  **难度分布**: 中高级

本文档整理了 Java 设计模式的完整36道面试题目，涵盖设计原则、各种设计模式的应用场景和实现原理。

---

##  面试题目列表

### 1. 什么是设计模式？请简述其作用。

**答案：**

设计模式是软件开发中经过验证的、可复用的解决方案。

**定义：**
- 是在特定场景下对常见问题的通用解决方案
- 不是代码，而是解决问题的思路和方法
- 是前人经验的总结和提炼

**主要作用：**

1. **提高代码复用性**：减少重复代码
2. **增强可维护性**：代码结构清晰，易于理解
3. **提升系统扩展性**：方便添加新功能
4. **降低耦合度**：模块间依赖减少
5. **统一开发语言**：团队沟通更高效

### 2. 23 种设计模式分为哪三大类？

**答案：**

**一、创建型模式（5种）**
关注对象的创建过程

1. **单例模式**（Singleton）
2. **工厂方法模式**（Factory Method）
3. **抽象工厂模式**（Abstract Factory）
4. **建造者模式**（Builder）
5. **原型模式**（Prototype）

**二、结构型模式（7种）**
关注类和对象的组合

1. **适配器模式**（Adapter）
2. **桥接模式**（Bridge）
3. **组合模式**（Composite）
4. **装饰器模式**（Decorator）
5. **外观模式**（Facade）
6. **享元模式**（Flyweight）
7. **代理模式**（Proxy）

**三、行为型模式（11种）**
关注对象间的通信和职责分配

1. **观察者模式**（Observer）
2. **迭代器模式**（Iterator）
3. **模板方法模式**（Template Method）
4. **命令模式**（Command）
5. **状态模式**（State）
6. **策略模式**（Strategy）
7. **责任链模式**（Chain of Responsibility）
8. **中介者模式**（Mediator）
9. **访问者模式**（Visitor）
10. **备忘录模式**（Memento）
11. **解释器模式**（Interpreter）

### 3. 请解释什么是单例模式，并给出一个使用场景

**答案：**

单例模式确保一个类只有一个实例，并提供全局访问点。

**核心要素：**
1. 私有构造函数（防止外部实例化）
2. 静态实例变量
3. 公共静态获取方法

**基本实现：**
```java
// 饥饿式（线程安全）
public class Singleton {
    // 静态实例
    private static final Singleton instance = new Singleton();
    
    // 私有构造
    private Singleton() {}
    
    // 公共获取方法
    public static Singleton getInstance() {
        return instance;
    }
}
```

**常见使用场景：**

1. **数据库连接池**
```java
public class ConnectionPool {
    private static ConnectionPool instance;
    private List<Connection> connections;
    
    private ConnectionPool() {
        connections = new ArrayList<>();
        // 初始化连接池
    }
    
    public static ConnectionPool getInstance() {
        if (instance == null) {
            instance = new ConnectionPool();
        }
        return instance;
    }
}
```

2. **配置管理器**
```java
public class ConfigManager {
    private static ConfigManager instance;
    private Properties config;
    
    private ConfigManager() {
        config = new Properties();
        // 加载配置文件
    }
    
    public static ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }
}
```

3. **日志工具**
```java
public class Logger {
    private static Logger instance;
    
    private Logger() {}
    
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }
    
    public void log(String message) {
        System.out.println(message);
    }
}
```

### 4. 单例模式有哪几种实现？如何保证线程安全？

**答案：**

**1. 饥饿式（线程安全）**
```java
public class Singleton {
    // 类加载时创建实例
    private static final Singleton instance = new Singleton();
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        return instance;
    }
}

// 优点：简单，线程安全
// 缺点：不能延迟加载
```

**2. 懒汉式（非线程安全）**
```java
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// 优点：延迟加载
// 缺点：非线程安全
```

**3. 同步方法（线程安全，性能低）**
```java
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}

// 优点：线程安全
// 缺点：每次调用都同步，性能低
```

**4. 双重检查锁（DCL，推荐）**
```java
public class Singleton {
    // volatile保证可见性
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {  // 第一次检查
            synchronized (Singleton.class) {
                if (instance == null) {  // 第二次检查
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}

// 优点：线程安全，延迟加载，性能好
// 注意：必须使用volatile
```

**5. 静态内部类（推荐）**
```java
public class Singleton {
    private Singleton() {}
    
    // 静态内部类
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}

// 优点：线程安全，延迟加载，简洁
// 原理：类加载机制保证线程安全
```

**6. 枚举单例（最佳实践）**
```java
public enum Singleton {
    INSTANCE;
    
    public void doSomething() {
        System.out.println("Singleton");
    }
}

// 使用
Singleton.INSTANCE.doSomething();

// 优点：
// 1. 线程安全
// 2. 防止反射攻击
// 3. 防止反序列化创建新对象
// 4. 代码简洁
```

**线程安全对比：**

| 实现方式 | 线程安全 | 延迟加载 | 性能 | 推荐度 |
|----------|--------|--------|------|--------|
| 饥饿式 | ✓ | × | 高 | ★★★ |
| 懒汉式 | × | ✓ | 高 | × |
| 同步方法 | ✓ | ✓ | 低 | ★ |
| 双重检查 | ✓ | ✓ | 高 | ★★★★ |
| 静态内部类 | ✓ | ✓ | 高 | ★★★★★ |
| 枚举 | ✓ | × | 高 | ★★★★★ |

### 5. 工厂模式和抽象工厂模式有什么区别？

**答案：**

**工厂方法模式：**
创建一种产品，不同工厂生产不同的实现。

```java
// 产品接口
interface Product {
    void use();
}

// 具体产品A
class ProductA implements Product {
    public void use() {
        System.out.println("Using Product A");
    }
}

// 具体产品B
class ProductB implements Product {
    public void use() {
        System.out.println("Using Product B");
    }
}

// 抽象工厂
abstract class Factory {
    abstract Product createProduct();
}

// 具体工厂A
class FactoryA extends Factory {
    Product createProduct() {
        return new ProductA();
    }
}

// 具体工厂B
class FactoryB extends Factory {
    Product createProduct() {
        return new ProductB();
    }
}
```

**抽象工厂模式：**
创建一系列相关产品，一个工厂生产多种产品。

```java
// 产品族系1：按钮
interface Button {
    void click();
}

class WindowsButton implements Button {
    public void click() {
        System.out.println("Windows Button");
    }
}

class MacButton implements Button {
    public void click() {
        System.out.println("Mac Button");
    }
}

// 产品族系2：文本框
interface TextBox {
    void input();
}

class WindowsTextBox implements TextBox {
    public void input() {
        System.out.println("Windows TextBox");
    }
}

class MacTextBox implements TextBox {
    public void input() {
        System.out.println("Mac TextBox");
    }
}

// 抽象工厂
interface GUIFactory {
    Button createButton();
    TextBox createTextBox();
}

// Windows工厂
class WindowsFactory implements GUIFactory {
    public Button createButton() {
        return new WindowsButton();
    }
    public TextBox createTextBox() {
        return new WindowsTextBox();
    }
}

// Mac工厂
class MacFactory implements GUIFactory {
    public Button createButton() {
        return new MacButton();
    }
    public TextBox createTextBox() {
        return new MacTextBox();
    }
}
```

**主要区别：**

| 特性 | 工厂方法模式 | 抽象工厂模式 |
|------|------------|-------------|
| 产品数量 | 一种产品 | 多种相关产品 |
| 工厂层次 | 一层 | 两层（抽象+具体） |
| 复杂度 | 简单 | 复杂 |
| 使用场景 | 单一产品的创建 | 产品族的创建 |
| 示例 | 创建不同数据库连接 | 创建不同UI风格组件 |

### 6. 请描述简单工厂模式的工作原理。

**答案：**

简单工厂模式通过一个工厂类根据参数创建不同的产品实例。

**基本实现：**
```java
// 产品接口
interface Shape {
    void draw();
}

// 具体产品
class Circle implements Shape {
    public void draw() {
        System.out.println("Drawing Circle");
    }
}

class Rectangle implements Shape {
    public void draw() {
        System.out.println("Drawing Rectangle");
    }
}

class Triangle implements Shape {
    public void draw() {
        System.out.println("Drawing Triangle");
    }
}

// 简单工厂
class ShapeFactory {
    // 根据类型创建对象
    public static Shape createShape(String type) {
        if (type == null) {
            return null;
        }
        if (type.equalsIgnoreCase("CIRCLE")) {
            return new Circle();
        } else if (type.equalsIgnoreCase("RECTANGLE")) {
            return new Rectangle();
        } else if (type.equalsIgnoreCase("TRIANGLE")) {
            return new Triangle();
        }
        return null;
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Shape circle = ShapeFactory.createShape("CIRCLE");
        circle.draw();
        
        Shape rectangle = ShapeFactory.createShape("RECTANGLE");
        rectangle.draw();
    }
}
```

**优缺点：**

**优点：**
- 封装对象创建逻辑
- 客户端不需知道具体类名
- 代码简单，易于理解

**缺点：**
- 违反开闭原则（添加新产品需修改工厂类）
- 工厂类职责过重

### 7. 什么是建造者模式？一般用在什么场景？

**答案：**

建造者模式将复杂对象的构建过程与表示分离，逐步构建对象。

**实现示例：**
```java
// 产品类
class Computer {
    private String cpu;
    private String ram;
    private String storage;
    private String gpu;
    
    // 私有构造函数
    private Computer(Builder builder) {
        this.cpu = builder.cpu;
        this.ram = builder.ram;
        this.storage = builder.storage;
        this.gpu = builder.gpu;
    }
    
    // 静态内部建造者类
    public static class Builder {
        private String cpu;
        private String ram;
        private String storage;
        private String gpu;
        
        public Builder cpu(String cpu) {
            this.cpu = cpu;
            return this;
        }
        
        public Builder ram(String ram) {
            this.ram = ram;
            return this;
        }
        
        public Builder storage(String storage) {
            this.storage = storage;
            return this;
        }
        
        public Builder gpu(String gpu) {
            this.gpu = gpu;
            return this;
        }
        
        public Computer build() {
            return new Computer(this);
        }
    }
    
    @Override
    public String toString() {
        return "Computer{cpu='" + cpu + "', ram='" + ram + 
               "', storage='" + storage + "', gpu='" + gpu + "'}";
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Computer computer = new Computer.Builder()
            .cpu("Intel i7")
            .ram("16GB")
            .storage("512GB SSD")
            .gpu("NVIDIA RTX 3060")
            .build();
        
        System.out.println(computer);
    }
}
```

**使用场景：**

1. **对象有很多参数**：避免构造函数参数过多
2. **参数有可选项**：灵活配置对象
3. **需要不可变对象**：Builder构建后对象不可变

**实际应用：**
- StringBuilder/StringBuffer
- Lombok的@Builder注解
- OkHttp的Request.Builder
- Retrofit的配置

### 8. 什么是原型模式？一般用在什么场景？

**答案：**

原型模式通过复制现有对象来创建新对象，而不是通过new。

**实现方式：**

**1. 浅克隆：**
```java
class Sheep implements Cloneable {
    private String name;
    private int age;
    
    public Sheep(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

// 使用
Sheep original = new Sheep("Dolly", 3);
Sheep cloned = (Sheep) original.clone();
```

**2. 深克隆：**
```java
class Address implements Cloneable {
    private String city;
    
    public Address(String city) {
        this.city = city;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

class Person implements Cloneable {
    private String name;
    private Address address;
    
    public Person(String name, Address address) {
        this.name = name;
        this.address = address;
    }
    
    @Override
    protected Object clone() throws CloneNotSupportedException {
        Person cloned = (Person) super.clone();
        // 深克隆：复制引用对象
        cloned.address = (Address) address.clone();
        return cloned;
    }
}
```

**使用场景：**

1. **对象创建成本高**：复制比新建快
2. **需要保存对象状态**：备份、撤销功能
3. **避免复杂的初始化**：直接复制已初始化对象

**实际应用：**
```java
// Spring中Bean的prototype作用域
@Scope("prototype")
public class MyBean {
    // ...
}

// Java集合的clone
ArrayList<String> list1 = new ArrayList<>();
ArrayList<String> list2 = (ArrayList<String>) list1.clone();
```

### 9. 什么是适配器模式？一般用在什么场景？

**答案：**

适配器模式将一个类的接口转换成客户端期望的另一个接口。

**类适配器（继承）：**
```java
// 目标接口
interface MediaPlayer {
    void play(String audioType, String fileName);
}

// 被适配的类
class VlcPlayer {
    public void playVlc(String fileName) {
        System.out.println("Playing vlc file: " + fileName);
    }
}

class Mp4Player {
    public void playMp4(String fileName) {
        System.out.println("Playing mp4 file: " + fileName);
    }
}

// 适配器
class MediaAdapter implements MediaPlayer {
    private VlcPlayer vlcPlayer;
    private Mp4Player mp4Player;
    
    public MediaAdapter(String audioType) {
        if (audioType.equalsIgnoreCase("vlc")) {
            vlcPlayer = new VlcPlayer();
        } else if (audioType.equalsIgnoreCase("mp4")) {
            mp4Player = new Mp4Player();
        }
    }
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("vlc")) {
            vlcPlayer.playVlc(fileName);
        } else if (audioType.equalsIgnoreCase("mp4")) {
            mp4Player.playMp4(fileName);
        }
    }
}

// 使用
class AudioPlayer implements MediaPlayer {
    private MediaAdapter mediaAdapter;
    
    @Override
    public void play(String audioType, String fileName) {
        if (audioType.equalsIgnoreCase("mp3")) {
            System.out.println("Playing mp3 file: " + fileName);
        } else if (audioType.equalsIgnoreCase("vlc") || 
                   audioType.equalsIgnoreCase("mp4")) {
            mediaAdapter = new MediaAdapter(audioType);
            mediaAdapter.play(audioType, fileName);
        } else {
            System.out.println("Invalid media type");
        }
    }
}
```

**使用场景：**

1. **系统集成**：旧系统与新系统接口不兼容
2. **第三方库适配**：封装第三方接口
3. **接口转换**：不同接口间的转换

**实际应用：**
```java
// Java IO中的适配器
InputStreamReader isr = new InputStreamReader(new FileInputStream("file.txt"));

// Arrays.asList()
List<String> list = Arrays.asList("a", "b", "c");

// Spring MVC中的HandlerAdapter
```

### 10. 什么是桥接模式？一般用在什么场景？

**答案：**

桥接模式将抽象部分与实现部分分离，使它们可以独立变化。

**实现示例：**
```java
// 实现部分：颜色
interface Color {
    void applyColor();
}

class RedColor implements Color {
    public void applyColor() {
        System.out.println("Red color");
    }
}

class BlueColor implements Color {
    public void applyColor() {
        System.out.println("Blue color");
    }
}

// 抽象部分：形状
abstract class Shape {
    protected Color color;  // 桥接
    
    public Shape(Color color) {
        this.color = color;
    }
    
    abstract void draw();
}

class Circle extends Shape {
    public Circle(Color color) {
        super(color);
    }
    
    @Override
    void draw() {
        System.out.print("Circle with ");
        color.applyColor();
    }
}

class Rectangle extends Shape {
    public Rectangle(Color color) {
        super(color);
    }
    
    @Override
    void draw() {
        System.out.print("Rectangle with ");
        color.applyColor();
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Shape redCircle = new Circle(new RedColor());
        redCircle.draw();
        
        Shape blueRectangle = new Rectangle(new BlueColor());
        blueRectangle.draw();
    }
}
```

**优势：**
- 抽象和实现分离，可独立扩展
- 避免类爆炸（不用为每种组合创建类）
- 符合开闭原则

**使用场景：**

1. **多维度变化**：形状+颜色、设备+系统
2. **避免继承爆炸**：用组合替代继承
3. **跨平台开发**：业务逻辑与平台实现分离

**实际应用：**
```java
// JDBC驱动
Connection conn = DriverManager.getConnection(url);

// 日志框架：SLF4J + Logback/Log4j
Logger logger = LoggerFactory.getLogger(MyClass.class);
```

### 11. 什么是组合模式？一般用在什么场景？

**答案：**

组合模式将对象组合成树形结构，表示“部分-整体”层次结构。

**实现示例：**
```java
// 组件接口
abstract class Component {
    protected String name;
    
    public Component(String name) {
        this.name = name;
    }
    
    abstract void add(Component component);
    abstract void remove(Component component);
    abstract void display(int depth);
}

// 叶子节点：文件
class File extends Component {
    public File(String name) {
        super(name);
    }
    
    @Override
    void add(Component component) {
        throw new UnsupportedOperationException();
    }
    
    @Override
    void remove(Component component) {
        throw new UnsupportedOperationException();
    }
    
    @Override
    void display(int depth) {
        System.out.println("-".repeat(depth) + name);
    }
}

// 容器节点：文件夹
class Folder extends Component {
    private List<Component> children = new ArrayList<>();
    
    public Folder(String name) {
        super(name);
    }
    
    @Override
    void add(Component component) {
        children.add(component);
    }
    
    @Override
    void remove(Component component) {
        children.remove(component);
    }
    
    @Override
    void display(int depth) {
        System.out.println("-".repeat(depth) + name);
        for (Component component : children) {
            component.display(depth + 2);
        }
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Folder root = new Folder("root");
        Folder folder1 = new Folder("folder1");
        Folder folder2 = new Folder("folder2");
        
        File file1 = new File("file1.txt");
        File file2 = new File("file2.txt");
        File file3 = new File("file3.txt");
        
        root.add(folder1);
        root.add(folder2);
        folder1.add(file1);
        folder1.add(file2);
        folder2.add(file3);
        
        root.display(0);
    }
}
```

**使用场景：**
1. **树形结构**：文件系统、组织架构
2. **部分-整体关系**：菜单系统、UI组件
3. **递归处理**：需要递归遍历的场景

### 12. 什么是装饰器模式？一般用在什么场景？

**答案：**

装饰器模式动态地给对象添加额外的职责，不改变原有结构。

**实现示例：**
```java
// 组件接口
interface Coffee {
    double cost();
    String description();
}

// 具体组件
class SimpleCoffee implements Coffee {
    @Override
    public double cost() {
        return 10.0;
    }
    
    @Override
    public String description() {
        return "Simple Coffee";
    }
}

// 抽象装饰器
abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
    
    @Override
    public double cost() {
        return coffee.cost();
    }
    
    @Override
    public String description() {
        return coffee.description();
    }
}

// 具体装饰器：牛奶
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public double cost() {
        return super.cost() + 2.0;
    }
    
    @Override
    public String description() {
        return super.description() + ", Milk";
    }
}

// 具体装饰器：糖
class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public double cost() {
        return super.cost() + 1.0;
    }
    
    @Override
    public String description() {
        return super.description() + ", Sugar";
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.description() + " $" + coffee.cost());
        
        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.description() + " $" + coffee.cost());
        
        coffee = new SugarDecorator(coffee);
        System.out.println(coffee.description() + " $" + coffee.cost());
    }
}
```

**使用场景：**
1. **动态扩展功能**：不修改原类添加功能
2. **避免类爆炸**：不用为每种组合创建子类
3. **符合开闭原则**：对扩展开放，对修改关闭

**实际应用：**
- Java IO：BufferedReader/BufferedWriter
- Collections.synchronizedList()
- Spring的BeanWrapper

### 13. 装饰器、适配器、代理、桥接这四种设计模式有什么区别？

**答案：**

| 模式 | 目的 | 特点 | 示例 |
|------|------|------|------|
| **装饰器** | 增强功能 | 不改变接口，动态添加职责 | BufferedReader |
| **适配器** | 接口转换 | 让不兼容的接口协同工作 | InputStreamReader |
| **代理** | 控制访问 | 为对象提供代理，控制访问 | Spring AOP |
| **桥接** | 分离抽象和实现 | 抽象和实现可独立变化 | JDBC Driver |

**详细对比：**

**1. 装饰器模式**
```java
// 目的：增强功能
Reader reader = new FileReader("file.txt");
reader = new BufferedReader(reader);  // 添加缓冲功能
```

**2. 适配器模式**
```java
// 目的：接口转换
InputStream is = new FileInputStream("file.txt");
Reader reader = new InputStreamReader(is);  // 字节流转字符流
```

**3. 代理模式**
```java
// 目的：控制访问
UserService proxy = (UserService) Proxy.newProxyInstance(
    UserService.class.getClassLoader(),
    new Class[]{UserService.class},
    new InvocationHandler() {
        public Object invoke(Object proxy, Method method, Object[] args) {
            // 前置处理
            Object result = method.invoke(target, args);
            // 后置处理
            return result;
        }
    }
);
```

**4. 桥接模式**
```java
// 目的：分离抽象和实现
abstract class Shape {
    protected Color color;  // 桥接
    abstract void draw();
}
```

**核心区别：**
- **装饰器**：同接口，增强功能
- **适配器**：不同接口，转换接口
- **代理**：同接口，控制访问
- **桥接**：分离抽象，独立变化

### 14. 什么是外观模式？一般用在什么场景？

**答案：**

外观模式为复杂子系统提供一个统一的高层接口，简化调用。

**实现示例：**
```java
// 子系统1：CPU
class CPU {
    public void start() {
        System.out.println("CPU started");
    }
    
    public void shutdown() {
        System.out.println("CPU shutdown");
    }
}

// 子系统2：内存
class Memory {
    public void load() {
        System.out.println("Memory loaded");
    }
}

// 子系统3：硬盘
class HardDrive {
    public void read() {
        System.out.println("Hard drive reading");
    }
}

// 外观类
class ComputerFacade {
    private CPU cpu;
    private Memory memory;
    private HardDrive hardDrive;
    
    public ComputerFacade() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    // 统一的启动接口
    public void start() {
        cpu.start();
        memory.load();
        hardDrive.read();
        System.out.println("Computer started");
    }
    
    // 统一的关闭接口
    public void shutdown() {
        cpu.shutdown();
        System.out.println("Computer shutdown");
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        ComputerFacade computer = new ComputerFacade();
        computer.start();   // 简单调用
        computer.shutdown();
    }
}
```

**使用场景：**
1. **简化复杂系统**：为复杂子系统提供简单接口
2. **分层架构**：层与层之间的接口
3. **降低耦合**：客户端与子系统解耦

**实际应用：**
- SLF4J日志外观
- JDBC的DriverManager
- Spring的各种Template类

### 15. 什么是享元模式？一般用在什么场景？

**答案：**

享元模式通过共享技术有效支持大量细粒度对象，减少内存开销。

**实现示例：**
```java
// 享元接口
interface Shape {
    void draw(int x, int y);
}

// 具体享元类
class Circle implements Shape {
    private String color;  // 内部状态（共享）
    
    public Circle(String color) {
        this.color = color;
    }
    
    @Override
    public void draw(int x, int y) {  // 外部状态（不共享）
        System.out.println("Drawing " + color + " circle at (" + x + ", " + y + ")");
    }
}

// 享元工厂
class ShapeFactory {
    private static final Map<String, Shape> circleMap = new HashMap<>();
    
    public static Shape getCircle(String color) {
        Circle circle = (Circle) circleMap.get(color);
        
        if (circle == null) {
            circle = new Circle(color);
            circleMap.put(color, circle);
            System.out.println("Creating " + color + " circle");
        }
        
        return circle;
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        String[] colors = {"Red", "Green", "Blue", "Red", "Green"};
        
        for (int i = 0; i < 5; i++) {
            Shape circle = ShapeFactory.getCircle(colors[i]);
            circle.draw(i * 10, i * 20);
        }
        
        // 只创建了3个对象，而不是5个
    }
}
```

**核心概念：**
- **内部状态**：可共享的不变部分（如颜色）
- **外部状态**：不可共享的变化部分（如坐标）

**使用场景：**
1. **大量相似对象**：游戏中的子弹、树木
2. **内存优化**：减少对象创建数量
3. **不变对象**：对象状态不经常变化

**实际应用：**
```java
// String常量池
String s1 = "hello";
String s2 = "hello";  // 共享同一对象

// Integer缓存（-128到127）
Integer i1 = 100;
Integer i2 = 100;  // 共享同一对象

// 数据库连接池
```

### 16. 什么是代理模式？一般用在什么场景？

**答案：**

代理模式为对象提供一个代理，控制对该对象的访问。

**静态代理：**
```java
// 接口
interface UserService {
    void save(String user);
}

// 真实对象
class UserServiceImpl implements UserService {
    @Override
    public void save(String user) {
        System.out.println("Saving user: " + user);
    }
}

// 代理类
class UserServiceProxy implements UserService {
    private UserService target;
    
    public UserServiceProxy(UserService target) {
        this.target = target;
    }
    
    @Override
    public void save(String user) {
        System.out.println("Before save - logging");
        target.save(user);
        System.out.println("After save - logging");
    }
}

// 使用
UserService service = new UserServiceImpl();
UserService proxy = new UserServiceProxy(service);
proxy.save("John");
```

**JDK动态代理：**
```java
UserService service = new UserServiceImpl();

UserService proxy = (UserService) Proxy.newProxyInstance(
    service.getClass().getClassLoader(),
    service.getClass().getInterfaces(),
    new InvocationHandler() {
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) 
                throws Throwable {
            System.out.println("Before: " + method.getName());
            Object result = method.invoke(service, args);
            System.out.println("After: " + method.getName());
            return result;
        }
    }
);

proxy.save("John");
```

**CGLIB代理：**
```java
class UserService {
    public void save(String user) {
        System.out.println("Saving: " + user);
    }
}

Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(UserService.class);
enhancer.setCallback(new MethodInterceptor() {
    @Override
    public Object intercept(Object obj, Method method, Object[] args, 
                           MethodProxy proxy) throws Throwable {
        System.out.println("Before");
        Object result = proxy.invokeSuper(obj, args);
        System.out.println("After");
        return result;
    }
});

UserService proxy = (UserService) enhancer.create();
proxy.save("John");
```

**使用场景：**
1. **远程代理**：RPC、RMI
2. **虚拟代理**：延迟加载大对象
3. **保护代理**：权限控制
4. **智能代理**：日志、缓存、事务

**实际应用：**
- Spring AOP
- MyBatis Mapper接口
- Feign远程调用

### 17. 什么是观察者模式？一般用在什么场景？

**答案：**

观察者模式定义对象间的一对多依赖，当一个对象状态改变时，所有依赖它的对象都会收到通知。

**实现示例：**
```java
// 观察者接口
interface Observer {
    void update(String message);
}

// 具体观察者
class User implements Observer {
    private String name;
    
    public User(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String message) {
        System.out.println(name + " received: " + message);
    }
}

// 主题（被观察者）
class Subject {
    private List<Observer> observers = new ArrayList<>();
    
    // 添加观察者
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    // 移除观察者
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    // 通知所有观察者
    public void notifyObservers(String message) {
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}

// 具体主题
class NewsAgency extends Subject {
    public void publishNews(String news) {
        System.out.println("Publishing news: " + news);
        notifyObservers(news);
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        NewsAgency agency = new NewsAgency();
        
        User user1 = new User("Alice");
        User user2 = new User("Bob");
        
        agency.attach(user1);
        agency.attach(user2);
        
        agency.publishNews("Breaking News!");
    }
}
```

**使用场景：**
1. **事件处理**：GUI事件监听
2. **消息通知**：订阅发布系统
3. **数据同步**：模型-视图同步

**实际应用：**
```java
// Java内置支持
java.util.Observable
java.util.Observer

// Spring事件
ApplicationEventPublisher

// MQ消息队列
Kafka, RabbitMQ
```

### 18. 什么是迭代器模式？一般用在什么场景？

**答案：**

迭代器模式提供一种方法顺序访问聚合对象中的元素，而不暴露其内部表示。

**实现示例：**
```java
// 迭代器接口
interface Iterator<T> {
    boolean hasNext();
    T next();
}

// 聚合接口
interface Container<T> {
    Iterator<T> getIterator();
}

// 具体聚合
class BookCollection implements Container<String> {
    private String[] books;
    private int index = 0;
    
    public BookCollection(int size) {
        books = new String[size];
    }
    
    public void addBook(String book) {
        if (index < books.length) {
            books[index++] = book;
        }
    }
    
    @Override
    public Iterator<String> getIterator() {
        return new BookIterator();
    }
    
    // 内部迭代器类
    private class BookIterator implements Iterator<String> {
        private int currentIndex = 0;
        
        @Override
        public boolean hasNext() {
            return currentIndex < index;
        }
        
        @Override
        public String next() {
            if (hasNext()) {
                return books[currentIndex++];
            }
            return null;
        }
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        BookCollection books = new BookCollection(3);
        books.addBook("Design Patterns");
        books.addBook("Clean Code");
        books.addBook("Refactoring");
        
        Iterator<String> iterator = books.getIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}
```

**使用场景：**
1. **聚合遍历**：统一遍历接口
2. **隐藏内部结构**：不暴露实现细节
3. **多种遍历方式**：支持不同遍历策略

**实际应用：**
```java
// Java集合框架
List<String> list = new ArrayList<>();
Iterator<String> iterator = list.iterator();

// for-each语法糖
for (String item : list) {
    // 内部使用迭代器
}
```

### 19. 什么是模板方法模式？一般用在什么场景？

**答案：**

模板方法模式定义算法骨架，将某些步骤延迟到子类实现。

**实现示例：**
```java
// 抽象类
abstract class DataProcessor {
    // 模板方法：定义算法骨架
    public final void process() {
        readData();
        processData();
        saveData();
    }
    
    // 具体方法
    private void readData() {
        System.out.println("Reading data...");
    }
    
    // 抽象方法：由子类实现
    protected abstract void processData();
    
    // 钩子方法：可选重写
    protected void saveData() {
        System.out.println("Saving data...");
    }
}

// 具体子类1
class CSVDataProcessor extends DataProcessor {
    @Override
    protected void processData() {
        System.out.println("Processing CSV data");
    }
}

// 具体子类2
class JSONDataProcessor extends DataProcessor {
    @Override
    protected void processData() {
        System.out.println("Processing JSON data");
    }
    
    @Override
    protected void saveData() {
        System.out.println("Saving JSON to database");
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        DataProcessor csv = new CSVDataProcessor();
        csv.process();
        
        System.out.println();
        
        DataProcessor json = new JSONDataProcessor();
        json.process();
    }
}
```

**使用场景：**
1. **算法骨架固定**：步骤固定，细节变化
2. **代码复用**：公共代码提取到父类
3. **控制扩展**：只允许特定步骤扩展

**实际应用：**
```java
// Servlet的service方法
public abstract class HttpServlet {
    public void service(HttpServletRequest req, HttpServletResponse resp) {
        String method = req.getMethod();
        if (method.equals("GET")) {
            doGet(req, resp);
        } else if (method.equals("POST")) {
            doPost(req, resp);
        }
    }
    
    protected abstract void doGet(HttpServletRequest req, HttpServletResponse resp);
    protected abstract void doPost(HttpServletRequest req, HttpServletResponse resp);
}

// Spring的JdbcTemplate
// MyBatis的BaseExecutor
```

### 20. 什么是命令模式？一般用在什么场景？

**答案：**

命令模式将请求封装为对象，从而可以参数化、队列化、记录请求。

**实现示例：**
```java
// 命令接口
interface Command {
    void execute();
    void undo();
}

// 接收者：灯
class Light {
    public void on() {
        System.out.println("Light is ON");
    }
    
    public void off() {
        System.out.println("Light is OFF");
    }
}

// 具体命令：开灯
class LightOnCommand implements Command {
    private Light light;
    
    public LightOnCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.on();
    }
    
    @Override
    public void undo() {
        light.off();
    }
}

// 具体命令：关灯
class LightOffCommand implements Command {
    private Light light;
    
    public LightOffCommand(Light light) {
        this.light = light;
    }
    
    @Override
    public void execute() {
        light.off();
    }
    
    @Override
    public void undo() {
        light.on();
    }
}

// 调用者：遥控器
class RemoteControl {
    private Command command;
    
    public void setCommand(Command command) {
        this.command = command;
    }
    
    public void pressButton() {
        command.execute();
    }
    
    public void pressUndo() {
        command.undo();
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Light light = new Light();
        Command lightOn = new LightOnCommand(light);
        Command lightOff = new LightOffCommand(light);
        
        RemoteControl remote = new RemoteControl();
        
        remote.setCommand(lightOn);
        remote.pressButton();  // 开灯
        remote.pressUndo();    // 撤销，关灯
        
        remote.setCommand(lightOff);
        remote.pressButton();  // 关灯
    }
}
```

**使用场景：**
1. **撤销/重做**：编辑器操作
2. **队列请求**：任务队列
3. **记录日志**：操作日志
4. **宏命令**：组合多个命令

**实际应用：**
```java
// Runnable接口
Runnable task = () -> System.out.println("Task");
new Thread(task).start();

// Spring的JdbcTemplate回调
// Struts2的Action
```

### 21. 什么是状态模式？一般用在什么场景？

**答案：**

状态模式允许对象在内部状态改变时改变其行为。

**实现示例：**
```java
// 状态接口
interface State {
    void handle(Context context);
}

// 具体状态：开始状态
class StartState implements State {
    @Override
    public void handle(Context context) {
        System.out.println("Starting...");
        context.setState(new RunningState());
    }
}

// 具体状态：运行状态
class RunningState implements State {
    @Override
    public void handle(Context context) {
        System.out.println("Running...");
        context.setState(new StopState());
    }
}

// 具体状态：停止状态
class StopState implements State {
    @Override
    public void handle(Context context) {
        System.out.println("Stopped.");
        context.setState(null);
    }
}

// 上下文类
class Context {
    private State state;
    
    public Context() {
        this.state = new StartState();
    }
    
    public void setState(State state) {
        this.state = state;
    }
    
    public void request() {
        if (state != null) {
            state.handle(this);
        }
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Context context = new Context();
        context.request();  // Starting
        context.request();  // Running
        context.request();  // Stopped
    }
}
```

**使用场景：**
1. **状态机**：工作流、订单状态
2. **条件分支复杂**：替代大量if-else
3. **状态转换**：状态间有明确转换规则

**实际应用：**
- TCP连接状态
- 订单状态流转
- 线程状态

### 22. 什么是策略模式？一般用在什么场景？

**答案：**

策略模式定义一系列算法，将每个算法封装起来，使它们可以互相替换。

**实现示例：**
```java
// 策略接口
interface PaymentStrategy {
    void pay(int amount);
}

// 具体策略：支付宝
class AlipayStrategy implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using Alipay");
    }
}

// 具体策略：微信
class WeChatStrategy implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using WeChat");
    }
}

// 具体策略：银行卡
class BankCardStrategy implements PaymentStrategy {
    @Override
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using Bank Card");
    }
}

// 上下文类
class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        
        // 使用支付宝
        cart.setPaymentStrategy(new AlipayStrategy());
        cart.checkout(100);
        
        // 切换为微信
        cart.setPaymentStrategy(new WeChatStrategy());
        cart.checkout(200);
    }
}
```

**使用场景：**
1. **多种算法可选**：支付方式、排序算法
2. **避免if-else**：替代复杂条件分支
3. **算法独立变化**：算法可独立扩展

**实际应用：**
```java
// Comparator
Collections.sort(list, new Comparator<String>() {
    public int compare(String s1, String s2) {
        return s1.compareTo(s2);
    }
});

// ThreadPoolExecutor的拒绝策略
RejectedExecutionHandler
```

### 23. 什么是责任链模式？一般用在什么场景？

**答案：**

责任链模式将请求沿着处理者链传递，直到有处理者处理它。

**实现示例：**
```java
// 抽象处理者
abstract class Handler {
    protected Handler nextHandler;
    
    public void setNext(Handler handler) {
        this.nextHandler = handler;
    }
    
    public abstract void handleRequest(int level);
}

// 具体处理者：经理
class Manager extends Handler {
    @Override
    public void handleRequest(int level) {
        if (level <= 1) {
            System.out.println("Manager handled request level " + level);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(level);
        }
    }
}

// 具体处理者：总监
class Director extends Handler {
    @Override
    public void handleRequest(int level) {
        if (level <= 2) {
            System.out.println("Director handled request level " + level);
        } else if (nextHandler != null) {
            nextHandler.handleRequest(level);
        }
    }
}

// 具体处理者：CEO
class CEO extends Handler {
    @Override
    public void handleRequest(int level) {
        System.out.println("CEO handled request level " + level);
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        Handler manager = new Manager();
        Handler director = new Director();
        Handler ceo = new CEO();
        
        // 构建责任链
        manager.setNext(director);
        director.setNext(ceo);
        
        // 发起请求
        manager.handleRequest(1);  // Manager处理
        manager.handleRequest(2);  // Director处理
        manager.handleRequest(3);  // CEO处理
    }
}
```

**使用场景：**
1. **审批流程**：请假、报销审批
2. **过滤器链**：Servlet Filter
3. **异常处理**：多级异常捕获

**实际应用：**
```java
// Servlet Filter链
FilterChain

// Netty的ChannelPipeline
pipeline.addLast(new Handler1());
pipeline.addLast(new Handler2());

// Spring Security过滤器链
```

### 24. 什么是中介者模式？一般用在什么场景？

**答案：**

中介者模式用一个中介对象封装一系列对象的交互，降低对象间的耦合。

**实现示例：**
```java
// 中介者接口
interface ChatMediator {
    void sendMessage(String message, User user);
    void addUser(User user);
}

// 具体中介者
class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();
    
    @Override
    public void addUser(User user) {
        users.add(user);
    }
    
    @Override
    public void sendMessage(String message, User sender) {
        for (User user : users) {
            // 不发给发送者自己
            if (user != sender) {
                user.receive(message);
            }
        }
    }
}

// 同事类
class User {
    private String name;
    private ChatMediator mediator;
    
    public User(String name, ChatMediator mediator) {
        this.name = name;
        this.mediator = mediator;
    }
    
    public void send(String message) {
        System.out.println(name + " sends: " + message);
        mediator.sendMessage(message, this);
    }
    
    public void receive(String message) {
        System.out.println(name + " received: " + message);
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        ChatMediator chatRoom = new ChatRoom();
        
        User alice = new User("Alice", chatRoom);
        User bob = new User("Bob", chatRoom);
        User charlie = new User("Charlie", chatRoom);
        
        chatRoom.addUser(alice);
        chatRoom.addUser(bob);
        chatRoom.addUser(charlie);
        
        alice.send("Hello everyone!");
    }
}
```

**使用场景：**
1. **复杂交互**：多对象互相通信
2. **降低耦合**：对象间不直接引用
3. **集中控制**：统一管理交互逻辑

**实际应用：**
- MVC中的Controller
- 聊天室服务器
- 机场控制塔

### 25. 什么是访问者模式？一般用在什么场景？

**答案：**

访问者模式将数据结构与操作分离，在不改变数据结构的前提下添加新操作。

**实现示例：**
```java
// 访问者接口
interface Visitor {
    void visit(Book book);
    void visit(Fruit fruit);
}

// 元素接口
interface Element {
    void accept(Visitor visitor);
}

// 具体元素：书
class Book implements Element {
    private String name;
    private double price;
    
    public Book(String name, double price) {
        this.name = name;
        this.price = price;
    }
    
    public String getName() { return name; }
    public double getPrice() { return price; }
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

// 具体元素：水果
class Fruit implements Element {
    private String name;
    private double weight;
    private double pricePerKg;
    
    public Fruit(String name, double weight, double pricePerKg) {
        this.name = name;
        this.weight = weight;
        this.pricePerKg = pricePerKg;
    }
    
    public String getName() { return name; }
    public double getWeight() { return weight; }
    public double getPricePerKg() { return pricePerKg; }
    
    @Override
    public void accept(Visitor visitor) {
        visitor.visit(this);
    }
}

// 具体访问者：计算价格
class PriceCalculator implements Visitor {
    private double totalPrice = 0;
    
    @Override
    public void visit(Book book) {
        totalPrice += book.getPrice();
        System.out.println("Book: " + book.getName() + " - $" + book.getPrice());
    }
    
    @Override
    public void visit(Fruit fruit) {
        double price = fruit.getWeight() * fruit.getPricePerKg();
        totalPrice += price;
        System.out.println("Fruit: " + fruit.getName() + " - $" + price);
    }
    
    public double getTotalPrice() {
        return totalPrice;
    }
}

// 使用
public class Demo {
    public static void main(String[] args) {
        List<Element> items = new ArrayList<>();
        items.add(new Book("Design Patterns", 50));
        items.add(new Fruit("Apple", 2, 5));
        items.add(new Book("Clean Code", 45));
        
        PriceCalculator calculator = new PriceCalculator();
        for (Element item : items) {
            item.accept(calculator);
        }
        
        System.out.println("Total: $" + calculator.getTotalPrice());
    }
}
```

**使用场景：**
1. **数据结构稳定**：结构不变，操作多变
2. **多种操作**：需要对元素执行多种不同操作
3. **分离关注点**：数据与算法分离

**实际应用：**
- 编译器的AST遍历
- XML文档处理
- 文件系统操作

### 26. 什么是备忘录模式？一般用在什么场景？

**答案：**

备忘录模式在不破坏封装的前提下，捕获对象的内部状态并保存，以便后续恢复。

**实现示例：**
```java
// 备忘录类
class Memento {
    private String state;
    
    public Memento(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

// 原发器
class Editor {
    private String content;
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getContent() {
        return content;
    }
    
    // 保存状态
    public Memento save() {
        return new Memento(content);
    }
    
    // 恢复状态
    public void restore(Memento memento) {
        this.content = memento.getState();
    }
}

// 管理者
class History {
    private Stack<Memento> mementos = new Stack<>();
    
    public void push(Memento memento) {
        mementos.push(memento);
    }
    
    public Memento pop() {
        return mementos.pop();
    }
}

// 使用
Editor editor = new Editor();
History history = new History();

editor.setContent("Version 1");
history.push(editor.save());

editor.setContent("Version 2");
history.push(editor.save());

editor.setContent("Version 3");

// 撤销
editor.restore(history.pop());
System.out.println(editor.getContent()); // Version 2
```

**使用场景：**
- 撤销/重做功能
- 事务回滚
- 游戏存档

### 27. 什么是单一职责原则？

**答案：**

单一职责原则（SRP）：一个类应该只有一个引起它变化的原因。

**核心思想：**
- 一个类只负责一项职责
- 降低类的复杂度
- 提高可读性和可维护性

**示例：**
```java
// 违反SRP：一个类承担多个职责
class User {
    private String name;
    
    // 职责1：用户数据管理
    public void setName(String name) {
        this.name = name;
    }
    
    // 职责2：数据库操作
    public void save() {
        // 保存到数据库
    }
    
    // 职责3：邮件发送
    public void sendEmail() {
        // 发送邮件
    }
}

// 符合SRP：职责分离
class User {
    private String name;
    public void setName(String name) { this.name = name; }
}

class UserRepository {
    public void save(User user) { /* 保存 */ }
}

class EmailService {
    public void sendEmail(User user) { /* 发送 */ }
}
```

### 28. 什么是开闭原则？

**答案：**

开闭原则（OCP）：软件实体应该对扩展开放，对修改关闭。

**核心思想：**
- 通过扩展实现变化，而不是修改现有代码
- 使用抽象和多态
- 提高系统稳定性

**示例：**
```java
// 违反OCP：需要修改代码添加新功能
class Calculator {
    public double calculate(String type, double a, double b) {
        if (type.equals("add")) {
            return a + b;
        } else if (type.equals("subtract")) {
            return a - b;
        }
        // 添加新运算需要修改此方法
        return 0;
    }
}

// 符合OCP：通过扩展添加新功能
interface Operation {
    double calculate(double a, double b);
}

class Add implements Operation {
    public double calculate(double a, double b) {
        return a + b;
    }
}

class Subtract implements Operation {
    public double calculate(double a, double b) {
        return a - b;
    }
}

// 添加新运算只需新增类，无需修改现有代码
class Multiply implements Operation {
    public double calculate(double a, double b) {
        return a * b;
    }
}
```

### 29. 什么是里氏替换原则？

**答案：**

里氏替换原则（LSP）：子类对象能够替换父类对象，程序行为不变。

**核心思想：**
- 子类必须完全实现父类的方法
- 子类可以有自己的特性
- 覆盖父类方法时，输入参数可以放宽，输出结果应该收紧

**示例：**
```java
// 违反LSP
class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
    public int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width; // 破坏了父类行为
    }
}

// 符合LSP：使用组合而非继承
interface Shape {
    int getArea();
}

class Rectangle implements Shape {
    private int width;
    private int height;
    
    public int getArea() { return width * height; }
}

class Square implements Shape {
    private int side;
    
    public int getArea() { return side * side; }
}
```

### 30. 什么是接口隔离原则？

**答案：**

接口隔离原则（ISP）：客户端不应该依赖它不需要的接口。

**核心思想：**
- 接口应该小而专一
- 避免臃肿的接口
- 一个类对另一个类的依赖应该建立在最小接口上

**示例：**
```java
// 违反ISP：臃肿的接口
interface Worker {
    void work();
    void eat();
    void sleep();
}

class Human implements Worker {
    public void work() { /* 工作 */ }
    public void eat() { /* 吃饭 */ }
    public void sleep() { /* 睡觉 */ }
}

class Robot implements Worker {
    public void work() { /* 工作 */ }
    public void eat() { /* 机器人不需要 */ }
    public void sleep() { /* 机器人不需要 */ }
}

// 符合ISP：接口分离
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class Human implements Workable, Eatable, Sleepable {
    public void work() { /* 工作 */ }
    public void eat() { /* 吃饭 */ }
    public void sleep() { /* 睡觉 */ }
}

class Robot implements Workable {
    public void work() { /* 工作 */ }
}
```

### 31. 什么是依赖倒置原则？

**答案：**

依赖倒置原则（DIP）：高层模块不应该依赖低层模块，两者都应该依赖抽象。

**核心思想：**
- 面向接口编程，不面向实现编程
- 抽象不应该依赖细节，细节应该依赖抽象
- 降低耦合度

**示例：**
```java
// 违反DIP：高层依赖低层具体实现
class MySQLDatabase {
    public void connect() {
        System.out.println("MySQL connected");
    }
}

class UserService {
    private MySQLDatabase database = new MySQLDatabase();
    
    public void getUser() {
        database.connect();
        // 获取用户
    }
}

// 符合DIP：依赖抽象
interface Database {
    void connect();
}

class MySQLDatabase implements Database {
    public void connect() {
        System.out.println("MySQL connected");
    }
}

class MongoDatabase implements Database {
    public void connect() {
        System.out.println("MongoDB connected");
    }
}

class UserService {
    private Database database;
    
    // 依赖注入
    public UserService(Database database) {
        this.database = database;
    }
    
    public void getUser() {
        database.connect();
        // 获取用户
    }
}
```

### 32. 什么是迪米特法则？

**答案：**

迪米特法则（LoD）：一个对象应该对其他对象有最少的了解，只与直接的朋友通信。

**核心思想：**
- 降低类之间的耦合
- 类只与直接朋友交互
- 不要和陌生人说话

**示例：**
```java
// 违反迪米特法则
class Engine {
    public void start() {
        System.out.println("Engine started");
    }
}

class Car {
    private Engine engine;
    
    public Engine getEngine() {
        return engine;
    }
}

class Driver {
    public void drive(Car car) {
        // 直接访问Car的内部对象
        car.getEngine().start();
    }
}

// 符合迪米特法则
class Car {
    private Engine engine;
    
    // 封装内部细节
    public void start() {
        engine.start();
    }
}

class Driver {
    public void drive(Car car) {
        // 只与Car交互
        car.start();
    }
}
```

### 33. 谈谈你了解的最常见的几种设计模式，说说他们的应用场景

**答案：**

**1. 单例模式**
- 场景：数据库连接池、配置管理器、日志工具
- 优势：全局唯一实例，节省资源

**2. 工厂模式**
- 场景：对象创建逻辑复杂、需要解耦创建和使用
- 优势：封装创建逻辑，易于扩展

**3. 代理模式**
- 场景：Spring AOP、RPC调用、权限控制
- 优势：在不修改原对象的情况下增强功能

**4. 观察者模式**
- 场景：事件监听、消息队列、MVC架构
- 优势：松耦合的事件通知机制

**5. 策略模式**
- 场景：支付方式选择、排序算法切换
- 优势：算法可替换，避免大量if-else

**6. 模板方法模式**
- 场景：Servlet、Spring JdbcTemplate
- 优势：复用公共代码，子类只实现差异部分

**7. 装饰器模式**
- 场景：Java IO流、动态添加功能
- 优势：灵活扩展对象功能

**8. 适配器模式**
- 场景：系统集成、接口转换
- 优势：让不兼容的接口协同工作

### 34. 请用一句话概括，什么是设计模式？为什么要用？

**答案：**

**什么是：**
设计模式是软件开发中反复出现的问题的经验性解决方案。

**为什么用：**
1. **提高代码质量**：可读性、可维护性、可扩展性
2. **降低开发成本**：复用成熟方案，减少试错
3. **统一开发语言**：团队沟通更高效
4. **应对变化**：让系统更容易适应需求变化
5. **最佳实践**：站在巨人的肩膀上

**一句话总结：**
设计模式是前人智慧的结晶，帮助我们写出高质量、易维护、可扩展的代码。

### 35. 你认为好的代码应该是什么样的？

**答案：**

**1. 可读性强**
- 命名清晰、注释恰当
- 代码结构清晰
- 遵循编码规范

**2. 可维护性好**
- 低耦合、高内聚
- 职责单一
- 易于修改和扩展

**3. 可测试性高**
- 模块化设计
- 依赖可注入
- 易于编写单元测试

**4. 性能优秀**
- 算法高效
- 资源利用合理
- 无明显性能瓶颈

**5. 健壮性强**
- 异常处理完善
- 边界条件考虑周全
- 容错能力强

**6. 遵循原则**
- SOLID原则
- DRY（Don't Repeat Yourself）
- KISS（Keep It Simple, Stupid）
- YAGNI（You Aren't Gonna Need It）

**代码示例：**
```java
// 好的代码
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    
    public OrderService(OrderRepository orderRepository, 
                       PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.paymentService = paymentService;
    }
    
    public Order createOrder(OrderRequest request) {
        validateRequest(request);
        Order order = buildOrder(request);
        orderRepository.save(order);
        paymentService.processPayment(order);
        return order;
    }
    
    private void validateRequest(OrderRequest request) {
        if (request == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Invalid order request");
        }
    }
    
    private Order buildOrder(OrderRequest request) {
        // 构建订单逻辑
        return new Order();
    }
}
```

### 36. 什么是合成复用原则？

**答案：**

合成复用原则（CRP）：优先使用组合/聚合，而不是继承来达到复用目的。

**核心思想：**
- 继承是白盒复用，组合是黑盒复用
- 继承破坏封装性，组合保持封装性
- 继承是静态的，组合是动态的

**示例：**
```java
// 使用继承（不推荐）
class Animal {
    public void eat() {
        System.out.println("Eating");
    }
}

class Bird extends Animal {
    public void fly() {
        System.out.println("Flying");
    }
}

class Penguin extends Bird {
    // 问题：企鹅不会飞，但继承了fly方法
    @Override
    public void fly() {
        throw new UnsupportedOperationException();
    }
}

// 使用组合（推荐）
interface Eatable {
    void eat();
}

interface Flyable {
    void fly();
}

class EatBehavior implements Eatable {
    public void eat() {
        System.out.println("Eating");
    }
}

class FlyBehavior implements Flyable {
    public void fly() {
        System.out.println("Flying");
    }
}

class Bird {
    private Eatable eatBehavior;
    private Flyable flyBehavior;
    
    public Bird(Eatable eatBehavior, Flyable flyBehavior) {
        this.eatBehavior = eatBehavior;
        this.flyBehavior = flyBehavior;
    }
    
    public void eat() {
        eatBehavior.eat();
    }
    
    public void fly() {
        if (flyBehavior != null) {
            flyBehavior.fly();
        }
    }
}

// 企鹅只有吃的行为，没有飞的行为
Bird penguin = new Bird(new EatBehavior(), null);
```

**优势：**
- 更灵活：运行时可以改变行为
- 更松耦合：减少类之间的依赖
- 更易扩展：添加新功能不影响现有代码

---

##  学习指南

**核心要点：**
- 设计模式分类和应用场景
- SOLID 设计原则
- 常见设计模式的实现原理
- 设计模式在实际项目中的应用

**学习路径建议：**
1. 掌握 SOLID 设计原则
2. 熟悉三大类设计模式的特征
3. 深入理解常见设计模式的实现
4. 学习在实际项目中应用设计模式

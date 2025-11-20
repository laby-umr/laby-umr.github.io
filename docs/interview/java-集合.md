#  Java 集合面试题集

>  **总题数**: 26道 |  **重点领域**: List、Map、Set、并发容器 |  **难度分布**: 中级

本文档整理了 Java 集合的完整26道面试题目，涵盖集合框架、数据结构、性能特点等各个方面。

---

##  面试题目列表

### 1. 说说 Java 中 HashMap 的原理？

**答案：**

HashMap是基于哈希表实现的键值对存储结构。

**核心原理：**

**1. 数据结构（JDK 1.8+）**
```
数组 + 链表 + 红黑树

数组：Node<K,V>[] table
链表：解决哈希冲突
红黑树：链表长度>8且数组长度>=64时转换
```

**2. 存储过程**
```java
public V put(K key, V value) {
    // 1. 计算hash值
    int hash = hash(key);
    
    // 2. 计算数组下标：(n-1) & hash
    int index = (table.length - 1) & hash;
    
    // 3. 如果没有冲突，直接放入
    if (table[index] == null) {
        table[index] = new Node(hash, key, value, null);
    }
    // 4. 如果有冲突，遍历链表/红黑树
    else {
        // 链表处理或红黑树处理
    }
    
    // 5. 判断是否需要扩容
    if (++size > threshold) {
        resize();
    }
}
```

**3. 查找过程**
```java
public V get(Object key) {
    // 1. 计算hash
    int hash = hash(key);
    
    // 2. 定位数组位置
    Node<K,V> first = table[(table.length - 1) & hash];
    
    // 3. 遍历链表/红黑树查找
    if (first != null) {
        if (first.hash == hash && key.equals(first.key)) {
            return first.value;
        }
        // 继续查找...
    }
    return null;
}
```

**4. 关键参数**
- 默认初始容量：16
- 默认负载因子：0.75
- 扩容阈值：capacity * loadFactor
- 树化阈值：8（链表转红黑树）
- 退化阈值：6（红黑树转链表）

### 2. 使用 HashMap 时，有哪些提升性能的技巧？

**答案：**

**1. 设置合适的初始容量**
```java
// 不好：默认容量16，需要多次扩容
Map<String, String> map = new HashMap<>();

// 好：预估大小，减少扩容
Map<String, String> map = new HashMap<>(1024);

// 更好：考虑负载因子
int expectedSize = 1000;
Map<String, String> map = new HashMap<>((int)(expectedSize / 0.75) + 1);
```

**2. 选择好的hash算法**
```java
// 重写hashCode方法，减少冲突
@Override
public int hashCode() {
    return Objects.hash(field1, field2, field3);
}
```

**3. 使用不可变对象作key**
```java
// 推荐：使用String、Integer等不可变类
Map<String, User> map = new HashMap<>();

// 不推荐：使用可变对象
Map<MutableKey, User> map = new HashMap<>();
```

**4. 避免在遍历时修改**
```java
// 错误：导致ConcurrentModificationException
for (String key : map.keySet()) {
    map.remove(key);
}

// 正确：使用迭代器
Iterator<String> it = map.keySet().iterator();
while (it.hasNext()) {
    it.next();
    it.remove();
}
```

**5. 并发场景使用ConcurrentHashMap**
```java
// 多线程环境
Map<String, String> map = new ConcurrentHashMap<>();
```

### 3. 什么是 Hash 碰撞？怎么解决哈希碰撞？

**答案：**

**Hash碰撞定义：**
不同的key经过hash计算后得到相同的数组下标。

**解决方法：**

**1. 链地址法（HashMap采用）**
```java
// 数组 + 链表
class Node<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;  // 指向下一个节点
}

// 碰撞后形成链表
[数组] -> [Node1] -> [Node2] -> [Node3]
```

**2. 开放定址法**
```
线性探测：依次查找下一个空位置
index = (hash + i) % capacity

二次探测：使用二次hash函数
index = (hash1 + i * hash2) % capacity
```

**3. 再哈希法**
```
使用多个hash函数，直到找到空位置
```

**4. 建立公共溢出区**
```
所有碰撞的元素放入一个公共区域
```

**HashMap的优化：**
```java
// JDK 1.8优化：链表 -> 红黑树
if (链表长度 > 8 && 数组长度 >= 64) {
    转换为红黑树;  // O(n) -> O(log n)
}

if (红黑树节点 < 6) {
    转换为链表;
}
```

### 4. Java 的 CopyOnWriteArrayList 和 Collections.synchronizedList 有什么区别？分别有什么优缺点？

**答案：**

**实现机制对比：**

| 特性 | CopyOnWriteArrayList | synchronizedList |
|------|---------------------|------------------|
| 同步机制 | 写时复制 | synchronized锁 |
| 读操作 | 无锁 | 需要加锁 |
| 写操作 | 复制整个数组 | 加锁 |
| 迭代器 | 快照，不会抛异常 | 需要手动同步 |
| 适用场景 | 读多写少 | 读写均衡 |

**CopyOnWriteArrayList：**
```java
public class CopyOnWriteArrayList<E> {
    private volatile Object[] array;
    
    // 读操作：无锁
    public E get(int index) {
        return (E) array[index];
    }
    
    // 写操作：复制数组
    public boolean add(E e) {
        synchronized (lock) {
            Object[] newArray = Arrays.copyOf(array, array.length + 1);
            newArray[array.length] = e;
            array = newArray;  // 原子替换
        }
        return true;
    }
    
    // 迭代器：使用快照
    public Iterator<E> iterator() {
        return new COWIterator<>(array, 0);
    }
}

// 优点：
// 1. 读操作完全无锁，性能高
// 2. 迭代器不会ConcurrentModificationException

// 缺点：
// 1. 写操作开销大（复制整个数组）
// 2. 内存占用高
// 3. 数据一致性问题（读到的可能是旧数据）
```

**Collections.synchronizedList：**
```java
public static <T> List<T> synchronizedList(List<T> list) {
    return new SynchronizedList<>(list);
}

static class SynchronizedList<E> {
    final Object mutex;  // 锁对象
    
    // 所有操作都加锁
    public E get(int index) {
        synchronized (mutex) {
            return list.get(index);
        }
    }
    
    public boolean add(E e) {
        synchronized (mutex) {
            return list.add(e);
        }
    }
    
    // 迭代器需要手动同步
    public Iterator<E> iterator() {
        return list.iterator();  // 不安全！
    }
}

// 优点：
// 1. 内存开销小
// 2. 实时性好

// 缺点：
// 1. 读写都需要加锁，性能低
// 2. 迭代器需要手动同步
```

**使用建议：**
```java
// 读多写少：使用CopyOnWriteArrayList
List<String> list = new CopyOnWriteArrayList<>();

// 读写均衡：使用synchronizedList
List<String> list = Collections.synchronizedList(new ArrayList<>());
```

### 5. Java 中有哪些集合类？请简单介绍

**答案：**

**Java集合框架体系：**

```
Collection
├── List（有序，可重复）
│   ├── ArrayList：动态数组
│   ├── LinkedList：双向链表
│   ├── Vector：线程安全的ArrayList
│   └── CopyOnWriteArrayList：写时复制
│
├── Set（无序，不重复）
│   ├── HashSet：基于HashMap
│   ├── LinkedHashSet：有序的HashSet
│   ├── TreeSet：红黑树，有序
│   └── CopyOnWriteArraySet：写时复制
│
└── Queue（队列）
    ├── PriorityQueue：优先级队列
    ├── ArrayDeque：双端队列
    ├── LinkedList：也实现了Deque
    └── BlockingQueue：阻塞队列
        ├── ArrayBlockingQueue
        ├── LinkedBlockingQueue
        └── PriorityBlockingQueue

Map（键值对）
├── HashMap：哈希表
├── LinkedHashMap：有序的HashMap
├── TreeMap：红黑树，有序
├── Hashtable：线程安全，过时
├── ConcurrentHashMap：并发HashMap
├── WeakHashMap：弱引用
└── IdentityHashMap：比较引用
```

**常用集合特点：**

| 集合 | 底层结构 | 线程安全 | 有序性 | 允许null |
|------|---------|---------|---------|----------|
| ArrayList | 数组 | 否 | 有序 | 是 |
| LinkedList | 链表 | 否 | 有序 | 是 |
| Vector | 数组 | 是 | 有序 | 是 |
| HashSet | HashMap | 否 | 无序 | 是 |
| TreeSet | 红黑树 | 否 | 有序 | 否 |
| HashMap | 数组+链表+红黑树 | 否 | 无序 | 是 |
| TreeMap | 红黑树 | 否 | 有序 | 否 |
| ConcurrentHashMap | 数组+链表+红黑树 | 是 | 无序 | 否 |

### 6. Java 数组和链表在 Java 中的区别是什么？

**答案：**

| 特性 | 数组 | 链表 |
|------|------|------|
| 存储方式 | 连续内存 | 离散内存 |
| 随机访问 | O(1) | O(n) |
| 插入/删除 | O(n) | O(1) |
| 内存开销 | 固定 | 额外指针 |
| 缓存友好 | 好 | 差 |
| 大小 | 固定 | 动态 |

**数组：**
```java
// 优点：
// 1. 随机访问快：O(1)
// 2. 内存连续，缓存命中率高
// 3. 空间利用率高

int[] arr = new int[10];
int value = arr[5];  // O(1)

// 缺点：
// 1. 大小固定，不能动态扩展
// 2. 插入/删除需要移动元素：O(n)
// 3. 内存分配需要连续空间
```

**链表：**
```java
// 优点：
// 1. 动态大小，灵活扩展
// 2. 插入/删除快：O(1)
// 3. 不需要连续内存

class Node {
    int data;
    Node next;
}

// 缺点：
// 1. 随机访问慢：O(n)
// 2. 额外的指针开销
// 3. 缓存命中率低
```

**使用场景：**
```java
// 需要频繁随机访问：使用数组
ArrayList<String> list = new ArrayList<>();

// 需要频繁插入/删除：使用链表
LinkedList<String> list = new LinkedList<>();
```

### 7. Java 中的 List 接口有哪些实现类？

**答案：**

**常用实现类：**

**1. ArrayList**
```java
// 基于动态数组
public class ArrayList<E> {
    private Object[] elementData;
    private int size;
}

// 特点：
// - 随机访问快：O(1)
// - 尾部插入快：O(1)
// - 中间插入/删除慢：O(n)
// - 线程不安全
```

**2. LinkedList**
```java
// 基于双向链表
public class LinkedList<E> {
    private Node<E> first;
    private Node<E> last;
    private int size;
}

// 特点：
// - 随机访问慢：O(n)
// - 头尾插入/删除快：O(1)
// - 实现了Deque接口
// - 线程不安全
```

**3. Vector**
```java
// 线程安全的ArrayList
public class Vector<E> {
    protected Object[] elementData;
    
    // 所有方法都加synchronized
    public synchronized boolean add(E e) {
        // ...
    }
}

// 特点：
// - 线程安全
// - 性能低（已过时）
// - 默认扩容2倍
```

**4. CopyOnWriteArrayList**
```java
// 写时复制
public class CopyOnWriteArrayList<E> {
    private volatile Object[] array;
    
    public boolean add(E e) {
        synchronized (lock) {
            Object[] newArray = Arrays.copyOf(array, len + 1);
            newArray[len] = e;
            array = newArray;
        }
    }
}

// 特点：
// - 读操作无锁
// - 写操作复制数组
// - 适合读多写少
```

**对比总结：**

| 实现类 | 底层结构 | 线程安全 | 适用场景 |
|---------|---------|---------|----------|
| ArrayList | 数组 | 否 | 随机访问多 |
| LinkedList | 链表 | 否 | 插入/删除多 |
| Vector | 数组 | 是 | 已过时 |
| CopyOnWriteArrayList | 数组 | 是 | 读多写少 |

### 8. Java 中 ArrayList 和 LinkedList 有什么区别？

**答案：**

**核心区别：**

| 特性 | ArrayList | LinkedList |
|------|-----------|------------|
| 底层结构 | 动态数组 | 双向链表 |
| 随机访问 | O(1) | O(n) |
| 头部插入 | O(n) | O(1) |
| 尾部插入 | O(1) | O(1) |
| 中间插入 | O(n) | O(n) |
| 内存开销 | 较小 | 较大（指针） |
| 缓存友好 | 好 | 差 |

**ArrayList：**
```java
public class ArrayList<E> {
    private Object[] elementData;
    private int size;
    
    // 随机访问：O(1)
    public E get(int index) {
        return (E) elementData[index];
    }
    
    // 尾部添加：O(1)
    public boolean add(E e) {
        elementData[size++] = e;
        return true;
    }
    
    // 中间插入：O(n)
    public void add(int index, E element) {
        System.arraycopy(elementData, index, 
                        elementData, index + 1, size - index);
        elementData[index] = element;
    }
}

// 优点：
// 1. 支持快速随机访问
// 2. 内存连续，缓存命中率高
// 3. 尾部操作效率高

// 缺点：
// 1. 中间插入/删除需要移动元素
// 2. 扩容有开销
```

**LinkedList：**
```java
public class LinkedList<E> {
    private Node<E> first;
    private Node<E> last;
    private int size;
    
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;
    }
    
    // 随机访问：O(n)
    public E get(int index) {
        Node<E> node = first;
        for (int i = 0; i < index; i++) {
            node = node.next;
        }
        return node.item;
    }
    
    // 头部添加：O(1)
    public void addFirst(E e) {
        Node<E> newNode = new Node<>(e, first, null);
        first = newNode;
    }
}

// 优点：
// 1. 头尾插入/删除快
// 2. 不需要扩容
// 3. 实现了Deque接口

// 缺点：
// 1. 随机访问慢
// 2. 额外的指针开销
// 3. 缓存不友好
```

**选择建议：**
```java
// 需要频繁随机访问：使用ArrayList
List<String> list = new ArrayList<>();
String item = list.get(100);  // 快

// 需要频繁头尾插入/删除：使用LinkedList
Deque<String> deque = new LinkedList<>();
deque.addFirst("first");  // 快
deque.addLast("last");    // 快

// 大多数情况：优先选择ArrayList
```

### 9. Java ArrayList 的扩容机制是什么？

**答案：**

**扩容触发条件：**
当元素数量超过当前数组容量时触发扩容。

**扩容过程：**
```java
public class ArrayList<E> {
    private Object[] elementData;
    private int size;
    
    public boolean add(E e) {
        // 1. 检查是否需要扩容
        ensureCapacityInternal(size + 1);
        
        // 2. 添加元素
        elementData[size++] = e;
        return true;
    }
    
    private void ensureCapacityInternal(int minCapacity) {
        if (minCapacity > elementData.length) {
            grow(minCapacity);
        }
    }
    
    private void grow(int minCapacity) {
        int oldCapacity = elementData.length;
        
        // 3. 新容量 = 旧容量 * 1.5
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        
        // 4. 如果还不够，直接使用最小需求
        if (newCapacity < minCapacity) {
            newCapacity = minCapacity;
        }
        
        // 5. 复制数组
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
}
```

**扩容特点：**

**1. 扩容倍数：1.5倍**
```java
// JDK 1.8
newCapacity = oldCapacity + (oldCapacity >> 1);

// 示例：
10 -> 15 -> 22 -> 33 -> 49 -> 73...
```

**2. 初始容量**
```java
// 默认容量：10
private static final int DEFAULT_CAPACITY = 10;

// 第一次add时才初始化（延迟初始化）
ArrayList<String> list = new ArrayList<>();  // 此时容量为0
list.add("first");  // 此时扩容为10
```

**3. 扩容开销**
```java
// 每次扩容都需要：
// 1. 分配新数组
// 2. 复制旧数据
// 3. 替换引用

// 时间复杂度：O(n)
```

**优化建议：**
```java
// 不好：频繁扩容
ArrayList<String> list = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    list.add("item" + i);  // 多次扩容
}

// 好：预估容量
ArrayList<String> list = new ArrayList<>(10000);
for (int i = 0; i < 10000; i++) {
    list.add("item" + i);  // 不需要扩容
}

// 更好：考虑负载因子
int expectedSize = 10000;
ArrayList<String> list = new ArrayList<>((int)(expectedSize / 0.75) + 1);
```

### 10. Java 中的 HashMap 和 Hashtable 有什么区别？

**答案：**

**主要区别：**

| 特性 | HashMap | Hashtable |
|------|---------|----------|
| 线程安全 | 否 | 是 |
| 性能 | 高 | 低 |
| null键 | 允许 | 不允许 |
| null值 | 允许 | 不允许 |
| 初始容量 | 16 | 11 |
| 扩容倍数 | 2倍 | 2倍+1 |
| 迭代器 | fail-fast | Enumeration |
| JDK版本 | 1.2 | 1.0 |
| 推荐使用 | 是 | 否（已过时） |

**HashMap：**
```java
public class HashMap<K,V> {
    // 非线程安全
    public V put(K key, V value) {
        // 允许null键和null值
        if (key == null) {
            return putForNullKey(value);
        }
        // ...
    }
    
    public V get(Object key) {
        if (key == null) {
            return getForNullKey();
        }
        // ...
    }
}

// 特点：
// 1. 非线程安全，性能高
// 2. 允许null键和null值
// 3. JDK 1.8引入红黑树优化
```

**Hashtable：**
```java
public class Hashtable<K,V> {
    // 所有方法都加synchronized
    public synchronized V put(K key, V value) {
        // 不允许null
        if (value == null) {
            throw new NullPointerException();
        }
        // ...
    }
    
    public synchronized V get(Object key) {
        // ...
    }
}

// 特点：
// 1. 线程安全，但性能低
// 2. 不允许null键和null值
// 3. 已过时，不推荐使用
```

**代码对比：**
```java
// HashMap：允许null
Map<String, String> hashMap = new HashMap<>();
hashMap.put(null, "value");   // OK
hashMap.put("key", null);     // OK

// Hashtable：不允许null
Map<String, String> hashtable = new Hashtable<>();
hashtable.put(null, "value"); // NullPointerException
hashtable.put("key", null);   // NullPointerException
```

**替代方案：**
```java
// 单线程：使用HashMap
Map<String, String> map = new HashMap<>();

// 多线程：使用ConcurrentHashMap
Map<String, String> map = new ConcurrentHashMap<>();

// 或者使用Collections.synchronizedMap
Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
```

### 11. Java ConcurrentHashMap 和 Hashtable 的区别是什么？

**答案：**

**核心区别：**

| 特性 | ConcurrentHashMap | Hashtable |
|------|-------------------|-----------|
| 锁机制 | 分段锁/CAS | 全表锁 |
| 并发度 | 高 | 低 |
| 性能 | 高 | 低 |
| null键值 | 不允许 | 不允许 |
| 迭代器 | 弱一致性 | 强一致性 |
| JDK版本 | 1.5 | 1.0 |

**ConcurrentHashMap（JDK 1.8）：**
```java
// 使用CAS + synchronized实现
public class ConcurrentHashMap<K,V> {
    // put操作：只锁定单个桶
    public V put(K key, V value) {
        int hash = spread(key.hashCode());
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f = tabAt(tab, i);
            if (f == null) {
                // CAS插入
                if (casTabAt(tab, i, null, new Node<>(hash, key, value)))
                    break;
            } else {
                // synchronized锁定单个桶
                synchronized (f) {
                    // 插入逻辑
                }
            }
        }
    }
}

// 优点：
// 1. 细粒度锁，并发性能高
// 2. 读操作无锁
// 3. 支持高并发
```

**Hashtable：**
```java
// 所有方法都用synchronized
public class Hashtable<K,V> {
    public synchronized V put(K key, V value) {
        // 锁定整个表
    }
    
    public synchronized V get(Object key) {
        // 锁定整个表
    }
}

// 缺点：
// 1. 粗粒度锁，性能低
// 2. 读写都需要加锁
// 3. 已过时
```

### 12. Java 中的 HashSet 和 HashMap 有什么区别？

**答案：**

**核心关系：HashSet底层就是HashMap**

```java
public class HashSet<E> {
    private HashMap<E, Object> map;
    private static final Object PRESENT = new Object();
    
    public boolean add(E e) {
        return map.put(e, PRESENT) == null;
    }
    
    public boolean contains(Object o) {
        return map.containsKey(o);
    }
}
```

**主要区别：**

| 特性 | HashSet | HashMap |
|------|---------|---------|
| 接口 | Set | Map |
| 存储 | 只存储对象 | 存储键值对 |
| 添加方法 | add(E e) | put(K key, V value) |
| 允许null | 一个null | 一个null键，多个null值 |
| 底层实现 | HashMap | 数组+链表+红黑树 |

**使用场景：**
```java
// HashSet：去重、判断存在
Set<String> set = new HashSet<>();
set.add("apple");
boolean exists = set.contains("apple");

// HashMap：键值映射
Map<String, Integer> map = new HashMap<>();
map.put("apple", 100);
Integer price = map.get("apple");
```

### 13. Java 中 HashMap 的扩容机制是怎样的？

**答案：**

**扩容时机：**
当元素数量 > 容量 * 负载因子时触发扩容。

**扩容过程：**
```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = oldTab.length;
    
    // 1. 计算新容量：2倍
    int newCap = oldCap << 1;
    
    // 2. 创建新数组
    Node<K,V>[] newTab = new Node[newCap];
    
    // 3. 重新hash所有元素
    for (int j = 0; j < oldCap; ++j) {
        Node<K,V> e = oldTab[j];
        if (e != null) {
            if (e.next == null) {
                // 单个节点：直接放入新位置
                newTab[e.hash & (newCap - 1)] = e;
            } else {
                // 链表/红黑树：拆分重新分配
                // 元素要么在原位置，要么在原位置+oldCap
            }
        }
    }
    return newTab;
}
```

**关键点：**
1. 容量翻倍：newCap = oldCap * 2
2. 重新计算位置：index = hash & (newCap - 1)
3. 优化：元素位置只有两种可能
   - 保持原位置
   - 原位置 + oldCap

### 14. Java 为什么 HashMap 在扩容时采用 2 的 n 次方倍？

**答案：**

**原因1：高效的位运算**
```java
// 计算数组下标
// 方式1：取模运算（慢）
index = hash % capacity;

// 方式2：位运算（快）
index = hash & (capacity - 1);

// 当capacity是2的n次方时，两种方式等价
// 例如：capacity = 16 = 2^4
// capacity - 1 = 15 = 0b1111
// hash & 15 等价于 hash % 16
```

**原因2：扩容时元素分布均匀**
```java
// 扩容前：capacity = 16，index = hash & 15
// 扩容后：capacity = 32，index = hash & 31

// 元素新位置只有两种可能：
// 1. 保持原位置（hash的第5位为0）
// 2. 原位置+16（hash的第5位为1）

// 示例：
hash = 0b10101  // 21
旧位置 = 21 & 15 = 0b01111 & 0b10101 = 5
新位置 = 21 & 31 = 0b11111 & 0b10101 = 21
// 新位置 = 旧位置 + 16
```

**原因3：减少hash冲突**
```java
// 2的n次方-1的二进制全是1
16 - 1 = 15 = 0b1111
32 - 1 = 31 = 0b11111

// 与运算时保留更多hash信息
// 减少冲突概率
```

### 15. Java 为什么 HashMap 的默认负载因子是 0.75？

**答案：**

**负载因子定义：**
```java
loadFactor = 元素数量 / 数组容量
threshold = capacity * loadFactor  // 扩容阈值
```

**0.75的权衡：**

**1. 空间与时间的平衡**
```
loadFactor = 0.5：
- 空间利用率低（50%）
- 冲突少，查询快

loadFactor = 1.0：
- 空间利用率高（100%）
- 冲突多，查询慢

loadFactor = 0.75：
- 空间利用率适中（75%）
- 冲突适中，性能较好
```

**2. 泊松分布**
```
根据统计学，当loadFactor=0.75时：
- 单个桶中元素个数超过8的概率小于千万分之一
- 这是红黑树转换阈值的理论依据
```

**3. 实际测试结果**
```java
// JDK注释说明：
// 0.75在时间和空间成本之间提供了良好的权衡
// 更高的值会减少空间开销但增加查找成本
// 更低的值会增加空间开销但减少查找成本
```

### 16. Java 为什么 JDK 1.8 对 HashMap 进行了红黑树的改动？

**答案：**

**改动原因：解决链表过长导致的性能问题**

**JDK 1.7问题：**
```java
// 链表结构
数组[index] -> Node1 -> Node2 -> ... -> NodeN

// 查找时间复杂度：O(n)
// 当链表很长时，性能退化严重
```

**JDK 1.8优化：**
```java
// 当链表长度>8且数组长度>=64时，转为红黑树
if (binCount >= TREEIFY_THRESHOLD - 1) {
    treeifyBin(tab, hash);
}

// 红黑树查找：O(log n)
// 性能提升明显
```

**转换条件：**
```java
// 链表 -> 红黑树
1. 链表长度 > 8
2. 数组长度 >= 64

// 红黑树 -> 链表
1. 节点数 <= 6
```

**为什么是8和6？**
```
- 8：根据泊松分布，链表长度达到8的概率极低
- 6：避免频繁转换（如果用7，可能反复转换）
```

### 17. Java JDK 1.8 对 HashMap 除了红黑树还进行了哪些改动？

**答案：**

**主要改动：**

**1. 数据结构变化**
```java
// JDK 1.7：数组 + 链表
Entry<K,V>[] table;

// JDK 1.8：数组 + 链表 + 红黑树
Node<K,V>[] table;
```

**2. 插入方式改变**
```java
// JDK 1.7：头插法
void addEntry(int hash, K key, V value, int bucketIndex) {
    Entry<K,V> e = table[bucketIndex];
    table[bucketIndex] = new Entry<>(hash, key, value, e);
}
// 问题：并发扩容时可能形成环形链表

// JDK 1.8：尾插法
// 避免了环形链表问题
```

**3. 扩容优化**
```java
// JDK 1.7：重新计算所有元素的hash
for (Entry<K,V> e : table) {
    int index = indexFor(e.hash, newCapacity);
}

// JDK 1.8：元素位置只有两种可能
// 原位置 或 原位置+oldCap
// 不需要重新计算hash
```

**4. hash算法优化**
```java
// JDK 1.7
int hash = hash(key);
int index = indexFor(hash, table.length);

// JDK 1.8：扰动函数简化
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

### 18. Java 中的 LinkedHashMap 是什么？

**答案：**

LinkedHashMap是HashMap的子类，维护了插入顺序或访问顺序。

**实现原理：**
```java
public class LinkedHashMap<K,V> extends HashMap<K,V> {
    // 双向链表头尾节点
    transient LinkedHashMap.Entry<K,V> head;
    transient LinkedHashMap.Entry<K,V> tail;
    
    // 排序模式：true=访问顺序，false=插入顺序
    final boolean accessOrder;
    
    static class Entry<K,V> extends HashMap.Node<K,V> {
        Entry<K,V> before, after;  // 双向链表指针
    }
}
```

**使用示例：**
```java
// 1. 插入顺序（默认）
Map<String, Integer> map = new LinkedHashMap<>();
map.put("a", 1);
map.put("c", 3);
map.put("b", 2);
// 遍历顺序：a, c, b

// 2. 访问顺序（LRU缓存）
Map<String, Integer> lru = new LinkedHashMap<>(16, 0.75f, true);
lru.put("a", 1);
lru.put("b", 2);
lru.get("a");  // a被访问，移到末尾
// 遍历顺序：b, a

// 3. 实现LRU缓存
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

### 19. Java 中的 TreeMap 是什么？

**答案：**

TreeMap是基于红黑树实现的有序Map。

**核心特点：**
```java
public class TreeMap<K,V> extends AbstractMap<K,V> {
    private transient Entry<K,V> root;  // 红黑树根节点
    private final Comparator<? super K> comparator;
    
    static final class Entry<K,V> {
        K key;
        V value;
        Entry<K,V> left;
        Entry<K,V> right;
        Entry<K,V> parent;
        boolean color = BLACK;
    }
}
```

**特性：**
1. 有序：按key自然顺序或自定义顺序
2. 时间复杂度：O(log n)
3. 不允许null key
4. 非线程安全

**使用示例：**
```java
// 1. 自然顺序
TreeMap<Integer, String> map = new TreeMap<>();
map.put(3, "three");
map.put(1, "one");
map.put(2, "two");
// 遍历顺序：1, 2, 3

// 2. 自定义排序
TreeMap<String, Integer> map = new TreeMap<>(
    (a, b) -> b.compareTo(a)  // 降序
);

// 3. 范围查询
map.subMap(1, 5);      // [1, 5)
map.headMap(3);        // < 3
map.tailMap(3);        // >= 3
map.firstKey();        // 最小key
map.lastKey();         // 最大key
```

### 20. Java 中的 IdentityHashMap 是什么？

**答案：**

IdentityHashMap使用==而不是equals()比较key。

**与HashMap的区别：**
```java
// HashMap：使用equals()
Map<String, Integer> hashMap = new HashMap<>();
String s1 = new String("key");
String s2 = new String("key");
hashMap.put(s1, 1);
hashMap.put(s2, 2);
System.out.println(hashMap.size());  // 1（s1.equals(s2)）

// IdentityHashMap：使用==
Map<String, Integer> identityMap = new IdentityHashMap<>();
identityMap.put(s1, 1);
identityMap.put(s2, 2);
System.out.println(identityMap.size());  // 2（s1 != s2）
```

**实现原理：**
```java
public class IdentityHashMap<K,V> {
    // 使用System.identityHashCode()
    private static int hash(Object x) {
        return System.identityHashCode(x);
    }
    
    // 使用==比较
    private static boolean eq(Object x, Object y) {
        return x == y;
    }
}
```

**使用场景：**
```java
// 1. 对象图遍历（避免循环引用）
Set<Object> visited = Collections.newSetFromMap(
    new IdentityHashMap<>()
);

// 2. 代理对象映射
Map<Object, ProxyInfo> proxyMap = new IdentityHashMap<>();

// 3. 序列化/反序列化
```

### 21. Java 中的 WeakHashMap 是什么？

**答案：**

WeakHashMap的key是弱引用，当key没有强引用时会被GC回收。

**实现原理：**
```java
public class WeakHashMap<K,V> {
    private Entry<K,V>[] table;
    private final ReferenceQueue<Object> queue = new ReferenceQueue<>();
    
    private static class Entry<K,V> extends WeakReference<Object> {
        V value;
        int hash;
        Entry<K,V> next;
        
        Entry(Object key, V value, ReferenceQueue<Object> queue) {
            super(key, queue);  // key是弱引用
            this.value = value;
        }
    }
}
```

**使用示例：**
```java
// 普通HashMap：key不会被回收
Map<Object, String> map = new HashMap<>();
Object key = new Object();
map.put(key, "value");
key = null;
System.gc();
System.out.println(map.size());  // 1（key仍在map中）

// WeakHashMap：key会被回收
Map<Object, String> weakMap = new WeakHashMap<>();
Object weakKey = new Object();
weakMap.put(weakKey, "value");
weakKey = null;
System.gc();
System.out.println(weakMap.size());  // 0（key被回收）
```

**使用场景：**
- 缓存实现
- 监听器注册
- 避免内存泄漏

### 22. Java 中 ConcurrentHashMap 1.7 和 1.8 之间有哪些区别？

**答案：**

| 特性 | JDK 1.7 | JDK 1.8 |
|------|---------|---------|
| 数据结构 | Segment数组 + HashEntry数组 | Node数组 + 链表 + 红黑树 |
| 锁机制 | 分段锁（Segment继承ReentrantLock） | CAS + synchronized |
| 锁粒度 | 锁整个Segment | 锁单个Node |
| 并发度 | Segment数量（默认16） | Node数量 |
| 查询操作 | 需要加锁 | 无锁（volatile） |

**JDK 1.7实现：**
```java
public class ConcurrentHashMap<K,V> {
    final Segment<K,V>[] segments;
    
    static final class Segment<K,V> extends ReentrantLock {
        transient volatile HashEntry<K,V>[] table;
        
        V put(K key, int hash, V value) {
            lock();  // 锁定整个Segment
            try {
                // 插入逻辑
            } finally {
                unlock();
            }
        }
    }
}
```

**JDK 1.8实现：**
```java
public class ConcurrentHashMap<K,V> {
    transient volatile Node<K,V>[] table;
    
    public V put(K key, V value) {
        int hash = spread(key.hashCode());
        for (Node<K,V>[] tab = table;;) {
            if ((f = tabAt(tab, i)) == null) {
                // CAS插入
                if (casTabAt(tab, i, null, new Node<>(hash, key, value)))
                    break;
            } else {
                // synchronized锁定单个桶
                synchronized (f) {
                    // 插入逻辑
                }
            }
        }
    }
}
```

### 23. Java 中 ConcurrentHashMap 的 get 方法是否需要加锁？

**答案：**

**不需要加锁**，使用volatile保证可见性。

**实现原理：**
```java
public class ConcurrentHashMap<K,V> {
    // table用volatile修饰
    transient volatile Node<K,V>[] table;
    
    static class Node<K,V> {
        final int hash;
        final K key;
        volatile V val;      // value用volatile修饰
        volatile Node<K,V> next;  // next用volatile修饰
    }
    
    public V get(Object key) {
        Node<K,V>[] tab;
        Node<K,V> e, p;
        int n, eh;
        K ek;
        int h = spread(key.hashCode());
        
        // 无锁读取
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (e = tabAt(tab, (n - 1) & h)) != null) {
            if ((eh = e.hash) == h) {
                if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                    return e.val;
            }
            // 遍历链表或红黑树
            while ((e = e.next) != null) {
                if (e.hash == h &&
                    ((ek = e.key) == key || (ek != null && key.equals(ek))))
                    return e.val;
            }
        }
        return null;
    }
}
```

**为什么不需要加锁：**
1. table、value、next都用volatile修饰
2. volatile保证可见性和有序性
3. 读操作不会修改数据

### 24. Java 为什么 ConcurrentHashMap 不支持 key 或 value 为 null？

**答案：**

**原因：避免二义性问题**

**问题场景：**
```java
// HashMap允许null
Map<String, String> map = new HashMap<>();
map.put("key", null);

// 情况1：key存在，value为null
String value = map.get("key");  // null

// 情况2：key不存在
String value = map.get("notExist");  // null

// 无法区分这两种情况！
```

**在并发环境下的问题：**
```java
ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();

// 线程1
if (map.containsKey("key")) {
    String value = map.get("key");  // 可能返回null
    // 无法判断是value为null还是被其他线程删除了
}

// 线程2（同时执行）
map.remove("key");
```

**HashMap为什么可以：**
```java
// HashMap是单线程的，可以用containsKey判断
if (map.containsKey("key")) {
    // 确定key存在
    String value = map.get("key");
}
```

**Doug Lea的解释：**
```
在并发环境中，如果允许null值，
你无法判断get()返回null是因为：
1. key不存在
2. key存在但value为null
3. key刚被其他线程删除

这会导致程序逻辑混乱。
```

### 25. Java 中的 CopyOnWriteArrayList 是什么？

**答案：**

CopyOnWriteArrayList是线程安全的List，写时复制整个数组。

**实现原理：**
```java
public class CopyOnWriteArrayList<E> {
    private transient volatile Object[] array;
    final transient ReentrantLock lock = new ReentrantLock();
    
    // 读操作：无锁
    public E get(int index) {
        return (E) array[index];
    }
    
    // 写操作：复制数组
    public boolean add(E e) {
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            // 复制整个数组
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            newElements[len] = e;
            // 原子替换
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
    
    // 迭代器：使用快照
    public Iterator<E> iterator() {
        return new COWIterator<E>(getArray(), 0);
    }
}
```

**特点：**
1. 读操作完全无锁
2. 写操作复制整个数组
3. 迭代器不会抛ConcurrentModificationException
4. 适合读多写少场景

**使用场景：**
```java
// 监听器列表
List<Listener> listeners = new CopyOnWriteArrayList<>();

// 黑名单/白名单
List<String> blacklist = new CopyOnWriteArrayList<>();

// 配置信息
List<Config> configs = new CopyOnWriteArrayList<>();
```

### 26. Java 你遇到过 ConcurrentModificationException 错误吗？它是如何产生的？

**答案：**

**产生原因：**
在迭代集合时，集合被修改了。

**触发场景：**

**1. 单线程场景：**
```java
List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
list.add("c");

// 错误：迭代时删除
for (String item : list) {
    if (item.equals("b")) {
        list.remove(item);  // ConcurrentModificationException
    }
}
```

**2. 多线程场景：**
```java
List<String> list = new ArrayList<>();

// 线程1：迭代
new Thread(() -> {
    for (String item : list) {
        System.out.println(item);
    }
}).start();

// 线程2：修改
new Thread(() -> {
    list.add("new");  // ConcurrentModificationException
}).start();
```

**实现机制：**
```java
public class ArrayList<E> {
    protected transient int modCount = 0;  // 修改计数
    
    private class Itr implements Iterator<E> {
        int expectedModCount = modCount;
        
        public E next() {
            checkForComodification();
            // ...
        }
        
        final void checkForComodification() {
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }
    }
}
```

**解决方案：**

**1. 使用迭代器删除：**
```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String item = it.next();
    if (item.equals("b")) {
        it.remove();  // 正确
    }
}
```

**2. 使用removeIf：**
```java
list.removeIf(item -> item.equals("b"));
```

**3. 使用并发集合：**
```java
List<String> list = new CopyOnWriteArrayList<>();
// 迭代时修改不会抛异常
```

**4. 使用Stream：**
```java
list = list.stream()
    .filter(item -> !item.equals("b"))
    .collect(Collectors.toList());
```

---

## 学习指南

**核心要点：**
- Java 集合框架体系结构
- HashMap 和 ConcurrentHashMap 实现原理
- 集合类的性能特点和使用场景
- 线程安全集合的实现机制

**学习路径建议：**
1. 掌握集合框架的基本结构
2. 深入理解 HashMap 的实现原理
3. 熟悉并发集合的使用
4. 掌握集合类的性能优化

---

##  学习指南

**核心要点：**
- Java 集合框架体系结构
- HashMap 和 ConcurrentHashMap 实现原理
- 集合类的性能特点和使用场景
- 线程安全集合的实现机制

**学习路径建议：**
1. 掌握集合框架的基本结构
2. 深入理解 HashMap 的实现原理
3. 熟悉并发集合的使用
4. 掌握集合类的性能优化

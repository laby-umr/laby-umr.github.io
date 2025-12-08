# Java 序列化面试题

## 概述

Java 序列化是将对象转换为字节流的过程，反序列化则是将字节流转换回对象的过程。

## 常见面试题

### 1. 什么是Java序列化？

Java序列化是指将Java对象转换为字节序列的过程，以便于存储或传输。反序列化则是将字节序列转换回Java对象的过程。

### 2. 如何实现Java序列化？

实现 `Serializable` 接口即可实现序列化功能。

```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private int age;
    // getter and setter methods
}
```

### 3. serialVersionUID的作用是什么？

`serialVersionUID` 用于验证序列化对象的版本一致性。在反序列化时，JVM会比较当前类的serialVersionUID和序列化时的serialVersionUID，如果不一致会抛出 `InvalidClassException`。

## 更多内容待补充...

本文档正在完善中，更多Java序列化相关的面试题和答案将陆续添加。
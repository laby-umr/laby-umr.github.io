#  Java MyBatis 面试题集

>  **总题数**: 17道 |  **重点领域**: ORM、缓存、动态SQL |  **难度分布**: 中级

本文档整理了 Java MyBatis 的完整17道面试题目，涵盖ORM映射、缓存机制、动态SQL等各个方面。

---

##  面试题目列表

### 1. 说说 MyBatis 的缓存机制？

MyBatis 提供了两级缓存机制来提高查询性能：

**一级缓存（本地缓存）**：
- 默认开启，无法关闭
- SqlSession级别的缓存，存储在SqlSession对象中
- 缓存范围：同一个SqlSession中执行的相同SQL查询会被缓存
- 生命周期：随SqlSession的创建和销毁而同时存在

**一级缓存失效情况**：
- 调用SqlSession的clearCache()方法
- 调用SqlSession的commit()、rollback()方法
- 执行INSERT、UPDATE、DELETE操作，会清空与该表相关的一级缓存
- 不同的SqlSession之间缓存数据互不影响

**二级缓存（全局缓存）**：
- 默认未开启，需要手动配置
- Mapper级别的缓存，被同一namespace下的所有SqlSession共享
- 跨SqlSession可用，缓存范围更广

**二级缓存启用步骤**：
1. 在MyBatis配置文件中开启二级缓存：
   ```xml
   <settings>
       <setting name="cacheEnabled" value="true"/>
   </settings>
   ```

2. 在Mapper映射文件中配置缓存：
   ```xml
   <cache
     eviction="LRU"
     flushInterval="60000"
     size="1024"
     readOnly="true"/>
   ```

3. 实体类需要实现Serializable接口

**二级缓存失效情况**：
- 执行INSERT、UPDATE、DELETE操作，会清空与该表相关的二级缓存
- 缓存超过了flushInterval设置的时间
- 缓存容量达到上限时，会按策略（如LRU）淘汰旧数据

**缓存淘汰策略**：
- LRU（最近最少使用）：默认策略，移除最长时间未被使用的缓存
- FIFO（先进先出）：按对象进入缓存的顺序来移除
- SOFT（软引用）：基于垃圾回收器的软引用规则
- WEAK（弱引用）：基于垃圾回收器的弱引用规则

**自定义缓存**：
- MyBatis支持自定义缓存实现，通过实现Cache接口
- 可以集成第三方缓存如EhCache、Redis等

**缓存使用建议**：
- 对查询频率高、变化少的数据使用缓存
- 在多表关联查询中应谨慎使用缓存
- 考虑使用专业缓存框架如Redis替代MyBatis的二级缓存

### 2. 能详细说说 MyBatis 的执行流程吗？

MyBatis的执行流程主要包括以下步骤：

**1. 初始化阶段**：
- 加载MyBatis全局配置文件（mybatis-config.xml）
- 解析配置文件，创建Configuration对象
- 加载Mapper映射文件（*.xml）或注解
- 解析SQL语句，创建MappedStatement对象
- 创建SqlSessionFactory对象

**2. 会话创建阶段**：
- 通过SqlSessionFactory创建SqlSession实例
- SqlSession是MyBatis操作的核心接口，代表一次数据库会话

**3. 数据读写阶段**：
- 用户通过SqlSession调用Mapper接口方法
- MyBatis将方法调用解析为具体的MappedStatement
- 根据具体操作类型选择对应的Executor执行器
- 创建StatementHandler处理SQL语句预编译
- 创建ParameterHandler处理参数映射
- 执行SQL语句
- 通过ResultSetHandler处理结果集映射
- 返回映射后的结果对象

**4. 会话关闭阶段**：
- 提交或回滚事务
- 关闭SqlSession，释放资源

**核心组件**：
1. **Configuration**：保存MyBatis所有配置信息
2. **SqlSessionFactory**：创建SqlSession的工厂
3. **SqlSession**：数据库会话，提供数据库操作接口
4. **Executor**：SQL执行器，负责SQL语句的执行
5. **StatementHandler**：封装JDBC Statement操作
6. **ParameterHandler**：处理SQL参数
7. **ResultSetHandler**：处理结果集映射
8. **TypeHandler**：处理Java类型与JDBC类型之间的映射
9. **MappedStatement**：对应映射文件中的SQL节点

**流程图**：
```
加载配置文件 → 解析配置文件 → 创建Configuration对象 → 创建SqlSessionFactory
    ↓
创建SqlSession → 获取Mapper代理对象 → 执行SQL
    ↓
Executor执行器 → StatementHandler处理语句 → ParameterHandler设置参数
    ↓
执行SQL → ResultSetHandler处理结果集 → 返回结果对象 → 关闭SqlSession
```

**执行过程详解**：
1. 客户端调用Mapper接口方法
2. 根据方法的全限定名找到对应的MappedStatement
3. 通过SqlSession将请求转发给Executor
4. Executor根据具体的SQL类型，调用query、update等方法
5. 创建JDBC Statement对象，设置参数
6. 执行SQL语句，获取结果集
7. 将结果集映射为Java对象
8. 返回处理结果

### 3. MyBatis 与 Hibernate 有哪些不同？

MyBatis和Hibernate都是优秀的ORM框架，但它们在设计理念和使用方式上有显著差异：

**1. 映射方式**：
- **Hibernate**：完全面向对象的映射，开发者无需编写SQL
- **MyBatis**：半自动映射，需要自己编写SQL语句

**2. SQL控制**：
- **Hibernate**：自动生成SQL，开发者很少直接接触SQL
- **MyBatis**：手写SQL，对SQL的控制度高，可优化SQL性能

**3. 学习曲线**：
- **Hibernate**：学习曲线较陡，需要理解复杂的映射概念和缓存机制
- **MyBatis**：学习曲线平缓，熟悉SQL的开发者可以快速上手

**4. 数据库适配**：
- **Hibernate**：通过方言支持多种数据库，可无缝切换数据库
- **MyBatis**：需要针对不同数据库编写不同的SQL

**5. 缓存机制**：
- **Hibernate**：完善的一级、二级缓存机制
- **MyBatis**：简单的一级、二级缓存，但可扩展性强

**6. 开发效率**：
- **Hibernate**：对于简单CRUD操作，开发效率高
- **MyBatis**：需要编写SQL，但对复杂查询控制更灵活

**7. 性能调优**：
- **Hibernate**：性能调优复杂，需要深入理解内部机制
- **MyBatis**：通过优化SQL可直接提升性能，调优相对简单

**8. 适用场景**：
- **Hibernate**：适合ORM映射为主的场景，如领域模型复杂的系统
- **MyBatis**：适合SQL优化要求高的场景，如复杂报表查询、多表关联

**对比表格**：

| 特性 | MyBatis | Hibernate |
|------|---------|-----------|
| 映射方式 | SQL映射 | 对象映射 |
| SQL控制 | 手动编写SQL | 自动生成SQL |
| 学习难度 | 低 | 高 |
| 开发效率 | 手写SQL，效率较低 | 不写SQL，效率高 |
| 灵活性 | 高，可优化SQL | 低，难以优化SQL |
| 数据库移植 | 较差，需改SQL | 较好，通过方言支持 |
| 缓存机制 | 简单 | 完善 |
| 适用场景 | 性能要求高、SQL复杂 | 领域模型复杂 |

**选择建议**：
- 如果项目需要精细控制SQL性能，选择MyBatis
- 如果项目重在对象模型和业务逻辑，选择Hibernate
- 在一些项目中，两者可以结合使用：简单操作用Hibernate，复杂查询用MyBatis

### 4. MyBatis 中 #{} 和 ${} 的区别是什么？

MyBatis中的`#{}`和`${}`都是用于参数替换的符号，但它们有本质上的区别：

**#{}（预编译参数）**：
- 会被预编译为`?`占位符，然后通过PreparedStatement设置参数值
- 可以防止SQL注入攻击
- 自动进行类型转换和值转义
- 对所有数据类型都有效

**${}（文本替换）**：
- 直接替换为参数值，不会被预编译
- 不能防止SQL注入攻击
- 不会自动进行类型转换和转义
- 主要用于动态表名、列名等不能使用预编译的场景

**代码示例**：
```xml
<!-- 使用#{} -->
<select id="getUserById" resultType="User">
    SELECT * FROM user WHERE id = #{id}
</select>
<!-- 编译后的SQL: SELECT * FROM user WHERE id = ? -->

<!-- 使用${} -->
<select id="getUsersByTableName" resultType="User">
    SELECT * FROM ${tableName}
</select>
<!-- 编译后的SQL: SELECT * FROM actual_table_name -->
```

**适用场景**：
- `#{}`：用于SQL语句中的值部分，例如WHERE条件值、INSERT的值等
- `${}`：用于不能使用预编译的部分，如表名、列名、ORDER BY子句等

**安全性对比**：
假设参数值为`1; DROP TABLE users;`：
- 使用`#{}`：`WHERE id = ?`，参数被安全处理为`'1; DROP TABLE users;'`
- 使用`${}`：`WHERE id = 1; DROP TABLE users;`，可能导致删表操作被执行

**性能对比**：
- `#{}`：使用预编译，可以重用预编译的SQL，性能更好
- `${}`：每次都是新SQL，无法使用预编译缓存

**最佳实践**：
1. 默认情况下优先使用`#{}`
2. 只在必须的场景下使用`${}`（如动态表名）
3. 使用`${}`时，必须严格控制参数来源，避免SQL注入
4. 对于用户输入的数据，永远不要使用`${}`直接拼接

### 5. MyBatis 写个 Xml 映射文件，再写个 DAO 接口就能执行，这个原理是什么？

MyBatis通过动态代理机制实现了从DAO接口到XML映射文件的关联执行。主要原理包括：

**1. 接口与映射文件绑定**：
- MyBatis通过namespace将Mapper接口与XML映射文件关联起来
- 接口的全限定名必须与XML的namespace值完全一致
- 接口中的方法名必须与XML中的SQL ID一致
- 接口方法的参数和返回类型必须与SQL语句匹配

**2. 动态代理机制**：
- MyBatis使用JDK动态代理为接口创建代理对象
- 当调用接口方法时，代理对象会拦截调用
- 根据接口的全限定名和方法名查找对应的SQL语句
- 执行SQL并返回结果

**3. 核心代码流程**：
```java
// 1. 创建SqlSessionFactory
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);

// 2. 获取SqlSession
SqlSession session = factory.openSession();

// 3. 获取Mapper接口的代理实现
UserMapper mapper = session.getMapper(UserMapper.class);

// 4. 调用接口方法（实际由动态代理执行）
User user = mapper.getUserById(1);
```

**4. 代理创建过程**：
- 在SqlSession.getMapper()中，调用Configuration.getMapper()
- Configuration委托MapperRegistry.getMapper()处理
- MapperRegistry通过MapperProxyFactory创建代理实例
- 最终使用JDK的Proxy.newProxyInstance()创建代理对象
- 代理对象使用MapperProxy作为InvocationHandler处理调用

**5. 方法调用过程**：
1. 调用接口方法时，进入MapperProxy的invoke()方法
2. 解析方法签名，找到对应的MapperMethod
3. MapperMethod根据方法类型(CRUD)调用SqlSession的相应方法
4. SqlSession通过Executor执行SQL并处理结果
5. 将结果转换为方法的返回类型并返回

**6. 配置示例**：
```java
// 接口定义
public interface UserMapper {
    User getUserById(Integer id);
}
```

```xml
<!-- XML映射文件 -->
<mapper namespace="com.example.UserMapper">
    <select id="getUserById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

**7. 关键约定**：
- namespace必须是接口的全限定名
- id必须是接口方法名
- 参数和返回类型必须匹配
- XML文件一般与接口同名（非强制，但推荐）

**8. 注解替代XML**：
MyBatis也支持使用注解代替XML配置：
```java
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User getUserById(Integer id);
}
```

当使用注解时，无需XML映射文件，但复杂SQL推荐仍使用XML配置。

### 6. MyBatis 动态 sql 有什么用？执行原理？有哪些动态 sql？

**动态SQL的作用**：
- 根据不同条件生成不同的SQL语句
- 避免拼接SQL字符串，提高代码可维护性
- 减少重复SQL编写，提高开发效率
- 实现更灵活的数据库查询

**执行原理**：
1. MyBatis在解析XML时，将动态SQL节点解析为DynamicSqlSource对象
2. DynamicSqlSource包含一系列SqlNode对象（如IfSqlNode、ForEachSqlNode等）
3. 执行时，将参数对象传入DynamicSqlSource
4. 各SqlNode根据参数值判断是否应该被包含在最终SQL中
5. 最终生成完整的SQL语句并执行

**主要的动态SQL标签**：

**1. if**：
条件判断，满足条件时才包含其内容
```xml
<select id="findUsers" resultType="User">
    SELECT * FROM users WHERE 1=1
    <if test="name != null">
        AND name LIKE #{name}
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
</select>
```

**2. choose (when, otherwise)**：
类似Java中的switch语句，实现多条件分支
```xml
<select id="findUsers" resultType="User">
    SELECT * FROM users
    <where>
        <choose>
            <when test="name != null">
                name LIKE #{name}
            </when>
            <when test="email != null">
                email = #{email}
            </when>
            <otherwise>
                status = 'ACTIVE'
            </otherwise>
        </choose>
    </where>
</select>
```

**3. where**：
智能处理WHERE子句，自动添加WHERE关键字，移除多余的AND/OR
```xml
<select id="findUsers" resultType="User">
    SELECT * FROM users
    <where>
        <if test="name != null">
            name LIKE #{name}
        </if>
        <if test="email != null">
            AND email = #{email}
        </if>
    </where>
</select>
```

**4. set**：
用于UPDATE语句，智能处理SET部分，自动添加SET关键字，处理多余的逗号
```xml
<update id="updateUser">
    UPDATE users
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="email != null">email = #{email},</if>
        <if test="age != null">age = #{age},</if>
    </set>
    WHERE id = #{id}
</update>
```

**5. foreach**：
循环遍历集合，生成IN子句或批量插入语句
```xml
<select id="findUsersByIds" resultType="User">
    SELECT * FROM users
    WHERE id IN
    <foreach collection="list" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

**6. trim**：
更灵活的前缀/后缀控制，可自定义添加和去除的内容
```xml
<select id="findUsers" resultType="User">
    SELECT * FROM users
    <trim prefix="WHERE" prefixOverrides="AND|OR">
        <if test="name != null">
            AND name LIKE #{name}
        </if>
        <if test="email != null">
            OR email = #{email}
        </if>
    </trim>
</select>
```

**7. bind**：
创建一个变量并绑定到上下文
```xml
<select id="findUsersByName" resultType="User">
    <bind name="pattern" value="'%' + name + '%'" />
    SELECT * FROM users
    WHERE name LIKE #{pattern}
</select>
```

**动态SQL的注解形式**：
MyBatis也支持在Java注解中使用动态SQL脚本：
```java
@Select({"<script>",
         "SELECT * FROM users",
         "<where>",
         "  <if test='name != null'>name LIKE #{name}</if>",
         "  <if test='email != null'>AND email = #{email}</if>",
         "</where>",
         "</script>"})
List<User> findUsers(@Param("name") String name, @Param("email") String email);
```

**最佳实践**：
1. 复杂SQL使用XML配置，简单SQL可以使用注解
2. 动态SQL中注意参数名称一致性
3. 使用where、set标签简化条件处理
4. 注意动态SQL的可读性和维护性

### 7. Mybatis 如何实现一对一、一对多的关联查询？

MyBatis提供了强大的关联查询功能，可以通过不同的方式实现一对一和一对多的关联：

**一对一关联(association)**有三种主要实现方式：

**1. 嵌套查询（分步查询）**：
使用单独的SQL查询关联对象，通过`select`属性指定
```xml
<!-- 主查询 -->
<select id="getOrder" resultMap="orderResultMap">
    SELECT * FROM orders WHERE id = #{id}
</select>

<!-- 结果映射 -->
<resultMap id="orderResultMap" type="Order">
    <id property="id" column="id" />
    <result property="orderNumber" column="order_number" />
    <!-- 一对一关联，分步查询 -->
    <association property="customer" column="customer_id" 
                 select="getCustomerById" />
</resultMap>

<!-- 关联查询 -->
<select id="getCustomerById" resultType="Customer">
    SELECT * FROM customers WHERE id = #{id}
</select>
```

**2. 嵌套结果（联表查询）**：
使用JOIN联表查询，通过`resultMap`进行映射
```xml
<!-- 联表查询 -->
<select id="getOrder" resultMap="orderResultMap">
    SELECT o.*, c.name as customer_name, c.email as customer_email
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = #{id}
</select>

<!-- 结果映射 -->
<resultMap id="orderResultMap" type="Order">
    <id property="id" column="id" />
    <result property="orderNumber" column="order_number" />
    <!-- 一对一关联，联表映射 -->
    <association property="customer" javaType="Customer">
        <id property="id" column="customer_id" />
        <result property="name" column="customer_name" />
        <result property="email" column="customer_email" />
    </association>
</resultMap>
```

**3. 自动映射**：
当字段名符合驼峰命名规则时，可以使用自动映射（需配置mapUnderscoreToCamelCase=true）
```xml
<select id="getOrder" resultType="Order">
    SELECT o.*, 
           c.id as "customer.id",
           c.name as "customer.name",
           c.email as "customer.email"
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = #{id}
</select>
```

**一对多关联(collection)**也有三种主要实现方式：

**1. 嵌套查询（分步查询）**：
```xml
<!-- 主查询 -->
<select id="getCustomer" resultMap="customerResultMap">
    SELECT * FROM customers WHERE id = #{id}
</select>

<!-- 结果映射 -->
<resultMap id="customerResultMap" type="Customer">
    <id property="id" column="id" />
    <result property="name" column="name" />
    <!-- 一对多关联，分步查询 -->
    <collection property="orders" ofType="Order"
                column="id" select="getOrdersByCustomerId" />
</resultMap>

<!-- 关联查询 -->
<select id="getOrdersByCustomerId" resultType="Order">
    SELECT * FROM orders WHERE customer_id = #{id}
</select>
```

**2. 嵌套结果（联表查询）**：
```xml
<!-- 联表查询 -->
<select id="getCustomer" resultMap="customerResultMap">
    SELECT c.*, o.id as order_id, o.order_number, o.order_date
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE c.id = #{id}
</select>

<!-- 结果映射 -->
<resultMap id="customerResultMap" type="Customer">
    <id property="id" column="id" />
    <result property="name" column="name" />
    <!-- 一对多关联，联表映射 -->
    <collection property="orders" ofType="Order">
        <id property="id" column="order_id" />
        <result property="orderNumber" column="order_number" />
        <result property="orderDate" column="order_date" />
    </collection>
</resultMap>
```

**3. 延迟加载**：
可以通过配置lazyLoadingEnabled来控制是否延迟加载关联对象
```xml
<!-- 全局配置 -->
<settings>
    <setting name="lazyLoadingEnabled" value="true" />
    <setting name="aggressiveLazyLoading" value="false" />
</settings>

<!-- 结果映射 -->
<resultMap id="customerResultMap" type="Customer">
    <id property="id" column="id" />
    <result property="name" column="name" />
    <!-- fetchType可以覆盖全局延迟加载配置 -->
    <collection property="orders" ofType="Order"
                column="id" select="getOrdersByCustomerId" 
                fetchType="lazy" />
</resultMap>
```

**多对多关系**可以通过两个一对多关系来实现：
```xml
<!-- 查询用户及其角色 -->
<select id="getUserWithRoles" resultMap="userWithRolesMap">
    SELECT u.*, r.id as role_id, r.role_name
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = #{id}
</select>

<!-- 结果映射 -->
<resultMap id="userWithRolesMap" type="User">
    <id property="id" column="id" />
    <result property="username" column="username" />
    <collection property="roles" ofType="Role">
        <id property="id" column="role_id" />
        <result property="roleName" column="role_name" />
    </collection>
</resultMap>
```

**关联查询最佳实践**：
1. 小数据量时使用联表查询，大数据量时考虑分步查询
2. 合理设置延迟加载策略，避免N+1问题
3. 灵活使用缓存，提高查询性能
4. 考虑使用ResultMap复用，减少重复配置
5. 根据业务场景选择适合的映射方式

#  MySQL 面试题集

>  **总题数**: 60道 |  **重点领域**: 索引、事务、锁机制 |  **难度分布**: 中高级

本文档整理了 MySQL 数据库的核心面试题目，涵盖索引原理、事务特性、锁机制、性能优化等各个方面。

---

##  面试题目列表

### 1. MySQL的存储引擎有哪些？它们有什么区别？

MySQL支持多种存储引擎，允许针对不同的应用场景选择最适合的存储引擎。主要的存储引擎包括：

**InnoDB**（默认存储引擎）：
- **特点**：
  - 支持事务，遵循ACID特性
  - 支持行级锁，提高并发性能
  - 支持外键约束
  - 实现了四种隔离级别
  - 采用MVCC(多版本并发控制)来支持高并发
  - 使用聚簇索引存储数据
- **适用场景**：
  - 需要事务支持的应用
  - 需要外键约束的应用
  - 高并发、数据一致性要求高的场景

**MyISAM**：
- **特点**：
  - 不支持事务
  - 表级锁定，并发性能较差
  - 不支持外键
  - 更简单的表结构
  - 拥有较高的插入和查询速度
  - 支持全文索引
- **适用场景**：
  - 读密集型应用（如Web应用的只读数据）
  - 需要全文索引的应用
  - 不需要事务支持的简单应用

**Memory**（HEAP）：
- **特点**：
  - 数据存储在内存中，速度极快
  - 重启后数据丢失
  - 表级锁
  - 不支持BLOB和TEXT类型
- **适用场景**：
  - 临时表和中间结果的存储
  - 需要快速访问且无需持久化的数据

**Archive**：
- **特点**：
  - 高度压缩存储
  - 只支持INSERT和SELECT操作
  - 不支持索引（除主键外）
- **适用场景**：
  - 日志和历史数据归档
  - 需要高压缩率的数据

**CSV**：
- **特点**：
  - 以CSV格式存储数据
  - 数据可直接被电子表格软件读取
- **适用场景**：
  - 数据导入导出
  - 与其他应用程序交换数据

**Blackhole**：
- **特点**：
  - 接收数据但不存储
  - 可用于主从复制或日志收集
- **适用场景**：
  - 主从复制中的中继
  - 数据丢弃但需记录binlog

**Federated**：
- **特点**：
  - 访问远程MySQL服务器上的表
  - 本地不存储数据
- **适用场景**：
  - 分布式数据库环境
  - 多数据库整合

**NDB Cluster**：
- **特点**：
  - 分布式存储引擎
  - 高可用性和可扩展性
- **适用场景**：
  - 高可用性集群环境

**对比表**：

| 特性 | InnoDB | MyISAM | Memory | Archive |
|------|--------|--------|--------|---------|
| 事务支持 | 是 | 否 | 否 | 否 |
| 锁粒度 | 行级锁 | 表级锁 | 表级锁 | 行级锁 |
| 外键支持 | 是 | 否 | 否 | 否 |
| 全文索引 | 支持(5.6+) | 支持 | 否 | 否 |
| 存储限制 | 64TB | 文件系统限制 | 内存大小 | 无 |
| 数据存储 | 聚簇索引 | 独立表 | 内存 | 压缩存储 |
| 性能优势 | 高并发写 | 高速读 | 极速查询 | 高压缩率 |
| B树索引 | 支持 | 支持 | 支持 | 不支持 |
| 哈希索引 | 自适应 | 不支持 | 支持 | 不支持 |

**如何选择存储引擎**：
1. **需要事务和外键**：使用InnoDB
2. **只读或读多写少**：考虑MyISAM
3. **临时数据，速度优先**：Memory
4. **归档数据，压缩优先**：Archive

**查看和修改存储引擎**：
```sql
-- 查看支持的存储引擎
SHOW ENGINES;

-- 查看表的存储引擎
SHOW TABLE STATUS WHERE Name = 'table_name';

-- 创建表时指定存储引擎
CREATE TABLE mytable (id INT) ENGINE = InnoDB;

-- 修改表的存储引擎
ALTER TABLE mytable ENGINE = MyISAM;
```

### 2. MySQL中的索引类型有哪些？如何选择合适的索引？

MySQL中的索引是提高查询效率的关键机制，根据不同的需求和数据特点，可以选择不同类型的索引。

**主要索引类型**：

**1. 按数据结构分类**：
- **B+树索引**：
  - MySQL中最常用的索引类型
  - InnoDB和MyISAM默认使用
  - 多路平衡查找树，叶节点存储数据
  - 适合范围查询和排序

- **哈希索引**：
  - 基于哈希表实现，只有精确匹配才有效
  - Memory存储引擎默认使用
  - InnoDB支持自适应哈希索引
  - 等值查询性能极高，但不支持范围查询和排序

- **R树索引**：
  - 用于空间数据索引（如地理信息）
  - MyISAM支持空间索引
  - 适用于多维数据的范围查询

- **全文索引**：
  - 用于全文搜索
  - MyISAM和InnoDB(5.6+)支持
  - 适用于文本内容的模糊查询

**2. 按物理实现分类**：
- **聚簇索引(Clustered Index)**：
  - 索引和数据存储在一起
  - 每个表只能有一个（通常是主键）
  - InnoDB默认使用
  - 通过主键访问数据非常快

- **非聚簇索引(Non-Clustered Index)**：
  - 索引和数据分开存储
  - 可以创建多个
  - 查询需要额外的回表操作

**3. 按索引列数分类**：
- **单列索引**：
  - 只包含一个列的索引
  - 适合单列查询条件

- **联合索引/复合索引**：
  - 包含多个列的索引
  - 遵循最左前缀原则
  - 适合多条件查询和覆盖索引查询

**4. 按应用场景分类**：
- **普通索引**：
  - 基本索引类型，无特殊限制

- **唯一索引**：
  - 要求索引列值唯一
  - 可以包含NULL值(MySQL中NULL不等于NULL)

- **主键索引**：
  - 特殊的唯一索引，不允许NULL
  - 用于唯一标识表中的记录

- **前缀索引**：
  - 对字符串列的前几个字符建立索引
  - 减少索引空间占用

- **覆盖索引**：
  - 查询的列都包含在索引中，无需回表
  - 可显著提高查询效率

**选择合适索引的原则**：

**1. 列的选择**：
- 在WHERE、JOIN、ORDER BY、GROUP BY子句中频繁出现的列
- 区分度高（基数大）的列优先
- 更新频率低的列优先
- 尽量选择数据类型较小的列

**2. 索引类型选择**：
- **等值查询多**：考虑哈希索引或B+树
- **范围查询多**：使用B+树索引
- **文本搜索**：使用全文索引
- **多条件查询**：考虑复合索引
- **唯一性约束**：使用唯一索引或主键

**3. 复合索引设计**：
- 把区分度高的列放在前面
- 考虑查询条件的顺序
- 遵循最左前缀原则

**4. 索引优化策略**：
- **覆盖索引**：尽量使用索引覆盖查询
- **索引下推**：利用索引过滤更多数据
- **前缀索引**：对长字符串使用前缀索引
- **避免过度索引**：索引会占用空间并影响写性能

**5. 常见索引陷阱**：
- 在低基数列上建立索引可能无效
- 索引列上使用函数会导致索引失效
- 隐式类型转换会导致索引失效
- Like以通配符开头会导致索引失效
- Or条件可能导致索引失效

**实际应用示例**：
```sql
-- 创建普通索引
CREATE INDEX idx_name ON users(name);

-- 创建唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 创建复合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 创建前缀索引
CREATE INDEX idx_address ON users(address(10));

-- 创建全文索引
CREATE FULLTEXT INDEX idx_content ON articles(content);

-- 分析索引使用情况
EXPLAIN SELECT * FROM users WHERE name = 'John' AND age > 20;
```

### 3. 什么是回表查询？什么是覆盖索引？

**回表查询**和**覆盖索引**是理解MySQL索引使用效率的两个重要概念，它们与查询执行过程和性能息息相关。

**回表查询**：

**定义**：
回表查询是指在使用非聚簇索引(也称为二级索引或辅助索引)进行查询时，需要先通过索引找到对应的主键值，然后再根据主键值到聚簇索引中查找完整的行数据的过程。

**产生原因**：
- 在InnoDB存储引擎中，非聚簇索引的叶子节点存储的是该索引列的值和对应的主键值
- 而不是完整的行数据(这点与聚簇索引不同)
- 因此需要额外的步骤"回表"查找完整数据

**工作流程**：
1. 通过非聚簇索引定位到对应的叶子节点，获取主键值
2. 使用获取到的主键值在聚簇索引中进行第二次查找
3. 从聚簇索引中获取完整的行数据

**示例**：
```sql
-- 假设在name列上有索引，id是主键
SELECT * FROM users WHERE name = 'John';
```

执行过程：
1. 通过name索引找到'John'对应的记录，获取主键id值(例如id=10)
2. 再通过主键索引查找id=10的完整行数据
3. 这个过程就是"回表"

**性能影响**：
- 回表会增加额外的IO操作
- 大量回表操作会显著降低查询效率
- 特别是在数据量大的表上更为明显

**覆盖索引**：

**定义**：
覆盖索引是指查询的所有列都包含在索引中，数据库可以直接从索引中获取所需数据，而无需回表查询的情况。

**工作原理**：
- 当索引包含查询所需的所有列时，可以直接从索引获取数据
- MySQL可以在查询执行计划中通过"Using index"标识覆盖索引的使用

**示例**：
```sql
-- 假设有一个联合索引(name, age)
SELECT name, age FROM users WHERE name = 'John';
```

执行过程：
1. 通过name索引找到'John'对应的记录
2. 由于索引中已包含name和age列，直接返回结果
3. 无需回表查询

**覆盖索引的优势**：
- 减少IO操作，避免回表
- 索引通常比表数据更小，可以减少数据扫描量
- 提高缓存效率，更多索引可以加载到内存
- 显著提升查询性能

**如何实现覆盖索引**：
1. 创建包含查询所需所有列的联合索引
2. 调整查询，只选择索引中包含的列
3. 合理设计索引以支持频繁查询

```sql
-- 创建覆盖常见查询需求的索引
CREATE INDEX idx_name_age_email ON users(name, age, email);

-- 现在可以覆盖以下查询
SELECT name, age, email FROM users WHERE name = 'John';
```

**两者对比**：

| 特性 | 回表查询 | 覆盖索引 |
|------|---------|---------|
| IO次数 | 至少两次(索引+数据) | 一次(仅索引) |
| 性能 | 较慢 | 较快 |
| 索引设计 | 普通单列索引足够 | 需要精心设计包含所需列 |
| 内存占用 | 索引较小 | 索引可能较大 |
| 适用场景 | 通用查询 | 针对特定查询优化 |
| EXPLAIN特征 | NULL(ref列) | Using index |

**实际应用中的优化策略**：
1. 识别频繁查询的列组合，为其创建覆盖索引
2. 避免使用SELECT *，只查询必要的列
3. 合理使用联合索引以支持更多的覆盖查询
4. 针对大表和高频查询优先考虑覆盖索引优化

### 4. MySQL的事务特性（ACID）是什么？

**MySQL事务的ACID特性**是关系数据库管理系统保证数据完整性和可靠性的基础。ACID是四个特性的首字母缩写：原子性(Atomicity)、一致性(Consistency)、隔离性(Isolation)和持久性(Durability)。InnoDB存储引擎完全支持ACID特性，而MyISAM等非事务存储引擎则不支持。

**1. 原子性(Atomicity)**：

**定义**：
事务是不可分割的工作单位，事务中的操作要么全部完成，要么全部不执行。

**实现机制**：
- 基于**重做日志(redo log)**和**回滚日志(undo log)**
- 操作执行前，先写入回滚日志，记录修改前的数据
- 如果事务失败，使用回滚日志恢复到事务开始前的状态

**示例**：
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
COMMIT;  -- 两个更新操作同时成功

-- 或者
ROLLBACK;  -- 两个更新操作都不执行
```

**2. 一致性(Consistency)**：

**定义**：
事务执行前后，数据库从一个一致性状态转变为另一个一致性状态，不会破坏数据库的完整性约束。

**实现机制**：
- 通过**完整性约束**（如主键、外键、唯一性约束）
- 通过**触发器**和**存储过程**中的业务逻辑
- 应用程序层面的业务规则

**示例**：
```sql
-- 银行转账保持总金额不变
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;
COMMIT;  -- 总金额保持不变，一致性得到保障
```

**3. 隔离性(Isolation)**：

**定义**：
多个事务并发执行时，一个事务的执行不应该被其他事务干扰，就像它们是串行执行一样。

**实现机制**：
- 通过**锁机制**和**MVCC(多版本并发控制)**实现
- 不同的隔离级别提供不同程度的隔离性
  - READ UNCOMMITTED（读未提交）
  - READ COMMITTED（读已提交）
  - REPEATABLE READ（可重复读，InnoDB默认）
  - SERIALIZABLE（串行化）

**示例**：
```sql
-- 设置事务隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 事务A
START TRANSACTION;
SELECT * FROM accounts WHERE user_id = 1;  -- 读取时不受其他事务影响
-- 中间其他事务可能修改了数据
SELECT * FROM accounts WHERE user_id = 1;  -- 在可重复读级别下，读到的数据与第一次相同
COMMIT;
```

**4. 持久性(Durability)**：

**定义**：
一旦事务提交，其所做的修改就会永久保存在数据库中，即使系统崩溃也不会丢失。

**实现机制**：
- 通过**重做日志(redo log)**实现
- 事务提交时，确保所有修改都已写入重做日志
- 系统崩溃后，通过重做日志恢复未写入磁盘的数据

**示例**：
```sql
START TRANSACTION;
UPDATE important_data SET value = 'new_value' WHERE id = 1;
COMMIT;  -- 数据永久保存，即使立即发生服务器崩溃
```

**MySQL InnoDB的ACID实现机制**：

**1. 原子性和持久性实现**：
- **重做日志(redo log)**：记录事务修改的页面数据，用于恢复已提交事务的数据
- **回滚段(undo log)**：记录数据被修改前的值，用于回滚未提交的事务
- **两阶段提交**：先写重做日志，再修改数据页
- **组提交**：多个事务的日志一起刷入磁盘，提高性能

**2. 一致性实现**：
- **强制约束**：主键、外键、唯一性约束等
- **回滚机制**：当违反约束时回滚事务
- **崩溃恢复**：服务器崩溃后自动恢复到一致状态

**3. 隔离性实现**：
- **锁机制**：表锁、行锁、意向锁、间隙锁等
- **MVCC**：通过回滚段实现的多版本并发控制
- **事务ID和版本号**：每个事务有唯一ID，每次修改生成新版本
- **一致性读视图**：事务开始时确定可见的版本范围

**事务相关配置**：
```sql
-- 查看当前会话隔离级别
SELECT @@transaction_isolation;

-- 查看自动提交状态
SELECT @@autocommit;

-- 设置自动提交
SET autocommit = 1;  -- 开启
SET autocommit = 0;  -- 关闭

-- 手动控制事务
START TRANSACTION;
-- 执行SQL语句
COMMIT;  -- 或 ROLLBACK;
```

**事务的性能影响**：
- 更高的隔离级别通常意味着更低的并发性能
- 事务日志会增加I/O操作
- 长事务会占用系统资源，应避免
- 合理设置隔离级别可以平衡一致性和性能

### 5. MySQL的四种隔离级别是什么？分别会产生什么问题？

**MySQL的四种事务隔离级别**定义了在多个事务并发执行时，一个事务的操作对其他事务的可见程度。不同的隔离级别解决了不同的并发问题，但也带来了性能和功能上的权衡。

**1. 读未提交(READ UNCOMMITTED)**：

**定义**：
一个事务可以读取另一个未提交事务的数据。

**特点**：
- 最低的隔离级别，提供最高的并发性
- 不使用锁机制，不阻塞其他事务
- 可能读取到其他事务未提交的"脏"数据

**存在的问题**：
- **脏读(Dirty Read)**：事务A读取了事务B修改但未提交的数据，如果事务B回滚，则事务A读取的数据是无效的
- **不可重复读(Non-repeatable Read)**：同一事务内，多次读取同一数据返回的结果不同
- **幻读(Phantom Read)**：同一事务内，同样的查询条件返回不同的结果集

**示例**：
```sql
-- 会话1
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
-- 此时会看到会话2未提交的修改
SELECT * FROM accounts WHERE id = 1;
COMMIT;

-- 会话2
START TRANSACTION;
UPDATE accounts SET balance = 2000 WHERE id = 1;
-- 此时还未提交
```

**2. 读已提交(READ COMMITTED)**：

**定义**：
一个事务只能读取另一个已提交事务的数据。

**特点**：
- 使用行级锁和MVCC机制
- 每次查询都生成一个新的快照
- 只能读取到已提交的数据，解决了脏读问题
- 大多数数据库的默认隔离级别(但不是MySQL InnoDB)

**存在的问题**：
- **不可重复读(Non-repeatable Read)**：同一事务内，多次读取同一数据返回的结果不同
- **幻读(Phantom Read)**：同一事务内，同样的查询条件返回不同的结果集

**示例**：
```sql
-- 会话1
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT * FROM accounts WHERE id = 1;  -- balance=1000
-- 会话2执行更新并提交后
SELECT * FROM accounts WHERE id = 1;  -- balance=2000，出现不可重复读
COMMIT;

-- 会话2
START TRANSACTION;
UPDATE accounts SET balance = 2000 WHERE id = 1;
COMMIT;  -- 提交事务
```

**3. 可重复读(REPEATABLE READ)**：

**定义**：
一个事务执行过程中看到的数据始终是一致的，无论其他事务对数据做了什么修改。

**特点**：
- MySQL InnoDB的默认隔离级别
- 使用行级锁和MVCC机制
- 事务开始时创建一个快照，整个事务期间都使用该快照
- 解决了脏读和不可重复读问题

**存在的问题**：
- **幻读(Phantom Read)**：理论上会存在，但InnoDB通过间隙锁(Gap Lock)解决了大部分幻读问题
- 间隙锁可能导致死锁几率增加

**示例**：
```sql
-- 会话1
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT * FROM accounts WHERE id = 1;  -- balance=1000
-- 会话2执行更新并提交后
SELECT * FROM accounts WHERE id = 1;  -- balance仍为1000，解决了不可重复读
COMMIT;

-- 会话2
START TRANSACTION;
UPDATE accounts SET balance = 2000 WHERE id = 1;
COMMIT;
```

**4. 串行化(SERIALIZABLE)**：

**定义**：
最高的隔离级别，强制事务串行执行，就像它们是一个接一个执行的一样。

**特点**：
- 使用表级读写锁或行级锁
- 读取数据时加共享锁，其他事务无法修改这些数据
- 写入数据时加排他锁，其他事务无法读取或修改这些数据
- 可能导致大量阻塞和超时
- 解决了所有并发问题

**解决的问题**：
- 完全解决了脏读、不可重复读和幻读问题

**示例**：
```sql
-- 会话1
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
SELECT * FROM accounts WHERE balance > 1000;  -- 会对符合条件的行加锁
-- 此时会话2无法插入新符合条件的记录，避免了幻读
COMMIT;

-- 会话2
START TRANSACTION;
INSERT INTO accounts VALUES(3, 'User3', 1500);  -- 会被阻塞直到会话1提交或超时
COMMIT;
```

**四种隔离级别对比**：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 锁机制 | 性能 |
|---------|------|-----------|-----|--------|-----|
| 读未提交 | 可能 | 可能 | 可能 | 最少 | 最高 |
| 读已提交 | 避免 | 可能 | 可能 | 较少 | 高 |
| 可重复读 | 避免 | 避免 | 基本避免* | 较多 | 中等 |
| 串行化 | 避免 | 避免 | 避免 | 最多 | 最低 |

*注：InnoDB在可重复读级别下使用间隙锁解决了大部分幻读问题

**MySQL中查看和设置隔离级别**：
```sql
-- 查看全局隔离级别
SELECT @@GLOBAL.transaction_isolation;

-- 查看当前会话隔离级别
SELECT @@SESSION.transaction_isolation;

-- 设置全局隔离级别
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 设置当前会话隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

**实际应用中的选择**：
- **读未提交**：几乎不使用，除非对数据一致性没有要求
- **读已提交**：适合大多数Web应用，减少锁竞争
- **可重复读**：适合对数据一致性要求较高的场景，如金融系统
- **串行化**：只适用于事务量极低但对一致性要求极高的场景

**InnoDB特殊处理**：
- InnoDB在可重复读隔离级别下，通过Next-Key Lock(记录锁+间隙锁)解决了大部分幻读问题
- 这使得InnoDB的可重复读隔离级别比标准SQL规范中的定义更为严格

### 6. 什么是MVCC？它是如何工作的？

**MVCC(Multi-Version Concurrency Control，多版本并发控制)**是InnoDB实现高并发的核心机制，它通过保存数据的多个版本来实现读写不阻塞。

**核心概念**：

**1. 版本链**：
- 每行数据都有两个隐藏列：`DB_TRX_ID`(事务ID)和`DB_ROLL_PTR`(回滚指针)
- `DB_TRX_ID`：记录最后修改该行的事务ID
- `DB_ROLL_PTR`：指向undo log中该行的上一个版本
- 通过回滚指针形成版本链

**2. Read View(读视图)**：
- 事务开始时创建的一致性视图
- 包含当前活跃事务列表
- 决定当前事务能看到哪些版本的数据

**工作原理**：

```
当前数据行：
id | name | age | DB_TRX_ID | DB_ROLL_PTR
1  | Tom  | 25  | 100       | ptr1

版本链(undo log):
ptr1 -> (name=John, age=20, TRX_ID=80)
     -> (name=Mike, age=18, TRX_ID=60)
```

**Read View判断规则**：
```sql
-- Read View包含：
- m_ids: 当前活跃事务ID列表
- min_trx_id: 最小活跃事务ID
- max_trx_id: 下一个要分配的事务ID
- creator_trx_id: 创建该Read View的事务ID

-- 可见性判断：
1. 如果 DB_TRX_ID < min_trx_id：可见(已提交)
2. 如果 DB_TRX_ID >= max_trx_id：不可见(未来事务)
3. 如果 min_trx_id <= DB_TRX_ID < max_trx_id：
   - 如果 DB_TRX_ID 在 m_ids 中：不可见(未提交)
   - 否则：可见(已提交)
```

**不同隔离级别的MVCC实现**：

**READ COMMITTED**：
- 每次查询都创建新的Read View
- 能读到其他事务已提交的修改

**REPEATABLE READ**：
- 事务开始时创建Read View，整个事务期间使用同一个
- 保证可重复读

**示例**：
```sql
-- 事务A (TRX_ID=100)
START TRANSACTION;
SELECT * FROM users WHERE id = 1;  -- age=20

-- 事务B (TRX_ID=101)
START TRANSACTION;
UPDATE users SET age = 25 WHERE id = 1;
COMMIT;

-- 事务A继续
SELECT * FROM users WHERE id = 1;  
-- RC级别：age=25 (看到新版本)
-- RR级别：age=20 (看到旧版本)
```

**MVCC的优势**：
1. 读不加锁，写不阻塞读
2. 提高并发性能
3. 实现一致性非锁定读

**MVCC的局限**：
1. 只在RC和RR隔离级别下工作
2. 不能完全避免幻读(需要配合间隙锁)
3. undo log可能占用大量空间

### 7. MySQL中的锁有哪些类型？

**MySQL的锁机制**用于控制并发访问，保证数据一致性。根据不同的分类维度，MySQL有多种锁类型。

**按锁粒度分类**：

**1. 表级锁(Table Lock)**：
- 锁定整张表
- 开销小，加锁快
- 锁粒度大，并发度低
- MyISAM默认使用

```sql
-- 手动加表锁
LOCK TABLES users READ;   -- 读锁
LOCK TABLES users WRITE;  -- 写锁
UNLOCK TABLES;
```

**2. 行级锁(Row Lock)**：
- 锁定单行数据
- 开销大，加锁慢
- 锁粒度小，并发度高
- InnoDB默认使用

**3. 页级锁(Page Lock)**：
- 锁定数据页
- 介于表锁和行锁之间
- BDB存储引擎使用

**按锁类型分类**：

**1. 共享锁(S Lock，读锁)**：
- 允许多个事务同时读取
- 阻止其他事务写入

```sql
SELECT * FROM users WHERE id = 1 LOCK IN SHARE MODE;
```

**2. 排他锁(X Lock，写锁)**：
- 阻止其他事务读取和写入
- 只有持锁事务可以访问

```sql
SELECT * FROM users WHERE id = 1 FOR UPDATE;
```

**InnoDB特有锁**：

**1. 记录锁(Record Lock)**：
- 锁定索引记录
- 防止其他事务修改该行

**2. 间隙锁(Gap Lock)**：
- 锁定索引记录之间的间隙
- 防止其他事务插入数据
- 解决幻读问题

**3. Next-Key Lock**：
- 记录锁 + 间隙锁
- 锁定记录及其前面的间隙
- RR隔离级别默认使用

```sql
-- 假设id有索引，值为1,5,10
SELECT * FROM users WHERE id > 5 FOR UPDATE;
-- 锁定：(5,10]和(10,+∞)
```

**4. 插入意向锁(Insert Intention Lock)**：
- 插入前获取的特殊间隙锁
- 多个事务可以同时持有不同位置的插入意向锁

**5. 自增锁(AUTO-INC Lock)**：
- 用于自增列
- 保证自增值的连续性

**按锁模式分类**：

**1. 意向锁(Intention Lock)**：
- 表级锁，用于协调表锁和行锁
- **意向共享锁(IS)**：事务想获取行的共享锁
- **意向排他锁(IX)**：事务想获取行的排他锁

**锁兼容性矩阵**：

|  | X | IX | S | IS |
|--|---|----|----|-----|
| X | ✗ | ✗ | ✗ | ✗ |
| IX | ✗ | ✓ | ✗ | ✓ |
| S | ✗ | ✗ | ✓ | ✓ |
| IS | ✗ | ✓ | ✓ | ✓ |

**查看锁信息**：
```sql
-- 查看当前锁
SHOW ENGINE INNODB STATUS;

-- 查看锁等待
SELECT * FROM information_schema.INNODB_LOCKS;

-- 查看锁等待关系
SELECT * FROM information_schema.INNODB_LOCK_WAITS;
```

### 8. 什么是死锁？如何避免死锁？

**死锁**是指两个或多个事务互相持有对方需要的锁，导致所有事务都无法继续执行的情况。

**死锁示例**：
```sql
-- 事务A
START TRANSACTION;
UPDATE users SET name='A' WHERE id=1;  -- 获取id=1的锁
-- 等待获取id=2的锁
UPDATE users SET name='A' WHERE id=2;

-- 事务B
START TRANSACTION;
UPDATE users SET name='B' WHERE id=2;  -- 获取id=2的锁
-- 等待获取id=1的锁
UPDATE users SET name='B' WHERE id=1;

-- 形成死锁：A等B释放id=2，B等A释放id=1
```

**死锁的四个必要条件**：
1. **互斥**：资源不能被共享
2. **持有并等待**：持有资源的同时等待其他资源
3. **不可剥夺**：资源不能被强制释放
4. **循环等待**：形成资源等待环路

**MySQL的死锁检测**：
- InnoDB自动检测死锁
- 选择回滚代价最小的事务
- 其他事务可以继续执行

**避免死锁的策略**：

**1. 按相同顺序访问资源**：
```sql
-- 好的做法：统一按id升序访问
UPDATE users SET name='X' WHERE id IN (1,2,3) ORDER BY id;

-- 避免：不同事务以不同顺序访问
```

**2. 缩小事务范围**：
```sql
-- 不好：事务时间过长
START TRANSACTION;
SELECT * FROM users;  -- 大量数据
-- 复杂业务逻辑
UPDATE users SET status=1;
COMMIT;

-- 好：只在必要时使用事务
-- 先查询数据
SELECT * FROM users;
-- 业务逻辑处理
START TRANSACTION;
UPDATE users SET status=1;
COMMIT;
```

**3. 降低隔离级别**：
```sql
-- 从RR降低到RC，减少间隙锁
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

**4. 添加合理的索引**：
- 减少锁定的行数
- 避免全表扫描

**5. 使用较小的事务**：
- 减少锁持有时间
- 降低死锁概率

**6. 设置锁等待超时**：
```sql
-- 设置锁等待超时时间(秒)
SET innodb_lock_wait_timeout = 50;
```

**7. 使用乐观锁**：
```sql
-- 使用版本号
UPDATE users SET balance=balance-100, version=version+1 
WHERE id=1 AND version=10;
```

**处理死锁**：
```sql
-- 查看最近的死锁信息
SHOW ENGINE INNODB STATUS;

-- 在应用层捕获死锁异常并重试
try {
    // 执行事务
} catch (DeadlockException e) {
    // 重试逻辑
    retry();
}
```

### 9. MySQL的主从复制原理是什么？

**MySQL主从复制**是实现数据库高可用、读写分离和数据备份的基础技术。

**复制架构**：
```
Master(主库) --binlog--> Slave(从库)
    |                        |
  写操作                   读操作
```

**复制原理(三个线程)**：

**1. Master的Binlog Dump线程**：
- 读取binlog日志
- 发送给Slave的I/O线程

**2. Slave的I/O线程**：
- 连接到Master
- 请求binlog日志
- 写入本地relay log(中继日志)

**3. Slave的SQL线程**：
- 读取relay log
- 解析并执行SQL语句
- 更新从库数据

**复制过程**：
```
1. Master执行SQL -> 写入binlog
2. Slave I/O线程 -> 请求binlog
3. Master Dump线程 -> 发送binlog
4. Slave I/O线程 -> 写入relay log
5. Slave SQL线程 -> 读取relay log
6. Slave SQL线程 -> 执行SQL更新数据
```

**配置主从复制**：

**Master配置**：
```sql
-- my.cnf
[mysqld]
server-id=1
log-bin=mysql-bin
binlog-format=ROW

-- 创建复制用户
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- 查看master状态
SHOW MASTER STATUS;
```

**Slave配置**：
```sql
-- my.cnf
[mysqld]
server-id=2
relay-log=relay-bin
read-only=1

-- 配置主库信息
CHANGE MASTER TO
  MASTER_HOST='master_ip',
  MASTER_USER='repl',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=154;

-- 启动复制
START SLAVE;

-- 查看slave状态
SHOW SLAVE STATUS\G
```

**复制模式**：

**1. 异步复制(默认)**：
- Master不等待Slave确认
- 性能最好，但可能丢数据

**2. 半同步复制**：
- Master等待至少一个Slave确认
- 平衡性能和数据安全

**3. 全同步复制**：
- Master等待所有Slave确认
- 数据最安全，但性能最差

**binlog格式**：

**1. Statement(语句)**：
- 记录SQL语句
- 日志量小，但可能不一致

**2. Row(行)**：
- 记录每行的变化
- 日志量大，但完全一致

**3. Mixed(混合)**：
- 自动选择Statement或Row

**常见问题**：

**1. 主从延迟**：
- 原因：从库性能不足、网络延迟、大事务
- 解决：并行复制、优化SQL、增加从库

**2. 数据不一致**：
- 原因：从库写入、binlog格式问题
- 解决：设置read-only、使用Row格式

**3. 复制中断**：
- 原因：网络问题、SQL执行失败
- 解决：跳过错误、重建复制

### 10. 如何优化MySQL查询性能？

**MySQL查询优化**是一个系统工程，需要从多个维度进行优化。

**1. 索引优化**：

**创建合适的索引**：
```sql
-- 为WHERE条件列创建索引
CREATE INDEX idx_status ON orders(status);

-- 为JOIN列创建索引
CREATE INDEX idx_user_id ON orders(user_id);

-- 创建覆盖索引
CREATE INDEX idx_cover ON orders(user_id, status, create_time);
```

**避免索引失效**：
```sql
-- 不要在索引列上使用函数
-- 错误
SELECT * FROM users WHERE YEAR(create_time) = 2024;
-- 正确
SELECT * FROM users WHERE create_time >= '2024-01-01' 
  AND create_time < '2025-01-01';

-- 避免隐式类型转换
-- 错误(id是int类型)
SELECT * FROM users WHERE id = '123';
-- 正确
SELECT * FROM users WHERE id = 123;

-- Like不要以%开头
-- 错误
SELECT * FROM users WHERE name LIKE '%john%';
-- 正确
SELECT * FROM users WHERE name LIKE 'john%';
```

**2. SQL语句优化**：

**避免SELECT ***：
```sql
-- 不好
SELECT * FROM users WHERE id = 1;

-- 好
SELECT id, name, email FROM users WHERE id = 1;
```

**使用LIMIT**：
```sql
-- 限制返回行数
SELECT * FROM users WHERE status = 1 LIMIT 100;
```

**优化子查询**：
```sql
-- 不好：子查询
SELECT * FROM orders WHERE user_id IN (
  SELECT id FROM users WHERE status = 1
);

-- 好：JOIN
SELECT o.* FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE u.status = 1;
```

**3. 表结构优化**：

**选择合适的数据类型**：
```sql
-- 使用最小的数据类型
age TINYINT UNSIGNED  -- 而不是INT

-- 使用ENUM代替字符串
status ENUM('active', 'inactive', 'pending')

-- 固定长度字符串用CHAR
country_code CHAR(2)  -- 而不是VARCHAR(2)
```

**垂直分表**：
```sql
-- 将大字段分离
-- users表：id, name, email
-- user_profiles表：user_id, bio, avatar
```

**4. 查询缓存优化**：
```sql
-- 启用查询缓存(MySQL 5.7及以前)
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 268435456;  -- 256MB

-- 注意：MySQL 8.0已移除查询缓存
```

**5. 配置参数优化**：
```sql
-- 增加缓冲池大小
innodb_buffer_pool_size = 8G

-- 调整日志文件大小
innodb_log_file_size = 512M

-- 增加连接数
max_connections = 1000

-- 调整线程缓存
thread_cache_size = 64
```

**6. 硬件和架构优化**：
- 使用SSD硬盘
- 增加内存
- 读写分离
- 分库分表

**7. 使用EXPLAIN分析**：
```sql
EXPLAIN SELECT * FROM users WHERE name = 'John';

-- 关注：
-- type: ALL(全表扫描)需要优化
-- key: NULL表示未使用索引
-- rows: 扫描行数，越少越好
-- Extra: Using filesort/Using temporary需要优化
```

**8. 慢查询优化**：
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 2;  -- 2秒

-- 分析慢查询
mysqldumpslow /var/log/mysql/slow.log
```

### 11. 什么是慢查询日志？如何使用？

**慢查询日志**记录执行时间超过指定阈值的SQL语句，是定位性能问题的重要工具。

**配置慢查询日志**：
```sql
-- 查看慢查询配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = ON;

-- 设置慢查询阈值(秒)
SET GLOBAL long_query_time = 2;

-- 设置日志文件路径
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 记录未使用索引的查询
SET GLOBAL log_queries_not_using_indexes = ON;
```

**my.cnf配置**：
```ini
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1
```

**分析慢查询日志**：
```bash
# 使用mysqldumpslow分析
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
# -s t: 按查询时间排序
# -t 10: 显示前10条

# 常用选项
mysqldumpslow -s c -t 10 slow.log  # 按查询次数排序
mysqldumpslow -s r -t 10 slow.log  # 按返回记录数排序
mysqldumpslow -s al -t 10 slow.log # 按平均锁时间排序
```

**使用pt-query-digest分析**：
```bash
# 更强大的分析工具
pt-query-digest /var/log/mysql/slow.log > report.txt
```

### 12. Explain执行计划如何分析？

**EXPLAIN**显示MySQL如何执行查询，是SQL优化的核心工具。

**基本用法**：
```sql
EXPLAIN SELECT * FROM users WHERE name = 'John';
```

**输出字段解析**：

**1. id**：
- 查询的序列号
- id相同：执行顺序从上到下
- id不同：id越大越先执行

**2. select_type**：
- SIMPLE：简单查询
- PRIMARY：最外层查询
- SUBQUERY：子查询
- DERIVED：派生表
- UNION：UNION查询

**3. table**：
- 访问的表名

**4. type**（重要）：
访问类型，性能从好到差：
- system：表只有一行
- const：主键或唯一索引查询
- eq_ref：唯一索引扫描
- ref：非唯一索引扫描
- range：范围扫描
- index：索引全扫描
- ALL：全表扫描（需要优化）

**5. possible_keys**：
- 可能使用的索引

**6. key**：
- 实际使用的索引
- NULL表示未使用索引

**7. key_len**：
- 使用的索引长度
- 越短越好

**8. ref**：
- 与索引比较的列或常量

**9. rows**：
- 预计扫描的行数
- 越少越好

**10. Extra**（重要）：
- Using index：使用覆盖索引（好）
- Using where：使用WHERE过滤
- Using filesort：需要额外排序（需优化）
- Using temporary：使用临时表（需优化）
- Using index condition：索引下推

**优化示例**：
```sql
-- 差的执行计划
EXPLAIN SELECT * FROM orders WHERE status = 1;
-- type: ALL, Extra: Using where

-- 优化：添加索引
CREATE INDEX idx_status ON orders(status);
-- type: ref, key: idx_status

-- 更好：使用覆盖索引
CREATE INDEX idx_cover ON orders(status, order_no, amount);
SELECT status, order_no, amount FROM orders WHERE status = 1;
-- Extra: Using index
```

### 13. MySQL的分区表是什么？

**分区表**将一个大表的数据分散存储到多个物理分区中，提高查询性能和管理效率。

**分区类型**：

**1. RANGE分区**：
按范围分区
```sql
CREATE TABLE orders (
    id INT,
    order_date DATE,
    amount DECIMAL(10,2)
) PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2020 VALUES LESS THAN (2021),
    PARTITION p2021 VALUES LESS THAN (2022),
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

**2. LIST分区**：
按列表值分区
```sql
CREATE TABLE users (
    id INT,
    region VARCHAR(20)
) PARTITION BY LIST COLUMNS(region) (
    PARTITION p_north VALUES IN ('Beijing', 'Tianjin'),
    PARTITION p_south VALUES IN ('Shanghai', 'Guangzhou'),
    PARTITION p_west VALUES IN ('Chengdu', 'Chongqing')
);
```

**3. HASH分区**：
按哈希值分区
```sql
CREATE TABLE logs (
    id INT,
    log_time DATETIME
) PARTITION BY HASH(YEAR(log_time))
PARTITIONS 4;
```

**4. KEY分区**：
类似HASH，使用MySQL提供的哈希函数
```sql
CREATE TABLE sessions (
    id INT,
    user_id INT
) PARTITION BY KEY(user_id)
PARTITIONS 4;
```

**分区管理**：
```sql
-- 查看分区信息
SELECT * FROM information_schema.PARTITIONS 
WHERE TABLE_NAME = 'orders';

-- 添加分区
ALTER TABLE orders ADD PARTITION (
    PARTITION p2024 VALUES LESS THAN (2025)
);

-- 删除分区
ALTER TABLE orders DROP PARTITION p2020;

-- 重组分区
ALTER TABLE orders REORGANIZE PARTITION p_future INTO (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

**分区的优势**：
1. 提高查询性能（分区裁剪）
2. 便于数据管理（按分区删除）
3. 提高并发性能
4. 便于数据归档

**注意事项**：
- 分区键必须是主键或唯一键的一部分
- 最多支持8192个分区
- 分区表不支持外键

### 14. 什么是表锁和行锁？

**表锁和行锁**是MySQL中两种不同粒度的锁机制。

**表锁(Table Lock)**：

**特点**：
- 锁定整张表
- 开销小，加锁快
- 不会出现死锁
- 锁粒度大，并发度低
- MyISAM默认使用

**类型**：
```sql
-- 读锁(共享锁)
LOCK TABLES users READ;
-- 当前会话和其他会话都可以读，但不能写

-- 写锁(排他锁)
LOCK TABLES users WRITE;
-- 只有当前会话可以读写，其他会话被阻塞

-- 释放锁
UNLOCK TABLES;
```

**行锁(Row Lock)**：

**特点**：
- 锁定单行或多行
- 开销大，加锁慢
- 可能出现死锁
- 锁粒度小，并发度高
- InnoDB默认使用

**类型**：
```sql
-- 共享锁(S锁)
SELECT * FROM users WHERE id = 1 LOCK IN SHARE MODE;
-- 允许其他事务读取，但不能修改

-- 排他锁(X锁)
SELECT * FROM users WHERE id = 1 FOR UPDATE;
-- 其他事务不能读取和修改

-- UPDATE/DELETE自动加排他锁
UPDATE users SET name = 'John' WHERE id = 1;
```

**对比**：

| 特性 | 表锁 | 行锁 |
|------|------|------|
| 锁粒度 | 整表 | 单行 |
| 并发性 | 低 | 高 |
| 死锁 | 不会 | 可能 |
| 开销 | 小 | 大 |
| 适用场景 | 批量操作 | 高并发 |
| 存储引擎 | MyISAM | InnoDB |

**InnoDB的行锁实现**：
- 基于索引实现
- 如果没有索引，会升级为表锁
- 锁定的是索引记录，不是数据行

**示例**：
```sql
-- 有索引：行锁
UPDATE users SET name = 'John' WHERE id = 1;  -- 只锁id=1

-- 无索引：表锁
UPDATE users SET name = 'John' WHERE email = 'a@b.com';  -- 锁全表
```

### 15. InnoDB的Buffer Pool是什么？

**Buffer Pool**是InnoDB最重要的内存结构，用于缓存数据和索引页。

**作用**：
1. 缓存数据页和索引页
2. 减少磁盘I/O
3. 提高查询性能
4. 缓冲写入操作

**结构**：
```
Buffer Pool
├── 数据页缓存
├── 索引页缓存
├── 插入缓冲(Insert Buffer)
├── 自适应哈希索引
├── 锁信息
└── 数据字典信息
```

**页面管理**：
- 默认页大小：16KB
- 使用LRU算法管理
- 分为young区和old区

**LRU链表**：
```
New Page -> young区(5/8) -> old区(3/8) -> 淘汰
```

**配置**：
```sql
-- 查看Buffer Pool大小
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';

-- 设置Buffer Pool大小(建议物理内存的50-80%)
SET GLOBAL innodb_buffer_pool_size = 8589934592;  -- 8GB

-- Buffer Pool实例数
SET GLOBAL innodb_buffer_pool_instances = 8;

-- 查看Buffer Pool状态
SHOW ENGINE INNODB STATUS;
```

**监控指标**：
```sql
-- 查看Buffer Pool使用情况
SELECT 
  POOL_ID,
  POOL_SIZE,
  FREE_BUFFERS,
  DATABASE_PAGES
FROM information_schema.INNODB_BUFFER_POOL_STATS;

-- 命中率
SHOW STATUS LIKE 'Innodb_buffer_pool%';
-- 关注：
-- Innodb_buffer_pool_read_requests: 读请求数
-- Innodb_buffer_pool_reads: 从磁盘读取次数
-- 命中率 = 1 - (reads / read_requests)
```

**优化建议**：
1. 设置合适的大小（物理内存的50-80%）
2. 使用多个Buffer Pool实例减少竞争
3. 预热Buffer Pool（启动时加载热数据）
4. 监控命中率（应>99%）

### 16. 什么是binlog、redo log和undo log？

MySQL的三种日志是保证数据一致性和持久性的核心机制。

**binlog（二进制日志）**：

**作用**：
- 记录所有DDL和DML语句
- 用于主从复制
- 用于数据恢复

**特点**：
- Server层实现，所有存储引擎都可用
- 逻辑日志，记录SQL语句
- 追加写入，不会覆盖

**格式**：
```sql
-- Statement：记录SQL语句
-- Row：记录每行的变化（推荐）
-- Mixed：混合模式

-- 查看binlog格式
SHOW VARIABLES LIKE 'binlog_format';

-- 查看binlog文件
SHOW BINARY LOGS;

-- 查看binlog内容
SHOW BINLOG EVENTS IN 'mysql-bin.000001';
```

**redo log（重做日志）**：

**作用**：
- 保证事务持久性
- 崩溃恢复
- 实现WAL（Write-Ahead Logging）

**特点**：
- InnoDB特有
- 物理日志，记录数据页的修改
- 循环写入，固定大小
- 先写redo log，再写数据文件

**工作原理**：
```
1. 事务提交时，先写redo log
2. redo log写入成功，事务提交成功
3. 后台线程异步将脏页刷入磁盘
4. 崩溃恢复时，重放redo log
```

**配置**：
```sql
-- redo log文件大小
innodb_log_file_size = 512M

-- redo log文件数量
innodb_log_files_in_group = 2

-- 刷盘策略
innodb_flush_log_at_trx_commit = 1
-- 0: 每秒刷盘
-- 1: 每次事务提交刷盘（最安全）
-- 2: 每次提交写入OS缓存，每秒刷盘
```

**undo log（回滚日志）**：

**作用**：
- 保证事务原子性
- 实现MVCC
- 事务回滚

**特点**：
- InnoDB特有
- 逻辑日志，记录相反操作
- 存储在回滚段中

**工作原理**：
```sql
-- INSERT操作：记录DELETE
INSERT INTO users VALUES (1, 'John');
-- undo log: DELETE FROM users WHERE id = 1;

-- UPDATE操作：记录旧值
UPDATE users SET name = 'Tom' WHERE id = 1;
-- undo log: UPDATE users SET name = 'John' WHERE id = 1;

-- DELETE操作：记录INSERT
DELETE FROM users WHERE id = 1;
-- undo log: INSERT INTO users VALUES (1, 'John');
```

**三种日志对比**：

| 特性 | binlog | redo log | undo log |
|------|--------|----------|----------|
| 层次 | Server层 | InnoDB层 | InnoDB层 |
| 类型 | 逻辑日志 | 物理日志 | 逻辑日志 |
| 作用 | 复制、恢复 | 崩溃恢复 | 回滚、MVCC |
| 写入方式 | 追加写 | 循环写 | 随机写 |
| 持久化 | 是 | 是 | 否 |

**两阶段提交**：
```
1. 准备阶段：写入redo log，状态为prepare
2. 提交阶段：写入binlog
3. 完成阶段：redo log状态改为commit
```

### 17. MySQL如何实现高可用？

MySQL高可用方案确保数据库服务的连续性和数据安全。

**1. 主从复制（Master-Slave）**：

**架构**：
```
Master（主库）
  ├── Slave1（从库）
  ├── Slave2（从库）
  └── Slave3（从库）
```

**优点**：
- 简单易实现
- 读写分离
- 数据备份

**缺点**：
- 主库单点故障
- 需要手动切换

**2. 主主复制（Master-Master）**：

**架构**：
```
Master1 <--> Master2
```

**配置**：
```sql
-- Master1
auto_increment_increment = 2
auto_increment_offset = 1

-- Master2
auto_increment_increment = 2
auto_increment_offset = 2
```

**优点**：
- 双向复制
- 互为备份

**缺点**：
- 可能数据冲突
- 复杂度高

**3. MHA（Master High Availability）**：

**特点**：
- 自动故障切换
- 监控主库状态
- 提升从库为主库

**工作流程**：
```
1. 监控主库心跳
2. 检测主库故障
3. 选择最新的从库
4. 应用差异日志
5. 提升为新主库
6. 修改其他从库配置
```

**4. MGR（MySQL Group Replication）**：

**特点**：
- MySQL官方方案
- 多主模式
- 自动故障转移
- 强一致性

**架构**：
```
Node1 <--> Node2 <--> Node3
（任意节点可读写）
```

**5. Galera Cluster**：

**特点**：
- 多主同步复制
- 真正的多主架构
- 无延迟复制

**6. 使用中间件**：

**ProxySQL**：
```
应用 -> ProxySQL -> MySQL集群
- 读写分离
- 负载均衡
- 故障切换
```

**MaxScale**：
```
应用 -> MaxScale -> MySQL集群
- 自动路由
- 查询缓存
- 监控管理
```

**7. 云服务方案**：

**阿里云RDS**：
- 自动备份
- 一键切换
- 读写分离

**AWS RDS**：
- Multi-AZ部署
- 自动故障转移
- 只读副本

**高可用架构示例**：
```
                 VIP
                  |
            +-----+-----+
            |           |
         Master      Slave
            |           |
      (主库写入)   (从库读取)
            |           |
        MHA Manager
       (监控和切换)
```

**最佳实践**：
1. 使用半同步复制
2. 配置监控告警
3. 定期演练切换
4. 保持数据一致性
5. 使用VIP实现透明切换

### 18. 什么是读写分离？

**读写分离**是将数据库的读操作和写操作分散到不同的数据库服务器上，提高系统性能和可用性。

**架构**：
```
应用层
  |
中间件/代理
  |
  ├── Master（写）
  └── Slave1, Slave2, Slave3（读）
```

**实现方式**：

**1. 应用层实现**：
```java
public class DataSourceRouter {
    private DataSource masterDS;
    private List<DataSource> slaveDS;
    
    public DataSource getDataSource(boolean isRead) {
        if (isRead) {
            // 负载均衡选择从库
            return selectSlave();
        }
        return masterDS;
    }
    
    private DataSource selectSlave() {
        // 轮询、随机、权重等策略
        int index = random.nextInt(slaveDS.size());
        return slaveDS.get(index);
    }
}

// 使用
@Transactional(readOnly = true)
public User getUser(Long id) {
    // 自动路由到从库
    return userMapper.selectById(id);
}

@Transactional
public void updateUser(User user) {
    // 自动路由到主库
    userMapper.updateById(user);
}
```

**2. 中间件实现**：

**MyCAT**：
```xml
<dataHost name="localhost1" maxCon="1000" minCon="10" 
          balance="1" writeType="0" dbType="mysql">
    <!-- 写主机 -->
    <writeHost host="master" url="192.168.1.1:3306" 
               user="root" password="123456">
        <!-- 读主机 -->
        <readHost host="slave1" url="192.168.1.2:3306" 
                  user="root" password="123456"/>
        <readHost host="slave2" url="192.168.1.3:3306" 
                  user="root" password="123456"/>
    </writeHost>
</dataHost>
```

**ProxySQL**：
```sql
-- 配置读写分离规则
INSERT INTO mysql_query_rules (rule_id, active, match_pattern, 
                                destination_hostgroup, apply)
VALUES 
(1, 1, '^SELECT.*FOR UPDATE$', 1, 1),  -- 写
(2, 1, '^SELECT', 2, 1);                -- 读

-- 配置服务器组
INSERT INTO mysql_servers (hostgroup_id, hostname, port)
VALUES 
(1, '192.168.1.1', 3306),  -- 写组
(2, '192.168.1.2', 3306),  -- 读组
(2, '192.168.1.3', 3306);  -- 读组
```

**3. Spring Boot实现**：
```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    public DataSource routingDataSource() {
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put("master", masterDataSource());
        targetDataSources.put("slave", slaveDataSource());
        
        DynamicDataSource dataSource = new DynamicDataSource();
        dataSource.setTargetDataSources(targetDataSources);
        dataSource.setDefaultTargetDataSource(masterDataSource());
        return dataSource;
    }
}

// 动态数据源
public class DynamicDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return DataSourceContextHolder.getDataSource();
    }
}

// AOP拦截
@Aspect
public class DataSourceAspect {
    @Around("@annotation(readOnly)")
    public Object setReadDataSource(ProceedingJoinPoint point, 
                                    ReadOnly readOnly) {
        DataSourceContextHolder.setDataSource("slave");
        try {
            return point.proceed();
        } finally {
            DataSourceContextHolder.clearDataSource();
        }
    }
}
```

**负载均衡策略**：

**1. 轮询（Round Robin）**：
```java
int index = counter++ % slaves.size();
```

**2. 随机（Random）**：
```java
int index = random.nextInt(slaves.size());
```

**3. 权重（Weighted）**：
```java
// slave1: 权重3, slave2: 权重1
// slave1被选中概率75%, slave2被选中概率25%
```

**4. 最少连接（Least Connections）**：
```java
// 选择当前连接数最少的从库
```

**注意事项**：

**1. 主从延迟问题**：
```java
// 写后立即读可能读不到
user.setName("Tom");
userService.update(user);  // 写主库
User u = userService.get(id);  // 读从库，可能还是旧数据

// 解决方案：
// 1. 强制读主库
@ReadMaster
public User getUser(Long id);

// 2. 延迟读取
Thread.sleep(100);

// 3. 使用缓存
```

**2. 事务一致性**：
```java
@Transactional
public void transfer() {
    // 事务内的所有操作都应该在主库
    accountService.deduct(fromId, amount);
    accountService.add(toId, amount);
}
```

**优势**：
1. 提高查询性能
2. 降低主库压力
3. 提高系统可用性

### 19. 如何进行MySQL备份和恢复？

MySQL备份和恢复是保证数据安全的重要手段。

**备份类型**：

**1. 逻辑备份**：

**mysqldump**：
```bash
# 备份单个数据库
mysqldump -u root -p database_name > backup.sql

# 备份多个数据库
mysqldump -u root -p --databases db1 db2 > backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > all_backup.sql

# 备份表结构
mysqldump -u root -p -d database_name > schema.sql

# 备份数据（不含结构）
mysqldump -u root -p -t database_name > data.sql

# 压缩备份
mysqldump -u root -p database_name | gzip > backup.sql.gz

# 备份时添加选项
mysqldump -u root -p \
  --single-transaction \  # 一致性备份（InnoDB）
  --master-data=2 \       # 记录binlog位置
  --flush-logs \          # 刷新日志
  --routines \            # 备份存储过程
  --triggers \            # 备份触发器
  database_name > backup.sql
```

**恢复**：
```bash
# 恢复数据库
mysql -u root -p database_name < backup.sql

# 恢复压缩文件
gunzip < backup.sql.gz | mysql -u root -p database_name

# 在MySQL中执行
mysql> source /path/to/backup.sql;
```

**2. 物理备份**：

**直接复制文件**：
```bash
# 停止MySQL
systemctl stop mysqld

# 复制数据目录
cp -r /var/lib/mysql /backup/mysql_$(date +%Y%m%d)

# 启动MySQL
systemctl start mysqld
```

**使用XtraBackup**：
```bash
# 全量备份
xtrabackup --backup --target-dir=/backup/full

# 增量备份
xtrabackup --backup --target-dir=/backup/inc1 \
  --incremental-basedir=/backup/full

# 准备恢复
xtrabackup --prepare --target-dir=/backup/full
xtrabackup --prepare --target-dir=/backup/full \
  --incremental-dir=/backup/inc1

# 恢复
xtrabackup --copy-back --target-dir=/backup/full
chown -R mysql:mysql /var/lib/mysql
systemctl start mysqld
```

**3. 二进制日志备份**：
```bash
# 刷新日志
mysqladmin -u root -p flush-logs

# 备份binlog
cp /var/lib/mysql/mysql-bin.* /backup/binlog/

# 使用binlog恢复（时间点恢复）
mysqlbinlog --start-datetime="2024-01-01 00:00:00" \
            --stop-datetime="2024-01-01 23:59:59" \
            mysql-bin.000001 | mysql -u root -p

# 使用binlog恢复（位置恢复）
mysqlbinlog --start-position=1000 \
            --stop-position=2000 \
            mysql-bin.000001 | mysql -u root -p
```

**备份策略**：

**1. 全量备份 + 增量备份**：
```bash
# 周日：全量备份
mysqldump --all-databases > full_backup_sunday.sql

# 周一到周六：增量备份（binlog）
mysqladmin flush-logs
cp mysql-bin.* /backup/incremental/
```

**2. 定时备份脚本**：
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql"
DB_NAME="mydb"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -u root -p'password' \
  --single-transaction \
  --master-data=2 \
  --flush-logs \
  $DB_NAME | gzip > $BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# 记录日志
echo "Backup completed at $(date)" >> $BACKUP_DIR/backup.log
```

**3. 定时任务**：
```bash
# 添加到crontab
crontab -e

# 每天凌晨2点执行备份
0 2 * * * /path/to/backup.sh
```

**恢复场景**：

**1. 完全恢复**：
```bash
mysql -u root -p < full_backup.sql
```

**2. 时间点恢复**：
```bash
# 1. 恢复全量备份
mysql -u root -p < full_backup.sql

# 2. 应用binlog到指定时间点
mysqlbinlog --stop-datetime="2024-01-01 10:00:00" \
  mysql-bin.000001 mysql-bin.000002 | mysql -u root -p
```

**3. 跳过错误恢复**：
```bash
# 跳过一个错误
SET GLOBAL sql_slave_skip_counter = 1;
START SLAVE;
```

**备份验证**：
```bash
# 定期验证备份可用性
mysql -u root -p test_db < backup.sql
```

### 20. MySQL的字符集和排序规则是什么？

**字符集（Character Set）**定义了字符的编码方式，**排序规则（Collation）**定义了字符的比较和排序规则。

**常用字符集**：

**1. latin1**：
- MySQL默认字符集（5.7及以前）
- 单字节编码
- 不支持中文

**2. utf8**：
- 最多3字节
- 不完整的UTF-8实现
- 不支持emoji等4字节字符

**3. utf8mb4**（推荐）：
- 完整的UTF-8实现
- 最多4字节
- 支持emoji
- MySQL 8.0默认字符集

**4. gbk**：
- 中文编码
- 双字节

**查看字符集**：
```sql
-- 查看支持的字符集
SHOW CHARACTER SET;

-- 查看当前字符集
SHOW VARIABLES LIKE 'character%';

-- 查看数据库字符集
SELECT DEFAULT_CHARACTER_SET_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'mydb';

-- 查看表字符集
SHOW CREATE TABLE users;
```

**设置字符集**：
```sql
-- 服务器级别（my.cnf）
[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

[client]
default-character-set=utf8mb4

-- 数据库级别
CREATE DATABASE mydb 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

ALTER DATABASE mydb 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 表级别
CREATE TABLE users (
  id INT,
  name VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE users 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 列级别
ALTER TABLE users 
MODIFY name VARCHAR(50) 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**排序规则**：

**常用Collation**：

**1. utf8mb4_general_ci**：
- 不区分大小写
- 性能较好
- 准确性稍差

**2. utf8mb4_unicode_ci**：
- 不区分大小写
- 准确性好
- 性能稍差

**3. utf8mb4_bin**：
- 区分大小写
- 二进制比较

**4. utf8mb4_0900_ai_ci**：
- MySQL 8.0默认
- 支持更多语言
- ai: accent insensitive（不区分重音）
- ci: case insensitive（不区分大小写）

**示例**：
```sql
-- 创建测试表
CREATE TABLE test (
  name VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

INSERT INTO test VALUES ('A'), ('a'), ('B'), ('b');

-- 不区分大小写
SELECT * FROM test WHERE name = 'a';
-- 返回：A, a

-- 区分大小写
SELECT * FROM test 
WHERE name = 'a' COLLATE utf8mb4_bin;
-- 返回：a

-- 排序
SELECT * FROM test ORDER BY name;
-- utf8mb4_general_ci: A, a, B, b
-- utf8mb4_bin: A, B, a, b
```

**字符集转换**：
```sql
-- 转换表字符集
ALTER TABLE users 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 只修改表定义，不转换数据
ALTER TABLE users 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**连接字符集**：
```sql
-- 设置连接字符集
SET NAMES utf8mb4;

-- 等价于
SET character_set_client = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_connection = utf8mb4;
```

**最佳实践**：
1. 统一使用utf8mb4
2. 使用utf8mb4_unicode_ci或utf8mb4_0900_ai_ci
3. 在my.cnf中配置默认字符集
4. 创建数据库时明确指定字符集
5. 应用程序连接时设置字符集

### 21. 什么是联合索引的最左前缀原则？

**最左前缀原则**是联合索引使用的核心规则，决定了索引是否能被有效利用。

**原理**：

联合索引按照索引列的顺序进行排序和查找，只有从最左边的列开始连续匹配，索引才能生效。

**示例**：
```sql
-- 创建联合索引
CREATE INDEX idx_abc ON users(a, b, c);

-- 索引结构（逻辑上）
a | b | c | 主键
1 | 1 | 1 | id1
1 | 1 | 2 | id2
1 | 2 | 1 | id3
2 | 1 | 1 | id4
```

**能使用索引的情况**：
```sql
-- 1. 使用a（✓）
SELECT * FROM users WHERE a = 1;

-- 2. 使用a, b（✓）
SELECT * FROM users WHERE a = 1 AND b = 2;

-- 3. 使用a, b, c（✓）
SELECT * FROM users WHERE a = 1 AND b = 2 AND c = 3;

-- 4. 使用a, c（✓ 部分使用，只用到a）
SELECT * FROM users WHERE a = 1 AND c = 3;

-- 5. 顺序无关（✓ 优化器会调整）
SELECT * FROM users WHERE b = 2 AND a = 1;
```

**不能使用索引的情况**：
```sql
-- 1. 跳过a，从b开始（✗）
SELECT * FROM users WHERE b = 2;

-- 2. 跳过a，从c开始（✗）
SELECT * FROM users WHERE c = 3;

-- 3. 只用b和c（✗）
SELECT * FROM users WHERE b = 2 AND c = 3;
```

**范围查询的影响**：
```sql
-- 1. a使用等值，b使用范围，c失效
SELECT * FROM users WHERE a = 1 AND b > 2 AND c = 3;
-- 使用索引：a, b
-- 未使用：c

-- 2. a使用范围，b和c失效
SELECT * FROM users WHERE a > 1 AND b = 2 AND c = 3;
-- 使用索引：a
-- 未使用：b, c
```

**索引设计建议**：

**1. 区分度高的列放前面**：
```sql
-- 好的设计
CREATE INDEX idx_status_create_time ON orders(status, create_time);
-- status区分度低，但查询频繁
-- create_time区分度高

-- 如果主要查询是：
WHERE status = 1 AND create_time > '2024-01-01'
-- 这个索引很合适
```

**2. 考虑查询频率**：
```sql
-- 查询1：WHERE a = 1 AND b = 2（频繁）
-- 查询2：WHERE a = 1（偶尔）
-- 查询3：WHERE b = 2（很少）

-- 推荐索引
CREATE INDEX idx_ab ON table(a, b);
-- 可以覆盖查询1和查询2
```

**3. 覆盖索引优化**：
```sql
-- 查询
SELECT a, b, c FROM users WHERE a = 1 AND b = 2;

-- 索引
CREATE INDEX idx_abc ON users(a, b, c);
-- 覆盖索引，无需回表
```

**验证索引使用**：
```sql
EXPLAIN SELECT * FROM users WHERE a = 1 AND b = 2;
-- 查看key_len判断使用了几个列
-- a(INT): 4字节
-- a+b(INT): 8字节
-- a+b+c(INT): 12字节
```

### 22. 为什么InnoDB使用B+树而不是B树？

InnoDB选择B+树作为索引结构是经过深思熟虑的设计决策。

**B树 vs B+树结构对比**：

**B树**：
```
        [10, 20]
       /    |    \
   [5,8]  [15]  [25,30]
   / | \   |    /  |  \
  数据节点（每个节点都存数据）
```

**B+树**：
```
        [10, 20]
       /    |    \
   [5,8]  [15]  [25,30]
   / | \   |    /  |  \
  叶子节点（只有叶子节点存数据）
  [5]→[8]→[10]→[15]→[20]→[25]→[30]
  （叶子节点通过指针连接）
```

**B+树的优势**：

**1. 更高的扇出度（Fan-out）**：
```
B树：
- 非叶子节点存储键和数据
- 每个节点能存储的键较少
- 树的高度较高

B+树：
- 非叶子节点只存储键
- 每个节点能存储更多的键
- 树的高度较低

示例（假设页大小16KB）：
B树：一个节点可能存100个键
B+树：一个节点可能存1000个键

查找效率：
3层B+树可以存储：1000 * 1000 * 1000 = 10亿条记录
3层B树可能只能存储：100 * 100 * 100 = 100万条记录
```

**2. 范围查询效率高**：
```sql
-- 查询范围数据
SELECT * FROM users WHERE id BETWEEN 100 AND 200;

-- B树：
需要多次随机访问不同的节点

-- B+树：
1. 定位到起始叶子节点（id=100）
2. 顺序遍历叶子节点链表到结束（id=200）
3. 所有数据都在叶子节点，且有序连接
```

**3. 全表扫描效率高**：
```sql
SELECT * FROM users;

-- B树：
需要遍历所有节点（包括非叶子节点）

-- B+树：
只需遍历叶子节点链表
```

**4. 稳定的查询性能**：
```
B树：
- 数据分布在各层
- 查询性能不稳定
- 最好情况：O(1)（根节点）
- 最坏情况：O(log n)（叶子节点）

B+树：
- 所有数据都在叶子节点
- 查询性能稳定
- 所有查询都是：O(log n)
```

**5. 更好的磁盘预读**：
```
操作系统的磁盘预读：
- 一次读取一个页（通常4KB或16KB）
- B+树的节点大小通常设计为页的整数倍

B+树优势：
- 非叶子节点只存键，可以在一个页中存更多键
- 减少磁盘I/O次数
- 提高缓存命中率
```

**6. 支持数据库的顺序访问**：
```sql
-- ORDER BY查询
SELECT * FROM users ORDER BY id;

-- B+树：
直接遍历叶子节点链表，数据已排序

-- B树：
需要中序遍历整棵树
```

**实际案例**：
```sql
-- 假设InnoDB页大小16KB，主键INT(4字节)，指针6字节

-- B+树非叶子节点：
每个键值对：4 + 6 = 10字节
一个节点可存：16KB / 10B ≈ 1600个键

-- 3层B+树：
第1层：1个节点（根）
第2层：1600个节点
第3层：1600 * 1600 = 256万个节点
可存储：256万条记录

-- 查询任意记录：
最多3次磁盘I/O
```

**为什么不用其他数据结构**：

**哈希表**：
- 不支持范围查询
- 不支持排序
- 不支持模糊查询

**二叉搜索树**：
- 树的高度太高
- 磁盘I/O次数多

**红黑树**：
- 树的高度仍然较高
- 不适合磁盘存储

### 23. MySQL的JOIN查询有哪些类型？

MySQL支持多种JOIN类型，用于连接多个表的数据。

**JOIN类型**：

**1. INNER JOIN（内连接）**：
```sql
-- 只返回两表都匹配的记录
SELECT u.name, o.order_no
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 简写（等价）
SELECT u.name, o.order_no
FROM users u, orders o
WHERE u.id = o.user_id;
```

**结果**：
```
users:        orders:       结果:
id | name     user_id | no  name | no
1  | Alice   1       | A1  Alice| A1
2  | Bob     1       | A2  Alice| A2
3  | Carol   2       | B1  Bob  | B1
```

**2. LEFT JOIN（左连接）**：
```sql
-- 返回左表所有记录，右表匹配的记录
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

**结果**：
```
users:        orders:       结果:
id | name     user_id | no  name  | no
1  | Alice   1       | A1  Alice | A1
2  | Bob     1       | A2  Alice | A2
3  | Carol   2       | B1  Bob   | B1
                          Carol | NULL
```

**3. RIGHT JOIN（右连接）**：
```sql
-- 返回右表所有记录，左表匹配的记录
SELECT u.name, o.order_no
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

**4. FULL OUTER JOIN（全外连接）**：
```sql
-- MySQL不直接支持，需要用UNION模拟
SELECT u.name, o.order_no
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
UNION
SELECT u.name, o.order_no
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

**5. CROSS JOIN（交叉连接）**：
```sql
-- 笛卡尔积，返回所有可能的组合
SELECT u.name, o.order_no
FROM users u
CROSS JOIN orders o;

-- 结果：3个用户 × 3个订单 = 9条记录
```

**6. SELF JOIN（自连接）**：
```sql
-- 表与自己连接
-- 查找同一部门的员工
SELECT e1.name AS employee, e2.name AS colleague
FROM employees e1
JOIN employees e2 ON e1.dept_id = e2.dept_id
WHERE e1.id != e2.id;
```

**JOIN优化技巧**：

**1. 使用小表驱动大表**：
```sql
-- 好：小表在前
SELECT *
FROM small_table s
JOIN large_table l ON s.id = l.small_id;

-- 不好：大表在前
SELECT *
FROM large_table l
JOIN small_table s ON l.small_id = s.id;
```

**2. 确保JOIN列有索引**：
```sql
-- 为JOIN列创建索引
CREATE INDEX idx_user_id ON orders(user_id);

-- 查询会使用索引
SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id;
```

**3. 避免JOIN过多表**：
```sql
-- 不好：JOIN太多表
SELECT *
FROM t1
JOIN t2 ON t1.id = t2.t1_id
JOIN t3 ON t2.id = t3.t2_id
JOIN t4 ON t3.id = t4.t3_id
JOIN t5 ON t4.id = t5.t4_id;  -- 性能差

-- 好：分步查询或使用中间表
```

**4. 使用STRAIGHT_JOIN强制顺序**：
```sql
-- 强制MySQL按指定顺序JOIN
SELECT *
FROM small_table
STRAIGHT_JOIN large_table ON small_table.id = large_table.small_id;
```

**实际应用示例**：

**查找没有订单的用户**：
```sql
SELECT u.*
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

**查找有订单的用户**：
```sql
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

**统计每个用户的订单数**：
```sql
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

### 24. 什么是临时表？

**临时表**是MySQL中用于存储临时数据的特殊表，会话结束后自动删除。

**临时表类型**：

**1. 用户创建的临时表**：
```sql
-- 创建临时表
CREATE TEMPORARY TABLE temp_users (
    id INT,
    name VARCHAR(50)
);

-- 插入数据
INSERT INTO temp_users VALUES (1, 'Alice');

-- 查询
SELECT * FROM temp_users;

-- 会话结束后自动删除
```

**特点**：
- 只对当前会话可见
- 会话结束自动删除
- 可以与普通表同名（临时表优先）
- 存储在tmpdir目录

**2. MySQL内部临时表**：

MySQL在执行某些查询时会自动创建内部临时表：

**触发场景**：
```sql
-- 1. UNION查询
SELECT id FROM users
UNION
SELECT id FROM orders;

-- 2. DISTINCT + ORDER BY不同列
SELECT DISTINCT name FROM users ORDER BY age;

-- 3. GROUP BY + ORDER BY不同列
SELECT name, COUNT(*) FROM users 
GROUP BY name ORDER BY age;

-- 4. 子查询在FROM子句
SELECT * FROM (
    SELECT * FROM users WHERE age > 18
) AS t;

-- 5. 使用SQL_BUFFER_RESULT
SELECT SQL_BUFFER_RESULT * FROM users;
```

**内部临时表类型**：

**Memory引擎临时表**：
- 存储在内存中
- 速度快
- 受限于tmp_table_size和max_heap_table_size

**InnoDB引擎临时表**：
- 存储在磁盘
- 当内存临时表超过限制时转换
- 性能较差

**查看临时表使用**：
```sql
-- 查看临时表统计
SHOW STATUS LIKE 'Created_tmp%';
-- Created_tmp_tables: 创建的临时表数
-- Created_tmp_disk_tables: 磁盘临时表数

-- 使用EXPLAIN查看
EXPLAIN SELECT DISTINCT name FROM users ORDER BY age;
-- Extra: Using temporary
```

**优化临时表**：

**1. 增加内存临时表大小**：
```sql
SET tmp_table_size = 64M;
SET max_heap_table_size = 64M;
```

**2. 避免产生临时表**：
```sql
-- 不好：产生临时表
SELECT DISTINCT name FROM users ORDER BY age;

-- 好：使用索引避免临时表
CREATE INDEX idx_name_age ON users(name, age);
SELECT DISTINCT name FROM users ORDER BY name;
```

**3. 使用索引覆盖**：
```sql
-- 创建覆盖索引
CREATE INDEX idx_cover ON users(name, age);

-- 查询可以使用覆盖索引
SELECT name, age FROM users WHERE name = 'Alice';
```

**临时表应用场景**：

**1. 复杂查询的中间结果**：
```sql
-- 分步处理复杂查询
CREATE TEMPORARY TABLE temp_result AS
SELECT user_id, SUM(amount) AS total
FROM orders
WHERE create_time > '2024-01-01'
GROUP BY user_id;

-- 使用临时表继续处理
SELECT u.name, t.total
FROM users u
JOIN temp_result t ON u.id = t.user_id
WHERE t.total > 1000;
```

**2. 数据去重**：
```sql
CREATE TEMPORARY TABLE temp_unique AS
SELECT DISTINCT * FROM users;

DELETE FROM users;
INSERT INTO users SELECT * FROM temp_unique;
```

**3. 批量数据处理**：
```sql
-- 导入数据到临时表
LOAD DATA INFILE 'data.csv'
INTO TABLE temp_import;

-- 验证和清洗
DELETE FROM temp_import WHERE invalid_data;

-- 导入到正式表
INSERT INTO users SELECT * FROM temp_import;
```

### 25. 如何处理大表的DDL操作？

大表DDL操作（如ALTER TABLE）可能导致长时间锁表，影响业务。

**问题**：
```sql
-- 传统DDL会锁表
ALTER TABLE large_table ADD COLUMN new_col VARCHAR(50);
-- 可能锁表数小时，期间无法读写
```

**解决方案**：

**1. 使用Online DDL（MySQL 5.6+）**：
```sql
-- 在线添加列
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ALGORITHM=INPLACE, LOCK=NONE;

-- ALGORITHM选项：
-- COPY: 创建临时表，复制数据（锁表）
-- INPLACE: 原地修改（不锁表或短暂锁表）

-- LOCK选项：
-- NONE: 不锁表
-- SHARED: 允许读，不允许写
-- EXCLUSIVE: 完全锁表
```

**支持Online DDL的操作**：
```sql
-- 添加索引（INPLACE）
ALTER TABLE users ADD INDEX idx_name(name);

-- 删除索引（INPLACE）
ALTER TABLE users DROP INDEX idx_name;

-- 添加列（INPLACE，末尾）
ALTER TABLE users ADD COLUMN age INT;

-- 修改列默认值（INPLACE）
ALTER TABLE users ALTER COLUMN status SET DEFAULT 1;

-- 重命名列（INPLACE）
ALTER TABLE users CHANGE old_name new_name VARCHAR(50);
```

**不支持Online DDL的操作**：
```sql
-- 修改列类型（需要COPY）
ALTER TABLE users MODIFY COLUMN name VARCHAR(100);

-- 添加主键（需要重建表）
ALTER TABLE users ADD PRIMARY KEY (id);
```

**2. 使用pt-online-schema-change**：

Percona Toolkit工具，适用于所有DDL操作。

```bash
pt-online-schema-change \
  --alter "ADD COLUMN phone VARCHAR(20)" \
  --execute \
  D=mydb,t=users

# 工作原理：
# 1. 创建新表（带新结构）
# 2. 创建触发器（同步数据变更）
# 3. 分批复制数据
# 4. 切换表名
# 5. 删除旧表
```

**3. 使用gh-ost**：

GitHub开源工具，无触发器方案。

```bash
gh-ost \
  --user=root \
  --password=password \
  --host=localhost \
  --database=mydb \
  --table=users \
  --alter="ADD COLUMN phone VARCHAR(20)" \
  --execute

# 工作原理：
# 1. 创建ghost表（新结构）
# 2. 通过binlog同步数据变更
# 3. 分批复制数据
# 4. 切换表名
```

**4. 分批处理**：

对于某些操作，可以分批执行：

```sql
-- 删除大量数据
-- 不好：一次删除
DELETE FROM users WHERE create_time < '2020-01-01';

-- 好：分批删除
DELIMITER $$
CREATE PROCEDURE batch_delete()
BEGIN
    DECLARE rows INT DEFAULT 1;
    WHILE rows > 0 DO
        DELETE FROM users 
        WHERE create_time < '2020-01-01'
        LIMIT 1000;
        
        SET rows = ROW_COUNT();
        SELECT SLEEP(0.1);  -- 避免影响业务
    END WHILE;
END$$
DELIMITER ;

CALL batch_delete();
```

**5. 使用新表替换**：

```sql
-- 1. 创建新表
CREATE TABLE users_new LIKE users;
ALTER TABLE users_new ADD COLUMN phone VARCHAR(20);

-- 2. 复制数据
INSERT INTO users_new SELECT *, NULL FROM users;

-- 3. 切换表名
RENAME TABLE users TO users_old, users_new TO users;

-- 4. 删除旧表
DROP TABLE users_old;
```

**6. 在从库执行**：

```sql
-- 1. 在从库停止复制
STOP SLAVE;

-- 2. 执行DDL
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 3. 主从切换
-- 提升从库为主库

-- 4. 在新从库（原主库）执行DDL
```

**最佳实践**：

**1. 选择低峰期**：
```sql
-- 在凌晨或业务低峰期执行
```

**2. 提前测试**：
```sql
-- 在测试环境验证DDL时间
-- 评估对业务的影响
```

**3. 监控执行进度**：
```sql
-- 查看DDL进度（MySQL 5.7+）
SELECT * FROM performance_schema.events_stages_current;
```

**4. 准备回滚方案**：
```sql
-- 保留旧表备份
-- 准备快速回滚脚本
```

**5. 通知相关人员**：
```sql
-- 提前通知运维和开发
-- 准备应急预案
```

### 26. MySQL的分库分表策略有哪些？

**分库分表**是应对海量数据和高并发的核心解决方案。

**为什么需要分库分表**：
- 单表数据量过大（>1000万）
- 并发压力大
- 磁盘I/O瓶颈
- 单库连接数限制

**拆分方式**：

**1. 垂直拆分**：

**垂直分库**：
```
原来：
user_db
├── users（用户表）
├── orders（订单表）
└── products（商品表）

拆分后：
user_db（用户库）
└── users

order_db（订单库）
└── orders

product_db（商品库）
└── products
```

**垂直分表**：
```sql
-- 原表：users（字段很多）
id, name, email, phone, address, avatar, bio, settings...

-- 拆分后：
-- users（常用字段）
id, name, email, phone

-- user_profiles（不常用字段）
user_id, address, avatar, bio, settings
```

**2. 水平拆分**：

**水平分库**：
```
user_db_0
└── users（id % 4 = 0）

user_db_1
└── users（id % 4 = 1）

user_db_2
└── users（id % 4 = 2）

user_db_3
└── users（id % 4 = 3）
```

**水平分表**：
```sql
-- 同一个库，多个表
users_0（id % 4 = 0）
users_1（id % 4 = 1）
users_2（id % 4 = 2）
users_3（id % 4 = 3）
```

**分片策略**：

**1. 范围分片（Range）**：
```sql
-- 按ID范围
users_0: id 1-1000000
users_1: id 1000001-2000000
users_2: id 2000001-3000000

-- 按时间范围
orders_2024_01
orders_2024_02
orders_2024_03
```

**优点**：
- 扩容简单
- 范围查询效率高

**缺点**：
- 数据分布可能不均匀
- 热点问题

**2. 哈希分片（Hash）**：
```java
// 按用户ID取模
int shardIndex = userId % 4;
String tableName = "users_" + shardIndex;
```

**优点**：
- 数据分布均匀
- 无热点问题

**缺点**：
- 扩容困难
- 范围查询需要查所有分片

**3. 一致性哈希**：
```java
// 使用一致性哈希环
int hash = consistentHash(userId);
String shardKey = getShardByHash(hash);
```

**优点**：
- 扩容时数据迁移少

**4. 地理位置分片**：
```sql
-- 按地区
users_beijing
users_shanghai
users_guangzhou
```

**5. 时间分片**：
```sql
-- 按月份
orders_202401
orders_202402
orders_202403
```

**分库分表中间件**：

**1. ShardingSphere（推荐）**：
```yaml
# 配置示例
shardingSphere:
  dataSources:
    ds0: # 数据源0
    ds1: # 数据源1
  shardingRule:
    tables:
      users:
        actualDataNodes: ds${0..1}.users_${0..3}
        databaseStrategy:
          inline:
            shardingColumn: user_id
            algorithmExpression: ds${user_id % 2}
        tableStrategy:
          inline:
            shardingColumn: user_id
            algorithmExpression: users_${user_id % 4}
```

**2. MyCAT**：
```xml
<table name="users" dataNode="dn1,dn2,dn3,dn4" rule="mod-long">
    <childTable name="orders" joinKey="user_id" parentKey="id"/>
</table>
```

**分库分表带来的问题**：

**1. 跨库JOIN**：
```java
// 解决方案：
// 1. 应用层JOIN
List<User> users = userDao.getUsers(ids);
List<Order> orders = orderDao.getOrders(ids);
// 在应用层关联

// 2. 数据冗余
// 在订单表中冗余用户信息

// 3. 全局表
// 字典表在每个库都有一份
```

**2. 分布式事务**：
```java
// 解决方案：
// 1. 避免跨库事务
// 2. 使用最终一致性
// 3. 使用分布式事务框架（Seata）
```

**3. 全局唯一ID**：
```java
// 解决方案：
// 1. 雪花算法（Snowflake）
long id = snowflake.nextId();

// 2. 数据库号段模式
// 3. Redis自增
// 4. UUID
```

**4. 分页查询**：
```sql
-- 问题：跨分片分页
SELECT * FROM users ORDER BY create_time LIMIT 0, 20;

-- 解决方案：
-- 1. 每个分片查询，应用层合并排序
-- 2. 使用ES等搜索引擎
```

**最佳实践**：
1. 优先考虑优化，再考虑分库分表
2. 选择合适的分片键（高频查询字段）
3. 避免跨库JOIN和事务
4. 提前规划扩容方案
5. 做好数据迁移工具

### 27. 什么是SQL注入？如何防止？

**SQL注入**是最常见的Web安全漏洞，攻击者通过在输入中插入恶意SQL代码来攻击数据库。

**SQL注入示例**：

**场景1：登录绕过**：
```java
// 危险代码
String sql = "SELECT * FROM users WHERE username = '" + username 
           + "' AND password = '" + password + "'";

// 攻击输入
username: admin' OR '1'='1
password: anything

// 实际执行的SQL
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
// 永远返回true，绕过登录
```

**场景2：数据泄露**：
```java
// 危险代码
String sql = "SELECT * FROM products WHERE id = " + productId;

// 攻击输入
productId: 1 UNION SELECT username, password FROM users

// 实际执行的SQL
SELECT * FROM products WHERE id = 1 UNION SELECT username, password FROM users
// 泄露用户数据
```

**场景3：数据破坏**：
```java
// 危险代码
String sql = "UPDATE users SET email = '" + email + "' WHERE id = " + userId;

// 攻击输入
email: test@test.com'; DROP TABLE users; --

// 实际执行的SQL
UPDATE users SET email = 'test@test.com'; DROP TABLE users; --' WHERE id = 1
// 删除整个表
```

**防止SQL注入的方法**：

**1. 使用预编译语句（PreparedStatement）**：
```java
// 安全代码
String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, username);
pstmt.setString(2, password);
ResultSet rs = pstmt.executeQuery();

// 原理：参数会被正确转义，不会被当作SQL代码执行
```

**2. 使用ORM框架**：
```java
// MyBatis（安全）
@Select("SELECT * FROM users WHERE username = #{username}")
User findByUsername(String username);

// 注意：使用#{}而不是${}
// #{} 会预编译
// ${} 会直接拼接（危险）
```

**3. 输入验证和过滤**：
```java
// 白名单验证
public boolean isValidUsername(String username) {
    return username.matches("^[a-zA-Z0-9_]{3,20}$");
}

// 过滤特殊字符
public String escapeSQL(String input) {
    return input.replace("'", "''")
                .replace("\\", "\\\\")
                .replace(";", "");
}
```

**4. 最小权限原则**：
```sql
-- 应用程序使用的数据库账号只授予必要权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';
-- 不要授予DROP、CREATE等危险权限
```

**5. 错误信息处理**：
```java
// 不好：暴露数据库信息
catch (SQLException e) {
    return "Error: " + e.getMessage();
}

// 好：返回通用错误信息
catch (SQLException e) {
    logger.error("Database error", e);
    return "操作失败，请稍后重试";
}
```

**6. 使用存储过程**：
```sql
-- 创建存储过程
DELIMITER $$
CREATE PROCEDURE getUserByUsername(IN p_username VARCHAR(50))
BEGIN
    SELECT * FROM users WHERE username = p_username;
END$$
DELIMITER ;

-- 调用存储过程
CALL getUserByUsername('admin');
```

**7. Web应用防火墙（WAF）**：
- 使用ModSecurity等WAF
- 检测和阻止SQL注入攻击

**检测SQL注入**：
```bash
# 使用sqlmap工具
sqlmap -u "http://example.com/product?id=1" --dbs

# 手动测试
# 1. 单引号测试
id=1'

# 2. 逻辑测试
id=1 OR 1=1

# 3. 时间延迟测试
id=1 AND SLEEP(5)
```

### 28. MySQL的存储过程和函数有什么区别？

**存储过程（Procedure）和函数（Function）**都是预编译的SQL代码块，但有重要区别。

**主要区别**：

| 特性 | 存储过程 | 函数 |
|------|---------|------|
| 返回值 | 可以有多个（OUT参数） | 只能返回一个值 |
| 调用方式 | CALL procedure_name() | SELECT function_name() |
| 事务 | 可以包含事务 | 不能包含事务 |
| DML操作 | 可以执行 | 受限制 |
| 使用场景 | 复杂业务逻辑 | 计算和转换 |

**存储过程示例**：
```sql
-- 创建存储过程
DELIMITER $$
CREATE PROCEDURE transfer_money(
    IN from_account INT,
    IN to_account INT,
    IN amount DECIMAL(10,2),
    OUT result VARCHAR(50)
)
BEGIN
    DECLARE from_balance DECIMAL(10,2);
    
    -- 开启事务
    START TRANSACTION;
    
    -- 检查余额
    SELECT balance INTO from_balance 
    FROM accounts WHERE id = from_account FOR UPDATE;
    
    IF from_balance < amount THEN
        SET result = '余额不足';
        ROLLBACK;
    ELSE
        -- 扣款
        UPDATE accounts SET balance = balance - amount 
        WHERE id = from_account;
        
        -- 入账
        UPDATE accounts SET balance = balance + amount 
        WHERE id = to_account;
        
        SET result = '转账成功';
        COMMIT;
    END IF;
END$$
DELIMITER ;

-- 调用存储过程
CALL transfer_money(1, 2, 100.00, @result);
SELECT @result;
```

**函数示例**：
```sql
-- 创建函数
DELIMITER $$
CREATE FUNCTION calculate_age(birth_date DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE age INT;
    SET age = YEAR(CURDATE()) - YEAR(birth_date);
    
    IF DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(birth_date, '%m%d') THEN
        SET age = age - 1;
    END IF;
    
    RETURN age;
END$$
DELIMITER ;

-- 使用函数
SELECT name, calculate_age(birth_date) AS age FROM users;

-- 在WHERE子句中使用
SELECT * FROM users WHERE calculate_age(birth_date) > 18;
```

**存储过程的优点**：
```sql
-- 1. 可以返回多个值
CREATE PROCEDURE get_user_stats(
    IN user_id INT,
    OUT order_count INT,
    OUT total_amount DECIMAL(10,2)
)
BEGIN
    SELECT COUNT(*), SUM(amount) 
    INTO order_count, total_amount
    FROM orders WHERE user_id = user_id;
END;

-- 2. 可以执行复杂逻辑
CREATE PROCEDURE process_orders()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE order_id INT;
    DECLARE cur CURSOR FOR SELECT id FROM orders WHERE status = 'pending';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO order_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- 处理订单
        UPDATE orders SET status = 'processing' WHERE id = order_id;
    END LOOP;
    
    CLOSE cur;
END;
```

**函数的限制**：
```sql
-- 函数不能执行以下操作：
-- 1. 不能修改表数据（在某些配置下）
-- 2. 不能使用事务
-- 3. 不能调用存储过程
-- 4. 不能使用动态SQL
```

**何时使用**：

**使用存储过程**：
- 复杂的业务逻辑
- 需要事务处理
- 需要多个返回值
- 批量数据处理

**使用函数**：
- 简单的计算
- 数据转换
- 需要在SELECT中使用
- 返回单个值

### 29. 什么是触发器？

**触发器（Trigger）**是在特定数据库事件发生时自动执行的存储过程。

**触发器类型**：

**按时机分类**：
- BEFORE：在事件发生前触发
- AFTER：在事件发生后触发

**按事件分类**：
- INSERT：插入数据时
- UPDATE：更新数据时
- DELETE：删除数据时

**创建触发器**：

**1. BEFORE INSERT触发器**：
```sql
-- 自动设置创建时间
DELIMITER $$
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.create_time = NOW();
    SET NEW.update_time = NOW();
END$$
DELIMITER ;

-- 测试
INSERT INTO users (name, email) VALUES ('Alice', 'alice@test.com');
-- create_time和update_time会自动设置
```

**2. AFTER INSERT触发器**：
```sql
-- 插入订单后更新统计
DELIMITER $$
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    UPDATE user_stats 
    SET order_count = order_count + 1,
        total_amount = total_amount + NEW.amount
    WHERE user_id = NEW.user_id;
END$$
DELIMITER ;
```

**3. BEFORE UPDATE触发器**：
```sql
-- 更新时自动记录修改时间
DELIMITER $$
CREATE TRIGGER before_user_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.update_time = NOW();
    
    -- 防止某些字段被修改
    IF OLD.id != NEW.id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '不能修改ID';
    END IF;
END$$
DELIMITER ;
```

**4. AFTER DELETE触发器**：
```sql
-- 删除用户时记录日志
DELIMITER $$
CREATE TRIGGER after_user_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_delete_log (user_id, username, delete_time)
    VALUES (OLD.id, OLD.name, NOW());
END$$
DELIMITER ;
```

**实际应用场景**：

**1. 审计日志**：
```sql
CREATE TRIGGER audit_user_changes
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (
        table_name, 
        record_id, 
        old_value, 
        new_value, 
        change_time
    ) VALUES (
        'users',
        NEW.id,
        CONCAT('name:', OLD.name, ',email:', OLD.email),
        CONCAT('name:', NEW.name, ',email:', NEW.email),
        NOW()
    );
END;
```

**2. 数据验证**：
```sql
CREATE TRIGGER validate_order
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '订单金额必须大于0';
    END IF;
    
    IF NEW.quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = '订单数量必须大于0';
    END IF;
END;
```

**3. 数据同步**：
```sql
CREATE TRIGGER sync_to_cache
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- 标记缓存需要更新
    INSERT INTO cache_invalidation (table_name, record_id)
    VALUES ('products', NEW.id);
END;
```

**查看和管理触发器**：
```sql
-- 查看所有触发器
SHOW TRIGGERS;

-- 查看特定表的触发器
SHOW TRIGGERS WHERE `Table` = 'users';

-- 查看触发器定义
SHOW CREATE TRIGGER trigger_name;

-- 删除触发器
DROP TRIGGER IF EXISTS trigger_name;
```

**触发器的注意事项**：

**优点**：
- 自动执行，无需应用层干预
- 保证数据完整性
- 集中管理业务规则

**缺点**：
- 隐藏的业务逻辑，难以调试
- 可能影响性能
- 触发器链可能导致复杂问题
- 不易维护

**最佳实践**：
1. 避免复杂逻辑
2. 不要在触发器中调用存储过程
3. 避免触发器链
4. 做好文档记录
5. 考虑使用应用层逻辑替代

### 30. MySQL的视图是什么？

**视图（View）**是基于SQL查询结果的虚拟表，不存储实际数据。

**创建视图**：
```sql
-- 简单视图
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE status = 'active';

-- 使用视图
SELECT * FROM active_users;

-- 复杂视图（多表JOIN）
CREATE VIEW order_details AS
SELECT 
    o.id AS order_id,
    o.order_no,
    u.name AS user_name,
    p.name AS product_name,
    o.quantity,
    o.amount
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id;
```

**视图的优点**：

**1. 简化复杂查询**：
```sql
-- 不用每次都写复杂的JOIN
SELECT * FROM order_details WHERE user_name = 'Alice';

-- 而不是
SELECT o.*, u.name, p.name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
WHERE u.name = 'Alice';
```

**2. 数据安全性**：
```sql
-- 只暴露部分字段
CREATE VIEW public_users AS
SELECT id, name, email
FROM users;
-- 隐藏了password、phone等敏感字段

-- 授权给应用
GRANT SELECT ON public_users TO 'app_user'@'localhost';
```

**3. 逻辑独立性**：
```sql
-- 表结构变化时，只需修改视图
-- 应用代码不需要改动
```

**可更新视图**：
```sql
-- 简单视图可以更新
CREATE VIEW simple_view AS
SELECT id, name, email FROM users;

-- 可以执行INSERT、UPDATE、DELETE
UPDATE simple_view SET name = 'Bob' WHERE id = 1;

-- 复杂视图（包含JOIN、聚合等）通常不可更新
```

**WITH CHECK OPTION**：
```sql
-- 确保通过视图的更新符合视图条件
CREATE VIEW active_users AS
SELECT * FROM users WHERE status = 'active'
WITH CHECK OPTION;

-- 这个更新会失败，因为违反了视图条件
UPDATE active_users SET status = 'inactive' WHERE id = 1;
```

**视图管理**：
```sql
-- 查看所有视图
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';

-- 查看视图定义
SHOW CREATE VIEW view_name;

-- 修改视图
ALTER VIEW active_users AS
SELECT id, name, email, phone
FROM users
WHERE status = 'active';

-- 删除视图
DROP VIEW IF EXISTS view_name;
```

**物化视图**：

MySQL不直接支持物化视图，但可以模拟：
```sql
-- 创建实体表存储视图数据
CREATE TABLE mv_order_stats AS
SELECT 
    user_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_amount
FROM orders
GROUP BY user_id;

-- 创建索引
CREATE INDEX idx_user_id ON mv_order_stats(user_id);

-- 定期刷新（使用事件调度器）
CREATE EVENT refresh_order_stats
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    TRUNCATE TABLE mv_order_stats;
    INSERT INTO mv_order_stats
    SELECT user_id, COUNT(*), SUM(amount)
    FROM orders
    GROUP BY user_id;
END;
```

**视图的性能考虑**：

**问题**：
- 视图每次查询都会执行底层SQL
- 复杂视图可能性能较差

**优化**：
```sql
-- 1. 为视图涉及的表创建索引
CREATE INDEX idx_status ON users(status);

-- 2. 避免嵌套视图
-- 不好
CREATE VIEW view1 AS SELECT * FROM table1;
CREATE VIEW view2 AS SELECT * FROM view1;

-- 3. 使用物化视图（实体表）代替
```

**最佳实践**：
1. 用于简化复杂查询
2. 用于数据安全控制
3. 避免过度使用
4. 注意性能影响
5. 做好文档记录

### 31. 如何进行MySQL性能监控？

**MySQL性能监控**帮助及时发现和解决性能问题。

**监控工具和方法**：

**1. SHOW STATUS**：
```sql
-- 查看服务器状态
SHOW GLOBAL STATUS;

-- 关键指标
SHOW STATUS LIKE 'Threads_connected';  -- 当前连接数
SHOW STATUS LIKE 'Threads_running';    -- 活跃连接数
SHOW STATUS LIKE 'Queries';            -- 查询总数
SHOW STATUS LIKE 'Slow_queries';       -- 慢查询数
SHOW STATUS LIKE 'Innodb_buffer_pool_read_requests';  -- Buffer Pool读请求
SHOW STATUS LIKE 'Innodb_buffer_pool_reads';          -- 磁盘读取次数
```

**2. Performance Schema**：
```sql
-- 启用Performance Schema
UPDATE performance_schema.setup_instruments 
SET ENABLED = 'YES', TIMED = 'YES';

-- 查看最耗时的SQL
SELECT 
    DIGEST_TEXT,
    COUNT_STAR,
    AVG_TIMER_WAIT/1000000000 AS avg_ms
FROM performance_schema.events_statements_summary_by_digest
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;

-- 查看表的I/O统计
SELECT * FROM performance_schema.table_io_waits_summary_by_table
ORDER BY sum_timer_wait DESC LIMIT 10;
```

**3. 慢查询日志**：
```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 1;

-- 分析慢查询
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

**4. SHOW PROCESSLIST**：
```sql
-- 查看当前执行的查询
SHOW FULL PROCESSLIST;

-- 杀死长时间运行的查询
KILL QUERY 12345;
```

**5. 监控工具**：
- **Prometheus + Grafana**：开源监控方案
- **Percona Monitoring and Management (PMM)**：专业MySQL监控
- **MySQL Enterprise Monitor**：官方商业监控
- **Zabbix**：通用监控平台

**关键性能指标（KPI）**：
```
1. QPS（每秒查询数）
2. TPS（每秒事务数）
3. 连接数
4. 慢查询数量
5. Buffer Pool命中率
6. 锁等待时间
7. 复制延迟
8. 磁盘I/O
```

### 32. 什么是MySQL的连接池？

**连接池**是预先创建并维护一定数量的数据库连接，供应用程序重复使用。

**为什么需要连接池**：
```java
// 不使用连接池（性能差）
for (int i = 0; i < 1000; i++) {
    Connection conn = DriverManager.getConnection(url, user, password);
    // 执行SQL
    conn.close();  // 每次都创建和关闭连接，开销大
}

// 使用连接池（性能好）
for (int i = 0; i < 1000; i++) {
    Connection conn = dataSource.getConnection();  // 从池中获取
    // 执行SQL
    conn.close();  // 归还到池中，不是真正关闭
}
```

**常用连接池**：

**1. HikariCP（推荐）**：
```java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:mysql://localhost:3306/mydb");
config.setUsername("root");
config.setPassword("password");
config.setMaximumPoolSize(10);          // 最大连接数
config.setMinimumIdle(5);               // 最小空闲连接数
config.setConnectionTimeout(30000);     // 连接超时
config.setIdleTimeout(600000);          // 空闲超时
config.setMaxLifetime(1800000);         // 最大生命周期

HikariDataSource dataSource = new HikariDataSource(config);
```

**2. Druid**：
```java
DruidDataSource dataSource = new DruidDataSource();
dataSource.setUrl("jdbc:mysql://localhost:3306/mydb");
dataSource.setUsername("root");
dataSource.setPassword("password");
dataSource.setInitialSize(5);           // 初始连接数
dataSource.setMaxActive(20);            // 最大连接数
dataSource.setMinIdle(5);               // 最小空闲连接数
dataSource.setMaxWait(60000);           // 获取连接最大等待时间
dataSource.setValidationQuery("SELECT 1");  // 验证查询
```

**连接池参数配置**：
```properties
# 核心参数
maximumPoolSize=20        # 最大连接数（CPU核心数 * 2 + 磁盘数）
minimumIdle=5             # 最小空闲连接数
connectionTimeout=30000   # 获取连接超时时间（毫秒）
idleTimeout=600000        # 空闲连接超时时间（10分钟）
maxLifetime=1800000       # 连接最大生命周期（30分钟）

# 连接测试
connectionTestQuery=SELECT 1
validationTimeout=5000
```

**连接池监控**：
```java
// HikariCP监控
HikariPoolMXBean poolMXBean = dataSource.getHikariPoolMXBean();
System.out.println("Active: " + poolMXBean.getActiveConnections());
System.out.println("Idle: " + poolMXBean.getIdleConnections());
System.out.println("Total: " + poolMXBean.getTotalConnections());
System.out.println("Waiting: " + poolMXBean.getThreadsAwaitingConnection());
```

### 33. InnoDB和MyISAM的索引实现有什么区别？

**核心区别：聚簇索引 vs 非聚簇索引**

**InnoDB（聚簇索引）**：
```
主键索引（聚簇索引）：
    索引和数据存储在一起
    叶子节点存储完整的行数据
    
    [主键索引树]
         10
       /    \
      5      15
     / \    /  \
   [完整行数据]

二级索引（非聚簇索引）：
    叶子节点存储主键值
    需要回表查询
    
    [name索引树]
       'Bob'
      /     \
   'Alice'  'Carol'
     |        |
    [主键5]  [主键15]
```

**MyISAM（非聚簇索引）**：
```
主键索引：
    索引和数据分开存储
    叶子节点存储数据文件指针
    
    [主键索引树]
         10
       /    \
      5      15
     / \    /  \
   [指针] [指针]
     ↓      ↓
   [数据文件]

二级索引：
    与主键索引结构相同
    都存储数据文件指针
```

**对比**：

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 索引类型 | 聚簇索引 | 非聚簇索引 |
| 主键查询 | 一次查询 | 两次查询（索引+数据） |
| 二级索引查询 | 两次查询（索引+回表） | 两次查询（索引+数据） |
| 数据存储 | 按主键顺序 | 按插入顺序 |
| 表文件 | .ibd（索引+数据） | .MYI（索引）+ .MYD（数据） |

**性能影响**：
```sql
-- InnoDB主键查询（快）
SELECT * FROM users WHERE id = 100;  -- 一次B+树查找

-- InnoDB二级索引查询（需回表）
SELECT * FROM users WHERE name = 'Alice';  
-- 1. name索引查找 -> 得到主键
-- 2. 主键索引查找 -> 得到完整数据

-- MyISAM所有查询都需要两次
SELECT * FROM users WHERE id = 100;
-- 1. 索引查找 -> 得到指针
-- 2. 根据指针读取数据
```

### 34. 什么是自增主键？为什么推荐使用？

**自增主键**是数据库自动生成的递增整数主键。

**定义自增主键**：
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

-- 插入数据时不需要指定id
INSERT INTO users (name) VALUES ('Alice');
INSERT INTO users (name) VALUES ('Bob');
-- id自动为1, 2, 3...
```

**为什么推荐使用**：

**1. 顺序插入，减少页分裂**：
```
使用自增主键：
[1][2][3][4][5] -> 插入6 -> [1][2][3][4][5][6]
顺序插入，不需要移动数据

使用UUID：
[uuid1][uuid3][uuid5] -> 插入uuid2 -> [uuid1][uuid2][uuid3][uuid5]
需要移动数据，页分裂频繁
```

**2. 索引效率高**：
```sql
-- 自增主键：B+树紧凑
-- 范围查询效率高
SELECT * FROM users WHERE id BETWEEN 100 AND 200;

-- UUID：B+树稀疏
-- 范围查询效率低
```

**3. 占用空间小**：
```sql
-- INT：4字节
id INT AUTO_INCREMENT

-- BIGINT：8字节
id BIGINT AUTO_INCREMENT

-- UUID：36字节（字符串）或16字节（BINARY）
id CHAR(36)
```

**4. 性能对比**：
```
插入性能：
- 自增主键：顺序写入，快
- UUID：随机写入，慢

索引大小：
- 自增主键：小
- UUID：大（约3-4倍）

查询性能：
- 自增主键：快
- UUID：慢
```

**自增主键的问题**：

**1. 分布式环境ID冲突**：
```java
// 解决方案1：雪花算法
long id = snowflake.nextId();

// 解决方案2：数据库号段
// 每个服务器分配不同的起始值和步长
// 服务器1：1, 3, 5, 7...
// 服务器2：2, 4, 6, 8...
```

**2. 数据迁移**：
```sql
-- 设置起始值
ALTER TABLE users AUTO_INCREMENT = 10000;
```

**3. 安全问题**：
```
暴露数据量：
/user/1
/user/2
/user/3
可以看出有3个用户

解决：使用业务ID（订单号）而不是自增ID
```

### 35. MySQL的COUNT(*)和COUNT(1)有什么区别？

**结论：在InnoDB中，COUNT(*) 和 COUNT(1) 性能基本相同。**

**COUNT的几种形式**：
```sql
-- 1. COUNT(*)：统计所有行
SELECT COUNT(*) FROM users;

-- 2. COUNT(1)：统计所有行
SELECT COUNT(1) FROM users;

-- 3. COUNT(列名)：统计非NULL的行
SELECT COUNT(name) FROM users;

-- 4. COUNT(DISTINCT 列名)：统计不重复的非NULL行
SELECT COUNT(DISTINCT name) FROM users;
```

**性能对比**：

**InnoDB**：
```sql
-- COUNT(*) 和 COUNT(1) 性能相同
-- 都会选择最小的索引进行扫描
EXPLAIN SELECT COUNT(*) FROM users;
EXPLAIN SELECT COUNT(1) FROM users;
-- 执行计划相同

-- COUNT(列名) 需要判断NULL
SELECT COUNT(name) FROM users;
-- 稍慢，因为需要检查每行的name是否为NULL
```

**MyISAM**：
```sql
-- MyISAM维护了行数，COUNT(*)非常快
SELECT COUNT(*) FROM users;  -- O(1)

-- 但有WHERE条件时，仍需扫描
SELECT COUNT(*) FROM users WHERE age > 18;  -- O(n)
```

**优化COUNT查询**：

**1. 使用覆盖索引**：
```sql
-- 创建索引
CREATE INDEX idx_status ON users(status);

-- 使用覆盖索引
SELECT COUNT(*) FROM users WHERE status = 1;
-- 只扫描索引，不回表
```

**2. 使用近似值**：
```sql
-- 使用EXPLAIN估算
EXPLAIN SELECT * FROM users;
-- rows列显示估算行数

-- 查询统计信息
SELECT TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_NAME = 'users';
```

**3. 维护计数表**：
```sql
-- 创建计数表
CREATE TABLE user_count (
    count INT
);

-- 使用触发器维护
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
UPDATE user_count SET count = count + 1;

-- 查询时直接读取
SELECT count FROM user_count;
```

**4. 使用Redis缓存**：
```java
// 插入用户时
userDao.insert(user);
redis.incr("user:count");

// 查询总数
long count = redis.get("user:count");
```

**实际应用建议**：
```sql
-- 1. 小表（<10万）：直接COUNT
SELECT COUNT(*) FROM small_table;

-- 2. 大表无WHERE：使用统计表或缓存
SELECT count FROM count_cache;

-- 3. 大表有WHERE：优化索引
CREATE INDEX idx_condition ON big_table(condition_column);
SELECT COUNT(*) FROM big_table WHERE condition_column = value;

-- 4. 分页场景：使用游标分页代替COUNT
-- 不要：SELECT COUNT(*) + LIMIT offset
-- 使用：WHERE id > last_id LIMIT 20
```

### 36. 如何处理MySQL的大数据量分页？

**传统分页问题**：
```sql
-- 深度分页性能差
SELECT * FROM users ORDER BY id LIMIT 1000000, 20;
-- 需要扫描1000020行，丢弃前1000000行
```

**优化方案**：

**1. 使用子查询优化**：
```sql
-- 先查ID，再关联
SELECT * FROM users 
WHERE id >= (SELECT id FROM users ORDER BY id LIMIT 1000000, 1)
LIMIT 20;
```

**2. 使用游标分页（推荐）**：
```sql
-- 记录上次最后一条的ID
SELECT * FROM users WHERE id > 1000000 ORDER BY id LIMIT 20;
```

**3. 延迟关联**：
```sql
SELECT * FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 1000000, 20
) AS t ON u.id = t.id;
```

### 37. 什么是MySQL的半同步复制？

**半同步复制**是介于异步复制和全同步复制之间的方案。

**工作原理**：
```
1. 主库执行事务
2. 写入binlog
3. 等待至少一个从库确认接收binlog
4. 返回客户端成功
```

**配置**：
```sql
-- 主库安装插件
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';

-- 从库安装插件
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';

-- 启用半同步
SET GLOBAL rpl_semi_sync_master_enabled = 1;
SET GLOBAL rpl_semi_sync_slave_enabled = 1;
```

### 38. 如何优化INSERT语句？

**优化方法**：

**1. 批量插入**：
```sql
-- 不好
INSERT INTO users VALUES (1, 'A');
INSERT INTO users VALUES (2, 'B');

-- 好
INSERT INTO users VALUES (1, 'A'), (2, 'B'), (3, 'C');
```

**2. 使用LOAD DATA**：
```sql
LOAD DATA INFILE 'data.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';
```

**3. 禁用索引**：
```sql
ALTER TABLE users DISABLE KEYS;
-- 批量插入
ALTER TABLE users ENABLE KEYS;
```

**4. 调整参数**：
```sql
SET autocommit = 0;
-- 批量插入
COMMIT;
```

### 39. MySQL的GROUP BY和HAVING有什么区别？

**区别**：

| 特性 | WHERE | HAVING |
|------|-------|--------|
| 作用时机 | 分组前 | 分组后 |
| 作用对象 | 行 | 组 |
| 可用函数 | 不能用聚合函数 | 可以用聚合函数 |

**示例**：
```sql
SELECT 
    department,
    COUNT(*) as emp_count,
    AVG(salary) as avg_salary
FROM employees
WHERE salary > 5000          -- 过滤行
GROUP BY department
HAVING COUNT(*) > 10;        -- 过滤组
```

### 40. 什么是外键约束？

**外键约束**保证引用完整性。

**创建外键**：
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```

**级联操作**：
- CASCADE：级联删除/更新
- SET NULL：设置为NULL
- RESTRICT：拒绝操作
- NO ACTION：不做任何操作

### 41-60题简要答案

### 41. MySQL的UNION和UNION ALL有什么区别？

**UNION**：合并结果集并去重
**UNION ALL**：合并结果集不去重（性能更好）

```sql
SELECT id FROM users
UNION          -- 去重，慢
SELECT id FROM orders;

SELECT id FROM users
UNION ALL      -- 不去重，快
SELECT id FROM orders;
```

### 42. 如何查看MySQL的执行计划？

使用**EXPLAIN**或**EXPLAIN ANALYZE**：
```sql
EXPLAIN SELECT * FROM users WHERE name = 'Alice';
EXPLAIN ANALYZE SELECT * FROM users WHERE name = 'Alice';
```

### 43. 什么是MySQL的全文索引？

**全文索引**用于文本搜索：
```sql
CREATE FULLTEXT INDEX idx_content ON articles(content);

SELECT * FROM articles 
WHERE MATCH(content) AGAINST('MySQL' IN NATURAL LANGUAGE MODE);
```

### 44. 如何处理MySQL的乱码问题？

**原因**：字符集不一致

**解决**：
```sql
-- 统一使用utf8mb4
ALTER DATABASE mydb CHARACTER SET utf8mb4;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;
SET NAMES utf8mb4;
```

### 45. MySQL的LEFT JOIN和RIGHT JOIN有什么区别？

**LEFT JOIN**：保留左表所有记录
**RIGHT JOIN**：保留右表所有记录

```sql
SELECT * FROM users u LEFT JOIN orders o ON u.id = o.user_id;
-- 返回所有用户，包括没有订单的用户
```

### 46. 什么是MySQL的复合索引？

**复合索引**是包含多个列的索引：
```sql
CREATE INDEX idx_name_age ON users(name, age);
-- 遵循最左前缀原则
```

### 47. 如何进行MySQL的容量规划？

**评估因素**：
1. 数据增长速度
2. 查询QPS
3. 存储空间需求
4. 备份策略
5. 扩展性需求

### 48. 什么是MySQL的查询缓存？

**查询缓存**（MySQL 8.0已移除）：
```sql
-- MySQL 5.7
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 256M;
```

### 49. 如何优化MySQL的配置参数？

**关键参数**：
```ini
innodb_buffer_pool_size = 8G    # 物理内存的50-80%
innodb_log_file_size = 512M
max_connections = 1000
innodb_flush_log_at_trx_commit = 1
```

### 50. 什么是MySQL的事件调度器？

**事件调度器**用于定时任务：
```sql
CREATE EVENT clean_old_data
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM logs WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### 51. 如何处理MySQL的锁等待超时？

**配置超时时间**：
```sql
SET innodb_lock_wait_timeout = 50;  -- 秒
```

### 52. 什么是MySQL的游标？

**游标**用于逐行处理结果集：
```sql
DECLARE cur CURSOR FOR SELECT id FROM users;
OPEN cur;
FETCH cur INTO user_id;
CLOSE cur;
```

### 53. 如何进行MySQL的版本升级？

**步骤**：
1. 备份数据
2. 测试环境验证
3. 检查兼容性
4. 灰度升级
5. 监控观察

### 54. 什么是MySQL的分布式事务？

**XA事务**支持分布式事务：
```sql
XA START 'xid1';
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
XA END 'xid1';
XA PREPARE 'xid1';
XA COMMIT 'xid1';
```

### 55. 如何处理MySQL的主键冲突？

**方法**：
```sql
-- 忽略冲突
INSERT IGNORE INTO users VALUES (1, 'Alice');

-- 更新冲突
INSERT INTO users VALUES (1, 'Alice')
ON DUPLICATE KEY UPDATE name = 'Alice';

-- 替换
REPLACE INTO users VALUES (1, 'Alice');
```

### 56. 什么是MySQL的存储函数？

**存储函数**返回单个值：
```sql
CREATE FUNCTION get_user_name(uid INT)
RETURNS VARCHAR(50)
BEGIN
    DECLARE uname VARCHAR(50);
    SELECT name INTO uname FROM users WHERE id = uid;
    RETURN uname;
END;
```

### 57. 如何进行MySQL的安全加固？

**措施**：
1. 最小权限原则
2. 禁用root远程登录
3. 使用SSL连接
4. 定期更新密码
5. 启用审计日志

### 58. 什么是MySQL的复制延迟？

**复制延迟**是主从数据同步的时间差。

**监控**：
```sql
SHOW SLAVE STATUS\G
-- 查看Seconds_Behind_Master
```

### 59. 如何优化MySQL的磁盘I/O？

**优化方法**：
1. 使用SSD
2. RAID配置
3. 调整innodb_flush_method
4. 增加Buffer Pool
5. 优化SQL减少I/O

### 60. MySQL 8.0有哪些新特性？

**主要新特性**：
1. **窗口函数**：ROW_NUMBER(), RANK()
2. **CTE（公用表表达式）**：WITH子句
3. **JSON增强**：JSON_TABLE()
4. **隐藏索引**：测试索引影响
5. **降序索引**：真正的降序
6. **默认utf8mb4**
7. **原子DDL**
8. **角色管理**

```sql
-- 窗口函数
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as rank
FROM employees;

-- CTE
WITH high_salary AS (
    SELECT * FROM employees WHERE salary > 10000
)
SELECT * FROM high_salary;
```

---

## 总结

本文档涵盖了MySQL面试的60个核心问题，包括：
- **存储引擎和索引**：InnoDB、MyISAM、B+树、索引优化
- **事务和锁**：ACID、隔离级别、MVCC、死锁
- **性能优化**：慢查询、EXPLAIN、分库分表、缓存
- **高可用**：主从复制、读写分离、备份恢复
- **安全**：SQL注入、权限管理、字符集
- **高级特性**：存储过程、触发器、视图、分区表

掌握这些知识点，能够应对大部分MySQL相关的面试问题。

### 41. MySQL的UNION和UNION ALL有什么区别？

### 42. 如何查看MySQL的执行计划？

### 43. 什么是MySQL的全文索引？

### 44. 如何处理MySQL的乱码问题？

### 45. MySQL的LEFT JOIN和RIGHT JOIN有什么区别？

### 46. 什么是MySQL的复合索引？

### 47. 如何进行MySQL的容量规划？

### 48. 什么是MySQL的查询缓存？

### 49. 如何优化MySQL的配置参数？

### 50. 什么是MySQL的事件调度器？

### 51. 如何处理MySQL的锁等待超时？

### 52. 什么是MySQL的游标？

### 53. 如何进行MySQL的版本升级？

### 54. 什么是MySQL的分布式事务？

### 55. 如何处理MySQL的主键冲突？

### 56. 什么是MySQL的存储函数？

### 57. 如何进行MySQL的安全加固？

### 58. 什么是MySQL的复制延迟？

### 59. 如何优化MySQL的磁盘I/O？

### 60. MySQL 8.0有哪些新特性？

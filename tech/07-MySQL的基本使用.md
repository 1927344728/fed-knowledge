## MySQL的基本使用

**数据库（Database）**是按照数据结构来组织、存储和管理数据的仓库。每个数据库都有一个或多个不同的 API 用于创建、访问、管理、搜索和复制所保存的数据。

我们也可以将数据存储在文件中，但是在文件中读写数据速度相对较慢。

**SQL（Structured Query Language，结构化查询语言）**是用于访问数据库的标准化语言。它包含三个部分：

* 数据定义语言：定义数据库及其对象的语句，例如表，视图，触发器，存储过程等。
* 数据操作语言：允许您更新和查询数据的语句。
* 数据控制语言：允许授予用户权限访问数据库中特定数据的权限。

**MySQL** 是最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 是最好的 RDBMS(Relational Database Management System：关系数据库管理系统)应用软件之一。

**关系型数据库**是建立在关系模型基础上的数据库，借助于集合代数等数学概念和方法来处理数据库中的数据。RDBMS 的特点：

- 数据以表格的形式出现
- 每行为各种记录名称
- 每列为记录名称所对应的数据域
- 许多的行和列组成一张表单
- 若干的表单组成 database

### 安装MySQL（Mac）

查看是否安装 MySQL： `where mysql`。

#### 安装

* **下载安装包：**打开网址 http://dev.mysql.com/downloads/mysql/ ， 下载安装包（根据系择对应包。Mac，建议下载 dmg 安装包）。

* **安装：** 双击 `.dmg` 文件，加载镜像；双击 `.pkg` ，开始安装。

  **!! 注意：** 安装完成之后会弹出一个对话框，告诉我们生成了一个 root 账户的临时密码。请注意保存，否则重设密码会比较麻烦。

* **启动MySQL：** 打开系统偏好设置，会发现多了一个 MySQL 图标，点击它，会进入 MySQL 的设置界面。

  ![image-20210903152708951](https://tva1.sinaimg.cn/large/008i3skNly1gu3gznsv83j612z0jd76m02.jpg)

#### 终端连接MySQL

**添加环境变量：** `PATH="$PATH":/usr/local/mysql/bin`（可能需要重启才能生效）

**连接：** ``mysql -h hostname|hostIP -p port -u username -p [数据库名] [-e "SQL语句"]``，然后输入密码（密码就是前面自动生成的临时密码）。

- -h：指定连接 MySQL 服务器的地址。可以用两种方式表示，hostname 为主机名，hostIP 为主机 IP 地址；
- -p：指定连接 MySQL 服务器的端口号，port 为连接的端口号。默认端口号是 3306；
- -u：指定连接 MySQL 服务器的用户名；
- -p：提示输入密码，即提示 Enter password；
- 数据库名：指定连接到 MySQL 服务器后，登录到哪一个数据库中。默认为 mysql 数据库；
- -e：指定需要执行的 SQL 语句，登录 MySQL 服务器后执行这个 SQL 语句，然后退出 MySQL 服务器。

```shell
mysql -h 127.0.0.1 -u root -p
mysql -h 127.0.0.1 -uroot -p
mysql -h localhost -u root -p
mysql -uroot -p
```

**退出：** `exit` 或 `quit`。

#### 彻底删除Mysql（Mac）

如果是通过 HomeBrew 安装的，先执行下 `brew uninstall mysql`。
如果是通过安装包安装的，那就在 【系统偏好设置】里卸载。

再执行下列命令：

```shell
sudo rm /usr/local/mysql
sudo rm -rf /usr/local/mysql*
sudo rm -rf /Library/StartupItems/MySQLCOM
sudo rm -rf /Library/PreferencePanes/My*
rm -rf ~/Library/PreferencePanes/My*
sudo rm -rf /Library/Receipts/mysql*
sudo rm -rf /Library/Receipts/MySQL*
sudo rm -rf /var/db/receipts/com.mysql.*
```

不同的安装方式有些东西的存储位置不一样，删除完检查一下下面这些文件是否删除了，没有的话则删除掉：

```shell
/usr/local/Cellar/[mysql文件]
/usr/local/var/[mysql文件]
/tmp/[mysql.sock|mysql.sock.lock|my.cnf]
/usr/local/var/mysql/[pid文件|err文件]
/usr/local/Library/Cache/Homebrew/[brew安装的安装包]
```

最后执行一下`brew cleanup`。

### 修改ROOT密码

#### 使用mysqladmin命令在命令行指定新密码

**语法：** `mysqladmin -u [username] -h [hostname] -p password "newpassword";`

语法参数说明如下：

- usermame：指需要修改密码的用户名称，在这里指定为 root 用户；
- hostname：指需要修改密码的用户主机名，该参数可以不写，默认是 localhost；
- password：关键字，而不是指旧密码；
- newpassword：新设置的密码，必须用双引号括起来。如果使用单引号会引发错误，可能会造成修改后的密码不是你想要的。

输入 `mysqladmin` 命令后，按回车键，然后输入 root 用户原来的密码。

#### 使用ALTER修改root用户密码

**语法：** `alter user 'root'@'localhost' identified with mysql_native_password by 'newpassword';`

修改后，执行 `FLUSH PRIVILEGES` 刷新权限。

> 注：在 MySQL 8.04 前，执行：SET PASSWORD=PASSWORD("newpassword")；但是 MySQL8.0.4 开始，这样默认是不行的。因为之前，MySQL 的密码认证插件是 `mysql_native_password`，而现在使用的是 `caching_sha2_password`。

#### 忘记ROOT密码

* 系统偏好设置 -> 最下边点 MySQL，在弹出页面中，关闭服务

* 进入终端输入：`cd /usr/local/mysql/bin/`

* 登录管理员权限：`sudo su`

* 禁止 Mysql 验证功能：`./mysqld_safe --skip-grant-tables &`。回车后 Mysql 会自动重启

* 修改密码：

  ```shell
  mysql -u root mysql
  SET PASSWORD FOR 'root'@'localhost' = PASSWORD('new_password');
  FLUSH PRIVILEGES
  ```

### 用户管理

查看用户：

```shell
SELECT * FROM `mysql`.`user`;
SELECT user FROM `mysql`.`user`;
```

创建用户：

**语法：** `CREATE USER '[username]'@'[host]' IDENTIFIED BY 'password';`

* username：你将创建的用户名；

* host：指定该用户在哪个主机上可以登陆，如果是本地用户可用 localhost，如果在创建的过程中，只给出了用户名，而没指定主机名，那么主机名默认为“%”，表示一组主机，即对所有主机开放权限；
* password：表示用户登录时使用的密码，需要用单引号括起来。密码可以为空，如果为空则该用户可以不需要密码登陆服务器。

CREATE USER 语句可以同时创建多个用户，多个用户用逗号隔开。如果两个用户的用户名相同，但主机名不同，MySQL 会将它们视为两个用户，并允许为这两个用户分配不同的权限集合。

```shell
CREATE USER 'test1'@'localhost' IDENTIFIED BY '123456';
```

修改用户：

**语法：** `RENAME USER [oldUser] TO [newUser]`

```shell
RENAME USER 'test2'@'localhost' TO 'test3'@'localhost';
```

用户权限管理：

* 查看用户权限

  ```shell
  SHOW GRANTS;
  SHOW GRANTS FOR 'test1'@'localhost';
  ```

* 修改用户权限：

  **语法：** `GRANT priv_type [column_list] ON database.table TO user [WITH with_option];`

  * priv_type：表示权限类型。多个权限类型，用逗号隔开；
  * columns_list：表示权限作用于哪些列上，省略该参数时，表示作用于整个表；
  * database.table：用于指定数据库和表；
  * user：表示用户账户，由用户名和主机名构成，格式是“'username'@'hostname'”。多个用户，用逗号隔开；
  * with_option：指定其他参数。如：GRANT OPTION, 被授权的用户可以将这些权限赋予给别的用户。

  ```shell
  GRANT SELECT ON *.* TO 'test1'@'localhost';
  GRANT SELECT,INSERT ON *.* TO 'test1'@'localhost','test2'@'localhost';
  GRANT SELECT ON *.* TO 'test1'@'localhost' WITH GRANT OPTION;
  ```

* 删除用户权限：

  **语法：** `REVOKE priv_type [column_list] ON database.table FROM user; `

  ```shell
  REVOKE SELECT ON *.* FROM 'test1'@'localhost';
  REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'test1'@'localhost';
  ```

* 修改用户密码：

  **语法：** `ALTER USER user IDENTIFIED WITH mysql_native_password BY 'newpassword';`

  ```shell
  ALTER USER 'test1'@'localhost' IDENTIFIED WITH mysql_native_password BY '1111';
  ```

* 删除用户：

  **语法：** `DROP USER '[username]'@'[host]'`

  ```shell
  DROP USER 'test3'@'localhost';
  DELETE FROM mysql.user WHERE Host='localhost' AND User='test3';
  ```

### 数据库管理

显示数据库：

```shell
SHOW DATABASES;
SHOW DATABASES LIKE '%book%'; #查看名字中包含 book 的数据库
SHOW DATABASES LIKE 'book%'; #查看名字以 book 开头的数据库
SHOW DATABASES LIKE '%book'; #查看名字以 book 结尾的数据库
```

创建库：

```shell
CREATE DATABASE <databaseName>;
CREATE DATABASE IF NOT EXISTS <databaseName>;
```

删除库：

```shell
DROP DATABASE <databaseName>;
DROP DATABASE IF EXISTS <databaseName>;
```

使用库（选中库）：

```shell
USE <databaseName>;
```

存储引擎：

```shell
#查看系统所支持的引擎类型
SHOW ENGINES;
#查看默认存储引擎
SHOW VARIABLES LIKE 'default_storage_engine%';
#修改数据库临时的默认存储引擎。注意，当再次重启客户端时，默认存储引擎仍然是 InnoDB。
SET default_storage_engine=< 存储引擎名 >
```



### 数据表管理

显示数据表：

```shell
# 先用use选定数据库
SHOW TABLES;
```

显示表结构：

```shell
DESCRIBE <tableName>;
DESC <tableName>;
```

创建表：

**语法：**  `CREATE TABLE <表名> ([表定义选项])[表选项][分区选项];`

CREATE TABLE 命令语法比较多，其主要是由表创建定义（create-definition）、表选项（table-options）和分区选项（partition-options）所组成的。

表定义选项由列名（col_name）、列的定义（column_definition）以及可能的空值说明、完整性约束或表索引组成。

```shell
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` bigint(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `author` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `language` int(2) DEFAULT '1',
  `type` int(2) DEFAULT '1',
  `publishing` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cover` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `details` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `vipprice` decimal(10,2) DEFAULT '0.00',
  `stock` int(10) DEFAULT '0',
  `state` int(2) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

显示创建表的DDL语句：

```shell
SHOW CREATE TABLE `test`;
```

复制表：

```shell
# 含有主键等信息的完整表结构
CREATE TABLE `test` LIKE `book`;
# 表结构+所有（或部分）数据，但没有主键等信息
CREATE TABLE `test` SELECT * FROM `book`;
CREATE TABLE `test` SELECT * FROM `book` WHERE id=1;
CREATE TABLE `test` AS (SELECT * FROM `book`);
CREATE TABLE `test` AS (SELECT * FROM `book` WHERE id=1);
```

修改表：

**语法：** `ALTER TABLE <表名> [修改选项]`

修改选项的语法格式如下：

```shell
ADD [COLUMN] <列名> <类型>
CHANGE [COLUMN] <旧列名> <新列名> <新列类型>
ALTER [COLUMN] <列名> { SET DEFAULT <默认值> | DROP DEFAULT }
MODIFY [COLUMN] <列名> <类型>
DROP [COLUMN] <列名>
RENAME TO <新表名>
CHARACTER SET <字符集名>
COLLATE <校对规则名>
```

```shell
ALTER TABLE `test` ADD COLUMN `col_t1` int;
ALTER TABLE `test` CHANGE COLUMN `col_t1` `col_t2` char;
ALTER TABLE `test` ALTER COLUMN `col_t2` SET DEFAULT 'a';
ALTER TABLE `test` ALTER COLUMN `col_t2` DROP DEFAULT;
ALTER TABLE `test` MODIFY COLUMN `col_t2` char(10);
ALTER TABLE `test` DROP COLUMN `col_t2`;
ALTER TABLE `test` RENAME TO `test_2`;
ALTER TABLE `test_2` CHARACTER SET `gb2312`;
ALTER TABLE `test_2` COLLATE `gb2312_chinese_ci`;
ALTER TABLE `test_2` CHARACTER SET `utf8mb4` DEFAULT COLLATE `utf8mb4_general_ci`;
```

导入旧表数据：

```shell
INSERT INTO `test` SELECT * FROM `book`;
INSERT INTO `test` SELECT * FROM `book` WHERE id=1;
```

清空表数据：

```shell
EMPTY TABLE <tableName>;
TRUNCATE TABLE <tableName>;
```

empty 是清空表里的数据；truncate 是删除表，然后再创建这张表。对于主索引自动增加的情况，empty 清表后，新添加的行数据依然在上次的值上增加；而 truncate 则会重新从1开始。

删除表：

```shell
DROP TABLE <tableName>;
DROP TABLE IF EXISTS <tableName>;
```



### 表中数据操作

#### SELECT语法

```shell
SELECT [DISTINCT] *|<字段列名> FROM <表1>,<表2>
[
  [WHERE <表达式>]
  [GROUP BY <字段>,<字段>]
  [HAVING <表达式>]
  [ORDER BY <字段, [ASC|DESC]>, <字段, [ASC|DESC]> ]
  [LIMIT [初始位置] <记录数>]
]
```

- `DISTINCT`： 对数据表中一个或多个字段重复的数据进行过滤。只能在 SELECT 语句中使用且必须在所有字段的最前面，后面有多个字段，则会对多个字段进行组合去重，也就是说，只有多个字段组合起来完全是一样的情况下才会被去重；

- `*|<字段列名>`： 包含星号通配符的字段列表，表示所要查询字段的名称，多个字段时用逗号隔开；

- `FROM <表1>,<表2>…`： 表1 、表2 表示查询数据的来源，多个表时用逗号隔开；；

- `WHERE <表达式>`： 可选项，限定查询数据必须满足该查询条件；

  ```shell
  SELECT * FROM `test` WHERE `id`<5;
  
  SELECT * FROM `test` WHERE `name` LIKE '阿%';
  SELECT * FROM `test` WHERE `name` LIKE '%阿';
  SELECT * FROM `test` WHERE `name` LIKE '%阿%';
  
  SELECT * FROM `test` WHERE `name` REGEXP '^阿';
  SELECT * FROM `test` WHERE `name` REGEXP '(九|英)$';
  ```

- `GROUP BY <字段>`： 可选项，如何显示查询出来的数据，并按照指定的字段分组，多个字段时用逗号隔开；

  ```shell
  # 使用 GROUP BY, SELECT 后的字段名必须是 GROUP BY 字段名中有的, 或者是使用函数生成的数据
  SELECT `language`, GROUP_CONCAT(name), COUNT(language) FROM test GROUP BY `language`;
  # WITH POLLUP 用来在所有记录的最后加上一条记录，这条记录是上面所有记录的总和
  SELECT `language`, GROUP_CONCAT(name), COUNT(language) FROM test GROUP BY `language` WITH ROLLUP;
  ```

- `HAVING`： 可选项。HAVING 关键字和 WHERE 关键字都可以用来过滤数据，且 HAVING 支持 WHERE 关键字中所有的操作符和语法。但是 WHERE 和 HAVING 关键字也存在以下几点差异：

  * 一般情况下，WHERE 用于过滤数据行，而 HAVING 用于过滤分组；
  * WHERE 查询条件中不可以使用聚合函数，而 HAVING 查询条件中可以使用聚合函数；
  * WHERE 在数据分组前进行过滤，而 HAVING 在数据分组后进行过滤；
  * WHERE 针对数据库文件进行过滤，而 HAVING 针对查询结果进行过滤。也就是说，**WHERE 根据数据中的字段直接进行过滤，而 HAVING 是根据前面已经查询出的字段进行过滤**；
  * WHERE 查询条件中不可以使用字段别名，而 HAVING 查询条件中可以使用字段别名；

  注：能用 WHERE 的情况下，尽量用 WHERE。HAVING 是在已经获取到的结果集中再筛选数据，无法使用索引，性能通常会更差一些。

  ```shell
  #WHERE 查询条件中不可以使用聚合函数，而 HAVING 查询条件中可以使用聚合函数
  SELECT `language`, GROUP_CONCAT(name), COUNT(language), AVG(price) FROM book GROUP BY `language` HAVING AVG(price)>40;
  
  #假设表中有100条记录，以下语句执行可看出：WHERE 只需过滤1条记录，HAVING 则需过滤全部（100条）记录
  explain SELECT * FROM book where id=10;
  explain SELECT * FROM book HAVING id=10;
  ```

- `ORDER BY`：  可选项，按什么样的顺序显示查询出来的数据。可以进行的排序有升序（ASC）和降序（DESC），默认情况下是升序；多个字段时用逗号隔开；

- `LIMIT`： 可选项，每次显示查询出来的数据条数。[初始位置]表示从哪条记录开始显示，可不传，默认从0开始；<记录数> 表示显示记录的条数。

  ```shell
  #下面两条SQL语句，返回结果是一样的
  SELECT * FROM `test` LIMIT 3,5;
  SELECT * FROM `test` LIMIT 5 OFFSET 3;
  ```

#### INSERT语法

使用 INSERT 语句向数据库已有的表中插入一行或者多行元组数据。INSERT 语句有两种语法形式，分别是 INSERT…VALUES 语句和 INSERT…SET 语句。

**语法：** `INSERT INTO <表名> [<列名1>,<列名2>,...] VALUES (值1,值2,...)[,(值1,值2,...)]`

**语法：** `INSERT INTO <表名> SET <列名1>=<值1>[,<列名2>=<值2>,...]`

使用 INSERT...VALUE 插入数据时，允许列名称列表为空，此时值列表中需要为表的每一个字段指定值，并且值的顺序必须和数据表中字段定义时的顺序相同。

```shell
INSERT INTO `test` (`account`, `password`, `name`, `sex`, `mobile`) VALUES ('a1', 'p1', 'n1', 1, 13011112222);
INSERT INTO `test` VALUES (null, 'a2', 'p2', 'n2', 1, 648399600000, '', 4, '地址2', 13011112222, 0, NULL, NULL, 1);

#复制数据
INSERT INTO `test` SELECT * FROM `user`;
```

```shell
INSERT INTO `test` SET `account` = 'a3', `password` = 'p3', `name` = 'n3', `sex` = 2, `mobile` = 13011113333;
```

#### UPDATE语法

使用 UPDATE 语句来修改、更新一个或多个表的数据。

**语法：** `UPDATE <表名> SET 字段 1=值 1 [,字段 2=值 2… ] [WHERE 子句 ] [ORDER BY 子句] [LIMIT 子句]`

- `WHERE` 子句：可选项。用于限定表中要修改的行。若不指定，则修改表中所有的行；
- `ORDER BY` 子句：可选项。用于限定表中的行被修改的次序；
- `LIMIT` 子句：可选项。用于限定被修改的行数。

```shell
UPDATE `test` SET `address`="更新地址1";
UPDATE `test` SET `address`="更新地址2" WHERE `id`>15 ORDER BY `id` DESC LIMIT 2;
```

#### DELETE语法

使用 DELETE 语句来删除表的一行或者多行数据。

**语法：** `DELETE FROM <表名> [WHERE 子句] [ORDER BY 子句] [LIMIT 子句]`

- `WHERE` 子句：可选项。表示为删除操作限定删除条件，若省略该子句，则代表删除该表中的所有行；
- `ORDER BY` 子句：可选项。表示删除时，表中各行将按照子句中指定的顺序进行删除；
- `LIMIT` 子句：可选项。用于告知服务器在控制命令被返回到客户端前被删除行的最大值。

```shell
DELETE FROM test;
DELETE FROM test WHERE id=16;
DELETE FROM test WHERE id>15 ORDER BY id DESC LIMIT 1;
```

#### 多表查询

在 MySQL 中，多表查询主要有交叉连接、内连接和外连接。

##### 交叉连接

交叉连接（CROSS JOIN）一般用来返回连接表的笛卡尔积。

**语法：** `SELECT <字段名> FROM <表1> CROSS JOIN <表2> [WHERE子句]` 或者 `SELECT <字段名> FROM <表1>, <表2> [WHERE子句] `

如果在交叉连接时使用 WHERE 子句，MySQL 会先生成两个表的笛卡尔积，然后再选择满足 WHERE 条件的记录。因此，表的数量较多时，交叉连接会非常非常慢。一般情况下不建议使用交叉连接。

```shell
SELECT * FROM `bookOrder`,`user`;
SELECT * FROM `bookOrder`,`user` WHERE `bookOrder`.userId=`user`.id;
```

##### 内连接

内连接（INNER JOIN）主要通过设置连接条件的方式，来移除查询结果中某些数据行的交叉连接。简单来说，就是利用条件表达式来消除交叉连接的某些数据行。

内连接使用 **INNER JOIN** 关键字连接两张表，并使用 ON 子句来设置连接条件。如果没有连接条件，INNER JOIN 和 CROSS JOIN 在语法上是等同的，两者可以互换。

INNER JOIN 也可以使用 WHERE 子句指定连接条件，但是 INNER JOIN ... ON 语法是官方的标准写法，而且 WHERE 子句在某些时候会影响查询的性能。

**语法：** `SELECT <字段名> FROM <表1> [INNER] JOIN <表2> [ON子句]`

```shell
SELECT * FROM `bookOrder` JOIN `user`;
SELECT * FROM `bookOrder` JOIN `user` ON `bookOrder`.userId=`user`.id;
```

##### 外连接

外连接可以分为左外连接和右外连接。

多个表左/右连接时，在 ON 子句后连续使用 LEFT/RIGHT OUTER JOIN 或 LEFT/RIGHT JOIN 即可。

* **左外连接：** 又称为左连接，使用 **LEFT OUTER JOIN** 关键字连接两个表，并使用 ON 子句来设置连接条件。

  **语法：** `SELECT <字段名> FROM <表1> LEFT [OUTER] JOIN <表2> <ON子句>`

  “表1”为基表，“表2”为参考表。左连接查询时，可以查询出“表1”中的所有记录和“表2”中匹配连接条件的记录。如果“表1”的某行在“表2”中没有匹配行，那么在返回结果中，“表2”的字段值均为空值（NULL）。

  ```shell
  SELECT * FROM `bookOrder` LEFT JOIN `user` ON `bookOrder`.userId=`user`.id;
  ```

* **右外连接：** 又称为右连接，右连接是左连接的反向连接。使用 **RIGHT OUTER JOIN** 关键字连接两个表，并使用 ON 子句来设置连接条件。

  **语法：** `SELECT <字段名> FROM <表1> RIGHT [OUTER] JOIN <表2> <ON子句>`

  与左连接相反，右连接以“表2”为基表，“表1”为参考表。右连接查询时，可以查询出“表2”中的所有记录和“表1”中匹配连接条件的记录。如果“表2”的某行在“表1”中没有匹配行，那么在返回结果中，“表1”的字段值均为空值（NULL）。

  ```shell
  SELECT * FROM `bookOrder` RIGHT JOIN `user` ON `bookOrder`.userId=`user`.id;
  ```

#### 子查询

子查询指将一个查询语句嵌套在另一个查询语句中。子查询可以在 SELECT、UPDATE 和 DELETE 语句中使用，而且可以进行多层嵌套；子查询可以被嵌套在 SELECT 语句的列、表和查询条件中，即 SELECT 子句，FROM 子句、WHERE 子句、GROUP BY 子句和 HAVING 子句。

**语法：** `WHERE <表达式> <操作符> (子查询)`

其中，操作符可以是比较运算符和 IN、NOT IN、EXISTS、NOT EXISTS 等关键字。IN 判断当表达式与子查询返回的结果集中的某个值是否相等；EXISTS 判断子查询的结果集是否为空。

```shell
#子查询只允许返回一个字段
SELECT `bookName`,`author`,`userId`,`userName` FROM `bookOrder` WHERE `userId` in (SELECT `id` from `user` WHERE `id`<7);
```



### MySQL索引

索引就是根据表中的一列或若干列按照一定顺序建立的列值与记录行之间的对应关系表，实质上是一张描述索引列的列值与原表中记录行之间一 一对应关系的有序表。

通过索引，查询数据时不用读完记录的所有信息，而只是查询索引列。否则，数据库系统将读取每条记录的所有信息进行匹配。

可以把索引比作新华字典的音序表。例如，要查“库”字，如果不使用音序，就需要从字典的 400 页中逐页来找。但是，如果提取拼音出来，构成音序表，就只需要从 10 多页的音序表中直接查找。这样就可以大大节省时间。

**原理：** 对表建立一个索引，查找数据时可以直接根据该列上的索引找到对应记录行的位置，从而快捷地查找到数据。索引存储了指定列数据值的指针，根据指定的排序顺序对这些指针排序。

**优缺点：** 索引可以提高查询速度，但是会影响插入、删除、更新记录的速度。因为，向有索引的表中插入、删除、更新记录时，数据库系统会按照索引进行排序，这样就降低了操作记录的速度，插入大量记录时的速度影响会更加明显。

创建索引：

**语法：** `CREATE [索引类型] <索引名> ON <表名> (<列名> [<长度>] [ ASC | DESC])`

- `<索引类型>`：  指定要创建索引的类型，`PRIMARY | UNIQUE | FULLTEXT | SPATIAL`，默认 `NORMAL`。
- `<列名>`： 指定要创建索引的列名。通常可以考虑将查询语句中在 JOIN 子句和 WHERE 子句里经常出现的列作为索引列。
- `<长度>`： 可选项。指定使用列前的 length 个字符来创建索引。索引列的长度有一个最大上限 255 个字节（MyISAM 和 InnoDB 表的最大上限为 1000 个字节），如果索引列的长度超过了这个上限，就只能用列的前缀进行索引。另外，BLOB 或 TEXT 类型的列也必须使用前缀索引。
- `ASC|DESC`： 可选项。`ASC` 指定索引按照升序来排列，`DESC` 指定索引按照降序来排列，默认为 `ASC`。

```shell
CREATE INDEX `idx_name` ON `test` (`name` DESC);
ALTER TABLE `test` ADD INDEX `idx_name` (`name` DESC);
```

查看索引：

**语法：** `SHOW INDEX FROM <表名> [FROM <数据库名>]`

```shell
SHOW INDEX FROM `test`;
```

删除索引：

**语法：** `DROP INDEX <索引名> ON <表名>`;

```shell
DROP INDEX idx_name ON `test`
ALTER TABLE `test` DROP INDEX `idx_name`;
```

修改索引：在 MySQL 中并没有提供修改索引的直接指令，一般情况下，我们需要先删除掉原索引，再根据需要创建一个同名的索引，从而变相地实现修改索引操作。



### MySQL常用函数

* avg()： 计算一组值或表达式的平均值。
* count()： 计算表中的行数。
* instr()： 返回子字符串在字符串中第一次出现的位置。
* sum()： 计算一组值或表达式的总和。
* min()：在一组值中找到最小值。
* max()： 在一组值中找到最大值。
* group_concat()： 将字符串从分组中连接成具有各种选项（如：DISTINCT，ORDER BY 和 SEPARATOR）的字符串。
* concat：将两个或多个字符串组合成一个字符串。
* length、char_length()：以字节和字符获取字符串的长度。
* replace：搜索并替换字符串中的子字符串。
* substring：从具有特定长度的位置开始提取一个子字符串。



### 相关问题

##### SQL主要关键字的执行顺序

```shell
FROM
ON
JOIN
WHERE
GROUP BY
HAVING
SELECT
DISTINCT
UNION
ORDER BY
```

##### 交叉连接 WHERE 和 内连接的 ON  的区别？

数据库表连接数据行匹配时所遵循的算法就是以上提到的笛卡尔积，表与表之间的连接可以看成是在做乘法运算。

我们来看以下两个 SQL 语句：

```shell
SELECT * FROM `bookOrder`,`user` WHERE `bookOrder`.userId=`user`.id
SELECT * FROM `bookOrder` JOIN `user` ON `bookOrder`.userId=`user`.id
```

第一条 SQL 语句的执行流程：

* FROM 语句把 bookOrder 表和 user 表从数据库文件加载到内存中；

* 对两张表做了乘法运算，把 bookOrder 表中的每一行记录按照顺序和 user 表中记录依次匹配，得到了一张有（bookOrder 表中记录数 × user 表中记录数）条的临时表，称为‘笛卡尔积表’。 
* WHERE 语句在笛卡尔积表中筛选出满足 WHERE 条件的记录。

第二条 SQL 语句的执行流程：

* FROM 语句把 bookOrder 表和 user 表从数据库文件加载到内存中；
* ON 语句的执行是在 JOIN 语句之前的，也就是说两张表数据行之间进行匹配的时候，会先判断数据行是否符合 ON 语句后面的条件，再决定是否 JOIN 。

由此可见，当两张表的数据量比较大，又需要连接查询时，**交叉连接 WHERE** 会在内存中先生成一张数据量比较大的笛卡尔积表，增加了内存的开销。

在 MySQL 中，多表查询一般使用内连接和外连接，它们的效率要高于交叉连接。



### 参考资料

[Mysql教程（C语言中文网）](http://c.biancheng.net/mysql/)
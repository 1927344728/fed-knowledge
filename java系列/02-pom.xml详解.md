## pom.xml详解

POM， 项目对象模型（Project Object Model），是 maven 的配置文件，用以描述项目的各种信息。

pom.xml 文件用于管理源代码、配置文件、开发者的信息和角色、问题追踪系统、组织信息、项目授权、项目的url、项目的依赖关系等等。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- The Basics -->
    <groupId></groupId>
    <artifactId></artifactId>
    <version></version>
    <packaging></packaging>
    <dependencies></dependencies>
    <parent></parent>
    <dependencyManagement></dependencyManagement>
    <modules></modules>
    <properties></properties>

    <!-- Build Settings -->
    <build>...</build>
    <reporting>...</reporting>

    <!-- More Project Information -->
    <name>...</name>
    <description>...</description>
    <url>...</url>
    <inceptionYear>...</inceptionYear>
    <licenses>...</licenses>
    <organization>...</organization>
    <developers>...</developers>
    <contributors>...</contributors>

    <!-- Environment Settings -->
    <issueManagement>...</issueManagement>
    <ciManagement>...</ciManagement>
    <mailingLists>...</mailingLists>
    <scm>...</scm>
    <prerequisites>...</prerequisites>
    <repositories>...</repositories>
    <pluginRepositories>...</pluginRepositories>
    <distributionManagement>...</distributionManagement>
    <profiles>...</profiles>
</project>
```

### 基本配置

* **project**：pom.xml 中描述符的根。
* **modelVersion**：指定 pom.xml 符合哪个版本的描述符。maven 2 和 3 只能为 4.0.0。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>zhao.example</groupId>
    <artifactId>java-demo</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>war</packaging>
</project>
```

在 maven 中，根据 groupId、artifactId、version 组合成 groupId:artifactId:version 来唯一识别一个 jar 包。

* **groupId**：团体、组织的标识符。该标识符的约定是，以创建项目的组织名称的逆向域名开头。如：`example.zhao.com`，groupI 为 `com.zhao.examp`。
* **artifactId**：项目的唯一标识符。**注：**不要在该标识符包含点号（.）。
* **version**：项目的版本。一般是：`${majorVersion}.${minorVersion}.${incrementalVersion}-${qualifier}` ，如：`1.0.0-SNAPSHOT`。major、minor、incremental 部分用数字，qualifier 部分用字符串。
  * **SNAPSHOT**：表示不稳定的版本，一般用于开发过程中。
  * **LATEST**：最新发布版（可能是一个发布版，也可能是一个 snapshot 版，具体看哪个时间最后）。
  * **RELEASE** ：最后一个发布版。
* **packaging**：项目打包后的输出类型，默认是 jar。常见类型：pom、jar、maven-plugin、ejb、war、ear、rar、par。

### 依赖配置

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-embedder</artifactId>
        <version>2.0</version>
        <type>jar</type>
        <scope>test</scope>
        <optional>true</optional>
        <exclusions>
            <exclusion>
                <groupId>org.apache.maven</groupId>
                <artifactId>maven-core</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>
```

* **groupId、artifactId、version**：和基本配置中的 groupId、artifactId、version 意义相同。
* **type**：基本配置中的 packaging，默认为 jar。
* **scope**：任务的类路径（编译、运行时、测试等）以及如何限制依赖关系的传递性。有 5 种限定范围：
  * compile：默认范围。表示编译依赖关系在所有 classpath 中都可用。此外，这些依赖关系被传播到依赖项目。
  * provided：与 compile 类似，但是表示希望 jdk 或容器在运行时提供它。它只适用于编译和测试  classpath，不可传递。
  * runtime：表示编译不需要依赖关系，而是用于执行。它是在运行时和测试 classpath，但不是编译 classpath。
  * test：表示正常使用应用程序不需要依赖关系，仅适用于测试编译和执行阶段。它不是传递的。
  * system：与 provided 类似，除了必须提供明确包含它的 jar。该 artifact 始终可用，并且不是在仓库中查找。

* **systemPath**：仅当依赖范围是 system 时才使用。否则，如果设置此元素，构建将失败。该路径必须是绝对路径，因此建议使用 propertie 来指定特定的路径，如：`${java.home}/lib`。
* **optional**：让其他项目知道，当使用此项目时，不需要这种依赖性也能正常工作。
* **exclusions**：指定一个或多个排除元素，每个元素都包含 groupId、artifactId，表示要排除的依赖项。与 optional 不同（optional 可以安装也可以不安装和使用），排除会主动地从依赖树中删除构件。如：maven-embedder 依赖于 maven-core，假设想依赖 maven-embedder，但不想在类路径中包含 maven-core 或它的依赖项。

### parent

maven 支持继承功能。子 POM 可以使用 parent 指定父 POM ，然后继承其配置。

```xml
<parent>
    <groupId>zhao.example</groupId>
    <artifactId>java-common</artifactId>
    <version>1.0.0</version>
    <relativePath></relativePath>
</parent>
```

* **relativePath**：在搜索本地和远程存储库之前，它不是必需的，但可以用作 maven 的指示符，以首先搜索给定该项目父级的路径。

### dependencyManagement

dependencyManagement 是表示依赖 jar 包的声明。即使项目中的 dependencyManagement 下声明了依赖，maven 不会加载该依赖，其声明可以被子 POM 继承。

dependencyManagement 的一个使用案例是：父项目中可以利用 dependencyManagement 声明子项目中需要用到的依赖 jar 包，之后，当某个或者某几个子项目需要加载该依赖的时候，就可以在子项目中 dependencies 节点只配置 groupId 和 artifactId 就可以完成依赖的引用。

dependencyManagement 主要是为了统一管理依赖包的版本，确保所有子项目使用的版本一致，类似的还有plugins 和 pluginManagement。

### modules

modules 标签用于声明当前 Maven 项目包含的模块子项目，每个子项目都是一个独立的 Maven 项目，具有自己的 pom.xml 文件，可以进行独立构建和测试。

```xml
<modules>
    <module>project-one</module>
    <module>project-two</module>
    <module>project-three/pom-example.xml</module>
</modules>
```

### properties

属性列表。定义的属性可以在 pom.xml 文件中任意处使用。使用方式为 `${propertie}` 。

```xml
<properties>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
</properties>
```

* **env.X**：返回 shell 的环境变量。如：`${env.PATH}`，表示 PATH 环境变量。虽然环境变量本身在 Windows 上不区分大小写，但 property 的查找是区分大小写的。即，Windows shell 为 %PATH% 和 %Path% 返回相同的值，但 Maven 区分了 ${env.PATH} 和 ${env.Path}。
* **project.x**：POM 中以点号（.）表示的路径将包含相应元素的值。如：`<project><version>1.0</version></project>`，可以通过 `${project.version}` 来访问。
* **settings.x**：settings.xml 中以点号（.）表示的路径将包含相应元素的值。如：`<settings><offline>false</offline></settings>`，可通过 `${settings.offline}` 访问。
* **Java 系统属性**：通过 java.lang.System.getProperties() 访问的所有属性都可以作为 POM property 使用。如：`${java.home}`。
* **x**：在 POM 中的 `<properties/>`元素内设置。如：`<properties><someVar>value</someVar></properties>`，可通过 `${someVar}` 访问。

### 构建配置

项目的构建配置信息，包括编译器版本、插件列表、源代码目录等。

项目的构建配置可以分为 project build 和 profile build。

```xml
<build>
    <defaultGoal>install</defaultGoal>
    <directory>${basedir}/target</directory>
    <finalName>${artifactId}-${version}</finalName>
    <filters>
        <filter>filters/filter1.properties</filter>
    </filters>
</build>
```

* **defaultGoal**：默认执行目标或阶段。
* **directory**：构建时的输出路径。默认为：`${basedir}/target`。
* **finalName**：项目的最终构建名称（不包括文件扩展名）。
* **filter**：定义 `* .properties` 文件，其中包含适用于接受其设置的资源的属性列表。换句话说，过滤器文件中定义的 `name = value` 对在代码中替换 `${name}`字符串。

```xml
<build>
    <resources>
        <resource>
            <targetPath>META-INF/plexus</targetPath>
            <filtering>false</filtering>
            <directory>${basedir}/src/main/plexus</directory>
            <includes>
                <include>configuration.xml</include>
            </includes>
            <excludes>
                <exclude>**/*.properties</exclude>
            </excludes>
        </resource>
    </resources>
    <testResources></testResources>
</build>
```

#### resources

资源的配置。资源文件通常不是代码，不需要编译，而是在项目需要捆绑使用的内容。

* **resources**：资源元素的列表，每个资源元素描述与此项目关联的文件和何处包含文件。
* **targetPath**：指定从构建中放置资源集的目录结构。目标路径默认为基本目录。将要包装在 jar 中的资源的通常指定的目标路径是 META-INF。
* **filtering**：布尔值，表示是否要为此资源启用过滤。**请注意**：该过滤器 `* .properties` 文件不必定义为进行过滤 - 资源还可以使用默认情况下在 POM 中定义的属性（如：`${project.version}`），并将其传递到命令行中 “-D” 标志（如：`-Dname = value`）或由 properties 元素显式定义。过滤文件覆盖上面。
* **directory**：值定义了资源的路径。默认是 `${basedir}/src/main/resources`。
* **includes**：一组文件匹配模式，指定目录中要包括的文件，使用 `*` 作为通配符。
* **excludes**：与 includes 类似，指定目录中要排除的文件，使用 `*` 作为通配符。**注意**：如果 include 和 exclude 发生冲突，以 exclude 作为有效项。
* **testResources**：与 resources 功能类似，区别仅在于 testResources 指定的资源仅用于 test 阶段，并且其默认资源目录为 `${basedir}/src/test/resources`。

#### plugins

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-jar-plugin</artifactId>
            <version>2.6</version>
            <extensions>false</extensions>
            <inherited>true</inherited>
            <configuration>
                <classifier>test</classifier>
            </configuration>
            <dependencies></dependencies>
            <executions>
                <execution>
                    <id>echodir</id>
                    <goals>
                        <goal>run</goal>
                    </goals>
                    <phase>verify</phase>
                    <inherited>false</inherited>
                    <configuration>
                        <tasks>
                            <echo>Build Dir: ${project.build.directory}</echo>
                        </tasks>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

* **groupId、artifactId、version**：和基本配置中的 groupId、artifactId、version 意义相同。
* **extensions**：布尔值，默认为 false，表示是否加载此插件的扩展名。
* **inherited**：布尔值，默认为 true，表示该插件配置是否应该适用于继承自该插件的 POM。
* **configuration**：这是针对个人插件的配置。
* **dependencies**：插件本身所需要的依赖。
* **executions**：插件可能有多个目标，每个目标可能有一个单独的配置，甚至可能将插件的目标完全绑定到不同的阶段。执行配置插件的目标的执行。
  * **id**：执行目标的标识。
  * **goals**：像所有多元化的 POM 元素一样，它包含单个元素的列表。在这种情况下，这个执行块指定的插件目标列表。
  * **phase**：这是执行目标列表的阶段。这是一个非常强大的选项，允许将任何目标绑定到构建生命周期中的任何阶段，从而改变 maven 的默认行为。
  * **inherited**：布尔值，false 会阻止 maven 将这个执行传递给它的子代。此元素仅对父 POM 有意义。
  * **configuration**：与上述相同，但将配置限制在此特定目标列表中，而不是插件下的所有目标。

#### pluginManagement

与 dependencyManagement 很相似，在当前 POM 中仅声明插件，而不是实际引入插件。子 POM 中只配置 groupId 和 artifactId 就可以完成插件的引用，且子 POM 有权重写 pluginManagement 定义。

它的目的在于统一所有子 POM 的插件版本。

与 `dependencyManagement` 很相似，在当前 POM 中仅声明插件，而不是实际引入插件。子 POM 中只配置 `groupId` 和 `artifactId` 就可以完成插件的引用，且子 POM 有权重写 pluginManagement 定义。

它的目的在于统一所有子 POM 的插件版本。

#### directories

目录元素集合存在于 build 元素中，它为整个 POM 设置了各种目录结构。由于它们在配置文件构建中不存在，所以这些不能由配置文件更改。

```xml
<build>
    <sourceDirectory>${basedir}/src/main/java</sourceDirectory>
    <scriptSourceDirectory>${basedir}/src/main/scripts</scriptSourceDirectory>
    <testSourceDirectory>${basedir}/src/test/java</testSourceDirectory>
    <outputDirectory>${basedir}/target/classes</outputDirectory>
    <testOutputDirectory>${basedir}/target/test-classes</testOutputDirectory>
</build>
```

如果上述目录元素的值设置为绝对路径（扩展属性时），则使用该目录。否则，它是相对于基础构建目录：`${basedir}`。

#### extensions

extensions 是在此构建中使用的 artifacts 的列表。它们将被包含在运行构建的 classpath 中。它们可以启用对构建过程的扩展，并使活动的插件能够对构建生命周期进行更改。简而言之，扩展是在构建期间激活的 artifacts

扩展不需要实际执行任何操作，也不包含 Mojo。因此，扩展对于指定普通插件接口的多个实现中的一个是非常好的。

```xml
<build>
    <extensions>
        <extension>
            <groupId>org.apache.maven.wagon</groupId>
            <artifactId>wagon-ftp</artifactId>
            <version>1.0-alpha-3</version>
        </extension>
    </extensions>
</build>
```

### reporting

reporting 包含特定针对 site 生成阶段的元素。某些 maven 插件可以生成 reporting 元素下配置的报告，

eporting 与 build 元素配置插件的能力相似。明显的区别在于：在执行块中插件目标的控制不是细粒度的，报表通过配置 reportSet 元素来精细控制。而微妙的区别在于 reporting 元素下的 configuration 元素可以用作 build 下的 configuration ，尽管相反的情况并非如此（ build 下的 configuration 不影响 reporting 元素下的 configuration ）。

另一个区别就是 plugin 下的 outputDirectory 元素。在报告的情况下，默认输出目录为 ${basedir}/target/site。

```xml
<reporting>
    <plugins>
        <plugin>
            <reportSets>
                <reportSet>
                    <id>sunlink</id>
                    <reports>
                        <report>javadoc</report>
                    </reports>
                    <inherited>true</inherited>
                    <configuration>
                        <links>
                            <link>http://java.sun.com/j2se/1.5.0/docs/api/</link>
                        </links>
                    </configuration>
                </reportSet>
            </reportSets>
        </plugin>
    </plugins>
</reporting>
```

### 项目信息

项目信息相关的标签**都不是必要的**，其作用仅限于描述项目的详细信息。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <name>java-demo</name>
    <description>java学习</description>
    <url>https://github.com/lizhao/java-demo</url>
    <inceptionYear>2024</inceptionYear>
    
    <licenses>
        <license>
            <name>Apache License, Version 2.0</name>
            <url>https://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo</distribution>
            <comments>A business-friendly OSS license</comments>
        </license>
    </licenses>

    <organization>
        <name></name>
        <url></url>
    </organization>

    <developers>
        <developer>
            <id>victor</id>
            <name>liZhao</name>
            <email>1927344728@qq.com</email>
            <url>https://github.com/lizhao</url>
            <organization></organization>
            <organizationUrl></organizationUrl>
            <roles>
                <role>architect</role>
                <role>developer</role>
            </roles>
            <timezone>+8</timezone>
            <properties></properties>
        </developer>
    </developers>

    <contributors>
        <contributor>
            <!--标签内容和<developer>相同-->
        </contributor>
    </contributors>
</project>
```

### 环境配置

#### issueManagement

issueManagement 定义了所使用的缺陷跟踪系统（Bugzilla、TestTrack、ClearQuest 等）。虽然没有什么可以阻止插件使用这些信息的东西，但它主要用于生成项目文档。

```xml
<issueManagement>
    <system>Bugzilla</system>
    <url>http://127.0.0.1/bugzilla/</url>
</issueManagement>
```

#### ciManagement

CI 构建系统配置，主要是指定通知机制以及被通知的邮箱。

```xml
<ciManagement>
    <system>continuum</system>
    <url>http://127.0.0.1:8080/continuum</url>
    <notifiers>
        <notifier>
            <type>mail</type>
            <sendOnError>true</sendOnError>
            <sendOnFailure>true</sendOnFailure>
            <sendOnSuccess>false</sendOnSuccess>
            <sendOnWarning>false</sendOnWarning>
            <configuration>
                <address>continuum@127.0.0.1</address>
            </configuration>
        </notifier>
    </notifiers>
</ciManagement>
```

#### mailingLists

邮件列表。

```xml
<mailingLists>
    <mailingList>
        <name>lizhao</name>
        <subscribe>user-subscribe@127.0.0.1</subscribe>
        <unsubscribe>user-unsubscribe@127.0.0.1</unsubscribe>
        <post>user@127.0.0.1</post>
        <archive>http://127.0.0.1/user/</archive>
        <otherArchives>
            <otherArchive>http://base.google.com/base/1/127.0.0.1</otherArchive>
        </otherArchives>
    </mailingList>
</mailingLists>
```

#### scm

SCM（软件配置管理，也称为源代码/控制管理或简洁的版本控制）。常见的有：svn、git 。

```xml
<scm>
    <connection>git@github.com:1927344728/java-demo.git</connection>
    <developerConnection>git@github.com:1927344728/java-demo.git</developerConnection>
    <tag>HEAD</tag>
    <url>https://github.com/1927344728/java-demo.git</url>
</scm>
```

#### prerequisites

POM 执行的预设条件。

```xml
<prerequisites>
    <maven>2.0.6</maven>
</prerequisites>
```

#### repositories

repositories 是遵循 Maven 存储库目录布局的 artifacts 集合。默认的 Maven 中央存储库位于https://repo.maven.apache.org/maven2/上。

```xml
<repositories>
    <repository>
        <releases>
            <enabled>false</enabled>
            <updatePolicy>always</updatePolicy>
            <checksumPolicy>warn</checksumPolicy>
        </releases>
        <snapshots>
            <enabled>true</enabled>
            <updatePolicy>never</updatePolicy>
            <checksumPolicy>fail</checksumPolicy>
        </snapshots>
        <id>codehausSnapshots</id>
        <name>Codehaus Snapshots</name>
        <url>http://snapshots.maven.codehaus.org/maven2</url>
        <layout>default</layout>
    </repository>
</repositories>
```

#### pluginRepositories

与 repositories 差不多。

```xml
<pluginRepositories>
	<pluginRepository></pluginRepository>
</pluginRepositories>
```

#### distributionManagement

distributionManagement 管理在整个构建过程中生成的 artifact 和支持文件的分布。

```xml
<distributionManagement>
    <downloadUrl>https://github.com/1927344728/java-demo.git</downloadUrl>
    <status>deployed</status>
</distributionManagement>
```

### profiles

POM 4.0 的一个新特性是项目能够根据构建环境更改设置。

一个 profile 既包含一个可选的 activation（一个 profile  触发器），也包含在该 profile 被激活时要对 POM 进行的一组更改。如：为测试环境构建的项目可能指向与最终部署不同的数据库。

```xml
<profiles>
    <profile>
        <id>test</id>
        <activation></activation>
        <build></build>
        <modules></modules>
        <repositories></repositories>
        <pluginRepositories></pluginRepositories>
        <dependencies></dependencies>
        <reporting></reporting>
        <dependencyManagement></dependencyManagement>
        <distributionManagement></distributionManagement>
    </profile>
</profiles>
```

activation 是 profile 的关键。profile 的强大之处在于它仅在特定情况下修改基本POM的能力。这些情况是通过 activation 指定的。

```xml
<profiles>
    <profile>
        <id>test</id>
        <activation>
            <activeByDefault>false</activeByDefault>
            <jdk>1.5</jdk>
            <os>
                <name>Windows XP</name>
                <family>Windows</family>
                <arch>x86</arch>
                <version>5.1.2600</version>
            </os>
            <property>
                <name>sparrow-type</name>
                <value>African</value>
            </property>
            <file>
                <exists>${basedir}/file2.properties</exists>
                <missing>${basedir}/file1.properties</missing>
            </file>
        </activation>
    </profile>
</profiles>
```

#### 参考资料

[maven.apache.org](https://maven.apache.org/pom.html#Activation)

[Maven 教程之 pom.xml 详解](https://juejin.cn/post/6844903824524574734#heading-12)
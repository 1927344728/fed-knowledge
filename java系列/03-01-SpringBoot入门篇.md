# Spring Boot入门篇

[Spring Boot](https://springdoc.cn/spring-boot/) 是一个基于 Spring 的框架，旨在简化 Spring 应用的配置和开发过程，通过自动配置和约定大于配置的原则，使开发者能够快速搭建独立、生产级别的应用程序。

## 必需环境准备

### **JDK 安装（18.0.2、window）**

* **下载地址**：https://www.oracle.com/java/technologies/javase/jdk18-archive-downloads.html，**Windows**选择 `x64 Installer`（.exe 文件）。
* **运行安装程序**：双击下载的 .exe 文件，一路点击 **Next**（也可以指定安装路径）。
* **配置环境变量**：右键点击 `此电脑 → 属性 → 高级系统设置 → 环境变量`，在 `系统变量` 区域，点击`新建`：变量名：`JAVA_HOME`，变量值：`C:\Users\${whoami}\.jdks\corretto-18.0.2`；再找到 `Path` 变量，双击打开，点击 新建，添加：%JAVA_HOME%\bin，点击所有窗口的 `确定` 保存。

```shell
# 查看用户名
whoami

# 查看 java 路径
where java
# C:\Users\${whoami}\.jdks\corretto-18.0.2\bin\java.exe

# 查看 java 版本
java -version
```

### IntelliJ IDEA 安装

- **下载地址**：https://www.jetbrains.com/idea/download/。

### 构建工具（Maven）

* Spring Boot 默认支持，配置简单。

- IDEA 内置 Maven，通常**无需单独安装**。

## 创建 Spring Boot 项目

### 创建项目

打开 IDEA → **New Project**，配置：

- **服务器URL**：默认 [https://start.spring.io](https://start.spring.io/)，（也可用阿里云镜像加速，https://start.aliyun.com）
- **名称**：项目名
- **位置**：项目路径
- **语言**：Java
- **类型**：Maven
- **组**：com.example（公司域名倒写）
- **JDK**：选择已安装的 JDK 版本
- **打包**：Jar
- **Java**：匹配 JDK 版本

### 源码解读

`src/main/java/com/lizhao/springboot/Application.java` 源码：

```java
package com.lizhao.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
```

#### package

```java
package com.lizhao.springboot;
```

声明这个类所在的包（package），类似于文件系统的文件夹。**命名规则**：通常是公司域名的倒写 + 项目名。

#### import

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
```

导入 Spring Boot 框架需要的两个核心类：`SpringApplication`，负责启动 Spring Boot 应用；`SpringBootApplication`：这是一个**组合注解**。

#### @SpringBootApplication

**这是最关键的注解**，它包含了三个注解的功能：

| 注解                       | 作用                                                         |
| :------------------------- | :----------------------------------------------------------- |
| `@SpringBootConfiguration` | 标记一个配置类，相当于传统的 `applicationContext.xml`        |
| `@EnableAutoConfiguration` | **核心**：让 Spring Boot 根据添加的依赖自动配置（比如，加了 `spring-web` 依赖，它自动配置 Tomcat 和 Spring MVC） |
| `@ComponentScan`           | 自动扫描当前包及其子包下的组件（如 `@Controller`、`@Service`、`@Repository` 等） |

#### 主入口

```java
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
```

Application，常见的 Java 类命名。

`public static void main(String[] args)`，Java 程序的标准入口方法，任何 Java 程序的起点。

`SpringApplication.run(Application.class, args);`，**启动 Spring Boot 的核心代码**，包含：

- 启动**内嵌的 Web 服务器**（默认 Tomcat，端口 8080）
- 创建 **IoC 容器**（管理所有 Bean 对象）
- 执行**自动配置**（根据依赖和注解装配组件）
- 扫描并注册**控制器、服务、仓库等组件**

`Application.class`，告诉 Spring Boot 启动类是哪个（就是当前类）。

### 完整执行流程

- 运行 main 方法；
- @SpringBootApplication 被解析；
- SpringApplication.run() 执行；
- 启动内嵌 Tomcat（端口 8080）；
- 扫描 com.lizhao.springboot 包下的组件；
- 根据 pom.xml 中的依赖自动配置（如 Web、数据库等）；
- 控制台打印 Spring Boot 启动横幅；
- 应用启动完成，等待请求。

点击 IntelliJ IDEA `运行` 按钮，启动程序。

## 一个简单 HTTP 请求示例

### pom.xml 配置

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 源码解读

`src/main/java/com/lizhao/springboot/controller/HelloController.java` 源码：

```java
package com.lizhao.springboot.controller;

import com.lizhao.springboot.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/hello")
public class HelloController {

  @GetMapping("/helloWord")
  public ApiResponse<String> helloWord() {
    return ApiResponse.ok("Hello, World!");
  }

  @GetMapping("/{name}")
  public ApiResponse<String> sayHello(@PathVariable String name) {
    return ApiResponse.ok("Hello, " + name + "!");
  }
}
```

这段代码是一个典型的 **Spring Boot REST API 控制器**，用于处理 HTTP 请求并返回 JSON 数据。

`@RestController`、`@RequestMapping`、`@GetMapping`、`@PathVariable`，是 Spring Web 提供的注解，用于定义 API 接口。

#### @RestController

**组合注解**，相当于 `@Controller` + `@ResponseBody`：

| 注解            | 作用                                             |
| :-------------- | :----------------------------------------------- |
| `@Controller`   | 标记这是一个控制器，Spring 会扫描并管理它        |
| `@ResponseBody` | 将方法的返回值**自动转为 JSON** 写入 HTTP 响应体 |

没有 `@ResponseBody` 的话，Spring 会默认返回视图名称（JSP/Thymeleaf 页面），有了它就直接返回数据。

#### @RequestMapping

**类级别路径映射**，即这个控制器下所有方法的 URL 都以 `/api/hello` 开头。

#### @GetMapping

**方法级别路径映射**，处理 HTTP **GET** 请求，完整访问路径 = 类路径 + 方法路径。

常见的 HTTP 方法映射注解：

- @GetMapping
- @PostMapping
- @PutMapping
- @PatchMapping
- @DeleteMapping

#### @PathVariable

从 **URL 路径**中提取变量值。

常见相关注解：

- **@PathVariable**：从 **URL 路径**中提取变量值。
- **@RequestParam**：从 **URL 查询字符串**或**表单数据**中提取参数。
- **@RequestBody**：从 **HTTP 请求体**中读取 JSON/XML 数据，并自动转换为 Java 对象。
- **@RequestHeader**：从 HTTP **请求头**中提取特定字段的值。

### 运行程序

点击 IntelliJ IDEA `运行` 按钮，启动程序。

浏览器打开：http://localhost:8080/api/hello/helloWord，即可查看接口返回数据。

## 支持 HTTP/HTTPS

### 生成签名证书

```shell
cd src/main/resources
```

```shell
keytool -genkeypair -alias springboot -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore springboot-keystore.p12 -validity 3650 -storepass 123456 -dname "CN=localhost, OU=lizhao, O=lizhao, L=HZ, ST=ZJ, C=CN" -ext "SAN=dns:localhost,dns:*.izhao.com.cn,ip:127.0.0.1,ip:::1"
```

### application.properties 配置

`src/main/resources/application.properties`：

```shell
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:springboot-keystore.p12
server.ssl.key-store-type=PKCS12
server.ssl.key-store-password=123456
server.ssl.key-alias=springboot
server.http.port=8080
```

### HTTP 配置

`src/main/java/com/lizhao/springboot/config/TomcatHttpConnectorConfig.java`：

```java
package com.lizhao.springboot.config;

import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatHttpConnectorConfig {

  @Bean
  public WebServerFactoryCustomizer<TomcatServletWebServerFactory> additionalHttpConnector() {
    return (factory) -> {
      Connector connector = new Connector();
      connector.setScheme("http");
      connector.setPort(httpPort);
      connector.setSecure(false);
      factory.addAdditionalConnectors(connector);
    };
  }

  @Value("${server.http.port:8080}")
  private int httpPort;
}
```

## 允许跨域

`src/main/java/com/lizhao/springboot/config/CorsConfig.java`：

```java
package com.lizhao.springboot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
          "http://*.izhao.com.cn",
          "http://dev.izhao.com.cn:9000",
          "http://localhost:9000",
          "https://*.izhao.com.cn",
          "https://dev.izhao.com.cn:9000",
          "https://localhost:9000"
        )
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
  }
}
```

## 连接数据库

### application.properties 配置

`spring-boot\src\main\resources\application.properties`：

```shell
spring.datasource.url=jdbc:mysql://localhost:3306/yizhao?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=lizhao
spring.datasource.password=lizh1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.hikari.maximum-pool-size=10

spring.jpa.hibernate.ddl-auto=none
spring.jpa.open-in-view=false
```

### pom.xml 配置

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### 代码示例

#### UserEntity.java

`src/main/java/com/lizhao/springboot/user/UserEntity.java`：

```java
package com.lizhao.springboot.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.LocalDateTime;

@Entity
@Table(name = "`user`")
public class UserEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 36)
  private String uuid;

  @Column(nullable = false, length = 11)
  private String phone;

  @Column private String name;

  @Column private Integer sex;

  @Column private LocalDateTime birthday;

  @Column(nullable = false)
  private String alias;

  @Column private String nickname;

  @Column private String email;

  @Column(nullable = false)
  private Integer role;

  @Column(nullable = false)
  private String password;

  @Column private String captcha;

  @Column private String token;

  @Column(name = "created_at", insertable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", insertable = false, updatable = false)
  private LocalDateTime updatedAt;

  @Column(name = "is_deleted", nullable = false)
  private Integer isDeleted;

  @Transient
  public boolean isActive() {
    return isDeleted != null && isDeleted == 0;
  }

  public Long getId() {
    return id;
  }

  public String getUuid() {
    return uuid;
  }

  public String getPhone() {
    return phone;
  }

  public String getName() {
    return name;
  }

  public Integer getSex() {
    return sex;
  }

  public LocalDateTime getBirthday() {
    return birthday;
  }

  public String getAlias() {
    return alias;
  }

  public String getNickname() {
    return nickname;
  }

  public String getEmail() {
    return email;
  }

  public Integer getRole() {
    return role;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getCaptcha() {
    return captcha;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public Integer getIsDeleted() {
    return isDeleted;
  }
}
```

#### UserProfileDto.java

`src/main/java/com/lizhao/springboot/user/UserProfileDto.java`：

```java
package com.lizhao.springboot.user;

import java.time.LocalDateTime;

public record UserProfileDto(
    long id,
    String uuid,
    String phone,
    String name,
    Integer sex,
    LocalDateTime birthday,
    String alias,
    String nickname,
    String email,
    int role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
```

#### UserRepository.java

`src/main/java/com/lizhao/springboot/user/UserRepository.java`：

```java
package com.lizhao.springboot.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByIdAndIsDeleted(long id, Integer isDeleted);

  Optional<UserEntity> findByPhoneAndIsDeleted(String phone, Integer isDeleted);

  Optional<UserEntity> findByTokenAndIsDeleted(String token, Integer isDeleted);
}
```

#### UserController.java

`src/main/java/com/lizhao/springboot/user/UserController.java`：

```java
package com.lizhao.springboot.user;

import com.lizhao.springboot.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private final UserRepository userRepository;

  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/{id}")
  public ApiResponse<UserProfileDto> getUserById(@PathVariable long id) {
    return userRepository
        .findByIdAndIsDeleted(id, 0)
        .map(UserController::toProfileDto)
        .map(ApiResponse::ok)
        .orElseGet(() -> ApiResponse.notFound("用户不存在"));
  }

  private static UserProfileDto toProfileDto(UserEntity u) {
    return new UserProfileDto(
        u.getId(),
        u.getUuid(),
        u.getPhone(),
        u.getName(),
        u.getSex(),
        u.getBirthday(),
        u.getAlias(),
        u.getNickname(),
        u.getEmail(),
        u.getRole() == null ? 0 : u.getRole(),
        u.getCreatedAt(),
        u.getUpdatedAt());
  }
}
```

## 登录鉴权（Cookie token）

### application.properties 配置

`src/main/resources/application.properties`：

```yaml
app.security.whitelist=/api/hello/**,/api/login
app.security.token-cookie-name=token
app.security.token-days=7
```

### pom.xml 配置

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 代码示例

#### TokenGenerator.java

`src/main/java/com/lizhao/springboot/common/util/TokenGenerator.java`：

```java
package com.lizhao.springboot.common.util;

import java.security.SecureRandom;
import java.util.Base64;

public final class TokenGenerator {
  private static final SecureRandom RNG = new SecureRandom();

  private TokenGenerator() {}

  public static String newToken() {
    byte[] bytes = new byte[32];
    RNG.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}
```

#### TokenCookie.java

`src/main/java/com/lizhao/springboot\auth\TokenCookie.java`：

```java
package com.lizhao.springboot.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import org.springframework.http.ResponseCookie;

public final class TokenCookie {
  private TokenCookie() {}

  public static String genCookie(String cookieName, String token, int days) {
    ResponseCookie cookie = ResponseCookie.from(cookieName, token)
      .httpOnly(true)
      .secure(true)
      .path("/")
      .sameSite("None")
      .maxAge(Duration.ofDays(days))
      .build();
    return cookie.toString();
  }

  public static String clearCookie(String cookieName) {
    ResponseCookie cookie = ResponseCookie.from(cookieName, "")
      .httpOnly(true)
      .secure(true)
      .path("/")
      .sameSite("None")
      .maxAge(Duration.ZERO)
      .build();
    return cookie.toString();
  }

  public static String readCookie(HttpServletRequest request, String name) {
    Cookie[] cookies = request.getCookies();
    if (cookies == null || name == null) {
      return null;
    }
    for (Cookie c : cookies) {
      if (c != null && name.equals(c.getName())) {
        return c.getValue();
      }
    }
    return null;
  }
}
```

#### AuthProperties.java

`src/main/java/com/lizhao/springboot/auth/AuthProperties.java`：

从 `src/main/resources/application.properties` 读取配置，有值则会覆盖其中的默认值。

```java
package com.lizhao.springboot.auth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public class AuthProperties {
  private String whitelist = "/api/hello/**,/api/login";

  private String tokenCookieName = "token";

  private int tokenDays = 7;

  public List<String> whitelistAsList() {
    if (whitelist == null || whitelist.isBlank()) {
      return List.of();
    }
    List<String> out = new ArrayList<>();
    Arrays.stream(whitelist.split(","))
        .map(String::trim)
        .filter(s -> !s.isBlank())
        .forEach(out::add);
    return out;
  }

  public String getWhitelist() {
    return whitelist;
  }

  public void setWhitelist(String whitelist) {
    this.whitelist = whitelist;
  }

  public String getTokenCookieName() {
    return tokenCookieName;
  }

  public void setTokenCookieName(String tokenCookieName) {
    this.tokenCookieName = tokenCookieName;
  }

  public int getTokenDays() {
    return tokenDays;
  }

  public void setTokenDays(int tokenDays) {
    this.tokenDays = tokenDays;
  }
}
```

#### SecurityConfig.java

配置哪些接口需要认证、使用什么过滤器、如何处理异常。

`src/main/java/com/lizhao/springboot/auth/SecurityConfig.java`：

```java
package com.lizhao.springboot.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lizhao.springboot.common.ApiResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableConfigurationProperties(AuthProperties.class)
public class SecurityConfig {
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http, TokenAuthFilter tokenAuthFilter, AuthProperties props) throws Exception {
    var whitelist = props.whitelistAsList().toArray(String[]::new);
    // 禁用 CSRF（因为使用无状态的 Token 认证）
    http.csrf(csrf -> csrf.disable());
    // 启用 CORS（允许跨域）
    http.cors(Customizer.withDefaults());
    // 设置为无状态会话（不使用 Session）
    http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    // 配置授权规则
    http.authorizeHttpRequests(auth -> auth.requestMatchers(whitelist).permitAll().anyRequest().authenticated());
    // 添加自定义过滤器
    http.addFilterBefore(tokenAuthFilter, UsernamePasswordAuthenticationFilter.class);
    // 自定义未授权响应（401）
    http.exceptionHandling(eh -> eh.authenticationEntryPoint((req, res, ex) -> {
      res.setStatus(401);
      res.setCharacterEncoding(StandardCharsets.UTF_8.name());
      res.setContentType(MediaType.APPLICATION_JSON_VALUE);
      ObjectMapper om = new ObjectMapper();
      res.getWriter().write(om.writeValueAsString(ApiResponse.error(401, "未授权")));
    }));
    return http.build();
  }
}
```

#### TokenAuthFilter.java

从 Cookie 中读取 Token 并验证用户身份。

`src/main/java/com/lizhao/springboot/auth/TokenAuthFilter.java`：

```java
package com.lizhao.springboot.auth;

import com.lizhao.springboot.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class TokenAuthFilter extends OncePerRequestFilter {
  private final UserRepository userRepository;
  private final AuthProperties props;
  private final AntPathMatcher ant = new AntPathMatcher();

  public TokenAuthFilter(UserRepository userRepository, AuthProperties props) {
    this.userRepository = userRepository;
    this.props = props;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    for (String pattern : props.whitelistAsList()) {
      if (ant.match(pattern, path)) {
        return true;
      }
    }
    return false;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      String token = TokenCookie.readCookie(request, props.getTokenCookieName());
      if (token != null && !token.isBlank()) {
        userRepository
          .findActiveByToken(token)
          .ifPresent(u -> {
            // 创建一个 Spring Security 标准的认证对象，并将其放入安全上下文中。即，告诉 Spring Security "当前请求已经通过认证，用户ID是 xxx"。
            var auth = new UsernamePasswordAuthenticationToken(u.getId(), null, java.util.List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
          });
      }
    }
    filterChain.doFilter(request, response);
  }
}
```

* **shouldNotFilter()**：白名单跳过。某些路径不需要认证（如登录页、注册接口），直接放行。
* **doFilterInternal()**：认证逻辑。

#### AuthService.java

`src/main/java/com/lizhao/springboot/auth/AuthService.java`：

```java
package com.lizhao.springboot.auth;

import com.lizhao.springboot.auth.dto.ChangePasswordRequest;
import com.lizhao.springboot.auth.dto.LoginRequest;
import com.lizhao.springboot.common.util.TokenGenerator;
import com.lizhao.springboot.user.UserEntity;
import com.lizhao.springboot.user.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository userRepository;

  public AuthService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional
  public Optional<String> login(LoginRequest req) {
    if (req == null || req.phone() == null || req.password() == null) {
      return Optional.empty();
    }
    return userRepository
      .findActiveByPhone(req.phone())
      .filter(u -> matchesPlain(req.password(), u.getPassword()))
      .map(u -> {
        String token = TokenGenerator.newToken();
        u.setToken(token);
        userRepository.save(u);
        return token;
      });
  }

  @Transactional
  public void logout(long userId) {
    userRepository
      .findByIdAndIsDeleted(userId, 0)
      .ifPresent(u -> {
        u.setToken(null);
        userRepository.save(u);
      });
  }

  @Transactional
  public boolean changePassword(long userId, ChangePasswordRequest req) {
    if (req == null || req.oldPassword() == null || req.newPassword() == null) {
      return false;
    }
    if (req.newPassword().length() < 6) {
      return false;
    }
    Optional<UserEntity> userOpt = userRepository.findByIdAndIsDeleted(userId, 0);
    if (userOpt.isEmpty()) {
      return false;
    }
    UserEntity u = userOpt.get();
    if (!matchesPlain(req.oldPassword(), u.getPassword())) {
      return false;
    }
    u.setPassword(req.newPassword());
    userRepository.save(u);
    return true;
  }

  private static boolean matchesPlain(String rawPassword, String storedPassword) {
    if (storedPassword == null) {
      return false;
    }
    return rawPassword.equals(storedPassword);
  }
}
```

#### AuthController.java

`src/main/java/com/lizhao/springboot/auth/AuthController.java`：

```java
package com.lizhao.springboot.auth;

import com.lizhao.springboot.auth.dto.ChangePasswordRequest;
import com.lizhao.springboot.auth.dto.LoginRequest;
import com.lizhao.springboot.common.ApiResponse;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
  private final AuthService authService;
  private final AuthProperties props;

  public AuthController(AuthService authService, AuthProperties props) {
    this.authService = authService;
    this.props = props;
  }

  @GetMapping("/login")
  public ResponseEntity<ApiResponse<Void>> login(@RequestParam String phone, @RequestParam String password) {
    LoginRequest req = new LoginRequest(phone, password);
    Optional<String> tokenOpt = authService.login(req);
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.status(401).body(ApiResponse.error(401, "账号或密码错误"));
    }
    String setCookie = TokenCookie.genCookie(props.getTokenCookieName(), tokenOpt.get(), props.getTokenDays());
    return ResponseEntity.ok()
      .header(HttpHeaders.SET_COOKIE, setCookie)
      .body(ApiResponse.ok(null));
  }

  @GetMapping("/logout")
  public ResponseEntity<ApiResponse<Void>> logout(Authentication auth) {
    if (auth == null || auth.getPrincipal() == null) {
      return ResponseEntity.status(401).body(ApiResponse.error(401, "未授权"));
    }
    long userId = (long) auth.getPrincipal();
    authService.logout(userId);
    String clearCookie = TokenCookie.clearCookie(props.getTokenCookieName());
    return ResponseEntity.ok()
      .header(HttpHeaders.SET_COOKIE, clearCookie)
      .body(ApiResponse.ok(null));
  }

  @GetMapping("/user/password")
  public ResponseEntity<ApiResponse<Void>> changePassword(
      Authentication auth,
      @RequestParam String oldPassword,
      @RequestParam String newPassword) {
    if (auth == null || auth.getPrincipal() == null) {
      return ResponseEntity.status(401).body(ApiResponse.error(401, "未授权"));
    }
    long userId = (long) auth.getPrincipal();
    ChangePasswordRequest req = new ChangePasswordRequest(oldPassword, newPassword);
    boolean ok = authService.changePassword(userId, req);
    if (!ok) {
      return ResponseEntity.badRequest().body(ApiResponse.error(400, "修改密码失败"));
    }
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
```

#### 执行流程

- 请求到达 `TokenAuthFilter`
- 检查不是白名单路径
- 从 Cookie 读取 `auth_token=abc123...`
- 查询数据库验证 token 有效
- 设置 `SecurityContextHolder`
- 执行业务方法（可通过 `@AuthenticationPrincipal` 获取用户ID）

## 统一异常处理

### 全局异常处理器

全局异常处理器 `GlobalExceptionHandler`，把常见异常统一映射成现有的返回体 `ApiResponse.error(code, message)`，并且让 HTTP 状态码与 `ApiResponse.code` 保持一致（400/403/404/405/415/500）。

`src/main/java/com/lizhao/springboot/common/GlobalExceptionHandler.java`：

```java
package com.lizhao.springboot.common;

import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
    String method = Objects.toString(e.getMethod(), "");
    String msg = method.isBlank() ? "请求方式不支持" : ("请求方式不支持: " + method);
    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(ApiResponse.error(405, msg));
  }

  @ExceptionHandler({
    MissingServletRequestParameterException.class,
    MethodArgumentTypeMismatchException.class,
    HttpMessageNotReadableException.class,
    BindException.class,
    MethodArgumentNotValidException.class
  })
  public ResponseEntity<ApiResponse<Void>> handleBadRequest(Exception e) {
    String msg = "请求参数异常";
    if (e instanceof MissingServletRequestParameterException ex) {
      msg = "缺少参数: " + ex.getParameterName();
    } else if (e instanceof MethodArgumentTypeMismatchException ex) {
      msg = "参数类型错误: " + ex.getName();
    } else if (e instanceof HttpMessageNotReadableException ex) {
      msg = "请求体解析失败";
    } else if (e instanceof BindException ex) {
      msg = firstFieldErrorMessage(ex.getFieldError(), msg);
    } else if (e instanceof MethodArgumentNotValidException ex) {
      msg = firstFieldErrorMessage(ex.getBindingResult().getFieldError(), msg);
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(400, msg));
  }

  @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
  public ResponseEntity<ApiResponse<Void>> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException e) {
    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(ApiResponse.error(415, "Content-Type 不支持"));
  }

  @ExceptionHandler({NoHandlerFoundException.class, NoResourceFoundException.class})
  public ResponseEntity<ApiResponse<Void>> handleNotFound(Exception e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(404, "接口不存在"));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException e) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(403, "无权限"));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleServerError(Exception e) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(500, "服务器异常"));
  }

  private static String firstFieldErrorMessage(FieldError fe, String fallback) {
    if (fe == null) {
      return fallback;
    }
    String field = Objects.toString(fe.getField(), "");
    String defaultMessage = Objects.toString(fe.getDefaultMessage(), "");
    if (!field.isBlank() && !defaultMessage.isBlank()) {
      return field + ": " + defaultMessage;
    }
    if (!defaultMessage.isBlank()) {
      return defaultMessage;
    }
    if (!field.isBlank()) {
      return "参数错误: " + field;
    }
    return fallback;
  }
}
```

### 自定义异常处理器

```java
package com.lizhao.springboot.common;

import org.springframework.http.HttpStatus;

public class MyCustomException extends RuntimeException {
  private final int code;
  private final HttpStatus httpStatus;

  public MyCustomException(int code, String message) {
    this(code, message, HttpStatus.BAD_REQUEST);
  }

  public MyCustomException(int code, String message, HttpStatus httpStatus) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus == null ? HttpStatus.BAD_REQUEST : httpStatus;
  }

  public int getCode() {
    return code;
  }

  public HttpStatus getHttpStatus() {
    return httpStatus;
  }
}
```

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MyCustomException.class)
  public ResponseEntity<ApiResponse<Void>> handleMyCustomException(MyCustomException e) {
    return ResponseEntity.status(e.getHttpStatus()).body(ApiResponse.error(e.getCode(), e.getMessage()));
  }
}
```

```java
package com.lizhao.springboot.user;

import com.lizhao.springboot.common.MyCustomException;
import org.springframework.http.HttpStatus;
public class UserController {
  @GetMapping("/{id}")
  public ApiResponse<UserProfileDto> getUserById(@PathVariable @Min(value = 1, message = "id 必须大于 0") long id) {
    log.warn("请求用户信息1: {}", id);
    return userRepository
        .findByIdAndIsDeleted(id, 0)
        .map(UserController::toProfileDto)
        .map(ApiResponse::ok)
        .orElseThrow(() -> new MyCustomException(404, "用户不存在", HttpStatus.NOT_FOUND));
  }
}
```

## 请求参数校验

### pom.xml 配置

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 统一校验错误返回

`src/main/java/com/lizhao/springboot/common/GlobalExceptionHandler.java`：

```java
package com.lizhao.springboot.common;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Set;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler({
    MissingServletRequestParameterException.class,
    MethodArgumentTypeMismatchException.class,
    HttpMessageNotReadableException.class,
    BindException.class,
    MethodArgumentNotValidException.class,
    ConstraintViolationException.class
  })
  public ResponseEntity<ApiResponse<Void>> handleBadRequest(Exception e) {
    String msg = "请求参数异常";
    if (e instanceof MissingServletRequestParameterException ex) {
      msg = "缺少参数: " + ex.getParameterName();
    } else if (e instanceof MethodArgumentTypeMismatchException ex) {
      msg = "参数类型错误: " + ex.getName();
    } else if (e instanceof HttpMessageNotReadableException ex) {
      msg = "请求体解析失败";
    } else if (e instanceof BindException ex) {
      msg = firstFieldErrorMessage(ex.getFieldError(), msg);
    } else if (e instanceof MethodArgumentNotValidException ex) {
      msg = firstFieldErrorMessage(ex.getBindingResult().getFieldError(), msg);
    } else if (e instanceof ConstraintViolationException ex) {
      msg = firstConstraintViolationMessage(ex.getConstraintViolations(), msg);
    }
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(400, msg));
  }
}
```

### 代码示例

`src/main/java/com/lizhao/springboot/auth\AuthController.java`：

```java
package com.lizhao.springboot.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

@RestController
@RequestMapping("/api")
@Validated
public class AuthController {
  @GetMapping("/login")
  public ResponseEntity<ApiResponse<Void>> login(
      @RequestParam @NotBlank(message = "手机号不能为空") @Size(min = 5, max = 32, message = "手机号长度不合法") String phone,
      @RequestParam @NotBlank(message = "密码不能为空") @Size(min = 6, max = 64, message = "密码长度不合法") String password) {
    LoginRequest req = new LoginRequest(phone, password);
    Optional<String> tokenOpt = authService.login(req);
    if (tokenOpt.isEmpty()) {
      return ResponseEntity.status(401).body(ApiResponse.error(401, "账号或密码错误"));
    }
    String setCookie = TokenCookie.genCookie(props.getTokenCookieName(), tokenOpt.get(), props.getTokenDays());
    return ResponseEntity.ok()
      .header(HttpHeaders.SET_COOKIE, setCookie)
      .body(ApiResponse.ok(null));
  }
}
```

## 日志记录

日志就是程序运行过程中输出的**记录信息**，用来告诉你程序在做什么、有没有出错。

日志级别从低到高，代表问题的严重程度：

- **TRACE**：追踪程序执行细节。
- **DEBUG**：调试信息。比如：变量值、查询参数、中间结果。
- **INFO**：关键业务流程。
- **WARN**：警告，可恢复问题，比如：参数异常、重试、降级、配置缺失。
- **ERROR**：错误，需人工介入。比如：数据库连不上、第三方接口超时。
- **OFF**：关闭日志。

### application.properties 配置

开启日志，**只要符合日志级别条件，就会输出到文件。**

`src/main/resources/application.properties`：

```java
logging.file.name=logs/spring-boot.log
logging.level.root=WARN
logging.level.com.lizhao=WARN
logging.logback.rollingpolicy.file-name-pattern=logs/spring-boot.%d{yyyy-MM-dd}.%i.log
logging.logback.rollingpolicy.max-file-size=50MB
logging.logback.rollingpolicy.max-history=30
logging.logback.rollingpolicy.total-size-cap=2GB
```

### 代码示例

**Spring Boot 默认选型**：SLF4J。

`src/main/java/com/lizhao/springboot/user/UserController.java`：

```java
package com.lizhao.springboot.user;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/user")
@Validated
public class UserController {
  @GetMapping("/{id}")
  public ApiResponse<UserProfileDto> getUserById(@PathVariable @Min(value = 1, message = "id 必须大于 0") long id) {
    logger.warn("请求用户信息: {}", id);
    return userRepository
        .findByIdAndIsDeleted(id, 0)
        .map(UserController::toProfileDto)
        .map(ApiResponse::ok)
        .orElseGet(() -> ApiResponse.notFound("用户不存在"));
  }
}
```

### Lombok（可选）

`pom.xml`：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

```java
package com.lizhao.springboot.user;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/user")
@Validated
@Slf4j
public class UserController {
  @GetMapping("/{id}")
  public ApiResponse<UserProfileDto> getUserById(@PathVariable @Min(value = 1, message = "id 必须大于 0") long id) {
    log.warn("请求用户信息1: {}", id);
    return userRepository
        .findByIdAndIsDeleted(id, 0)
        .map(UserController::toProfileDto)
        .map(ApiResponse::ok)
        .orElseGet(() -> ApiResponse.notFound("用户不存在"));
  }
}
```

## 测试

用 JUnit5 + MockMvc 写接口层测试。

**整体结构**：

```shell
测试类
  ├── @ExtendWith(SpringExtension.class)  // 集成 Spring 测试框架
  ├── @WebAppConfiguration                // 模拟 Web 环境
  ├── @ContextConfiguration               // 指定配置类
  ├── 内部静态类 TestConfig               // 提供 Mock Bean
  └── 测试方法                            // 测试各个接口
```

**测试流程图**：

```shell
测试方法开始
    ↓
Mock 依赖行为（when().thenReturn()）
    ↓
MockMvc 发送模拟 HTTP 请求
    ↓
请求经过 Controller（真实对象）
    ↓
Controller 调用 Mock 的 Service/Repository
    ↓
Mock 返回预设值
    ↓
验证响应（状态码、JSON、Header）
    ↓
测试通过/失败
```

### pom.xml 配置

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-webmvc-test</artifactId>
    <scope>test</scope>
</dependency>
```

### ApplicationTests.java

`src/test/java/com/lizhao/springboot/ApplicationTests.java`：

```java
package com.lizhao.springboot;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled("避免启动完整 SpringBoot 上下文（会依赖本地 MySQL/SSL 配置），接口层测试已覆盖核心行为")
class ApplicationTests {
  @Test
  void contextLoads() {
  }
}
```

### 代码示例

这是两个 Controller 的单元测试，使用 **MockMvc** 模拟 HTTP 请求，不启动完整服务器。

`src/test/java/com/lizhao/springboot/auth/AuthControllerTest.java`：

```java
package com.lizhao.springboot.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Import;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.lizhao.springboot.user.UserRepository;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(com.lizhao.springboot.common.GlobalExceptionHandler.class)
class AuthControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockitoBean private AuthService authService;
  @MockitoBean private AuthProperties props;
  @MockitoBean private UserRepository userRepository;

  @Test
  void login_whenCredentialsInvalid_returns401() throws Exception {
    when(authService.login(any())).thenReturn(Optional.empty());

    mockMvc
        .perform(get("/api/login").param("phone", "13800138000").param("password", "wrongpass"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.code").value(401))
        .andExpect(jsonPath("$.message").value("账号或密码错误"));
  }

  @Test
  void login_whenOk_setsCookie_andReturnsOk() throws Exception {
    when(authService.login(any())).thenReturn(Optional.of("token-abc"));
    when(props.getTokenCookieName()).thenReturn("token");
    when(props.getTokenDays()).thenReturn(30);

    mockMvc
        .perform(get("/api/login").param("phone", "13800138000").param("password", "goodpass"))
        .andExpect(status().isOk())
        .andExpect(header().exists("Set-Cookie"))
        .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("token=token-abc")))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.code").value(200));
  }

  @Test
  void logout_whenNoAuth_returns401() throws Exception {
    mockMvc
        .perform(get("/api/logout"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.code").value(401))
        .andExpect(jsonPath("$.message").value("未授权"));
  }

  @Test
  void logout_whenAuth_present_clearsCookie_andReturnsOk() throws Exception {
    when(props.getTokenCookieName()).thenReturn("token");
    doNothing().when(authService).logout(1L);

    var auth = new UsernamePasswordAuthenticationToken(1L, null, java.util.List.of());

    mockMvc
        .perform(get("/api/logout").principal(auth))
        .andExpect(status().isOk())
        .andExpect(header().exists("Set-Cookie"))
        .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("Max-Age=0")))
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.code").value(200));
  }
}
```

`src/test/java/com/lizhao/springboot/auth/UserControllerTest.java`：

```java
package com.lizhao.springboot.user;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Import;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.lizhao.springboot.auth.AuthProperties;

@Import(com.lizhao.springboot.common.GlobalExceptionHandler.class)
@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockitoBean private UserRepository userRepository;
  @MockitoBean private AuthProperties props;

  @Test
  void getUserById_whenFound_returnsProfile() throws Exception {
    UserEntity u = new UserEntity();
    // 仅设置 controller 会读取到的字段（getter）
    setField(u, "id", 1L);
    setField(u, "uuid", "uuid-1");
    setField(u, "phone", "13800138000");
    setField(u, "name", "张三");
    setField(u, "sex", 1);
    setField(u, "birthday", LocalDateTime.of(2000, 1, 1, 0, 0));
    setField(u, "alias", "alias1");
    setField(u, "nickname", "nick1");
    setField(u, "email", "a@b.com");
    setField(u, "role", 2);
    setField(u, "createdAt", LocalDateTime.of(2024, 1, 1, 0, 0));
    setField(u, "updatedAt", LocalDateTime.of(2024, 1, 2, 0, 0));

    when(userRepository.findByIdAndIsDeleted(1L, 0)).thenReturn(Optional.of(u));

    mockMvc
        .perform(get("/api/user/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.code").value(200))
        .andExpect(jsonPath("$.data.id").value(1))
        .andExpect(jsonPath("$.data.uuid").value("uuid-1"))
        .andExpect(jsonPath("$.data.phone").value("13800138000"))
        .andExpect(jsonPath("$.data.role").value(2));
  }

  @Test
  void getUserById_whenNotFound_returns404() throws Exception {
    when(userRepository.findByIdAndIsDeleted(99L, 0)).thenReturn(Optional.empty());

    mockMvc
        .perform(get("/api/user/99"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.code").value(404))
        .andExpect(jsonPath("$.message").value("用户不存在"));
  }

  @Test
  void getUserById_whenIdInvalid_returns400() throws Exception {
    mockMvc
        .perform(get("/api/user/0"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.code").value(400))
        .andExpect(jsonPath("$.message").value("id 必须大于 0"));
  }

  private static void setField(Object target, String fieldName, Object value) {
    try {
      var f = target.getClass().getDeclaredField(fieldName);
      f.setAccessible(true);
      f.set(target, value);
    } catch (ReflectiveOperationException e) {
      throw new RuntimeException(e);
    }
  }
}
```

```java
// 模拟：调用 login 方法返回空（登录失败）
when(authService.login(any())).thenReturn(Optional.empty());

// 模拟：登录成功，返回 token
when(authService.login(any())).thenReturn(Optional.of("token-abc"));

// 模拟已认证用户（用户ID=1）
var auth = new UsernamePasswordAuthenticationToken(1L, null, List.of());
```

### 运行测试

Maven 面板，点击 `生存期 -> test` 命令。

## 接口文档

生成可访问的接口文档（本地直接打开 Swagger UI 页面），并且能导出 OpenAPI JSON 方便前端/测试使用。

### pom.xml 配置

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>3.0.3</version>
</dependency>
```

### application.properties 配置

`src/main/resources/application.properties`：

```shell
app.security.whitelist=/api/hello/**,/api/login,/docs/**

springdoc.api-docs.path=/docs/v3/api-docs
springdoc.swagger-ui.path=/docs/swagger-ui.html
springdoc.swagger-ui.display-request-duration=true
```

### OpenApiConfig.java

`src/main/java/com/lizhao/springboot/common/OpenApiConfig.java`：

```java
package com.lizhao.springboot.common;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI()
      .info(new Info()
        .title("接口文档")
        .version("v1"));
  }
}
```

### 启动

IntelliJ IDEA，点击 “run” 命令启动项目，在浏览器访问：

https://localhost:8443/docs/swagger-ui/index.html

https://localhost:8443/docs/v3/api-docs

## 部署与运行

### 多环境配置

用 Spring Boot Profile（`dev/test/prod`）+ `application-.properties`（或 yml）实现。

在 `src/main/resources/` 下准备这些文件：

- `application.properties`：通用配置（所有环境共享）。
- `application-dev.properties`：开发环境。
- `application-test.properties`：测试环境。
- `application-prod.properties`：生产环境。

命令行参数（推荐，最直观）：

```shell
java -jar xxx.jar --spring.profiles.active=dev
java -jar xxx.jar --spring.profiles.active=test
java -jar xxx.jar --spring.profiles.active=prod
```

**注意**：也可以在 `application.properties` 里写 `spring.profiles.active=dev`，运行 `java -jar xxx.jar`。**不推荐用于生产**

`src/main/resources/application-prod.properties`：

```javascript
server.port=9443
server.http.port=9090
```

### 配置外置

把配置文件放到 jar 同级目录的 `./config/` 或直接放 jar 同级目录。启动时用 `--spring.config.location` / `--spring.config.additional-location` 或环境变量覆盖。

目录结构建议：

- `target/xxx.jar`
- `target/config/application-location.properties`

Spring Boot 默认会从 `./config/` 读取（优先级也更高），通常无需额外参数。

也可以显式指定（更稳）：

```shell
java -jar xxx.jar --spring.profiles.active=prod --spring.config.additional-location=./config/application-location.properties

java -jar xxx.jar --spring.profiles.active=prod --spring.config.location="D:/conf/myapp/"
java -jar xxx.jar --spring.profiles.active=prod --spring.config.location="D:/conf/myapp/application-location.properties"
```

### 打包 jar

Maven 面板，点击 `生存期 -> clean`、 `生存期 -> package`命令。

### 启动

```shell
java -jar xxx.jar --spring.profiles.active=prod
```

用命令行直接覆盖单个配置项：

```shell
java -jar xxx.jar --spring.profiles.active=prod --server.port=8081
```

## 入门知识清单

### 目前已涉及（巩固阶段）

- **Spring Boot 基础**：启动类、自动配置、`application.yml` 配置文件。
- **Spring MVC 基础**：`@RestController`、路由映射、请求参数/请求体、JSON 序列化。
- **数据库操作**：数据库连接、Entity、Repository、DTO 基本使用。
- **跨域配置（CORS）**。
- **统一异常处理**：`@ControllerAdvice` + `@ExceptionHandler`，自定义业务异常，统一返回格式。
- **认证/鉴权雏形**：Spring Security 配置 + Cookie 认证。
- **参数校验**：使用 @Valid / @Validated 校验请求参数，统一校验错误返回。
- **日志记录**：使用 @Slf4j 记录关键操作日志，掌握日志级别配置。
- **单元测试与集成测试**：使用 JUnit5、Mockito、MockMvc 编写测试。
- **接口文档**：集成 SpringDoc/OpenAPI 自动生成接口文档。
- **部署与运行**：打包 jar、多环境配置（dev/test/prod）、配置外置、启动参数。

### 下一步建议（按优先级排序）

- **Service 分层**：Controller 变薄，业务逻辑放到 Service 层，规范 DTO/VO 使用。**DTO（Data Transfer Object）**接收请求参数，**Entity**数据库映射，**VO（View Object）**返回响应数据。
- **事务管理**：使用 @Transactional 管理数据库事务，理解回滚规则。
- **Spring Security 体系化**：使用 BCrypt 加密密码，实现方法级鉴权 @PreAuthorize。
- **AOP 与拦截链**：理解 Filter / Interceptor / AOP 的区别与适用场景。
- **缓存**：集成 Redis 做 Token 存储或热点数据缓存。
- **健康检查**：使用 Actuator 提供健康检查端点。
- **数据库优化**：索引、N+1 问题、分页、连接池（HikariCP）。
- **限流与熔断**：了解限流熔断概念，保护系统稳定性。
- **可观测性**：实现 traceId 链路追踪，方便排查问题。

### 其他

- **Maven 管理**：理解生命周期、依赖管理、多模块构建。
- **Docker 容器化**：编写 Dockerfile，容器化部署 Spring Boot 应用。

## @PreAuthorize（方法级鉴权）

在方法执行前检查权限，有权限才执行，无权限抛出 `AccessDeniedException`。

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // 开启 @PreAuthorize 支持
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // ... 其他配置
        return http.build();
    }
}
```

```java
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    // 只有 ADMIN 角色可以访问
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<List<UserVO>> listAllUsers() {
        return ApiResponse.success(userService.findAll());
    }
    
    // 只有 ADMIN 或 MANAGER 可以访问
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @DeleteMapping("/user/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ApiResponse.ok();
    }
    
    // 只有用户本人或 ADMIN 可以访问
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal")
    @GetMapping("/user/{userId}/profile")
    public ApiResponse<UserVO> getUserProfile(@PathVariable Long userId) {
        return ApiResponse.success(userService.findById(userId));
    }
}
```

```java
// TokenAuthFilter 中设置认证信息时添加权限
userRepository.findActiveByToken(token).ifPresent(u -> {
    // 根据角色构建权限列表
    List<GrantedAuthority> authorities = new ArrayList<>();
    
    if (u.getRole() == 2) {
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
    } else if (u.getRole() == 3) {
        authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
    }
    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
    
    // 也可以添加细粒度权限
    if (u.getRole() >= 2) {
        authorities.add(new SimpleGrantedAuthority("user:delete"));
        authorities.add(new SimpleGrantedAuthority("user:update"));
    }
    
    var auth = new UsernamePasswordAuthenticationToken(
        u.getId(), 
        null, 
        authorities  // 添加权限
    );
    SecurityContextHolder.getContext().setAuthentication(auth);
});
```



## 常见问题

### IntelliJ IDEA 新建项目时报错

```shell
'https://start.spring.io' 的初始化失败
请检查 URL、网络和代理设置。

错误消息:
Cannot download 'https://start.spring.io': Connection refused: getsockopt
```

**原因**：IntelliJ IDEA 无法连接到该网站，通常由**代理**或**防火墙**引起。

**解决方案**：打开 IntelliJ IDEA，找到：文件 → 设置，在设置窗口搜索 `proxy`，在 http 代理界面，选择 `自动检测代理设置`，点击 `确定` 后，重启 IntelliJ IDEA。

### 什么是 RESTful API？

**REST** 是 **Representational State Transfer** 的缩写，直译为**"表述性状态转移"**；**RESTful** 是指 **"符合 REST 架构风格的"**。

**RESTful API** 是一种**API 设计规范**（不是协议或标准），它基于 **HTTP 协议**，用简洁、规范的方式让不同系统之间交换数据。

简单理解：**RESTful API 就是用 HTTP 方法（GET、POST、PUT、DELETE 等）来操作资源（数据）的一种约定俗成的好习惯**。

### 资源（核心概念）

REST 把一切数据都看作 **"资源"**，每个资源都有一个唯一的地址（URL）。

| 资源类型   | URL 示例                 | 说明                 |
| :--------- | :----------------------- | :------------------- |
| 用户       | `/users`                 | 所有用户的集合       |
| 单个用户   | `/users/123`             | ID 为 123 的特定用户 |
| 用户的订单 | `/users/123/orders`      | 用户 123 的所有订单  |
| 文章       | `/articles`              | 所有文章             |
| 文章评论   | `/articles/456/comments` | 文章 456 的评论      |

### 用 HTTP 方法表示操作（核心原则）

| HTTP 方法  | 作用     | URL 示例            | 说明                      |
| :--------- | :------- | :------------------ | :------------------------ |
| **GET**    | 获取资源 | `GET /users/123`    | 查询用户 123              |
| **POST**   | 创建资源 | `POST /users`       | 新增一个用户              |
| **PUT**    | 完整更新 | `PUT /users/123`    | 完全替换用户 123 的数据   |
| **PATCH**  | 部分更新 | `PATCH /users/123`  | 只修改用户 123 的某些字段 |
| **DELETE** | 删除资源 | `DELETE /users/123` | 删除用户 123              |

```java
@GetMapping("/users/{id}")    // GET  - 查询
@PostMapping("/users")        // POST - 创建
@PutMapping("/users/{id}")    // PUT  - 完整修改
@PatchMapping("/users/{id}")  // PATCH - 部分修改
@DeleteMapping("/users/{id}") // DELETE - 删除
```

### `classpath:`  是什么路径？

`classpath:` 是 Java 中用来引用**类路径**资源的协议前缀，指向编译后所有类文件和资源文件所在的根目录。

`src/main/resources/` 下的所有文件，编译后都在 classpath 根目录，`classpath:` 在不同场景下的实际路径：

* **IDE 中运行**：项目根目录/target/classes/。
* **JAR 包运行**：JAR 包内部的根目录。
* **Maven 测试**：项目根目录/target/test-classes/。

### @Transactional 是什么

**@Transactional** 是 Spring 提供的**声明式事务注解**，标记在方法或类上，表示该方法/类的所有数据库操作要在同一个事务中执行。

**事务**是一组数据库操作，要么**全部成功**，要么**全部失败**。

```java
@Transactional(
    propagation = Propagation.REQUIRED,  // 事务传播行为
    isolation = Isolation.DEFAULT,       // 隔离级别
    timeout = 30,                        // 超时时间（秒）
    rollbackFor = {RuntimeException.class},  // 遇到什么异常回滚
    noRollbackFor = {}                   // 遇到什么异常不回滚
)
public void someMethod() {}
```

### 拦截链

Filter / Interceptor / AOP：

* Filter：Servlet 容器层的拦截器，最早执行。
* Interceptor：Spring MVC 层的拦截器，在 Filter 之后、Controller 之前。
* AOP：面向切面编程，把重复代码抽出来统一处理。

执行层次不同，`Filter > Interceptor > AOP`，静态资源用 Filter，请求用 Interceptor，方法用 AOP。

#### Filter 

Java Servlet 规范中的接口，在请求到达 Servlet 之前处理。

**适用场景**：字符编码设置（`CharacterEncodingFilter`）、跨域处理（`CorsFilter`）、XSS 防护、请求压缩、静态资源访问控制。

```java
@Component
@WebFilter(urlPatterns = "/*")
public class LoggingFilter implements Filter {
    
    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        
        log.info("Filter - 请求开始：{} {}", req.getMethod(), req.getRequestURI());
        
        long start = System.currentTimeMillis();
        chain.doFilter(request, response);  // 继续执行
        long end = System.currentTimeMillis();
        
        log.info("Filter - 请求结束：耗时 {}ms", end - start);
    }
}
```

#### Interceptor 

Spring MVC 提供的拦截器，在请求进入 Controller 前后处理。

**适用场景**：登录检查、权限验证（需要 Controller 参数的场景）、请求日志记录、性能监控（记录 Controller 执行时间）、多租户识别。

```java
@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    private static final Logger log = LoggerFactory.getLogger(AuthInterceptor.class);
    
    // Controller 执行前调用
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("Interceptor - preHandle: {}", request.getRequestURI());
        
        // 检查是否登录
        String token = TokenCookie.readCookie(request, "auth_token");
        if (token == null) {
            response.setStatus(401);
            response.getWriter().write("未授权");
            return false;  // 拦截，不继续执行
        }
        
        return true;  // 放行
    }
    
    // Controller 执行后，视图渲染前调用
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        log.info("Interceptor - postHandle");
    }
    
    // 视图渲染后调用（无论成功或异常）
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        log.info("Interceptor - afterCompletion");
    }
}

// 配置拦截器
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private AuthInterceptor authInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/login");
    }
}
```

#### AOP

**AOP（Aspect Oriented Programming）**，即面向切面编程。Spring 提供的面向切面编程，可以拦截任意 Spring Bean 的方法。

**适用场景**：事务管理（`@Transactional`）、日志记录、性能监控（方法耗时）、缓存管理（`@Cacheable`）、权限检查（`@PreAuthorize`）、防重复提交、数据脱敏。

```java
// 1. 定义注解
package com.lizhao.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)           // 只能用在方法上
@Retention(RetentionPolicy.RUNTIME)   // 运行时保留
public @interface TrackTime {
}

// 2.定义 AOP
package com.lizhao.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class TimeAspect {
    
    private static final Logger log = LoggerFactory.getLogger(TimeAspect.class);
    
    // 拦截所有带有 @TrackTime 注解的方法
    @Around("@annotation(com.lizhao.annotation.TrackTime)")
    public Object trackTime(ProceedingJoinPoint joinPoint) throws Throwable {
        // 1. 方法执行前
        String methodName = joinPoint.getSignature().getName();
        long start = System.currentTimeMillis();
        
        // 2. 执行原方法
        Object result = joinPoint.proceed();
        
        // 3. 方法执行后
        long end = System.currentTimeMillis();
        log.info("{} 耗时：{}ms", methodName, end - start);
        
        return result;
    }
}

// 3.使用 AOP
package com.lizhao.service;

import com.lizhao.annotation.TrackTime;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @TrackTime  // 添加注解，这个方法会被拦截
    public User findById(Long id) {
        // 模拟耗时操作
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return new User(id, "张三");
    }
    
    public void save(User user) {
        // 没有 @TrackTime，不会被拦截
        System.out.println("保存用户：" + user.getName());
    }
}
```

也可以不使用注解的写法（按包名拦截）：

```java
@Aspect
@Component
public class TimeAspect {
    
    // 拦截 service 包下所有类的所有方法
    @Around("execution(* com.lizhao.service.*.*(..))")
    public Object trackTime(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        long start = System.currentTimeMillis();
        
        Object result = joinPoint.proceed();
        
        long end = System.currentTimeMillis();
        System.out.println(methodName + " 耗时：" + (end - start) + "ms");
        
        return result;
    }
}
```

## 参考文档

[Spring Boot 最全面的入门教程](https://springdoc.cn/spring-boot-start/)

[Spring Boot 中文文档](https://springdoc.cn/spring-boot/)


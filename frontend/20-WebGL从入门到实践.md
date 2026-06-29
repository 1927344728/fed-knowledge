## WebGL 从入门到实践

**WebGL（Web Graphics Library，Web 图形库）** 是浏览器内置的 JavaScript API，用于在 HTML5 `<canvas>` 元素中渲染高性能的 2D 和 3D 图形。

**核心特点：**

- **无需插件**：直接在浏览器中运行。
- **硬件加速**：利用 GPU（显卡）进行渲染。
- **底层 API**：直接与 GPU 通信，性能极高。
- **基于 OpenGL ES**：语法和概念类似 OpenGL。

### 简单示例

#### 三角形（2D）

```javascript
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
  <title>WebGL</title>
  <style>
    * { margin: 0; padding: 0; } 
    canvas { display: block; background: black; }
  </style>
</head>
<body>
  <script>
    // 获取 WebGL 上下文
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // 定义顶点数据（三角形三个点的坐标）
    const vertices = new Float32Array([
       0.0,  0.5,  // 顶点 A（上中点）
      -0.5, -0.5,  // 顶点 B（左下）
       0.5, -0.5   // 顶点 C（右下）
    ]);
    
    // 创建缓冲区并传入数据
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // 顶点着色器源码（GLSL 语言）
    const vsSource = `
      attribute vec2 a_position;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    // 片元着色器源码（GLSL 语言）
    const fsSource = `
      void main() {
        gl_FragColor = vec4(1, 1, 1, 1.0);
      }
    `;
    
    // 创建并编译着色器
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    // 创建并链接程序
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    
    // 将缓冲区数据关联到着色器变量
    const a_position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    
    // 清屏并绘制三角形
    gl.clearColor(0, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
		// 绘制三角形：从第0个顶点开始，画3个顶点
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  </script>
</body>
</html>
```

#### 彩色渐变三角形（2D）

```javascript
import { vsSource, fsSource, createWebGLContext, compileShader, createProgram, createBuffer, bindAttrib } from './webGL.mjs';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
   0.0,  0.5,  1.0, 0.0, 0.0,  // 顶点 A（上中点）红色
  -0.5, -0.5,  0.0, 1.0, 0.0,  // 顶点 B（左下）绿色
   0.5, -0.5,  0.0, 0.0, 1.0   // 顶点 C（右下）蓝色
]);
createProgram(gl, vsSource, fsSource);
createBuffer(gl, vertices, true);
bindAttrib(gl, 'a_position', 2, 20, 0);
bindAttrib(gl, 'a_color', 3, 20, 8);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=1)

#### 旋转立方体（3D）

```javascript
import { vsSource, fsSource, createWebGLContext, compileShader, createProgram, createBuffer, bindAttrib } from './webGL.mjs';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);

// 立方体顶点数据：每个面 6 个顶点（2 个三角形），6 个面共 36 个顶点
// 顶点格式: [x, y, z, r, g, b]

// 前面 (z = 0.5) - 红色
const front = [
  -0.5, -0.5, 0.5,  1, 0, 0,
   0.5, -0.5, 0.5,  1, 0, 0,
   0.5,  0.5, 0.5,  1, 0, 0,
  -0.5, -0.5, 0.5,  1, 0, 0,
   0.5,  0.5, 0.5,  1, 0, 0,
  -0.5,  0.5, 0.5,  1, 0, 0
];

// 后面 (z = -0.5) - 绿色
const back = [
  -0.5, -0.5, -0.5,  0, 1, 0,
   0.5, -0.5, -0.5,  0, 1, 0,
   0.5,  0.5, -0.5,  0, 1, 0,
  -0.5, -0.5, -0.5,  0, 1, 0,
   0.5,  0.5, -0.5,  0, 1, 0,
  -0.5,  0.5, -0.5,  0, 1, 0
];

// 左面 (x = -0.5) - 蓝色
const left = [
  -0.5, -0.5, -0.5,  0, 0, 1,
  -0.5, -0.5,  0.5,  0, 0, 1,
  -0.5,  0.5,  0.5,  0, 0, 1,
  -0.5, -0.5, -0.5,  0, 0, 1,
  -0.5,  0.5,  0.5,  0, 0, 1,
  -0.5,  0.5, -0.5,  0, 0, 1
];

// 右面 (x = 0.5) - 黄色
const right = [
   0.5, -0.5, -0.5,  1, 1, 0,
   0.5, -0.5,  0.5,  1, 1, 0,
   0.5,  0.5,  0.5,  1, 1, 0,
   0.5, -0.5, -0.5,  1, 1, 0,
   0.5,  0.5,  0.5,  1, 1, 0,
   0.5,  0.5, -0.5,  1, 1, 0
];

// 上面 (y = 0.5) - 品红
const top = [
  -0.5,  0.5, -0.5,  1, 0, 1,
  -0.5,  0.5,  0.5,  1, 0, 1,
   0.5,  0.5,  0.5,  1, 0, 1,
  -0.5,  0.5, -0.5,  1, 0, 1,
   0.5,  0.5,  0.5,  1, 0, 1,
   0.5,  0.5, -0.5,  1, 0, 1
];

// 下面 (y = -0.5) - 青色
const bottom = [
  -0.5, -0.5, -0.5,  0, 1, 1,
  -0.5, -0.5,  0.5,  0, 1, 1,
   0.5, -0.5,  0.5,  0, 1, 1,
  -0.5, -0.5, -0.5,  0, 1, 1,
   0.5, -0.5,  0.5,  0, 1, 1,
   0.5, -0.5, -0.5,  0, 1, 1
];

const vertices = new Float32Array([...front, ...back, ...left, ...right, ...top, ...bottom]);
const cubeVS = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform float u_time;

  void main() {
    v_color = a_color;

    // 绕 Y 轴旋转
    float angle = u_time;
    float c = cos(angle);
    float s = sin(angle);

    vec3 pos = vec3(
      a_position.x * c + a_position.z * s,
      a_position.y,
      a_position.z * c - a_position.x * s
    );

    // 简单透视投影
    float zDepth = 2.0;
    float scale = zDepth / (zDepth + pos.z * 0.5);
    pos.x *= scale;
    pos.y *= scale;

    gl_Position = vec4(pos, 1.0);
  }
`;
const cubeFS = `
  precision mediump float;
  varying vec3 v_color;

  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;

const program = createProgram(gl, cubeVS, cubeFS);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 3, 24, 0);
bindAttrib(gl, 'a_color', 3, 24, 12);


const u_time = gl.getUniformLocation(program, 'u_time');
gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);

let startTime = performance.now();
function animate(now) {
  const elapsed = (now - startTime) / 1000;

  gl.uniform1f(u_time, elapsed);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  requestAnimationFrame(animate);
}

animate(startTime);
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=2)

### WebGL 核心概念

* **着色器（Shader）**：用 **GLSL**（OpenGL Shading Language，类 C 语言）编写的小程序，在 GPU 上运行。
* **顶点着色器（Vertex Shader）**：处理每个顶点（3D 点）的位置、颜色、法线等属性。
* **片元着色器（Fragment Shader）**：决定屏幕上每个像素（片段）的最终颜色。
* **图元类型（Primitives）**：所有 3D 模型最终都分解为三角形。WebGL 支持的基础图元：`gl.POINTS`—点、`gl.LINES`—线、`gl.LINE_STRIP`—线带、`gl.TRIANGLES`—三角形、`gl.TRIANGLE_STRIP`—三角带、`gl.TRIANGLE_FAN`—三角扇。

* **缓冲区 (Buffers)**：数据传输的容器，是 GPU 内存中存储数据的区域，所有顶点数据必须先放入缓冲区。
* **纹理（Textures）**：图像映射到表面。纹理不是简单的图片，而是 GPU 中的特殊数据结构支持快速采样。

### WebGL 上下文

WebGL 基于 canvas 标签运行，**canvas 只是画布容器，本身没有绘图能力**。从 canvas 上**获取 WebGL 上下文对象**，才能进行所有绘制、着色器、纹理、缓冲区等操作。

```javascript
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// 获取 WebGL 上下文
const gl = canvas.getContext('webgl');
gl.viewport(0, 0, canvas.width, canvas.height);

// 设置纯色背景
gl.clearColor(0, 0.7, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);
```

* `gl.viewport`：视口定义了 NDC 坐标映射到 canvas 像素的矩形区域。
* `gl.clearColor()`：清空画布时用什么颜色填充。RGBA 颜色模型，范围 0.0 ~ 1.0。
* `gl.clear()`：执行清空操作，用 `clearColor` 方法设置的颜色填充整个画布。
* `gl.enable()`：开启深度测试，让 GPU 判断物体前后遮挡关系。
* `gl.disable(gl.CULL_FACE)`：关闭背面剔除（即两面都绘制）。

### 三维坐标系统

WebGL 使用**右手坐标系**。它定义了坐标轴的**方向规则**，**适用于所有坐标空间**（局部、世界、相机、裁剪、NDC、屏幕）。

```txt
        Y (上)
        |
        |
        +------ X (右)
       /
      /
     Z (屏幕向外)
```

#### 坐标空间（6 个）

* **局部坐标**：定义物体的原始形状。原点是物体自身的中心，范围任意。
* 世界坐标 ：所有物体共同的空间，决定物体位置。原点是世界原点（三维世界坐标系的原点 `(0, 0, 0)`），范围任意。
* 相机坐标：以相机为参考点，物体在相机前方/后方/左右。原点相机位置，范围任意。
* 裁剪坐标：投影变换后的结果，准备裁剪。原点是屏幕中心，范围是 **-w 到 w**（w 是齐次坐标的第四个分量）。
* NDC 坐标：透视除法后的结果，GPU 自动完成。原点是屏幕中心，范围是 **-1 到 1**。
* 屏幕坐标：最终显示的像素坐标。原点是屏幕左下角（或左上角），范围是 **(0,0) 到 (屏幕宽, 屏幕高)**。

```txt
局部坐标 (Local)
	 ↓ 模型矩阵 (Model)
世界坐标 (World)
   ↓ 视图矩阵 (View)
相机坐标 (Camera/View)
   ↓ 投影矩阵 (Projection)
裁剪坐标 (Clip)
   ↓ 透视除法 (除以 w)
NDC坐标 (Normalized Device Coordinates)
   ↓ 视口变换 (viewport + depthrange)
屏幕坐标 (Screen)
```

#### NDC 坐标

WebGL 核心使用**标准化设备坐标系（NDC）**。

WebGL 数据流转顺序：**顶点坐标 → 模型 / 视图 / 投影变换 → 标准化设备坐标 (NDC) → 屏幕像素坐标**。

**标准化设备坐标（NDC）**：X、Y、Z 三轴坐标范围都是 `[-1, 1]`，以**画布正中心**为原点 `(0,0,0)`。**X 轴**向右为正，**Y 轴**向上为正，**Z 轴**垂直屏幕向外为正（朝向观察者）。

```txt
(-1, 1) 左上角     (1, 1) 右上角
    +-----------------+
    |                 |
    |     (0,0) 中心  |
    |                 |
    +-----------------+
(-1,-1) 左下角     (1,-1) 右下角
```

```javascript
// 顶点坐标
const vertices = new Float32Array([
   0.0,  0.5,  // 顶点 A（上中点）
  -0.5, -0.5,  // 顶点 B（左下）
   0.5, -0.5   // 顶点 C（右下）
]);

// 顶点坐标转为 NDC 坐标
export const vsSource = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = a_color;
  }
`;
```

### 缓冲区

WebGL 缓冲区是**GPU 显存中的一块内存区域**，专门用来存放顶点坐标、颜色、纹理坐标等顶点数据，是 JS 向 GPU 批量传输数据的核心载体。

一个场景可创建多个缓冲区，分别存放位置、颜色、纹理坐标等不同属性数据。

**核心作用**：

- 数据持久化：数据存入 GPU 显存，避免每次绘制重复传参，**大幅提升性能**。
- 批量传输：一次性把大量顶点数据交给 GPU，适配图形批量渲染逻辑。
- 数据隔离：CPU 内存与 GPU 显存分离，缓冲区是两者的数据中转站。

**基础使用流程（标准四步）**：

- **创建缓冲区**：`gl.createBuffer()`。
- **绑定缓冲区**：`gl.bindBuffer(目标类型, 缓冲区)`，指定缓冲区用途。
- **写入数据**：`gl.bufferData(目标类型, 数据, 数据使用模式)`，把 JS 数组数据拷贝到 GPU 显存。
- **解绑（可选）**：`gl.bindBuffer(目标类型, null)`

**缓冲区绑定目标类型**：

* `gl.ARRAY_BUFFER`：存储**顶点属性数据**，如顶点位置、颜色、纹理坐标、法线等。

* `gl.ELEMENT_ARRAY_BUFFER`：存储**顶点索引数据**，配合索引绘制，复用顶点、减少数据冗余。

**数据使用模式**：告诉 GPU 数据的**读写频率**，GPU 会据此优化内存布局。

- `gl.STATIC_DRAW`：数据**只写入一次，多次绘制**（静态图形、模型，最常用）。
- `gl.DYNAMIC_DRAW`：数据**频繁修改、多次绘制**（动画、实时变化图形）。
- `gl.STREAM_DRAW`：数据**每次绘制都更新**（高频动态画面）。

```javascript
const vertices = new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
   0.0,  0.5
]);

const buffer = gl.createBuffer();           // 创建空箱子
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);     // 指定当前操作的箱子
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 把数据装进去
// gl.bindBuffer(gl.ARRAY_BUFFER, null);    // 解绑
```

### 着色器

着色器是运行在**GPU**上的小程序，用 **GLSL ES** 语言编写，是 WebGL 渲染管线的核心。

**渲染管线流程**：JS (CPU) → 缓冲区传顶点数据 → **顶点着色器**（逐顶点运算） → 光栅化 → **片元着色器**（逐像素运算） → 屏幕像素。

#### GLSL ES 核心变量类型

- `float`：浮点数（最常用）。
- `vec2 / vec3 / vec4`：二维 / 三维 / 四维向量（坐标、颜色）。
- `int`：整型。
- `mat2 / mat3 / mat4`：矩阵（用于位移、旋转、缩放、投影变换）。
- `bool`：布尔值。

```glsl
attribute vec2 a_position;
varying vec2 v_color;
uniform mat4 u_matrix;
```

#### 着色器变量

WebGL 中三类着色器变量：

* `attribute`：仅用于**顶点着色器**，接收 **CPU / 缓冲区** 传来的**逐顶点数据**（坐标、纹理坐标）。
* `varying`：顶点着色器**输出**，片元着色器**输入**，顶点间会自动**平滑插值**，实现渐变效果。
* `uniform`：两个着色器都可使用。由 JS 传入**全局统一数据**（全局颜色、变换矩阵、纹理、时间），一帧内所有顶点 / 像素共用同一份值。

#### 顶点着色器

对每个顶点执行的 GPU 小程序，计算顶点在屏幕上的最终位置。

**核心职责**：

- 接收 CPU 传来的顶点数据（坐标、纹理、颜色等）。
- 计算并输出顶点在 **NDC 坐标系** 下的最终位置（内置变量 `gl_Position`）。
- 向片元着色器传递插值数据（颜色、纹理坐标等）。

```glsl
// 从 JS 接收的顶点坐标，比如第一点 (0.0, 0.5)
attribute vec2 a_position;
void main() {
  // gl_Position 是内置变量，必须赋值
  // vec4 是四维向量 (x, y, z, w)，这里 z=0, w=1
  gl_Position = vec4(a_position, 0.0, 1.0); 
}
```

```javascript
const vsSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0); 
  }
`;
```

#### 片元着色器

对每个像素执行的 GPU 小程序，决定屏幕上每个像素的颜色。

**核心职责**：

- 接收顶点着色器传来的插值数据。
- 计算当前像素最终颜色，赋值给内置变量 `gl_FragColor`。

```glsl
varying vec3 v_color;
void main() {
	gl_FragColor = vec4(v_color, 1.0);
}
```

```javascript
const fsSource = `
  void main() {
    gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0);
  }
`;
```

#### 顶点着色器向片元着色器传值

顶点着色器用 **`varying`** 输出顶点数据，经过 GPU 光栅化**线性插值**后，自动送入片元着色器里**同名同类型**的 `varying` 变量，完成数据传递。

**数据流转**：

- **逐顶点赋值**：每个顶点执行一次顶点着色器，给**`varying` 变量**赋予当前顶点对应的颜色值。
- **光栅化（自动插值）**：GPU 把三角形拆分成无数像素（片元），**在相邻顶点之间做线性插值**。具体：靠近红点的像素 → 偏红，靠近绿点的像素 → 偏绿，中间区域平滑过渡——这就是渐变效果的来源。
- **逐片元传入**：插值后的新值，自动送入片元着色器的同名 `varying` 变量。
- **片元着色器使用**：每个像素拿到插值结果，计算最终颜色并渲染。

**顶点着色器**：

```glsl
attribute vec2 a_Position;
attribute vec3 a_Color;
// 用于向片元着色器传值
varying vec3 v_Color; 
void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  v_Color = a_Color;
}
```

**片元着色器**：

```glsl
// 和顶点着色器同名、同类型，接收传过来的数据
varying vec3 v_Color;
void main() {
	gl_FragColor = vec4(v_Color, 1.0);
}
```

#### 着色器使用

WebGL 着色器使用完整流程：

- **创建着色器对象**：`gl.createShader()`。
- **绑定源码**：`gl.shaderSource()。`
- **编译着色器**：`gl.compileShader()`。
- **创建程序对象**：`gl.createProgram()`。
- **附着着色器**：`gl.attachShader()`。
- **链接程序**：`gl.linkProgram()`。
- **启用程序**：`gl.useProgram()`。

```javascript
// 定义着色器源码
const vertexSource = `attribute vec2 a_Position; void main(){ gl_Position=vec4(a_Position,0,1); }`;
const fragSource = `void main(){ gl_FragColor=vec4(1,1,0,1); }`;

// 编译着色器
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}
const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
const fs = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

// 创建并链接程序
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

// 启用程序
gl.useProgram(program);
```

#### 缓冲区数据关联着色器变量

* 获取 attribute 地址：`gl.getAttribLocation()`。
* 启用顶点属性：`gl.enableVertexAttribArray()`，WebGL 默认关闭所有 attribute。
* 数据解析规则：`gl.vertexAttribPointer()`。

```javascript
const a_position = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
```

```javascript
gl.vertexAttribPointer(
  a_position,     // 第1参：attribute 地址
  2,              // 第2参：每个顶点占用**分量个数**(vec2=2, vec3=3, vec4=4)
  gl.FLOAT,       // 第3参：数据类型（缓冲区是 Float32Array 就用 gl.FLOAT）
  false,          // 第4参：是否归一化（浮点坐标一般 false；颜色/整型常用 true）
  0,              // 第5参：步长(字节)，0=连续紧凑排列
  0               // 第6参：数据起始偏移(字节)，0=从缓冲区头部开始
);
```

### 图元绘制

**图元** 是 WebGL 支持的最基本的绘图单元。所有复杂的 3D 模型最终都是由图元（主要是三角形）组成的。

#### 图元类型

WebGL 支持的 7 种图元类型：

* 点：`gl.POINTS`，1 个顶点。
* 线：`gl.LINES，2 个顶点。
* 线带：`gl.LINE_STRIP`，N 个顶点。
* 线环：`gl.LINE_LOOP`，N 个顶点。
* 三角形：`gl.TRIANGLES`，3 个顶点。
* 三角带：`gl.TRIANGLE_STRIP`，N 个顶点。
* 三角扇：`gl.TRIANGLE_FAN`，N 个顶点。

**任何用 `TRIANGLE_STRIP` 画的图形，都可以用 `TRIANGLES` 画出来**，只是需要更多顶点。GPU 在处理 `TRIANGLE_STRIP` 时会**自动缓存最后两个顶点**，减少内存读取次数。

```javascript
function drawPoints(gl) {
  const points = [];
  for (let i = 0; i < 30; i++) {
    const x = (Math.random() - 0.5) * 1.8;
    const y = (Math.random() - 0.5) * 1.8;
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    points.push(x, y, r, g, b);
  }
  const vertices = new Float32Array(points);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 30);
}

function drawLines(gl) {
  const vertices = new Float32Array([
    // 线段1: 从左到右
    -0.8, 0.5,  1.0, 0.0, 0.0,
    0.0, 0.5,  1.0, 0.0, 0.0,
    // 线段2: 斜线
    -0.5, 0.0,  0.0, 1.0, 0.0,
    0.3, -0.4, 0.0, 1.0, 0.0,
    // 线段3: 竖线
    0.5, -0.8, 0.0, 0.0, 1.0,
    0.5,  0.2, 0.0, 0.0, 1.0
  ]);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, 6);
}

function drawLineStrip(gl) {
  const vertices = new Float32Array([
    -0.8, -0.6, 1.0, 0.2, 0.2,
    -0.4,  0.5, 1.0, 0.5, 0.0,
    0.0, -0.3, 0.0, 1.0, 0.0,
    0.5,  0.4, 0.0, 0.5, 1.0,
    0.8, -0.5, 0.8, 0.0, 0.8
  ]);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_STRIP, 0, 5);
}

function drawLineLoop(gl) {
  const vertices = new Float32Array([
   0.0,  0.8, 1.0, 0.0, 0.0,
   0.7,  0.3, 1.0, 0.5, 0.0,
   0.4, -0.5, 0.0, 1.0, 0.0,
   -0.4, -0.5, 0.0, 0.5, 1.0,
   -0.7,  0.3, 0.8, 0.0, 0.8
 ]);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_LOOP, 0, 5);
}

function drawTriangles(gl) {
  const vertices = new Float32Array([
    // 三角形1（红色）
    -0.6,  0.3, 1.0, 0.0, 0.0,
    -0.8, -0.2, 1.0, 0.0, 0.0,
    -0.2, -0.2, 1.0, 0.0, 0.0,
    // 三角形2（蓝色）
    0.2,  0.4, 0.0, 0.0, 1.0,
    0.6, -0.1, 0.0, 0.0, 1.0,
    0.8,  0.3, 0.0, 0.0, 1.0
  ]);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function drawTriangleStrip(gl) {
  const vertices = new Float32Array([
    -0.7,  0.5, 1.0, 0.0, 0.0,  // v0 红色
     0.7,  0.5, 0.0, 1.0, 0.0,  // v1 绿色
    -0.7, -0.5, 0.0, 0.0, 1.0,  // v2 蓝色
     0.7, -0.5, 1.0, 1.0, 0.0   // v3 黄色
   ]);
  createBuffer(gl, vertices);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function drawTriangleFan(gl) {
  const centerX = 0, centerY = 0;
  const radius = 0.8;
  const segments = 8;
  const vertices = [];

  vertices.push(centerX, centerY, 1.0, 1.0, 1.0);

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const hue = i / segments;
    // HSV 转 RGB 简化版
    const r = Math.sin(hue * Math.PI * 2);
    const g = Math.sin((hue + 0.33) * Math.PI * 2);
    const b = Math.sin((hue + 0.67) * Math.PI * 2);
    vertices.push(x, y, (r + 1) / 2, (g + 1) / 2, (b + 1) / 2);
  }

  const vertexArray = new Float32Array(vertices);
  createBuffer(gl, vertexArray);
  createProgram(gl, vsSource, fsSource);
  bindAttrib(gl, 'a_position', 2, 20, 0);
  bindAttrib(gl, 'a_color', 3, 20, 8);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, segments + 2);
}

const funcs = [drawPoints, drawLines, drawLineStrip, drawLineLoop, drawTriangles, drawTriangleStrip, drawTriangleFan];
funcs.forEach(f => {
  const { gl } = createWebGLContext(window.innerWidth, window.innerWidth);
  f(gl);
});
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=3)

#### 绘制方法

WebGL 中有 **3 种** 绘制方法，核心区别在于**顶点数据的组织方式**。

* drawArrays：按缓冲区中的**顺序**取顶点。
* drawElements：通过**索引**引用顶点，实现顶点复用。
* drawArraysInstanced：同一个物体绘制多次，每次可以有不同的属性。

```javascript
gl.drawArrays(mode, first, count);
gl.drawElements(mode, count, type, offset)
gl.drawArraysInstanced(mode, first, count, instanceCount)
```

**参数说明**：

* `mode`：图元类型，**指定如何把顶点拼接成图形**。常见图元类型：`gl.POINTS`—点、`gl.LINES`—线、`gl.LINE_STRIP`—线带、`gl.TRIANGLES`—三角形、`gl.TRIANGLE_STRIP`—三角带、`gl.TRIANGLE_FAN`—三角扇。
* `first`：起始偏移，从缓冲区第几个顶点开始读取。
* `count`：顶点总数，表示一共读取多少个顶点用于绘制。
* `type`：索引数据类型，决定了**每个索引占用多少字节**。
  * `gl.UNSIGNED_BYTE`：1 字节，索引取值范围 0 ~ 255。
  * `gl.UNSIGNED_SHORT`：2 字节，索引取值范围 0 ~ 65,535。

  * `gl.UNSIGNED_INT`：4 字节，索引取值范围 0 ~ 4,294,967,295。
* `offset`：索引缓冲区起始偏移（字节）。
* `instanceCount`：实例数量。

```javascript
const vertices = new Float32Array([
   0.0,  0.6,  1.0, 0.0, 0.0,  // 顶点0
  -0.6, -0.4,  0.0, 1.0, 0.0,  // 顶点1
   0.6, -0.4,  0.0, 0.0, 1.0   // 顶点2
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

gl.drawArrays(gl.TRIANGLES, 0, 3);
```

```javascript
const vertices = new Float32Array([
  -0.6,  0.4,  1.0, 0.0, 0.0,  // v0 左上
   0.6,  0.4,  0.0, 1.0, 0.0,  // v1 右上
  -0.6, -0.4,  0.0, 0.0, 1.0,  // v2 左下
   0.6, -0.4,  1.0, 1.0, 0.0   // v3 右下
]);

const indices = new Uint16Array([
  0, 1, 2,   // 三角形1: v0,v1,v2
  1, 2, 3    // 三角形2: v1,v2,v3
]);

// 创建顶点缓冲区（存内容）
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 创建索引缓冲区（存顺序），gl.drawElements 会自动读取
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
```

```javascript
const INSTANCE_COUNT = 50;

// 单个矩形的顶点数据
const vertices = new Float32Array([
  // 位置(x,y)      颜色(r,g,b)
  -0.1,  0.1,      1.0, 0.0, 0.0,  // v0 左上
   0.1,  0.1,      0.0, 1.0, 0.0,  // v1 右上
  -0.1, -0.1,      0.0, 0.0, 1.0,  // v2 左下
   0.1, -0.1,      1.0, 1.0, 0.0   // v3 右下
]);

// 实例数据：每个实例的偏移位置（x, y）
const instanceOffsets = new Float32Array(INSTANCE_COUNT * 2);
for (let i = 0; i < INSTANCE_COUNT; i++) {
  instanceOffsets[i * 2] = (Math.random() - 0.5) * 1.6;
  instanceOffsets[i * 2 + 1] = (Math.random() - 0.5) * 1.4;
}

// 创建顶点缓冲区（矩形形状）
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 创建实例数据缓冲区（每个矩形的偏移）
const instanceBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
gl.bufferData(gl.ARRAY_BUFFER, instanceOffsets, gl.STATIC_DRAW);

// 顶点着色器（接收位置、颜色、实例偏移）
const vsSource = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  attribute vec2 a_offset;  // 实例偏移（每实例不同）
  varying vec3 v_color;
  void main() {
    vec2 pos = a_position + a_offset;
    gl_Position = vec4(pos, 0.0, 1.0);
    v_color = a_color;
  }
`;

// 片元着色器
const fsSource = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;

// 设置顶点属性（每个顶点变化）
// 绑定顶点缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const a_position = gl.getAttribLocation(program, 'a_position');
const a_color = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(a_position);
gl.enableVertexAttribArray(a_color);
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 20, 0);
gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 20, 8);

// 设置实例属性（每实例变化一次）
// 绑定实例缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
const a_offset = gl.getAttribLocation(program, 'a_offset');
gl.enableVertexAttribArray(a_offset);
gl.vertexAttribPointer(a_offset, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribDivisor(a_offset, 1);

gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, INSTANCE_COUNT);
```

### 矩阵

三个核心矩阵：

* **模型矩阵 (Model Matrix)**：将物体从局部坐标变换到世界坐标。
* **视图矩阵 (View Matrix)**：将世界坐标变换到相机坐标。
* **投影矩阵 (Projection Matrix)**：将3D 坐标投影到2D 屏幕。

简单三角形：

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib, vsSource, fsSource } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
   0.0,  0.5,  1.0, 0.0, 0.0,  // 上中点，红色
  -0.5, -0.5,  0.0, 1.0, 0.0,  // 左下，绿色
   0.5, -0.5,  0.0, 0.0, 1.0   // 右下，蓝色
]);

const program = createProgram(gl, vsSource, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 20, 0);
bindAttrib(gl, 'a_color', 3, 20, 8);

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

#### 模型矩阵

模型矩阵的作用是将物体从**局部坐标**变换到**世界坐标**。

```txt
局部坐标 (物体自身的形状定义)
   ↓ 模型矩阵
世界坐标 (物体在场景中的位置、方向、大小)
```

**核心功能**：

- **平移**：把物体放到世界中的某个位置。
- **旋转**：改变物体的朝向。
- **缩放**：改变物体的大小。

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib, fsSource } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
   0.0,  0.5,  1.0, 0.0, 0.0,  // 上中点，红色
  -0.5, -0.5,  0.0, 1.0, 0.0,  // 左下，绿色
   0.5, -0.5,  0.0, 0.0, 1.0   // 右下，蓝色
 ]);

const modelVS = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform mat3 u_modelMatrix;

  void main() {
      v_color = a_color;
      vec3 pos = u_modelMatrix * vec3(a_position, 1.0);
      gl_Position = vec4(pos.xy, 0.0, 1.0);
  }
`;

const program = createProgram(gl, modelVS, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 20, 0);
bindAttrib(gl, 'a_color', 3, 20, 8);

// 构建模型矩阵 (平移 × 旋转 × 缩放)
// 顺序：先缩放，再旋转，最后平移
function buildModelMatrix(tx, ty, sx, sy, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([
    sx * c,  sx * s, 0,
    -sy * s, sy * c, 0,
    tx,      ty,     1
  ]);
}

function applyMatrix(matrix) {
  const u_modelMatrix = gl.getUniformLocation(program, 'u_modelMatrix');
  gl.uniformMatrix3fv(u_modelMatrix, false, matrix);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function setModel (tx, ty, sx, sy, angle) {
  const currentMatrix = buildModelMatrix(tx, ty, sx, sy, angle);
  applyMatrix(currentMatrix);
};

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.enable(gl.DEPTH_TEST);

setModel(0, 0, 1, 1, 0);
window.setModel = setModel
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=4)

#### 视图矩阵

视图矩阵的作用是将**世界坐标**变换到**相机坐标**（以相机为原点的坐标系）。

```txt
世界坐标 (物体在世界中的绝对位置)
   ↓ 视图矩阵
相机坐标 (相对于相机的位置)
   ↓ 投影矩阵
裁剪坐标
```

**核心功能**：

- **平移**：将相机位置移动到原点 (0,0,0)。
- **旋转**：将相机的朝向旋转到 -Z 方向。

相机的旋转可以基于 X、Y、Z 三个轴：

* 绕 X 轴：俯仰。即低头、抬头，看上下。
* 绕 Y 轴：偏航。即左右转头，看左右。
* 绕 Z 轴：旋转。类似**2D 平面的旋转**。

**平移矩阵**：

```javascript
// 相机在 (eyeX, eyeY, eyeZ)
// 场景反向移动 (-eyeX, -eyeY, -eyeZ)
[
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -eyeX, -eyeY, -eyeZ, 1
]
```

**旋转矩阵**：

```javascript
// 旋转矩阵 = [X轴, Y轴, Z轴] 的转置
[
    X.x, Y.x, Z.x, 0,
    X.y, Y.y, Z.y, 0,
    X.z, Y.z, Z.z, 0,
    0,   0,   0,   1
]
```

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib, fsSource } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
   0.0,  0.5,  0.0,    1.0, 0.0, 0.0,  // 顶点A 红色
  -0.5, -0.5,  0.0,    0.0, 1.0, 0.0,  // 顶点B 绿色
   0.5, -0.5,  0.0,    0.0, 0.0, 1.0   // 顶点C 蓝色
]);

const viewVS = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform mat4 u_viewMatrix;

  void main() {
    v_color = a_color;
    vec4 pos = u_viewMatrix * vec4(a_position, 1.0);
    gl_Position = pos;
  }
`;

const program = createProgram(gl, viewVS, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 3, 24, 0);
bindAttrib(gl, 'a_color', 3, 24, 12);

const u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix');

// 构建视图矩阵 (简化版：先测试平移，暂时不做复杂旋转) 
function buildViewMatrix(eyeX, eyeY, eyeZ) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -eyeX, -eyeY, -eyeZ, 1
  ]);
}

// 单位矩阵：没有任何变换，相当于相机在原点看向 -Z 的默认状态
function getIdentityMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function applyMatrix(matrix) {
  gl.uniformMatrix4fv(u_viewMatrix, false, matrix);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

applyMatrix(getIdentityMatrix());

let currentEye = { x: 0, y: 0, z: 0 };
function getView() {
  console.log(`当前相机位置: (${currentEye.x}, ${currentEye.y}, ${currentEye.z})`);
}

function setView(eyeX, eyeY, eyeZ) {
  currentEye = { x: eyeX, y: eyeY, z: eyeZ };
  const matrix = buildViewMatrix(eyeX, eyeY, eyeZ);
  applyMatrix(matrix);
  getView()
}

function resetView() {
  setView(0, 0, 0);
  getView()
}

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.disable(gl.DEPTH_TEST);

window.setView = setView;
window.resetView = resetView;
window.getView = getView;

console.log('初始化完成，可用命令：');
console.log('setView(0, 0, 0.5)  - 相机放在 (0,0,0.5)');
console.log('setView(0.2, 0.2, 0)    - 相机放在 (0.2,0.2,0)');
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=5)

#### 投影矩阵

投影矩阵的作用是将**3D 坐标**投影到**2D 屏幕**，并产生**近大远小**（透视）或**等比例**（正交）的效果。

```txt
相机坐标 (x, y, z)
   ↓ 投影矩阵
裁剪坐标 (x, y, z, w)
   ↓ 透视除法 (除以 w)
NDC 坐标 (-1 到 1)
```

**核心功能**：

* **定义可视范围**：确定哪些物体在视锥体内。
* **近大远小**：透视投影产生真实感。
* **深度值计算**：生成 Z 值用于遮挡判断。
* **坐标映射**：将 3D 坐标映射到 NDC 范围 [-1,1]。

**视锥体是一个**平截头棱锥体：

* FOV（Field of View，视野角）：控制视锥体的张开程度。
* Aspect（宽高比）：控制视锥体的屏幕比例。
* Near（近平面）：最近能看到多近。
* Far（远平面）：最远能看到多远。

**投影矩阵的作用**，其实就是将视锥体映射到 NDC 立方体（-1 到 1）。

```javascript
       相机位置
          ●
         /|\
        / | \
       /  |  \      ← 视野边界（斜线）
      /   |   \
     /    |    \
    /  ┌──┼──┐  \   ← 近平面 (near)
   /   │  │  │   \
  /    │  │  │    \
 /     │  │  │     \
/   ┌──┼──┼──┐  \   ← 远平面 (far)
    │  │  │  │
    └──┘  └──┘
    ←可视范围→
```

透视投影：模拟**人眼真实视觉，近大远小**。

透视投影：又叫**中心投影**，是带透视效果的投影方式。存在**近大远小**，物体离相机越远，画面里尺寸越小。透视投影 = 定义一个**四棱台视锥体**可视区域，视锥体内的物体会投影到屏幕，视锥体外的顶点直接被裁剪丢弃。

正交投影：又叫**正射投影**，是一种**无透视**的投影方式。物体远近不会改变大小，没有近大远小效果。正交投影 = 定义一个长方体可视区域，长方体中的物体会被投影到屏幕上，长方体外的所有顶点被裁剪掉。

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib, fsSource } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
   0.0,  0.5, -0.5,    1.0, 0.0, 0.0,  // A: 红色, Z = -0.5 (靠前)
  -0.5, -0.5,  0.0,    0.0, 1.0, 0.0,  // B: 绿色, Z = 0.0
   0.5, -0.5,  0.5,    0.0, 0.0, 1.0   // C: 蓝色, Z = 0.5 (靠后)
]);

const projectionVS = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform mat4 u_projectionMatrix;

  void main() {
      v_color = a_color;
      vec4 pos = u_projectionMatrix * vec4(a_position, 1.0);
      gl_Position = pos;
  }
`;

const program = createProgram(gl, projectionVS, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 3, 24, 0);
bindAttrib(gl, 'a_color', 3, 24, 12);

const u_projectionMatrix = gl.getUniformLocation(program, 'u_projectionMatrix');
// 透视投影
function buildPerspectiveMatrix(fov, aspect, near, far) {
  const f = 1.0 / Math.tan(fov * Math.PI / 360);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0
  ]);
}

// 正交投影
function buildOrthoMatrix(left, right, bottom, top, near, far) {
  return new Float32Array([
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, -2 / (far - near), 0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -(far + near) / (far - near),
    1
  ]);
}

// 无投影（单位矩阵）
function buildNoneMatrix() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function applyMatrix(matrix, name) {
  gl.uniformMatrix4fv(u_projectionMatrix, false, matrix);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  console.log(`[${name}] 已应用`);
}


function setPerspective(fov, aspect, near, far) {
  fov = fov !== undefined ? fov : 45;
  aspect = aspect !== undefined ? aspect : (window.innerWidth / window.innerHeight);
  near = near !== undefined ? near : 0.1;
  far = far !== undefined ? far : 10;

  const matrix = buildPerspectiveMatrix(fov, aspect, near, far);
  applyMatrix(matrix, `透视投影 fov=${fov}°, near=${near}, far=${far}`);
}

// 正交投影：定义一个长方体可视区域
// left/right：控制 X 方向的宽度和位置
// bottom/top：控制 Y 方向的高度和位置
// near/far：控制 Z 方向的深度和位置
function setOrtho(left, right, bottom, top, near, far) {
  left = left !== undefined ? left : -1;
  right = right !== undefined ? right : 1;
  bottom = bottom !== undefined ? bottom : -1;
  top = top !== undefined ? top : 1;
  near = near !== undefined ? near : 0.1;
  far = far !== undefined ? far : 10;

  const matrix = buildOrthoMatrix(left, right, bottom, top, near, far);
  applyMatrix(matrix, `正交投影 left=${left}, right=${right}, bottom=${bottom}, top=${top}`);
}

function setNone() {
  const matrix = buildNoneMatrix();
  applyMatrix(matrix, '无投影（单位矩阵）');
}

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.enable(gl.DEPTH_TEST);

setNone();

window.setPerspective = setPerspective;
window.setOrtho = setOrtho;
window.setNone = setNone;

console.log('初始化完成，可用命令：');
console.log('无投影（默认）：setNone()');
console.log('')
console.log('正交投影：setOrtho(left, right, bottom, top, near, far)');
console.log('left/right/bottom/top/near/far，定义正交投景（长方体）的区域');
console.log('全部可见：setOrtho(-1, 1, -1, 1, -1, 1)');
console.log('物体看起来更大：setOrtho(-0.5, 0.5, -0.5, 0.5, -1, 1)')
console.log('物体看起来更小：setOrtho(-2, 2, -2, 2, -1, 1)')
console.log('物体在屏幕中偏移：setOrtho(0, 2, -1, 1, -1, 1)')
console.log('')
console.log('透视投影：setPerspective(fov, aspect, near, far)');
console.log('fov/aspect/near/far，定义视野角、宽高比、z轴位置');
console.log('标准透视：fsetPerspective(45, 1.5, 0.1, 10)');
console.log('长焦效果（物体放大）：setPerspective(20, 1.5, 0.1, 10)');
console.log('广角效果（物体缩小）：setPerspective(80, 1.5, 0.1, 10)');
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=6)

### 基本变换（模型矩阵）

WebGL 的三种基础变换：平移、旋转、缩放。

**模型矩阵** = 平移矩阵 × （旋转矩阵 × 缩放矩阵）。

平移矩阵 T：

```javascript
// 平移 (tx, ty)
[
    1,  0,  tx,
    0,  1,  ty,
    0,  0,  1
]
```

旋转矩阵 R：

```javascript
// 旋转 angle 弧度（逆时针为正）
const c = Math.cos(angle);
const s = Math.sin(angle);
[
    c,  -s,  0,
    s,   c,  0,
    0,   0,  1
]
```

缩放矩阵 S：

```javascript
// 缩放 (sx, sy)
[
    sx,  0,   0,
    0,   sy,  0,
    0,   0,   1
]
```

组合矩阵：先缩放 → 再旋转 → 最后平移。

```javascript
// 缩放矩阵 S
[ sx, 0, 0 ]
[ 0, sy, 0 ]
[ 0, 0, 1 ]

// 旋转 × 缩放 = R × S
[ c, -s, 0 ]   [ sx, 0, 0 ]   [ c*sx, -s*sy, 0 ]
[ s,  c, 0 ] × [ 0, sy, 0 ] = [ s*sx,  c*sy, 0 ]
[ 0,  0, 1 ]   [ 0,  0, 1 ]   [   0,     0,  1 ]

// 平移 × (旋转×缩放) = T × (R × S)
[ 1, 0, tx ]   [ c*sx, -s*sy, 0 ]   [ c*sx, -s*sy, tx ]
[ 0, 1, ty ] × [ s*sx,  c*sy, 0 ] = [ s*sx,  c*sy, ty ]
[ 0, 0, 1  ]   [   0,     0,  1 ]   [   0,     0,  1 ]

// 最终组合矩阵
[
    c*sx,   -s*sy,   tx,
    s*sx,    c*sy,   ty,
    0,       0,      1
]
```

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib } from './webGL.js';
const { gl, canvas } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
  -0.3,  0.3,  1.0, 0.0, 0.0,
  0.3,  0.3,  0.0, 1.0, 0.0,
  -0.3, -0.3,  0.0, 0.0, 1.0,

  0.3,  0.3,  0.0, 1.0, 0.0,
  0.3, -0.3,  1.0, 1.0, 0.0,
  -0.3, -0.3,  0.0, 0.0, 1.0
]);

const transformVS = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform mat3 u_matrix;

  void main() {
    v_color = a_color;
    vec3 pos = u_matrix * vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  varying vec3 v_color;
  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;

const program = createProgram(gl, transformVS, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 20, 0);
bindAttrib(gl, 'a_color', 3, 20, 8);

const u_matrix = gl.getUniformLocation(program, 'u_matrix');

let translateX = 0, translateY = 0, scale = 1, rotateAngle = 0;

function buildMatrix(tx, ty, angle, s) {
  const c = Math.cos(angle);
  const sn = Math.sin(angle);
  return new Float32Array([
    s * c,   s * sn, 0,
    -s * sn, s * c,  0,
    tx,      ty,     1
  ]);
}

function updateMatrix() {
  gl.uniformMatrix3fv(u_matrix, false, buildMatrix(translateX, translateY, rotateAngle, scale));
}

document.getElementById('tx').oninput = (e) => {
  translateX = parseFloat(e.target.value);
  document.getElementById('txVal').textContent = translateX.toFixed(2);
  updateMatrix();
};
document.getElementById('ty').oninput = (e) => {
  translateY = parseFloat(e.target.value);
  document.getElementById('tyVal').textContent = translateY.toFixed(2);
  updateMatrix();
};
document.getElementById('scale').oninput = (e) => {
  scale = parseFloat(e.target.value);
  document.getElementById('scaleVal').textContent = scale.toFixed(2);
  updateMatrix();
};

let lastX = 0, isDragging = false;
canvas.onmousedown = (e) => {
  isDragging = true;
  lastX = e.clientX;
};
window.onmousemove = (e) => {
  if (!isDragging) return;
  rotateAngle += (e.clientX - lastX) * 0.01;
  lastX = e.clientX;
  updateMatrix();
};
window.onmouseup = () => {
  isDragging = false;
};

updateMatrix();
gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.enable(gl.DEPTH_TEST);

function animate() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(animate);
}
animate();
```

### 用户交互

WebGL 本身不处理交互，交互是通过 **JavaScript 事件监听 + 修改着色器变量** 来实现的。

```javascript
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
  0.0,  0.6,  1.0, 0.0, 0.0,  // 顶点0: 上，红色
  -0.6, -0.4,  0.0, 1.0, 0.0,  // 顶点1: 左下，绿色
  0.6, -0.4,  0.0, 0.0, 1.0   // 顶点2: 右下，蓝色
]);

// 带旋转的顶点着色器
const rotateVS = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;
  uniform float u_angle;

  void main() {
    v_color = a_color;

    float c = cos(u_angle);
    float s = sin(u_angle);
    float x = a_position.x;
    float y = a_position.y;

    float x2 = x * c - y * s;
    float y2 = x * s + y * c;

    gl_Position = vec4(x2, y2, 0.0, 1.0);
  }
`;

const program = createProgram(gl, rotateVS, fsSource);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 20, 0);
bindAttrib(gl, 'a_color', 3, 20, 8);

const u_angle = gl.getUniformLocation(program, 'u_angle');
let angle = 0;
gl.uniform1f(u_angle, angle);

let lastX = 0;
let isDragging = false;
gl.canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - lastX;
    angle += dx * 0.01;
    lastX = e.clientX;

    gl.uniform1f(u_angle, angle);
  };
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);

function animate() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(animate);
}

animate();
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=7)

### 纹理

纹理就是把一张图片“贴”到图形表面。

**核心概念**：

* 纹理坐标：每个顶点对应图片上的位置 (s, t)，范围 0~1。
* 纹理采样：片元着色器根据坐标从纹理中取颜色。
* 纹理对象：GPU 中存储图片数据的内存区域。

**webGL 纹理方法**：

* `gl.createTexture()`：创建一个纹理对象，相当于在 GPU 中申请一块内存空间。

* `gl.bindTexture(target, texture)`：将纹理绑定到指定的目标上，后续的纹理操作都作用于这个纹理。

  * `target`：`gl.TEXTURE_2D`—2D 纹理、`gl.TEXTURE_CUBE_MAP`—立方体纹理（环境贴图）。
  * `texture`：纹理对象，即要绑定的纹理。

* `gl.texImage2D(target, level, internalformat, width, height, border, format, type, source)`：将图像数据上传到绑定的纹理中。当传图片、画布时，可省略 `width/height/border`，由 API 自动读取尺寸。

  * `target`：纹理类型。
  * `level`：Mipmap 层级。0=原图基础层（不设 mipmap），1/2/3… 对应各级缩小的 mip 贴图。
  * `internalFormat`：GPU 显存里存放像素的格式。有 `gl.RGBA`、`gl.RGB`、`gl.ALPHA`、`gl.LUMINANCE` 等。
  * `width`：纹理宽度（图片宽度）。
  * `height`：纹理高度（图片高度）。
  * `border`：边框宽度。WebGL1 强制只能传 **0**，传其他值报错。
  * `format`：像素数据格式，和 `internalformat` 尽量匹配。
  * `type`：像素数据类型。`gl.UNSIGNED_BYTE`—图片、canvas、Image 通用（0~255），其他还有 `FLOAT`、`UNSIGNED_SHORT_5_6_5` 等。
  * `source/pixels`：数据源。支持多种类型：`Image`、`HTMLCanvasElement`、`HTMLVideoElement`、`Uint8Array` 像素数组。

* `gl.texParameteri(target, pname, param)`：设置纹理的采样参数，控制纹理如何被读取。

  * `target`：纹理类型。

  * `pname`：参数名，即要修改的配置项。

  * `param 配置值`：对应上面 `pname` 的规则常量，整数标识。

    | pname 参数                     | 可选参数值 (param)                                           | 作用说明             |
    | ------------------------------ | ------------------------------------------------------------ | -------------------- |
    | TEXTURE_WRAP_S、TEXTURE_WRAP_T | REPEAT                                                       | 重复平铺（默认）     |
    |                                | CLAMP_TO_EDGE                                                | 拉伸边缘，不重复     |
    |                                | MIRRORED_REPEAT                                              | 镜像平铺             |
    | TEXTURE_MAG_FILTER             | NEAREST                                                      | 邻近采样，颗粒锐利   |
    |                                | LINEAR                                                       | 线性平滑，无锯齿     |
    | TEXTURE_MIN_FILTER             | NEAREST / LINEAR                                             | 普通缩小采样         |
    |                                | NEAREST_MIPMAP_NEAREST、<br />NEAREST_MIPMAP_LINEAR、<br />LINEAR_MIPMAP_NEAREST、<br />LINEAR_MIPMAP_LINEAR | 开启 Mipmap 多级过滤 |

*  `gl.activeTexture(unit)`：激活指定的纹理单元。WebGL 支持多个纹理同时使用。`unit` 取值：`gl.TEXTURE0`、`gl.TEXTURE1`、`gl.TEXTURE2` ……，最大纹理单元数量，用 `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)` 获取。
* `texture2D(sampler, coord)`（着色器函数）：在片元着色器中从纹理采样颜色。`sampler`—纹理采样器变量、`coord`—纹理坐标 (s, t)，范围 0~1。

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);
const vertices = new Float32Array([
  // 位置(x,y)    纹理坐标(s,t)
  // 注意：Canvas 和 WebGL 的纹理坐标 Y 轴方向是相反的
   0.0,  0.5,     0.5, 0.0,  // 顶点A：t 从 1.0 改为 0.0
  -0.5, -0.5,     0.0, 1.0,  // 顶点B：t 从 0.0 改为 1.0
   0.5, -0.5,     1.0, 1.0   // 顶点C：t 从 0.0 改为 1.0
]);

function createTexture(gl) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const size = 32;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#ff6b6b' : '#4ecdc4';
      ctx.fillRect(x * size, y * size, size, size);
    }
  }
  ctx.fillStyle = 'white';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WebGL 纹理', 128, 200);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return texture;
}

const texture = createTexture(gl);
const vsTexture = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
  }
`;

const fsTexture = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_texture;

  void main() {
      gl_FragColor = texture2D(u_texture, v_texCoord);
  }
`;

const program = createProgram(gl, vsTexture, fsTexture);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 16, 0);
bindAttrib(gl, 'a_texCoord', 2, 16, 8);

const u_texture = gl.getUniformLocation(program, 'u_texture');
gl.uniform1i(u_texture, 0);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);

gl.clearColor(0.1, 0.1, 0.2, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=8)

### 模拟灯光

WebGL 本身**没有内置光照系统**，所有灯光效果都是在着色器中用数学公式模拟：

- JS 把光源数据（位置、颜色、强度等）通过 `uniform` 传给着色器；
- 在片元着色器（主流）/ 顶点着色器中，结合**法线、视线、光线方向**，套用光照模型计算像素亮度；
- 叠加环境光、漫反射、高光得到最终物体颜色。

#### 光照模型

**光照模型**是计算机图形学中**计算物体表面颜色的一套数学公式和算法**，它模拟光线与物体表面相互作用的方式，让 3D 物体看起来有立体感和真实感。

**一个完整的光照模型通常包含**：

* **环境光（Ambient）**：光线均匀铺满整个场景，无方向、无阴影，物体所有面亮度一致。
* **漫反射（Diffuse）**：根据表面朝向产生明暗。
* **镜面反射（Specular）**：产生高光亮点。
* 自发光（Emissive）：物体自己发光。

**常见光照模型**：

* **Lambert**：漫反射。最简单，表面粗糙。
* **Phong**：环境光 + 漫反射 + 镜面反射。有高光，效果好。
* **Blinn-Phong**（最常用）：环境光 + 漫反射 + 镜面反射。Phong 的优化版，更快。
* **PBR**：物理精确计算。真实感最强。

**Lambert（漫反射）核心公式**：

```shell
diffuse = max(dot(N, L), 0.0) * lightColor
```

**Blinn-Phong（最常用）核心公式**：

```shell
# 环境光
ambient = ambientColor * baseColor

# 漫反射
diffuse = max(dot(N, L), 0.0) * lightColor * baseColor

# 镜面反射
halfDir = normalize(L + V)
specular = pow(max(dot(N, halfDir), 0.0), shininess) * specularColor

# 最终颜色
finalColor = ambient + diffuse + specular
```

**光照模型参数**：

* 灯光参数：位置/方向、颜色、强度，用于控制光源属性。
* 材质参数：环境色、漫反射色、镜面反射色、光泽度，用于控制物体表面属性。
* 环境参数：环境光颜色、环境光强度，用于控制整体亮度。
* **计算参数**：法线、视线方向、半向量。

#### 光照计算的关键向量

* 光源方向 L（Light Direction）：从物体表面指向光源的单位方向向量（**单位向量**是长度为 **1** 的向量）。
* 法线方向 N（Normal）：垂直于物体表面的单位方向向量。
* 视线方向 V（View Direction）：从物体表面指向观察者（相机）的单位方向向量。
* 反射方向 R（Reflection Direction）：光线经过表面反射后的方向。
* 半向量 H（Halfway Vector）：L 和 V 的中间方向。

```javascript
// 光源方向 L
L = normalize(lightPos - vertexPos)

// 视线方向 V
V = normalize(cameraPos - vertexPos)

// 反射方向 R
R = 2 * dot(N, L) * N - L

// 半向量 H
H = normalize(L + V)
```

#### 着色器参数

```glsl
// 灯光参数
uniform vec3 u_lightDirection;   // 平行光方向
uniform vec3 u_lightColor;       // 光源颜色
uniform float u_lightIntensity;  // 光源强度

// 材质参数
uniform vec3 u_ambientColor;     // 环境光颜色
uniform vec3 u_diffuseColor;     // 漫反射颜色（物体颜色）
uniform vec3 u_specularColor;    // 镜面反射颜色
uniform float u_shininess;       // 光泽度

// 环境参数
uniform vec3 u_ambientLight;     // 环境光强度（通常与材质环境色合并）

// 计算参数（由顶点着色器传递）
varying vec3 v_normal;           // 法线
varying vec3 v_worldPos;         // 世界空间位置
varying vec3 v_viewDir;          // 视线方向
```

#### 简单示例

```javascript
import { createWebGLContext, createProgram, createBuffer, bindAttrib } from './webGL.js';
const { gl } = createWebGLContext(window.innerWidth, window.innerHeight);

// 顶点数据：位置 (x,y) + 法线 (nx,ny)
const vertices = new Float32Array([
  // 顶点 A (上)     法线方向 (指向左上)
  0.0,  0.5,      -0.5,  0.5,
  // 顶点 B (左下)   法线方向 (指向左下)
  -0.5, -0.5,      -0.5, -0.5,
  // 顶点 C (右下)   法线方向 (指向右下)
  0.5, -0.5,       0.5, -0.5
]);

// 着色器
const vsLight = `
  attribute vec2 a_position;
  attribute vec2 a_normal;
  varying vec3 v_normal;
  varying vec3 v_color;

  void main() {
    v_normal = normalize(vec3(a_normal, 0.0));
    gl_Position = vec4(a_position, 0.0, 1.0);

    // 顶点颜色：红、绿、蓝
    vec3 colorA = vec3(1.0, 0.2, 0.2);
    vec3 colorB = vec3(0.2, 1.0, 0.2);
    vec3 colorC = vec3(0.2, 0.2, 1.0);

    if (a_position.y > 0.0) {
      v_color = colorA;
    } else if (a_position.x < 0.0) {
      v_color = colorB;
    } else {
      v_color = colorC;
    }
  }
`;

const fsLight = `
  precision mediump float;
  varying vec3 v_normal;
  varying vec3 v_color;
  uniform vec3 u_lightDir;
  uniform vec3 u_ambientColor;
  uniform float u_enableLight;

  void main() {
    vec3 baseColor = v_color;
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_lightDir);

    // 环境光
    vec3 ambient = u_ambientColor * baseColor * 0.3;

    // 漫反射
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * baseColor * 0.8;

    // 开关：1=有灯光，0=无灯光
    vec3 withLight = ambient + diffuse;
    vec3 withoutLight = baseColor * 0.5;

    vec3 finalColor = mix(withoutLight, withLight, u_enableLight);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const program = createProgram(gl, vsLight, fsLight);
createBuffer(gl, vertices);
bindAttrib(gl, 'a_position', 2, 16, 0);
bindAttrib(gl, 'a_normal', 2, 16, 8);

const u_lightDir = gl.getUniformLocation(program, 'u_lightDir');
const u_ambientColor = gl.getUniformLocation(program, 'u_ambientColor');
const u_enableLight = gl.getUniformLocation(program, 'u_enableLight');

let enableLight = 1;
// 灯光方向（向量指向光源）
const lightDir = [0.5, 0.8, 0.0];
const ambientColor = [0.3, 0.3, 0.3];
gl.uniform3fv(u_lightDir, lightDir);
gl.uniform3fv(u_ambientColor, ambientColor);
gl.uniform1f(u_enableLight, enableLight);

function draw() {
  gl.clearColor(0.1, 0.1, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function setLightDir (x, y, z) {
  const dir = [
    x !== undefined ? x : lightDir[0],
    y !== undefined ? y : lightDir[1],
    z !== undefined ? z : lightDir[2]
  ];
  gl.uniform3fv(u_lightDir, dir);
  draw();
  console.log('灯光方向:', dir);
}

function toggleLight () {
  enableLight = enableLight === 1 ? 0 : 1;
  gl.uniform1f(u_enableLight, enableLight);
  draw();
  console.log('灯光:', enableLight ? '开' : '关');
}

function setAmbient (r, g, b) {
  gl.uniform3fv(u_ambientColor, [r, g, b]);
  draw();
  console.log('环境光:', [r, g, b]);
}

draw();
window.setLightDir = setLightDir
window.toggleLight = toggleLight
window.setAmbient = setAmbient

console.log('可用命令:');
console.log('toggleLight() - 开关灯光');
console.log('setLightDir(x, y, z) - 改变灯光方向');
console.log('setAmbient(r, g, b) - 改变环境光颜色');
console.log('灯光方向示例:');
console.log('setLightDir(1, 0, 0)   - 从右照射');
console.log('setLightDir(0, 1, 0)   - 从上照射');
console.log('setLightDir(1, 1, 0)   - 从右上照射');
console.log('setLightDir(-1, 0, 0)  - 从左照射');
console.log('setLightDir(0, -1, 0)  - 从下照射');
console.log('setLightDir(1, 0.5, 0) - 右偏上照射');
console.log('调整环境光颜色示例:');
console.log('setAmbient(0.5, 0.3, 0.3) - 暖色环境光');
console.log('setAmbient(0.3, 0.3, 0.5) - 冷色环境光');
```

[查看 demo](https://1927344728.github.io/demo-lizh/html/26-webGL.html?order=9)

### 知识扩展

#### Three.js

Three.js 是一套**基于原生 WebGL 封装的 3D 图形 JavaScript 开源库**。

原生 WebGL API 底层极其繁琐，需要手动写着色器、管理缓冲区、矩阵、灯光、纹理、FBO 等大量底层代码；Three.js 把所有底层逻辑封装成简单易懂的面向对象 API，让开发者不用手写 GLSL、不用手动计算投影 / 视图矩阵，快速在网页渲染 3D 场景。

#### Spector.js（调试工具）

Spector.js 是 **BabylonJS 团队开源**、**引擎无关**的 WebGL/WebGL2 帧捕获调试工具，专门拆解网页 3D 渲染的完整一帧执行流程，用来排查贴图黑屏、着色器报错、绘制异常、性能瓶颈、FBO / 纹理 / 缓冲区错误等问题 SpectorJS。

**核心能力**：捕获单帧内**所有 WebGL API 调用**，完整还原渲染执行顺序，可视化每一步状态。

### 参考资料

[WebGL 理论基础](https://webglfundamentals.org/webgl/lessons/zh_cn/)

[WebGL_API](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)